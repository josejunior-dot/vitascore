"use client";

import { motion } from "framer-motion";
import { Footprints } from "lucide-react";
import Link from "next/link";

interface ActivityCardProps {
  steps: number;
  goal: number;
  km: number;
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
        stroke="#E8F0FE"
        strokeWidth="4"
      />
      <motion.circle
        cx="22"
        cy="22"
        r={radius}
        fill="none"
        stroke="#34A853"
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

export default function ActivityCard({ steps, goal, km }: ActivityCardProps) {
  const progress = goal > 0 ? steps / goal : 0;

  return (
    <Link href="/atividade">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
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
              style={{ background: "rgba(52,168,83,0.1)" }}
            >
              <Footprints size={18} color="#34A853" />
            </div>
            <div>
              <p
                className="text-xs font-medium"
                style={{ color: "#5F6368" }}
              >
                Atividade
              </p>
              <p className="text-base font-semibold" style={{ color: "#202124" }}>
                {steps.toLocaleString("pt-BR")}{" "}
                <span
                  className="text-xs font-normal"
                  style={{ color: "#5F6368" }}
                >
                  / {goal.toLocaleString("pt-BR")} passos
                </span>
              </p>
              <p
                className="text-xs"
                style={{ color: "#5F6368" }}
              >
                {km.toFixed(1)} km
              </p>
            </div>
          </div>
          <MiniRing progress={progress} />
        </div>
      </motion.div>
    </Link>
  );
}
