import Editor from "@monaco-editor/react";

export function IdePage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 100px)", // Adjust based on your header height
        width: "100%", // Force it to fill the width
        padding: "1rem",
        boxSizing: "border-box",
      }}
    >
      <div style={{ padding: "10px", background: "#1e1e1e", color: "white" }}>
        <strong>Bagger IDE</strong> - Scratchpad.js
      </div>
      <div style={{ flex: 1, width: "100%", border: "1px solid #333" }}>
        <Editor
          height="100%"
          width="100%"
          defaultLanguage="javascript"
          defaultValue="// Build something awesome..."
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 16,
            automaticLayout: true, // Crucial: tells Monaco to resize with the window
          }}
        />
      </div>
    </div>
  );
}
