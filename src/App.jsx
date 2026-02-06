import { useToast } from "./hooks/useToast";
import { useAuth } from "./hooks/useAuth";
import { ToastContext } from "./contexts/ToastContext";
import { AppShell } from "./components/shared/AppShell";

export default function App() {
  const { loading } = useAuth(); // The Gatekeeper
  const { toasts, addToast, removeToast } = useToast();

  // If AuthProvider is still talking to the DB, don't show the UI yet
  if (loading) {
    return <div className="app-init">// BAGGER :: VERIFYING SESSION...</div>;
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      <AppShell toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}
