"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Gift,
  Coins,
  Tag,
  ExternalLink,
  Lock,
  Search,
} from "lucide-react";
import Link from "next/link";

import AppShell from "@/components/layout/AppShell";
import { WeeklyGoals, type CoinBalance } from "@/lib/health/weekly-goals";

/* eslint-disable @typescript-eslint/no-explicit-any */
const sectionVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" },
  }),
};

type PartnerCategory =
  | "alimentacao"
  | "esportes"
  | "bem-estar"
  | "lazer"
  | "saude";

type PartnerStatus = "em-breve" | "disponivel";

interface Partner {
  id: string;
  name: string;
  category: PartnerCategory;
  icon: string;
  discount: string;
  coins: number;
  status: PartnerStatus;
}

const partners: Partner[] = [
  { id: "1", name: "iFood", category: "alimentacao", icon: "🍔", discount: "10%", coins: 100, status: "em-breve" },
  { id: "2", name: "Drogasil", category: "saude", icon: "💊", discount: "15%", coins: 150, status: "em-breve" },
  { id: "3", name: "Smart Fit", category: "esportes", icon: "💪", discount: "20%", coins: 200, status: "em-breve" },
  { id: "4", name: "Spotify", category: "lazer", icon: "🎵", discount: "1 mês grátis", coins: 250, status: "em-breve" },
  { id: "5", name: "Pão de Açúcar", category: "alimentacao", icon: "🛒", discount: "R$10 off", coins: 100, status: "em-breve" },
  { id: "6", name: "Netshoes", category: "esportes", icon: "👟", discount: "15%", coins: 180, status: "em-breve" },
  { id: "7", name: "Centauro", category: "esportes", icon: "🏃", discount: "10%", coins: 150, status: "em-breve" },
  { id: "8", name: "Granado", category: "bem-estar", icon: "🧴", discount: "20%", coins: 200, status: "em-breve" },
  { id: "9", name: "Granny", category: "alimentacao", icon: "🥗", discount: "15%", coins: 130, status: "em-breve" },
  { id: "10", name: "Cinemark", category: "lazer", icon: "🎬", discount: "30%", coins: 200, status: "em-breve" },
  { id: "11", name: "Garmin", category: "esportes", icon: "⌚", discount: "Cashback", coins: 500, status: "em-breve" },
  { id: "12", name: "Amazon", category: "lazer", icon: "📦", discount: "5%", coins: 100, status: "em-breve" },
];

const CATEGORY_LABELS: Record<PartnerCategory, string> = {
  alimentacao: "Alimentação",
  esportes: "Esportes",
  "bem-estar": "Bem-estar",
  lazer: "Lazer",
  saude: "Saúde",
};

const FILTERS: { id: "todos" | PartnerCategory; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "alimentacao", label: "Alimentação" },
  { id: "esportes", label: "Esportes" },
  { id: "bem-estar", label: "Bem-estar" },
  { id: "lazer", label: "Lazer" },
  { id: "saude", label: "Saúde" },
];

