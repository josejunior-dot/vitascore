export interface StepData {
  date: string; // YYYY-MM-DD
  steps: number;
  distance: number; // km
  calories: number;
}

export interface SleepData {
  date: string;
  totalMinutes: number;
  bedtime: string; // HH:mm
  wakeTime: string; // HH:mm
  deepMinutes: number;
  lightMinutes: number;
  remMinutes: number;
}

export interface ExerciseData {
  id: string;
  type: string;
  name: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  calories: number;
  distance?: number;
}

export interface HeartRateData {
  date: string;
  avgBpm: number;
  minBpm: number;
  maxBpm: number;
  restingBpm: number;
}

export interface HealthSummary {
  steps: StepData;
  sleep: SleepData | null;
  exercises: ExerciseData[];
  heartRate: HeartRateData | null;
  source: "health_connect" | "healthkit" | "manual" | "mock";
}

export interface HealthService {
  isAvailable(): Promise<boolean>;
  requestPermissions(): Promise<boolean>;
  getTodaySteps(): Promise<StepData>;
  getWeeklySteps(): Promise<StepData[]>;
  getTodaySleep(): Promise<SleepData | null>;
  getRecentExercises(days: number): Promise<ExerciseData[]>;
  getHeartRate(): Promise<HeartRateData | null>;
  getTodaySummary(): Promise<HealthSummary>;
}
