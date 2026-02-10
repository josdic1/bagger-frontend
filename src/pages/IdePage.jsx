import { useState } from "react";
import Editor from "@monaco-editor/react";

export function IdePage() {
  const [code, setCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <style>
    body {
      font-family: 'Courier New', monospace;
      background: #0a0e14;
      color: #c7c7c7;
      padding: 20px;
    }
    button {
      background: #39ff14;
      color: #0a0e14;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-family: 'Courier New', monospace;
      font-weight: bold;
    }
    button:hover {
      opacity: 0.8;
    }
  </style>
</head>
<body>
  <h1>Hello from Bagger IDE</h1>
  <button onclick="alert('It works!')">Click Me</button>
</body>
</html>`);

  const [previewCode, setPreviewCode] = useState(code); // Separate state for preview
  const [language, setLanguage] = useState("html");

  const handleRun = () => {
    setPreviewCode(code);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 100px)",
        width: "100%",
        padding: "1rem",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "10px",
          background: "#1e1e1e",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #333",
        }}
      >
        <strong>Bagger IDE</strong>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              background: "#0a0e14",
              color: "#c7c7c7",
              border: "1px solid #333",
              padding: "5px 10px",
              borderRadius: "4px",
              fontFamily: "'Courier New', monospace",
              cursor: "pointer",
            }}
          >
            <option value="html">HTML</option>
            <option value="javascript">JavaScript</option>
            <option value="css">CSS</option>
            <option value="python">Python</option>
          </select>
          {language === "html" && (
            <button
              onClick={handleRun}
              style={{
                background: "#39ff14",
                color: "#0a0e14",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
                fontFamily: "'Courier New', monospace",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              ▶ Run Code
            </button>
          )}
        </div>
      </div>

      {/* Split View: Editor + Preview */}
      <div
        style={{
          flex: 1,
          display: "flex",
          gap: "1rem",
          overflow: "hidden",
        }}
      >
        {/* Editor Panel */}
        <div
          style={{
            flex: 1,
            border: "1px solid #333",
            display: "flex",
            flexDirection: "column",
            background: "#1e1e1e",
          }}
        >
          <div
            style={{
              background: "#2a2a2a",
              color: "#c7c7c7",
              padding: "8px 12px",
              fontSize: "12px",
              borderBottom: "1px solid #333",
              fontWeight: "bold",
              letterSpacing: "0.5px",
            }}
          >
            CODE
          </div>
          <Editor
            height="100%"
            width="100%"
            language={language}
            value={code}
            onChange={(value) => setCode(value || "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              automaticLayout: true,
              wordWrap: "on",
              scrollBeyondLastLine: false,
              lineNumbers: "on",
              renderLineHighlight: "all",
              cursorBlinking: "smooth",
            }}
          />
        </div>

        {/* Preview Panel */}
        <div
          style={{
            flex: 1,
            border: "1px solid #333",
            display: "flex",
            flexDirection: "column",
            background: "#fff",
          }}
        >
          <div
            style={{
              background: "#2a2a2a",
              color: "#c7c7c7",
              padding: "8px 12px",
              fontSize: "12px",
              borderBottom: "1px solid #333",
              fontWeight: "bold",
              letterSpacing: "0.5px",
            }}
          >
            PREVIEW {language !== "html" && "(HTML only)"}
          </div>
          {language === "html" ? (
            <iframe
              key={previewCode} // Force re-render on code change
              srcDoc={previewCode}
              title="preview"
              sandbox="allow-scripts allow-modals"
              style={{
                flex: 1,
                border: "none",
                background: "white",
                width: "100%",
                height: "100%",
              }}
            />
          ) : (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#8a8a8a",
                fontFamily: "'Courier New', monospace",
                fontSize: "14px",
                background: "#0a0e14",
                gap: "10px",
              }}
            >
              <div>Preview only available for HTML</div>
              <div style={{ fontSize: "12px", color: "#5a5a5a" }}>
                Switch to HTML to see live preview
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
