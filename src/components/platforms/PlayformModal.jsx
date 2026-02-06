// src/components/platforms/PlatformModal.jsx
import { useEffect, useMemo, useState } from "react";
import { X, Save } from "lucide-react";
import { useData } from "../../hooks/useData";
import { useToastTrigger } from "../../hooks/useToast";

function slugify(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function PlatformModal({ open, onClose, mode = "new", platform }) {
  const { createPlatform, updatePlatform } = useData();
  const { addToast } = useToastTrigger();

  const inEditMode = mode === "edit" && platform?.id;

  const initial = useMemo(
    () => ({
      name: platform?.name ?? "",
      slug: platform?.slug ?? "",
      type: platform?.type ?? "language",
    }),
    [platform],
  );

  const [formData, setFormData] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);
  const [autoSlug, setAutoSlug] = useState(true);

  useEffect(() => {
    if (!open) return;
    setFormData(initial);
    setErr(null);
    setSaving(false);
    setAutoSlug(true);
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    if (!autoSlug) return;
    setFormData((p) => ({ ...p, slug: slugify(p.name) }));
  }, [open, autoSlug, formData.name]);

  useEffect(() => {
    function onKey(e) {
      if (!open) return;
      if (e.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));

    if (name === "slug") setAutoSlug(false);
    if (name === "name" && autoSlug) {
      // slug updated by effect
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);

    if (!formData.name.trim()) return setErr("Name is required.");

    const payload = {
      name: formData.name.trim(),
      slug: formData.slug?.trim()
        ? formData.slug.trim()
        : slugify(formData.name),
      type: formData.type || "language",
    };

    setSaving(true);
    try {
      if (inEditMode) {
        await updatePlatform(platform.id, payload);
        addToast({
          type: "success",
          title: "Updated",
          message: "Platform updated.",
        });
      } else {
        await createPlatform(payload);
        addToast({
          type: "success",
          title: "Created",
          message: "Platform created.",
        });
      }
      onClose?.();
    } catch (x) {
      setErr(x?.message || "Save failed.");
    } finally {
      setSaving(false);
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
            <div data-ui="title">
              {inEditMode ? "Edit Platform" : "New Platform"}
            </div>
            <div data-ui="subtitle">Name, slug, type. No surprises.</div>
          </div>

          <button
            type="button"
            data-ui="btn-refresh"
            onClick={onClose}
            disabled={saving}
          >
            <X size={16} />
            <span>Close</span>
          </button>
        </div>

        <div style={{ height: 12 }} />
        <div data-ui="divider" />
        <div style={{ height: 12 }} />

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span data-ui="label">Name</span>
            <input
              data-ui="input"
              name="name"
              value={formData.name}
              onChange={onChange}
              disabled={saving}
              autoFocus
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span data-ui="label">Slug</span>
            <input
              data-ui="input"
              name="slug"
              value={formData.slug}
              onChange={onChange}
              disabled={saving}
            />
            <div data-ui="hint">
              Auto-slug is {autoSlug ? "ON" : "OFF"} (editing slug turns it
              off).
            </div>
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span data-ui="label">Type</span>
            <select
              data-ui="input"
              name="type"
              value={formData.type}
              onChange={onChange}
              disabled={saving}
            >
              <option value="language">language</option>
              <option value="framework">framework</option>
              <option value="tool">tool</option>
              <option value="format">format</option>
            </select>
          </label>

          {err ? (
            <div data-ui="empty" style={{ borderStyle: "solid" }}>
              <div data-ui="empty-title">Save failed</div>
              <div data-ui="hint">{err}</div>
            </div>
          ) : null}

          <div data-ui="row" style={{ justifyContent: "flex-end", gap: 10 }}>
            <button
              type="button"
              data-ui="btn-refresh"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" data-ui="btn-refresh" disabled={saving}>
              <Save size={16} />
              <span>
                {saving ? "Saving…" : inEditMode ? "Update" : "Create"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
