// src/components/topics/TopicModal.jsx
import { useEffect } from "react";
import { X, Pencil, Trash2 } from "lucide-react";

export function TopicModal({ open, onClose, topic, onEdit, onDelete }) {
  useEffect(() => {
    function onKey(e) {
      if (!open) return;
      if (e.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !topic) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(12px)",
        display: "grid",
        placeItems: "center",
        padding: 16,
      }}
    >
      <div data-ui="card" style={{ width: "min(720px, 100%)" }}>
        {/* Header */}
        <div data-ui="row" style={{ justifyContent: "space-between" }}>
          <div style={{ display: "grid", gap: 6 }}>
            <div data-ui="title">{topic.name}</div>
            <div data-ui="subtitle">{topic.slug}</div>
          </div>

          <button type="button" data-ui="btn-refresh" onClick={onClose}>
            <X size={16} />
            <span>Close</span>
          </button>
        </div>

        <div style={{ height: 12 }} />
        <div data-ui="divider" />
        <div style={{ height: 12 }} />

        {/* Body */}
        <div data-ui="stack">
          <div data-ui="item">
            <div data-ui="label">Name</div>
            <div data-ui="hint">{topic.name}</div>
          </div>

          <div data-ui="item">
            <div data-ui="label">Slug</div>
            <div data-ui="hint">{topic.slug}</div>
          </div>
        </div>

        <div style={{ height: 16 }} />

        {/* Actions */}
        <div
          data-ui="row"
          style={{ justifyContent: "flex-end", gap: 10, flexWrap: "wrap" }}
        >
          <button
            type="button"
            data-ui="btn-refresh"
            onClick={onEdit}
            title="Edit topic"
          >
            <Pencil size={16} />
            <span>Edit</span>
          </button>

          <button
            type="button"
            data-ui="btn-refresh"
            onClick={onDelete}
            title="Delete topic"
            style={{ borderColor: "rgba(239,68,68,0.35)" }}
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
