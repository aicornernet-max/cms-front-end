import { GripVertical, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { input } from "./styles";
import type { PageTool, Tool } from "../../../types";

export function ToolThumb({ tool }: { tool: Tool | PageTool }) {
  const url = tool.image?.url ?? (tool as Tool).images?.tool?.url ?? "";

  return url ? (
    <img
      src={url}
      alt={`${tool.name ?? "Tool"} logo`}
      className="h-11 w-11 shrink-0 rounded-xl border border-slate-200 bg-white object-contain p-1.5 shadow-sm"
      onError={(event) => {
        event.currentTarget.style.display = "none";
        event.currentTarget.nextElementSibling?.removeAttribute("hidden");
      }}
    />
  ) : (
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-[10px] font-bold text-slate-500">
      AI
    </span>
  );
}

export function SortableHandle({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  return (
    <button
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      type="button"
      className="cursor-grab rounded-lg p-2 text-slate-300 hover:bg-slate-100 hover:text-slate-500"
      aria-label="Drag to reorder"
    >
      <GripVertical className="h-5 w-5" />
    </button>
  );
}

interface ToolRowProps {
  item: PageTool;
  index: number;
  onChange: (item: PageTool) => void;
  onRemove: () => void;
}

export function ToolRow({ item, index, onChange, onRemove }: ToolRowProps) {
  return (
    <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <SortableHandle id={item.toolId} />
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-50 text-xs font-bold text-slate-400">
        {index + 1}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <ToolThumb tool={item} />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900">
              {item.name ?? "Selected tool"}
            </p>
            <p className="text-xs text-slate-400">{item.brand ?? "AI tool"}</p>
          </div>
        </div>
        <textarea
          className={`${input} mt-3 min-h-[75px] resize-y`}
          value={item.customDescription}
          onChange={(e) => onChange({ ...item, customDescription: e.target.value })}
          placeholder="Custom description shown on this SEO page"
        />
      </div>
      <button onClick={onRemove} type="button" className="h-fit rounded-lg p-2 text-slate-300 hover:bg-red-50 hover:text-red-600">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
