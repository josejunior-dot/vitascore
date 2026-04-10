"use client";

import { motion } from "framer-motion";
import { Moon } from "lucide-react";
import Link from "next/link";

interface SleepCardProps {
  hours: number;
  minutes: number;
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
        stroke="#BF5AF2"
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

export default function SleepCard({ hours, minutes, goal }: SleepCardProps) {
  const totalHours = hours + minutes / 60;
  const progress = goal > 0 ? totalHours / goal : 0;

  return (
    <Link href="/sono">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
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
              style={{ background: "rgba(191,90,242,0.15)" }}
            >
              <Moon size={18} color="#BF5AF2" />
            </div>
            <div>
              <p
                className="text-xs font-medium"
                style={{ color: "rgba(235,235,245,0.6)" }}
              >
                Sono
              </p>
              <p className="text-base font-semibold text-white">
                {hours}h {minutes.toString().padStart(2, "0")}m
              </p>
              <p
                className="text-xs"
                style={{ color: "rgba(235,235,245,0.6)" }}
              >
                Meta: {goal}h
              </p>
            </div>
          </div>
          <MiniRing progress={progress} />
        </div>
      </motion.div>
    </Link>
  );
}
