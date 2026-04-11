"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScoreCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function ScoreCounter({
  value,
  duration = 1.5,
  prefix,
  suffix,
  className,
}: ScoreCounterProps) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  });
  const display = useTransform(spring, (v) =>
    Math.round(v).toLocaleString("pt-BR")
  );
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    motionValue.set(value);
  }, [motionValue, value]);

  useEffect(() => {
    const unsubscribe = display.on("change", (v) => {
      if (ref.current) {
        ref.current.textContent = v;
      }
    });
    return unsubscribe;
  }, [display]);

  return (
    <span className={cn("font-mono-score text-[#202124]", className)}>
      {prefix}
      <span ref={ref}>0</span>
      {suffix}
    </span>
  );
}
