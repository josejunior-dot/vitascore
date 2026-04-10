"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import Link from "next/link";

import AppShell from "@/components/layout/AppShell";
import { VitaScoreRing } from "@/components/score/VitaScoreRing";
import { ScoreBadge } from "@/components/score/ScoreBadge";
import StreakBadge from "@/components/gamification/StreakBadge";
import ActivityCard from "@/components/cards/ActivityCard";
import SleepCard from "@/components/cards/SleepCard";
import NutritionCard from "@/components/cards/NutritionCard";
import WaterCard from "@/components/cards/WaterCard";
import InsuranceDiscountCard from "@/components/cards/InsuranceDiscountCard";
import ChallengeCard from "@/components/gamification/ChallengeCard";

import {
  mockTodayStats,
  mockChallenges,
  mockRecentActivity,
  mockRanking,
  mockNotifications,
} from "@/lib/mock-data";
import { getDayProgress } from "@/lib/vitascore";
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

const todayFormatted = new Date().toLocaleDateString("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export default function HomePage() {
  const { summary, loading, water, meals, source } = useHealthData();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    getUserProfile().then(setUser);
  }, []);

  const dayProgress = getDayProgress(mockTodayStats);
  const activeChallenge = mockChallenges.active[0];
  const userScore = user?.score ?? 0;
  const userStatus = user?.status ?? "bronze";
  const userStreak = user?.streak ?? 0;

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

  return (
    <AppShell>
      <div className="flex flex-col min-h-screen pb-24">
        {/* Header sticky */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/70 border-b border-white/[0.06] px-4 pt-4 pb-2">
          <div className="flex items-center justify-between mb-2">
            <h1 className="font-display text-xl font-bold text-white">
              VitaScore
            </h1>
            <Link href="/notificacoes" className="relative p-2">
              <Bell className="w-5 h-5 text-white/70" />
              {mockNotifications > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full">
                  {mockNotifications}
                </span>
              )}
            </Link>
          </div>
          {/* Day progress bar */}
          <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${dayProgress}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            />
          </div>
          <p className="text-[11px] text-white/40 mt-1 text-right">
            {dayProgress}% do dia concluído
          </p>
        </header>

        <div className="flex flex-col gap-6 px-4 pt-6">
          {/* Hero — VitaScore Principal */}
          <motion.section
            custom={0}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="relative rounded-2xl backdrop-blur-xl bg-white/5 border border-white/[0.08] p-6 overflow-hidden"
            style={{
              boxShadow: "0 0 40px rgba(24,119,242,0.15), 0 0 80px rgba(24,119,242,0.05)",
            }}
          >
            {/* Glow background */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col items-center gap-4">
              <VitaScoreRing score={userScore} />
              <ScoreBadge status={userStatus} />
              <StreakBadge days={userStreak} />

              <p className="text-sm text-white/50 text-center">
                {user?.renewalDate ? (
                  <>
                    Renovação em{" "}
                    <span className="text-white/80 font-medium">
                      {Math.max(0, Math.ceil((new Date(user.renewalDate).getTime() - Date.now()) / 86400000))} dias
                    </span>{" "}
                    ·{" "}
                  </>
                ) : null}
                Desconto atual:{" "}
                <span className="text-green-400 font-medium">
                  {user?.insuranceDiscount ?? 0}%
                </span>
              </p>

              <Link
                href="/seguro"
                className="mt-1 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                Ver detalhes da apólice →
              </Link>
            </div>
          </motion.section>

          {/* Card de Desconto do Seguro */}
          <motion.section
            custom={0.5}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <InsuranceDiscountCard
              discount={user?.insuranceDiscount ?? 0}
              savings={user?.annualSavings ?? 0}
              daysToRenewal={user?.renewalDate ? Math.max(0, Math.ceil((new Date(user.renewalDate).getTime() - Date.now()) / 86400000)) : 0}
            />
          </motion.section>

          {/* Seção Hoje */}
          <motion.section
            custom={1}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-baseline justify-between mb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-white">Hoje</h2>
                {!loading && source && source !== "loading" && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-white/[0.08] text-white/50 border border-white/[0.06]">
                    {source}
                  </span>
                )}
              </div>
              <span className="text-xs text-white/40 capitalize">
                {todayFormatted}
              </span>
            </div>
            {loading ? (
              <div className="grid grid-cols-2 gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-28 rounded-2xl bg-white/[0.04] border border-white/[0.06] animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <ActivityCard steps={stepsData.steps} goal={stepsData.goal} km={stepsData.km} />
                <SleepCard hours={sleepData.hours} minutes={sleepData.minutes} goal={mockTodayStats.sleep.goal} />
                <WaterCard current={waterData.current} goal={waterData.goal} />
                <NutritionCard current={nutritionData.current} goal={nutritionData.goal} />
              </div>
            )}
          </motion.section>

          {/* Links rápidos */}
          <motion.section
            custom={1.5}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
              {[
                { href: "/peso", label: "Peso", icon: "⚖️", color: "#30D158" },
                { href: "/sono", label: "Sono", icon: "🌙", color: "#7B61FF" },
                { href: "/digital", label: "Digital", icon: "📱", color: "#1877F2" },
                { href: "/nutricao", label: "Nutrição", icon: "🥗", color: "#FF9F0A" },
                { href: "/desafios", label: "Desafios", icon: "🏆", color: "#FFD60A" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex-shrink-0 flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 transition-colors hover:bg-white/[0.08]"
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="text-xs text-white/70 font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </motion.section>

          {/* Seção Desafio da Semana */}
          {activeChallenge && (
            <motion.section
              custom={2}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-base font-semibold text-white mb-3">
                Desafio da Semana
              </h2>
              <ChallengeCard challenge={activeChallenge} />
            </motion.section>
          )}

          {/* Seção Atividade Recente */}
          <motion.section
            custom={3}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-base font-semibold text-white mb-3">
              Atividade Recente
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
              {mockRecentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex-shrink-0 w-40 bg-[#1C1C1E] rounded-xl p-3 flex flex-col gap-2"
                >
                  <span className="text-2xl">{activity.icon}</span>
                  <p className="text-xs text-white/80 leading-tight">
                    {activity.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs font-semibold text-green-400">
                      +{activity.points} pts
                    </span>
                    <span className="text-[10px] text-white/30">
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Seção Ranking de Segurados */}
          <motion.section
            custom={4}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-base font-semibold text-white">
                Ranking de Segurados
              </h2>
              <span className="text-xs text-white/40">Esta semana</span>
            </div>
            <div className="flex flex-col gap-2">
              {mockRanking.map((entry) => {
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
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
                      entry.isUser
                        ? "bg-blue-500/10 border border-blue-500/30"
                        : "bg-white/[0.03]"
                    }`}
                  >
                    <span className="w-8 text-center text-sm font-bold text-white/60">
                      {medal ?? `${entry.position}º`}
                    </span>
                    <span
                      className={`flex-1 text-sm ${
                        entry.isUser
                          ? "text-white font-semibold"
                          : "text-white/70"
                      }`}
                    >
                      {entry.name}
                      {entry.isUser && (
                        <span className="ml-1.5 text-[10px] text-blue-400 font-medium">
                          (você)
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-sm font-bold text-white/90">
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
