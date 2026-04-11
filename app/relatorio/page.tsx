"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Download,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  Shield,
  Activity,
  Moon as MoonIcon,
  UtensilsCrossed,
  Smartphone,
  Scale,
  Heart,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  FileText,
} from "lucide-react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import {
  HRReportGenerator,
  CompanyHealthReport,
} from "@/lib/reports/hr-report";

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

function TrendIcon({ trend }: { trend: "up" | "stable" | "down" }) {
  if (trend === "up")
    return <TrendingUp className="w-4 h-4 text-[#34A853]" />;
  if (trend === "down")
    return <TrendingDown className="w-4 h-4 text-[#EA4335]" />;
  return <Minus className="w-4 h-4 text-[#9AA0A6]" />;
}

function metricColor(
  value: number,
  good: [number, number],
  invert = false
): string {
  // good range = green, moderate = amber, bad = red
  if (!invert) {
    if (value >= good[1]) return "#34A853";
    if (value >= good[0]) return "#F9AB00";
    return "#EA4335";
  }
  // inverted — lower is better (e.g. screen time)
  if (value <= good[0]) return "#34A853";
  if (value <= good[1]) return "#F9AB00";
  return "#EA4335";
}

function formatNumber(n: number): string {
  return n.toLocaleString("pt-BR");
}

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------

