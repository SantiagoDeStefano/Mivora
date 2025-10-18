import { useRoutes } from "react-router-dom";
import path from "././constants/path";

// --- Public Pages ---
import ExplorePage from "./pages/Explore/Explore";
import EventDetailsPage from "./pages/EventDetail/EventDetail";
import TicketsPage from "./pages/Tickets/Tickets";
import ProfilePage from "./pages/Profile/Profile";
import LoginPage from "./pages/Login";
import SigninPage from "./pages/Signin/Signin";

// --- Organizer Pages ---
import OrganizerDashboard from "./pages/organizer/dashboard";
import CreateEventPage from "./pages/organizer/create-event";
import ManageEventPage from "./pages/organizer/[eventId]";
import QRScannerPage from "./pages/organizer/scanner";

import ProtectedRoute from "./routes/ProtectedRoute";
import RejectedRoute from "./routes/RejectedRoute";

export default function useRouteElements() {
  const routeElements = useRoutes([
    // Public
    {
      path: path.home,      // "/"
      element: <ExplorePage />,
    },
    {
      path: path.event_details, // "/events/:id"
      element: <EventDetailsPage />,
    },

    // Authenticated-only
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        { path: path.tickets, element: <TicketsPage /> },        // "/tickets"
        { path: path.profile, element: <ProfilePage /> },        // "/profile"

        // Organizer
        { path: path.organizer_dashboard, element: <OrganizerDashboard /> }, // "/organizer"
        { path: path.organizer_create_event, element: <CreateEventPage /> }, // "/organizer/create-event"
        { path: path.organizer_manage_event, element: <ManageEventPage /> }, // "/organizer/events/:eventId"
        { path: path.organizer_scanner, element: <QRScannerPage /> },        // "/organizer/scanner"
      ],
    },

    // Guests-only
    {
      path: "/",
      element: <RejectedRoute />,
      children: [
        { path: path.login, element: <LoginPage /> },   // "/login"
        { path: path.signup, element: <SigninPage /> }, // "/signup"
      ],
    },
  ]);

  return routeElements;
}
