export type CurrencyRate = { label: string; rate: number; lastUpdated: string; isFeatured?: boolean };
export type CurrencyRates = Record<string, CurrencyRate>;

type ForexCategory = { sell: number; item: { name: string; code: string } };
type ForexResponse = { data: { forexCategory: ForexCategory[] }; latestUpdatedDate: string };
const API = "https://gibl-public-api.gibl.com.np/forex-rate/list";
const FEATURED = new Set(["USD", "EUR", "GBP"]);

export async function getForexRates(): Promise<CurrencyRates> {
  const response = await fetch(API, { next: { revalidate: 86_400 } });
  if (!response.ok) throw new Error("Foreign exchange rates are unavailable.");
  const payload = await response.json() as ForexResponse;
  return {
    NPR: { label: "Nepalese Rupee (NPR)", rate: 1, lastUpdated: payload.latestUpdatedDate, isFeatured: false },
    ...Object.fromEntries(payload.data.forexCategory.map((category) => [category.item.code, { label: `${category.item.name} (${category.item.code})`, rate: category.sell, lastUpdated: payload.latestUpdatedDate, isFeatured: FEATURED.has(category.item.code) }])),
  };
}

export const TAX_BRACKETS = {
  INDIVIDUAL: [{ limit: 500_000, rate: 0.01 }, { limit: 700_000, rate: 0.1 }, { limit: 1_000_000, rate: 0.2 }, { limit: 2_000_000, rate: 0.3 }, { limit: Infinity, rate: 0.36 }],
  MARRIED: [{ limit: 600_000, rate: 0.01 }, { limit: 800_000, rate: 0.1 }, { limit: 1_100_000, rate: 0.2 }, { limit: 2_000_000, rate: 0.3 }, { limit: Infinity, rate: 0.36 }],
  FOREIGN_CONTRACTOR: [{ limit: Infinity, rate: 0.05 }],
} as const;

export type TaxStatus = keyof typeof TAX_BRACKETS;
export type TaxResult = { totalTax: number; effectiveTaxRate: number; annualIncome: number; monthlyIncome: number; conversionRate: number; brackets: { amount: number; tax: number; rate: number }[] };

export function calculateNepalTax(income: number, status: TaxStatus, currency: string, incomeType: "MONTHLY" | "ANNUAL", rates: CurrencyRates): TaxResult | null {
  if (!Number.isFinite(income) || income <= 0 || !rates[currency]) return null;
  const annualIncome = incomeType === "MONTHLY" ? income * 12 : income;
  const monthlyIncome = incomeType === "ANNUAL" ? income / 12 : income;
  const nprIncome = annualIncome * rates[currency].rate;
  let previousLimit = 0; let remaining = nprIncome; let totalTax = 0;
  const brackets = TAX_BRACKETS[status].flatMap((bracket) => {
    const amount = Math.min(Math.max(remaining, 0), bracket.limit - previousLimit);
    previousLimit = bracket.limit; remaining -= amount;
    if (amount <= 0) return [];
    const tax = amount * bracket.rate; totalTax += tax;
    return [{ amount, tax, rate: bracket.rate }];
  });
  return { totalTax, effectiveTaxRate: (totalTax / nprIncome) * 100, annualIncome, monthlyIncome, conversionRate: rates[currency].rate, brackets };
}
