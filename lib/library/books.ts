/**
 * Biblioteca SaluFlow — Livros de domínio público
 *
 * Todos os livros são de domínio público no Brasil (autor falecido há 70+ anos).
 * Fontes: Domínio Público (MEC) e Project Gutenberg.
 *
 * Evidência: 6 minutos de leitura reduzem estresse em 68%
 * (University of Sussex, 2009)
 */

export type BookCategory =
  | "romance"
  | "conto"
  | "poesia"
  | "filosofia"
  | "ficcao"
  | "historia";

export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  category: BookCategory;
  description: string;
  estimatedReadTime: number; // minutos
  cover: string; // emoji
  color: string; // hex
  excerpt: string; // primeiro parágrafo (preview)
  sourceUrl: string; // link para texto completo (domínio público)
  pages: number;
}

export const BOOKS: Book[] = [
  {
    id: "dom-casmurro",
    title: "Dom Casmurro",
    author: "Machado de Assis",
    year: 1899,
    category: "romance",
    description: "A história de Bentinho e Capitu, um dos maiores clássicos da literatura brasileira.",
    estimatedReadTime: 12,
    cover: "📕",
    color: "#EA4335",
    excerpt: "Uma noite destas, vindo da cidade para o Engenho Novo, encontrei num trem da Central um rapaz aqui do bairro, que eu conheço de vista e de chapéu. Cumprimentou-me, sentou-se ao pé de mim, falou da lua e dos ministros, e acabou recitando-me versos.",
    sourceUrl: "https://pt.wikisource.org/wiki/Dom_Casmurro",
    pages: 250,
  },
  {
    id: "memorias-postumas",
    title: "Memórias Póstumas de Brás Cubas",
    author: "Machado de Assis",
    year: 1881,
    category: "romance",
    description: "O defunto-autor que narra sua própria vida com ironia e ceticismo. Uma obra-prima do realismo.",
    estimatedReadTime: 15,
    cover: "📕",
    color: "#EA4335",
    excerpt: "Algum tempo hesitei se devia abrir estas memórias pelo princípio ou pelo fim, isto é, se poria em primeiro lugar o meu nascimento ou a minha morte.",
    sourceUrl: "https://pt.wikisource.org/wiki/Mem%C3%B3rias_P%C3%B3stumas_de_Br%C3%A1s_Cubas",
    pages: 320,
  },
  {
    id: "o-cortico",
    title: "O Cortiço",
    author: "Aluísio Azevedo",
    year: 1890,
    category: "romance",
    description: "Retrato cru da vida em um cortiço carioca no século XIX. Marco do naturalismo brasileiro.",
    estimatedReadTime: 18,
    cover: "📗",
    color: "#34A853",
    excerpt: "João Romão foi, dos treze aos vinte e cinco anos, empregado de um vendeiro, que enriqueceu entre as quatro paredes de uma suja e obscura taverna nos refolhos do bairro do Botafogo.",
    sourceUrl: "https://pt.wikisource.org/wiki/O_Corti%C3%A7o",
    pages: 280,
  },
  {
    id: "iracema",
    title: "Iracema",
    author: "José de Alencar",
    year: 1865,
    category: "romance",
    description: "Lenda do Ceará. A história de amor entre a índia Iracema e o português Martim.",
    estimatedReadTime: 10,
    cover: "📗",
    color: "#34A853",
    excerpt: "Verdes mares bravios de minha terra natal, onde canta a jandaia nas frondes da carnaúba; verdes mares, que brilhais como líquida esmeralda aos raios do sol nascente.",
    sourceUrl: "https://pt.wikisource.org/wiki/Iracema",
    pages: 180,
  },
  {
    id: "policarpo-quaresma",
    title: "Triste Fim de Policarpo Quaresma",
    author: "Lima Barreto",
    year: 1915,
    category: "romance",
    description: "Sátira sobre o nacionalismo brasileiro através do quixotesco major Quaresma.",
    estimatedReadTime: 14,
    cover: "📘",
    color: "#1A73E8",
    excerpt: "Há quinze anos que, todos os dias, às quatro e meia da tarde, o major Policarpo Quaresma, mais conhecido pela alcunha de Ubirajara, transpunha a porta da sua casa, na rua Real Grandeza.",
    sourceUrl: "https://pt.wikisource.org/wiki/Triste_Fim_de_Policarpo_Quaresma",
    pages: 250,
  },
  {
    id: "alienista",
    title: "O Alienista",
    author: "Machado de Assis",
    year: 1882,
    category: "conto",
    description: "Conto-novela sobre Simão Bacamarte e sua busca científica pela definição da loucura.",
    estimatedReadTime: 8,
    cover: "📕",
    color: "#EA4335",
    excerpt: "As crônicas da vila de Itaguaí dizem que em tempos remotos vivera ali um certo médico, o Doutor Simão Bacamarte, filho da nobreza da terra e o maior dos médicos do Brasil, de Portugal e das Espanhas.",
    sourceUrl: "https://pt.wikisource.org/wiki/O_Alienista",
    pages: 80,
  },
  {
    id: "cartomante",
    title: "A Cartomante",
    author: "Machado de Assis",
    year: 1884,
    category: "conto",
    description: "Conto curto sobre superstição, traição e destino. Leitura completa em 5 minutos.",
    estimatedReadTime: 5,
    cover: "📕",
    color: "#EA4335",
    excerpt: "Hamlet observa a Horácio que há mais coisas no céu e na terra do que sonha a nossa filosofia. Era a mesma explicação que dava a bela Rita ao mancebo Camilo, numa sexta-feira de novembro de 1869.",
    sourceUrl: "https://pt.wikisource.org/wiki/A_Cartomante",
    pages: 12,
  },
  {
    id: "o-guarani",
    title: "O Guarani",
    author: "José de Alencar",
    year: 1857,
    category: "romance",
    description: "Romance indianista que conta a história de Peri, índio guarani, e Ceci, filha de fidalgo português.",
    estimatedReadTime: 16,
    cover: "📗",
    color: "#34A853",
    excerpt: "De um dos cabeços da Serra dos Órgãos desliza um fio de água que se dirige para o norte, e engrossando com os mananciais que recebe no seu curso de dez léguas, torna-se rio caudal.",
    sourceUrl: "https://pt.wikisource.org/wiki/O_Guarani",
    pages: 380,
  },
  {
    id: "memorias-sargento",
    title: "Memórias de um Sargento de Milícias",
    author: "Manuel Antônio de Almeida",
    year: 1854,
    category: "romance",
    description: "Romance picaresco sobre a vida no Rio de Janeiro do início do século XIX.",
    estimatedReadTime: 14,
    cover: "📘",
    color: "#1A73E8",
    excerpt: "Era no tempo do rei. Um dos quatro cantos da rua do Ouvidor, o que fica entre a Quitanda, era naquele tempo um lugar de tal qual importância.",
    sourceUrl: "https://pt.wikisource.org/wiki/Mem%C3%B3rias_de_um_Sargento_de_Mil%C3%ADcias",
    pages: 220,
  },
  {
    id: "inocencia",
    title: "Inocência",
    author: "Visconde de Taunay",
    year: 1872,
    category: "romance",
    description: "Romance regionalista ambientado no sertão de Mato Grosso. Uma das primeiras obras a retratar o interior brasileiro.",
    estimatedReadTime: 13,
    cover: "📘",
    color: "#1A73E8",
    excerpt: "Quem do Rio de Janeiro quiser ir por terra à província de Mato Grosso, depois de viajar mais de duzentas léguas pelas do Rio de Janeiro, Minas Gerais e Goiás, tem de atravessar uma comprida e estreita zona quase deserta.",
    sourceUrl: "https://pt.wikisource.org/wiki/Inoc%C3%AAncia",
    pages: 200,
  },
  {
    id: "helena",
    title: "Helena",
    author: "Machado de Assis",
    year: 1876,
    category: "romance",
    description: "Romance romântico sobre identidade, amor e segredos familiares.",
    estimatedReadTime: 12,
    cover: "📕",
    color: "#EA4335",
    excerpt: "O conselheiro Vale morreu às sete horas da noite de 25 de abril de 1859. Morreu de apoplexia fulminante, pouco depois de cochilar a sesta — como costumava dizer.",
    sourceUrl: "https://pt.wikisource.org/wiki/Helena",
    pages: 240,
  },
  {
    id: "quincas-borba",
    title: "Quincas Borba",
    author: "Machado de Assis",
    year: 1891,
    category: "romance",
    description: "Continuação implícita de Brás Cubas. A filosofia do Humanitismo e a herança que destrói Rubião.",
    estimatedReadTime: 14,
    cover: "📕",
    color: "#EA4335",
    excerpt: "Rubião fitava a enseada — eram oito horas da manhã. Quem o visse, com os polegares metidos no cordão do chambre, à janela de uma grande casa de Botafogo, cuidaria que ele admirava aquele pedaço de água quieta.",
    sourceUrl: "https://pt.wikisource.org/wiki/Quincas_Borba",
    pages: 290,
  },
  {
    id: "senhora",
    title: "Senhora",
    author: "José de Alencar",
    year: 1875,
    category: "romance",
    description: "Romance urbano sobre o casamento por dinheiro e a vingança de Aurélia.",
    estimatedReadTime: 15,
    cover: "📗",
    color: "#34A853",
    excerpt: "Há anos raiou no céu fluminense uma nova estrela. Desde o momento de sua ascensão ninguém lhe disputou o cetro; foi proclamada a rainha dos salões.",
    sourceUrl: "https://pt.wikisource.org/wiki/Senhora",
    pages: 270,
  },
  {
    id: "os-sertoes",
    title: "Os Sertões",
    author: "Euclides da Cunha",
    year: 1902,
    category: "historia",
    description: "Relato épico da Guerra de Canudos. Marco do jornalismo literário brasileiro.",
    estimatedReadTime: 20,
    cover: "📓",
    color: "#FBBC04",
    excerpt: "O planalto central do Brasil desce, nos litorais do sul, em escarpas inteiriças, altas e abruptas. Assoberba os mares; e desata-se em chapadões nivelados pelos visos das cordilheiras marítimas.",
    sourceUrl: "https://pt.wikisource.org/wiki/Os_Sert%C3%B5es",
    pages: 600,
  },
  {
    id: "primo-basilio",
    title: "O Primo Basílio",
    author: "Eça de Queirós",
    year: 1878,
    category: "romance",
    description: "Romance realista português sobre o adultério burguês. Obra de domínio público lida no Brasil.",
    estimatedReadTime: 16,
    cover: "📒",
    color: "#A142F4",
    excerpt: "Tinham dado onze horas no cuco da sala de jantar. Jorge, depois de ter tirado da estante uma carteira, atirou-se para o balcão, com vagar, a esperar pelo almoço.",
    sourceUrl: "https://pt.wikisource.org/wiki/O_Primo_Bas%C3%ADlio",
    pages: 340,
  },
];

export const CATEGORY_LABELS: Record<BookCategory, string> = {
  romance: "Romance",
  conto: "Conto",
  poesia: "Poesia",
  filosofia: "Filosofia",
  ficcao: "Ficção",
  historia: "História",
};

export const CATEGORY_ICONS: Record<BookCategory, string> = {
  romance: "💝",
  conto: "📜",
  poesia: "🎭",
  filosofia: "🏛️",
  ficcao: "🚀",
  historia: "📜",
};

export function getBooksByCategory(category: BookCategory | "todos"): Book[] {
  if (category === "todos") return BOOKS;
  return BOOKS.filter((b) => b.category === category);
}

export function searchBooks(query: string): Book[] {
  if (!query.trim()) return BOOKS;
  const q = query.toLowerCase();
  return BOOKS.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q),
  );
}
