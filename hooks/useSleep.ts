import { mockSleepData, mockTodaySleep } from "@/lib/mock-data";

export function useSleep() {
  const sleepData = mockSleepData;
  const todaySleep = mockTodaySleep;

  const logSleep = (entry: {
    bedtime: string;
    wakeup: string;
    quality: "poor" | "fair" | "good" | "great";
  }) => {
    console.log("Sono registrado:", entry);
  };

  return {
    sleepData,
    todaySleep,
    logSleep,
  };
}
