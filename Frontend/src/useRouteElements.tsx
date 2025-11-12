import { useRoutes } from 'react-router-dom'
import path from '././constants/path'

// --- Public Pages ---
import ExplorePage from './pages/Explore'
import EventDetailsPage from './pages/EventDetail'
import TicketsPage from './pages/attendee/Tickets/Tickets'
import LoginPage from './pages/Users/Login/Login'
import SigninPage from './pages/Users/Register/Register'

import MePage from './pages/Users/Me'
import ForgotPasswordModal from './pages/Users/ForgotPassword'
import ResetPasswordModal from './pages/Users/ResetPassword'

// -- Attendee Pages ---
import AttendeeDashboard from './pages/attendee/Dashboard/Dashboard'

// --- Organizer Pages ---
import OrganizerDashboard from './pages/organizer/dashboard'
import CreateEventPage from './pages/organizer/create-event'
import ManageEventPage from './pages/organizer/ManageEvent'
import QRScannerPage from './pages/organizer/scanner'

// import ProtectedRoute from "./routes/ProtectedRoute";
// import RejectedRoute from "./routes/RejectedRoute";
import MainLayout from './layouts/MainLayout'
import RegisterLayout from './layouts/RegisterLayout'
import UserLayout from './layouts/UserLayout'

export default function useRouteElements() {
  const routeElements = useRoutes([
    // Public
    {
      path: path.home, // "/"
      element: (
        <MainLayout>
          <ExplorePage />
        </MainLayout>
      )
    },
    {
      path: path.event_details, // "/events/:id"
      element: (
        <MainLayout>
          <EventDetailsPage />
        </MainLayout>
      )
    },

    // Authenticated-only
    {
      path: '/',
      // element: <ProtectedRoute />,
      children: [
        {
          path: path.tickets,
          element: (
            <MainLayout>
              <TicketsPage />
            </MainLayout>
          )
        }, // "/tickets"<TicketsPage /> },

        {
          path: path.profile,
          element: (
            <UserLayout>
              <MePage />
            </UserLayout>
          )
        },

        {
          path: path.attendee_dashboard,
          element: (
            <UserLayout>
              <AttendeeDashboard user={undefined} events={[]} tickets={[]} />
            </UserLayout>
          )
        },
        // "/profile"
        // element: <ProfilePage /> },

        // Organizer
        {
          path: path.organizer_dashboard,
          element: (
            <MainLayout>
              <OrganizerDashboard />
            </MainLayout>
          )
        },

        {
          path: path.organizer_create_event,
          element: (
            <MainLayout>
              <CreateEventPage />
            </MainLayout>
          )
        }, // "/organizer/create-event"
        { path: path.organizer_manage_event, element: <ManageEventPage /> },
        { path: path.organizer_scanner, element: <QRScannerPage /> }
      ]
    },

    // Guests-only
    {
      path: '/',
      // element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <LoginPage />
            </RegisterLayout>
          )
        }, // "/login"
        {
          path: path.forgot_password,
          element: (
            <RegisterLayout>
              <ForgotPasswordModal />
            </RegisterLayout>
          )
        }, // "/forgot-password"
        {
          path: path.reset_password,
          element: (
            <RegisterLayout>
              <ResetPasswordModal />
            </RegisterLayout>
          )
        }, // "/reset-password"
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <SigninPage />
            </RegisterLayout>
          )
        } // "/signup"
      ]
    }
  ])

  return routeElements
}
