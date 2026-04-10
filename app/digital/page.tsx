"use client";

import { motion } from "framer-motion";
import {
  ChevronLeft,
  Smartphone,
  Moon,
  Clock,
  Unlock,
  TrendingDown,
  TrendingUp,
  Minus,
  Shield,
  Eye,
} from "lucide-react";
import Link from "next/link";

import AppShell from "@/components/layout/AppShell";
import { ScoreCounter } from "@/components/score/ScoreCounter";
import { useScreenTime } from "@/hooks/useScreenTime";

/* eslint-disable @typescript-eslint/no-explicit-any */
const sectionVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

function formatMinutes(min: number): string {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  if (h === 0) return `${m}min`;
  return `${h}h ${m}min`;
}

function getScoreGlow(score: number): string {
  if (score >= 170) return "rgba(48,209,88,0.15)";
  if (score >= 130) return "rgba(48,209,88,0.10)";
  if (score >= 90) return "rgba(255,159,10,0.12)";
  if (score >= 50) return "rgba(255,159,10,0.10)";
  return "rgba(255,69,58,0.15)";
}

function getScoreColor(score: number): string {
  if (score >= 170) return "#30D158";
  if (score >= 130) return "#30D158";
  if (score >= 90) return "#FF9F0A";
  if (score >= 50) return "#FF9F0A";
  return "#FF453A";
}

function getMetricColor(value: number, thresholds: [number, number]): string {
  if (value < thresholds[0]) return "#30D158";
  if (value < thresholds[1]) return "#FFD60A";
  return "#FF453A";
}

function getBarColor(pts: number, max: number): string {
  const pct = pts / max;
  if (pct >= 0.7) return "#30D158";
  if (pct >= 0.4) return "#FFD60A";
  return "#FF453A";
}

