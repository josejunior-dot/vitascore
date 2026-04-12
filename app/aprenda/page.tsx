"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  BookOpen,
  Clock,
  Heart,
  Brain,
  Activity,
  Wallet,
  Moon as MoonIcon,
  Shield,
  Search,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

type Article = {
  id: string;
  category: string;
  icon: string;
  title: string;
  excerpt: string;
  readTime: number;
  date: string;
  content: string;
};

const articles: Article[] = [
  {
    id: "1",
    category: "saude-mental",
    icon: "🧠",
    title: "5 sinais de que seu sono está afetando sua saúde mental",
    excerpt:
      "Especialistas explicam como a qualidade do sono impacta diretamente o bem-estar emocional...",
    readTime: 4,
    date: "11/04/2026",
    content:
      "O sono é um dos pilares mais importantes da saúde mental, mas ainda é frequentemente negligenciado. Pesquisas recentes mostram que pessoas que dormem menos de seis horas por noite têm o dobro do risco de desenvolver sintomas de ansiedade e depressão quando comparadas àquelas que dormem entre sete e nove horas. Isso acontece porque, durante o sono profundo, o cérebro processa emoções, consolida memórias e regula neurotransmissores essenciais como serotonina e dopamina.\n\nEntre os principais sinais de que seu sono está afetando sua saúde mental estão: irritabilidade desproporcional a pequenos contratempos, dificuldade de concentração e tomada de decisão, aumento da sensibilidade ao estresse, episódios recorrentes de tristeza sem motivo aparente e sensação constante de exaustão mesmo após uma noite inteira na cama. Esses sintomas costumam aparecer de forma gradual, o que dificulta a percepção de que a raiz do problema está no descanso.\n\nA boa notícia é que pequenas mudanças na rotina podem trazer melhorias significativas em poucas semanas. Estabelecer horários regulares para dormir e acordar, reduzir a exposição a telas pelo menos uma hora antes de deitar, evitar cafeína após as 14h e manter o quarto escuro e fresco são intervenções com forte respaldo científico. Se mesmo assim os sintomas persistirem, vale procurar um profissional de saúde para investigar distúrbios como insônia crônica ou apneia do sono.\n\nLembre-se: cuidar do sono é cuidar da mente. Não existe equilíbrio emocional sustentável sem descanso adequado, e priorizar suas noites é um dos investimentos mais importantes que você pode fazer no seu bem-estar.",
  },
  {
    id: "2",
    category: "nr1",
    icon: "🛡️",
    title: "NR-1: O que muda em maio de 2026 e como sua empresa deve se preparar",
    excerpt:
      "A fiscalização punitiva começa em maio. Veja o que sua empresa precisa fazer agora...",
    readTime: 6,
    date: "10/04/2026",
    content:
      "A atualização da Norma Regulamentadora nº 1 (NR-1) representa uma das mudanças mais significativas na legislação trabalhista brasileira dos últimos anos. A partir de maio de 2026, todas as empresas com empregados regidos pela CLT serão obrigadas a incluir os riscos psicossociais em seu Programa de Gerenciamento de Riscos (PGR). A fiscalização, que até então estava em fase educativa, passa a ser punitiva, com multas que podem ultrapassar R$ 6 mil por infração, dependendo do porte da empresa.\n\nNa prática, isso significa que empregadores precisam mapear, avaliar e implementar medidas de controle para fatores como sobrecarga de trabalho, assédio moral, jornadas excessivas, falta de autonomia, conflitos interpessoais, isolamento e ambientes com pouca clareza de funções. A norma exige que esse mapeamento seja documentado, atualizado periodicamente e que as ações de prevenção sejam comprovadas por meio de evidências como treinamentos, canais de denúncia ativos e indicadores de saúde mental dos colaboradores.\n\nPara se preparar, recomenda-se que a empresa siga quatro passos essenciais: primeiro, realizar um diagnóstico inicial por meio de questionários validados ou consultoria especializada; segundo, atualizar o PGR incluindo os riscos identificados e as medidas de mitigação; terceiro, capacitar lideranças para reconhecer sinais de adoecimento mental e agir preventivamente; e por fim, criar políticas internas claras sobre saúde mental, com canais de escuta seguros e protocolos de encaminhamento.\n\nMais do que uma obrigação legal, a NR-1 atualizada é uma oportunidade para empresas construírem ambientes de trabalho mais saudáveis e produtivos. Estudos mostram que organizações que investem em saúde mental reduzem absenteísmo em até 30% e aumentam a retenção de talentos. Antecipar-se à fiscalização é proteger não apenas o negócio, mas também as pessoas que o sustentam.",
  },
  {
    id: "3",
    category: "alimentacao",
    icon: "🥗",
    title: "Como construir um prato saudável: o guia visual",
    excerpt:
      "Aprenda a montar refeições equilibradas com vegetais, proteínas e grãos integrais...",
    readTime: 5,
    date: "09/04/2026",
    content:
      "Montar um prato saudável não precisa ser complicado nem exigir contagem obsessiva de calorias. A regra visual mais difundida pelos nutricionistas é a do 'prato do bem comer', que divide a refeição em três partes principais: metade do prato deve ser composta por vegetais e legumes variados, um quarto por proteínas magras e o quarto restante por carboidratos preferencialmente integrais. Essa distribuição garante o equilíbrio entre fibras, vitaminas, minerais e macronutrientes essenciais.\n\nNos vegetais, a diversidade de cores é fundamental. Cada cor representa um grupo de fitonutrientes diferentes: verdes escuros como couve e espinafre são ricos em ferro e folato; alaranjados como cenoura e abóbora oferecem betacaroteno; vermelhos como tomate e beterraba contêm licopeno e antioxidantes potentes. A recomendação é consumir pelo menos três cores diferentes em cada refeição principal.\n\nQuanto às proteínas, prefira opções magras como peixes, frango sem pele, ovos, leguminosas (feijão, lentilha, grão-de-bico) e tofu. As leguminosas merecem atenção especial: além de proteína vegetal de alta qualidade, são ricas em fibras e ajudam a controlar a glicemia. Já os carboidratos integrais, como arroz integral, quinoa, batata-doce e aveia, fornecem energia de liberação lenta, mantendo a saciedade por mais tempo e evitando picos de açúcar no sangue.\n\nFinalize o prato com uma fonte de gordura boa, como azeite extravirgem, abacate ou sementes (chia, linhaça, gergelim). Essas gorduras são essenciais para a absorção de vitaminas lipossolúveis e contribuem para a saúde cardiovascular. Lembre-se: comer bem é um ato de autocuidado diário, e pequenas escolhas consistentes geram grandes resultados ao longo do tempo.",
  },
  {
    id: "4",
    category: "atividade",
    icon: "🏃",
    title: "10.000 passos por dia: mito ou realidade?",
    excerpt: "A ciência por trás da meta mais famosa de atividade física...",
    readTime: 5,
    date: "08/04/2026",
    content:
      "A meta dos 10.000 passos diários se tornou quase um dogma da vida saudável, mas poucos sabem que ela não nasceu de uma pesquisa científica rigorosa. O número surgiu nos anos 1960, quando uma empresa japonesa lançou um pedômetro chamado 'Manpo-kei', que significa literalmente 'medidor de 10 mil passos'. A campanha de marketing foi tão bem-sucedida que o número virou referência mundial, mesmo sem base científica robusta na época.\n\nEstudos mais recentes, no entanto, têm trazido nuances importantes. Uma pesquisa publicada no JAMA Internal Medicine em 2019 acompanhou mais de 16 mil mulheres e concluiu que os benefícios de mortalidade começam a aparecer a partir de 4.400 passos diários, atingindo um platô por volta de 7.500 passos. Outro estudo de 2023, com mais de 226 mil pessoas, mostrou que cada incremento de 1.000 passos reduz o risco de morte prematura em cerca de 15%, com benefícios observados já a partir de 2.600 passos.\n\nIsso não significa que 10.000 passos seja uma meta ruim, apenas que não é mágica. O mais importante é se mover regularmente ao longo do dia, evitar longos períodos sentado e aumentar gradualmente a quantidade de passos a partir do seu ponto de partida atual. Para quem está começando, sair de 3.000 para 5.000 passos diários já traz ganhos relevantes para o sistema cardiovascular, o metabolismo e a saúde mental.\n\nA Organização Mundial da Saúde recomenda pelo menos 150 minutos de atividade física moderada por semana, o que equivale a cerca de 7.000 a 8.000 passos diários para a maioria das pessoas. Use a meta dos 10.000 passos como inspiração, não como uma prisão. O melhor número é aquele que você consegue manter de forma consistente e prazerosa.",
  },
  {
    id: "5",
    category: "financeiro",
    icon: "💰",
    title: "Saúde financeira: como o estresse com dinheiro afeta o corpo",
    excerpt:
      "Pesquisas mostram que problemas financeiros aumentam risco de doenças cardíacas...",
    readTime: 4,
    date: "07/04/2026",
    content:
      "O estresse financeiro é uma das principais causas de adoecimento físico e mental no Brasil. Segundo dados da Confederação Nacional do Comércio, mais de 78% das famílias brasileiras estão endividadas, e parte significativa relata sintomas físicos diretamente ligados à preocupação com dinheiro: dores de cabeça frequentes, distúrbios gastrointestinais, insônia e queda de imunidade. O corpo, simplesmente, não distingue uma ameaça financeira de uma ameaça física e ativa as mesmas respostas hormonais de luta ou fuga.\n\nQuando a preocupação financeira se torna crônica, o organismo passa a produzir cortisol em níveis elevados de forma constante. Esse excesso de cortisol está associado ao aumento da pressão arterial, resistência à insulina, ganho de peso abdominal e maior risco de doenças cardiovasculares. Estudos publicados no American Journal of Epidemiology mostram que pessoas com altos níveis de estresse financeiro têm até 13 vezes mais chances de sofrer um infarto antes dos 50 anos.\n\nO impacto na saúde mental é igualmente preocupante. Dívidas e instabilidade financeira estão entre os principais gatilhos para quadros de ansiedade generalizada e depressão. Muitas vezes, há também um ciclo vicioso: o estresse leva a comportamentos compensatórios como compras impulsivas, alimentação inadequada e abandono de atividades preventivas em saúde, agravando ainda mais o quadro emocional e financeiro.\n\nA boa notícia é que pequenos passos podem romper esse ciclo. Organizar um orçamento simples, listar dívidas em ordem de prioridade, buscar renegociação ativa e procurar educação financeira gratuita (oferecida por instituições como o Banco Central, Procon e Sebrae) são ações que reduzem significativamente o estresse percebido. Cuidar do dinheiro é também cuidar do corpo e da mente.",
  },
  {
    id: "6",
    category: "sono",
    icon: "🌙",
    title: "7 horas é o mínimo: o que acontece quando você dorme menos",
    excerpt: "Os efeitos cumulativos da privação de sono na sua saúde...",
    readTime: 5,
    date: "06/04/2026",
    content:
      "Dormir menos de sete horas por noite, de forma recorrente, é considerado privação crônica de sono pela Academia Americana de Medicina do Sono. Embora muita gente acredite que consegue 'se acostumar' com poucas horas de descanso, a ciência mostra exatamente o contrário: os efeitos negativos se acumulam silenciosamente e comprometem praticamente todos os sistemas do corpo, mesmo quando a pessoa não percebe a queda de rendimento.\n\nNo curto prazo, a privação de sono reduz a capacidade de atenção, prejudica a memória, aumenta o tempo de reação e compromete a tomada de decisões. Estudos comparam o estado de quem dormiu menos de seis horas ao de uma pessoa com 0,08% de álcool no sangue, o equivalente ao limite legal para dirigir em muitos países. Não à toa, a sonolência ao volante é uma das principais causas de acidentes graves no Brasil.\n\nNo médio e longo prazo, os impactos são ainda mais sérios. Dormir mal cronicamente está associado a maior risco de obesidade, diabetes tipo 2, hipertensão, infarto, acidente vascular cerebral, depressão e até alguns tipos de câncer. Isso acontece porque o sono é o momento em que o corpo realiza processos essenciais de reparo celular, regulação hormonal e fortalecimento do sistema imunológico. Sem descanso adequado, esses mecanismos ficam comprometidos.\n\nA recomendação para adultos é de sete a nove horas de sono por noite, com qualidade. Mais importante do que apenas o tempo na cama é a regularidade dos horários e a presença de ciclos completos de sono profundo e REM. Crie uma rotina consistente, evite telas antes de dormir, mantenha o quarto escuro e silencioso, e trate o sono como uma prioridade inegociável da sua saúde.",
  },
  {
    id: "7",
    category: "saude-mental",
    icon: "🧠",
    title: "Tempo de tela e ansiedade: como encontrar o equilíbrio",
    excerpt: "Não é sobre cortar o celular — é sobre usar com intenção...",
    readTime: 6,
    date: "05/04/2026",
    content:
      "O brasileiro passa, em média, mais de nove horas por dia diante de telas, segundo dados do relatório Digital 2024. Boa parte desse tempo está nas redes sociais, conhecidas por sua arquitetura viciante baseada em recompensas variáveis e rolagem infinita. O resultado é um acúmulo de estímulos que mantém o cérebro em estado constante de hipervigilância, contribuindo para sintomas de ansiedade, dificuldade de concentração e irritabilidade.\n\nNão é necessariamente o tempo de tela em si que faz mal, mas sim como esse tempo é gasto. Pesquisas recentes diferenciam o uso passivo (rolar feeds sem interação) do uso ativo (conversar com amigos, criar conteúdo, aprender algo novo). O uso passivo está fortemente associado a sentimentos de comparação social, inveja e insatisfação, enquanto o uso ativo pode até trazer benefícios para o bem-estar, especialmente quando fortalece vínculos reais.\n\nUma estratégia eficaz é o que especialistas chamam de 'higiene digital'. Ela inclui práticas como definir horários sem celular (especialmente nas primeiras e últimas horas do dia), desativar notificações não essenciais, organizar a tela inicial removendo aplicativos viciantes da página principal, e estabelecer pausas regulares ao longo do dia para olhar para algo distante e respirar profundamente. Pequenas mudanças na arquitetura do uso fazem diferença enorme.\n\nO objetivo não é cortar a tecnologia, que é parte essencial da vida moderna, mas usá-la com intenção. Pergunte-se antes de pegar o celular: o que estou buscando aqui? Se a resposta for 'nada, só tédio', talvez seja o momento de fazer outra coisa: caminhar, ligar para alguém, ler um livro físico, observar o ambiente. A atenção é seu recurso mais valioso. Decida onde ela vai.",
  },
  {
    id: "8",
    category: "nr1",
    icon: "🛡️",
    title: "Riscos psicossociais no trabalho: o que são e como identificar",
    excerpt:
      "A NR-1 atualizada exige que empresas mapeiem fatores como sobrecarga, assédio e isolamento...",
    readTime: 7,
    date: "04/04/2026",
    content:
      "Riscos psicossociais são condições do ambiente de trabalho que podem causar danos à saúde mental e física dos trabalhadores. Diferentemente dos riscos físicos, químicos ou biológicos, eles não são facilmente visíveis, o que torna sua identificação mais difícil. A Organização Internacional do Trabalho (OIT) os define como interações entre o ambiente de trabalho, o conteúdo das tarefas, as condições organizacionais e as capacidades, necessidades e expectativas dos trabalhadores.\n\nEntre os principais riscos psicossociais estão: sobrecarga de trabalho e jornadas excessivas, falta de clareza sobre funções e responsabilidades, baixa autonomia para decisões, ausência de reconhecimento, conflitos interpessoais não mediados, assédio moral ou sexual, isolamento profissional, insegurança quanto ao emprego, metas inalcançáveis, comunicação deficiente entre lideranças e equipes, e desequilíbrio entre vida pessoal e profissional. Esses fatores, quando presentes de forma combinada e prolongada, podem desencadear quadros graves como burnout, depressão e transtornos de ansiedade.\n\nA identificação desses riscos exige uma abordagem estruturada. Os métodos mais utilizados incluem questionários validados como o Copenhagen Psychosocial Questionnaire (COPSOQ) e o Job Content Questionnaire (JCQ), entrevistas individuais e em grupo, análise de indicadores como absenteísmo, rotatividade e afastamentos por CID-F (transtornos mentais e comportamentais), além de observações diretas do ambiente de trabalho. O ideal é combinar diferentes métodos para obter uma visão abrangente.\n\nUma vez identificados, os riscos devem ser hierarquizados por gravidade e tratados com medidas concretas: redistribuição de tarefas, capacitação de lideranças, criação de canais seguros de denúncia, programas de apoio psicológico, ajustes de jornada e revisão de metas. Mais do que cumprir a NR-1, gerenciar riscos psicossociais é construir ambientes onde as pessoas possam trabalhar com saúde, dignidade e propósito.",
  },
  {
    id: "9",
    category: "alimentacao",
    icon: "🥗",
    title: "Comida verdadeira vs ultraprocessados: por que isso importa?",
    excerpt:
      "Estudos brasileiros mostram a correlação entre ultraprocessados e doenças crônicas...",
    readTime: 5,
    date: "03/04/2026",
    content:
      "Ultraprocessados são produtos industriais formulados a partir de substâncias extraídas de alimentos, como óleos, gorduras, açúcares, amidos e proteínas isoladas, combinadas com aditivos químicos como corantes, aromatizantes, emulsificantes e conservantes. Salgadinhos de pacote, refrigerantes, biscoitos recheados, embutidos, sopas instantâneas e refeições congeladas são exemplos clássicos. Eles foram desenhados para serem hiperpalatáveis, baratos e de longa duração, mas pagam um preço alto em qualidade nutricional.\n\nO Guia Alimentar para a População Brasileira, considerado uma das melhores referências do mundo segundo a FAO, recomenda evitar ultraprocessados sempre que possível. Estudos conduzidos pelo Núcleo de Pesquisas Epidemiológicas em Nutrição e Saúde da USP (Nupens-USP) mostram associações claras entre o alto consumo desses produtos e o aumento do risco de obesidade, diabetes tipo 2, hipertensão, doenças cardiovasculares, alguns tipos de câncer e até depressão. Em um estudo publicado no British Medical Journal, cada aumento de 10% no consumo de ultraprocessados elevou em 12% o risco geral de câncer.\n\nA explicação não está apenas no excesso de açúcar, sódio e gorduras. Os ultraprocessados também têm baixa densidade nutricional, são pobres em fibras e proteínas de qualidade, geram menos saciedade e estimulam o comer compulsivo. Além disso, os aditivos químicos podem alterar a microbiota intestinal e aumentar processos inflamatórios silenciosos no organismo, contribuindo para doenças crônicas a longo prazo.\n\nA boa notícia é que pequenas substituições já fazem diferença. Trocar refrigerante por água com limão, biscoito recheado por uma fruta com pasta de amendoim natural, ou sopa instantânea por uma versão caseira congelada são mudanças simples, baratas e de alto impacto. A regra de ouro: se a lista de ingredientes tem mais de cinco itens ou contém substâncias que você não usaria em casa, provavelmente é ultraprocessado. Prefira sempre comida de verdade.",
  },
  {
    id: "10",
    category: "atividade",
    icon: "🏃",
    title: "Pausas ativas no trabalho: pequenas mudanças, grandes resultados",
    excerpt: "Como interromper o sedentarismo durante o expediente...",
    readTime: 4,
    date: "02/04/2026",
    content:
      "Passar horas seguidas sentado é hoje considerado um dos principais fatores de risco para a saúde, ao lado do tabagismo. Pesquisadores da Universidade de Cambridge analisaram dados de mais de um milhão de pessoas e concluíram que ficar sentado por mais de oito horas diárias aumenta significativamente o risco de mortalidade precoce, mesmo entre quem pratica atividade física regular. O sedentarismo é cumulativo: o que você faz no resto do dia importa tanto quanto o tempo na academia.\n\nÉ aí que entram as pausas ativas, pequenas interrupções de 1 a 5 minutos, distribuídas ao longo do expediente, que ajudam a quebrar o ciclo de imobilidade. Elas podem incluir movimentos simples como ficar de pé, caminhar até a janela, fazer alongamentos de pescoço e ombros, subir um lance de escadas ou realizar agachamentos. A ideia não é se exercitar intensamente, mas reativar a circulação, aliviar tensões musculares e dar uma trégua mental ao cérebro.\n\nOs benefícios vão muito além da postura. Estudos mostram que pessoas que fazem pausas ativas regulares apresentam menos dores nas costas e no pescoço, maior produtividade, melhor concentração e menor sensação de fadiga ao final do dia. Empresas que adotaram programas estruturados de pausas ativas relatam redução de até 25% nos afastamentos por dores musculoesqueléticas e melhora significativa no clima organizacional.\n\nUma estratégia simples e eficaz é a regra '50/10': a cada 50 minutos de trabalho focado, faça 10 minutos de pausa, sendo pelo menos cinco em movimento. Use lembretes no celular, estabeleça com colegas momentos coletivos de alongamento ou aproveite reuniões curtas para realizá-las em pé. Pequenas mudanças, repetidas todos os dias, transformam a relação entre trabalho e corpo.",
  },
];

