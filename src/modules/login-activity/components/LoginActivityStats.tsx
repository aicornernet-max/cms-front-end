import { CheckCircle2, ListChecks, XCircle, Clock3 } from 'lucide-react';
import type { LoginActivityStatsData } from '../types';

interface LoginActivityStatsProps {
  stats: LoginActivityStatsData;
  isLoading: boolean;
}

interface StatCardConfig {
  key: keyof LoginActivityStatsData;
  label: string;
  icon: typeof ListChecks;
  iconBg: string;
  iconColor: string;
}

const STAT_CARDS: StatCardConfig[] = [
  {
    key: 'totalRecords',
    label: 'Total Records',
    icon: ListChecks,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    key: 'successfulLogins',
    label: 'Successful Logins',
    icon: CheckCircle2,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    key: 'failedLogins',
    label: 'Failed Logins',
    icon: XCircle,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
  },
  {
    key: 'todaysActivity',
    label: "Today's Activity",
    icon: Clock3,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
];

const formatValue = (value: number): string => value.toLocaleString('en-US');

export const LoginActivityStats = ({ stats, isLoading }: LoginActivityStatsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STAT_CARDS.map(({ key, label, icon: Icon, iconBg, iconColor }) => (
        <div
          key={key}
          className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${iconBg}`}>
              <Icon className={`h-5 w-5 ${iconColor}`} aria-hidden="true" />
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-gray-500">{label}</p>
          {isLoading ? (
            <div className="mt-2 h-7 w-20 animate-pulse rounded-md bg-gray-100" />
          ) : (
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {formatValue(stats[key])}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};