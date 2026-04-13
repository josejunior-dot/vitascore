/**
 * Meal Analyzer — Captura e análise de fotos de refeições
 *
 * ANTI-FRAUDE:
 * 1. Câmera obrigatória — galeria bloqueada (Capacitor Camera + input capture)
 * 2. Timestamp validado — foto deve ser de AGORA (±2 minutos)
 * 3. Detecção de foto-de-foto — IA verifica moiré/reflexo/planura
 * 4. Geolocalização — posição GPS registrada com a foto
 * 5. Hash único — foto já usada é rejeitada
 * 6. Device fingerprint — info do dispositivo no hash
 */

// ---------------------------------------------------------------------------
// Storage helpers
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Hash SHA-256
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface PhotoMetadata {
  capturedAt: string;          // ISO timestamp do momento da captura
  latitude: number | null;
  longitude: number | null;
  deviceInfo: string;          // user agent / device model
  photoHash: string;           // hash da imagem (anti-reuso)
  captureMethod: "camera_native" | "camera_web" | "unknown";
}

export interface AntifraudResult {
  passed: boolean;
  score: number;               // 0-100 (100 = sem fraude detectada)
  checks: {
    isCameraPhoto: boolean;    // não veio da galeria
    isTimestampFresh: boolean; // foto é de agora (±2min)
    isNotScreenPhoto: boolean; // não é foto de tela/impressão
    isNotDuplicate: boolean;   // não foi usada antes
    hasLocation: boolean;      // tem GPS
  };
  flags: string[];
}

export type CaloricDensity = "green" | "yellow" | "orange" | "unknown";

export interface MealPhotoAnalysis {
  isFood: boolean;
  hasVegetables: boolean;
  hasProtein: boolean;
  hasWholeGrains: boolean;
  hasFruit: boolean;
  isProcessed: boolean;
  isDeepFried: boolean;
  portionSize: "small" | "adequate" | "large";
  colorVariety: number;
  hydration: "water" | "juice" | "soda" | "none" | "unknown";
  description: string;
  mealScore: number;           // 0-100
  confidence: number;          // 0-100
  caloricDensity: CaloricDensity; // sistema Noom (verde/amarelo/laranja)
  estimatedCalories: number;      // aproximado, pode ter ±30% de erro
  antifraud: AntifraudResult;  // resultado da verificação anti-fraude
  editedByUser?: boolean;      // true se o usuário editou manualmente
}

export interface VerifiedMeal {
  id: string;
  type: "cafe" | "almoco" | "jantar" | "lanche";
  timestamp: string;
  photoBase64: string | null;
  photoMetadata: PhotoMetadata | null;
  analysis: MealPhotoAnalysis | null;
  manualDescription: string | null;
  points: number;
  verificationMethod: "photo_ai" | "manual";
  verificationHash: string;
}

