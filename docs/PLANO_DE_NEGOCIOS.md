# SaluFlow — Plano de Negocios (v2.0)

> Plataforma de monitoramento de habitos para programas de promocao da saude (RN 499/2022) e compliance NR-1

**Versao:** 2.0 — Revisao com analise regulatoria e de mercado
**Data:** Abril 2026
**Confidencial**

---

## Sumario Executivo

O problema e real e quantificavel. A sinistralidade media das operadoras de saude no Brasil ultrapassa 85%. Em 2025, o Brasil registrou 530 mil afastamentos por saude mental (fonte: INSS/Previdencia Social). A NR-1, atualizada pela Portaria MTE 1.419/2024, passa a exigir gestao de riscos psicossociais a partir de 26 de maio de 2026, com multas de R$6.708,09 por trabalhador exposto (conforme graus de risco da NR-28). No mercado de PMEs, contratos como o da AMIL (clausulas 14.7 a 14.9) aplicam reajuste tecnico individual baseado na sinistralidade da propria empresa — nao diluido em pool — para grupos de 30 a 99 beneficiarios. Ou seja: cada empresa paga pelo proprio risco. E nao existe ferramenta que ajude essas empresas a reduzi-lo de forma mensuravel.

O arcabouco regulatorio para bonificacao ja existe. As Resolucoes Normativas 498/2022 e 499/2022 da ANS autorizam operadoras a conceder bonificacoes e descontos a beneficiarios que participem de programas de promocao da saude e prevencao de doencas. A palavra-chave e **participacao** — nao resultados. A operadora pode recompensar quem usa o app, registra refeicoes, faz check-ups. Nao pode penalizar quem tem score baixo, quem e PCD, quem esta gravida ou quem tem doenca cronica. O framework legal existe; o que falta e a ferramenta.

O SaluFlow nao e o primeiro no mercado brasileiro. A Prudential Vitality opera no Brasil desde 2020 (seguro de vida), tendo migrado para o app "Fully" em setembro de 2024. Gympass/Wellhub domina o wellness corporativo. Zenklub atende saude mental. O que nenhum deles faz e oferecer uma ferramenta verificavel para operadoras de **planos de saude** implementarem programas de bonificacao conforme a RN 499/2022. Esse e o espaco do SaluFlow — e o caminho de entrada mais imediato e com menor resistencia e o compliance NR-1, cuja fiscalizacao punitiva comeca em maio de 2026.

---

## 1. Analise de Mercado — Com os Pes no Chao

### 1.1 O que JA existe no Brasil

Antes de falar do SaluFlow, e preciso ser honesto sobre quem ja esta no mercado:

| Player | O que faz | Mercado | Status no Brasil | Integracao com plano de saude |
|--------|-----------|---------|-------------------|-------------------------------|
| **Prudential Vitality** | Programa de habitos saudaveis vinculado a seguro de vida. Parceria global com Discovery. App "Fully" (desde set/2024) | Seguro de **vida** | Ativo desde 2020 | NAO — atua em seguro de vida, nao plano de saude |
| **Gympass/Wellhub** | Acesso a academias e apps de bem-estar como beneficio corporativo | Wellness corporativo | Dominante, 15M+ usuarios globais | NAO — nao gera dados para bonificacao da operadora |
| **Zenklub** | Terapia online e programas de saude mental corporativa | Saude mental | Ativo, 800+ empresas | NAO — foca apenas em saude mental |
| **Vitalk** | Chatbot de saude mental + programas corporativos | Saude mental | Ativo | NAO — chatbot, sem monitoramento multipilar |
| **Alice** | Operadora de saude com modelo de prevencao | Operadora de saude propria | Ativa, mas e operadora, nao ferramenta | SIM — mas e a propria operadora |
| **SaluFlow** | Ferramenta de monitoramento multipilar para operadoras implementarem RN 499/2022 + compliance NR-1 | Saude suplementar + RH | MVP pronto | SIM — esse e o proposito central |

**Conclusao honesta:** Nao somos "zero competicao". Somos uma proposta diferente em um ecossistema que ja tem players relevantes. Nossa diferenciacao e especifica: ferramenta para operadoras de planos de saude implementarem programas de bonificacao (RN 499) com dados verificaveis de participacao. Se Prudential Vitality decidir expandir para planos de saude, sera um concorrente direto e com muito mais recursos.

### 1.2 Regulamentacao vigente

#### RN 498/2022 — Boas Praticas de Programas de Promocao da Saude

A Resolucao Normativa 498, de 31 de marco de 2022 (DOU 01/04/2022), estabelece as boas praticas para operadoras que desejem implementar programas de promocao da saude e prevencao de doencas. Pontos-chave:

- Art. 3: Operadoras **podem** (nao sao obrigadas a) instituir programas de promocao da saude
- Art. 5: Programas devem ser baseados em evidencias cientificas
- Art. 7: Vedada qualquer forma de discriminacao por condicao de saude preexistente
- Art. 8: Dados coletados devem respeitar a LGPD (Lei 13.709/2018)

#### RN 499/2022 — Bonificacoes e Descontos

A Resolucao Normativa 499, de 31 de marco de 2022, e a mais relevante para o SaluFlow. Ela autoriza operadoras a conceder bonificacoes e descontos:

- **Art. 2:** Operadoras podem conceder bonificacoes ou descontos nas contraprestacoes pecuniarias a beneficiarios que **participem** de programas de promocao da saude
- **Art. 3, Paragrafo Unico:** A bonificacao deve ser vinculada a **participacao** do beneficiario, **NAO ao resultado** ou a condicao de saude
- **Art. 5:** Vedada a utilizacao dos programas para selecao de risco, recusa de cobertura ou qualquer forma de discriminacao
- **Art. 7:** A operadora deve dar publicidade aos criterios de participacao e as bonificacoes oferecidas
- **Art. 9:** Os programas devem ser submetidos a ANS para registro

**Implicacao pratica para o SaluFlow:** A bonificacao pode ser dada por: abrir o app X dias/mes, registrar refeicoes, registrar sono, fazer check-up anual. NAO pode ser baseada em: score alto, perda de peso, nivel de atividade fisica atingido, ou qualquer metrica de resultado. Isso muda fundamentalmente o design do produto — o score serve como feedback pessoal para o usuario, mas a bonificacao e calculada por **criterios de participacao**.

#### NR-1 — Gerenciamento de Riscos Ocupacionais (Atualizada pela Portaria MTE 1.419/2024)

A Norma Regulamentadora 1 foi atualizada para incluir explicitamente riscos psicossociais no Programa de Gerenciamento de Riscos (PGR):

- **Vigencia da fiscalizacao punitiva:** 26 de maio de 2026 (prazo de adequacao ja encerrado)
- **Obrigacao:** Empresas devem identificar, avaliar e controlar riscos psicossociais no ambiente de trabalho
- **Multas:** R$6.708,09 por trabalhador exposto, conforme gradacao da NR-28 (pode multiplicar por numero de trabalhadores)
- **Contexto:** 530 mil afastamentos por saude mental em 2025 no Brasil (dado INSS)
- **Problema das empresas:** A norma exige gestao de riscos, mas nao oferece ferramenta. Empresas de 30-200 funcionarios nao tem SESMT estruturado

**Implicacao para o SaluFlow:** Produto de entrada imediata. Empresas precisam demonstrar que monitoram e atuam sobre riscos psicossociais. O pilar de saude mental do SaluFlow (registro de humor, tempo de tela, sono) gera dados agregados que alimentam o PGR. Nao e a solucao completa (o PGR exige mais), mas e um componente demonstravel e mensuravel.

### 1.3 O que o contrato AMIL PME revela

Analisamos o contrato coletivo empresarial AMIL para PMEs (30-99 beneficiarios). Algumas clausulas sao extremamente relevantes:

#### Clausulas 14.7 a 14.9 — Reajuste por Sinistralidade Individual

Para empresas com 30 a 99 beneficiarios, o reajuste anual tem **dois componentes**:

1. **Indice Financeiro:** Reajuste base aplicado a toda a carteira (custo medico-hospitalar, inflacao)
2. **Indice Tecnico:** Reajuste **adicional** baseado na sinistralidade **individual da empresa**

A clausula 14.8 estabelece que se a sinistralidade da empresa (valor dos sinistros / receita de mensalidades) ultrapassar 65% da receita, um reajuste tecnico adicional e aplicado. Na pratica:

- Empresa com sinistralidade de 50%: paga apenas o reajuste financeiro (ex: 12%)
- Empresa com sinistralidade de 80%: paga reajuste financeiro + indice tecnico (ex: 12% + 15% = 27%)
- Empresa com sinistralidade de 120%: reajuste pode ultrapassar 40%

**Implicacao para o SaluFlow:** Para empresas de 30-99 vidas, a reducao de sinistralidade tem impacto direto e mensuravel no reajuste. Se o SaluFlow ajudar a manter a sinistralidade abaixo de 65%, elimina o indice tecnico. Essa e a proposta de valor mais tangivel — nao e "pode ser que reduza", e "se manter abaixo de 65%, o reajuste adicional nao se aplica".

**Ressalva importante:** Provar que o SaluFlow causou a reducao de sinistralidade requer no minimo 12 meses de dados comparativos. No primeiro ano, a venda e baseada em hipotese, nao em prova.

#### Clausula 12.5 — Programa de Extensao Assistencial (PEA)

A AMIL ja preve programas de promocao da saude no contrato. A clausula 12.5 menciona programas de acompanhamento para doencas cronicas e promocao de habitos saudaveis. O SaluFlow funciona como a extensao digital desse programa — transforma uma clausula contratual generica em um programa mensuravel.

#### Clausula 12.8 — Coparticipacao

Os limites de coparticipacao estao definidos contratualmente. Descontos na coparticipacao (em vez de na mensalidade) sao uma forma mais simples de bonificacao e requerem menos negociacao regulatoria.

### 1.4 Riscos trabalhistas reais (LGPD + CLT)

Nao podemos ignorar os riscos juridicos. Um programa de monitoramento de habitos no contexto trabalhista tem implicacoes serias:

#### LGPD — Dados sensiveis (Art. 11)

Dados de saude sao dados **pessoais sensiveis** pela LGPD (Art. 5, II). Seu tratamento e regido pelo Art. 11, que exige:

- **Consentimento especifico e destacado** do titular, ou
- **Outra base legal** do Art. 11, II (ex: tutela da saude em procedimento realizado por profissional de saude)

**Problema critico:** No contexto trabalhista, o **consentimento e questionavel**. A ANPD (Autoridade Nacional de Protecao de Dados) reconhece em seu Guia Orientativo sobre Tratamento de Dados Pessoais para Fins de Relacoes Trabalhistas que existe **assimetria de poder** entre empregador e empregado. O empregado pode se sentir coagido a consentir. Isso fragiliza o consentimento como base legal.

**Mitigacao do SaluFlow:**
- Participacao deve ser **genuinamente voluntaria** (o empregado que nao participa nao pode sofrer qualquer prejuizo)
- Dados granulares (o que comeu, quando dormiu, GPS) **nunca** sao compartilhados com RH ou empregador
- RH recebe apenas dados **agregados** da empresa (ex: "72% dos funcionarios atingiram criterio de participacao este mes")
- Armazenamento local no dispositivo (dados sensiveis nao transitam para servidor central)
- Politica de retencao e exclusao documentada

#### Discriminacao (PCD, gestantes, doentes cronicos)

- Um programa baseado em **resultados** (score alto = desconto) discrimina automaticamente pessoas com deficiencia, gestantes, idosos e portadores de doencas cronicas que podem ter limitacoes fisicas
- A RN 499/2022, Art. 5 veda explicitamente essa discriminacao
- A CLT, Art. 373-A e a Lei 13.146/2015 (Estatuto da PCD) reforcam essa vedacao

**Mitigacao do SaluFlow:**
- Bonificacao **exclusivamente por participacao**, nunca por resultado
- Metas de participacao adaptadas: PCD, gestante e portadores de doencas cronicas tem criterios ajustados (ex: "registrou 10 refeicoes" em vez de "caminhou 8.000 passos")
- Nenhuma categoria de participacao exige capacidade fisica especifica
- Laudo ou autodeclaracao para ajuste de criterios, sem necessidade de detalhar a condicao

#### Assedio moral por gamificacao

- Rankings publicos de score entre funcionarios podem configurar **assedio moral organizacional**
- Pressao de gestores para "melhorar o score da equipe" e situacao de risco
- Jurisprudencia trabalhista reconhece assedio por metas de wellness em outros paises (ex: EEOC v. Orion Energy Systems, EUA, 2016)

**Mitigacao do SaluFlow:**
- **Sem rankings individuais** visiveis para outros funcionarios ou gestores
- Score e dado **pessoal** — visivel apenas para o proprio usuario
- RH ve apenas percentual de participacao agregado (nao identifica quem participa ou nao)
- Contrato com a empresa proibe expressamente pressao sobre funcionarios para adesao
- Canal de denuncia anonimo para situacoes de coercao

#### Direito de recusa

- O empregado tem direito de se recusar a participar sem qualquer consequencia
- Nao participar nao pode afetar avaliacoes de desempenho, bonus, promocoes ou permanencia
- Esse direito deve ser documentado em termo claro, em linguagem acessivel

---

## 2. A Solucao — Redesenhada

### 2.1 Tres produtos, tres mercados

O SaluFlow nao e um produto unico vendido para todos. Sao tres produtos distintos, com timings diferentes:

#### Produto 1: SaluFlow NR-1 (Imediato — Mercado quente)

| Aspecto | Detalhe |
|---------|---------|
| **O que e** | Ferramenta de monitoramento de riscos psicossociais para compliance NR-1 |
| **Cliente** | Empresas de 30-500 funcionarios |
| **Preco** | R$3-5 por funcionario/mes |
| **Timing** | Fiscalizacao punitiva a partir de 26/mai/2026 — urgencia imediata |
| **Entrega** | Relatorio mensal de indicadores psicossociais (sono, humor, tempo de tela) agregados para alimentar o PGR |
| **Diferencial** | Dados quantitativos e continuos (vs. questionario anual de clima) |
| **Limitacao** | NR-1 exige mais do que monitoramento (ex: acoes corretivas). SaluFlow e um componente, nao a solucao completa |

#### Produto 2: SaluFlow Saude (Medio prazo — 12-18 meses)

| Aspecto | Detalhe |
|---------|---------|
| **O que e** | Ferramenta para operadoras de planos de saude implementarem programas de bonificacao (RN 499/2022) |
| **Cliente** | Operadoras de planos de saude + empresas contratantes |
| **Preco** | R$2-3 por beneficiario ativo/mes (pago por operadora e/ou empresa em split) |
| **Timing** | Requer 12+ meses de dados de engajamento para demonstrar valor; requer homologacao com operadora |
| **Entrega** | Plataforma white-label com registro verificavel de participacao, dashboard atuarial, trilha de auditoria |
| **Diferencial** | Unica ferramenta desenhada especificamente para RN 499 com verificacao anti-fraude |
| **Limitacao** | Ciclo de venda longo (6-12 meses com operadora). Provar reducao de sinistralidade leva 12-18 meses |

#### Produto 3: SaluFlow Vida (Longo prazo — 24+ meses)

