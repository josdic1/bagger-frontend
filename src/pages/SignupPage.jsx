import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { UserPlus } from "lucide-react";

export function SignupPage() {
  const { user, signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const onFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signup(formData);

    setLoading(false);

    if (result.success) navigate("/");
    else setError(result.error);
  };

  const rootState = ["page", loading && "is-loading", error && "has-error"]
    .filter(Boolean)
    .join(" ");

  return (
    <div data-ui="auth" className={rootState}>
      <div data-ui="card">
        <header data-ui="header">
          <UserPlus size={36} />
          <h1>Create account</h1>
          <p>Establish credentials</p>
        </header>

        <form onSubmit={handleSubmit} data-ui="form">
          {error && <div data-ui="error">{error}</div>}

          <input
            data-ui="input"
            name="name"
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={onFormChange}
            required
          />

          <input
            data-ui="input"
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={onFormChange}
            required
          />

          <input
            data-ui="input"
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={onFormChange}
            required
          />

          <button data-ui="button" type="submit" disabled={loading}>
            {loading ? "Creating…" : "Create"}
          </button>

          <p data-ui="link">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
