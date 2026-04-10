"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, Moon, Star, Shield, Activity, Smartphone,
  Clock, CheckCircle2, AlertTriangle, Radio, PenLine,
} from "lucide-react";
import Link from "next/link";

import AppShell from "@/components/layout/AppShell";
import SleepQualityChart from "@/components/charts/SleepQualityChart";
import { mockSleepData, mockTodaySleep } from "@/lib/mock-data";
import { useHealthData } from "@/hooks/useHealthData";
import { useSleepMonitor } from "@/hooks/useSleepMonitor";

/* eslint-disable @typescript-eslint/no-explicit-any */
const sectionVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

function formatElapsed(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  return `${h}h ${m.toString().padStart(2, "0")}min`;
}

export default function SonoPage() {
  const { summary, loading: healthLoading } = useHealthData();
  const {
    collecting,
    lastVerification,
    loading: monitorLoading,
    analyzed,
    registerManual,
  } = useSleepMonitor();

  const [showSheet, setShowSheet] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bedtime, setBedtime] = useState({ hour: "23", minute: "00" });
  const [wakeTime, setWakeTime] = useState({ hour: "06", minute: "30" });

  const loading = healthLoading || monitorLoading;
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
  const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, "0"));

  // Dados do sono — prioridade: verificação > health connect > mock
  const hasVerification = lastVerification !== null;
  const confidence = lastVerification?.analysis;

  const sleepTotalMinutes = hasVerification
    ? lastVerification.totalMinutes
    : summary?.sleep?.totalMinutes ?? mockTodaySleep.hours * 60 + mockTodaySleep.minutes;
  const sleepHours = Math.floor(sleepTotalMinutes / 60);
  const sleepMinutes = sleepTotalMinutes % 60;

  const sleepBedtime = hasVerification
    ? new Date(lastVerification.startTime).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : summary?.sleep?.bedtime ?? mockTodaySleep.bedtime;
  const sleepWakeTime = hasVerification
    ? new Date(lastVerification.endTime).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : summary?.sleep?.wakeTime ?? mockTodaySleep.wakeup;

  const deepMin = summary?.sleep?.deepMinutes ?? mockTodaySleep.deepSleep * 60;
  const lightMin = summary?.sleep?.lightMinutes ?? mockTodaySleep.lightSleep * 60;
  const remMin = summary?.sleep?.remMinutes ?? mockTodaySleep.rem * 60;
  const totalPhases = deepMin + lightMin + remMin;

  const qualityLabel = sleepHours >= 7 ? "Boa qualidade 😌" : sleepHours >= 6 ? "Qualidade regular 😐" : "Sono insuficiente 😴";
  const qualityColor = sleepHours >= 7 ? "#30D158" : sleepHours >= 6 ? "#FFD60A" : "#FF453A";

  const confidenceColor = confidence
    ? confidence.confidenceScore >= 80 ? "#30D158" : confidence.confidenceScore >= 50 ? "#FFD60A" : "#FF453A"
    : "#3A3A3C";

  const detectionLabel =
    lastVerification?.detectionMethod === "auto_sensors" ? "Detectado automaticamente"
    : lastVerification?.detectionMethod === "health_connect" ? "Via Health Connect"
    : "Registro manual";

  const handleManualSave = async () => {
    setSaving(true);
    try {
      await registerManual(
        `${bedtime.hour}:${bedtime.minute}`,
        `${wakeTime.hour}:${wakeTime.minute}`
      );
      setShowSheet(false);
    } catch (err) {
      console.error("Error saving sleep:", err);
    } finally {
      setSaving(false);
    }
  };

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
            <h1 className="text-lg font-semibold text-white">Sono</h1>
            {collecting && (
              <span className="ml-auto flex items-center gap-1.5 text-xs text-[#30D158] font-medium">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                Coleta ativa
              </span>
            )}
          </div>
        </motion.header>

        <div className="flex flex-col gap-5 px-4 pt-6">

          {/* Hero — Dados do sono */}
          <motion.section
            custom={0}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="relative rounded-2xl backdrop-blur-xl bg-white/5 border border-white/[0.08] p-6 overflow-hidden"
            style={{ boxShadow: "0 0 40px rgba(123,97,255,0.12)" }}
          >
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col items-center gap-3">
              <div className="relative mb-2">
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                  <Moon className="w-12 h-12 text-[#7B61FF]" fill="#7B61FF" />
                </motion.div>
                <motion.div animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} className="absolute -top-2 -right-4">
                  <Star className="w-4 h-4 text-[#FFD60A]" fill="#FFD60A" />
                </motion.div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center gap-3 animate-pulse">
                  <div className="h-12 w-48 bg-white/10 rounded-xl" />
                  <div className="h-5 w-32 bg-white/10 rounded-lg" />
                </div>
              ) : (
                <>
                  <span className="font-mono-score text-5xl font-bold text-white leading-none">
                    {sleepHours}h {sleepMinutes.toString().padStart(2, "0")}min
                  </span>
                  <span className="text-sm font-medium" style={{ color: qualityColor }}>
                    {qualityLabel}
                  </span>

                  {/* Horários */}
                  <p className="text-xs text-white/40">
                    {sleepBedtime} → {sleepWakeTime}
                  </p>

                  {/* Badge de verificação */}
                  {hasVerification ? (
                    <div className="flex items-center gap-1.5 rounded-full px-3 py-1 mt-1"
                      style={{ backgroundColor: confidenceColor + "15" }}>
                      <Shield className="w-3.5 h-3.5" style={{ color: confidenceColor }} />
                      <span className="text-[11px] font-medium" style={{ color: confidenceColor }}>
                        Verificado · {confidence!.confidenceScore}%
                      </span>
                    </div>
                  ) : analyzed ? (
                    <div className="flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1 mt-1">
                      <AlertTriangle className="w-3 h-3 text-[#FF9F0A]" />
                      <span className="text-[11px] text-[#FF9F0A]">Não verificado</span>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </motion.section>

          {/* Card de Verificação (quando tem dados) */}
          {hasVerification && confidence && (
            <motion.section custom={1} variants={sectionVariants} initial="hidden" animate="visible">
              <div
                className="rounded-2xl border p-5"
                style={{
                  borderColor: confidenceColor + "40",
                  background: `linear-gradient(135deg, ${confidenceColor}08 0%, #1C1C1E 100%)`,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4" style={{ color: confidenceColor }} />
                  <h3 className="text-sm font-semibold text-white">Auditoria do Sono</h3>
                  <span className="ml-auto text-[10px] text-white/30">{detectionLabel}</span>
                </div>

                {/* Score grande */}
                <div className="flex items-center justify-center gap-3 my-4">
                  <span className="font-mono-score text-5xl font-bold" style={{ color: confidenceColor }}>
                    {confidence.confidenceScore}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs text-white/40">Confiança</span>
                    <span className="text-sm font-semibold" style={{ color: confidenceColor }}>
                      {confidence.confidenceLabel}
                    </span>
                  </div>
                </div>

                {/* Métricas */}
                <div className="grid grid-cols-2 gap-2.5 mb-3">
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Activity className="w-3 h-3 text-white/30" />
                      <span className="text-[10px] text-white/30">Celular parado</span>
                    </div>
                    <span className="text-base font-bold text-white">{confidence.stillnessPercent}%</span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Smartphone className="w-3 h-3 text-white/30" />
                      <span className="text-[10px] text-white/30">Tela desligada</span>
                    </div>
                    <span className="text-base font-bold text-white">{confidence.screenOffPercent}%</span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock className="w-3 h-3 text-white/30" />
                      <span className="text-[10px] text-white/30">Maior período parado</span>
                    </div>
                    <span className="text-base font-bold text-white">{formatElapsed(confidence.longestStillPeriod)}</span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <AlertTriangle className="w-3 h-3 text-white/30" />
                      <span className="text-[10px] text-white/30">Movimentos</span>
                    </div>
                    <span className="text-base font-bold text-white">{confidence.movementEvents}</span>
                  </div>
                </div>

                {/* Flags ou aprovação */}
                {confidence.flags.length > 0 ? (
                  <div className="border-t border-white/[0.06] pt-3">
                    {confidence.flags.map((flag, i) => (
                      <p key={i} className="text-[11px] text-[#FF9F0A] flex items-center gap-1.5 mb-1">
                        <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                        {flag}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div className="border-t border-white/[0.06] pt-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#30D158]" />
                    <p className="text-xs text-[#30D158]">Sono verificado sem inconsistências</p>
                  </div>
                )}

                <p className="text-[9px] text-white/15 mt-3 font-mono break-all">
                  {confidence.verificationHash}
                </p>
              </div>
            </motion.section>
          )}

          {/* Timeline de fases */}
          <motion.section custom={2} variants={sectionVariants} initial="hidden" animate="visible">
            <div className="rounded-2xl bg-[#1C1C1E] border border-white/[0.08] p-5">
              <div className="flex rounded-full overflow-hidden h-4 mb-3">
                <div className="h-full" style={{ backgroundColor: "#003D99", width: `${totalPhases > 0 ? (deepMin / totalPhases) * 100 : 33}%` }} />
                <div className="h-full" style={{ backgroundColor: "#1877F2", width: `${totalPhases > 0 ? (lightMin / totalPhases) * 100 : 34}%` }} />
                <div className="h-full" style={{ backgroundColor: "#7B61FF", width: `${totalPhases > 0 ? (remMin / totalPhases) * 100 : 33}%` }} />
              </div>
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#003D99" }} />
                  <span className="text-[11px] text-white/50">Profundo {Math.round(deepMin / 60 * 10) / 10}h</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#1877F2" }} />
                  <span className="text-[11px] text-white/50">Leve {Math.round(lightMin / 60 * 10) / 10}h</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#7B61FF" }} />
                  <span className="text-[11px] text-white/50">REM {Math.round(remMin / 60 * 10) / 10}h</span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Como funciona */}
          <motion.section custom={3} variants={sectionVariants} initial="hidden" animate="visible">
            <div className="rounded-2xl bg-[#1C1C1E] border border-white/[0.08] p-4">
              <h3 className="text-xs font-semibold text-white/50 mb-3 uppercase tracking-wider">Como a verificação funciona</h3>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-start gap-3">
                  <Radio className="w-4 h-4 text-[#30D158] mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-white/60"><span className="text-white/80 font-medium">Coleta automática</span> — sensores do celular registram movimento e tela a cada 5 minutos, sem você fazer nada</p>
                </div>
                <div className="flex items-start gap-3">
                  <Moon className="w-4 h-4 text-[#7B61FF] mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-white/60"><span className="text-white/80 font-medium">Detecção de sono</span> — quando o celular fica parado por 15+ minutos em horário noturno, o app entende que você dormiu</p>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-4 h-4 text-[#1877F2] mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-white/60"><span className="text-white/80 font-medium">Score de confiança</span> — quanto mais parado o celular e tela desligada, maior a confiança para sua seguradora</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Gráfico histórico */}
          <motion.section custom={4} variants={sectionVariants} initial="hidden" animate="visible">
            <h2 className="text-base font-semibold text-white mb-3">Histórico</h2>
            <div className="rounded-2xl bg-white/5 border border-white/[0.08] p-4">
              <SleepQualityChart data={mockSleepData} />
            </div>
          </motion.section>
        </div>

        {/* CTA fixo — registro manual (fallback) */}
        {!hasVerification && analyzed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="fixed bottom-20 left-0 right-0 z-40 px-4 mx-auto max-w-md"
          >
            <button
              onClick={() => setShowSheet(true)}
              className="w-full py-3.5 rounded-2xl bg-[#2C2C2E] border border-white/[0.08] text-white/70 font-medium text-sm shadow-lg flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
            >
              <PenLine className="w-4 h-4" />
              Registrar manualmente (menor confiança)
            </button>
          </motion.div>
        )}

        {/* Bottom Sheet — Registro manual */}
        <AnimatePresence>
          {showSheet && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSheet(false)}
                className="fixed inset-0 bg-black/60 z-[55]"
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 z-[60] mx-auto max-w-md max-h-[85vh] overflow-y-auto"
              >
                <div className="bg-[#1C1C1E] rounded-t-3xl px-6 pt-6 pb-10">
                  <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />

                  <h3 className="text-lg font-semibold text-white mb-2">Registro Manual</h3>
                  <div className="flex items-center gap-1.5 mb-5">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#FF9F0A]" />
                    <p className="text-xs text-[#FF9F0A]">Confiança máxima limitada a 40% sem dados de sensor</p>
                  </div>

                  <p className="text-xs text-white/50 mb-2 uppercase tracking-wider">Hora de dormir</p>
                  <div className="flex items-center gap-2 mb-5">
                    <select value={bedtime.hour} onChange={(e) => setBedtime({ ...bedtime, hour: e.target.value })}
                      className="flex-1 bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-white text-center text-lg font-mono-score outline-none focus:border-[#7B61FF]/50 appearance-none">
                      {hours.map((h) => <option key={h} value={h} className="bg-[#1C1C1E]">{h}</option>)}
                    </select>
                    <span className="text-xl text-white/50 font-bold">:</span>
                    <select value={bedtime.minute} onChange={(e) => setBedtime({ ...bedtime, minute: e.target.value })}
                      className="flex-1 bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-white text-center text-lg font-mono-score outline-none focus:border-[#7B61FF]/50 appearance-none">
                      {minutes.map((m) => <option key={m} value={m} className="bg-[#1C1C1E]">{m}</option>)}
                    </select>
                  </div>

                  <p className="text-xs text-white/50 mb-2 uppercase tracking-wider">Hora de acordar</p>
                  <div className="flex items-center gap-2 mb-6">
                    <select value={wakeTime.hour} onChange={(e) => setWakeTime({ ...wakeTime, hour: e.target.value })}
                      className="flex-1 bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-white text-center text-lg font-mono-score outline-none focus:border-[#7B61FF]/50 appearance-none">
                      {hours.map((h) => <option key={h} value={h} className="bg-[#1C1C1E]">{h}</option>)}
                    </select>
                    <span className="text-xl text-white/50 font-bold">:</span>
                    <select value={wakeTime.minute} onChange={(e) => setWakeTime({ ...wakeTime, minute: e.target.value })}
                      className="flex-1 bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-white text-center text-lg font-mono-score outline-none focus:border-[#7B61FF]/50 appearance-none">
                      {minutes.map((m) => <option key={m} value={m} className="bg-[#1C1C1E]">{m}</option>)}
                    </select>
                  </div>

                  <button
                    onClick={handleManualSave}
                    disabled={saving}
                    className="w-full py-4 rounded-2xl bg-[#7B61FF] text-white font-semibold text-base transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {saving ? "Salvando..." : "Registrar Sono"}
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
