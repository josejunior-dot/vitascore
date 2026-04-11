# VitaScore — Plano de Negocios

> Plataforma de monitoramento de habitos de vida com desconto verificavel em planos de saude

**Versao:** 1.0
**Data:** Abril 2026
**Confidencial**

---

## Sumario Executivo

O mercado de saude suplementar no Brasil atende mais de 50 milhoes de beneficiarios e movimenta R$290 bilhoes por ano. Apesar desse volume, o setor enfrenta uma crise estrutural: a sinistralidade media das operadoras ultrapassa 85%, os reajustes anuais variam entre 15% e 25%, e nao existe nenhum mecanismo concreto que recompense o beneficiario que cuida da propria saude. O resultado e um ciclo vicioso — operadoras aumentam precos, empresas cortam beneficios, funcionarios perdem cobertura, e o sistema todo perde eficiencia.

O VitaScore resolve esse problema criando uma ponte verificavel entre habitos saudaveis e descontos financeiros reais. A plataforma monitora 6 pilares de saude — atividade fisica, alimentacao, sono, hidratacao, saude mental e check-ups medicos — gerando um score de 0 a 1000 pontos. O diferencial critico e o sistema de verificacao anti-fraude com 5 camadas (camera nativa, deteccao de moire, validacao de timestamp, GPS e hash SHA-256), que produz dados que a seguradora pode auditar e confiar. Nao se trata de gamificacao superficial — e um sistema de dados verificaveis com trilha de auditoria criptografica.

O modelo de negocio e validado globalmente pela Discovery Vitality, programa sul-africano que opera em 40 paises, atende 40 milhoes de membros e faz parte de um grupo avaliado em US$10 bilhoes. No Brasil, nao existe concorrente direto — Gympass foca em academia, Zenklub em terapia, Vitalk em chatbot de saude mental. Nenhum integra os 6 pilares, nenhum tem verificacao anti-fraude, nenhum conecta habitos a descontos no plano. O VitaScore e o primeiro a oferecer essa proposta completa no mercado brasileiro, com potencial de capturar um mercado de R$2,4 bilhoes.

---

## 1. O Problema

### 1.1 Para a Seguradora / Operadora

O setor de saude suplementar brasileiro enfrenta desafios estruturais que ameacam sua sustentabilidade:

- **Sinistralidade crescente (85%+):** A cada R$100 recebidos em mensalidades, R$85 ou mais sao gastos com assistencia. Margem operacional negativa em diversas operadoras
- **Beneficiarios sem incentivo para prevencao:** O modelo atual trata todos igualmente — quem se exercita diariamente paga o mesmo que quem tem habitos sedentarios
- **Dados de saude nao verificaveis:** Apps de wellness existentes geram dados auto-reportados, facilmente manipulaveis, sem valor atuarial
- **Reajustes altos causam cancelamentos:** Aumentos de 15-25% ao ano geram churn de 8-12% na carteira, especialmente em PMEs
- **Regulacao da ANS limita diferenciacao:** Operadoras nao conseguem premiar bons habitos porque nao tem dados confiaveis para justificar descontos
- **Falta de dados preditivos:** Sem monitoramento continuo, a operadora so descobre problemas quando o sinistro ja ocorreu

### 1.2 Para a Empresa (Contratante)

As empresas brasileiras enfrentam pressao crescente no custo de saude dos colaboradores:

- **Reajustes anuais de 15-25% no plano de saude:** O plano de saude e o segundo maior custo de RH, atras apenas da folha de pagamento
- **Absenteismo por doencas evitaveis:** Dores nas costas, problemas metabolicos, ansiedade e depressao representam 60%+ dos afastamentos
- **NR-1 (2025) exige acoes de saude mental:** A nova regulamentacao obriga empresas a monitorar e atuar sobre riscos psicossociais — sem ferramenta adequada para isso
- **Presenteismo:** Funcionario no trabalho mas improdutivo por problemas de saude custa ate 3x mais que o absenteismo (estimativa de R$42 bilhoes/ano no Brasil)
- **Dificuldade de mensurar ROI de wellness:** Programas de qualidade de vida existem, mas nao geram dados que comprovem retorno sobre investimento
- **Retencao de talentos:** Beneficios de saude inovadores sao diferencial competitivo no mercado de trabalho

### 1.3 Para o Beneficiario

O individuo que cuida da saude nao recebe nenhum reconhecimento financeiro:

- **Coparticipacao cara sem beneficio por ser saudavel:** Paga-se o mesmo valor independente do estilo de vida
- **Sem retorno financeiro por manter bons habitos:** Ir a academia, comer bem e dormir adequadamente nao reduz a mensalidade
- **Dados de saude fragmentados:** Informacoes espalhadas entre Apple Health, Google Fit, MyFitnessPal, apps de meditacao — nenhum consolida tudo
- **Falta de motivacao sustentavel:** Apps de habitos funcionam por 2-3 semanas; incentivo financeiro real muda o jogo
- **Invisibilidade para o sistema:** A operadora nao sabe (e nao tem como saber) que voce e um beneficiario de baixo risco

