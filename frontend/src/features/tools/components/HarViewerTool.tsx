import { useState } from "react";
import api from "../../../lib/api";

export default function HarViewerTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [maxEntries, setMaxEntries] = useState(50);

  const summarize = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.harSummary(input, maxEntries);
      if (res.success) {
        setOutput({
          entries: res.entries,
          totalEntries: res.total_entries,
          totalSize: res.total_size,
          totalTime: res.total_time,
        });
      }
    } catch (e: any) {
      setError(e.message || "Failed to parse HAR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">HAR Viewer</h2>
        <p className="tool-description">Summarize HAR files (network traces)</p>
      </div>
      <div className="tool-content">
        <div className="tool-input-section">
          <label className="tool-label">HAR JSON</label>
          <textarea
            className="tool-textarea"
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste HAR file content"
          />
        </div>
        <div className="tool-options">
          <div className="tool-option">
            <label className="tool-label">Max entries</label>
            <input
              className="tool-input-small"
              type="number"
              min={1}
              max={500}
              value={maxEntries}
              onChange={(e) => setMaxEntries(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="tool-actions">
          <button className="btn primary" onClick={summarize} disabled={!input || loading} title={loading ? "Processing..." : !input ? "Enter HAR JSON first" : undefined}>
            {loading ? "Summarizing..." : "Summarize"}
          </button>
        </div>
        {error && <div className="tool-error">{error}</div>}
        {output && (
          <div className="tool-output-section">
            <label className="tool-label">Summary</label>
            <pre className="tool-output" style={{ maxHeight: 400, overflow: "auto" }}>
              {JSON.stringify(output, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
