"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, ExternalLink, AlertTriangle, Loader2 } from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import { BOOKS, type Book } from "@/lib/library/books";

function LeitorContent() {
  const router = useRouter();
  const params = useSearchParams();
  const bookId = params.get("id");

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (bookId) {
      const found = BOOKS.find((b) => b.id === bookId);
      if (found) setBook(found);
    }
  }, [bookId]);

  if (!book) {
    return (
      <div className="flex flex-col min-h-screen bg-white items-center justify-center">
        <p className="text-sm text-[#5F6368]">Livro não encontrado.</p>
        <button
          onClick={() => router.push("/biblioteca")}
          className="mt-4 text-sm text-[#1A73E8]"
        >
          Voltar à biblioteca
        </button>
      </div>
    );
  }

  // Google Docs viewer envolve o PDF e renderiza dentro do iframe
  // É a forma mais confiável de mostrar PDF dentro de WebView Android
  const pdfUrl = book.sourceUrl;
  const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-[#DADCE0] px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/biblioteca")}
            className="p-1 -ml-1"
          >
            <ChevronLeft className="w-5 h-5 text-[#5F6368]" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-[#202124] truncate">
              {book.title}
            </h1>
            <p className="text-[10px] text-[#9AA0A6] truncate">
              {book.author} · {book.year}
            </p>
          </div>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-[#5F6368]"
            title="Abrir no navegador"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* Loading */}
      {loading && !error && (
        <div className="absolute inset-0 top-14 flex flex-col items-center justify-center bg-white z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-10 h-10 text-[#1A73E8]" />
          </motion.div>
          <p className="text-sm text-[#5F6368] mt-4">Carregando livro...</p>
          <p className="text-[10px] text-[#9AA0A6] mt-1">
            Pode demorar alguns segundos
          </p>
        </div>
      )}

      {/* Error fallback */}
      {error && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <AlertTriangle className="w-12 h-12 text-[#FBBC04] mb-4" />
          <h2 className="text-base font-semibold text-[#202124] mb-2 text-center">
            Não foi possível abrir o livro
          </h2>
          <p className="text-sm text-[#5F6368] text-center mb-6 max-w-xs">
            O leitor interno não conseguiu carregar este PDF. Você pode abri-lo
            no navegador.
          </p>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1A73E8] text-white text-sm font-semibold"
          >
            <ExternalLink className="w-4 h-4" />
            Abrir no navegador
          </a>
        </div>
      )}

      {/* PDF Viewer */}
      {!error && (
        <iframe
          src={viewerUrl}
          className="flex-1 w-full border-0"
          style={{ minHeight: "calc(100vh - 56px)" }}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
          title={book.title}
          allow="fullscreen"
        />
      )}
    </div>
  );
}

export default function LeitorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-white">
          <Loader2 className="w-8 h-8 text-[#1A73E8] animate-spin" />
        </div>
      }
    >
      <LeitorContent />
    </Suspense>
  );
}
