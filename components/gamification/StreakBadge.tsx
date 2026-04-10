"use client";

import { motion } from "framer-motion";

interface StreakBadgeProps {
  days: number;
}

export default function StreakBadge({ days }: StreakBadgeProps) {
  const shouldPulse = days > 7;

  return (
    <motion.div
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5"
      style={{ background: "linear-gradient(135deg, #FF9F0A, #FF6723)" }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {shouldPulse ? (
        <motion.span
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          className="text-sm"
        >
          🔥
        </motion.span>
      ) : (
        <span className="text-sm">🔥</span>
      )}
      <span className="text-sm font-bold text-white">
        {days} {days === 1 ? "dia" : "dias"}
      </span>
    </motion.div>
  );
}
