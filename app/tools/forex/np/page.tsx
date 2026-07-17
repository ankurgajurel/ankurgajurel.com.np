import type { Metadata } from "next";
import Link from "next/link";
import { ForexConverter } from "@/components/tools/finance-tools";
import { ToolShell } from "@/components/tools/tool-shell";
import { getForexRates } from "@/lib/tools/forex";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Nepal forex", description: "Convert Nepal forex rates and inspect the latest published sell rates." };
export default async function NepalForexPage() { const rates = await getForexRates(); const currencies = Object.entries(rates).sort(([, a], [, b]) => Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured))); return <ToolShell title="forex rates for nepal" description="Convert between Nepalese rupees and current published foreign exchange rates."><div className="space-y-8"><ForexConverter rates={rates} /><p className="text-sm text-foreground/60">There is also a <Link href="/tools/tax-calculator" className="underline underline-offset-4">Nepal tax calculator</Link>.</p><div className="overflow-x-auto"><div className="min-w-[37.5rem]"><div className="table-border-header grid grid-cols-3 p-2 text-xs uppercase tracking-wide text-foreground/60"><span>/ currency</span><span>/ rate (NPR)</span><span>/ last updated</span></div>{currencies.map(([code, rate]) => <div key={code} className="table-border grid grid-cols-3 gap-3 p-3 text-sm"><span>{rate.label}{rate.isFeatured && <span className="ml-2 text-xs text-foreground/55">featured</span>}</span><span>{rate.rate.toFixed(2)}</span><span>{rate.lastUpdated}</span></div>)}</div></div></div></ToolShell>; }
