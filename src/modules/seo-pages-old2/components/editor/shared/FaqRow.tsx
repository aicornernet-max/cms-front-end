import { Trash2 } from "lucide-react";
import { input } from "./styles";
import { SortableHandle } from "./ToolRow";
import type { PageFaq } from "../../../types";

interface FaqRowProps {
  id: string;
  index: number;
  item: PageFaq;
  onChange: (item: PageFaq) => void;
  onRemove: () => void;
}

export function FaqRow({ id, index, item, onChange, onRemove }: FaqRowProps) {
  return (
    <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <SortableHandle id={id} />
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
        {index + 1}
      </div>
      <div className="min-w-0 flex-1 space-y-3">
        <input
          className={input}
          value={item.question}
          onChange={(e) => onChange({ ...item, question: e.target.value })}
          placeholder="Question"
        />
        <textarea
          className={`${input} min-h-[100px] resize-y`}
          value={item.answer}
          onChange={(e) => onChange({ ...item, answer: e.target.value })}
          placeholder="Answer"
        />
      </div>
      <button onClick={onRemove} className="h-fit rounded-lg p-2 text-slate-300 hover:bg-red-50 hover:text-red-600">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
