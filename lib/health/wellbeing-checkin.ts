/**
 * WHO-5 Wellbeing Check-in — Conformidade NR-1
 *
 * Check-in VOLUNTÁRIO e ANÔNIMO de bem-estar baseado no WHO-5 Wellbeing Index.
 * - Empresa recebe APENAS dados agregados (nunca individuais)
 * - Dados armazenados localmente no dispositivo (LGPD)
 * - Instrumento cientificamente validado (OMS)
 */

// --- Storage helpers ---

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

// --- Interfaces ---

export interface WellbeingQuestion {
  id: string;
  text: string; // pt-BR
}

export interface WellbeingResponse {
  date: string; // YYYY-MM-DD
  timestamp: string; // ISO
  answers: Record<string, number>; // questionId → 0-5
  totalScore: number; // 0-100 (raw 0-25 × 4)
  category: "excellent" | "good" | "moderate" | "low" | "critical";
  categoryLabel: string; // pt-BR
  categoryColor: string; // hex
}

export interface WellbeingAggregated {
  period: string; // "Abril 2026"
  totalResponses: number;
  participationRate: number; // %
  avgScore: number; // 0-100
  categoryDistribution: {
    excellent: number;
    good: number;
    moderate: number;
    low: number;
    critical: number;
  };
  trend: "improving" | "stable" | "declining";
  trendLabel: string;
  weeklyAvg: Array<{ week: string; avg: number; responses: number }>;
  // NENHUM dado individual — jamais
}

// --- WHO-5 Questions (versão validada em português) ---

export const WHO5_QUESTIONS: WellbeingQuestion[] = [
  { id: "q1", text: "Me senti animado(a) e de bom humor" },
  { id: "q2", text: "Me senti calmo(a) e tranquilo(a)" },
  { id: "q3", text: "Me senti ativo(a) e com energia" },
  { id: "q4", text: "Acordei me sentindo descansado(a)" },
  { id: "q5", text: "Meu dia tem sido interessante" },
];

// Escala de resposta: 0-5
export const ANSWER_LABELS: Record<number, string> = {
  0: "Em nenhum momento",
  1: "Raramente",
  2: "Menos da metade do tempo",
  3: "Mais da metade do tempo",
  4: "A maior parte do tempo",
  5: "O tempo todo",
};

// --- Category helpers ---

interface CategoryInfo {
  category: WellbeingResponse["category"];
  label: string;
  color: string;
}

