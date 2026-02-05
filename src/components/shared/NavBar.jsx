import { Link, useNavigate } from "react-router-dom";
import { useToastTrigger } from "../../hooks/useToast";

export function NavBar() {
  const nav = useNavigate();
  const { addToast } = useToastTrigger();

  const token = localStorage.getItem("token");

  function logout() {
    localStorage.removeItem("token");

    addToast({
      type: "success",
      title: "Logged out",
      message: "Token cleared.",
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
      </div>

      <div data-ui="nav-right">
        {!token ? (
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
            onClick={logout}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
