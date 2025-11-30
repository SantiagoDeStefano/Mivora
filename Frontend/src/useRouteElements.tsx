import { useRoutes } from 'react-router-dom'
import path from '././constants/path'

// --- Public Pages ---
import ExplorePage from './pages/Home'
import EventDetailsPage from './pages/EventDetail'
import LoginPage from './pages/Users/Login/Login'
import RegisterPage from './pages/Users/Register/Register'

import MePage from './pages/Users/Me'
import ForgotPasswordModal from './pages/Users/ForgotPassword'
import ResetPasswordModal from './pages/Users/ResetPassword'

// --- Organizer Pages ---
import CreateEventPage from './pages/Organzier/CreateEvent/CreateEvent'
import ManageEventPage from './pages/Organzier/ManageEvent/ManageEvent'
import CreatedEventDetailsPage from './pages/Organzier/CreatedEventDetails/CreatedEventDetails'
import UpdateEventPage from './pages/Organzier/UpdateEvent/UpdateEvent'

import BookTicketPage from './pages/BookTickets/BookTickets'

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
          path: path.profile,
          element: (
            <UserLayout>
              <MePage />
            </UserLayout>
          )
        },

        // "/profile"
        // element: <ProfilePage /> },
        {
          path: path.organizer_create_event,
          element: (
            <UserLayout>
              <CreateEventPage />
            </UserLayout>
          )
        }, 
        {
          path: path.organizer_manage_event,
          element: (
            <UserLayout>
              <ManageEventPage />
            </UserLayout>
          )
        },
        {
          path: path.organizer_created_event_details,
          element: (
            <UserLayout>
              <CreatedEventDetailsPage />
            </UserLayout>
          )
        },
        {
          path: path.organizer_update_event,
          element: (
            <UserLayout>
              <UpdateEventPage />
            </UserLayout>
          )
        },
        {
          path: path.book_ticket,
          element: (
            <UserLayout>
              <BookTicketPage />
            </UserLayout>
          )
        }
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
              <RegisterPage />
            </RegisterLayout>
          )
        } // "/signup"
      ]
    }
  ])

  return routeElements
}
