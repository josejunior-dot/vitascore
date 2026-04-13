/**
 * Análise de refeições com IA (Claude ou OpenAI).
 *
 * Chamadas diretas às APIs via CapacitorHttp (fura CORS no mobile).
 * No browser o fetch normal cairá em CORS — só funciona de verdade no APK.
 *
 * A chave de API fica salva apenas localmente (Capacitor Preferences),
 * nunca é enviada a nenhum servidor exceto o provider escolhido.
 */

export type AiProvider = "server" | "claude" | "openai" | "none";

// URL do servidor SaluFlow hospedado no Vercel
export const SALUFLOW_SERVER_URL = "https://saluflow-api.vercel.app";
// Token público (o APK conhece — não é segredo forte)
export const SALUFLOW_APP_TOKEN = "sf_0191765e5531c1a52451df8fcb3b5f47";

export const SERVER_MODELS: AiModelOption[] = [
  {
    id: "server:openai:gpt-4o-mini",
    label: "Servidor · GPT-4o mini",
    hint: "Padrão do SaluFlow. Nenhuma configuração necessária.",
    costHint: "grátis (embutido)",
  },
  {
    id: "server:openai:gpt-4o",
    label: "Servidor · GPT-4o",
    hint: "Mais preciso, roda no mesmo servidor SaluFlow.",
    costHint: "grátis (embutido)",
  },
  {
    id: "server:claude:claude-haiku-4-5-20251001",
    label: "Servidor · Claude Haiku 4.5",
    hint: "Alternativa Claude, roda no servidor SaluFlow.",
    costHint: "grátis (embutido)",
  },
  {
    id: "server:claude:claude-sonnet-4-5-20250929",
    label: "Servidor · Claude Sonnet 4.5",
    hint: "Máxima qualidade Claude via servidor SaluFlow.",
    costHint: "grátis (embutido)",
  },
];

export interface AiModelOption {
  id: string;
  label: string;
  hint: string;
  costHint: string;
}

export const CLAUDE_MODELS: AiModelOption[] = [
  {
    id: "claude-haiku-4-5-20251001",
    label: "Claude Haiku 4.5",
    hint: "Rápido e barato. Ótimo para análise de refeição simples.",
    costHint: "~R$0,01 por foto",
  },
  {
    id: "claude-sonnet-4-5-20250929",
    label: "Claude Sonnet 4.5",
    hint: "Melhor qualidade da Anthropic. Detecta nuances.",
    costHint: "~R$0,06 por foto",
  },
  {
    id: "claude-3-5-haiku-20241022",
    label: "Claude 3.5 Haiku (legado)",
    hint: "Modelo anterior, ainda funciona bem.",
    costHint: "~R$0,005 por foto",
  },
  {
    id: "claude-3-5-sonnet-20241022",
    label: "Claude 3.5 Sonnet (legado)",
    hint: "Geração anterior, ótima qualidade visual.",
    costHint: "~R$0,05 por foto",
  },
];

export const OPENAI_MODELS: AiModelOption[] = [
  {
    id: "gpt-4o-mini",
    label: "GPT-4o mini",
    hint: "Mais barato. Boa identificação de comida.",
    costHint: "~R$0,005 por foto",
  },
  {
    id: "gpt-4o",
    label: "GPT-4o",
    hint: "Padrão ouro da OpenAI. Mais preciso em pratos complexos.",
    costHint: "~R$0,04 por foto",
  },
  {
    id: "gpt-4.1-mini",
    label: "GPT-4.1 mini",
    hint: "Versão mais recente da linha mini.",
    costHint: "~R$0,008 por foto",
  },
  {
    id: "gpt-4.1",
    label: "GPT-4.1",
    hint: "Mais caro, melhor raciocínio. Uso pontual.",
    costHint: "~R$0,05 por foto",
  },
];

export interface AiConfig {
  provider: AiProvider;
  model: string;
  apiKey: string;
}

const STORE_KEY = "saluflow-ai-config";

export const DEFAULT_CONFIG: AiConfig = {
  provider: "server",
  model: "server:openai:gpt-4o-mini",
  apiKey: "",
};

/* ─────────────────────────────────────────────────────────────────────── */
/*  Persistência                                                            */
/* ─────────────────────────────────────────────────────────────────────── */

export async function getAiConfig(): Promise<AiConfig> {
  try {
    const { Preferences } = await import("@capacitor/preferences");
    const { value } = await Preferences.get({ key: STORE_KEY });
    if (value) return { ...DEFAULT_CONFIG, ...JSON.parse(value) };
  } catch {
    try {
      const value = localStorage.getItem(STORE_KEY);
      if (value) return { ...DEFAULT_CONFIG, ...JSON.parse(value) };
    } catch {}
  }
  return DEFAULT_CONFIG;
}

