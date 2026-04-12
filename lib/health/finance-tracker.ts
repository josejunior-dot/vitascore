/**
 * Finance Tracker — Pilar de Saude Financeira do SaluFlow
 *
 * PRINCIPIOS:
 * 1. Dados ficam APENAS no dispositivo (LGPD)
 * 2. Sem integracao bancaria
 * 3. Sem aconselhamento de investimentos
 * 4. Sem comparacao entre usuarios
 * 5. Apenas entrada manual
 * 6. Apenas dados AGREGADOS para relatorio do RH
 *    (NR-1: estresse financeiro e fator psicossocial reconhecido)
 */

// ---------------------------------------------------------------------------
// Storage helpers
// ---------------------------------------------------------------------------

async function getStore(key: string): Promise<any> {
  try {
    const { Preferences } = await import("@capacitor/preferences");
    const { value } = await Preferences.get({ key });
    return value ? JSON.parse(value) : null;
  } catch {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  }
}

async function setStore(key: string, data: any): Promise<void> {
  const value = JSON.stringify(data);
  try {
    const { Preferences } = await import("@capacitor/preferences");
    await Preferences.set({ key, value });
  } catch {
    localStorage.setItem(key, value);
  }
}

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export type ExpenseCategory =
  | "moradia"
  | "alimentacao"
  | "transporte"
  | "saude"
  | "lazer"
  | "educacao"
  | "outros";

export interface Expense {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number; // em reais
  category: ExpenseCategory;
  description: string;
  timestamp: string; // ISO
}

export interface MonthlyBudget {
  month: string; // YYYY-MM
  totalBudget: number;
  byCategory: Partial<Record<ExpenseCategory, number>>;
}

export interface MonthlyReport {
  month: string;
  totalSpent: number;
  totalBudget: number;
  remainingBudget: number;
  budgetUsedPercent: number;
  expenses: Expense[];
  byCategory: Record<
    ExpenseCategory,
    { spent: number; budget: number; percent: number }
  >;
  status: "healthy" | "warning" | "critical"; // <70% / 70-90% / >90%
  daysIntoMonth: number;
  daysRemainingInMonth: number;
}

export interface FinanceWellbeing {
  hasOrcamento: boolean; // tem orcamento definido
  budgetControlled: boolean; // gastando dentro do orcamento
  stressLevel: "low" | "moderate" | "high";
  monthsTracked: number;
}

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  moradia: "Moradia",
  alimentacao: "Alimentação",
  transporte: "Transporte",
  saude: "Saúde",
  lazer: "Lazer",
  educacao: "Educação",
  outros: "Outros",
};

export const CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  moradia: "🏠",
  alimentacao: "🍽️",
  transporte: "🚗",
  saude: "💊",
  lazer: "🎬",
  educacao: "📚",
  outros: "💼",
};

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  moradia: "#1A73E8",
  alimentacao: "#FBBC04",
  transporte: "#34A853",
  saude: "#EA4335",
  lazer: "#A142F4",
  educacao: "#00897B",
  outros: "#5F6368",
};

const ALL_CATEGORIES: ExpenseCategory[] = [
  "moradia",
  "alimentacao",
  "transporte",
  "saude",
  "lazer",
  "educacao",
  "outros",
];

// Storage keys
const expensesKey = (month: string) => `finance-expenses-${month}`;
const budgetKey = (month: string) => `finance-budget-${month}`;
const HISTORY_KEY = "finance-history";

// ---------------------------------------------------------------------------
// Helpers internos
// ---------------------------------------------------------------------------

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function monthFromDate(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
}

function daysInMonth(month: string): number {
  const [y, m] = month.split("-").map(Number);
  return new Date(y, m, 0).getDate();
}

async function trackMonth(month: string): Promise<void> {
  const history: string[] = (await getStore(HISTORY_KEY)) ?? [];
  if (!history.includes(month)) {
    history.push(month);
    await setStore(HISTORY_KEY, history);
  }
}

// ---------------------------------------------------------------------------
// FinanceTracker
// ---------------------------------------------------------------------------

export class FinanceTracker {
  // -------------------------------------------------------------------------
  // Mes corrente
  // -------------------------------------------------------------------------

  static getCurrentMonth(): string {
    return monthFromDate(new Date());
  }

  // -------------------------------------------------------------------------
  // Despesas
  // -------------------------------------------------------------------------

