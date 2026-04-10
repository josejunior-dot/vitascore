import { Preferences } from "@capacitor/preferences";
import type {
  HealthService,
  StepData,
  SleepData,
  ExerciseData,
  HeartRateData,
  HealthSummary,
} from "./types";

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

async function getStore(key: string): Promise<any> {
  try {
    const { value } = await Preferences.get({ key });
    return value ? JSON.parse(value) : null;
  } catch {
    // Fallback to localStorage for web
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  }
}

async function setStore(key: string, data: any): Promise<void> {
  const value = JSON.stringify(data);
  try {
    await Preferences.set({ key, value });
  } catch {
    localStorage.setItem(key, value);
  }
}

/**
 * Manual input fallback — works everywhere (web, native)
 * Stores data locally on device using Capacitor Preferences or localStorage
 */
export class ManualHealthService implements HealthService {
  async isAvailable(): Promise<boolean> {
    return true; // always available
  }

  async requestPermissions(): Promise<boolean> {
    return true; // no permissions needed
  }

  async getTodaySteps(): Promise<StepData> {
    const today = todayStr();
    const data = await getStore(`steps-${today}`);
    return data || { date: today, steps: 0, distance: 0, calories: 0 };
  }

  async getWeeklySteps(): Promise<StepData[]> {
    const result: StepData[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const data = await getStore(`steps-${dateStr}`);
      result.push(data || { date: dateStr, steps: 0, distance: 0, calories: 0 });
    }
    return result;
  }

  async getTodaySleep(): Promise<SleepData | null> {
    const today = todayStr();
    return await getStore(`sleep-${today}`);
  }

  async getRecentExercises(days: number): Promise<ExerciseData[]> {
    const exercises: ExerciseData[] = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayExercises = await getStore(`exercises-${dateStr}`);
      if (dayExercises) exercises.push(...dayExercises);
    }
    return exercises;
  }

  async getHeartRate(): Promise<HeartRateData | null> {
    return null; // can't measure without hardware
  }

  async getTodaySummary(): Promise<HealthSummary> {
    const [steps, sleep, exercises] = await Promise.all([
      this.getTodaySteps(),
      this.getTodaySleep(),
      this.getRecentExercises(1),
    ]);
    return { steps, sleep, exercises, heartRate: null, source: "manual" };
  }

  // --- Write methods for manual input ---

  async saveSteps(steps: number): Promise<void> {
    const today = todayStr();
    const km = Math.round((steps * 0.0007) * 10) / 10; // ~0.7m per step
    const cal = Math.round(steps * 0.04); // ~0.04 kcal per step
    await setStore(`steps-${today}`, {
      date: today,
      steps,
      distance: km,
      calories: cal,
    });
  }

  async saveSleep(bedtime: string, wakeTime: string): Promise<void> {
    const today = todayStr();
    const [bh, bm] = bedtime.split(":").map(Number);
    const [wh, wm] = wakeTime.split(":").map(Number);
    let totalMinutes = (wh * 60 + wm) - (bh * 60 + bm);
    if (totalMinutes < 0) totalMinutes += 24 * 60; // crossed midnight

    await setStore(`sleep-${today}`, {
      date: today,
      totalMinutes,
      bedtime,
      wakeTime,
      deepMinutes: Math.round(totalMinutes * 0.25),
      lightMinutes: Math.round(totalMinutes * 0.5),
      remMinutes: Math.round(totalMinutes * 0.25),
    });
  }

  async saveExercise(exercise: Omit<ExerciseData, "id">): Promise<void> {
    const today = todayStr();
    const existing = (await getStore(`exercises-${today}`)) || [];
    existing.push({ ...exercise, id: `manual-${Date.now()}` });
    await setStore(`exercises-${today}`, existing);
  }

  async saveWater(liters: number): Promise<void> {
    const today = todayStr();
    await setStore(`water-${today}`, { date: today, liters });
  }

  async getWater(): Promise<{ date: string; liters: number }> {
    const today = todayStr();
    return (await getStore(`water-${today}`)) || { date: today, liters: 0 };
  }

  async saveMeal(meal: { type: string; description: string; quality: string }): Promise<void> {
    const today = todayStr();
    const existing = (await getStore(`meals-${today}`)) || [];
    existing.push({
      ...meal,
      id: `meal-${Date.now()}`,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    });
    await setStore(`meals-${today}`, existing);
  }

  async getMeals(): Promise<any[]> {
    const today = todayStr();
    return (await getStore(`meals-${today}`)) || [];
  }
}
