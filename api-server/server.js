const express = require("express");
const cors = require("cors");
const Anthropic = require("@anthropic-ai/sdk").default;
const OpenAI = require("openai").default;

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const anthropic = new Anthropic(); // usa ANTHROPIC_API_KEY
const openai = new OpenAI(); // usa OPENAI_API_KEY

// Token secreto que o APK envia no header x-saluflow-token
// (não é segurança forte — APK pode ser decompilado — mas evita uso casual)
const APP_TOKEN = process.env.SALUFLOW_APP_TOKEN || "";

function checkToken(req, res, next) {
  if (!APP_TOKEN) return next(); // sem token setado, liberado (dev)
  const token = req.headers["x-saluflow-token"];
  if (token !== APP_TOKEN) {
    return res.status(401).json({ error: "Token inválido" });
  }
  next();
}

// Rate limit simples em memória (por IP)
const rateLimitMap = new Map();
function rateLimit(req, res, next) {
  const ip = req.headers["x-forwarded-for"] || req.ip || "unknown";
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxReq = 20;
  const entry = rateLimitMap.get(ip) || { count: 0, resetAt: now + windowMs };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + windowMs;
  }
  entry.count += 1;
  rateLimitMap.set(ip, entry);
  if (entry.count > maxReq) {
    return res
      .status(429)
      .json({ error: "Rate limit: máximo 20 requisições/minuto" });
  }
  next();
}

// ─────────────────────────────────────────────────────────────
// Prompt rigoroso (o mesmo de lib/ai/meal-ai.ts)
// ─────────────────────────────────────────────────────────────
const MEAL_PROMPT = `Você é uma nutricionista analisando uma foto de refeição. Responda APENAS com JSON válido, sem markdown, sem explicações, sem texto antes ou depois.

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
  "mealScore": inteiro de 0 a 100
}

Regras RIGOROSAS:
- isFood: true APENAS se houver comida real visível em prato/tigela/marmita.
- isScreenPhoto: true se houver indícios de foto de tela, impresso ou outra foto (moiré, pixels, borda de papel, reflexo).
- hasVegetables: APENAS se houver verduras, legumes ou saladas VISÍVEIS. Molho branco NÃO é vegetal. Tomate em molho pronto NÃO conta.
- hasProtein: carne, peixe, frango, ovo, tofu, feijão/leguminosa visível. Queijo em molho cremoso NÃO é suficiente.
- hasWholeGrains: arroz integral, pão integral, quinoa, aveia. Macarrão branco NÃO conta. Arroz branco NÃO conta.
- hasFruit: somente fruta fresca VISÍVEL.
- isProcessed: alimentos ultraprocessados (salsicha, nugget, miojo, molho industrializado cremoso pronto).
- isDeepFried: fritura visível por imersão.
- portionSize: small/adequate/large em relação ao recipiente.
- colorVariety: 1 (cor única) a 5 (muitas cores).
- mealScore:
  * Só carboidrato refinado (macarrão ao molho branco, arroz branco com frango empanado): 30-45
  * Refeição balanceada com proteína + vegetal + carbo: 65-80
  * Prato completo com proteína + vegetal + integral + variedade: 80-95
  * Ultraprocessado dominante: 15-35

IMPORTANTE: Se a foto mostrar APENAS macarrão/massa com molho cremoso, responda hasVegetables=false, hasProtein=false, hasWholeGrains=false, hasFruit=false, isProcessed=true, mealScore entre 30 e 45. NÃO invente ingredientes que não estão visíveis.

Responda SOMENTE o JSON.`;

const SCALE_PROMPT = `Leia o número exibido no display desta balança. Responda APENAS com JSON válido:

{
  "weightKg": número lido (ex: 75.2),
  "confidence": 0-100 (quão legível é o display),
  "isScale": true/false (é realmente uma foto de balança?),
  "isScreenPhoto": true/false (é foto de tela/impressão?),
  "flags": ["lista de problemas, se houver"]
}

Se não conseguir ler o número, retorne weightKg: 0 e confidence: 0.
Se não for uma balança, retorne isScale: false.
Se parecer foto de tela, retorne isScreenPhoto: true.`;

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function extractJson(text) {
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

async function callClaude(base64, mediaType, prompt, model) {
  const response = await anthropic.messages.create({
    model: model || "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data: base64 },
          },
          { type: "text", text: prompt },
        ],
      },
    ],
  });
  const text = response.content[0].type === "text" ? response.content[0].text : "";
  return extractJson(text);
}

async function callOpenAi(base64, mediaType, prompt, model) {
  const dataUrl = `data:${mediaType};base64,${base64}`;
  const response = await openai.chat.completions.create({
    model: model || "gpt-4o-mini",
    max_tokens: 1024,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: dataUrl } },
        ],
      },
    ],
  });
  const text = response.choices[0]?.message?.content || "";
  return extractJson(text);
}

function parseImage(image) {
  if (!image) return null;
  const base64 = image.replace(/^data:image\/\w+;base64,/, "");
  const mediaType = image.match(/^data:(image\/\w+);/)?.[1] || "image/jpeg";
  return { base64, mediaType };
}

// ─────────────────────────────────────────────────────────────
// POST /analyze-meal
// Body: { image: "data:image/jpeg;base64,...", provider?: "claude"|"openai", model?: string }
// ─────────────────────────────────────────────────────────────
app.post("/analyze-meal", rateLimit, checkToken, async (req, res) => {
  try {
    const { image, provider = "openai", model } = req.body;
    const parsed = parseImage(image);
    if (!parsed) {
      return res.status(400).json({ error: "Campo 'image' obrigatório" });
    }

    let analysis;
    if (provider === "claude") {
      analysis = await callClaude(parsed.base64, parsed.mediaType, MEAL_PROMPT, model);
    } else {
      analysis = await callOpenAi(parsed.base64, parsed.mediaType, MEAL_PROMPT, model);
    }

    if (!analysis) {
      return res.status(502).json({ error: "IA não retornou JSON válido" });
    }
    res.json(analysis);
  } catch (err) {
    console.error("analyze-meal error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /read-scale
// ─────────────────────────────────────────────────────────────
app.post("/read-scale", rateLimit, checkToken, async (req, res) => {
  try {
    const { image, provider = "openai", model } = req.body;
    const parsed = parseImage(image);
    if (!parsed) {
      return res.status(400).json({ error: "Campo 'image' obrigatório" });
    }

    let reading;
    if (provider === "claude") {
      reading = await callClaude(parsed.base64, parsed.mediaType, SCALE_PROMPT, model);
    } else {
      reading = await callOpenAi(parsed.base64, parsed.mediaType, SCALE_PROMPT, model);
    }

    if (!reading) {
      return res.status(502).json({ error: "IA não retornou JSON válido" });
    }
    res.json(reading);
  } catch (err) {
    console.error("read-scale error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// Health check
// ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "SaluFlow API",
    endpoints: ["/analyze-meal", "/read-scale"],
    providers: ["claude", "openai"],
    defaultProvider: "openai",
    defaultModel: "gpt-4o-mini",
  });
});

const PORT = process.env.PORT || 3333;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`SaluFlow API rodando em http://localhost:${PORT}`);
  });
}

module.exports = app;
