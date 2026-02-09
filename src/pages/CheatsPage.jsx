import { useEffect, useMemo, useRef, useState } from "react";
import { useData } from "../hooks/useData";
import { RefreshCw, Search, Plus, Command } from "lucide-react";
import { CheatItem } from "../components/cheats/CheatItem";
import { CheatModal } from "../components/cheats/CheatModal";
import { CheatViewModal } from "../components/cheats/CheatViewModal";
import { CommandPalette } from "../components/cheats/CommandPalette";
import { SkeletonCard } from "../components/shared/SkeletonCard";

const PAGE_SIZE = 20;

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
    deleteCheat,
    platforms = [],
    topics = [],
    refresh,
  } = useData();

  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [platformFilter, setPlatformFilter] = useState([]);
  const [topicFilter, setTopicFilter] = useState([]);
  const [page, setPage] = useState(1);

  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewingId, setViewingId] = useState(null);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const isBusy = loading || refreshing;
  const searchRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(q), 200);
    return () => clearTimeout(timer);
  }, [q]);

  // Handle Keyboard Shortcuts
  useEffect(() => {
    function onKeyDown(e) {
      const key = e.key.toLowerCase();
      const meta = e.metaKey || e.ctrlKey;
      const isInput = /INPUT|TEXTAREA/.test(document.activeElement?.tagName);

      // Cmd+K: Open Command Palette
      if (meta && key === "k") {
        e.preventDefault();
        setPaletteOpen(true);
        return;
      }

      // /: Focus Search
      if (!meta && key === "/") {
        if (isInput) return;
        e.preventDefault();
        searchRef.current?.focus?.();
        return;
      }

      // Alt: Clear search and all filters
      if (e.altKey && !meta) {
        // We allow this even if an input is focused to quickly reset
        e.preventDefault();
        clearFilters();
        // Blur the search input if it was active
        if (isInput) document.activeElement.blur();
        return;
      }

      // N: New Cheat
      if (!meta && key === "n") {
        if (editOpen || viewOpen || paletteOpen || isInput) return;
        e.preventDefault();
        openNew();
        return;
      }

      // Arrow Keys: Pagination
      if (!meta && key === "arrowright") {
        if (isInput) return;
        e.preventDefault();
        nextPage();
      }
      if (!meta && key === "arrowleft") {
        if (isInput) return;
        e.preventDefault();
        prevPage();
      }

      // Escape: Close all modals
      if (key === "escape") {
        setPaletteOpen(false);
        closeView();
        closeEditor();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [paletteOpen, viewOpen, editOpen]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQ, platformFilter, topicFilter]);

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
    const words = debouncedQ.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const pf = new Set(uniqInts(platformFilter));
    const tf = new Set(uniqInts(topicFilter));

    return (Array.isArray(cheats) ? cheats : []).filter((c) => {
      if (words.length > 0) {
        const content = `${c?.title} ${c?.code} ${c?.notes}`.toLowerCase();
        if (!words.every((word) => content.includes(word))) return false;
      }

      if (pf.size > 0) {
        const ids = uniqInts(c?.platform_ids);
        if (!ids.some((id) => pf.has(id))) return false;
      }

      if (tf.size > 0) {
        const ids = uniqInts(c?.topic_ids);
        if (!ids.some((id) => tf.has(id))) return false;
      }

      return true;
    });
  }, [cheats, debouncedQ, platformFilter, topicFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const editingCheat = useMemo(
    () => cheats.find((c) => c.id === editingId) || null,
    [editingId, cheats],
  );
  const viewingCheat = useMemo(
    () => cheats.find((c) => c.id === viewingId) || null,
    [viewingId, cheats],
  );

  function togglePlatform(id) {
    setPlatformFilter((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }

  function toggleTopic(id) {
    setTopicFilter((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }

  function clearFilters() {
    setQ("");
    setDebouncedQ("");
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
      <section data-ui="card" style={{ width: "min(980px, 100%)" }}>
        <div
          data-ui="row"
          style={{ justifyContent: "space-between", flexWrap: "wrap" }}
        >
          <div style={{ display: "grid", gap: 6 }}>
            <div data-ui="title">Cheats</div>
            <div data-ui="subtitle">
              No-scroll • <span data-ui="pill">/</span> search •{" "}
              <span data-ui="pill">⌘K</span> palette •{" "}
              <span data-ui="pill">N</span> new •{" "}
              <span data-ui="pill">Alt</span> reset
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
            <button data-ui="btn-refresh" onClick={refresh} disabled={isBusy}>
              <RefreshCw size={16} data-spin={refreshing} />
              <span>{refreshing ? "Refreshing" : "Refresh"}</span>
            </button>
            <button
              data-ui="btn-refresh"
              onClick={openNew}
              disabled={isBusy}
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <Plus size={16} />
              <span>New</span>
            </button>
          </div>
        </div>

        <div style={{ height: 14 }} />

        <div data-ui="row" style={{ gap: 10, alignItems: "stretch" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search
              size={16}
              style={{ position: "absolute", left: 12, top: 12, opacity: 0.7 }}
            />
            <input
              ref={searchRef}
              data-ui="input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title / code / notes…"
              style={{ paddingLeft: 38 }}
              disabled={loading}
            />
          </div>
          <button
            data-ui="btn-refresh"
            onClick={() => setPaletteOpen(true)}
            disabled={loading}
          >
            <Command size={16} />
            <span>Cmd+K</span>
          </button>
          <button
            data-ui="btn-refresh"
            onClick={clearFilters}
            disabled={loading}
          >
            <span>Clear</span>
          </button>
        </div>

        <div style={{ height: 12 }} />
        <div data-ui="divider" />
        <div style={{ height: 12 }} />

        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "grid", gap: 8 }}>
            <div data-ui="label">Platforms</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {platforms.map((p) => (
                <button
                  key={p.id}
                  data-ui="chip"
                  data-active={platformFilter.includes(p.id)}
                  onClick={() => togglePlatform(p.id)}
                  disabled={loading}
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
                  data-ui="chip"
                  data-active={topicFilter.includes(t.id)}
                  onClick={() => toggleTopic(t.id)}
                  disabled={loading}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section data-ui="card" style={{ width: "min(980px, 100%)" }}>
        <div
          data-ui="row"
          style={{ justifyContent: "space-between", flexWrap: "wrap" }}
        >
          <div style={{ display: "grid", gap: 4 }}>
            <div data-ui="label">Results</div>
            <div data-ui="hint">
              {isBusy ? "Loading…" : `${filtered.length} cheats`}
              {debouncedQ.trim() ? ` • matching "${debouncedQ.trim()}"` : ""}
            </div>
          </div>
          <div data-ui="row" style={{ gap: 10 }}>
            <button
              data-ui="btn-refresh"
              onClick={prevPage}
              disabled={loading || page <= 1}
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
            >
              <span>Next</span>
            </button>
          </div>
        </div>

        <div style={{ height: 12 }} />

        {isBusy ? (
          <SkeletonCard count={6} />
        ) : pageItems.length ? (
          <div data-ui="grid">
            {pageItems.map((c) => (
              <CheatItem
                key={c.id}
                cheat={c}
                query={debouncedQ}
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
            <button
              data-ui="btn-refresh"
              onClick={clearFilters}
              style={{ marginTop: 10 }}
            >
              Clear search and filters
            </button>
          </div>
        )}
      </section>

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
        onDelete={async () => {
          if (!confirm(`Delete "${viewingCheat?.title}"?`)) return;
          await deleteCheat(viewingCheat.id);
          closeView();
        }}
      />

      <CheatModal
        open={editOpen}
        onClose={closeEditor}
        mode={editingId ? "edit" : "new"}
        cheat={editingCheat}
      />

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        items={cheats.map((c) => ({
          id: c.id,
          title: c.title,
          subtitle: c.notes,
          keywords: c.code,
          onSelect: () => openView(c.id),
        }))}
      />
    </div>
  );
}
