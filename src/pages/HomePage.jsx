// src/pages/HomePage.jsx
import { useMemo, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RefreshCw, Search, Copy, Eye, Plus, ArrowRight } from "lucide-react";
import { useData } from "../hooks/useData";
import { SkeletonCard } from "../components/shared/SkeletonCard";
import { CheatViewModal } from "../components/cheats/CheatViewModal";
import { useToastTrigger } from "../hooks/useToast";

function includesText(hay, needle) {
  const h = String(hay || "").toLowerCase();
  const n = String(needle || "")
    .trim()
    .toLowerCase();
  if (!n) return true;
  return h.includes(n);
}

function cheatMatches(cheat, q, platformIds, topicIds) {
  const textOk =
    includesText(cheat?.title, q) ||
    includesText(cheat?.notes, q) ||
    includesText(cheat?.code, q);

  if (!textOk) return false;

  if (platformIds?.length) {
    const ids = new Set(cheat?.platform_ids || []);
    for (const pid of platformIds) if (!ids.has(pid)) return false;
  }

  if (topicIds?.length) {
    const ids = new Set(cheat?.topic_ids || []);
    for (const tid of topicIds) if (!ids.has(tid)) return false;
  }

  return true;
}

export function HomePage() {
  const nav = useNavigate();
  const { addToast } = useToastTrigger();

  const {
    loading,
    refreshing,
    platforms = [],
    topics = [],
    cheats = [],
    refresh,
    deleteCheat,
  } = useData();

  const isBusy = loading || refreshing;

  const [q, setQ] = useState("");
  const [selectedPlatformIds, setSelectedPlatformIds] = useState([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState([]);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewCheatId, setViewCheatId] = useState(null);

  // CTA micro-interactions
  const [ctaHover, setCtaHover] = useState(false);
  const [ctaDown, setCtaDown] = useState(false);

  // Idle redirect to Cheats (5s). IMPORTANT: do NOT cancel on mousemove/scroll.
  const idleTimer = useRef(null);

  useEffect(() => {
    // Don’t redirect while loading/syncing
    if (isBusy) return;

    // Restart timer any time "working state" changes
    if (idleTimer.current) clearTimeout(idleTimer.current);

    idleTimer.current = setTimeout(() => {
      const userHasStartedWorking =
        !!q || selectedPlatformIds.length > 0 || selectedTopicIds.length > 0;

      if (!userHasStartedWorking) {
        nav("/cheats");
      }
    }, 5000);

    // Only cancel on intentional interaction
    const cancel = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = null;
    };

    window.addEventListener("pointerdown", cancel, { passive: true });
    window.addEventListener("keydown", cancel);

    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      window.removeEventListener("pointerdown", cancel);
      window.removeEventListener("keydown", cancel);
    };
  }, [isBusy, nav, q, selectedPlatformIds.length, selectedTopicIds.length]);

  const viewingCheat = useMemo(() => {
    if (!viewCheatId) return null;
    return cheats.find((c) => c.id === viewCheatId) || null;
  }, [viewCheatId, cheats]);

  const filteredCheats = useMemo(() => {
    return (cheats || []).filter((c) =>
      cheatMatches(c, q, selectedPlatformIds, selectedTopicIds),
    );
  }, [cheats, q, selectedPlatformIds, selectedTopicIds]);

  const stats = useMemo(() => {
    const p = Array.isArray(platforms) ? platforms.length : 0;
    const t = Array.isArray(topics) ? topics.length : 0;
    const c = Array.isArray(cheats) ? cheats.length : 0;
    return [
      { label: "Platforms", value: p },
      { label: "Topics", value: t },
      { label: "Cheats", value: c },
    ];
  }, [platforms, topics, cheats]);

  function toggleId(list, id) {
    const s = new Set(list);
    if (s.has(id)) s.delete(id);
    else s.add(id);
    return Array.from(s);
  }

  async function copyCheatCode(cheat) {
    const text = String(cheat?.code || "");
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      addToast({ type: "success", title: "Copied", message: "Code copied." });
    } catch {
      addToast({
        type: "error",
        title: "Copy failed",
        message: "Clipboard blocked by browser.",
      });
    }
  }

  function openView(cheatId) {
    setViewCheatId(cheatId);
    setViewOpen(true);
  }

  function closeView() {
    setViewOpen(false);
    setViewCheatId(null);
  }

  async function onDelete(cheat) {
    if (!confirm(`Delete cheat "${cheat.title}"?`)) return;
    try {
      await deleteCheat(cheat.id);
      addToast({
        type: "success",
        title: "Deleted",
        message: "Cheat removed.",
      });
      closeView();
    } catch (e) {
      addToast({
        type: "error",
        title: "Delete failed",
        message: e?.message || "Unable to delete.",
      });
    }
  }

  const ctaColor = "#eb5638";

  const ctaStyle = {
    height: 64,
    width: "100%",
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: ctaHover
      ? `linear-gradient(180deg, ${ctaColor} 0%, rgba(235,86,56,0.92) 55%, rgba(235,86,56,0.84) 100%)`
      : `linear-gradient(180deg, rgba(235,86,56,0.98) 0%, rgba(235,86,56,0.90) 55%, rgba(235,86,56,0.82) 100%)`,
    color: "rgba(255,255,255,0.96)",
    fontSize: 18,
    fontWeight: 900,
    letterSpacing: 0.2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    cursor: isBusy ? "not-allowed" : "pointer",
    transform: ctaDown
      ? "translateY(1px) scale(0.995)"
      : "translateY(0) scale(1)",
    boxShadow: ctaDown
      ? "0 10px 26px rgba(0,0,0,0.38), 0 0 0 1px rgba(0,0,0,0.25) inset"
      : "0 14px 38px rgba(0,0,0,0.44), 0 0 0 1px rgba(0,0,0,0.22) inset, 0 10px 34px rgba(235,86,56,0.18)",
    transition:
      "transform 120ms ease, box-shadow 120ms ease, filter 120ms ease",
    filter: ctaHover ? "saturate(1.08) brightness(1.03)" : "saturate(1.02)",
  };

  return (
    <div
      data-ui="home"
      style={{
        width: "100%",
        display: "grid",
        justifyItems: "center",
        gap: 14,
      }}
    >
      {/* Header */}
      <section data-ui="card" style={{ width: "min(980px, 100%)" }}>
        <div
          data-ui="row"
          style={{ justifyContent: "space-between", flexWrap: "wrap" }}
        >
          <div style={{ display: "grid", gap: 6 }}>
            <div data-ui="title">Bagger</div>
            <div data-ui="subtitle">
              Fast cheat sheets. Clean UI. Minimal friction.
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
              disabled={isBusy}
              title="Force refresh (ignore cache)"
            >
              <RefreshCw
                size={16}
                data-ui="btn-icon"
                data-spin={refreshing ? "true" : "false"}
              />
              <span>{refreshing ? "Refreshing" : "Refresh"}</span>
            </button>

            <button
              data-ui="btn-refresh"
              onClick={() => nav("/cheat/new")}
              disabled={isBusy}
              title="New cheat"
            >
              <Plus size={16} />
              <span>New</span>
            </button>
          </div>
        </div>

        <div style={{ height: 14 }} />
        <div data-ui="divider" />
        <div style={{ height: 12 }} />

        {/* Search + quick filters */}
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ position: "relative" }}>
            <Search
              size={16}
              style={{ position: "absolute", left: 12, top: 12, opacity: 0.7 }}
            />
            <input
              data-ui="input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search cheats (title / notes / code)…"
              style={{ paddingLeft: 38 }}
              disabled={loading}
            />
          </div>

          <div
            data-ui="row"
            style={{ justifyContent: "space-between", flexWrap: "wrap" }}
          >
            <div data-ui="row" style={{ gap: 10, flexWrap: "wrap" }}>
              {(platforms || []).slice(0, 8).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  data-ui="chip"
                  data-active={
                    selectedPlatformIds.includes(p.id) ? "true" : "false"
                  }
                  onClick={() =>
                    setSelectedPlatformIds((prev) => toggleId(prev, p.id))
                  }
                  disabled={loading}
                  title={p.slug}
                >
                  {p.name}
                </button>
              ))}

              {(platforms || []).length > 8 ? (
                <Link
                  to="/platforms"
                  data-ui="nav-link"
                  style={{ fontWeight: 900 }}
                >
                  More…
                </Link>
              ) : null}
            </div>

            <button
              data-ui="btn-refresh"
              onClick={() => {
                setQ("");
                setSelectedPlatformIds([]);
                setSelectedTopicIds([]);
              }}
              disabled={loading}
              title="Clear filters"
            >
              <span>Clear</span>
            </button>
          </div>

          {selectedTopicIds.length ? (
            <div data-ui="hint">
              {selectedTopicIds.length} topic filters active
            </div>
          ) : null}
        </div>
      </section>

      {/* Overview + Cheats */}
      <section data-ui="grid" style={{ width: "min(980px, 100%)" }}>
        {/* OVERVIEW (left) */}
        <div data-ui="card">
          <div data-ui="label">Overview</div>
          <div style={{ height: 10 }} />

          {isBusy ? (
            <SkeletonCard count={3} />
          ) : (
            <div data-ui="stats">
              {stats.map((s) => (
                <div key={s.label} data-ui="stat">
                  <div data-ui="stat-value">{s.value}</div>
                  <div data-ui="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ height: 14 }} />
          <div data-ui="divider" />
          <div style={{ height: 12 }} />

          <div style={{ display: "grid", gap: 10 }}>
            <div data-ui="hint">
              Cheats-first. Platforms/topics are supporting tools.
            </div>

            <button
              type="button"
              onClick={() => nav("/cheats")}
              disabled={isBusy}
              style={ctaStyle}
              onMouseEnter={() => setCtaHover(true)}
              onMouseLeave={() => {
                setCtaHover(false);
                setCtaDown(false);
              }}
              onMouseDown={() => setCtaDown(true)}
              onMouseUp={() => setCtaDown(false)}
              onBlur={() => setCtaDown(false)}
              title="Go to Cheats"
            >
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span>Go to Cheats</span>
                <ArrowRight size={18} />
              </span>
            </button>

            <div style={{ opacity: 0.75, fontSize: 12 }}>
              Auto-jumps to Cheats if you do nothing for 5 seconds.
            </div>
          </div>
        </div>

        {/* CHEATS (right) */}
        <div data-ui="card">
          <div data-ui="row" style={{ justifyContent: "space-between" }}>
            <div>
              <div data-ui="label">Cheats</div>
              <div data-ui="hint">
                {isBusy ? "Loading…" : `${filteredCheats.length} shown`}
              </div>
            </div>

            <div data-ui="row" style={{ gap: 10 }}>
              <Link to="/cheats" data-ui="nav-link" style={{ fontWeight: 900 }}>
                Full list →
              </Link>
            </div>
          </div>

          <div style={{ height: 10 }} />

          {isBusy ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : Array.isArray(filteredCheats) && filteredCheats.length ? (
            <div data-ui="stack">
              {filteredCheats.slice(0, 8).map((c) => (
                <div key={c.id} data-ui="item">
                  <div style={{ display: "grid", gap: 6 }}>
                    <div
                      data-ui="row"
                      style={{ justifyContent: "space-between" }}
                    >
                      <div data-ui="item-title">{c.title}</div>
                      <div data-ui="row" style={{ gap: 8 }}>
                        <button
                          type="button"
                          data-ui="btn-refresh"
                          style={{ height: 30, padding: "0 10px" }}
                          onClick={() => openView(c.id)}
                          title="View"
                        >
                          <Eye size={16} />
                          <span>View</span>
                        </button>

                        <button
                          type="button"
                          data-ui="btn-refresh"
                          style={{ height: 30, padding: "0 10px" }}
                          onClick={() => copyCheatCode(c)}
                          title="Copy code"
                        >
                          <Copy size={16} />
                          <span>Copy</span>
                        </button>
                      </div>
                    </div>

                    <div data-ui="item-meta">
                      {c.is_public ? "Public" : "Private"} •{" "}
                      {(c.platform_ids || []).length} platforms •{" "}
                      {(c.topic_ids || []).length} topics
                    </div>
                  </div>

                  <div data-ui="item-code">
                    {String(c.code || "").slice(0, 160)}
                    {String(c.code || "").length > 160 ? "…" : ""}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div data-ui="empty">
              <div data-ui="empty-title">No cheats match</div>
              <div data-ui="hint">Clear filters or create a new cheat.</div>
            </div>
          )}
        </div>
      </section>

      <CheatViewModal
        open={viewOpen}
        onClose={closeView}
        cheat={viewingCheat}
        platforms={platforms}
        topics={topics}
        onCopy={() => copyCheatCode(viewingCheat)}
        onEdit={() => {
          if (!viewingCheat?.id) return;
          closeView();
          nav(`/cheat/${viewingCheat.id}/edit`);
        }}
        onDelete={() => onDelete(viewingCheat)}
      />
    </div>
  );
}
