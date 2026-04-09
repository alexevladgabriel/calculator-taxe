import { describe, it, expect } from "vitest";
import { calculateAngajat } from "@/lib/tax-engine/calculators/angajat";
import { calculatePfaReal } from "@/lib/tax-engine/calculators/pfa-real";
import { calculatePfaNorma } from "@/lib/tax-engine/calculators/pfa-norma";
import { calculateSrlMicro } from "@/lib/tax-engine/calculators/srl-micro";
import { calculateSrlStandard } from "@/lib/tax-engine/calculators/srl-standard";
import { compareAllStructures } from "@/lib/tax-engine/compare";
import { getYearConfig } from "@/lib/tax-engine/registry";
import type { CalculatorInputs } from "@/lib/tax-engine/types";

// ─── Helpers ────────────────────────────────────────────────────

const DEFAULT_STATUS = {
  isStudent: false,
  isHandicapped: false,
  isEmployedElsewhere: false,
  isPensioner: false,
};

function makeInputs(overrides: Partial<CalculatorInputs> = {}): CalculatorInputs {
  return {
    grossMonthlyIncome: 8_000,
    monthsOfActivity: 12,
    monthlyExpenses: 0,
    activityType: "6201",
    personalStatus: DEFAULT_STATUS,
    year: 2026,
    srlHasEmployee: true,
    mealTicketsPerMonth: 0,
    mealTicketValue: 40,
    ...overrides,
  };
}

function monthly(annual: number): number {
  return Math.round(annual / 12);
}

const config2026 = getYearConfig(2026);

// ─── PFA Sistem Real ────────────────────────────────────────────

