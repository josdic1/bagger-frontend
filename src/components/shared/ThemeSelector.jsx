// src/components/shared/ThemeSelector.jsx
import { useTheme } from "../../providers/ThemeProvider";

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  // You said you don't want theme buttons showing.
  // This component is kept for later, but renders nothing for now.
  return null;

  // If you ever want it back, restore this:
  /*
  return (
    <select
      data-ui="theme-select"
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
    >
      <option value="minimal">Minimal</option>
      <option value="haunted">Haunted</option>
      <option value="jungle">Jungle</option>
      <option value="outrun">Outrun</option>
    </select>
  );
  */
}
