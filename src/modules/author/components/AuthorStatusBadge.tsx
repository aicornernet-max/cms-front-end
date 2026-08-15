import { CheckCircle2, CircleSlash } from "lucide-react";

interface AuthorStatusBadgeProps {
  isActive: boolean;
}

export default function AuthorStatusBadge({ isActive }: AuthorStatusBadgeProps) {
  if (isActive) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
        Active
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
      <CircleSlash className="h-3.5 w-3.5" aria-hidden="true" />
      Inactive
    </span>
  );
}
