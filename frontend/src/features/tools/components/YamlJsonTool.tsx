import { useState } from "react";

export default function YamlJsonTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"yaml-to-json" | "json-to-yaml">(
    "yaml-to-json",
  );
  const [error, setError] = useState("");

  const convert = async () => {
    if (!input.trim()) {
      setError("Please enter some content");
      return;
    }
    setError("");
    try {
      const endpoint =
        mode === "yaml-to-json"
          ? "/api/developer/yaml-to-json"
          : "/api/developer/json-to-yaml";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: input }),
      });
      const result = await res.json();
      if (!result.success) {
        setError(result.error || result.detail || "Conversion failed");
      } else {
        setOutput(mode === "yaml-to-json" ? result.json : result.yaml);
      }
    } catch {
      setError("Conversion failed");
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">
          {mode === "yaml-to-json" ? "YAML to JSON" : "JSON to YAML"}
        </h2>
        <p className="tool-description">
          Convert between YAML and JSON formats
        </p>
      </div>
      <div className="tool-content">
        <div className="tool-options">
          <div className="tool-option">
            <label className="tool-label">Mode</label>
            <select
              className="tool-select"
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
            >
              <option value="yaml-to-json">YAML → JSON</option>
              <option value="json-to-yaml">JSON → YAML</option>
            </select>
          </div>
        </div>
        <div className="tool-input-section">
          <label className="tool-label">Input</label>
          <textarea
            className="tool-textarea"
            placeholder={
              mode === "yaml-to-json"
                ? "Paste YAML here..."
                : "Paste JSON here..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="tool-actions">
          <button className="btn primary" onClick={convert}>
            Convert
          </button>
          <button
            className="btn secondary"
            onClick={copyOutput}
            disabled={!output}
          >
            Copy
          </button>
        </div>
        {error && <div className="tool-error">{error}</div>}
        <div className="tool-output-section">
          <label className="tool-label">Output</label>
          <pre className="tool-output">
            {output || "Output will appear here..."}
          </pre>
        </div>
      </div>
    </div>
  );
}
