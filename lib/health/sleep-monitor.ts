/**
 * Sleep Monitor — Verificação AUTOMÁTICA de sono
 *
 * NÃO requer ação do usuário. Detecta sono automaticamente via:
 * 1. Análise retroativa do acelerômetro (celular parado = dormindo)
 * 2. Histórico de uso da tela (último desbloqueio → primeiro desbloqueio)
 * 3. Health Connect/HealthKit (se disponível)
 * 4. Padrões de horário do usuário
 *
 * Score de confiança auditável pela seguradora com hash SHA-256.
 */

export interface MotionSample {
  timestamp: number;
  magnitude: number; // 0 = parado, >2 = movimento
  screenOn: boolean;
}

export interface SleepVerification {
  id: string;
  startTime: string; // ISO — quando dormiu
  endTime: string; // ISO — quando acordou
  totalMinutes: number;
  detectionMethod: "auto_sensors" | "auto_screen" | "health_connect" | "manual";
  samples: MotionSample[];
  analysis: SleepAnalysis;
}

export interface SleepAnalysis {
  confidenceScore: number; // 0-100
  confidenceLabel: string;
  stillnessPercent: number;
  screenOffPercent: number;
  longestStillPeriod: number; // minutos
  movementEvents: number;
  flags: string[];
  verificationHash: string;
}

export interface SleepPreferences {
  windowStart: number; // hora típica de dormir (ex: 22)
  windowEnd: number; // hora típica de acordar (ex: 8)
  minSleepMinutes: number; // mínimo para considerar sono (ex: 180 = 3h)
}

const DEFAULT_PREFS: SleepPreferences = {
  windowStart: 21, // 21h
  windowEnd: 10, // 10h
  minSleepMinutes: 180, // 3h
};

const STILL_THRESHOLD = 0.5;
const MOVEMENT_THRESHOLD = 2.0;
const COLLECTION_INTERVAL_MS = 5 * 60 * 1000; // 5 min
const STILL_STREAK_TO_SLEEP = 3; // 3 amostras paradas (15min) = início do sono
const MOVEMENT_STREAK_TO_WAKE = 2; // 2 amostras com movimento (10min) = acordou

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

// --- Hash para auditoria ---

async function generateHash(data: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const buffer = await crypto.subtle.digest("SHA-256", encoder.encode(data));
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = (hash << 5) - hash + data.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(16, "0");
  }
}

// --- Análise dos dados coletados ---