---

## 2. A Solucao

### 2.1 O que e o VitaScore

O VitaScore e uma plataforma que transforma habitos de saude verificados em um score de 0 a 1000 pontos, conectando esse score diretamente a descontos no plano de saude. O aplicativo monitora 6 pilares fundamentais de saude, utiliza inteligencia artificial para verificar a autenticidade dos dados e gera uma trilha de auditoria criptografica que permite a seguradora confiar nos dados reportados.

O funcionamento e simples para o usuario:

1. **Registra habitos:** Tira foto da refeicao, registra copo de agua, sincroniza dados de atividade fisica e sono via wearable
2. **Recebe pontos verificados:** Cada habito gera pontos proporcionais, validados por IA e assinados com hash SHA-256
3. **Acumula score mensal:** O score consolidado determina a faixa de desconto (Bronze, Prata, Ouro, Diamante)
4. **Recebe desconto real:** O desconto e aplicado diretamente na mensalidade ou coparticipacao do plano de saude

### 2.2 Os 6 Pilares de Saude

| Pilar | Pontos Max | Fonte de Dados | Metodo de Verificacao |
|-------|-----------|----------------|----------------------|
| **Atividade Fisica** | 250 pts | Health Connect / HealthKit / wearables | Dados do sensor + GPS + duracao minima |
| **Alimentacao** | 200 pts | Foto da refeicao (camera nativa) | IA (Claude Vision) + deteccao moire + timestamp |
| **Hidratacao** | 100 pts | Registro manual + foto do copo | Padrao temporal + limite diario + foto verificada |
| **Sono** | 200 pts | Health Connect / HealthKit / wearable | Dados do sensor + consistencia temporal |
| **Saude Mental** | 150 pts | Tempo de tela + registro de humor + meditacao | Screen Time API + consistencia + padrao |
| **Check-ups** | 100 pts | Upload de exames + data da consulta | OCR + validacao de data + deduplicacao |

**Faixas de Score:**

| Faixa | Score | Desconto Sugerido | Beneficio |
|-------|-------|-------------------|-----------|
| Diamante | 800-1000 | 15-20% | Desconto maximo + beneficios extras |
| Ouro | 600-799 | 10-15% | Desconto significativo |
| Prata | 400-599 | 5-10% | Desconto moderado |
| Bronze | 200-399 | 2-5% | Desconto inicial |
| Iniciante | 0-199 | 0% | Sem desconto, incentivo a comecar |

### 2.3 Sistema de Verificacao Anti-Fraude

Este e o diferencial mais critico do VitaScore. Sem verificacao confiavel, nenhuma seguradora aceitaria basear descontos em dados auto-reportados. O sistema opera em 5 camadas:

**Camada 1 — Camera Nativa Obrigatoria**
- Fotos de refeicoes e hidratacao so sao aceitas via camera nativa do dispositivo (nao galeria)
- Impede envio de imagens baixadas da internet ou editadas

**Camada 2 — Deteccao de Moire**
- Algoritmo de analise de padroes moire detecta fotos tiradas de telas (monitor, celular, tablet)
- Impede o usuario de fotografar a tela de outro dispositivo mostrando uma refeicao

**Camada 3 — Validacao de Timestamp e Metadata**
- Cada registro e carimbado com timestamp do dispositivo e do servidor
- Metadados EXIF sao verificados para consistencia
- Registros fora de janela horaria plausivel sao rejeitados (ex: almoco as 3h da manha)

**Camada 4 — Geolocalizacao (GPS)**
- Coordenadas GPS sao registradas no momento da captura
- Permite cruzar com padroes do usuario (mesma cidade, mesma regiao)
- Anomalias sao sinalizadas para revisao

**Camada 5 — Hash SHA-256 e Trilha de Auditoria**
- Todos os dados verificados recebem hash SHA-256 imutavel
- Qualquer alteracao posterior invalida o hash
- A seguradora pode auditar qualquer registro a qualquer momento
- Trilha completa: dado bruto → verificacao IA → score → hash → registro

**Camada Adicional — Deteccao de Duplicatas**
- IA identifica fotos identicas ou muito similares enviadas em dias diferentes
- Previne reuso de registros antigos

### 2.4 Arquitetura Tecnica

O VitaScore foi construido com stack moderna, otimizada para performance e compliance:

