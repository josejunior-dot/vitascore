import { Intensity } from "./mock-data";

export function calculateExercisePoints(
  durationMinutes: number,
  intensity: Intensity
): number {
  const basePoints = Math.floor(durationMinutes * 0.8);
  const multipliers: Record<Intensity, number> = {
    light: 1,
    moderate: 1.5,
    intense: 2,
  };
  return Math.round(basePoints * multipliers[intensity]);
}

export function calculateSleepPoints(hours: number): number {
  if (hours >= 7 && hours <= 9) return 60;
  if (hours >= 6 && hours < 7) return 40;
  if (hours >= 9 && hours <= 10) return 45;
  return 20;
}

export function calculateDiscountPercent(score: number): number {
  const maxDiscount = 15;
  const maxScore = 1000;
  return Math.round((score / maxScore) * maxDiscount * 10) / 10;
}

export function calculateAnnualSavings(
  monthlyPremium: number,
  discountPercent: number
): number {
  return Math.round(monthlyPremium * 12 * (discountPercent / 100) * 100) / 100;
}

export function getDaysUntilRenewal(renewalDate: string): number {
  const now = new Date();
  const renewal = new Date(renewalDate);
  const diff = renewal.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getDayProgress(stats: {
  steps: { current: number; goal: number };
  sleep: { hours: number; minutes: number; goal: number };
  water: { current: number; goal: number };
  meals: { current: number; goal: number };
}): number {
  const stepsP = Math.min(1, stats.steps.current / stats.steps.goal);
  const sleepP = Math.min(
    1,
    (stats.sleep.hours + stats.sleep.minutes / 60) / stats.sleep.goal
  );
  const waterP = Math.min(1, stats.water.current / stats.water.goal);
  const mealsP = Math.min(1, stats.meals.current / stats.meals.goal);
  return Math.round(((stepsP + sleepP + waterP + mealsP) / 4) * 100);
}

export function formatNumber(n: number): string {
  return n.toLocaleString("pt-BR");
}

/**
 * VitaScore breakdown por pilar (1000 pts total)
 *
 * Movimento:        300 pts (30%)
 * Sono:             250 pts (25%)
 * Nutrição:         150 pts (15%)
 * Bem-estar Digital: 200 pts (20%)
 * Engajamento:      100 pts (10%)
 */
export interface VitaScoreBreakdown {
  movement: number;    // 0-300
  sleep: number;       // 0-250
  nutrition: number;   // 0-150
  digital: number;     // 0-200
  engagement: number;  // 0-100
  total: number;       // 0-1000
}

export function calculateVitaScore(params: {
  stepsToday: number;
  sleepHours: number;
  sleepConfidence: number; // 0-100
  mealsLogged: number;
  digitalScore: number; // 0-200
  challengesCompleted: number;
  streakDays: number;
}): VitaScoreBreakdown {
  // Movimento (0-300): passos + exercício
  const stepsScore = Math.min(200, Math.round((params.stepsToday / 10000) * 200));
  const movement = Math.min(300, stepsScore + 100); // +100 base

  // Sono (0-250): horas + confiança da verificação
  const hoursScore = params.sleepHours >= 7 && params.sleepHours <= 9 ? 150
    : params.sleepHours >= 6 ? 100 : 50;
  const confBonus = Math.round((params.sleepConfidence / 100) * 100);
  const sleep = Math.min(250, hoursScore + confBonus);

  // Nutrição (0-150)
  const nutrition = Math.min(150, params.mealsLogged * 50);

  // Digital (0-200): passado direto do ScreenMonitor
  const digital = Math.min(200, params.digitalScore);

  // Engajamento (0-100): desafios + streak
  const challengeScore = Math.min(50, params.challengesCompleted * 10);
  const streakScore = Math.min(50, params.streakDays * 4);
  const engagement = challengeScore + streakScore;

  const total = movement + sleep + nutrition + digital + engagement;

  return { movement, sleep, nutrition, digital, engagement, total };
}
