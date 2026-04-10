import { Capacitor } from "@capacitor/core";
import type {
  HealthService,
  StepData,
  SleepData,
  ExerciseData,
  HeartRateData,
  HealthSummary,
} from "./types";

function todayRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return {
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    today: start.toISOString().split("T")[0],
  };
}

function daysAgoRange(days: number) {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
  return { startTime: start.toISOString(), endTime: end.toISOString() };
}

/**
 * Health Connect (Android) implementation
 * Uses capacitor-health-connect plugin
 */
export class HealthConnectService implements HealthService {
  private plugin: any = null;

  private async getPlugin() {
    if (!this.plugin) {
      const mod = await import("capacitor-health-connect");
      this.plugin = mod.HealthConnect;
    }
    return this.plugin;
  }

  async isAvailable(): Promise<boolean> {
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== "android") {
      return false;
    }
    try {
      const hc = await this.getPlugin();
      const result = await hc.checkAvailability();
      return result.availability === "Available";
    } catch {
      return false;
    }
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const hc = await this.getPlugin();
      await hc.requestHealthPermissions({
        read: [
          "Steps",
          "Distance",
          "ActiveCaloriesBurned",
          "TotalCaloriesBurned",
          "SleepSession",
          "ExerciseSession",
          "HeartRate",
        ],
      });
      return true;
    } catch {
      return false;
    }
  }

  async getTodaySteps(): Promise<StepData> {
    const { startTime, endTime, today } = todayRange();
    try {
      const hc = await this.getPlugin();
      const stepsResult = await hc.readRecords({
        type: "Steps",
        timeRangeFilter: { startTime, endTime },
      });
      const distResult = await hc.readRecords({
        type: "Distance",
        timeRangeFilter: { startTime, endTime },
      });
      const calResult = await hc.readRecords({
        type: "ActiveCaloriesBurned",
        timeRangeFilter: { startTime, endTime },
      });

      const steps = stepsResult.records?.reduce(
        (sum: number, r: any) => sum + (r.count || 0),
        0
      ) ?? 0;
      const distance = distResult.records?.reduce(
        (sum: number, r: any) => sum + (r.distance?.inKilometers || 0),
        0
      ) ?? 0;
      const calories = calResult.records?.reduce(
        (sum: number, r: any) => sum + (r.energy?.inKilocalories || 0),
        0
      ) ?? 0;

      return { date: today, steps, distance: Math.round(distance * 10) / 10, calories: Math.round(calories) };
    } catch {
      return { date: today, steps: 0, distance: 0, calories: 0 };
    }
  }

  async getWeeklySteps(): Promise<StepData[]> {
    const result: StepData[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

      try {
        const hc = await this.getPlugin();
        const stepsResult = await hc.readRecords({
          type: "Steps",
          timeRangeFilter: {
            startTime: start.toISOString(),
            endTime: end.toISOString(),
          },
        });
        const steps = stepsResult.records?.reduce(
          (sum: number, r: any) => sum + (r.count || 0),
          0
        ) ?? 0;
        result.push({ date: dateStr, steps, distance: 0, calories: 0 });
      } catch {
        result.push({ date: dateStr, steps: 0, distance: 0, calories: 0 });
      }
    }
    return result;
  }

  async getTodaySleep(): Promise<SleepData | null> {
    const { startTime, endTime, today } = todayRange();
    // Sleep data is usually from yesterday evening to today morning
    const sleepStart = new Date(new Date(startTime).getTime() - 12 * 60 * 60 * 1000).toISOString();
    try {
      const hc = await this.getPlugin();
      const result = await hc.readRecords({
        type: "SleepSession",
        timeRangeFilter: { startTime: sleepStart, endTime },
      });

      if (!result.records?.length) return null;

      const session = result.records[result.records.length - 1];
      const startDate = new Date(session.startTime);
      const endDate = new Date(session.endTime);
      const totalMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60000);

      return {
        date: today,
        totalMinutes,
        bedtime: `${startDate.getHours().toString().padStart(2, "0")}:${startDate.getMinutes().toString().padStart(2, "0")}`,
        wakeTime: `${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`,
        deepMinutes: Math.round(totalMinutes * 0.25),
        lightMinutes: Math.round(totalMinutes * 0.5),
        remMinutes: Math.round(totalMinutes * 0.25),
      };
    } catch {
      return null;
    }
  }

  async getRecentExercises(days: number): Promise<ExerciseData[]> {
    const { startTime, endTime } = daysAgoRange(days);
    try {
      const hc = await this.getPlugin();
      const result = await hc.readRecords({
        type: "ExerciseSession",
        timeRangeFilter: { startTime, endTime },
      });

      return (result.records || []).map((r: any, i: number) => {
        const start = new Date(r.startTime);
        const end = new Date(r.endTime);
        const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60000);
        return {
          id: `hc-${i}`,
          type: mapExerciseType(r.exerciseType),
          name: r.title || mapExerciseType(r.exerciseType),
          startTime: r.startTime,
          endTime: r.endTime,
          durationMinutes,
          calories: 0,
          distance: 0,
        };
      });
    } catch {
      return [];
    }
  }

  async getHeartRate(): Promise<HeartRateData | null> {
    const { startTime, endTime, today } = todayRange();
    try {
      const hc = await this.getPlugin();
      const result = await hc.readRecords({
        type: "HeartRate",
        timeRangeFilter: { startTime, endTime },
      });

      if (!result.records?.length) return null;

      const bpms = result.records.flatMap((r: any) =>
        (r.samples || []).map((s: any) => s.beatsPerMinute || 0)
      ).filter((v: number) => v > 0);

      if (!bpms.length) return null;

      return {
        date: today,
        avgBpm: Math.round(bpms.reduce((a: number, b: number) => a + b, 0) / bpms.length),
        minBpm: Math.min(...bpms),
        maxBpm: Math.max(...bpms),
        restingBpm: Math.min(...bpms),
      };
    } catch {
      return null;
    }
  }

  async getTodaySummary(): Promise<HealthSummary> {
    const [steps, sleep, exercises, heartRate] = await Promise.all([
      this.getTodaySteps(),
      this.getTodaySleep(),
      this.getRecentExercises(1),
      this.getHeartRate(),
    ]);
    return { steps, sleep, exercises, heartRate, source: "health_connect" };
  }
}

function mapExerciseType(type: number | string): string {
  const map: Record<string, string> = {
    "8": "running",
    "79": "walking",
    "1": "cycling",
    "74": "swimming",
    "0": "gym",
  };
  return map[String(type)] || "other";
}
