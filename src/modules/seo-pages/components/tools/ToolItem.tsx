import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import type { SeoPageV2Tool } from "../../types/seoPageV2.types";

interface ToolItemProps {
  tool: SeoPageV2Tool;
  index: number;
  disabled?: boolean;
  onDescriptionChange: (toolId: string, value: string) => void;
  onRemove: (toolId: string) => void;
}

export function ToolItem({
  tool,
  index,
  disabled,
  onDescriptionChange,
  onRemove,
}: ToolItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: tool.id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border bg-white p-4 shadow-sm ${
        isDragging ? "border-blue-300 ring-2 ring-blue-100" : "border-slate-200"
      }`}
    >
      <div className="mb-3 flex items-start gap-3">
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

        {tool.image ? (
          <img
            src={tool.image}
            alt={tool.name}
            className="h-11 w-11 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-400">
            {index + 1}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">
            {tool.name || "Untitled tool"}
          </p>
          {tool.brand ? (
            <p className="truncate text-xs text-slate-500">{tool.brand}</p>
          ) : null}
        </div>

        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
          #{index + 1}
        </span>

        <button
          type="button"
          onClick={() => onRemove(tool.id)}
          disabled={disabled}
          aria-label={`Remove ${tool.name || "tool"}`}
          className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <textarea
        rows={2}
        disabled={disabled}
        value={tool.customDescription}
        onChange={(e) => onDescriptionChange(tool.id, e.target.value)}
        placeholder="Custom description for this listing…"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}
