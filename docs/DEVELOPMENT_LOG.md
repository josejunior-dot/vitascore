# SaluFlow — Development Log

> Registro completo do processo de construção, decisões arquiteturais, problemas encontrados e soluções.

**Repositório:** https://github.com/josejunior-dot/vitascore
**Status:** Em teste interno (Google Play Console)
**Início:** abril/2026
**Versão atual:** 2.8.0 (versionCode 20800)

---

## Sumário

- [1. Visão Geral](#1-visão-geral)
- [2. Stack Tecnológica](#2-stack-tecnológica)
- [3. Cronologia](#3-cronologia)
- [4. Decisões Técnicas](#4-decisões-técnicas)
- [5. Estrutura](#5-estrutura)
- [6. Armazenamento](#6-armazenamento)
- [7. API do Servidor IA](#7-api-do-servidor-ia)
- [8. Rotas do Frontend](#8-rotas-do-frontend)
- [9. Deploy](#9-deploy)
- [10. Problemas e Soluções](#10-problemas-e-soluções)
- [11. Métricas](#11-métricas)

---

## 1. Visão Geral

SaluFlow (antes VitaScore) é um app mobile-first de saúde corporativa que ajuda empresas brasileiras a cumprirem a **NR-1** (norma regulamentadora sobre riscos psicossociais, fiscalização punitiva a partir de **26 de maio de 2026**, multa de **R$6.708 por trabalhador** exposto a risco não gerenciado) e a oferecerem plano de saúde alinhado à **ANS RN 498/499** (coparticipação por adesão a programas preventivos).

O app usa IA (Claude e OpenAI) para analisar fotos de refeição, implementa o questionário **WHO-5** para bem-estar, gera metas semanais personalizadas, mantém biblioteca de leitura de 50+ livros de domínio público, e entrega ao RH um **dashboard agregado** — nunca dados individuais dos funcionários.

**Princípios fundamentais (CHECKLIST OBRIGATÓRIO antes de codificar):**

- **LGPD pura:** dados de saúde ficam no dispositivo do funcionário (Capacitor Preferences / localStorage). Sem banco remoto. Sem PII no servidor.
- **Bonificação por PARTICIPAÇÃO, nunca punição por score.** Lei trabalhista brasileira (CLT + princípio da não discriminação) impede desconto por performance de saúde. O funcionário é recompensado por *aderir*, não por ter resultados.
- **RH só vê dados agregados.** Percentual de funcionários com uso saudável vs. preocupante. Nunca o nome do João. Nunca o score da Maria.
- **Adesão voluntária, revogável a qualquer momento.** Consentimento granular por pilar.
- **Evidência documentada para o PGR.** O que o fiscal vai pedir: hash verificável de cada relatório, datas, continuidade.

---

## 2. Stack Tecnológica

| Camada | Tecnologia | Versão | Papel |
|---|---|---|---|
| Framework web | Next.js | 16.2.3 | App Router, rotas e build estático para Capacitor |
| UI | React | 19.2.4 | Componentes do app |
| Estilo | Tailwind CSS | 4.x | Design system mobile-first |
| Animações | Framer Motion | 12.38 | Transições e micro-interações |
| Componentes | shadcn + Base UI | 4.2 / 1.3 | Primitivos acessíveis |
| Ícones | Lucide React | 1.8 | Biblioteca de ícones |
| Gráficos | Recharts | 3.8 | Dashboard NR-1 e relatórios |
| Mobile runtime | Capacitor | 8.3 | Empacotamento Android/iOS |
| Android | @capacitor/android | 8.3 | Build nativo |
| Câmera | @capacitor/camera | 8.0.2 | Foto de refeição |
| GPS | @capacitor/geolocation | 8.2 | Monitoramento de atividade |
| Notificações | @capacitor/local-notifications | 8.0.2 | Lembretes de check-in |
| Storage | @capacitor/preferences | 8.0.1 | Persistência local (LGPD) |
| Health (Android) | capacitor-health-connect | 0.7 | Integração Google Health Connect |
| Health (iOS) | @perfood/capacitor-healthkit | 1.3.2 | Integração Apple HealthKit |
| TypeScript | TypeScript | 5.x | Tipagem |
| Backend IA | Express + Vercel | — | `saluflow-api.vercel.app` (Claude + OpenAI) |
| Distribuição | GitHub Releases + Play Console | — | AAB/APK e Internal Testing |

---

## 3. Cronologia

> Sessões listadas do mais recente para o mais antigo.

### Sessão 12 — 2026-04-13 — Bump para v2.8.0 (Play Console)
**Objetivo:** Preparar AAB assinado para upload no Google Play Console Internal Testing.
- `versionCode` 20700 → 20800 e `versionName` → 2.8.0 em `android/app/build.gradle`
- Build `./gradlew bundleRelease` do AAB
- Tag `v2.8.0` e release "SaluFlow v2.8.0 — Noom Color, calorias, editar e excluir"

**Commits:**
- `fac95f6` — Bump versionCode para 20800 e versionName para 2.8.0

---

### Sessão 11 — 2026-04-12 — Noom Color + edição de refeições (v2.8.0)
**Objetivo:** Inspirar no Noom: classificação visual por cor, calorias estimadas e controle total sobre o histórico de refeições.
- Sistema Noom Color (verde/amarelo/vermelho) baseado em densidade calórica e perfil nutricional
- Calorias estimadas pela IA em cada análise
- Editar e excluir refeições do histórico local

**Commits:**
- `128846d` — Noom Color, calorias estimadas, editar e excluir refeições

---

### Sessão 10 — 2026-04-12 — Dicas pós-análise (v2.7.0)
**Objetivo:** Transformar a análise de foto em *coaching nutricional*, não só descritivo.
- `lib/health/meal-tips.ts` gera dicas acionáveis para equilibrar a próxima refeição
- UI mostra dicas logo após o resultado da IA

**Commits:**
- `081e39a` — Dicas para equilibrar a refeição após análise por IA

---

### Sessão 9 — 2026-04-12 — Fix GPS x Câmera (v2.6.1)
**Objetivo:** Corrigir colisão entre o diálogo de permissão de localização e o da câmera.
- `Geolocation.checkPermissions()` antes de `getCurrentPosition()`
- Skip silencioso se o usuário não tiver concedido (não interrompe o fluxo da câmera)

**Commits:**
- `77a0bf7` — Fix: GPS não colide mais com o diálogo de permissão da câmera

---

### Sessão 8 — 2026-04-12 — Servidor SaluFlow padrão (v2.6.0)
**Objetivo:** "IA embutida" — o usuário não precisa configurar nada. App entrega resultado real na primeira foto.
- `api-server/` Express com endpoints `/api/meal/analyze` (Claude) e `/api/meal/analyze-openai`
- Deploy em `saluflow-api.vercel.app`
- Chaves Anthropic e OpenAI ficam no servidor (não no APK decompilável)

**Commits:**
- `4956fbd` — Servidor SaluFlow para análise de refeição (padrão)

---

### Sessão 7 — 2026-04-12 — IA real na análise de refeição (v2.5.0)
**Objetivo:** Substituir mock aleatório por provedores reais (Claude Vision / GPT-4o mini).
- `lib/health/api-config.ts` — escolha entre Claude ou OpenAI nas configurações
- `lib/health/meal-analyzer.ts` — roteamento para o provider escolhido
- Prompt rigoroso que proíbe a IA de inventar ingredientes que não aparecem na foto

**Commits:**
- `712fc92` — Config de IA: escolher Claude ou OpenAI para análise de refeição

---

### Sessão 6 — 2026-04-12 — Biblioteca v2.4 (50+ livros)
**Objetivo:** Biblioteca de leitura como pilar de bem-estar (inspirado em cultura + literatura).
- `lib/library/books.ts` com 50+ livros de domínio público
- 2 abas: "Todos" e "Meus livros"
- Sistema de status (não lido / lendo / lido) persistido localmente
- Wikisource em vez de PDFs (sem CORS, sem hospedagem)
- Leitor WebView dentro do app usando Google Docs Viewer
- Opção de áudio via TTS nativo + busca por audiobook

**Commits:**
- `50243f5` — Biblioteca v2.4: 50+ livros, 2 abas e sistema de status
- `e9ea621` — Trocar PDFs do MEC por Wikisource (HTML, sem CORS)
- `d284857` — Leitor de livros dentro do app (WebView com Google Docs viewer)
- `bdaecd5` — Biblioteca: opção de áudio (TTS nativo + busca audiobook)
- `0358021` — Biblioteca digital com 15 livros de domínio público

---

### Sessão 5 — 2026-04-12 — Análise Fully/Prudential + financeiro
**Objetivo:** Estudar o Fully (Prudential) como benchmark, destilar insights acionáveis e adicionar pilar de saúde financeira.
- `docs/ANALISE_FULLY_INSIGHTS.md` — análise estratégica
- `docs/BENCHMARK_VITALITY_FULLY.md` — benchmark competitivo
- `docs/MERCADOS_POTENCIAIS.md` — análise honesta de mercados (TAM R$2,9B / SAM R$24M / SOM R$2,4M ARR)
- Novo pilar `/financeiro` (saúde financeira como parte da NR-1, estresse por endividamento)
- 4 funcionalidades inspiradas na Fully
- Logo e ícone 7x maior em todo lugar

**Commits:**
- `796760c` — docs: análise honesta de mercados potenciais
- `e72eb50` — Logo e ícone 7x maior em todo lugar
- `4845537` — 4 novas funcionalidades inspiradas na análise da Fully
- `e87e782` — Pilar de saúde financeira (/financeiro)
- `2ba9e90` — Análise estratégica Fully (Prudential) — insights para SaluFlow
- `d9301e8` — Benchmark Vitality + Fully (Prudential) — material competitivo

---

### Sessão 4 — 2026-04-11 — Identidade visual SaluFlow
**Objetivo:** Finalizar a troca de marca VitaScore → SaluFlow com nova logo da borboleta.
- Logo SaluFlow (borboleta) em todas as plataformas (Android mipmap + splash + onboarding)
- Rename completo em código, docs e `applicationLabel`
- `applicationId` preservado (`com.vitascore.app`) para não perder a ficha no Play Console
- Release build assinado + política de privacidade

**Commits:**
- `d7ef99a` — Logo maior nas telas + ícone Android só com a borboleta
- `83b2625` — Fix: usar logo completa (borboleta + nome) em tamanho correto
- `602c7d6` — Logo borboleta visível no app: splash, onboarding e home header
- `4e0e531` — Logo SaluFlow (borboleta) + ícones para todas as plataformas
- `35cf399` — Rename completo: VitaScore → SaluFlow
- `65d8840` — Release build + política de privacidade para Play Store

---

### Sessão 3 — 2026-04-11 — NR-1, WHO-5 e metas semanais
**Objetivo:** Implementar o coração regulatório do produto: compliance NR-1 com evidência e metas no modelo Vitality.
- Check-in WHO-5 (questionário OMS validado para bem-estar)
- Dashboard NR-1 (`/nr1`) com agregados de uso saudável vs. preocupante
- Compliance ANS RN 499 (coparticipação por adesão)
- Metas semanais personalizadas no modelo Prudential Vitality
- Timeout de 5s no Health Connect para não travar em "Verificando..."
- Página `/config` completa e funcional

**Commits:**
- `ae7e323` — Fix: Health Connect travando em 'Verificando...' — timeout de 5s
- `f0842a4` — Configurações funcionais + página /config completa
- `8906826` — Limpeza para distribuição: remove arquivos de exemplo
- `b330dcb` — Estratégia de guerra — plano tático para equipe de 4 pessoas
- `f4ed63c` — Metas semanais personalizadas (modelo Prudential Vitality)
- `079fc2f` — Check-in WHO-5 + Dashboard NR-1 + compliance RN 499

---

### Sessão 2 — 2026-04-11 — Documentação estratégica v2.0
**Objetivo:** Reescrever toda a documentação estratégica com análise regulatória real (pós-feedback "viés otimista").
- `docs/PLANO_DE_NEGOCIOS.md`, `docs/PITCH_COMERCIAL.md`, `docs/PITCH_CORRETORAS.md`
- `docs/PRODUTO_NR1.md`, `docs/ROI_CALCULATOR.md`, `docs/TOOLKIT_VENDAS.md`
- `VitaScore_Pitch_Seguradora.pdf` gerado via Puppeteer
- Relatório RH, desconto coparticipação, selo LGPD, exportação de dados
- Redesign light theme estilo Google Fit + mapa GPS no monitoramento

**Commits:**
- `01dd5d1` — v2.0 — Documentação estratégica reescrita com análise regulatória real
- `e8b6f6a` — Pitch executivo para seguradoras (PDF) + pitch para corretoras
- `ca9ce5f` — Pitch para corretoras + toolkit de vendas
- `fec7f9c` — Documentação estratégica: plano de negócios, pitch comercial e ROI
- `8a5dcae` — Relatório RH + desconto coparticipação + selo LGPD + exportação
- `7f8de83` — Redesign completo: tema light Google Fit + monitoramento com GPS

---

### Sessão 1 — 2026-04-10 — Commit inicial (VitaScore)
**Objetivo:** Bootstrap do projeto como VitaScore — app de hábitos de vida com desconto em seguro.
- `1e0d8c2` — Initial commit from Create Next App
- `648913b` — feat: initial commit
- `c3443da` — VitaScore — app completo de hábitos de vida com desconto em seguro
- `5622c79` — Adicionar API server para análise de fotos com Claude Vision
- `e763a32` — Remover node_modules do api-server e atualizar gitignore

---

## 4. Decisões Técnicas

- **Local-first (LGPD).** Sem backend central para dados de saúde. O app armazena tudo em `@capacitor/preferences` (nativo) e `localStorage` (fallback web). Único serviço externo é o servidor de IA, que recebe apenas a imagem e devolve o resultado — nunca identifica o usuário.

- **Capacitor em vez de React Native.** Máximo reuso do código web Next.js. Uma base, build para Android e iOS. Equipe de 4 pessoas não pode manter dois apps.

- **Servidor Express no Vercel para IA.** Chaves `ANTHROPIC_API_KEY` e `OPENAI_API_KEY` ficam no servidor, nunca no APK (que é trivialmente decompilável). Custo ~R$0,005/foto com GPT-4o mini.

- **GPT-4o mini como default de análise de refeição.** Custo/qualidade imbatível vs. desenvolver classificador nutricional próprio. Claude Vision disponível como alternativa nas configurações.

- **Bonificação por participação, não por performance.** Único caminho legal sob CLT brasileira. O score individual nunca é visto pelo empregador. A coparticipação (RN 499) é calculada sobre *adesão ao programa preventivo*, não sobre resultados de saúde.

- **Wikisource em vez de PDFs do MEC.** Sem CORS, sem hospedagem de arquivo, sem WebView quebrando. HTML puro carregado no leitor nativo.

- **Rename VitaScore → SaluFlow.** Posicionamento de marca mais leve e contemporâneo. `applicationId` preservado (`com.vitascore.app`) para não perder ficha no Play Console. Alternativa `com.saluflow.app` guardada caso o Google reserve o pacote.

- **NR-1 como vetor comercial principal.** Prazo (26/05/2026), multa por trabalhador e fiscalização punitiva dão urgência absoluta — é o argumento que abre a porta das PMEs.

---

## 5. Estrutura

```
vitascore/
├── android/                  # Projeto nativo Android (Gradle)
├── api-server/               # Servidor Express (IA) — deploy Vercel
├── app/                      # Next.js App Router
│   ├── aprenda/              # Conteúdo educativo
│   ├── atividade/            # Registro de atividade física
│   ├── biblioteca/           # 50+ livros de domínio público
│   ├── checkin/              # WHO-5 (bem-estar)
│   ├── config/               # Configurações (IA, privacidade, integrações)
│   ├── desafios/             # Metas e streaks
│   ├── diario/               # Diário de hábitos
│   ├── digital/              # Bem-estar digital (tempo de tela)
│   ├── financeiro/           # Saúde financeira (pilar NR-1)
│   ├── home/                 # Dashboard principal
│   ├── landing/              # Landing page comercial
│   ├── metas/                # Metas semanais estilo Vitality
│   ├── monitorar/            # Monitoramento de atividade com GPS
│   ├── nr1/                  # Dashboard agregado NR-1 (empresa)
│   ├── nutricao/             # Análise de refeição com IA
│   ├── onboarding/           # Fluxo de entrada
│   ├── parceiros/            # Parceiros e benefícios
│   ├── perfil/               # Perfil do usuário
│   ├── peso/                 # Acompanhamento de peso
│   ├── relatorio/            # Relatório RH (agregado)
│   ├── seguro/               # Simulação de desconto em seguro
│   └── sono/                 # Monitoramento de sono
├── docs/                     # Estratégia, produto e operação
│   ├── MERCADOS_POTENCIAIS.md
│   ├── PLANO_DE_NEGOCIOS.md
│   ├── PRODUTO_NR1.md
│   ├── PITCH_COMERCIAL.md
│   ├── PITCH_CORRETORAS.md
│   ├── ROI_CALCULATOR.md
│   ├── TOOLKIT_VENDAS.md
│   ├── ESTRATEGIA_GUERRA.md
│   ├── ANALISE_FULLY_INSIGHTS.md
│   ├── BENCHMARK_VITALITY_FULLY.md
│   ├── PRIVACY_POLICY.md
│   ├── 01-installation.md
│   ├── 03-database.md
│   └── 07-operations-manual.md
├── lib/
│   ├── ai/
│   │   └── meal-ai.ts        # Cliente único do servidor IA
│   ├── health/
│   │   ├── api-config.ts     # Escolha do provider (Claude/OpenAI)
│   │   ├── copay-discount.ts # Regras RN 499
│   │   ├── data-export.ts    # Exportação LGPD
│   │   ├── finance-tracker.ts
│   │   ├── health-connect.ts # Android Health Connect
│   │   ├── healthkit.ts      # Apple HealthKit
│   │   ├── manual.ts         # Entrada manual
│   │   ├── meal-analyzer.ts  # Análise de foto (802 linhas)
│   │   ├── meal-tips.ts      # Dicas pós-análise
│   │   ├── screen-monitor.ts # Tempo de tela (NR-1)
│   │   ├── sleep-monitor.ts
│   │   ├── weight-monitor.ts
│   │   ├── weekly-goals.ts   # Metas semanais Vitality
│   │   └── wellbeing-checkin.ts  # WHO-5
│   ├── library/
│   │   └── books.ts          # Catálogo de 50+ livros
│   ├── reports/
│   │   └── hr-report.ts      # Relatório agregado RH
│   ├── mock-data.ts
│   ├── user-profile.ts
│   ├── utils.ts
│   └── vitascore.ts          # Score composto
└── package.json
```

---

## 6. Armazenamento

Todo o armazenamento é local (Capacitor Preferences no mobile, `localStorage` no web). **Nenhum dado pessoal de saúde sai do dispositivo.**

| Chave (Preferences) | Conteúdo |
|---|---|
| `saluflow:user-profile` | Nome, idade, empresa, consentimentos |
| `saluflow:meals` | Histórico de refeições analisadas (com Noom Color) |
| `saluflow:activities` | Registro de atividade física |
| `saluflow:weight` | Histórico de peso |
| `saluflow:sleep` | Registros de sono |
| `saluflow:weekly-goals` | Metas semanais personalizadas |
| `saluflow:wellbeing-checkin` | Respostas WHO-5 |
| `saluflow:screen-time` | Tempo de tela agregado por dia |
| `saluflow:library:status` | Status dos livros (lendo/lido) |
| `saluflow:finance` | Saúde financeira |
| `saluflow:ai-provider` | Provider escolhido (claude / openai / default) |
| `saluflow:consents` | Consentimentos por pilar (revogáveis) |

---

## 7. API do Servidor IA

Hospedado em `https://saluflow-api.vercel.app`. Apenas proxy para Claude e OpenAI com chaves guardadas no servidor.

| Endpoint | Método | Descrição |
|---|---|---|
| `/api/meal/analyze` | POST | Análise de refeição via Claude Vision (sonnet) |
| `/api/meal/analyze-openai` | POST | Análise de refeição via GPT-4o mini |
| `/api/health` | GET | Healthcheck |

Payload: `{ imageBase64: string, userProfile?: { perfil nutricional anônimo } }`.
Resposta: `{ items, calories, noomColor, macros, tips }`.

Detalhes completos em `docs/04-*` (a ser escrito na próxima sessão de documentação).

---

## 8. Rotas do Frontend

22 rotas em `app/*/page.tsx`:

| Rota | Descrição |
|---|---|
| `/` | Splash/redirect |
| `/landing` | Landing comercial |
| `/onboarding` | Fluxo de entrada |
| `/home` | Dashboard principal do usuário |
| `/nutricao` | Análise de refeição com IA |
| `/atividade` | Registro de atividade física |
| `/monitorar` | Atividade ao vivo com GPS |
| `/sono` | Monitoramento de sono |
| `/peso` | Acompanhamento de peso |
| `/checkin` | Check-in WHO-5 |
| `/digital` | Bem-estar digital (tempo de tela) |
| `/financeiro` | Saúde financeira |
| `/metas` | Metas semanais estilo Vitality |
| `/desafios` | Desafios e streaks |
| `/diario` | Diário de hábitos |
| `/biblioteca` | 50+ livros de domínio público |
| `/aprenda` | Conteúdo educativo |
| `/nr1` | Dashboard NR-1 (empresa — agregado) |
| `/relatorio` | Relatório RH |
| `/parceiros` | Parceiros e benefícios |
| `/seguro` | Simulação de desconto em seguro (RN 499) |
| `/config` | Configurações (IA, privacidade, integrações) |
| `/perfil` | Perfil do usuário |

---

## 9. Deploy

**Mobile (Android):**
1. `npm run cap:sync` — build Next + sync Capacitor
2. `cd android && ./gradlew bundleRelease` — gera AAB assinado (`app-release.aab`)
3. Upload no GitHub Release (`gh release create v2.8.0`)
4. Upload no Google Play Console → Internal Testing

**Servidor IA (Vercel):**
1. `cd api-server && vercel --prod`
2. Variáveis de ambiente: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`
3. Domínio: `saluflow-api.vercel.app`

---

## 10. Problemas e Soluções

1. **Mock aleatório confundindo usuários.** `meal-analyzer.ts` usava `Math.random` quando nenhum provider estava configurado. Parecia que "a IA errou". **Solução:** servidor SaluFlow padrão com chave embutida — IA real na primeira foto, sem configuração (v2.6.0).

2. **Macarrão classificado como "refeição balanceada".** Prompt genérico deixava a IA inventar ingredientes que não estavam na foto. **Solução:** prompt rigoroso que proíbe inventar — "se você não vê o ingrediente, não cite" — e exige citar explicitamente o que está faltando (v2.5.0).

3. **GPS colidindo com câmera.** `Geolocation.getCurrentPosition` disparava diálogo de permissão ao mesmo tempo que o da câmera, travando o fluxo de análise. **Solução:** `checkPermissions()` antes de qualquer chamada, skip silencioso se o usuário não concedeu (commit `77a0bf7`, v2.6.1).

4. **CORS para Claude/OpenAI no navegador.** Anthropic e OpenAI bloqueiam `fetch` direto do browser. **Solução:** `CapacitorHttp` fura CORS no mobile, e o servidor proxy no Vercel é o fallback para web e a rota padrão do app.

5. **Vercel CLI sem scope em modo non-interactive.** `vercel --prod` falhava pedindo seleção de time. **Solução:** linkar via API direta com `VERCEL_TOKEN` + `VERCEL_ORG_ID` nas env vars do deploy.

6. **Campo `excerpt` removido mas `biblioteca/page.tsx` ainda referenciava.** Build do Next.js quebrou após refatorar `lib/library/books.ts`. **Solução:** rewrite completo de `app/biblioteca/page.tsx` com o novo schema de livros.

7. **Health Connect travando em "Verificando...".** Permissão podia ficar pendente indefinidamente no Android. **Solução:** timeout de 5 segundos + mensagem de erro clara (commit `ae7e323`).

8. **Package name reservado pelo Google.** Risco de `com.vitascore.app` ser rejeitado no Play Console. **Solução:** alternativa `com.saluflow.app` pronta, com script de migração — mas `com.vitascore.app` foi mantido porque passou.

9. **PDFs do MEC com CORS.** PDFs hospedados em `mec.gov.br` não carregavam na WebView. **Solução:** migrar todo o catálogo para Wikisource (HTML puro, sem CORS, sem hospedagem).

10. **Viés otimista nos primeiros pitches.** A documentação inicial inflava números. **Solução:** reescrita completa com TAM/SAM/SOM honestos (R$2,9B / R$24M / R$2,4M ARR) e análise regulatória real antes de qualquer projeção (docs `v2.0`).

---

## 11. Métricas

| Métrica | Valor |
|---|---|
| Arquivos fonte TS/TSX (fora de `node_modules`/`.next`) | 71 |
| Rotas do app (`app/*/page.tsx`) | 22 |
| Livros na biblioteca | 50+ |
| Linhas em `lib/health/meal-analyzer.ts` | 802 |
| Commits no `main` | 40 |
| Releases publicadas no GitHub | 7 (v2.3.3 → v2.8.0) |
| Versão atual | 2.8.0 (`versionCode` 20800) |
| Pilares de saúde | 7 (nutrição, atividade, sono, peso, digital, financeiro, bem-estar) |
| Dias de desenvolvimento | 4 (10 → 13 de abril de 2026) |

---

*Última atualização: 2026-04-13*
