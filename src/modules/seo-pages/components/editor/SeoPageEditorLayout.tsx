import type { ReactNode } from "react";
import type { SeoPageV2, SeoPageV2SectionId } from "../../types/seoPageV2.types";
import { SeoPageHeader } from "./SeoPageHeader";
import { SeoPageSectionNav } from "./SeoPageSectionNav";

interface SeoPageEditorLayoutProps {
  page: SeoPageV2;
  activeSection: SeoPageV2SectionId;
  onSelectSection: (section: SeoPageV2SectionId) => void;
  dirtySections?: Partial<Record<SeoPageV2SectionId, boolean>>;
  headerActions?: ReactNode;
  isDraftCopy?: boolean;
  children: ReactNode;
}

export function SeoPageEditorLayout({
  page,
  activeSection,
  onSelectSection,
  dirtySections,
  headerActions,
  isDraftCopy,
  children,
}: SeoPageEditorLayoutProps) {
  return (
    <main className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px] space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <SeoPageHeader
            title={page.title}
            slug={page.slug}
            status={page.status}
            isDraftCopy={isDraftCopy}
          />

          {headerActions ? (
            <div className="shrink-0">{headerActions}</div>
          ) : null}
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <SeoPageSectionNav
            activeSection={activeSection}
            onSelect={onSelectSection}
            page={page}
            dirtySections={dirtySections}
          />

          <div className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