describe("PFA Sistem Real 2026", () => {
  it("8,000 lei/month, 0 expenses - basic case", () => {
    const inputs = makeInputs();
    const result = calculatePfaReal(inputs, config2026);

    // Annual gross: 96,000
    expect(result.grossAnnualIncome).toBe(96_000);

    // CAS: 96,000 >= 12x(48,600) but < 24x(97,200) -> fixed 12,150
    const cas = 12 * 4_050 * 0.25;
    expect(cas).toBe(12_150);

    // CASS: 10% of 96,000 = 9,600 (between floor 2,430 and cap 29,160)
    const cass = 96_000 * 0.10;
    expect(cass).toBe(9_600);

    // Income tax: 10% of (96,000 - 12,150 - 9,600) = 10% of 74,250 = 7,425
    const tax = (96_000 - cas - cass) * 0.10;
    expect(tax).toBe(7_425);

    expect(result.totalTaxes).toBe(cas + cass + tax); // 29,175
    expect(result.netAnnualIncome).toBe(96_000 - result.totalTaxes); // 66,825
  });

  it("5,000 lei/month - matches REGNET example", () => {
    const inputs = makeInputs({ grossMonthlyIncome: 5_000 });
    const result = calculatePfaReal(inputs, config2026);

    // REGNET verified: CAS 12,150 + CASS 6,000 + Tax 4,185 = 22,335
    const cas = 12_150;
    const cass = 60_000 * 0.10; // 6,000
    const tax = (60_000 - cas - cass) * 0.10; // 4,185

    expect(result.totalTaxes).toBe(cas + cass + tax);
    expect(result.netAnnualIncome).toBe(60_000 - result.totalTaxes);
    expect(result.netAnnualIncome).toBe(37_665);
  });

  it("10,000 lei/month - matches REGNET example", () => {
    const inputs = makeInputs({ grossMonthlyIncome: 10_000 });
    const result = calculatePfaReal(inputs, config2026);

    // REGNET verified: CAS 24,300 + CASS 12,000 + Tax 8,370 = 44,670
    expect(result.totalTaxes).toBe(44_670);
    expect(result.netAnnualIncome).toBe(120_000 - 44_670);
    expect(result.netAnnualIncome).toBe(75_330);
  });

  it("50,000 lei/month - high earner, hits CAS and CASS caps", () => {
    const inputs = makeInputs({ grossMonthlyIncome: 50_000 });
    const result = calculatePfaReal(inputs, config2026);

    const annual = 600_000;
    // CAS: >= 24x(97,200) -> fixed 24,300
    const cas = 24_300;
    // CASS: 10% of 600,000 = 60,000 but cap is 72x*10% = 29,160
    const cass = 29_160;
    // Tax: 10% of (600,000 - 24,300 - 29,160) = 10% of 546,540
    const tax = (annual - cas - cass) * 0.10;

    expect(result.totalTaxes).toBe(cas + cass + tax);
    expect(result.netAnnualIncome).toBe(annual - result.totalTaxes);
  });

  it("3,000 lei/month - below CAS threshold", () => {
    const inputs = makeInputs({ grossMonthlyIncome: 3_000 });
    const result = calculatePfaReal(inputs, config2026);

    const annual = 36_000;
    // CAS: 36,000 < 48,600 -> 0
    // CASS: 10% of 36,000 = 3,600 (above floor 2,430)
    const cass = 3_600;
    // Tax: 10% of (36,000 - 0 - 3,600) = 3,240
    const tax = (annual - 0 - cass) * 0.10;

    expect(result.totalTaxes).toBe(cass + tax);
    expect(monthly(result.netAnnualIncome)).toBe(monthly(annual - cass - tax));
  });

  it("1,500 lei/month - below CAS, CASS hits floor", () => {
    const inputs = makeInputs({ grossMonthlyIncome: 1_500 });
    const result = calculatePfaReal(inputs, config2026);

    const annual = 18_000;
    // CAS: 0 (below 48,600)
    // CASS: 10% of 18,000 = 1,800 but floor is 2,430
    const cass = 2_430;
    // Tax: 10% of (18,000 - 0 - 2,430) = 1,557
    const tax = (annual - 0 - cass) * 0.10;

    expect(result.totalTaxes).toBe(cass + tax);
  });

  it("with expenses, reduces all taxes", () => {
    const inputs = makeInputs({ grossMonthlyIncome: 10_000, monthlyExpenses: 2_000 });
    const result = calculatePfaReal(inputs, config2026);

    const annual = 120_000;
    const expenses = 24_000;
    const net = annual - expenses; // 96,000

    // CAS on 96,000: 12x bracket -> 12,150
    // CASS on 96,000: 9,600
    // Tax: 10% of (96,000 - 12,150 - 9,600)
    const cas = 12_150;
    const cass = 9_600;
    const tax = (net - cas - cass) * 0.10;

    expect(result.totalTaxes).toBe(cas + cass + tax);
    // Bani in mana = gross - expenses - taxes
    expect(result.netAnnualIncome).toBe(annual - expenses - result.totalTaxes);
  });

  it("employed elsewhere - no CAS, CASS exempt (no floor), income tax adjusted", () => {
    const inputs = makeInputs({
      personalStatus: { ...DEFAULT_STATUS, isEmployedElsewhere: true },
    });
    const result = calculatePfaReal(inputs, config2026);

    // CAS: 0 (employed elsewhere)
    // CASS: exempted persons still pay 10% of income (no floor), capped
    const cass = Math.min(96_000 * 0.10, 29_160); // 9,600
    // Tax: 10% of (96,000 - 0 - 9,600) = 8,640
    const tax = (96_000 - 0 - cass) * 0.10;

    expect(result.totalTaxes).toBe(cass + tax);
    expect(result.netAnnualIncome).toBe(96_000 - result.totalTaxes);
  });
});

// ─── PFA Norma de Venit ─────────────────────────────────────────