- **Frontend:** Next.js 16 + React 19 + TypeScript + Tailwind CSS + shadcn/ui
- **Mobile:** Capacitor (Android + iOS a partir de uma unica codebase web)
- **Integracao de Saude:** Health Connect (Android) + HealthKit (iOS)
- **Armazenamento:** Dados sensiveis armazenados localmente no dispositivo (LGPD by design)
- **IA para Verificacao:** Claude Vision API para analise de fotos de refeicoes
- **Seguranca:** Hash SHA-256 em todos os dados verificados, criptografia em transito e em repouso
- **API Backend:** Node.js com Prisma 7 + SQLite (adaptavel para PostgreSQL em producao)
- **Infraestrutura:** Deploy em Vercel (frontend) + servidor dedicado (API de IA)

**Principios de Arquitetura:**
- Privacy-first: dados sensiveis nunca saem do dispositivo sem consentimento explicito
- LGPD compliant: consentimento granular, direito ao esquecimento, portabilidade
- Auditavel: cada ponto do score pode ser rastreado ate o dado bruto original
- Escalavel: arquitetura serverless permite crescer de 100 para 1M de usuarios sem reescrita

---

## 3. Modelo de Negocio

### 3.1 Fontes de Receita

| Fonte | Modelo | Valor Estimado | Margem |
|-------|--------|----------------|--------|
| SaaS por vida ativa | R$/vida ativa/mes | R$3-5 | 90%+ |
| Success fee | % da economia em sinistros | 10-20% | 95%+ |
| Consultoria de implantacao | Setup por empresa | R$2.000-10.000 | 70% |
| White label | Licenciamento para seguradoras | Sob consulta | 85%+ |
| Dados anonimizados | Insights atuariais agregados | R$0,50/vida/mes | 95%+ |

### 3.2 Modelo de Precificacao

**Para Empresas (B2B) — Canal Principal Inicial:**

| Item | Valor |
|------|-------|
| Mensalidade por funcionario ativo | R$4,00 |
| Definicao de "ativo" | Cumpriu 3 de 5 criterios de engajamento no mes |
| Funcionario inativo | R$0,00 (nao cobra) |
| Setup (ate 100 funcionarios) | R$2.000 |
| Setup (101-500 funcionarios) | R$5.000 |
| Setup (500+ funcionarios) | R$10.000 |
| Contrato minimo | 12 meses |
| Piloto gratuito | 3 meses, ate 50 funcionarios |

**Criterios de engajamento (precisa cumprir 3 de 5):**
1. Registrou atividade fisica 3+ dias na semana
2. Registrou 3+ refeicoes verificadas na semana
3. Registrou hidratacao 5+ dias na semana
4. Sincronizou dados de sono 5+ dias na semana
5. Completou check-in de saude mental semanal

**Para Seguradoras (B2B2C) — Canal de Escala:**

| Item | Valor |
|------|-------|
| Mensalidade por vida ativa | R$2,00 (volume 10K+ vidas) |
| Success fee | 10-20% da economia comprovada em sinistros |
| White label | Licenciamento anual sob consulta |
| Integracao com sistemas | Inclusa no contrato |
| Dashboard atuarial | Incluso |
| Contrato minimo | 24 meses |

**Para Corretoras de Seguros (Canal de Distribuicao):**

| Item | Valor |
|------|-------|
| Comissao sobre receita | 20-30% (recorrente enquanto o cliente ativo) |
| Material de vendas | Incluso |
| Treinamento | Incluso (presencial ou remoto) |
| Dashboard de acompanhamento | Incluso |
| Suporte ao corretor | Dedicado |
| Bonificacao por meta | Ate 5% adicional |

### 3.3 Cadeia de Valor

```
SEGURADORA                    EMPRESA                     FUNCIONARIO
    |                            |                            |
    |  Oferece desconto de       |  Contrata VitaScore        |  Usa o app diariamente
    |  5-20% no plano para       |  como beneficio             |  e acumula pontos
    |  beneficiarios com         |  (R$4/vida ativa/mes)       |
    |  score verificado          |                            |  Recebe desconto real
    |                            |  Recebe: reducao de         |  no plano de saude
    |  Recebe: reducao de        |  sinistralidade,            |  (5-20% da mensalidade)
    |  sinistralidade de         |  dados NR-1,                |
    |  5-15% (comprovada)        |  menos absenteismo          |  Economia media:
    |                            |                            |  R$50-150/mes
    |  ROI: 3-8x o custo         |  ROI: 2-5x o custo          |
    |  do programa               |  do programa               |
    |                            |                            |
    +------- VITASCORE ---------+------- VITASCORE ----------+
              |
              |  Receita: SaaS + Success Fee + White Label
              |  Dados: Score verificado + Trilha de auditoria
              |  Valor: Unico player com dados confiaveis
```

**Economia para cada stakeholder:**

| Stakeholder | Custo | Beneficio | ROI |
|-------------|-------|-----------|-----|
| Seguradora | R$2/vida/mes | Reducao de 5-15% na sinistralidade | 3-8x |
| Empresa | R$4/vida/mes | Reducao de 10-20% no reajuste anual | 2-5x |
| Funcionario | R$0 | Desconto de R$50-150/mes no plano | Infinito |
| Corretora | R$0 | Comissao recorrente + diferencial competitivo | Infinito |

