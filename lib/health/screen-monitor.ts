/**
 * Screen Monitor — Rastreamento AUTOMATICO de tempo de tela
 *
 * NAO requer acao do usuario. Detecta uso da tela automaticamente via:
 * 1. document.visibilitychange (tela visivel/oculta)
 * 2. Armazenamento via Capacitor Preferences (com fallback localStorage)
 * 3. Relatorio diario "Digital Wellbeing" com score de confianca
 *
 * Indicador de saude mental para seguradoras.
 */

// --- Interfaces ---

export interface ScreenSession {
  start: number; // epoch ms
  end: number | null; // null if still active
}

export interface DailyScreenReport {
  date: string; // YYYY-MM-DD
  totalMinutes: number;
  sessionCount: number;
  nightMinutes: number; // usage between 00:00-05:00
  nightSessions: number;
  longestSessionMinutes: number;
  firstInteraction: string; // HH:mm
  lastInteraction: string; // HH:mm
  sessions: ScreenSession[];
  score: DigitalWellbeingScore;
}

export interface DigitalWellbeingScore {
  total: number; // 0-200
  breakdown: {
    screenTime: number; // 0-60 pts
    unlocks: number; // 0-40 pts
    nightUsage: number; // 0-50 pts
    longestSession: number; // 0-30 pts
    trend: number; // 0-20 pts
  };
  label: string; // "Excelente" | "Saudavel" | "Moderado" | "Atencao" | "Critico"
  color: string; // hex color
}

export interface WeeklyTrend {
  dates: string[];
  minutes: number[];
  direction: "improving" | "stable" | "worsening";
}

// --- Storage helpers ---

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

// --- Helpers ---

function todayKey(): string {
  return new Date().toISOString().split("T")[0];
}

function storageKey(date: string): string {
  return `screen-sessions-${date}`;
}