describe("PFA Norma de Venit 2026", () => {
  it("8,000 lei/month IT - norma 40,000, taxes on norma only", () => {
    const inputs = makeInputs({ activityType: "6201" });
    const result = calculatePfaNorma(inputs, config2026);

    const norma = 40_000;
    // CAS: norma 40,000 < 48,600 -> 0
    const cas = 0;
    // CASS: 10% of norma = 4,000
    const cass = norma * 0.10;
    // Income tax: 10% of norma = 4,000 (NO CAS/CASS deduction)
    const tax = norma * 0.10;

    expect(result.totalTaxes).toBe(cas + cass + tax); // 8,000
    // Net = actual gross - taxes based on norma
    expect(result.netAnnualIncome).toBe(96_000 - 8_000);
    expect(result.netAnnualIncome).toBe(88_000);
    // Effective rate on actual income
    expect(result.effectiveTaxRate).toBeCloseTo(8_000 / 96_000, 4);
  });

  it("50,000 lei/month IT - very high earner, still taxes on norma", () => {
    const inputs = makeInputs({ grossMonthlyIncome: 50_000, activityType: "6201" });
    const result = calculatePfaNorma(inputs, config2026);

    const norma = 40_000;
    // Same taxes as 8k/month - norma is fixed!
    expect(result.totalTaxes).toBe(8_000);
    // But much higher net
    expect(result.netAnnualIncome).toBe(600_000 - 8_000);
    expect(result.netAnnualIncome).toBe(592_000);
    // Tiny effective rate
    expect(result.effectiveTaxRate).toBeCloseTo(8_000 / 600_000, 4);
  });

  it("3,000 lei/month IT - low earner, same taxes as high earner", () => {
    const inputs = makeInputs({ grossMonthlyIncome: 3_000, activityType: "6201" });
    const result = calculatePfaNorma(inputs, config2026);

    // Same taxes as everyone on norma IT
    expect(result.totalTaxes).toBe(8_000);
    expect(result.netAnnualIncome).toBe(36_000 - 8_000);
  });

  it("norma above CAS threshold - CAS applies", () => {
    // Transport marfuri: norma 50,000 > 48,600 (12x)
    const inputs = makeInputs({ activityType: "4941" });
    const result = calculatePfaNorma(inputs, config2026);

    const norma = 50_000;
    const cas = 12_150; // 12x bracket
    const cass = norma * 0.10; // 5,000
    const tax = norma * 0.10; // 5,000

    expect(result.totalTaxes).toBe(cas + cass + tax); // 22,150
  });

  it("employed elsewhere - no CAS, no CASS, only income tax", () => {
    const inputs = makeInputs({
      activityType: "6201",
      personalStatus: { ...DEFAULT_STATUS, isEmployedElsewhere: true },
    });
    const result = calculatePfaNorma(inputs, config2026);

    // Only income tax on norma
    expect(result.totalTaxes).toBe(40_000 * 0.10); // 4,000
    expect(result.netAnnualIncome).toBe(96_000 - 4_000);
  });

  it("warns when actual income exceeds 25,000 EUR", () => {
    const inputs = makeInputs({ grossMonthlyIncome: 15_000 }); // 180,000/year > 25k EUR
    const result = calculatePfaNorma(inputs, config2026);

    expect(result.warnings.some((w) => w.includes("25.000") || w.includes("25,000"))).toBe(true);
  });

  it("no warning under 25,000 EUR", () => {
    const inputs = makeInputs({ grossMonthlyIncome: 5_000 }); // 60,000/year ~ 12k EUR
    const result = calculatePfaNorma(inputs, config2026);

    expect(result.warnings.some((w) => w.includes("25.000") || w.includes("25,000"))).toBe(false);
  });
});

// ─── Angajat ────────────────────────────────────────────────────

