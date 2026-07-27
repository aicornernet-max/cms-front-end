import type { LoginActivityItem } from '../types';

interface LoginActivityDetailsProps {
  item: LoginActivityItem;
}

interface DetailField {
  label: string;
  value: string;
}

export const LoginActivityDetails = ({ item }: LoginActivityDetailsProps): JSX.Element => {
  const fields: DetailField[] = [
    { label: 'Session ID', value: item.sessionId || '—' },
    { label: 'Operating System', value: item.os || '—' },
    { label: 'Failure Reason', value: item.reason || '—' },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 bg-gray-50 px-4 py-4 sm:grid-cols-3 sm:px-6">
      {fields.map((field) => (
        <div key={field.label}>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {field.label}
          </p>
          <p className="mt-1 break-all text-sm text-gray-700">{field.value}</p>
        </div>
      ))}
    </div>
  );
};