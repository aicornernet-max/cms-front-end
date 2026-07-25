import { Users } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-50">
        <Users className="h-7 w-7 text-gray-400" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-gray-900">
        No Subscribers Found
      </h3>
      <p className="max-w-sm text-sm text-gray-500">
        Subscribers will appear here after users subscribe.
      </p>
    </div>
  );
}
