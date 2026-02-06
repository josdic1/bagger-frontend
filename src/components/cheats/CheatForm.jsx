import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../../hooks/useData";

export function CheatForm() {
  const { id } = useParams();
  const nav = useNavigate();
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

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);

    if (!formData.title.trim()) return setErr("Title is required.");
    if (!formData.code.trim()) return setErr("Code is required.");

    setSaving(true);
    try {
      if (inEditMode) {
        await updateCheat(cheatId, formData);
      } else {
        await createCheat(formData);
      }
      nav("/cheats");
    } catch (x) {
      setErr(x?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (inEditMode && !editingCheat) {
    return (
      <div style={{ padding: 16 }}>
        <h2>Cheat not found</h2>
        <button type="button" onClick={() => nav("/cheats")}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0 }}>{inEditMode ? "Edit Cheat" : "New Cheat"}</h1>
        <button type="button" onClick={() => nav("/cheats")} disabled={saving}>
          Cancel
        </button>
      </header>

      <form
        onSubmit={onSubmit}
        style={{ display: "grid", gap: 12, marginTop: 14 }}
      >
        <label style={{ display: "grid", gap: 6 }}>
          <span>Title</span>
          <input
            name="title"
            value={formData.title}
            onChange={onChange}
            disabled={saving}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Code</span>
          <textarea
            name="code"
            value={formData.code}
            onChange={onChange}
            disabled={saving}
            rows={10}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Notes</span>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={onChange}
            disabled={saving}
            rows={4}
          />
        </label>

        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
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
          <div style={{ fontWeight: 700 }}>Platforms</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {platforms.map((p) => (
              <label
                key={p.id}
                style={{ display: "flex", gap: 6, alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  checked={formData.platform_ids.includes(p.id)}
                  onChange={() => toggleId("platform_ids", p.id)}
                  disabled={saving}
                />
                <span>{p.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ fontWeight: 700 }}>Topics</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {topics.map((t) => (
              <label
                key={t.id}
                style={{ display: "flex", gap: 6, alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  checked={formData.topic_ids.includes(t.id)}
                  onChange={() => toggleId("topic_ids", t.id)}
                  disabled={saving}
                />
                <span>{t.name}</span>
              </label>
            ))}
          </div>
        </div>

        {err && <div className="form-error">{err}</div>}

        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : inEditMode ? "Update" : "Create"}
          </button>
          <button
            type="button"
            onClick={() => nav("/cheats")}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
