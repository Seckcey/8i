import type { DashboardMetric } from "@/lib/site-data";

type DashboardCardProps = {
  metric: DashboardMetric;
};

export function DashboardCard({ metric }: DashboardCardProps) {
  const Icon = metric.icon;

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{metric.label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            {metric.value}
          </p>
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-lg bg-teal-50 text-teal-700">
          <Icon aria-hidden="true" size={22} />
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{metric.detail}</p>
    </article>
  );
}
