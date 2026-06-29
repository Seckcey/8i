import type { Metadata } from "next";

import { PageHeading } from "@/components/page-heading";
import { PageShell } from "@/components/page-shell";
import { accountSections } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <PageShell>
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <PageHeading
          title="Settings"
          description="A placeholder for profile, billing, and account preferences."
        />
        <div className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-3">
          {accountSections.map((section) => {
            const Icon = section.icon;

            return (
              <article
                key={section.title}
                className="rounded-lg border border-slate-200 bg-slate-50 p-6"
              >
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-teal-50 text-teal-700">
                  <Icon aria-hidden="true" size={22} />
                </span>
                <h2 className="mt-5 text-lg font-semibold text-slate-950">
                  {section.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {section.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
