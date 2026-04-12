"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  BookOpen,
  Clock,
  Search,
  X,
  Check,
  FileText,
  Volume2,
  Play,
  Pause,
  Square,
  Headphones,
  Bookmark,
  PauseCircle,
  Filter,
} from "lucide-react";
import Link from "next/link";

import AppShell from "@/components/layout/AppShell";
import {
  BOOKS,
  type Book,
  type BookCategory,
  type BookEra,
  CATEGORY_LABELS,
  ERA_LABELS,
} from "@/lib/library/books";

/* eslint-disable @typescript-eslint/no-explicit-any */
const sectionVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.35, ease: "easeOut" },
  }),
};

type ReadingStatus = "lendo" | "lido" | "quero-ler" | "pausado";

const STATUS_LABELS: Record<ReadingStatus, string> = {
  lendo: "Lendo",
  lido: "Lido",
  "quero-ler": "Quero ler",
  pausado: "Pausado",
};

const STATUS_COLORS: Record<ReadingStatus, { bg: string; fg: string }> = {
  lendo: { bg: "#E8F0FE", fg: "#1A73E8" },
  lido: { bg: "#E6F4EA", fg: "#34A853" },
  "quero-ler": { bg: "#FEF7E0", fg: "#F9AB00" },
  pausado: { bg: "#F1F3F4", fg: "#5F6368" },
};

const STATUS_ICONS: Record<ReadingStatus, typeof BookOpen> = {
  lendo: BookOpen,
  lido: Check,
  "quero-ler": Bookmark,
  pausado: PauseCircle,
};

const STATUS_ORDER: ReadingStatus[] = ["lendo", "quero-ler", "pausado", "lido"];

const STORAGE_KEY = "saluflow-library-status";
const MINUTES_KEY = "saluflow-library-minutes";

type Tab = "catalogo" | "minha";

const NATIONALITY_LABELS: Record<"todos" | "br" | "pt" | "int", string> = {
  todos: "Todas",
  br: "Brasil",
  pt: "Portugal",
  int: "Internacional",
};

