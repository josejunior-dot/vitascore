"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Camera,
  PenLine,
  Plus,
  Coffee,
  Sun,
  Moon as MoonIcon,
  UtensilsCrossed,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Image,
} from "lucide-react";
import Link from "next/link";

import AppShell from "@/components/layout/AppShell";
import {
  MealAnalyzer,
  type VerifiedMeal,
  type MealPhotoAnalysis,
  type PhotoMetadata,
} from "@/lib/health/meal-analyzer";

/* eslint-disable @typescript-eslint/no-explicit-any */
const sectionVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

type MealType = "cafe" | "almoco" | "jantar" | "lanche";
type SheetMode = "choose" | "photo" | "manual";

const mealTypeLabels: Record<string, string> = {
  cafe: "Cafe da manha",
  almoco: "Almoco",
  jantar: "Jantar",
  lanche: "Lanche",
};

const mealSlotsConfig = [
  { key: "cafe" as MealType, label: "Cafe", icon: Coffee },
  { key: "almoco" as MealType, label: "Almoco", icon: Sun },
  { key: "jantar" as MealType, label: "Jantar", icon: MoonIcon },
];

const MEAL_GOAL = 3;

function getScoreColor(score: number): string {
  if (score > 70) return "#30D158";
  if (score > 40) return "#FF9F0A";
  return "#FF453A";
}

