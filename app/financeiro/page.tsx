"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Wallet,
  Plus,
  Target,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Lock,
} from "lucide-react";
import Link from "next/link";

import AppShell from "@/components/layout/AppShell";
import {
  FinanceTracker,
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  CATEGORY_COLORS,
  type Expense,
  type ExpenseCategory,
  type MonthlyReport,
} from "@/lib/health/finance-tracker";

const ALL_CATEGORIES: ExpenseCategory[] = [
  "moradia",
  "alimentacao",
  "transporte",
  "saude",
  "lazer",
  "educacao",
  "outros",
];

const MONTH_LABELS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function formatBRLDetailed(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatMonthLabel(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return `${MONTH_LABELS[m - 1]} ${y}`;
}

function formatDateShort(date: string): string {
  const [, m, d] = date.split("-").map(Number);
  return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}`;
}

function getStatusColor(status: MonthlyReport["status"]): string {
  if (status === "critical") return "#EA4335";
  if (status === "warning") return "#FBBC04";
  return "#34A853";
}

function getStatusLabel(status: MonthlyReport["status"]): string {
  if (status === "critical") return "Crítico";
  if (status === "warning") return "Atenção";
  return "Saudável";
}

function getStatusBg(status: MonthlyReport["status"]): string {
  if (status === "critical") return "#FCE8E6";
  if (status === "warning") return "#FEF7E0";
  return "#E6F4EA";
}

export default function FinanceiroPage() {
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<ExpenseCategory | null>(
    null,
  );

  // Form: nova despesa
  const [formAmount, setFormAmount] = useState("");
  const [formCategory, setFormCategory] =
    useState<ExpenseCategory>("alimentacao");
  const [formDescription, setFormDescription] = useState("");
  const [formDate, setFormDate] = useState(
    new Date().toISOString().slice(0, 10),
  );

  // Form: orcamento
  const [budgetInput, setBudgetInput] = useState("");

  const currentMonth = FinanceTracker.getCurrentMonth();

  async function loadData() {
    setLoading(true);
    const r = await FinanceTracker.getMonthlyReport(currentMonth);
    setReport(r);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAddExpense(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseFloat(formAmount.replace(",", "."));
    if (!amount || amount <= 0) return;

    await FinanceTracker.addExpense({
      amount,
      category: formCategory,
      description: formDescription.trim() || CATEGORY_LABELS[formCategory],
      date: formDate,
    });

    setFormAmount("");
    setFormDescription("");
    setFormCategory("alimentacao");
    setFormDate(new Date().toISOString().slice(0, 10));
    setShowAddModal(false);
    await loadData();
  }

  async function handleSaveBudget(e: React.FormEvent) {
    e.preventDefault();
    const value = parseFloat(budgetInput.replace(",", "."));
    if (!value || value <= 0) return;
    await FinanceTracker.setBudget(currentMonth, value);
    setBudgetInput("");
    setShowBudgetModal(false);
    await loadData();
  }

  async function handleDeleteExpense(id: string) {
    await FinanceTracker.deleteExpense(id, currentMonth);
    await loadData();
  }

  const hasBudget = (report?.totalBudget ?? 0) > 0;
  const statusColor = report ? getStatusColor(report.status) : "#34A853";
  const statusBg = report ? getStatusBg(report.status) : "#E6F4EA";

  // Despesas filtradas
  const filteredExpenses = report
    ? filterCategory
      ? report.expenses.filter((e) => e.category === filterCategory)
      : report.expenses
    : [];

  const visibleExpenses = filteredExpenses.slice(0, 10);

  return (
    <AppShell>
      <div className="min-h-screen bg-white pb-24">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-[#DADCE0]">
          <div className="flex items-center gap-3 px-4 h-14">
            <Link
              href="/home"
              className="p-2 -ml-2 rounded-full hover:bg-[#F1F3F4] transition-colors"
              aria-label="Voltar"
            >
              <ChevronLeft className="w-5 h-5 text-[#5F6368]" />
            </Link>
            <div className="flex items-center gap-2 flex-1">
              <Wallet className="w-5 h-5 text-[#1A73E8]" />
              <h1 className="text-[18px] font-medium text-[#202124]">
                Saúde Financeira
              </h1>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 space-y-4">
          {loading ? (
            <div className="text-center py-12 text-[#5F6368] text-sm">
              Carregando...
            </div>
          ) : (
            <>
              {/* Hero Card — Status do mes */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl border border-[#DADCE0] shadow-sm p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[12px] text-[#5F6368] uppercase tracking-wide">
                      Mês atual
                    </p>
                    <h2 className="text-[20px] font-medium text-[#202124] mt-0.5">
                      {formatMonthLabel(currentMonth)}
                    </h2>
                  </div>
                  {hasBudget && report && (
                    <span
                      className="px-3 py-1 rounded-full text-[12px] font-medium flex items-center gap-1"
                      style={{
                        backgroundColor: statusBg,
                        color: statusColor,
                      }}
                    >
                      {report.status === "healthy" && (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      {report.status === "warning" && (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      )}
                      {report.status === "critical" && (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      )}
                      {getStatusLabel(report.status)}
                    </span>
                  )}
                </div>

                {hasBudget && report ? (
                  <>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-[28px] font-medium text-[#202124]">
                        {formatBRL(report.totalSpent)}
                      </span>
                      <span className="text-[14px] text-[#5F6368]">
                        / {formatBRL(report.totalBudget)}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 bg-[#F1F3F4] rounded-full overflow-hidden mb-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(100, report.budgetUsedPercent)}%`,
                        }}
                        transition={{
                          duration: 0.8,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: statusColor }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[13px]">
                      <span className="text-[#5F6368]">
                        {report.budgetUsedPercent}% do orçamento usado
                      </span>
                      <span className="text-[#202124] font-medium">
                        Restam {formatBRL(report.remainingBudget)} ·{" "}
                        {report.daysRemainingInMonth} dias
                      </span>
                    </div>
                  </>
                ) : (
                  /* Sem orcamento */
                  <div className="text-center py-2">
                    <Target className="w-10 h-10 text-[#1A73E8] mx-auto mb-2" />
                    <p className="text-[15px] text-[#202124] font-medium mb-1">
                      Defina seu orçamento mensal
                    </p>
                    <p className="text-[13px] text-[#5F6368] mb-4">
                      Comece controlando seus gastos do mês
                    </p>
                    <form
                      onSubmit={handleSaveBudget}
                      className="flex gap-2 max-w-xs mx-auto"
                    >
                      <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5F6368] text-[14px]">
                          R$
                        </span>
                        <input
                          type="number"
                          inputMode="decimal"
                          step="0.01"
                          min="1"
                          required
                          value={budgetInput}
                          onChange={(e) => setBudgetInput(e.target.value)}
                          placeholder="5000"
                          className="w-full pl-9 pr-3 py-2.5 rounded-full border border-[#DADCE0] text-[14px] text-[#202124] focus:outline-none focus:border-[#1A73E8]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-full bg-[#1A73E8] text-white text-[14px] font-medium hover:bg-[#1765CC] transition-colors"
                      >
                        Salvar
                      </button>
                    </form>
                  </div>
                )}
              </motion.div>

              {/* Categorias grid */}
              {hasBudget && report && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2 px-1">
                    <h3 className="text-[14px] font-medium text-[#202124]">
                      Categorias
                    </h3>
                    {filterCategory && (
                      <button
                        onClick={() => setFilterCategory(null)}
                        className="text-[12px] text-[#1A73E8] font-medium"
                      >
                        Limpar filtro
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {ALL_CATEGORIES.map((cat) => {
                      const data = report.byCategory[cat];
                      const isActive = filterCategory === cat;
                      const catColor = CATEGORY_COLORS[cat];
                      return (
                        <button
                          key={cat}
                          onClick={() =>
                            setFilterCategory(isActive ? null : cat)
                          }
                          className={`text-left bg-white rounded-2xl border shadow-sm p-3 transition-all ${
                            isActive
                              ? "border-[#1A73E8] ring-2 ring-[#1A73E8]/20"
                              : "border-[#DADCE0]"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[20px]">
                              {CATEGORY_ICONS[cat]}
                            </span>
                            <span className="text-[13px] font-medium text-[#202124]">
                              {CATEGORY_LABELS[cat]}
                            </span>
                          </div>
                          <p className="text-[14px] text-[#202124] font-medium">
                            {formatBRL(data.spent)}
                          </p>
                          <p className="text-[11px] text-[#5F6368]">
                            de {formatBRL(data.budget)}
                          </p>
                          <div className="h-1.5 bg-[#F1F3F4] rounded-full overflow-hidden mt-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${Math.min(100, data.percent)}%`,
                              }}
                              transition={{
                                duration: 0.6,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: catColor }}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Lista de despesas */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                <div className="flex items-center justify-between mb-2 px-1">
                  <h3 className="text-[14px] font-medium text-[#202124]">
                    {filterCategory
                      ? `Despesas — ${CATEGORY_LABELS[filterCategory]}`
                      : "Despesas recentes"}
                  </h3>
                  <span className="text-[12px] text-[#5F6368]">
                    {filteredExpenses.length} no mês
                  </span>
                </div>

                {visibleExpenses.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-[#DADCE0] shadow-sm p-8 text-center">
                    <Wallet className="w-10 h-10 text-[#DADCE0] mx-auto mb-2" />
                    <p className="text-[14px] text-[#5F6368]">
                      Nenhuma despesa registrada
                    </p>
                    <p className="text-[12px] text-[#5F6368] mt-1">
                      Toque no botão + para adicionar
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-[#DADCE0] shadow-sm overflow-hidden">
                    {visibleExpenses.map((exp, i) => (
                      <ExpenseRow
                        key={exp.id}
                        expense={exp}
                        isLast={i === visibleExpenses.length - 1}
                        onDelete={() => handleDeleteExpense(exp.id)}
                      />
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Tip card */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-[#E8F0FE] rounded-2xl border border-[#1A73E8]/20 p-4"
              >
                <p className="text-[14px] font-medium text-[#1A73E8] mb-1">
                  💡 Dica do mês: revise seu plano de saúde
                </p>
                <p className="text-[13px] text-[#202124] leading-relaxed mb-2">
                  Muitas pessoas pagam por coberturas que nunca usam. Reveja seu
                  plano anualmente — uma redução de R$ 100/mês representa R$
                  1.200 por ano que podem ir para sua reserva de emergência.
                </p>
                <p className="text-[12px] text-[#5F6368] italic">
                  Saúde financeira reduz estresse e melhora bem-estar geral.
                </p>
              </motion.div>

              {/* Privacy footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="text-center pt-4 pb-2 px-4"
              >
                <div className="inline-flex items-center gap-1.5 text-[12px] text-[#5F6368] mb-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>
                    Seus dados financeiros ficam apenas no seu celular
                  </span>
                </div>
                <p className="text-[11px] text-[#5F6368]">
                  Nenhuma integração bancária. Nenhum dado compartilhado.
                </p>
              </motion.div>
            </>
          )}
        </div>

        {/* FAB */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 260, damping: 20 }}
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-24 right-5 z-40 w-14 h-14 rounded-2xl bg-[#1A73E8] text-white shadow-lg flex items-center justify-center hover:bg-[#1765CC] transition-colors"
          style={{ boxShadow: "0 4px 12px rgba(26,115,232,0.4)" }}
          aria-label="Adicionar despesa"
        >
          <Plus className="w-6 h-6" />
        </motion.button>

        {/* Bottom sheet — Adicionar despesa */}
        <AnimatePresence>
          {showAddModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddModal(false)}
                className="fixed inset-0 z-[55] bg-black/40"
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 z-[60] bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white pt-3 pb-2 px-5 border-b border-[#DADCE0]">
                  <div className="w-10 h-1 bg-[#DADCE0] rounded-full mx-auto mb-3" />
                  <h2 className="text-[18px] font-medium text-[#202124]">
                    Nova despesa
                  </h2>
                </div>

                <form onSubmit={handleAddExpense} className="p-5 space-y-4">
                  {/* Valor */}
                  <div>
                    <label className="block text-[12px] text-[#5F6368] mb-1.5">
                      Valor
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5F6368] text-[18px]">
                        R$
                      </span>
                      <input
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        min="0.01"
                        required
                        autoFocus
                        value={formAmount}
                        onChange={(e) => setFormAmount(e.target.value)}
                        placeholder="0,00"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#DADCE0] text-[18px] text-[#202124] focus:outline-none focus:border-[#1A73E8]"
                      />
                    </div>
                  </div>

                  {/* Categoria — chips */}
                  <div>
                    <label className="block text-[12px] text-[#5F6368] mb-1.5">
                      Categoria
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {ALL_CATEGORIES.map((cat) => {
                        const isActive = formCategory === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setFormCategory(cat)}
                            className={`px-3 py-2 rounded-full text-[13px] font-medium border transition-all flex items-center gap-1.5 ${
                              isActive
                                ? "bg-[#E8F0FE] border-[#1A73E8] text-[#1A73E8]"
                                : "bg-white border-[#DADCE0] text-[#5F6368]"
                            }`}
                          >
                            <span>{CATEGORY_ICONS[cat]}</span>
                            <span>{CATEGORY_LABELS[cat]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Descricao */}
                  <div>
                    <label className="block text-[12px] text-[#5F6368] mb-1.5">
                      Descrição (opcional)
                    </label>
                    <input
                      type="text"
                      maxLength={80}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Ex: Mercado, Uber, Farmácia..."
                      className="w-full px-4 py-3 rounded-xl border border-[#DADCE0] text-[14px] text-[#202124] focus:outline-none focus:border-[#1A73E8]"
                    />
                  </div>

                  {/* Data */}
                  <div>
                    <label className="block text-[12px] text-[#5F6368] mb-1.5">
                      Data
                    </label>
                    <input
                      type="date"
                      required
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      max={new Date().toISOString().slice(0, 10)}
                      className="w-full px-4 py-3 rounded-xl border border-[#DADCE0] text-[14px] text-[#202124] focus:outline-none focus:border-[#1A73E8]"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 py-3 rounded-full border border-[#DADCE0] text-[14px] font-medium text-[#5F6368] hover:bg-[#F1F3F4] transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-full bg-[#1A73E8] text-white text-[14px] font-medium hover:bg-[#1765CC] transition-colors"
                    >
                      Adicionar
                    </button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}

// ---------------------------------------------------------------------------
// ExpenseRow — linha de despesa com botao de excluir
// ---------------------------------------------------------------------------

function ExpenseRow({
  expense,
  isLast,
  onDelete,
}: {
  expense: Expense;
  isLast: boolean;
  onDelete: () => void;
}) {
  const [confirming, setConfirming] = useState(false);

  function handleClick() {
    if (confirming) {
      onDelete();
    } else {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 2500);
    }
  }

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 ${
        !isLast ? "border-b border-[#F1F3F4]" : ""
      }`}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-[18px] flex-shrink-0"
        style={{
          backgroundColor: `${CATEGORY_COLORS[expense.category]}15`,
        }}
      >
        {CATEGORY_ICONS[expense.category]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] text-[#202124] font-medium truncate">
          {expense.description}
        </p>
        <p className="text-[12px] text-[#5F6368]">
          {CATEGORY_LABELS[expense.category]} ·{" "}
          {formatDateShort(expense.date)}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-[14px] text-[#202124] font-medium">
          {formatBRLDetailed(expense.amount)}
        </p>
      </div>
      <button
        onClick={handleClick}
        className={`p-2 rounded-full transition-all flex-shrink-0 ${
          confirming
            ? "bg-[#FCE8E6] text-[#EA4335]"
            : "text-[#5F6368] hover:bg-[#F1F3F4]"
        }`}
        aria-label={confirming ? "Confirmar exclusão" : "Excluir despesa"}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
