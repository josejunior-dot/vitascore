/**
 * Perfil do usuário — dados reais armazenados localmente.
 * Substitui o mockUser quando o usuário completa o onboarding.
 */

async function getStore(key: string): Promise<any> {
  try {
    const { Preferences } = await import("@capacitor/preferences");
    const { value } = await Preferences.get({ key });
    return value ? JSON.parse(value) : null;
  } catch {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  }
}

async function setStore(key: string, data: any): Promise<void> {
  const value = JSON.stringify(data);
  try {
    const { Preferences } = await import("@capacitor/preferences");
    await Preferences.set({ key, value });
  } catch {
    localStorage.setItem(key, value);
  }
}

export interface UserProfile {
  name: string;
  age: number;
  score: number;
  status: "bronze" | "silver" | "gold" | "platinum";
  streak: number;
  insuranceDiscount: number;
  renewalDate: string;
  premiumMonthly: number;
  annualSavings: number;
  policy: string;
  insurer: string;
  challengesCompleted: number;
  pointsThisMonth: number;
  onboarded: boolean;
}

const DEFAULT_PROFILE: UserProfile = {
  name: "",
  age: 0,
  score: 0,
  status: "bronze",
  streak: 0,
  insuranceDiscount: 0,
  renewalDate: "",
  premiumMonthly: 0,
  annualSavings: 0,
  policy: "",
  insurer: "",
  challengesCompleted: 0,
  pointsThisMonth: 0,
  onboarded: false,
};

export async function getUserProfile(): Promise<UserProfile> {
  const stored = await getStore("user-profile");
  if (!stored) return { ...DEFAULT_PROFILE };
  return { ...DEFAULT_PROFILE, ...stored };
}

export async function saveUserProfile(data: Partial<UserProfile>): Promise<UserProfile> {
  const current = await getUserProfile();
  const updated = { ...current, ...data };
  await setStore("user-profile", updated);
  return updated;
}

export async function isOnboarded(): Promise<boolean> {
  const profile = await getUserProfile();
  return profile.onboarded && profile.name.length > 0;
}

export async function clearProfile(): Promise<void> {
  await setStore("user-profile", null);
}
