import { SearchX } from 'lucide-react';
import { EMPTY_STATE_DESCRIPTION, EMPTY_STATE_TITLE } from '../constants';

export const EmptyLoginActivity = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-50">
        <SearchX className="h-7 w-7 text-gray-400" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-gray-900">{EMPTY_STATE_TITLE}</h3>
      <p className="mt-1 max-w-sm text-sm text-gray-500">{EMPTY_STATE_DESCRIPTION}</p>
    </div>
  );
};