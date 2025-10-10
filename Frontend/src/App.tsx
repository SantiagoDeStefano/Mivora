import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./layouts/Nav";
import { Container } from "./layouts/Container";

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

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100">
        <Nav />
        <main>
          <Routes>
            {/* --- Main Routes --- */}
            <Route path="/" element={<ExplorePage />} />
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
        <footer className="border-t py-10 text-center text-sm text-gray-500 dark:border-gray-800">
          <Container>
            <p>© {new Date().getFullYear()} Mivora • Crafted with ♥︎</p>
          </Container>
        </footer>
      </div>
    </BrowserRouter>
  );
}
