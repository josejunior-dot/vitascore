# 11. Roadmap e Melhorias — SaluFlow

## Sumário

- [Visão geral](#visão-geral)
- [Curto prazo (bugs e polish)](#curto-prazo-bugs-e-polish)
- [Médio prazo (features)](#médio-prazo-features)
- [Longo prazo (visão de produto)](#longo-prazo-visão-de-produto)
- [Dívida técnica](#dívida-técnica)
- [Infraestrutura e operações](#infraestrutura-e-operações)
- [TODOs rastreados no código](#todos-rastreados-no-código)

---

## Visão geral

Este documento consolida o backlog técnico e de produto do SaluFlow (antes chamado VitaScore). Ele é complementar aos documentos de produto `docs/MERCADOS_POTENCIAIS.md` e `docs/PLANO_DE_NEGOCIOS.md`, focando no que precisa ser construído, corrigido ou migrado para que o app saia do estado atual (MVP funcional rodando em APK Android) para um produto pronto para escalar no modelo B2B2C de saúde corporativa.

Os itens estão organizados por horizonte temporal (curto, médio e longo prazo) e separados em duas faixas adicionais: dívida técnica (qualidade interna do código) e infraestrutura (operação, release, backup).

---

## Curto prazo (bugs e polish)

Itens que precisam ser resolvidos antes de qualquer distribuição pública ou piloto com cliente pagante. São problemas de segurança, higiene de repositório ou limitações que comprometem a experiência básica.

### 1. Token `SALUFLOW_APP_TOKEN` hardcoded no cliente

- **Arquivo:** `lib/ai/meal-ai.ts:16`
- **Problema:** o token `sf_0191765e5531c1a52451df8fcb3b5f47` está literalmente no código do APK. Qualquer um que descompile o APK obtém o token e pode bombardear a rota `/analyze-meal` hospedada em `saluflow-api.vercel.app`, consumindo crédito de OpenAI/Claude da conta.
- **Ação:** rotacionar o token antes de ir a produção, mover para uma variável carregada em build, e no servidor implementar rate limit por IP + per device fingerprint. Idealmente migrar para autenticação assinada por tempo (HMAC com chave derivada do install ID).

### 2. Keystore Android com senha no repositório

- **Arquivo:** `android/app/build.gradle` (literal `"vitascore2026"`)
- **Problema:** a senha do keystore de release está comitada. Se o repositório vazar (inclusive em commits antigos), qualquer um pode assinar APKs que o Play Store aceitará como atualização legítima.
- **Ação:** mover para `android/gradle.properties` **fora** do controle de versão (adicionar ao `.gitignore`), ou ler via variável de ambiente (`System.getenv("SALUFLOW_KEYSTORE_PASSWORD")`). Usar `git filter-repo` para remover histórico caso o repo vá público.

### 3. Fallback mock do `meal-analyzer.ts`

- **Arquivo:** `lib/health/meal-analyzer.ts:550-609`
- **Problema:** quando nenhum provider de IA está configurado, o app gera uma análise aleatória via `Math.random()` (chance de ter vegetais 70%, proteína 80%, etc.) e devolve como se fosse uma análise real. O usuário não percebe a diferença.
- **Ação:** decidir entre (a) remover o mock e exibir um estado "configure um provider" na UI, ou (b) manter o mock mas com badge explícito "modo demo — dados simulados" na tela do usuário. A opção (a) é mais honesta para o piloto.

### 4. Limitação de CORS no modo web

- **Arquivo:** `lib/ai/meal-ai.ts:5-7` (comentário) e `lib/ai/meal-ai.ts:297-325` (função `httpPost`)
- **Problema:** as chamadas diretas para `api.anthropic.com` e `api.openai.com` só funcionam dentro do APK porque o `CapacitorHttp` ignora CORS. Em `localhost:3000` (`next dev`) essas chamadas quebram.
- **Ação:** documentar a limitação em `docs/01-installation.md` e adicionar uma mensagem amigável na tela quando rodando no browser: "análise por foto só funciona no app Android instalado". Alternativamente, criar um proxy no servidor Vercel para desenvolvimento.

### 5. Ausência total de testes automatizados

- **Problema:** não existe nenhum arquivo `.test.ts` ou `.spec.ts` no projeto. Toda validação depende de QA manual no APK.
- **Ação:** começar com smoke tests para as funções puras mais críticas: `WeightMonitor.calculateBmi`, `MealAnalyzer.recalculateScore`, `WellbeingCheckin.saveResponse` (validar cálculo `soma × 4`), `WeeklyGoals.generateWeekGoals`. Ferramenta recomendada: Vitest (já compatível com o Next 16).

---

## Médio prazo (features)

Funcionalidades importantes para aumentar a retenção e fechar o ciclo do produto, mas que não são bloqueadoras para o MVP atual.

### 1. TDEE e meta calórica

Tela de onboarding perguntando peso, altura, idade, sexo biológico e nível de atividade para calcular o TDEE (Total Daily Energy Expenditure) via Mifflin-St Jeor. A partir do TDEE, definir uma meta calórica diária coerente com o objetivo (manter, perder ou ganhar peso) e usar essa meta como referência no dashboard de nutrição. Hoje o app já tem `estimatedCalories` por refeição (vindas da IA), mas não há nenhuma meta para comparar.

### 2. Integração real com Play Games e Google Fit Goals API

O SaluFlow já usa Health Connect para ler passos e sono (`lib/health/health-connect.ts`), mas ainda não publica conquistas no Play Games nem interage com as Goals API do Google Fit (metas nativas do sistema). Integrar permitiria exibir badges na aba de Play Games do Android e aproveitar o motor de metas do próprio sistema operacional.

### 3. Dashboard NR-1 real para RH

O `docs/PRODUTO_NR1.md` descreve a visão regulatória (NR-1 — avaliação de riscos psicossociais). Hoje o app tem apenas um placeholder no RH. Precisa:
- Dashboard web (não mobile) para o gestor de RH acessar por login separado.
- Relatório PDF com os dados agregados do WHO-5 (`WellbeingCheckin.getAggregatedReport`).
- Garantia formal, auditada no backend, de que nenhum dado individual é exposto (requer k-anonymity mínimo — só mostrar grupos com >= 5 respondentes).
- Exportação em CSV para auditor da SST.

### 4. Histórico completo de refeições

- **Estado atual:** `MealAnalyzer.getTodayMeals` (`lib/health/meal-analyzer.ts:675`) e `getWeeklyMeals` (linha 762) só retornam dia atual e semana. Não há visão mensal, busca por data, ou filtro por tipo.
- **Ação:** criar tela `/historico/refeicoes` com calendário, filtros e gráficos de evolução do `mealScore` ao longo do tempo.

### 5. Exportação de relatório em PDF

- **Arquivo base:** `lib/health/data-export.ts`
- **Estado:** já existe exportação JSON com todos os dados do usuário. Falta um relatório PDF executivo (1-2 páginas) que o usuário possa compartilhar com o médico ou nutricionista.

### 6. Suporte a iOS

Hoje o Capacitor está configurado apenas para Android (`/android`). Criar o projeto iOS (`npx cap add ios`), resolver permissões de câmera/HealthKit, e publicar na App Store. Atenção: `lib/health/healthkit.ts` já tem o stub preparado, mas nunca foi compilado.

### 7. Notificações push para check-in

Hoje as notificações locais só servem para lembrete de pesagem (`WeightMonitor.scheduleNotification`). Adicionar lembretes diários (configuráveis pelo usuário) para:
- Responder o check-in WHO-5 no fim do dia.
- Fotografar almoço e jantar.
- Avisar quando uma meta semanal está prestes a vencer.

---

## Longo prazo (visão de produto)

Itens que dependem de tração comercial e do aprendizado com os primeiros clientes pagantes. São direcionamentos estratégicos mais do que tarefas concretas.

### 1. Modelo B2B white-label para corretoras de seguro

Conforme `docs/PITCH_CORRETORAS.md`, a proposta é licenciar o SaluFlow como app branded da corretora, com domínio e identidade visual próprios. Requer:
- Multi-tenant no backend (hoje o Vercel serve uma única instância).
- Sistema de temas dinâmico no cliente (cores, logo, nome do app).
- Painel administrativo para o tenant configurar benefícios, metas e comunicação.

### 2. Integração com ERPs e folha de pagamento

Para auditoria NR-1 é preciso comprovar adesão por filial, departamento e cargo (sempre anonimizado em grupos de >=5). Integrar com Senior, TOTVS e similares permite amarrar o cadastro anônimo à folha sem expor identidade.

### 3. Módulo de saúde mental ampliado

Hoje o WHO-5 é só um termômetro. Expandir com:
- Conversas estruturadas via IA para primeira escuta (não substitui psicólogo).
- Lista de redes de apoio referenciadas (CVV, CAPS, plano de saúde corporativo).
- Protocolo de encaminhamento automático quando o score cai abaixo de "Crítico" por 3 dias consecutivos.
- Atenção regulatória: ver `memory/project_vitascore_regras.md` — RN 498/499 ANS e CFP.

### 4. Biblioteca com áudio narrado por voz humana

- **Arquivo:** `lib/books.ts` (939 linhas, conteúdo educacional)
- **Estado atual:** a leitura usa TTS do sistema (voz robótica).
- **Visão:** gravar narração profissional ou usar TTS neural de ponta (ElevenLabs, Google WaveNet) cacheada no CDN. Melhora drasticamente a experiência do módulo educativo.

### 5. Gamificação: ranking anônimo por empresa

Ranking agregado por departamento (sempre em grupos >=5 para LGPD), mostrando metas cumpridas, sem expor indivíduos. Alinha com o modelo de engajamento Prudential Vitality já descrito em `lib/health/weekly-goals.ts`.

---

## Dívida técnica

Itens que não afetam o usuário final diretamente, mas comprometem a velocidade de desenvolvimento ou a segurança a longo prazo.

### 1. Sem testes
Já listado em curto prazo, é o item #1 da dívida técnica.

### 2. Sem CI/CD
Não há GitHub Actions, nem workflow de build automático. Cada release do APK é feita manualmente com `./gradlew assembleRelease` local, o que é lento e propenso a erros. Configurar um pipeline (preferencialmente GitHub Actions) que:
- Roda `npm run lint` e `npm run build` a cada PR.
- Compila APK de release assinado a partir de uma branch `release/*`.
- Publica artefato no GitHub Releases ou direto no Play Console via Fastlane.

### 3. Senha do keystore no repositório
Já listado em curto prazo como bloqueador de segurança.

### 4. Dependência de Vercel para IA

O servidor proxy (`saluflow-api.vercel.app`) é um ponto único de falha. Se a conta Vercel cair ou se o custo escalar, o app perde a análise por IA. Mitigações:
- Permitir que o usuário avançado configure o próprio provider (já existe, mas não é fluxo padrão).
- Migrar para uma infraestrutura mais previsível (Cloud Run, Fly.io, VPS simples com Caddy).

### 5. `lib/books.ts` com 939 linhas

Biblioteca educacional hardcoded em um único arquivo TypeScript. Deveria ser `public/content/books/*.json` (um arquivo por livro) ou uma chamada ao servidor que retorna o conteúdo sob demanda. Reduziria o bundle do app.

### 6. `lib/health/meal-analyzer.ts` com 800+ linhas

Mistura captura de câmera, anti-fraude, hashing SHA-256, chamada de IA, fallback mock, persistência em storage e cálculo de relatório diário. Deveria ser dividido em pelo menos:
- `meal-capture.ts` — captura de câmera e GPS.
- `meal-antifraud.ts` — verificações heurísticas, hash, detecção de screen photo.
- `meal-scoring.ts` — fórmulas `recalculateScore` e `calculateRegularity`.
- `meal-storage.ts` — persistência em Capacitor Preferences.
- `meal-analyzer.ts` — API pública que orquestra os módulos.

### 7. Código duplicado de storage e câmera
Os helpers `getStore`/`setStore` e os capturadores de câmera estão copiados em `meal-analyzer.ts`, `weight-monitor.ts`, `weekly-goals.ts` e `wellbeing-checkin.ts`. Extrair para `lib/health/_storage.ts` e `lib/health/_camera.ts`.

---

## Infraestrutura e operações

### 1. Backup do keystore do Play Store (crítico)

Se o arquivo `android/app/vitascore-release-key.keystore` for perdido, **não é mais possível atualizar o app no Play Store** — a Google exige que atualizações sejam assinadas com a mesma chave. Ações:
- Salvar cópia em cofre criptografado (1Password, Bitwarden) com a senha.
- Manter cópia offline (pendrive em envelope lacrado).
- Considerar habilitar o Play App Signing do Google, que transfere a responsabilidade de guarda para a Google (mas exige upload da chave uma única vez).

### 2. Monitoramento do servidor Vercel

Hoje não há alertas de erro ou quota. Configurar:
- Sentry ou Vercel Observability para capturar exceções do endpoint `/analyze-meal`.
- Alerta de gasto na conta OpenAI/Anthropic (limite mensal).
- Dashboard simples de requests por dia para detectar abuso do `SALUFLOW_APP_TOKEN`.

### 3. Migração para subdomínio próprio

Usar `api.saluflow.com.br` (ou similar) em vez de `saluflow-api.vercel.app` garante que, em caso de troca de provedor, o cliente não precisa de update do app. Configurar CNAME no registrar e atualizar `SALUFLOW_SERVER_URL` em `lib/ai/meal-ai.ts:14`.

---

## TODOs rastreados no código

Busca feita por `TODO|FIXME|XXX|HACK|@deprecated` em `lib/` e `app/`:

| Arquivo | Linha | Descrição |
|---|---|---|
| `lib/health/meal-analyzer.ts` | 467 | Substituir mock por Claude Vision API (já parcialmente feito via `meal-ai.ts`, mas fallback ainda existe). |
| `lib/health/weight-monitor.ts` | 323 | Integrar OCR real para leitura do display da balança (hoje é mock determinístico). |
| `app/monitorar/page.tsx` | 301 | Persistir dados de workout (hoje só em memória da sessão). |

Além disso, há várias referências a "mock" em `lib/mock-data.ts` que alimentam telas de demonstração — esses mocks são intencionais e devem ser substituídos quando as features correspondentes forem conectadas a dados reais do usuário.