| Aspecto | Detalhe |
|---------|---------|
| **O que e** | Programa de habitos vinculado a seguro de vida (modelo Vitality) |
| **Cliente** | Seguradoras de vida |
| **Preco** | Revenue share ou licenciamento |
| **Timing** | So faz sentido apos validar Produto 1 e 2 com dados brasileiros |
| **Concorrente direto** | Prudential Vitality / Fully (ja opera no Brasil desde 2020) |
| **Risco** | Prudential tem marca, distribuicao e 4+ anos de vantagem no Brasil |

### 2.2 Modelo de bonificacao legal (conforme RN 499/2022)

O desenho da bonificacao e **fundamentalmente diferente** do que foi proposto na v1.0 deste plano. Nao se trata de "score alto = desconto alto". A RN 499 exige que a bonificacao seja por **participacao**, nao por resultado.

#### O que conta como participacao (exemplos)

| Criterio de participacao | Meta mensal | Verificacao |
|--------------------------|-------------|-------------|
| Abriu o app e registrou algo | 15+ dias/mes | Log de acesso verificado |
| Registrou refeicoes | 10+ refeicoes fotografadas/mes | Foto via camera nativa + IA |
| Registrou sono | 20+ noites/mes | Dados de wearable ou registro manual |
| Registrou hidratacao | 15+ dias/mes | Registro no app |
| Fez check-in de humor | 4+ vezes/mes (semanal) | Registro no app |
| Realizou check-up anual | 1 comprovante/ano | Upload + OCR |

**Para receber bonificacao:** Cumprir 4 de 6 criterios no mes.

#### O que NAO pode ser criterio de bonificacao

- Score acima de X pontos (resultado, nao participacao)
- Perder X quilos (resultado + discriminatorio)
- Caminhar X passos/dia (exclui PCD e pessoas com limitacoes)
- Atingir determinada faixa (Diamante, Ouro, etc.)

#### Tratamento de PCD, gestantes e doentes cronicos

- Criterios adaptados automaticamente mediante autodeclaracao ou laudo
- Exemplo: gestante no terceiro trimestre — criterio de atividade fisica substituido por criterio de registro de pre-natal
- Exemplo: cadeirante — criterio de passos substituido por criterio de registro de atividade adaptada (qualquer atividade registrada conta)
- O principio e: **todos devem ter a mesma possibilidade de cumprir os criterios de participacao**

#### O que o RH ve vs. o que o usuario ve

| Dado | Usuario | RH/Empregador | Operadora |
|------|---------|---------------|-----------|
| Score pessoal (0-1000) | SIM | NAO | NAO |
| Detalhes das refeicoes | SIM | NAO | NAO |
| Dados de sono | SIM | NAO | NAO |
| Humor registrado | SIM | NAO | NAO |
| GPS / localizacao | NAO (uso interno anti-fraude) | NAO | NAO |
| Cumpriu criterio de participacao (sim/nao) | SIM | Apenas % agregado da empresa | SIM (anonimizado) |
| % de participacao da empresa | — | SIM | SIM |
| Relatorio de riscos psicossociais (NR-1) | — | Agregado, sem identificacao | — |

### 2.3 O que o app ja faz (MVP — Abril 2026)

**Funcional:**
- 14 telas (home, perfil, pilares individuais, historico, configuracoes)
- 6 pilares de saude: atividade fisica, alimentacao, sono, hidratacao, saude mental, check-ups
- Score de 0 a 1000 pontos com faixas (Bronze, Prata, Ouro, Diamante)
- Sistema anti-fraude: camera nativa obrigatoria, deteccao de moire, timestamp, GPS, hash SHA-256
- Armazenamento local (LGPD by design)
- Interface responsiva (web + mobile via Capacitor)

**Mock / Em desenvolvimento:**
- Integracao com Health Connect / HealthKit (em implementacao)
- API de IA para verificacao de fotos (Claude Vision — prototipo funcional, nao em producao)
- Dashboard do RH (design pronto, backend pendente)
- Relatorio NR-1 (especificacao pronta, implementacao pendente)
- Notificacoes inteligentes (nao implementado)
- White-label para operadoras (nao iniciado)

**Honestidade sobre o estagio:** O app funciona como demonstracao e coleta de dados basicos. Para uso em producao com empresas reais, faltam: testes de carga, integracao real com wearables, backend robusto, e processo de onboarding. Estimativa de 2-3 meses de engenharia para o Produto 1 (NR-1) estar pronto para piloto.

---

## 3. Modelo de Negocio — Revisado

### 3.1 Receita por produto

| Produto | Preco | Quem paga | Contrato minimo | Piloto |
|---------|-------|-----------|-----------------|--------|
| **SaluFlow NR-1** | R$3-5/funcionario/mes | Empresa | 12 meses | 60 dias gratuito, ate 50 func. |
| **SaluFlow Saude** | R$2-3/beneficiario ativo/mes | Operadora + empresa (split negociavel) | 24 meses | 6 meses com 1 empresa-teste |
| **SaluFlow Vida** | Licenciamento ou revenue share | Seguradora de vida | Sob negociacao | — |
| **Setup/Implantacao** | R$2.000-10.000 (por porte) | Empresa | Unico | — |

### 3.2 O que NAO assumimos mais

