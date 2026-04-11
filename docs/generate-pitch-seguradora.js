const puppeteer = require("puppeteer");
const path = require("path");

const HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; color: #1c1e21; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  .page { width: 100%; min-height: 100vh; padding: 56px 60px; page-break-after: always; position: relative; display: flex; flex-direction: column; }
  .page:last-child { page-break-after: avoid; }
  .bar { position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #0668E1 0%, #00C853 100%); }
  .footer { position: absolute; bottom: 24px; left: 60px; right: 60px; display: flex; justify-content: space-between; font-size: 10px; color: #bec3c9; }
  .logo { font-weight: 800; font-size: 13px; color: #0668E1; }
  h1 { font-size: 38px; font-weight: 800; letter-spacing: -1.5px; line-height: 1.15; }
  h2 { font-size: 26px; font-weight: 700; letter-spacing: -0.5px; line-height: 1.2; margin-bottom: 20px; }
  h3 { font-size: 16px; font-weight: 700; margin-bottom: 8px; }
  p { font-size: 14px; line-height: 1.6; color: #606770; }
  .big { font-size: 56px; font-weight: 900; letter-spacing: -3px; line-height: 1; }
  .medium { font-size: 36px; font-weight: 800; letter-spacing: -1.5px; }
  .label { font-size: 12px; color: #606770; margin-top: 6px; font-weight: 500; }
  .overline { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #0668E1; margin-bottom: 12px; }
  .card { background: #f7f8fa; border-radius: 14px; padding: 24px; border: 1px solid #e4e6ea; }
  .card-dark { background: #1c1e21; color: white; border: none; }
  .card-dark p, .card-dark .label { color: rgba(255,255,255,0.7); }
  .card-blue { background: linear-gradient(135deg, #0668E1, #0553B9); color: white; border: none; }
  .card-blue p { color: rgba(255,255,255,0.85); }
  .card-green { background: linear-gradient(135deg, #00a650, #008c44); color: white; border: none; }
  .card-green p { color: rgba(255,255,255,0.85); }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 18px; }
  .grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 14px; }
  .pill { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .pill-red { background: #fff0f0; color: #e03131; }
  .pill-green { background: #e6f9ee; color: #00a650; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { text-align: left; padding: 10px 14px; font-weight: 600; color: #606770; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e4e6ea; }
  td { padding: 12px 14px; border-bottom: 1px solid #f0f2f5; }
  .hl { background: #f0f7ff; }
  .text-center { text-align: center; }
  .mb-8 { margin-bottom: 8px; }
  .mb-12 { margin-bottom: 12px; }
  .mb-20 { margin-bottom: 20px; }
  .mb-28 { margin-bottom: 28px; }
  .mb-36 { margin-bottom: 36px; }
  .mt-auto { margin-top: auto; }
  .spacer { flex: 1; }
  .red { color: #e03131; }
  .green { color: #00a650; }
  .blue { color: #0668E1; }
  .quote { font-size: 20px; font-style: italic; color: #606770; line-height: 1.5; border-left: 4px solid #0668E1; padding-left: 20px; }
</style>
</head>
<body>

<!-- ===== SLIDE 1: CAPA — foca na dor, não no produto ===== -->
<div class="page" style="justify-content: center; background: #1c1e21; color: white;">
  <div class="bar"></div>
  <div class="overline" style="color: #00C853;">O custo de não fazer nada</div>
  <h1 style="font-size: 46px; color: white; margin-bottom: 20px;">
    Sua seguradora perde<br>
    <span style="color: #e03131;">R$ 3,8 milhões por ano</span><br>
    em sinistros evitáveis.
  </h1>
  <p style="font-size: 18px; color: rgba(255,255,255,0.6); max-width: 550px; margin-bottom: 48px;">
    70% das internações são por doenças preveníveis.<br>
    Mas você não tem nenhum dado sobre os hábitos dos seus beneficiários.
  </p>
  <p style="color: rgba(255,255,255,0.4); font-size: 13px;">VitaScore · Apresentação Executiva · Abril 2026 · Confidencial</p>
  <div class="footer"><span class="logo">VitaScore</span><span style="color: rgba(255,255,255,0.3);">1</span></div>
</div>

<!-- ===== SLIDE 2: O diagnóstico ===== -->
<div class="page">
  <div class="bar"></div>
  <div class="overline">O Diagnóstico</div>
  <h2>O ciclo que está destruindo<br>a rentabilidade do setor.</h2>

  <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 36px;">
    <div class="card text-center" style="flex: 1; border-top: 3px solid #e03131;">
      <div class="medium red">85%</div>
      <div class="label">Sinistralidade média</div>
    </div>
    <div style="font-size: 24px; color: #bec3c9;">→</div>
    <div class="card text-center" style="flex: 1; border-top: 3px solid #e68a00;">
      <div class="medium" style="color: #e68a00;">15-25%</div>
      <div class="label">Reajuste anual</div>
    </div>
    <div style="font-size: 24px; color: #bec3c9;">→</div>
    <div class="card text-center" style="flex: 1; border-top: 3px solid #e03131;">
      <div class="medium red">18%</div>
      <div class="label">Cancelamento/ano</div>
    </div>
    <div style="font-size: 24px; color: #bec3c9;">→</div>
    <div class="card text-center" style="flex: 1; border-top: 3px solid #e03131;">
      <div style="font-size: 20px; font-weight: 800; color: #e03131;">Menos receita<br>Mais custo</div>
      <div class="label">Ciclo vicioso</div>
    </div>
  </div>

  <div class="card" style="border-left: 4px solid #e03131; background: #fff5f5; margin-bottom: 20px;">
    <h3 style="color: #e03131;">O problema real</h3>
    <p>Você não sabe se seus 10.000 beneficiários são sedentários, dormem mal, comem fast-food todo dia ou passam 6 horas no celular de madrugada. <strong>Você paga os sinistros sem ter feito nada para preveni-los.</strong></p>
  </div>

  <div class="card" style="border-left: 4px solid #0668E1; background: #f0f7ff;">
    <h3 style="color: #0668E1;">A pergunta</h3>
    <p><strong>E se você tivesse dados verificados sobre os hábitos de cada beneficiário — e pudesse premiar quem cuida da saúde com desconto?</strong></p>
  </div>
  <div class="footer"><span class="logo">VitaScore</span><span>2</span></div>
</div>

<!-- ===== SLIDE 3: Alguém já resolveu ===== -->
<div class="page">
  <div class="bar"></div>
  <div class="overline">A Evidência</div>
  <h2>Esse problema já foi resolvido.<br>Há 25 anos. Em 40 países.</h2>

  <div class="grid-2 mb-28" style="gap: 28px;">
    <div>
      <div class="card card-dark mb-20">
        <p style="font-size: 12px; margin-bottom: 8px;">DISCOVERY VITALITY · África do Sul · Desde 1997</p>
        <div class="big" style="color: #00C853; margin-bottom: 8px;">US$ 10B</div>
        <div class="label" style="color: rgba(255,255,255,0.5);">Valuation atual</div>
      </div>
      <div class="grid-2" style="gap: 12px;">
        <div class="card text-center">
          <div class="medium blue">3,4M</div>
          <div class="label">Membros ativos</div>
        </div>
        <div class="card text-center">
          <div class="medium green">40+</div>
          <div class="label">Países</div>
        </div>
      </div>
    </div>
    <div>
      <div class="quote mb-28">"Membros engajados no Vitality têm 35% menos sinistros, 20% menos internações e vivem 13 a 21 anos a mais."</div>
      <p style="font-size: 12px; color: #bec3c9; margin-bottom: 28px;">— Discovery Vitality Health Impact Report 2023; Harvard Business Review</p>

      <div class="card" style="border-left: 4px solid #e68a00; background: #fff8e1;">
        <h3 style="color: #e68a00;">Por que não existe no Brasil?</h3>
        <p>Até 2023, não havia Health Connect (Google) nem IA acessível para verificar fotos. <strong>Agora há.</strong> A janela de oportunidade está aberta.</p>
      </div>
    </div>
  </div>

  <div class="card card-blue text-center">
    <p style="font-size: 18px; font-weight: 600;">O VitaScore é o modelo Discovery Vitality adaptado para o Brasil.</p>
    <p>Funciona com qualquer seguradora · LGPD nativo · 85% mais barato de operar</p>
  </div>
  <div class="footer"><span class="logo">VitaScore</span><span>3</span></div>
</div>

<!-- ===== SLIDE 4: O que faz (mínimo necessário) ===== -->
<div class="page">
  <div class="bar"></div>
  <div class="overline">Como Funciona</div>
  <h2>App no celular do beneficiário.<br>Dados verificados. Score auditável.</h2>

  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 32px; flex-wrap: wrap;">
    <div class="card text-center" style="flex: 1; min-width: 120px; padding: 16px;">
      <div style="font-size: 24px; margin-bottom: 6px;">📱</div>
      <p style="font-size: 12px; font-weight: 600; color: #1c1e21;">Instala o app</p>
    </div>
    <div style="color: #bec3c9;">→</div>
    <div class="card text-center" style="flex: 1; min-width: 120px; padding: 16px;">
      <div style="font-size: 24px; margin-bottom: 6px;">📊</div>
      <p style="font-size: 12px; font-weight: 600; color: #1c1e21;">Monitora 6 pilares</p>
    </div>
    <div style="color: #bec3c9;">→</div>
    <div class="card text-center" style="flex: 1; min-width: 120px; padding: 16px;">
      <div style="font-size: 24px; margin-bottom: 6px;">🔒</div>
      <p style="font-size: 12px; font-weight: 600; color: #1c1e21;">Verifica anti-fraude</p>
    </div>
    <div style="color: #bec3c9;">→</div>
    <div class="card text-center" style="flex: 1; min-width: 120px; padding: 16px;">
      <div style="font-size: 24px; margin-bottom: 6px;">🎯</div>
      <p style="font-size: 12px; font-weight: 600; color: #1c1e21;">Gera score 0-1000</p>
    </div>
    <div style="color: #bec3c9;">→</div>
    <div class="card text-center" style="flex: 1; min-width: 120px; padding: 16px;">
      <div style="font-size: 24px; margin-bottom: 6px;">💰</div>
      <p style="font-size: 12px; font-weight: 600; color: #1c1e21;">Desconto no plano</p>
    </div>
  </div>

  <div class="grid-2 mb-28" style="gap: 24px;">
    <div>
      <h3 class="mb-12">6 pilares monitorados</h3>
      <table>
        <tr><td>🏃 <strong>Movimento</strong></td><td>Health Connect / HealthKit</td><td class="text-center">300 pts</td></tr>
        <tr><td>🌙 <strong>Sono</strong></td><td>Acelerômetro automático</td><td class="text-center">250 pts</td></tr>
        <tr><td>📱 <strong>Digital</strong></td><td>Tempo de tela (saúde mental)</td><td class="text-center">200 pts</td></tr>
        <tr><td>🥗 <strong>Nutrição</strong></td><td>Foto + análise IA</td><td class="text-center">150 pts</td></tr>
        <tr><td>⚖️ <strong>Peso</strong></td><td>Foto da balança + OCR</td><td class="text-center">Bônus</td></tr>
        <tr><td>🏆 <strong>Engajamento</strong></td><td>Desafios e streak</td><td class="text-center">100 pts</td></tr>
      </table>
    </div>
    <div>
      <h3 class="mb-12">5 camadas anti-fraude</h3>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div class="card" style="padding: 12px 16px; display: flex; align-items: center; gap: 12px; border-left: 3px solid #0668E1;">
          <span style="font-weight: 800; color: #0668E1;">1</span>
          <span style="font-size: 13px;">Câmera obrigatória (galeria bloqueada)</span>
        </div>
        <div class="card" style="padding: 12px 16px; display: flex; align-items: center; gap: 12px; border-left: 3px solid #0668E1;">
          <span style="font-weight: 800; color: #0668E1;">2</span>
          <span style="font-size: 13px;">IA detecta foto de tela/impressão</span>
        </div>
        <div class="card" style="padding: 12px 16px; display: flex; align-items: center; gap: 12px; border-left: 3px solid #0668E1;">
          <span style="font-weight: 800; color: #0668E1;">3</span>
          <span style="font-size: 13px;">Timestamp verificado (±2 minutos)</span>
        </div>
        <div class="card" style="padding: 12px 16px; display: flex; align-items: center; gap: 12px; border-left: 3px solid #0668E1;">
          <span style="font-weight: 800; color: #0668E1;">4</span>
          <span style="font-size: 13px;">GPS registrado com cada dado</span>
        </div>
        <div class="card" style="padding: 12px 16px; display: flex; align-items: center; gap: 12px; border-left: 3px solid #0668E1;">
          <span style="font-weight: 800; color: #0668E1;">5</span>
          <span style="font-size: 13px;">Hash SHA-256 (anti-adulteração)</span>
        </div>
      </div>
    </div>
  </div>

  <div class="card" style="background: #f0f7ff; border: 2px solid #0668E1; text-center; text-align: center;">
    <p style="color: #0668E1; font-weight: 700;">Você recebe APENAS: Score (0-1000) + Hash + Confiança (%). Zero dados pessoais. LGPD total.</p>
  </div>
  <div class="footer"><span class="logo">VitaScore</span><span>4</span></div>
</div>

<!-- ===== SLIDE 5: O DINHEIRO ===== -->
<div class="page">
  <div class="bar"></div>
  <div class="overline">O Retorno</div>
  <h2>Carteira de 10.000 vidas.<br>Ticket médio R$400/mês.</h2>

  <div class="grid-2 mb-28" style="gap: 24px;">
    <div class="card card-dark text-center" style="padding: 32px;">
      <p style="font-size: 12px; margin-bottom: 8px; color: rgba(255,255,255,0.5);">Seu investimento</p>
      <div class="big" style="color: #0668E1;">R$ 144K</div>
      <div class="label" style="color: rgba(255,255,255,0.4);">/ano (R$2/vida ativa/mês)</div>
    </div>
    <div class="card card-green text-center" style="padding: 32px;">
      <p style="font-size: 12px; margin-bottom: 8px;">Economia em sinistros</p>
      <div class="big">R$ 3,8M</div>
      <div class="label" style="color: rgba(255,255,255,0.7);">/ano (8 pts menos sinistralidade)</div>
    </div>
  </div>

  <div class="grid-3 mb-28">
    <div class="card text-center" style="border-top: 3px solid #0668E1;">
      <div class="medium blue">26,7x</div>
      <div class="label">ROI</div>
    </div>
    <div class="card text-center" style="border-top: 3px solid #00a650;">
      <div class="medium green">14 dias</div>
      <div class="label">Payback</div>
    </div>
    <div class="card text-center" style="border-top: 3px solid #e68a00;">
      <div class="medium" style="color: #e68a00;">-39%</div>
      <div class="label">Cancelamentos</div>
    </div>
  </div>

  <table>
    <thead><tr><th>Carteira</th><th>Investimento/ano</th><th>Economia/ano</th><th>ROI</th></tr></thead>
    <tbody>
      <tr><td>1.000 vidas</td><td>R$ 14.400</td><td class="green" style="font-weight:700;">R$ 384.000</td><td><span class="pill pill-green">26x</span></td></tr>
      <tr><td>5.000 vidas</td><td>R$ 72.000</td><td class="green" style="font-weight:700;">R$ 1.920.000</td><td><span class="pill pill-green">26x</span></td></tr>
      <tr class="hl"><td><strong>10.000 vidas</strong></td><td><strong>R$ 144.000</strong></td><td class="green" style="font-weight:700;"><strong>R$ 3.840.000</strong></td><td><span class="pill pill-green">26x</span></td></tr>
      <tr><td>50.000 vidas</td><td>R$ 720.000</td><td class="green" style="font-weight:700;">R$ 19.200.000</td><td><span class="pill pill-green">26x</span></td></tr>
      <tr><td>200.000 vidas</td><td>R$ 2.880.000</td><td class="green" style="font-weight:700;">R$ 76.800.000</td><td><span class="pill pill-green">26x</span></td></tr>
    </tbody>
  </table>
  <div class="footer"><span class="logo">VitaScore</span><span>5</span></div>
</div>

<!-- ===== SLIDE 6: POR QUE AGORA ===== -->
<div class="page">
  <div class="bar"></div>
  <div class="overline">Urgência</div>
  <h2>Cinco razões para agir agora.<br>Não no próximo trimestre.</h2>

  <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px;">
    <div class="card" style="display: flex; gap: 20px; align-items: center; border-left: 4px solid #e03131;">
      <div style="font-size: 32px; font-weight: 900; color: #e03131; width: 32px;">1</div>
      <div><h3 style="margin-bottom: 4px;">NR-1 entrou em vigor</h3><p>Empresas são obrigadas a ter programa de saúde mental. VitaScore é a evidência. Quem oferecer primeiro captura o mercado.</p></div>
    </div>
    <div class="card" style="display: flex; gap: 20px; align-items: center; border-left: 4px solid #e68a00;">
      <div style="font-size: 32px; font-weight: 900; color: #e68a00; width: 32px;">2</div>
      <div><h3 style="margin-bottom: 4px;">Sinistralidade recorde</h3><p>O setor não aguenta mais 85%. Quem reduzir primeiro, lucra primeiro.</p></div>
    </div>
    <div class="card" style="display: flex; gap: 20px; align-items: center; border-left: 4px solid #0668E1;">
      <div style="font-size: 32px; font-weight: 900; color: #0668E1; width: 32px;">3</div>
      <div><h3 style="margin-bottom: 4px;">Zero concorrentes no Brasil</h3><p>Ninguém faz isso aqui. Mas alguém vai fazer. A questão é: vai ser você ou seu concorrente?</p></div>
    </div>
    <div class="card" style="display: flex; gap: 20px; align-items: center; border-left: 4px solid #00a650;">
      <div style="font-size: 32px; font-weight: 900; color: #00a650; width: 32px;">4</div>
      <div><h3 style="margin-bottom: 4px;">Health Connect abriu os dados</h3><p>Google liberou acesso aos dados de saúde do Android em 2023. Pela primeira vez, é possível monitorar sem hardware caro.</p></div>
    </div>
    <div class="card" style="display: flex; gap: 20px; align-items: center; border-left: 4px solid #7c3aed;">
      <div style="font-size: 32px; font-weight: 900; color: #7c3aed; width: 32px;">5</div>
      <div><h3 style="margin-bottom: 4px;">IA tornou viável</h3><p>Análise de foto de refeição custa R$0,002. Há 2 anos custava R$2. Redução de 1000x no custo viabilizou o modelo.</p></div>
    </div>
  </div>

  <div class="card card-dark text-center">
    <p style="font-size: 18px; font-weight: 600; color: white;">"A janela de first-mover no Brasil está aberta. Mas não por muito tempo."</p>
  </div>
  <div class="footer"><span class="logo">VitaScore</span><span>6</span></div>
</div>

<!-- ===== SLIDE 7: A OFERTA ===== -->
<div class="page" style="justify-content: center; align-items: center; text-align: center; background: linear-gradient(160deg, #f7f8fa 0%, #e7f3ff 40%, #f7f8fa 100%);">
  <div class="bar"></div>

  <div class="overline" style="font-size: 12px;">A Proposta</div>
  <h1 style="font-size: 40px; margin-bottom: 12px;">Zero risco.<br>Piloto gratuito de 90 dias.</h1>
  <p style="font-size: 16px; color: #606770; max-width: 500px; margin: 0 auto 40px;">Se não reduzir sinistralidade, não paga nada. Simples assim.</p>

  <div class="grid-3" style="max-width: 660px; margin: 0 auto 40px;">
    <div class="card text-center" style="border-top: 4px solid #0668E1; padding: 20px;">
      <h3 style="margin-bottom: 8px;">Passo 1</h3>
      <p>Escolha 3-5 empresas da carteira para o piloto</p>
    </div>
    <div class="card text-center" style="border-top: 4px solid #00a650; padding: 20px;">
      <h3 style="margin-bottom: 8px;">Passo 2</h3>
      <p>Implantamos o app e coletamos dados por 90 dias</p>
    </div>
    <div class="card text-center" style="border-top: 4px solid #e68a00; padding: 20px;">
      <h3 style="margin-bottom: 8px;">Passo 3</h3>
      <p>Relatório com resultados reais. Você decide se contrata.</p>
    </div>
  </div>

  <div class="card" style="max-width: 500px; margin: 0 auto 40px; border: 2px solid #0668E1; background: white;">
    <div class="grid-2" style="gap: 0;">
      <div style="padding: 12px; border-right: 1px solid #e4e6ea;">
        <div class="label mb-8">Custo do piloto</div>
        <div class="medium green">R$ 0</div>
      </div>
      <div style="padding: 12px;">
        <div class="label mb-8">Risco</div>
        <div class="medium green">Zero</div>
      </div>
    </div>
  </div>

  <div style="margin-bottom: 32px;">
    <p style="font-size: 20px; font-weight: 700; color: #1c1e21; margin-bottom: 6px;">jose@vitascore.com.br</p>
    <p style="color: #606770;">(16) 99999-0000</p>
  </div>

  <p style="font-size: 14px; color: #606770; font-style: italic; max-width: 460px; margin: 0 auto;">"O melhor plano de saúde é aquele que você não precisa usar.<br>VitaScore transforma essa frase em estratégia de negócio."</p>

  <div class="footer"><span class="logo">VitaScore</span><span>7</span></div>
</div>

</body>
</html>`;

(async () => {
  console.log("Gerando PDF executivo para seguradoras...");
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setContent(HTML, { waitUntil: "networkidle0", timeout: 30000 });
  const output = path.join(__dirname, "VitaScore_Pitch_Seguradora.pdf");
  await page.pdf({ path: output, width: "1024px", height: "768px", printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await browser.close();
  console.log("PDF gerado:", output);
})();
