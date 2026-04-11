// ---------------------------------------------------------------------------
// HR Report Generator — Company Health Dashboard
// Generates anonymized, aggregate health data for HR/management view
// ---------------------------------------------------------------------------

/* eslint-disable @typescript-eslint/no-explicit-any */

// ---- Storage helpers (Capacitor / localStorage) ---------------------------

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

// ---- Interfaces -----------------------------------------------------------

export interface CompanyHealthReport {
  companyName: string;
  reportDate: string;
  period: string; // ex: "Março 2026"
  totalEmployees: number;
  activeUsers: number;
  adoptionRate: number; // %

  // Aggregate scores
  avgVitaScore: number;
  scoreDistribution: {
    platinum: number; // 850-1000
    gold: number; // 600-849
    silver: number; // 300-599
    bronze: number; // 0-299
  };

  // Pillar averages
  pillars: {
    movement: { avg: number; max: number; trend: "up" | "stable" | "down" };
    sleep: { avg: number; max: number; trend: "up" | "stable" | "down" };
    nutrition: { avg: number; max: number; trend: "up" | "stable" | "down" };
    digital: { avg: number; max: number; trend: "up" | "stable" | "down" };
    weight: {
      avgBmi: number;
      normalPct: number;
      trend: "up" | "stable" | "down";
    };
  };

  // Key metrics
  metrics: {
    avgDailySteps: number;
    avgSleepHours: number;
    avgSleepConfidence: number;
    avgScreenTimeMinutes: number;
    photoVerifiedMealsPct: number;
    weeklyWeighPct: number; // % who weigh weekly
  };

  // Risk reduction estimate
  riskReduction: {
    estimatedSavingsPercent: number;
    projectedAnnualSavings: number; // R$
    topRiskFactors: string[];
    improvements: string[];
  };

  // Month over month
  monthlyTrend: Array<{
    month: string;
    avgScore: number;
    activeUsers: number;
  }>;
}

// ---- Storage key ----------------------------------------------------------

const STORAGE_KEY = "saluflow_hr_report";

// ---- Month names (pt-BR) --------------------------------------------------

const MONTHS_PT = [
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

// ---- Generator ------------------------------------------------------------

export class HRReportGenerator {
  /**
   * Generate a realistic mock company health report.
   * In production this would aggregate real anonymized data from the backend.
   */
  static async generateReport(
    companyName: string
  ): Promise<CompanyHealthReport> {
    const now = new Date();
    const reportDate = now.toISOString().split("T")[0];
    const period = `${MONTHS_PT[now.getMonth()]} ${now.getFullYear()}`;

    // Build last 6 months trend with gradual improvement
    const monthlyTrend: CompanyHealthReport["monthlyTrend"] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = `${MONTHS_PT[d.getMonth()].slice(0, 3)}/${d.getFullYear()}`;
      // Scores improve gradually from ~610 to ~687
      const baseScore = 610 + (5 - i) * 15 + Math.round(Math.random() * 5);
      const baseUsers = 30 + (5 - i) * 1 + Math.round(Math.random() * 2);
      monthlyTrend.push({
        month: monthLabel,
        avgScore: Math.min(baseScore, 700),
        activeUsers: Math.min(baseUsers, 38),
      });
    }

    const report: CompanyHealthReport = {
      companyName,
      reportDate,
      period,
      totalEmployees: 50,
      activeUsers: 38,
      adoptionRate: 76,

      avgVitaScore: 687,
      scoreDistribution: {
        platinum: 4,
        gold: 18,
        silver: 12,
        bronze: 4,
      },

      pillars: {
        movement: { avg: 72, max: 100, trend: "up" },
        sleep: { avg: 68, max: 100, trend: "stable" },
        nutrition: { avg: 55, max: 100, trend: "up" },
        digital: { avg: 71, max: 100, trend: "stable" },
        weight: { avgBmi: 25.8, normalPct: 58, trend: "up" },
      },

      metrics: {
        avgDailySteps: 7840,
        avgSleepHours: 6.8,
        avgSleepConfidence: 76,
        avgScreenTimeMinutes: 195,
        photoVerifiedMealsPct: 42,
        weeklyWeighPct: 61,
      },

      riskReduction: {
        estimatedSavingsPercent: 12.5,
        projectedAnnualSavings: 45600,
        topRiskFactors: [
          "Sedentarismo (22% abaixo de 5000 passos/dia)",
          "Sono insuficiente (35% dormem menos de 6h)",
          "IMC acima do normal (42%)",
        ],
        improvements: [
          "Passos médios aumentaram 18% vs mês anterior",
          "68% dos funcionários pesam semanalmente",
          "Uso noturno de celular reduziu 12%",
        ],
      },

      monthlyTrend,
    };

    // Auto-save
    await HRReportGenerator.saveReport(report);

    return report;
  }

  /** Save report to local storage */
  static async saveReport(report: CompanyHealthReport): Promise<void> {
    await setStore(STORAGE_KEY, report);
  }

  /** Retrieve last saved report */
  static async getLastReport(): Promise<CompanyHealthReport | null> {
    return getStore(STORAGE_KEY);
  }
}
