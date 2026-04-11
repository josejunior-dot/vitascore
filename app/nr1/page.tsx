"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Shield,
  FileText,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Download,
  BarChart3,
  Heart,
  Smartphone,
  Moon as MoonIcon,
  Activity,
} from "lucide-react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

// ---------------------------------------------------------------------------
// Mock aggregated data (demo — real data requires multiple users)
// ---------------------------------------------------------------------------

const MOCK_AGGREGATED = {
  wellbeingAvg: 72,
  adoptionRate: 68,
  avgScreenTimeFormatted: "3h15",
  sleepSufficientPct: 71,
  weeklyTrend: [
    { week: "Sem 1", avg: 68 },
    { week: "Sem 2", avg: 70 },
    { week: "Sem 3", avg: 65 },
    { week: "Sem 4", avg: 72 },
  ],
  riskFactors: [
    {
      label: "Uso noturno de dispositivos acima da media",
      severity: "moderate" as const,
    },
    {
      label: "32% dos funcionarios com sono insuficiente",
      severity: "moderate" as const,
    },
    {
      label: "Adesao ao programa abaixo de 70%",
      severity: "info" as const,
    },
  ],
  preventiveActions: [
    { label: "Programa de bem-estar digital ativo", done: true },
    { label: "Monitoramento de qualidade do sono", done: true },
    { label: "Check-in diario de bem-estar (WHO-5)", done: true },
    { label: "Metas de atividade fisica personalizadas", done: true },
    { label: "Canal de suporte psicologico (em implementacao)", done: false },
  ],
};

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

/* eslint-disable @typescript-eslint/no-explicit-any */
const sectionVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function wellbeingColor(value: number): string {
  if (value >= 68) return "#34A853";
  if (value >= 52) return "#F9AB00";
  return "#EA4335";
}