function formatTime(epoch: number): string {
  const d = new Date(epoch);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function isNightHour(epoch: number): boolean {
  const hour = new Date(epoch).getHours();
  return hour >= 0 && hour < 5;
}

function sessionMinutes(session: ScreenSession): number {
  const end = session.end ?? Date.now();
  return Math.max(0, (end - session.start) / 60000);
}

/**
 * Calcula minutos de uma sessao que caem dentro da faixa noturna (00:00-05:00).
 */
function nightMinutesForSession(session: ScreenSession): number {
  const start = session.start;
  const end = session.end ?? Date.now();
  if (end <= start) return 0;

  let nightMs = 0;
  const dayStart = new Date(start);
  dayStart.setHours(0, 0, 0, 0);

  // Verificar janelas noturnas que podem se sobrepor com a sessao
  // Noite do mesmo dia: 00:00-05:00
  const nightWindowStart = dayStart.getTime();
  const nightWindowEnd = dayStart.getTime() + 5 * 60 * 60 * 1000;

  // Noite do dia seguinte (se a sessao cruza meia-noite)
  const nextNightStart = nightWindowStart + 24 * 60 * 60 * 1000;
  const nextNightEnd = nightWindowEnd + 24 * 60 * 60 * 1000;

  for (const [ws, we] of [[nightWindowStart, nightWindowEnd], [nextNightStart, nextNightEnd]]) {
    const overlapStart = Math.max(start, ws);
    const overlapEnd = Math.min(end, we);
    if (overlapEnd > overlapStart) {
      nightMs += overlapEnd - overlapStart;
    }
  }

  return nightMs / 60000;
}

// --- Score calculation ---

function calculateScore(
  totalMinutes: number,
  sessionCount: number,
  nightMinutes: number,
  longestSessionMinutes: number,
  trend: "improving" | "stable" | "worsening"
): DigitalWellbeingScore {
  // screenTime: <180min=60, 180-300=35, >300=10
  const screenTime = totalMinutes < 180 ? 60 : totalMinutes <= 300 ? 35 : 10;

  // unlocks (sessionCount): <30=40, 30-50=25, 50-80=15, >80=5
  const unlocks = sessionCount < 30 ? 40 : sessionCount <= 50 ? 25 : sessionCount <= 80 ? 15 : 5;

  // nightUsage: 0=50, <15=35, <30=20, >30=5
  const nightUsagePts = nightMinutes === 0 ? 50 : nightMinutes < 15 ? 35 : nightMinutes < 30 ? 20 : 5;

  // longestSession: <60=30, 60-120=20, >120=5
  const longestSessionPts = longestSessionMinutes < 60 ? 30 : longestSessionMinutes <= 120 ? 20 : 5;

  // trend: improving=20, stable=15, worsening=5
  const trendPts = trend === "improving" ? 20 : trend === "stable" ? 15 : 5;

  const total = screenTime + unlocks + nightUsagePts + longestSessionPts + trendPts;

  let label: string;
  let color: string;
  if (total >= 170) {
    label = "Excelente";
    color = "#30D158";
  } else if (total >= 130) {
    label = "Saudavel";
    color = "#30D158";
  } else if (total >= 90) {
    label = "Moderado";
    color = "#FF9F0A";
  } else if (total >= 50) {
    label = "Atencao";
    color = "#FF9F0A";
  } else {
    label = "Critico";
    color = "#FF453A";
  }

  return {
    total,
    breakdown: {
      screenTime,
      unlocks,
      nightUsage: nightUsagePts,
      longestSession: longestSessionPts,
      trend: trendPts,
    },
    label,
    color,
  };
}

function buildReport(
  date: string,
  sessions: ScreenSession[],
  trendDirection: "improving" | "stable" | "worsening"
): DailyScreenReport {
  const completeSessions = sessions.filter((s) => s.start > 0);
  const sessionCount = completeSessions.length;

  let totalMinutes = 0;
  let nightMins = 0;
  let nightSessions = 0;
  let longestSessionMinutes = 0;
  let firstInteraction = Infinity;
  let lastInteraction = 0;

  for (const s of completeSessions) {
    const mins = sessionMinutes(s);
    totalMinutes += mins;

    const nightMinsForSession = nightMinutesForSession(s);
    nightMins += nightMinsForSession;
    if (nightMinsForSession > 0) nightSessions++;

    if (mins > longestSessionMinutes) longestSessionMinutes = mins;

    if (s.start < firstInteraction) firstInteraction = s.start;
    const end = s.end ?? Date.now();
    if (end > lastInteraction) lastInteraction = end;
  }

  totalMinutes = Math.round(totalMinutes);
  nightMins = Math.round(nightMins);
  longestSessionMinutes = Math.round(longestSessionMinutes);

  const firstStr = firstInteraction === Infinity ? "00:00" : formatTime(firstInteraction);
  const lastStr = lastInteraction === 0 ? "00:00" : formatTime(lastInteraction);

  const score = calculateScore(totalMinutes, sessionCount, nightMins, longestSessionMinutes, trendDirection);

  return {
    date,
    totalMinutes,
    sessionCount,
    nightMinutes: nightMins,
    nightSessions,
    longestSessionMinutes,
    firstInteraction: firstStr,
    lastInteraction: lastStr,
    sessions,
    score,
  };
}

// --- Classe principal ---

export class ScreenMonitor {
  private currentSession: ScreenSession | null = null;
  private visibilityHandler: (() => void) | null = null;
  private tracking = false;

  /**
   * Inicia rastreamento automatico de tempo de tela.
   * Adiciona listener de visibilitychange.
   * Chamado uma vez quando o app e aberto.
   */
  startTracking(): void {
    if (this.tracking) return;
    if (typeof document === "undefined") return;

    this.visibilityHandler = () => {
      if (document.visibilityState === "visible") {
        this.startSession();
      } else {
        this.endSession();
      }
    };

    document.addEventListener("visibilitychange", this.visibilityHandler);
    this.tracking = true;

    // Iniciar sessao se a pagina ja esta visivel
    if (document.visibilityState === "visible") {
      this.startSession();
    }
  }

  /**
   * Para o rastreamento e encerra sessao atual.
   */
  stopTracking(): void {
    if (!this.tracking) return;

    if (this.visibilityHandler && typeof document !== "undefined") {
      document.removeEventListener("visibilitychange", this.visibilityHandler);
      this.visibilityHandler = null;
    }

    this.endSession();
    this.tracking = false;
  }

  private startSession(): void {
    // Se ja existe sessao ativa, nao criar outra
    if (this.currentSession && this.currentSession.end === null) return;

    this.currentSession = { start: Date.now(), end: null };
    this.saveSessions();
  }

  private endSession(): void {
    if (!this.currentSession || this.currentSession.end !== null) return;

    this.currentSession.end = Date.now();
    this.saveSessions();
    this.currentSession = null;
  }

  private async saveSessions(): Promise<void> {
    if (!this.currentSession) return;

    const date = todayKey();
    const key = storageKey(date);
    const sessions: ScreenSession[] = (await getStore(key)) || [];

    // Encontrar ou adicionar sessao atual
    const idx = sessions.findIndex(
      (s) => s.start === this.currentSession!.start
    );
    if (idx >= 0) {
      sessions[idx] = { ...this.currentSession };
    } else {
      sessions.push({ ...this.currentSession });
    }

    await setStore(key, sessions);
  }

  /**
   * Retorna relatorio do dia atual.
   */
  async getTodayReport(): Promise<DailyScreenReport> {
    const date = todayKey();
    const sessions: ScreenSession[] = (await getStore(storageKey(date))) || [];

    // Calcular tendencia para o score
    const trend = await this.getWeeklyTrend();

    return buildReport(date, sessions, trend.direction);
  }

  /**
   * Retorna tendencia dos ultimos 7 dias.
   */
  async getWeeklyTrend(): Promise<WeeklyTrend> {
    const dates: string[] = [];
    const minutes: number[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      dates.push(dateStr);

      const sessions: ScreenSession[] = (await getStore(storageKey(dateStr))) || [];
      const total = sessions.reduce((sum, s) => sum + sessionMinutes(s), 0);
      minutes.push(Math.round(total));
    }

    // Determinar direcao: media dos ultimos 3 dias vs media dos 4 anteriores
    const recent = minutes.slice(4); // ultimos 3
    const previous = minutes.slice(0, 4); // primeiros 4

    const recentAvg = recent.length > 0 ? recent.reduce((a, b) => a + b, 0) / recent.length : 0;
    const previousAvg = previous.length > 0 ? previous.reduce((a, b) => a + b, 0) / previous.length : 0;

    let direction: "improving" | "stable" | "worsening";
    if (previousAvg === 0 && recentAvg === 0) {
      direction = "stable";
    } else if (recentAvg < previousAvg * 0.85) {
      // Menos tempo de tela = melhora
      direction = "improving";
    } else if (recentAvg > previousAvg * 1.15) {
      direction = "worsening";
    } else {
      direction = "stable";
    }

    return { dates, minutes, direction };
  }

  /**
   * Retorna relatorio de uma data especifica.
   */
  static async getReport(date: string): Promise<DailyScreenReport | null> {
    const sessions: ScreenSession[] = (await getStore(storageKey(date))) || [];
    if (sessions.length === 0) return null;

    // Para o score, precisamos da tendencia — simplificar com "stable" para datas antigas
    return buildReport(date, sessions, "stable");
  }

  isTracking(): boolean {
    return this.tracking;
  }
}