export async function setAiConfig(config: AiConfig): Promise<void> {
  const json = JSON.stringify(config);
  try {
    const { Preferences } = await import("@capacitor/preferences");
    await Preferences.set({ key: STORE_KEY, value: json });
  } catch {
    try {
      localStorage.setItem(STORE_KEY, json);
    } catch {}
  }
}

export async function clearAiConfig(): Promise<void> {
  try {
    const { Preferences } = await import("@capacitor/preferences");
    await Preferences.remove({ key: STORE_KEY });
  } catch {
    try {
      localStorage.removeItem(STORE_KEY);
    } catch {}
  }
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  Prompt                                                                  */
/* ─────────────────────────────────────────────────────────────────────── */

export const MEAL_PROMPT = `Você é uma nutricionista analisando uma foto de refeição. Responda APENAS com JSON válido, sem markdown, sem explicações, sem texto antes ou depois.

Schema obrigatório:
{
  "isFood": boolean,
  "isScreenPhoto": boolean,
  "confidence": number entre 0 e 1,
  "hasVegetables": boolean,
  "hasProtein": boolean,
  "hasWholeGrains": boolean,
  "hasFruit": boolean,
  "isProcessed": boolean,
  "isDeepFried": boolean,
  "portionSize": "small" | "adequate" | "large",
  "colorVariety": inteiro de 1 a 5,
  "hydration": "water" | "juice" | "soda" | "none" | "unknown",
  "description": "frase curta em português descrevendo objetivamente o que vê",
  "mealScore": inteiro de 0 a 100,
  "caloricDensity": "green" | "yellow" | "orange",
  "estimatedCalories": inteiro (aproximado, em kcal)
}

Regras RIGOROSAS:
- isFood: true APENAS se houver comida real visível em prato/tigela/marmita.
- isScreenPhoto: true se houver indícios de foto de tela, impresso ou outra foto (moiré, pixels, borda de papel, reflexo).
- hasVegetables: APENAS se houver verduras, legumes ou saladas VISÍVEIS. Molho branco NÃO é vegetal. Tomate em molho pronto NÃO conta. Seja rigoroso.
- hasProtein: carne, peixe, frango, ovo, tofu, feijão/leguminosa visível. Queijo em molho cremoso NÃO é suficiente.
- hasWholeGrains: arroz integral, pão integral, quinoa, aveia. Macarrão branco NÃO conta. Arroz branco NÃO conta. Pão branco NÃO conta.
- hasFruit: somente fruta fresca VISÍVEL.
- isProcessed: alimentos ultraprocessados (salsicha, nugget, miojo, molho industrializado cremoso pronto).
- isDeepFried: fritura visível por imersão.
- portionSize: small/adequate/large em relação ao recipiente.
- colorVariety: 1 (cor única) a 5 (muitas cores).
- mealScore:
  * Só carboidrato refinado (ex: macarrão ao molho branco, arroz branco com frango empanado): 30-45
  * Refeição balanceada com proteína + vegetal + carbo: 65-80
  * Prato completo com proteína + vegetal + integral + variedade: 80-95
  * Ultraprocessado dominante: 15-35

Sistema Noom Color (caloricDensity):
- "green" = baixa densidade (< 1 kcal/g): frutas, vegetais, sopas, iogurte natural, saladas
- "yellow" = média densidade (1-2.4 kcal/g): arroz, feijão, carnes magras, pão integral, macarrão
- "orange" = alta densidade (> 2.4 kcal/g): castanhas, queijos, chocolate, frituras, doces, molhos cremosos

estimatedCalories:
- Estime as calorias totais do prato em kcal
- AVISO: esta estimativa é aproximada (±30% de erro), baseada apenas na foto
- Prato pequeno: 200-400 kcal, médio: 400-700 kcal, grande: 700-1200 kcal

IMPORTANTE: Se a foto mostrar APENAS macarrão/massa com molho cremoso, responda hasVegetables=false, hasProtein=false (queijo derretido não é fonte principal), hasWholeGrains=false, hasFruit=false, isProcessed=true (se molho pronto), mealScore entre 30 e 45, caloricDensity="orange" (molho cremoso é denso), estimatedCalories entre 500 e 800. NÃO invente ingredientes que não estão visíveis.

Responda SOMENTE o JSON.`;

/* ─────────────────────────────────────────────────────────────────────── */
/*  Resultado comum                                                         */
/* ─────────────────────────────────────────────────────────────────────── */

export interface AiMealResult {
  isFood: boolean;
  isScreenPhoto: boolean;
  confidence: number;
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
  mealScore: number;
  caloricDensity: "green" | "yellow" | "orange" | "unknown";
  estimatedCalories: number;
}

function parseJsonLoose(raw: string): AiMealResult | null {
  try {
    // Às vezes o modelo enrola em ```json ... ```
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/i, "")
      .trim();
    // Tenta extrair o primeiro bloco {...}
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) return null;
    const obj = JSON.parse(match[0]);
    // Normaliza campos
    return {
      isFood: !!obj.isFood,
      isScreenPhoto: !!obj.isScreenPhoto,
      confidence: typeof obj.confidence === "number" ? obj.confidence : 0.8,
      hasVegetables: !!obj.hasVegetables,
      hasProtein: !!obj.hasProtein,
      hasWholeGrains: !!obj.hasWholeGrains,
      hasFruit: !!obj.hasFruit,
      isProcessed: !!obj.isProcessed,
      isDeepFried: !!obj.isDeepFried,
      portionSize: ["small", "adequate", "large"].includes(obj.portionSize)
        ? obj.portionSize
        : "adequate",
      colorVariety:
        typeof obj.colorVariety === "number"
          ? Math.max(1, Math.min(5, Math.round(obj.colorVariety)))
          : 3,
      hydration: ["water", "juice", "soda", "none", "unknown"].includes(
        obj.hydration,
      )
        ? obj.hydration
        : "unknown",
      description: typeof obj.description === "string" ? obj.description : "",
      mealScore:
        typeof obj.mealScore === "number"
          ? Math.max(0, Math.min(100, Math.round(obj.mealScore)))
          : 50,
      caloricDensity: ["green", "yellow", "orange"].includes(obj.caloricDensity)
        ? obj.caloricDensity
        : "unknown",
      estimatedCalories:
        typeof obj.estimatedCalories === "number"
          ? Math.max(0, Math.min(3000, Math.round(obj.estimatedCalories)))
          : 0,
    };
  } catch {
    return null;
  }
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  HTTP: CapacitorHttp no mobile, fetch no web                             */
/* ─────────────────────────────────────────────────────────────────────── */

