import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import type { ToolOption } from "../../../../shared/types/tool.types";
import { useSaveSeoPageTools } from "../../hooks/useSeoPageTools";
import { extractErrorMessage } from "../../lib/errors";
import type { SeoPageV2, SeoPageV2Tool } from "../../types/seoPageV2.types";
import { SectionSaveBar } from "../editor/SectionSaveBar";
import { SortableToolList } from "../tools/SortableToolList";
import { ToolSearchDialog } from "../tools/ToolSearchDialog";

interface ToolsSectionProps {
  page: SeoPageV2;
  readOnly?: boolean;
  onDirtyChange?: (isDirty: boolean) => void;
}

function toSortedTools(page: SeoPageV2): SeoPageV2Tool[] {
  return [...(page.tools ?? [])].sort((a, b) => a.position - b.position);
}

export function ToolsSection({
  page,
  readOnly,
  onDirtyChange,
}: ToolsSectionProps) {
  const [tools, setTools] = useState<SeoPageV2Tool[]>(() => toSortedTools(page));
  const [isDialogOpen, setDialogOpen] = useState(false);

  const saveTools = useSaveSeoPageTools(page._id);

  useEffect(() => {
    setTools(toSortedTools(page));
  }, [page]);

  const isDirty =
    JSON.stringify(tools) !== JSON.stringify(toSortedTools(page));

  useEffect(() => {
    onDirtyChange?.(isDirty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  const handleAdd = (tool: ToolOption) => {
    setTools((prev) => [
      ...prev,
      {
        id: tool.id,
        name: tool.name,
        image: tool.image,
        brand: tool.brand,
        customDescription: "",
        position: prev.length + 1,
      },
    ]);
  };

  const handleRemove = (id: string) => {
    setTools((prev) =>
      prev
        .filter((t) => t.id !== id)
        .map((t, index) => ({ ...t, position: index + 1 })),
    );
  };

  const handleDescriptionChange = (toolId: string, value: string) => {
    setTools((prev) =>
      prev.map((t) =>
        t.id === toolId ? { ...t, customDescription: value } : t,
      ),
    );
  };

  const handleSave = () => {

      const payload = {
    tools: tools.map((tool) => ({
      toolId: tool.id,
      customDescription: tool.customDescription,
    })),
  };
    console.log("Saving tools:", payload);
    saveTools.mutate(
      {
        tools: tools.map(({ id, customDescription }) => ({
          toolId: id,
          customDescription,
        })),
      },
      {
        onSuccess: () => toast.success("Tools saved"),
        onError: (error) =>
          toast.error(extractErrorMessage(error, "Failed to save tools")),
      },
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Tools</h2>
          <p className="mt-1 text-sm text-slate-500">
            Tools featured on this page, in display order.
          </p>
        </div>

        <button
          type="button"
          disabled={readOnly}
          onClick={() => setDialogOpen(true)}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Tool
        </button>
      </div>

      <SortableToolList
        tools={tools}
        disabled={readOnly}
        onReorder={setTools}
        onDescriptionChange={handleDescriptionChange}
        onRemove={handleRemove}
      />

      <SectionSaveBar
        isDirty={isDirty}
        isSaving={saveTools.isPending}
        isError={saveTools.isError}
        onSave={handleSave}
        disabled={readOnly}
        saveLabel="Save Tools"
      />

      <ToolSearchDialog
        open={isDialogOpen}
        excludeToolIds={tools.map((t) => t.id)}
        onClose={() => setDialogOpen(false)}
        onSelect={handleAdd}
      />
    </div>
  );
}
