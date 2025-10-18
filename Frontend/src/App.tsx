import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import EventDetailsPage from "./pages/EventDetail/EventDetail";
import { AppProvider } from "./contexts/app.context";

// --- Main Pages ---
import ExplorePage from "./pages/Explore/Explore";
import TicketsPage from "./pages/Tickets/Tickets";
import ProfilePage from "./pages/Profile/Profile";
import LoginPage from "./pages/Login";
import SigninPage from "./pages/Signin/Signin";
import TestAuth from "./pages/TestAuth";

// --- Organizer Pages ---
import OrganizerDashboard from "./pages/organizer/dashboard";
import CreateEventPage from "./pages/organizer/create-event";
import ManageEventPage from "./pages/organizer/[eventId]";
import QRScannerPage from "./pages/organizer/scanner";

const queryClient = new QueryClient();

const App: React.FC<React.FC> = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <BrowserRouter>
           <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
              <Routes>
                {/* --- Main Routes --- */}
                <Route path="/" element={<ExplorePage />} />
                <Route path="/events/:id" element={<EventDetailsPage />} />
                <Route path="/tickets" element={<TicketsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SigninPage />} />
              <Route path="/test-auth" element={<TestAuth />} />

                {/* --- Organizer Routes --- */}
                <Route path="/organizer" element={<OrganizerDashboard />} />
                <Route path="/organizer/create-event" element={<CreateEventPage />} />
                <Route path="/organizer/events/:eventId" element={<ManageEventPage />} />
                <Route path="/organizer/scanner" element={<QRScannerPage />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </BrowserRouter>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;

