import { Plus, Search } from "lucide-react";
import { SectionCard, Footer, PersonCard, Avatar, buttonPrimary, input } from "../shared";
import type { SeoPageEditor } from "../../../hooks/useSeoPageEditor";

export function AuthorsSection({ editor }: { editor: SeoPageEditor }) {
  return (
    <SectionCard
      title="Author & reviewer"
      eyebrow="03"
      description="Choose the people shown on the published page. Only their profile IDs are stored."
      footer={
        <Footer
          saveLabel="Save people"
          onSave={() => editor.save("authors")}
          saving={editor.saving}
          next={editor.nextSection}
          onNext={() => editor.save("authors", editor.nextSection)}
          previous={editor.previousSection}
          onPrevious={() => editor.setActive(editor.previousSection!)}
          saved={editor.saved === "authors"}
        />
      }
    >
      <div className="grid gap-5 md:grid-cols-2">
        <PersonCard label="Written by" person={editor.writtenBy} onRemove={editor.clearWrittenBy} />
        <PersonCard label="Reviewed by" person={editor.reviewedBy} onRemove={editor.clearReviewedBy} />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-900">Find a profile</p>
            <p className="text-xs text-slate-500">Search your author/admin profiles.</p>
          </div>
          <div className="flex rounded-lg bg-white p-1 shadow-sm">
            <button
              onClick={() => editor.setAuthorTarget("writtenBy")}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                editor.authorTarget === "writtenBy" ? "bg-indigo-600 text-white" : "text-slate-500"
              }`}
            >
              Writer
            </button>
            <button
              onClick={() => editor.setAuthorTarget("reviewedBy")}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                editor.authorTarget === "reviewedBy" ? "bg-indigo-600 text-white" : "text-slate-500"
              }`}
            >
              Reviewer
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              className={`${input} pl-9`}
              value={editor.authorQuery}
              onChange={(e) => editor.setAuthorQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && editor.searchAuthors()}
              placeholder="Search by name or email"
            />
          </div>
          <button onClick={editor.searchAuthors} className={buttonPrimary}>
            Search
          </button>
        </div>

        {editor.authors.length > 0 && (
          <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {editor.authors.map((author) => (
              <button
                key={author._id}
                onClick={() => editor.selectAuthor(author)}
                className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left last:border-0 hover:bg-slate-50"
              >
                <Avatar person={author} />
                <span className="min-w-0">
                  <strong className="block truncate text-sm">{author.name}</strong>
                  <small className="text-xs text-slate-500">{author.email}</small>
                </span>
                <Plus className="ml-auto h-4 w-4 text-indigo-500" />
              </button>
            ))}
          </div>
        )}
      </div>
    </SectionCard>
  );
}
