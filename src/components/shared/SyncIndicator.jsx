// src/components/common/SyncIndicator.jsx
import { useData } from "../../hooks/useData";

export function SyncIndicator() {
  const { refreshing } = useData();
  if (!refreshing) return null;

  return (
    <div
      data-ui="toast"
      style={{ position: "fixed", bottom: 16, right: 16, zIndex: 10000 }}
    >
      <div data-ui="toast-dot" data-variant="warning" />
      <div style={{ display: "grid", gap: 2 }}>
        <div data-ui="toast-title">Syncing</div>
        <div data-ui="toast-msg">Refreshing data…</div>
      </div>
    </div>
  );
}
