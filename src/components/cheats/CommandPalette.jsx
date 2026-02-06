// src/components/cheats/CommandPalette.jsx
import { useEffect, useMemo, useRef, useState } from "react";

export function CommandPalette({
  open = false,
  onClose,
  items = [],
  placeholder = "Type to search…",
  hint = "Enter to open • Esc to close",
}) {
  const inputRef = useRef(null);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  const safeItems = Array.isArray(items) ? items : [];

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return safeItems;

    return safeItems.filter((it) => {
      const hay =
        `${it?.title || ""} ${it?.subtitle || ""} ${it?.keywords || ""}`
          .toLowerCase()
          .trim();
      return hay.includes(query);
    });
  }, [q, safeItems]);

  useEffect(() => {
    if (!open) return;
    setQ("");
    setActive(0);
    const t = setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose?.();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => Math.min(i + 1, filtered.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const item = filtered[active];
        if (item?.onSelect) {
          item.onSelect();
          onClose?.();
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, filtered, active, onClose]);

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
        zIndex: 99999,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(10px)",
        display: "grid",
        placeItems: "center",
        padding: 16,
      }}
    >
      <div data-ui="card" style={{ width: "min(920px, 100%)", padding: 16 }}>
        <div
          data-ui="row"
          style={{ justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}
        >
          <div data-ui="row" style={{ gap: 10, flex: 1 }}>
            <div style={{ opacity: 0.7 }}>⌘</div>
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setActive(0);
              }}
              placeholder={placeholder}
              data-ui="input"
              style={{ height: 38 }}
            />
          </div>

          <button
            type="button"
            data-ui="btn-refresh"
            style={{ height: 34 }}
            onClick={() => onClose?.()}
            title="Close"
          >
            ✕ <span>Close</span>
          </button>
        </div>

        <div style={{ height: 10 }} />

        <div data-ui="hint" style={{ display: "flex", gap: 10, opacity: 0.85 }}>
          <span>Items: {safeItems.length}</span>
          <span>•</span>
          <span>Showing: {filtered.length}</span>
        </div>

        <div style={{ height: 12 }} />
        <div data-ui="divider" />
        <div style={{ height: 12 }} />

        {filtered.length === 0 ? (
          <div data-ui="empty">
            <div data-ui="empty-title">No matches</div>
            <div data-ui="hint">Try a different query.</div>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {filtered.slice(0, 40).map((it, idx) => {
              const isActive = idx === active;
              return (
                <button
                  key={it.id || `${it.title}-${idx}`}
                  type="button"
                  onMouseEnter={() => setActive(idx)}
                  onClick={() => {
                    it?.onSelect?.();
                    onClose?.();
                  }}
                  style={{
                    textAlign: "left",
                    border: "1px solid var(--border)",
                    background: isActive
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(255,255,255,0.02)",
                    borderRadius: 12,
                    padding: 12,
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{ display: "flex", gap: 10, alignItems: "baseline" }}
                  >
                    <div style={{ fontWeight: 900, color: "var(--text-main)" }}>
                      {it.title}
                    </div>
                    {it.subtitle ? (
                      <div style={{ fontSize: 12, opacity: 0.75 }}>
                        {it.subtitle}
                      </div>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div style={{ height: 12 }} />
        <div data-ui="hint">{hint}</div>
      </div>
    </div>
  );
}
