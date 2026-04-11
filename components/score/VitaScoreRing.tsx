"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface VitaScoreRingProps {
  score: number;
  size?: number;
  animated?: boolean;
}

export function VitaScoreRing({
  score,
  size = 200,
  animated = true,
}: VitaScoreRingProps) {
  const strokeWidth = size * 0.06;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const clampedScore = Math.max(0, Math.min(1000, score));
  const progress = clampedScore / 1000;

  // Animated counter
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1500, bounce: 0 });
  const displayScore = useTransform(spring, (v) => Math.round(v));
  const counterRef = useRef<HTMLSpanElement>(null);

  // Animated stroke offset
  const strokeMotion = useMotionValue(circumference);
  const strokeSpring = useSpring(strokeMotion, { duration: 1500, bounce: 0 });

  useEffect(() => {
    if (animated) {
      motionValue.set(clampedScore);
      strokeMotion.set(circumference * (1 - progress));
    } else {
      motionValue.jump(clampedScore);
      strokeMotion.jump(circumference * (1 - progress));
    }
  }, [animated, clampedScore, circumference, motionValue, progress, strokeMotion]);

  // Update counter text
  useEffect(() => {
    const unsubscribe = displayScore.on("change", (v) => {
      if (counterRef.current) {
        counterRef.current.textContent = String(v);
      }
    });
    return unsubscribe;
  }, [displayScore]);

  // Gradient: Google blue → teal
  const gradientId = `vitascore-gradient-${size}`;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{
        width: size,
        height: size,
        filter: "drop-shadow(0 2px 8px rgba(26,115,232,0.15))",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg]"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1A73E8" />
            <stop offset="100%" stopColor="#00897B" />
          </linearGradient>
        </defs>

        {/* Background ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#E8F0FE"
          strokeWidth={strokeWidth}
        />

        {/* Foreground ring */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: strokeSpring }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          ref={counterRef}
          className="font-mono-score leading-none"
          style={{ fontSize: size * 0.22, color: "#202124" }}
        >
          {animated ? "0" : clampedScore}
        </span>
        <span
          className="font-mono-score"
          style={{ fontSize: size * 0.08, color: "#5F6368" }}
        >
          /1000
        </span>
      </div>
    </div>
  );
}