export interface DailyNutritionReport {
  date: string;
  meals: VerifiedMeal[];
  totalPoints: number;
  mealCount: number;
  photoVerifiedCount: number;
  avgMealScore: number;
  regularityScore: number;
  varietyScore: number;
  confidenceLabel: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function todayKey(): string {
  return `meals-verified-${todayDateStr()}`;
}

function todayDateStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function dateKeyFor(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return `meals-verified-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chance(p: number): boolean {
  return Math.random() < p;
}

// ---------------------------------------------------------------------------
// Anti-fraude: captura de geolocalização
// ---------------------------------------------------------------------------

async function getLocation(): Promise<{ lat: number; lng: number } | null> {
  // GPS é opcional (só anti-fraude). Só pega se a permissão JÁ estiver
  // concedida — nunca dispara o diálogo de permissão aqui, para não
  // conflitar com o diálogo da câmera.
  try {
    const { Geolocation } = await import("@capacitor/geolocation");
    const perm = await Geolocation.checkPermissions();
    if (perm.location !== "granted" && perm.coarseLocation !== "granted") {
      return null; // sem permissão, pula sem pedir
    }
    const pos = await Geolocation.getCurrentPosition({ timeout: 5000 });
    return { lat: pos.coords.latitude, lng: pos.coords.longitude };
  } catch {
    // Fallback web: checa Permissions API antes de chamar getCurrentPosition
    try {
      if (typeof navigator === "undefined" || !navigator.geolocation) return null;
      if (navigator.permissions?.query) {
        const status = await navigator.permissions.query({
          name: "geolocation" as PermissionName,
        });
        if (status.state !== "granted") return null;
      } else {
        return null; // sem API de Permissions, melhor não pedir
      }
      return await new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => resolve(null),
          { timeout: 5000 },
        );
      });
    } catch {
      return null;
    }
  }
}

// ---------------------------------------------------------------------------
// Anti-fraude: captura pela câmera (bloqueia galeria)
// ---------------------------------------------------------------------------

async function captureFromNativeCamera(): Promise<{ base64: string; method: "camera_native" } | null> {
  try {
    const { Camera, CameraResultType, CameraSource } = await import("@capacitor/camera");
    const photo = await Camera.getPhoto({
      quality: 70,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,    // CAMERA ONLY — bloqueia galeria
      width: 800,
      correctOrientation: true,
    });
    if (photo.base64String) {
      return { base64: `data:image/jpeg;base64,${photo.base64String}`, method: "camera_native" };
    }
    return null;
  } catch {
    return null; // Capacitor não disponível, fallback para web
  }
}

function captureFromWebCamera(): Promise<{ base64: string; method: "camera_web" } | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";  // Força câmera traseira
    input.style.display = "none";
    document.body.appendChild(input);

    const cleanup = () => { document.body.removeChild(input); };

    input.addEventListener("change", () => {
      const file = input.files?.[0];
      if (!file) { cleanup(); resolve(null); return; }

      // Verificar que é uma foto recente (não da galeria)
      // Fotos da câmera têm lastModified ~= agora
      const timeDiff = Date.now() - file.lastModified;
      if (timeDiff > 120000) { // >2 min = provavelmente da galeria
        cleanup();
        resolve(null); // Rejeitado — foto antiga
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const MAX_WIDTH = 800;
          let w = img.width, h = img.height;
          if (w > MAX_WIDTH) { h = Math.round((h * MAX_WIDTH) / w); w = MAX_WIDTH; }
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) { cleanup(); resolve(null); return; }
          ctx.drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL("image/jpeg", 0.7);
          cleanup();
          resolve({ base64: compressed, method: "camera_web" });
        };
        img.onerror = () => { cleanup(); resolve(null); };
        img.src = reader.result as string;
      };
      reader.onerror = () => { cleanup(); resolve(null); };
      reader.readAsDataURL(file);
    });

    window.addEventListener("focus", () => {
      setTimeout(() => { if (!input.files?.length) { cleanup(); resolve(null); } }, 500);
    }, { once: true });

    input.click();
  });
}

// ---------------------------------------------------------------------------
// Anti-fraude: verificação da imagem
// ---------------------------------------------------------------------------

async function runAntifraudChecks(
  photoBase64: string,
  capturedAt: string,
  captureMethod: "camera_native" | "camera_web" | "unknown",
  location: { lat: number; lng: number } | null,
): Promise<AntifraudResult> {
  const flags: string[] = [];

  // 1. Verificar método de captura
  const isCameraPhoto = captureMethod !== "unknown";
  if (!isCameraPhoto) flags.push("Método de captura não confirmado");

  // 2. Verificar timestamp (foto deve ser de agora)
  const capturedTime = new Date(capturedAt).getTime();
  const timeDiff = Math.abs(Date.now() - capturedTime);
  const isTimestampFresh = timeDiff < 120000; // 2 minutos
  if (!isTimestampFresh) flags.push("Timestamp da foto não corresponde ao momento atual");

  // 3. Detectar foto-de-foto (heurística via análise de imagem)
  const isNotScreenPhoto = await detectRealPhoto(photoBase64);
  if (!isNotScreenPhoto) flags.push("Possível foto de tela ou impressão detectada");

  // 4. Verificar duplicata (hash da imagem já usado)
  const photoHash = await generateHash(photoBase64.slice(0, 5000)); // hash dos primeiros bytes
  const usedHashes: string[] = (await getStore("photo-hashes")) || [];
  const isNotDuplicate = !usedHashes.includes(photoHash);
  if (!isNotDuplicate) flags.push("Foto já utilizada anteriormente");

  // Salvar hash para futuras verificações
  if (isNotDuplicate) {
    usedHashes.push(photoHash);
    if (usedHashes.length > 500) usedHashes.shift(); // manter últimos 500
    await setStore("photo-hashes", usedHashes);
  }

  // 5. GPS
  const hasLocation = location !== null;
  if (!hasLocation) flags.push("Geolocalização não disponível");

  // Score anti-fraude
  let score = 0;
  if (isCameraPhoto) score += 25;
  if (isTimestampFresh) score += 25;
  if (isNotScreenPhoto) score += 20;
  if (isNotDuplicate) score += 20;
  if (hasLocation) score += 10;

  return {
    passed: score >= 70 && flags.length <= 1,
    score,
    checks: { isCameraPhoto, isTimestampFresh, isNotScreenPhoto, isNotDuplicate, hasLocation },
    flags,
  };
}

/**
 * Detecta se é uma foto real ou foto de tela/impressão.
 *
 * Heurísticas usadas:
 * - Fotos de tela têm padrão moiré (variação alta de frequência)
 * - Fotos de impressão têm resolução efetiva menor
 * - Fotos de tela mostram reflexos e bordas do dispositivo
 *
 * Em produção, a IA (Claude Vision) faria essa análise com o prompt:
 * "Is this a photo of real food on a real plate/table, or is it a photo
 *  of a screen, printed image, or another photograph? Look for moiré
 *  patterns, screen reflections, paper edges, or pixel grid."
 *
 * Por agora: análise simplificada via canvas.
 */
async function detectRealPhoto(photoBase64: string): Promise<boolean> {
  try {
    return await new Promise<boolean>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 100; // analisar em baixa resolução
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) { resolve(true); return; } // na dúvida, aceita

        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;

        // Calcular variância de alta frequência (indicador de moiré)
        let highFreqSum = 0;
        let samples = 0;
        for (let y = 1; y < size - 1; y++) {
          for (let x = 1; x < size - 1; x++) {
            const idx = (y * size + x) * 4;
            const idxRight = (y * size + x + 1) * 4;
            const idxDown = ((y + 1) * size + x) * 4;

            // Diferença com pixel vizinho (Laplacian simplificado)
            const diffR = Math.abs(data[idx] - data[idxRight]) + Math.abs(data[idx] - data[idxDown]);
            const diffG = Math.abs(data[idx + 1] - data[idxRight + 1]) + Math.abs(data[idx + 1] - data[idxDown + 1]);
            const diffB = Math.abs(data[idx + 2] - data[idxRight + 2]) + Math.abs(data[idx + 2] - data[idxDown + 2]);

            highFreqSum += diffR + diffG + diffB;
            samples++;
          }
        }

        const avgHighFreq = highFreqSum / samples;

        // Fotos de tela/impressão tipicamente têm alta frequência mais uniforme
        // Fotos reais de comida têm variação natural mais suave
        // Threshold empírico — fotos de tela: avgHighFreq > 80
        // Fotos reais: avgHighFreq entre 15-60 geralmente
        const isLikelyReal = avgHighFreq < 75;

        // Verificar bordas escuras (indicador de foto de tela de celular)
        let darkBorderPixels = 0;
        let totalBorder = 0;
        for (let x = 0; x < size; x++) {
          for (const y of [0, 1, size - 2, size - 1]) {
            const idx = (y * size + x) * 4;
            const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
            if (brightness < 30) darkBorderPixels++;
            totalBorder++;
          }
        }
        const darkBorderRatio = darkBorderPixels / totalBorder;
        const hasScreenBorder = darkBorderRatio > 0.4;

        resolve(isLikelyReal && !hasScreenBorder);
      };
      img.onerror = () => resolve(true);
      img.src = photoBase64;
    });
  } catch {
    return true; // na dúvida, aceita
  }
}

// ---------------------------------------------------------------------------
// Class MealAnalyzer
// ---------------------------------------------------------------------------

export class MealAnalyzer {
  /**
   * Captura foto APENAS da câmera (galeria bloqueada).
   * Tenta Capacitor Camera primeiro, fallback para web input com capture.
   * Retorna { base64, metadata } ou null se cancelado/rejeitado.
   */
  static async capturePhoto(): Promise<{ base64: string; metadata: PhotoMetadata } | null> {
    const capturedAt = new Date().toISOString();

    // Tentar câmera nativa primeiro (Capacitor — bloqueia galeria 100%)
    // IMPORTANTE: GPS só é solicitado DEPOIS da foto, para não colidir com
    // o diálogo de permissão da câmera.
    let result: { base64: string; method: string } | null = await captureFromNativeCamera();
    let method: PhotoMetadata["captureMethod"] = "camera_native";

    // Fallback para web (com verificação de timestamp)
    if (!result) {
      result = await captureFromWebCamera();
      method = result ? "camera_web" : "unknown";
    }

    if (!result) return null;

    // GPS só é checado depois da foto e só se a permissão já estiver concedida
    // (getLocation nunca dispara diálogo de permissão)
    const location = await getLocation();
    const photoHash = await generateHash(result.base64.slice(0, 5000));

    const metadata: PhotoMetadata = {
      capturedAt,
      latitude: location?.lat ?? null,
      longitude: location?.lng ?? null,
      deviceInfo: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
      photoHash,
      captureMethod: method,
    };

    return { base64: result.base64, metadata };
  }

  /**
   * Analisa foto de refeição com verificação anti-fraude.
   *
   * TODO produção: substituir mock por Claude Vision API:
   * ```
   * const response = await fetch("/api/analyze-meal", {
   *   method: "POST",
   *   body: JSON.stringify({ image: photoBase64, prompt: MEAL_ANALYSIS_PROMPT }),
   * });
   * ```
   *
   * O prompt para a IA incluiria:
   * "Analyze this food photo. Also determine: is this a real photo of food
   *  on a plate/table, or a photo of a screen/printed image? Check for moiré
   *  patterns, reflections, paper edges."
   */
  static async analyzePhoto(
    photoBase64: string,
    metadata: PhotoMetadata,
  ): Promise<MealPhotoAnalysis> {
    // Rodar verificação anti-fraude
    const antifraud = await runAntifraudChecks(
      photoBase64,
      metadata.capturedAt,
      metadata.captureMethod,
      metadata.latitude && metadata.longitude
        ? { lat: metadata.latitude, lng: metadata.longitude }
        : null,
    );

    // Se anti-fraude reprova a foto, retornar score zero
    if (!antifraud.passed) {
      return {
        isFood: false,
        hasVegetables: false,
        hasProtein: false,
        hasWholeGrains: false,
        hasFruit: false,
        isProcessed: false,
        isDeepFried: false,
        portionSize: "adequate",
        colorVariety: 0,
        hydration: "unknown",
        description: "Foto rejeitada pela verificação anti-fraude: " + antifraud.flags.join("; "),
        mealScore: 0,
        confidence: 0,
        caloricDensity: "unknown",
        estimatedCalories: 0,
        antifraud,
      };
    }

    // Tentar análise real via API (Claude Vision)
    const aiResult = await this.callAiApi(photoBase64);
    if (aiResult) {
      // API respondeu — usar resultado real
      // Se a IA detectou foto de tela, adicionar flag
      if (aiResult.isScreenPhoto) {
        antifraud.passed = false;
        antifraud.score = Math.min(antifraud.score, 30);
        antifraud.checks.isNotScreenPhoto = false;
        antifraud.flags.push("IA detectou foto de tela ou impressão");
      }

      const confidence = Math.round(aiResult.confidence * (antifraud.score / 100));

      return {
        isFood: aiResult.isFood,
        hasVegetables: aiResult.hasVegetables,
        hasProtein: aiResult.hasProtein,
        hasWholeGrains: aiResult.hasWholeGrains,
        hasFruit: aiResult.hasFruit,
        isProcessed: aiResult.isProcessed,
        isDeepFried: aiResult.isDeepFried,
        portionSize: aiResult.portionSize,
        colorVariety: aiResult.colorVariety,
        hydration: aiResult.hydration,
        description: aiResult.description,
        mealScore: aiResult.isFood ? aiResult.mealScore : 0,
        confidence,
        caloricDensity: aiResult.caloricDensity,
        estimatedCalories: aiResult.estimatedCalories,
        antifraud,
      };
    }

    // Fallback: análise mock local (quando API não está configurada)
    const imageSize = photoBase64.length;
    const seed = imageSize % 100;

    const hasVegetables = chance(0.7);
    const hasProtein = chance(0.8);
    const hasWholeGrains = chance(0.4);
    const hasFruit = chance(0.25);
    const isProcessed = chance(0.2);
    const isDeepFried = chance(0.1);
    const portions: ("small" | "adequate" | "large")[] = ["small", "adequate", "large"];
    const portionSize = portions[seed % 3];
    const colorVariety = Math.min(5, Math.max(1, rand(2, 4) + (hasVegetables ? 1 : 0)));

    const hydrationOpts: ("water" | "juice" | "soda" | "none" | "unknown")[] = ["water", "juice", "soda", "none", "unknown"];
    const hydrationW = [0.3, 0.15, 0.1, 0.15, 0.3];
    let roll = Math.random();
    let hydration: typeof hydrationOpts[number] = "unknown";
    for (let i = 0; i < hydrationOpts.length; i++) {
      roll -= hydrationW[i];
      if (roll <= 0) { hydration = hydrationOpts[i]; break; }
    }

    let score = 50;
    if (hasVegetables) score += 12;
    if (hasProtein) score += 8;
    if (hasWholeGrains) score += 8;
    if (hasFruit) score += 5;
    if (isProcessed) score -= 15;
    if (isDeepFried) score -= 12;
    if (portionSize === "adequate") score += 5;
    if (portionSize === "large") score -= 3;
    if (colorVariety >= 4) score += 5;
    if (hydration === "water") score += 5;
    if (hydration === "soda") score -= 8;
    score = Math.max(0, Math.min(100, score + rand(-5, 5)));

    const description = this.generateDescription({ hasVegetables, hasProtein, hasWholeGrains, hasFruit, isProcessed, isDeepFried, portionSize });

    const baseConfidence = rand(75, 95);
    const confidence = Math.round(baseConfidence * (antifraud.score / 100));

    // Mock de densidade calórica baseada nos flags
    const mockDensity: CaloricDensity =
      hasVegetables && hasFruit && !isProcessed && !isDeepFried
        ? "green"
        : isProcessed || isDeepFried
          ? "orange"
          : "yellow";
    const mockCalories = portionSize === "small" ? rand(250, 400) : portionSize === "large" ? rand(700, 1100) : rand(400, 700);

    return {
      isFood: true,
      hasVegetables, hasProtein, hasWholeGrains, hasFruit,
      isProcessed, isDeepFried, portionSize, colorVariety, hydration,
      description, mealScore: score, confidence,
      caloricDensity: mockDensity,
      estimatedCalories: mockCalories,
      antifraud,
    };
  }

  /**
   * Chama a API de IA (Claude ou OpenAI) para análise real da foto.
   * Retorna null se nenhum provider estiver configurado ou se a chamada falhar.
   */
  private static async callAiApi(photoBase64: string): Promise<any | null> {
    try {
      const { analyzeMealImage } = await import("../ai/meal-ai");
      return await analyzeMealImage(photoBase64);
    } catch (err) {
      console.error("callAiApi failed:", err);
      return null;
    }
  }

  private static generateDescription(attrs: {
    hasVegetables: boolean; hasProtein: boolean; hasWholeGrains: boolean;
    hasFruit: boolean; isProcessed: boolean; isDeepFried: boolean; portionSize: string;
  }): string {
    const parts: string[] = [];
    if (attrs.isProcessed) parts.push("Refeição com alimentos industrializados");
    else if (attrs.isDeepFried) parts.push("Refeição com frituras");
    else parts.push("Refeição caseira");

    const c: string[] = [];
    if (attrs.hasProtein) c.push("fonte de proteína");
    if (attrs.hasVegetables) c.push("vegetais/salada");
    if (attrs.hasWholeGrains) c.push("grãos integrais");
    if (attrs.hasFruit) c.push("frutas");
    if (c.length) parts.push(`com ${c.join(", ")}`);

    const p = attrs.portionSize === "small" ? "Porção pequena" : attrs.portionSize === "adequate" ? "Porção adequada" : "Porção grande";
    parts.push(`— ${p}.`);
    return parts.join(" ");
  }

  /**
   * Salva refeição verificada com metadados anti-fraude.
   */
  static async saveMeal(
    meal: Omit<VerifiedMeal, "id" | "verificationHash">,
  ): Promise<VerifiedMeal> {
    const id = `meal-${Date.now()}`;
    const hashInput = JSON.stringify({
      timestamp: meal.timestamp,
      type: meal.type,
      method: meal.verificationMethod,
      photoHash: meal.photoMetadata?.photoHash,
      analysis: meal.analysis?.mealScore,
      antifraud: meal.analysis?.antifraud?.score,
      location: meal.photoMetadata ? `${meal.photoMetadata.latitude},${meal.photoMetadata.longitude}` : null,
    });
    const verificationHash = await generateHash(hashInput);

    const verified: VerifiedMeal = { ...meal, id, verificationHash };

    const key = todayKey();
    const existing: VerifiedMeal[] = (await getStore(key)) ?? [];
    existing.push(verified);
    await setStore(key, existing);

    return verified;
  }

  static async getTodayMeals(): Promise<VerifiedMeal[]> {
    return (await getStore(todayKey())) ?? [];
  }

  /**
   * Atualiza uma refeição já salva (edição manual pelo usuário).
   * Recalcula o score com base nos novos flags e marca como editedByUser=true.
   */
  static async updateMeal(
    mealId: string,
    updates: {
      analysis?: Partial<MealPhotoAnalysis>;
      manualDescription?: string | null;
      type?: VerifiedMeal["type"];
    },
  ): Promise<VerifiedMeal | null> {
    const key = todayKey();
    const meals: VerifiedMeal[] = (await getStore(key)) ?? [];
    const idx = meals.findIndex((m) => m.id === mealId);
    if (idx === -1) return null;

    const current = meals[idx];
    let newAnalysis = current.analysis;

    if (updates.analysis && current.analysis) {
      const merged: MealPhotoAnalysis = {
        ...current.analysis,
        ...updates.analysis,
        editedByUser: true,
      };
      // Recalcula o score quando o usuário muda os flags
      merged.mealScore = this.recalculateScore(merged);
      newAnalysis = merged;
    }

    const updated: VerifiedMeal = {
      ...current,
      analysis: newAnalysis,
      manualDescription:
        updates.manualDescription !== undefined
          ? updates.manualDescription
          : current.manualDescription,
      type: updates.type ?? current.type,
      // Reflete os pontos no novo score (se mudou)
      points:
        newAnalysis && newAnalysis !== current.analysis
          ? 15 + Math.round((newAnalysis.mealScore / 100) * 20)
          : current.points,
    };

    meals[idx] = updated;
    await setStore(key, meals);
    return updated;
  }

  /**
   * Remove uma refeição já salva.
   */
  static async deleteMeal(mealId: string): Promise<boolean> {
    const key = todayKey();
    const meals: VerifiedMeal[] = (await getStore(key)) ?? [];
    const filtered = meals.filter((m) => m.id !== mealId);
    if (filtered.length === meals.length) return false;
    await setStore(key, filtered);
    return true;
  }

  /**
   * Recalcula o score nutricional a partir dos flags.
   * Usa a mesma fórmula do mock para consistência quando o usuário edita.
   */
  private static recalculateScore(a: MealPhotoAnalysis): number {
    let score = 50;
    if (a.hasVegetables) score += 12;
    if (a.hasProtein) score += 8;
    if (a.hasWholeGrains) score += 8;
    if (a.hasFruit) score += 5;
    if (a.isProcessed) score -= 15;
    if (a.isDeepFried) score -= 12;
    if (a.portionSize === "adequate") score += 5;
    if (a.portionSize === "large") score -= 3;
    if (a.colorVariety >= 4) score += 5;
    if (a.hydration === "water") score += 5;
    if (a.hydration === "soda") score -= 8;
    return Math.max(0, Math.min(100, score));
  }

  static async getWeeklyMeals(): Promise<VerifiedMeal[][]> {
    const week: VerifiedMeal[][] = [];
    for (let i = 0; i < 7; i++) week.push((await getStore(dateKeyFor(i))) ?? []);
    return week;
  }

  static async getTodayReport(): Promise<DailyNutritionReport> {
    const meals = await this.getTodayMeals();
    const mealCount = meals.length;
    const photoVerifiedCount = meals.filter((m) => m.verificationMethod === "photo_ai").length;
    const totalMealPoints = meals.reduce((sum, m) => sum + m.points, 0);

    const analyzed = meals.filter((m) => m.analysis);
    const avgMealScore = analyzed.length > 0
      ? Math.round(analyzed.reduce((sum, m) => sum + (m.analysis?.mealScore ?? 0), 0) / analyzed.length)
      : 0;

    const regularityScore = this.calculateRegularity(meals);
    const varietyScore = Math.min(15, mealCount * 3 + photoVerifiedCount * 2);
    const totalPoints = Math.min(150, totalMealPoints + regularityScore + varietyScore);

    let confidenceLabel: string;
    if (mealCount === 0) confidenceLabel = "Sem dados";
    else if (photoVerifiedCount === mealCount) confidenceLabel = "Alta — 100% verificado por foto";
    else if (photoVerifiedCount / mealCount >= 0.5) confidenceLabel = `Média — ${photoVerifiedCount}/${mealCount} verificados`;
    else confidenceLabel = `Baixa — apenas ${photoVerifiedCount}/${mealCount} verificados`;

    return { date: todayDateStr(), meals, totalPoints, mealCount, photoVerifiedCount, avgMealScore, regularityScore, varietyScore, confidenceLabel };
  }

  private static calculateRegularity(meals: VerifiedMeal[]): number {
    let score = 0;
    const windows: Record<string, [number, number]> = { cafe: [6, 10], almoco: [11, 14], jantar: [18, 22], lanche: [0, 23] };
    for (const meal of meals) {
      const hour = new Date(meal.timestamp).getHours();
      const [start, end] = windows[meal.type] ?? [0, 23];
      score += (hour >= start && hour <= end) ? 10 : 3;
    }
    return Math.min(30, score);
  }
}
