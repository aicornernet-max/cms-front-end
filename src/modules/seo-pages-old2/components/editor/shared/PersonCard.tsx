import { UserRound, X } from "lucide-react";
import type { AuthorProfile } from "../../../types";

export function Avatar({ person }: { person: AuthorProfile }) {
  return person.profileImage ? (
    <img src={person.profileImage} alt="" className="h-10 w-10 rounded-full object-cover" />
  ) : (
    <span className="grid h-10 w-10 place-items-center rounded-full bg-indigo-50 text-indigo-600">
      <UserRound className="h-5 w-5" />
    </span>
  );
}

interface PersonCardProps {
  label: string;
  person: AuthorProfile | null;
  onRemove: () => void;
}

export function PersonCard({ label, person, onRemove }: PersonCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5">
      <div className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </div>
      {person ? (
        <div className="flex items-center gap-3">
          <Avatar person={person} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{person.name}</p>
            <p className="truncate text-xs text-slate-500">{person.email}</p>
          </div>
          <button onClick={onRemove} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="rounded-xl bg-slate-50 px-3 py-3 text-xs text-slate-400">
          Not selected · choose a profile below.
        </div>
      )}
    </div>
  );
}
