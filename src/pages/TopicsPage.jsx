// src/pages/TopicPage.jsx
import { Link } from "react-router-dom";
import { useData } from "../hooks/useData";
import { NoResults } from "../pages/NoResults";
import { TopicSkeleton } from "../components/topics/TopicSkeleton";
import { TopicItem } from "../components/topics/TopicItem";

export function TopicsPage() {
  const { topics = [], loading, error } = useData();

  // 1) Hard Loading
  if (loading && topics.length === 0) {
    return (
      <>
        <header>
          <div className="skeleton-title" style={{ margin: "20px" }} />
        </header>
        <main>
          {[...Array(5)].map((_, i) => (
            <TopicSkeleton key={i} />
          ))}
        </main>
      </>
    );
  }

  // 2) Error Guardrail
  if (error && topics.length === 0) {
    return <p>Error loading data. Please try again.</p>;
  }

  // 3) Empty Guardrail
  if (topics.length === 0) {
    return <NoResults />;
  }

  // 4) Data Render (table directly on page)
  return (
    <>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Topics ({topics.length})</h1>
      </header>

      <main>
        <table className="topic-table">
          <thead>
            <tr>
              <th>Name</th>
              <th style={{ width: "180px" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {topics.map((topic) => (
              <TopicItem key={topic.id} topic={topic} />
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
}
