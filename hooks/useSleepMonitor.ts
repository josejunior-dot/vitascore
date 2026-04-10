"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  SleepMonitor,
  type SleepVerification,
} from "@/lib/health/sleep-monitor";

export function useSleepMonitor() {
  const monitorRef = useRef<SleepMonitor | null>(null);
  const [collecting, setCollecting] = useState(false);
  const [lastVerification, setLastVerification] = useState<SleepVerification | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzed, setAnalyzed] = useState(false);

  useEffect(() => {
    const init = async () => {
      const monitor = new SleepMonitor();
      monitorRef.current = monitor;

      // 1. Buscar verificação já existente de hoje
      const existing = await SleepMonitor.getLastVerification();
      if (existing) {
        setLastVerification(existing);
        setAnalyzed(true);
      }

      // 2. Iniciar coleta passiva (automática, sem ação do usuário)
      const started = await monitor.startPassiveCollection();
      setCollecting(started);

      // 3. Se não tem verificação de hoje, tentar detectar sono da noite passada
      if (!existing) {
        const detected = await monitor.analyzeLastNight();
        if (detected) {
          setLastVerification(detected);
        }
        setAnalyzed(true);
      }

      setLoading(false);
    };
    init();

    return () => {
      monitorRef.current?.stop();
    };
  }, []);

  // Registro manual (fallback — score de confiança menor)
  const registerManual = useCallback(
    async (bedtime: string, wakeTime: string) => {
      if (!monitorRef.current) return null;
      const verification = await monitorRef.current.registerManual(bedtime, wakeTime);
      setLastVerification(verification);
      return verification;
    },
    []
  );

  // Re-analisar (forçar nova detecção)
  const reanalyze = useCallback(async () => {
    if (!monitorRef.current) return null;
    const detected = await monitorRef.current.analyzeLastNight();
    if (detected) setLastVerification(detected);
    return detected;
  }, []);

  return {
    collecting,       // coleta passiva ativa?
    lastVerification, // resultado da verificação de hoje
    loading,
    analyzed,         // já tentou analisar?
    registerManual,   // fallback manual
    reanalyze,        // forçar nova análise
  };
}
