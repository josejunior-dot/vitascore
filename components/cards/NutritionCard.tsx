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
        stroke="#FEF3E0"
        strokeWidth="4"
      />
      <motion.circle
        cx="22"
        cy="22"
        r={radius}
        fill="none"
        stroke="#F9AB00"
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
        fill="#202124"
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
          background: "#FFFFFF",
          border: "1px solid #DADCE0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: "rgba(249,171,0,0.1)" }}
            >
              <UtensilsCrossed size={18} color="#F9AB00" />
            </div>
            <div>
              <p
                className="text-xs font-medium"
                style={{ color: "#5F6368" }}
              >
                Nutricao
              </p>
              <p className="text-base font-semibold" style={{ color: "#202124" }}>
                {current}/{goal}{" "}
                <span
                  className="text-xs font-normal"
                  style={{ color: "#5F6368" }}
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
