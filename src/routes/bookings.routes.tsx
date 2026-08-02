import { Route } from "react-router-dom";
import BookingListPage from "../modules/bookings/pages/BookingListPage";
import BookingDetailsPage from "../modules/bookings/pages/BookingDetailsPage";
import BookingCreatePage from "../modules/bookings/pages/BookingCreatePage";
import BookingEditPage from "../modules/bookings/pages/BookingEditPage";

/**
 * ASSUMPTION: mirrors the pattern implied by routes/users.routes.tsx,
 * routes/pages.routes.tsx, etc. — a fragment of <Route> elements exported
 * for the parent <Routes> to spread directly, e.g. in App.tsx:
 *
 *   import { bookingsRoutes } from "../routes/bookings.routes";
 *   <Routes>
 *     {usersRoutes}
 *     {bookingsRoutes}
 *   </Routes>
 *
 * If the existing modules instead export a `RouteObject[]` for
 * `useRoutes()`/`createBrowserRouter`, swap the fragment below for a plain
 * array of the same shape — only this file needs to change.
 */
export const bookingsRoutes = (
  <>
    <Route path="bookings" element={<BookingListPage />} />
    <Route path="bookings/new" element={<BookingCreatePage />} />
    <Route path="bookings/:id" element={<BookingDetailsPage />} />
    <Route path="bookings/:id/edit" element={<BookingEditPage />} />
  </>
);
