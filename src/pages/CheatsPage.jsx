// src/pages/CheatsPage.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useData } from "../hooks/useData";
import { RefreshCw, Search, Plus, Command } from "lucide-react";
import { CheatItem } from "../components/cheats/CheatItem";
import { CheatModal } from "../components/cheats/CheatModal";
import { CheatViewModal } from "../components/cheats/CheatViewModal";
import { CommandPalette } from "../components/cheats/CommandPalette";
import { SkeletonCard } from "../components/shared/SkeletonCard";

const PAGE_SIZE = 10;

function uniqInts(arr) {
  return Array.from(
    new Set((Array.isArray(arr) ? arr : []).filter(Number.isFinite)),
  );
}

export function CheatsPage() {
  const {
    loading,
    refreshing,
    cheats = [],
    platforms = [],
    topics = [],
    refresh,
  } = useData();

  // UI state
  const [q, setQ] = useState("");
  const [platformFilter, setPlatformFilter] = useState([]); // ids
  const [topicFilter, setTopicFilter] = useState([]); // ids
  const [page, setPage] = useState(1);

  // modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // int | null

  // view modal
  const [viewOpen, setViewOpen] = useState(false);
  const [viewingId, setViewingId] = useState(null); // int | null

  // cmd+k
  const [paletteOpen, setPaletteOpen] = useState(false);

  const isBusy = loading || refreshing;

  const searchRef = useRef(null);

  // Keyboard shortcuts: Cmd+K, /, n, Esc, arrows for paging
  useEffect(() => {
    function onKeyDown(e) {
      const key = e.key.toLowerCase();
      const meta = e.metaKey || e.ctrlKey;

      if (meta && key === "k") {
        e.preventDefault();
        setPaletteOpen(true);
        return;
      }

      if (!meta && key === "/") {
        e.preventDefault();
        searchRef.current?.focus?.();
        return;
      }

      if (!meta && key === "n") {
        e.preventDefault();
        openNew();
        return;
      }

      // Paging without scroll
      if (!meta && key === "arrowright") {
        e.preventDefault();
        nextPage();
        return;
      }
      if (!meta && key === "arrowleft") {
        e.preventDefault();
        prevPage();
        return;
      }

      if (key === "escape") {
        if (paletteOpen) setPaletteOpen(false);
        if (viewOpen) closeView();
        if (editOpen) closeEditor();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [paletteOpen, viewOpen, editOpen]);

  // Reset pagination when filters/search change
  useEffect(() => {
    setPage(1);
  }, [q, platformFilter, topicFilter]);

  const platformById = useMemo(() => {
    const m = new Map();
    for (const p of platforms) m.set(p.id, p);
    return m;
  }, [platforms]);

  const topicById = useMemo(() => {
    const m = new Map();
    for (const t of topics) m.set(t.id, t);
    return m;
  }, [topics]);

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    const pf = new Set(uniqInts(platformFilter));
    const tf = new Set(uniqInts(topicFilter));

    return (Array.isArray(cheats) ? cheats : []).filter((c) => {
      const title = String(c?.title || "");
      const code = String(c?.code || "");
      const notes = String(c?.notes || "");

      if (text) {
        const hay = `${title}\n${code}\n${notes}`.toLowerCase();
        if (!hay.includes(text)) return false;
      }

      // OR semantics: any selected platform matches
      if (pf.size) {
        const ids = uniqInts(c?.platform_ids);
        let ok = false;
        for (const id of ids) if (pf.has(id)) ok = true;
        if (!ok) return false;
      }

      // OR semantics: any selected topic matches
      if (tf.size) {
        const ids = uniqInts(c?.topic_ids);
        let ok = false;
        for (const id of ids) if (tf.has(id)) ok = true;
        if (!ok) return false;
      }

      return true;
    });
  }, [cheats, q, platformFilter, topicFilter]);

  const totalPages = useMemo(() => {
    const n = filtered.length;
    return Math.max(1, Math.ceil(n / PAGE_SIZE));
  }, [filtered.length]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const editingCheat = useMemo(() => {
    if (!editingId) return null;
    return (
      (Array.isArray(cheats) ? cheats : []).find((c) => c.id === editingId) ||
      null
    );
  }, [editingId, cheats]);

  const viewingCheat = useMemo(() => {
    if (!viewingId) return null;
    return (
      (Array.isArray(cheats) ? cheats : []).find((c) => c.id === viewingId) ||
      null
    );
  }, [viewingId, cheats]);

  function togglePlatform(id) {
    setPlatformFilter((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return Array.from(s);
    });
  }

  function toggleTopic(id) {
    setTopicFilter((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return Array.from(s);
    });
  }

  function clearFilters() {
    setQ("");
    setPlatformFilter([]);
    setTopicFilter([]);
    setPage(1);
  }

  function openNew() {
    setEditingId(null);
    setEditOpen(true);
  }

  function openEdit(id) {
    setEditingId(id);
    setEditOpen(true);
  }

  function closeEditor() {
    setEditOpen(false);
    setEditingId(null);
  }

  function openView(id) {
    setViewingId(id);
    setViewOpen(true);
  }

  function closeView() {
    setViewOpen(false);
    setViewingId(null);
  }

  function nextPage() {
    setPage((p) => Math.min(totalPages, p + 1));
  }

  function prevPage() {
    setPage((p) => Math.max(1, p - 1));
  }

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
            <div data-ui="title">Cheats</div>
            <div data-ui="subtitle">
              No-scroll. Keyboard-first. <span data-ui="pill">/</span> search •{" "}
              <span data-ui="pill">
                <Command size={14} style={{ marginRight: 6 }} />
                Cmd+K
              </span>{" "}
              palette • <span data-ui="pill">N</span> new •{" "}
              <span data-ui="pill">←/→</span> page
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
              onClick={openNew}
              disabled={isBusy}
              title="New cheat (N)"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <Plus size={16} />
              <span>New</span>
            </button>
          </div>
        </div>

        <div style={{ height: 14 }} />

        {/* Search */}
        <div data-ui="row" style={{ gap: 10, alignItems: "stretch" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: 12,
                top: 12,
                opacity: 0.7,
              }}
            />
            <input
              ref={searchRef}
              data-ui="input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title / code / notes…  ( / )"
              style={{ paddingLeft: 38 }}
              disabled={loading}
            />
          </div>

          <button
            data-ui="btn-refresh"
            onClick={() => setPaletteOpen(true)}
            disabled={loading}
            title="Command palette (Cmd+K)"
          >
            <Command size={16} />
            <span>Cmd+K</span>
          </button>

          <button
            data-ui="btn-refresh"
            onClick={clearFilters}
            disabled={loading}
            title="Clear search + filters"
          >
            <span>Clear</span>
          </button>
        </div>

        <div style={{ height: 12 }} />
        <div data-ui="divider" />
        <div style={{ height: 12 }} />

        {/* Filters */}
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "grid", gap: 8 }}>
            <div data-ui="label">Platforms</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {platforms.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  data-ui="chip"
                  data-active={platformFilter.includes(p.id) ? "true" : "false"}
                  onClick={() => togglePlatform(p.id)}
                  disabled={loading}
                  title={p.slug}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <div data-ui="label">Topics</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {topics.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  data-ui="chip"
                  data-active={topicFilter.includes(t.id) ? "true" : "false"}
                  onClick={() => toggleTopic(t.id)}
                  disabled={loading}
                  title={t.slug}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section data-ui="card" style={{ width: "min(980px, 100%)" }}>
        <div
          data-ui="row"
          style={{ justifyContent: "space-between", flexWrap: "wrap" }}
        >
          <div style={{ display: "grid", gap: 4 }}>
            <div data-ui="label">Results</div>
            <div data-ui="hint">
              {isBusy ? "Loading…" : `${filtered.length} cheats`}
              {q.trim() ? ` • matching “${q.trim()}”` : ""}
            </div>
          </div>

          <div data-ui="row" style={{ gap: 10 }}>
            <button
              data-ui="btn-refresh"
              onClick={prevPage}
              disabled={loading || page <= 1}
              title="Previous page (←)"
            >
              <span>Prev</span>
            </button>

            <div data-ui="pill" data-variant="info">
              Page {page} / {totalPages}
            </div>

            <button
              data-ui="btn-refresh"
              onClick={nextPage}
              disabled={loading || page >= totalPages}
              title="Next page (→)"
            >
              <span>Next</span>
            </button>
          </div>
        </div>

        <div style={{ height: 12 }} />

        {isBusy ? (
          <SkeletonCard count={6} />
        ) : pageItems.length ? (
          <div data-ui="stack">
            {pageItems.map((c) => (
              <CheatItem
                key={c.id}
                cheat={c}
                platformById={platformById}
                topicById={topicById}
                onView={() => openView(c.id)}
                onEdit={() => openEdit(c.id)}
              />
            ))}
          </div>
        ) : (
          <div data-ui="empty">
            <div data-ui="empty-title">No matches</div>
            <div data-ui="hint">
              Try clearing filters or searching different text.
            </div>
          </div>
        )}
      </section>

      {/* View modal (copy / edit / delete inside) */}
      <CheatViewModal
        open={viewOpen}
        onClose={closeView}
        cheat={viewingCheat}
        platformById={platformById}
        topicById={topicById}
        onEdit={() => {
          if (!viewingId) return;
          closeView();
          openEdit(viewingId);
        }}
      />

      {/* Edit/New modal */}
      <CheatModal
        open={editOpen}
        onClose={closeEditor}
        mode={editingId ? "edit" : "new"}
        cheat={editingCheat}
      />

      {/* Command palette */}
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        cheats={cheats}
        platforms={platforms}
        topics={topics}
        onNew={() => {
          setPaletteOpen(false);
          openNew();
        }}
        onOpenCheat={(id) => {
          setPaletteOpen(false);
          openView(id); // palette opens VIEW (fast)
        }}
        onSetSearch={(text) => {
          setPaletteOpen(false);
          setQ(text);
          searchRef.current?.focus?.();
        }}
        onClear={clearFilters}
      />
    </div>
  );
}
