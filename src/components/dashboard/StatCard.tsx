import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: number | string;
  icon: LucideIcon;
  change?: string;
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  change,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            {value}
          </h2>

          {change && (
            <p className="mt-2 text-sm text-green-600">
              {change}
            </p>
          )}

        </div>

        <div className="rounded-xl bg-blue-100 p-3">

          <Icon
            size={26}
            className="text-blue-600"
          />

        </div>

      </div>

    </div>
  );
}