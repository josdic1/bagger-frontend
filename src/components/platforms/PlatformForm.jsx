import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../../hooks/useData";

export function PlatformForm() {
  const { id } = useParams();
  const nav = useNavigate();
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

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);

    if (!formData.name.trim()) return setErr("Name is required.");

    setSaving(true);
    try {
      if (inEditMode) {
        await updatePlatform(platformId, formData);
      } else {
        await createPlatform(formData);
      }
      nav("/platforms");
    } catch (x) {
      setErr(x?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (inEditMode && !editingPlatform) {
    return (
      <div style={{ padding: 16 }}>
        <h2>Platform not found</h2>
        <button type="button" onClick={() => nav("/platforms")}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0 }}>
          {inEditMode ? "Edit Platform" : "New Platform"}
        </h1>
        <button
          type="button"
          onClick={() => nav("/platforms")}
          disabled={saving}
        >
          Cancel
        </button>
      </header>

      <form
        onSubmit={onSubmit}
        style={{ display: "grid", gap: 12, marginTop: 14 }}
      >
        <label style={{ display: "grid", gap: 6 }}>
          <span>Name</span>
          <input
            name="name"
            value={formData.name}
            onChange={onChange}
            disabled={saving}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Slug</span>
          <input
            name="slug"
            value={formData.slug}
            onChange={onChange}
            disabled={saving}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Type</span>
          <select
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

        {err && <div className="form-error">{err}</div>}

        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : inEditMode ? "Update" : "Create"}
          </button>
          <button
            type="button"
            onClick={() => nav("/platforms")}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