A v1.0 deste plano continha premissas que nao resistem a escrutinio. Correcoes:

| Premissa da v1.0 | Correcao na v2.0 |
|-------------------|-------------------|
| "Zero competicao no Brasil" | Prudential Vitality opera desde 2020 (vida). Gympass e Zenklub dominam wellness. Nao somos os primeiros. |
| "ROI de 3-8x para a seguradora" | Sem dados brasileiros, nao podemos afirmar ROI. Discovery Vitality reporta reducao de 20% em sinistros na Africa do Sul apos 3+ anos — contexto completamente diferente. |
| "Margem bruta de 90%+" | Margem bruta de SaaS e alta, mas depende de CAC, churn e custo de suporte. Margem bruta realista: 65-75% no ano 1. |
| "Break-even no mes 4" | Com CAC real e ciclo de venda de 30-60 dias, break-even estimado entre mes 8 e 12. |
| "50 empresas em 12 meses" | Agressivo para um fundador solo sem equipe comercial. Meta revisada: 20 empresas em 12 meses. |
| "LTV/CAC de 19x" | Sem dados de churn e LTV reais, essa metrica e fantasia. Nao sera projetada ate termos 6+ meses de dados. |
| "Nao existe concorrente direto" | Prudential Vitality e concorrente direto no segmento de vida. No segmento de saude, nao existe ferramenta especifica para RN 499, mas isso pode mudar rapidamente. |

### 3.3 Unit economics — Estimativa honesta

**Estas sao estimativas. Nao temos dados reais de operacao.**

| Metrica | Estimativa | Base da estimativa |
|---------|------------|-------------------|
| **CAC (custo de aquisicao por empresa)** | R$2.000-5.000 | Ciclo de venda B2B para PME: 2-4 reunioes + piloto. Custo de vendedor + marketing dividido por conversoes estimadas |
| **Churn anual estimado** | 25-35% no ano 1 | Benchmark de SaaS B2B SMB no Brasil (fonte: SaaSholic, Distrito). Primeiro ano tem churn alto por desalinhamento de expectativas |
| **Ticket medio mensal** | R$320 (80 funcionarios x R$4) | PME tipica de 80 funcionarios |
| **LTV estimado (se churn = 30%)** | R$12.800 (40 meses x R$320) | LTV = ticket mensal / churn mensal. Mas isso assume churn estabilizado — arriscado projetar |
| **Tempo para provar valor NR-1** | 3-6 meses | Empresa precisa ver relatorios consistentes para renovar |
| **Tempo para provar reducao de sinistralidade** | 12-18 meses | Ciclo de reajuste e anual; dados precisam de pelo menos 1 ano |
| **Break-even estimado** | Mes 8-12 | Com 8-12 empresas pagantes e custos operacionais enxutos (fundador solo + infra de ~R$5K/mes) |

### 3.4 Custos operacionais estimados (Ano 1)

| Item | Custo mensal | Custo anual | Observacao |
|------|-------------|-------------|------------|
| Infraestrutura (hosting, DB, dominio) | R$600 | R$7.200 | Vercel + Supabase/Neon + dominio |
| API de IA (Claude Vision) | R$500-2.000 | R$6.000-24.000 | Escala com uso real |
| Marketing digital | R$2.000 | R$24.000 | LinkedIn + Google Ads direcionado |
| Ferramentas (analytics, monitoring) | R$300 | R$3.600 | Mixpanel, Sentry, etc. |
| Custos legais (LGPD, contratos) | R$500 | R$6.000 | Consultoria juridica pontual |
| Apple Developer + Play Store | — | R$550 | Taxas anuais |
| **Total Ano 1** | **~R$4.000-5.500** | **~R$47.000-65.000** | Sem equipe contratada |

**Nota:** Esses custos pressupoe operacao pelo fundador solo com assistencia de IA. A contratacao de vendedor (a partir do mes 6-8) adicionaria R$5.000-8.000/mes.

---

## 4. Projecao Financeira — Conservadora

### Cenario conservador

Premissas: fundador solo, sem investimento externo, crescimento organico, foco no Produto 1 (NR-1).

| Periodo | Empresas pagantes | Vidas ativas | Ticket medio | MRR | ARR acumulado |
|---------|-------------------|-------------|-------------|-----|---------------|
| **Ano 1 — Q2 2026** | 0 (piloto) | 150 | — | R$0 | R$0 |
| **Ano 1 — Q3 2026** | 5 | 400 | R$3/func | R$1.200 | — |
| **Ano 1 — Q4 2026** | 12 | 960 | R$3,50/func | R$3.360 | — |
| **Ano 1 — Q1 2027** | 20 | 1.600 | R$4/func | R$6.400 | **~R$76K** |
| **Ano 2 — encerramento** | 80 empresas + 2 operadoras-piloto | 8.000 | R$4/func (empresas) + R$2/benef (operadora) | R$40.000 | **~R$480K** |
| **Ano 3 — encerramento** | 200 empresas + 5 operadoras | 25.000 | Mix | R$125.000 | **~R$1,5M** |

**Nota sobre o Ano 1:** R$76K de ARR nao cobre os custos operacionais + remuneracao do fundador. O ano 1 e deficitario. O modelo so se sustenta se: (a) o fundador tem outra fonte de renda, (b) ha investimento externo, ou (c) os primeiros clientes pagam setup relevante.

