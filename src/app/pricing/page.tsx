import type { Metadata } from "next";

import { CreditPackageCard } from "@/components/credit-package-card";
import { PageHeading } from "@/components/page-heading";
import { PageShell } from "@/components/page-shell";
import { brand, creditPackages } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Pricing",
};

export default function PricingPage() {
  return (
    <PageShell>
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <PageHeading
          title="Prepaid 8i Credit packages"
          description="Choose a placeholder package for planning. Stripe Checkout is intentionally not connected in Phase 1."
        />
        <div className="mx-auto mt-10 grid max-w-7xl gap-5 lg:grid-cols-3">
          {creditPackages.map((creditPackage) => (
            <CreditPackageCard
              key={creditPackage.name}
              creditPackage={creditPackage}
            />
          ))}
        </div>
        <div className="mx-auto mt-10 max-w-3xl rounded-lg border border-slate-200 bg-slate-50 p-6 text-sm leading-6 text-slate-600">
          {brand.currency} are prepaid software credits redeemable only inside{" "}
          {brand.product}. They are not cash, not crypto, not transferable, not
          withdrawable, not resellable, and not an investment product.
        </div>
      </section>
    </PageShell>
  );
}
