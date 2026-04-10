import {
  mockWeeklySteps,
  mockExercises,
  mockTodayStats,
  ExerciseType,
  Intensity,
} from "@/lib/mock-data";

export function useActivity() {
  const weeklySteps = mockWeeklySteps;
  const exercises = mockExercises;
  const todaySteps = mockTodayStats.steps;

  const addExercise = (exercise: {
    name: string;
    type: ExerciseType;
    duration: number;
    intensity: Intensity;
  }) => {
    console.log("Exercicio adicionado:", exercise);
  };

  return {
    weeklySteps,
    exercises,
    todaySteps,
    addExercise,
  };
}
