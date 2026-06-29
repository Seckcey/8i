import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { brand, legalNav, primaryNav } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div className="max-w-md">
          <BrandMark />
          <p className="mt-4 text-sm leading-6 text-slate-600">
            {brand.product} uses prepaid software credits for internal AI tools.
            {brand.currency} are not cash, crypto, investment products, or
            third-party provider credits.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-950">App</h2>
          <div className="mt-3 grid gap-2">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-slate-600 hover:text-slate-950"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-950">Legal</h2>
          <div className="mt-3 grid gap-2">
            {legalNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-slate-600 hover:text-slate-950"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
