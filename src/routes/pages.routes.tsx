import { Route } from "react-router-dom"
// import PagesList from "../features/page/PagesList"
import PageCreate from "../features/page/PageCreate";
import PageEdit from "../features/page/PageEdit";
import PreviewPage from "../features/page/PreviewPage"
import SeoPagesPage from "../modules/seo-pages/pages/SeoPagesPage"

export const pagesRoutes = (
  <>
    <Route path="/pages" element={<SeoPagesPage />} />

    <Route
      path="/pages/create"
      element={<PageCreate />}
    />

    <Route
      path="/pages/edit/:id"
      element={<PageEdit />}
    />

    <Route path="/preview/:slug" element={<PreviewPage />} />
  </>
)