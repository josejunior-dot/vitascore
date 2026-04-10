"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Scale,
  Camera,
  PenLine,
  TrendingDown,
  TrendingUp,
  Minus,
  Shield,
  AlertTriangle,
  Target,
  Ruler,
  Bell,
  Calendar,
  Clock,
  Flame,
} from "lucide-react";
import Link from "next/link";

import AppShell from "@/components/layout/AppShell";
import {
  WeightMonitor,
  type WeightProfile,
  type WeightAnalysis,
} from "@/lib/health/weight-monitor";

/* eslint-disable @typescript-eslint/no-explicit-any */
const sectionVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getBmiGlow(bmi: number): string {
  if (bmi === 0) return "rgba(142,142,147,0.10)";
  if (bmi < 18.5) return "rgba(255,159,10,0.12)";
  if (bmi < 25) return "rgba(48,209,88,0.15)";
  if (bmi < 30) return "rgba(255,159,10,0.12)";
  return "rgba(255,69,58,0.15)";
}

function getBmiColor(bmi: number): string {
  if (bmi === 0) return "#8E8E93";
  if (bmi < 18.5) return "#FF9F0A";
  if (bmi < 25) return "#30D158";
  if (bmi < 30) return "#FF9F0A";
  return "#FF453A";
}

function getTrendIcon(trend: WeightAnalysis["trend"]) {
  if (trend === "losing") return TrendingDown;
  if (trend === "gaining") return TrendingUp;
  return Minus;
}

function getTrendColor(trend: WeightAnalysis["trend"]): string {
  if (trend === "losing") return "#30D158";
  if (trend === "gaining") return "#FF453A";
  return "#8E8E93";
}

function getBarColor(
  weight: number,
  targetBmi: number,
  heightCm: number,
): string {
  const bmi = WeightMonitor.calculateBmi(weight, heightCm);
  // If trending toward normal BMI => green, stable outside => amber, worsening => red
  if (bmi >= 18.5 && bmi < 25) return "#30D158";
  if (bmi >= 25 && bmi < 30) return "#FF9F0A";
  if (bmi < 18.5) return "#FF9F0A";
  return "#FF453A";
}

function getMethodIcon(method: string) {
  if (method === "photo_scale") return Camera;
  if (method === "health_connect") return Shield;
  return PenLine;
}