  static async addExpense(
    expense: Omit<Expense, "id" | "timestamp">,
  ): Promise<Expense> {
    const month = expense.date.slice(0, 7);
    const list: Expense[] = (await getStore(expensesKey(month))) ?? [];

    const newExpense: Expense = {
      ...expense,
      id: `exp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
    };

    list.push(newExpense);
    await setStore(expensesKey(month), list);
    await trackMonth(month);

    return newExpense;
  }

  static async deleteExpense(id: string, month: string): Promise<void> {
    const list: Expense[] = (await getStore(expensesKey(month))) ?? [];
    const filtered = list.filter((e) => e.id !== id);
    await setStore(expensesKey(month), filtered);
  }

  static async getExpenses(month: string): Promise<Expense[]> {
    const list: Expense[] = (await getStore(expensesKey(month))) ?? [];
    return list;
  }

  // -------------------------------------------------------------------------
  // Orcamento
  // -------------------------------------------------------------------------

  static async setBudget(
    month: string,
    totalBudget: number,
    byCategory?: Partial<Record<ExpenseCategory, number>>,
  ): Promise<void> {
    const budget: MonthlyBudget = {
      month,
      totalBudget,
      byCategory: byCategory ?? {},
    };
    await setStore(budgetKey(month), budget);
    await trackMonth(month);
  }

  static async getBudget(month: string): Promise<MonthlyBudget | null> {
    const stored = await getStore(budgetKey(month));
    if (!stored) return null;
    return {
      month: stored.month ?? month,
      totalBudget: stored.totalBudget ?? 0,
      byCategory: stored.byCategory ?? {},
    };
  }

  // -------------------------------------------------------------------------
  // Relatorio mensal
  // -------------------------------------------------------------------------

  static async getMonthlyReport(month?: string): Promise<MonthlyReport> {
    const targetMonth = month ?? this.getCurrentMonth();
    const expenses = await this.getExpenses(targetMonth);
    const budget = await this.getBudget(targetMonth);

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalBudget = budget?.totalBudget ?? 0;
    const remainingBudget = Math.max(0, totalBudget - totalSpent);
    const budgetUsedPercent =
      totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

    // Por categoria
    const byCategory = {} as Record<
      ExpenseCategory,
      { spent: number; budget: number; percent: number }
    >;
    for (const cat of ALL_CATEGORIES) {
      const spent = expenses
        .filter((e) => e.category === cat)
        .reduce((s, e) => s + e.amount, 0);
      const catBudget = budget?.byCategory?.[cat] ?? 0;
      const percent =
        catBudget > 0 ? Math.round((spent / catBudget) * 100) : 0;
      byCategory[cat] = { spent, budget: catBudget, percent };
    }

    // Status
    let status: MonthlyReport["status"] = "healthy";
    if (totalBudget > 0) {
      if (budgetUsedPercent > 90) status = "critical";
      else if (budgetUsedPercent >= 70) status = "warning";
      else status = "healthy";
    }

    // Dias do mes
    const totalDays = daysInMonth(targetMonth);
    const now = new Date();
    const isCurrentMonth = monthFromDate(now) === targetMonth;
    const daysIntoMonth = isCurrentMonth ? now.getDate() : totalDays;
    const daysRemainingInMonth = Math.max(0, totalDays - daysIntoMonth);

    return {
      month: targetMonth,
      totalSpent,
      totalBudget,
      remainingBudget,
      budgetUsedPercent,
      expenses: [...expenses].sort((a, b) =>
        b.timestamp.localeCompare(a.timestamp),
      ),
      byCategory,
      status,
      daysIntoMonth,
      daysRemainingInMonth,
    };
  }

  // -------------------------------------------------------------------------
  // Bem-estar financeiro (agregado para relatorio do RH — NR-1)
  // -------------------------------------------------------------------------

  static async getWellbeingMetrics(): Promise<FinanceWellbeing> {
    const history: string[] = (await getStore(HISTORY_KEY)) ?? [];
    const currentMonth = this.getCurrentMonth();
    const report = await this.getMonthlyReport(currentMonth);

    const hasOrcamento = report.totalBudget > 0;
    const budgetControlled = hasOrcamento && report.budgetUsedPercent <= 90;

    // Nivel de estresse financeiro (baseado APENAS em metricas locais agregadas)
    // - Sem orcamento OU > 90% gasto = high
    // - 70-90% gasto = moderate
    // - <70% gasto = low
    let stressLevel: FinanceWellbeing["stressLevel"] = "low";
    if (!hasOrcamento) {
      stressLevel = "moderate";
    } else if (report.status === "critical") {
      stressLevel = "high";
    } else if (report.status === "warning") {
      stressLevel = "moderate";
    } else {
      stressLevel = "low";
    }

    return {
      hasOrcamento,
      budgetControlled,
      stressLevel,
      monthsTracked: history.length,
    };
  }
}
