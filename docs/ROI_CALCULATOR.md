# VitaScore — Calculadora de ROI

> Estime o retorno sobre investimento do VitaScore para sua empresa ou carteira de seguros

---

## Para Empresas (RH)

### Parametros de Entrada

| Parametro | Valor Padrao | Observacao |
|-----------|-------------|------------|
| Numero de funcionarios | 80 | Ajuste conforme a empresa |
| Taxa de adesao | 60% | Conservador (Vitality reporta 70%+) |
| Custo VitaScore | R$4/ativo/mes | Preco B2B padrao |
| Valor medio do plano/mes | R$450 | Media mercado PME |
| Reajuste atual (%/ano) | 15% | Media ANS 2024 |
| Reajuste com VitaScore (%/ano) | 8% | Reducao pela melhora da sinistralidade |
| Absenteismo atual (dias/ano) | 12 | Media brasileira |
| Absenteismo com VitaScore (dias/ano) | 8 | Reducao de 33% |
| Custo medio por dia de ausencia | R$200 | Salario + encargos + produtividade |

### Calculo — Empresa com 80 funcionarios

#### Custo do VitaScore

```
80 funcionarios x 60% adesao = 48 ativos
48 ativos x R$4/mes = R$192/mes
R$192 x 12 meses = R$2.304/ano
```

#### Economia 1: Reajuste Menor no Plano

```
Gasto anual com plano: 80 x R$450/mes x 12 = R$432.000/ano

Reajuste SEM VitaScore (15%): +R$64.800/ano
Reajuste COM VitaScore (8%):  +R$34.560/ano

Economia: R$30.240/ano
```

#### Economia 2: Reducao do Absenteismo

```
Custo absenteismo SEM VitaScore: 80 x 12 dias x R$200 = R$192.000/ano
Custo absenteismo COM VitaScore: 80 x  8 dias x R$200 = R$128.000/ano

Economia: R$64.000/ano
```

#### Economia 3: Desconto na Coparticipacao (beneficio ao funcionario)

```
Funcionarios com Score Ouro (700+): ~40% dos ativos
Desconto medio na coparticipacao: 20%
Economia media por funcionario: ~R$230/ano

80 funcionarios x R$230 = R$18.400/ano (economia coletiva)
```

#### Resultado Final

```
Investimento anual:  R$2.304
Economia total:      R$94.240 (reajuste + absenteismo)
                     R$112.640 (incluindo coparticipacao)

ROI:                 40,9x
Payback:             9 dias
```

### Tabela para Diferentes Tamanhos de Empresa

| Funcionarios | Ativos (60%) | Custo VitaScore/ano | Economia estimada/ano | ROI |
|-------------|-------------|--------------------|-----------------------|-----|
| 20 | 12 | R$576 | R$23.560 | 40x |
| 50 | 30 | R$1.440 | R$58.900 | 40x |
| 80 | 48 | R$2.304 | R$94.240 | 40x |
| 150 | 90 | R$4.320 | R$176.700 | 40x |
| 300 | 180 | R$8.640 | R$353.400 | 40x |
| 500 | 300 | R$14.400 | R$589.000 | 40x |
| 1.000 | 600 | R$28.800 | R$1.178.000 | 40x |

> O ROI se mantem consistente porque os custos e economias escalam linearmente.

---

## Para Seguradoras

### Parametros de Entrada

| Parametro | Valor Padrao | Observacao |
|-----------|-------------|------------|
| Numero de vidas na carteira | 10.000 | Ajuste conforme a carteira |
| Taxa de adesao | 60% | Conservador |
| Custo VitaScore | R$2/vida ativa/mes | Preco B2B2C |
| Ticket medio do plano/mes | R$400 | Media mercado |
| Sinistralidade atual | 85% | Media do setor |
| Sinistralidade com VitaScore | 77% | Reducao de 8 pontos percentuais |

### Calculo — Carteira de 10.000 vidas

#### Investimento

```
10.000 vidas x 60% adesao = 6.000 ativos
6.000 ativos x R$2/mes = R$12.000/mes
R$12.000 x 12 meses = R$144.000/ano
```

#### Retorno: Reducao de Sinistralidade

```
Receita da carteira: 10.000 x R$400/mes x 12 = R$48.000.000/ano

Sinistralidade SEM VitaScore (85%): R$40.800.000/ano
Sinistralidade COM VitaScore (77%): R$36.960.000/ano

Economia: R$3.840.000/ano
```

#### Resultado Final

