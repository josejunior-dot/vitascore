"use client";

import { motion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";
import Link from "next/link";

interface NutritionCardProps {
  current: number;
  goal: number;
}

function MiniRing({ progress }: { progress: number }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(progress, 1) * circumference);

  return (
    <svg width="44" height="44" viewBox="0 0 44 44">
      <circle
        cx="22"
        cy="22"
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="4"
      />
      <motion.circle
        cx="22"
        cy="22"
        r={radius}
        fill="none"
        stroke="#FF9F0A"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: "easeOut" }}
        transform="rotate(-90 22 22)"
      />
      <text
        x="22"
        y="23"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize="10"
        fontWeight="600"
      >
        {Math.round(progress * 100)}%
      </text>
    </svg>
  );
}

export default function NutritionCard({ current, goal }: NutritionCardProps) {
  const progress = goal > 0 ? current / goal : 0;

  return (
    <Link href="/nutricao">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="cursor-pointer rounded-2xl p-4"
        style={{
          background: "#1C1C1E",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: "rgba(255,159,10,0.15)" }}
            >
              <UtensilsCrossed size={18} color="#FF9F0A" />
            </div>
            <div>
              <p
                className="text-xs font-medium"
                style={{ color: "rgba(235,235,245,0.6)" }}
              >
                Nutricao
              </p>
              <p className="text-base font-semibold text-white">
                {current}/{goal}{" "}
                <span
                  className="text-xs font-normal"
                  style={{ color: "rgba(235,235,245,0.6)" }}
                >
                  check-ins
                </span>
              </p>
            </div>
          </div>
          <MiniRing progress={progress} />
        </div>
      </motion.div>
    </Link>
  );
}
