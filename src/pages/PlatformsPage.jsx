import { Link } from "react-router-dom";
import { useData } from "../hooks/useData";
import { PlatformItem } from "../components/platforms/PlatformItem";
import { PlatformSkeleton } from "../components/platforms/PlatformSkeleton";
import { NoResults } from "../pages/NoResults";

export function PlatformsPage() {
  const { platforms = [], loading, error } = useData();

  if (loading && platforms.length === 0) {
    return (
      <>
        <header
          style={{
            padding: 16,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div
            className="skeleton-bone"
            style={{ width: 180, height: 22, borderRadius: 8 }}
          />
        </header>
        <main>
          {[...Array(6)].map((_, i) => (
            <PlatformSkeleton key={i} />
          ))}
        </main>
      </>
    );
  }

  if (error && platforms.length === 0) return <p>Error loading platforms.</p>;
  if (!platforms.length) return <NoResults />;

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
        <h1 style={{ margin: 0 }}>Platforms ({platforms.length})</h1>
        <Link to="/platform/new">+ New</Link>
      </header>

      <main>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th align="left" style={{ padding: 12 }}>
                Name
              </th>
              <th align="left" style={{ padding: 12 }}>
                Slug
              </th>
              <th align="left" style={{ padding: 12 }}>
                Type
              </th>
              <th align="left" style={{ padding: 12 }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {platforms.map((p) => (
              <PlatformItem key={p.id} platform={p} />
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
}
