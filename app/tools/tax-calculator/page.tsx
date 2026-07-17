import type { Metadata } from "next";
import { TaxCalculator } from "@/components/tools/finance-tools";
import { ToolShell } from "@/components/tools/tool-shell";
import { getForexRates } from "@/lib/tools/forex";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Nepal tax calculator", description: "Calculate Nepal income tax for individual, married, and foreign contractor filing statuses." };
export default async function TaxCalculatorPage() { const rates = await getForexRates(); return <ToolShell title="nepal tax calculator" description="Estimate income tax using Nepal's 2023–2024 brackets."><TaxCalculator rates={rates} /></ToolShell>; }
