import { Plus, Search } from "lucide-react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SectionCard, Footer, ToolThumb, ToolRow, EmptyState, input } from "../shared";
import type { SeoPageEditor } from "../../../hooks/useSeoPageEditor";

export function ToolsSection({ editor }: { editor: SeoPageEditor }) {
  return (
    <SectionCard
      title="Tools"
      eyebrow="05"
      description="Add tools, customize their page description and drag them into display order."
      footer={
        <Footer
          saveLabel="Save tools"
          onSave={() => editor.save("tools")}
          saving={editor.saving}
          next={editor.nextSection}
          onNext={() => editor.save("tools", editor.nextSection)}
          previous={editor.previousSection}
          onPrevious={() => editor.setActive(editor.previousSection!)}
          saved={editor.saved === "tools"}
        />
      }
    >
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <input
          className={`${input} pl-9`}
          value={editor.toolQuery}
          onChange={(e) => editor.setToolQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && editor.searchTools()}
          placeholder="Search tools to add…"
        />
        {editor.toolResults.length > 0 && (
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
            {editor.toolResults.map((tool) => (
              <button
                key={tool._id}
                onClick={() => editor.addTool(tool)}
                className="flex w-full items-center gap-3 border-b border-slate-100 p-3 text-left hover:bg-slate-50"
              >
                <ToolThumb tool={tool} />
                <span className="min-w-0 flex-1">
                  <strong className="block text-sm">{tool.name}</strong>
                  <small className="text-xs text-slate-500">{tool.brand || "AI tool"}</small>
                </span>
                <Plus className="h-4 w-4 text-indigo-600" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold">
            Selected tools{" "}
            <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
              {editor.tools.length}
            </span>
          </p>
          <span className="text-xs text-slate-400">Drag to reorder</span>
        </div>

        {editor.tools.length === 0 ? (
          <EmptyState
            title="No tools added yet"
            text="Search above and add the tools you want to show on this page."
          />
        ) : (
          <DndContext collisionDetection={closestCenter} onDragEnd={editor.onToolDrag}>
            <SortableContext items={editor.tools.map((t) => t.toolId)} strategy={verticalListSortingStrategy}>
              {editor.tools.map((item, index) => (
                <ToolRow
                  key={item.toolId}
                  item={item}
                  index={index}
                  onChange={editor.updateTool}
                  onRemove={() => editor.removeTool(item.toolId)}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </SectionCard>
  );
}
