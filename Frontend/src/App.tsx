import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import EventDetailsPage from "./pages/EventDetail";

// --- Main Pages ---
import ExplorePage from "./pages/Explore";
import TicketsPage from "./pages/Tickets";
import ProfilePage from "./pages/Profile";
import LoginPage from "./pages/Login";
import SigninPage from "./pages/Signin";

// --- Organizer Pages ---
import OrganizerDashboard from "./pages/organizer/dashboard";
import CreateEventPage from "./pages/organizer/create-event";
import ManageEventPage from "./pages/organizer/[eventId]";
import QRScannerPage from "./pages/organizer/scanner";

const App: React.FC<React.FC> = () => {
  return (
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
  );
};

export default App;