function Skeleton() {
  return (
    <div className="flex flex-col gap-5 px-4 pt-6 animate-pulse">
      <div className="h-28 bg-[#E8EAED] rounded-2xl" />
      <div className="h-40 bg-[#E8EAED] rounded-2xl" />
      <div className="h-24 bg-[#E8EAED] rounded-2xl" />
      <div className="grid grid-cols-2 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-24 bg-[#E8EAED] rounded-xl" />
        ))}
      </div>
      <div className="h-48 bg-[#E8EAED] rounded-2xl" />
      <div className="h-48 bg-[#E8EAED] rounded-2xl" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function RelatorioPage() {
  const [report, setReport] = useState<CompanyHealthReport | null>(null);

  useEffect(() => {
    HRReportGenerator.generateReport("Empresa Demo").then(setReport);
  }, []);

  // Score ring helpers
  const scoreRadius = 60;
  const scoreCircumference = 2 * Math.PI * scoreRadius;
  const scorePct = report ? report.avgVitaScore / 1000 : 0;
  const scoreOffset = scoreCircumference * (1 - scorePct);

  // Distribution bar total
  const distTotal = report
    ? report.scoreDistribution.platinum +
      report.scoreDistribution.gold +
      report.scoreDistribution.silver +
      report.scoreDistribution.bronze
    : 1;

  // Monthly trend max for bar heights
  const trendMax = report
    ? Math.max(...report.monthlyTrend.map((m) => m.avgScore), 1)
    : 1;

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
              Relatório RH
            </h1>
            <FileText className="w-4.5 h-4.5 text-[#9AA0A6] ml-1" />
            <button className="ml-auto flex items-center gap-1.5 text-sm font-medium text-[#1A73E8] bg-[#E8F0FE] px-3 py-1.5 rounded-full">
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </motion.header>

        {!report ? (
          <Skeleton />
        ) : (
          <div className="flex flex-col gap-5 px-4 pt-6">
            {/* ---- Company Header Card ---- */}
            <motion.section
              custom={0}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="rounded-2xl bg-white border border-[#DADCE0] shadow-sm overflow-hidden"
            >
              {/* Blue accent bar */}
              <div className="h-1.5 bg-[#1A73E8]" />
              <div className="p-5">
                <h2 className="text-xl font-bold text-[#202124]">
                  {report.companyName}
                </h2>
                <p className="text-sm text-[#5F6368] mt-1">
                  {report.period} &middot; Gerado em{" "}
                  {new Date(report.reportDate).toLocaleDateString("pt-BR")}
                </p>

                {/* Adoption */}
                <div className="mt-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#1A73E8]" />
                  <span className="text-sm text-[#202124] font-medium">
                    {report.activeUsers} de {report.totalEmployees} funcionários
                    &middot; {report.adoptionRate}% de adesão
                  </span>
                </div>
                <div className="mt-2 w-full h-2.5 bg-[#E8EAED] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1A73E8] rounded-full transition-all duration-700"
                    style={{ width: `${report.adoptionRate}%` }}
                  />
                </div>
              </div>
            </motion.section>

            {/* ---- VitaScore Médio ---- */}
            <motion.section
              custom={1}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="rounded-2xl bg-[#F8F9FA] border border-[#DADCE0] p-6 flex flex-col items-center gap-3"
            >
              <span className="text-xs font-semibold text-[#5F6368] uppercase tracking-wider">
                SaluFlow Médio
              </span>

              {/* Ring */}
              <div className="relative">
                <svg width="148" height="148" className="-rotate-90">
                  <circle
                    cx="74"
                    cy="74"
                    r={scoreRadius}
                    fill="none"
                    stroke="#E8EAED"
                    strokeWidth="10"
                  />
                  <circle
                    cx="74"
                    cy="74"
                    r={scoreRadius}
                    fill="none"
                    stroke="#1A73E8"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={scoreCircumference}
                    strokeDashoffset={scoreOffset}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-5xl font-bold text-[#202124] leading-none">
                    {report.avgVitaScore}
                  </span>
                  <span className="text-xs text-[#9AA0A6]">/1000</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-sm text-[#34A853]">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">+15 vs mês anterior</span>
              </div>
            </motion.section>

            {/* ---- Score Distribution ---- */}
            <motion.section
              custom={2}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="rounded-2xl bg-white border border-[#DADCE0] shadow-sm p-5"
            >
              <h3 className="text-sm font-semibold text-[#202124] mb-4">
                Distribuição de Scores
              </h3>

              {/* Stacked bar */}
              <div className="w-full flex rounded-full overflow-hidden h-6">
                {[
                  {
                    key: "platinum",
                    count: report.scoreDistribution.platinum,
                    color: "#1A73E8",
                    label: "Platina",
                  },
                  {
                    key: "gold",
                    count: report.scoreDistribution.gold,
                    color: "#F9AB00",
                    label: "Ouro",
                  },
                  {
                    key: "silver",
                    count: report.scoreDistribution.silver,
                    color: "#9AA0A6",
                    label: "Prata",
                  },
                  {
                    key: "bronze",
                    count: report.scoreDistribution.bronze,
                    color: "#D2845A",
                    label: "Bronze",
                  },
                ].map((seg) => (
                  <div
                    key={seg.key}
                    className="h-full flex items-center justify-center text-[10px] font-bold text-white transition-all duration-700"
                    style={{
                      width: `${(seg.count / distTotal) * 100}%`,
                      backgroundColor: seg.color,
                    }}
                  >
                    {seg.count}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
                {[
                  {
                    color: "#1A73E8",
                    label: "Platina",
                    range: "850-1000",
                    count: report.scoreDistribution.platinum,
                  },
                  {
                    color: "#F9AB00",
                    label: "Ouro",
                    range: "600-849",
                    count: report.scoreDistribution.gold,
                  },
                  {
                    color: "#9AA0A6",
                    label: "Prata",
                    range: "300-599",
                    count: report.scoreDistribution.silver,
                  },
                  {
                    color: "#D2845A",
                    label: "Bronze",
                    range: "0-299",
                    count: report.scoreDistribution.bronze,
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-[#5F6368]">
                      {item.label} ({item.range}):{" "}
                      <strong>{item.count}</strong>
                    </span>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* ---- Pilares de Saúde ---- */}
            <motion.section
              custom={3}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-sm font-semibold text-[#202124] mb-3">
                Pilares de Saúde
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {/* Movement */}
                <PillarCard
                  icon={<Activity className="w-5 h-5" />}
                  iconColor="#34A853"
                  label="Movimento"
                  score={report.pillars.movement.avg}
                  max={report.pillars.movement.max}
                  trend={report.pillars.movement.trend}
                />
                {/* Sleep */}
                <PillarCard
                  icon={<MoonIcon className="w-5 h-5" />}
                  iconColor="#A142F4"
                  label="Sono"
                  score={report.pillars.sleep.avg}
                  max={report.pillars.sleep.max}
                  trend={report.pillars.sleep.trend}
                />
                {/* Nutrition */}
                <PillarCard
                  icon={<UtensilsCrossed className="w-5 h-5" />}
                  iconColor="#F9AB00"
                  label="Nutrição"
                  score={report.pillars.nutrition.avg}
                  max={report.pillars.nutrition.max}
                  trend={report.pillars.nutrition.trend}
                />
                {/* Digital */}
                <PillarCard
                  icon={<Smartphone className="w-5 h-5" />}
                  iconColor="#1A73E8"
                  label="Digital"
                  score={report.pillars.digital.avg}
                  max={report.pillars.digital.max}
                  trend={report.pillars.digital.trend}
                />
                {/* Weight */}
                <PillarCard
                  icon={<Scale className="w-5 h-5" />}
                  iconColor="#00897B"
                  label="Peso"
                  score={report.pillars.weight.normalPct}
                  max={100}
                  trend={report.pillars.weight.trend}
                  suffix="%"
                  subtitle={`IMC médio: ${report.pillars.weight.avgBmi}`}
                />
                {/* Engagement */}
                <PillarCard
                  icon={<Heart className="w-5 h-5" />}
                  iconColor="#EA4335"
                  label="Engajamento"
                  score={report.adoptionRate}
                  max={100}
                  trend="up"
                  suffix="%"
                />
              </div>
            </motion.section>

            {/* ---- Métricas Chave ---- */}
            <motion.section
              custom={4}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="rounded-2xl bg-white border border-[#DADCE0] shadow-sm p-5"
            >
              <h3 className="text-sm font-semibold text-[#202124] mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#1A73E8]" />
                Métricas Chave
              </h3>
              <div className="flex flex-col gap-3">
                <MetricRow
                  icon={<Activity className="w-4 h-4" />}
                  label="Passos médios/dia"
                  value={formatNumber(report.metrics.avgDailySteps)}
                  color={metricColor(
                    report.metrics.avgDailySteps,
                    [5000, 7500]
                  )}
                />
                <MetricRow
                  icon={<MoonIcon className="w-4 h-4" />}
                  label="Sono médio"
                  value={`${report.metrics.avgSleepHours.toLocaleString("pt-BR")}h`}
                  color={metricColor(report.metrics.avgSleepHours, [6, 7])}
                />
                <MetricRow
                  icon={<Shield className="w-4 h-4" />}
                  label="Confiança do sono"
                  value={`${report.metrics.avgSleepConfidence}%`}
                  color={metricColor(
                    report.metrics.avgSleepConfidence,
                    [60, 75]
                  )}
                />
                <MetricRow
                  icon={<Smartphone className="w-4 h-4" />}
                  label="Tempo de tela"
                  value={`${Math.floor(report.metrics.avgScreenTimeMinutes / 60)}h${String(report.metrics.avgScreenTimeMinutes % 60).padStart(2, "0")}`}
                  color={metricColor(
                    report.metrics.avgScreenTimeMinutes,
                    [120, 180],
                    true
                  )}
                />
                <MetricRow
                  icon={<UtensilsCrossed className="w-4 h-4" />}
                  label="Refeições verificadas por foto"
                  value={`${report.metrics.photoVerifiedMealsPct}%`}
                  color={metricColor(
                    report.metrics.photoVerifiedMealsPct,
                    [30, 60]
                  )}
                />
                <MetricRow
                  icon={<Scale className="w-4 h-4" />}
                  label="Pesagem semanal"
                  value={`${report.metrics.weeklyWeighPct}%`}
                  color={metricColor(report.metrics.weeklyWeighPct, [40, 60])}
                />
              </div>
            </motion.section>

            {/* ---- Redução de Risco ---- */}
            <motion.section
              custom={5}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="rounded-2xl bg-white border border-[#DADCE0] shadow-sm overflow-hidden"
            >
              {/* Green accent bar */}
              <div className="h-1.5 bg-[#34A853]" />
              <div className="p-5">
                <h3 className="text-sm font-semibold text-[#202124] mb-3">
                  Redução de Risco
                </h3>

                <div className="text-3xl font-bold text-[#34A853]">
                  R${" "}
                  {report.riskReduction.projectedAnnualSavings.toLocaleString(
                    "pt-BR"
                  )}
                  <span className="text-base font-medium text-[#5F6368]">
                    /ano
                  </span>
                </div>
                <p className="text-sm text-[#5F6368] mt-1">
                  {report.riskReduction.estimatedSavingsPercent}% de redução
                  projetada nos sinistros
                </p>

                {/* Risk factors */}
                <div className="mt-4 flex flex-col gap-2">
                  <span className="text-xs font-semibold text-[#5F6368] uppercase tracking-wider">
                    Fatores de Risco
                  </span>
                  {report.riskReduction.topRiskFactors.map((factor, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-[#F9AB00] mt-0.5 shrink-0" />
                      <span className="text-sm text-[#202124]">{factor}</span>
                    </div>
                  ))}
                </div>

                {/* Improvements */}
                <div className="mt-4 flex flex-col gap-2">
                  <span className="text-xs font-semibold text-[#5F6368] uppercase tracking-wider">
                    Melhorias
                  </span>
                  {report.riskReduction.improvements.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#34A853] mt-0.5 shrink-0" />
                      <span className="text-sm text-[#202124]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* ---- Tendência Mensal ---- */}
            <motion.section
              custom={6}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="rounded-2xl bg-white border border-[#DADCE0] shadow-sm p-5"
            >
              <h3 className="text-sm font-semibold text-[#202124] mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#1A73E8]" />
                Tendência Mensal
              </h3>

              <div className="flex items-end justify-between gap-2 h-36">
                {report.monthlyTrend.map((m, i) => {
                  const heightPct = (m.avgScore / trendMax) * 100;
                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <span className="text-[10px] font-semibold text-[#202124]">
                        {m.avgScore}
                      </span>
                      <div
                        className="w-full rounded-t-md bg-[#1A73E8] transition-all duration-700"
                        style={{
                          height: `${heightPct}%`,
                          minHeight: "8px",
                          opacity:
                            i === report.monthlyTrend.length - 1 ? 1 : 0.6,
                        }}
                      />
                      <span className="text-[10px] text-[#5F6368]">
                        {m.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.section>

            {/* ---- Conformidade LGPD ---- */}
            <motion.section
              custom={7}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="rounded-2xl bg-[#E8F5E9] border border-[#A5D6A7] p-5"
            >
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-[#2E7D32] shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1.5">
                  <p className="text-sm font-semibold text-[#202124]">
                    Conformidade LGPD
                  </p>
                  <p className="text-xs text-[#202124]">
                    Este relatorio contem apenas dados agregados. Nenhum dado
                    individual de funcionario e coletado, armazenado ou exibido.
                  </p>
                  <p className="text-xs text-[#5F6368]">
                    Bonificacao baseada em participacao, nao em resultados
                    individuais (RN 499 ANS). Nenhum score individual e visivel
                    para o RH.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* ---- Footer Hash ---- */}
            <motion.section
              custom={8}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="rounded-2xl bg-[#F8F9FA] border border-[#DADCE0] p-4 flex items-center gap-3"
            >
              <Shield className="w-5 h-5 text-[#9AA0A6] shrink-0" />
              <p className="text-xs text-[#9AA0A6]">
                Dados anonimizados &middot; Conformidade LGPD &middot; Hash de
                verificacao:{" "}
                <span className="font-mono">
                  {report.reportDate.replace(/-/g, "")}
                  -a3f8
                </span>
              </p>
            </motion.section>
          </div>
        )}
      </div>
    </AppShell>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function PillarCard({
  icon,
  iconColor,
  label,
  score,
  max,
  trend,
  suffix = "",
  subtitle,
}: {
  icon: React.ReactNode;
  iconColor: string;
  label: string;
  score: number;
  max: number;
  trend: "up" | "stable" | "down";
  suffix?: string;
  subtitle?: string;
}) {
  const pct = (score / max) * 100;
  return (
    <div className="rounded-xl bg-white border border-[#DADCE0] shadow-sm p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span style={{ color: iconColor }}>{icon}</span>
          <span className="text-xs font-semibold text-[#202124]">{label}</span>
        </div>
        <TrendIcon trend={trend} />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-[#202124]">
          {score}
          {suffix}
        </span>
        {!suffix && (
          <span className="text-xs text-[#9AA0A6]">/{max}</span>
        )}
      </div>
      {/* Mini bar */}
      <div className="w-full h-1.5 bg-[#E8EAED] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: iconColor }}
        />
      </div>
      {subtitle && (
        <span className="text-[10px] text-[#9AA0A6]">{subtitle}</span>
      )}
    </div>
  );
}

function MetricRow({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <span className="text-[#9AA0A6]">{icon}</span>
        <span className="text-sm text-[#202124]">{label}</span>
      </div>
      <span className="text-sm font-bold" style={{ color }}>
        {value}
      </span>
    </div>
  );
}