---

## 4. Mercado

### 4.1 TAM / SAM / SOM

| Metrica | Calculo | Valor |
|---------|---------|-------|
| **TAM** (Mercado Total Enderecavel) | 50M beneficiarios x R$48/ano | **R$2,4 bilhoes** |
| **SAM** (Mercado Alcancavel) | 8M vidas em PMEs (100-500 func.) x R$48/ano | **R$384 milhoes** |
| **SOM** (Mercado Obtivel em 3 anos) | 50K vidas ativas x R$48/ano + success fees | **R$4-5 milhoes ARR** |

**Composicao do mercado de saude suplementar (2026):**
- 50,4 milhoes de beneficiarios de planos de saude
- 33 milhoes em planos coletivos empresariais
- 8 milhoes em PMEs (segmento mais sensivel a custo)
- 750+ operadoras de planos de saude
- 85.000+ corretoras de seguros ativas

### 4.2 Segmentos Prioritarios

| Segmento | Tamanho | Ticket Medio | Ciclo de Venda | Prioridade | Justificativa |
|----------|---------|-------------|----------------|------------|---------------|
| **PMEs (50-200 func.)** | 120K empresas | R$800/mes | 30-60 dias | **ALTA** | Decisao rapida, dor aguda de custo |
| **Medias (200-1000)** | 25K empresas | R$3.200/mes | 60-90 dias | **ALTA** | Volume bom, area de RH estruturada |
| **Grandes (1000+)** | 5K empresas | R$16.000/mes | 90-180 dias | MEDIA | Ciclo longo, mas ticket alto |
| **Seguradoras** | 750 operadoras | R$50K+/mes | 6-12 meses | MEDIA | Canal de escala, ciclo muito longo |
| **Corretoras** | 85K corretoras | Canal | 15-30 dias | **ALTA** | Multiplicador de vendas |

**Estrategia de entrada:** PMEs via corretoras (ciclo curto + canal multiplicador).

### 4.3 Analise Competitiva

| Feature | VitaScore | Gympass | Vitalk | Zenklub | Google Fit | Discovery Vitality |
|---------|-----------|--------|--------|---------|------------|-------------------|
| Score unificado de saude | SIM | NAO | NAO | NAO | Parcial | SIM |
| Verificacao anti-fraude | 5 camadas + IA | N/A | NAO | NAO | NAO | Parcial |
| Desconto no plano de saude | SIM | NAO | NAO | NAO | NAO | SIM |
| Hash SHA-256 auditavel | SIM | NAO | NAO | NAO | NAO | NAO |
| Alimentacao verificada | SIM (foto + IA) | NAO | NAO | NAO | NAO | Parcial |
| Atividade fisica | SIM | SIM | NAO | NAO | SIM | SIM |
| Sono | SIM | NAO | NAO | NAO | SIM | SIM |
| Hidratacao | SIM | NAO | NAO | NAO | NAO | NAO |
| Saude mental | SIM | NAO | SIM | SIM | NAO | Parcial |
| Check-ups medicos | SIM | NAO | NAO | NAO | NAO | SIM |
| LGPD by design | SIM | Parcial | Parcial | Parcial | NAO | N/A (nao opera no BR) |
| Disponivel no Brasil | SIM | SIM | SIM | SIM | SIM | **NAO** |
| Preco/vida/mes | R$2-4 | R$80-200 | R$15-30 | R$80-150 | Gratis | N/A |

**Conclusao competitiva:** Nao existe concorrente direto no Brasil. Gympass, Vitalk e Zenklub sao complementares (e potenciais parceiros), nao substitutos. O Discovery Vitality valida o modelo mas nao opera no Brasil. O VitaScore ocupa um espaco vazio no mercado.

---

## 5. Projecao Financeira

### 5.1 Custos Operacionais

| Item | Custo Mensal | Custo Anual | Observacao |
|------|-------------|-------------|------------|
| Hospedagem (Vercel Pro) | R$200 | R$2.400 | Frontend + API routes |
| API de IA (Claude Vision) | R$500-2.000 | R$6.000-24.000 | Escala com uso |
| Banco de dados (Supabase/Neon) | R$150 | R$1.800 | PostgreSQL gerenciado |
| Google Play Store | R$12 (unico) | R$12 | Taxa unica de publicacao |
| Apple Developer | R$500 | R$500 | Taxa anual |
| Dominio + SSL | R$50 | R$600 | .com.br + certificado |
| Email corporativo | R$50 | R$600 | Google Workspace |
| Ferramentas (analytics, monitoring) | R$200 | R$2.400 | Mixpanel, Sentry |
| Marketing digital | R$2.000 | R$24.000 | Google Ads, LinkedIn |
| Suporte (1 pessoa, part-time) | R$3.000 | R$36.000 | A partir do mes 4 |
| **TOTAL (Ano 1 medio)** | **R$5.000-7.000** | **R$60.000-84.000** | Estrutura enxuta |

