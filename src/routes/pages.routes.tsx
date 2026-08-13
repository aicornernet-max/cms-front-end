import { Route, useNavigate } from "react-router-dom";
import PageCreate from "../features/page/PageCreate";
import PageEdit from "../features/page/PageEdit";
import PreviewPage from "../features/page/PreviewPage";
import SeoPagesPage from "../modules/seo-pages/pages/SeoPagesPage";

const SeoPagesRoute = () => {
  const navigate = useNavigate();

  return (
    <SeoPagesPage
      onPreview={(slug) => navigate(`/preview/${slug}`)}
      onEdit={(id) => navigate(`/pages/edit/${id}`)}
    />
  );
};

export const pagesRoutes = (
  <>
    <Route
      path="/pages"
      element={<SeoPagesRoute />}
    />

    <Route
      path="/pages/create"
      element={<PageCreate />}
    />

    <Route
      path="/pages/edit/:id"
      element={<PageEdit />}
    />

    <Route
      path="/preview/:slug"
      element={<PreviewPage />}
    />
  </>
);