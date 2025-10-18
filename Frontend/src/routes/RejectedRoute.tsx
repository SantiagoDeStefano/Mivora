// src/routes/RejectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../contexts/app.context";
import path from "../constants/path";

export default function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext);
  return !isAuthenticated ? <Outlet /> : <Navigate to={path.home} replace />;
}
