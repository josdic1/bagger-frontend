import { useEffect, useMemo, useState } from "react";
import { useData } from "../../hooks/useData";
import { useParams, useNavigate } from "react-router-dom";

export function TopicForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { topics = [], updateTopic, createTopic } = useData(); // createTopic optional if you have it

  const inEditMode = Boolean(id);
  const topicId = inEditMode ? Number(id) : null;

  const editingTopic = useMemo(() => {
    if (!inEditMode) return null;
    return topics.find((t) => t.id === topicId) || null;
  }, [inEditMode, topicId, topics]);

  const [formData, setFormData] = useState({ name: "", slug: "" });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Prefill on edit (or reset on new)
  useEffect(() => {
    if (inEditMode) {
      if (!editingTopic) return; // wait for topics to be available
      setFormData({
        name: editingTopic.name ?? "",
        slug: editingTopic.slug ?? "",
      });
    } else {
      setFormData({ name: "", slug: "" });
    }
    setError(null);
  }, [inEditMode, editingTopic]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onCancel = () => navigate("/topics");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Name is required.");
      return;
    }

    setSaving(true);
    try {
      if (inEditMode) {
        await updateTopic({ id: topicId, ...formData });
      } else {
        if (!createTopic) {
          throw new Error("createTopic is not available in useData()");
        }
        await createTopic(formData);
      }
      navigate("/topics");
    } catch (err) {
      setError(err?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  // If editing but topic not found
  if (inEditMode && !editingTopic) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Topic not found</h2>
        <button type="button" onClick={() => navigate("/topics")}>
          Back to Topics
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>{inEditMode ? "Edit Topic" : "New Topic"}</h1>
        <button type="button" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </header>

      <form
        onSubmit={onSubmit}
        style={{ display: "grid", gap: 12, marginTop: 16 }}
      >
        <label style={{ display: "grid", gap: 6 }}>
          <span>Name</span>
          <input
            name="name"
            value={formData.name}
            onChange={onChange}
            disabled={saving}
            placeholder="e.g. Arrays"
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Slug</span>
          <input
            name="slug"
            value={formData.slug}
            onChange={onChange}
            disabled={saving}
            placeholder="e.g. arrays"
          />
        </label>

        {error && <div className="form-error">{error}</div>}

        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : inEditMode ? "Update" : "Create"}
          </button>
          <button type="button" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