describe("Angajat 2026", () => {
  it("8,000 lei/month - standard employee", () => {
    const inputs = makeInputs();
    const result = calculateAngajat(inputs, config2026);

    const gross = 96_000;
    const cas = gross * 0.25; // 24,000
    const cass = gross * 0.10; // 9,600
    // No personal deduction at 8,000 (above 3,400 threshold)
    const taxBase = gross - cas - cass; // 62,400
    const tax = taxBase * 0.10; // 6,240

    expect(result.totalTaxes).toBe(cas + cass + tax);
    expect(result.netAnnualIncome).toBe(gross - result.totalTaxes);
  });

  it("4,050 lei/month - minimum wage", () => {
    const inputs = makeInputs({ grossMonthlyIncome: 4_050 });
    const result = calculateAngajat(inputs, config2026);

    const monthlyGross = 4_050;
    const monthlyCAS = monthlyGross * 0.25; // 1,012.5
    const monthlyCASS = monthlyGross * 0.10; // 405
    // Deducere: 0 (gross > 3,400)
    const monthlyTaxBase = monthlyGross - monthlyCAS - monthlyCASS; // 2,632.5
    const monthlyTax = monthlyTaxBase * 0.10; // 263.25

    expect(monthly(result.totalTaxes)).toBe(
      monthly((monthlyCAS + monthlyCASS + monthlyTax) * 12)
    );
  });

  it("50,000 lei/month - high earner", () => {
    const inputs = makeInputs({ grossMonthlyIncome: 50_000 });
    const result = calculateAngajat(inputs, config2026);

    const gross = 600_000;
    const cas = gross * 0.25;
    const cass = gross * 0.10;
    const tax = (gross - cas - cass) * 0.10;

    expect(result.totalTaxes).toBe(cas + cass + tax);
    // Effective rate for angajat is always ~41.5% (no deduction at high salary)
    expect(result.effectiveTaxRate).toBeCloseTo(0.415, 2);
  });

  it("handicap - exempt from income tax", () => {
    const inputs = makeInputs({
      personalStatus: { ...DEFAULT_STATUS, isHandicapped: true },
    });
    const result = calculateAngajat(inputs, config2026);

    const gross = 96_000;
    const cas = gross * 0.25;
    const cass = gross * 0.10;
    // No income tax!
    expect(result.totalTaxes).toBe(cas + cass);
  });

  it("pensioner - no CAS", () => {
    const inputs = makeInputs({
      personalStatus: { ...DEFAULT_STATUS, isPensioner: true },
    });
    const result = calculateAngajat(inputs, config2026);

    const gross = 96_000;
    const cass = gross * 0.10;
    const tax = (gross - 0 - cass) * 0.10; // no CAS deducted
    expect(result.totalTaxes).toBe(cass + tax);
  });

  it("with meal tickets - CASS includes tickets, CAS does not", () => {
    const inputs = makeInputs({ mealTicketsPerMonth: 21, mealTicketValue: 20 });
    const result = calculateAngajat(inputs, config2026);

    const gross = 96_000;
    const tickets = 21 * 20 * 12; // 5,040

    // CAS: on gross only (no tickets)
    const cas = gross * 0.25; // 24,000

    // CASS: on gross + tickets
    const cass = (gross + tickets) * 0.10; // 10,104

    // Tax: on (gross - CAS - CASS + tickets)
    const taxBase = gross - cas - cass + tickets;
    const tax = taxBase * 0.10;

    expect(result.totalTaxes).toBe(cas + cass + tax);
  });
});

// ─── SRL Micro ──────────────────────────────────────────────────

describe("SRL Micro 2026", () => {
  it("8,000 lei/month with employee", () => {
    const inputs = makeInputs({ srlHasEmployee: true });
    const result = calculateSrlMicro(inputs, config2026);

    // 2026: unified 1% rate
    const revenue = 96_000;
    const turnoverTax = revenue * 0.01; // 960

    expect(result.grossAnnualIncome).toBe(revenue);
    // Should have turnover tax, employee cost, dividend tax, CASS
    expect(result.totalTaxes).toBeGreaterThan(turnoverTax);
    expect(result.netAnnualIncome).toBeLessThan(revenue);
  });

  it("8,000 lei/month without employee - same 1% rate in 2026", () => {
    const inputs = makeInputs({ srlHasEmployee: false });
    const result = calculateSrlMicro(inputs, config2026);

    // 2026: 1% unified (no 3% anymore)
    const revenue = 96_000;
    const turnoverTax = revenue * 0.01;

    // Verify 1% rate applied (not 3%)
    const turnoverItem = result.breakdown.find((b) =>
      b.label.toLowerCase().includes("impozit pe venit")
    );
    expect(turnoverItem).toBeDefined();
    expect(Math.abs(turnoverItem!.amount)).toBe(turnoverTax);
  });

  it("50,000 lei/month - high revenue SRL micro", () => {
    const inputs = makeInputs({ grossMonthlyIncome: 50_000, srlHasEmployee: true });
    const result = calculateSrlMicro(inputs, config2026);

    // 600,000 annual, 1% = 6,000 turnover tax
    // Dividend tax is 16% in 2026
    expect(result.netAnnualIncome).toBeGreaterThan(0);
    expect(result.totalTaxes).toBeGreaterThan(6_000);
  });
});