export default function NutricaoPage() {
  const [meals, setMeals] = useState<VerifiedMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSheet, setShowSheet] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [selectedType, setSelectedType] = useState<MealType>("cafe");
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoMetadata, setPhotoMetadata] = useState<PhotoMetadata | null>(null);
  const [analysis, setAnalysis] = useState<MealPhotoAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [manualDescription, setManualDescription] = useState("");
  const [mode, setMode] = useState<SheetMode>("choose");

  useEffect(() => {
    MealAnalyzer.getTodayMeals().then((m) => {
      setMeals(m);
      setLoading(false);
    });
  }, []);

  const totalPoints = meals.reduce((sum, m) => sum + (m.points || 0), 0);
  const loggedTypes = new Map<string, VerifiedMeal>();
  meals.forEach((m) => {
    if (!loggedTypes.has(m.type)) loggedTypes.set(m.type, m);
  });
  const currentCount = Math.min(
    new Set(meals.map((m) => m.type)).size,
    MEAL_GOAL
  );

  const handleCapturePhoto = async () => {
    const result = await MealAnalyzer.capturePhoto();
    if (result) {
      setPhotoBase64(result.base64);
      setPhotoMetadata(result.metadata);
      setAnalyzing(true);
      const analysisResult = await MealAnalyzer.analyzePhoto(result.base64, result.metadata);
      setAnalysis(analysisResult);
      setAnalyzing(false);
    }
  };

  const handleSavePhoto = async () => {
    if (!photoBase64 || !analysis) return;
    setRegistering(true);
    const points = analysis.antifraud.passed
      ? 15 + Math.round((analysis.mealScore / 100) * 20)
      : 5; // foto rejeitada por anti-fraude = pontuação mínima
    await MealAnalyzer.saveMeal({
      type: selectedType,
      timestamp: new Date().toISOString(),
      photoBase64,
      photoMetadata,
      analysis,
      manualDescription: null,
      points,
      verificationMethod: "photo_ai",
    });
    const updated = await MealAnalyzer.getTodayMeals();
    setMeals(updated);
    resetSheet();
  };

  const handleSaveManual = async () => {
    if (!manualDescription.trim()) return;
    setRegistering(true);
    await MealAnalyzer.saveMeal({
      type: selectedType,
      timestamp: new Date().toISOString(),
      photoBase64: null,
      photoMetadata: null,
      analysis: null,
      manualDescription,
      points: 10,
      verificationMethod: "manual",
    });
    const updated = await MealAnalyzer.getTodayMeals();
    setMeals(updated);
    resetSheet();
  };

  const resetSheet = () => {
    setShowSheet(false);
    setPhotoBase64(null);
    setPhotoMetadata(null);
    setAnalysis(null);
    setManualDescription("");
    setMode("choose");
    setRegistering(false);
    setAnalyzing(false);
  };

  if (loading) {
    return (
      <AppShell>
        <div className="flex flex-col min-h-screen pb-24">
          <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-[#DADCE0] px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/home" className="p-1 -ml-1">
                <ChevronLeft className="w-6 h-6 text-[#5F6368]" />
              </Link>
              <h1 className="text-lg font-semibold text-[#202124] flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5" />
                Nutricao
              </h1>
              <span className="w-20" />
            </div>
          </header>
          <div className="flex flex-col gap-4 px-4 pt-4">
            <div
              className="rounded-2xl p-5 animate-pulse"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <div className="h-4 w-48 bg-[#F1F3F4] rounded mb-4" />
              <div className="flex items-center justify-center gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="w-14 h-14 rounded-full bg-[#F1F3F4]" />
                    <div className="h-3 w-10 bg-[#F1F3F4] rounded" />
                  </div>
                ))}
              </div>
            </div>
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-2xl p-4 animate-pulse"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <div className="h-4 w-32 bg-[#F1F3F4] rounded mb-2" />
                <div className="h-3 w-48 bg-[#F1F3F4] rounded" />
              </div>
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex flex-col min-h-screen pb-24">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-[#DADCE0] px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/home" className="p-1 -ml-1">
              <ChevronLeft className="w-6 h-6 text-[#5F6368]" />
            </Link>
            <h1 className="text-lg font-semibold text-[#202124] flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5" />
              Nutricao
            </h1>
            <span className="text-xs text-[#9AA0A6] font-medium">
              {totalPoints} / 150 pts
            </span>
          </div>
        </header>

        <div className="flex flex-col gap-4 px-4 pt-4">
          {/* Daily Summary Card */}
          <motion.section
            custom={0}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="rounded-2xl p-5"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #DADCE0",
            }}
          >
            <p className="text-sm text-[#5F6368] mb-4">
              {currentCount} de {MEAL_GOAL} refeicoes registradas
            </p>

            <div className="flex items-center justify-center gap-6">
              {mealSlotsConfig.map((slot) => {
                const Icon = slot.icon;
                const meal = loggedTypes.get(slot.key);
                const isPhoto = meal?.verificationMethod === "photo_ai";
                const isManual = meal?.verificationMethod === "manual";
                const logged = !!meal;

                return (
                  <div
                    key={slot.key}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center ${
                        isPhoto
                          ? "bg-green-500/20 border-2 border-green-500"
                          : isManual
                          ? "bg-blue-500/20 border-2 border-blue-500"
                          : "border-2 border-dashed border-[#DADCE0]"
                      }`}
                    >
                      {isPhoto ? (
                        <Shield className="w-6 h-6 text-green-500" />
                      ) : isManual ? (
                        <CheckCircle2 className="w-6 h-6 text-blue-400" />
                      ) : (
                        <Icon className="w-6 h-6 text-[#9AA0A6]" />
                      )}
                    </div>
                    <span
                      className={`text-xs ${
                        logged ? "text-[#5F6368]" : "text-[#9AA0A6]"
                      }`}
                    >
                      {slot.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.section>

          {/* Meal Cards */}
          <motion.section
            custom={1}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-base font-semibold text-[#202124] mb-3">
              Refeicoes de hoje
            </h2>

            {meals.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Image className="w-10 h-10 text-[#DADCE0]" />
                <p className="text-sm text-[#9AA0A6] text-center">
                  Nenhuma refeicao registrada hoje
                </p>
                <p className="text-xs text-[#DADCE0] text-center">
                  Tire uma foto do prato para ganhar mais pontos
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {meals.map((entry, i) => {
                const label = mealTypeLabels[entry.type] ?? entry.type;
                const isPhoto = entry.verificationMethod === "photo_ai";
                const isManual = entry.verificationMethod === "manual";
                const time = entry.timestamp
                  ? new Date(entry.timestamp).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : null;

                return (
                  <motion.div
                    key={entry.timestamp + "-" + i}
                    className="rounded-2xl p-4"
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: isPhoto
                        ? "1px solid rgba(48,209,88,0.20)"
                        : isManual
                        ? "1px solid rgba(255,159,10,0.20)"
                        : "1px solid #DADCE0",
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                  >
                    <div className="flex gap-3">
                      {/* Photo thumbnail */}
                      {isPhoto && entry.photoBase64 && (
                        <img
                          src={entry.photoBase64}
                          alt="Foto da refeicao"
                          className="rounded-xl h-20 w-20 object-cover flex-shrink-0"
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        {/* Title + time */}
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-[#202124]">
                            {label}
                          </h3>
                          {time && (
                            <span className="text-xs text-[#9AA0A6]">
                              {time}
                            </span>
                          )}
                        </div>

                        {/* Photo verified content */}
                        {isPhoto && entry.analysis && (
                          <>
                            <p className="text-xs text-[#5F6368] mb-2 line-clamp-2">
                              {entry.analysis.description}
                            </p>

                            <div className="flex items-center gap-2 mb-2">
                              {/* Score badge */}
                              <span
                                className="text-xs font-bold px-2 py-0.5 rounded-full"
                                style={{
                                  color: getScoreColor(
                                    entry.analysis.mealScore
                                  ),
                                  backgroundColor: `${getScoreColor(entry.analysis.mealScore)}20`,
                                }}
                              >
                                {entry.analysis.mealScore}/100
                              </span>

                              {/* Verification badge */}
                              <span className="flex items-center gap-1 text-[11px] text-green-400">
                                <Shield className="w-3 h-3" />
                                Verificado por IA
                                {entry.analysis.confidence != null &&
                                  ` · ${entry.analysis.confidence}%`}
                              </span>
                            </div>

                            {/* Detected items pills */}
                            <div className="flex flex-wrap gap-1">
                              {[
                                { label: "Vegetais", present: entry.analysis.hasVegetables },
                                { label: "Proteína", present: entry.analysis.hasProtein },
                                { label: "Integral", present: entry.analysis.hasWholeGrains },
                                { label: "Fruta", present: entry.analysis.hasFruit },
                              ].map((item) => (
                                <span
                                  key={item.label}
                                  className="text-[10px] px-2 py-0.5 rounded-full bg-[#F8F9FA] text-[#5F6368]"
                                >
                                  {item.label}{" "}
                                  {item.present ? (
                                    <CheckCircle2 className="w-2.5 h-2.5 inline text-green-400" />
                                  ) : (
                                    <AlertTriangle className="w-2.5 h-2.5 inline text-[#DADCE0]" />
                                  )}
                                </span>
                              ))}
                            </div>
                          </>
                        )}

                        {/* Manual content */}
                        {isManual && (
                          <>
                            <p className="text-xs text-[#5F6368] mb-2">
                              {entry.manualDescription}
                            </p>
                            <span className="flex items-center gap-1 text-[11px] text-amber-400">
                              <AlertTriangle className="w-3 h-3" />
                              Registro manual · pontuacao limitada
                            </span>
                          </>
                        )}

                        {/* Points */}
                        <div className="mt-2">
                          <span className="text-xs font-semibold text-green-400">
                            +{entry.points || 0} pts
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        </div>

        {/* CTA fixed above BottomNav */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="fixed bottom-20 left-0 right-0 z-40 px-4 mx-auto max-w-md"
        >
          <button
            onClick={() => setShowSheet(true)}
            className="w-full py-4 rounded-2xl bg-[#30D158] text-white font-semibold text-base shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
          >
            <Plus className="w-5 h-5" />
            Registrar refeicao
          </button>
        </motion.div>

        {/* Bottom Sheet */}
        <AnimatePresence>
          {showSheet && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/30 z-[55]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={resetSheet}
              />
              <motion.div
                className="fixed bottom-0 left-0 right-0 z-[60] mx-auto max-w-md max-h-[85vh] overflow-y-auto rounded-t-3xl px-5 pt-6 pb-10"
                style={{ backgroundColor: "#F8F9FA" }}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 300 }}
              >
                {/* Handle */}
                <div className="w-10 h-1 rounded-full bg-[#DADCE0] mx-auto mb-5" />

                {/* ===== MODE: CHOOSE ===== */}
                {mode === "choose" && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#202124] mb-4">
                      Registrar Refeicao
                    </h3>

                    {/* Meal type selector */}
                    <div className="mb-5">
                      <label className="text-xs text-[#5F6368] mb-2 block">
                        Tipo de refeicao
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {(
                          [
                            {
                              key: "cafe" as MealType,
                              label: "Cafe",
                              icon: Coffee,
                            },
                            {
                              key: "almoco" as MealType,
                              label: "Almoco",
                              icon: Sun,
                            },
                            {
                              key: "jantar" as MealType,
                              label: "Jantar",
                              icon: MoonIcon,
                            },
                            {
                              key: "lanche" as MealType,
                              label: "Lanche",
                              icon: UtensilsCrossed,
                            },
                          ] as const
                        ).map((m) => {
                          const Icon = m.icon;
                          return (
                            <button
                              key={m.key}
                              className={`flex flex-col items-center gap-1.5 rounded-xl py-3 text-xs font-medium transition-colors ${
                                selectedType === m.key
                                  ? "bg-green-500/20 text-green-400 border border-green-500/40"
                                  : "bg-[#F8F9FA] text-[#5F6368] border border-transparent"
                              }`}
                              onClick={() => setSelectedType(m.key)}
                            >
                              <Icon className="w-5 h-5" />
                              {m.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Two CTA buttons */}
                    <div className="flex flex-col gap-3">
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        className="w-full py-4 rounded-2xl bg-[#30D158] text-white font-semibold text-sm flex items-center justify-center gap-3"
                        onClick={() => {
                          setMode("photo");
                          handleCapturePhoto();
                        }}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-2">
                            <Camera className="w-5 h-5" />
                            <span>Tirar foto do prato</span>
                          </div>
                          <span className="text-[11px] text-[#5F6368] font-normal">
                            Verificacao por IA · ate 35 pts
                          </span>
                        </div>
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        className="w-full py-4 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-3"
                        style={{ backgroundColor: "#F8F9FA", border: "1px solid #DADCE0" }}
                        onClick={() => setMode("manual")}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-2">
                            <PenLine className="w-5 h-5" />
                            <span>Registro manual</span>
                          </div>
                          <span className="text-[11px] text-[#5F6368] font-normal">
                            Sem verificacao · ate 10 pts
                          </span>
                        </div>
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* ===== MODE: PHOTO ===== */}
                {mode === "photo" && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#202124] mb-4">
                      Verificacao por foto
                    </h3>

                    {/* Photo display area */}
                    {photoBase64 ? (
                      <div className="relative mb-4">
                        <img
                          src={photoBase64}
                          alt="Foto do prato"
                          className="rounded-xl max-h-48 w-full object-cover"
                        />
                        {analyzing && (
                          <div className="absolute inset-0 rounded-xl bg-black/50 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                              <span className="text-sm text-[#202124]">
                                Analisando refeicao...
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mb-4 flex flex-col items-center justify-center py-12 rounded-xl bg-[#F8F9FA] border border-dashed border-[#DADCE0]">
                        <Camera className="w-10 h-10 text-[#DADCE0] mb-3" />
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          className="px-6 py-3 rounded-xl bg-[#30D158] text-white text-sm font-semibold"
                          onClick={handleCapturePhoto}
                        >
                          Capturar foto
                        </motion.button>
                      </div>
                    )}

                    {/* Analysis results */}
                    {analysis && !analyzing && (
                      <div className="flex flex-col gap-4">
                        {/* Score large */}
                        <div className="flex items-center justify-center gap-3">
                          <span
                            className="text-4xl font-bold"
                            style={{ color: getScoreColor(analysis.mealScore) }}
                          >
                            {analysis.mealScore}
                          </span>
                          <span className="text-lg text-[#9AA0A6]">/100</span>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-[#5F6368] text-center">
                          {analysis.description}
                        </p>

                        {/* Detected items grid */}
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { label: "Vegetais", present: analysis.hasVegetables },
                            { label: "Proteína", present: analysis.hasProtein },
                            { label: "Integral", present: analysis.hasWholeGrains },
                            { label: "Fruta", present: analysis.hasFruit },
                            { label: "Não processado", present: !analysis.isProcessed },
                            { label: "Não frito", present: !analysis.isDeepFried },
                          ].map((item) => (
                            <div
                              key={item.label}
                              className="flex items-center gap-2 rounded-xl bg-[#F8F9FA] px-3 py-2"
                            >
                              {item.present ? (
                                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                              )}
                              <span className="text-xs text-[#5F6368]">
                                {item.label}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Save button */}
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          className="w-full py-4 rounded-2xl bg-[#30D158] text-white font-semibold text-sm disabled:opacity-50"
                          onClick={handleSavePhoto}
                          disabled={registering}
                        >
                          {registering
                            ? "Salvando..."
                            : `Salvar refeicao · +${15 + Math.round((analysis.mealScore / 100) * 20)} pts`}
                        </motion.button>

                        {/* Retake button */}
                        <button
                          className="text-sm text-[#5F6368] text-center py-2"
                          onClick={() => {
                            setPhotoBase64(null);
                            setAnalysis(null);
                            handleCapturePhoto();
                          }}
                        >
                          Tirar outra foto
                        </button>
                      </div>
                    )}

                    {/* Back button */}
                    <button
                      className="text-xs text-[#9AA0A6] text-center w-full mt-4"
                      onClick={() => {
                        setPhotoBase64(null);
                        setAnalysis(null);
                        setAnalyzing(false);
                        setMode("choose");
                      }}
                    >
                      <ChevronLeft className="w-3 h-3 inline mr-1" />
                      Voltar
                    </button>
                  </div>
                )}

                {/* ===== MODE: MANUAL ===== */}
                {mode === "manual" && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#202124] mb-4">
                      Registro manual
                    </h3>

                    {/* Meal type label */}
                    <div className="mb-3">
                      <span className="text-xs text-[#5F6368]">
                        {mealTypeLabels[selectedType]}
                      </span>
                    </div>

                    {/* Textarea */}
                    <div className="mb-4">
                      <label className="text-xs text-[#5F6368] mb-2 block">
                        O que voce comeu?
                      </label>
                      <textarea
                        value={manualDescription}
                        onChange={(e) => setManualDescription(e.target.value)}
                        placeholder="Ex: Salada com frango grelhado, arroz integral e legumes"
                        rows={3}
                        className="w-full rounded-xl bg-[#F8F9FA] border border-[#DADCE0] px-4 py-3 text-sm text-[#202124] placeholder:text-[#9AA0A6] focus:outline-none focus:border-[#DADCE0] resize-none"
                      />
                    </div>

                    {/* Warning */}
                    <div className="flex items-start gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-2.5 mb-5">
                      <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-amber-400/80">
                        Registro manual tem pontuacao limitada (max 10 pts).
                        Tire uma foto para ganhar mais pontos.
                      </span>
                    </div>

                    {/* Save button */}
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-4 rounded-2xl text-white font-semibold text-sm disabled:opacity-50"
                      style={{ backgroundColor: "#E8EAED" }}
                      onClick={handleSaveManual}
                      disabled={!manualDescription.trim() || registering}
                    >
                      {registering ? "Salvando..." : "Salvar · +10 pts"}
                    </motion.button>

                    {/* Back button */}
                    <button
                      className="text-xs text-[#9AA0A6] text-center w-full mt-4"
                      onClick={() => {
                        setManualDescription("");
                        setMode("choose");
                      }}
                    >
                      <ChevronLeft className="w-3 h-3 inline mr-1" />
                      Voltar
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
