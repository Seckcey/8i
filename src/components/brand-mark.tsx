import Link from "next/link";

import { brand } from "@/lib/site-data";

type BrandMarkProps = {
  compact?: boolean;
};

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-950 text-sm font-semibold text-white shadow-sm">
        8i
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-semibold tracking-tight text-slate-950">
          {brand.product}
        </span>
        {!compact ? (
          <span className="block text-xs font-medium text-slate-500">
            {brand.parent}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
