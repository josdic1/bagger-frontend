import { Link } from "react-router-dom";
import { useData } from "../../hooks/useData";

export function PlatformItem({ platform }) {
  const { deletePlatform } = useData();

  const onDelete = async () => {
    if (!confirm(`Delete platform "${platform.name}"?`)) return;
    await deletePlatform(platform.id);
  };

  return (
    <tr>
      <td style={{ padding: 12 }}>{platform.name}</td>
      <td style={{ padding: 12, opacity: 0.8 }}>{platform.slug}</td>
      <td style={{ padding: 12 }}>{platform.type}</td>
      <td style={{ padding: 12 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <Link to={`/platform/${platform.id}/edit`}>Edit</Link>
          <button type="button" onClick={onDelete}>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
