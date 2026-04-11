// Copay (Coparticipação) Discount System based on VitaScore
// Higher score = lower copay — direct financial incentive

export interface CopayDiscount {
  scoreRange: string;
  discountPercent: number;
  label: string;
  color: string;
}

export interface CopaySimulation {
  procedureName: string;
  originalCopay: number;
  discountPercent: number;
  discountAmount: number;
  finalCopay: number;
}

export interface UserCopayProfile {
  currentScore: number;
  currentDiscount: CopayDiscount;
  nextTier: CopayDiscount | null;
  pointsToNextTier: number;
  monthlySavings: number;
  annualSavings: number;
  simulations: CopaySimulation[];
}

const DISCOUNT_TIERS: CopayDiscount[] = [
  { scoreRange: "850-1000", discountPercent: 30, label: "Platina", color: "#1A73E8" },
  { scoreRange: "600-849", discountPercent: 20, label: "Ouro", color: "#FBBC04" },
  { scoreRange: "300-599", discountPercent: 10, label: "Prata", color: "#9AA0A6" },
  { scoreRange: "0-299", discountPercent: 0, label: "Bronze", color: "#EA4335" },
];

const COMMON_PROCEDURES = [
  { name: "Consulta médica", copay: 50 },
  { name: "Exame de sangue", copay: 30 },
  { name: "Raio-X", copay: 45 },
  { name: "Ultrassom", copay: 80 },
  { name: "Ressonância magnética", copay: 200 },
  { name: "Fisioterapia (sessão)", copay: 40 },
  { name: "Consulta psicólogo", copay: 60 },
];

export class CopayCalculator {
  static getDiscount(score: number): CopayDiscount {
    if (score >= 850) return DISCOUNT_TIERS[0];
    if (score >= 600) return DISCOUNT_TIERS[1];
    if (score >= 300) return DISCOUNT_TIERS[2];
    return DISCOUNT_TIERS[3];
  }

  static getNextTier(
    score: number
  ): { tier: CopayDiscount; pointsNeeded: number } | null {
    if (score >= 850) return null; // already at max
    if (score >= 600) return { tier: DISCOUNT_TIERS[0], pointsNeeded: 850 - score };
    if (score >= 300) return { tier: DISCOUNT_TIERS[1], pointsNeeded: 600 - score };
    return { tier: DISCOUNT_TIERS[2], pointsNeeded: 300 - score };
  }

  static simulateProcedures(score: number): CopaySimulation[] {
    const { discountPercent } = this.getDiscount(score);

    return COMMON_PROCEDURES.map((proc) => {
      const discountAmount = Number(
        ((proc.copay * discountPercent) / 100).toFixed(2)
      );
      const finalCopay = Number((proc.copay - discountAmount).toFixed(2));

      return {
        procedureName: proc.name,
        originalCopay: proc.copay,
        discountPercent,
        discountAmount,
        finalCopay,
      };
    });
  }

  static getUserCopayProfile(score: number): UserCopayProfile {
    const currentDiscount = this.getDiscount(score);
    const next = this.getNextTier(score);
    const simulations = this.simulateProcedures(score);

    // Average copay across all procedures
    const avgOriginalCopay =
      COMMON_PROCEDURES.reduce((sum, p) => sum + p.copay, 0) /
      COMMON_PROCEDURES.length;

    // Estimated savings based on 2 procedures/month
    const proceduresPerMonth = 2;
    const savingsPerProcedure =
      (avgOriginalCopay * currentDiscount.discountPercent) / 100;
    const monthlySavings = Number(
      (savingsPerProcedure * proceduresPerMonth).toFixed(2)
    );
    const annualSavings = Number((monthlySavings * 12).toFixed(2));

    return {
      currentScore: score,
      currentDiscount,
      nextTier: next?.tier ?? null,
      pointsToNextTier: next?.pointsNeeded ?? 0,
      monthlySavings,
      annualSavings,
      simulations,
    };
  }

  static getAnnualSavingsEstimate(
    score: number,
    proceduresPerMonth: number
  ): number {
    const { discountPercent } = this.getDiscount(score);
    const avgOriginalCopay =
      COMMON_PROCEDURES.reduce((sum, p) => sum + p.copay, 0) /
      COMMON_PROCEDURES.length;
    const savingsPerProcedure = (avgOriginalCopay * discountPercent) / 100;
    return Number((savingsPerProcedure * proceduresPerMonth * 12).toFixed(2));
  }
}
