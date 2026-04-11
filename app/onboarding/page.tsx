"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { Heart, Activity, Moon, Trophy, User } from "lucide-react";
import { saveUserProfile } from "@/lib/user-profile";

const TOTAL_SLIDES = 4;
const SWIPE_THRESHOLD = 50;

/* eslint-disable @typescript-eslint/no-explicit-any */
const slideVariants: any = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

const slideTransition: any = {
  x: { type: "spring", stiffness: 300, damping: 30 },
  opacity: { duration: 0.2 },
};

function DotIndicators({
  current,
  total,
  onDotClick,
}: {
  current: number;
  total: number;
  onDotClick: (index: number) => void;
}) {
  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          aria-label={`Ir para slide ${i + 1}`}
          className="p-1"
        >
          <motion.div
            className="rounded-full"
            animate={{
              width: i === current ? 24 : 8,
              height: 8,
              backgroundColor: i === current ? "#1A73E8" : "#DADCE0",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          />
        </button>
      ))}
    </div>
  );
}

function SlideHero() {
  return (
    <div
      className="flex flex-col items-center justify-center h-full px-8 text-center"
      style={{
        background: "linear-gradient(135deg, #1A73E8 0%, #0052CC 50%, #003D99 100%)",
      }}
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="mb-8"
      >
        <Heart className="w-20 h-20 text-white fill-white" />
      </motion.div>

      <h1
        className="text-4xl font-extrabold text-white mb-4"
        style={{ fontFamily: "var(--font-display, 'Outfit', sans-serif)" }}
      >
        Viva melhor. Pague menos.
      </h1>

      <p className="text-base text-white/80 max-w-xs leading-relaxed">
        Seu estilo de vida saud&aacute;vel gera descontos reais na sua ap&oacute;lice de seguro.
      </p>
    </div>
  );
}

const cards = [
  { icon: Activity, label: "Movimento", points: "+120 pts", color: "#1A73E8" },
  { icon: Moon, label: "Sono", points: "+80 pts", color: "#A855F7" },
  { icon: Heart, label: "Sa\u00fade", points: "+100 pts", color: "#22C55E" },
  { icon: Trophy, label: "Engajamento", points: "+50 pts", color: "#F59E0B" },
];

