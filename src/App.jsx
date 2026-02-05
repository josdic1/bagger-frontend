import { Outlet } from "react-router-dom";
import { NavBar } from "./components/shared/NavBar";
import { ToastContainer } from "./components/shared/ToastContainer";
import { useToast } from "./hooks/useToast";
import { ToastContext } from "./contexts/ToastContext";

export default function App() {
  const { toasts, addToast, removeToast } = useToast();

  return (
    <ToastContext.Provider value={{ addToast }}>
      <div data-ui="app">
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
    </ToastContext.Provider>
  );
}
