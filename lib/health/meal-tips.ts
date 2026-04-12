/**
 * Gera dicas de como equilibrar uma refeição com base na análise por IA.
 * Tudo determinístico e client-side — zero custo de token.
 */

import type { MealPhotoAnalysis } from "./meal-analyzer";

export interface BalanceTip {
  text: string;
  icon: "plus" | "swap" | "reduce" | "water";
  scoreGain: number; // quanto o score subiria se o usuário seguisse a dica
}

export interface BalancePrediction {
  tips: BalanceTip[];
  projectedScore: number; // soma limitada a 95 se todas as dicas forem aplicadas
}

export function generateBalanceTips(
  analysis: MealPhotoAnalysis,
): BalancePrediction {
  const tips: BalanceTip[] = [];

  // Faltam verduras / legumes
  if (!analysis.hasVegetables) {
    tips.push({
      text: "Adicione salada verde, legumes ou verduras",
      icon: "plus",
      scoreGain: 12,
    });
  }

  // Falta proteína
  if (!analysis.hasProtein) {
    tips.push({
      text: "Inclua uma fonte de proteína magra (ovo, frango, peixe, feijão)",
      icon: "plus",
      scoreGain: 10,
    });
  }

  // Carboidrato refinado em vez de integral
  if (!analysis.hasWholeGrains && !analysis.hasFruit) {
    tips.push({
      text: "Troque o carboidrato por uma versão integral (arroz integral, aveia)",
      icon: "swap",
      scoreGain: 8,
    });
  }

  // Fritura
  if (analysis.isDeepFried) {
    tips.push({
      text: "Prefira grelhado, assado ou cozido em vez de frito",
      icon: "swap",
      scoreGain: 10,
    });
  }

  // Ultraprocessado
  if (analysis.isProcessed) {
    tips.push({
      text: "Substitua o molho industrializado por tempero caseiro",
      icon: "swap",
      scoreGain: 10,
    });
  }

  // Porção grande
  if (analysis.portionSize === "large") {
    tips.push({
      text: "Reduza a porção — prato menor ajusta a saciedade",
      icon: "reduce",
      scoreGain: 4,
    });
  }

  // Bebida
  if (analysis.hydration === "soda") {
    tips.push({
      text: "Troque refrigerante por água ou suco natural sem açúcar",
      icon: "water",
      scoreGain: 8,
    });
  } else if (analysis.hydration === "juice") {
    tips.push({
      text: "Prefira água ao suco — menos açúcar e mais hidratação",
      icon: "water",
      scoreGain: 4,
    });
  } else if (
    analysis.hydration === "unknown" ||
    analysis.hydration === "none"
  ) {
    tips.push({
      text: "Beba água junto com a refeição",
      icon: "water",
      scoreGain: 3,
    });
  }

  // Se já for uma refeição equilibrada, só dá mensagem positiva
  if (tips.length === 0) {
    return { tips: [], projectedScore: analysis.mealScore };
  }

  const totalGain = tips.reduce((sum, t) => sum + t.scoreGain, 0);
  const projectedScore = Math.min(95, analysis.mealScore + totalGain);

  return { tips, projectedScore };
}

export function getEncouragement(score: number): string {
  if (score >= 85) return "Refeição excelente! Continue assim.";
  if (score >= 70) return "Boa refeição. Pequenos ajustes podem melhorar ainda mais.";
  if (score >= 50) return "Refeição mediana. Dá pra equilibrar melhor.";
  if (score >= 30) return "Refeição desequilibrada. Veja as dicas abaixo.";
  return "Essa refeição pode ser melhorada bastante. Confira as sugestões.";
}
