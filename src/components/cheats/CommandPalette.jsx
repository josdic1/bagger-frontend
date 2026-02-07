import { useEffect, useMemo, useRef, useState } from "react";

export function CommandPalette({
  open = false,
  onClose,
  items = [], // This is where your mapped cheats go
  placeholder = "Search snippets...",
}) {
  const inputRef = useRef(null);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  // 1. Search logic inside the palette
  const filtered = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return items;
    return items.filter((it) => {
      const hay = `${it.title} ${it.subtitle} ${it.keywords}`.toLowerCase();
      return words.every((word) => hay.includes(word));
    });
  }, [q, items]);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus?.(), 50);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
        display: "grid",
        placeItems: "center",
        padding: 20,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        data-ui="card"
        style={{
          width: "min(700px, 100%)",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          padding: 0,
          overflow: "hidden",
        }}
      >
        {/* Search Header */}
        <div
          style={{
            padding: 16,
            borderBottom: "1px solid var(--border)",
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <span style={{ opacity: 0.5 }}>⌘</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            placeholder={placeholder}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "white",
              fontSize: "1.1rem",
            }}
          />
        </div>

        {/* Scrollable Results Area */}
        <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
          {filtered.map((it, idx) => (
            <button
              key={it.id || idx}
              onClick={() => {
                it.onSelect?.();
                onClose();
              }}
              onMouseEnter={() => setActive(idx)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                background:
                  idx === active ? "rgba(255,255,255,0.1)" : "transparent",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div style={{ fontWeight: 600, color: "white" }}>{it.title}</div>
              <div style={{ fontSize: "0.85rem", opacity: 0.6 }}>
                {it.subtitle}
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: 20, textAlign: "center", opacity: 0.5 }}>
              No results found.
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: 12,
            borderTop: "1px solid var(--border)",
            fontSize: "0.8rem",
            opacity: 0.5,
            textAlign: "right",
          }}
        >
          {filtered.length} matches
        </div>
      </div>
    </div>
  );
}