function SlideComoFunciona() {
  return (
    <div className="flex flex-col h-full px-6 pt-16 pb-8" style={{ background: "#FFFFFF" }}>
      <h2
        className="text-3xl font-extrabold text-[#202124] mb-8 text-center"
        style={{ fontFamily: "var(--font-display, 'Outfit', sans-serif)" }}
      >
        Como funciona
      </h2>

      <div className="flex flex-col gap-4 flex-1 justify-center">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.4, ease: "easeOut" }}
              className="flex items-center gap-4 rounded-2xl px-5 py-4"
              style={{ backgroundColor: "#F8F9FA" }}
            >
              <div
                className="flex items-center justify-center w-12 h-12 rounded-xl"
                style={{ backgroundColor: `${card.color}20` }}
              >
                <Icon className="w-6 h-6" style={{ color: card.color }} />
              </div>
              <div className="flex-1">
                <p className="text-[#202124] font-semibold text-base">{card.label}</p>
              </div>
              <span className="text-sm font-bold" style={{ color: card.color }}>
                {card.points}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function SlideApolice() {
  return (
    <div
      className="flex flex-col items-center justify-center h-full px-8 text-center"
      style={{ background: "#FFFFFF" }}
    >
      <motion.p
        className="text-5xl font-extrabold text-[#202124] mb-6"
        style={{ fontFamily: "var(--font-display, 'Outfit', sans-serif)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        At&eacute; <span style={{ color: "#1A73E8" }}>15%</span> de desconto
      </motion.p>

      {/* Progress bar */}
      <div className="w-full max-w-xs h-3 rounded-full overflow-hidden mb-6" style={{ backgroundColor: "#F8F9FA" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #1A73E8, #0052CC)" }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        />
      </div>

      <div className="flex justify-between w-full max-w-xs mb-8 text-sm text-[#5F6368]">
        <span>0%</span>
        <span className="font-bold text-[#202124]">15%</span>
      </div>

      <p className="text-base text-[#5F6368] max-w-xs leading-relaxed">
        Quanto mais h&aacute;bitos, maior o desconto na renova&ccedil;&atilde;o.
      </p>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  function goToSlide(index: number) {
    if (index < 0 || index >= TOTAL_SLIDES || index === currentSlide) return;
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -SWIPE_THRESHOLD && currentSlide < TOTAL_SLIDES - 1) {
      goToSlide(currentSlide + 1);
    } else if (info.offset.x > SWIPE_THRESHOLD && currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  }

  const [userName, setUserName] = useState("");
  const [userAge, setUserAge] = useState("");

  function handleCTA() {
    if (currentSlide < TOTAL_SLIDES - 1) {
      goToSlide(currentSlide + 1);
    }
  }

  async function handleFinish() {
    if (!userName.trim()) return;
    await saveUserProfile({
      name: userName.trim(),
      age: parseInt(userAge) || 0,
      onboarded: true,
    });
    localStorage.setItem("vitascore-onboarded", "true");
    router.push("/home");
  }

  return (
    <div className="fixed inset-0 overflow-hidden select-none" style={{ background: "#FFFFFF" }}>
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={slideTransition}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
          className="absolute inset-0"
        >
          {currentSlide === 0 && <SlideHero />}
          {currentSlide === 1 && <SlideComoFunciona />}
          {currentSlide === 2 && <SlideApolice />}
          {currentSlide === 3 && (
            <div className="flex flex-col items-center justify-center h-full px-8" style={{ background: "#FFFFFF" }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 rounded-full bg-[#1A73E8]/20 flex items-center justify-center mb-6"
              >
                <User className="w-10 h-10 text-[#1A73E8]" />
              </motion.div>

              <h2 className="text-2xl font-bold text-[#202124] mb-2" style={{ fontFamily: "var(--font-display, 'Outfit', sans-serif)" }}>
                Como podemos te chamar?
              </h2>
              <p className="text-sm text-[#5F6368] mb-8 text-center">
                Seus dados ficam apenas no seu celular.
              </p>

              <input
                type="text"
                placeholder="Seu nome"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full max-w-xs bg-[#F8F9FA] border border-[#DADCE0] rounded-2xl px-5 py-4 text-[#202124] text-center text-lg outline-none focus:border-[#1A73E8]/50 placeholder:text-[#DADCE0] mb-4"
                autoFocus
              />

              <input
                type="number"
                placeholder="Sua idade"
                value={userAge}
                onChange={(e) => setUserAge(e.target.value)}
                className="w-full max-w-xs bg-[#F8F9FA] border border-[#DADCE0] rounded-2xl px-5 py-4 text-[#202124] text-center text-lg outline-none focus:border-[#1A73E8]/50 placeholder:text-[#DADCE0] mb-8"
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 pb-10 pt-4 px-8 flex flex-col items-center gap-6 z-10">
        <DotIndicators current={currentSlide} total={TOTAL_SLIDES} onDotClick={goToSlide} />

        {currentSlide < 3 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={handleCTA}
            className="w-full max-w-xs py-4 rounded-full font-bold text-base transition-transform active:scale-95"
            style={
              currentSlide === 0
                ? { backgroundColor: "#ffffff", color: "#1A73E8" }
                : { backgroundColor: "#1A73E8", color: "#ffffff" }
            }
          >
            {currentSlide === 0 ? "Começar agora" : currentSlide === 1 ? "Continuar" : "Próximo"}
          </motion.button>
        )}

        {currentSlide === 3 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={handleFinish}
            disabled={!userName.trim()}
            className="w-full max-w-xs py-4 rounded-full font-bold text-base transition-transform active:scale-95 disabled:opacity-40"
            style={{ backgroundColor: "#1A73E8", color: "#ffffff" }}
          >
            Entrar no VitaScore
          </motion.button>
        )}
      </div>
    </div>
  );
}
