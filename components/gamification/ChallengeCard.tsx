"use client";

import { motion } from "framer-motion";

interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  reward: number;
  daysLeft: number;
  color: string;
  icon: string;
}

interface ChallengeCardProps {
  challenge: Challenge;
}

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  const { title, description, progress, total, reward, daysLeft, color, icon } =
    challenge;
  const progressPercent = Math.min((progress / total) * 100, 100);

  return (
    <motion.div
      className="rounded-2xl p-4"
      style={{
        backgroundColor: "#1C1C1E",
        borderLeft: `4px solid ${color}`,
        border: `1px solid rgba(255,255,255,0.08)`,
        borderLeftColor: color,
        borderLeftWidth: 4,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="text-xs text-white/50 mt-0.5 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-white/70">
            {progress}/{total} dias
          </span>
          <span className="text-xs font-semibold" style={{ color }}>
            +{reward} pts
          </span>
        </div>

        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          />
        </div>
      </div>

      {daysLeft > 0 && (
        <p className="text-xs text-white/40 mt-2">
          {daysLeft} {daysLeft === 1 ? "dia restante" : "dias restantes"}
        </p>
      )}
    </motion.div>
  );
}
