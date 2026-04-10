const express = require("express");
const cors = require("cors");
const Anthropic = require("@anthropic-ai/sdk").default;

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const anthropic = new Anthropic();
// Usa ANTHROPIC_API_KEY do ambiente automaticamente

// ─────────────────────────────────────────────────────────────
// POST /analyze-meal
// Body: { image: "data:image/jpeg;base64,..." }
// Returns: MealPhotoAnalysis
// ─────────────────────────────────────────────────────────────
app.post("/analyze-meal", async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: "Campo 'image' obrigatório" });

    // Extrair base64 puro (remover prefixo data:image/...)
    const base64 = image.replace(/^data:image\/\w+;base64,/, "");
    const mediaType = image.match(/^data:(image\/\w+);/)?.[1] || "image/jpeg";

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: base64 },
            },
            {
              type: "text",
              text: `Analise esta foto de refeição. Responda APENAS com um JSON válido, sem markdown, sem explicação.

PRIMEIRO: Verifique se é uma foto REAL de comida em um prato/mesa, ou se é uma foto de tela, imagem impressa ou outra fotografia. Procure por:
- Padrões de moiré (grade de pixels)
- Reflexos de tela
- Bordas de papel ou dispositivo
- Qualidade inconsistente

SEGUNDO: Se for comida real, analise a composição nutricional.

Formato exato do JSON:
{
  "isFood": true/false,
  "isScreenPhoto": true/false,
  "hasVegetables": true/false,
  "hasProtein": true/false,
  "hasWholeGrains": true/false,
  "hasFruit": true/false,
  "isProcessed": true/false,
  "isDeepFried": true/false,
  "portionSize": "small" | "adequate" | "large",
  "colorVariety": 1-5,
  "hydration": "water" | "juice" | "soda" | "none" | "unknown",
  "description": "descrição curta da refeição em português",
  "mealScore": 0-100,
  "confidence": 0-100
}

Regras do mealScore:
- Vegetais: +15
- Proteína magra: +12
- Grãos integrais: +10
- Fruta: +8
- Porção adequada: +10
- Variedade de cores (4+): +8
- Água: +7
- Ultra-processado: -20
- Fritura: -15
- Refrigerante: -10
- Base: 30 pontos

Se não for comida, retorne mealScore: 0 e isFood: false.
Se for foto de tela/impressão, retorne isScreenPhoto: true e confidence: 10.`,
            },
          ],
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";

    // Extrair JSON da resposta (caso venha com markdown)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ error: "Resposta da IA não contém JSON válido" });
    }

    const analysis = JSON.parse(jsonMatch[0]);
    res.json(analysis);
  } catch (err) {
    console.error("Erro na análise:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /read-scale
// Body: { image: "data:image/jpeg;base64,..." }
// Returns: { weightKg: number, confidence: number, flags: [] }
// ─────────────────────────────────────────────────────────────
app.post("/read-scale", async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: "Campo 'image' obrigatório" });

    const base64 = image.replace(/^data:image\/\w+;base64,/, "");
    const mediaType = image.match(/^data:(image\/\w+);/)?.[1] || "image/jpeg";

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: base64 },
            },
            {
              type: "text",
              text: `Leia o número exibido no display desta balança. Responda APENAS com JSON válido:

{
  "weightKg": número lido (ex: 75.2),
  "confidence": 0-100 (quão legível é o display),
  "isScale": true/false (é realmente uma foto de balança?),
  "isScreenPhoto": true/false (é foto de tela/impressão?),
  "flags": ["lista de problemas, se houver"]
}

Se não conseguir ler o número, retorne weightKg: 0 e confidence: 0.
Se não for uma balança, retorne isScale: false.
Se parecer foto de tela, retorne isScreenPhoto: true.`,
            },
          ],
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ error: "Resposta da IA não contém JSON válido" });
    }

    const reading = JSON.parse(jsonMatch[0]);
    res.json(reading);
  } catch (err) {
    console.error("Erro na leitura:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// Health check
// ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "VitaScore API", endpoints: ["/analyze-meal", "/read-scale"] });
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`VitaScore API rodando em http://localhost:${PORT}`);
});
