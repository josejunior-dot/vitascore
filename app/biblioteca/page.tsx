"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  BookOpen,
  Clock,
  Search,
  ExternalLink,
  Award,
  Coffee,
  X,
  Check,
  FileText,
  Volume2,
  Play,
  Pause,
  Square,
  Headphones,
} from "lucide-react";
import Link from "next/link";

import AppShell from "@/components/layout/AppShell";
import {
  BOOKS,
  type Book,
  type BookCategory,
  CATEGORY_LABELS,
  CATEGORY_ICONS,
} from "@/lib/library/books";

/* eslint-disable @typescript-eslint/no-explicit-any */
const sectionVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
  }),
};

const CATEGORIES: { id: BookCategory | "todos"; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "romance", label: "Romance" },
  { id: "conto", label: "Conto" },
  { id: "historia", label: "História" },
  { id: "ficcao", label: "Ficção" },
];

export default function BibliotecaPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<BookCategory | "todos">("todos");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [readBooks, setReadBooks] = useState<string[]>([]);
  const [totalMinutesRead, setTotalMinutesRead] = useState(0);

  // TTS (Text-to-Speech)
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);

  useEffect(() => {
    // Detectar suporte a Web Speech API
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setTtsSupported(true);
      // Carregar vozes (algumas plataformas precisam de um trigger)
      window.speechSynthesis.getVoices();
    }
    // Cleanup: parar fala ao desmontar
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Parar fala ao fechar modal
  useEffect(() => {
    if (!selectedBook && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, [selectedBook]);

  const speakExcerpt = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    // Se já estiver tocando, para
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Tentar pegar voz brasileira
    const voices = window.speechSynthesis.getVoices();
    const ptVoice =
      voices.find((v) => v.lang === "pt-BR") ||
      voices.find((v) => v.lang.startsWith("pt"));
    if (ptVoice) utterance.voice = ptVoice;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };
    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const togglePauseResume = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const stopSpeaking = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const searchYouTubeAudiobook = (book: Book) => {
    const query = encodeURIComponent(`${book.title} ${book.author} audiobook completo`);
    return `https://www.youtube.com/results?search_query=${query}`;
  };

  useEffect(() => {
    const saved = localStorage.getItem("library-read");
    if (saved) {
      try {
        const arr = JSON.parse(saved);
        setReadBooks(arr);
      } catch {}
    }
    const minutes = localStorage.getItem("library-minutes");
    if (minutes) {
      setTotalMinutesRead(parseInt(minutes) || 0);
    }
  }, []);

  const filteredBooks = BOOKS.filter((book) => {
    const matchesSearch =
      !search ||
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "todos" || book.category === category;
    return matchesSearch && matchesCategory;
  });

  const markAsRead = (book: Book) => {
    if (readBooks.includes(book.id)) return;
    const updated = [...readBooks, book.id];
    setReadBooks(updated);
    localStorage.setItem("library-read", JSON.stringify(updated));

    const newTotal = totalMinutesRead + book.estimatedReadTime;
    setTotalMinutesRead(newTotal);
    localStorage.setItem("library-minutes", String(newTotal));
  };

  return (
    <AppShell>
      <div className="flex flex-col min-h-screen pb-24 bg-white">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-[#DADCE0] px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/home" className="p-1 -ml-1">
                <ChevronLeft className="w-5 h-5 text-[#5F6368]" />
              </Link>
              <h1 className="text-lg font-semibold text-[#202124] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#1A73E8]" />
                Biblioteca
              </h1>
            </div>
            {readBooks.length > 0 && (
              <span className="text-xs text-[#5F6368]">
                {readBooks.length} lido{readBooks.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </header>

        <div className="flex flex-col gap-4 px-4 pt-4">
          {/* Hero Card — Evidência científica */}
          <motion.section
            custom={0}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="rounded-2xl p-5 border border-[#1A73E8]/20"
            style={{
              background:
                "linear-gradient(135deg, #E8F0FE 0%, #FFFFFF 60%, #E6F4EA 100%)",
            }}
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">📖</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[#202124] mb-1">
                  Leitura reduz estresse em 68%
                </h2>
                <p className="text-xs text-[#5F6368] leading-relaxed">
                  6 minutos de leitura por dia. Cientificamente comprovado.
                  <br />
                  <span className="text-[#9AA0A6]">
                    Universidade de Sussex (2009)
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 pt-4 border-t border-white/50">
              <div className="text-center">
                <div className="text-lg font-bold text-[#1A73E8]">
                  {BOOKS.length}
                </div>
                <div className="text-[10px] text-[#5F6368]">Livros</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-[#34A853]">
                  {readBooks.length}
                </div>
                <div className="text-[10px] text-[#5F6368]">Lidos por você</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-[#FBBC04]">
                  {totalMinutesRead}
                </div>
                <div className="text-[10px] text-[#5F6368]">Min lidos</div>
              </div>
            </div>
          </motion.section>

          {/* Search */}
          <motion.div
            custom={1}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9AA0A6]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título ou autor..."
              className="w-full pl-11 pr-4 py-3 rounded-full bg-[#F1F3F4] border border-transparent text-sm text-[#202124] outline-none focus:bg-white focus:border-[#1A73E8]/30"
            />
          </motion.div>

          {/* Categorias */}
          <motion.div
            custom={2}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  category === cat.id
                    ? "bg-[#1A73E8] text-white"
                    : "bg-[#F1F3F4] text-[#5F6368]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>

          {/* Books Grid */}
          <motion.div
            custom={3}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-3"
          >
            {filteredBooks.map((book, i) => {
              const isRead = readBooks.includes(book.id);
              return (
                <motion.button
                  key={book.id}
                  custom={i}
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => setSelectedBook(book)}
                  className="bg-white rounded-2xl border border-[#DADCE0] shadow-sm overflow-hidden text-left hover:shadow-md transition-shadow"
                >
                  {/* Cover */}
                  <div
                    className="h-32 flex items-center justify-center text-5xl relative"
                    style={{
                      background: `linear-gradient(135deg, ${book.color}15 0%, ${book.color}30 100%)`,
                    }}
                  >
                    {book.cover}
                    {isRead && (
                      <div className="absolute top-2 right-2 bg-[#34A853] text-white rounded-full p-1">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-[#202124] line-clamp-2 mb-1">
                      {book.title}
                    </h3>
                    <p className="text-[11px] text-[#5F6368] mb-2 line-clamp-1">
                      {book.author}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-[#9AA0A6]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {book.estimatedReadTime} min
                      </span>
                      <span>{book.year}</span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-[#DADCE0] mx-auto mb-2" />
              <p className="text-sm text-[#9AA0A6]">Nenhum livro encontrado</p>
            </div>
          )}

          {/* Info card */}
          <div className="bg-[#F8F9FA] rounded-xl p-4 border border-[#DADCE0]">
            <p className="text-xs text-[#5F6368] leading-relaxed">
              💡 Todos os livros são de <strong>domínio público</strong> no
              Brasil. Os textos completos estão disponíveis gratuitamente no{" "}
              <a
                href="https://www.dominiopublico.gov.br"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1A73E8] underline"
              >
                Portal Domínio Público
              </a>{" "}
              do MEC.
            </p>
          </div>
        </div>

        {/* Reader Modal */}
        <AnimatePresence>
          {selectedBook && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedBook(null)}
                className="fixed inset-0 bg-black/50 z-[55]"
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 z-[60] mx-auto max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-t-3xl"
              >
                {/* Header do leitor */}
                <div className="sticky top-0 z-10 bg-white border-b border-[#DADCE0] px-5 py-4 flex items-start gap-3">
                  <div
                    className="text-3xl flex-shrink-0"
                    style={{
                      backgroundColor: `${selectedBook.color}15`,
                      width: 56,
                      height: 56,
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {selectedBook.cover}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-bold text-[#202124] line-clamp-2">
                      {selectedBook.title}
                    </h2>
                    <p className="text-xs text-[#5F6368]">
                      {selectedBook.author} · {selectedBook.year}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[#9AA0A6]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {selectedBook.estimatedReadTime} min
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {selectedBook.pages} pág
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedBook(null)}
                    className="p-2 -m-2 text-[#5F6368]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Conteúdo */}
                <div className="px-5 py-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold tracking-wider text-[#9AA0A6] uppercase">
                      Sobre a obra
                    </span>
                  </div>
                  <p className="text-sm text-[#5F6368] leading-relaxed mb-6">
                    {selectedBook.description}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold tracking-wider text-[#9AA0A6] uppercase">
                      Trecho
                    </span>
                  </div>
                  <div
                    className="rounded-2xl p-5 mb-6 border border-[#DADCE0]"
                    style={{ backgroundColor: "#FAFAFA" }}
                  >
                    <p
                      className="text-base text-[#202124] leading-relaxed"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      <span className="text-3xl float-left mr-1 mt-1 leading-none text-[#1A73E8] font-bold">
                        {selectedBook.excerpt.charAt(0)}
                      </span>
                      {selectedBook.excerpt.slice(1)}
                    </p>
                  </div>

                  {/* Controles de áudio (TTS) */}
                  {ttsSupported && (
                    <div className="mb-3">
                      {!isPlaying ? (
                        <button
                          onClick={() => speakExcerpt(selectedBook.excerpt)}
                          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#E8F0FE] text-[#1A73E8] text-sm font-semibold mb-3"
                        >
                          <Volume2 className="w-4 h-4" />
                          Ouvir trecho (narração)
                        </button>
                      ) : (
                        <div className="flex gap-2 mb-3">
                          <button
                            onClick={togglePauseResume}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1A73E8] text-white text-sm font-semibold"
                          >
                            {isPaused ? (
                              <>
                                <Play className="w-4 h-4" />
                                Continuar
                              </>
                            ) : (
                              <>
                                <Pause className="w-4 h-4" />
                                Pausar
                              </>
                            )}
                          </button>
                          <button
                            onClick={stopSpeaking}
                            className="px-4 py-3 rounded-xl bg-[#F1F3F4] text-[#5F6368]"
                          >
                            <Square className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Ler dentro do app */}
                  <Link
                    href={`/biblioteca/ler?id=${selectedBook.id}`}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#1A73E8] text-white text-sm font-semibold mb-3"
                  >
                    <BookOpen className="w-4 h-4" />
                    Ler livro completo
                  </Link>

                  {/* Buscar audiolivro completo no YouTube */}
                  <a
                    href={searchYouTubeAudiobook(selectedBook)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-[#A142F4] text-[#A142F4] text-sm font-medium mb-3"
                  >
                    <Headphones className="w-4 h-4" />
                    Buscar audiolivro completo
                  </a>

                  {/* Marcar como lido */}
                  {readBooks.includes(selectedBook.id) ? (
                    <div className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#E6F4EA] text-[#34A853] text-sm font-medium">
                      <Check className="w-4 h-4" />
                      Marcado como lido
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        markAsRead(selectedBook);
                      }}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#1A73E8] text-white text-sm font-semibold"
                    >
                      <Award className="w-4 h-4" />
                      Marquei como lido (+10 moedas)
                    </button>
                  )}

                  <p className="text-[10px] text-[#9AA0A6] text-center mt-4">
                    Domínio público · Sem direitos autorais · Uso livre
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
