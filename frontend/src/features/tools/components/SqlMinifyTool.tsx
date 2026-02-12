import { useState } from "react";
import api from "../../../lib/api";

export default function SqlMinifyTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const minify = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.minifySql(input);
      if (res.success) setOutput(res.minified as string);
    } catch (e: any) {
      setError(e.message || "Failed to minify");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    if (output) navigator.clipboard.writeText(output);
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">SQL Minifier</h2>
        <p className="tool-description">Compact SQL by stripping whitespace and comments</p>
      </div>
      <div className="tool-content">
        <div className="tool-input-section">
          <label className="tool-label">SQL Query</label>
          <textarea
            className="tool-textarea"
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="SELECT * FROM users WHERE active = 1;"
          />
        </div>
        <div className="tool-actions">
          <button className="btn primary" onClick={minify} disabled={!input || loading} title={loading ? "Processing..." : !input ? "Enter SQL query first" : undefined}>
            {loading ? "Minifying..." : "Minify"}
          </button>
          <button className="btn secondary" onClick={copy} disabled={!output}>
            Copy
          </button>
        </div>
        {error && <div className="tool-error">{error}</div>}
        <div className="tool-output-section">
          <label className="tool-label">Minified SQL</label>
          <pre className="tool-output">{output || "Output will appear here..."}</pre>
        </div>
      </div>
    </div>
  );
}
