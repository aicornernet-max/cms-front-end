# Deals Management Module

Plug-and-play feature module. Nothing here touches `App.tsx`, routing,
layout, sidebar, or auth — you wire those up yourself.

## 1. Point it at your axios instance

Open `src/features/Deals/lib/axiosClient.ts` and fix the relative import to
point at your project's existing axios instance (the one with `baseURL` and
`withCredentials` already configured):

```ts
import axiosInstance from "../../../lib/axiosInstance";
```

## 2. Make sure these libs are installed

`@tanstack/react-query`, `react-hook-form`, `react-hot-toast`,
`lucide-react`, `react-router-dom`, `axios`. All are already in the provided
`package.json`.

Your app root needs a `QueryClientProvider` and a `<Toaster />`
(from `react-hot-toast`) mounted once, if you don't already have them:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

<QueryClientProvider client={queryClient}>
  <Toaster position="top-right" />
  {/* ...your app */}
</QueryClientProvider>;
```

## 3. Register the routes

```tsx
import { DealsListPage, CreateDealPage, EditDealPage } from "@/features/Deals";

<Route path="/admin/deals" element={<DealsListPage />} />
<Route path="/admin/deals/create" element={<CreateDealPage />} />
<Route path="/admin/deals/:id/edit" element={<EditDealPage />} />
```

## Notes on backend assumptions

- `GET /admin/deals` is called with `page`, `limit`, `search`, `status`
  query params for pagination/search/filter. The API doc's example response
  didn't show these params being read — if your backend doesn't support
  them yet, list/search/filter will silently no-op server-side and the UI
  degrades to showing whatever the server returns.
- Delete (`DELETE /admin/deals/:id`) was not in the provided API examples;
  it's implemented against the conventional REST verb/path. Adjust
  `dealsApi.remove` in `services/deals.api.ts` if your backend differs.
- The publish endpoint's two documented error shapes
  (`missingFields` and `errors`) are both mapped onto the matching form
  field so validation messages show up inline.

## Behavior implemented per the brief

- List: search, status filter (draft/published), pagination, refresh,
  create button, per-row Edit/Publish/Delete (draft) or
  "Create Edit Draft" (published).
- Create: tool search → select → title → slug → `POST /admin/deals` →
  redirect straight to `/admin/deals/{id}/edit`.
- Edit: loads the draft, blocks editing (with a message) if the deal has
  already been published, debounced 2s autosave that PATCHes only the
  dirty fields as `multipart/form-data`, sticky publish bar, inline
  validation errors from the publish response.
