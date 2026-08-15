import { Route } from "react-router-dom"

import AuthorListPage from "../modules/author/pages/AuthorListPage"
import CreateAuthorPage from "../modules/author/pages/CreateAuthorPage"
import EditAuthorPage from "../modules/author/pages/EditAuthorPage"

export const authorRoutes = (
  <>
    <Route path="/admin/authors" element={<AuthorListPage />} />

    <Route path="/admin/authors/create" element={<CreateAuthorPage />} />

    <Route path="/admin/authors/:id/edit" element={<EditAuthorPage />} />
  </>
)
