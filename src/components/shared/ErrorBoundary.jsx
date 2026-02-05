import React from "react";
import { Link } from "react-router-dom";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="screen">
        <div className="card card-lg">
          <div className="h1">Something broke.</div>
          <div className="p">
            {String(this.state.error?.message || this.state.error || "Unknown error")}
          </div>
          <div className="row">
            <button className="btn btn-auto" onClick={() => window.location.reload()}>
              Reload
            </button>
            <Link className="link" to="/">Go Home</Link>
          </div>
        </div>
      </div>
    );
  }
}
