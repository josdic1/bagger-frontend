// src/components/topics/TopicItem.jsx
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../hooks/useData";
import { useToastTrigger } from "../../hooks/useToast";

export function TopicItem({ topic, onView }) {
  const nav = useNavigate();
  const { deleteTopic } = useData();
  const { addToast } = useToastTrigger();

  const onDelete = async () => {
    if (!confirm(`Delete topic "${topic.name}"?`)) return;
    try {
      await deleteTopic(topic.id);
      addToast({
        type: "success",
        title: "Deleted",
        message: "Topic removed.",
      });
    } catch (e) {
      addToast({
        type: "error",
        title: "Delete failed",
        message: e?.message || "Unable to delete.",
      });
    }
  };

  return (
    <tr>
      <td style={{ padding: 12, fontWeight: 900 }}>{topic.name}</td>
      <td style={{ padding: 12, opacity: 0.8 }}>{topic.slug}</td>
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
            onClick={() => nav(`/topic/${topic.id}/edit`)}
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
