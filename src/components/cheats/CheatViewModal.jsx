// src/components/cheats/CheatViewModal.jsx
import { useEffect, useMemo } from "react";
import { X, Copy, Pencil, Trash2 } from "lucide-react";

function idsToNames(all = [], ids = []) {
  const map = new Map(all.map((x) => [x.id, x.name]));
  return (ids || []).map((id) => map.get(id)).filter(Boolean);
}

export function CheatViewModal({
  open,
  onClose,
  cheat,
  platforms = [],
  topics = [],
  onCopy,
  onEdit,
  onDelete,
}) {
  useEffect(() => {
    function onKey(e) {
      if (!open) return;
      if (e.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const platformNames = useMemo(
    () => idsToNames(platforms, cheat?.platform_ids || []),
    [platforms, cheat?.platform_ids],
  );

  const topicNames = useMemo(
    () => idsToNames(topics, cheat?.topic_ids || []),
    [topics, cheat?.topic_ids],
  );

  if (!open) return null;

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
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(10px)",
        display: "grid",
        placeItems: "center",
        padding: 16,
      }}
    >
      <div data-ui="card" style={{ width: "min(980px, 100%)" }}>
        <div
          data-ui="row"
          style={{ justifyContent: "space-between", alignItems: "start" }}
        >
          <div style={{ display: "grid", gap: 6 }}>
            <div data-ui="title">{cheat?.title || "Cheat"}</div>
            <div data-ui="subtitle">
              {cheat?.is_public ? "Public" : "Private"} •{" "}
              {(cheat?.platform_ids || []).length} platforms •{" "}
              {(cheat?.topic_ids || []).length} topics
            </div>
          </div>

          <button type="button" data-ui="btn-refresh" onClick={onClose}>
            <X size={16} />
            <span>Close</span>
          </button>
        </div>

        <div style={{ height: 12 }} />
        <div data-ui="divider" />
        <div style={{ height: 12 }} />

        <div style={{ display: "grid", gap: 12 }}>
          {platformNames.length ? (
            <div data-ui="row" style={{ gap: 8, flexWrap: "wrap" }}>
              {platformNames.map((n) => (
                <span key={n} data-ui="pill">
                  {n}
                </span>
              ))}
            </div>
          ) : null}

          {topicNames.length ? (
            <div data-ui="row" style={{ gap: 8, flexWrap: "wrap" }}>
              {topicNames.map((n) => (
                <span key={n} data-ui="pill">
                  {n}
                </span>
              ))}
            </div>
          ) : null}

          {cheat?.notes ? (
            <div data-ui="item">
              <div data-ui="label">Notes</div>
              <div data-ui="hint" style={{ whiteSpace: "pre-wrap" }}>
                {cheat.notes}
              </div>
            </div>
          ) : null}

          <div data-ui="item">
            <div data-ui="label">Code</div>
            <div
              data-ui="item-code"
              style={{ maxHeight: 420, overflow: "auto" }}
            >
              {String(cheat?.code || "")}
            </div>
          </div>

          <div
            data-ui="row"
            style={{ justifyContent: "flex-end", gap: 10, flexWrap: "wrap" }}
          >
            <button
              type="button"
              data-ui="btn-refresh"
              onClick={onCopy}
              disabled={!cheat?.code}
            >
              <Copy size={16} />
              <span>Copy</span>
            </button>

            <button
              type="button"
              data-ui="btn-refresh"
              onClick={onEdit}
              disabled={!cheat?.id}
            >
              <Pencil size={16} />
              <span>Edit</span>
            </button>

            <button
              type="button"
              data-ui="btn-refresh"
              onClick={onDelete}
              disabled={!cheat?.id}
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
