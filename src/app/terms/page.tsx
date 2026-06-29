import type { Metadata } from "next";

import { PageHeading } from "@/components/page-heading";
import { PageShell } from "@/components/page-shell";
import { brand } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Terms",
};

export default function TermsPage() {
  return (
    <PageShell>
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <PageHeading
          title="Terms placeholder"
          description="Draft legal structure for the 8i Wallet MVP. Final legal review is still required."
        />
        <div className="mx-auto mt-10 grid max-w-4xl gap-5 text-sm leading-7 text-slate-600">
          <section className="rounded-lg border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-950">
              Prepaid software credits
            </h2>
            <p className="mt-3">
              {brand.currency} are prepaid software credits usable only inside{" "}
              {brand.product}. They are not legal tender, crypto assets,
              securities, investment products, stored-value cash accounts, or
              third-party provider credits.
            </p>
          </section>
          <section className="rounded-lg border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-950">
              No transfers or cash-out
            </h2>
            <p className="mt-3">
              The MVP does not support withdrawals, cash redemption, resale, or
              user-to-user credit transfers. Refund handling will be handled
              through Stripe and administrative review.
            </p>
          </section>
        </div>
      </section>
    </PageShell>
  );
}
