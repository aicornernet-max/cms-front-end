import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import FullScreenLoader from "../../../components/ui/FullScreenLoader";
import { ErrorState } from "../../../components/common/ErrorState";
import { useSeoPageV2 } from "../hooks/useSeoPageV2";
import { useDeleteSeoPageDraft } from "../hooks/useDeleteSeoPageDraft";
import { extractErrorMessage } from "../lib/errors";
import {
  SEO_PAGE_V2_SECTIONS,
  type SeoPageV2SectionId,
} from "../types/seoPageV2.types";
import { SeoPageEditorLayout } from "../components/editor/SeoPageEditorLayout";
import { BasicInformationSection } from "../components/sections/BasicInformationSection";
import { SeoMetaSection } from "../components/sections/SeoMetaSection";
import { AuthorReviewSection } from "../components/sections/AuthorReviewSection";
import { ContentSection } from "../components/sections/ContentSection";
import { ToolsSection } from "../components/sections/ToolsSection";
import { FaqSection } from "../components/sections/FaqSection";
import { PublishStatusSection } from "../components/sections/PublishStatusSection";

function isValidSection(value: string | null): value is SeoPageV2SectionId {
  return !!value && (SEO_PAGE_V2_SECTIONS as readonly string[]).includes(value);
}

export default function SeoPageEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const pageQuery = useSeoPageV2(id);

  const deleteDraft = useDeleteSeoPageDraft();


  const [dirtySections, setDirtySections] = useState<
    Partial<Record<SeoPageV2SectionId, boolean>>
  >({});

  const page = pageQuery.data;
 
  // Published pages are never edited directly — redirect to (or create) the
  // active draft, then swap the route to that draft's id.

  const requestedSection = searchParams.get("section");
  const activeSection: SeoPageV2SectionId = isValidSection(requestedSection)
    ? requestedSection
    : "basic";

  const handleSelectSection = (section: SeoPageV2SectionId) => {
    const next = new URLSearchParams(searchParams);
    next.set("section", section);
    setSearchParams(next, { replace: true });
  };

  const handleDirtyChange = (section: SeoPageV2SectionId) => (isDirty: boolean) => {
    setDirtySections((prev) =>
      prev[section] === isDirty ? prev : { ...prev, [section]: isDirty },
    );
  };

  const handleDeleteDraft = () => {
    if (!page) return;
    deleteDraft.mutate(page._id, {
      onSuccess: () => {
        toast.success("Draft deleted");
        navigate("/pages", { replace: true });
      },
      onError: (error) =>
        toast.error(extractErrorMessage(error, "Failed to delete draft")),
    });
  };

  if (!id) {
    return (
      <main className="px-4 py-10">
        <ErrorState
          title="Missing page id"
          message="No page id was provided in the URL."
        />
      </main>
    );
  }

  if (pageQuery.isLoading) {
    return <FullScreenLoader />;
  }

  if (pageQuery.isError || !page) {
    return (
      <main className="px-4 py-10">
        <ErrorState
          title="Page not found"
          message="This SEO page could not be loaded. It may have been deleted."
          onRetry={() => pageQuery.refetch()}
        />
      </main>
    );
  }

  if (page.status === "published") {
    return (
      <main className="px-4 py-10">
        <ErrorState
          title="Published page cannot be edited directly"
          message="Please use the Edit action from the SEO Pages list."
        />
      </main>
    );
  }

  const sectionProps = {
    page,
    readOnly: false,
  };

  return (
    <SeoPageEditorLayout
      page={page}
      activeSection={activeSection}
      onSelectSection={handleSelectSection}
      dirtySections={dirtySections}
      isDraftCopy={Boolean(page.parentId)}
      headerActions={
        <Link
          to={`/preview/${page.slug}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          Preview
        </Link>
      }
    >
      {activeSection === "basic" && (
        <BasicInformationSection
          {...sectionProps}
          onDirtyChange={handleDirtyChange("basic")}
        />
      )}
      {activeSection === "seo" && (
        <SeoMetaSection {...sectionProps} onDirtyChange={handleDirtyChange("seo")} />
      )}
      {activeSection === "authors" && (
        <AuthorReviewSection
          {...sectionProps}
          onDirtyChange={handleDirtyChange("authors")}
        />
      )}
      {activeSection === "content" && (
        <ContentSection
          {...sectionProps}
          onDirtyChange={handleDirtyChange("content")}
        />
      )}
      {activeSection === "tools" && (
        <ToolsSection {...sectionProps} onDirtyChange={handleDirtyChange("tools")} />
      )}
      {activeSection === "faqs" && (
        <FaqSection {...sectionProps} onDirtyChange={handleDirtyChange("faqs")} />
      )}
      {activeSection === "publish" && (
        <PublishStatusSection
          page={page}
          onDeleteDraft={handleDeleteDraft}
          isDeletingDraft={deleteDraft.isPending}
          onPublishSuccess={() => {
            navigate("/pages", { replace: true });
          }}
        />
      )}
    </SeoPageEditorLayout>
  );
}
