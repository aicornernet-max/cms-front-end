import { Route } from "react-router-dom";
import AdvertisementListPage from "../modules/advertisements/pages/AdvertisementListPage";
import AdvertisementDetailsPage from "../modules/advertisements/pages/AdvertisementDetailsPage";
// import AdvertisementCreatePage from "../modules/advertisements/pages/AdvertisementCreatePage";

/**
 * NOTE: this assumes App.tsx renders routes inside a top-level
 * <Routes>...</Routes> block and simply spreads route fragments in,
 * e.g.:
 *
 *   <Routes>
 *     {advertisementsRoutes}
 *     {otherModuleRoutes}
 *   </Routes>
 *
 * If your project instead uses createBrowserRouter's object-based
 * config, export an equivalent array of RouteObject entries here
 * instead of JSX - the page components themselves don't change.
 */
export const advertisementsRoutes = (
  <>
    <Route path="/advertisements" element={<AdvertisementListPage />} />
    {/* <Route path="/advertisements/new" element={<AdvertisementCreatePage />} /> */}
    <Route path="/advertisements/:id" element={<AdvertisementDetailsPage />} />
  </>
);
