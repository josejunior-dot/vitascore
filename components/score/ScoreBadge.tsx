"use client";

import { motion } from "framer-motion";

type BadgeStatus = "bronze" | "silver" | "gold" | "platinum";

interface ScoreBadgeProps {
  status: BadgeStatus;
}

const config: Record<
  BadgeStatus,
  { bg: string; text: string; emoji: string; label: string }
> = {
  bronze: { bg: "#F5E6D3", text: "#8B5E34", emoji: "\u{1F949}", label: "Bronze" },
  silver: { bg: "#E8E8E8", text: "#5F6368", emoji: "\u{1F948}", label: "Prata" },
  gold: { bg: "#FEF3CD", text: "#8B6914", emoji: "\u{1F3C6}", label: "Ouro" },
  platinum: { bg: "#E8F0FE", text: "#1A73E8", emoji: "\u{1F48E}", label: "Platina" },
};

export function ScoreBadge({ status }: ScoreBadgeProps) {
  const { bg, text, emoji, label } = config[status];

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium"
      style={{
        backgroundColor: bg,
        color: text,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      <span>{emoji}</span>
      {label}
    </motion.span>
  );
}
