import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { LoginActivityItem } from '../types';
import { LoginActivityDetails } from './LoginActivityDetails';

interface LoginActivityTableProps {
  items: LoginActivityItem[];
}

const ACTION_BADGE_STYLES: Record<LoginActivityItem['action'], string> = {
  LOGIN: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200',
  LOGOUT: 'bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-200',
};

const STATUS_BADGE_STYLES: Record<LoginActivityItem['status'], string> = {
  SUCCESS: 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-200',
  FAILED: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200',
};

const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
};

const formatTime = (isoString: string): string => {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const Badge = ({ children, className }: { children: string; className: string }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
  >
    {children}
  </span>
);

export const LoginActivityTable = ({ items }: LoginActivityTableProps) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="max-h-[560px] overflow-x-auto overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="sticky top-0 z-10 bg-gray-50">
            <tr>
              <th scope="col" className="w-10 px-4 py-3" />
              <th scope="col" className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Date
              </th>
              <th scope="col" className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Time
              </th>
              <th scope="col" className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Email
              </th>
              <th scope="col" className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Action
              </th>
              <th scope="col" className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </th>
              <th scope="col" className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Browser
              </th>
              <th scope="col" className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Device
              </th>
              <th scope="col" className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                IP Address
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => {
              const isExpanded = expandedIds.has(item._id);
              return (
                <>
                  <tr
                    key={item._id}
                    onClick={() => toggleExpanded(item._id)}
                    className="cursor-pointer transition-colors hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <ChevronRight className="h-4 w-4" aria-hidden="true" />
                        )}
                      </button>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {formatTime(item.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                      {item.email}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Badge className={ACTION_BADGE_STYLES[item.action]}>{item.action}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Badge className={STATUS_BADGE_STYLES[item.status]}>{item.status}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {item.browser || '—'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {item.device || '—'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {item.ipAddress || '—'}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${item._id}-details`}>
                      <td colSpan={9} className="p-0">
                        <LoginActivityDetails item={item} />
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};