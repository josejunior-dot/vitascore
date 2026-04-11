"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Achievement {
  name: string;
  icon: string;
}

interface AchievementToastProps {
  achievement: Achievement;
  visible: boolean;
  onClose: () => void;
}

export default function AchievementToast({
  achievement,
  visible,
  onClose,
}: AchievementToastProps) {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [visible, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-24 left-4 right-4 z-50 mx-auto max-w-sm"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div
            className="flex items-center gap-3 rounded-2xl px-4 py-3 shadow-lg"
            style={{
              backgroundColor: "rgba(255, 214, 10, 0.15)",
              border: "1px solid rgba(255, 214, 10, 0.3)",
              backdropFilter: "blur(20px)",
            }}
          >
            <span className="text-3xl">{achievement.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#FFD60A]">
                Conquista desbloqueada!
              </p>
              <p className="text-sm font-semibold text-[#202124] truncate">
                {achievement.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-[#5F6368] hover:text-[#202124] transition-colors p-1"
              aria-label="Fechar"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 4L12 12M12 4L4 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
