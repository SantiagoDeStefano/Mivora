import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./layouts/Nav";
import ExplorePage from "./pages/Explore";
import TicketsPage from "./pages/Tickets";
import ProfilePage from "./pages/Profile";
import OrgDashboard from "./pages/OrgDashboard";
import LoginPage from "./pages/Login";
import SigninPage from "./pages/Signin";
import { Container } from "./layouts/Container";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100">
        <Nav />
        <Routes>
          <Route path="/" element={<ExplorePage />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/organizer" element={<OrgDashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SigninPage />} />
        </Routes>
        <footer className="border-t py-10 text-center text-sm text-gray-500 dark:border-gray-800">
          <Container>
-            <p>© {new Date().getFullYear()} Mivora • Crafted with ♥︎</p>
          </Container>
        </footer>
      </div>
    </BrowserRouter>
  );
}
