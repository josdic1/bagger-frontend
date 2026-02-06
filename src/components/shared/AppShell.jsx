// src/components/shared/AppShell.jsx
import { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { NavBar } from "./NavBar";
import { ToastContainer } from "./ToastContainer";
import { SyncIndicator } from "./SyncIndicator";

import { useData } from "../../hooks/useData";
import { CommandPalette } from "../cheats/CommandPalette";

export function AppShell({ toasts = [], removeToast }) {
  const nav = useNavigate();
  const {
    cheats = [],
    topics = [],
    platforms = [],
    loading,
    refreshing,
  } = useData();

  const [paletteOpen, setPaletteOpen] = useState(false);

  // Cmd+K / Ctrl+K opens palette
  useEffect(() => {
    function onKey(e) {
      const key = String(e.key || "").toLowerCase();
      if ((e.metaKey || e.ctrlKey) && key === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const items = useMemo(() => {
    const out = [];

    // Actions first (always useful)
    out.push(
      {
        id: "action:new-cheat",
        title: "+ New Cheat",
        subtitle: "Action",
        keywords: "new create cheat",
        onSelect: () => nav("/cheat/new"),
      },
      {
        id: "action:new-topic",
        title: "+ New Topic",
        subtitle: "Action",
        keywords: "new create topic",
        onSelect: () => nav("/topic/new"),
      },
      {
        id: "action:new-platform",
        title: "+ New Platform",
        subtitle: "Action",
        keywords: "new create platform",
        onSelect: () => nav("/platform/new"),
      },
      {
        id: "nav:cheats",
        title: "Go to Cheats",
        subtitle: "Navigate",
        keywords: "cheats list",
        onSelect: () => nav("/cheats"),
      },
      {
        id: "nav:topics",
        title: "Go to Topics",
        subtitle: "Navigate",
        keywords: "topics list",
        onSelect: () => nav("/topics"),
      },
      {
        id: "nav:platforms",
        title: "Go to Platforms",
        subtitle: "Navigate",
        keywords: "platforms list",
        onSelect: () => nav("/platforms"),
      },
    );

    // Cheats (open edit page for now)
    if (Array.isArray(cheats)) {
      for (const c of cheats) {
        out.push({
          id: `cheat:${c.id}`,
          title: c.title || "(untitled cheat)",
          subtitle: "Cheat",
          keywords: `${c.title || ""} ${c.code || ""} ${c.notes || ""}`,
          onSelect: () => nav(`/cheat/${c.id}/edit`),
        });
      }
    }

    // Topics (navigate to topics list; you can later add a view modal)
    if (Array.isArray(topics)) {
      for (const t of topics) {
        out.push({
          id: `topic:${t.id}`,
          title: t.name || "(untitled topic)",
          subtitle: "Topic",
          keywords: `${t.name || ""} ${t.slug || ""}`,
          onSelect: () => nav("/topics"),
        });
      }
    }

    // Platforms (navigate to platforms list)
    if (Array.isArray(platforms)) {
      for (const p of platforms) {
        out.push({
          id: `platform:${p.id}`,
          title: p.name || "(untitled platform)",
          subtitle: `Platform • ${p.type || ""}`,
          keywords: `${p.name || ""} ${p.slug || ""} ${p.type || ""}`,
          onSelect: () => nav("/platforms"),
        });
      }
    }

    return out;
  }, [cheats, topics, platforms, nav]);

  const hint =
    loading || refreshing
      ? "Loading data… (actions still work)"
      : "Cmd+K / Ctrl+K • Enter to open • Esc to close";

  return (
    <div data-ui="app">
      <SyncIndicator />
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <header data-ui="header">
        <NavBar onOpenPalette={() => setPaletteOpen(true)} />
      </header>

      <main data-ui="main">
        <Outlet />
      </main>

      <footer data-ui="footer">
        <p>© 2026 // BAGGER</p>
      </footer>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        items={items}
        placeholder="Search cheats, topics, platforms…"
        hint={hint}
      />
    </div>
  );
}