function getCategory(score: number): CategoryInfo {
  if (score >= 84) return { category: "excellent", label: "Excelente", color: "#34A853" };
  if (score >= 68) return { category: "good", label: "Bom", color: "#1A73E8" };
  if (score >= 52) return { category: "moderate", label: "Moderado", color: "#FBBC04" };
  if (score >= 36) return { category: "low", label: "Baixo", color: "#FF9F0A" };
  return { category: "critical", label: "Crítico", color: "#EA4335" };
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// --- Storage keys ---

const HISTORY_KEY = "wellbeing-history";

function dayStorageKey(date: string): string {
  return `wellbeing-${date}`;
}

// --- Class ---

export class WellbeingCheckin {
  /**
   * Salva resposta do check-in.
   * Calcula score (soma × 4), determina categoria, persiste localmente.
   */
  static async saveResponse(
    answers: Record<string, number>,
  ): Promise<WellbeingResponse> {
    const rawScore = Object.values(answers).reduce((sum, v) => sum + v, 0);
    const totalScore = rawScore * 4; // 0-25 → 0-100
    const { category, label, color } = getCategory(totalScore);
    const date = todayKey();

    const response: WellbeingResponse = {
      date,
      timestamp: new Date().toISOString(),
      answers,
      totalScore,
      category,
      categoryLabel: label,
      categoryColor: color,
    };

    // Salvar resposta do dia
    await setStore(dayStorageKey(date), response);

    // Append ao histórico (manter últimos 90 dias)
    const history: WellbeingResponse[] =
      (await getStore(HISTORY_KEY)) ?? [];

    // Remover entrada anterior do mesmo dia (se houver)
    const filtered = history.filter((r) => r.date !== date);
    filtered.push(response);

    // Limitar a 90 dias
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    const trimmed = filtered.filter((r) => r.date >= cutoffStr);

    await setStore(HISTORY_KEY, trimmed);

    return response;
  }

  /** Verifica se já respondeu hoje. */
  static async hasAnsweredToday(): Promise<boolean> {
    const resp = await getStore(dayStorageKey(todayKey()));
    return resp !== null;
  }

  /** Retorna resposta de hoje (ou null). */
  static async getTodayResponse(): Promise<WellbeingResponse | null> {
    return await getStore(dayStorageKey(todayKey()));
  }

  /** Retorna histórico dos últimos N dias. */
  static async getHistory(days: number = 30): Promise<WellbeingResponse[]> {
    const history: WellbeingResponse[] =
      (await getStore(HISTORY_KEY)) ?? [];

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffStr = cutoff.toISOString().slice(0, 10);

    return history
      .filter((r) => r.date >= cutoffStr)
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Gera relatório AGREGADO para a empresa.
   * NENHUM dado individual é incluído — apenas médias e distribuição.
   */
  static async getAggregatedReport(
    totalEmployees: number,
  ): Promise<WellbeingAggregated> {
    const history = await this.getHistory(30);

    // Período
    const now = new Date();
    const months = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
    ];
    const period = `${months[now.getMonth()]} ${now.getFullYear()}`;

    // Totais
    const totalResponses = history.length;
    const uniqueDays = new Set(history.map((r) => r.date)).size;
    const participationRate =
      totalEmployees > 0
        ? Math.round((totalResponses / (totalEmployees * 30)) * 100 * 10) / 10
        : 0;

    // Média geral
    const avgScore =
      totalResponses > 0
        ? Math.round(
            history.reduce((s, r) => s + r.totalScore, 0) / totalResponses,
          )
        : 0;

    // Distribuição por categoria
    const dist = { excellent: 0, good: 0, moderate: 0, low: 0, critical: 0 };
    for (const r of history) {
      dist[r.category]++;
    }

    // Agrupar por semana (ISO week number)
    const weekMap = new Map<string, { total: number; count: number }>();
    for (const r of history) {
      const d = new Date(r.date + "T12:00:00");
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay()); // domingo
      const weekLabel = `${String(weekStart.getDate()).padStart(2, "0")}/${String(weekStart.getMonth() + 1).padStart(2, "0")}`;

      const existing = weekMap.get(weekLabel) ?? { total: 0, count: 0 };
      existing.total += r.totalScore;
      existing.count++;
      weekMap.set(weekLabel, existing);
    }

    const weeklyAvg = Array.from(weekMap.entries()).map(([week, data]) => ({
      week,
      avg: Math.round(data.total / data.count),
      responses: data.count,
    }));

    // Trend: comparar últimas 2 semanas vs 2 semanas anteriores
    const trend = this.calculateTrend(history);
    const trendLabels: Record<string, string> = {
      improving: "Em melhora",
      stable: "Estável",
      declining: "Em queda",
    };

    return {
      period,
      totalResponses,
      participationRate,
      avgScore,
      categoryDistribution: dist,
      trend,
      trendLabel: trendLabels[trend],
      weeklyAvg,
    };
  }

  private static calculateTrend(
    history: WellbeingResponse[],
  ): "improving" | "stable" | "declining" {
    if (history.length < 4) return "stable";

    const now = new Date();
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(now.getDate() - 14);
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(now.getDate() - 28);

    const twoWeeksStr = twoWeeksAgo.toISOString().slice(0, 10);
    const fourWeeksStr = fourWeeksAgo.toISOString().slice(0, 10);

    const recent = history.filter((r) => r.date >= twoWeeksStr);
    const previous = history.filter(
      (r) => r.date >= fourWeeksStr && r.date < twoWeeksStr,
    );

    if (recent.length === 0 || previous.length === 0) return "stable";

    const recentAvg =
      recent.reduce((s, r) => s + r.totalScore, 0) / recent.length;
    const prevAvg =
      previous.reduce((s, r) => s + r.totalScore, 0) / previous.length;

    const diff = recentAvg - prevAvg;
    if (diff > 5) return "improving";
    if (diff < -5) return "declining";
    return "stable";
  }
}