**Nota:** O MVP foi desenvolvido com assistencia de IA (Claude Code), reduzindo o custo de desenvolvimento de estimados R$300.000-500.000 para menos de R$15.000. Essa eficiencia se mantem na evolucao do produto.

### 5.2 Projecao de Receita (3 Anos)

**Ano 1 — Validacao e Tracao Inicial**

| Trimestre | Empresas | Vidas Ativas | MRR | Observacao |
|-----------|----------|-------------|-----|------------|
| Q2 2026 | 5 | 200 | R$0 | Piloto gratuito |
| Q3 2026 | 15 | 800 | R$3.200 | Primeiros pagantes |
| Q4 2026 | 35 | 2.200 | R$8.800 | Tracao via corretoras |
| Q1 2027 | 50 | 4.000 | R$16.000 | Meta Ano 1 atingida |

**ARR Ano 1: R$187.000** (considerando ramp-up gradual)

**Ano 2 — Escala com Corretoras + Primeira Seguradora**

| Trimestre | Empresas | Vidas Ativas | MRR | Observacao |
|-----------|----------|-------------|-----|------------|
| Q2 2027 | 100 | 8.000 | R$32.000 | 10 corretoras ativas |
| Q3 2027 | 180 | 15.000 | R$60.000 | Parceria seguradora |
| Q4 2027 | 250 | 22.000 | R$88.000 | Success fees comecam |
| Q1 2028 | 300 | 30.000 | R$120.000 | Meta Ano 2 atingida |

**ARR Ano 2: R$1,4 milhao** (incluindo success fees estimados em R$200K)

**Ano 3 — Dominancia e White Label**

| Trimestre | Empresas | Vidas Ativas | MRR | Observacao |
|-----------|----------|-------------|-----|------------|
| Q2 2028 | 500 | 45.000 | R$200.000 | 2 seguradoras |
| Q3 2028 | 700 | 55.000 | R$280.000 | White label lancado |
| Q4 2028 | 900 | 70.000 | R$350.000 | Escala nacional |
| Q1 2029 | 1.000+ | 85.000 | R$400.000 | Meta Ano 3 |

**ARR Ano 3: R$4,7 milhoes** (incluindo white label e success fees de R$800K)

### 5.3 Margem e Lucratividade

| Metrica | Ano 1 | Ano 2 | Ano 3 |
|---------|-------|-------|-------|
| Receita bruta | R$187K | R$1,4M | R$4,7M |
| Custo operacional | R$84K | R$300K | R$700K |
| **Margem bruta** | **55%** | **78%** | **85%** |
| Custo de aquisicao (CAC) | R$500 | R$400 | R$300 |
| Investimento em equipe | R$0 | R$360K | R$960K |
| **Margem liquida** | **45%** | **50%** | **62%** |
| **Break-even** | **Mes 4** | — | — |

**Observacoes:**
- Margem bruta alta porque o custo marginal por usuario e minimo (SaaS puro)
- Ano 1 com margem menor devido a base pequena diluindo custos fixos
- Break-even no mes 4 considerando custos operacionais atuais (equipe de 1 pessoa + IA)
- A partir do Ano 2, investimento em equipe (2-3 pessoas) reduz margem mas acelera crescimento

### 5.4 Metricas-Chave (KPIs)

| KPI | Meta Ano 1 | Meta Ano 2 | Meta Ano 3 |
|-----|-----------|-----------|-----------|
| **MRR** | R$16K | R$120K | R$400K |
| **ARR** | R$187K | R$1,4M | R$4,7M |
| **CAC** (custo de aquisicao por empresa) | R$500 | R$400 | R$300 |
| **LTV** (valor vitalicio por empresa) | R$9.600 | R$14.400 | R$19.200 |
| **LTV/CAC** | 19x | 36x | 64x |
| **Churn mensal** (empresas) | <3% | <2% | <1,5% |
| **NPS** | 50+ | 60+ | 70+ |
| **Taxa de engajamento** | 40% | 55% | 65% |
| **Vidas ativas** | 4.000 | 30.000 | 85.000 |
| **Score medio da base** | 350 | 450 | 520 |

---

## 6. Estrategia de Go-to-Market

### 6.1 Fase 1 — Validacao (Meses 1-3)

**Objetivo:** Provar que o modelo funciona com dados reais.

- Recrutar 5 empresas piloto (50-200 funcionarios cada) para uso gratuito por 3 meses
- Perfil ideal: empresas com plano de saude coletivo, RH engajado, historico de reajustes altos
- **Metricas a validar:**
  - Taxa de adesao (meta: 60%+ dos funcionarios baixam o app)
  - Taxa de engajamento semanal (meta: 40%+ sao "ativos")
  - Score medio da base (meta: 300+ apos 30 dias)
  - Satisfacao (NPS meta: 40+)
