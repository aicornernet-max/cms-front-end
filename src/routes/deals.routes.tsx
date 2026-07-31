import { Route } from "react-router-dom";
import DealsListPage from "../modules/Deals/DealsListPage"

export const DealsListPageRoutes = (
  <Route
    path="/DealsListPage"
    element={<DealsListPage />}
  />
);