async function httpPost(
  url: string,
  headers: Record<string, string>,
  body: unknown,
): Promise<{ ok: boolean; status: number; data: any }> {
  try {
    const { CapacitorHttp, Capacitor } = await import("@capacitor/core");
    if (Capacitor.isNativePlatform && Capacitor.isNativePlatform()) {
      const res = await CapacitorHttp.post({
        url,
        headers: { "Content-Type": "application/json", ...headers },
        data: body,
      });
      return { ok: res.status >= 200 && res.status < 300, status: res.status, data: res.data };
    }
  } catch {
    // Fallback para fetch
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  let data: any = null;
  try {
    data = await res.json();
  } catch {}
  return { ok: res.ok, status: res.status, data };
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  Claude                                                                  */
/* ─────────────────────────────────────────────────────────────────────── */

async function analyzeWithClaude(
  base64: string,
  apiKey: string,
  model: string,
): Promise<AiMealResult | null> {
  const cleanBase64 = base64.replace(/^data:image\/\w+;base64,/, "");
  const body = {
    model,
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/jpeg",
              data: cleanBase64,
            },
          },
          { type: "text", text: MEAL_PROMPT },
        ],
      },
    ],
  };

  const res = await httpPost(
    "https://api.anthropic.com/v1/messages",
    {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body,
  );

  if (!res.ok) {
    console.error("Claude API error", res.status, res.data);
    return null;
  }

  const text = res.data?.content?.[0]?.text;
  if (typeof text !== "string") return null;
  return parseJsonLoose(text);
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  OpenAI                                                                  */
/* ─────────────────────────────────────────────────────────────────────── */

async function analyzeWithOpenAi(
  base64: string,
  apiKey: string,
  model: string,
): Promise<AiMealResult | null> {
  const dataUrl = base64.startsWith("data:")
    ? base64
    : `data:image/jpeg;base64,${base64}`;

  const body = {
    model,
    max_tokens: 1024,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: MEAL_PROMPT },
          { type: "image_url", image_url: { url: dataUrl } },
        ],
      },
    ],
  };

  const res = await httpPost(
    "https://api.openai.com/v1/chat/completions",
    { Authorization: `Bearer ${apiKey}` },
    body,
  );

  if (!res.ok) {
    console.error("OpenAI API error", res.status, res.data);
    return null;
  }

  const text = res.data?.choices?.[0]?.message?.content;
  if (typeof text !== "string") return null;
  return parseJsonLoose(text);
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  Servidor SaluFlow                                                       */
/* ─────────────────────────────────────────────────────────────────────── */

