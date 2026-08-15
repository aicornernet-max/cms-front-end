# SEO Pages Module (combined)

React + TypeScript module for the CMS SEO page screens: **list**, **create**,
and **edit**. This replaces the two separate `seo-pages` / `seo-pages-v2`
deliverables with one decoupled, modular unit.

## Installation

Copy the `seo-pages` directory into:

```
src/modules/seo-pages
```

Assumptions (unchanged from the original modules):

- Existing Axios instance: `src/api/axios.ts`
- Existing pagination component: `src/components/common/Pagination.tsx`
- Existing rich-text editor: `src/components/editor/RichTextEditor.tsx`
- No route changes are included in this module — you wire routes yourself.

## Route integration

```tsx
import {
  SeoPagesListPage,
  SeoPageCreatePage,
  SeoPageEditPage,
} from "../modules/seo-pages";

<Route
  path="/seo-pages"
  element={
    <SeoPagesListPage
      onCreate={() => navigate("/seo-pages/create")}
      onPreview={(slug) => navigate(`/preview/${slug}`)}
      onEdit={(id) => navigate(`/seo-pages/edit/${id}`)}
    />
  }
/>
<Route path="/seo-pages/create" element={<SeoPageCreatePage onSaved={(id) => navigate(`/seo-pages/edit/${id}`)} />} />
<Route path="/seo-pages/edit/:id" element={<SeoPageEditPage onSaved={() => {}} />} />
```

`onSaved`, `onPreview`, and `onCreate` are all optional. If you don't pass
`onPreview`, the editor falls back to `window.open('/preview/:slug')`.

## Structure

```
seo-pages/
  types.ts                     merged list + editor types (incl. the
                                Payload types the v2 build was missing)
  utils/
    formatters.ts               date/number formatting
    slug.ts                     slugify()
  services/
    pageList.service.ts         GET /pages
    publicCategory.service.ts   GET /public/categories (list filter dropdown)
    pageEditor.service.ts       /pages-v2/* (create, edit, publish, search)
  hooks/
    usePages.ts / useCategories.ts   list screen data
    useSeoPageEditor.ts               all editor state + handlers
  components/
    list/                       PageTable, PageFilters, PageSummaryCards,
                                 CategorySummary
    editor/
      EditorShell.tsx           header, sidebar, section switcher
      DraftGate.tsx             published-page lock screen
      sections/                 one file per wizard step
      shared/                   Field, SectionCard, ToolRow, FaqRow, etc.
  pages/
    SeoPagesListPage.tsx
    SeoPageCreatePage.tsx
    SeoPageEditPage.tsx
```

Each section, service, and shared primitive is its own file, so extending
one part (e.g. adding a new wizard step, or changing how tools are
searched) never means touching an unrelated file.

## What changed from the original two zips

1. **Combined into one module.** The listing page and the create/edit
   pages were separate, undocumented as a pair, and duplicated the
   `PageStatus` type. They're now one module sharing one `types.ts`.
2. **Fixed a broken build.** `seo-pages-v2/services/seoPageV2.service.ts`
   imported `BasicPayload`, `SeoPayload`, `AuthorsPayload`, `ContentPayload`,
   `ToolsPayload`, and `FaqsPayload` from `../types` — none of them existed.
   These are now defined in `types.ts`.
3. **Slug auto-generation.** The slug field used to be a plain manual input.
   It now fills in automatically from the title (`slugify()` in
   `utils/slug.ts`) until the user edits it directly, with a "Regenerate
   from title" reset.
4. **Explicit draft-from-published flow.** The old editor silently called
   `POST /pages-v2/:id/edit` on load whenever a page was published, forking
   into a draft without telling the user. Opening a published page now
   shows a read-only `DraftGate` screen with a **"Create editable draft"**
   button — nothing happens until the user asks for it. Once clicked, all
   further saves target the new draft's id, and Publish promotes it as
   before.
5. **One 200-line file → ~20 focused files.** The old
   `SeoPageEditorLayout.tsx` mixed all state, all API calls, and every
   sub-component (buttons, cards, rows, modals) into one component with
   single-line JSX. State and API calls now live in `useSeoPageEditor.ts`;
   each wizard step is its own component in `components/editor/sections/`;
   shared primitives (`Field`, `SectionCard`, `ToolRow`, `FaqRow`, …) live
   in `components/editor/shared/`, each in its own file.
6. **Decoupled from routing.** The old editor called `useNavigate()`
   directly and hardcoded `/pages/edit/:id` and `/preview/:slug`. It now
   takes `onSaved` / `onPreview` callback props, matching the pattern the
   original list module already used (`onPreview` / `onEdit`) — so this
   module still never assumes your route paths.

## Notes carried over from the original list module

- Summary statistics are global; `pages`/`pagination` are filter-aware;
  `categorySummary` is global.
- Search is debounced before requesting the API; changing any filter
  resets the table to page 1.
- `createdBy` is displayed when present; null/empty values display `—`.