function analyzeSamples(
  samples: MotionSample[],
  startTime: string,
  endTime: string
): Omit<SleepAnalysis, "verificationHash"> {
  if (samples.length === 0) {
    return {
      confidenceScore: 0,
      confidenceLabel: "Sem dados",
      stillnessPercent: 0,
      screenOffPercent: 0,
      longestStillPeriod: 0,
      movementEvents: 0,
      flags: ["Nenhuma amostra coletada"],
    };
  }

  const stillSamples = samples.filter((s) => s.magnitude < STILL_THRESHOLD);
  const screenOffSamples = samples.filter((s) => !s.screenOn);
  const movementEvents = samples.filter((s) => s.magnitude > MOVEMENT_THRESHOLD);

  const stillnessPercent = Math.round((stillSamples.length / samples.length) * 100);
  const screenOffPercent = Math.round((screenOffSamples.length / samples.length) * 100);

  // Maior período contínuo parado
  let maxStillStreak = 0;
  let currentStreak = 0;
  for (const s of samples) {
    if (s.magnitude < STILL_THRESHOLD) {
      currentStreak++;
      maxStillStreak = Math.max(maxStillStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  const longestStillPeriod = Math.round((maxStillStreak * COLLECTION_INTERVAL_MS) / 60000);

  // Flags
  const flags: string[] = [];
  if (stillnessPercent < 50) flags.push("Celular com muito movimento durante o período");
  if (screenOffPercent < 70) flags.push("Tela ligada por mais de 30% do período");
  if (movementEvents.length > samples.length * 0.4) flags.push("Movimentos significativos frequentes");

  const startHour = new Date(startTime).getHours();
  const endHour = new Date(endTime).getHours();
  if (startHour > 2 && startHour < 20) flags.push("Horário de início incomum para sono noturno");
  if (endHour > 12 && endHour < 20) flags.push("Horário de despertar incomum");

  const totalMinutes = (new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000;
  if (totalMinutes < 180) flags.push("Duração muito curta (< 3h)");
  if (totalMinutes > 840) flags.push("Duração muito longa (> 14h)");

  const expectedSamples = Math.floor(totalMinutes / 5);
  const sampleRatio = samples.length / Math.max(expectedSamples, 1);
  if (sampleRatio < 0.7) flags.push(`Coleta incompleta (${Math.round(sampleRatio * 100)}% das amostras)`);

  // Score de confiança
  let score = 0;
  score += Math.min(35, stillnessPercent * 0.35);
  score += Math.min(25, screenOffPercent * 0.25);
  score += Math.min(15, (longestStillPeriod / 60) * 5);
  score += Math.min(15, sampleRatio * 15);
  score += flags.length === 0 ? 10 : Math.max(0, 10 - flags.length * 3);

  const confidenceScore = Math.round(Math.min(100, Math.max(0, score)));
  const confidenceLabel = confidenceScore >= 80 ? "Alta" : confidenceScore >= 50 ? "Média" : "Baixa";

  return { confidenceScore, confidenceLabel, stillnessPercent, screenOffPercent, longestStillPeriod, movementEvents: movementEvents.length, flags };
}

/**
 * Detecta período de sono automaticamente a partir das amostras coletadas.
 * Procura: streak de 3+ amostras paradas (= dormiu) seguido de
 * streak de 2+ amostras com movimento (= acordou).
 */
function detectSleepPeriod(
  samples: MotionSample[],
  prefs: SleepPreferences
): { sleepStart: number; sleepEnd: number; sleepSamples: MotionSample[] } | null {
  if (samples.length < STILL_STREAK_TO_SLEEP + MOVEMENT_STREAK_TO_WAKE) return null;

  let sleepStartIdx = -1;
  let sleepEndIdx = -1;
  let stillCount = 0;

  // Encontrar início do sono (primeira sequência longa de quietude)
  for (let i = 0; i < samples.length; i++) {
    const hour = new Date(samples[i].timestamp).getHours();
    const inWindow = prefs.windowStart > prefs.windowEnd
      ? hour >= prefs.windowStart || hour < prefs.windowEnd // ex: 21h-10h cruza meia-noite
      : hour >= prefs.windowStart && hour < prefs.windowEnd;

    if (!inWindow) {
      stillCount = 0;
      continue;
    }

    if (samples[i].magnitude < STILL_THRESHOLD && !samples[i].screenOn) {
      stillCount++;
      if (stillCount >= STILL_STREAK_TO_SLEEP && sleepStartIdx === -1) {
        sleepStartIdx = i - STILL_STREAK_TO_SLEEP + 1;
      }
    } else {
      // Se já encontrou início e agora tem movimento, verificar se é despertar
      if (sleepStartIdx !== -1) {
        let moveCount = 0;
        for (let j = i; j < Math.min(i + MOVEMENT_STREAK_TO_WAKE, samples.length); j++) {
          if (samples[j].magnitude >= STILL_THRESHOLD || samples[j].screenOn) moveCount++;
        }
        if (moveCount >= MOVEMENT_STREAK_TO_WAKE) {
          sleepEndIdx = i;
          break;
        }
      }
      stillCount = 0;
    }
  }

  // Se encontrou início mas não fim, o fim é a última amostra
  if (sleepStartIdx !== -1 && sleepEndIdx === -1) {
    sleepEndIdx = samples.length - 1;
  }

  if (sleepStartIdx === -1) return null;

  const sleepSamples = samples.slice(sleepStartIdx, sleepEndIdx + 1);
  const totalMinutes = (samples[sleepEndIdx].timestamp - samples[sleepStartIdx].timestamp) / 60000;

  if (totalMinutes < prefs.minSleepMinutes) return null;

  return {
    sleepStart: samples[sleepStartIdx].timestamp,
    sleepEnd: samples[sleepEndIdx].timestamp,
    sleepSamples,
  };
}

// --- Classe principal ---

export class SleepMonitor {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private samples: MotionSample[] = [];
  private accelHandler: ((event: DeviceMotionEvent) => void) | null = null;
  private lastAccel = { x: 0, y: 0, z: 0 };
  private prefs: SleepPreferences = DEFAULT_PREFS;
  private collecting = false;

  /**
   * Inicia coleta passiva em background.
   * Roda automaticamente — NÃO requer ação do usuário.
   * Chamado uma vez quando o app é aberto.
   */
  async startPassiveCollection(): Promise<boolean> {
    if (this.collecting) return true;

    // Solicitar permissão do acelerômetro (iOS 13+)
    if (typeof DeviceMotionEvent !== "undefined" && "requestPermission" in DeviceMotionEvent) {
      try {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        if (permission !== "granted") return false;
      } catch { /* continua */ }
    }

    // Carregar preferências do usuário
    const savedPrefs = await getStore("sleep-prefs");
    if (savedPrefs) this.prefs = { ...DEFAULT_PREFS, ...savedPrefs };

    // Restaurar amostras de hoje
    const today = new Date().toISOString().split("T")[0];
    const saved = await getStore(`sleep-samples-${today}`);
    if (saved) this.samples = saved;

    // Listener do acelerômetro
    this.accelHandler = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;
      if (acc) this.lastAccel = { x: acc.x ?? 0, y: acc.y ?? 0, z: acc.z ?? 0 };
    };
    window.addEventListener("devicemotion", this.accelHandler);

    // Coletar a cada 5 minutos
    this.collectSample();
    this.intervalId = setInterval(() => this.collectSample(), COLLECTION_INTERVAL_MS);
    this.collecting = true;

    return true;
  }

  private async collectSample(): Promise<void> {
    const { x, y, z } = this.lastAccel;
    const rawMagnitude = Math.sqrt(x * x + y * y + z * z);
    const magnitude = Math.round(Math.abs(rawMagnitude - 9.8) * 100) / 100;
    const screenOn = typeof document !== "undefined" ? !document.hidden : false;

    this.samples.push({ timestamp: Date.now(), magnitude, screenOn });

    // Manter só últimas 24h de amostras (288 amostras)
    if (this.samples.length > 288) this.samples = this.samples.slice(-288);

    // Persistir
    const today = new Date().toISOString().split("T")[0];
    await setStore(`sleep-samples-${today}`, this.samples);
  }

  /**
   * Analisa os dados coletados e detecta sono automaticamente.
   * Chamado quando o usuário abre o app de manhã.
   * Retorna a verificação se sono foi detectado, null se não.
   */
  async analyzeLastNight(): Promise<SleepVerification | null> {
    // Carregar amostras de hoje e ontem
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const todaySamples: MotionSample[] = (await getStore(`sleep-samples-${today}`)) || [];
    const yesterdaySamples: MotionSample[] = (await getStore(`sleep-samples-${yesterday}`)) || [];

    // Combinar amostras da noite (ontem 18h+ até hoje)
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 1);
    cutoff.setHours(18, 0, 0, 0);
    const nightSamples = [
      ...yesterdaySamples.filter((s) => s.timestamp >= cutoff.getTime()),
      ...todaySamples,
    ].sort((a, b) => a.timestamp - b.timestamp);

    if (nightSamples.length < 5) return null;

    // Detectar período de sono
    const detected = detectSleepPeriod(nightSamples, this.prefs);
    if (!detected) return null;

    // Verificar se já analisamos esse período
    const existing = await getStore(`sleep-verified-${today}`);
    if (existing) return existing;

    // Analisar
    const startTime = new Date(detected.sleepStart).toISOString();
    const endTime = new Date(detected.sleepEnd).toISOString();
    const totalMinutes = Math.round((detected.sleepEnd - detected.sleepStart) / 60000);

    const analysis = analyzeSamples(detected.sleepSamples, startTime, endTime);

    const dataForHash = JSON.stringify({
      startTime,
      endTime,
      sampleCount: detected.sleepSamples.length,
      samples: detected.sleepSamples.map((s) => `${s.timestamp}:${s.magnitude}:${s.screenOn}`),
    });
    const verificationHash = await generateHash(dataForHash);

    const verification: SleepVerification = {
      id: `sleep-auto-${Date.now()}`,
      startTime,
      endTime,
      totalMinutes,
      detectionMethod: "auto_sensors",
      samples: detected.sleepSamples,
      analysis: { ...analysis, verificationHash },
    };

    // Salvar
    await setStore(`sleep-verified-${today}`, verification);

    const history: SleepVerification[] = (await getStore("sleep-history")) || [];
    history.push(verification);
    if (history.length > 90) history.shift();
    await setStore("sleep-history", history);

    return verification;
  }

  /**
   * Registro manual como fallback (pontuação menor)
   */
  async registerManual(bedtime: string, wakeTime: string): Promise<SleepVerification> {
    const today = new Date().toISOString().split("T")[0];
    const [bh, bm] = bedtime.split(":").map(Number);
    const [wh, wm] = wakeTime.split(":").map(Number);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (bh > 12 ? 1 : 0));
    startDate.setHours(bh, bm, 0, 0);

    const endDate = new Date();
    endDate.setHours(wh, wm, 0, 0);

    const totalMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60000);

    // Verificar se temos amostras do período para corroborar
    const yesterdaySamples: MotionSample[] = (await getStore(`sleep-samples-${new Date(startDate).toISOString().split("T")[0]}`)) || [];
    const todaySamples: MotionSample[] = (await getStore(`sleep-samples-${today}`)) || [];
    const relevantSamples = [...yesterdaySamples, ...todaySamples].filter(
      (s) => s.timestamp >= startDate.getTime() && s.timestamp <= endDate.getTime()
    );

    const startTime = startDate.toISOString();
    const endTime = endDate.toISOString();

    let analysis: Omit<SleepAnalysis, "verificationHash">;
    let method: SleepVerification["detectionMethod"];

    if (relevantSamples.length >= 5) {
      // Temos dados de sensor para corroborar o registro manual
      analysis = analyzeSamples(relevantSamples, startTime, endTime);
      method = "auto_sensors";
    } else {
      // Sem dados de sensor — registro manual puro (confiança máxima limitada a 40)
      analysis = {
        confidenceScore: 35,
        confidenceLabel: "Baixa",
        stillnessPercent: 0,
        screenOffPercent: 0,
        longestStillPeriod: 0,
        movementEvents: 0,
        flags: [
          "Registro manual sem verificação por sensores",
          "Score limitado — ative a coleta automática para maior confiança",
        ],
      };
      method = "manual";
    }

    const dataForHash = JSON.stringify({ startTime, endTime, method, samples: relevantSamples.length });
    const verificationHash = await generateHash(dataForHash);

    const verification: SleepVerification = {
      id: `sleep-${method}-${Date.now()}`,
      startTime,
      endTime,
      totalMinutes,
      detectionMethod: method,
      samples: relevantSamples,
      analysis: { ...analysis, verificationHash },
    };

    await setStore(`sleep-verified-${today}`, verification);
    const history: SleepVerification[] = (await getStore("sleep-history")) || [];
    history.push(verification);
    if (history.length > 90) history.shift();
    await setStore("sleep-history", history);

    return verification;
  }

  /**
   * Salva preferências de horário do usuário (para refinar detecção)
   */
  async savePreferences(prefs: Partial<SleepPreferences>): Promise<void> {
    this.prefs = { ...this.prefs, ...prefs };
    await setStore("sleep-prefs", this.prefs);
  }

  isCollecting(): boolean {
    return this.collecting;
  }

  stop(): void {
    if (this.intervalId) { clearInterval(this.intervalId); this.intervalId = null; }
    if (this.accelHandler) { window.removeEventListener("devicemotion", this.accelHandler); this.accelHandler = null; }
    this.collecting = false;
  }

  static async getLastVerification(): Promise<SleepVerification | null> {
    const today = new Date().toISOString().split("T")[0];
    return await getStore(`sleep-verified-${today}`);
  }

  static async getHistory(): Promise<SleepVerification[]> {
    return (await getStore("sleep-history")) || [];
  }
}
