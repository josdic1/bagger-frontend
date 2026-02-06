// src/components/shared/NavBar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToastTrigger } from "../../hooks/useToast";
import { useAuth } from "../../hooks/useAuth";
import { Activity } from "lucide-react";

export function NavBar({ onOpenPalette }) {
  const nav = useNavigate();
  const location = useLocation();
  const { addToast } = useToastTrigger();
  const { user, logout } = useAuth();

  const isDataActive = location.pathname === "/data";

  function handleLogout() {
    logout();

    addToast({
      type: "success",
      title: "Logged out",
      message: "Session cleared.",
    });

    nav("/login", { replace: true });
  }

  return (
    <div data-ui="navbar">
      <div data-ui="nav-left">
        <Link to="/" data-ui="brand" style={{ textDecoration: "none" }}>
          // BAGGER
        </Link>

        <Link to="/" data-ui="nav-link">
          Home
        </Link>
        <Link to="/topics" data-ui="nav-link">
          Topics
        </Link>
        <Link to="/platforms" data-ui="nav-link">
          Platforms
        </Link>
        <Link to="/cheats" data-ui="nav-link">
          Cheats
        </Link>

        <button
          type="button"
          data-ui="btn-refresh"
          style={{ height: 32 }}
          onClick={() => onOpenPalette?.()}
          title="Command palette (Cmd+K / Ctrl+K)"
        >
          Palette
        </button>

        {/* DEFCON Dashboard Link */}
        <Link
          to="/data"
          data-ui="nav-link"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <Activity
            size={20}
            strokeWidth={2.5}
            style={{
              color: isDataActive ? "#00f2ff" : "inherit",
              filter: isDataActive ? "drop-shadow(0 0 5px #00f2ff)" : "none",
              transition: "all 0.3s ease",
            }}
          />
          <span>Data</span>
        </Link>
      </div>

      <div data-ui="nav-right">
        {!user ? (
          <>
            <Link to="/login" data-ui="nav-link">
              Login
            </Link>
            <Link to="/signup" data-ui="nav-link">
              Signup
            </Link>
          </>
        ) : (
          <>
            <Link to="/cheat/new" data-ui="nav-link">
              + Cheat
            </Link>
            <Link to="/topic/new" data-ui="nav-link">
              + Topic
            </Link>
            <Link to="/platform/new" data-ui="nav-link">
              + Platform
            </Link>

            <button
              type="button"
              data-ui="btn"
              style={{ width: "auto" }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