export default function ParceirosPage() {
  const [coinBalance, setCoinBalance] = useState<CoinBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"todos" | PartnerCategory>("todos");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const balance = await WeeklyGoals.getCoinBalance();
        if (mounted) setCoinBalance(balance);
      } catch (err) {
        console.error("Erro ao carregar saldo de moedas", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const totalCoins = coinBalance?.total ?? 0;
  const hasCoins = totalCoins > 0;

  const filteredPartners = partners.filter((p) => {
    const matchCategory = filter === "todos" || p.category === filter;
    const matchSearch =
      search.trim() === "" ||
      p.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <AppShell>
      <div className="min-h-screen bg-[#F8F9FA] pb-24">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white border-b border-[#DADCE0]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <Link
              href="/home"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F1F3F4] transition-colors"
              aria-label="Voltar"
            >
              <ChevronLeft className="w-5 h-5 text-[#5F6368]" />
            </Link>
            <h1 className="flex-1 text-lg font-medium text-[#202124]">
              Parceiros e Recompensas
            </h1>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FEF7E0]">
              <Gift className="w-5 h-5 text-[#F9AB00]" />
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-5 space-y-5">
          {/* Coin Balance Card */}
          <motion.section
            custom={0}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="bg-white rounded-2xl border border-[#DADCE0] shadow-sm p-5"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FBBC04] to-[#F9AB00] flex items-center justify-center shadow-sm">
                <span className="text-2xl" aria-hidden>
                  🪙
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#5F6368] uppercase tracking-wide font-medium">
                  Suas moedas
                </p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-semibold text-[#202124] tabular-nums">
                    {loading ? "—" : totalCoins}
                  </span>
                  <Coins className="w-4 h-4 text-[#FBBC04]" />
                </div>
                <p className="text-sm text-[#5F6368] mt-1">
                  Use suas moedas para resgatar recompensas dos parceiros
                </p>
              </div>
            </div>
          </motion.section>

          {/* Empty State (sem moedas) */}
          {!loading && !hasCoins && (
            <motion.section
              custom={1}
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
              className="bg-white rounded-2xl border border-[#DADCE0] shadow-sm p-6 text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-[#F1F3F4] flex items-center justify-center mb-3">
                <Lock className="w-7 h-7 text-[#9AA0A6]" />
              </div>
              <h2 className="text-base font-medium text-[#202124]">
                Você ainda não tem moedas
              </h2>
              <p className="text-sm text-[#5F6368] mt-1 mb-4">
                Complete metas semanais para ganhar moedas e resgatar
                recompensas
              </p>
              <Link
                href="/metas"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1A73E8] text-white text-sm font-medium hover:bg-[#1765CC] transition-colors"
              >
                Ver metas semanais
              </Link>
            </motion.section>
          )}

          {/* Search */}
          <motion.section
            custom={2}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
          >
            <div className="relative">
              <Search className="w-4 h-4 text-[#9AA0A6] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar parceiro"
                className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-[#DADCE0] text-sm text-[#202124] placeholder:text-[#9AA0A6] focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/10 transition-all"
              />
            </div>
          </motion.section>

          {/* Categories filter */}
          <motion.section
            custom={3}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
          >
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
              {FILTERS.map((f) => {
                const active = filter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilter(f.id)}
                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                      active
                        ? "bg-[#1A73E8] text-white border-[#1A73E8] shadow-sm"
                        : "bg-white text-[#5F6368] border-[#DADCE0] hover:bg-[#F1F3F4]"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </motion.section>

          {/* Partners Grid */}
          <motion.section
            custom={4}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
          >
            {filteredPartners.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#DADCE0] shadow-sm p-8 text-center">
                <p className="text-sm text-[#5F6368]">
                  Nenhum parceiro encontrado
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {filteredPartners.map((partner, idx) => (
                  <motion.article
                    key={partner.id}
                    custom={idx}
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    className="bg-white rounded-2xl border border-[#DADCE0] shadow-sm p-4 flex flex-col"
                  >
                    {/* Status badge */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-12 h-12 rounded-2xl bg-[#F8F9FA] border border-[#DADCE0] flex items-center justify-center text-2xl">
                        <span aria-hidden>{partner.icon}</span>
                      </div>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#FEF7E0] text-[#B06000] uppercase tracking-wide">
                        Em breve
                      </span>
                    </div>

                    {/* Name + category */}
                    <h3 className="text-sm font-semibold text-[#202124] truncate">
                      {partner.name}
                    </h3>
                    <p className="text-[11px] text-[#5F6368] uppercase tracking-wide mt-0.5">
                      {CATEGORY_LABELS[partner.category]}
                    </p>

                    {/* Discount */}
                    <div className="mt-3 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#34A853]" />
                      <span className="text-sm font-semibold text-[#34A853]">
                        {partner.discount}
                      </span>
                    </div>

                    {/* Coins to redeem */}
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="text-xs" aria-hidden>
                        🪙
                      </span>
                      <span className="text-xs text-[#5F6368]">
                        <span className="font-medium text-[#202124] tabular-nums">
                          {partner.coins}
                        </span>{" "}
                        moedas
                      </span>
                    </div>

                    {/* Disabled button */}
                    <button
                      type="button"
                      disabled
                      className="mt-3 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-[#F1F3F4] text-[#9AA0A6] text-xs font-medium cursor-not-allowed"
                    >
                      <Lock className="w-3 h-3" />
                      Em breve
                    </button>
                  </motion.article>
                ))}
              </div>
            )}
          </motion.section>

          {/* Info Card */}
          <motion.section
            custom={5}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="bg-gradient-to-br from-[#E8F0FE] to-[#F8F9FA] rounded-2xl border border-[#DADCE0] shadow-sm p-5"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white border border-[#DADCE0] flex items-center justify-center shrink-0">
                <span className="text-lg" aria-hidden>
                  💡
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-[#202124]">
                  Mais parceiros em breve
                </h3>
                <p className="text-xs text-[#5F6368] mt-1 leading-relaxed">
                  Estamos negociando parcerias para que você possa trocar suas
                  moedas por descontos reais. As primeiras parcerias começam em
                  2026.
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-[#1A73E8] font-medium">
                  <ExternalLink className="w-3 h-3" />
                  Acompanhe novidades no app
                </div>
              </div>
            </div>
          </motion.section>
        </main>
      </div>
    </AppShell>
  );
}
