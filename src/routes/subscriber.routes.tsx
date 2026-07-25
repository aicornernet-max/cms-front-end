import { Route } from "react-router-dom";
import { SubscribersPage } from "../modules/subscribers";

export const subscriberRoutes = (
  <Route
    path="/subscribers"
    element={<SubscribersPage />}
  />
);