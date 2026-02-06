// src/components/platforms/PlatformViewModal.jsx
import { useEffect, useMemo, useState } from "react";
import { X, Pencil, Trash2, Copy } from "lucide-react";
import { useData } from "../../hooks/useData";
import { useToastTrigger } from "../../hooks/useToast";

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

export function PlatformViewModal({
  open,
  onClose,
  platform,
  usedCount = 0,
  onEdit,
}) {
  const { deletePlatform } = useData();
  const { addToast } = useToastTrigger();
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    function onKey(e) {
      if (!open) return;
      if (e.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setDeleting(false);
  }, [open]);

  const summary = useMemo(() => {
    if (!platform) return "";
    return `${platform.name} • ${platform.slug} • ${platform.type}`;
  }, [platform]);

  if (!open) return null;

  const onCopy = async () => {
    const ok = await copyText(summary);
    addToast({
      type: ok ? "success" : "error",
      title: ok ? "Copied" : "Copy failed",
      message: ok
        ? "Platform summary copied."
        : "Clipboard blocked by the browser.",
    });
  };

  const onDelete = async () => {
    if (!platform?.id) return;
    if (!confirm(`Delete platform "${platform.name}"?`)) return;

    setDeleting(true);
    try {
      await deletePlatform(platform.id);
      addToast({
        type: "success",
        title: "Deleted",
        message: "Platform removed.",
      });
      onClose?.();
    } catch (e) {
      addToast({
        type: "error",
        title: "Delete blocked",
        message: e?.message || "This platform may be in use by cheats.",
      });
      setDeleting(false);
    }
  };

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
      <div data-ui="card" style={{ width: "min(820px, 100%)" }}>
        <div
          data-ui="row"
          style={{ justifyContent: "space-between", alignItems: "start" }}
        >
          <div style={{ display: "grid", gap: 6 }}>
            <div data-ui="title">{platform?.name || "Platform"}</div>
            <div data-ui="subtitle">
              {platform?.slug || ""} • {platform?.type || ""} • Used by{" "}
              {usedCount} cheats
            </div>
          </div>

          <button
            type="button"
            data-ui="btn-refresh"
            onClick={onClose}
            disabled={deleting}
          >
            <X size={16} />
            <span>Close</span>
          </button>
        </div>

        <div style={{ height: 12 }} />
        <div data-ui="divider" />
        <div style={{ height: 12 }} />

        <div style={{ display: "grid", gap: 12 }}>
          <div data-ui="item-code">{summary}</div>

          <div data-ui="row" style={{ justifyContent: "flex-end", gap: 10 }}>
            <button
              type="button"
              data-ui="btn-refresh"
              onClick={onCopy}
              disabled={deleting || !platform}
            >
              <Copy size={16} />
              <span>Copy</span>
            </button>

            <button
              type="button"
              data-ui="btn-refresh"
              onClick={onEdit}
              disabled={deleting || !platform?.id}
            >
              <Pencil size={16} />
              <span>Edit</span>
            </button>

            <button
              type="button"
              data-ui="btn-refresh"
              onClick={onDelete}
              disabled={deleting || !platform?.id}
            >
              <Trash2 size={16} />
              <span>{deleting ? "Deleting…" : "Delete"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
