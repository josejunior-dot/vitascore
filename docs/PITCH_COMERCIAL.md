# VitaScore — Pitch Comercial para Operadoras de Saude

## A ferramenta que faltava para operadoras implementarem a RN 498/499 da ANS

---

### A ANS ja criou o framework. Quase ninguem implementou.

Em 2022, a ANS publicou duas resolucoes que mudaram as regras do jogo:

- **RN 498/2022** — obriga operadoras a implementarem programas de promocao da saude e prevencao de doencas
- **RN 499/2022** — estabelece criterios para bonificacao de beneficiarios que participam desses programas

O objetivo e claro: reduzir sinistralidade atraves de prevencao ativa. A ANS nao apenas autorizou — ela **incentivou** operadoras a bonificarem beneficiarios que adotam habitos saudaveis.

Mas existe um problema: **quase nenhuma operadora implementou de verdade.**

Por que? Porque a RN diz o que fazer, mas nao oferece a ferramenta para fazer. Operadoras nao tem como:

- Monitorar participacao de forma verificavel e auditavel
- Distinguir participacao real de autodeclaracao sem comprovacao
- Gerar relatorios que atendam aos criterios da ANS
- Escalar o programa para milhares de vidas sem custos operacionais proibitivos

**VitaScore e essa ferramenta.**

---

### O que e o VitaScore

VitaScore e um SaaS (Software as a Service) que permite operadoras de planos de saude implementarem programas de promocao da saude conforme a RN 498/499 da ANS.

O beneficiario instala o app. O app monitora 6 pilares de saude com verificacao automatica. A operadora recebe dados agregados e verificados de participacao. O beneficiario que participa recebe bonificacao — conforme previsto na regulamentacao.

**Ponto critico:** a bonificacao prevista na RN 499 e por **participacao**, nao por resultado. O beneficiario nao precisa emagrecer 10kg — ele precisa demonstrar que esta participando ativamente do programa. O VitaScore documenta essa participacao de forma verificavel.

---

### Os 6 pilares de monitoramento

| Pilar | O que monitora | Como verifica |
|---|---|---|
| **Movimento** | Passos, exercicio, frequencia | Acelerometro + GPS + padrao de movimento |
| **Sono** | Duracao, regularidade, qualidade | Sensores do dispositivo + padrao comportamental |
| **Nutricao** | Qualidade das refeicoes | Foto verificada + analise por IA |
| **Peso** | IMC, evolucao mensal | Foto da balanca verificada + tendencia |
| **Bem-estar Digital** | Tempo de tela, pausas, equilibrio | Monitoramento do dispositivo |
| **Engajamento** | Consistencia, evolucao, adesao | Algoritmo de comportamento |

Cada pilar gera um sub-score. A combinacao dos 6 gera o **VitaScore** — um numero unico de 0 a 1000, auditavel e comparavel.

---

### Por que a operadora deveria se importar

#### 1. Pontuacao no IDSS

Operadoras que implementam programas de promocao da saude conforme RN 498 ganham **pontuacao adicional no IDSS** (Indice de Desempenho da Saude Suplementar). Um IDSS mais alto significa:

- Melhor reputacao regulatoria
- Menor escrutinio da ANS
- Diferencial competitivo mensuravel

#### 2. Reducao na margem de solvencia

Operadoras com programas de promocao da saude implementados podem se beneficiar de **reducao nos requisitos de margem de solvencia** — liberando capital que estaria travado em reservas.

#### 3. Reducao projetada de sinistralidade

Dados do **Discovery Vitality** (Africa do Sul, 25+ anos de operacao) e programas similares em outros paises sugerem:

| Metrica | Resultado observado |
|---|---|
| Reducao de sinistros (membros engajados) | 10-35% |
| Reducao de internacoes evitaveis | 20-25% |
| Melhora na retencao de carteira | 25-40% |

> **IMPORTANTE:** Esses dados sao projetados com base no Discovery Vitality e programas similares internacionais. **Ainda nao foram validados no mercado brasileiro de planos de saude.** E exatamente por isso que propomos um piloto gratuito — para gerar dados reais no contexto brasileiro.

