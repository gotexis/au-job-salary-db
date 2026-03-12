// 2024-2025 Australian Tax Brackets (residents)
const TAX_BRACKETS = [
  { min: 0, max: 18200, rate: 0, base: 0 },
  { min: 18201, max: 45000, rate: 0.16, base: 0 },
  { min: 45001, max: 135000, rate: 0.30, base: 4288 },
  { min: 135001, max: 190000, rate: 0.37, base: 31288 },
  { min: 190001, max: Infinity, rate: 0.45, base: 51638 },
];

// HECS/HELP repayment rates 2024-2025
const HECS_RATES = [
  { min: 0, max: 54434, rate: 0 },
  { min: 54435, max: 62850, rate: 0.01 },
  { min: 62851, max: 66620, rate: 0.02 },
  { min: 66621, max: 70618, rate: 0.025 },
  { min: 70619, max: 74855, rate: 0.03 },
  { min: 74856, max: 79346, rate: 0.035 },
  { min: 79347, max: 84107, rate: 0.04 },
  { min: 84108, max: 89154, rate: 0.045 },
  { min: 89155, max: 94503, rate: 0.05 },
  { min: 94504, max: 100174, rate: 0.055 },
  { min: 100175, max: 106185, rate: 0.06 },
  { min: 106186, max: 112556, rate: 0.065 },
  { min: 112557, max: 119309, rate: 0.07 },
  { min: 119310, max: 126467, rate: 0.075 },
  { min: 126468, max: 134056, rate: 0.08 },
  { min: 134057, max: 142100, rate: 0.085 },
  { min: 142101, max: 150626, rate: 0.09 },
  { min: 150627, max: 159663, rate: 0.095 },
  { min: 159664, max: Infinity, rate: 0.1 },
];

// Medicare levy surcharge tiers (singles, no private health insurance)
const MLS_RATES = [
  { min: 0, max: 93000, rate: 0 },
  { min: 93001, max: 108000, rate: 0.01 },
  { min: 108001, max: 144000, rate: 0.0125 },
  { min: 144001, max: Infinity, rate: 0.015 },
];

const SUPER_RATE = 0.115; // 11.5% for 2024-2025
const MEDICARE_RATE = 0.02;

export interface TaxResult {
  grossAnnual: number;
  incomeTax: number;
  medicareLevy: number;
  medicareSurcharge: number;
  hecsRepayment: number;
  superannuation: number;
  totalDeductions: number;
  netAnnual: number;
  netMonthly: number;
  netFortnightly: number;
  netWeekly: number;
  effectiveRate: number;
  breakdown: { label: string; amount: number; color: string }[];
}

export function calculateIncomeTax(taxableIncome: number): number {
  for (const bracket of TAX_BRACKETS) {
    if (taxableIncome <= bracket.max) {
      return bracket.base + (taxableIncome - bracket.min + 1) * bracket.rate;
    }
  }
  return 0;
}

function calculateHecs(income: number): number {
  for (const tier of HECS_RATES) {
    if (income <= tier.max) {
      return income * tier.rate;
    }
  }
  return 0;
}

function calculateMLS(income: number): number {
  for (const tier of MLS_RATES) {
    if (income <= tier.max) {
      return income * tier.rate;
    }
  }
  return 0;
}

export type Period = "annual" | "monthly" | "fortnightly" | "weekly" | "hourly";

const PERIOD_MULTIPLIERS: Record<Period, number> = {
  annual: 1,
  monthly: 12,
  fortnightly: 26,
  weekly: 52,
  hourly: 52 * 38, // 38hr week standard
};

export function calculate(
  amount: number,
  period: Period,
  includeHecs: boolean,
  includeMLS: boolean
): TaxResult {
  const grossAnnual = amount * PERIOD_MULTIPLIERS[period];
  const incomeTax = Math.round(calculateIncomeTax(grossAnnual));
  const medicareLevy = Math.round(grossAnnual * MEDICARE_RATE);
  const medicareSurcharge = includeMLS ? Math.round(calculateMLS(grossAnnual)) : 0;
  const hecsRepayment = includeHecs ? Math.round(calculateHecs(grossAnnual)) : 0;
  const superannuation = Math.round(grossAnnual * SUPER_RATE);
  const totalDeductions = incomeTax + medicareLevy + medicareSurcharge + hecsRepayment;
  const netAnnual = grossAnnual - totalDeductions;

  return {
    grossAnnual: Math.round(grossAnnual),
    incomeTax,
    medicareLevy,
    medicareSurcharge,
    hecsRepayment,
    superannuation,
    totalDeductions,
    netAnnual,
    netMonthly: Math.round(netAnnual / 12),
    netFortnightly: Math.round(netAnnual / 26),
    netWeekly: Math.round(netAnnual / 52),
    effectiveRate: grossAnnual > 0 ? totalDeductions / grossAnnual : 0,
    breakdown: [
      { label: "Net Income", amount: netAnnual, color: "#22c55e" },
      { label: "Income Tax", amount: incomeTax, color: "#ef4444" },
      { label: "Medicare Levy", amount: medicareLevy, color: "#f97316" },
      ...(medicareSurcharge > 0
        ? [{ label: "Medicare Surcharge", amount: medicareSurcharge, color: "#eab308" }]
        : []),
      ...(hecsRepayment > 0
        ? [{ label: "HECS/HELP", amount: hecsRepayment, color: "#8b5cf6" }]
        : []),
    ],
  };
}
