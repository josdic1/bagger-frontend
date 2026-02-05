// src/pages/HomePage.jsx
import { useData } from "../hooks/useData";
import { SkeletonCard } from "../components/shared/SkeletonCard";
import { RefreshCw } from "lucide-react";

export function HomePage() {
  const { loading, refreshing, platforms, topics, cheats, refresh } = useData();

  const p = Array.isArray(platforms) ? platforms.length : 0;
  const t = Array.isArray(topics) ? topics.length : 0;
  const c = Array.isArray(cheats) ? cheats.length : 0;

  const stats = [
    { label: "Platforms", value: p },
    { label: "Topics", value: t },
    { label: "Cheats", value: c },
  ];

  if (loading || refreshing) {
    return (
      <div data-ui="grid-system">
        <aside data-ui="column">
          <SkeletonCard count={5} />
        </aside>
        <section data-ui="column">
          <SkeletonCard count={8} />
        </section>
        <main data-ui="column">
          <SkeletonCard count={1} />
        </main>
      </div>
    );
  }

  return (
    <div data-ui="home">
      {/* Header */}
      <section data-ui="card" style={{ width: "min(980px, 100%)" }}>
        <div
          data-ui="row"
          style={{ justifyContent: "space-between", flexWrap: "wrap" }}
        >
          <div style={{ display: "grid", gap: 6 }}>
            <div data-ui="title">Bagger</div>
            <div data-ui="subtitle">
              Fast cheat sheets. Clean UI. No theme switching UI.
            </div>
          </div>

          <div data-ui="row" style={{ gap: 10 }}>
            <div
              data-ui="pill"
              data-variant={
                loading ? "info" : refreshing ? "warning" : "success"
              }
            >
              {loading ? "Loading…" : refreshing ? "Syncing…" : "Ready"}
            </div>

            <button
              data-ui="btn-refresh"
              onClick={refresh}
              disabled={loading || refreshing}
              title="Force refresh (ignore cache)"
            >
              <RefreshCw
                size={16}
                data-ui="btn-icon"
                data-spin={refreshing ? "true" : "false"}
              />
              <span>{refreshing ? "Refreshing" : "Refresh"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section data-ui="grid" style={{ width: "min(980px, 100%)" }}>
        <div data-ui="card">
          <div data-ui="label">Overview</div>
          <div style={{ height: 10 }} />
          <div data-ui="stats">
            {stats.map((s) => (
              <div key={s.label} data-ui="stat">
                <div data-ui="stat-value">{s.value}</div>
                <div data-ui="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ height: 14 }} />
          <div data-ui="divider" />
          <div style={{ height: 12 }} />

          <div data-ui="hint">
            This page uses only <code>data-ui</code> selectors + CSS variables.
          </div>
        </div>

        <div data-ui="card">
          <div data-ui="label">Recent Cheats</div>
          <div style={{ height: 10 }} />

          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : Array.isArray(cheats) && cheats.length ? (
            <div data-ui="stack">
              {cheats.slice(0, 4).map((c) => (
                <div key={c.id} data-ui="item">
                  <div style={{ display: "grid", gap: 4 }}>
                    <div data-ui="item-title">{c.title}</div>
                    <div data-ui="item-meta">
                      {c.is_public ? "Public" : "Private"} •{" "}
                      {(c.platform_ids || []).length} platforms •{" "}
                      {(c.topic_ids || []).length} topics
                    </div>
                  </div>

                  <div data-ui="item-code">
                    {String(c.code || "").slice(0, 120)}
                    {String(c.code || "").length > 120 ? "…" : ""}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div data-ui="empty">
              <div data-ui="empty-title">No cheats yet</div>
              <div data-ui="hint">Create one to see it show up here.</div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
