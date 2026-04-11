# SaluFlow

> Plataforma de monitoramento de habitos de vida com desconto verificavel em planos de saude

SaluFlow e um aplicativo mobile-first que monitora 6 pilares de saude, gera um score verificavel (0-1000) e conecta habitos saudaveis a descontos reais no plano de saude. Desenvolvido com verificacao anti-fraude, conformidade LGPD e relatorios para RH.

## Visao Geral

O SaluFlow transforma dados reais de saude (sono, atividade fisica, nutricao, peso, tempo de tela e check-ups) em um score unico que desbloqueia descontos progressivos no plano de saude. A plataforma valida cada dado com ate 5 camadas anti-fraude, garantindo que apenas habitos genuinos gerem beneficios.

## Stack Tecnologica

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | Next.js 16 + TypeScript + Tailwind CSS + shadcn/ui + Framer Motion |
| **Mobile** | Capacitor (Android + iOS) |
| **Saude** | Health Connect (Android) + HealthKit (iOS) |
| **IA** | Claude Vision (Haiku) para analise de fotos de refeicoes |
| **Graficos** | Recharts |
| **Verificacao** | SHA-256, GPS, deteccao de fraude por IA |

## Funcionalidades

### 14 Telas

| Rota | Descricao |
|------|-----------|
| `/` | Landing page / tela inicial |
| `/home` | Dashboard principal com score e metricas |
| `/onboarding` | Fluxo de cadastro e configuracao inicial |
| `/monitorar` | Painel de monitoramento dos 6 pilares |
| `/atividade` | Detalhes de atividade fisica |
| `/sono` | Monitoramento e historico de sono |
| `/nutricao` | Analise nutricional com IA (foto de refeicoes) |
| `/peso` | Acompanhamento de peso corporal |
| `/digital` | Tempo de tela e bem-estar digital |
| `/desafios` | Desafios e gamificacao |
| `/seguro` | Simulador de desconto no plano de saude |
| `/relatorio` | Relatorios exportaveis para RH |
| `/perfil` | Configuracoes e dados do usuario |

### 6 Pilares de Saude

| Pilar | Pontuacao Maxima | Fonte de Dados | Verificacao |
|-------|-----------------|----------------|-------------|
| Atividade Fisica | 250 pts | Health Connect / HealthKit | Sensores + GPS |
| Sono | 200 pts | Health Connect / HealthKit | Sensores do dispositivo |
| Nutricao | 200 pts | Foto com IA (Claude Vision) | Analise de imagem + timestamp |
| Peso | 150 pts | Balanca / manual | Consistencia temporal |
| Bem-estar Digital | 100 pts | Screen Time API | Dados do sistema |
| Check-up | 100 pts | Upload de exames | Verificacao documental |

### Sistema Anti-Fraude (5 camadas)

1. **Hash SHA-256** — Cada registro de saude recebe um hash unico que impede alteracao retroativa
2. **Validacao GPS** — Atividades fisicas sao correlacionadas com dados de localizacao
3. **Consistencia temporal** — Algoritmo detecta padroes impossiveis (ex: 50.000 passos em 1 hora)
4. **Analise de IA** — Claude Vision valida fotos de refeicoes contra manipulacao
5. **Cross-reference** — Dados de diferentes sensores sao cruzados para confirmar veracidade

## Estrutura do Projeto

```
vitascore/
├── app/                    # 14 paginas (Next.js App Router)
│   ├── home/              # Dashboard principal
│   ├── onboarding/        # Fluxo inicial
│   ├── monitorar/         # Painel de monitoramento
│   ├── atividade/         # Atividade fisica
│   ├── sono/              # Monitoramento de sono
│   ├── nutricao/          # Analise nutricional com IA
│   ├── peso/              # Peso corporal
│   ├── digital/           # Tempo de tela
│   ├── desafios/          # Gamificacao
│   ├── seguro/            # Simulador de desconto
│   ├── relatorio/         # Relatorios para RH
│   └── perfil/            # Configuracoes
├── components/             # Componentes React
│   ├── cards/             # Cards de metricas
│   ├── charts/            # Graficos (Recharts)
│   ├── gamification/      # Desafios e conquistas
│   ├── layout/            # AppShell, BottomNav
│   ├── score/             # SaluFlow Ring, Counter, Badge
│   └── ui/                # shadcn/ui components
├── hooks/                  # Custom hooks
│   ├── useActivity.ts     # Hook de atividade fisica
│   ├── useHealthData.ts   # Hook central de saude
│   ├── useScreenTime.ts   # Hook de tempo de tela
│   ├── useSleep.ts        # Hook de sono
│   ├── useSleepMonitor.ts # Monitor de sono em tempo real
│   └── useSaluFlow.ts    # Calculo do score
├── lib/
│   ├── health/            # Modulos de saude
│   │   ├── health-connect.ts  # Integracao Health Connect (Android)
│   │   ├── healthkit.ts       # Integracao HealthKit (iOS)
│   │   ├── meal-analyzer.ts   # Analise de refeicoes com IA
│   │   ├── sleep-monitor.ts   # Monitor de sono
│   │   ├── screen-monitor.ts  # Monitor de tempo de tela
│   │   ├── weight-monitor.ts  # Monitor de peso
│   │   ├── copay-discount.ts  # Calculo de desconto
│   │   └── data-export.ts     # Exportacao de dados
│   ├── reports/           # Geracao de relatorios
│   ├── vitascore.ts       # Logica central do score
│   └── utils.ts           # Utilitarios
├── api-server/            # API de IA (Express + Claude)
│   └── server.js          # Servidor para analise de fotos
├── android/               # Projeto Android (Capacitor)
└── docs/                  # Documentacao estrategica
```

## Como Rodar

### Desenvolvimento (Web)

```bash
npm install
npm run dev
# Acesse http://localhost:3000
```

### Build para Android

```bash
npm run build
npx cap sync android
npx cap open android

# Ou gerar APK diretamente:
cd android && ./gradlew assembleDebug
```

### API de IA (analise de fotos)

```bash
cd api-server
npm install
ANTHROPIC_API_KEY=sk-... node server.js
```

A API roda na porta 3001 e expoe o endpoint para analise de fotos de refeicoes via Claude Vision (Haiku).

## Documentacao

| Documento | Descricao |
|-----------|-----------|
| [Plano de Negocios](docs/PLANO_DE_NEGOCIOS.md) | Modelo de negocio, mercado-alvo e estrategia |
| [Pitch Comercial](docs/PITCH_COMERCIAL.md) | Apresentacao para investidores e clientes |
| [Calculadora de ROI](docs/ROI_CALCULATOR.md) | Retorno sobre investimento por perfil de cliente |

## Modelo de Negocio

| Canal | Precificacao | Margem |
|-------|-------------|--------|
| **B2B (Empresas)** | R$4/funcionario ativo/mes | 85%+ |
| **B2B2C (Seguradoras)** | R$2/vida ativa + success fee | 85%+ |
| **Corretoras** | Comissao 20-30% sobre receita gerada | 100% (sem custo) |

ROI medio para empresas: **40x** (payback em 9 dias).

## Licenca

Proprietario — Todos os direitos reservados.

---

Desenvolvido com [Claude Code](https://claude.ai/code)
