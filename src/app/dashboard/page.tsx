import type { Metadata } from "next";

import { DashboardCard } from "@/components/dashboard-card";
import { PageHeading } from "@/components/page-heading";
import { PageShell } from "@/components/page-shell";
import { dashboardMetrics } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <PageShell>
      <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <PageHeading
          title="Dashboard"
          description="A Phase 1 app shell for balance, purchase, and AI usage summaries."
        />
        <div className="mx-auto mt-10 grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-4">
          {dashboardMetrics.map((metric) => (
            <DashboardCard key={metric.label} metric={metric} />
          ))}
        </div>
        <div className="mx-auto mt-8 max-w-7xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">
            Recent activity
          </h2>
          <div className="mt-5 grid gap-3">
            {["Wallet ledger", "Credit purchases", "AI usage deductions"].map(
              (item) => (
                <div
                  key={item}
                  className="flex flex-col justify-between gap-2 rounded-lg border border-slate-200 px-4 py-4 text-sm sm:flex-row sm:items-center"
                >
                  <span className="font-medium text-slate-700">{item}</span>
                  <span className="text-slate-500">No records yet</span>
                </div>
              ),
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
