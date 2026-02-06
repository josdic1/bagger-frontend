// src/components/cheats/CheatItem.jsx
import { useMemo } from "react";
import { Eye, Pencil, Copy } from "lucide-react";
import { useToastTrigger } from "../../hooks/useToast";

function uniqInts(arr) {
  return Array.from(
    new Set((Array.isArray(arr) ? arr : []).filter(Number.isFinite)),
  );
}

async function copyText(text) {
  const s = String(text ?? "");
  if (!s) return false;

  try {
    await navigator.clipboard.writeText(s);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = s;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }
}

export function CheatItem({ cheat, platformById, topicById, onView, onEdit }) {
  const { addToast } = useToastTrigger();

  const platformNames = useMemo(() => {
    const ids = uniqInts(cheat?.platform_ids);
    return ids.map((id) => platformById?.get(id)?.name).filter(Boolean);
  }, [cheat?.platform_ids, platformById]);

  const topicNames = useMemo(() => {
    const ids = uniqInts(cheat?.topic_ids);
    return ids.map((id) => topicById?.get(id)?.name).filter(Boolean);
  }, [cheat?.topic_ids, topicById]);

  const onCopy = async () => {
    const ok = await copyText(cheat?.code || "");
    addToast({
      type: ok ? "success" : "error",
      title: ok ? "Copied" : "Copy failed",
      message: ok
        ? "Code copied to clipboard."
        : "Clipboard blocked by the browser.",
    });
  };

  const preview = String(cheat?.code || "");
  const previewText = preview.slice(0, 140);

  return (
    <div data-ui="item">
      <div
        data-ui="row"
        style={{ justifyContent: "space-between", alignItems: "start" }}
      >
        <div style={{ display: "grid", gap: 4 }}>
          <div data-ui="item-title">{cheat.title}</div>
          <div data-ui="item-meta">
            {cheat.is_public ? "Public" : "Private"} •{" "}
            {(cheat.platform_ids || []).length} platforms •{" "}
            {(cheat.topic_ids || []).length} topics
          </div>

          {platformNames.length || topicNames.length ? (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 6,
              }}
            >
              {platformNames.slice(0, 3).map((n) => (
                <span key={`p-${n}`} data-ui="pill">
                  {n}
                </span>
              ))}
              {topicNames.slice(0, 3).map((n) => (
                <span key={`t-${n}`} data-ui="pill" data-variant="info">
                  {n}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div data-ui="row" style={{ gap: 8 }}>
          <button
            type="button"
            data-ui="btn-refresh"
            onClick={onCopy}
            title="Copy code"
          >
            <Copy size={16} />
            <span>Copy</span>
          </button>
          <button
            type="button"
            data-ui="btn-refresh"
            onClick={onView}
            title="View"
          >
            <Eye size={16} />
            <span>View</span>
          </button>
          <button
            type="button"
            data-ui="btn-refresh"
            onClick={onEdit}
            title="Edit"
          >
            <Pencil size={16} />
            <span>Edit</span>
          </button>
        </div>
      </div>

      <div data-ui="item-code">
        {previewText}
        {preview.length > 140 ? "…" : ""}
      </div>
    </div>
  );
}
