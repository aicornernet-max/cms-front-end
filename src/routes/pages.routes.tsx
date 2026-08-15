import { Route, useNavigate } from "react-router-dom";
import PreviewPage from "../features/page/PreviewPage";
import SeoPagesPage from "../modules/seo-pages/pages/SeoPagesPage";
import SeoPageCreatePage from "../modules/seo-pages/pages/SeoPageCreatePage";
import SeoPageEditPage from "../modules/seo-pages/pages/SeoPageEditPage";

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
      element={<SeoPageCreatePage />}
    />

    <Route
      path="/pages/edit/:id"
      element={<SeoPageEditPage />}
    />

    <Route
      path="/preview/:slug"
      element={<PreviewPage />}
    />
  </>
);