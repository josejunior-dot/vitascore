# 04 — Referência da API (servidor Vercel)

> Documentação técnica do único servidor HTTP do SaluFlow: um proxy stateless que encaminha imagens para Claude (Anthropic) ou OpenAI e devolve JSON estruturado.

## Sumário

- [Visão geral](#visão-geral)
- [Base URL](#base-url)
- [Autenticação](#autenticação)
- [Rate limit](#rate-limit)
- [Providers e modelos suportados](#providers-e-modelos-suportados)
- [Endpoints](#endpoints)
  - [`GET /` — health check](#get--health-check)
  - [`POST /analyze-meal`](#post-analyze-meal)
  - [`POST /read-scale`](#post-read-scale)
- [Códigos de erro](#códigos-de-erro)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Como o app mobile chama a API](#como-o-app-mobile-chama-a-api)
- [Limitações e débitos conhecidos](#limitações-e-débitos-conhecidos)

---

## Visão geral

O servidor `api-server/` é um **Express minimalista** deployado no Vercel. Ele existe por um único motivo: **esconder as API keys reais da Anthropic e da OpenAI**, que não podem viver num APK distribuído (APK é decompilável).

Características centrais:

- **Stateless.** Nenhuma requisição é persistida. Nada vai para log agregável, nada vai para banco (não existe banco).
- **Proxy puro.** Recebe `image` (base64 ou data URL), encaminha para o provider escolhido e devolve o JSON parseado.
- **Dois endpoints de negócio**: `/analyze-meal` (análise nutricional de foto de prato) e `/read-scale` (OCR do display de uma balança).
- **Prompt embarcado no servidor.** O prompt nutricional idêntico ao `lib/ai/meal-ai.ts` vive no `api-server/server.js`, assim o APK não precisa enviar texto — só a foto.
- **Token fraco por header.** `x-saluflow-token` é um segredo hardcoded no APK. Não é proteção real (decompilável), mas **barra uso casual** e dá um ponto de rotação caso chaves vazem.
- **Rate limit em memória por IP** (20 req/min). Suficiente para uso pessoal, mas reseta a cada cold start no Vercel.

## Base URL

```
https://saluflow-api.vercel.app
```

Definido em `lib/ai/meal-ai.ts`:

```ts
export const SALUFLOW_SERVER_URL = "https://saluflow-api.vercel.app";
export const SALUFLOW_APP_TOKEN  = "sf_0191765e5531c1a52451df8fcb3b5f47";
```

Em desenvolvimento local, o servidor roda em `http://localhost:3333` (controlado por `PORT` no `.env`).

## Autenticação

Todos os endpoints `POST` exigem o header:

```
x-saluflow-token: sf_0191765e5531c1a52451df8fcb3b5f47
```

Regras:

- O valor precisa ser **idêntico** ao `SALUFLOW_APP_TOKEN` configurado no ambiente do servidor.
- Se a variável **não** estiver setada no servidor (`SALUFLOW_APP_TOKEN=""`), o middleware libera todas as requisições — útil em dev local.
- Token inválido → `401 Unauthorized` com `{ "error": "Token inválido" }`.
- O endpoint `GET /` (health check) **não** exige o header.

> Este token é conhecido dentro do APK público. Sua função é **fricção para uso casual e ponto de rotação**, não confidencialidade. Se ele vazar amplamente, troca-se a variável no Vercel e publica-se novo build do app.

## Rate limit

- **20 requisições por minuto por IP.**
- Janela deslizante simples (in-memory map `ip → { count, resetAt }`).
- Extraído de `x-forwarded-for` (presente no Vercel) com fallback para `req.ip`.
- Quando estouta: `429 Too Many Requests` com `{ "error": "Rate limit: máximo 20 requisições/minuto" }`.
- **Cuidado**: o estado é perdido a cada cold start da função no Vercel — não serve como defesa contra abuso distribuído, apenas contra loops acidentais do cliente.

## Providers e modelos suportados

O servidor aceita dois providers no body da requisição:

| `provider` | SDK usado | Modelo padrão | Models conhecidos |
|---|---|---|---|
| `claude` | `@anthropic-ai/sdk` | `claude-haiku-4-5-20251001` | `claude-haiku-4-5-20251001`, `claude-sonnet-4-5-20250929`, `claude-3-5-haiku-20241022`, `claude-3-5-sonnet-20241022` |
| `openai` (padrão) | `openai` | `gpt-4o-mini` | `gpt-4o-mini`, `gpt-4o`, `gpt-4.1-mini`, `gpt-4.1` |

Regras:

- Se `provider` for omitido, o servidor usa `openai`.
- Se `model` for omitido, usa o padrão da tabela acima.
- Qualquer outro valor de `provider` cai no branch do OpenAI (não valida estritamente, mas com modelo inexistente a chamada externa falha → `500`).

## Endpoints

### `GET /` — health check

Retorna metadados do serviço. **Não exige autenticação.**

**Request:**

```bash
curl https://saluflow-api.vercel.app/
```

**Response 200:**

```json
{
  "status": "ok",
  "service": "SaluFlow API",
  "endpoints": ["/analyze-meal", "/read-scale"],
  "providers": ["claude", "openai"],
  "defaultProvider": "openai",
  "defaultModel": "gpt-4o-mini"
}
```

---

### `POST /analyze-meal`

Envia uma foto de refeição e recebe uma análise nutricional estruturada.

**Headers:**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `x-saluflow-token` | `sf_0191765e5531c1a52451df8fcb3b5f47` |

**Body:**

```json
{
  "image":    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAEB...",
  "provider": "openai",
  "model":    "gpt-4o-mini"
}
```

| Campo | Tipo | Obrigatório | Default | Descrição |
|---|---|---|---|---|
| `image` | string | sim | — | Data URL ou base64 puro. Aceita `data:image/jpeg;base64,...` ou apenas o base64. O servidor strippa o prefixo automaticamente. |
| `provider` | `"claude"` \| `"openai"` | não | `"openai"` | Qual provider chamar. |
| `model` | string | não | `gpt-4o-mini` / `claude-haiku-4-5-20251001` | Modelo específico dentro do provider. |

**Response 200:**

```json
{
  "isFood": true,
  "isScreenPhoto": false,
  "confidence": 0.92,
  "hasVegetables": true,
  "hasProtein": true,
  "hasWholeGrains": false,
  "hasFruit": false,
  "isProcessed": false,
  "isDeepFried": false,
  "portionSize": "adequate",
  "colorVariety": 4,
  "hydration": "water",
  "description": "Prato com arroz branco, feijão, frango grelhado e salada verde.",
  "mealScore": 72,
  "caloricDensity": "yellow",
  "estimatedCalories": 620
}
```

Campos da resposta:

| Campo | Tipo | Descrição |
|---|---|---|
| `isFood` | boolean | `true` se há comida real no prato. |
| `isScreenPhoto` | boolean | `true` se a IA detectou foto de tela/impressão (moiré, reflexo, borda). Usado pelo anti-fraude. |
| `confidence` | number (0–1) | Confiança da IA na análise. |
| `hasVegetables` / `hasProtein` / `hasWholeGrains` / `hasFruit` | boolean | Flags rigorosos de ingredientes visíveis. |
| `isProcessed` | boolean | Alimento ultraprocessado dominante. |
| `isDeepFried` | boolean | Fritura por imersão visível. |
| `portionSize` | `"small"` \| `"adequate"` \| `"large"` | Tamanho relativo ao recipiente. |
| `colorVariety` | int 1–5 | Variedade de cores no prato. |
| `hydration` | `"water"` \| `"juice"` \| `"soda"` \| `"none"` \| `"unknown"` | Bebida detectada. |
| `description` | string | Descrição curta em pt-BR do que a IA vê. |
| `mealScore` | int 0–100 | Score nutricional final (usado para gamificação). |
| `caloricDensity` | `"green"` \| `"yellow"` \| `"orange"` | Sistema Noom Color. |
| `estimatedCalories` | int | kcal aproximado (±30%). |

**Exemplo curl completo:**

```bash
curl -X POST https://saluflow-api.vercel.app/analyze-meal \
  -H "Content-Type: application/json" \
  -H "x-saluflow-token: sf_0191765e5531c1a52451df8fcb3b5f47" \
  -d '{
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "provider": "openai",
    "model": "gpt-4o-mini"
  }'
```

Usando Claude Haiku como provider:

```bash
curl -X POST https://saluflow-api.vercel.app/analyze-meal \
  -H "Content-Type: application/json" \
  -H "x-saluflow-token: sf_0191765e5531c1a52451df8fcb3b5f47" \
  -d '{
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "provider": "claude",
    "model": "claude-haiku-4-5-20251001"
  }'
```

---

### `POST /read-scale`

OCR do display de uma balança de banheiro. Mesmo padrão do `/analyze-meal`.

**Headers:** idênticos a `/analyze-meal`.

**Body:**

```json
{
  "image":    "data:image/jpeg;base64,/9j/...",
  "provider": "openai",
  "model":    "gpt-4o-mini"
}
```

**Response 200:**

```json
{
  "weightKg": 75.2,
  "confidence": 88,
  "isScale": true,
  "isScreenPhoto": false,
  "flags": []
}
```

| Campo | Tipo | Descrição |
|---|---|---|
| `weightKg` | number | Peso lido (ex.: `75.2`). `0` quando não foi possível ler. |
| `confidence` | int 0–100 | Quão legível está o display. |
| `isScale` | boolean | `true` se a foto é realmente uma balança. |
| `isScreenPhoto` | boolean | `true` se parece foto de tela/impressão. |
| `flags` | string[] | Lista de problemas detectados (ex.: `["display borrado", "reflexo"]`). |

**Exemplo curl:**

```bash
curl -X POST https://saluflow-api.vercel.app/read-scale \
  -H "Content-Type: application/json" \
  -H "x-saluflow-token: sf_0191765e5531c1a52451df8fcb3b5f47" \
  -d '{
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  }'
```

## Códigos de erro

| Código | Situação | Body |
|---|---|---|
| `400 Bad Request` | Campo `image` ausente ou vazio. | `{ "error": "Campo 'image' obrigatório" }` |
| `401 Unauthorized` | Header `x-saluflow-token` ausente ou diferente do configurado. | `{ "error": "Token inválido" }` |
| `429 Too Many Requests` | Mais de 20 requisições no mesmo minuto pelo mesmo IP. | `{ "error": "Rate limit: máximo 20 requisições/minuto" }` |
| `500 Internal Server Error` | Erro no SDK da Anthropic/OpenAI (chave inválida, modelo inexistente, timeout, quota). | `{ "error": "<mensagem original do provider>" }` |
| `502 Bad Gateway` | IA respondeu mas o texto não contém um JSON parseável (markdown estranho, truncamento). | `{ "error": "IA não retornou JSON válido" }` |

> O código **502** é especialmente útil para o cliente diferenciar "quota/credencial" de "IA alucinou". Em `lib/health/meal-analyzer.ts`, o fallback mock só dispara quando a API devolve `null`/erro — mantendo a UI viva mesmo em degradação.

## Variáveis de ambiente

Configure no painel do Vercel (`Project → Settings → Environment Variables`):

| Variável | Obrigatória | Descrição |
|---|---|---|
| `ANTHROPIC_API_KEY` | se usar `provider: "claude"` | Chave da Anthropic. Lida pelo SDK via `new Anthropic()`. |
| `OPENAI_API_KEY` | se usar `provider: "openai"` | Chave da OpenAI. Lida via `new OpenAI()`. |
| `SALUFLOW_APP_TOKEN` | recomendado | Token que o middleware compara contra `x-saluflow-token`. Vazio/ausente = libera geral (só para dev). |
| `PORT` | não | Porta local (default `3333`). No Vercel é ignorado. |

Nenhuma outra variável é lida pelo `server.js`. Não há `DATABASE_URL`, não há `REDIS_URL`, não há nada.

## Como o app mobile chama a API

O cliente vive em `lib/ai/meal-ai.ts`. Resumo do caminho feliz:

1. `analyzeMealImage(base64)` lê `saluflow-ai-config` do Capacitor Preferences.
2. Se o provider é `server`, chama `analyzeWithServer()`.
3. O `modelId` vem no formato `server:<provider>:<model>` (ex.: `server:openai:gpt-4o-mini`). A função fatia a string e monta o body.
4. A requisição usa `CapacitorHttp.post` no Android/iOS (contorna CORS) e cai em `fetch` no web.
5. Headers: `Content-Type: application/json` + `x-saluflow-token: sf_...`.
6. A resposta é normalizada via uma função equivalente a `parseJsonLoose` para garantir que os tipos batem com `AiMealResult` mesmo se a IA devolver um campo extra.

Para `/read-scale`, o `lib/health/weight-monitor.ts` faz uma chamada direta via `fetch` (sem `CapacitorHttp`) e hoje **não** envia o `x-saluflow-token` — um débito conhecido se o servidor estiver com token configurado.

## Limitações e débitos conhecidos

- **Rate limit por cold start.** O map em memória reseta sempre que a Lambda do Vercel esfria. Para abuso real, é necessário migrar para Upstash/Redis.
- **Sem CORS restrito.** `app.use(cors())` libera qualquer origem. No mobile isso não importa; na web é um risco se o app for distribuído via PWA pública.
- **Sem observabilidade.** Apenas `console.error` em falhas. Não há tracing, não há métricas, não há alertas.
- **Token hardcoded e único.** Não há rotação por usuário, só rotação global (trocar variável + republicar APK).
- **Tamanho de payload.** `express.json({ limit: "10mb" })` já é o cap. Fotos acima de 10 MB estouram com `413`. O cliente já redimensiona para 800px para ficar bem abaixo disso.
- **Débito `read-scale` sem token no cliente.** Veja `lib/health/weight-monitor.ts:360` — corrigir antes de ligar `SALUFLOW_APP_TOKEN` em produção.
- **Sem versionamento.** Qualquer breaking change no shape da resposta precisa ser acompanhado de update coordenado no APK.
