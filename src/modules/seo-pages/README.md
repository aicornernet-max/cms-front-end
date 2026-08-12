# SEO Pages / Listicle Management Module

A plug-and-play React + TypeScript module for the CMS SEO/Listicle management screen.

## Assumptions

- Existing Axios instance: `src/api/axios.ts`
- `VITE_API_URL` already points to `/api`
- Existing pagination component: `src/components/common/Pagination.tsx`
- Page API: `GET /pages`
- Category API: `GET /public/categories`
- No route changes are included in this module.

## Expected page API

`GET /pages?page=1&limit=20&search=&categoryId=&status=&toolsCount=`

The response is expected to contain:

- `summary`
- `pages`
- `pagination`
- `categorySummary`

The module maps backend `pagination.totalItems` to the existing common Pagination component's `pagination.total`.

## Expected category API

`GET /public/categories`

The module uses only `_id`, `name`, and `slug` from the category records for the filter dropdown.

## Installation

Copy the `seo-pages` directory into:

`src/modules/seo-pages`

The module imports your existing Axios instance using:

`../../../api/axios`

and your existing Pagination component using:

`../../components/common/Pagination`

## Route integration

This module deliberately does NOT create or modify routes.

Example:

```tsx
import SeoPagesPage from "../modules/seo-pages/pages/SeoPagesPage";

<Route path="/seo-pages" element={<SeoPagesPage />} />
```

For Preview/Edit actions:

```tsx
<SeoPagesPage
  onPreview={(id) => navigate(`/pages/${id}/preview`)}
  onEdit={(id) => navigate(`/pages/${id}/edit`)}
/>
```

If your existing route paths differ, change only those callbacks.

## Notes

- Summary statistics are global, as agreed.
- `pages` and `pagination` are filter-aware.
- `categorySummary` is global.
- Search is debounced before requesting the API.
- Changing any filter resets the table to page 1.
- No advanced filters are included.
- The module does not add a second category-options endpoint.
- `createdBy` is displayed when present; null/empty values display `—`.
- `catImage` is treated as the existing Page category image field.
