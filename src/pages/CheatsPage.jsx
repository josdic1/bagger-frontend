import { Link } from "react-router-dom";
import { useData } from "../hooks/useData";
import { CheatItem } from "../components/cheats/CheatItem";
import { CheatSkeleton } from "../components/cheats/CheatSkeleton";
import { NoResults } from "../pages/NoResults";

export function CheatsPage() {
  const { cheats = [], loading, error } = useData();

  if (loading && cheats.length === 0) {
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
            style={{ width: 160, height: 22, borderRadius: 8 }}
          />
        </header>
        <main style={{ display: "grid", gap: 12, padding: 16 }}>
          {[...Array(6)].map((_, i) => (
            <CheatSkeleton key={i} />
          ))}
        </main>
      </>
    );
  }

  if (error && cheats.length === 0) return <p>Error loading cheats.</p>;
  if (!cheats.length) return <NoResults />;

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
        <h1 style={{ margin: 0 }}>Cheats ({cheats.length})</h1>
        <Link to="/cheat/new">+ New</Link>
      </header>

      <main style={{ display: "grid", gap: 12, padding: 16 }}>
        {cheats.map((c) => (
          <CheatItem key={c.id} cheat={c} />
        ))}
      </main>
    </>
  );
}
