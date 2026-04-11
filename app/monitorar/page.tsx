"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Play,
  Pause,
  Square,
  MapPin,
  Clock,
  Flame,
  Footprints,
  Navigation,
  Check,
} from "lucide-react";
import Link from "next/link";

/* ------------------------------------------------------------------
   Types
------------------------------------------------------------------- */
type ActivityType = "walking" | "running" | "cycling";
type Phase = "select" | "tracking" | "summary";

interface GpsPoint {
  lat: number;
  lng: number;
  timestamp: number;
}

/* ------------------------------------------------------------------
   Helpers
------------------------------------------------------------------- */
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function formatPace(distanceKm: number, seconds: number): string {
  if (distanceKm <= 0) return "--:--";
  const paceSeconds = seconds / distanceKm;
  const m = Math.floor(paceSeconds / 60);
  const s = Math.floor(paceSeconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const CAL_PER_MIN: Record<ActivityType, number> = {
  walking: 4,
  running: 10,
  cycling: 7,
};

const STEPS_PER_KM: Record<ActivityType, number> = {
  walking: 1300,
  running: 1100,
  cycling: 0,
};

const ACTIVITY_CONFIG: Record<
  ActivityType,
  { emoji: string; label: string; desc: string }
> = {
  walking: { emoji: "\u{1F6B6}", label: "Caminhada", desc: "Ritmo moderado" },
  running: { emoji: "\u{1F3C3}", label: "Corrida", desc: "Ritmo acelerado" },
  cycling: { emoji: "\u{1F6B4}", label: "Ciclismo", desc: "Pedalada livre" },
};

/* ------------------------------------------------------------------
   RouteMap (SVG)
------------------------------------------------------------------- */
function RouteMap({
  positions,
  width,
  height,
  showPulse = true,
}: {
  positions: GpsPoint[];
  width: number;
  height: number;
  showPulse?: boolean;
}) {
  if (positions.length < 2) {
    return (
      <div
        className="flex items-center justify-center gap-2"
        style={{ width, height, color: "#5F6368" }}
      >
        <Navigation size={20} />
        <span className="text-sm">Rastreando sua rota...</span>
      </div>
    );
  }

  const lats = positions.map((p) => p.lat);
  const lngs = positions.map((p) => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const padding = 30;

  const points = positions
    .map((p) => {
      const x =
        padding +
        ((p.lng - minLng) / (maxLng - minLng || 0.0001)) *
          (width - 2 * padding);
      const y =
        padding +
        ((maxLat - p.lat) / (maxLat - minLat || 0.0001)) *
          (height - 2 * padding);
      return `${x},${y}`;
    })
    .join(" ");

  const lastPos = positions[positions.length - 1];
  const lastX =
    padding +
    ((lastPos.lng - minLng) / (maxLng - minLng || 0.0001)) *
      (width - 2 * padding);
  const lastY =
    padding +
    ((maxLat - lastPos.lat) / (maxLat - minLat || 0.0001)) *
      (height - 2 * padding);

  // Start point
  const firstPos = positions[0];
  const firstX =
    padding +
    ((firstPos.lng - minLng) / (maxLng - minLng || 0.0001)) *
      (width - 2 * padding);
  const firstY =
    padding +
    ((maxLat - firstPos.lat) / (maxLat - minLat || 0.0001)) *
      (height - 2 * padding);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="mx-auto"
    >
      {/* Route path */}
      <polyline
        points={points}
        fill="none"
        stroke="#1A73E8"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Start marker */}
      <circle cx={firstX} cy={firstY} r="5" fill="#34A853" />
      {/* Current position */}
      {showPulse && (
        <circle cx={lastX} cy={lastY} r="12" fill="#1A73E8" opacity="0.2">
          <animate
            attributeName="r"
            from="8"
            to="16"
            dur="1.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            from="0.3"
            to="0"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
      )}
      <circle cx={lastX} cy={lastY} r="6" fill="#1A73E8" />
    </svg>
  );
}

/* ------------------------------------------------------------------
   Main Page
------------------------------------------------------------------- */
export default function MonitorarPage() {
  const [phase, setPhase] = useState<Phase>("select");
  const [activityType, setActivityType] = useState<ActivityType>("walking");
  const [paused, setPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [distance, setDistance] = useState(0);
  const [positions, setPositions] = useState<GpsPoint[]>([]);
  const [currentPosition, setCurrentPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const watchIdRef = useRef<number | null>(null);
  const lastPositionRef = useRef<GpsPoint | null>(null);

  const calories = Math.round(
    CAL_PER_MIN[activityType] * (elapsedSeconds / 60)
  );
  const steps = Math.round(STEPS_PER_KM[activityType] * distance);
  const pace = formatPace(distance, elapsedSeconds);
  const pointsEarned = Math.round(distance * 10 + elapsedSeconds / 60);

  /* ---- Timer ---- */
  useEffect(() => {
    if (phase === "tracking" && !paused) {
      const interval = setInterval(
        () => setElapsedSeconds((s) => s + 1),
        1000
      );
      return () => clearInterval(interval);
    }
  }, [phase, paused]);

  /* ---- GPS Watcher ---- */
  const startGps = useCallback(() => {
    if (!("geolocation" in navigator)) return;

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const newPoint: GpsPoint = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timestamp: Date.now(),
        };
        setCurrentPosition({ lat: newPoint.lat, lng: newPoint.lng });

        const last = lastPositionRef.current;
        if (last) {
          const d = haversineDistance(
            last.lat,
            last.lng,
            newPoint.lat,
            newPoint.lng
          );
          // filter GPS noise: ignore if < 3m
          if (d < 0.003) return;
          setDistance((prev) => prev + d);
        }

        lastPositionRef.current = newPoint;
        setPositions((prev) => [...prev, newPoint]);
      },
      (err) => console.error("GPS error:", err),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    watchIdRef.current = id;
  }, []);

  const stopGps = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  /* ---- Actions ---- */
  const handleStart = () => {
    setPhase("tracking");
    setPaused(false);
    setElapsedSeconds(0);
    setDistance(0);
    setPositions([]);
    setCurrentPosition(null);
    lastPositionRef.current = null;
    startGps();
  };

  const handlePauseToggle = () => {
    setPaused((p) => !p);
  };

  const handleStop = () => {
    stopGps();
    setPhase("summary");
  };

  const handleSave = () => {
    // TODO: persist workout data
    setPhase("select");
  };

  const handleDiscard = () => {
    setPhase("select");
  };

  // Cleanup GPS on unmount
  useEffect(() => {
    return () => stopGps();
  }, [stopGps]);

  /* ---- Animation variants ---- */
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const fadeUp: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  /* ================================================================
     RENDER: Activity Selection
  ================================================================ */
  if (phase === "select") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-2">
          <Link href="/home" className="p-1">
            <ChevronLeft size={24} color="#202124" />
          </Link>
          <h1
            className="text-lg font-semibold"
            style={{ color: "#202124" }}
          >
            Monitorar Treino
          </h1>
        </div>

        {/* Activity cards */}
        <motion.div
          className="flex-1 px-4 pt-4 flex flex-col gap-3"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {(["walking", "running", "cycling"] as ActivityType[]).map(
            (type) => {
              const cfg = ACTIVITY_CONFIG[type];
              const selected = activityType === type;
              return (
                <motion.button
                  key={type}
                  variants={fadeUp}
                  onClick={() => setActivityType(type)}
                  className="flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left"
                  style={{
                    borderColor: selected ? "#1A73E8" : "#DADCE0",
                    backgroundColor: selected ? "#E8F0FE" : "#FFFFFF",
                  }}
                >
                  <span className="text-3xl">{cfg.emoji}</span>
                  <div>
                    <p
                      className="font-semibold text-base"
                      style={{
                        color: selected ? "#1A73E8" : "#202124",
                      }}
                    >
                      {cfg.label}
                    </p>
                    <p className="text-sm" style={{ color: "#5F6368" }}>
                      {cfg.desc}
                    </p>
                  </div>
                </motion.button>
              );
            }
          )}
        </motion.div>

        {/* Start button */}
        <div className="flex justify-center py-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
            style={{ backgroundColor: "#1A73E8" }}
          >
            <Play size={32} color="#FFFFFF" fill="#FFFFFF" />
          </motion.button>
        </div>
      </div>
    );
  }

  /* ================================================================
     RENDER: Tracking
  ================================================================ */
  if (phase === "tracking") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Map area */}
        <div
          className="relative flex items-center justify-center"
          style={{
            height: "45vh",
            backgroundColor: "#F1F3F4",
          }}
        >
          {/* Activity badge */}
          <div
            className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
            style={{
              backgroundColor: "#FFFFFF",
              color: "#1A73E8",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}
          >
            <span>{ACTIVITY_CONFIG[activityType].emoji}</span>
            <span>{ACTIVITY_CONFIG[activityType].label}</span>
          </div>

          {/* Paused overlay */}
          {paused && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
              <span
                className="text-lg font-semibold px-6 py-2 rounded-full"
                style={{ backgroundColor: "#FFFFFF", color: "#202124" }}
              >
                Pausado
              </span>
            </div>
          )}

          <RouteMap
            positions={positions}
            width={360}
            height={Math.round(window?.innerHeight * 0.42) || 320}
            showPulse={!paused}
          />
        </div>

        {/* Stats panel */}
        <div className="flex-1 flex flex-col px-4 pt-4">
          {/* Timer */}
          <motion.p
            key={elapsedSeconds}
            className="text-center font-mono text-4xl font-bold tracking-wider"
            style={{ color: "#202124" }}
          >
            {formatTime(elapsedSeconds)}
          </motion.p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 mt-5">
            {[
              {
                icon: <MapPin size={18} color="#1A73E8" />,
                value: distance.toFixed(2),
                unit: "km",
                label: "Distancia",
              },
              {
                icon: <Flame size={18} color="#EA4335" />,
                value: calories.toString(),
                unit: "cal",
                label: "Calorias",
              },
              {
                icon: <Footprints size={18} color="#34A853" />,
                value:
                  steps >= 1000
                    ? `${(steps / 1000).toFixed(1)}k`
                    : steps.toString(),
                unit: "",
                label: "Passos",
              },
              {
                icon: <Clock size={18} color="#FBBC04" />,
                value: pace,
                unit: "min/km",
                label: "Ritmo",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center py-4 rounded-xl"
                style={{
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  border: "1px solid #F1F3F4",
                }}
              >
                <div className="mb-1">{stat.icon}</div>
                <p
                  className="text-2xl font-bold font-mono"
                  style={{ color: "#202124" }}
                >
                  {stat.value}
                  {stat.unit && (
                    <span
                      className="text-xs font-normal ml-0.5"
                      style={{ color: "#5F6368" }}
                    >
                      {stat.unit}
                    </span>
                  )}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#5F6368" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex justify-center items-center gap-8 py-6">
          {/* Pause / Resume */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handlePauseToggle}
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-md"
            style={{
              backgroundColor: paused ? "#1A73E8" : "#F9AB00",
            }}
          >
            {paused ? (
              <Play size={26} color="#FFFFFF" fill="#FFFFFF" />
            ) : (
              <Pause size={26} color="#FFFFFF" />
            )}
          </motion.button>

          {/* Stop */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleStop}
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-md"
            style={{ backgroundColor: "#EA4335" }}
          >
            <Square size={24} color="#FFFFFF" fill="#FFFFFF" />
          </motion.button>
        </div>
      </div>
    );
  }

  /* ================================================================
     RENDER: Summary
  ================================================================ */
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-white flex flex-col"
      >
        {/* Header */}
        <div className="flex flex-col items-center pt-8 pb-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
            style={{ backgroundColor: "#E6F4EA" }}
          >
            <Check size={28} color="#34A853" />
          </div>
          <h1
            className="text-xl font-bold"
            style={{ color: "#202124" }}
          >
            Treino concluido!
          </h1>
          <p className="text-sm mt-1" style={{ color: "#5F6368" }}>
            {ACTIVITY_CONFIG[activityType].emoji}{" "}
            {ACTIVITY_CONFIG[activityType].label}
          </p>
        </div>

        {/* Map */}
        <div
          className="mx-4 rounded-2xl flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: "#F1F3F4", minHeight: 200 }}
        >
          <RouteMap
            positions={positions}
            width={340}
            height={200}
            showPulse={false}
          />
        </div>

        {/* Stats summary */}
        <div className="px-4 mt-5 grid grid-cols-2 gap-3">
          {[
            {
              label: "Duracao",
              value: formatTime(elapsedSeconds),
              icon: <Clock size={16} color="#1A73E8" />,
            },
            {
              label: "Distancia",
              value: `${distance.toFixed(2)} km`,
              icon: <MapPin size={16} color="#1A73E8" />,
            },
            {
              label: "Calorias",
              value: `${calories} cal`,
              icon: <Flame size={16} color="#EA4335" />,
            },
            {
              label: "Passos",
              value: steps.toLocaleString("pt-BR"),
              icon: <Footprints size={16} color="#34A853" />,
            },
            {
              label: "Ritmo medio",
              value: `${pace} min/km`,
              icon: <Navigation size={16} color="#FBBC04" />,
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-4 rounded-xl ${
                i === 4 ? "col-span-2" : ""
              }`}
              style={{
                backgroundColor: "#F8F9FA",
                border: "1px solid #F1F3F4",
              }}
            >
              {stat.icon}
              <div>
                <p className="text-xs" style={{ color: "#5F6368" }}>
                  {stat.label}
                </p>
                <p
                  className="text-base font-bold font-mono"
                  style={{ color: "#202124" }}
                >
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Points earned */}
        <div className="flex justify-center mt-5">
          <div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full"
            style={{ backgroundColor: "#E8F0FE" }}
          >
            <span className="text-lg">+{pointsEarned}</span>
            <span
              className="text-sm font-semibold"
              style={{ color: "#1A73E8" }}
            >
              pts
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col items-center gap-3 px-4 py-6 mt-auto">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            className="w-full py-3.5 rounded-full text-white font-semibold text-base"
            style={{ backgroundColor: "#1A73E8" }}
          >
            Salvar treino
          </motion.button>
          <button
            onClick={handleDiscard}
            className="text-sm font-medium py-2"
            style={{ color: "#5F6368" }}
          >
            Descartar
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