### Cenario otimista

Premissas: investimento anjo de R$200-300K, contratacao de 1 vendedor no mes 3, NR-1 gera demanda acima do esperado.

| Periodo | Empresas | Vidas | MRR | ARR |
|---------|----------|-------|-----|-----|
| **Ano 1** | 50 | 4.000 | R$16.000 | **~R$192K** |
| **Ano 2** | 200 + 5 operadoras | 20.000 | R$80.000 | **~R$960K** |
| **Ano 3** | 500 + 10 operadoras + 1 parceria vida | 50.000 | R$290.000 | **~R$3,5M** |

**Por que o cenario otimista e otimista:** Pressupoe que a fiscalizacao NR-1 gere demanda real (e nao apenas "papel para ingles ver"), que o produto seja suficientemente bom para reter 70%+ dos clientes, e que operadoras aceitem pilotos no ano 2. Cada uma dessas premissas tem risco significativo.

---

## 5. Go-to-Market — Revisado

### Fase 1: Compliance NR-1 — Venda imediata (Meses 1-3)

**Objetivo:** 5-10 empresas usando o produto, mesmo que em piloto gratuito.

- **Proposta de valor:** "A fiscalizacao punitiva da NR-1 comeca em 26/mai/2026. Sua empresa tem um programa de monitoramento de riscos psicossociais? O SaluFlow gera relatorios mensais que alimentam seu PGR."
- **Perfil do cliente:** PMEs de 30-200 funcionarios, com plano de saude coletivo, sem SESMT proprio
- **Canal:** LinkedIn outbound para diretores de RH + rede de contatos + corretoras de seguros (que ja visitam essas empresas)
- **Preco:** Piloto gratuito de 60 dias (ate 50 funcionarios). Conversao para R$3-5/func/mes
- **Entrega minima:** App funcional + relatorio mensal agregado de indicadores psicossociais
- **Meta realista:** 5 empresas em piloto, 150-250 funcionarios cadastrados

### Fase 2: Expansao NR-1 + primeiras conversas com operadoras (Meses 4-12)

**Objetivo:** 20 empresas pagantes + pipeline de 2-3 operadoras interessadas.

- Converter pilotos em pagantes (meta: 60-70% de conversao — nao 80% como na v1.0)
- Estabelecer parcerias com 3-5 corretoras de seguros como canal de distribuicao
- Publicar app na Play Store e App Store
- Coletar 6+ meses de dados de engajamento para apresentar a operadoras
- Iniciar conversas com operadoras de medio porte (Hapvida regional, Unimed local, etc.)
- Gerar 2-3 case studies com dados reais (engajamento, participacao, indicadores NR-1)
- **Meta realista:** 20 empresas, 1.600 vidas ativas, R$6.400 MRR

### Fase 3: Primeira parceria com operadora + escala NR-1 (Ano 2)

**Objetivo:** Validar o Produto 2 (Saude) com pelo menos 1 operadora.

- Apresentar dados de 12+ meses de engajamento para operadoras
- Fechar piloto com 1-2 operadoras de medio porte para programa de bonificacao RN 499
- Expandir rede de corretoras para 10-15 parceiros
- Contratar 1-2 vendedores (se receita permitir ou com investimento)
- Iniciar coleta de dados de sinistralidade pre/pos para primeira coorte
- **Meta realista:** 80 empresas + 2 operadoras-piloto, R$40K MRR

### Fase 4: Multiplas operadoras + consideracao do mercado Vida (Ano 3)

**Objetivo:** SaluFlow como ferramenta reconhecida para RN 499.

- Expandir para 5+ operadoras com programas de bonificacao ativos
- Publicar primeiro estudo de impacto em sinistralidade (se dados suportarem)
- Avaliar entrada no mercado de seguro de vida (Produto 3) com base na concorrencia da Prudential
- Participar de congressos do setor (CNSEG, FENASAUDE, Forum ABRAMGE)
- **Meta realista:** 200 empresas + 5 operadoras, R$125K MRR

---

## 6. Riscos e Mitigacoes

