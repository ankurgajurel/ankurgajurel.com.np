import assert from "node:assert/strict";
import test from "node:test";
import { calculateNepalTax, type CurrencyRates } from "./forex";

const rates: CurrencyRates = {
  NPR: { label: "Nepalese Rupee (NPR)", rate: 1, lastUpdated: "today" },
  USD: { label: "US Dollar (USD)", rate: 100, lastUpdated: "today" },
};

test("calculates progressive individual tax brackets", () => {
  const result = calculateNepalTax(700_000, "INDIVIDUAL", "NPR", "ANNUAL", rates);
  assert.equal(result?.totalTax, 25_000);
  assert.equal(result?.brackets.length, 2);
  assert.equal(result?.effectiveTaxRate, 25_000 / 700_000 * 100);
});

test("uses the flat foreign contractor rate after conversion", () => {
  const result = calculateNepalTax(1_000, "FOREIGN_CONTRACTOR", "USD", "ANNUAL", rates);
  assert.equal(result?.totalTax, 5_000);
  assert.equal(result?.conversionRate, 100);
});
