import type { CreditPackage } from "@/lib/site-data";

type CreditPackageCardProps = {
  creditPackage: CreditPackage;
};

export function CreditPackageCard({ creditPackage }: CreditPackageCardProps) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">
            {creditPackage.name}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {creditPackage.description}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold text-slate-950">
            {creditPackage.price}
          </p>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            One-time
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-slate-50 p-4">
        <p className="text-sm font-medium text-slate-500">Includes</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
          {creditPackage.credits}
        </p>
        <p className="text-sm text-slate-600">8i Credits</p>
      </div>

      <ul className="mt-6 grid gap-3 text-sm text-slate-700">
        {creditPackage.features.map((feature) => (
          <li key={feature} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-700" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        disabled
        className="mt-6 rounded-md border border-slate-300 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-500"
      >
        Checkout not connected
      </button>
    </article>
  );
}
