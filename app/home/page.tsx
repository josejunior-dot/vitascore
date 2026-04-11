"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Info, ChevronRight } from "lucide-react";
import Link from "next/link";

import AppShell from "@/components/layout/AppShell";
import ChallengeCard from "@/components/gamification/ChallengeCard";

import {
  mockTodayStats,
  mockChallenges,
  mockRecentActivity,
  mockRanking,
} from "@/lib/mock-data";
import { useHealthData } from "@/hooks/useHealthData";
import { getUserProfile, type UserProfile } from "@/lib/user-profile";

/* eslint-disable @typescript-eslint/no-explicit-any */
const sectionVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

/* ── SVG Dual Ring (Google Fit style) ── */
function DualRing({
  outerValue,
  outerMax,
  innerValue,
  innerMax,
}: {
  outerValue: number;
  outerMax: number;
  innerValue: number;
  innerMax: number;
}) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;

  // Outer ring
  const outerR = 95;
  const outerStroke = 14;
  const outerCircumference = 2 * Math.PI * outerR;
  const outerPct = Math.min(outerValue / outerMax, 1);
  const outerOffset = outerCircumference * (1 - outerPct);

  // Inner ring
  const innerR = 72;
  const innerStroke = 14;
  const innerCircumference = 2 * Math.PI * innerR;
  const innerPct = Math.min(innerValue / innerMax, 1);
  const innerOffset = innerCircumference * (1 - innerPct);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Outer track */}
      <circle
        cx={cx}
        cy={cy}
        r={outerR}
        fill="none"
        stroke="#E8F0FE"
        strokeWidth={outerStroke}
        strokeLinecap="round"
      />
      {/* Outer fill */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={outerR}
        fill="none"
        stroke="#1A73E8"
        strokeWidth={outerStroke}
        strokeLinecap="round"
        strokeDasharray={outerCircumference}
        initial={{ strokeDashoffset: outerCircumference }}
        animate={{ strokeDashoffset: outerOffset }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      {/* Inner track */}
      <circle
        cx={cx}
        cy={cy}
        r={innerR}
        fill="none"
        stroke="#E0F2F1"
        strokeWidth={innerStroke}
        strokeLinecap="round"
      />
      {/* Inner fill */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={innerR}
        fill="none"
        stroke="#00897B"
        strokeWidth={innerStroke}
        strokeLinecap="round"
        strokeDasharray={innerCircumference}
        initial={{ strokeDashoffset: innerCircumference }}
        animate={{ strokeDashoffset: innerOffset }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      {/* Center text */}
      <text
        x={cx}
        y={cy - 6}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#00897B"
        fontSize="36"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        {innerValue.toLocaleString("pt-BR")}
      </text>
      <text
        x={cx}
        y={cy + 22}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#5F6368"
        fontSize="13"
        fontFamily="system-ui, sans-serif"
      >
        passos
      </text>
    </svg>
  );
}

/* ── Goal bar ── */
function GoalBar({
  label,
  icon,
  current,
  goal,
  unit,
  color,
}: {
  label: string;
  icon: string;
  current: number;
  goal: number;
  unit: string;
  color: string;
}) {
  const pct = Math.min((current / goal) * 100, 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-lg w-6 text-center">{icon}</span>
      <div className="flex-1">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-sm text-[#202124] font-medium">{label}</span>
          <span className="text-xs text-[#5F6368]">
            {current}{unit} / {goal}{unit}
          </span>
        </div>
        <div className="h-2 bg-[#F1F3F4] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { summary, loading, water, meals, source } = useHealthData();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    getUserProfile().then(setUser);
  }, []);

  const activeChallenge = mockChallenges.active[0];
  const userScore = user?.score ?? 742;

  // Real data with mock fallbacks
  const stepsData = {
    steps: summary?.steps.steps ?? mockTodayStats.steps.current,
    goal: 10000,
    km: summary?.steps.distance ?? mockTodayStats.steps.km,
  };

  const sleepData = summary?.sleep
    ? {
        hours: Math.floor(summary.sleep.totalMinutes / 60),
        minutes: summary.sleep.totalMinutes % 60,
      }
    : {
        hours: mockTodayStats.sleep.hours,
        minutes: mockTodayStats.sleep.minutes,
      };

  const waterData = {
    current: water.liters || mockTodayStats.water.current,
    goal: 2.5,
  };

  const nutritionData = {
    current: meals.length || mockTodayStats.meals.current,
    goal: 3,
  };

  const userName = user?.name ?? "Carlos";
  const firstLetter = userName.charAt(0).toUpperCase();

  // Estimate calories & active minutes from steps
  const estimatedCal = Math.round(stepsData.steps * 0.04);
  const estimatedMin = Math.round(stepsData.steps / 130);

  return (
    <AppShell>
      <div className="flex flex-col min-h-screen pb-24 bg-white">
        {/* ── Header (clean, minimal) ── */}
        <header className="sticky top-0 z-50 bg-white px-4 pt-4 pb-3 flex items-center justify-between">
          <img src="/logo.png" alt="SaluFlow" className="h-8 object-contain" />
          <div className="flex items-center gap-3">
            {!loading && source && source !== "loading" && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#E8F0FE] text-[#1A73E8]">
                {source}
              </span>
            )}
            <Link href="/perfil" className="p-1 text-[#5F6368]">
              <Info className="w-5 h-5" />
            </Link>
            <Link
              href="/perfil"
              className="w-9 h-9 rounded-full bg-[#1A73E8] flex items-center justify-center"
            >
              <span className="text-white text-sm font-semibold">{firstLetter}</span>
            </Link>
          </div>
        </header>

        <div className="flex flex-col gap-6 px-4 pt-2">
          {/* ── Hero — Dual Ring (Google Fit style) ── */}
          <motion.section
            custom={0}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center pt-2 pb-2"
          >
            {loading ? (
              <div className="w-[220px] h-[220px] rounded-full bg-[#F1F3F4] animate-pulse" />
            ) : (
              <DualRing
                outerValue={userScore}
                outerMax={1000}
                innerValue={stepsData.steps}
                innerMax={stepsData.goal}
              />
            )}

            {/* Ring labels */}
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#1A73E8]" />
                <span className="text-xs text-[#5F6368] font-medium">
                  Pontos cardio
                </span>
                <span className="text-xs text-[#202124] font-bold ml-0.5">
                  {userScore}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#00897B]" />
                <span className="text-xs text-[#5F6368] font-medium">
                  Passos
                </span>
                <span className="text-xs text-[#202124] font-bold ml-0.5">
                  {stepsData.steps.toLocaleString("pt-BR")}
                </span>
              </div>
            </div>

            {/* 3 metrics row */}
            <div className="flex items-center gap-0 mt-4 text-center">
              <div className="flex-1 border-r border-[#DADCE0] px-4">
                <p className="text-lg font-bold text-[#202124]">{estimatedCal}</p>
                <p className="text-[11px] text-[#9AA0A6]">Cal</p>
              </div>
              <div className="flex-1 border-r border-[#DADCE0] px-4">
                <p className="text-lg font-bold text-[#202124]">{stepsData.km.toFixed(1)}</p>
                <p className="text-[11px] text-[#9AA0A6]">km</p>
              </div>
              <div className="flex-1 px-4">
                <p className="text-lg font-bold text-[#202124]">{estimatedMin}</p>
                <p className="text-[11px] text-[#9AA0A6]">Min. em movimento</p>
              </div>
            </div>
          </motion.section>

          {/* ── Quick Actions Row ── */}
          <motion.section
            custom={1}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
              {[
                { href: "/metas", label: "Metas", icon: "🎯" },
                { href: "/checkin", label: "Bem-estar", icon: "💚" },
                { href: "/sono", label: "Sono", icon: "🌙" },
                { href: "/nutricao", label: "Nutrição", icon: "🥗" },
                { href: "/peso", label: "Peso", icon: "⚖️" },
                { href: "/digital", label: "Digital", icon: "📱" },
                { href: "/monitorar", label: "Treino", icon: "🗺️" },
                { href: "/nr1", label: "NR-1", icon: "🛡️" },
                { href: "/desafios", label: "Desafios", icon: "🏆" },
                { href: "/relatorio", label: "RH", icon: "📊" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex-shrink-0 flex items-center gap-2 bg-[#F1F3F4] rounded-full px-4 py-2.5 transition-colors hover:bg-[#E8EAED] active:bg-[#DADCE0]"
                >
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-xs text-[#202124] font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </motion.section>

          {/* ── Metas Diarias Card ── */}
          <motion.section
            custom={2}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <div
              className="rounded-2xl bg-white p-5"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-[#202124]">
                  Suas metas diarias
                </h2>
                <Link href="/atividade" className="text-[#5F6368]">
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>

              {loading ? (
                <div className="flex flex-col gap-4">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="h-8 rounded bg-[#F1F3F4] animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <GoalBar
                    label="Passos"
                    icon="👟"
                    current={stepsData.steps}
                    goal={stepsData.goal}
                    unit=""
                    color="#00897B"
                  />
                  <GoalBar
                    label="Sono"
                    icon="🌙"
                    current={sleepData.hours}
                    goal={mockTodayStats.sleep.goal}
                    unit="h"
                    color="#7B61FF"
                  />
                  <GoalBar
                    label="Agua"
                    icon="💧"
                    current={waterData.current}
                    goal={waterData.goal}
                    unit="L"
                    color="#1A73E8"
                  />
                  <GoalBar
                    label="Refeicoes"
                    icon="🥗"
                    current={nutritionData.current}
                    goal={nutritionData.goal}
                    unit=""
                    color="#FF9F0A"
                  />
                </div>
              )}
            </div>
          </motion.section>

          {/* ── Desafio da Semana ── */}
          {activeChallenge && (
            <motion.section
              custom={2.5}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-base font-semibold text-[#202124] mb-3">
                Desafio da Semana
              </h2>
              <ChallengeCard challenge={activeChallenge} />
            </motion.section>
          )}

          {/* ── Atividade Recente ── */}
          <motion.section
            custom={3}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-base font-semibold text-[#202124] mb-3">
              Atividade Recente
            </h2>
            <div className="bg-white">
              {mockRecentActivity.map((activity, idx) => (
                <div
                  key={activity.id}
                  className={`flex items-center gap-3 py-3 ${
                    idx < mockRecentActivity.length - 1
                      ? "border-b border-[#DADCE0]"
                      : ""
                  }`}
                >
                  <span className="text-xl w-8 text-center">{activity.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#202124]">{activity.description}</p>
                    <p className="text-xs text-[#9AA0A6]">{activity.time}</p>
                  </div>
                  <span className="text-sm font-semibold text-[#00897B] whitespace-nowrap">
                    +{activity.points} pts
                  </span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* ── Ranking de Segurados ── */}
          <motion.section
            custom={4}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-base font-semibold text-[#202124]">
                Ranking de Segurados
              </h2>
              <span className="text-xs text-[#9AA0A6]">Esta semana</span>
            </div>
            <div
              className="rounded-2xl bg-white overflow-hidden"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
            >
              {mockRanking.map((entry, idx) => {
                const medal =
                  entry.position === 1
                    ? "\u{1F947}"
                    : entry.position === 2
                      ? "\u{1F948}"
                      : entry.position === 3
                        ? "\u{1F949}"
                        : null;

                return (
                  <div
                    key={entry.position}
                    className={`flex items-center gap-3 px-4 py-3 ${
                      idx < mockRanking.length - 1 ? "border-b border-[#DADCE0]" : ""
                    } ${entry.isUser ? "bg-[#E8F0FE]" : ""}`}
                  >
                    <span className="w-8 text-center text-sm font-bold text-[#5F6368]">
                      {medal ?? `${entry.position}o`}
                    </span>
                    <span
                      className={`flex-1 text-sm ${
                        entry.isUser
                          ? "text-[#1A73E8] font-semibold"
                          : "text-[#202124]"
                      }`}
                    >
                      {entry.name}
                      {entry.isUser && (
                        <span className="ml-1.5 text-[10px] text-[#1A73E8] font-medium">
                          (voce)
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-sm font-bold text-[#202124]">
                      {entry.score}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.section>
        </div>
      </div>
    </AppShell>
  );
}
