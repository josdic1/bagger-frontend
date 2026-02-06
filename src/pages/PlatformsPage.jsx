// src/pages/PlatformsPage.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useData } from "../hooks/useData";
import { RefreshCw, Search, Plus } from "lucide-react";
import { PlatformItem } from "../components/platforms/PlatformItem";
import { PlatformModal } from "../components/platforms/PlayformModal";
import { PlatformViewModal} from "../components/platforms/PlatformViewModal";
import { SkeletonCard } from "../components/shared/SkeletonCard";
import { NoResults } from "../pages/NoResults";

const PAGE_SIZE = 12;

function normalizeType(t) {
  const v = String(t || "").toLowerCase();
  if (v === "language" || v === "framework" || v === "tool" || v === "format")
    return v;
  return "all";
}

export function PlatformsPage() {
  const nav = useNavigate();
  const {
    loading,
    refreshing,
    platforms = [],
    cheats = [],
    refresh,
  } = useData();

  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);

  // view / edit in modals (no route changes needed)
  const [viewOpen, setViewOpen] = useState(false);
  const [viewingId, setViewingId] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const searchRef = useRef(null);

  const isBusy = loading || refreshing;

  useEffect(() => {
    function onKeyDown(e) {
      const key = e.key.toLowerCase();
      const meta = e.metaKey || e.ctrlKey;

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
      if (!meta && key === "escape") {
        if (viewOpen) closeView();
        if (editOpen) closeEdit();
      }
      if (!meta && key === "arrowright") {
        e.preventDefault();
        nextPage();
      }
      if (!meta && key === "arrowleft") {
        e.preventDefault();
        prevPage();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [viewOpen, editOpen]);

  useEffect(() => {
    setPage(1);
  }, [q, type]);

  const countsByPlatformId = useMemo(() => {
    const m = new Map();
    for (const c of cheats || []) {
      for (const pid of c?.platform_ids || []) {
        m.set(pid, (m.get(pid) || 0) + 1);
      }
    }
    return m;
  }, [cheats]);

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    const wantType = normalizeType(type);

    return (platforms || []).filter((p) => {
      if (wantType !== "all" && normalizeType(p?.type) !== wantType)
        return false;

      if (text) {
        const hay =
          `${p?.name || ""}\n${p?.slug || ""}\n${p?.type || ""}`.toLowerCase();
        if (!hay.includes(text)) return false;
      }
      return true;
    });
  }, [platforms, q, type]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  }, [filtered.length]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const viewingPlatform = useMemo(() => {
    if (!viewingId) return null;
    return (platforms || []).find((p) => p.id === viewingId) || null;
  }, [viewingId, platforms]);

  const editingPlatform = useMemo(() => {
    if (!editingId) return null;
    return (platforms || []).find((p) => p.id === editingId) || null;
  }, [editingId, platforms]);

  function openNew() {
    setEditingId(null);
    setEditOpen(true);
  }

  function openView(id) {
    setViewingId(id);
    setViewOpen(true);
  }

  function closeView() {
    setViewOpen(false);
    setViewingId(null);
  }

  function openEdit(id) {
    setEditingId(id);
    setEditOpen(true);
  }

  function closeEdit() {
    setEditOpen(false);
    setEditingId(null);
  }

  function clearFilters() {
    setQ("");
    setType("all");
    setPage(1);
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
      {/* Header + filters */}
      <section data-ui="card" style={{ width: "min(980px, 100%)" }}>
        <div
          data-ui="row"
          style={{ justifyContent: "space-between", flexWrap: "wrap" }}
        >
          <div style={{ display: "grid", gap: 6 }}>
            <div data-ui="title">Platforms</div>
            <div data-ui="subtitle">
              Keyboard-first. <span data-ui="pill">/</span> search •{" "}
              <span data-ui="pill">N</span> new •{" "}
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
              title="New platform (N)"
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
              placeholder="Search name / slug / type… ( / )"
              style={{ paddingLeft: 38 }}
              disabled={loading}
            />
          </div>

          <select
            data-ui="input"
            value={type}
            onChange={(e) => setType(e.target.value)}
            disabled={loading}
            style={{ maxWidth: 220 }}
          >
            <option value="all">All types</option>
            <option value="language">language</option>
            <option value="framework">framework</option>
            <option value="tool">tool</option>
            <option value="format">format</option>
          </select>

          <button
            data-ui="btn-refresh"
            onClick={clearFilters}
            disabled={loading}
            title="Clear search + filter"
          >
            <span>Clear</span>
          </button>
        </div>

        <div style={{ height: 12 }} />
        <div data-ui="divider" />
        <div style={{ height: 12 }} />

        <div data-ui="row" style={{ justifyContent: "space-between" }}>
          <div style={{ display: "grid", gap: 2 }}>
            <div data-ui="label">Results</div>
            <div data-ui="hint">
              {isBusy ? "Loading…" : `${filtered.length} platforms`}
              {q.trim() ? ` • matching “${q.trim()}”` : ""}
            </div>
          </div>

          <div data-ui="row" style={{ gap: 10 }}>
            <button
              data-ui="btn-refresh"
              onClick={prevPage}
              disabled={loading || page <= 1}
              title="Prev (←)"
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
              title="Next (→)"
            >
              <span>Next</span>
            </button>
          </div>
        </div>
      </section>

      {/* Table */}
      <section data-ui="card" style={{ width: "min(980px, 100%)" }}>
        {isBusy ? (
          <SkeletonCard count={10} />
        ) : !pageItems.length ? (
          <NoResults
            title="No platforms"
            hint="Create one, or clear filters."
          />
        ) : (
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
                  Used
                </th>
                <th align="left" style={{ padding: 12, width: 220 }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((p) => (
                <PlatformItem
                  key={p.id}
                  platform={p}
                  usedCount={countsByPlatformId.get(p.id) || 0}
                  onView={() => openView(p.id)}
                  onEdit={() => openEdit(p.id)}
                />
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* View modal */}
      <PlatformViewModal
        open={viewOpen}
        onClose={closeView}
        platform={viewingPlatform}
        usedCount={
          viewingPlatform ? countsByPlatformId.get(viewingPlatform.id) || 0 : 0
        }
        onEdit={() => {
          if (!viewingId) return;
          closeView();
          openEdit(viewingId);
        }}
      />

      {/* Create/Edit modal */}
      <PlatformModal
        open={editOpen}
        onClose={closeEdit}
        mode={editingId ? "edit" : "new"}
        platform={editingPlatform}
      />
    </div>
  );
}
