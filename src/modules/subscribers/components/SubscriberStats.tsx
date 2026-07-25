import { Users, FileStack, Monitor, Smartphone, type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  iconClassName: string;
}

function StatCard({ label, value, icon: Icon, iconClassName }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconClassName}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

interface SubscriberStatsProps {
  total: number;
  currentPage: number;
  desktop: number;
  mobile: number;
}

export default function SubscriberStats({
  total,
  currentPage,
  desktop,
  mobile,
}: SubscriberStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        label="Total Subscribers"
        value={total}
        icon={Users}
        iconClassName="bg-indigo-50 text-indigo-600"
      />
      <StatCard
        label="Current Page"
        value={currentPage}
        icon={FileStack}
        iconClassName="bg-blue-50 text-blue-600"
      />
      <StatCard
        label="Desktop Users"
        value={desktop}
        icon={Monitor}
        iconClassName="bg-emerald-50 text-emerald-600"
      />
      <StatCard
        label="Mobile Users"
        value={mobile}
        icon={Smartphone}
        iconClassName="bg-violet-50 text-violet-600"
      />
    </div>
  );
}
