// src/components/shared/AppShell.jsx
import { Outlet } from "react-router-dom";
import { NavBar } from "./NavBar";
import { ToastContainer } from "./ToastContainer";

export function AppShell({ toasts, removeToast }) {
  return (
    <div data-ui="app">
      {/* Toasts should be global so every page can use them */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <header data-ui="header">
        <NavBar />
      </header>

      <main data-ui="main">
        <Outlet />
      </main>

      <footer data-ui="footer">
        <p>© {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
