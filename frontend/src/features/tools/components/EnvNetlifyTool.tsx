import { useState } from "react";
import api from "../../../lib/api";

export default function EnvNetlifyTool() {
  const [envText, setEnvText] = useState("");
  const [siteName, setSiteName] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const convert = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.envToNetlify(envText, siteName || undefined);
      if (res.success) setOutput(res.toml as string);
    } catch (e: any) {
      setError(e.message || "Conversion failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">.env → netlify.toml</h2>
        <p className="tool-description">Convert environment variables into Netlify config</p>
      </div>
      <div className="tool-content">
        <div className="tool-input-section">
          <label className="tool-label">.env content</label>
          <textarea
            className="tool-textarea"
            value={envText}
            onChange={(e) => setEnvText(e.target.value)}
            rows={8}
            placeholder={`API_URL=https://api.example.com\nTOKEN=abc123`}
          />
        </div>
        <div className="tool-options">
          <div className="tool-option">
            <label className="tool-label">Site name (optional)</label>
            <input
              className="tool-input"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="my-site"
            />
          </div>
        </div>
        <div className="tool-actions">
          <button className="btn primary" onClick={convert} disabled={!envText || loading} title={loading ? "Processing..." : !envText ? "Enter .env content first" : undefined}>
            {loading ? "Converting..." : "Convert"}
          </button>
        </div>
        {error && <div className="tool-error">{error}</div>}
        {output && (
          <div className="tool-output-section">
            <label className="tool-label">netlify.toml</label>
            <textarea className="tool-textarea" value={output} readOnly rows={10} />
          </div>
        )}
      </div>
    </div>
  );
}
