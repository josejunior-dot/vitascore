# SaluFlow — Guia de Instalação

> App mobile-first de saúde corporativa (ex-VitaScore) — Next.js 16 + Capacitor 8 para Android, com servidor de IA separado em Vercel.

---

## Sumário

- [1. Pré-requisitos](#1-pré-requisitos)
- [2. Quick Start (modo web / desenvolvimento)](#2-quick-start-modo-web--desenvolvimento)
- [3. Variáveis de ambiente](#3-variáveis-de-ambiente)
- [4. Build mobile Android (AAB para Play Store)](#4-build-mobile-android-aab-para-play-store)
- [5. Build APK alternativo (distribuição direta)](#5-build-apk-alternativo-distribuição-direta)
- [6. Servidor de IA (`api-server/`)](#6-servidor-de-ia-api-server)
- [7. Deploy](#7-deploy)
- [8. Problemas comuns](#8-problemas-comuns)
- [9. Checklist final antes de publicar](#9-checklist-final-antes-de-publicar)

---

## 1. Pré-requisitos

| Ferramenta | Versão | Uso |
|---|---|---|
| Node.js | **20 LTS ou superior** | Next.js 16, Capacitor CLI, `api-server/` |
| npm | 10+ | Gerenciador de pacotes |
| Android Studio | 2024.1+ (Koala ou mais novo) | SDK, emulador, JDK embutido |
| JDK | **17** (já incluso no Android Studio) | Compilar o app Android |
| Gradle Wrapper | **8.14** (provisionado pelo projeto) | Não precisa instalar — `gradlew` baixa sozinho |
| Capacitor CLI | 8.x (já em `devDependencies`) | `npx cap sync / open` |
| Vercel CLI | opcional | Só se for fazer deploy manual do `api-server/` |
| Git Bash / PowerShell | qualquer | Windows — use Git Bash para os comandos Unix-like |

**Variáveis de ambiente de sistema (Windows):**

```bash
# Aponte JAVA_HOME para o JDK embutido no Android Studio
setx JAVA_HOME "C:\Program Files\Android\Android Studio\jbr"
setx ANDROID_HOME "%LOCALAPPDATA%\Android\Sdk"
```

Feche e reabra o terminal para aplicar.

---

## 2. Quick Start (modo web / desenvolvimento)

```bash
# 1. Clone
git clone <repo-url> saluflow
cd saluflow

# 2. Instale dependências do app (raiz)
npm install

# 3. Rode em modo dev
npm run dev
```

O app abre em `http://localhost:3000`. Use o DevTools do Chrome em modo responsivo (iPhone 14 Pro ou similar) para simular o mobile. Algumas APIs nativas (Camera, Geolocation, Health Connect) só funcionam no APK instalado — no browser caem em fallback ou erro silencioso.

> **Atenção:** este não é o Next.js padrão. O projeto está travado em `output: "export"` (ver `next.config.ts`) porque o destino final é um bundle estático consumido pelo Capacitor. Não use rotas API do Next, não use `next/image` com loader remoto, não use Server Actions — nada disso será empacotado. Toda a lógica de backend vive em `api-server/`.

---

## 3. Variáveis de ambiente

### 3.1. App cliente (raiz)

O app cliente **não precisa** de `.env` local. Ele consulta o endpoint fixo em `lib/health/api-config.ts`:

```
https://saluflow-api.vercel.app
```

Se quiser apontar para um servidor local durante o desenvolvimento, edite temporariamente `lib/health/api-config.ts` para `http://10.0.2.2:3333` (emulador Android) ou o IP da sua máquina na LAN (dispositivo físico).

### 3.2. Servidor de IA (`api-server/.env`)

Crie `api-server/.env` (NÃO comitar):

```bash
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
SALUFLOW_APP_TOKEN=um-token-qualquer-secreto
PORT=3333
```

| Variável | Obrigatória | Descrição |
|---|---|---|
| `ANTHROPIC_API_KEY` | sim (se usar Claude) | SDK `@anthropic-ai/sdk` lê automaticamente |
| `OPENAI_API_KEY` | sim (padrão) | Provider default é `openai` / `gpt-4o-mini` |
| `SALUFLOW_APP_TOKEN` | recomendado em produção | Header `x-saluflow-token` que o APK envia. Se vazio, o servidor libera tudo (modo dev) |
| `PORT` | não | Default `3333` |

No Vercel, adicione as mesmas variáveis em **Project Settings → Environment Variables**.

---

## 4. Build mobile Android (AAB para Play Store)

O fluxo é sempre: **build Next estático → sync Capacitor → gradle**.

```bash
# 1. Gera o bundle estático em out/
npm run build

# 2. Copia out/ para android/app/src/main/assets/public e sincroniza plugins
npx cap sync android

# 3. Compila o AAB assinado
cd android
./gradlew bundleRelease
```

Saída: `android/app/build/outputs/bundle/release/app-release.aab`

> No **Windows Git Bash**, se `./gradlew` reclamar de line endings ou permissão, use:
> ```bash
> cmd //c "gradlew.bat bundleRelease"
> ```
> ou rode diretamente no PowerShell:
> ```powershell
> .\gradlew.bat bundleRelease
> ```

### 4.1. Atalho com npm script

Existe um atalho que faz `next build + cap sync + cap open` (abre o Android Studio na sequência):

```bash
npm run cap:android
```

Depois é só clicar em **Build → Generate Signed Bundle / APK** no Android Studio.

### 4.2. Keystore (já provisionado no repo)

O keystore de release fica em `android/app/vitascore-release-key.jks`, alias `vitascore`, válido até **2053**, e está referenciado diretamente em `android/app/build.gradle`:

```gradle
signingConfigs {
    release {
        storeFile file('vitascore-release-key.jks')
        storePassword 'vitascore2026'
        keyAlias 'vitascore'
        keyPassword 'vitascore2026'
    }
}
```

> **Importante:** nunca gere um novo keystore — a Play Store rejeitará qualquer upload assinado com assinatura diferente da inicial. Se o `.jks` for perdido, o app precisa ser re-publicado com outro `applicationId`.

### 4.3. Versionamento (versionCode / versionName)

Edite em `android/app/build.gradle` antes de cada release:

```gradle
versionCode 20800      // atual — incrementar sempre
versionName "2.8.0"    // visível ao usuário
```

Convenção do projeto: `versionCode = versionName` achatado (`2.8.0` → `20800`).

---

## 5. Build APK alternativo (distribuição direta)

Para testar fora da Play Store (instalação manual, WhatsApp, sideload):

```bash
npm run build
npx cap sync android
cd android
./gradlew assembleRelease
```

Saída: `android/app/build/outputs/apk/release/app-release.apk`

O projeto costuma arquivar uma cópia na raiz (`saluflow-v2.8.0.apk`, `saluflow-v2.8.0.aab`) após cada build oficial.

---

## 6. Servidor de IA (`api-server/`)

Subprojeto **Express 5 + Anthropic SDK + OpenAI SDK**. Roda em `api-server/server.js` com 2 endpoints:

- `POST /analyze-meal` — análise de foto de refeição (prompt Noom Color, score 0–100)
- `POST /read-scale` — OCR de display de balança

Com rate limit em memória (20 req/min por IP) e autenticação por header `x-saluflow-token`.

### 6.1. Rodar local

```bash
cd api-server
npm install
# crie o .env (ver seção 3.2)
node server.js
# → SaluFlow API rodando em http://localhost:3333
```

Health check: `GET http://localhost:3333/` retorna JSON com providers disponíveis.

### 6.2. Deploy na Vercel

O `api-server/vercel.json` já está configurado para rotear tudo para `server.js` como `@vercel/node`:

```bash
cd api-server
vercel --prod
```

Adicione as 3 variáveis de ambiente no painel da Vercel antes do primeiro deploy. O endpoint de produção esperado pelo APK é `https://saluflow-api.vercel.app`.

---

## 7. Deploy

| Componente | Onde | Como |
|---|---|---|
| **App cliente** (APK/AAB) | Google Play Console → Internal Testing | Upload do `app-release.aab` |
| **Servidor de IA** | Vercel (`saluflow-api`) | `vercel --prod` ou git push (se conectado) |
| **Site institucional** (páginas em `app/landing`) | *não é publicado separadamente* — faz parte do bundle | — |

Fluxo recomendado para publicar uma nova versão:

1. Incrementar `versionCode` / `versionName` em `android/app/build.gradle`
2. `npm run build && npx cap sync android`
3. `cd android && ./gradlew bundleRelease`
4. Upload do `.aab` em Play Console → Internal Testing
5. Se mexeu no servidor de IA, `cd api-server && vercel --prod`
6. Testar no dispositivo real antes de promover para produção

---

## 8. Problemas comuns

### 8.1. "JAVA_HOME is not set" ao rodar `./gradlew`

O Gradle não está achando o JDK. Aponte para o JDK do Android Studio:

```bash
# Git Bash
export JAVA_HOME="/c/Program Files/Android/Android Studio/jbr"

# PowerShell
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
```

Para persistir, use `setx JAVA_HOME "..."` no CMD (seção 1) e reabra o terminal.

### 8.2. Gradle trava / timeout no primeiro build

O primeiro `./gradlew bundleRelease` baixa ~500 MB de dependências (Android SDK, AGP, Kotlin). Se cair:

```bash
./gradlew --stop       # mata daemons travados
./gradlew bundleRelease --no-daemon --refresh-dependencies
```

Verifique também `android/gradle.properties`:

```properties
org.gradle.jvmargs=-Xmx1536m
```

Em máquinas com 16 GB+ de RAM, suba para `-Xmx4g` para ganhar velocidade.

### 8.3. CORS bloqueando chamadas no modo web

Rodando `npm run dev` no browser, as chamadas para `https://saluflow-api.vercel.app` dão CORS error? O servidor já libera com `app.use(cors())`, então o problema geralmente é:

- Você apontou para `localhost:3333` mas o servidor local não está rodando
- O navegador está em HTTPS e o servidor local está em HTTP (misto bloqueado)

Solução: rode tudo HTTP no dev (`http://localhost:3000` no cliente) ou use o endpoint Vercel mesmo durante o desenvolvimento.

### 8.4. "Permission denied" ao rodar `./gradlew` no Git Bash

```bash
chmod +x android/gradlew
```

Ou use `cmd //c "gradlew.bat ..."` como fallback.

### 8.5. Capacitor não encontra `out/`

O `npm run build` falhou silenciosamente ou o `next.config.ts` foi alterado. Confirme que tem `output: "export"` e que a pasta `out/` existe antes de rodar `npx cap sync`.

### 8.6. Câmera / Health Connect não funcionam no emulador

Emulador Android não expõe Health Connect e tem câmera limitada. Sempre teste essas features em **dispositivo físico** com o APK instalado.

### 8.7. `lucide-react` quebra no build

O projeto usa `lucide-react@^1.8.0` (não a linha 0.x). Se der erro de ícone inexistente, confira se o nome do componente bate com o da versão 1.x — alguns ícones foram renomeados.

---

## 9. Checklist final antes de publicar

- [ ] `versionCode` e `versionName` incrementados em `android/app/build.gradle`
- [ ] `npm run build` passou sem warnings críticos
- [ ] `npx cap sync android` executado após o build
- [ ] AAB gerado em `android/app/build/outputs/bundle/release/app-release.aab`
- [ ] APK de teste instalado em dispositivo físico e smoke test feito (câmera, análise de refeição, login, check-in WHO-5)
- [ ] Servidor Vercel respondendo em `https://saluflow-api.vercel.app/` (health check)
- [ ] `SALUFLOW_APP_TOKEN` sincronizado entre o APK (`lib/health/api-config.ts`) e o Vercel
- [ ] Política de privacidade atualizada (`docs/PRIVACY_POLICY.md`) — obrigatório para Play Store
- [ ] Textos de NR-1 e LGPD revisados (regulação específica — ver `~/.claude/memory/project_vitascore_regras.md`)
