import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import AdminLogin from "./components/AdminLogin";

import { DashboardProvider } from "./context/DashboardContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

import "./styles.css";

function ProtectedDashboard() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div className="auth-loading">Loading dashboard...</div>;
  }

  if (!user || !profile || profile.role !== "admin") {
    return <AdminLogin />;
  }

  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <DashboardProvider>
        <ProtectedDashboard />
      </DashboardProvider>
    </AuthProvider>
  </React.StrictMode>
);