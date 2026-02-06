// src/components/topics/TopicItem.jsx
import { Link } from "react-router-dom";
import { useData } from "../../hooks/useData";

export function TopicItem({ topic }) {
  const { deleteTopic } = useData(); // assuming this exists

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this topic?");
    if (!confirmed) return;

    await deleteTopic(topic.id);
  };

  return (
    <tr>
      <td>{topic.name}</td>

      <td>
        <div style={{ display: "flex", gap: "8px" }}>
          <Link className="btn btn-secondary" to={`/topic/${topic.id}/edit`}>
            Edit
          </Link>

          <button
            className="btn btn-danger"
            onClick={handleDelete}
            type="button"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