| # | Risco | Probabilidade | Impacto | Mitigacao | Residual |
|---|-------|---------------|---------|-----------|----------|
| 1 | **Regulatorio — ANS altera regras sobre bonificacao** | Media | Alto | Modelo baseado em participacao (mais conservador); manter dialogo com ANS; monitorar consultas publicas | Se RN 499 for revogada, Produto 2 perde viabilidade. Produto 1 (NR-1) nao e afetado |
| 2 | **Juridico — Acao trabalhista por discriminacao ou assedio** | Media | Critico | Design participation-based; sem rankings individuais; dados agregados para RH; consultoria juridica trabalhista preventiva | Risco nunca e zero. Um caso judicial pode gerar repercussao negativa mesmo se empresa vencer |
| 3 | **LGPD — Incidente de dados sensiveis** | Baixa | Critico | Armazenamento local; dados granulares nao saem do dispositivo; criptografia; DPO nomeado; testes de seguranca | Violacao de dados de saude tem multa de ate 2% do faturamento (LGPD Art. 52) |
| 4 | **Engajamento — Usuarios nao usam o app** | Alta | Alto | Incentivo financeiro real (bonificacao); onboarding guiado; notificacoes inteligentes; gamificacao pessoal (nao competitiva) | Engajamento de apps de saude tipicamente cai 70-80% apos 30 dias (Statista, 2023). Incentivo financeiro pode mitigar, mas nao ha garantia |
| 5 | **Concorrencia — Prudential Vitality expande para planos de saude** | Media | Alto | Velocidade de execucao; foco em PME (segmento que Prudential nao atende); parcerias com operadoras regionais | Prudential tem recursos para dominar o mercado se decidir entrar. Nossa vantagem e tempo e nicho |
| 6 | **Comercial — Ciclo de venda com operadora muito longo** | Alta | Medio | Receita de NR-1 sustenta a operacao enquanto pipeline de operadoras amadurece; foco em operadoras regionais (ciclo menor) | Pode levar 18-24 meses para fechar primeira operadora. Fluxo de caixa precisa sobreviver esse periodo |
| 7 | **Prova — Impossibilidade de provar reducao de sinistralidade** | Media | Alto | Transparencia: no ano 1, vendemos engajamento e compliance, nao reducao de sinistro. Primeiro estudo so apos 18+ meses | Se apos 18 meses os dados nao mostrarem impacto, o Produto 2 perde a proposta de valor central |
| 8 | **Tecnico — App nao funciona bem em dispositivos variados** | Media | Medio | Testes em dispositivos populares (Samsung, Motorola, Xiaomi); Capacitor como bridge; feedback loop rapido com usuarios | Fragmentacao Android e real. Funcionalidades como camera nativa e Health Connect podem quebrar em dispositivos especificos |
| 9 | **Fundador solo — Risco de pessoa-chave** | Alta | Critico | Documentacao extensiva; codigo bem estruturado; plano de contratacao progressiva | Ate a contratacao de pelo menos 1 pessoa, todo o produto depende de uma unica pessoa |

---

## 7. O que e FATO vs. o que e PROJECAO

Esta secao separa explicitamente o que sabemos de o que estamos assumindo. Investidores e parceiros devem saber a diferenca.

### FATOS (verificaveis, com fonte)

| Afirmacao | Fonte | Verificacao |
|-----------|-------|-------------|
| RN 498/2022 e RN 499/2022 autorizam bonificacao por participacao em programas de saude | Diario Oficial da Uniao, 01/04/2022 | Disponivel no site da ANS |
| NR-1 atualizada exige gestao de riscos psicossociais a partir de mai/2026 | Portaria MTE 1.419/2024 | Disponivel no site do MTE |
| Multas NR-1: R$6.708,09 por trabalhador exposto | NR-28, Tabela de gradacao de multas | Verificavel |
| 530 mil afastamentos por saude mental em 2025 | Dados INSS / Previdencia Social | Reportado em midia (Folha, Valor, etc.) |
| Prudential Vitality opera no Brasil desde 2020 | Site Prudential do Brasil | Verificavel |
| App "Fully" lancado em set/2024 | Comunicado Prudential | Google Play Store / App Store |
| Contratos AMIL PME (30-99 vidas) tem reajuste por sinistralidade individual (clausulas 14.7-14.9) | Contrato coletivo empresarial AMIL (modelo padrao) | Documento contratual |
| Discovery Vitality reporta reducao de 20% em hospitalizacoes para membros ativos | Discovery Ltd. Integrated Annual Report 2023 | Relatorio publico |
| Sinistralidade media do setor ultrapassa 85% | ANS — Dados do setor, 2024 | Disponivel no site da ANS |
| Dados de saude sao dados pessoais sensiveis (LGPD Art. 5, II) | Lei 13.709/2018 | Texto legal |

### PROJECOES (estimativas, sem dados brasileiros proprios)

| Afirmacao | Base da estimativa | Nivel de confianca |
|-----------|-------------------|-------------------|
| SaluFlow pode atingir 20 empresas no ano 1 | Benchmark de startups SaaS B2B no Brasil (Distrito, ABStartups) | Media — depende de execucao comercial |
| Engajamento de 40%+ dos funcionarios | Apps de wellness com incentivo financeiro (Vitality: 60%+, mas contexto diferente) | Baixa — nao ha dados brasileiros comparaveis |
| Reducao de sinistralidade de 5-15% | Discovery Vitality (Africa do Sul), Vitality Health (UK). Resultados apos 3+ anos | Baixa — contexto demografico, cultural e regulatorio completamente diferente |
| Churn de 25-35% no ano 1 | Benchmark SaaS SMB (SaaSholic, ChartMogul) | Media — depende da qualidade do produto e suporte |
| CAC de R$2.000-5.000 por empresa | Estimativa baseada em ciclo de venda B2B SMB (LinkedIn + reunioes + piloto) | Baixa — sem dados de venda reais |
| Break-even no mes 8-12 | Modelo financeiro com premissas acima | Baixa — depende de todas as premissas anteriores se confirmarem |
| Operadoras aceitarao piloto no ano 2 | Interesse qualitativo em conversas iniciais + regulamentacao existente (RN 499) | Baixa — nunca falamos com operadora de saude |
| NR-1 gerara demanda real | Logica regulatoria (multa → compliance → demanda por ferramenta) | Media — pode virar "papel para ingles ver" como varias NRs |

