export const mockUser = {
  name: "Você",
  age: 34,
  score: 742,
  maxScore: 1000,
  status: "gold" as const,
  streak: 12,
  insuranceDiscount: 11.2,
  renewalDate: "2025-07-15",
  premiumMonthly: 178.5,
  annualSavings: 234.0,
  policy: "SL-2024-847291",
  insurer: "SecureLife Seguros",
  challengesCompleted: 8,
  pointsThisMonth: 420,
  avatar: null,
};

export type UserStatus = "bronze" | "silver" | "gold" | "platinum";

export const statusConfig: Record<
  UserStatus,
  { label: string; emoji: string; color: string; min: number }
> = {
  bronze: { label: "Bronze", emoji: "🥉", color: "#CD7F32", min: 0 },
  silver: { label: "Prata", emoji: "🥈", color: "#C0C0C0", min: 300 },
  gold: { label: "Ouro", emoji: "🏆", color: "#FFD60A", min: 600 },
  platinum: { label: "Platina", emoji: "💎", color: "#E5E4E2", min: 850 },
};

export const mockWeeklySteps = [
  { day: "Seg", steps: 8420, goal: 10000 },
  { day: "Ter", steps: 11200, goal: 10000 },
  { day: "Qua", steps: 6800, goal: 10000 },
  { day: "Qui", steps: 9100, goal: 10000 },
  { day: "Sex", steps: 7240, goal: 10000 },
  { day: "Sáb", steps: 12500, goal: 10000 },
  { day: "Dom", steps: 4200, goal: 10000 },
];

export const mockSleepData = [
  { date: "27/03", hours: 7.5, quality: 85 },
  { date: "28/03", hours: 6.2, quality: 60 },
  { date: "29/03", hours: 8.0, quality: 92 },
  { date: "30/03", hours: 7.0, quality: 78 },
  { date: "31/03", hours: 5.5, quality: 45 },
  { date: "01/04", hours: 7.8, quality: 88 },
  { date: "02/04", hours: 7.2, quality: 80 },
  { date: "03/04", hours: 8.1, quality: 95 },
  { date: "04/04", hours: 6.8, quality: 70 },
  { date: "05/04", hours: 7.4, quality: 82 },
  { date: "06/04", hours: 7.0, quality: 76 },
  { date: "07/04", hours: 8.3, quality: 93 },
  { date: "08/04", hours: 6.5, quality: 62 },
  { date: "09/04", hours: 7.2, quality: 80 },
];

export const mockTodaySleep = {
  hours: 7,
  minutes: 12,
  quality: "good" as const,
  bedtime: "23:30",
  wakeup: "06:42",
  deepSleep: 1.8,
  lightSleep: 3.5,
  rem: 1.9,
  points: 60,
};

export const mockTodayStats = {
  steps: { current: 7240, goal: 10000, km: 5.1 },
  sleep: { hours: 7, minutes: 12, goal: 8 },
  water: { current: 1.8, goal: 2.5 },
  meals: { current: 2, goal: 3 },
};

export const mockExercises = [
  {
    id: "1",
    type: "running" as const,
    name: "Corrida matinal",
    duration: 35,
    calories: 320,
    points: 45,
    date: "2025-04-09",
    time: "06:30",
    intensity: "moderate" as const,
  },
  {
    id: "2",
    type: "gym" as const,
    name: "Treino de força",
    duration: 50,
    calories: 280,
    points: 40,
    date: "2025-04-08",
    time: "18:00",
    intensity: "intense" as const,
  },
  {
    id: "3",
    type: "walking" as const,
    name: "Caminhada no parque",
    duration: 45,
    calories: 180,
    points: 25,
    date: "2025-04-07",
    time: "07:15",
    intensity: "light" as const,
  },
  {
    id: "4",
    type: "cycling" as const,
    name: "Pedal no fim de semana",
    duration: 60,
    calories: 450,
    points: 55,
    date: "2025-04-06",
    time: "08:00",
    intensity: "intense" as const,
  },
];

export type ExerciseType =
  | "running"
  | "walking"
  | "cycling"
  | "swimming"
  | "gym"
  | "other";
export type Intensity = "light" | "moderate" | "intense";

export const exerciseTypeConfig: Record<
  ExerciseType,
  { label: string; icon: string }
> = {
  running: { label: "Corrida", icon: "🏃" },
  walking: { label: "Caminhada", icon: "🚶" },
  cycling: { label: "Bike", icon: "🚴" },
  swimming: { label: "Natação", icon: "🏊" },
  gym: { label: "Academia", icon: "🏋️" },
  other: { label: "Outro", icon: "⚡" },
};

export const intensityConfig: Record<
  Intensity,
  { label: string; multiplier: number; color: string }
> = {
  light: { label: "Leve", multiplier: 1, color: "#30D158" },
  moderate: { label: "Moderada", multiplier: 1.5, color: "#FF9F0A" },
  intense: { label: "Intensa", multiplier: 2, color: "#FF453A" },
};

export const mockRecentActivity = [
  {
    id: "1",
    icon: "🏃",
    description: "Corrida de 5km",
    points: 45,
    time: "há 2h",
  },
  {
    id: "2",
    icon: "😴",
    description: "Sono de qualidade",
    points: 30,
    time: "há 8h",
  },
  {
    id: "3",
    icon: "🥗",
    description: "Check-in nutricional",
    points: 10,
    time: "há 5h",
  },
  {
    id: "4",
    icon: "💧",
    description: "Meta de água atingida",
    points: 15,
    time: "há 6h",
  },
  {
    id: "5",
    icon: "🏋️",
    description: "Treino de força",
    points: 40,
    time: "ontem",
  },
];

