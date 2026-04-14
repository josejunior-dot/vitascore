# 09 — Guia de Desenvolvimento

> Guia prático para desenvolver, debugar e contribuir com o SaluFlow (antes VitaScore). Este documento descreve o fluxo de trabalho, convenções de código, estrutura de pastas e os passos necessários para estender funcionalidades principais (especialmente a análise de refeição por IA).

---

## Sumário

1. [Setup de desenvolvimento](#1-setup-de-desenvolvimento)
2. [Estrutura de pastas](#2-estrutura-de-pastas)
3. [Convenções do projeto](#3-convenções-do-projeto)
4. [Fluxo de código típico](#4-fluxo-de-código-típico)
5. [Como adicionar um novo campo na análise de refeição](#5-como-adicionar-um-novo-campo-na-análise-de-refeição)
6. [Testes e qualidade](#6-testes-e-qualidade)
7. [Debug](#7-debug)
8. [Git workflow e releases](#8-git-workflow-e-releases)
9. [Breaking changes do Next.js 16](#9-breaking-changes-do-nextjs-16)

---

## 1. Setup de desenvolvimento

### Requisitos

- **Node.js 20+** (LTS recomendada).
- **Android Studio** (apenas para build mobile / execução no emulador ou device).
- **Java 17** (Android Gradle Plugin 8+).
- **Git** configurado.
- Opcional: **Vercel CLI** se for mexer no `api-server/`.

### Instalação

```bash
# Dependências do app principal (Next.js + Capacitor)
cd C:/Users/julip/vitascore
npm install

# Dependências do servidor-proxy (Claude / OpenAI)
cd api-server
npm install
```

### Rodar em modo dev

```bash
# Na raiz do projeto
npm run dev
```

O preview web sobe em `http://localhost:3000`. Serve para iterar na UI.

> **Atenção:** features que dependem de APIs nativas do Capacitor — câmera nativa, GPS, Health Connect, Preferences storage — **só funcionam dentro do APK instalado em um device Android real**. No browser elas caem em fallback (ex: `localStorage` no lugar de `Capacitor Preferences`) ou simplesmente não funcionam (Health Connect, por exemplo).

### Build mobile (APK / AAB)

```bash
# 1. Gera o bundle estático do Next.js
npm run build

# 2. Sincroniza com Android
npx cap sync android

# 3. Abre no Android Studio para gerar APK ou AAB assinado
npx cap open android
```

---

## 2. Estrutura de pastas

```
vitascore/
├── app/                  # Next.js 16 App Router (rotas)
│   ├── nutricao/         # Tela de análise de refeição
│   ├── config/           # Configurações (provedor de IA, API keys)
│   └── ...
├── components/
│   └── layout/           # AppShell, BottomNav
├── lib/
│   ├── health/           # Core do domínio
│   │   ├── meal-analyzer.ts
│   │   ├── weekly-goals.ts
│   │   ├── wellbeing-checkin.ts
│   │   ├── weight-monitor.ts
│   │   ├── copay-discount.ts
│   │   ├── sleep-monitor.ts
│   │   ├── screen-monitor.ts
│   │   ├── finance-tracker.ts
│   │   ├── data-export.ts
│   │   └── meal-tips.ts
│   ├── ai/
│   │   └── meal-ai.ts    # Integração com Claude / OpenAI / servidor SaluFlow
│   └── library/
│       └── books.ts      # Biblioteca digital (50+ livros)
├── api-server/           # Express proxy deployado no Vercel
├── android/              # Projeto nativo gerado pelo Capacitor
├── public/
├── docs/                 # Documentação técnica
└── AGENTS.md             # Regras para agentes IA (LEIA ANTES)
```

---

## 3. Convenções do projeto

### TypeScript

- **TypeScript estrito** — o build quebra com erro de tipagem.
- Antes de qualquer build ou release, rodar:
  ```bash
  npx tsc --noEmit
  ```
- Não usar `any` — prefira `unknown` e type guards.

### Componentes React

- Todo componente interativo (usa `useState`, `useEffect`, eventos, hooks do Capacitor etc.) **precisa** de `"use client"` no topo do arquivo.
- Páginas em `app/*/page.tsx` que exibem UI dinâmica → client components.
- Server components são reservados para lógica puramente estática.

### Next.js 16

- `searchParams` em pages agora é `Promise<...>`:
  ```ts
  export default async function Page({
    searchParams,
  }: {
    searchParams: Promise<{ tab?: string }>;
  }) {
    const { tab } = await searchParams;
  }
  ```
- `params` em rotas dinâmicas também é `Promise<...>` — sempre `await`.
- Leia `node_modules/next/dist/docs/` antes de mexer em APIs do framework (regra do `AGENTS.md`).

### Estado e persistência

- **Estado local:** `useState` + `useEffect`.
- **Persistência:** Capacitor Preferences com fallback para `localStorage`.
- Padrão já implementado em `lib/health/meal-analyzer.ts` (funções `getStore` / `setStore`). Reuse.

### Aliases de import

```ts
import { MealAnalyzer } from "@/lib/health/meal-analyzer";
import { AppShell } from "@/components/layout/app-shell";
```

- `@/lib/...`
- `@/components/...`
- `@/hooks/...`
- `@/app/...`

### Estilização (tema Google Fit)

- **Tailwind CSS** como base.
- **Paleta oficial:**
  | Cor        | Hex       | Uso                       |
  |------------|-----------|---------------------------|
  | Primary    | `#1A73E8` | Ações, links, destaques   |
  | Success    | `#34A853` | Conquistas, metas OK      |
  | Warning    | `#FBBC04` | Alertas, estados atenção  |
  | Error      | `#EA4335` | Erros, fraudes detectadas |
- **Framer Motion** para animações (entradas, transições de cards, confettis).
- **Lucide React** para ícones — **não instale outros pacotes de ícones** (Heroicons, Phosphor, etc.). Consistência visual é mandatória.

---

## 4. Fluxo de código típico

### Criar uma nova tela

1. Criar arquivo `app/NOME/page.tsx`.
2. Marcar `"use client"` no topo (se tiver interatividade).
3. Envolver a tela em `<AppShell>` para herdar `BottomNav`, header e tema.
4. Usar componentes de `components/ui/` e Tailwind.

Exemplo mínimo:

```tsx
"use client";

import { AppShell } from "@/components/layout/app-shell";

export default function MinhaTelaPage() {
  return (
    <AppShell title="Minha tela">
      <div className="p-4">...</div>
    </AppShell>
  );
}
```

### Nova lógica de domínio

- Criar arquivo em `lib/health/NOME.ts`.
- Expor uma **classe estática** seguindo o padrão dos módulos existentes (`MealAnalyzer`, `WeightMonitor`, `SleepMonitor`, `FinanceTracker`).
- Métodos estáticos, estado persistido via `getStore` / `setStore`.
- Interfaces exportadas no topo do arquivo.

### Nova integração de IA

- Estender `lib/ai/meal-ai.ts` (providers, modelos, prompts, parsing).
- Se precisar de novo endpoint no servidor, espelhar em `api-server/server.js`.

---

## 5. Como adicionar um novo campo na análise de refeição

Este é o fluxo mais comum de evolução do app. Cada novo campo precisa percorrer **8 etapas** — a ordem importa:

1. **Tipo no domínio:** adicionar o campo na interface `MealPhotoAnalysis` em `lib/health/meal-analyzer.ts`.
2. **Tipo no módulo de IA:** adicionar o campo em `AiMealResult` em `lib/ai/meal-ai.ts`.
3. **Prompt:** atualizar o `MEAL_PROMPT` incluindo o campo no JSON schema descrito para o modelo.
4. **Parser:** atualizar `parseJsonLoose` (ou função equivalente) para normalizar o campo retornado (trim, lowercase, enum guards, default).
5. **Encaminhamento:** atualizar `analyzeWithServer` (ou `analyzeWithClaude` / `analyzeWithOpenAi`) para encaminhar o campo do JSON bruto ao resultado tipado.
6. **Servidor proxy:** replicar o mesmo prompt e parsing em `api-server/server.js` (o servidor SaluFlow roda no Vercel e precisa estar em sincronia).
7. **Redeploy:** redeploy do `api-server/` no Vercel (senão a versão do app que usa `provider = "server"` continua com o schema antigo).
8. **UI:** atualizar a tela `app/nutricao/page.tsx` para exibir o novo campo na ficha da refeição (card de resultado, histórico, editar refeição).

> Pular a etapa 6 é o erro mais comum — o app local compila, a versão `provider = "claude"` ou `"openai"` funciona, mas a versão padrão (`server`) continua sem o campo.

---

## 6. Testes e qualidade

Hoje **não há suite de testes automatizada** — dívida técnica conhecida.

### Checagem principal

```bash
npx tsc --noEmit
```

Precisa passar sem erros antes de qualquer build ou release.

### Lint

```bash
npm run lint
```

### Teste manual

- `npm run dev` → validar UI e fluxos que não dependem de nativo.
- Build APK debug → instalar no device → validar câmera, GPS, Health Connect, Preferences.

---

## 7. Debug

### Web (localhost)

- Chrome DevTools em `http://localhost:3000`.
- Console do React / Next.js no terminal onde o `npm run dev` está rodando.

### APK instalado em device

1. Conectar device Android via USB (modo desenvolvedor + debug USB ativos).
2. Abrir `chrome://inspect` no Chrome do desktop.
3. Em **Remote Target**, achar o device e clicar **inspect** no WebView do SaluFlow.
4. DevTools completo do Chrome, com console, network e sources do bundle já compilado.

### Logs nativos

```bash
adb logcat | grep Capacitor
```

---

## 8. Git workflow e releases

- **Branch única:** `master`. Não há feature branches hoje.
- **Commits em português (pt-BR)** seguindo o padrão:
  ```
  Título curto no imperativo

  Descrição mais detalhada (opcional) explicando o porquê.

  Co-Authored-By: Claude ...
  ```
- **Versionamento semver**: `vMAJOR.MINOR.PATCH`.
- Ao liberar uma versão:
  1. `npx tsc --noEmit` limpo.
  2. Atualizar `versionCode` e `versionName` em `android/app/build.gradle`.
  3. Atualizar `docs/10-changelog.md`.
  4. Commit de bump de versão.
  5. `git tag vX.Y.Z`.
  6. `git push && git push --tags`.
  7. Build release (AAB + APK assinados) via Android Studio.
  8. Criar Release no GitHub com o AAB e o APK anexados, descrição copiada do changelog.

---

## 9. Breaking changes do Next.js 16

O `AGENTS.md` na raiz do repo é explícito:

> This is NOT the Next.js you know. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code.

Pontos críticos que pegam agentes e humanos:

- `searchParams` e `params` são `Promise<...>` — sempre usar `await`.
- Alguns helpers de `next/headers` mudaram de assinatura.
- APIs experimentais mudaram de namespace.
- Algumas opções de `next.config.ts` foram removidas ou renomeadas.

**Regra prática:** antes de tocar em qualquer coisa ligada a roteamento, metadata, middleware, server actions ou rendering, abra `node_modules/next/dist/docs/` e leia o guia do tópico específico. O custo de 3 minutos de leitura economiza horas de debug.

---

_Última atualização: 2026-04-12_
