"use client";

import { motion } from "framer-motion";

type BadgeStatus = "bronze" | "silver" | "gold" | "platinum";

interface ScoreBadgeProps {
  status: BadgeStatus;
}

const config: Record<
  BadgeStatus,
  { color: string; emoji: string; label: string }
> = {
  bronze: { color: "#CD7F32", emoji: "\u{1F949}", label: "Bronze" },
  silver: { color: "#C0C0C0", emoji: "\u{1F948}", label: "Prata" },
  gold: { color: "#FFD60A", emoji: "\u{1F3C6}", label: "Ouro" },
  platinum: { color: "#E5E4E2", emoji: "\u{1F48E}", label: "Platina" },
};

export function ScoreBadge({ status }: ScoreBadgeProps) {
  const { color, emoji, label } = config[status];

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium"
      style={{
        backgroundColor: `${color}20`,
        color,
        boxShadow: `0 0 12px ${color}40`,
      }}
    >
      <span>{emoji}</span>
      {label}
    </motion.span>
  );
}
