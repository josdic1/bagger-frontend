import { Link } from "react-router-dom";
import { useData } from "../../hooks/useData";

export function CheatItem({ cheat }) {
  const { deleteCheat } = useData();

  const onDelete = async () => {
    if (!confirm(`Delete cheat "${cheat.title}"?`)) return;
    await deleteCheat(cheat.id);
  };

  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12,
        padding: 14,
      }}
    >
      <div
        style={{ display: "flex", justifyContent: "space-between", gap: 10 }}
      >
        <div style={{ display: "grid", gap: 4 }}>
          <div style={{ fontWeight: 700 }}>{cheat.title}</div>
          <div style={{ opacity: 0.75, fontSize: 12 }}>
            {cheat.is_public ? "Public" : "Private"} •{" "}
            {(cheat.platform_ids || []).length} platforms •{" "}
            {(cheat.topic_ids || []).length} topics
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "start" }}>
          <Link to={`/cheat/${cheat.id}/edit`}>Edit</Link>
          <button type="button" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>

      <pre style={{ marginTop: 10, whiteSpace: "pre-wrap", opacity: 0.9 }}>
        {String(cheat.code || "").slice(0, 240)}
        {String(cheat.code || "").length > 240 ? "…" : ""}
      </pre>
    </div>
  );
}
