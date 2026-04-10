import { Capacitor } from "@capacitor/core";
import type { HealthService } from "./types";
import { ManualHealthService } from "./manual";

export type { HealthService, StepData, SleepData, ExerciseData, HeartRateData, HealthSummary } from "./types";
export { ManualHealthService } from "./manual";

let _service: HealthService | null = null;

/**
 * Returns the best available health service for the current platform:
 * - Android → Health Connect
 * - iOS → HealthKit
 * - Web → Manual input (localStorage)
 *
 * Falls back to ManualHealthService if native APIs aren't available.
 */
export async function getHealthService(): Promise<HealthService> {
  if (_service) return _service;

  if (Capacitor.isNativePlatform()) {
    const platform = Capacitor.getPlatform();

    if (platform === "android") {
      try {
        const { HealthConnectService } = await import("./health-connect");
        const hc = new HealthConnectService();
        if (await hc.isAvailable()) {
          _service = hc;
          return _service;
        }
      } catch {
        // Health Connect not available, fall through
      }
    }

    if (platform === "ios") {
      try {
        const { HealthKitService } = await import("./healthkit");
        const hk = new HealthKitService();
        if (await hk.isAvailable()) {
          _service = hk;
          return _service;
        }
      } catch {
        // HealthKit not available, fall through
      }
    }
  }

  // Fallback: manual input
  _service = new ManualHealthService();
  return _service;
}

/**
 * Reset cached service (useful for testing)
 */
export function resetHealthService(): void {
  _service = null;
}