- Coletar dados de sinistralidade pre/pos para comparacao futura
- Gerar 3 case studies documentados com dados reais
- Iterar o produto com feedback direto dos usuarios

**Canais de aquisicao dos pilotos:**
- Rede de contatos pessoal
- LinkedIn (conteudo + outbound para diretores de RH)
- Eventos de RH regionais

### 6.2 Fase 2 — Tracao (Meses 4-12)

**Objetivo:** Atingir 50 empresas pagantes e validar canal de corretoras.

- Converter pilotos em clientes pagantes (meta: 80%+ de conversao)
- Estabelecer parcerias com 5-10 corretoras de seguros regionais
- Criar programa de certificacao para corretores ("Corretor VitaScore")
- Desenvolver material de vendas: apresentacao, ROI calculator, case studies
- **Meta:** 50 empresas, 4.000 vidas ativas, R$16K MRR
- Publicar app na Play Store e App Store
- Iniciar conversas com 2-3 seguradoras de medio porte

**Estrategia de vendas:**
- Corretoras como canal principal (elas ja visitam as empresas)
- Venda consultiva: "reducao de reajuste" como proposta de valor central
- Piloto gratuito de 30 dias para novos clientes (reduziu de 3 meses para 1)
- Onboarding white-glove nas primeiras 20 empresas

### 6.3 Fase 3 — Escala (Ano 2)

**Objetivo:** Parceria com seguradora e escala nacional.

- Fechar parceria formal com 1-2 seguradoras de medio porte
- Oferecer white label para a seguradora integrar o VitaScore no app proprio
- Expandir rede de corretoras para 30-50 parceiros
- Contratar equipe comercial (2-3 vendedores)
- Desenvolver dashboard atuarial para seguradoras
- **Meta:** 300 empresas, 30.000 vidas, R$120K MRR

**Acoes estrategicas:**
- Participar de congressos do setor (CNSEG, FENASAUDE)
- Publicar estudo com dados reais de reducao de sinistralidade
- Buscar endorsement da ANS para modelo de incentivo por habitos

### 6.4 Fase 4 — Dominancia (Ano 3+)

**Objetivo:** Tornar-se infraestrutura padrao do mercado.

- Parceria com seguradora nacional (top 5: SulAmerica, Bradesco Saude, Amil, Unimed, Notre Dame)
- Lancamento de planos individuais (B2C via seguradora parceira)
- Expansao para seguros de vida (score VitaScore como fator de precificacao)
- Integracao com Open Health (quando regulamentado pela ANS)
- Portabilidade de dados entre operadoras via VitaScore
- **Meta:** 1.000+ empresas, 85.000 vidas, R$400K MRR

---

## 7. Diferenciais Competitivos

### 7.1 Moat Tecnologico

**1. Verificacao Anti-Fraude (5 Camadas + IA)**
Nenhum concorrente no Brasil possui sistema de verificacao comparavel. Dados auto-reportados nao tem valor para seguradoras. O VitaScore e o unico que gera dados confiaveis o suficiente para basear descontos financeiros reais.

**2. Score Auditavel com Hash Criptografico**
Cada ponto do score pode ser rastreado ate o dado bruto original, com hash SHA-256 garantindo imutabilidade. A seguradora pode auditar qualquer registro a qualquer momento — transparencia total.

**3. Dados Locais (LGPD by Design)**
Dados sensiveis de saude ficam no dispositivo do usuario. Apenas o score consolidado e compartilhado com a seguradora (com consentimento explicito). Isso elimina o risco regulatorio que assombra concorrentes que armazenam dados em nuvem.

**4. 6 Pilares Integrados**
Nenhum concorrente monitora todos os 6 pilares de saude em um unico app. Gympass faz atividade fisica, Zenklub faz saude mental, nenhum faz alimentacao verificada, hidratacao ou sono integrado.

### 7.2 Moat de Negocio

**1. Primeiro no Brasil (First Mover Advantage)**
O conceito de "habitos verificados → desconto no plano" nao existe no mercado brasileiro. Quem chegar primeiro estabelece o padrao, firma parcerias exclusivas e acumula dados.

**2. Efeito de Rede**
Quanto mais usuarios, mais dados. Mais dados significam melhor calibracao do score, melhores insights atuariais, e mais valor para a seguradora. Isso cria um ciclo virtuoso dificil de replicar.

**3. Switching Cost Alto**
Apos 6-12 meses de uso, o usuario tem um historico de saude valioso. Trocar de plataforma significa perder esse historico e recomeccar do zero. Para a empresa, trocar significa perder os dados de NR-1 e os benchmarks de sinistralidade.

