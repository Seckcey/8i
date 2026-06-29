import type { Metadata } from "next";

import { PageHeading } from "@/components/page-heading";
import { PageShell } from "@/components/page-shell";
import { brand } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Wallet",
};

export default function WalletPage() {
  return (
    <PageShell>
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <PageHeading
          title="Wallet"
          description="A placeholder for 8i Credit balance and append-only ledger history."
        />
        <div className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-lg border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
            <p className="text-sm font-medium text-slate-300">
              Available balance
            </p>
            <p className="mt-3 text-5xl font-semibold tracking-tight">0</p>
            <p className="mt-2 text-slate-300">{brand.currency}</p>
            <p className="mt-6 text-sm leading-6 text-slate-300">
              Balances will be derived from append-only ledger entries when the
              wallet service is implemented.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-950">
              Ledger placeholder
            </h2>
            <div className="mt-5 grid gap-3">
              {[
                "Stripe purchase credit",
                "AI usage debit",
                "Admin adjustment",
              ].map((item) => (
                <div
                  key={item}
                  className="grid gap-2 rounded-lg border border-slate-200 bg-white px-4 py-4 text-sm sm:grid-cols-[1fr_auto]"
                >
                  <span className="font-medium text-slate-700">{item}</span>
                  <span className="text-slate-500">Planned ledger type</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
