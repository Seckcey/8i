import type { Metadata } from "next";

import { PageHeading } from "@/components/page-heading";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Usage",
};

export default function UsagePage() {
  return (
    <PageShell>
      <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <PageHeading
          title="Usage history"
          description="A placeholder for AI request metadata, provider usage, token counts, and 8i Credit deductions."
        />
        <div className="mx-auto mt-10 max-w-6xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-2 gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid-cols-5">
            <span>Provider</span>
            <span>Model</span>
            <span className="hidden md:block">Status</span>
            <span className="hidden md:block">Tokens</span>
            <span className="hidden md:block">Credits</span>
          </div>
          <div className="grid gap-0">
            {[
              "OpenAI chat request",
              "Document tool request",
              "Image tool request",
            ].map((item) => (
              <div
                key={item}
                className="grid grid-cols-2 gap-4 border-b border-slate-100 px-5 py-4 text-sm last:border-b-0 md:grid-cols-5"
              >
                <span className="font-medium text-slate-700">{item}</span>
                <span className="text-slate-500">Not connected</span>
                <span className="hidden text-slate-500 md:block">Pending</span>
                <span className="hidden text-slate-500 md:block">0</span>
                <span className="hidden text-slate-500 md:block">0</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
