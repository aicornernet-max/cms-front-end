import { Route } from "react-router-dom";
import { LoginActivityList } from "../modules/login-activity/LoginActivityList";

export const LoginActivityRoutes = (
  <Route
    path="/LoginActivityList"
    element={<LoginActivityList />}
  />
);