import React, { useMemo } from "react";
import { Eye, Pencil, Copy } from "lucide-react";
import { useToastTrigger } from "../../hooks/useToast";

// Helper for highlighting search matches
function HighlightText({ text, query }) {
  if (!query?.trim()) return <span>{text}</span>;
  const words = query.trim().split(/\s+/).filter(Boolean);
  const regex = new RegExp(`(${words.join("|")})`, "gi");
  const parts = String(text || "").split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            style={{
              backgroundColor: "rgba(255, 211, 61, 0.4)",
              color: "#fff",
              borderRadius: "2px",
              padding: "0 1px",
            }}
          >
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </span>
  );
}

// Robust copy helper
async function copyText(text) {
  const s = String(text ?? "");
  if (!s) return false;
  try {
    await navigator.clipboard.writeText(s);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = s;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }
}

export function CheatItem({
  cheat,
  query,
  platformById,
  topicById,
  onView,
  onEdit,
}) {
  const { addToast } = useToastTrigger();

  const platformNames = useMemo(() => {
    return (cheat?.platform_ids || [])
      .map((id) => platformById?.get(id)?.name)
      .filter(Boolean);
  }, [cheat?.platform_ids, platformById]);

  const onCopy = async (e) => {
    e.stopPropagation(); // Don't trigger the card's onClick
    const ok = await copyText(cheat?.code || "");
    addToast({
      type: ok ? "success" : "error",
      title: ok ? "Copied" : "Copy failed",
      message: ok ? "Code copied to clipboard." : "Clipboard blocked.",
    });
  };

  return (
    <div
      data-ui="item"
      onClick={onView}
      style={{ cursor: "pointer", padding: "12px" }}
    >
      <div
        data-ui="row"
        style={{ justifyContent: "space-between", alignItems: "start" }}
      >
        <div style={{ display: "grid", gap: 4 }}>
          <div
            data-ui="item-title"
            style={{ fontWeight: 800, fontSize: "1rem" }}
          >
            <HighlightText text={cheat.title} query={query} />
          </div>

          <div
            data-ui="item-meta"
            style={{ fontSize: "0.85rem", opacity: 0.8 }}
          >
            <HighlightText text={cheat.notes} query={query} />
          </div>

          <div
            style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}
          >
            {platformNames.map((n) => (
              <span
                key={n}
                data-ui="pill"
                style={{ fontSize: "10px", padding: "2px 6px" }}
              >
                {n}
              </span>
            ))}
          </div>
        </div>

        <div data-ui="row" style={{ gap: 6 }}>
          <button
            type="button"
            data-ui="btn-refresh"
            onClick={onCopy}
            title="Copy code"
            style={{ padding: "4px 8px", height: "auto" }}
          >
            <Copy size={14} />
          </button>
          <button
            type="button"
            data-ui="btn-refresh"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            title="Edit"
            style={{ padding: "4px 8px", height: "auto" }}
          >
            <Pencil size={14} />
          </button>
        </div>
      </div>

      <div data-ui="item-code" style={{ marginTop: 8 }}>
        <pre
          style={{
            margin: 0,
            whiteSpace: "pre-wrap",
            fontSize: "0.8rem",
            maxHeight: "100px",
            overflow: "hidden",
          }}
        >
          <code>
            {cheat.code.slice(0, 100)}
            {cheat.code.length > 100 ? "..." : ""}
          </code>
        </pre>
      </div>
    </div>
  );
}
