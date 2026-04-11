"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Plus, Clock, Flame, Trophy } from "lucide-react";
import Link from "next/link";

import AppShell from "@/components/layout/AppShell";
import WeeklyActivityChart from "@/components/charts/WeeklyActivityChart";
import { useHealthData } from "@/hooks/useHealthData";
import {
  mockWeeklySteps,
  mockExercises,
  exerciseTypeConfig,
  intensityConfig,
  ExerciseType,
  Intensity,
} from "@/lib/mock-data";

const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

/* eslint-disable @typescript-eslint/no-explicit-any */
const sectionVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

export default function AtividadePage() {
  const { summary, weeklySteps, loading, saveExercise } = useHealthData();
  const [showSheet, setShowSheet] = useState(false);
  const [selectedType, setSelectedType] = useState<ExerciseType>("running");
  const [duration, setDuration] = useState(30);
  const [intensity, setIntensity] = useState<Intensity>("moderate");
  const [saving, setSaving] = useState(false);

  const steps = summary?.steps.steps ?? 0;
  const goal = 10000;
  const km = summary?.steps.distance ?? 0;
  const progress = Math.min((steps / goal) * 100, 100);
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const calculatedPoints = Math.round(duration * intensityConfig[intensity].multiplier);

  // Transform weeklySteps into chart format — fallback to mock if all zeros
  const hasRealSteps = weeklySteps && weeklySteps.some((s) => s.steps > 0);
  const chartData = hasRealSteps
    ? weeklySteps.map((s) => {
        const date = new Date(s.date + "T12:00:00");
        const dayName = dayNames[date.getDay()];
        return { day: dayName, steps: s.steps, goal: 10000 };
      })
    : mockWeeklySteps;

  // Use real exercises or fall back to mock
  const exercises =
    summary?.exercises && summary.exercises.length > 0
      ? summary.exercises.map((ex) => ({
          id: ex.id,
          type: ex.type as ExerciseType,
          name: ex.name,
          duration: ex.durationMinutes,
          calories: ex.calories,
          points: Math.round(ex.durationMinutes * 1.5),
        }))
      : mockExercises;

  const handleSaveExercise = async () => {
    setSaving(true);
    try {
      await saveExercise({
        type: selectedType,
        name: exerciseTypeConfig[selectedType].label,
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        durationMinutes: duration,
        calories: Math.round(
          duration * (intensity === "intense" ? 8 : intensity === "moderate" ? 5 : 3)
        ),
      });
      setShowSheet(false);
    } catch (err) {
      console.error("Error saving exercise:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col min-h-screen pb-24">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="sticky top-0 z-50 bg-white shadow-sm border-b border-[#DADCE0] px-4 py-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/home" className="p-1 -ml-1">
                <ChevronLeft className="w-5 h-5 text-[#5F6368]" />
              </Link>
              <h1 className="text-lg font-semibold text-[#202124]">
                Atividade Fisica
              </h1>
            </div>
            <span className="text-xs text-[#5F6368]">
              320 / 400 pts este mes
            </span>
          </div>
        </motion.header>

        <div className="flex flex-col gap-6 px-4 pt-6">
          {/* Card Principal - Passos */}
          <motion.section
            custom={0}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="rounded-2xl backdrop-blur-xl bg-[#F8F9FA] border border-[#DADCE0] p-6"
          >
            {loading ? (
              <div className="flex flex-col items-center gap-3 animate-pulse">
                <div className="w-44 h-44 rounded-full bg-[#F1F3F4]" />
                <div className="w-24 h-4 rounded bg-[#F1F3F4]" />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg
                    width="176"
                    height="176"
                    viewBox="0 0 176 176"
                    className="-rotate-90"
                  >
                    <circle
                      cx="88"
                      cy="88"
                      r="70"
                      fill="none"
                      stroke="#DADCE0"
                      strokeWidth="10"
                    />
                    <motion.circle
                      cx="88"
                      cy="88"
                      r="70"
                      fill="none"
                      stroke="#1A73E8"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-mono-score text-4xl font-bold text-[#202124] leading-none">
                      {steps.toLocaleString("pt-BR")}
                    </span>
                    <span className="text-xs text-[#5F6368] mt-1">
                      de {goal.toLocaleString("pt-BR")} passos
                    </span>
                  </div>
                </div>
                <p className="text-sm text-[#9AA0A6]">
                  {km.toFixed(1)} km percorridos
                </p>
              </div>
            )}
          </motion.section>

          {/* Grafico Semanal */}
          <motion.section
            custom={1}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-base font-semibold text-[#202124] mb-3">
              Esta Semana
            </h2>
            <div className="rounded-2xl bg-[#F8F9FA] border border-[#DADCE0] p-4">
              <WeeklyActivityChart data={chartData} />
            </div>
          </motion.section>

          {/* Cards de Exercicio */}
          <motion.section
            custom={2}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-base font-semibold text-[#202124] mb-3">
              Exercicios Registrados
            </h2>
            <div className="flex flex-col gap-3">
              {exercises.map((exercise) => {
                const typeConf =
                  exerciseTypeConfig[exercise.type as ExerciseType] ??
                  exerciseTypeConfig.other;
                return (
                  <div
                    key={exercise.id}
                    className="bg-white rounded-2xl p-4 flex items-center gap-4"
                  >
                    <span className="text-2xl w-10 text-center">
                      {typeConf.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#202124] truncate">
                        {exercise.name}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-[#5F6368]">
                          <Clock className="w-3 h-3" />
                          {exercise.duration} min
                        </span>
                        <span className="flex items-center gap-1 text-xs text-[#5F6368]">
                          <Flame className="w-3 h-3" />
                          {exercise.calories} kcal
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-green-400">
                      +{exercise.points} pts
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.section>
        </div>

        {/* FAB */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
          onClick={() => setShowSheet(true)}
          className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-[#1A73E8] flex items-center justify-center shadow-lg shadow-blue-500/30 z-40"
        >
          <Plus className="w-6 h-6 text-white" />
        </motion.button>

        {/* Bottom Sheet Modal */}
        <AnimatePresence>
          {showSheet && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSheet(false)}
                className="fixed inset-0 bg-black/30 z-[55]"
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 z-[60] mx-auto max-w-md max-h-[85vh] overflow-y-auto"
              >
                <div className="bg-white rounded-t-3xl px-6 pt-6 pb-10">
                  {/* Handle */}
                  <div className="w-10 h-1 bg-[#DADCE0] rounded-full mx-auto mb-6" />

                  <h3 className="text-lg font-semibold text-[#202124] mb-4">
                    Registrar Exercicio
                  </h3>

                  {/* Tipo de exercicio */}
                  <p className="text-xs text-[#5F6368] mb-2 uppercase tracking-wider">
                    Tipo
                  </p>
                  <div className="grid grid-cols-3 gap-2 mb-5">
                    {(Object.entries(exerciseTypeConfig) as [ExerciseType, { label: string; icon: string }][]).map(
                      ([key, conf]) => (
                        <button
                          key={key}
                          onClick={() => setSelectedType(key)}
                          className={`flex flex-col items-center gap-1 rounded-xl py-3 px-2 transition-colors ${
                            selectedType === key
                              ? "bg-[#1A73E8]/20 border border-[#1A73E8]/50"
                              : "bg-[#F8F9FA] border border-[#DADCE0]"
                          }`}
                        >
                          <span className="text-xl">{conf.icon}</span>
                          <span className="text-[11px] text-[#5F6368]">
                            {conf.label}
                          </span>
                        </button>
                      )
                    )}
                  </div>

                  {/* Duracao */}
                  <p className="text-xs text-[#5F6368] mb-2 uppercase tracking-wider">
                    Duracao (minutos)
                  </p>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full bg-[#F8F9FA] border border-[#DADCE0] rounded-xl px-4 py-3 text-[#202124] text-center text-lg font-mono-score mb-5 outline-none focus:border-[#1A73E8]/50 transition-colors"
                  />

                  {/* Intensidade */}
                  <p className="text-xs text-[#5F6368] mb-2 uppercase tracking-wider">
                    Intensidade
                  </p>
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {(Object.entries(intensityConfig) as [Intensity, { label: string; multiplier: number; color: string }][]).map(
                      ([key, conf]) => (
                        <button
                          key={key}
                          onClick={() => setIntensity(key)}
                          className={`rounded-xl py-3 text-sm font-medium transition-colors ${
                            intensity === key
                              ? "text-white"
                              : "bg-[#F8F9FA] text-[#5F6368] border border-[#DADCE0]"
                          }`}
                          style={
                            intensity === key
                              ? { backgroundColor: conf.color + "33", borderWidth: 1, borderColor: conf.color + "80" }
                              : undefined
                          }
                        >
                          {conf.label}
                        </button>
                      )
                    )}
                  </div>

                  {/* Preview de pontos */}
                  <div className="flex items-center justify-center gap-2 mb-5">
                    <Trophy className="w-4 h-4 text-[#FFD60A]" />
                    <span className="text-lg font-semibold text-[#202124]">
                      +{calculatedPoints} pontos
                    </span>
                  </div>

                  {/* Botao Registrar */}
                  <button
                    onClick={handleSaveExercise}
                    disabled={saving}
                    className="w-full py-4 rounded-2xl bg-[#1A73E8] text-white font-semibold text-base transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {saving ? "Salvando..." : `Registrar \u00B7 +${calculatedPoints} pontos`}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
