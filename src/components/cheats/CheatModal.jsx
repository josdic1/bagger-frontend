// src/components/cheats/CheatModal.jsx
import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { useData } from "../../hooks/useData";
import { useToastTrigger } from "../../hooks/useToast";

function uniqInts(arr) {
  return Array.from(
    new Set((Array.isArray(arr) ? arr : []).filter(Number.isFinite)),
  );
}

export function CheatModal({ open, onClose, mode, cheat }) {
  const { platforms = [], topics = [], createCheat, updateCheat } = useData();
  const { addToast } = useToastTrigger();

  const inEditMode = mode === "edit" && cheat?.id;

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  const initial = useMemo(() => {
    if (inEditMode && cheat) {
      return {
        title: cheat.title ?? "",
        code: cheat.code ?? "",
        notes: cheat.notes ?? "",
        is_public: Boolean(cheat.is_public),
        platform_ids: uniqInts(cheat.platform_ids),
        topic_ids: uniqInts(cheat.topic_ids),
      };
    }
    return {
      title: "",
      code: "",
      notes: "",
      is_public: true,
      platform_ids: [],
      topic_ids: [],
    };
  }, [inEditMode, cheat]);

  const [formData, setFormData] = useState(initial);

  useEffect(() => {
    if (!open) return;

    // Only reset form when modal opens, not when cheat updates
    const newInitial =
      inEditMode && cheat
        ? {
            title: cheat.title ?? "",
            code: cheat.code ?? "",
            notes: cheat.notes ?? "",
            is_public: Boolean(cheat.is_public),
            platform_ids: uniqInts(cheat.platform_ids),
            topic_ids: uniqInts(cheat.topic_ids),
          }
        : {
            title: "",
            code: "",
            notes: "",
            is_public: true,
            platform_ids: [],
            topic_ids: [],
          };

    setFormData(newInitial);
    setErr(null);
    setSaving(false);
  }, [open]); // ONLY depend on 'open', not 'initial'

  if (!open) return null;

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleId = (key, idVal) => {
    setFormData((p) => {
      const s = new Set(p[key]);
      if (s.has(idVal)) s.delete(idVal);
      else s.add(idVal);
      return { ...p, [key]: Array.from(s) };
    });
  };

  const canSave =
    Boolean(formData.title.trim()) && Boolean(formData.code.trim()) && !saving;

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);

    if (!formData.title.trim()) return setErr("Title is required.");
    if (!formData.code.trim()) return setErr("Code is required.");

    setSaving(true);
    try {
      if (inEditMode) {
        await updateCheat(cheat.id, formData);
        addToast({
          type: "success",
          title: "Updated",
          message: "Cheat updated.",
        });
      } else {
        await createCheat(formData);
        addToast({
          type: "success",
          title: "Created",
          message: "Cheat created.",
        });
      }
      onClose?.();
    } catch (x) {
      const msg = x?.message || "Save failed.";
      setErr(msg);
      addToast({ type: "error", title: "Save failed", message: msg });
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
        zIndex: 9999,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(8px)",
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
            <div data-ui="title">{inEditMode ? "Edit Cheat" : "New Cheat"}</div>
            <div data-ui="subtitle">
              No scroll. Clean. Fast. Keyboard-first.
            </div>
          </div>

          <button
            type="button"
            data-ui="btn-refresh"
            onClick={onClose}
            disabled={saving}
            title="Close"
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
            <span data-ui="label">Title</span>
            <input
              data-ui="input"
              name="title"
              value={formData.title}
              onChange={onChange}
              disabled={saving}
              placeholder="Short, searchable title"
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span data-ui="label">Code</span>
            <textarea
              data-ui="input"
              name="code"
              value={formData.code}
              onChange={onChange}
              disabled={saving}
              rows={10}
              placeholder="Paste code here…"
              style={{
                fontFamily:
                  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono","Courier New", monospace',
                fontSize: 12,
                lineHeight: "16px",
                resize: "none",
                whiteSpace: "pre",
              }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span data-ui="label">Notes</span>
            <textarea
              data-ui="input"
              name="notes"
              value={formData.notes}
              onChange={onChange}
              disabled={saving}
              rows={3}
              placeholder="Optional notes…"
              style={{ resize: "none" }}
            />
          </label>

          <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              type="checkbox"
              name="is_public"
              checked={formData.is_public}
              onChange={onChange}
              disabled={saving}
            />
            <span style={{ fontWeight: 900 }}>Public</span>
            <span data-ui="hint">Seed cheats should be Public.</span>
          </label>

          <div style={{ display: "grid", gap: 8 }}>
            <div data-ui="label">Platforms</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {platforms.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  data-ui="chip"
                  data-active={
                    formData.platform_ids.includes(p.id) ? "true" : "false"
                  }
                  onClick={() => toggleId("platform_ids", p.id)}
                  disabled={saving}
                  title={p.slug}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <div data-ui="label">Topics</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {topics.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  data-ui="chip"
                  data-active={
                    formData.topic_ids.includes(t.id) ? "true" : "false"
                  }
                  onClick={() => toggleId("topic_ids", t.id)}
                  disabled={saving}
                  title={t.slug}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {err ? (
            <div data-ui="empty">
              <div data-ui="empty-title">Fix this</div>
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

            <button type="submit" data-ui="btn-refresh" disabled={!canSave}>
              {saving ? "Saving…" : inEditMode ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
