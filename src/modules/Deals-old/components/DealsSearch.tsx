import { Search } from "lucide-react";

interface DealsSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const DealsSearch = ({ value, onChange }: DealsSearchProps) => {
  return (
    <div className="relative w-full">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
        <Search className="h-4 w-4" aria-hidden="true" />
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search deals..."
        aria-label="Search deals"
        className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 shadow-sm outline-none transition-shadow focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
};
