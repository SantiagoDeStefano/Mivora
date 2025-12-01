import { useRoutes, Navigate, Outlet } from 'react-router-dom'
import path from '././constants/path'

// --- Public Pages ---
import ExplorePage from './pages/Home'
import EventDetailsPage from './pages/EventDetail'
import LoginPage from './pages/Users/Login/Login'
import RegisterPage from './pages/Users/Register/Register'
import AboutPage from './pages/About'

import MePage from './pages/Users/Me'
import ForgotPasswordModal from './pages/Users/ForgotPassword'
import ResetPasswordModal from './pages/Users/ResetPassword'

// --- Organizer Pages ---
import CreateEventPage from './pages/Organzier/CreateEvent/CreateEvent'
import ManageEventPage from './pages/Organzier/ManageEvent/ManageEvent'
import CreatedEventDetailsPage from './pages/Organzier/CreatedEventDetails/CreatedEventDetails'
import UpdateEventPage from './pages/Organzier/UpdateEvent/UpdateEvent'

import BookTicketPage from './pages/BookTickets/BookTickets'
import MyTicketsPage from './pages/MyTickets/MyTickets'
import MyTicketDetailsPage from './pages/MyTicketDetails/MyTicketDetails'
import { useContext } from 'react'
import { AppContext } from './contexts/app.context'

// eslint-disable-next-line react-refresh/only-export-components
function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext);
  return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />;
}
// eslint-disable-next-line react-refresh/only-export-components
function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext);
  return (!isAuthenticated) ? <Outlet /> : <Navigate to={path.home} replace />;
}

import MainLayout from './layouts/MainLayout'
import RegisterLayout from './layouts/RegisterLayout'
import UserLayout from './layouts/UserLayout'


export default function useRouteElements() {
  const routeElements = useRoutes([
    // ---------------- Guest Pages ----------------
    {
      path: path.home,
      element: (
        <MainLayout>
          <ExplorePage />
        </MainLayout>
      )
    },
     {
          path: path.event_details,
          element: (
            <MainLayout>
              <EventDetailsPage />
            </MainLayout>
          )
        },
        {
          path: path.about,
          element: (
            <MainLayout>
              <AboutPage />
            </MainLayout>
          )
        },
    {
      path: '/', 
      element: <RejectedRoute />,
      children: [  
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <LoginPage />
            </RegisterLayout>
          )
        }, 
        {
          path: path.forgot_password,
          element: (
            <RegisterLayout>
              <ForgotPasswordModal />
            </RegisterLayout>
          )
        }, 
        {
          path: path.reset_password,
          element: (
            <RegisterLayout>
              <ResetPasswordModal />
            </RegisterLayout>
          )
        }, 
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <RegisterPage />
            </RegisterLayout>
          )
        },
      ]
    },

    // Authenticated-only
    {
      element: <ProtectedRoute />,
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
        },
        {
          path: path.my_tickets,
          element: (
            <UserLayout>
              <MyTicketsPage />
            </UserLayout>
          )
        },
        {
          path: path.my_ticket_details,
          element: (
            <UserLayout>
              <MyTicketDetailsPage />
            </UserLayout>
          )
        }
      ]
    },

    // Guests-only
    {
      path: '/',
      children: [
         // "/signup"
      ]
    }
  ])

  return routeElements
}
