// src/components/base/BaseForm.jsx
import { useEffect, useState } from "react";

export function BaseForm({
  open,
  title,
  initialData = {},
  fields = [],
  submitLabel = "Save",
  loading = false,
  onSubmit,
  onClose,
  variant = "modal", // NEW
}) {
  const [formData, setFormData] = useState(initialData);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      setFormData(initialData || {});
      setError(null);
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    for (const field of fields) {
      if (field.required && !String(formData[field.name] ?? "").trim()) {
        setError(`${field.label} is required.`);
        return;
      }
    }

    onSubmit(formData);
  };

  const formUI = (
    <>
      <header>
        <h3>{title}</h3>
      </header>

      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <label key={field.name} className="field">
            <span>{field.label}</span>
            <input
              type={field.type || "text"}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              disabled={loading}
            />
          </label>
        ))}

        {error && <div className="form-error">{error}</div>}

        <footer>
          <button type="button" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : submitLabel}
          </button>
        </footer>
      </form>
    </>
  );

  // PAGE VARIANT: no backdrop/modal wrappers
  if (variant === "page") {
    return <div className="form-page">{formUI}</div>;
  }

  // MODAL VARIANT (default): existing behavior
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {formUI}
      </div>
    </div>
  );
}
