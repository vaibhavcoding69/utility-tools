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
        <h2 className="tool-title">
          <span className="tool-title-icon">
            <i className="bi bi-gear" />
          </span>
          .env → netlify.toml
        </h2>
        <p className="tool-description">Convert environment variables into Netlify deployment config.</p>
      </div>
      <div className="tool-content">
        <div className="tool-input-section">
          <div className="tool-section-header">
            <label className="tool-label">
              <i className="bi bi-file-earmark-text" />
              .env content
            </label>
            <span className="input-length">{envText.split('\n').filter(l => l.trim()).length} vars</span>
          </div>
          <textarea
            className="tool-textarea"
            value={envText}
            onChange={(e) => setEnvText(e.target.value)}
            rows={8}
            placeholder={`API_URL=https://api.example.com\nTOKEN=abc123`}
            spellCheck={false}
          />
        </div>
        <div className="tool-input-section">
          <div className="tool-section-header">
            <label className="tool-label">
              <i className="bi bi-globe" />
              Site name (optional)
            </label>
          </div>
          <input
            className="tool-input"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            placeholder="my-site"
          />
        </div>
        <div className="tool-actions">
          <button className="btn primary" onClick={convert} disabled={!envText || loading} title={loading ? "Processing..." : !envText ? "Enter .env content first" : undefined}>
            {loading ? (
              <>
                <i className="bi bi-arrow-repeat" style={{ animation: "spin 1s linear infinite", marginRight: "6px" }} />
                Converting...
              </>
            ) : (
              <>
                <i className="bi bi-arrow-repeat" style={{ marginRight: "6px" }} />
                Convert
              </>
            )}
          </button>
        </div>
        {error && <div className="tool-error">{error}</div>}
        {output && (
          <div className="tool-output-section">
            <div className="tool-section-header">
              <label className="tool-label">
                <i className="bi bi-file-earmark-code" />
                netlify.toml
              </label>
            </div>
            <textarea className="tool-textarea" value={output} readOnly rows={10} />
          </div>
        )}
      </div>
    </div>
  );
}
