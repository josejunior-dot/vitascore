"use client";

import { useState, useEffect, useRef } from "react";
import {
  ScreenMonitor,
  type DailyScreenReport,
  type WeeklyTrend,
} from "@/lib/health/screen-monitor";

export function useScreenTime() {
  const monitorRef = useRef<ScreenMonitor | null>(null);
  const [report, setReport] = useState<DailyScreenReport | null>(null);
  const [weeklyTrend, setWeeklyTrend] = useState<WeeklyTrend | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const monitor = new ScreenMonitor();
    monitorRef.current = monitor;

    monitor.startTracking();

    const load = async () => {
      try {
        const [todayReport, trend] = await Promise.all([
          monitor.getTodayReport(),
          monitor.getWeeklyTrend(),
        ]);
        setReport(todayReport);
        setWeeklyTrend(trend);
      } catch (err) {
        console.error("useScreenTime: error loading data", err);
      } finally {
        setLoading(false);
      }
    };

    load();

    // Refresh every 60 seconds
    const interval = setInterval(async () => {
      try {
        const [todayReport, trend] = await Promise.all([
          monitor.getTodayReport(),
          monitor.getWeeklyTrend(),
        ]);
        setReport(todayReport);
        setWeeklyTrend(trend);
      } catch (err) {
        console.error("useScreenTime: error refreshing data", err);
      }
    }, 60_000);

    return () => {
      clearInterval(interval);
      monitor.stopTracking();
    };
  }, []);

  return { report, weeklyTrend, loading };
}
