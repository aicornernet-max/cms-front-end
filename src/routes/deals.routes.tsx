import { Route } from "react-router-dom";
// import DealsListPage as dealpageold from "../modules/Deals-old/DealsListPage"
import {DealsListPage} from "../modules/Deals/pages/DealsListPage"
import {CreateDealPage} from "../modules/Deals/pages/CreateDealPage"
import {EditDealPage} from "../modules/Deals/pages/EditDealPage"

export const DealsListPageRoutes = (
  <>
  <Route
    path="/admin/deals"
    element={<DealsListPage />}
  />
  <Route
    path="/admin/deals/:id/edit"
    element={<EditDealPage />}
  />
  <Route
    path="/CreateDealPage"
    element={<CreateDealPage />}
  />
  </>
);