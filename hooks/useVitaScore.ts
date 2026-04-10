import { mockUser, mockTodayStats, statusConfig } from "@/lib/mock-data";
import { getDayProgress, formatNumber } from "@/lib/vitascore";

export function useVitaScore() {
  const user = mockUser;
  const formattedScore = formatNumber(user.score);
  const status = statusConfig[user.status];
  const dayProgress = getDayProgress(mockTodayStats);

  return {
    user,
    formattedScore,
    status,
    dayProgress,
  };
}
