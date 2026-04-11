/**
 * Weekly Goals Engine — Metas semanais personalizadas
 *
 * Motor de engajamento inspirado no modelo Prudential Vitality:
 * - Metas PERSONALIZADAS ao desempenho recente do usuario
 * - Recompensa por PARTICIPACAO, nao por resultado absoluto
 * - Todos ganham a mesma quantidade de pontos por meta cumprida
 * - PCD, gestantes, condicoes cronicas: metas ADAPTADAS (alvos diferentes, mesma recompensa)
 * - Metas sao SUGESTOES — sem penalidade por nao cumprir
 * - Dados ficam locais no dispositivo (LGPD)
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
// Types
// ---------------------------------------------------------------------------

export type GoalCategory = "movement" | "sleep" | "nutrition" | "wellbeing" | "digital";

export interface WeeklyGoal {
  id: string;
  category: GoalCategory;
  icon: string;
  title: string;
  description: string;
  target: number;
  unit: string;
  current: number;
  completed: boolean;
  pointsReward: number;
  adapted?: boolean;
}

export interface WeekPlan {
  weekId: string;          // "2026-W15"
  weekNumber: number;      // 15
  weekYear: number;        // 2026
  startDate: string;       // segunda-feira ISO
  endDate: string;         // domingo ISO
  goals: WeeklyGoal[];
  totalCoins: number;
  maxCoins: number;        // 180
  completedCount: number;
  allCompleted: boolean;
  bonusCoins: number;
}

export interface CoinBalance {
  total: number;
  currentMonth: number;
  currentWeek: number;
  weekCoins: number;
  weekMax: number;
  monthCoins: number;
  streak: number;
}

export interface WeekHistory {
  weekId: string;
  weekNumber: number;
  weekYear: number;
  startDate: string;
  endDate: string;
  goalsCompleted: number;
  totalGoals: number;
  coinsEarned: number;
  completedCount: number;
  totalCoins: number;
  maxCoins: number;
}

export interface UserGoalProfile {
  avgDailySteps: number;
  avgSleepHours: number;
  mealsPerDay: number;
  checkinsPerWeek: number;
  screenTimeMinutes: number;
  adaptations: string[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORE_KEYS = {
  WEEK_PLAN: "saluflow_week_plan",
  WEEK_HISTORY: "saluflow_week_history",
  COIN_BALANCE: "saluflow_coin_balance",
  GOAL_PROFILE: "saluflow_goal_profile",
} as const;

const COINS_PER_GOAL = 50;
const GOALS_PER_WEEK = 3;
const ALL_COMPLETED_BONUS = 30;
const MAX_COINS_PER_WEEK = GOALS_PER_WEEK * COINS_PER_GOAL + ALL_COMPLETED_BONUS; // 180

const DEFAULT_PROFILE: UserGoalProfile = {
  avgDailySteps: 4500,
  avgSleepHours: 6.5,
  mealsPerDay: 2,
  checkinsPerWeek: 2,
  screenTimeMinutes: 300,
  adaptations: [],
};

const ALL_CATEGORIES: GoalCategory[] = ["movement", "sleep", "nutrition", "wellbeing", "digital"];
const UNIVERSAL_CATEGORIES: GoalCategory[] = ["wellbeing", "nutrition"];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getWeekId(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  return d.getUTCFullYear() + "-W" + String(weekNo).padStart(2, "0");
}

function getWeekNumber(date: Date): number {
  const id = getWeekId(date);
  return parseInt(id.split("-W")[1], 10);
}

function getWeekYear(date: Date): number {
  const id = getWeekId(date);
  return parseInt(id.split("-W")[0], 10);
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekEnd(date: Date): Date {
  const mon = getWeekStart(date);
  const sun = new Date(mon);
  sun.setDate(sun.getDate() + 6);
  sun.setHours(23, 59, 59, 999);
  return sun;
}

function toISODate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function roundToNearest(value: number, nearest: number): number {
  return Math.round(value / nearest) * nearest;
}

function generateId(): string {
  return "goal_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
}

function currentMonthKey(): string {
  const now = new Date();
  return now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");
}

// ---------------------------------------------------------------------------
// Goal Templates
// ---------------------------------------------------------------------------

interface GoalTemplate {
  category: GoalCategory;
  icon: string;
  adapted?: boolean;
  generate: (profile: UserGoalProfile) => Pick<WeeklyGoal, "title" | "description" | "target" | "unit">;
}

function getMovementTemplates(profile: UserGoalProfile): GoalTemplate[] {
  const hasWheelchair = profile.adaptations.includes("wheelchair");
  const isPregnant = profile.adaptations.includes("pregnant");

  if (hasWheelchair) {
    return [
      {
        category: "movement",
        icon: "\u267F",
        adapted: true,
        generate: () => ({
          title: "Exercicio adaptado",
          description: "15 minutos de exercicio adaptado em 3 dias",
          target: 3,
          unit: "dias",
        }),
      },
      {
        category: "movement",
        icon: "\uD83D\uDCAA",
        adapted: true,
        generate: () => ({
          title: "Alongamento diario",
          description: "10 minutos de alongamento em 4 dias",
          target: 4,
          unit: "dias",
        }),
      },
    ];
  }

  if (isPregnant) {
    return [
      {
        category: "movement",
        icon: "\uD83E\uDD30",
        adapted: true,
        generate: () => ({
          title: "Caminhada leve",
          description: "20 minutos de caminhada leve em 3 dias",
          target: 3,
          unit: "dias",
        }),
      },
    ];
  }

  const stepsTarget = roundToNearest(Math.max(profile.avgDailySteps * 1.1, 2000), 500);

  return [
    {
      category: "movement",
      icon: "\uD83D\uDEB6",
      generate: () => ({
        title: stepsTarget.toLocaleString("pt-BR") + " passos em 3 dias",
        description: "Alcance " + stepsTarget.toLocaleString("pt-BR") + " passos em pelo menos 3 dias esta semana",
        target: 3,
        unit: "dias",
      }),
    },
    {
      category: "movement",
      icon: "\uD83C\uDFC3",
      generate: () => ({
        title: "30 min de atividade 3x",
        description: "Faca 30 minutos de atividade fisica em 3 dias",
        target: 3,
        unit: "dias",
      }),
    },
    {
      category: "movement",
      icon: "\uD83D\uDEB4",
      generate: () => ({
        title: "Subir escadas 4 dias",
        description: "Use escadas ao inves do elevador em 4 dias",
        target: 4,
        unit: "dias",
      }),
    },
  ];
}

function getSleepTemplates(profile: UserGoalProfile): GoalTemplate[] {
  const sleepTarget = Math.max(Math.round((profile.avgSleepHours + 0.5) * 2) / 2, 6);

  return [
    {
      category: "sleep",
      icon: "\uD83D\uDE34",
      generate: () => ({
        title: "Dormir " + sleepTarget + "h em 4 noites",
        description: "Durma pelo menos " + sleepTarget + " horas em 4 noites esta semana",
        target: 4,
        unit: "noites",
      }),
    },
    {
      category: "sleep",
      icon: "\uD83D\uDCA4",
      generate: () => ({
        title: "Registrar sono 5 noites",
        description: "Registre seu horario de sono em 5 noites esta semana",
        target: 5,
        unit: "noites",
      }),
    },
    {
      category: "sleep",
      icon: "\uD83D\uDECF\uFE0F",
      generate: () => ({
        title: "Deitar antes das 23h em 3 noites",
        description: "Va para a cama antes das 23h em pelo menos 3 noites",
        target: 3,
        unit: "noites",
      }),
    },
  ];
}

function getNutritionTemplates(profile: UserGoalProfile): GoalTemplate[] {
  const mealTarget = Math.max(Math.round(profile.mealsPerDay * 1.15), 2);

  return [
    {
      category: "nutrition",
      icon: "\uD83C\uDF7D\uFE0F",
      generate: () => ({
        title: "Registrar " + mealTarget + " refeicoes com foto",
        description: "Fotografe " + mealTarget + " refeicoes ao longo da semana",
        target: mealTarget,
        unit: "refeicoes",
      }),
    },
    {
      category: "nutrition",
      icon: "\uD83E\uDD57",
      generate: () => ({
        title: "Cafe, almoco e jantar em 3 dias",
        description: "Registre as 3 refeicoes principais em pelo menos 3 dias",
        target: 3,
        unit: "dias",
      }),
    },
    {
      category: "nutrition",
      icon: "\uD83D\uDCA7",
      generate: () => ({
        title: "Beber 2L de agua em 5 dias",
        description: "Registre consumo de pelo menos 2 litros de agua em 5 dias",
        target: 5,
        unit: "dias",
      }),
    },
  ];
}

function getWellbeingTemplates(profile: UserGoalProfile): GoalTemplate[] {
  const checkinTarget = Math.max(Math.round(profile.checkinsPerWeek * 1.2), 3);

  return [
    {
      category: "wellbeing",
      icon: "\uD83D\uDE0A",
      generate: () => ({
        title: "Responder check-in " + checkinTarget + " dias",
        description: "Responda o check-in de bem-estar em " + checkinTarget + " dias esta semana",
        target: checkinTarget,
        unit: "dias",
      }),
    },
    {
      category: "wellbeing",
      icon: "\uD83E\uDDD8",
      generate: () => ({
        title: "5 min de meditacao 3 dias",
        description: "Faca 5 minutos de meditacao ou respiracao em 3 dias",
        target: 3,
        unit: "dias",
      }),
    },
    {
      category: "wellbeing",
      icon: "\uD83D\uDCDD",
      generate: () => ({
        title: "Gratidao diaria 4 dias",
        description: "Escreva 1 coisa pela qual voce e grato em 4 dias",
        target: 4,
        unit: "dias",
      }),
    },
  ];
}

function getDigitalTemplates(profile: UserGoalProfile): GoalTemplate[] {
  const screenTarget = Math.round((profile.screenTimeMinutes * 0.9) / 60 * 2) / 2;
  const screenHours = Math.max(screenTarget, 2);

  return [
    {
      category: "digital",
      icon: "\uD83D\uDCF1",
      generate: () => ({
        title: "Tela abaixo de " + screenHours + "h em 3 dias",
        description: "Mantenha o tempo de tela abaixo de " + screenHours + " horas em 3 dias",
        target: 3,
        unit: "dias",
      }),
    },
    {
      category: "digital",
      icon: "\uD83C\uDF19",
      generate: () => ({
        title: "Sem celular 23h-6h em 3 noites",
        description: "Evite uso do celular entre 23h e 6h em 3 noites",
        target: 3,
        unit: "noites",
      }),
    },
    {
      category: "digital",
      icon: "\uD83D\uDD14",
      generate: () => ({
        title: "Modo foco 2h em 3 dias",
        description: "Ative o modo foco por pelo menos 2 horas em 3 dias",
        target: 3,
        unit: "dias",
      }),
    },
  ];
}

function getAllTemplates(profile: UserGoalProfile): Map<GoalCategory, GoalTemplate[]> {
  return new Map<GoalCategory, GoalTemplate[]>([
    ["movement", getMovementTemplates(profile)],
    ["sleep", getSleepTemplates(profile)],
    ["nutrition", getNutritionTemplates(profile)],
    ["wellbeing", getWellbeingTemplates(profile)],
    ["digital", getDigitalTemplates(profile)],
  ]);
}

function selectCategories(weekId: string): GoalCategory[] {
  const weekNum = parseInt(weekId.split("-W")[1], 10) || 1;

  const universalIdx = weekNum % UNIVERSAL_CATEGORIES.length;
  const guaranteed: GoalCategory = UNIVERSAL_CATEGORIES[universalIdx];

  const remaining = ALL_CATEGORIES.filter((c) => c !== guaranteed);
  const pick1 = remaining[weekNum % remaining.length];
  const pick2 = remaining[(weekNum + 2) % remaining.length];

  const selected = new Set<GoalCategory>([guaranteed, pick1, pick2]);
  if (selected.size < GOALS_PER_WEEK) {
    for (const cat of remaining) {
      if (!selected.has(cat)) {
        selected.add(cat);
        if (selected.size >= GOALS_PER_WEEK) break;
      }
    }
  }

  return Array.from(selected).slice(0, GOALS_PER_WEEK);
}

// ---------------------------------------------------------------------------
// WeeklyGoals — Static API
// ---------------------------------------------------------------------------

export class WeeklyGoals {
  /**
   * Gera as metas da semana com base no perfil do usuario.
   */
  static async generateWeekGoals(profile?: UserGoalProfile): Promise<WeekPlan> {
    const p = profile ?? (await WeeklyGoals.getProfile());
    const now = new Date();
    const weekId = getWeekId(now);
    const categories = selectCategories(weekId);
    const templates = getAllTemplates(p);

    const goals: WeeklyGoal[] = categories.map((cat) => {
      const catTemplates = templates.get(cat)!;
      const template = catTemplates[Math.floor(Math.random() * catTemplates.length)];
      const spec = template.generate(p);

      return {
        id: generateId(),
        category: cat,
        icon: template.icon,
        title: spec.title,
        description: spec.description,
        target: spec.target,
        unit: spec.unit,
        current: 0,
        completed: false,
        pointsReward: COINS_PER_GOAL,
        adapted: template.adapted,
      };
    });

    const plan: WeekPlan = {
      weekId,
      weekNumber: getWeekNumber(now),
      weekYear: getWeekYear(now),
      startDate: toISODate(getWeekStart(now)),
      endDate: toISODate(getWeekEnd(now)),
      goals,
      totalCoins: 0,
      maxCoins: MAX_COINS_PER_WEEK,
      completedCount: 0,
      allCompleted: false,
      bonusCoins: ALL_COMPLETED_BONUS,
    };

    await setStore(STORE_KEYS.WEEK_PLAN, plan);
    await WeeklyGoals._appendToHistory(plan);

    return plan;
  }

  /**
   * Retorna o plano da semana atual ou null se nao existir.
   */
  static async getCurrentWeek(): Promise<WeekPlan | null> {
    const stored: WeekPlan | null = await getStore(STORE_KEYS.WEEK_PLAN);
    const currentWeekId = getWeekId(new Date());

    if (stored && stored.weekId === currentWeekId) {
      return stored;
    }

    return null;
  }

  /**
   * Atualiza o progresso de uma meta.
   */
  static async updateGoalProgress(goalId: string, current: number): Promise<WeekPlan> {
    let plan = await WeeklyGoals.getCurrentWeek();
    if (!plan) plan = await WeeklyGoals.generateWeekGoals();

    const goal = plan.goals.find((g) => g.id === goalId);
    if (!goal) throw new Error("Meta nao encontrada: " + goalId);

    goal.current = current;

    if (!goal.completed && current >= goal.target) {
      goal.completed = true;
      plan.completedCount += 1;
      plan.totalCoins += COINS_PER_GOAL;
      await WeeklyGoals._addCoins(COINS_PER_GOAL, "Meta concluida: " + goal.title);

      if (plan.completedCount === GOALS_PER_WEEK) {
        plan.allCompleted = true;
        plan.totalCoins += ALL_COMPLETED_BONUS;
        await WeeklyGoals._addCoins(ALL_COMPLETED_BONUS, "Bonus: todas as metas da semana!");
      }
    }

    await setStore(STORE_KEYS.WEEK_PLAN, plan);
    await WeeklyGoals._appendToHistory(plan);

    return plan;
  }

  /**
   * Marca uma meta como completa.
   */
  static async completeGoal(goalId: string): Promise<WeekPlan> {
    let plan = await WeeklyGoals.getCurrentWeek();
    if (!plan) plan = await WeeklyGoals.generateWeekGoals();

    const goal = plan.goals.find((g) => g.id === goalId);
    if (!goal) throw new Error("Meta nao encontrada: " + goalId);
    if (goal.completed) return plan;

    goal.current = goal.target;
    goal.completed = true;
    plan.completedCount += 1;
    plan.totalCoins += COINS_PER_GOAL;
    await WeeklyGoals._addCoins(COINS_PER_GOAL, "Meta concluida: " + goal.title);

    if (plan.completedCount === GOALS_PER_WEEK) {
      plan.allCompleted = true;
      plan.totalCoins += ALL_COMPLETED_BONUS;
      await WeeklyGoals._addCoins(ALL_COMPLETED_BONUS, "Bonus: todas as metas da semana!");
    }

    await setStore(STORE_KEYS.WEEK_PLAN, plan);
    await WeeklyGoals._appendToHistory(plan);

    return plan;
  }

  /**
   * Retorna o saldo de moedas do usuario.
   */
  static async getCoinBalance(): Promise<CoinBalance> {
    const balance: CoinBalance | null = await getStore(STORE_KEYS.COIN_BALANCE);

    if (!balance) {
      return {
        total: 0,
        currentMonth: 0,
        currentWeek: 0,
        weekCoins: 0,
        weekMax: MAX_COINS_PER_WEEK,
        monthCoins: 0,
        streak: 0,
      };
    }

    return balance;
  }

  /**
   * Retorna historico de N semanas passadas.
   */
  static async getHistory(weeks: number): Promise<WeekHistory[]> {
    const history: WeekHistory[] = (await getStore(STORE_KEYS.WEEK_HISTORY)) || [];
    return history.slice(-weeks);
  }

  /**
   * Calcula dias restantes ate o fim da semana.
   */
  static getDaysRemaining(endDate: string): number {
    const end = new Date(endDate + "T23:59:59");
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / 86_400_000));
  }

  /**
   * Salva/atualiza o perfil de metas do usuario.
   */
  static async saveProfile(profile: Partial<UserGoalProfile>): Promise<void> {
    const current = await WeeklyGoals.getProfile();
    const updated: UserGoalProfile = { ...current, ...profile };
    await setStore(STORE_KEYS.GOAL_PROFILE, updated);
  }

  /**
   * Retorna o perfil de metas do usuario com defaults.
   */
  static async getProfile(): Promise<UserGoalProfile> {
    const stored: UserGoalProfile | null = await getStore(STORE_KEYS.GOAL_PROFILE);
    return stored ?? { ...DEFAULT_PROFILE };
  }

  // -----------------------------------------------------------------------
  // Internal helpers
  // -----------------------------------------------------------------------

  /** Adiciona moedas ao saldo. */
  private static async _addCoins(amount: number, reason: string): Promise<void> {
    const balance = await WeeklyGoals.getCoinBalance();
    const now = new Date();
    const monthKey = currentMonthKey();
    const monday = toISODate(getWeekStart(now));
    const sunday = toISODate(getWeekEnd(now));

    balance.total += amount;
    balance.weekCoins = (balance.weekCoins || 0) + amount;
    balance.currentWeek = balance.weekCoins;
    balance.weekMax = MAX_COINS_PER_WEEK;
    balance.monthCoins = (balance.monthCoins || 0) + amount;
    balance.currentMonth = balance.monthCoins;

    // Calcula streak: semanas consecutivas com pelo menos 1 meta concluida
    const hist: WeekHistory[] = (await getStore(STORE_KEYS.WEEK_HISTORY)) || [];
    let streak = 0;
    for (let i = hist.length - 1; i >= 0; i--) {
      if (hist[i].goalsCompleted > 0) {
        streak++;
      } else {
        break;
      }
    }
    balance.streak = Math.max(streak, 1);

    await setStore(STORE_KEYS.COIN_BALANCE, balance);
  }

  /** Adiciona/atualiza o plano no historico semanal */
  private static async _appendToHistory(plan: WeekPlan): Promise<void> {
    const history: WeekHistory[] = (await getStore(STORE_KEYS.WEEK_HISTORY)) || [];

    const entry: WeekHistory = {
      weekId: plan.weekId,
      weekNumber: plan.weekNumber,
      weekYear: plan.weekYear,
      startDate: plan.startDate,
      endDate: plan.endDate,
      goalsCompleted: plan.completedCount,
      totalGoals: plan.goals.length,
      coinsEarned: plan.totalCoins,
      completedCount: plan.completedCount,
      totalCoins: plan.totalCoins,
      maxCoins: plan.maxCoins,
    };

    const idx = history.findIndex((h) => h.weekId === plan.weekId);
    if (idx >= 0) {
      history[idx] = entry;
    } else {
      history.push(entry);
    }

    if (history.length > 52) {
      history.splice(0, history.length - 52);
    }

    await setStore(STORE_KEYS.WEEK_HISTORY, history);
  }
}

export { getWeekId };