```
Investimento anual:  R$144.000
Economia anual:      R$3.840.000

ROI:                 26,7x
Payback:             14 dias
```

### Tabela para Diferentes Carteiras

| Vidas | Ativos (60%) | Investimento/ano | Economia/ano | ROI |
|-------|-------------|-----------------|-------------|-----|
| 1.000 | 600 | R$14.400 | R$384.000 | 26x |
| 5.000 | 3.000 | R$72.000 | R$1.920.000 | 26x |
| 10.000 | 6.000 | R$144.000 | R$3.840.000 | 26x |
| 50.000 | 30.000 | R$720.000 | R$19.200.000 | 26x |
| 100.000 | 60.000 | R$1.440.000 | R$38.400.000 | 26x |
| 200.000 | 120.000 | R$2.880.000 | R$76.800.000 | 26x |

> Para seguradoras, o success fee adicional (sobre sinistralidade reduzida) nao esta incluido neste calculo.

---

## Para Corretoras

### Modelo de Receita

Corretoras nao pagam pelo VitaScore — recebem comissao sobre a receita gerada nas empresas da sua carteira.

```
Carteira exemplo: 500 vidas distribuidas em 10 empresas
Funcionarios ativos (60%): 300
Receita VitaScore: 300 x R$4/mes x 12 = R$14.400/ano
Comissao da corretora (25%): R$3.600/ano

Custo para a corretora: R$0
```

### Tabela por Tamanho de Carteira

| Vidas na Carteira | Ativos (60%) | Receita VitaScore/ano | Comissao (25%) |
|-------------------|-------------|----------------------|----------------|
| 200 | 120 | R$5.760 | R$1.440/ano |
| 500 | 300 | R$14.400 | R$3.600/ano |
| 1.000 | 600 | R$28.800 | R$7.200/ano |
| 2.000 | 1.200 | R$57.600 | R$14.400/ano |
| 5.000 | 3.000 | R$144.000 | R$36.000/ano |
| 10.000 | 6.000 | R$288.000 | R$72.000/ano |

### Beneficios adicionais para a corretora

- **Retencao de carteira:** Empresas com VitaScore tem reajustes menores, reduzindo churn
- **Argumento comercial:** Diferencial competitivo na captacao de novas contas
- **Upsell:** Facilita venda de planos premium com desconto VitaScore embutido

---

## Premissas

Todas as estimativas deste documento sao baseadas nas seguintes premissas:

| Premissa | Valor | Justificativa |
|----------|-------|---------------|
| Taxa de adesao | 60% | Conservador; Discovery Vitality reporta 70%+ em programas maduros |
| Reducao de sinistralidade | 8 pontos percentuais | Baseado em dados da Vitality (Africa do Sul) e programas similares |
| Reducao de absenteismo | 33% (de 12 para 8 dias) | Alinhado com estudos de wellness corporativo (Mercer, Willis Towers Watson) |
| Reajuste menor | 7 pontos percentuais (de 15% para 8%) | Correlacao direta com sinistralidade reduzida |
| Desconto coparticipacao Score Ouro | 20% | Politica configuravel por operadora |
| Custo por dia de ausencia | R$200 | Inclui salario, encargos e perda de produtividade (media PME) |
| Ticket medio plano empresarial | R$450/mes | Media ANS para PMEs (2024) |
| Ticket medio plano seguradora | R$400/mes | Media ponderada de carteiras mistas |

### Observacoes importantes

- Os valores apresentados sao **estimativas conservadoras**. Resultados reais dependem do perfil da populacao, engajamento e tempo de programa.
- A economia com reajuste se materializa no **ciclo anual seguinte** (12-18 meses).
- A reducao de absenteismo tem efeito **imediato** (primeiros 3-6 meses).
- O desconto na coparticipacao beneficia o **funcionario diretamente**, aumentando a percepcao de valor.

---

## Fontes

- **Discovery Vitality Health Impact Report 2023** — Dados de impacto em sinistralidade e engajamento em programas de wellness
- **ANS - Dados do Setor (2024)** — Reajustes medios, sinistralidade e indicadores do mercado de saude suplementar brasileiro
- **IESS - Instituto de Estudos de Saude Suplementar** — Estudos sobre custos assistenciais e absenteismo
- **Mercer Marsh Benefits Survey Brazil 2024** — Benchmarks de beneficios corporativos e wellness
- **Willis Towers Watson Global Benefits Attitudes Survey** — Impacto de programas de saude na produtividade

---

*Documento gerado para fins de projecao comercial. Valores reais podem variar conforme perfil da populacao e nivel de engajamento.*