export const mockChallenges = {
  active: [
    {
      id: "1",
      title: "7 dias com 8.000 passos",
      description: "Complete pelo menos 8.000 passos por dia durante 7 dias consecutivos",
      progress: 4,
      total: 7,
      reward: 150,
      daysLeft: 3,
      color: "#1877F2",
      icon: "👟",
    },
    {
      id: "2",
      title: "Sono regular",
      description: "Durma pelo menos 7h por noite durante 5 noites seguidas",
      progress: 3,
      total: 5,
      reward: 100,
      daysLeft: 5,
      color: "#7B61FF",
      icon: "🌙",
    },
  ],
  completed: [
    {
      id: "3",
      title: "Primeira corrida",
      description: "Complete sua primeira corrida registrada",
      progress: 1,
      total: 1,
      reward: 50,
      daysLeft: 0,
      color: "#30D158",
      icon: "🏃",
    },
    {
      id: "4",
      title: "Hidratação perfeita",
      description: "Atinja a meta de água por 3 dias",
      progress: 3,
      total: 3,
      reward: 75,
      daysLeft: 0,
      color: "#0A84FF",
      icon: "💧",
    },
  ],
  available: [
    {
      id: "5",
      title: "Maratonista digital",
      description: "Acumule 100km em corridas e caminhadas",
      progress: 0,
      total: 100,
      reward: 300,
      daysLeft: 30,
      color: "#FF9F0A",
      icon: "🏅",
    },
    {
      id: "6",
      title: "Check-in nutricional",
      description: "Registre 21 refeições em 7 dias",
      progress: 0,
      total: 21,
      reward: 120,
      daysLeft: 7,
      color: "#30D158",
      icon: "🥗",
    },
  ],
};

export const mockAchievements = [
  { id: "1", name: "Primeiro Passo", icon: "👟", unlocked: true, date: "2025-03-01" },
  { id: "2", name: "Madrugador", icon: "🌅", unlocked: true, date: "2025-03-05" },
  { id: "3", name: "Hidratado", icon: "💧", unlocked: true, date: "2025-03-10" },
  { id: "4", name: "7 Dias Ativos", icon: "🔥", unlocked: true, date: "2025-03-15" },
  { id: "5", name: "Sono Perfeito", icon: "😴", unlocked: true, date: "2025-03-20" },
  { id: "6", name: "Corredor 10km", icon: "🏃", unlocked: false, date: null },
  { id: "7", name: "30 Dias Streak", icon: "⚡", unlocked: false, date: null },
  { id: "8", name: "Platina", icon: "💎", unlocked: false, date: null },
];

export const mockRanking = [
  { position: 1, name: "Segurado #2341", score: 892, isUser: false },
  { position: 2, name: "Segurado #1087", score: 856, isUser: false },
  { position: 3, name: "Segurado #4520", score: 831, isUser: false },
  { position: 4, name: "Você", score: 742, isUser: true },
  { position: 5, name: "Segurado #3192", score: 718, isUser: false },
  { position: 6, name: "Segurado #5678", score: 695, isUser: false },
  { position: 7, name: "Segurado #9012", score: 672, isUser: false },
];

export const mockScoreHistory = [
  { month: "Out", score: 420 },
  { month: "Nov", score: 510 },
  { month: "Dez", score: 580 },
  { month: "Jan", score: 620 },
  { month: "Fev", score: 680 },
  { month: "Mar", score: 720 },
  { month: "Abr", score: 742 },
];

export const mockDiscountHistory = [
  { month: "Out", discount: 4.2, average: 5.0 },
  { month: "Nov", discount: 6.1, average: 5.5 },
  { month: "Dez", discount: 7.5, average: 6.0 },
  { month: "Jan", discount: 8.2, average: 6.2 },
  { month: "Fev", discount: 9.8, average: 6.5 },
  { month: "Mar", discount: 10.5, average: 6.8 },
  { month: "Abr", discount: 11.2, average: 7.0 },
];

export const mockInsuranceActions = [
  {
    id: "1",
    title: "Exame preventivo anual",
    points: 200,
    discountPercent: 1.2,
    completed: true,
  },
  {
    id: "2",
    title: "30 dias consecutivos de atividade",
    points: 150,
    discountPercent: 0.9,
    completed: false,
  },
  {
    id: "3",
    title: "7 noites seguidas de sono adequado",
    points: 100,
    discountPercent: 0.6,
    completed: false,
  },
  {
    id: "4",
    title: "Check-up médico completo",
    points: 250,
    discountPercent: 1.5,
    completed: false,
  },
  {
    id: "5",
    title: "Vacinação em dia",
    points: 100,
    discountPercent: 0.6,
    completed: true,
  },
];

export const mockNutritionLog = [
  {
    id: "1",
    meal: "Café da manhã",
    time: "07:30",
    description: "Aveia com frutas e café",
    quality: "good" as const,
    points: 10,
  },
  {
    id: "2",
    meal: "Almoço",
    time: "12:15",
    description: "Salada com frango grelhado",
    quality: "great" as const,
    points: 15,
  },
];

export const mockNotifications = 3;
