// src/components/platforms/PlatformForm.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../../hooks/useData";
import { useToastTrigger } from "../../hooks/useToast";
import { Save, X, ArrowLeft } from "lucide-react";

export function PlatformForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const { addToast } = useToastTrigger();

  const inEditMode = Boolean(id);
  const platformId = inEditMode ? Number(id) : null;

  const { platforms = [], createPlatform, updatePlatform } = useData();

  const editingPlatform = useMemo(() => {
    if (!inEditMode) return null;
    return platforms.find((p) => p.id === platformId) || null;
  }, [inEditMode, platformId, platforms]);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    type: "language",
  });

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (inEditMode) {
      if (!editingPlatform) return;
      setFormData({
        name: editingPlatform.name ?? "",
        slug: editingPlatform.slug ?? "",
        type: editingPlatform.type ?? "language",
      });
    } else {
      setFormData({ name: "", slug: "", type: "language" });
    }
    setErr(null);
  }, [inEditMode, editingPlatform]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
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

    if (!formData.name.trim()) return setErr("Name is required.");

    setSaving(true);
    try {
      if (inEditMode) {
        await updatePlatform(platformId, formData);
        addToast({
          type: "success",
          title: "Updated",
          message: "Platform saved.",
        });
      } else {
        await createPlatform(formData);
        addToast({
          type: "success",
          title: "Created",
          message: "Platform created.",
        });
      }
      nav("/platforms");
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

  if (inEditMode && !editingPlatform) {
    return (
      <div
        data-ui="card"
        style={{ width: "min(980px, 100%)", margin: "0 auto" }}
      >
        <div data-ui="label">Platform not found</div>
        <div style={{ height: 10 }} />
        <button
          data-ui="btn-refresh"
          type="button"
          onClick={() => nav("/platforms")}
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
            <div data-ui="title">
              {inEditMode ? "Edit Platform" : "New Platform"}
            </div>
            <div data-ui="hint">
              {inEditMode
                ? "Update the platform and save."
                : "Fill it out and create a new platform."}
            </div>
          </div>

          <div data-ui="row" style={{ gap: 10 }}>
            <button
              data-ui="btn-refresh"
              type="button"
              onClick={() => nav("/platforms")}
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
            <span data-ui="label">Name</span>
            <input
              data-ui="input"
              name="name"
              value={formData.name}
              onChange={onChange}
              disabled={saving}
              placeholder="e.g. JavaScript"
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
              placeholder="e.g. javascript"
            />
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
              onClick={() => nav("/platforms")}
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
