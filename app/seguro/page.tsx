"use client";

import { motion } from "framer-motion";
import {
  Shield,
  ChevronLeft,
  Check,
  Circle,
  TrendingUp,
  Calendar,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import ScoreHistoryChart from "@/components/charts/ScoreHistoryChart";
import { ScoreCounter } from "@/components/score/ScoreCounter";
import {
  mockUser,
  mockDiscountHistory,
  mockInsuranceActions,
} from "@/lib/mock-data";
import {
  getDaysUntilRenewal,
  calculateAnnualSavings,
} from "@/lib/vitascore";

const daysUntilRenewal = getDaysUntilRenewal(mockUser.renewalDate);
const annualSavings = calculateAnnualSavings(
  mockUser.premiumMonthly,
  mockUser.insuranceDiscount
);

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Gauge SVG constants
const GAUGE_RADIUS = 100;
const GAUGE_STROKE = 16;
const GAUGE_CX = 130;
const GAUGE_CY = 120;
const MAX_DISCOUNT = 15;
const CURRENT_DISCOUNT = mockUser.insuranceDiscount;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

function DiscountGauge() {
  // Arc goes from 180 (left) to 0 (right) — a semicircle
  const startAngle = 180;
  const endAngle = 0;
  const totalSweep = 180;

  // Zone boundaries (percentage of MAX_DISCOUNT)
  const zone1End = (5 / MAX_DISCOUNT) * totalSweep; // 0-5% red
  const zone2End = (10 / MAX_DISCOUNT) * totalSweep; // 5-10% amber

  // Needle angle
  const needleFraction = Math.min(CURRENT_DISCOUNT / MAX_DISCOUNT, 1);
  const needleAngle = startAngle - needleFraction * totalSweep;
  const needleTip = polarToCartesian(GAUGE_CX, GAUGE_CY, GAUGE_RADIUS - 8, needleAngle);

  // Label positions
  const labels = [
    { value: "0%", angle: 180 },
    { value: "5%", angle: 180 - zone1End },
    { value: "10%", angle: 180 - zone2End },
    { value: "15%", angle: 0 },
  ];

  return (
    <svg viewBox="0 0 260 150" className="w-full max-w-[300px] mx-auto">
      {/* Red zone: 0-5% */}
      <path
        d={describeArc(GAUGE_CX, GAUGE_CY, GAUGE_RADIUS, startAngle - zone1End, startAngle)}
        fill="none"
        stroke="#FF453A"
        strokeWidth={GAUGE_STROKE}
        strokeLinecap="round"
      />
      {/* Amber zone: 5-10% */}
      <path
        d={describeArc(GAUGE_CX, GAUGE_CY, GAUGE_RADIUS, startAngle - zone2End, startAngle - zone1End)}
        fill="none"
        stroke="#FF9F0A"
        strokeWidth={GAUGE_STROKE}
        strokeLinecap="butt"
      />
      {/* Green zone: 10-15% */}
      <path
        d={describeArc(GAUGE_CX, GAUGE_CY, GAUGE_RADIUS, endAngle, startAngle - zone2End)}
        fill="none"
        stroke="#30D158"
        strokeWidth={GAUGE_STROKE}
        strokeLinecap="round"
      />

      {/* Needle */}
      <line
        x1={GAUGE_CX}
        y1={GAUGE_CY}
        x2={needleTip.x}
        y2={needleTip.y}
        stroke="#FFFFFF"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <circle cx={GAUGE_CX} cy={GAUGE_CY} r={6} fill="#FFFFFF" />

      {/* Labels */}
      {labels.map((l) => {
        const pos = polarToCartesian(GAUGE_CX, GAUGE_CY, GAUGE_RADIUS + 22, l.angle);
        return (
          <text
            key={l.value}
            x={pos.x}
            y={pos.y}
            fill="#FFFFFFAA"
            fontSize="12"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {l.value}
          </text>
        );
      })}
    </svg>
  );
}

export default function SeguroPage() {
  return (
    <AppShell>
      <motion.div
        className="flex flex-col gap-4 px-4 pt-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <Link href="/home" className="flex items-center gap-1 text-white/70">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-lg font-semibold text-white flex items-center gap-2">
            Seguro
            <Shield size={20} className="text-[#1877F2]" />
          </h1>
          <div className="w-6" />
        </motion.div>

        {/* Hero Card — Desconto Atual */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-2xl p-6"
          style={{
            background: "linear-gradient(135deg, #0A1628 0%, #1A2B4A 50%, #0F1E36 100%)",
            boxShadow: "0 0 40px rgba(24,119,242,0.3)",
          }}
        >
          <div className="flex flex-col items-center text-center gap-2">
            <ScoreCounter
              value={11}
              suffix="%"
              className="text-6xl font-mono-score text-[#30D158]"
            />
            <p className="text-white/70 text-sm">
              de desconto na próxima renovação
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs text-white/60">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                Renova em {daysUntilRenewal} dias
              </span>
            </div>
            <p className="text-[#30D158] text-sm font-medium mt-1 flex items-center gap-1">
              <TrendingUp size={14} />
              R$ {annualSavings.toFixed(2).replace(".", ",")} / ano de economia
            </p>
          </div>
        </motion.div>

        {/* Gauge Semicircular */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl bg-[#1C1C1E] p-4"
        >
          <DiscountGauge />
        </motion.div>

        {/* Como aumentar o desconto */}
        <motion.div variants={itemVariants} className="flex flex-col gap-2">
          <h2 className="text-white font-semibold text-base px-1">
            Como aumentar o desconto
          </h2>
          <div className="flex flex-col gap-2">
            {mockInsuranceActions.map((action) => (
              <motion.div
                key={action.id}
                variants={itemVariants}
                className="flex items-center gap-3 rounded-xl bg-[#1C1C1E] p-4"
              >
                {action.completed ? (
                  <div className="flex-shrink-0 rounded-full bg-[#30D158]/20 p-1">
                    <Check size={18} className="text-[#30D158]" />
                  </div>
                ) : (
                  <div className="flex-shrink-0 p-1">
                    <Circle size={18} className="text-white/30" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      action.completed ? "text-white/50 line-through" : "text-white"
                    }`}
                  >
                    {action.title}
                  </p>
                </div>
                <div className="flex flex-col items-end text-xs flex-shrink-0">
                  <span className="text-[#1877F2]">+{action.points} pts</span>
                  <span className="text-[#30D158]">+{action.discountPercent}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Histórico de Descontos */}
        <motion.div variants={itemVariants} className="flex flex-col gap-2">
          <h2 className="text-white font-semibold text-base px-1">
            Histórico de Descontos
          </h2>
          <div className="rounded-2xl bg-[#1C1C1E] p-4">
            <ScoreHistoryChart data={[]} discountData={mockDiscountHistory} />
          </div>
        </motion.div>

        {/* Card de Apólice */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl bg-[#1C1C1E] p-5 flex flex-col gap-3 mb-4"
        >
          <div className="flex items-center gap-2 mb-1">
            <CreditCard size={18} className="text-[#1877F2]" />
            <h2 className="text-white font-semibold text-base">Apólice</h2>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/50">Número</span>
              <span className="text-white font-mono">SL-2024-••••91</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Seguradora</span>
              <span className="text-white">{mockUser.insurer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Próximo pagamento</span>
              <span className="text-white">15/05/2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Mensalidade</span>
              <span className="text-white font-medium">
                R$ {mockUser.premiumMonthly.toFixed(2).replace(".", ",")}/mês
              </span>
            </div>
          </div>
          <button className="mt-2 w-full rounded-xl border border-[#1877F2]/30 py-3 text-sm font-medium text-[#1877F2] transition-colors hover:bg-[#1877F2]/10">
            Ver apólice completa
          </button>
        </motion.div>
      </motion.div>
    </AppShell>
  );
}