// ─── SRL Standard ───────────────────────────────────────────────

describe("SRL Standard 2026", () => {
  it("8,000 lei/month, 0 expenses", () => {
    const inputs = makeInputs({ monthlyExpenses: 0 });
    const result = calculateSrlStandard(inputs, config2026);

    const revenue = 96_000;
    // Profit = 96,000 (no expenses)
    const corpTax = revenue * 0.16; // 15,360
    const netProfit = revenue - corpTax; // 80,640
    const divTax = netProfit * 0.16; // 12,902.4
    // CASS on dividends: netProfit > 6x(24,300) -> 24,300 * 10% = 2,430
    const divCass = 2_430;

    expect(result.totalTaxes).toBeCloseTo(corpTax + divTax + divCass, 0);
    expect(result.netAnnualIncome).toBeCloseTo(netProfit - divTax - divCass, 0);
  });

  it("with high expenses - reduces profit tax", () => {
    const inputs = makeInputs({ grossMonthlyIncome: 10_000, monthlyExpenses: 7_000 });
    const result = calculateSrlStandard(inputs, config2026);

    const revenue = 120_000;
    const expenses = 84_000;
    const profit = 36_000;
    const corpTax = profit * 0.16; // 5,760

    // Net profit for dividends
    const netProfit = profit - corpTax; // 30,240
    const divTax = netProfit * 0.16;

    expect(result.totalTaxes).toBeLessThan(revenue * 0.3); // much less with expenses
  });

  it("expenses exceeding revenue - capped, 0 profit", () => {
    const inputs = makeInputs({ grossMonthlyIncome: 5_000, monthlyExpenses: 10_000 });
    const result = calculateSrlStandard(inputs, config2026);

    // Expenses capped at revenue
    expect(result.totalTaxes).toBe(0);
    expect(result.netAnnualIncome).toBe(0);
    expect(result.warnings.some((w) => w.includes("depasesc"))).toBe(true);
  });
});

// ─── Compare All ────────────────────────────────────────────────

describe("Compare All Structures", () => {
  it("returns 5 results sorted by net income", () => {
    const inputs = makeInputs();
    const comparison = compareAllStructures(inputs);

    expect(comparison.results).toHaveLength(5);
    // Sorted descending by net income
    for (let i = 1; i < comparison.results.length; i++) {
      expect(comparison.results[i - 1].netAnnualIncome).toBeGreaterThanOrEqual(
        comparison.results[i].netAnnualIncome
      );
    }
  });

  it("winner is the highest net income", () => {
    const inputs = makeInputs();
    const comparison = compareAllStructures(inputs);

    expect(comparison.winner.netAnnualIncome).toBe(
      comparison.results[0].netAnnualIncome
    );
  });

  it("PFA Norma wins for IT at 8,000/month (low taxes on fixed norma)", () => {
    const inputs = makeInputs({ activityType: "6201" });
    const comparison = compareAllStructures(inputs);

    expect(comparison.winner.structureType).toBe("pfa-norma");
  });

  it("all structures have valid structure types", () => {
    const inputs = makeInputs();
    const comparison = compareAllStructures(inputs);

    const types = comparison.results.map((r) => r.structureType);
    expect(types).toContain("angajat");
    expect(types).toContain("pfa-real");
    expect(types).toContain("pfa-norma");
    expect(types).toContain("srl-micro");
    expect(types).toContain("srl-standard");
  });

  it("works for year 2022", () => {
    const inputs = makeInputs({ year: 2022 });
    const comparison = compareAllStructures(inputs);

    expect(comparison.results).toHaveLength(5);
    expect(comparison.yearConfig.year).toBe(2022);
    // 2022 dividend tax was 5%
    expect(comparison.yearConfig.dividendTaxRate).toBe(0.05);
  });

  it("works for year 2024", () => {
    const inputs = makeInputs({ year: 2024 });
    const comparison = compareAllStructures(inputs);

    expect(comparison.yearConfig.dividendTaxRate).toBe(0.08);
    expect(comparison.yearConfig.minimumGrossWage).toBe(3_300);
  });
});

