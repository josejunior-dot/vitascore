# SaluFlow — Calculadora de ROI

> Estimativas de retorno sobre investimento, separadas por nivel de evidencia.

---

## ROI 1: Compliance NR-1 (PROVAVEL — dados brasileiros)

A NR-1 (Portaria MTE 1.419/2024) exige que empresas com funcionarios CLT implementem gestao de riscos psicossociais. Multa por descumprimento: R$6.708,09 por trabalhador (grau 4, reincidente).

### Calculo — Empresa com 80 funcionarios

```
Multa potencial (pior caso):
80 funcionarios x R$6.708 = R$536.640

Custo do SaluFlow:
80 funcionarios x 60% adesao = 48 ativos
48 ativos x R$4/mes x 12 meses = R$2.304/ano

Investimento: R$2.304/ano
Multa evitada: ate R$536.640
```

### Por que este ROI e provavel

- A multa e definida por **lei brasileira** (NR-1, vigente desde 26/05/2025)
- O SaluFlow gera **relatorio de gestao de riscos psicossociais** que comprova conformidade
- Nao depende de projecoes internacionais — e compliance regulatorio direto
- A empresa investe R$2.304/ano para evitar multa de ate R$536.640

### Tabela por tamanho de empresa

| Funcionarios | Custo SaluFlow/ano | Multa evitada (pior caso) | Relacao custo/multa |
|-------------|--------------------|--------------------------|--------------------|
| 20 | R$576 | R$134.160 | 1:233 |
| 50 | R$1.440 | R$335.400 | 1:233 |
| 80 | R$2.304 | R$536.640 | 1:233 |
| 150 | R$4.320 | R$1.006.200 | 1:233 |
| 300 | R$8.640 | R$2.012.400 | 1:233 |

> Nota: a multa de R$6.708/trabalhador e o teto para infraccoes graves com reincidencia. O valor real depende da classificacao pela fiscalizacao.

---

## ROI 2: Reducao de Reajuste do Plano (PROJETADO — dados internacionais)

### Base da projecao

Os dados de reducao de sinistralidade vem do **Discovery Vitality (Africa do Sul)**, que reporta 10-30% de reducao em custos de saude ao longo de 5+ anos de programa. Esses dados **nao foram validados no mercado brasileiro de planos de saude**.

### Clausula AMIL 14.7-14.9 (contratos 30-99 vidas)

Contratos empresariais da AMIL (e operadoras similares) possuem clausula de **Indice Tecnico**: se a sinistralidade da empresa ultrapassar 65% da receita do contrato, um reajuste adicional e aplicado alem do reajuste anual padrao.

```
Exemplo: empresa com 80 vidas, plano R$450/mes

Receita anual do contrato: 80 x R$450 x 12 = R$432.000
Limite de sinistralidade (65%): R$280.800

SE sinistralidade > R$280.800 → Indice Tecnico ativado → reajuste extra

Reajuste padrao ANS 2024: ~15%
Reajuste com Indice Tecnico: pode chegar a 25-40%
```

### Projecao (cenario otimista)

```
SE o SaluFlow mantiver sinistralidade abaixo de 65%:
  Reajuste evitado: diferenca entre 15% (padrao) e 25%+ (com Indice Tecnico)
  Sobre R$432.000: economia de R$43.200/ano (10 pontos percentuais)

Custo SaluFlow: R$2.304/ano
Economia projetada: R$43.200/ano
ROI projetado: ~18x
```

### Projecao (cenario conservador)

```
SE o SaluFlow reduzir sinistralidade em 5 pontos (metade do minimo Vitality):
  Economia no reajuste: ~R$15.000-20.000/ano (empresa de 80 vidas)

Custo SaluFlow: R$2.304/ano
Economia projetada: R$15.000-20.000/ano
ROI projetado: 6-8x
```

> **IMPORTANTE:** Projecao baseada em dados do Discovery Vitality (Africa do Sul). Resultado no Brasil precisa ser validado em piloto de 12-18 meses. A reducao depende de engajamento, perfil da populacao e tempo de programa.

---

## ROI 3: Reducao de Absenteismo (PARCIALMENTE PROVAVEL)

### Base da estimativa

Estudos internacionais (Mercer, Willis Towers Watson, Harvard Business Review) indicam que programas de wellness corporativo reduzem absenteismo em 25-35%. Esses estudos sao de empresas americanas e europeias — a transferibilidade para o contexto brasileiro e parcial.

### Calculo estimado — Empresa com 80 funcionarios

```
Absenteismo medio brasileiro: ~12 dias/ano por funcionario
Reducao estimada (25%): 3 dias/ano
Custo medio por dia de ausencia: R$200 (salario + encargos + produtividade)

Economia estimada: 80 x 3 dias x R$200 = R$48.000/ano
```

