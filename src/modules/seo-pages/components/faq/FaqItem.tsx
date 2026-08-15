import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2 } from "lucide-react";

export interface FaqItemData {
  localId: string;
  question: string;
  answer: string;
  position: number;
}

interface FaqItemProps {
  faq: FaqItemData;
  disabled?: boolean;
  onEdit: (localId: string) => void;
  onRemove: (localId: string) => void;
}

export function FaqItem({ faq, disabled, onEdit, onRemove }: FaqItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: faq.localId, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-start gap-3 rounded-xl border bg-white p-4 shadow-sm ${
        isDragging ? "border-blue-300 ring-2 ring-blue-100" : "border-slate-200"
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        disabled={disabled}
        aria-label="Drag to reorder"
        className="mt-1 shrink-0 cursor-grab text-slate-400 hover:text-slate-600 disabled:cursor-not-allowed active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" aria-hidden="true" />
      </button>

      <span className="mt-0.5 shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
        #{faq.position}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900">
          {faq.question}
        </p>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
          {faq.answer}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => onEdit(faq.localId)}
          disabled={disabled}
          aria-label="Edit FAQ"
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onRemove(faq.localId)}
          disabled={disabled}
          aria-label="Remove FAQ"
          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