async function analyzeWithServer(
  base64: string,
  modelId: string,
): Promise<AiMealResult | null> {
  // modelId vem no formato "server:<provider>:<model>"
  const parts = modelId.split(":");
  const serverProvider = parts[1] || "openai";
  const serverModel = parts[2] || "gpt-4o-mini";

  const dataUrl = base64.startsWith("data:")
    ? base64
    : `data:image/jpeg;base64,${base64}`;

  const res = await httpPost(
    `${SALUFLOW_SERVER_URL}/analyze-meal`,
    { "x-saluflow-token": SALUFLOW_APP_TOKEN },
    { image: dataUrl, provider: serverProvider, model: serverModel },
  );

  if (!res.ok) {
    console.error("SaluFlow server error", res.status, res.data);
    return null;
  }

  const data = res.data;
  if (!data || typeof data !== "object") return null;
  // Normaliza igual parseJsonLoose
  return {
    isFood: !!data.isFood,
    isScreenPhoto: !!data.isScreenPhoto,
    confidence: typeof data.confidence === "number" ? data.confidence : 0.8,
    hasVegetables: !!data.hasVegetables,
    hasProtein: !!data.hasProtein,
    hasWholeGrains: !!data.hasWholeGrains,
    hasFruit: !!data.hasFruit,
    isProcessed: !!data.isProcessed,
    isDeepFried: !!data.isDeepFried,
    portionSize: ["small", "adequate", "large"].includes(data.portionSize)
      ? data.portionSize
      : "adequate",
    colorVariety:
      typeof data.colorVariety === "number"
        ? Math.max(1, Math.min(5, Math.round(data.colorVariety)))
        : 3,
    hydration: ["water", "juice", "soda", "none", "unknown"].includes(
      data.hydration,
    )
      ? data.hydration
      : "unknown",
    description: typeof data.description === "string" ? data.description : "",
    mealScore:
      typeof data.mealScore === "number"
        ? Math.max(0, Math.min(100, Math.round(data.mealScore)))
        : 50,
    caloricDensity: ["green", "yellow", "orange"].includes(data.caloricDensity)
      ? data.caloricDensity
      : "unknown",
    estimatedCalories:
      typeof data.estimatedCalories === "number"
        ? Math.max(0, Math.min(3000, Math.round(data.estimatedCalories)))
        : 0,
  };
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  Entry point                                                             */
/* ─────────────────────────────────────────────────────────────────────── */

export async function analyzeMealImage(
  base64: string,
): Promise<AiMealResult | null> {
  const config = await getAiConfig();
  if (config.provider === "none" || !config.model) {
    return null;
  }

  try {
    if (config.provider === "server") {
      return await analyzeWithServer(base64, config.model);
    }
    if (!config.apiKey) return null;
    if (config.provider === "claude") {
      return await analyzeWithClaude(base64, config.apiKey, config.model);
    }
    if (config.provider === "openai") {
      return await analyzeWithOpenAi(base64, config.apiKey, config.model);
    }
  } catch (err) {
    console.error("AI analysis failed", err);
    return null;
  }
  return null;
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  Teste de conexão (mandar imagem 1x1 mínima)                             */
/* ─────────────────────────────────────────────────────────────────────── */

// JPEG 1x1 branco (válido para a API aceitar)
const TINY_JPEG_BASE64 =
  "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+/iiiigD/2Q==";

export async function testConnection(
  config: AiConfig,
): Promise<{ ok: boolean; message: string }> {
  if (config.provider === "none") {
    return { ok: false, message: "Nenhum provider selecionado" };
  }
  if (!config.model) {
    return { ok: false, message: "Modelo não selecionado" };
  }
  if (config.provider !== "server" && !config.apiKey) {
    return { ok: false, message: "API key vazia" };
  }

  try {
    let result: AiMealResult | null = null;
    if (config.provider === "server") {
      result = await analyzeWithServer(TINY_JPEG_BASE64, config.model);
    } else if (config.provider === "claude") {
      result = await analyzeWithClaude(TINY_JPEG_BASE64, config.apiKey, config.model);
    } else if (config.provider === "openai") {
      result = await analyzeWithOpenAi(TINY_JPEG_BASE64, config.apiKey, config.model);
    }
    if (result) {
      return { ok: true, message: "Conexão OK — IA respondeu" };
    }
    return {
      ok: false,
      message: "API respondeu mas formato inesperado. Verifique o modelo.",
    };
  } catch (err) {
    return {
      ok: false,
      message: `Falha: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}
