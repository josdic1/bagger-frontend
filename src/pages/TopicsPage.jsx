// src/pages/TopicsPage.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../hooks/useData";
import { NoResults } from "../pages/NoResults";
import { TopicSkeleton } from "../components/topics/TopicSkeleton";
import { TopicModal } from "../components/topics/TopicModal";

export function TopicsPage() {
  const nav = useNavigate();
  const { topics = [], loading, error, deleteTopic } = useData();

  const [selectedId, setSelectedId] = useState(null);

  const selectedTopic = useMemo(() => {
    if (!selectedId) return null;
    return topics.find((t) => t.id === selectedId) || null;
  }, [selectedId, topics]);

  const open = Boolean(selectedTopic);

  const onRowClick = (id) => setSelectedId(id);
  const close = () => setSelectedId(null);

  const onEdit = () => {
    if (!selectedTopic) return;
    nav(`/topic/${selectedTopic.id}/edit`);
  };

  const onDelete = async () => {
    if (!selectedTopic) return;
    const ok = window.confirm(`Delete topic "${selectedTopic.name}"?`);
    if (!ok) return;

    await deleteTopic(selectedTopic.id);
    close();
  };

  if (loading && topics.length === 0) {
    return (
      <>
        <header style={{ padding: 16 }}>
          <div data-skeleton="true" style={{ width: 160, height: 20 }} />
        </header>
        <main style={{ display: "grid", gap: 12, padding: 16 }}>
          {[...Array(6)].map((_, i) => (
            <TopicSkeleton key={i} />
          ))}
        </main>
      </>
    );
  }

  if (error && topics.length === 0) return <p>Error loading topics.</p>;
  if (!topics.length) return <NoResults />;

  return (
    <>
      <header
        style={{
          padding: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0 }}>Topics ({topics.length})</h1>
      </header>

      <main style={{ padding: 16 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th align="left" style={{ padding: 12 }}>
                Name
              </th>
              <th align="left" style={{ padding: 12 }}>
                Slug
              </th>
            </tr>
          </thead>

          <tbody>
            {topics.map((t) => (
              <tr
                key={t.id}
                onClick={() => onRowClick(t.id)}
                style={{
                  cursor: "pointer",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <td style={{ padding: 12, fontWeight: 800 }}>{t.name}</td>
                <td style={{ padding: 12, opacity: 0.75 }}>{t.slug}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      <TopicModal
        open={open}
        topic={selectedTopic}
        onClose={close}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </>
  );
}
