import type { Metadata } from "next";

import { PageHeading } from "@/components/page-heading";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Privacy",
};

export default function PrivacyPage() {
  return (
    <PageShell>
      <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <PageHeading
          title="Privacy placeholder"
          description="Draft privacy structure for the 8i Wallet MVP. Final legal review is still required."
        />
        <div className="mx-auto mt-10 grid max-w-4xl gap-5 text-sm leading-7 text-slate-600">
          <section className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-950">
              Data minimization
            </h2>
            <p className="mt-3">
              The planned AI request records should store metadata, provider,
              model, status, token counts, cost data, response IDs, optional
              previews, and optional hashes rather than full raw prompts by
              default.
            </p>
          </section>
          <section className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-950">
              Payment and provider records
            </h2>
            <p className="mt-3">
              Stripe and AI provider integrations are not connected in Phase 1.
              Later phases should keep secrets server-side and avoid logging
              sensitive keys, prompts, or environment values.
            </p>
          </section>
        </div>
      </section>
    </PageShell>
  );
}
