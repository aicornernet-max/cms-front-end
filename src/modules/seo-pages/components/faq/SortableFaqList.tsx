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
import { FaqItem, type FaqItemData } from "./FaqItem";

interface SortableFaqListProps {
  faqs: FaqItemData[];
  disabled?: boolean;
  onReorder: (faqs: FaqItemData[]) => void;
  onEdit: (localId: string) => void;
  onRemove: (localId: string) => void;
}

function renumber(faqs: FaqItemData[]): FaqItemData[] {
  return faqs.map((faq, index) => ({ ...faq, position: index + 1 }));
}

export function SortableFaqList({
  faqs,
  disabled,
  onReorder,
  onEdit,
  onRemove,
}: SortableFaqListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = faqs.findIndex((f) => f.localId === active.id);
    const newIndex = faqs.findIndex((f) => f.localId === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    onReorder(renumber(arrayMove(faqs, oldIndex, newIndex)));
  };

  if (faqs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
        No FAQs added yet.
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
        items={faqs.map((f) => f.localId)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {faqs.map((faq) => (
            <FaqItem
              key={faq.localId}
              faq={faq}
              disabled={disabled}
              onEdit={onEdit}
              onRemove={onRemove}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