// ─── CASS Thresholds ────────────────────────────────────────────

describe("CASS Progressive Model 2026", () => {
  it("low income - hits floor (2,430)", () => {
    const inputs = makeInputs({ grossMonthlyIncome: 1_000 }); // 12,000/year
    const result = calculatePfaReal(inputs, config2026);

    // CASS floor = 6 x 4,050 x 10% = 2,430
    const cassItem = result.breakdown.find((b) =>
      b.label.toLowerCase().includes("cass")
    );
    expect(Math.abs(cassItem!.amount)).toBe(2_430);
  });

  it("high income - hits cap (29,160)", () => {
    const inputs = makeInputs({ grossMonthlyIncome: 30_000 }); // 360,000/year
    const result = calculatePfaReal(inputs, config2026);

    // CASS cap = 72 x 4,050 x 10% = 29,160
    const cassItem = result.breakdown.find((b) =>
      b.label.toLowerCase().includes("cass")
    );
    expect(Math.abs(cassItem!.amount)).toBe(29_160);
  });

  it("mid income - 10% of actual income", () => {
    const inputs = makeInputs({ grossMonthlyIncome: 8_000 }); // 96,000/year
    const result = calculatePfaReal(inputs, config2026);

    const cassItem = result.breakdown.find((b) =>
      b.label.toLowerCase().includes("cass")
    );
    expect(Math.abs(cassItem!.amount)).toBe(9_600); // 10% of 96,000
  });

  it("employed elsewhere - no floor, pays 10% of actual income", () => {
    const inputs = makeInputs({
      grossMonthlyIncome: 1_000,
      personalStatus: { ...DEFAULT_STATUS, isEmployedElsewhere: true },
    });
    const result = calculatePfaReal(inputs, config2026);

    // Exempted: 10% of 12,000 = 1,200 (no floor applied)
    const cassItem = result.breakdown.find((b) =>
      b.label.toLowerCase().includes("cass")
    );
    expect(Math.abs(cassItem!.amount)).toBe(1_200);
  });
});

// ─── CAS Fixed Brackets ────────────────────────────────────────

describe("CAS Fixed Brackets 2026", () => {
  it("below 12x - no CAS", () => {
    const inputs = makeInputs({ grossMonthlyIncome: 3_000 }); // 36,000 < 48,600
    const result = calculatePfaReal(inputs, config2026);

    const casItem = result.breakdown.find((b) =>
      b.label.includes("CAS") && !b.label.includes("CASS")
    );
    expect(Math.abs(casItem!.amount)).toBe(0);
  });

  it("between 12x and 24x - fixed 12,150", () => {
    const inputs = makeInputs({ grossMonthlyIncome: 6_000 }); // 72,000
    const result = calculatePfaReal(inputs, config2026);

    const casItem = result.breakdown.find((b) =>
      b.label.toLowerCase().includes("cas") && !b.label.toLowerCase().includes("cass")
    );
    expect(Math.abs(casItem!.amount)).toBe(12_150);
  });

  it("above 24x - fixed 24,300", () => {
    const inputs = makeInputs({ grossMonthlyIncome: 10_000 }); // 120,000
    const result = calculatePfaReal(inputs, config2026);

    const casItem = result.breakdown.find((b) =>
      b.label.toLowerCase().includes("cas") && !b.label.toLowerCase().includes("cass")
    );
    expect(Math.abs(casItem!.amount)).toBe(24_300);
  });
});