const categories = [
  { id: "todos", label: "Todos", icon: "📚" },
  { id: "saude-mental", label: "Saúde Mental", icon: "🧠" },
  { id: "nr1", label: "NR-1", icon: "🛡️" },
  { id: "alimentacao", label: "Alimentação", icon: "🥗" },
  { id: "atividade", label: "Atividade", icon: "🏃" },
  { id: "sono", label: "Sono", icon: "🌙" },
  { id: "financeiro", label: "Financeiro", icon: "💰" },
];

export default function AprendaPage() {
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("todos");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedArticle) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedArticle]);

  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      activeCategory === "todos" || article.category === activeCategory;
    const term = search.trim().toLowerCase();
    const matchesSearch =
      term === "" ||
      article.title.toLowerCase().includes(term) ||
      article.excerpt.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });

  if (!mounted) {
    return (
      <AppShell>
        <div className="min-h-screen bg-white" />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-white text-[#202124]">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-[#DADCE0]">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
            <Link
              href="/home"
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#F1F3F4] transition"
              aria-label="Voltar"
            >
              <ChevronLeft className="w-5 h-5 text-[#5F6368]" />
            </Link>
            <div className="flex items-center gap-2 flex-1">
              <BookOpen className="w-6 h-6 text-[#1A73E8]" />
              <h1 className="text-xl font-semibold text-[#202124]">Aprenda</h1>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F6368]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar artigos..."
              className="w-full rounded-full border border-[#DADCE0] bg-white pl-11 pr-4 py-3 text-sm text-[#202124] placeholder-[#5F6368] focus:outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] transition"
            />
          </div>

          {/* Categories */}
          <div className="-mx-4 px-4 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 min-w-max pb-1">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                      isActive
                        ? "bg-[#1A73E8] text-white shadow-sm"
                        : "bg-[#F1F3F4] text-[#5F6368] hover:bg-[#E8EAED]"
                    }`}
                  >
                    <span className="text-base leading-none">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Featured chips section header */}
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#202124]">
              {filteredArticles.length}{" "}
              {filteredArticles.length === 1 ? "artigo" : "artigos"}
            </h2>
            <div className="flex items-center gap-1 text-xs text-[#5F6368]">
              <Heart className="w-3.5 h-3.5" />
              <span>Conteúdo curado</span>
            </div>
          </div>

          {/* Articles list */}
          <div className="space-y-3">
            {filteredArticles.length === 0 && (
              <div className="bg-white border border-[#DADCE0] rounded-2xl p-8 text-center shadow-sm">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-sm font-medium text-[#202124]">
                  Nenhum artigo encontrado
                </p>
                <p className="text-xs text-[#5F6368] mt-1">
                  Tente outra busca ou categoria
                </p>
              </div>
            )}

            {filteredArticles.map((article, idx) => (
              <motion.button
                key={article.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.03 }}
                onClick={() => setSelectedArticle(article)}
                className="w-full text-left bg-white border border-[#DADCE0] rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-[#1A73E8]/30 transition flex items-start gap-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#F1F3F4] flex items-center justify-center text-3xl flex-shrink-0">
                  {article.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-[#202124] leading-snug mb-1 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-[#5F6368]">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{article.readTime} min</span>
                    </div>
                    <span className="text-[#DADCE0]">•</span>
                    <span>{article.date}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#5F6368] flex-shrink-0 self-center" />
              </motion.button>
            ))}
          </div>

          {/* Topic icons row (extra visual flourish) */}
          <div className="bg-[#F8F9FA] border border-[#DADCE0] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-[#202124] mb-3">
              Explore por tema
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Brain, label: "Mental", color: "#9C27B0" },
                { icon: Activity, label: "Movimento", color: "#0F9D58" },
                { icon: MoonIcon, label: "Sono", color: "#1A73E8" },
                { icon: Heart, label: "Coração", color: "#EA4335" },
                { icon: Wallet, label: "Finanças", color: "#F4B400" },
                { icon: Shield, label: "NR-1", color: "#5F6368" },
              ].map((topic) => {
                const Icon = topic.icon;
                return (
                  <div
                    key={topic.label}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white border border-[#DADCE0]"
                  >
                    <Icon className="w-5 h-5" style={{ color: topic.color }} />
                    <span className="text-xs text-[#5F6368] font-medium">
                      {topic.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Article modal */}
        {selectedArticle && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="fixed inset-0 bg-black/40 z-[55]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[60] bg-white rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 rounded-full bg-[#DADCE0]" />
              </div>

              {/* Modal header */}
              <div className="px-6 pt-3 pb-4 border-b border-[#DADCE0]">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#F1F3F4] flex items-center justify-center text-3xl flex-shrink-0">
                    {selectedArticle.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold text-[#202124] leading-snug">
                      {selectedArticle.title}
                    </h2>
                    <div className="flex items-center gap-3 text-xs text-[#5F6368] mt-2">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{selectedArticle.readTime} min de leitura</span>
                      </div>
                      <span className="text-[#DADCE0]">•</span>
                      <span>{selectedArticle.date}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal content */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="prose prose-sm max-w-none">
                  {selectedArticle.content.split("\n\n").map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-[15px] leading-relaxed text-[#3C4043] mb-4"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Modal footer */}
              <div className="px-6 py-4 border-t border-[#DADCE0] bg-white">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="w-full bg-[#1A73E8] hover:bg-[#1557B0] text-white font-medium py-3 rounded-full transition"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </AppShell>
  );
}