#### 4. Compliance regulatorio pronto

O VitaScore gera automaticamente a documentacao que a ANS exige para programas de promocao da saude:

- Relatorio de participacao por beneficiario
- Metricas agregadas por grupo/empresa
- Evidencia de bonificacao vinculada a participacao (nao a resultado)
- Historico auditavel com hash verificavel

---

### Como funciona na pratica

```
Operadora contrata o VitaScore
        |
        v
Beneficiarios instalam o app (gratuito para eles)
        |
        v
App monitora 6 pilares com verificacao automatica
        |
        v
Dados validados por IA + anti-fraude (5 camadas)
        |
        v
Operadora recebe dashboard com dados AGREGADOS de participacao
        |
        v
Beneficiarios que participam recebem bonificacao (conforme RN 499)
        |
        v
Relatorio mensal para compliance ANS
```

**Para o beneficiario:** um app que transforma habitos em economia real.
**Para o RH da empresa contratante:** dashboard com metricas agregadas de saude da equipe.
**Para a operadora:** dados verificados de participacao + compliance regulatorio + reducao projetada de sinistralidade.

---

### Sistema anti-fraude — 5 camadas

Operadoras precisam confiar nos dados. Por isso o VitaScore tem 5 camadas de verificacao independentes:

1. **Camera obrigatoria** — fotos de refeicoes e balanca em tempo real. Galeria bloqueada.
2. **Deteccao de foto-de-foto** — IA analisa padroes de moire, reflexo de tela e distorcao optica.
3. **Timestamp verificado** — cada dado com timestamp do servidor. Janela de tolerancia: 2 minutos.
4. **Geolocalizacao** — GPS registrado em cada coleta. Padroes anomalos sinalizados.
5. **Hash SHA-256** — assinatura criptografica de cada dado. Cadeia de custodia digital auditavel.

**Score de confianca:** cada dado recebe nota de 0% a 100%. A operadora define o threshold minimo.

---

### Conformidade LGPD

Arquitetura com **privacy by design**:

- Dados de saude armazenados **exclusivamente no dispositivo** do beneficiario
- Apenas o **score agregado** e compartilhado com a operadora
- Exportacao e exclusao de dados pelo proprio usuario a qualquer momento
- Consentimento explicito e granular para cada tipo de coleta
- Relatorios contem apenas dados anonimizados e agregados
- Documentacao completa para DPO e auditoria

---

### O que NAO somos

| Confusao comum | Realidade |
|---|---|
| **"E o Vitality?"** | Nao. O Vitality (Prudential) opera em **seguro de vida**, nao em planos de saude. E nao esta disponivel para operadoras ANS como ferramenta SaaS. |
| **"E o Gympass/Wellhub?"** | Nao. Gympass vende **acesso a academias**. Nao monitora saude, nao gera compliance ANS, nao bonifica por participacao. |
| **"E uma operadora de saude?"** | Nao. Somos uma **ferramenta SaaS** que operadoras usam para implementar seus proprios programas. |
| **"E um app de saude para o consumidor?"** | Nao. O usuario final e a **operadora**. O app do beneficiario e o meio, nao o fim. |

**VitaScore e uma ferramenta SaaS para operadoras implementarem programas de promocao da saude conforme RN 498/499 da ANS, com monitoramento verificavel de participacao e geracao automatica de relatorios de compliance.**

---

### Modelo comercial

| Item | Valor | Observacao |
|---|---|---|
| Licenca por vida ativa | R$2/mes | So paga por quem efetivamente usa |
| Setup e implantacao | R$0 | Sem custo de entrada |
| Integracao via API | Inclusa | Conecta com sistemas existentes |
| White label | Sob consulta | App com a marca da operadora |
| SLA de disponibilidade | 99,5% | Contratual |

---

### Projecao de impacto — com as ressalvas corretas

**Cenario: carteira de 10.000 vidas, ticket medio R$400/mes**

```
Receita anual:                      R$ 48.000.000
Sinistralidade atual (85%):         R$ 40.800.000 em custos

Cenario conservador (reducao de 5%): R$ 38.760.000
Economia anual:                      R$ 2.040.000

Cenario moderado (reducao de 10%):   R$ 36.720.000
Economia anual:                      R$ 4.080.000

Investimento no VitaScore:           R$ 240.000/ano
```

