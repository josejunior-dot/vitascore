"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Target,
  CheckCircle2,
  Circle,
  Flame,
  Coins,
  Trophy,
  Settings,
  Star,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import AppShell from "@/components/layout/AppShell";
import {
  WeeklyGoals,
  type WeekPlan,
  type CoinBalance,
  type GoalCategory,
  type WeekHistory,
} from "@/lib/health/weekly-goals";

/* eslint-disable @typescript-eslint/no-explicit-any */
const sectionVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const CATEGORY_COLORS: Record<GoalCategory, string> = {
  movement: "#34A853",
  sleep: "#A142F4",
  nutrition: "#F9AB00",
  wellbeing: "#EA4335",
  digital: "#1A73E8",
};

const CATEGORY_LABELS: Record<GoalCategory, string> = {
  movement: "Movimento",
  sleep: "Sono",
  nutrition: "Nutricao",
  wellbeing: "Bem-estar",
  digital: "Digital",
};

function formatWeekDates(start: string, end: string): string {
  const s = new Date(start + "T12:00:00");
  const e = new Date(end + "T12:00:00");
  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  return `${s.getDate()}-${e.getDate()} ${months[s.getMonth()]}`;
}

export default function MetasPage() {
  const [weekPlan, setWeekPlan] = useState<WeekPlan | null>(null);
  const [coinBalance, setCoinBalance] = useState<CoinBalance | null>(null);
  const [history, setHistory] = useState<WeekHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let week = await WeeklyGoals.getCurrentWeek();
      if (!week) {
        week = await WeeklyGoals.generateWeekGoals();
      }
      setWeekPlan(week);
      const coins = await WeeklyGoals.getCoinBalance();
      setCoinBalance(coins);
      const hist = await WeeklyGoals.getHistory(4);
      setHistory(hist);
      setLoading(false);
    })();
  }, []);

  if (loading || !weekPlan || !coinBalance) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            className="w-8 h-8 border-3 border-[#34A853] border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </AppShell>
    );
  }

  const daysRemaining = WeeklyGoals.getDaysRemaining(weekPlan.endDate);
  const completedGoals = weekPlan.goals.filter((g) => g.completed).length;
  const coinProgress =
    coinBalance.weekMax > 0
      ? coinBalance.weekCoins / coinBalance.weekMax
      : 0;

  return (
    <AppShell>
      <div className="flex flex-col min-h-screen pb-24">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/95 shadow-sm border-b border-[#DADCE0] px-4 py-4">
          <div className="flex items-center">
            <Link href="/home" className="p-1 -ml-1">
              <ChevronLeft className="w-5 h-5 text-[#5F6368]" />
            </Link>
            <div className="flex-1 flex items-center justify-center gap-2 -ml-6">
              <Target className="w-5 h-5 text-[#34A853]" />
              <h1 className="text-lg font-semibold text-[#202124]">
                Metas da Semana
              </h1>
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-4 px-4 pt-4">
          {/* Coin Balance Card */}
          <motion.div
            custom={0}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-4 border border-amber-200/60"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">C</span>
                </div>
                <div>
                  <span className="text-2xl font-bold text-[#202124]">
                    {coinBalance.weekCoins}
                  </span>
                  <span className="text-sm text-[#5F6368]">
                    {" "}
                    / {coinBalance.weekMax}
                  </span>
                </div>
              </div>
              {coinBalance.streak >= 3 && (
                <div className="flex items-center gap-1 bg-orange-100 text-orange-600 px-2.5 py-1 rounded-full text-xs font-medium">
                  <Flame className="w-3.5 h-3.5" />
                  {coinBalance.streak} semanas
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div className="h-2.5 bg-amber-200/50 rounded-full overflow-hidden mb-2">
              <motion.div
                className="h-full bg-amber-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${coinProgress * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>

            <p className="text-xs text-[#5F6368]">
              {coinBalance.monthCoins} moedas este mes
            </p>
          </motion.div>

          {/* Week Info */}
          <motion.div
            custom={1}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-between"
          >
            <div>
              <h2 className="text-sm font-semibold text-[#202124]">
                Semana {weekPlan.weekNumber} &middot;{" "}
                {formatWeekDates(weekPlan.startDate, weekPlan.endDate)}
              </h2>
            </div>
            <span className="text-xs text-[#5F6368] bg-[#F8F9FA] px-2.5 py-1 rounded-full">
              {daysRemaining > 0
                ? `Faltam ${daysRemaining} dia${daysRemaining !== 1 ? "s" : ""}`
                : "Semana encerrada"}
            </span>
          </motion.div>

          {/* Goal Cards */}
          <div className="flex flex-col gap-3">
            {weekPlan.goals.map((goal, i) => {
              const color = CATEGORY_COLORS[goal.category];
              const progress =
                goal.target > 0 ? goal.current / goal.target : 0;

              return (
                <motion.div
                  key={goal.id}
                  custom={i + 2}
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  className="relative bg-white rounded-2xl shadow-sm overflow-hidden"
                  style={{
                    borderWidth: 1,
                    borderColor: goal.completed ? `${color}40` : "#DADCE0",
                    backgroundColor: goal.completed
                      ? `${color}08`
                      : "#FFFFFF",
                  }}
                >
                  {/* Colored left border */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                    style={{ backgroundColor: color }}
                  />

                  <div className="p-4 pl-5">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{goal.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-[#202124]">
                              {goal.title}
                            </h3>
                            {goal.adapted && (
                              <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-medium">
                                Adaptado
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#5F6368] mt-0.5">
                            {goal.description}
                          </p>
                        </div>
                      </div>

                      {goal.completed ? (
                        <CheckCircle2
                          className="w-5 h-5 flex-shrink-0"
                          style={{ color }}
                        />
                      ) : (
                        <Circle className="w-5 h-5 text-[#DADCE0] flex-shrink-0" />
                      )}
                    </div>

                    {/* Progress */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-[#5F6368]">
                          {goal.current} / {goal.target} {goal.unit}
                        </span>
                        {goal.completed ? (
                          <span
                            className="text-xs font-medium flex items-center gap-1"
                            style={{ color }}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            +50 moedas
                          </span>
                        ) : (
                          <span className="text-xs text-[#9AA0A6]">
                            Faltam {goal.target - goal.current}
                          </span>
                        )}
                      </div>
                      <div className="h-2 bg-[#F1F3F4] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: color }}
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.min(progress, 1) * 100}%`,
                          }}
                          transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.15 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bonus Section */}
          {weekPlan.allCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200/60 text-center"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="inline-block mb-2"
              >
                <Sparkles className="w-8 h-8 text-green-500 mx-auto" />
              </motion.div>
              <p className="text-base font-semibold text-[#202124]">
                Semana completa! +{weekPlan.bonusCoins} moedas bonus
              </p>
              <p className="text-sm text-[#5F6368] mt-1">
                Total: {weekPlan.totalCoins} moedas esta semana
              </p>
            </motion.div>
          )}

          {/* Historico */}
          <motion.div
            custom={5}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-sm font-semibold text-[#202124] mb-2 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              Historico
            </h2>
            <div className="bg-white rounded-2xl border border-[#DADCE0] shadow-sm overflow-hidden divide-y divide-[#DADCE0]">
              {history.length === 0 ? (
                <div className="p-4 text-center text-sm text-[#9AA0A6]">
                  Nenhum historico ainda
                </div>
              ) : (
                history.map((h) => {
                  const isCurrent =
                    h.weekNumber === weekPlan.weekNumber &&
                    h.weekYear === weekPlan.weekYear;
                  const allDone = h.goalsCompleted === h.totalGoals;
                  const partial =
                    h.goalsCompleted > 0 && h.goalsCompleted < h.totalGoals;

                  return (
                    <div
                      key={`${h.weekYear}-${h.weekNumber}`}
                      className={`flex items-center justify-between px-4 py-3 ${
                        isCurrent ? "bg-blue-50/50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center ${
                            allDone
                              ? "bg-green-100"
                              : partial
                                ? "bg-amber-100"
                                : "bg-gray-100"
                          }`}
                        >
                          {allDone ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : partial ? (
                            <Star className="w-4 h-4 text-amber-500" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-[#202124]">
                            Sem. {h.weekNumber}{" "}
                            <span className="text-[#9AA0A6]">
                              &middot;{" "}
                              {formatWeekDates(h.startDate, h.endDate)}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-medium ${
                            allDone
                              ? "text-green-600"
                              : partial
                                ? "text-amber-600"
                                : "text-gray-400"
                          }`}
                        >
                          {h.goalsCompleted}/{h.totalGoals}
                        </span>
                        <span className="text-xs text-[#5F6368]">
                          {h.coinsEarned}
                          <span className="text-amber-500 ml-0.5">C</span>
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>

          {/* Configuracoes */}
          <motion.div
            custom={6}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <Link
              href="/metas/configuracoes"
              className="flex items-center gap-3 bg-white rounded-2xl border border-[#DADCE0] shadow-sm px-4 py-3.5"
            >
              <div className="w-9 h-9 rounded-xl bg-[#F1F3F4] flex items-center justify-center">
                <Settings className="w-4.5 h-4.5 text-[#5F6368]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#202124]">
                  Adaptar minhas metas
                </p>
                <p className="text-xs text-[#9AA0A6]">
                  PCD, gestante, condicao cronica
                </p>
              </div>
              <ChevronLeft className="w-4 h-4 text-[#DADCE0] rotate-180" />
            </Link>
          </motion.div>

          {/* Info Card */}
          <motion.div
            custom={7}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="bg-[#F8F9FA] rounded-2xl p-4 mb-4"
          >
            <div className="flex flex-col gap-2 text-xs text-[#5F6368]">
              <p>
                Suas metas sao personalizadas com base nos seus habitos
                recentes.
              </p>
              <p>
                Metas diferentes, mesma recompensa. Todos podem ganhar.
              </p>
              <p className="text-[#9AA0A6]">
                Dados ficam no seu celular.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