export default function BibliotecaPage() {
  const [tab, setTab] = useState<Tab>("catalogo");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<BookCategory | "todos">("todos");
  const [era, setEra] = useState<BookEra | "todos">("todos");
  const [nationality, setNationality] = useState<"todos" | "br" | "pt" | "int">(
    "todos",
  );
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ReadingStatus | "todos">(
    "todos",
  );

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [statuses, setStatuses] = useState<Record<string, ReadingStatus>>({});
  const [totalMinutesRead, setTotalMinutesRead] = useState(0);

  // TTS (Text-to-Speech)
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setTtsSupported(true);
      window.speechSynthesis.getVoices();
    }
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (!selectedBook && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, [selectedBook]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setStatuses(JSON.parse(saved));
      const minutes = localStorage.getItem(MINUTES_KEY);
      if (minutes) setTotalMinutesRead(parseInt(minutes) || 0);
    } catch {}
  }, []);

  const persistStatuses = (next: Record<string, ReadingStatus>) => {
    setStatuses(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  const setBookStatus = (book: Book, status: ReadingStatus) => {
    const previous = statuses[book.id];
    const next = { ...statuses, [book.id]: status };
    persistStatuses(next);

    // Soma minutos só na primeira vez que vira "lido"
    if (status === "lido" && previous !== "lido") {
      const newTotal = totalMinutesRead + book.estimatedReadTime;
      setTotalMinutesRead(newTotal);
      try {
        localStorage.setItem(MINUTES_KEY, String(newTotal));
      } catch {}
    }
  };

  const removeFromLibrary = (bookId: string) => {
    const next = { ...statuses };
    delete next[bookId];
    persistStatuses(next);
  };

  const speakDescription = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.volume = 1;

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
    const query = encodeURIComponent(
      `${book.title} ${book.author} audiobook completo`,
    );
    return `https://www.youtube.com/results?search_query=${query}`;
  };

  // ─── Filtragem ──────────────────────────────────────────────
  const myBookIds = useMemo(() => Object.keys(statuses), [statuses]);

  const baseBooks = useMemo(() => {
    if (tab === "minha") return BOOKS.filter((b) => statuses[b.id]);
    return BOOKS;
  }, [tab, statuses]);

  const filteredBooks = useMemo(() => {
    return baseBooks.filter((book) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.description.toLowerCase().includes(q);
      const matchesCategory = category === "todos" || book.category === category;
      const matchesEra = era === "todos" || book.era === era;
      const matchesNationality =
        nationality === "todos" || book.nationality === nationality;
      const matchesStatus =
        tab !== "minha" ||
        statusFilter === "todos" ||
        statuses[book.id] === statusFilter;
      return (
        matchesSearch &&
        matchesCategory &&
        matchesEra &&
        matchesNationality &&
        matchesStatus
      );
    });
  }, [baseBooks, search, category, era, nationality, statusFilter, statuses, tab]);

  const lidos = useMemo(
    () => Object.values(statuses).filter((s) => s === "lido").length,
    [statuses],
  );
  const lendo = useMemo(
    () => Object.values(statuses).filter((s) => s === "lendo").length,
    [statuses],
  );

  const activeFiltersCount =
    (category !== "todos" ? 1 : 0) +
    (era !== "todos" ? 1 : 0) +
    (nationality !== "todos" ? 1 : 0);

  const clearFilters = () => {
    setCategory("todos");
    setEra("todos");
    setNationality("todos");
  };

  return (
    <AppShell>
      <div className="flex flex-col min-h-screen pb-24 bg-white">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-[#DADCE0] px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Link href="/home" className="p-1 -ml-1">
                <ChevronLeft className="w-5 h-5 text-[#5F6368]" />
              </Link>
              <h1 className="text-lg font-semibold text-[#202124] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#1A73E8]" />
                Biblioteca
              </h1>
            </div>
            {lidos > 0 && (
              <span className="text-xs text-[#5F6368]">
                {lidos} lido{lidos > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-[#F1F3F4] p-1 rounded-full">
            <button
              onClick={() => setTab("catalogo")}
              className={`flex-1 py-2 rounded-full text-xs font-semibold transition-colors ${
                tab === "catalogo"
                  ? "bg-white text-[#1A73E8] shadow-sm"
                  : "text-[#5F6368]"
              }`}
            >
              Catálogo · {BOOKS.length}
            </button>
            <button
              onClick={() => setTab("minha")}
              className={`flex-1 py-2 rounded-full text-xs font-semibold transition-colors ${
                tab === "minha"
                  ? "bg-white text-[#1A73E8] shadow-sm"
                  : "text-[#5F6368]"
              }`}
            >
              Minha Biblioteca · {myBookIds.length}
            </button>
          </div>
        </header>

        <div className="flex flex-col gap-4 px-4 pt-4">
          {/* Hero — só no catálogo */}
          {tab === "catalogo" && (
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
                  <div className="text-[10px] text-[#5F6368]">No catálogo</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-[#34A853]">{lidos}</div>
                  <div className="text-[10px] text-[#5F6368]">Lidos</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-[#FBBC04]">
                    {totalMinutesRead}
                  </div>
                  <div className="text-[10px] text-[#5F6368]">Min lidos</div>
                </div>
              </div>
            </motion.section>
          )}

          {/* Resumo "Minha Biblioteca" */}
          {tab === "minha" && myBookIds.length > 0 && (
            <motion.section
              custom={0}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-4 gap-2"
            >
              {STATUS_ORDER.map((s) => {
                const count = Object.values(statuses).filter(
                  (v) => v === s,
                ).length;
                const Icon = STATUS_ICONS[s];
                const colors = STATUS_COLORS[s];
                const isActive = statusFilter === s;
                return (
                  <button
                    key={s}
                    onClick={() =>
                      setStatusFilter(isActive ? "todos" : s)
                    }
                    className={`flex flex-col items-center justify-center py-3 rounded-xl border transition-all ${
                      isActive
                        ? "border-[#1A73E8] shadow-sm"
                        : "border-[#DADCE0]"
                    }`}
                    style={{ backgroundColor: colors.bg }}
                  >
                    <Icon
                      className="w-4 h-4 mb-1"
                      style={{ color: colors.fg }}
                    />
                    <span
                      className="text-base font-bold leading-none"
                      style={{ color: colors.fg }}
                    >
                      {count}
                    </span>
                    <span
                      className="text-[9px] mt-0.5"
                      style={{ color: colors.fg }}
                    >
                      {STATUS_LABELS[s]}
                    </span>
                  </button>
                );
              })}
            </motion.section>
          )}

          {/* Search */}
          <motion.div
            custom={1}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9AA0A6]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar título, autor..."
                className="w-full pl-11 pr-4 py-3 rounded-full bg-[#F1F3F4] border border-transparent text-sm text-[#202124] outline-none focus:bg-white focus:border-[#1A73E8]/30"
              />
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-colors ${
                showFilters || activeFiltersCount > 0
                  ? "bg-[#1A73E8] text-white"
                  : "bg-[#F1F3F4] text-[#5F6368]"
              }`}
            >
              <Filter className="w-4 h-4" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#EA4335] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </motion.div>

          {/* Filtros */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-2xl border border-[#DADCE0] p-4 bg-[#FAFAFA] flex flex-col gap-3">
                  {/* Origem */}
                  <div>
                    <p className="text-[10px] font-bold tracking-wider text-[#9AA0A6] uppercase mb-2">
                      Origem
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(["todos", "br", "pt", "int"] as const).map((n) => (
                        <button
                          key={n}
                          onClick={() => setNationality(n)}
                          className={`px-3 py-1 rounded-full text-[11px] font-medium ${
                            nationality === n
                              ? "bg-[#1A73E8] text-white"
                              : "bg-white border border-[#DADCE0] text-[#5F6368]"
                          }`}
                        >
                          {NATIONALITY_LABELS[n]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Categoria */}
                  <div>
                    <p className="text-[10px] font-bold tracking-wider text-[#9AA0A6] uppercase mb-2">
                      Categoria
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setCategory("todos")}
                        className={`px-3 py-1 rounded-full text-[11px] font-medium ${
                          category === "todos"
                            ? "bg-[#1A73E8] text-white"
                            : "bg-white border border-[#DADCE0] text-[#5F6368]"
                        }`}
                      >
                        Todas
                      </button>
                      {(Object.keys(CATEGORY_LABELS) as BookCategory[]).map(
                        (c) => (
                          <button
                            key={c}
                            onClick={() => setCategory(c)}
                            className={`px-3 py-1 rounded-full text-[11px] font-medium ${
                              category === c
                                ? "bg-[#1A73E8] text-white"
                                : "bg-white border border-[#DADCE0] text-[#5F6368]"
                            }`}
                          >
                            {CATEGORY_LABELS[c]}
                          </button>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Era */}
                  <div>
                    <p className="text-[10px] font-bold tracking-wider text-[#9AA0A6] uppercase mb-2">
                      Estilo
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setEra("todos")}
                        className={`px-3 py-1 rounded-full text-[11px] font-medium ${
                          era === "todos"
                            ? "bg-[#1A73E8] text-white"
                            : "bg-white border border-[#DADCE0] text-[#5F6368]"
                        }`}
                      >
                        Todos
                      </button>
                      {(Object.keys(ERA_LABELS) as BookEra[]).map((e) => (
                        <button
                          key={e}
                          onClick={() => setEra(e)}
                          className={`px-3 py-1 rounded-full text-[11px] font-medium ${
                            era === e
                              ? "bg-[#1A73E8] text-white"
                              : "bg-white border border-[#DADCE0] text-[#5F6368]"
                          }`}
                        >
                          {ERA_LABELS[e]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-[11px] text-[#1A73E8] font-semibold self-end"
                    >
                      Limpar filtros
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Books Grid */}
          <motion.div
            custom={3}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-3"
          >
            {filteredBooks.map((book, i) => {
              const status = statuses[book.id];
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
                    {status && (
                      <div
                        className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold"
                        style={{
                          backgroundColor: STATUS_COLORS[status].bg,
                          color: STATUS_COLORS[status].fg,
                        }}
                      >
                        {STATUS_LABELS[status]}
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md bg-white/80 text-[9px] font-semibold text-[#5F6368]">
                      {book.nationality === "br"
                        ? "🇧🇷"
                        : book.nationality === "pt"
                          ? "🇵🇹"
                          : "🌍"}
                    </div>
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
              <p className="text-sm text-[#9AA0A6]">
                {tab === "minha"
                  ? "Sua biblioteca está vazia. Adicione livros pelo catálogo."
                  : "Nenhum livro encontrado"}
              </p>
              {tab === "minha" && (
                <button
                  onClick={() => setTab("catalogo")}
                  className="mt-3 text-xs font-semibold text-[#1A73E8]"
                >
                  Explorar catálogo
                </button>
              )}
            </div>
          )}

          {/* Info card */}
          {tab === "catalogo" && (
            <div className="bg-[#F8F9FA] rounded-xl p-4 border border-[#DADCE0]">
              <p className="text-xs text-[#5F6368] leading-relaxed">
                💡 Todos os livros são de <strong>domínio público</strong> e os
                textos completos estão disponíveis no{" "}
                <a
                  href="https://pt.m.wikisource.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1A73E8] underline"
                >
                  Wikisource
                </a>
                .
              </p>
            </div>
          )}
        </div>

        {/* Detalhes do livro — Modal */}
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
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-0.5 rounded-full bg-[#F1F3F4] text-[10px] font-medium text-[#5F6368]">
                      {CATEGORY_LABELS[selectedBook.category]}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#F1F3F4] text-[10px] font-medium text-[#5F6368]">
                      {ERA_LABELS[selectedBook.era]}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#F1F3F4] text-[10px] font-medium text-[#5F6368]">
                      {selectedBook.nationality === "br"
                        ? "🇧🇷 Brasil"
                        : selectedBook.nationality === "pt"
                          ? "🇵🇹 Portugal"
                          : "🌍 Internacional"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold tracking-wider text-[#9AA0A6] uppercase">
                      Sinopse
                    </span>
                  </div>
                  <p className="text-sm text-[#5F6368] leading-relaxed mb-6">
                    {selectedBook.description}
                  </p>

                  {/* Controles de áudio (TTS) — narra a sinopse */}
                  {ttsSupported && (
                    <div className="mb-4">
                      {!isPlaying ? (
                        <button
                          onClick={() =>
                            speakDescription(selectedBook.description)
                          }
                          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#E8F0FE] text-[#1A73E8] text-sm font-semibold"
                        >
                          <Volume2 className="w-4 h-4" />
                          Ouvir sinopse
                        </button>
                      ) : (
                        <div className="flex gap-2">
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
                    onClick={() => {
                      // Quem clica "ler" automaticamente entra como "lendo"
                      if (statuses[selectedBook.id] !== "lido") {
                        setBookStatus(selectedBook, "lendo");
                      }
                    }}
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
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-[#A142F4] text-[#A142F4] text-sm font-medium mb-4"
                  >
                    <Headphones className="w-4 h-4" />
                    Buscar audiolivro no YouTube
                  </a>

                  {/* Status grid */}
                  <div className="mb-3">
                    <p className="text-[10px] font-bold tracking-wider text-[#9AA0A6] uppercase mb-2">
                      Adicionar à minha biblioteca
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {STATUS_ORDER.map((s) => {
                        const Icon = STATUS_ICONS[s];
                        const isActive = statuses[selectedBook.id] === s;
                        const colors = STATUS_COLORS[s];
                        return (
                          <button
                            key={s}
                            onClick={() => setBookStatus(selectedBook, s)}
                            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                              isActive
                                ? "border-[#1A73E8] shadow-sm"
                                : "border-[#DADCE0]"
                            }`}
                            style={{
                              backgroundColor: isActive ? colors.bg : "#FFFFFF",
                              color: isActive ? colors.fg : "#5F6368",
                            }}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            {STATUS_LABELS[s]}
                            {isActive && <Check className="w-3 h-3" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {statuses[selectedBook.id] && (
                    <button
                      onClick={() => removeFromLibrary(selectedBook.id)}
                      className="w-full text-[11px] text-[#EA4335] font-medium py-2"
                    >
                      Remover da minha biblioteca
                    </button>
                  )}

                  <p className="text-[10px] text-[#9AA0A6] text-center mt-2">
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