function getMethodColor(method: string): string {
  if (method === "photo_scale") return "#30D158";
  if (method === "health_connect") return "#0A84FF";
  return "#FF9F0A";
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

type SheetMode = "choose" | "photo" | "manual" | "setup" | "schedule";

export default function PesoPage() {
  const [profile, setProfile] = useState<WeightProfile | null>(null);
  const [analysis, setAnalysis] = useState<WeightAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSheet, setShowSheet] = useState(false);
  const [sheetMode, setSheetMode] = useState<SheetMode>("choose");
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [scaleReading, setScaleReading] = useState<{
    weightKg: number;
    confidence: number;
    flags: string[];
  } | null>(null);
  const [readingScale, setReadingScale] = useState(false);
  const [manualWeight, setManualWeight] = useState("");
  const [saving, setSaving] = useState(false);
  const [setupHeight, setSetupHeight] = useState("");
  const [setupTarget, setSetupTarget] = useState("");
  const [scheduleDay, setScheduleDay] = useState(1); // segunda
  const [scheduleHour, setScheduleHour] = useState("07");
  const [scheduleMinute, setScheduleMinute] = useState("00");
  const [scheduleStatus, setScheduleStatus] = useState<{
    scheduled: boolean; dayLabel: string; timeLabel: string;
    nextDate: string; daysUntilNext: number; streak: number;
  } | null>(null);
  const [weighDayStatus, setWeighDayStatus] = useState<{ isDay: boolean; status: string } | null>(null);

  // ---------------------------------------------------------------------------
  // Load on mount
  // ---------------------------------------------------------------------------

  useEffect(() => {
    (async () => {
      const p = await WeightMonitor.getProfile();
      setProfile(p);

      if (p.entries.length > 0) {
        const a = await WeightMonitor.getAnalysis();
        setAnalysis(a);
      }

      // Load schedule
      const ss = await WeightMonitor.getScheduleStatus();
      setScheduleStatus(ss);
      const wd = await WeightMonitor.isWeighDay();
      setWeighDayStatus(wd);

      // If default height (175) and no entries, show setup
      if (p.heightCm === 175 && p.entries.length === 0) {
        setSheetMode("setup");
        setShowSheet(true);
      }

      setLoading(false);
    })();
  }, []);

  // ---------------------------------------------------------------------------
  // Reload data
  // ---------------------------------------------------------------------------

  const reloadData = async () => {
    const p = await WeightMonitor.getProfile();
    setProfile(p);
    if (p.entries.length > 0) {
      const a = await WeightMonitor.getAnalysis();
      setAnalysis(a);
    }
  };

  // ---------------------------------------------------------------------------
  // Sheet reset
  // ---------------------------------------------------------------------------

  const resetSheet = () => {
    setShowSheet(false);
    setSheetMode("choose");
    setPhotoBase64(null);
    setScaleReading(null);
    setReadingScale(false);
    setManualWeight("");
    setSaving(false);
  };

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleSetupSave = async () => {
    const h = parseFloat(setupHeight);
    if (!h || h < 100 || h > 250) return;
    setSaving(true);
    const target = parseFloat(setupTarget);
    await WeightMonitor.saveProfile(h, isNaN(target) ? undefined : target);
    await reloadData();
    setSaving(false);
    resetSheet();
  };

  const handleCaptureScale = async () => {
    const result = await WeightMonitor.captureScalePhoto();
    if (!result) return;
    setPhotoBase64(result.base64);
    setReadingScale(true);

    const reading = await WeightMonitor.analyzeScalePhoto(result.base64);
    setScaleReading(reading);
    setReadingScale(false);
  };

  const handleSavePhoto = async () => {
    if (!scaleReading || !photoBase64) return;
    setSaving(true);
    await WeightMonitor.addEntry({
      weightKg: scaleReading.weightKg,
      method: "photo_scale",
      photoBase64,
      confidence: scaleReading.confidence,
      flags: scaleReading.flags,
    });
    await reloadData();
    resetSheet();
  };

  const handleSaveManual = async () => {
    const w = parseFloat(manualWeight);
    if (!w || w < 30 || w > 300) return;
    setSaving(true);
    await WeightMonitor.addEntry({
      weightKg: w,
      method: "manual",
    });
    await reloadData();
    resetSheet();
  };

  // ---------------------------------------------------------------------------
  // Derived values
  // ---------------------------------------------------------------------------

  const hasEntries = profile && profile.entries.length > 0;
  const latestEntry = hasEntries
    ? profile.entries[profile.entries.length - 1]
    : null;

  // Chart data
  const weeklyData = analysis?.weeklyData ?? [];
  const chartWeights = weeklyData.map((d) => d.weight);
  const chartMin = chartWeights.length > 0 ? Math.min(...chartWeights) - 1 : 0;
  const chartMax = chartWeights.length > 0 ? Math.max(...chartWeights) + 1 : 1;
  const chartRange = Math.max(chartMax - chartMin, 1);

  // BMI gauge position (0-100%)
  const currentBmi = analysis?.currentBmi ?? 0;
  // Map BMI 15-40 to 0-100% for the gauge
  const gaugePosition = Math.max(
    0,
    Math.min(100, ((currentBmi - 15) / (40 - 15)) * 100),
  );

  // Last 5 entries (newest first)
  const recentEntries = hasEntries
    ? [...profile.entries].reverse().slice(0, 5)
    : [];

  // Points for photo save
  const photoPoints = scaleReading
    ? Math.round((scaleReading.confidence / 100) * 30)
    : 0;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <AppShell>
      <div className="flex flex-col min-h-screen pb-36">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="sticky top-0 z-50 backdrop-blur-xl bg-black/70 border-b border-white/[0.06] px-4 py-4"
        >
          <div className="flex items-center gap-2">
            <Link href="/home" className="p-1 -ml-1">
              <ChevronLeft className="w-5 h-5 text-white/70" />
            </Link>
            <h1 className="text-lg font-semibold text-white">Peso</h1>
            <Scale className="w-4.5 h-4.5 text-white/40 ml-auto" />
          </div>
        </motion.header>

        <div className="flex flex-col gap-5 px-4 pt-6">
          {/* ========== LOADING STATE ========== */}
          {loading && (
            <div className="flex flex-col gap-5">
              <div
                className="rounded-2xl p-6 animate-pulse"
                style={{ backgroundColor: "#1C1C1E" }}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="h-16 w-32 bg-white/10 rounded-xl" />
                  <div className="h-5 w-24 bg-white/10 rounded-lg" />
                  <div className="h-3 w-40 bg-white/10 rounded-lg" />
                </div>
              </div>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl p-5 animate-pulse"
                  style={{ backgroundColor: "#1C1C1E" }}
                >
                  <div className="h-4 w-32 bg-white/10 rounded mb-3" />
                  <div className="h-24 w-full bg-white/10 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* ========== EMPTY STATE ========== */}
          {!loading && !hasEntries && (
            <motion.section
              custom={0}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center justify-center py-20 gap-4"
            >
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <Scale className="w-10 h-10 text-white/20" />
              </div>
              <p className="text-base font-semibold text-white/60">
                Registre sua primeira pesagem
              </p>
              <p className="text-xs text-white/30 text-center max-w-[260px]">
                Tire uma foto da balanca para ganhar mais pontos ou digite o peso
                manualmente
              </p>
            </motion.section>
          )}

          {/* ========== HERO CARD ========== */}
          {!loading && hasEntries && analysis && (
            <motion.section
              custom={0}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="relative rounded-2xl backdrop-blur-xl bg-white/5 border border-white/[0.08] p-6 overflow-hidden"
              style={{
                boxShadow: `0 0 40px ${getBmiGlow(analysis.currentBmi)}`,
              }}
            >
              {/* Glow */}
              <div
                className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 rounded-full blur-3xl pointer-events-none"
                style={{
                  backgroundColor: getBmiGlow(analysis.currentBmi),
                }}
              />

              <div className="relative flex flex-col items-center gap-2">
                {/* Weight */}
                <span className="font-mono-score text-5xl font-bold text-white leading-none">
                  {analysis.currentWeight.toFixed(1)}
                </span>
                <span className="text-sm text-white/40">kg</span>

                {/* BMI pill */}
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full mt-1"
                  style={{
                    color: analysis.bmiColor,
                    backgroundColor: `${analysis.bmiColor}20`,
                  }}
                >
                  IMC {analysis.currentBmi} · {analysis.bmiLabel}
                </span>

                {/* Trend */}
                <div className="flex items-center gap-1.5 mt-2">
                  {(() => {
                    const TrendIcon = getTrendIcon(analysis.trend);
                    const trendColor = getTrendColor(analysis.trend);
                    return (
                      <>
                        <TrendIcon
                          className="w-4 h-4"
                          style={{ color: trendColor }}
                        />
                        <span
                          className="text-sm font-medium"
                          style={{ color: trendColor }}
                        >
                          {analysis.trendLabel}
                        </span>
                      </>
                    );
                  })()}
                </div>

                {/* Trend detail */}
                {analysis.trendKgPerWeek !== 0 && (
                  <span className="text-xs text-white/40">
                    {analysis.trendKgPerWeek > 0 ? "+" : ""}
                    {analysis.trendKgPerWeek} kg/semana
                  </span>
                )}

                {/* Verification badge */}
                {latestEntry && (
                  <div className="flex items-center gap-1 mt-2">
                    {latestEntry.method === "photo_scale" ? (
                      <>
                        <Shield className="w-3.5 h-3.5 text-[#30D158]" />
                        <span className="text-[11px] text-[#30D158] font-medium">
                          Verificado
                        </span>
                      </>
                    ) : latestEntry.method === "health_connect" ? (
                      <>
                        <Shield className="w-3.5 h-3.5 text-[#0A84FF]" />
                        <span className="text-[11px] text-[#0A84FF] font-medium">
                          Health Connect
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-[#FF9F0A]" />
                        <span className="text-[11px] text-[#FF9F0A] font-medium">
                          Nao verificado
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </motion.section>
          )}

          {/* ========== GRAFICO DE EVOLUCAO ========== */}
          {!loading && hasEntries && weeklyData.length > 0 && (
            <motion.section
              custom={1}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-xs font-semibold text-white/50 mb-3 uppercase tracking-wider">
                Evolucao
              </h2>

              <div className="rounded-2xl bg-[#1C1C1E] border border-white/[0.08] p-5">
                {/* Chart */}
                <div className="relative">
                  {/* Target line */}
                  {profile?.targetWeightKg &&
                    profile.targetWeightKg >= chartMin &&
                    profile.targetWeightKg <= chartMax && (
                      <div
                        className="absolute left-0 right-0 border-t border-dashed border-white/20 z-10"
                        style={{
                          bottom: `${((profile.targetWeightKg - chartMin) / chartRange) * 100}%`,
                        }}
                      >
                        <span className="absolute -top-4 right-0 text-[9px] text-white/30 flex items-center gap-0.5">
                          <Target className="w-2.5 h-2.5" />
                          {profile.targetWeightKg}kg
                        </span>
                      </div>
                    )}

                  <div className="flex items-end justify-between gap-1.5 h-32">
                    {weeklyData.map((d, i) => {
                      const heightPct =
                        ((d.weight - chartMin) / chartRange) * 100;
                      const isLast = i === weeklyData.length - 1;
                      const barColor = getBarColor(
                        d.weight,
                        analysis?.currentBmi ?? 22,
                        profile?.heightCm ?? 175,
                      );

                      return (
                        <div
                          key={d.date}
                          className="flex-1 flex flex-col items-center justify-end h-full"
                        >
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{
                              height: `${Math.max(heightPct, 6)}%`,
                            }}
                            transition={{
                              duration: 0.6,
                              delay: i * 0.06,
                              ease: "easeOut",
                            }}
                            className="w-full max-w-[24px] rounded-t-md"
                            style={{
                              backgroundColor: isLast
                                ? barColor
                                : `${barColor}80`,
                            }}
                          />
                          <span
                            className={`text-[9px] mt-1.5 ${isLast ? "text-white/60 font-semibold" : "text-white/25"}`}
                          >
                            {d.date.slice(5).replace("-", "/")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* ========== BMI GAUGE ========== */}
          {!loading && hasEntries && analysis && (
            <motion.section
              custom={2}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-xs font-semibold text-white/50 mb-3 uppercase tracking-wider">
                Indice de Massa Corporal
              </h2>

              <div className="rounded-2xl bg-[#1C1C1E] border border-white/[0.08] p-5">
                {/* Current BMI large */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span
                    className="font-mono-score text-3xl font-bold"
                    style={{ color: analysis.bmiColor }}
                  >
                    {analysis.currentBmi}
                  </span>
                  <span className="text-sm text-white/40">IMC</span>
                </div>

                {/* Gauge bar */}
                <div className="relative">
                  <div className="flex rounded-full overflow-hidden h-3">
                    {/* Abaixo: 0-18.5 mapped to 0-14% of 15-40 range */}
                    <div
                      className="h-full"
                      style={{
                        width: `${((18.5 - 15) / 25) * 100}%`,
                        backgroundColor: "#FF9F0A",
                        opacity: 0.6,
                      }}
                    />
                    {/* Normal: 18.5-24.9 */}
                    <div
                      className="h-full"
                      style={{
                        width: `${((24.9 - 18.5) / 25) * 100}%`,
                        backgroundColor: "#30D158",
                        opacity: 0.6,
                      }}
                    />
                    {/* Sobrepeso: 25-29.9 */}
                    <div
                      className="h-full"
                      style={{
                        width: `${((29.9 - 24.9) / 25) * 100}%`,
                        backgroundColor: "#FF9F0A",
                        opacity: 0.6,
                      }}
                    />
                    {/* Obesidade: 30-40 */}
                    <div
                      className="h-full"
                      style={{
                        width: `${((40 - 29.9) / 25) * 100}%`,
                        backgroundColor: "#FF453A",
                        opacity: 0.6,
                      }}
                    />
                  </div>

                  {/* Pointer */}
                  <div
                    className="absolute -top-1 w-4 h-5 flex items-center justify-center transition-all duration-700"
                    style={{ left: `calc(${gaugePosition}% - 8px)` }}
                  >
                    <div
                      className="w-3 h-3 rounded-full border-2 border-white shadow-lg"
                      style={{ backgroundColor: analysis.bmiColor }}
                    />
                  </div>
                </div>

                {/* Labels */}
                <div className="flex justify-between mt-2">
                  <span className="text-[9px] text-[#FF9F0A]/60">Abaixo</span>
                  <span className="text-[9px] text-[#30D158]/60">Normal</span>
                  <span className="text-[9px] text-[#FF9F0A]/60">
                    Sobrepeso
                  </span>
                  <span className="text-[9px] text-[#FF453A]/60">
                    Obesidade
                  </span>
                </div>
              </div>
            </motion.section>
          )}

          {/* ========== HISTORICO ========== */}
          {!loading && hasEntries && (
            <motion.section
              custom={3}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-xs font-semibold text-white/50 mb-3 uppercase tracking-wider">
                Historico
              </h2>

              <div className="flex flex-col gap-2.5">
                {recentEntries.map((entry, i) => {
                  const MethodIcon = getMethodIcon(entry.method);
                  const methodColor = getMethodColor(entry.method);
                  const isPhoto = entry.method === "photo_scale";
                  const isManual = entry.method === "manual";
                  const dateStr = new Date(entry.timestamp).toLocaleDateString(
                    "pt-BR",
                    { day: "2-digit", month: "short" },
                  );
                  const timeStr = new Date(entry.timestamp).toLocaleTimeString(
                    "pt-BR",
                    { hour: "2-digit", minute: "2-digit" },
                  );

                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="rounded-2xl bg-[#1C1C1E] p-4 flex items-center gap-3"
                      style={{
                        borderLeft: `3px solid ${isPhoto ? "#30D158" : isManual ? "#FF9F0A" : "#0A84FF"}`,
                        border: `1px solid rgba(255,255,255,0.08)`,
                        borderLeftColor: isPhoto
                          ? "#30D158"
                          : isManual
                            ? "#FF9F0A"
                            : "#0A84FF",
                        borderLeftWidth: "3px",
                      }}
                    >
                      {/* Method icon */}
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${methodColor}15` }}
                      >
                        <MethodIcon
                          className="w-4 h-4"
                          style={{ color: methodColor }}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono-score text-lg font-bold text-white">
                            {entry.weightKg.toFixed(1)}
                          </span>
                          <span className="text-xs text-white/30">kg</span>
                          <span className="text-[10px] text-white/25 ml-auto">
                            IMC {entry.bmi}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-white/40">
                            {dateStr} · {timeStr}
                          </span>
                        </div>
                      </div>

                      {/* Points */}
                      <span className="text-xs font-semibold text-[#30D158] flex-shrink-0">
                        +{entry.points}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          )}
          {/* ========== AGENDAMENTO ========== */}
          {!loading && (
            <motion.section
              custom={4}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-xs font-semibold text-white/50 mb-3 uppercase tracking-wider">
                Pesagem Semanal
              </h2>

              {scheduleStatus?.scheduled ? (
                <div className="rounded-2xl bg-[#1C1C1E] border border-white/[0.08] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#1877F2]" />
                      <span className="text-sm font-medium text-white">
                        {scheduleStatus.dayLabel}s às {scheduleStatus.timeLabel}
                      </span>
                    </div>
                    <button
                      onClick={() => { setSheetMode("schedule"); setShowSheet(true); }}
                      className="text-xs text-[#1877F2]"
                    >
                      Editar
                    </button>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-white/50">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Próxima: {scheduleStatus.nextDate}
                    </span>
                    {scheduleStatus.streak > 0 && (
                      <span className="flex items-center gap-1 text-[#FF9F0A]">
                        <Flame className="w-3 h-3" />
                        {scheduleStatus.streak} sem. consecutivas
                      </span>
                    )}
                  </div>

                  {weighDayStatus?.isDay && (
                    <div className="mt-3 flex items-center gap-2 bg-[#1877F2]/10 border border-[#1877F2]/30 rounded-xl px-3 py-2">
                      <Bell className="w-4 h-4 text-[#1877F2]" />
                      <span className="text-xs text-[#1877F2] font-medium">
                        {weighDayStatus.status === "overdue" ? "Pesagem atrasada!" : "Hoje é dia de pesar!"}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => { setSheetMode("schedule"); setShowSheet(true); }}
                  className="w-full rounded-2xl bg-[#1C1C1E] border border-dashed border-white/20 p-4 flex items-center gap-3 transition-colors hover:bg-white/[0.06]"
                >
                  <Calendar className="w-5 h-5 text-white/30" />
                  <div className="text-left">
                    <p className="text-sm text-white/70">Agendar pesagem semanal</p>
                    <p className="text-xs text-white/30">Defina dia e horário fixo para pesar</p>
                  </div>
                </button>
              )}
            </motion.section>
          )}
        </div>

        {/* ========== CTA BUTTON ========== */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="fixed bottom-20 left-0 right-0 z-40 px-4 mx-auto max-w-md"
          >
            <button
              onClick={() => {
                setSheetMode("choose");
                setShowSheet(true);
              }}
              className="w-full py-4 rounded-2xl bg-[#30D158] text-white font-semibold text-base shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
            >
              <Scale className="w-5 h-5" />
              Registrar pesagem
            </button>
          </motion.div>
        )}

        {/* ========== BOTTOM SHEET ========== */}
        <AnimatePresence>
          {showSheet && (
            <>
              {/* Overlay */}
              <motion.div
                className="fixed inset-0 bg-black/60 z-[55]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={resetSheet}
              />

              {/* Sheet */}
              <motion.div
                className="fixed bottom-0 left-0 right-0 z-[60] mx-auto max-w-md max-h-[85vh] overflow-y-auto rounded-t-3xl px-5 pt-6 pb-10"
                style={{ backgroundColor: "#2C2C2E" }}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 300 }}
              >
                {/* Handle */}
                <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />

                {/* ===== MODE: SETUP ===== */}
                {sheetMode === "setup" && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      Configurar perfil
                    </h3>
                    <p className="text-xs text-white/40 mb-5">
                      Informe sua altura para calcular o IMC corretamente
                    </p>

                    {/* Height input */}
                    <div className="mb-4">
                      <label className="text-xs text-white/50 mb-2 block">
                        Altura (cm)
                      </label>
                      <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                        <Ruler className="w-4 h-4 text-white/30 flex-shrink-0" />
                        <input
                          type="number"
                          value={setupHeight}
                          onChange={(e) => setSetupHeight(e.target.value)}
                          placeholder="170"
                          min={100}
                          max={250}
                          className="flex-1 bg-transparent text-white text-sm placeholder:text-white/30 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-xs text-white/30">cm</span>
                      </div>
                    </div>

                    {/* Target weight input */}
                    <div className="mb-6">
                      <label className="text-xs text-white/50 mb-2 block">
                        Peso meta (opcional)
                      </label>
                      <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                        <Target className="w-4 h-4 text-white/30 flex-shrink-0" />
                        <input
                          type="number"
                          value={setupTarget}
                          onChange={(e) => setSetupTarget(e.target.value)}
                          placeholder="70"
                          min={30}
                          max={300}
                          step={0.1}
                          className="flex-1 bg-transparent text-white text-sm placeholder:text-white/30 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-xs text-white/30">kg</span>
                      </div>
                    </div>

                    {/* Save button */}
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-4 rounded-2xl bg-[#30D158] text-white font-semibold text-sm disabled:opacity-50"
                      onClick={handleSetupSave}
                      disabled={
                        saving ||
                        !setupHeight ||
                        parseFloat(setupHeight) < 100 ||
                        parseFloat(setupHeight) > 250
                      }
                    >
                      {saving ? "Salvando..." : "Salvar"}
                    </motion.button>
                  </div>
                )}

                {/* ===== MODE: CHOOSE ===== */}
                {sheetMode === "choose" && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-5">
                      Registrar pesagem
                    </h3>

                    <div className="flex flex-col gap-3">
                      {/* Photo option */}
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        className="w-full py-5 rounded-2xl bg-[#30D158] text-white font-semibold text-sm flex items-center justify-center gap-3"
                        onClick={() => {
                          setSheetMode("photo");
                          handleCaptureScale();
                        }}
                      >
                        <div className="flex flex-col items-center gap-1.5">
                          <div className="flex items-center gap-2">
                            <Camera className="w-5 h-5" />
                            <span>Foto da balanca</span>
                          </div>
                          <span className="text-[11px] text-white/70 font-normal">
                            Verificacao por OCR · ate 30 pts
                          </span>
                        </div>
                      </motion.button>

                      {/* Manual option */}
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        className="w-full py-5 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-3"
                        style={{
                          backgroundColor: "#2C2C2E",
                          border: "1px solid rgba(255,255,255,0.10)",
                        }}
                        onClick={() => setSheetMode("manual")}
                      >
                        <div className="flex flex-col items-center gap-1.5">
                          <div className="flex items-center gap-2">
                            <PenLine className="w-5 h-5" />
                            <span>Digitar peso</span>
                          </div>
                          <span className="text-[11px] text-white/50 font-normal">
                            Sem verificacao · ate 10 pts
                          </span>
                        </div>
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* ===== MODE: PHOTO ===== */}
                {sheetMode === "photo" && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Foto da balanca
                    </h3>

                    {/* No photo yet */}
                    {!photoBase64 && !readingScale && (
                      <div className="mb-4 flex flex-col items-center justify-center py-12 rounded-xl bg-white/5 border border-dashed border-white/20">
                        <Scale className="w-10 h-10 text-white/20 mb-3" />
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          className="px-6 py-3 rounded-xl bg-[#30D158] text-white text-sm font-semibold"
                          onClick={handleCaptureScale}
                        >
                          Capturar foto
                        </motion.button>
                      </div>
                    )}

                    {/* Photo taken, reading */}
                    {photoBase64 && readingScale && (
                      <div className="mb-4">
                        <div className="relative">
                          <img
                            src={photoBase64}
                            alt="Foto da balanca"
                            className="rounded-xl max-h-48 w-full object-cover"
                          />
                          <div className="absolute inset-0 rounded-xl bg-black/50 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                              <span className="text-sm text-white/80 animate-pulse">
                                Lendo display da balanca...
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Reading done */}
                    {photoBase64 && !readingScale && scaleReading && (
                      <div className="flex flex-col gap-4">
                        {/* Thumbnail */}
                        <img
                          src={photoBase64}
                          alt="Foto da balanca"
                          className="rounded-xl max-h-36 w-full object-cover"
                        />

                        {/* Weight read */}
                        <div className="flex items-center justify-center gap-2">
                          <span className="font-mono-score text-4xl font-bold text-white">
                            {scaleReading.weightKg.toFixed(1)}
                          </span>
                          <span className="text-lg text-white/40">kg</span>
                        </div>

                        {/* Confidence badge */}
                        <div className="flex items-center justify-center gap-2">
                          <span
                            className="text-xs font-semibold px-3 py-1 rounded-full"
                            style={{
                              color:
                                scaleReading.confidence >= 85
                                  ? "#30D158"
                                  : "#FF9F0A",
                              backgroundColor:
                                scaleReading.confidence >= 85
                                  ? "rgba(48,209,88,0.15)"
                                  : "rgba(255,159,10,0.15)",
                            }}
                          >
                            Confianca: {scaleReading.confidence}%
                          </span>
                        </div>

                        {/* Flags */}
                        {scaleReading.flags.length > 0 && (
                          <div className="flex flex-col gap-1.5">
                            {scaleReading.flags.map((flag, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2"
                              >
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                                <span className="text-xs text-amber-400/80">
                                  {flag}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Confirm button */}
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          className="w-full py-4 rounded-2xl bg-[#30D158] text-white font-semibold text-sm disabled:opacity-50"
                          onClick={handleSavePhoto}
                          disabled={saving}
                        >
                          {saving
                            ? "Salvando..."
                            : `Confirmar peso · +${photoPoints} pts`}
                        </motion.button>

                        {/* Switch to manual */}
                        <button
                          className="text-sm text-white/50 text-center py-2"
                          onClick={() => {
                            setManualWeight(
                              scaleReading.weightKg.toFixed(1),
                            );
                            setSheetMode("manual");
                          }}
                        >
                          Digitar outro valor
                        </button>
                      </div>
                    )}

                    {/* Back */}
                    <button
                      className="text-xs text-white/40 text-center w-full mt-4"
                      onClick={() => {
                        setPhotoBase64(null);
                        setScaleReading(null);
                        setReadingScale(false);
                        setSheetMode("choose");
                      }}
                    >
                      <ChevronLeft className="w-3 h-3 inline mr-1" />
                      Voltar
                    </button>
                  </div>
                )}

                {/* ===== MODE: MANUAL ===== */}
                {sheetMode === "manual" && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Digitar peso
                    </h3>

                    {/* Weight input */}
                    <div className="mb-4">
                      <label className="text-xs text-white/50 mb-2 block">
                        Peso (kg)
                      </label>
                      <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                        <Scale className="w-4 h-4 text-white/30 flex-shrink-0" />
                        <input
                          type="number"
                          value={manualWeight}
                          onChange={(e) => setManualWeight(e.target.value)}
                          placeholder="72.5"
                          min={30}
                          max={300}
                          step={0.1}
                          className="flex-1 bg-transparent text-white text-lg font-mono-score font-bold placeholder:text-white/30 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-xs text-white/30">kg</span>
                      </div>
                    </div>

                    {/* Warning */}
                    <div className="flex items-start gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-2.5 mb-5">
                      <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-amber-400/80">
                        Registro manual — confianca limitada. Tire uma foto da
                        balanca para ganhar mais pontos.
                      </span>
                    </div>

                    {/* Save button */}
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-4 rounded-2xl text-white font-semibold text-sm disabled:opacity-50"
                      style={{ backgroundColor: "#3A3A3C" }}
                      onClick={handleSaveManual}
                      disabled={
                        saving ||
                        !manualWeight ||
                        parseFloat(manualWeight) < 30 ||
                        parseFloat(manualWeight) > 300
                      }
                    >
                      {saving ? "Salvando..." : "Salvar · +10 pts"}
                    </motion.button>

                    {/* Back */}
                    <button
                      className="text-xs text-white/40 text-center w-full mt-4"
                      onClick={() => {
                        setManualWeight("");
                        setSheetMode("choose");
                      }}
                    >
                      <ChevronLeft className="w-3 h-3 inline mr-1" />
                      Voltar
                    </button>
                  </div>
                )}

                {/* ========== SCHEDULE MODE ========== */}
                {sheetMode === "schedule" && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Agendar Pesagem Semanal
                    </h3>
                    <p className="text-xs text-white/40 mb-5">
                      Pesar sempre no mesmo dia e horário garante dados mais confiáveis. Recomendação: manhã, em jejum.
                    </p>

                    {/* Dia da semana */}
                    <p className="text-xs text-white/50 mb-2 uppercase tracking-wider">Dia da semana</p>
                    <div className="grid grid-cols-7 gap-1 mb-5">
                      {["D", "S", "T", "Q", "Q", "S", "S"].map((label, idx) => (
                        <button
                          key={idx}
                          onClick={() => setScheduleDay(idx)}
                          className={`py-2.5 rounded-lg text-xs font-medium transition-colors ${
                            scheduleDay === idx
                              ? "bg-[#1877F2] text-white"
                              : "bg-white/5 text-white/50 border border-white/[0.08]"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    {/* Horário */}
                    <p className="text-xs text-white/50 mb-2 uppercase tracking-wider">Horário</p>
                    <div className="flex items-center gap-2 mb-5">
                      <select
                        value={scheduleHour}
                        onChange={(e) => setScheduleHour(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-white text-center text-lg font-mono-score outline-none appearance-none"
                      >
                        {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0")).map((h) => (
                          <option key={h} value={h} className="bg-[#1C1C1E]">{h}</option>
                        ))}
                      </select>
                      <span className="text-xl text-white/50 font-bold">:</span>
                      <select
                        value={scheduleMinute}
                        onChange={(e) => setScheduleMinute(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-white text-center text-lg font-mono-score outline-none appearance-none"
                      >
                        {["00", "15", "30", "45"].map((m) => (
                          <option key={m} value={m} className="bg-[#1C1C1E]">{m}</option>
                        ))}
                      </select>
                    </div>

                    {/* Dica */}
                    <div className="flex items-start gap-2 bg-[#1877F2]/10 border border-[#1877F2]/20 rounded-xl p-3 mb-5">
                      <Bell className="w-4 h-4 text-[#1877F2] mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-white/60">
                        Você receberá um lembrete <span className="text-white/80 font-medium">1 hora antes</span> do horário configurado.
                      </p>
                    </div>

                    <button
                      onClick={async () => {
                        await WeightMonitor.saveSchedule({
                          dayOfWeek: scheduleDay,
                          hour: parseInt(scheduleHour),
                          minute: parseInt(scheduleMinute),
                          reminderEnabled: true,
                          reminderMinutesBefore: 60,
                        });
                        const ss = await WeightMonitor.getScheduleStatus();
                        setScheduleStatus(ss);
                        setShowSheet(false);
                        setSheetMode("choose");
                      }}
                      className="w-full py-4 rounded-2xl bg-[#1877F2] text-white font-semibold text-base transition-opacity hover:opacity-90"
                    >
                      Agendar pesagem
                    </button>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
