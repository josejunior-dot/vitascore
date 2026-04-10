import { Capacitor } from "@capacitor/core";
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

/**
 * Apple HealthKit (iOS) implementation
 * Uses @perfood/capacitor-healthkit plugin
 */
export class HealthKitService implements HealthService {
  private plugin: any = null;

  private async getPlugin() {
    if (!this.plugin) {
      const mod = await import("@perfood/capacitor-healthkit");
      this.plugin = mod.CapacitorHealthkit;
    }
    return this.plugin;
  }

  async isAvailable(): Promise<boolean> {
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== "ios") {
      return false;
    }
    try {
      const hk = await this.getPlugin();
      const result = await hk.isAvailable();
      return result.available;
    } catch {
      return false;
    }
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const hk = await this.getPlugin();
      await hk.requestAuthorization({
        all: [],
        read: [
          "HKQuantityTypeIdentifierStepCount",
          "HKQuantityTypeIdentifierDistanceWalkingRunning",
          "HKQuantityTypeIdentifierActiveEnergyBurned",
          "HKCategoryTypeIdentifierSleepAnalysis",
          "HKQuantityTypeIdentifierHeartRate",
          "HKWorkoutTypeIdentifier",
        ],
        write: [],
      });
      return true;
    } catch {
      return false;
    }
  }

  async getTodaySteps(): Promise<StepData> {
    const today = todayStr();
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();

    try {
      const hk = await this.getPlugin();

      const stepsResult = await hk.queryHKitSampleType({
        sampleName: "HKQuantityTypeIdentifierStepCount",
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      });
      const steps = (stepsResult.resultData || []).reduce(
        (sum: number, r: any) => sum + (r.quantity || 0),
        0
      );

      const distResult = await hk.queryHKitSampleType({
        sampleName: "HKQuantityTypeIdentifierDistanceWalkingRunning",
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      });
      const distance = (distResult.resultData || []).reduce(
        (sum: number, r: any) => sum + (r.quantity || 0),
        0
      ) / 1000; // meters to km

      const calResult = await hk.queryHKitSampleType({
        sampleName: "HKQuantityTypeIdentifierActiveEnergyBurned",
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      });
      const calories = (calResult.resultData || []).reduce(
        (sum: number, r: any) => sum + (r.quantity || 0),
        0
      );

      return {
        date: today,
        steps: Math.round(steps),
        distance: Math.round(distance * 10) / 10,
        calories: Math.round(calories),
      };
    } catch {
      return { date: today, steps: 0, distance: 0, calories: 0 };
    }
  }

  async getWeeklySteps(): Promise<StepData[]> {
    const result: StepData[] = [];
    const hk = await this.getPlugin();

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

      try {
        const stepsResult = await hk.queryHKitSampleType({
          sampleName: "HKQuantityTypeIdentifierStepCount",
          startDate: start.toISOString(),
          endDate: end.toISOString(),
        });
        const steps = (stepsResult.resultData || []).reduce(
          (sum: number, r: any) => sum + (r.quantity || 0),
          0
        );
        result.push({ date: dateStr, steps: Math.round(steps), distance: 0, calories: 0 });
      } catch {
        result.push({ date: dateStr, steps: 0, distance: 0, calories: 0 });
      }
    }
    return result;
  }

  async getTodaySleep(): Promise<SleepData | null> {
    const today = todayStr();
    const start = new Date();
    start.setDate(start.getDate() - 1);
    start.setHours(18, 0, 0, 0);
    const end = new Date();
    end.setHours(12, 0, 0, 0);

    try {
      const hk = await this.getPlugin();
      const result = await hk.queryHKitSampleType({
        sampleName: "HKCategoryTypeIdentifierSleepAnalysis",
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      });

      const samples = result.resultData || [];
      if (!samples.length) return null;

      const firstSample = samples[0];
      const lastSample = samples[samples.length - 1];
      const bedtime = new Date(firstSample.startDate);
      const wakeTime = new Date(lastSample.endDate);
      const totalMinutes = Math.round((wakeTime.getTime() - bedtime.getTime()) / 60000);

      return {
        date: today,
        totalMinutes,
        bedtime: `${bedtime.getHours().toString().padStart(2, "0")}:${bedtime.getMinutes().toString().padStart(2, "0")}`,
        wakeTime: `${wakeTime.getHours().toString().padStart(2, "0")}:${wakeTime.getMinutes().toString().padStart(2, "0")}`,
        deepMinutes: Math.round(totalMinutes * 0.25),
        lightMinutes: Math.round(totalMinutes * 0.5),
        remMinutes: Math.round(totalMinutes * 0.25),
      };
    } catch {
      return null;
    }
  }

  async getRecentExercises(days: number): Promise<ExerciseData[]> {
    const start = new Date();
    start.setDate(start.getDate() - days);
    const end = new Date();

    try {
      const hk = await this.getPlugin();
      const result = await hk.queryHKitSampleType({
        sampleName: "HKWorkoutTypeIdentifier",
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      });

      return (result.resultData || []).map((r: any, i: number) => ({
        id: `hk-${i}`,
        type: mapWorkoutType(r.workoutActivityType),
        name: mapWorkoutType(r.workoutActivityType),
        startTime: r.startDate,
        endTime: r.endDate,
        durationMinutes: Math.round(r.duration / 60),
        calories: Math.round(r.totalEnergyBurned || 0),
        distance: r.totalDistance ? Math.round(r.totalDistance / 1000 * 10) / 10 : undefined,
      }));
    } catch {
      return [];
    }
  }

  async getHeartRate(): Promise<HeartRateData | null> {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    const today = todayStr();

    try {
      const hk = await this.getPlugin();
      const result = await hk.queryHKitSampleType({
        sampleName: "HKQuantityTypeIdentifierHeartRate",
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      });

      const bpms = (result.resultData || [])
        .map((r: any) => r.quantity)
        .filter((v: number) => v > 0);

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
    return { steps, sleep, exercises, heartRate, source: "healthkit" };
  }
}

function mapWorkoutType(type: number | string): string {
  const map: Record<string, string> = {
    "37": "running",
    "52": "walking",
    "13": "cycling",
    "46": "swimming",
    "20": "gym",
  };
  return map[String(type)] || "other";
}
