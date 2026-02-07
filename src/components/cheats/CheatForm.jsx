// src/components/cheats/CheatForm.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, X } from "lucide-react";
import { useData } from "../../hooks/useData";
import { useToastTrigger } from "../../hooks/useToast";

function uniqInts(arr) {
  return Array.from(
    new Set((Array.isArray(arr) ? arr : []).filter(Number.isFinite)),
  );
}

export function CheatForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const { addToast } = useToastTrigger();

  const cheatId = useMemo(() => {
    const n = Number(id);
    return Number.isFinite(n) ? n : null;
  }, [id]);

  const inEditMode = Boolean(cheatId);

  const {
    cheats = [],
    platforms = [],
    topics = [],
    createCheat,
    updateCheat,
  } = useData();

  const editingCheat = useMemo(() => {
    if (!inEditMode) return null;
    return (Array.isArray(cheats) ? cheats : []).find((c) => c.id === cheatId) || null;
  }, [inEditMode, cheatId, cheats]);

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  const initial = useMemo(() => {
    if (inEditMode && editingCheat) {
      return {
        title: editingCheat.title ?? "",
        code: editingCheat.code ?? "",
        notes: editingCheat.notes ?? "",
        is_public: Boolean(editingCheat.is_public),
        platform_ids: uniqInts(editingCheat.platform_ids),
        topic_ids: uniqInts(editingCheat.topic_ids),
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
  }, [inEditMode, editingCheat]);

  const [formData, setFormData] = useState(initial);

  useEffect(() => {
    setFormData(initial);
    setErr(null);
    setSaving(false);
  }, [initial]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") nav("/cheats");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nav]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleId = (key, idVal) => {
    setFormData((p) => {
      const s = new Set(uniqInts(p[key]));
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
      const payload = {
        ...formData,
        platform_ids: uniqInts(formData.platform_ids),
        topic_ids: uniqInts(formData.topic_ids),
      };

      if (inEditMode) {
        await updateCheat(cheatId, payload);
        addToast({ type: "success", title: "Updated", message: "Cheat saved." });
      } else {
        await createCheat(payload);
        addToast({ type: "success", title: "Created", message: "Cheat created." });
      }

      nav("/cheats");
    } catch (x) {
      const msg = x?.message || "Save failed.";
      setErr(msg);
      addToast({ type: "error", title: "Save failed", message: msg });
    } finally {
      setSaving(false);
    }
  };

  if (inEditMode && !editingCheat) {
    return (
      <div data-ui="card" style={{ width: "min(980px, 100%)", margin: "0 auto" }}>
        <div data-ui="title">Cheat not found</div>
        <div style={{ height: 10 }} />
        <button data-ui="btn-refresh" type="button" onClick={() => nav("/cheats")}>
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      </div>
    );
  }

  return (
    <div style={{ width: "min(980px, 100%)", margin: "0 auto", padding: 14 }}>
      <section data-ui="card">
        <div data-ui="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          <div style={{ display: "grid", gap: 6 }}>
            <div data-ui="title">{inEditMode ? "Edit Cheat" : "New Cheat"}</div>
            <div data-ui="subtitle">No scroll. Clean. Fast. Keyboard-first.</div>
          </div>

          <div data-ui="row" style={{ gap: 10 }}>
            <button
              data-ui="btn-refresh"
              type="button"
              onClick={() => nav("/cheats")}
              disabled={saving}
              title="Cancel (Esc)"
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
          </div>
        </div>

        <div style={{ height: 14 }} />
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
                resize: "vertical",
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
              rows={4}
              placeholder="Optional notes…"
              style={{ resize: "vertical" }}
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
                  data-active={formData.platform_ids.includes(p.id) ? "true" : "false"}
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
                  data-active={formData.topic_ids.includes(t.id) ? "true" : "false"}
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

          <div data-ui="row" style={{ gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
            <button
              type="button"
              data-ui="btn-refresh"
              onClick={() => nav("/cheats")}
              disabled={saving}
            >
              <X size={16} />
              <span>Cancel</span>
            </button>

            <button type="submit" data-ui="btn-refresh" disabled={!canSave}>
              <Save size={16} />
              <span>{saving ? "Saving…" : inEditMode ? "Update" : "Create"}</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
