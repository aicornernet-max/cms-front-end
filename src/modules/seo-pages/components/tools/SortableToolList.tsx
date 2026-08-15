import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { SeoPageV2Tool } from "../../types/seoPageV2.types";
import { ToolItem } from "./ToolItem";

interface SortableToolListProps {
  tools: SeoPageV2Tool[];
  disabled?: boolean;
  onReorder: (tools: SeoPageV2Tool[]) => void;
  onDescriptionChange: (toolId: string, value: string) => void;
  onRemove: (toolId: string) => void;
}

function renumber(tools: SeoPageV2Tool[]): SeoPageV2Tool[] {
  return tools.map((tool, index) => ({ ...tool, position: index + 1 }));
}

export function SortableToolList({
  tools,
  disabled,
  onReorder,
  onDescriptionChange,
  onRemove,
}: SortableToolListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tools.findIndex((t) => t.id === active.id);
    const newIndex = tools.findIndex((t) => t.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    onReorder(renumber(arrayMove(tools, oldIndex, newIndex)));
  };

  if (tools.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
        No tools added yet.
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={tools.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {tools.map((tool, index) => (
            <ToolItem
              key={tool.id}
              tool={tool}
              index={index}
              disabled={disabled}
              onDescriptionChange={onDescriptionChange}
              onRemove={onRemove}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
