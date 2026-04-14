# 07 — Manual de Operações (SaluFlow)

> Documento operacional do SaluFlow (ex-VitaScore). Cobre o ciclo completo de release do app Android (APK/AAB), deploy do servidor IA na Vercel, monitoramento, rotação de chaves, troubleshooting e rollback.

---

## Sumário

1. [Visão geral da infraestrutura](#1-visão-geral-da-infraestrutura)
2. [Checklist de release do app (Android)](#2-checklist-de-release-do-app-android)
3. [Deploy do servidor IA (Vercel)](#3-deploy-do-servidor-ia-vercel)
4. [Monitoramento](#4-monitoramento)
5. [Rotação de chaves e segredos](#5-rotação-de-chaves-e-segredos)
6. [Troubleshooting](#6-troubleshooting)
7. [Rollback](#7-rollback)
8. [Convenções de versionamento](#8-convenções-de-versionamento)

---

## 1. Visão geral da infraestrutura

| Componente | Tecnologia | Host / Entrega |
|------------|------------|----------------|
| App mobile | Next.js 16 + Capacitor 8 | APK/AAB assinado, GitHub Releases + Play Console Internal Testing |
| Servidor IA | Node + Express 5 + SDKs Anthropic/OpenAI | Vercel (`saluflow-api.vercel.app`) |
| Base de conhecimento | Wikisource (livros de domínio público) | Arquivos estáticos no app |
| Distribuição | GitHub Releases (APK) + Google Play Console (AAB) | Google Play Internal Testing |

- Projeto Vercel: `prj_Slft0fzuXv9kdVO0v4VVbJiXpSQf` (team `jose-goncalves-juniors-projects`)
- Schema de `versionCode`: `MAJOR*10000 + MINOR*100 + PATCH` (ex.: `2.8.0` = `20800`)
- `versionCode` atual: **20800**

---

## 2. Checklist de release do app (Android)

### 2.1. Pré-requisitos

- [ ] Branch limpa (`git status` sem alterações pendentes)
- [ ] `JAVA_HOME` apontando para o JBR do Android Studio (`C:/Program Files/Android/Android Studio/jbr`)
- [ ] Android SDK instalado e configurado
- [ ] Keystore de release disponível (configurado em `android/app/build.gradle`)
- [ ] Servidor IA já deployado com a versão correta do `SALUFLOW_APP_TOKEN`
- [ ] Logado no GitHub CLI (`gh auth status`) e com acesso ao Play Console

### 2.2. Sequência de build

```bash
# 1. Bumpar versão em android/app/build.gradle
#    versionCode = 20801  (ex.: 2.8.1)
#    versionName = "2.8.1"

# 2. Build do Next.js (export estático)
npm run build

# 3. Sincronizar assets com o projeto Android
npx cap sync android

# 4. Gerar o bundle AAB (para Play Console)
cd android
JAVA_HOME="/c/Program Files/Android/Android Studio/jbr" ./gradlew bundleRelease

# 5. Gerar o APK (para distribuição direta via GitHub Releases)
./gradlew assembleRelease

# 6. Voltar para a raiz e copiar artefatos com o nome padronizado
cd ..
cp android/app/build/outputs/bundle/release/app-release.aab saluflow-v2.8.1.aab
cp android/app/build/outputs/apk/release/app-release.apk saluflow-v2.8.1.apk
```

### 2.3. Publicação

```bash
# 7. Tag e push
git tag v2.8.1
git push --tags

# 8. GitHub Release com os dois artefatos
gh release create v2.8.1 \
  saluflow-v2.8.1.aab \
  saluflow-v2.8.1.apk \
  --title "SaluFlow v2.8.1" \
  --notes "Correções e melhorias. Veja DEVELOPMENT_LOG.md para detalhes."

# 9. Upload do AAB no Play Console
#    → Console → SaluFlow → Testes → Testes internos → Criar nova versão
#    → Anexar saluflow-v2.8.1.aab
#    → Preencher notas de release
#    → Revisar e lançar para teste interno
```

### 2.4. Pós-release

- [ ] Validar instalação do APK em dispositivo físico
- [ ] Validar que o app consegue falar com `https://saluflow-api.vercel.app/`
- [ ] Atualizar `DEVELOPMENT_LOG.md` com a entrada da nova versão
- [ ] Comunicar testers internos

---

## 3. Deploy do servidor IA (Vercel)

### 3.1. Deploy padrão

```bash
cd api-server
vercel deploy --prod --yes --token <VERCEL_TOKEN>
```

- Força build e promove automaticamente para produção.
- Leva ~30–60s.
- A URL canônica é `https://saluflow-api.vercel.app/`.

### 3.2. Variáveis de ambiente necessárias

| Nome | Descrição | Fonte |
|------|-----------|-------|
| `ANTHROPIC_API_KEY` | Chave da API Anthropic (Claude) | console.anthropic.com |
| `OPENAI_API_KEY` | Chave da API OpenAI (GPT-4o / mini) | platform.openai.com |
| `SALUFLOW_APP_TOKEN` | Token compartilhado app ↔ servidor | Hex gerado manualmente |

As env vars podem ser setadas de duas formas:

**Via CLI:**
```bash
vercel env add ANTHROPIC_API_KEY production --token <VERCEL_TOKEN>
vercel env add OPENAI_API_KEY production --token <VERCEL_TOKEN>
vercel env add SALUFLOW_APP_TOKEN production --token <VERCEL_TOKEN>
```

**Via API REST:**
```bash
curl -X POST \
  "https://api.vercel.com/v10/projects/prj_Slft0fzuXv9kdVO0v4VVbJiXpSQf/env?teamId=<TEAM_ID>" \
  -H "Authorization: Bearer <VERCEL_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"key":"ANTHROPIC_API_KEY","value":"sk-ant-...","type":"encrypted","target":["production"]}'
```

> **Atenção:** após trocar uma env var, é necessário **redeploy** para o valor novo entrar em vigor — a Vercel injeta envs em build/cold start.

### 3.3. SSO Protection

Por padrão a Vercel ativa SSO Protection no domínio `*.vercel.app`, o que bloqueia chamadas diretas do APK. Para desabilitar:

```bash
curl -X PATCH \
  "https://api.vercel.com/v9/projects/prj_Slft0fzuXv9kdVO0v4VVbJiXpSQf?teamId=<TEAM_ID>" \
  -H "Authorization: Bearer <VERCEL_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"ssoProtection":null}'
```

---

## 4. Monitoramento

### 4.1. Servidor IA (Vercel)

- **Logs:** dashboard Vercel → projeto `saluflow-api` → aba **Logs** (runtime logs em tempo real).
- **Health check:**
  ```bash
  curl https://saluflow-api.vercel.app/
  # → { "status": "ok", "service": "saluflow-api" }
  ```
- **Métricas:** aba **Analytics** da Vercel mostra P50/P95, error rate e invocações.
- **Alertas:** configurar via Vercel → Notifications para `error rate > 1%`.

### 4.2. Client-side (APK)

- Conectar o dispositivo via USB com **debug USB** ligado.
- Abrir Chrome desktop → `chrome://inspect` → selecionar o WebView do SaluFlow.
- Inspecionar o console JavaScript ao vivo (rede, logs, erros).

### 4.3. Play Console

- **Vitals:** monitora ANRs, crashes e startup time.
- **Pre-launch report:** executa o APK em dispositivos reais antes de promover.

---

## 5. Rotação de chaves e segredos

### 5.1. `SALUFLOW_APP_TOKEN`

O token é **hardcoded** no cliente, em `lib/ai/meal-ai.ts`, para proteger o servidor contra chamadas não autorizadas vindas fora do APK. Trocar o token é uma operação de release completa:

1. Gerar um novo valor hex (ex.: `openssl rand -hex 32`)
2. Atualizar `lib/ai/meal-ai.ts` com o novo token
3. Atualizar a env `SALUFLOW_APP_TOKEN` no Vercel (via CLI ou API)
4. **Redeploy** do servidor
5. Bumpar `versionCode`/`versionName` no `android/app/build.gradle`
6. Seguir o checklist da seção 2 para gerar novo APK/AAB
7. Publicar nova versão no Play Console e no GitHub Releases

> Usuários com versões antigas do APK continuarão funcionando **apenas enquanto o token antigo permanecer ativo**. Se o token antigo for revogado, clientes desatualizados receberão `401`.

### 5.2. Chaves Claude / OpenAI

- Gerar nova chave no console da Anthropic / OpenAI
- Atualizar a env via Vercel API ou `vercel env add`
- **Forçar redeploy:** `vercel deploy --prod --yes --token <token>` (obrigatório — env só é lida no cold start)
- Revogar a chave antiga nos dashboards dos provedores
- Não é necessário bumpar versão do app

---

## 6. Troubleshooting

| Sintoma | Causa provável | Correção |
|---------|----------------|----------|
| `401 Token inválido` | `SALUFLOW_APP_TOKEN` no APK difere do servidor | Alinhar versões — ver seção 5.1 |
| `429 Rate limit` | Cliente enviou > 20 req/min | Backoff no cliente; verificar loop de retries |
| `Package name error` no Play Console | Nome de pacote já registrado ou reservado | Ajustar `applicationId` em `android/app/build.gradle` |
| `JAVA_HOME is not set` | Gradle não encontra JDK | `export JAVA_HOME="/c/Program Files/Android/Android Studio/jbr"` |
| Build falha no Gradle | Cache corrompido, libs desalinhadas | `cd android && ./gradlew clean && ./gradlew assembleRelease` |
| Servidor retorna HTML da Vercel (login) | SSO Protection ativo | `curl PATCH /v9/projects/<id> -d '{"ssoProtection":null}'` (seção 3.3) |
| `Cannot resolve capacitor-health-connect` | Plugin não sincronizado | `npx cap sync android` |
| `out/` desatualizado | Esqueceu `npm run build` antes do `cap sync` | Rodar na ordem: build → sync |
| Webview não carrega no APK | `next.config.ts` sem `output: 'export'` | Conferir configuração de export estático |
| Erro `Capacitor plugin XYZ not implemented on web` | Rodando código nativo no `next dev` | Guardar chamadas nativas com `Capacitor.isNativePlatform()` |

---

## 7. Rollback

### 7.1. APK distribuído via GitHub Releases

- Usuários mantêm automaticamente a versão instalada (não há auto-update).
- Para forçar "rollback": publicar uma nova versão com **o código antigo** porém `versionCode` **maior** (ex.: `20800` → `20802`).
- Remover o release quebrado da página de Releases.

### 7.2. Play Console (Testes Internos)

1. Acessar a faixa de **Testes internos**
2. Clicar em **Pausar implantação** na versão defeituosa
3. Criar nova versão baseada no código anterior
4. Bumpar `versionCode` (`+1` ou mais — nunca reutilizar)
5. Fazer upload do novo AAB
6. Publicar — usuários recebem o "rollback" via update normal

### 7.3. Servidor IA (Vercel)

- Vercel mantém histórico de deployments.
- Acesse **Deployments** → selecionar deploy anterior → **Promote to Production**.
- Rollback leva ~10s e não exige rebuild.

---

## 8. Convenções de versionamento

- **`versionName`** (visível ao usuário): `MAJOR.MINOR.PATCH` (ex.: `2.8.0`)
- **`versionCode`** (obrigatório crescente no Play Console): `MAJOR*10000 + MINOR*100 + PATCH`
  - `2.8.0` → `20800`
  - `2.8.1` → `20801`
  - `3.0.0` → `30000`
- **Tags git:** `vMAJOR.MINOR.PATCH` (ex.: `v2.8.1`)
- **Artefatos:** `saluflow-vX.Y.Z.apk` e `saluflow-vX.Y.Z.aab`
- **Major bump:** quando há breaking change de UX, novo módulo ou migração de storage
- **Minor bump:** features novas sem quebrar o existente
- **Patch bump:** bugfixes e hotfixes
