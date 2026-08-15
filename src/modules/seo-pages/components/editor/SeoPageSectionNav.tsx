import {
  BookOpen,
  Check,
  FileText,
  ListChecks,
  Rocket,
  Search,
  UserCheck,
  Wrench,
} from "lucide-react";
import type { SeoPageV2, SeoPageV2SectionId } from "../../types/seoPageV2.types";
import { isSectionComplete } from "../../lib/sectionStatus";

interface SectionDef {
  id: SeoPageV2SectionId;
  label: string;
  icon: typeof BookOpen;
}

const SECTIONS: SectionDef[] = [
  { id: "basic", label: "Basic Information", icon: BookOpen },
  { id: "seo", label: "SEO & Meta", icon: Search },
  { id: "authors", label: "Author & Review", icon: UserCheck },
  { id: "content", label: "Content", icon: FileText },
  { id: "tools", label: "Tools", icon: Wrench },
  { id: "faqs", label: "FAQs", icon: ListChecks },
  { id: "publish", label: "Publish & Status", icon: Rocket },
];

interface SeoPageSectionNavProps {
  activeSection: SeoPageV2SectionId;
  onSelect: (section: SeoPageV2SectionId) => void;
  page: SeoPageV2 | undefined;
  dirtySections?: Partial<Record<SeoPageV2SectionId, boolean>>;
}

export function SeoPageSectionNav({
  activeSection,
  onSelect,
  page,
  dirtySections,
}: SeoPageSectionNavProps) {
  return (
    <nav
      aria-label="Page sections"
      className="flex shrink-0 flex-row gap-1 overflow-x-auto lg:w-64 lg:flex-col lg:overflow-visible"
    >
      {SECTIONS.map(({ id, label, icon: Icon }) => {
        const isActive = id === activeSection;
        const isComplete = isSectionComplete(id, page);
        const isDirty = Boolean(dirtySections?.[id]);

        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            aria-current={isActive ? "page" : undefined}
            className={`group flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition lg:shrink ${
              isActive
                ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Icon
              className={`h-4 w-4 shrink-0 ${isActive ? "text-blue-600" : "text-slate-400"}`}
              aria-hidden="true"
            />
            <span className="flex-1 whitespace-nowrap">{label}</span>

            {isDirty ? (
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500"
                title="Unsaved changes"
              />
            ) : isComplete ? (
              <Check
                className="h-3.5 w-3.5 shrink-0 text-emerald-500"
                aria-hidden="true"
              />
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}
