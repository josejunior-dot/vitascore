"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Heart, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";

import AppShell from "@/components/layout/AppShell";
import {
  WellbeingCheckin,
  WHO5_QUESTIONS,
  ANSWER_LABELS,
  WellbeingResponse,
} from "@/lib/health/wellbeing-checkin";

/* eslint-disable @typescript-eslint/no-explicit-any */
const cardVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
};

const SCORE_MESSAGES: Record<string, string> = {
  excellent:
    "Continue assim! Seus hábitos estão refletindo no seu bem-estar.",
  good: "Bom dia! Mantenha a rotina.",
  moderate: "Dia neutro. Que tal uma caminhada?",
  low: "Tudo bem não estar 100%. Se precisar, converse com alguém de confiança.",
  critical:
    "Se estiver passando por dificuldades, procure apoio. CVV: 188 (24h, gratuito).",
};

export default function CheckinPage() {
  const [loading, setLoading] = useState(true);
  const [todayResponse, setTodayResponse] = useState<WellbeingResponse | null>(
    null,
  );
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState<WellbeingResponse[]>([]);

  useEffect(() => {
    (async () => {
      const resp = await WellbeingCheckin.getTodayResponse();
      if (resp) {
        setTodayResponse(resp);
        const hist = await WellbeingCheckin.getHistory(7);
        setHistory(hist);
      }
      setLoading(false);
    })();
  }, []);

  const allAnswered = WHO5_QUESTIONS.every((q) => answers[q.id] !== undefined);

  async function handleSubmit() {
    if (!allAnswered || submitting) return;
    setSubmitting(true);
    const resp = await WellbeingCheckin.saveResponse(answers);
    const hist = await WellbeingCheckin.getHistory(7);
    setHistory(hist);
    setTodayResponse(resp);
    setSubmitting(false);
  }

  function selectAnswer(questionId: string, value: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    // Auto-advance to next unanswered question
    if (currentQ < WHO5_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ((c) => c + 1), 300);
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-3 border-[#1A73E8] border-t-transparent rounded-full animate-spin" />
        </div>
      </AppShell>
    );
  }

  // --- STATE 2: Already answered ---
  if (todayResponse) {
    const maxScore = Math.max(...history.map((h) => h.totalScore), 100);
    return (
      <AppShell>
        <div className="px-4 pt-4 pb-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/home"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F1F3F4]"
            >
              <ChevronLeft size={20} color="#202124" />
            </Link>
            <h1 className="text-lg font-semibold text-[#202124]">
              Bem-estar
            </h1>
            <CheckCircle2 size={20} color="#34A853" className="ml-auto" />
          </div>

          {/* Done card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl bg-white border border-[#DADCE0] shadow-sm p-6 text-center mb-5"
          >
            <CheckCircle2
              size={48}
              color={todayResponse.categoryColor}
              className="mx-auto mb-3"
            />
            <p className="text-sm text-[#5F6368] mb-1">
              Você já respondeu hoje
            </p>
            <p
              className="text-5xl font-bold mb-1"
              style={{ color: todayResponse.categoryColor }}
            >
              {todayResponse.totalScore}
            </p>
            <p
              className="text-sm font-medium"
              style={{ color: todayResponse.categoryColor }}
            >
              {todayResponse.categoryLabel}
            </p>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-white border border-[#DADCE0] shadow-sm p-4 mb-5"
          >
            <div className="flex gap-3">
              <Sparkles size={20} color="#FBBC04" className="flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#202124] leading-relaxed">
                {SCORE_MESSAGES[todayResponse.category]}
              </p>
            </div>
          </motion.div>

          {/* Mini chart: last 7 days */}
          {history.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl bg-white border border-[#DADCE0] shadow-sm p-4 mb-5"
            >
              <p className="text-xs text-[#5F6368] font-medium mb-3">
                Últimos 7 dias
              </p>
              <div className="flex items-end justify-between gap-1 h-24">
                {history.map((h, i) => {
                  const heightPct = Math.max((h.totalScore / 100) * 100, 8);
                  const dayLabel = new Date(
                    h.date + "T12:00:00",
                  ).toLocaleDateString("pt-BR", { weekday: "short" });
                  return (
                    <div
                      key={h.date}
                      className="flex flex-col items-center flex-1"
                    >
                      <span
                        className="text-[10px] font-medium mb-1"
                        style={{ color: h.categoryColor }}
                      >
                        {h.totalScore}
                      </span>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPct}%` }}
                        transition={{ delay: 0.4 + i * 0.05, duration: 0.4 }}
                        className="w-full max-w-[28px] rounded-t-md"
                        style={{ backgroundColor: h.categoryColor }}
                      />
                      <span className="text-[10px] text-[#5F6368] mt-1 capitalize">
                        {dayLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Privacy notice */}
          <p className="text-xs text-[#5F6368] text-center">
            Seu histórico fica apenas no seu celular. Ninguém mais vê suas
            respostas.
          </p>
        </div>
      </AppShell>
    );
  }

  // --- STATE 1: Check-in form ---
  const question = WHO5_QUESTIONS[currentQ];

  return (
    <AppShell>
      <div className="px-4 pt-4 pb-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/home"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F1F3F4]"
          >
            <ChevronLeft size={20} color="#202124" />
          </Link>
          <h1 className="text-lg font-semibold text-[#202124]">
            Como você está?
          </h1>
          <Heart size={20} color="#EA4335" className="ml-auto" />
        </div>

        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <p className="text-sm text-[#5F6368] leading-relaxed mb-3">
            Reserve 30 segundos para refletir sobre seu dia. Suas respostas são
            anônimas e ficam apenas no seu celular.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F1F3F4] rounded-full">
            <span className="text-xs text-[#5F6368]">
              Anônimo · Voluntário · Dados locais
            </span>
          </div>
        </motion.div>

        {/* Progress dots */}
        <div className="flex gap-2 mb-6 justify-center">
          {WHO5_QUESTIONS.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentQ(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === currentQ
                  ? "bg-[#1A73E8] scale-125"
                  : answers[q.id] !== undefined
                    ? "bg-[#1A73E8] opacity-40"
                    : "bg-[#DADCE0]"
              }`}
            />
          ))}
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl bg-white border border-[#DADCE0] shadow-sm p-5 mb-5"
          >
            <p className="text-xs text-[#5F6368] mb-2">
              Nas últimas duas semanas...
            </p>
            <p className="text-base font-medium text-[#202124] mb-5">
              {question.text}
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2, 3, 4, 5].map((val) => {
                const selected = answers[question.id] === val;
                return (
                  <button
                    key={val}
                    onClick={() => selectAnswer(question.id, val)}
                    className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-center transition-all duration-200 ${
                      selected
                        ? "bg-[#1A73E8] text-white shadow-md scale-[1.03]"
                        : "bg-[#F1F3F4] text-[#202124] hover:bg-[#E8EAED]"
                    }`}
                  >
                    <span className="text-lg font-bold">{val}</span>
                    <span
                      className={`text-[10px] leading-tight ${selected ? "text-white/90" : "text-[#5F6368]"}`}
                    >
                      {ANSWER_LABELS[val]}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex gap-3 mb-5">
          <button
            onClick={() => setCurrentQ((c) => Math.max(0, c - 1))}
            disabled={currentQ === 0}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-[#F1F3F4] text-[#5F6368] disabled:opacity-30 transition-opacity"
          >
            Anterior
          </button>
          {currentQ < WHO5_QUESTIONS.length - 1 ? (
            <button
              onClick={() => setCurrentQ((c) => c + 1)}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-[#F1F3F4] text-[#202124]"
            >
              Próxima
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-[#1A73E8] text-white disabled:opacity-40 transition-opacity"
            >
              {submitting ? "Enviando..." : "Enviar"}
            </button>
          )}
        </div>

        {/* Points badge */}
        {allAnswered && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-xs text-[#34A853] font-medium"
          >
            +10 pontos de participação
          </motion.p>
        )}
      </div>
    </AppShell>
  );
}