export default function DigitalPage() {
  const { report, weeklyTrend, loading } = useScreenTime();

  const score = report?.score.total ?? 0;
  const scoreLabel = report?.score.label ?? "";
  const scoreColor = report ? report.score.color : "#3A3A3C";
  const breakdown = report?.score.breakdown;

  const maxBar =
    weeklyTrend && weeklyTrend.minutes.length > 0
      ? Math.max(...weeklyTrend.minutes, 1)
      : 1;

  const breakdownItems = breakdown
    ? [
        { label: "Tempo de tela", pts: breakdown.screenTime, max: 60 },
        { label: "Desbloqueios", pts: breakdown.unlocks, max: 40 },
        { label: "Uso noturno", pts: breakdown.nightUsage, max: 50 },
        { label: "Sessao continua", pts: breakdown.longestSession, max: 30 },
        { label: "Tendencia", pts: breakdown.trend, max: 20 },
      ]
    : [];

  // Stacked bar proportions
  const totalMax = 200;
  const stackSegments = breakdownItems.map((item) => ({
    label: item.label,
    pts: item.pts,
    max: item.max,
    widthPct: (item.max / totalMax) * 100,
    color: getBarColor(item.pts, item.max),
  }));

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
            <h1 className="text-lg font-semibold text-white">
              Bem-estar Digital
            </h1>
            <Smartphone className="w-4.5 h-4.5 text-white/40 ml-auto" />
          </div>
        </motion.header>

        <div className="flex flex-col gap-5 px-4 pt-6">
          {/* Hero Card */}
          <motion.section
            custom={0}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="relative rounded-2xl backdrop-blur-xl bg-white/5 border border-white/[0.08] p-6 overflow-hidden"
            style={{ boxShadow: `0 0 40px ${getScoreGlow(score)}` }}
          >
            <div
              className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 rounded-full blur-3xl pointer-events-none"
              style={{ backgroundColor: getScoreGlow(score) }}
            />

            {loading ? (
              <div className="flex flex-col items-center gap-3 animate-pulse">
                <div className="h-16 w-32 bg-white/10 rounded-xl" />
                <div className="h-5 w-24 bg-white/10 rounded-lg" />
                <div className="h-3 w-40 bg-white/10 rounded-lg" />
                <div className="h-4 w-full bg-white/10 rounded-full mt-3" />
              </div>
            ) : (
              <div className="relative flex flex-col items-center gap-2">
                <ScoreCounter
                  value={score}
                  className="text-6xl font-bold text-white leading-none"
                />
                <span
                  className="text-sm font-semibold"
                  style={{ color: scoreColor }}
                >
                  {scoreLabel}
                </span>
                <span className="text-xs text-white/40">
                  de 200 pontos possiveis
                </span>

                {/* Stacked horizontal bar */}
                <div className="w-full flex rounded-full overflow-hidden h-3 mt-3">
                  {stackSegments.map((seg, i) => (
                    <div
                      key={i}
                      className="h-full transition-all duration-700"
                      style={{
                        width: `${seg.widthPct}%`,
                        backgroundColor: seg.color,
                        opacity: 0.85,
                      }}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-1">
                  {stackSegments.map((seg, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: seg.color }}
                      />
                      <span className="text-[10px] text-white/40">
                        {seg.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.section>

          {/* Metricas de Hoje */}
          <motion.section
            custom={1}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-xs font-semibold text-white/50 mb-3 uppercase tracking-wider">
              Metricas de Hoje
            </h2>

            {loading ? (
              <div className="grid grid-cols-2 gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-2xl bg-[#1C1C1E] border border-white/[0.08] p-4 animate-pulse"
                  >
                    <div className="h-4 w-16 bg-white/10 rounded mb-3" />
                    <div className="h-7 w-20 bg-white/10 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {/* Tempo de tela */}
                <div className="rounded-2xl bg-[#1C1C1E] border border-white/[0.08] p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Smartphone
                      className="w-3.5 h-3.5"
                      style={{
                        color: getMetricColor(
                          report?.totalMinutes ?? 0,
                          [180, 300]
                        ),
                      }}
                    />
                    <span className="text-[11px] text-white/40">
                      Tempo de tela
                    </span>
                  </div>
                  <span
                    className="font-mono-score text-xl font-bold"
                    style={{
                      color: getMetricColor(
                        report?.totalMinutes ?? 0,
                        [180, 300]
                      ),
                    }}
                  >
                    {formatMinutes(report?.totalMinutes ?? 0)}
                  </span>
                </div>

                {/* Sessoes */}
                <div className="rounded-2xl bg-[#1C1C1E] border border-white/[0.08] p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Unlock
                      className="w-3.5 h-3.5"
                      style={{
                        color: getMetricColor(
                          report?.sessionCount ?? 0,
                          [30, 80]
                        ),
                      }}
                    />
                    <span className="text-[11px] text-white/40">Sessoes</span>
                  </div>
                  <span
                    className="font-mono-score text-xl font-bold"
                    style={{
                      color: getMetricColor(
                        report?.sessionCount ?? 0,
                        [30, 80]
                      ),
                    }}
                  >
                    {report?.sessionCount ?? 0}
                  </span>
                </div>

                {/* Uso noturno */}
                <div className="rounded-2xl bg-[#1C1C1E] border border-white/[0.08] p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Moon
                      className="w-3.5 h-3.5"
                      style={{
                        color: getMetricColor(
                          report?.nightMinutes ?? 0,
                          [1, 30]
                        ),
                      }}
                    />
                    <span className="text-[11px] text-white/40">
                      Uso noturno
                    </span>
                  </div>
                  <span
                    className="font-mono-score text-xl font-bold"
                    style={{
                      color: getMetricColor(
                        report?.nightMinutes ?? 0,
                        [1, 30]
                      ),
                    }}
                  >
                    {formatMinutes(report?.nightMinutes ?? 0)}
                  </span>
                </div>

                {/* Maior sessao */}
                <div className="rounded-2xl bg-[#1C1C1E] border border-white/[0.08] p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Clock
                      className="w-3.5 h-3.5"
                      style={{
                        color: getMetricColor(
                          report?.longestSessionMinutes ?? 0,
                          [60, 120]
                        ),
                      }}
                    />
                    <span className="text-[11px] text-white/40">
                      Maior sessao
                    </span>
                  </div>
                  <span
                    className="font-mono-score text-xl font-bold"
                    style={{
                      color: getMetricColor(
                        report?.longestSessionMinutes ?? 0,
                        [60, 120]
                      ),
                    }}
                  >
                    {formatMinutes(report?.longestSessionMinutes ?? 0)}
                  </span>
                </div>
              </div>
            )}
          </motion.section>

          {/* Pontuacao Detalhada */}
          <motion.section
            custom={2}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-xs font-semibold text-white/50 mb-3 uppercase tracking-wider">
              Pontuacao Detalhada
            </h2>
            <div className="rounded-2xl bg-[#1C1C1E] border border-white/[0.08] p-5">
              {loading ? (
                <div className="flex flex-col gap-4 animate-pulse">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i}>
                      <div className="h-3 w-24 bg-white/10 rounded mb-2" />
                      <div className="h-2.5 w-full bg-white/10 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {breakdownItems.map((item, i) => {
                    const pct = (item.pts / item.max) * 100;
                    const barColor = getBarColor(item.pts, item.max);
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-white/60">
                            {item.label}
                          </span>
                          <span className="text-xs font-mono-score text-white/80">
                            {item.pts}/{item.max}
                          </span>
                        </div>
                        <div className="h-2.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{
                              duration: 0.8,
                              delay: i * 0.1,
                              ease: "easeOut",
                            }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: barColor }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.section>

          {/* Tendencia Semanal */}
          <motion.section
            custom={3}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                Tendencia Semanal
              </h2>
              {weeklyTrend && (
                <span className="ml-auto flex items-center gap-1">
                  {weeklyTrend.direction === "improving" ? (
                    <>
                      <TrendingDown className="w-3.5 h-3.5 text-[#30D158]" />
                      <span className="text-[11px] text-[#30D158] font-medium">
                        Melhorando
                      </span>
                    </>
                  ) : weeklyTrend.direction === "worsening" ? (
                    <>
                      <TrendingUp className="w-3.5 h-3.5 text-[#FF453A]" />
                      <span className="text-[11px] text-[#FF453A] font-medium">
                        Aumentando
                      </span>
                    </>
                  ) : (
                    <>
                      <Minus className="w-3.5 h-3.5 text-white/40" />
                      <span className="text-[11px] text-white/40 font-medium">
                        Estavel
                      </span>
                    </>
                  )}
                </span>
              )}
            </div>

            <div className="rounded-2xl bg-[#1C1C1E] border border-white/[0.08] p-5">
              {loading ? (
                <div className="flex items-end justify-between gap-2 h-32 animate-pulse">
                  {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-white/10 rounded-t-md"
                        style={{ height: `${30 + Math.random() * 70}%` }}
                      />
                      <div className="h-3 w-6 bg-white/10 rounded mt-2" />
                    </div>
                  ))}
                </div>
              ) : weeklyTrend ? (
                <div>
                  <div className="flex items-end justify-between gap-2 h-32">
                    {weeklyTrend.minutes.map((mins, i) => {
                      const date = new Date(weeklyTrend.dates[i]);
                      const dayLabel = DAY_LABELS[date.getDay()];
                      const heightPct =
                        maxBar > 0 ? (mins / maxBar) * 100 : 0;
                      const isToday = i === weeklyTrend.minutes.length - 1;

                      return (
                        <div
                          key={i}
                          className="flex-1 flex flex-col items-center justify-end h-full"
                        >
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{
                              height: `${Math.max(heightPct, 4)}%`,
                            }}
                            transition={{
                              duration: 0.6,
                              delay: i * 0.08,
                              ease: "easeOut",
                            }}
                            className="w-full max-w-[28px] rounded-t-md"
                            style={{
                              backgroundColor: isToday
                                ? "#0A84FF"
                                : "rgba(255,255,255,0.10)",
                            }}
                          />
                          <span
                            className={`text-[10px] mt-2 ${
                              isToday
                                ? "text-[#0A84FF] font-semibold"
                                : "text-white/30"
                            }`}
                          >
                            {dayLabel}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </motion.section>

          {/* Dicas de Saude Digital */}
          <motion.section
            custom={4}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="rounded-2xl bg-[#1C1C1E] border border-white/[0.08] p-5">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-[#0A84FF]" />
                <h3 className="text-sm font-semibold text-white">
                  Dicas de Saude Digital
                </h3>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  {
                    icon: Eye,
                    text: "Desative notificacoes nao essenciais",
                  },
                  {
                    icon: Moon,
                    text: "Use modo noturno apos 22h",
                  },
                  {
                    icon: Clock,
                    text: "Faca pausas de 5min a cada hora de tela",
                  },
                  {
                    icon: Smartphone,
                    text: "Evite o celular nos primeiros 30min apos acordar",
                  },
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <tip.icon className="w-4 h-4 text-[#0A84FF] mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-white/60">{tip.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </AppShell>
  );
}
