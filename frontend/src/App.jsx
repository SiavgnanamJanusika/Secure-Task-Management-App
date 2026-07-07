import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";

function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="topbar">
      <div className="brand">
        <span className="brand-mark">Flow</span>
        <span className="brand-tag">Task Ledger</span>
      </div>

      <div className="topbar-links">
        <button onClick={() => navigate("/home")}>Home</button>

        <button onClick={() => navigate("/dashboard")}>Dashboard</button>

        <button onClick={() => navigate("/profile")}>Profile</button>
      </div>

      <div className="topbar-user">
        <span className="role-pill">{user.role}</span>

        <span>{user.full_name}</span>

        <button className="logout-btn" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <TopBar />

      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  );
}