const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Inter', -apple-system, sans-serif;
    color: #1c1e21;
    background: #ffffff;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .page {
    width: 100%;
    min-height: 100vh;
    padding: 60px 64px;
    page-break-after: always;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .page:last-child { page-break-after: avoid; }

  /* Meta-style accent bar */
  .accent-bar {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, #0668E1 0%, #00B4D8 50%, #00C853 100%);
  }

  /* Typography */
  h1 { font-size: 42px; font-weight: 800; letter-spacing: -1.5px; line-height: 1.1; }
  h2 { font-size: 28px; font-weight: 700; letter-spacing: -0.5px; color: #1c1e21; margin-bottom: 24px; }
  h3 { font-size: 18px; font-weight: 600; color: #1c1e21; margin-bottom: 12px; }
  p { font-size: 15px; line-height: 1.6; color: #606770; }
  .subtitle { font-size: 18px; color: #606770; font-weight: 400; line-height: 1.5; }
  .overline { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #0668E1; margin-bottom: 12px; }

  /* Cards */
  .card {
    background: #f7f8fa;
    border-radius: 16px;
    padding: 28px;
    border: 1px solid #e4e6ea;
  }
  .card-blue {
    background: linear-gradient(135deg, #0668E1 0%, #0553B9 100%);
    color: white;
    border: none;
  }
  .card-blue p, .card-blue .subtitle { color: rgba(255,255,255,0.85); }
  .card-blue h2, .card-blue h3 { color: white; }

  /* Grid */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
  .grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 16px; }

  /* Stats */
  .stat-number { font-size: 48px; font-weight: 800; letter-spacing: -2px; line-height: 1; }
  .stat-number-sm { font-size: 32px; font-weight: 800; letter-spacing: -1px; }
  .stat-label { font-size: 13px; color: #606770; margin-top: 6px; font-weight: 500; }

  /* Table */
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th { text-align: left; padding: 12px 16px; font-weight: 600; color: #606770; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e4e6ea; }
  td { padding: 14px 16px; border-bottom: 1px solid #f0f2f5; }
  tr:last-child td { border-bottom: none; }
  .highlight-row { background: #f0f7ff; }

  /* Pill badge */
  .pill { display: inline-block; padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; }
  .pill-blue { background: #e7f3ff; color: #0668E1; }
  .pill-green { background: #e6f9ee; color: #00a650; }
  .pill-amber { background: #fff8e1; color: #e68a00; }

  /* Progress bar */
  .progress-bg { background: #e4e6ea; border-radius: 8px; height: 10px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 8px; }

  /* Pillar icon */
  .pillar-icon {
    width: 48px; height: 48px; border-radius: 14px; display: flex;
    align-items: center; justify-content: center; font-size: 22px; margin-bottom: 12px;
  }

  /* Footer */
  .footer {
    position: absolute; bottom: 28px; left: 64px; right: 64px;
    display: flex; justify-content: space-between; align-items: center;
    font-size: 11px; color: #bec3c9;
  }
  .footer-logo { font-weight: 800; font-size: 14px; color: #0668E1; letter-spacing: -0.5px; }

  /* ROI calculator */
  .roi-input {
    display: flex; align-items: center; gap: 12px; padding: 14px 20px;
    background: white; border: 2px solid #e4e6ea; border-radius: 12px; margin-bottom: 12px;
  }
  .roi-input label { font-size: 14px; color: #606770; flex: 1; }
  .roi-input .value { font-size: 20px; font-weight: 700; color: #1c1e21; }

  .roi-result {
    background: linear-gradient(135deg, #00a650 0%, #008c44 100%);
    border-radius: 16px; padding: 28px; color: white; text-align: center;
  }
  .roi-result .big { font-size: 52px; font-weight: 900; letter-spacing: -2px; }
  .roi-result p { color: rgba(255,255,255,0.85); }

  .spacer { flex: 1; }
  .mt-auto { margin-top: auto; }
  .text-center { text-align: center; }
  .mb-8 { margin-bottom: 8px; }
  .mb-16 { margin-bottom: 16px; }
  .mb-24 { margin-bottom: 24px; }
  .mb-32 { margin-bottom: 32px; }
  .mb-40 { margin-bottom: 40px; }
  .mt-24 { margin-top: 24px; }
  .gap-32 { gap: 32px; }
</style>
</head>
<body>

<!-- ======================== SLIDE 1: CAPA ======================== -->
<div class="page" style="justify-content: center; align-items: center; text-align: center; background: linear-gradient(160deg, #f7f8fa 0%, #e7f3ff 40%, #f7f8fa 100%);">
  <div class="accent-bar"></div>
  <div style="margin-bottom: 40px;">
    <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #0668E1, #00B4D8); border-radius: 22px; display: flex; align-items: center; justify-content: center; margin: 0 auto 28px;">
      <span style="font-size: 36px; color: white; font-weight: 900;">V</span>
    </div>
    <h1 style="font-size: 52px; margin-bottom: 16px;">VitaScore</h1>
    <p class="subtitle" style="max-width: 500px; margin: 0 auto;">A plataforma que transforma hábitos saudáveis em redução de sinistralidade — com dados verificados.</p>
  </div>
  <div style="display: flex; gap: 12px; justify-content: center; margin-top: 20px;">
    <span class="pill pill-blue">Saúde Corporativa</span>
    <span class="pill pill-green">Redução de Custos</span>
    <span class="pill pill-amber">LGPD Compliant</span>
  </div>
  <div class="footer">
    <span class="footer-logo">VitaScore</span>
    <span>Confidencial · Abril 2026</span>
  </div>
</div>

<!-- ======================== SLIDE 2: O PROBLEMA ======================== -->
<div class="page">
  <div class="accent-bar"></div>
  <div class="overline">O Problema</div>
  <h2 style="font-size: 34px; margin-bottom: 12px;">Planos de saúde custam cada vez mais.<br>E ninguém tem ferramenta para mudar isso.</h2>
  <p class="subtitle mb-40">70% das internações são por doenças evitáveis. Mas nenhuma seguradora tem dados verificados sobre os hábitos dos beneficiários.</p>

  <div class="grid-4 mb-40">
    <div class="card text-center">
      <div class="stat-number" style="color: #0668E1;">R$270B</div>
      <div class="stat-label">Mercado de planos de saúde/ano</div>
    </div>
    <div class="card text-center">
      <div class="stat-number" style="color: #e03131;">85%</div>
      <div class="stat-label">Sinistralidade média</div>
    </div>
    <div class="card text-center">
      <div class="stat-number" style="color: #e68a00;">15-25%</div>
      <div class="stat-label">Reajuste anual</div>
    </div>
    <div class="card text-center">
      <div class="stat-number" style="color: #00a650;">70%</div>
      <div class="stat-label">Doenças evitáveis</div>
    </div>
  </div>

  <div class="card" style="border-left: 4px solid #e03131; background: #fff5f5;">
    <h3 style="color: #e03131; margin-bottom: 8px;">O ciclo vicioso</h3>
    <p>Beneficiários sedentários → mais doenças → mais sinistros → reajuste alto → empresa cancela o plano → seguradora perde receita.</p>
  </div>
  <div class="footer"><span class="footer-logo">VitaScore</span><span>2</span></div>
</div>

<!-- ======================== SLIDE 3: A SOLUÇÃO ======================== -->
<div class="page">
  <div class="accent-bar"></div>
  <div class="overline">A Solução</div>
  <h2 style="font-size: 34px;">Monitorar hábitos com verificação.<br>Premiar quem cuida da saúde.</h2>
  <p class="subtitle mb-32">O modelo já funciona há 25 anos na África do Sul (Discovery Vitality, US$10B). O VitaScore traz para o Brasil — melhor e mais barato.</p>

  <div class="grid-3 mb-32">
    <div class="card">
      <div class="pillar-icon" style="background: #e7f3ff;"><span>🏃</span></div>
      <h3>Movimento</h3>
      <p>Passos, exercícios, corrida com GPS. Via Health Connect / HealthKit.</p>
      <div style="margin-top: 12px;"><span class="pill pill-blue">300 pts</span></div>
    </div>
    <div class="card">
      <div class="pillar-icon" style="background: #f3e8ff;"><span>🌙</span></div>
      <h3>Sono</h3>
      <p>Detecção automática por acelerômetro. Score de confiança verificável.</p>
      <div style="margin-top: 12px;"><span class="pill pill-blue">250 pts</span></div>
    </div>
    <div class="card">
      <div class="pillar-icon" style="background: #fff8e1;"><span>🥗</span></div>
      <h3>Nutrição</h3>
      <p>Foto do prato + análise por IA. Anti-fraude em 5 camadas.</p>
      <div style="margin-top: 12px;"><span class="pill pill-blue">150 pts</span></div>
    </div>
    <div class="card">
      <div class="pillar-icon" style="background: #e6f9ee;"><span>⚖️</span></div>
      <h3>Peso</h3>
      <p>Foto da balança com OCR. IMC, tendência e agendamento semanal.</p>
      <div style="margin-top: 12px;"><span class="pill pill-green">Bônus</span></div>
    </div>
    <div class="card">
      <div class="pillar-icon" style="background: #e7f3ff;"><span>📱</span></div>
      <h3>Bem-estar Digital</h3>
      <p>Tempo de tela como indicador de saúde mental. Coleta 100% automática.</p>
      <div style="margin-top: 12px;"><span class="pill pill-blue">200 pts</span></div>
    </div>
    <div class="card">
      <div class="pillar-icon" style="background: #fff0f0;"><span>🏆</span></div>
      <h3>Engajamento</h3>
      <p>Desafios semanais, ranking, conquistas. Gamificação que mantém o uso.</p>
      <div style="margin-top: 12px;"><span class="pill pill-blue">100 pts</span></div>
    </div>
  </div>

  <div class="card card-blue text-center">
    <p style="margin-bottom: 8px;">VitaScore total</p>
    <div class="stat-number" style="color: white;">0 — 1000 pts</div>
    <p style="margin-top: 8px;">Score auditável com hash SHA-256 · Dados verificados por sensores e IA</p>
  </div>
  <div class="footer"><span class="footer-logo">VitaScore</span><span>3</span></div>
</div>

<!-- ======================== SLIDE 4: ANTI-FRAUDE ======================== -->
<div class="page">
  <div class="accent-bar"></div>
  <div class="overline">Verificação</div>
  <h2 style="font-size: 34px;">Dados que a seguradora pode confiar.<br>5 camadas de anti-fraude.</h2>
  <p class="subtitle mb-32">O diferencial do VitaScore não é monitorar — é PROVAR. Cada dado tem score de confiança e assinatura criptográfica.</p>

  <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px;">
    <div class="card" style="display: flex; align-items: center; gap: 20px; border-left: 4px solid #0668E1;">
      <div style="font-size: 28px; font-weight: 900; color: #0668E1; width: 36px;">1</div>
      <div><h3 style="margin-bottom: 4px;">Câmera obrigatória</h3><p>Galeria bloqueada. Só aceita foto tirada na hora. Capacitor CameraSource.Camera.</p></div>
    </div>
    <div class="card" style="display: flex; align-items: center; gap: 20px; border-left: 4px solid #0668E1;">
      <div style="font-size: 28px; font-weight: 900; color: #0668E1; width: 36px;">2</div>
      <div><h3 style="margin-bottom: 4px;">Detecção de foto-de-foto</h3><p>IA analisa padrão moiré, reflexo de tela e bordas de dispositivo.</p></div>
    </div>
    <div class="card" style="display: flex; align-items: center; gap: 20px; border-left: 4px solid #0668E1;">
      <div style="font-size: 28px; font-weight: 900; color: #0668E1; width: 36px;">3</div>
      <div><h3 style="margin-bottom: 4px;">Timestamp verificado</h3><p>Foto deve ser de agora (±2 minutos). Impede reuso de fotos antigas.</p></div>
    </div>
    <div class="card" style="display: flex; align-items: center; gap: 20px; border-left: 4px solid #0668E1;">
      <div style="font-size: 28px; font-weight: 900; color: #0668E1; width: 36px;">4</div>
      <div><h3 style="margin-bottom: 4px;">Geolocalização GPS</h3><p>Posição registrada com cada dado. Padrão de localização consistente.</p></div>
    </div>
    <div class="card" style="display: flex; align-items: center; gap: 20px; border-left: 4px solid #0668E1;">
      <div style="font-size: 28px; font-weight: 900; color: #0668E1; width: 36px;">5</div>
      <div><h3 style="margin-bottom: 4px;">Hash SHA-256</h3><p>Assinatura criptográfica de cada dado. Anti-adulteração. Auditável.</p></div>
    </div>
  </div>

  <div class="card" style="background: #f0f7ff; border: 2px solid #0668E1; text-align: center;">
    <p style="color: #0668E1; font-weight: 600;">A seguradora define o threshold: "só aceito dados com confiança acima de 70%"</p>
  </div>
  <div class="footer"><span class="footer-logo">VitaScore</span><span>4</span></div>
</div>

<!-- ======================== SLIDE 5: RESULTADOS ======================== -->
<div class="page">
  <div class="accent-bar"></div>
  <div class="overline">Resultados Projetados</div>
  <h2 style="font-size: 34px;">O modelo já provou que funciona.<br>Em 40 países.</h2>
  <p class="subtitle mb-32">Baseado em dados do Discovery Vitality (25 anos de operação, 3,4M membros), adaptados para o mercado brasileiro.</p>

  <table style="margin-bottom: 32px;">
    <thead>
      <tr><th>Métrica</th><th>Sem VitaScore</th><th>Com VitaScore</th><th>Impacto</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Sinistralidade</strong></td><td>85%</td><td style="color: #00a650; font-weight: 700;">72-78%</td><td><span class="pill pill-green">-8 a -13 pts</span></td></tr>
      <tr><td><strong>Internações evitáveis</strong></td><td>100% (base)</td><td style="color: #00a650; font-weight: 700;">-25%</td><td><span class="pill pill-green">↓ 1/4</span></td></tr>
      <tr><td><strong>Absenteísmo</strong></td><td>12 dias/ano</td><td style="color: #00a650; font-weight: 700;">8 dias/ano</td><td><span class="pill pill-green">-33%</span></td></tr>
      <tr><td><strong>Cancelamento</strong></td><td>18%/ano</td><td style="color: #00a650; font-weight: 700;">11%/ano</td><td><span class="pill pill-green">-39%</span></td></tr>
      <tr><td><strong>NPS do beneficiário</strong></td><td>32</td><td style="color: #00a650; font-weight: 700;">58</td><td><span class="pill pill-green">+81%</span></td></tr>
    </tbody>
  </table>

  <div class="grid-3">
    <div class="card text-center" style="border-top: 4px solid #0668E1;">
      <p style="font-weight: 600; margin-bottom: 4px;">Discovery Vitality</p>
      <div class="stat-number-sm" style="color: #0668E1;">US$10B</div>
      <div class="stat-label">Valuation · 40+ países</div>
    </div>
    <div class="card text-center" style="border-top: 4px solid #00a650;">
      <p style="font-weight: 600; margin-bottom: 4px;">John Hancock (EUA)</p>
      <div class="stat-number-sm" style="color: #00a650;">-30%</div>
      <div class="stat-label">Mortalidade membros ativos</div>
    </div>
    <div class="card text-center" style="border-top: 4px solid #e68a00;">
      <p style="font-weight: 600; margin-bottom: 4px;">AIA Vitality (Ásia)</p>
      <div class="stat-number-sm" style="color: #e68a00;">-20%</div>
      <div class="stat-label">Internações membros ativos</div>
    </div>
  </div>
  <div class="footer"><span class="footer-logo">VitaScore</span><span>5</span></div>
</div>

<!-- ======================== SLIDE 6: ROI CALCULATOR ======================== -->
<div class="page">
  <div class="accent-bar"></div>
  <div class="overline">Calculadora de ROI</div>
  <h2 style="font-size: 34px;">Quanto sua empresa economiza?</h2>
  <p class="subtitle mb-32">Simulação para empresa com 80 funcionários · Plano médio R$450/mês</p>

  <div class="grid-2 gap-32">
    <div>
      <h3 class="mb-16">Parâmetros</h3>
      <div class="roi-input">
        <label>Funcionários</label>
        <div class="value">80</div>
      </div>
      <div class="roi-input">
        <label>Plano médio/mês</label>
        <div class="value">R$ 450</div>
      </div>
      <div class="roi-input">
        <label>Reajuste atual</label>
        <div class="value" style="color: #e03131;">15%</div>
      </div>
      <div class="roi-input">
        <label>Reajuste com VitaScore</label>
        <div class="value" style="color: #00a650;">8%</div>
      </div>
      <div class="roi-input">
        <label>Custo VitaScore/ano</label>
        <div class="value">R$ 2.304</div>
      </div>
    </div>

    <div>
      <h3 class="mb-16">Resultado</h3>
      <div class="roi-result mb-16">
        <p style="margin-bottom: 4px;">Economia anual estimada</p>
        <div class="big">R$94.240</div>
      </div>
      <div class="grid-2" style="gap: 12px;">
        <div class="card text-center">
          <div class="stat-number-sm" style="color: #0668E1;">40,9x</div>
          <div class="stat-label">Retorno (ROI)</div>
        </div>
        <div class="card text-center">
          <div class="stat-number-sm" style="color: #00a650;">9 dias</div>
          <div class="stat-label">Payback</div>
        </div>
      </div>
      <div class="card mt-24" style="background: #f0f7ff;">
        <p style="font-size: 13px;"><strong>Composição:</strong></p>
        <p style="font-size: 13px;">Reajuste menor: R$30.240 + Absenteísmo: R$64.000</p>
      </div>
    </div>
  </div>
  <div class="footer"><span class="footer-logo">VitaScore</span><span>6</span></div>
</div>

<!-- ======================== SLIDE 7: ROI SEGURADORA ======================== -->
<div class="page">
  <div class="accent-bar"></div>
  <div class="overline">ROI para Seguradoras</div>
  <h2 style="font-size: 34px;">Carteira de 10.000 vidas</h2>
  <p class="subtitle mb-32">Investimento mínimo, retorno massivo.</p>

  <div class="grid-2 gap-32 mb-32">
    <div class="card card-blue">
      <p style="margin-bottom: 4px; font-size: 13px;">Investimento anual</p>
      <div class="stat-number" style="color: white; font-size: 36px;">R$ 144.000</div>
      <p style="margin-top: 8px;">10K vidas × 60% ativos × R$2/mês</p>
    </div>
    <div class="roi-result">
      <p style="margin-bottom: 4px; font-size: 13px;">Economia em sinistros</p>
      <div class="big" style="font-size: 40px;">R$ 3.840.000</div>
      <p style="margin-top: 8px;">8 pontos de redução na sinistralidade</p>
    </div>
  </div>

  <table style="margin-bottom: 24px;">
    <thead>
      <tr><th>Carteira</th><th>Investimento/ano</th><th>Economia/ano</th><th>ROI</th></tr>
    </thead>
    <tbody>
      <tr><td>1.000 vidas</td><td>R$ 14.400</td><td style="color: #00a650; font-weight: 700;">R$ 384.000</td><td><span class="pill pill-green">26x</span></td></tr>
      <tr><td>5.000 vidas</td><td>R$ 72.000</td><td style="color: #00a650; font-weight: 700;">R$ 1.920.000</td><td><span class="pill pill-green">26x</span></td></tr>
      <tr class="highlight-row"><td><strong>10.000 vidas</strong></td><td><strong>R$ 144.000</strong></td><td style="color: #00a650; font-weight: 700;"><strong>R$ 3.840.000</strong></td><td><span class="pill pill-green">26x</span></td></tr>
      <tr><td>50.000 vidas</td><td>R$ 720.000</td><td style="color: #00a650; font-weight: 700;">R$ 19.200.000</td><td><span class="pill pill-green">26x</span></td></tr>
      <tr><td>200.000 vidas</td><td>R$ 2.880.000</td><td style="color: #00a650; font-weight: 700;">R$ 76.800.000</td><td><span class="pill pill-green">26x</span></td></tr>
    </tbody>
  </table>

  <div class="card" style="background: #f0f7ff; border: 2px solid #0668E1; text-align: center;">
    <p style="color: #0668E1; font-weight: 700; font-size: 16px;">Payback em 14 dias · Margem de 87% · Sem concorrente direto no Brasil</p>
  </div>
  <div class="footer"><span class="footer-logo">VitaScore</span><span>7</span></div>
</div>

<!-- ======================== SLIDE 8: MODELO COMERCIAL ======================== -->
<div class="page">
  <div class="accent-bar"></div>
  <div class="overline">Modelo Comercial</div>
  <h2 style="font-size: 34px;">Só paga por quem usa.<br>Sem risco.</h2>
  <p class="subtitle mb-32">Modelo pay-per-active-user + success fee. Zero investimento inicial.</p>

  <div class="grid-2 gap-32 mb-32">
    <div>
      <h3 class="mb-16" style="color: #0668E1;">Para Seguradoras</h3>
      <div class="card mb-16">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <span style="font-weight: 600;">Licença por vida ativa</span>
          <span style="font-size: 24px; font-weight: 800; color: #0668E1;">R$ 2/mês</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <span style="font-weight: 600;">Success fee</span>
          <span style="font-size: 24px; font-weight: 800; color: #00a650;">10-20%</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <span style="font-weight: 600;">Setup</span>
          <span style="font-size: 24px; font-weight: 800; color: #00a650;">R$ 0</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 600;">White label</span>
          <span style="font-size: 14px; font-weight: 600; color: #606770;">Sob consulta</span>
        </div>
      </div>
      <p style="font-size: 13px;">Inativo não paga. Sem mínimo. Sem fidelidade.</p>
    </div>

    <div>
      <h3 class="mb-16" style="color: #00a650;">Para Corretoras</h3>
      <div class="card mb-16">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <span style="font-weight: 600;">Comissão</span>
          <span style="font-size: 24px; font-weight: 800; color: #00a650;">25%</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <span style="font-weight: 600;">Custo</span>
          <span style="font-size: 24px; font-weight: 800; color: #00a650;">R$ 0</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <span style="font-weight: 600;">Treinamento</span>
          <span style="font-size: 14px; font-weight: 600; color: #00a650;">Incluso</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 600;">Material de vendas</span>
          <span style="font-size: 14px; font-weight: 600; color: #00a650;">Incluso</span>
        </div>
      </div>
      <p style="font-size: 13px;">Receita extra sem investimento. Fideliza clientes.</p>
    </div>
  </div>

  <div class="card" style="border-left: 4px solid #00a650; background: #f0fff4;">
    <h3 style="color: #00a650;">Garantia de resultado</h3>
    <p>Piloto gratuito de 90 dias. Se não reduzir sinistralidade, não paga nada. Sem risco.</p>
  </div>
  <div class="footer"><span class="footer-logo">VitaScore</span><span>8</span></div>
</div>

<!-- ======================== SLIDE 9: LGPD + COMPLIANCE ======================== -->
<div class="page">
  <div class="accent-bar"></div>
  <div class="overline">Compliance</div>
  <h2 style="font-size: 34px;">LGPD by design.<br>Dados nunca saem do celular.</h2>
  <p class="subtitle mb-32">O VitaScore foi projetado para que dados pessoais de saúde NUNCA trafeguem para servidores. Apenas o score agregado é compartilhado.</p>

  <div class="grid-3 mb-32">
    <div class="card text-center">
      <div style="font-size: 32px; margin-bottom: 8px;">🔒</div>
      <h3>Dados locais</h3>
      <p>Armazenados apenas no dispositivo do beneficiário</p>
    </div>
    <div class="card text-center">
      <div style="font-size: 32px; margin-bottom: 8px;">🚫</div>
      <h3>Sem upload</h3>
      <p>Nenhum dado pessoal enviado para servidores</p>
    </div>
    <div class="card text-center">
      <div style="font-size: 32px; margin-bottom: 8px;">📤</div>
      <h3>Portabilidade</h3>
      <p>Beneficiário exporta seus dados a qualquer momento</p>
    </div>
    <div class="card text-center">
      <div style="font-size: 32px; margin-bottom: 8px;">🗑️</div>
      <h3>Esquecimento</h3>
      <p>Apagar todos os dados com um toque</p>
    </div>
    <div class="card text-center">
      <div style="font-size: 32px; margin-bottom: 8px;">🔐</div>
      <h3>Criptografia</h3>
      <p>Encrypted storage via Capacitor Preferences</p>
    </div>
    <div class="card text-center">
      <div style="font-size: 32px; margin-bottom: 8px;">📋</div>
      <h3>Consentimento</h3>
      <p>Usuário controla cada tipo de coleta</p>
    </div>
  </div>

  <div class="card card-blue text-center">
    <h3>O que a seguradora recebe</h3>
    <p style="font-size: 18px; margin-top: 8px;">Score (0-1000) + Hash de verificação + Nível de confiança</p>
    <p style="margin-top: 8px;">Nenhum dado pessoal. Nenhum dado clínico. Apenas o número.</p>
  </div>
  <div class="footer"><span class="footer-logo">VitaScore</span><span>9</span></div>
</div>

<!-- ======================== SLIDE 10: CTA ======================== -->
<div class="page" style="justify-content: center; align-items: center; text-align: center; background: linear-gradient(160deg, #f7f8fa 0%, #e7f3ff 40%, #f7f8fa 100%);">
  <div class="accent-bar"></div>

  <div class="overline" style="font-size: 13px;">Próximos Passos</div>
  <h1 style="font-size: 44px; margin-bottom: 24px;">Vamos começar?</h1>
  <p class="subtitle" style="max-width: 520px; margin: 0 auto 48px;">Três opções para conhecer o VitaScore — todas sem compromisso.</p>

  <div class="grid-3" style="max-width: 700px; margin: 0 auto 48px;">
    <div class="card text-center" style="border-top: 4px solid #0668E1;">
      <div style="font-size: 28px; margin-bottom: 12px;">🎯</div>
      <h3>Piloto Gratuito</h3>
      <p>90 dias em 3-5 empresas. Sem custo. Sem risco.</p>
    </div>
    <div class="card text-center" style="border-top: 4px solid #00a650;">
      <div style="font-size: 28px; margin-bottom: 12px;">📊</div>
      <h3>Demo ao Vivo</h3>
      <p>15 minutos. App funcionando no celular. Relatórios reais.</p>
    </div>
    <div class="card text-center" style="border-top: 4px solid #e68a00;">
      <div style="font-size: 28px; margin-bottom: 12px;">📈</div>
      <h3>Análise de Carteira</h3>
      <p>Estimamos o impacto na sua sinistralidade.</p>
    </div>
  </div>

  <div style="margin-bottom: 48px;">
    <p style="font-size: 22px; font-weight: 700; color: #1c1e21; margin-bottom: 8px;">jose@vitascore.com.br</p>
    <p style="color: #606770;">(16) 99999-0000 · vitascore.com.br</p>
  </div>

  <p style="font-size: 15px; color: #606770; font-style: italic; max-width: 500px; margin: 0 auto;">"O melhor plano de saúde é aquele que você não precisa usar.<br>VitaScore transforma essa frase em estratégia de negócio."</p>

  <div class="footer"><span class="footer-logo">VitaScore</span><span>10</span></div>
</div>

</body>
</html>`;

(async () => {
  console.log("Gerando PDF...");
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setContent(HTML, { waitUntil: "networkidle0", timeout: 30000 });

  const outputPath = path.join(__dirname, "VitaScore_Apresentacao.pdf");
  await page.pdf({
    path: outputPath,
    width: "1024px",
    height: "768px",
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await browser.close();
  console.log("PDF gerado:", outputPath);
})();
