// src/components/platforms/PlatformItem.jsx
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useData } from "../../hooks/useData";
import { useToastTrigger } from "../../hooks/useToast";

export function PlatformItem({ platform, usedCount = 0, onView, onEdit }) {
  const { deletePlatform } = useData();
  const { addToast } = useToastTrigger();

  const onDelete = async () => {
    if (!confirm(`Delete platform "${platform.name}"?`)) return;

    try {
      await deletePlatform(platform.id);
      addToast({
        type: "success",
        title: "Deleted",
        message: "Platform removed.",
      });
    } catch (e) {
      addToast({
        type: "error",
        title: "Delete blocked",
        message: e?.message || "This platform may be in use by cheats.",
      });
    }
  };

  return (
    <tr>
      <td style={{ padding: 12, fontWeight: 900 }}>{platform.name}</td>
      <td style={{ padding: 12, opacity: 0.8 }}>{platform.slug}</td>
      <td style={{ padding: 12 }}>{platform.type}</td>
      <td style={{ padding: 12 }}>
        <span
          data-ui="pill"
          data-variant={usedCount > 0 ? "warning" : "success"}
        >
          {usedCount}
        </span>
      </td>
      <td style={{ padding: 12 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="button"
            data-ui="btn-refresh"
            onClick={onView}
            title="View"
          >
            <Eye size={16} />
            <span>View</span>
          </button>

          <button
            type="button"
            data-ui="btn-refresh"
            onClick={onEdit}
            title="Edit"
          >
            <Pencil size={16} />
            <span>Edit</span>
          </button>

          <button
            type="button"
            data-ui="btn-refresh"
            onClick={onDelete}
            title="Delete"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
}
