import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToastTrigger } from "./src/hooks/useToast";
import { GlobeLock } from "lucide-react";

export function LoginPage() {
  const nav = useNavigate();
  const { addToast } = useToastTrigger();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      if (!email || !password) {
        addToast({
          type: "error",
          title: "Missing info",
          message: "Enter email and password.",
        });
        return;
      }

      localStorage.setItem("token", "demo-token");
      addToast({
        type: "success",
        title: "Welcome back",
        message: "Logged in.",
      });
      nav("/", { replace: true });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div data-ui="auth-page">
      <form data-ui="auth-form" onSubmit={onSubmit}>
        <div data-ui="auth-header">
          <div data-ui="row" style={{ justifyContent: "center", gap: 10 }}>
            <div data-ui="title" style={{ fontSize: 22 }}>
              Bagger
            </div>
            <button
              type="button"
              onClick={() => {
                setEmail("josh@josh.com");
                setPassword("1111");
              }}
              style={{
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <GlobeLock
                size={22}
                stroke="var(--text-main)"
                strokeWidth={1.8}
              />
            </button>
          </div>

          <div data-ui="auth-subtitle">Authenticate session</div>
        </div>

        <div data-ui="stack">
          <input
            data-ui="input"
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            data-ui="input"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button data-ui="btn" type="submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Authorize"}
          </button>
        </div>

        <div data-ui="auth-footer">
          New here?{" "}
          <Link
            to="/signup"
            style={{ color: "var(--accent)", fontWeight: 900 }}
          >
            Create account
          </Link>
        </div>
      </form>
    </div>
  );
}