> Nota: a reducao de 25% e uma estimativa conservadora dentro da faixa de 25-35% reportada em estudos internacionais. Resultados variam significativamente por setor, perfil demografico e nivel de engajamento.

---

## Para Operadoras de Saude (PROJETADO)

### Calculo projetado — Carteira de 10.000 vidas

```
Investimento:
10.000 vidas x 60% adesao = 6.000 ativos
6.000 ativos x R$2/mes x 12 = R$144.000/ano

Reducao projetada de sinistralidade (5 pontos percentuais — cenario conservador):
Receita da carteira: 10.000 x R$400/mes x 12 = R$48.000.000/ano
Sinistralidade atual (85%): R$40.800.000
Sinistralidade projetada (80%): R$38.400.000
Economia projetada: R$2.400.000/ano

ROI projetado: ~16x
```

> Discovery Vitality reporta 8-13 pontos de reducao, mas em programas maduros (3-5 anos) com alto engajamento. Usamos 5 pontos como cenario conservador para o primeiro ano.

---

## Para Corretoras

Corretoras nao pagam pelo SaluFlow — recebem comissao sobre a receita gerada.

```
Carteira exemplo: 500 vidas em 10 empresas
Ativos (60%): 300
Receita SaluFlow: 300 x R$4/mes x 12 = R$14.400/ano
Comissao (25%): R$3.600/ano

Custo: R$0
Beneficio adicional: retencao de carteira (clientes com reajuste menor trocam menos de corretora)
```

---

## Metricas realistas de operacao

| Metrica | Valor estimado | Observacao |
|---------|---------------|------------|
| Taxa de adesao (ano 1) | 40-50% | Vitality reporta 70%+ em programas maduros; inicio e menor |
| Taxa de adesao (ano 2+) | 55-65% | Cresce com resultados visiveis |
| Churn mensal estimado | 3-5% | Usuarios que param de usar o app |
| Tempo ate resultado no reajuste | 12-18 meses | Reajuste se aplica no ciclo seguinte |
| Tempo ate resultado no absenteismo | 3-6 meses | Efeito mais rapido |
| CAC estimado (venda direta B2B) | R$500-1.500 | Depende do canal (corretora = menor) |
| LTV estimado (empresa de 80 vidas) | R$6.912 (3 anos) | 48 ativos x R$4 x 36 meses |

---

## Premissas e fontes

| Premissa | Valor | Fonte | Nivel de evidencia |
|----------|-------|-------|-------------------|
| Multa NR-1 | R$6.708/trabalhador | Portaria MTE 1.419/2024 | Comprovado (lei brasileira) |
| Reducao de sinistralidade | 10-30% | Discovery Vitality Health Reports | Internacional (nao validado no Brasil) |
| Reducao de absenteismo | 25-35% | Mercer, WTW, HBR | Internacional (parcialmente aplicavel) |
| Reajuste medio ANS | ~15% | ANS Dados do Setor 2024 | Comprovado (dados brasileiros) |
| Sinistralidade media | 85% | IESS, ANS | Comprovado (dados brasileiros) |
| Limiar Indice Tecnico AMIL | 65% da receita | Contrato AMIL clausulas 14.7-14.9 | Comprovado (contrato real) |
| Engajamento ano 1 | 40-50% | Estimativa propria | Nao validado |

---

## Disclaimers

1. **Esses calculos sao estimativas.** Resultados reais dependem de engajamento, perfil da empresa e tempo de uso.

2. **A reducao de sinistralidade e baseada em dados internacionais** (Discovery Vitality, Africa do Sul) e precisa ser validada no contexto brasileiro com piloto de 12-18 meses.

3. **O unico ROI imediato e comprovavel e o de compliance NR-1.** Os demais sao projecoes que precisam de validacao em campo.

4. **Taxas de adesao no primeiro ano tendem a ser menores** do que em programas maduros. Os calculos com 60% podem ser otimistas para o ano 1.

5. **O ROI nao e 40x.** O ROI comprovavel (NR-1) e uma relacao custo/multa. O ROI projetado (reajuste + absenteismo) varia de 6x a 18x dependendo do cenario, e precisa de validacao.

---

## Fontes

- **Portaria MTE 1.419/2024** — NR-1, gestao de riscos psicossociais
- **Discovery Vitality Health Impact Reports** — Dados de programas de wellness (Africa do Sul, 25+ anos de operacao)
- **ANS - Dados do Setor 2024** — Reajustes e sinistralidade do mercado brasileiro
- **IESS** — Estudos sobre custos assistenciais no Brasil
- **Contrato AMIL PME** — Clausulas 14.7-14.9 sobre Indice Tecnico
- **Mercer Marsh Benefits Survey 2024** — Benchmarks de wellness corporativo
- **Willis Towers Watson Global Benefits Survey** — Impacto de programas de saude

---

*Documento atualizado em abril/2026. Valores sao estimativas para fins de projecao comercial. Resultados reais dependem de validacao em campo.*
