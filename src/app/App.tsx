import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast";

import { usersRoutes } from "../routes/users.routes"

import Login from "../modules/auth/Login"

import ProtectedRoute from "../routes/ProtectedRoute"

import AdminLayout from "../layouts/AdminLayout"

import Dashboard from "../pages/Dashboard"

import { pagesRoutes } from "../routes/pages.routes"
import { toolsRoutes } from "../routes/tools.routes"
import { categoriesRoutes } from "../routes/categories.routes"
import { ToolAlternative } from "../routes/Alternative.routes";
import  {subscriberRoutes}  from "../routes/subscriber.routes";


function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>

        {/* PUBLIC */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* PROTECTED */}
        <Route element={<ProtectedRoute />}>

          <Route element={<AdminLayout />}>

            <Route
              path="/"
              element={<Dashboard />}
            />

            {pagesRoutes}

            {toolsRoutes}

            {categoriesRoutes}

            {usersRoutes}

            {ToolAlternative}

            {subscriberRoutes}

          </Route>

        </Route>

      </Routes>

    </BrowserRouter>
  )
}

export default App