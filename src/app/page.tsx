import Link from "next/link";

import { CreditPackageCard } from "@/components/credit-package-card";
import { DashboardCard } from "@/components/dashboard-card";
import { PageShell } from "@/components/page-shell";
import {
  appRoutes,
  brand,
  creditPackages,
  dashboardMetrics,
} from "@/lib/site-data";

export default function Home() {
  return (
    <PageShell>
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 overflow-hidden px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-24">
          <div className="flex min-w-0 flex-col justify-center">
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              {brand.product}
            </h1>
            <p className="mt-6 max-w-2xl text-2xl font-medium leading-9 text-slate-800">
              {brand.tagline}
            </p>
            <p className="mt-6 max-w-2xl break-words text-lg leading-8 text-slate-600">
              Buy prepaid {brand.currency} and spend them inside the 8i Wallet
              platform on AI chat, agents, automations, document tools, image
              tools, coding assistants, and future API usage.
            </p>
            <p className="mt-4 max-w-2xl break-words text-sm leading-6 text-slate-500">
              {brand.currency} are prepaid software credits only. They have no
              cash value, cannot be withdrawn or transferred, and do not
              represent ownership of third-party model or provider credits.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/pricing"
                className="rounded-md bg-teal-700 px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
              >
                View credit packages
              </Link>
              <Link
                href="/dashboard"
                className="rounded-md border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Open dashboard shell
              </Link>
            </div>
          </div>

          <div className="min-w-0 rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-5">
              <div className="flex flex-col items-start gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Wallet balance
                  </p>
                  <p className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
                    0
                  </p>
                  <p className="text-sm text-slate-600">{brand.currency}</p>
                </div>
                <span className="rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
                  Phase 1 shell
                </span>
              </div>
              <div className="mt-5 grid gap-3">
                {[
                  "Append-only ledger planned",
                  "Stripe Checkout planned",
                  "OpenAI provider routing planned",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex flex-col gap-1 rounded-lg border border-slate-200 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="min-w-0 break-words font-medium text-slate-700">{item}</span>
                    <span className="shrink-0 text-slate-400">Not connected</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-4">
            {dashboardMetrics.map((metric) => (
              <DashboardCard key={metric.label} metric={metric} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
              Placeholder credit packages
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              These packages define the Phase 1 pricing shell only. Checkout and
              paid credits will be connected in a later phase.
            </p>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {creditPackages.map((creditPackage) => (
              <CreditPackageCard
                key={creditPackage.name}
                creditPackage={creditPackage}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-4">
            {appRoutes.map((route) => {
              const Icon = route.icon;

              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className="rounded-lg border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
                >
                  <Icon aria-hidden="true" size={22} className="text-teal-300" />
                  <h2 className="mt-4 text-lg font-semibold">{route.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {route.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </PageShell>
  );
}