> **Transparencia:** esses cenarios sao projecoes baseadas em dados do Discovery Vitality (Africa do Sul), John Hancock Vitality (EUA) e AIA Vitality (Asia-Pacifico). **Ainda nao foram validados no mercado brasileiro de planos de saude.** A reducao real de sinistralidade depende de adesao, perfil da carteira e tempo de implementacao. Resultados significativos em sinistralidade tipicamente levam **12 a 18 meses** para se materializarem.

---

### A narrativa completa

1. **A ANS ja criou o framework** — RN 498/2022 e RN 499/2022 estabelecem as regras para programas de promocao da saude com bonificacao por participacao.

2. **Quase nenhuma operadora implementou** — porque nao existe ferramenta para monitorar participacao de forma verificavel, escalavel e auditavel.

3. **VitaScore e essa ferramenta** — monitora 6 pilares de saude com verificacao anti-fraude em 5 camadas, gera relatorios de compliance e documenta participacao.

4. **Operadoras que implementam ganham bonus regulatorio** — pontuacao no IDSS e potencial reducao na margem de solvencia.

5. **Dados internacionais sugerem reducao de 10-30% em gastos** — mas precisamos validar no Brasil. Por isso oferecemos piloto gratuito para gerar dados reais.

6. **Piloto de 90 dias, sem custo, sem risco** — a operadora so paga se decidir continuar apos ver os resultados.

---

### Por que agora?

1. **RN 498/499 ja estao em vigor** — o framework regulatorio existe. Quem implementar primeiro captura o posicionamento.

2. **Sinistralidade no pico historico** — operadoras precisam de solucoes reais, nao de mais planilhas.

3. **NR-1 entrou em vigor** — empresas contratantes de planos estao buscando operadoras que oferecam programas de saude mental. O pilar de bem-estar digital do VitaScore atende esse requisito.

4. **Smartphones com sensores** — 68% dos brasileiros com plano de saude tem smartphone com sensores de saude. A infraestrutura ja existe no bolso do beneficiario.

5. **First mover advantage** — a primeira operadora a implementar captura o diferencial competitivo. A segunda sera "mais uma."

---

### Roadmap

| Quando | Marco | Status |
|---|---|---|
| Abr 2026 | MVP completo — 14 telas, 6 pilares, anti-fraude em 5 camadas | Concluido |
| Mai 2026 | Piloto com 5 empresas (500 vidas) | Proximo |
| Jul 2026 | App publicado na Google Play Store | Planejado |
| Set 2026 | Primeira parceria com operadora | Planejado |
| Dez 2026 | 50 empresas, 4.000 vidas ativas | Meta |
| 2027 | White label para operadoras, 30.000 vidas | Visao |

---

### Proximos passos

**Piloto gratuito de 90 dias:**

Implantamos o VitaScore em 3 a 5 empresas da sua carteira, sem custo. Voce acompanha os resultados em tempo real pelo dashboard. Ao final, decidimos juntos se faz sentido escalar.

Sem contrato de fidelidade. Sem custo de implantacao. Sem risco.

Se os dados nao mostrarem valor, voce cancela sem pagar nada. Se mostrarem, conversamos sobre escala.

---

### Base legal

- **RN 498/2022 (ANS)** — Programas de promocao da saude e prevencao de riscos e doencas
- **RN 499/2022 (ANS)** — Bonificacao por adesao a programas de promocao da saude
- **LGPD (Lei 13.709/2018)** — Protecao de dados pessoais e dados sensiveis de saude
- **Lei 9.656/1998** — Lei dos planos de saude

---

### Contato

**Julio Pires** — Fundador, VitaScore
[E-mail para contato]
[Telefone / WhatsApp]
[LinkedIn]

---

> *A ANS criou o caminho. VitaScore e o veiculo.*
>
> Programas de promocao da saude com bonificacao por participacao
> ja sao regulamentados. O que falta e a ferramenta para implementar.
>
> **A pergunta nao e se vale a pena. E quem vai implementar primeiro.**
