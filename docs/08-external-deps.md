# 08 — Dependências Externas (SaluFlow)

> Mapa completo das dependências de software e serviços externos usados pelo SaluFlow (ex-VitaScore). Inclui versões exatas, propósito de cada lib, custos dos serviços pagos, licenças e estratégia de atualização.

---

## Sumário

1. [Dependências JS — app (root)](#1-dependências-js--app-root)
2. [Dependências JS — api-server](#2-dependências-js--api-server)
3. [Android — variables.gradle](#3-android--variablesgradle)
4. [Serviços externos pagos](#4-serviços-externos-pagos)
5. [Integrações gratuitas](#5-integrações-gratuitas)
6. [Auditoria de licenças](#6-auditoria-de-licenças)
7. [Estratégia de atualização](#7-estratégia-de-atualização)

---

## 1. Dependências JS — app (root)

Arquivo de referência: `C:/Users/julip/vitascore/package.json`.

### 1.1. `dependencies` (runtime)

| Pacote | Versão | Propósito |
|--------|--------|-----------|
| **`next`** | `16.2.3` | Framework full-stack React. Build estático (`output: 'export'`) consumido pelo Capacitor. **Atenção:** Next.js 16 tem breaking changes — `searchParams`/`params` são `Promise` (ver `AGENTS.md`). |
| **`react`** | `19.2.4` | Biblioteca de UI. |
| **`react-dom`** | `19.2.4` | Renderização DOM. |
| **`@capacitor/core`** | `^8.3.0` | Runtime Capacitor 8 — ponte JS ↔ nativo. |
| **`@capacitor/cli`** | `^8.3.0` | CLI para `cap sync`, `cap open`, etc. |
| **`@capacitor/android`** | `^8.3.0` | Plataforma Android do Capacitor. |
| **`@capacitor/ios`** | `^8.3.0` | Plataforma iOS (não em uso ativo, mantida para futuro). |
| **`@capacitor/app`** | `^8.1.0` | Eventos de ciclo de vida do app (pause/resume, URL open). |
| **`@capacitor/camera`** | `^8.0.2` | Captura de fotos de refeição (núcleo do fluxo IA). |
| **`@capacitor/filesystem`** | `^8.1.2` | Leitura/escrita de arquivos locais (cache de análises, imagens). |
| **`@capacitor/geolocation`** | `^8.2.0` | Localização do usuário para correlações de atividade. |
| **`@capacitor/haptics`** | `^8.0.2` | Feedback tátil em interações críticas. |
| **`@capacitor/local-notifications`** | `^8.0.2` | Lembretes de refeições, água, medicações. |
| **`@capacitor/preferences`** | `^8.0.1` | Key-value storage persistente (chave primária de config). |
| **`@capacitor/share`** | `^8.0.1` | Compartilhar relatórios/score com terceiros. |
| **`@capacitor/splash-screen`** | `^8.0.1` | Splash nativo no boot do APK. |
| **`@capacitor/status-bar`** | `^8.0.2` | Cor/estilo da status bar por tela. |
| **`@perfood/capacitor-healthkit`** | `^1.3.2` | Integração HealthKit (iOS — latente). |
| **`capacitor-health-connect`** | `0.7.0` | Integração Google Health Connect (passos, sono, frequência cardíaca, peso). Plugin principal de saúde no Android. |
| **`@base-ui/react`** | `^1.3.0` | Primitivos de UI sem estilo (base para shadcn/ui). |
| **`shadcn`** | `^4.2.0` | CLI/gerenciador de componentes shadcn/ui. |
| **`class-variance-authority`** | `^0.7.1` | Variantes de classes utilitárias tipadas (usado pelos componentes shadcn). |
| **`clsx`** | `^2.1.1` | Concatenação condicional de classes. |
| **`tailwind-merge`** | `^3.5.0` | Merge inteligente de classes Tailwind conflitantes. |
| **`tw-animate-css`** | `^1.4.0` | Presets de animação Tailwind (substitui `tailwindcss-animate`). |
| **`framer-motion`** | `^12.38.0` | Animações declarativas (transições de tela, micro-interações). |
| **`lucide-react`** | `^1.8.0` | Conjunto de ícones (padrão visual do app). |
| **`recharts`** | `^3.8.1` | Gráficos de score, tendências, histórico. |

### 1.2. `devDependencies`

| Pacote | Versão | Propósito |
|--------|--------|-----------|
| `typescript` | `^5` | Linguagem. |
| `@types/node` | `^20` | Tipos Node. |
| `@types/react` | `^19` | Tipos React 19. |
| `@types/react-dom` | `^19` | Tipos React DOM 19. |
| `tailwindcss` | `^4` | Framework de CSS utilitário (v4, arquitetura nova). |
| `@tailwindcss/postcss` | `^4` | Plugin PostCSS do Tailwind 4. |
| `eslint` | `^9` | Linter. |
| `eslint-config-next` | `16.2.3` | Preset ESLint oficial do Next.js (alinhado à versão 16.2.3). |
| `puppeteer` | `^24.40.0` | Automação headless do Chrome — usado pelos scripts `generate-pdf.js` / `generate-pitch-seguradora.js` para gerar os PDFs comerciais. |

---

## 2. Dependências JS — api-server

Arquivo de referência: `C:/Users/julip/vitascore/api-server/package.json`.

| Pacote | Versão | Propósito |
|--------|--------|-----------|
| `express` | `^5.2.1` | Framework HTTP. Servidor Node que expõe endpoints de análise de refeição. |
| `cors` | `^2.8.6` | Middleware CORS para permitir chamadas do APK / WebView. |
| `@anthropic-ai/sdk` | `^0.87.0` | SDK oficial Anthropic — chamadas ao Claude Haiku 4.5 / Sonnet 4.5. |
| `openai` | `^6.34.0` | SDK oficial OpenAI — chamadas ao GPT-4o mini / GPT-4o. |

Sem `devDependencies` — o deploy na Vercel é direto (runtime Node zero-config).

---

## 3. Android — `variables.gradle`

Arquivo de referência: `C:/Users/julip/vitascore/android/variables.gradle`.

| Variável | Valor | Observação |
|----------|-------|-------------|
| `minSdkVersion` | `26` | Android 8.0 Oreo. Necessário por Health Connect e APIs modernas do Capacitor 8. |
| `compileSdkVersion` | `36` | Android 15. |
| `targetSdkVersion` | `36` | Alinhado ao compile — Play Console exige target atualizado. |
| `androidxActivityVersion` | `1.11.0` | AndroidX Activity. |
| `androidxAppCompatVersion` | `1.7.1` | AppCompat. |
| `androidxCoordinatorLayoutVersion` | `1.3.0` | CoordinatorLayout. |
| `androidxCoreVersion` | `1.17.0` | Core KTX. |
| `androidxFragmentVersion` | `1.8.9` | Fragment. |
| `coreSplashScreenVersion` | `1.2.0` | Splash Screen API (Android 12+). |
| `androidxWebkitVersion` | `1.14.0` | WebKit/WebView — crítico para o Capacitor. |
| `junitVersion` | `4.13.2` | JUnit 4 (testes unitários). |
| `androidxJunitVersion` | `1.3.0` | AndroidX JUnit (instrumentação). |
| `androidxEspressoCoreVersion` | `3.7.0` | Espresso UI testing. |
| `cordovaAndroidVersion` | `14.0.1` | Compatibilidade Cordova (usada por plugins legados). |

---

## 4. Serviços externos pagos

| Serviço | Uso no SaluFlow | Plano atual | Custo aproximado |
|---------|-----------------|-------------|------------------|
| **Anthropic API** (Claude Haiku 4.5 / Sonnet 4.5) | Análise multimodal de foto de refeição + geração de insights | Pay-as-you-go | ~R$ 0,01 por foto analisada (Haiku 4.5) |
| **OpenAI API** (GPT-4o mini / GPT-4o) | Backup/fallback para análise de refeição e geração de textos | Pay-as-you-go | ~R$ 0,005 por foto (GPT-4o mini) |
| **Vercel Hosting** (servidor IA) | Host do `api-server` em `saluflow-api.vercel.app` | **Hobby (grátis)** | Grátis até 100 GB-horas compute / 100 GB bandwidth por mês. Upgrade para Pro (US$ 20/mês) se passar. |
| **Google Play Console** | Distribuição do AAB em Testes Internos e (futuro) produção | **Taxa única** | US$ 25 (pagamento único de cadastro) |
| **GitHub Releases** | Distribuição de APK direto (fora da Play Store) | **Grátis** | Sem custo; limites generosos de storage e bandwidth para repositórios públicos/privados. |

### 4.1. Estimativa de custo IA por usuário ativo

- Usuário médio analisa ~3 fotos/dia = 90 fotos/mês
- Haiku 4.5 → ~R$ 0,90/mês/usuário
- GPT-4o mini → ~R$ 0,45/mês/usuário
- **Custo misto observado:** ~R$ 0,60–0,90/mês/usuário

---

## 5. Integrações gratuitas

| Integração | O que entrega | Como é consumida |
|------------|---------------|-------------------|
| **Wikisource** | Biblioteca de livros de domínio público (nutrição, saúde, bem-estar) | Conteúdo pré-baixado e embarcado como biblioteca estática no app. |
| **Google Fit / Health Connect** | Passos, sono, frequência cardíaca, peso, atividades | Plugin `capacitor-health-connect 0.7.0` no Android. |
| **Apple HealthKit** | Dados equivalentes no iOS (não ativo em produção) | Plugin `@perfood/capacitor-healthkit 1.3.2`. |
| **Web Speech API** | TTS (Text-to-Speech) para leitura de dicas e relatórios | API nativa do WebView — zero dependências. |
| **Wikipedia** | Fichas nutricionais e referências rápidas | Consumo via fetch direto (sem SDK). |

---

## 6. Auditoria de licenças

Todas as dependências diretas usam licenças permissivas compatíveis com uso comercial e distribuição em loja (Google Play).

| Licença | Projetos do SaluFlow que a usam | Obrigações |
|---------|--------------------------------|------------|
| **MIT** | Next.js, React, Tailwind CSS, Capacitor (core + plugins), framer-motion, lucide-react, recharts, clsx, tailwind-merge, class-variance-authority, express, cors, shadcn, @base-ui/react | Manter aviso de copyright + licença em documentação/legal screen. |
| **Apache 2.0** | AndroidX libs (activity, appcompat, core, fragment, webkit, coordinatorlayout, splashscreen), capacitor-health-connect, puppeteer (subcomponentes) | Manter aviso de copyright, incluir cópia da licença, descrever mudanças significativas quando houver fork. |
| **ISC** | `api-server` (license declarada), várias libs npm transitórias | Equivalente prática ao MIT. |

**Ações recomendadas:**
- Manter uma tela *"Licenças de terceiros"* dentro do app (pode ser gerada via `license-checker` ou similar).
- Publicar o arquivo de atribuições também no GitHub Release.

---

## 7. Estratégia de atualização

### 7.1. Capacitor (core + plugins)

Manter **todos os plugins na mesma major**. Atualização recomendada:

```bash
# Atualiza core + todos os plugins @capacitor/*
npm install \
  @capacitor/core@latest \
  @capacitor/cli@latest \
  @capacitor/android@latest \
  @capacitor/app@latest \
  @capacitor/camera@latest \
  @capacitor/filesystem@latest \
  @capacitor/geolocation@latest \
  @capacitor/haptics@latest \
  @capacitor/local-notifications@latest \
  @capacitor/preferences@latest \
  @capacitor/share@latest \
  @capacitor/splash-screen@latest \
  @capacitor/status-bar@latest

# Sincroniza o projeto nativo
npx cap sync
```

Após sync, **sempre testar em dispositivo real** — plugins tocam código Kotlin/Swift.

### 7.2. Next.js 16 → 17 (futuro)

> ⚠️ **Alerta do `AGENTS.md`:** "This is NOT the Next.js you know. This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code."

- **Nunca** aceitar migration automática sem ler os docs embarcados.
- Mudanças conhecidas no 16 (base deste projeto): `searchParams` e `params` em páginas dinâmicas agora são `Promise<...>` — **precisam ser `await`**.
- Para upgrade major: ler changelog completo + rodar build em branch separada + validar `output: 'export'` e o pipeline do Capacitor.

### 7.3. React 19

- Já está no último major.
- Atualizações `patch`/`minor` podem ser feitas junto com Next.js.

### 7.4. Tailwind 4

- Arquitetura nova (sem `tailwind.config.js` padrão, configuração CSS-first).
- Atualizações dentro da v4 são seguras.
- Upgrade para v5 (quando sair): revisar utilitários customizados.

### 7.5. SDKs de IA (`@anthropic-ai/sdk` e `openai`)

- São atualizados com frequência.
- Regra: atualizar **um por vez** e rodar o fluxo de análise de foto antes de commitar.
- Verificar se o modelo `claude-haiku-4-5` / `claude-sonnet-4-5` continua disponível no novo SDK.

### 7.6. Android SDK / AGP

- `compileSdk` e `targetSdk` devem acompanhar o requisito mínimo do Play Console (atualmente **API 35**; o projeto já está em 36).
- Bumps de `targetSdk` exigem revisão de permissões e comportamentos runtime (especialmente Health Connect e Camera).

### 7.7. Cadência recomendada

| Tipo | Frequência |
|------|------------|
| Security patches (npm audit) | **Imediato** |
| Minor/patch bumps | Mensal |
| Major bumps (Next.js, React, Capacitor, Tailwind) | Planejar por release (envolve QA completa) |
| Anthropic/OpenAI SDK | A cada release do app (sempre com regressão manual do fluxo de foto) |
