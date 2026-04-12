/**
 * Biblioteca SaluFlow — Livros de domínio público
 *
 * Todos os livros são de domínio público no Brasil (autor falecido há 70+ anos).
 * Fontes: Wikisource (pt.wikisource.org) e Project Gutenberg.
 *
 * Evidência: 6 minutos de leitura reduzem estresse em 68%
 * (University of Sussex, 2009)
 */

export type BookCategory =
  | "romance-br"
  | "romance-int"
  | "conto"
  | "poesia"
  | "historia"
  | "filosofia"
  | "aventura";

export type BookEra =
  | "romantismo"
  | "realismo"
  | "pre-modernismo"
  | "classico-int";

export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  nationality: "br" | "pt" | "int"; // brasileiro, português, internacional
  category: BookCategory;
  era: BookEra;
  description: string; // sinopse 2-3 linhas (Goodreads style)
  estimatedReadTime: number; // minutos para ler cerca de 20 páginas
  cover: string; // emoji
  color: string; // hex
  sourceUrl: string; // Wikisource pt.m.wikisource.org
  pages: number;
}

export const BOOKS: Book[] = [
  // ─────────────────────────────────────────────────────────
  // MACHADO DE ASSIS (Brasil — Realismo)
  // ─────────────────────────────────────────────────────────
  {
    id: "dom-casmurro",
    title: "Dom Casmurro",
    author: "Machado de Assis",
    year: 1899,
    nationality: "br",
    category: "romance-br",
    era: "realismo",
    description:
      "Bentinho recorda sua infância, o amor por Capitu e a dúvida que corrói toda a sua vida: teria ela o traído com Escobar? Um dos maiores romances da literatura brasileira.",
    estimatedReadTime: 15,
    cover: "📕",
    color: "#EA4335",
    sourceUrl: "https://pt.m.wikisource.org/wiki/Dom_Casmurro",
    pages: 250,
  },
  {
    id: "memorias-postumas",
    title: "Memórias Póstumas de Brás Cubas",
    author: "Machado de Assis",
    year: 1881,
    nationality: "br",
    category: "romance-br",
    era: "realismo",
    description:
      "Brás Cubas narra sua própria vida do túmulo, com ironia e ceticismo. Obra-prima que inaugurou o realismo no Brasil e revolucionou a forma do romance.",
    estimatedReadTime: 18,
    cover: "📕",
    color: "#EA4335",
    sourceUrl:
      "https://pt.m.wikisource.org/wiki/Mem%C3%B3rias_P%C3%B3stumas_de_Br%C3%A1s_Cubas",
    pages: 320,
  },
  {
    id: "quincas-borba",
    title: "Quincas Borba",
    author: "Machado de Assis",
    year: 1891,
    nationality: "br",
    category: "romance-br",
    era: "realismo",
    description:
      "Rubião herda a fortuna do filósofo Quincas Borba e junto vem a filosofia do Humanitismo — ao vencedor, as batatas. A herança se torna sua perdição.",
    estimatedReadTime: 16,
    cover: "📕",
    color: "#EA4335",
    sourceUrl: "https://pt.m.wikisource.org/wiki/Quincas_Borba",
    pages: 290,
  },
  {
    id: "helena",
    title: "Helena",
    author: "Machado de Assis",
    year: 1876,
    nationality: "br",
    category: "romance-br",
    era: "romantismo",
    description:
      "Após a morte do conselheiro Vale, sua família descobre a existência de Helena, filha até então desconhecida. Romance sobre identidade, amor e segredos.",
    estimatedReadTime: 14,
    cover: "📕",
    color: "#EA4335",
    sourceUrl: "https://pt.m.wikisource.org/wiki/Helena",
    pages: 240,
  },
  {
    id: "iaia-garcia",
    title: "Iaiá Garcia",
    author: "Machado de Assis",
    year: 1878,
    nationality: "br",
    category: "romance-br",
    era: "realismo",
    description:
      "Romance de transição na obra de Machado. A jovem Iaiá se envolve nos desígnios de Estela e Jorge, em uma história de amor e sacrifício.",
    estimatedReadTime: 13,
    cover: "📕",
    color: "#EA4335",
    sourceUrl: "https://pt.m.wikisource.org/wiki/Ia%C3%A1_Garcia",
    pages: 220,
  },
  {
    id: "mao-luva",
    title: "A Mão e a Luva",
    author: "Machado de Assis",
    year: 1874,
    nationality: "br",
    category: "romance-br",
    era: "romantismo",
    description:
      "A ambiciosa Guiomar escolhe entre três pretendentes aquele que melhor lhe convém. Romance urbano sobre cálculo social e estratégia amorosa.",
    estimatedReadTime: 12,
    cover: "📕",
    color: "#EA4335",
    sourceUrl: "https://pt.m.wikisource.org/wiki/A_M%C3%A3o_e_a_Luva",
    pages: 180,
  },
  {
    id: "esau-jaco",
    title: "Esaú e Jacó",
    author: "Machado de Assis",
    year: 1904,
    nationality: "br",
    category: "romance-br",
    era: "realismo",
    description:
      "Os gêmeos Pedro e Paulo rivalizam desde o ventre. Alegoria dos dois Brasis — república e monarquia — dividindo uma mesma nação.",
    estimatedReadTime: 15,
    cover: "📕",
    color: "#EA4335",
    sourceUrl: "https://pt.m.wikisource.org/wiki/Esa%C3%BA_e_Jac%C3%B3",
    pages: 260,
  },
  {
    id: "memorial-aires",
    title: "Memorial de Aires",
    author: "Machado de Assis",
    year: 1908,
    nationality: "br",
    category: "romance-br",
    era: "realismo",
    description:
      "Último romance de Machado. O diplomata aposentado Aires observa as relações ao seu redor com melancolia e ironia refinada.",
    estimatedReadTime: 12,
    cover: "📕",
    color: "#EA4335",
    sourceUrl: "https://pt.m.wikisource.org/wiki/Memorial_de_Aires",
    pages: 200,
  },
  {
    id: "alienista",
    title: "O Alienista",
    author: "Machado de Assis",
    year: 1882,
    nationality: "br",
    category: "conto",
    era: "realismo",
    description:
      "O médico Simão Bacamarte cria um hospício em Itaguaí e começa a internar metade da vila. Sátira brilhante sobre razão, loucura e poder científico.",
    estimatedReadTime: 8,
    cover: "📕",
    color: "#EA4335",
    sourceUrl: "https://pt.m.wikisource.org/wiki/O_Alienista",
    pages: 80,
  },
  {
    id: "cartomante",
    title: "A Cartomante",
    author: "Machado de Assis",
    year: 1884,
    nationality: "br",
    category: "conto",
    era: "realismo",
    description:
      "Camilo consulta uma cartomante sobre sua relação com Rita, esposa do amigo Vilela. Um conto curto sobre traição, superstição e destino irônico.",
    estimatedReadTime: 5,
    cover: "📕",
    color: "#EA4335",
    sourceUrl: "https://pt.m.wikisource.org/wiki/A_Cartomante",
    pages: 12,
  },

  // ─────────────────────────────────────────────────────────
  // JOSÉ DE ALENCAR (Brasil — Romantismo)
  // ─────────────────────────────────────────────────────────
  {
    id: "iracema",
    title: "Iracema",
    author: "José de Alencar",
    year: 1865,
    nationality: "br",
    category: "romance-br",
    era: "romantismo",
    description:
      "A virgem índia Iracema se apaixona pelo guerreiro português Martim, dando origem à nação cearense. Romance-lenda indianista, símbolo do romantismo brasileiro.",
    estimatedReadTime: 10,
    cover: "📗",
    color: "#34A853",
    sourceUrl: "https://pt.m.wikisource.org/wiki/Iracema",
    pages: 180,
  },
  {
    id: "o-guarani",
    title: "O Guarani",
    author: "José de Alencar",
    year: 1857,
    nationality: "br",
    category: "romance-br",
    era: "romantismo",
    description:
      "O índio Peri dedica sua vida a Cecília, filha de fidalgo português. Romance indianista que se tornou símbolo da formação do povo brasileiro.",
    estimatedReadTime: 18,
    cover: "📗",
    color: "#34A853",
    sourceUrl: "https://pt.m.wikisource.org/wiki/O_Guarani",
    pages: 380,
  },
  {
    id: "senhora",
    title: "Senhora",
    author: "José de Alencar",
    year: 1875,
    nationality: "br",
    category: "romance-br",
    era: "romantismo",
    description:
      "Aurélia, rica e orgulhosa, compra o ex-noivo que a abandonou pela fortuna alheia. Romance urbano sobre casamento, dinheiro e vingança.",
    estimatedReadTime: 15,
    cover: "📗",
    color: "#34A853",
    sourceUrl: "https://pt.m.wikisource.org/wiki/Senhora",
    pages: 270,
  },
  {
    id: "luciola",
    title: "Lucíola",
    author: "José de Alencar",
    year: 1862,
    nationality: "br",
    category: "romance-br",
    era: "romantismo",
    description:
      "Romance ousado para sua época, narra a paixão entre Paulo e Lúcia — uma cortesã — no Rio de Janeiro imperial. Retrato da vida boêmia e do amor impossível.",
    estimatedReadTime: 12,
    cover: "📗",
    color: "#34A853",
    sourceUrl: "https://pt.m.wikisource.org/wiki/Luc%C3%ADola",
    pages: 230,
  },
  {
    id: "diva",
    title: "Diva",
    author: "José de Alencar",
    year: 1864,
    nationality: "br",
    category: "romance-br",
    era: "romantismo",
    description:
      "A bela Emília reluta em aceitar o amor do médico Augusto. Um estudo psicológico do orgulho feminino e dos jogos entre razão e coração.",
    estimatedReadTime: 11,
    cover: "📗",
    color: "#34A853",
    sourceUrl: "https://pt.m.wikisource.org/wiki/Diva",
    pages: 190,
  },

  // ─────────────────────────────────────────────────────────
  // ALUÍSIO AZEVEDO (Brasil — Naturalismo)
  // ─────────────────────────────────────────────────────────
  {
    id: "o-cortico",
    title: "O Cortiço",
    author: "Aluísio Azevedo",
    year: 1890,
    nationality: "br",
    category: "romance-br",
    era: "realismo",
    description:
      "Retrato cru da vida em um cortiço carioca do século XIX. Obra-prima do naturalismo brasileiro, explora miséria, ambição e determinismo social.",
    estimatedReadTime: 17,
    cover: "📗",
    color: "#34A853",
    sourceUrl: "https://pt.m.wikisource.org/wiki/O_Corti%C3%A7o",
    pages: 280,
  },
  {
    id: "o-mulato",
    title: "O Mulato",
    author: "Aluísio Azevedo",
    year: 1881,
    nationality: "br",
    category: "romance-br",
    era: "realismo",
    description:
      "Primeiro romance naturalista do Brasil. Denuncia o preconceito racial em São Luís do Maranhão através da história de Raimundo, jovem mulato educado.",
    estimatedReadTime: 16,
    cover: "📗",
    color: "#34A853",
    sourceUrl: "https://pt.m.wikisource.org/wiki/O_Mulato",
    pages: 300,
  },

  // ─────────────────────────────────────────────────────────
  // LIMA BARRETO (Brasil — Pré-modernismo)
  // ─────────────────────────────────────────────────────────
  {
    id: "policarpo-quaresma",
    title: "Triste Fim de Policarpo Quaresma",
    author: "Lima Barreto",
    year: 1915,
    nationality: "br",
    category: "romance-br",
    era: "pre-modernismo",
    description:
      "Sátira contundente sobre o nacionalismo ingênuo. O major Quaresma dedica sua vida ao Brasil, mas o Brasil o decepciona em cada tentativa.",
    estimatedReadTime: 15,
    cover: "📘",
    color: "#1A73E8",
    sourceUrl:
      "https://pt.m.wikisource.org/wiki/Triste_Fim_de_Policarpo_Quaresma",
    pages: 250,
  },
  {
    id: "recordacoes-isaias",
    title: "Recordações do Escrivão Isaías Caminha",
    author: "Lima Barreto",
    year: 1909,
    nationality: "br",
    category: "romance-br",
    era: "pre-modernismo",
    description:
      "O jovem Isaías deixa o interior para tentar a vida no Rio e descobre o racismo e a corrupção do jornalismo carioca. Romance autobiográfico.",
    estimatedReadTime: 13,
    cover: "📘",
    color: "#1A73E8",
    sourceUrl:
      "https://pt.m.wikisource.org/wiki/Recorda%C3%A7%C3%B5es_do_Escriv%C3%A3o_Isa%C3%ADas_Caminha",
    pages: 240,
  },
  {
    id: "clara-dos-anjos",
    title: "Clara dos Anjos",
    author: "Lima Barreto",
    year: 1923,
    nationality: "br",
    category: "romance-br",
    era: "pre-modernismo",
    description:
      "A jovem mulata Clara é seduzida e abandonada pelo malandro Cassi Jones. Denúncia social sobre preconceito racial no Rio do início do século XX.",
    estimatedReadTime: 12,
    cover: "📘",
    color: "#1A73E8",
    sourceUrl: "https://pt.m.wikisource.org/wiki/Clara_dos_Anjos",
    pages: 200,
  },

  // ─────────────────────────────────────────────────────────
  // OUTROS BRASILEIROS
  // ─────────────────────────────────────────────────────────
  {
    id: "os-sertoes",
    title: "Os Sertões",
    author: "Euclides da Cunha",
    year: 1902,
    nationality: "br",
    category: "historia",
    era: "pre-modernismo",
    description:
      "Relato épico da Guerra de Canudos. Obra monumental que une jornalismo, ciência e literatura para retratar a tragédia do sertão brasileiro.",
    estimatedReadTime: 22,
    cover: "📓",
    color: "#FBBC04",
    sourceUrl: "https://pt.m.wikisource.org/wiki/Os_Sert%C3%B5es",
    pages: 600,
  },
  {
    id: "memorias-sargento",
    title: "Memórias de um Sargento de Milícias",
    author: "Manuel Antônio de Almeida",
    year: 1854,
    nationality: "br",
    category: "romance-br",
    era: "romantismo",
    description:
      "As aventuras picarescas de Leonardinho no Rio de Janeiro do início do século XIX. Retrato bem-humorado das classes populares e suas malandragens.",
    estimatedReadTime: 14,
    cover: "📘",
    color: "#1A73E8",
    sourceUrl:
      "https://pt.m.wikisource.org/wiki/Mem%C3%B3rias_de_um_Sargento_de_Mil%C3%ADcias",
    pages: 220,
  },
  {
    id: "inocencia",
    title: "Inocência",
    author: "Visconde de Taunay",
    year: 1872,
    nationality: "br",
    category: "romance-br",
    era: "romantismo",
    description:
      "Amor trágico no sertão de Mato Grosso. A jovem Inocência está prometida em casamento, mas se apaixona pelo forasteiro Cirino. Uma das primeiras obras regionalistas.",
    estimatedReadTime: 13,
    cover: "📘",
    color: "#1A73E8",
    sourceUrl: "https://pt.m.wikisource.org/wiki/Inoc%C3%AAncia",
    pages: 200,
  },
  {
    id: "moreninha",
    title: "A Moreninha",
    author: "Joaquim Manuel de Macedo",
    year: 1844,
    nationality: "br",
    category: "romance-br",
    era: "romantismo",
    description:
      "Considerado o primeiro romance brasileiro. Augusto promete a seus amigos não se apaixonar, mas a encantadora Carolina vai mudar seus planos.",
    estimatedReadTime: 11,
    cover: "📘",
    color: "#1A73E8",
    sourceUrl: "https://pt.m.wikisource.org/wiki/A_Moreninha",
    pages: 180,
  },
  {
    id: "ateneu",
    title: "O Ateneu",
    author: "Raul Pompeia",
    year: 1888,
    nationality: "br",
    category: "romance-br",
    era: "realismo",
    description:
      "O jovem Sérgio relata sua passagem pelo internato Ateneu — microcosmo da sociedade brasileira. Crônica de saudades e crueldade juvenil.",
    estimatedReadTime: 13,
    cover: "📘",
    color: "#1A73E8",
    sourceUrl: "https://pt.m.wikisource.org/wiki/O_Ateneu",
    pages: 220,
  },
  {
    id: "canaa",
    title: "Canaã",
    author: "Graça Aranha",
    year: 1902,
    nationality: "br",
    category: "romance-br",
    era: "pre-modernismo",
    description:
      "Dois imigrantes alemães no Espírito Santo debatem o futuro do Brasil. Romance filosófico sobre raça, imigração e utopia.",
    estimatedReadTime: 14,
    cover: "📘",
    color: "#1A73E8",
    sourceUrl: "https://pt.m.wikisource.org/wiki/Cana%C3%A3",
    pages: 260,
  },

  // ─────────────────────────────────────────────────────────
  // POESIA BRASILEIRA
  // ─────────────────────────────────────────────────────────
  {
    id: "espumas-flutuantes",
    title: "Espumas Flutuantes",
    author: "Castro Alves",
    year: 1870,
    nationality: "br",
    category: "poesia",
    era: "romantismo",
    description:
      "Único livro publicado em vida do poeta condoreiro. Reúne poemas líricos e sociais do bardo da abolição. Contém o icônico 'Navio Negreiro'.",
    estimatedReadTime: 8,
    cover: "📒",
    color: "#A142F4",
    sourceUrl: "https://pt.m.wikisource.org/wiki/Espumas_Flutuantes",
    pages: 120,
  },
  {
    id: "eu-augusto-anjos",
    title: "Eu",
    author: "Augusto dos Anjos",
    year: 1912,
    nationality: "br",
    category: "poesia",
    era: "pre-modernismo",
    description:
      "Único livro do poeta paraibano. Poesia singular que mistura simbolismo, parnasianismo e temas científicos com obsessão pela morte e pela matéria.",
    estimatedReadTime: 10,
    cover: "📒",
    color: "#A142F4",
    sourceUrl: "https://pt.m.wikisource.org/wiki/Eu",
    pages: 140,
  },
  {
    id: "primeiros-cantos",
    title: "Primeiros Cantos",
    author: "Gonçalves Dias",
    year: 1846,
    nationality: "br",
    category: "poesia",
    era: "romantismo",
    description:
      "Estreia do maior poeta indianista brasileiro. Contém a célebre 'Canção do Exílio' — 'Minha terra tem palmeiras onde canta o sabiá'.",
    estimatedReadTime: 7,
    cover: "📒",
    color: "#A142F4",
    sourceUrl: "https://pt.m.wikisource.org/wiki/Primeiros_Cantos",
    pages: 100,
  },

  // ─────────────────────────────────────────────────────────
  // PORTUGUESES (domínio público)
  // ─────────────────────────────────────────────────────────
  {
    id: "os-maias",
    title: "Os Maias",
    author: "Eça de Queirós",
    year: 1888,
    nationality: "pt",
    category: "romance-int",
    era: "realismo",
    description:
      "A saga de três gerações da família Maia em Lisboa. Obra-prima do realismo português, retrata a decadência da aristocracia e um amor proibido.",
    estimatedReadTime: 20,
    cover: "📒",
    color: "#A142F4",
    sourceUrl: "https://pt.m.wikisource.org/wiki/Os_Maias",
    pages: 500,
  },
  {
    id: "primo-basilio",
    title: "O Primo Basílio",
    author: "Eça de Queirós",
    year: 1878,
    nationality: "pt",
    category: "romance-int",
    era: "realismo",
    description:
      "Luísa, jovem esposa burguesa, cede ao primo Basílio e vê sua vida ruir sob chantagem e culpa. Retrato afiado da hipocrisia burguesa portuguesa.",
    estimatedReadTime: 17,
    cover: "📒",
    color: "#A142F4",
    sourceUrl: "https://pt.m.wikisource.org/wiki/O_Primo_Bas%C3%ADlio",
    pages: 340,
  },
  {
    id: "crime-padre-amaro",
    title: "O Crime do Padre Amaro",
    author: "Eça de Queirós",
    year: 1875,
    nationality: "pt",
    category: "romance-int",
    era: "realismo",
    description:
      "Primeiro romance realista português. O jovem padre Amaro se envolve com Amélia, a filha da hospedeira, em uma crítica mordaz à Igreja e à moral provinciana.",
    estimatedReadTime: 18,
    cover: "📒",
    color: "#A142F4",
    sourceUrl:
      "https://pt.m.wikisource.org/wiki/O_Crime_do_Padre_Amaro",
    pages: 380,
  },
  {
    id: "cidade-serras",
    title: "A Cidade e as Serras",
    author: "Eça de Queirós",
    year: 1901,
    nationality: "pt",
    category: "romance-int",
    era: "realismo",
    description:
      "Jacinto, entediado pelos luxos de Paris, redescobre a alma ao retornar às serras de Portugal. Um elogio à vida simples e à natureza.",
    estimatedReadTime: 14,
    cover: "📒",
    color: "#A142F4",
    sourceUrl: "https://pt.m.wikisource.org/wiki/A_Cidade_e_as_Serras",
    pages: 260,
  },

  // ─────────────────────────────────────────────────────────
  // CLÁSSICOS INTERNACIONAIS (domínio público)
  // ─────────────────────────────────────────────────────────
  {
    id: "orgulho-preconceito",
    title: "Orgulho e Preconceito",
    author: "Jane Austen",
    year: 1813,
    nationality: "int",
    category: "romance-int",
    era: "classico-int",
    description:
      "Elizabeth Bennet e o Sr. Darcy precisam superar seus orgulhos e preconceitos para encontrar o amor. Comédia de costumes sobre casamento e classe social.",
    estimatedReadTime: 18,
    cover: "📘",
    color: "#1A73E8",
    sourceUrl: "https://pt.m.wikisource.org/wiki/Orgulho_e_Preconceito",
    pages: 420,
  },
  {
    id: "frankenstein",
    title: "Frankenstein",
    author: "Mary Shelley",
    year: 1818,
    nationality: "int",
    category: "romance-int",
    era: "classico-int",
    description:
      "Victor Frankenstein cria vida a partir de matéria morta, mas se arrepende amargamente. Marco da ficção científica e reflexão sobre ciência e responsabilidade.",
    estimatedReadTime: 16,
    cover: "📓",
    color: "#FBBC04",
    sourceUrl: "https://pt.m.wikisource.org/wiki/Frankenstein",
    pages: 300,
  },
  {
    id: "dracula",
    title: "Drácula",
    author: "Bram Stoker",
    year: 1897,
    nationality: "int",
    category: "romance-int",
    era: "classico-int",
    description:
      "O conde Drácula chega à Inglaterra e encontra pela frente o caçador Van Helsing. Romance gótico que definiu a figura do vampiro na literatura moderna.",
    estimatedReadTime: 19,
    cover: "📓",
    color: "#FBBC04",
    sourceUrl: "https://pt.m.wikisource.org/wiki/Dr%C3%A1cula",
    pages: 440,
  },
  {
    id: "retrato-dorian-gray",
    title: "O Retrato de Dorian Gray",
    author: "Oscar Wilde",
    year: 1890,
    nationality: "int",
    category: "romance-int",
    era: "classico-int",
    description:
      "O jovem Dorian Gray faz um pacto: seu retrato envelhecerá em seu lugar. Romance sobre beleza, vaidade e corrupção moral.",
    estimatedReadTime: 15,
    cover: "📓",
    color: "#FBBC04",
    sourceUrl:
      "https://pt.m.wikisource.org/wiki/O_Retrato_de_Dorian_Gray",
    pages: 280,
  },
  {
    id: "sherlock-holmes-estudo",
    title: "Um Estudo em Vermelho",
    author: "Arthur Conan Doyle",
    year: 1887,
    nationality: "int",
    category: "aventura",
    era: "classico-int",
    description:
      "Primeira aventura de Sherlock Holmes e Dr. Watson. Um assassinato em Londres leva o detetive a desvendar um mistério que remonta aos mórmons de Utah.",
    estimatedReadTime: 12,
    cover: "📓",
    color: "#FBBC04",
    sourceUrl: "https://pt.m.wikisource.org/wiki/Um_Estudo_em_Vermelho",
    pages: 180,
  },
  {
    id: "metamorfose",
    title: "A Metamorfose",
    author: "Franz Kafka",
    year: 1915,
    nationality: "int",
    category: "romance-int",
    era: "classico-int",
    description:
      "Gregor Samsa acorda um dia transformado em inseto monstruoso. Novela sobre alienação, família e identidade — clássico máximo do absurdo kafkiano.",
    estimatedReadTime: 8,
    cover: "📓",
    color: "#FBBC04",
    sourceUrl: "https://pt.m.wikisource.org/wiki/A_Metamorfose",
    pages: 100,
  },
  {
    id: "hamlet",
    title: "Hamlet",
    author: "William Shakespeare",
    year: 1603,
    nationality: "int",
    category: "filosofia",
    era: "classico-int",
    description:
      "Ser ou não ser. O príncipe Hamlet busca vingar a morte de seu pai e mergulha no dilema entre ação e reflexão. A tragédia mais estudada do mundo.",
    estimatedReadTime: 14,
    cover: "📓",
    color: "#FBBC04",
    sourceUrl: "https://pt.m.wikisource.org/wiki/Hamlet",
    pages: 280,
  },
  {
    id: "romeu-julieta",
    title: "Romeu e Julieta",
    author: "William Shakespeare",
    year: 1597,
    nationality: "int",
    category: "romance-int",
    era: "classico-int",
    description:
      "Dois jovens amantes de famílias rivais em Verona. A tragédia mais famosa sobre amor impossível na história da literatura ocidental.",
    estimatedReadTime: 11,
    cover: "📓",
    color: "#FBBC04",
    sourceUrl: "https://pt.m.wikisource.org/wiki/Romeu_e_Julieta",
    pages: 200,
  },
  {
    id: "dom-quixote",
    title: "Dom Quixote",
    author: "Miguel de Cervantes",
    year: 1605,
    nationality: "int",
    category: "romance-int",
    era: "classico-int",
    description:
      "O fidalgo Alonso Quijano enlouquece de tanto ler romances de cavalaria e parte em aventuras como Dom Quixote. O primeiro romance moderno.",
    estimatedReadTime: 25,
    cover: "📓",
    color: "#FBBC04",
    sourceUrl: "https://pt.m.wikisource.org/wiki/Dom_Quixote",
    pages: 800,
  },
  {
    id: "alice-no-pais",
    title: "Alice no País das Maravilhas",
    author: "Lewis Carroll",
    year: 1865,
    nationality: "int",
    category: "aventura",
    era: "classico-int",
    description:
      "Alice cai numa toca de coelho e chega a um mundo absurdo povoado por personagens excêntricos. Clássico da literatura infantil com camadas para adultos.",
    estimatedReadTime: 9,
    cover: "📓",
    color: "#FBBC04",
    sourceUrl:
      "https://pt.m.wikisource.org/wiki/Alice_no_Pa%C3%ADs_das_Maravilhas",
    pages: 150,
  },
  {
    id: "ilha-do-tesouro",
    title: "A Ilha do Tesouro",
    author: "Robert Louis Stevenson",
    year: 1883,
    nationality: "int",
    category: "aventura",
    era: "classico-int",
    description:
      "O jovem Jim Hawkins parte em busca do tesouro enterrado pelo capitão Flint. Clássico definitivo da literatura de aventuras com piratas.",
    estimatedReadTime: 12,
    cover: "📓",
    color: "#FBBC04",
    sourceUrl: "https://pt.m.wikisource.org/wiki/A_Ilha_do_Tesouro",
    pages: 220,
  },
  {
    id: "vinte-mil-leguas",
    title: "Vinte Mil Léguas Submarinas",
    author: "Júlio Verne",
    year: 1870,
    nationality: "int",
    category: "aventura",
    era: "classico-int",
    description:
      "O professor Aronnax é capturado pelo misterioso capitão Nemo no submarino Nautilus e explora os mares do mundo. Ficção científica visionária.",
    estimatedReadTime: 16,
    cover: "📓",
    color: "#FBBC04",
    sourceUrl:
      "https://pt.m.wikisource.org/wiki/Vinte_Mil_L%C3%A9guas_Submarinas",
    pages: 340,
  },
  {
    id: "volta-ao-mundo-80",
    title: "A Volta ao Mundo em 80 Dias",
    author: "Júlio Verne",
    year: 1872,
    nationality: "int",
    category: "aventura",
    era: "classico-int",
    description:
      "O inglês Phileas Fogg aposta que pode dar a volta ao mundo em 80 dias. Clássico de aventura que atravessa continentes em ritmo alucinante.",
    estimatedReadTime: 13,
    cover: "📓",
    color: "#FBBC04",
    sourceUrl:
      "https://pt.m.wikisource.org/wiki/A_Volta_ao_Mundo_em_Oitenta_Dias",
    pages: 260,
  },
  {
    id: "conde-monte-cristo",
    title: "O Conde de Monte Cristo",
    author: "Alexandre Dumas",
    year: 1844,
    nationality: "int",
    category: "aventura",
    era: "classico-int",
    description:
      "Edmond Dantès, injustamente preso, escapa e se torna o misterioso Conde de Monte Cristo para vingar-se dos que o traíram. Obra-prima da vingança.",
    estimatedReadTime: 28,
    cover: "📓",
    color: "#FBBC04",
    sourceUrl:
      "https://pt.m.wikisource.org/wiki/O_Conde_de_Monte_Cristo",
    pages: 1200,
  },
  {
    id: "tres-mosqueteiros",
    title: "Os Três Mosqueteiros",
    author: "Alexandre Dumas",
    year: 1844,
    nationality: "int",
    category: "aventura",
    era: "classico-int",
    description:
      "D'Artagnan chega a Paris e se une a Athos, Porthos e Aramis. 'Um por todos, todos por um' — a mais famosa aventura de capa e espada.",
    estimatedReadTime: 22,
    cover: "📓",
    color: "#FBBC04",
    sourceUrl: "https://pt.m.wikisource.org/wiki/Os_Tr%C3%AAs_Mosqueteiros",
    pages: 700,
  },

  // ─────────────────────────────────────────────────────────
  // FILOSOFIA / REFLEXÃO
  // ─────────────────────────────────────────────────────────
  {
    id: "arte-da-guerra",
    title: "A Arte da Guerra",
    author: "Sun Tzu",
    year: -500,
    nationality: "int",
    category: "filosofia",
    era: "classico-int",
    description:
      "Tratado militar chinês escrito há 2.500 anos que se tornou leitura obrigatória em negócios e estratégia. Princípios atemporais sobre liderança e conflito.",
    estimatedReadTime: 10,
    cover: "📓",
    color: "#FBBC04",
    sourceUrl: "https://pt.m.wikisource.org/wiki/A_Arte_da_Guerra",
    pages: 120,
  },
  {
    id: "principe-maquiavel",
    title: "O Príncipe",
    author: "Nicolau Maquiavel",
    year: 1532,
    nationality: "int",
    category: "filosofia",
    era: "classico-int",
    description:
      "Tratado político que definiu o pragmatismo no poder. 'Os fins justificam os meios' — manual cru sobre governar e manter o poder.",
    estimatedReadTime: 9,
    cover: "📓",
    color: "#FBBC04",
    sourceUrl: "https://pt.m.wikisource.org/wiki/O_Pr%C3%ADncipe",
    pages: 140,
  },
  {
    id: "utopia",
    title: "Utopia",
    author: "Thomas More",
    year: 1516,
    nationality: "int",
    category: "filosofia",
    era: "classico-int",
    description:
      "Thomas More descreve uma ilha imaginária com sociedade perfeita. Obra que deu nome ao conceito e influenciou o pensamento político por séculos.",
    estimatedReadTime: 8,
    cover: "📓",
    color: "#FBBC04",
    sourceUrl: "https://pt.m.wikisource.org/wiki/Utopia",
    pages: 120,
  },
];

export const CATEGORY_LABELS: Record<BookCategory, string> = {
  "romance-br": "Romance BR",
  "romance-int": "Romance Int.",
  conto: "Conto",
  poesia: "Poesia",
  historia: "História",
  filosofia: "Filosofia",
  aventura: "Aventura",
};

export const ERA_LABELS: Record<BookEra, string> = {
  romantismo: "Romantismo",
  realismo: "Realismo",
  "pre-modernismo": "Pré-modernismo",
  "classico-int": "Clássicos Internacionais",
};

export function getBooksByCategory(
  category: BookCategory | "todos",
): Book[] {
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