**4. Modelo Discovery Vitality Validado Globalmente**
O Discovery Vitality opera em 40 paises, atende 40 milhoes de membros e faz parte de um grupo avaliado em US$10 bilhoes. O modelo esta comprovado — a questao nao e SE funciona, mas QUANDO chegara ao Brasil. O VitaScore e essa resposta.

**5. Custo de Desenvolvimento Reduzido por IA**
O MVP foi desenvolvido com assistencia de IA (Claude Code), reduzindo custos em 95%. Isso permite operar com margens maiores e investir mais em crescimento do que concorrentes tradicionais que precisam de equipes grandes de engenharia.

---

## 8. Riscos e Mitigacoes

| Risco | Probabilidade | Impacto | Mitigacao |
|-------|-------------|---------|-----------|
| **Regulatorio (ANS muda regras)** | Media | Alto | Manter dialogo com ANS; modelo flexivel que se adapta a diferentes frameworks regulatorios; desconto pode ser via coparticipacao (menos regulado) |
| **Engajamento baixo dos usuarios** | Media | Alto | Incentivo financeiro real (desconto) e o maior motivador; gamificacao; challenges corporativos; onboarding guiado; notificacoes inteligentes |
| **Seguradora nao adota o modelo** | Media | Alto | Comecar com empresas (B2B direto); acumular dados de reducao de sinistro; usar corretoras como canal de pressao; oferecer piloto sem risco |
| **Concorrente entra no mercado** | Baixa-Media | Medio | First mover + dados acumulados + parcerias firmadas; patentear sistema de verificacao; manter velocidade de inovacao |
| **LGPD (vazamento de dados)** | Baixa | Critico | Dados locais (nao ha banco centralizado de dados de saude); apenas score compartilhado; auditorias periodicas; seguro cyber |
| **Tecnico (app falha em producao)** | Baixa | Medio | Testes automatizados; monitoring (Sentry); rollback automatico; SLA documentado; suporte reativo |
| **Fraude sofisticada** | Media | Medio | 5 camadas de verificacao; IA melhora com mais dados; revisao manual de outliers; penalidade (perda de score) para fraudes detectadas |
| **Dependencia de API de IA** | Baixa | Medio | Fallback para verificacao manual; cache de modelos; contrato enterprise com provider de IA; possibilidade de modelo local (fine-tuned) |

---

## 9. Equipe

### Estrutura Atual (Pre-Seed)

O MVP do VitaScore foi desenvolvido por um fundador tecnico com assistencia intensiva de IA generativa (Claude Code da Anthropic). Essa abordagem reduziu o custo de desenvolvimento em aproximadamente 95% comparado ao modelo tradicional de software house, e permitiu a construcao de um produto funcional em semanas ao inves de meses.

**Fundador / CTO / Desenvolvedor**
- Responsavel por: produto, tecnologia, estrategia, vendas iniciais
- Stack: Next.js, React, TypeScript, Capacitor, Prisma, IA
- Experiencia em desenvolvimento full-stack e integracao com APIs de IA

### Estrutura Planejada (Pos-Validacao)

| Fase | Contratacoes | Funcao |
|------|-------------|--------|
| Mes 4-6 | 1 pessoa (CS/Suporte) | Onboarding de clientes, suporte nivel 1 |
| Mes 7-12 | 1 vendedor | Prospeccao ativa via corretoras |
| Ano 2 | 2 vendedores + 1 dev | Escala comercial + evolucao do produto |
| Ano 3 | Equipe de 8-10 | Comercial (4) + Produto (3) + CS (2) + Ops (1) |

**Filosofia de contratacao:**
- Manter equipe enxuta o maximo possivel
- IA como multiplicador de produtividade (1 dev com IA = 3-4 devs tradicionais)
- Priorizar perfis comerciais (o produto e o diferencial, precisa de vendas)
- Cultura data-driven: decisoes baseadas em metricas, nao intuicao

---

## 10. Roadmap do Produto

### Timeline Detalhado

**Q2 2026 — MVP e Validacao**
- [CONCLUIDO] Aplicativo funcional com 6 pilares
- [CONCLUIDO] Sistema de verificacao anti-fraude (5 camadas)
- [CONCLUIDO] Score de 0-1000 com faixas (Bronze a Diamante)
- [CONCLUIDO] Interface responsiva (web + mobile via Capacitor)
- [EM ANDAMENTO] Piloto com 5 empresas
- [EM ANDAMENTO] Publicacao na Play Store

**Q3 2026 — Producao e Primeiros Pagantes**
- App nativo publicado (Play Store + App Store)
- API de IA em producao (Claude Vision para fotos de refeicoes)
- Sistema de notificacoes inteligentes (lembretes personalizados)
- Dashboard do RH (visao consolidada da empresa)
- Relatorio mensal automatizado para o contratante
- Integracao com wearables populares (Mi Band, Galaxy Watch, Apple Watch)

