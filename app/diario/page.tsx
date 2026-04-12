"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  BookOpen,
  Camera,
  Filter,
  TrendingUp,
  Award,
  Calendar,
  Coffee,
  Sun,
  Moon as MoonIcon,
  Shield,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

import AppShell from "@/components/layout/AppShell";
import { MealAnalyzer, type VerifiedMeal } from "@/lib/health/meal-analyzer";

/* eslint-disable @typescript-eslint/no-explicit-any */
const fadeIn: any = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: "easeOut" },
  }),
};

type FilterRange = "today" | "7d" | "30d" | "all";

const mealTypeLabels: Record<string, string> = {
  cafe: "Cafe da manha",
  almoco: "Almoco",
  jantar: "Jantar",
  lanche: "Lanche",
};

const mealTypeIcons: Record<string, typeof Coffee> = {
  cafe: Coffee,
  almoco: Sun,
  jantar: MoonIcon,
  lanche: Coffee,
};

function getScoreColor(score: number): string {
  if (score > 70) return "#34A853";
  if (score > 40) return "#F9AB00";
  return "#EA4335";
}

function getScoreBg(score: number): string {
  if (score > 70) return "#E6F4EA";
  if (score > 40) return "#FEF7E0";
  return "#FCE8E6";
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function formatDateLabel(dateStr: string): string {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${pad2(today.getMonth() + 1)}-${pad2(today.getDate())}`;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${pad2(yesterday.getMonth() + 1)}-${pad2(yesterday.getDate())}`;

  const [y, m, d] = dateStr.split("-");
  const short = `${d}/${m}`;

  if (dateStr === todayStr) return `Hoje - ${short}`;
  if (dateStr === yesterdayStr) return `Ontem - ${short}`;
  return short + "/" + y.slice(2);
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

export default function DiarioPage() {
  const [meals, setMeals] = useState<VerifiedMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterRange>("7d");

  useEffect(() => {
    (async () => {
      try {
        const todayMeals = await MealAnalyzer.getTodayMeals();
        const weekMeals = await MealAnalyzer.getWeeklyMeals();
        const flat = weekMeals.flat();
        // Merge today (in case getTodayMeals tem dados que weekMeals nao tem)
        const map = new Map<string, VerifiedMeal>();
        for (const m of [...flat, ...todayMeals]) map.set(m.id, m);
        const all = Array.from(map.values()).sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );
        setMeals(all);
      } catch {
        setMeals([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filtragem por range
  const filteredMeals = useMemo(() => {
    if (filter === "all") return meals;
    const now = Date.now();
    const days = filter === "today" ? 1 : filter === "7d" ? 7 : 30;
    const cutoff = now - days * 24 * 60 * 60 * 1000;
    if (filter === "today") {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${pad2(today.getMonth() + 1)}-${pad2(today.getDate())}`;
      return meals.filter((m) => m.timestamp.split("T")[0] === todayStr);
    }
    return meals.filter((m) => new Date(m.timestamp).getTime() >= cutoff);
  }, [meals, filter]);

  // Agrupar por data
  const grouped = useMemo(() => {
    return filteredMeals.reduce((acc, meal) => {
      const date = meal.timestamp.split("T")[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(meal);
      return acc;
    }, {} as Record<string, VerifiedMeal[]>);
  }, [filteredMeals]);

  const sortedDates = useMemo(
    () => Object.keys(grouped).sort((a, b) => (a < b ? 1 : -1)),
    [grouped],
  );

  // Estatisticas (mes atual)
  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const monthMeals = meals.filter((m) => new Date(m.timestamp).getTime() >= monthStart);
    const total = monthMeals.length;
    const analyzed = monthMeals.filter((m) => m.analysis);
    const avgScore =
      analyzed.length > 0
        ? Math.round(
            analyzed.reduce((sum, m) => sum + (m.analysis?.mealScore ?? 0), 0) / analyzed.length,
          )
        : 0;

    // Variedade: 4 pilares
    let pillarHits = 0;
    const hasVeg = monthMeals.some((m) => m.analysis?.hasVegetables);
    const hasProt = monthMeals.some((m) => m.analysis?.hasProtein);
    const hasGrain = monthMeals.some((m) => m.analysis?.hasWholeGrains);
    const hasFruit = monthMeals.some((m) => m.analysis?.hasFruit);
    if (hasVeg) pillarHits++;
    if (hasProt) pillarHits++;
    if (hasGrain) pillarHits++;
    if (hasFruit) pillarHits++;
    const variety = Math.round((pillarHits / 4) * 100);

    return { total, avgScore, variety };
  }, [meals]);

  // Calendario do mes atual com score por dia
  const calendarData = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startWeekday = firstDay.getDay(); // 0 = domingo

    // Score por dia
    const dayScores: Record<number, number> = {};
    for (const m of meals) {
      const d = new Date(m.timestamp);
      if (d.getFullYear() !== year || d.getMonth() !== month) continue;
      const day = d.getDate();
      if (!m.analysis) continue;
      if (!dayScores[day]) dayScores[day] = 0;
      dayScores[day] = Math.max(dayScores[day], m.analysis.mealScore);
    }

    // Media por dia (recalcular como media real)
    const dayCounts: Record<number, { sum: number; count: number }> = {};
    for (const m of meals) {
      const d = new Date(m.timestamp);
      if (d.getFullYear() !== year || d.getMonth() !== month) continue;
      if (!m.analysis) continue;
      const day = d.getDate();
      if (!dayCounts[day]) dayCounts[day] = { sum: 0, count: 0 };
      dayCounts[day].sum += m.analysis.mealScore;
      dayCounts[day].count++;
    }
    const avgByDay: Record<number, number> = {};
    for (const [day, info] of Object.entries(dayCounts)) {
      avgByDay[Number(day)] = Math.round(info.sum / info.count);
    }

    return { year, month, daysInMonth, startWeekday, avgByDay };
  }, [meals]);

  // Insights / evolucao do score (ultimos 7 dias)
  const evolutionBars = useMemo(() => {
    const bars: { label: string; score: number }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
      const dayMeals = meals.filter((m) => m.timestamp.split("T")[0] === key && m.analysis);
      const avg =
        dayMeals.length > 0
          ? Math.round(
              dayMeals.reduce((s, m) => s + (m.analysis?.mealScore ?? 0), 0) / dayMeals.length,
            )
          : 0;
      const dayLabels = ["D", "S", "T", "Q", "Q", "S", "S"];
      bars.push({ label: dayLabels[d.getDay()], score: avg });
    }
    return bars;
  }, [meals]);

  const isEmpty = !loading && meals.length === 0;

  return (
    <AppShell>
      <div style={{ background: "#FFFFFF", minHeight: "100vh", color: "#202124" }}>
        {/* Header */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid #DADCE0",
            background: "#FFFFFF",
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
        >
          <Link
            href="/home"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#1A73E8",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <ChevronLeft size={20} />
            <span>Voltar</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BookOpen size={20} color="#1A73E8" />
            <h1 style={{ fontSize: 18, fontWeight: 600, margin: 0, color: "#202124" }}>
              Diario Alimentar
            </h1>
          </div>
          <div style={{ width: 60 }} />
        </header>

        <main style={{ padding: "20px", maxWidth: 720, margin: "0 auto", paddingBottom: 100 }}>
          {/* Empty state */}
          {isEmpty ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              custom={0}
              style={{
                marginTop: 60,
                textAlign: "center",
                padding: "40px 24px",
                background: "#FFFFFF",
                border: "1px solid #DADCE0",
                borderRadius: 16,
                boxShadow: "0 1px 2px rgba(60,64,67,0.08)",
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "#E8F0FE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <BookOpen size={40} color="#1A73E8" />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 8px", color: "#202124" }}>
                Nenhuma refeicao registrada ainda
              </h2>
              <p style={{ fontSize: 14, color: "#5F6368", margin: "0 0 24px" }}>
                Comece a documentar suas refeicoes e acompanhe sua evolucao nutricional ao longo do
                tempo.
              </p>
              <Link
                href="/nutricao"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#1A73E8",
                  color: "#FFFFFF",
                  padding: "12px 24px",
                  borderRadius: 24,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                <Camera size={16} />
                Registrar primeira refeicao
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Stats Cards */}
              <motion.section
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                custom={0}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <StatCard
                  icon={<Calendar size={18} color="#1A73E8" />}
                  label="Refeicoes do mes"
                  value={String(stats.total)}
                />
                <StatCard
                  icon={<Award size={18} color="#1A73E8" />}
                  label="Score medio"
                  value={loading ? "--" : `${stats.avgScore}`}
                  suffix="/100"
                />
                <StatCard
                  icon={<TrendingUp size={18} color="#1A73E8" />}
                  label="Variedade"
                  value={loading ? "--" : `${stats.variety}%`}
                />
              </motion.section>

              {/* Filter Bar */}
              <motion.section
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                custom={1}
                style={{ marginBottom: 20 }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                    color: "#5F6368",
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  <Filter size={14} />
                  <span>Periodo</span>
                </div>
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                  {(
                    [
                      { key: "today", label: "Hoje" },
                      { key: "7d", label: "7 dias" },
                      { key: "30d", label: "30 dias" },
                      { key: "all", label: "Tudo" },
                    ] as { key: FilterRange; label: string }[]
                  ).map((f) => (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setFilter(f.key)}
                      style={{
                        flexShrink: 0,
                        padding: "8px 16px",
                        borderRadius: 20,
                        border: filter === f.key ? "1px solid #1A73E8" : "1px solid #DADCE0",
                        background: filter === f.key ? "#1A73E8" : "#FFFFFF",
                        color: filter === f.key ? "#FFFFFF" : "#5F6368",
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </motion.section>

              {/* Calendar View */}
              <motion.section
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                custom={2}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #DADCE0",
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 20,
                  boxShadow: "0 1px 2px rgba(60,64,67,0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: "#202124" }}>
                    {new Date(calendarData.year, calendarData.month).toLocaleDateString("pt-BR", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h3>
                  <Calendar size={16} color="#5F6368" />
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: 4,
                    fontSize: 11,
                    color: "#5F6368",
                    marginBottom: 4,
                  }}
                >
                  {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
                    <div key={i} style={{ textAlign: "center", padding: "4px 0" }}>
                      {d}
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: 4,
                  }}
                >
                  {Array.from({ length: calendarData.startWeekday }).map((_, i) => (
                    <div key={`blank-${i}`} />
                  ))}
                  {Array.from({ length: calendarData.daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const score = calendarData.avgByDay[day];
                    const hasMeal = score !== undefined;
                    const isToday =
                      day === new Date().getDate() &&
                      calendarData.month === new Date().getMonth() &&
                      calendarData.year === new Date().getFullYear();
                    return (
                      <div
                        key={day}
                        style={{
                          aspectRatio: "1",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 8,
                          background: isToday ? "#E8F0FE" : "transparent",
                          border: isToday ? "1px solid #1A73E8" : "1px solid transparent",
                          fontSize: 12,
                          color: "#202124",
                          position: "relative",
                        }}
                      >
                        <span>{day}</span>
                        {hasMeal && (
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: getScoreColor(score),
                              marginTop: 2,
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.section>

              {/* Meal Log */}
              <motion.section
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                custom={3}
                style={{ marginBottom: 20 }}
              >
                <h3
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#5F6368",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    margin: "0 0 12px",
                  }}
                >
                  Historico
                </h3>

                {sortedDates.length === 0 && !loading && (
                  <div
                    style={{
                      padding: 24,
                      textAlign: "center",
                      color: "#5F6368",
                      fontSize: 13,
                      background: "#F8F9FA",
                      borderRadius: 12,
                      border: "1px dashed #DADCE0",
                    }}
                  >
                    Nenhuma refeicao no periodo selecionado.
                  </div>
                )}

                {sortedDates.map((date) => (
                  <div key={date} style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        position: "sticky",
                        top: 64,
                        background: "#FFFFFF",
                        padding: "8px 0",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#202124",
                        borderBottom: "1px solid #F1F3F4",
                        marginBottom: 8,
                        zIndex: 10,
                      }}
                    >
                      {formatDateLabel(date)}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {grouped[date].map((meal) => (
                        <MealCard key={meal.id} meal={meal} />
                      ))}
                    </div>
                  </div>
                ))}
              </motion.section>

              {/* Insights Card */}
              <motion.section
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                custom={4}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #DADCE0",
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 20,
                  boxShadow: "0 1px 2px rgba(60,64,67,0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <TrendingUp size={18} color="#1A73E8" />
                  <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: "#202124" }}>
                    Insights
                  </h3>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    marginBottom: 16,
                    fontSize: 13,
                    color: "#3C4043",
                  }}
                >
                  <InsightLine text={`Variedade alimentar: ${Math.round(stats.variety / 25)}/4 grupos consumidos`} />
                  <InsightLine
                    text={
                      stats.avgScore >= 70
                        ? "Voce esta com boa qualidade nutricional"
                        : stats.avgScore >= 40
                          ? "Score nutricional moderado - busque mais vegetais"
                          : "Aumente o consumo de alimentos integrais e frescos"
                    }
                  />
                  <InsightLine text={`${stats.total} refeicoes registradas neste mes`} />
                </div>

                {/* Mini bar chart */}
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#5F6368",
                      marginBottom: 6,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      fontWeight: 600,
                    }}
                  >
                    Evolucao do score (7 dias)
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 6,
                      height: 80,
                    }}
                  >
                    {evolutionBars.map((b, i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            height: `${Math.max(4, b.score * 0.7)}px`,
                            background: b.score > 0 ? getScoreColor(b.score) : "#F1F3F4",
                            borderRadius: "4px 4px 0 0",
                            transition: "height 0.3s",
                          }}
                        />
                        <span style={{ fontSize: 10, color: "#5F6368" }}>{b.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.section>

              {/* Quick action FAB */}
              <Link
                href="/nutricao"
                style={{
                  position: "fixed",
                  bottom: 88,
                  right: 20,
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "#1A73E8",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  boxShadow: "0 4px 12px rgba(26,115,232,0.4)",
                  zIndex: 20,
                }}
                aria-label="Registrar refeicao"
              >
                <Camera size={24} />
              </Link>
            </>
          )}
        </main>
      </div>
    </AppShell>
  );
}

function StatCard({
  icon,
  label,
  value,
  suffix,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #DADCE0",
        borderRadius: 12,
        padding: 12,
        boxShadow: "0 1px 2px rgba(60,64,67,0.08)",
      }}
    >
      <div style={{ marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 11, color: "#5F6368", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: "#202124", lineHeight: 1 }}>
        {value}
        {suffix && (
          <span style={{ fontSize: 11, fontWeight: 500, color: "#5F6368" }}>{suffix}</span>
        )}
      </div>
    </div>
  );
}

function InsightLine({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
      <span
        style={{
          width: 4,
          height: 4,
          borderRadius: "50%",
          background: "#1A73E8",
          marginTop: 7,
          flexShrink: 0,
        }}
      />
      <span>{text}</span>
    </div>
  );
}

function MealCard({ meal }: { meal: VerifiedMeal }) {
  const Icon = mealTypeIcons[meal.type] ?? Coffee;
  const score = meal.analysis?.mealScore ?? 0;
  const isPhoto = meal.verificationMethod === "photo_ai";

  // Items detectados
  const items: string[] = [];
  if (meal.analysis?.hasVegetables) items.push("Vegetais");
  if (meal.analysis?.hasProtein) items.push("Proteina");
  if (meal.analysis?.hasWholeGrains) items.push("Integral");
  if (meal.analysis?.hasFruit) items.push("Fruta");
  if (meal.analysis?.isProcessed) items.push("Processado");
  if (meal.analysis?.isDeepFried) items.push("Frito");

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        padding: 12,
        background: "#FFFFFF",
        border: "1px solid #DADCE0",
        borderRadius: 12,
        boxShadow: "0 1px 2px rgba(60,64,67,0.08)",
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 12,
          background: meal.photoBase64 ? "transparent" : "#E8F0FE",
          flexShrink: 0,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #DADCE0",
        }}
      >
        {meal.photoBase64 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={meal.photoBase64}
            alt={mealTypeLabels[meal.type]}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Icon size={28} color="#1A73E8" />
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Icon size={14} color="#5F6368" />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#202124" }}>
              {mealTypeLabels[meal.type]}
            </span>
            <span style={{ fontSize: 12, color: "#5F6368" }}>{formatTime(meal.timestamp)}</span>
          </div>
          {/* Score badge */}
          {meal.analysis && (
            <span
              style={{
                padding: "2px 8px",
                borderRadius: 10,
                background: getScoreBg(score),
                color: getScoreColor(score),
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {score}
            </span>
          )}
        </div>

        {/* Items pills */}
        {items.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
            {items.map((it) => (
              <span
                key={it}
                style={{
                  fontSize: 10,
                  padding: "2px 8px",
                  borderRadius: 8,
                  background: "#F1F3F4",
                  color: "#5F6368",
                  fontWeight: 500,
                }}
              >
                {it}
              </span>
            ))}
          </div>
        )}

        {/* Verification badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginTop: 6,
            fontSize: 10,
            color: isPhoto ? "#34A853" : "#F9AB00",
          }}
        >
          {isPhoto ? <Shield size={11} /> : <AlertTriangle size={11} />}
          <span>{isPhoto ? "Verificado por foto" : "Registro manual"}</span>
        </div>
      </div>
    </div>
  );
}