---

## 8. Roadmap

### Timeline com marcos realistas

**Abril-Maio 2026 — Pre-lancamento**
- [ ] Finalizar integracao Health Connect (Android) e HealthKit (iOS)
- [ ] Implementar relatorio NR-1 (dados agregados psicossociais)
- [ ] Publicar app na Play Store (beta fechado)
- [ ] Preparar material comercial (apresentacao, ROI estimado, contrato)
- [ ] Consultoria juridica: validar termos de uso, consentimento LGPD, contrato B2B
- [ ] Recrutar 3-5 empresas para piloto gratuito

**Junho-Agosto 2026 — Piloto e iteracao**
- [ ] 5 empresas em piloto gratuito (150-250 funcionarios)
- [ ] Coletar metricas de engajamento (DAU, MAU, taxa de registro, retencao D7/D30)
- [ ] Iterar produto com feedback real
- [ ] Publicar app na App Store (iOS)
- [ ] Primeiro relatorio NR-1 entregue a empresa-piloto

**Setembro-Dezembro 2026 — Primeiros pagantes**
- [ ] Converter 60-70% dos pilotos em pagantes
- [ ] Atingir 12-15 empresas pagantes
- [ ] Publicar 2 case studies com dados reais
- [ ] Iniciar parcerias com 3 corretoras de seguros
- [ ] Dashboard do RH em producao
- [ ] Primeiro contato formal com 2 operadoras de medio porte

**Janeiro-Junho 2027 — Escala NR-1 + pipeline operadoras**
- [ ] 20+ empresas pagantes
- [ ] 6+ meses de dados de engajamento consolidados
- [ ] Apresentar dados para operadoras (reuniao formal)
- [ ] Contratar primeiro vendedor (se receita permitir)
- [ ] Versao white-label em prototipo
- [ ] Completar 1 ano de dados para primeira coorte

**Julho-Dezembro 2027 — Validacao Produto 2**
- [ ] Piloto com 1 operadora de medio porte (programa RN 499)
- [ ] 50-80 empresas ativas
- [ ] Dashboard atuarial em producao
- [ ] Primeiro estudo de correlacao engajamento vs. sinistralidade (nao causalidade — 12 meses de dados)

**2028 — Escala**
- [ ] 3-5 operadoras com programa de bonificacao ativo
- [ ] 200+ empresas
- [ ] Publicar estudo de impacto (se dados suportarem)
- [ ] Avaliar mercado de seguro de vida (Produto 3) vs. forca da Prudential
- [ ] Considerar captacao Series A (se metricas justificarem)

---

## Anexos

### A. Referencias regulatorias

1. RN 498/2022 — ANS — Boas praticas de programas de promocao da saude — DOU 01/04/2022
2. RN 499/2022 — ANS — Bonificacoes e descontos por participacao em programas — DOU 01/04/2022
3. NR-1 — Disposicoes gerais e gerenciamento de riscos — Portaria MTE 1.419/2024
4. NR-28 — Fiscalizacao e penalidades — Tabela de gradacao de multas
5. LGPD — Lei 13.709/2018 — Art. 5 (dados sensiveis), Art. 11 (tratamento de dados sensiveis)
6. ANPD — Guia Orientativo sobre Tratamento de Dados para Relacoes Trabalhistas (2023)
7. CLT — Art. 373-A (vedacao de discriminacao)
8. Lei 13.146/2015 — Estatuto da Pessoa com Deficiencia

### B. Referencias de mercado

1. ANS — Dados do setor de saude suplementar, 2024
2. INSS — Anuario Estatistico da Previdencia Social, 2025
3. Discovery Ltd. — Integrated Annual Report 2023
4. Prudential do Brasil — Comunicados sobre Vitality / Fully (2020-2024)
5. Contrato coletivo empresarial AMIL — Modelo padrao PME (30-99 vidas)

### C. Screenshots do aplicativo

*Disponivel em: `/public/screenshots/`*

### D. Glossario

| Termo | Definicao |
|-------|-----------|
| **Sinistralidade** | Razao entre despesas assistenciais e receita de contraprestacoes. Ex: sinistralidade de 85% = a cada R$100 recebidos, R$85 gastos em assistencia |
| **RN** | Resolucao Normativa da ANS |
| **NR** | Norma Regulamentadora do Ministerio do Trabalho |
| **PGR** | Programa de Gerenciamento de Riscos (obrigatorio pela NR-1) |
| **PEA** | Programa de Extensao Assistencial (clausula contratual de operadoras) |
| **Coparticipacao** | Parcela do custo de um procedimento paga pelo beneficiario no momento do uso |
| **Indice Tecnico** | Componente do reajuste contratual baseado na sinistralidade individual da empresa |
| **SESMT** | Servico Especializado em Seguranca e Medicina do Trabalho |
| **DPO** | Data Protection Officer (encarregado de dados, LGPD) |

---

*Documento confidencial. Versao 2.0 — Revisao com analise regulatoria e de mercado.*
*SaluFlow (c) 2026. Todos os direitos reservados.*
