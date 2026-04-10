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

  // Gradient: blue at 0% → green at 100%
  const gradientId = `vitascore-gradient-${size}`;
  const isHigh = clampedScore > 700;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{
        width: size,
        height: size,
        ...(isHigh
          ? {
              filter: "drop-shadow(0 0 40px rgba(24,119,242,0.3))",
            }
          : {}),
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
            <stop offset="0%" stopColor="#1877F2" />
            <stop offset="100%" stopColor="#30D158" />
          </linearGradient>
        </defs>

        {/* Background ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#2C2C2E"
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
          style={{ fontSize: size * 0.22 }}
        >
          {animated ? "0" : clampedScore}
        </span>
        <span
          className="text-muted-foreground font-mono-score"
          style={{ fontSize: size * 0.08 }}
        >
          /1000
        </span>
      </div>
    </div>
  );
}