**Q4 2026 — Dashboard Corporativo e Gamificacao**
- Dashboard da seguradora (dados atuariais, score medio, trilha de auditoria)
- Sistema de premiacao corporativa (rankings, challenges entre equipes)
- Integracao com Slack/Teams (lembretes e celebracoes)
- API publica documentada para integracoes
- Relatorio de compliance NR-1 (saude mental)

**Q1 2027 — White Label e Integracoes**
- Versao white label (seguradora coloca marca propria)
- Integracoes com ERPs de RH (TOTVS, Senior, SAP)
- Single Sign-On (SSO) para empresas
- Multi-idioma (preparacao para expansao)
- SDK para seguradoras integrarem score em seus sistemas

**Q2 2027 — Open Health e Portabilidade**
- Preparacao para Open Health (quando regulamentado pela ANS)
- Portabilidade de score entre operadoras
- Marketplace de recompensas (descontos em farmacias, academias, exames)
- Telemedicina integrada (parceria)
- Score preditivo com machine learning (risco de sinistro)

**Q3-Q4 2027 — Expansao**
- Seguros de vida (score como fator de precificacao)
- Planos individuais (B2C via seguradora)
- Parcerias com planos odontologicos
- Expansao para America Latina (Colombia, Mexico, Chile)

---

## 11. Metricas de Impacto Social

O VitaScore nao e apenas um negocio lucrativo — e uma ferramenta de transformacao social em saude preventiva:

### Saude Fisica
- **Reducao de sedentarismo:** Meta de aumentar em 30% o nivel de atividade fisica dos usuarios nos primeiros 6 meses
- **Melhoria na alimentacao:** Registro fotografico cria consciencia alimentar; estudos mostram que o simples ato de fotografar refeicoes reduz consumo calorico em 9%
- **Hidratacao adequada:** 75% dos brasileiros nao bebem agua suficiente; o tracking ativo reverte esse quadro

### Saude Mental
- **Deteccao precoce:** Monitoramento de tempo de tela e padroes de sono pode sinalizar inicio de quadros de ansiedade ou depressao antes que se tornem criticos
- **Compliance NR-1:** Ferramenta concreta para empresas cumprirem a nova regulamentacao de saude mental no trabalho
- **Reducao de burnout:** Dados de sono + tempo de tela + humor permitem intervencoes preventivas

### Impacto Economico-Social
- **Democratizacao do wellness corporativo:** PMEs nunca tiveram acesso a programas de qualidade de vida (Gympass custa R$80-200/funcionario). VitaScore custa R$4
- **Reducao de custos do SUS:** Menos sinistros no sistema privado significa menos pressao no sistema publico
- **Dados para politicas publicas:** Dados anonimizados e agregados podem informar politicas de saude publica

### Metas de Impacto (3 Anos)

| Metrica de Impacto | Meta |
|--------------------|------|
| Usuarios ativos monitorando saude | 85.000 |
| Reducao media de sedentarismo | 30% |
| Melhoria media no score de sono | 25% |
| Deteccoes precoces de risco de saude mental | 500+ |
| Economia total em sinistros (estimada) | R$15-25 milhoes |
| Empresas com programa de wellness acessivel | 1.000+ |

---

## Anexos

### A. Screenshots do Aplicativo

*Disponivel em: `/public/screenshots/`*

- Tela principal com score e 6 pilares
- Registro de refeicao com foto verificada
- Dashboard de progresso semanal
- Historico de score mensal
- Tela de conquistas e faixas

### B. Arquitetura Tecnica Detalhada

*Disponivel em: `/docs/ARQUITETURA.md`*

- Diagrama de componentes
- Fluxo de dados (coleta → verificacao → score → hash)
- Modelo de dados (entidades e relacionamentos)
- Integracao com Health Connect / HealthKit
- Pipeline de verificacao de fotos (IA)

### C. Modelo de Contrato para Seguradoras

*A ser desenvolvido com assessoria juridica*

- Contrato de licenciamento de software (SaaS)
- Acordo de compartilhamento de dados (LGPD compliant)
- SLA de disponibilidade e suporte
- Termos de success fee
- Clausulas de confidencialidade e propriedade intelectual

### D. ROI Calculator

*Disponivel em: `/tools/roi-calculator/`*

Calculadora interativa que permite a empresa ou seguradora estimar:
- Economia anual em sinistros
- Reducao estimada no reajuste
- ROI do investimento no VitaScore
- Payback period
- Comparativo com/sem VitaScore em 3 anos

**Formula base:**
```
Economia anual estimada = Vidas ativas x Taxa de engajamento x Reducao media de sinistro x Custo medio per capita
Exemplo: 500 vidas x 50% engajamento x 8% reducao x R$4.800/ano = R$96.000/ano
Custo VitaScore: 500 x R$4 x 12 = R$24.000/ano
ROI: 4x
```

---

*Documento confidencial. Reproducao proibida sem autorizacao expressa.*
*VitaScore (c) 2026. Todos os direitos reservados.*
