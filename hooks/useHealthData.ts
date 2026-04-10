"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { HealthSummary, StepData, ExerciseData } from "@/lib/health";
import { ManualHealthService } from "@/lib/health/manual";

// Manual service is always available for saving data
const manualService = new ManualHealthService();

export function useHealthData() {
  const [summary, setSummary] = useState<HealthSummary | null>(null);
  const [weeklySteps, setWeeklySteps] = useState<StepData[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<string>("loading");
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [water, setWater] = useState({ date: "", liters: 0 });
  const [meals, setMeals] = useState<any[]>([]);
  const loadedRef = useRef(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { getHealthService } = await import("@/lib/health");
      const service = await getHealthService();
      setSource(
        service.constructor.name === "HealthConnectService"
          ? "Health Connect"
          : service.constructor.name === "HealthKitService"
            ? "Apple Saúde"
            : "Manual"
      );

      const granted = await service.requestPermissions();
      setPermissionGranted(granted);

      if (granted) {
        const [todaySummary, weekly] = await Promise.all([
          service.getTodaySummary(),
          service.getWeeklySteps(),
        ]);
        setSummary(todaySummary);
        setWeeklySteps(weekly);
      }

      // Always load manual-only data (water, meals)
      const [w, m] = await Promise.all([
        manualService.getWater(),
        manualService.getMeals(),
      ]);
      setWater(w);
      setMeals(m);
    } catch (err) {
      console.error("Error loading health data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loadedRef.current) {
      loadedRef.current = true;
      loadData();
    }
  }, [loadData]);

  // --- Save methods ---

  const saveExercise = useCallback(
    async (exercise: Omit<ExerciseData, "id">) => {
      await manualService.saveExercise(exercise);
      await loadData();
    },
    [loadData]
  );

  const saveSleep = useCallback(
    async (bedtime: string, wakeTime: string) => {
      await manualService.saveSleep(bedtime, wakeTime);
      await loadData();
    },
    [loadData]
  );

  const saveWater = useCallback(
    async (liters: number) => {
      await manualService.saveWater(liters);
      const w = await manualService.getWater();
      setWater(w);
    },
    []
  );

  const addWater = useCallback(
    async (ml: number) => {
      const current = await manualService.getWater();
      const newLiters = Math.round((current.liters + ml / 1000) * 10) / 10;
      await manualService.saveWater(newLiters);
      setWater({ ...current, liters: newLiters });
    },
    []
  );

  const saveMeal = useCallback(
    async (meal: { type: string; description: string; quality: string }) => {
      await manualService.saveMeal(meal);
      const m = await manualService.getMeals();
      setMeals(m);
    },
    []
  );

  return {
    summary,
    weeklySteps,
    loading,
    source,
    permissionGranted,
    water,
    meals,
    refresh: loadData,
    saveExercise,
    saveSleep,
    saveWater,
    addWater,
    saveMeal,
  };
}
