// src/components/cheats/CheatForm.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../../hooks/useData";
import { useToastTrigger } from "../../hooks/useToast";
import { Save, X, ArrowLeft } from "lucide-react";

export function CheatForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const { addToast } = useToastTrigger();

  const inEditMode = Boolean(id);
  const cheatId = inEditMode ? Number(id) : null;

  const {
    cheats = [],
    platforms = [],
    topics = [],
    createCheat,
    updateCheat,
  } = useData();

  const editingCheat = useMemo(() => {
    if (!inEditMode) return null;
    return cheats.find((c) => c.id === cheatId) || null;
  }, [inEditMode, cheatId, cheats]);

  const [formData, setFormData] = useState({
    title: "",
    code: "",
    notes: "",
    is_public: true,
    platform_ids: [],
    topic_ids: [],
  });

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (inEditMode) {
      if (!editingCheat) return;
      setFormData({
        title: editingCheat.title ?? "",
        code: editingCheat.code ?? "",
        notes: editingCheat.notes ?? "",
        is_public: Boolean(editingCheat.is_public),
        platform_ids: Array.isArray(editingCheat.platform_ids)
          ? editingCheat.platform_ids
          : [],
        topic_ids: Array.isArray(editingCheat.topic_ids)
          ? editingCheat.topic_ids
          : [],
      });
    } else {
      setFormData({
        title: "",
        code: "",
        notes: "",
        is_public: true,
        platform_ids: [],
        topic_ids: [],
      });
    }
    setErr(null);
  }, [inEditMode, editingCheat]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleId = (key, idVal) => {
    setFormData((p) => {
      const set = new Set(p[key]);
      if (set.has(idVal)) set.delete(idVal);
      else set.add(idVal);
      return { ...p, [key]: Array.from(set) };
    });
  };

  const ctaColor = "#eb5638";

  const saveBtnStyle = {
    height: 44,
    padding: "0 14px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: `linear-gradient(180deg, ${ctaColor} 0%, rgba(235,86,56,0.90) 60%, rgba(235,86,56,0.82) 100%)`,
    color: "rgba(255,255,255,0.96)",
    fontWeight: 900,
    letterSpacing: 0.2,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    cursor: saving ? "not-allowed" : "pointer",
    boxShadow: "0 16px 40px rgba(0,0,0,0.45), 0 10px 34px rgba(235,86,56,0.18)",
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);

    if (!formData.title.trim()) return setErr("Title is required.");
    if (!formData.code.trim()) return setErr("Code is required.");

    setSaving(true);
    try {
      if (inEditMode) {
        await updateCheat(cheatId, formData);
        addToast({
          type: "success",
          title: "Updated",
          message: "Cheat saved.",
        });
      } else {
        await createCheat(formData);
        addToast({
          type: "success",
          title: "Created",
          message: "Cheat created.",
        });
      }
      nav("/cheats");
    } catch (x) {
      setErr(x?.message || "Save failed.");
      addToast({
        type: "error",
        title: "Save failed",
        message: x?.message || "Unable to save.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (inEditMode && !editingCheat) {
    return (
      <div
        data-ui="card"
        style={{ width: "min(980px, 100%)", margin: "0 auto" }}
      >
        <div data-ui="label">Cheat not found</div>
        <div style={{ height: 10 }} />
        <button
          data-ui="btn-refresh"
          type="button"
          onClick={() => nav("/cheats")}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      </div>
    );
  }

  return (
    <div style={{ width: "min(980px, 100%)", margin: "0 auto", padding: 14 }}>
      <section data-ui="card">
        <div
          data-ui="row"
          style={{ justifyContent: "space-between", flexWrap: "wrap" }}
        >
          <div style={{ display: "grid", gap: 6 }}>
            <div data-ui="title">{inEditMode ? "Edit Cheat" : "New Cheat"}</div>
            <div data-ui="hint">
              {inEditMode
                ? "Update the cheat and save."
                : "Fill it out and create a new cheat."}
            </div>
          </div>

          <div data-ui="row" style={{ gap: 10 }}>
            <button
              data-ui="btn-refresh"
              type="button"
              onClick={() => nav("/cheats")}
              disabled={saving}
              title="Cancel"
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
              placeholder="e.g. CORS: credentials means no *"
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
              style={{ resize: "vertical" }}
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
              placeholder="Optional context, gotchas, links…"
              style={{ resize: "vertical" }}
            />
          </label>

          <label data-ui="row" style={{ gap: 10, alignItems: "center" }}>
            <input
              type="checkbox"
              name="is_public"
              checked={formData.is_public}
              onChange={onChange}
              disabled={saving}
            />
            <span>Public</span>
          </label>

          <div style={{ display: "grid", gap: 8 }}>
            <div data-ui="label">Platforms</div>
            <div data-ui="row" style={{ gap: 10, flexWrap: "wrap" }}>
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
            <div data-ui="row" style={{ gap: 10, flexWrap: "wrap" }}>
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
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {err ? (
            <div data-ui="hint" style={{ color: "rgba(255,120,120,0.95)" }}>
              {err}
            </div>
          ) : null}

          <div
            data-ui="row"
            style={{ gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}
          >
            <button
              type="button"
              data-ui="btn-refresh"
              onClick={() => nav("/cheats")}
              disabled={saving}
            >
              <X size={16} />
              <span>Cancel</span>
            </button>

            <button type="submit" disabled={saving} style={saveBtnStyle}>
              <Save size={16} />
              <span>
                {saving ? "Saving…" : inEditMode ? "Update" : "Create"}
              </span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