function barHeight(value: number, max: number): number {
  return Math.max(8, (value / max) * 100);
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function NR1Page() {
  const [lastUpdate] = useState(() =>
    new Date().toLocaleDateString("pt-BR")
  );

  const data = MOCK_AGGREGATED;
  const trendMax = Math.max(...data.weeklyTrend.map((w) => w.avg), 1);

  return (
    <AppShell>
      <div className="flex flex-col min-h-screen bg-white pb-36">
        {/* ---- Header ---- */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="sticky top-0 z-50 backdrop-blur-xl bg-white/95 shadow-sm border-b border-[#DADCE0] px-4 py-4"
        >
          <div className="flex items-center gap-2">
            <Link href="/home" className="p-1 -ml-1">
              <ChevronLeft className="w-5 h-5 text-[#5F6368]" />
            </Link>
            <h1 className="text-lg font-semibold text-[#202124]">
              Compliance NR-1
            </h1>
            <Shield className="w-4.5 h-4.5 text-[#34A853] ml-1" />
            <button className="ml-auto flex items-center gap-1.5 text-sm font-medium text-[#1A73E8] bg-[#E8F0FE] px-3 py-1.5 rounded-full">
              <Download className="w-4 h-4" />
              Exportar PGR
            </button>
          </div>
        </motion.header>

        <div className="flex flex-col gap-5 px-4 pt-6">
          {/* ---- Compliance Status Card ---- */}
          <motion.section
            custom={0}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="rounded-2xl bg-white border-2 border-[#34A853] shadow-sm overflow-hidden"
          >
            <div className="p-5 flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#34A853]/10 shrink-0">
                <CheckCircle2 className="w-7 h-7 text-[#34A853]" />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold text-[#202124]">
                  Programa de riscos psicossociais:{" "}
                  <span className="text-[#34A853]">ATIVO</span>
                </h2>
                <p className="text-sm text-[#5F6368] mt-1">
                  Ultima atualizacao: {lastUpdate}
                </p>
                <p className="text-sm text-[#5F6368]">
                  Proxima fiscalizacao: Mai 2026
                </p>
                <span className="inline-flex items-center gap-1.5 mt-2 rounded-full bg-[#34A853]/10 px-3 py-1 text-xs font-semibold text-[#34A853]">
                  <FileText className="w-3.5 h-3.5" />
                  Documentacao auditavel
                </span>
              </div>
            </div>
          </motion.section>

          {/* ---- Indicadores Agregados ---- */}
          <motion.section
            custom={1}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <h3 className="text-sm font-semibold text-[#202124] mb-3 px-1">
              Indicadores Agregados
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Bem-estar medio */}
              <IndicatorCard
                icon={<Heart className="w-5 h-5" />}
                iconColor={wellbeingColor(data.wellbeingAvg)}
                label="Bem-estar medio"
                value={`${data.wellbeingAvg}`}
                suffix="/100"
              />
              {/* Adesao */}
              <IndicatorCard
                icon={<Users className="w-5 h-5" />}
                iconColor="#1A73E8"
                label="Adesao ao programa"
                value={`${data.adoptionRate}%`}
              />
              {/* Tempo de tela */}
              <IndicatorCard
                icon={<Smartphone className="w-5 h-5" />}
                iconColor="#F9AB00"
                label="Tempo de tela medio"
                value={data.avgScreenTimeFormatted}
              />
              {/* Sono */}
              <IndicatorCard
                icon={<MoonIcon className="w-5 h-5" />}
                iconColor="#A142F4"
                label="Dormem 7h+"
                value={`${data.sleepSufficientPct}%`}
              />
            </div>
          </motion.section>

          {/* ---- Tendencia Mensal (CSS bars) ---- */}
          <motion.section
            custom={2}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="rounded-2xl bg-white border border-[#DADCE0] shadow-sm p-5"
          >
            <h3 className="text-sm font-semibold text-[#202124] mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#1A73E8]" />
              Evolucao do bem-estar (media semanal)
            </h3>

            <div className="flex items-end justify-between gap-3 h-32">
              {data.weeklyTrend.map((w, i) => {
                const hPct = barHeight(w.avg, trendMax);
                const color = wellbeingColor(w.avg);
                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <span className="text-[11px] font-semibold text-[#202124]">
                      {w.avg}
                    </span>
                    <div
                      className="w-full rounded-t-md transition-all duration-700"
                      style={{
                        height: `${hPct}%`,
                        minHeight: "8px",
                        backgroundColor: color,
                      }}
                    />
                    <span className="text-[10px] text-[#5F6368]">{w.week}</span>
                  </div>
                );
              })}
            </div>
          </motion.section>

          {/* ---- Fatores de Risco Identificados ---- */}
          <motion.section
            custom={3}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="rounded-2xl bg-white border border-[#DADCE0] shadow-sm p-5"
          >
            <h3 className="text-sm font-semibold text-[#202124] mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#F9AB00]" />
              Fatores de Risco Identificados
            </h3>
            <div className="flex flex-col gap-3">
              {data.riskFactors.map((rf, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-base mt-0.5 shrink-0">
                    {rf.severity === "moderate" ? "\u26A0\uFE0F" : "\u2139\uFE0F"}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-[#202124]">{rf.label}</p>
                    <span
                      className={`text-[11px] font-semibold ${
                        rf.severity === "moderate"
                          ? "text-[#F9AB00]"
                          : "text-[#1A73E8]"
                      }`}
                    >
                      {rf.severity === "moderate" ? "Moderado" : "Informativo"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* ---- Acoes Preventivas Implementadas ---- */}
          <motion.section
            custom={4}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="rounded-2xl bg-white border border-[#DADCE0] shadow-sm p-5"
          >
            <h3 className="text-sm font-semibold text-[#202124] mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#34A853]" />
              Acoes Preventivas Implementadas
            </h3>
            <div className="flex flex-col gap-3">
              {data.preventiveActions.map((action, i) => (
                <div key={i} className="flex items-center gap-3">
                  {action.done ? (
                    <CheckCircle2 className="w-5 h-5 text-[#34A853] shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded border-2 border-[#DADCE0] shrink-0" />
                  )}
                  <span
                    className={`text-sm ${
                      action.done ? "text-[#202124]" : "text-[#9AA0A6]"
                    }`}
                  >
                    {action.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* ---- Conformidade Legal ---- */}
          <motion.section
            custom={5}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="rounded-2xl bg-[#F1F8E9] border border-[#C5E1A5] p-5"
          >
            <h3 className="text-sm font-semibold text-[#202124] mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#34A853]" />
              Conformidade Legal
            </h3>
            <div className="flex flex-col gap-2.5 text-sm text-[#202124]">
              <p>
                Este relatorio atende aos requisitos do capitulo 1.5 da NR-1
                (Portaria MTE 1.419/2024).
              </p>
              <p>Dados coletados de forma voluntaria e anonima.</p>
              <p>
                Nenhum dado individual de funcionario e armazenado ou exibido
                neste relatorio.
              </p>
              <p>
                Documentacao gerada com hash de verificacao para auditoria.
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-medium text-[#5F6368] border border-[#C5E1A5]">
                NR-1 (Portaria MTE 1.419/2024)
              </span>
              <span className="inline-flex items-center rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-medium text-[#5F6368] border border-[#C5E1A5]">
                LGPD Art. 11
              </span>
              <span className="inline-flex items-center rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-medium text-[#5F6368] border border-[#C5E1A5]">
                RN 499 ANS
              </span>
            </div>
          </motion.section>

          {/* ---- Footer ---- */}
          <motion.section
            custom={6}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="rounded-2xl bg-[#F8F9FA] border border-[#DADCE0] p-4 flex items-center gap-3 mb-4"
          >
            <Shield className="w-5 h-5 text-[#9AA0A6] shrink-0" />
            <p className="text-xs text-[#9AA0A6]">
              Relatorio gerado automaticamente pelo SaluFlow NR-1 &middot;
              Dados agregados &middot; Conformidade LGPD
            </p>
          </motion.section>
        </div>
      </div>
    </AppShell>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function IndicatorCard({
  icon,
  iconColor,
  label,
  value,
  suffix,
}: {
  icon: React.ReactNode;
  iconColor: string;
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-xl bg-white border border-[#DADCE0] shadow-sm p-4 flex flex-col gap-2">
      <span style={{ color: iconColor }}>{icon}</span>
      <div className="flex items-baseline gap-0.5">
        <span className="text-2xl font-bold text-[#202124]">{value}</span>
        {suffix && (
          <span className="text-xs text-[#9AA0A6]">{suffix}</span>
        )}
      </div>
      <span className="text-xs text-[#5F6368]">{label}</span>
    </div>
  );
}
