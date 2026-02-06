// src/components/shared/AppShell.jsx
import { Outlet } from "react-router-dom";
import { NavBar } from "./NavBar";
import { ToastContainer } from "./ToastContainer";
import { SyncIndicator } from "./SyncIndicator";

export function AppShell({ toasts, removeToast }) {
  return (
    <div data-ui="app">
      <SyncIndicator />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <header data-ui="header">
        <NavBar />
      </header>
      <main data-ui="main">
        <Outlet /> {/* This renders HomePage, LoginPage, etc. */}
      </main>
      <footer data-ui="footer">
        <p>© 2026 // BAGGER</p>
      </footer>
    </div>
  );
}
