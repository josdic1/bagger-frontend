// src/components/shared/NavBar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useToastTrigger } from "../../hooks/useToast";
import { useAuth } from "../../hooks/useAuth";

export function NavBar() {
  const nav = useNavigate();
  const { addToast } = useToastTrigger();
  const { user, logout } = useAuth();

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

        <Link to="/data" data-ui="nav-link">
          Home
        </Link>
        <Link to="/topics" data-ui="nav-link">
          Topics
        </Link>

        <Link to="/topic/new" data-ui="nav-link">
          +
        </Link>
      </div>

      <Link to="/platforms" data-ui="nav-link">
        Platforms
      </Link>
      <Link to="/cheats" data-ui="nav-link">
        Cheats
      </Link>

      <Link to="/platform/new" data-ui="nav-link">
        + Platform
      </Link>
      <Link to="/cheat/new" data-ui="nav-link">
        + Cheat
      </Link>

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
          <button
            type="button"
            data-ui="btn"
            style={{ width: "auto" }}
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
