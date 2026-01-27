import { useState } from "react";
import api from "../../../lib/api";

export default function CssInlineTool() {
  const [html, setHtml] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inline = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.inlineCss(html, baseUrl || undefined);
      if (res.success) setOutput(res.html as string);
    } catch (e: any) {
      setError(e.message || "Failed to inline");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">CSS Inliner</h2>
        <p className="tool-description">Inline CSS for HTML emails</p>
      </div>
      <div className="tool-content">
        <div className="tool-input-section">
          <label className="tool-label">HTML</label>
          <textarea
            className="tool-textarea"
            rows={8}
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            placeholder="<html><head><style>...</style></head><body>...</body></html>"
          />
        </div>
        <div className="tool-options">
          <div className="tool-option">
            <label className="tool-label">Base URL (optional)</label>
            <input
              className="tool-input"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
        </div>
        <div className="tool-actions">
          <button className="btn primary" onClick={inline} disabled={!html || loading}>
            {loading ? "Inliner running..." : "Inline CSS"}
          </button>
        </div>
        {error && <div className="tool-error">{error}</div>}
        {output && (
          <div className="tool-output-section">
            <label className="tool-label">Inlined HTML</label>
            <textarea className="tool-textarea" value={output} readOnly rows={10} />
          </div>
        )}
      </div>
    </div>
  );
}
