// src/providers/ThemeProvider.jsx
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const ThemeContext = createContext(null);

const KEY = "theme";
const THEMES = ["minimal", "haunted", "jungle", "outrun"];

const themeModules = {
  minimal: () => import("../themes/minimal/minimal.js"),
  haunted: () => import("../themes/haunted/haunted.js"),
  jungle: () => import("../themes/jungle/jungle.js"),
  outrun: () => import("../themes/outrun/outrun.js"),
};

export function ThemeProvider({ children }) {
  // Force minimal every time
  const [theme, setThemeState] = useState("minimal");

  const [manifest, setManifest] = useState({
    key: "minimal",
    label: "Minimal",
  });

  const cleanupRef = useRef(null);

  const setTheme = (next) => {
    // keep API, but default stays minimal unless you call setTheme elsewhere
    const safe = THEMES.includes(next) ? next : "minimal";
    localStorage.setItem(KEY, safe);
    setThemeState(safe);
  };

  useEffect(() => {
    // ensure stored theme doesn't override your default unless you explicitly setTheme
    localStorage.setItem(KEY, "minimal");
  }, []);

  useEffect(() => {
    let alive = true;

    async function loadTheme() {
      document.documentElement.setAttribute("data-theme", theme);

      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }

      try {
        const modLoader = themeModules[theme] ?? themeModules.minimal;
        const mod = await modLoader();
        const themeObj = mod?.default;

        if (!alive || !themeObj) return;

        setManifest(themeObj.manifest ?? { key: theme, label: theme });

        if (typeof themeObj.mount === "function") {
          const cleanup = await themeObj.mount();
          cleanupRef.current = typeof cleanup === "function" ? cleanup : null;
        }
      } catch {
        if (!alive) return;
        setManifest({ key: theme, label: theme });
      }
    }

    loadTheme();

    return () => {
      alive = false;
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [theme]);

  const value = useMemo(
    () => ({ theme, setTheme, themes: THEMES, manifest }),
    [theme, manifest],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
