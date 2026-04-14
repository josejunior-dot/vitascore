# 10 — Histórico de Versões (Changelog)

> Registro de todas as versões publicadas do SaluFlow (antes VitaScore). Segue versionamento semântico (`MAJOR.MINOR.PATCH`). As entradas são ordenadas do mais recente para o mais antigo.

---

## Sumário

- [2.8.0 — 2026-04-12](#280--2026-04-12)
- [2.7.0 — 2026-04-12](#270--2026-04-12)
- [2.6.1 — 2026-04-11](#261--2026-04-11)
- [2.6.0 — 2026-04-11](#260--2026-04-11)
- [2.5.0 — 2026-04-10](#250--2026-04-10)
- [2.4.0 — 2026-04-09](#240--2026-04-09)
- [2.3.3 — Wikisource (pré-tag)](#233--wikisource-pré-tag)
- [2.3.2 — Leitor no app](#232--leitor-no-app)
- [2.3.1 — Áudio na biblioteca](#231--áudio-na-biblioteca)
- [2.3.0 — Biblioteca inicial](#230--biblioteca-inicial)
- [2.2.0 — Saúde financeira](#220--saúde-financeira)
- [2.1.0 — Rebranding SaluFlow](#210--rebranding-saluflow)
- [2.0.0 — Compliance regulatório](#200--compliance-regulatório)
- [1.x — Base VitaScore](#1x--base-vitascore)
- [Template para novas versões](#template-para-novas-versões)

---

## [2.8.0] — 2026-04-12

### Adicionado
- **Sistema Noom Color** (`caloricDensity`): classificação verde / amarelo / vermelho por densidade calórica na ficha da refeição.
- **Estimativa de calorias** por foto — nova inferência da IA com valor numérico aproximado.
- **Editar e excluir refeições** no histórico de `/nutricao`.

### Infraestrutura
- Servidor SaluFlow (`api-server/`) redeployado no Vercel com o novo prompt incluindo `caloricDensity` e `calories`.
- Schema JSON e parser (`parseJsonLoose`) atualizados para os dois novos campos.
- Bump `versionCode=20800`, `versionName=2.8.0`.

### Commits relacionados
- `fac95f6` — Bump versionCode para 20800 e versionName para 2.8.0
- `128846d` — Noom Color, calorias estimadas, editar e excluir refeições

---

## [2.7.0] — 2026-04-12

### Adicionado
- **Dicas para equilibrar a refeição** pós-análise: após a IA retornar o resultado, o app exibe sugestões personalizadas (novo módulo `lib/health/meal-tips.ts`).
- Nova seção na ficha da refeição com recomendações do tipo "adicione uma fonte de fibra", "troque o suco por água", etc.

### Commits relacionados
- `081e39a` — Dicas para equilibrar a refeição após análise por IA

---

## [2.6.1] — 2026-04-11

### Corrigido
- **GPS x câmera:** o diálogo de permissão de localização estava colidindo com o diálogo de permissão de câmera no Android, travando o fluxo de captura de refeição. Ordem de solicitação ajustada para pedir GPS **depois** que a câmera já foi autorizada.

### Commits relacionados
- `77a0bf7` — Fix: GPS não colide mais com o diálogo de permissão da câmera

---

## [2.6.0] — 2026-04-11

### Adicionado
- **Servidor SaluFlow como padrão** para análise de refeição: o app deixa de exigir API key do usuário e passa a usar o proxy hospedado em `https://saluflow-api.vercel.app` (GPT-4o mini por padrão).
- Novos model IDs: `server:openai:gpt-4o-mini`, `server:openai:gpt-4o`, `server:claude:claude-haiku-4-5`, `server:claude:claude-sonnet-4-5`.
- Token público embutido no APK (`SALUFLOW_APP_TOKEN`).

### Alterado
- Provider padrão passa de `"claude"` para `"server"`; usuários sem configuração conseguem analisar refeições imediatamente após instalar o app.

### Commits relacionados
- `4956fbd` — Servidor SaluFlow para análise de refeição (padrão)

---

## [2.5.0] — 2026-04-10

### Adicionado
- **Config de IA em `/config`:** usuário pode escolher entre Claude (Anthropic) ou OpenAI para análise de refeição.
- Suporte a múltiplos modelos (`CLAUDE_MODELS`, `OPENAI_MODELS`) com dica de custo por foto.
- API key salva localmente em Capacitor Preferences (nunca sai do device exceto para o provider escolhido).

### Commits relacionados
- `712fc92` — Config de IA: escolher Claude ou OpenAI para análise de refeição

---

## [2.4.0] — 2026-04-09

### Adicionado
- **Biblioteca digital com 50+ livros** de domínio público (`lib/library/books.ts`).
- **2 abas:** "Disponíveis" e "Meus livros".
- **Sistema de status** por livro: não lido, lendo, concluído.
- UI redesenhada com cards, capa e estado persistido.

### Commits relacionados
- `50243f5` — Biblioteca v2.4: 50+ livros, 2 abas e sistema de status

---

## [2.3.3] — Wikisource (pré-tag)

### Alterado
- Fontes dos livros migradas dos **PDFs do MEC** para **Wikisource** (HTML, sem CORS).
- Resolve problemas de carregamento dentro do WebView do Capacitor.

### Commits relacionados
- `e9ea621` — Trocar PDFs do MEC por Wikisource (HTML, sem CORS)

---

## [2.3.2] — Leitor no app

### Adicionado
- **Leitor de livros embutido** via WebView usando Google Docs viewer.
- Usuário não precisa mais abrir app externo para ler.

### Commits relacionados
- `d284857` — Leitor de livros dentro do app (WebView com Google Docs viewer)

---

## [2.3.1] — Áudio na biblioteca

### Adicionado
- Opção de **áudio nativo (TTS)** para ouvir os livros.
- Busca automática por audiobook correspondente.

### Commits relacionados
- `bdaecd5` — Biblioteca: opção de áudio (TTS nativo + busca audiobook)

---

## [2.3.0] — Biblioteca inicial

### Adicionado
- Primeira versão da **biblioteca digital** com 15 livros de domínio público.
- Estrutura base em `lib/library/`.

### Commits relacionados
- `0358021` — Biblioteca digital com 15 livros de domínio público

---

## [2.2.0] — Saúde financeira

### Adicionado
- **Novo pilar: saúde financeira** (`/financeiro`) — baseado na análise estratégica da Fully (Prudential).
- Módulo `lib/health/finance-tracker.ts`.
- **4 novas funcionalidades** inspiradas no benchmark Fully / Vitality.
- Ícone e logo SaluFlow 7x maior em splash, onboarding e home header.

### Documentação
- `ANALISE_FULLY_INSIGHTS.md`
- `BENCHMARK_VITALITY_FULLY.md`
- `MERCADOS_POTENCIAIS.md` — análise honesta de mercados potenciais.

### Commits relacionados
- `796760c` — docs: análise honesta de mercados potenciais
- `e72eb50` — Logo e ícone 7x maior em todo lugar
- `4845537` — 4 novas funcionalidades inspiradas na análise da Fully
- `e87e782` — Pilar de saúde financeira (/financeiro)
- `2ba9e90` — Análise estratégica Fully (Prudential) — insights para SaluFlow
- `d9301e8` — Benchmark Vitality + Fully (Prudential) — material competitivo

---

## [2.1.0] — Rebranding SaluFlow

### Alterado
- **Rebranding completo:** VitaScore → SaluFlow.
- Nova logo (borboleta), novos ícones para todas as plataformas, splash screen, onboarding e header.
- Política de privacidade oficial publicada para Play Store.

### Corrigido
- Logo completa (borboleta + nome) em tamanho correto.
- Health Connect travando em "Verificando..." — timeout de 5s + mensagem de erro clara.

### Commits relacionados
- `d7ef99a` — Logo maior nas telas + ícone Android só com a borboleta
- `83b2625` — Fix: usar logo completa em tamanho correto
- `602c7d6` — Logo borboleta visível no app: splash, onboarding e home header
- `4e0e531` — Logo SaluFlow (borboleta) + ícones para todas as plataformas
- `35cf399` — Rename completo: VitaScore → SaluFlow
- `65d8840` — Release build + política de privacidade para Play Store
- `ae7e323` — Fix: Health Connect travando em 'Verificando...'

---

## [2.0.0] — Compliance regulatório

### Adicionado
- **Check-in WHO-5** (bem-estar mental) — `lib/health/wellbeing-checkin.ts`.
- **Dashboard NR-1** com compliance RN 499 da ANS.
- **Metas semanais personalizadas** no modelo Prudential Vitality — `lib/health/weekly-goals.ts`.
- **Página `/config` completa** com todas as configurações funcionais.
- **Estratégia de guerra** — plano tático para equipe de 4 pessoas.

### Documentação
- Documentação estratégica v2.0 reescrita com análise regulatória real (RN 498/499 ANS, NR-1, LGPD).
- `PLANO_DE_NEGOCIOS.md`, `PITCH_COMERCIAL.md`, `ROI_CALCULATOR.md`, `PITCH_CORRETORAS.md`, `TOOLKIT_VENDAS.md`.
- Pitch executivo para seguradoras em PDF.

### Commits relacionados
- `01dd5d1` — v2.0 — Documentação estratégica reescrita com análise regulatória real
- `079fc2f` — Check-in WHO-5 + Dashboard NR-1 + compliance RN 499
- `f4ed63c` — Metas semanais personalizadas (modelo Prudential Vitality)
- `b330dcb` — Estratégia de guerra — plano tático para equipe de 4 pessoas
- `f0842a4` — Configurações funcionais + página /config completa
- `8906826` — Limpeza para distribuição: remove arquivos de exemplo
- `e8b6f6a` — Pitch executivo para seguradoras (PDF) + pitch para corretoras + toolkit
- `ca9ce5f` — Pitch para corretoras + toolkit de vendas
- `fec7f9c` — Documentação estratégica: plano de negócios, pitch comercial e ROI

---

## [1.x] — Base VitaScore

### 1.3.0 — Relatórios e LGPD
- Relatório de RH para contratante.
- Desconto coparticipação (`lib/health/copay-discount.ts`).
- Selo LGPD e exportação de dados (`lib/health/data-export.ts`).
- Commit: `8a5dcae`

### 1.2.0 — Redesign Google Fit
- Redesign completo: tema light Google Fit + monitoramento com mapa GPS.
- Commit: `7f8de83`

### 1.1.0 — API server
- Primeira versão do `api-server/` (Express) para análise de fotos com Claude Vision.
- Commits: `5622c79`, `e763a32`

### 1.0.0 — Lançamento VitaScore
- App completo de hábitos de vida com desconto em seguro.
- Módulos iniciais: análise de refeição, monitor de peso, monitor de sono, monitor de tela.
- Commit: `c3443da`

### 0.1.0 — Scaffold
- Commits: `648913b`, `1e0d8c2`

---

## Template para novas versões

Ao lançar uma nova versão, copie o bloco abaixo e preencha:

```markdown
## [X.Y.Z] — YYYY-MM-DD

### Adicionado
- Novas features visíveis para o usuário final.

### Alterado
- Mudanças de comportamento em features existentes.

### Corrigido
- Bugs resolvidos.

### Removido
- Funcionalidades ou dependências retiradas.

### Infraestrutura
- Mudanças no `api-server/`, deploy, Android Gradle, CI, etc.
- Bump de versionCode / versionName quando aplicável.

### Documentação
- Novos docs ou atualizações relevantes em `/docs`.

### Commits relacionados
- `hash` — título do commit
```

### Regras
- Cada versão **precisa** de tag `vX.Y.Z` no git (`git tag vX.Y.Z && git push --tags`).
- Seções vazias podem ser omitidas.
- Breaking changes: destacar em **negrito** e sinalizar migração necessária.
- Toda release pública precisa de entrada neste arquivo antes do bump de versão.

---

_Última atualização: 2026-04-12_
