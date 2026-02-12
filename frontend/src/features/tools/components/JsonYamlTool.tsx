import { useState } from "react";
import api from "../../../lib/api";

export default function JsonYamlTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const convert = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.jsonToYaml(input);
      if (res.success) setOutput(res.yaml as string);
    } catch (e: any) {
      setError(e.message || "Conversion failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">JSON → YAML</h2>
        <p className="tool-description">Convert JSON into YAML</p>
      </div>
      <div className="tool-content">
        <div className="tool-input-section">
          <label className="tool-label">JSON Input</label>
          <textarea
            className="tool-textarea"
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"name":"Ada"}'
          />
        </div>
        <div className="tool-actions">
          <button className="btn primary" onClick={convert} disabled={!input || loading} title={loading ? "Processing..." : !input ? "Enter JSON input first" : undefined}>
            {loading ? "Converting..." : "Convert"}
          </button>
          <button
            className="btn secondary"
            onClick={() => navigator.clipboard.writeText(output)}
            disabled={!output}
          >
            Copy
          </button>
        </div>
        {error && <div className="tool-error">{error}</div>}
        <div className="tool-output-section">
          <label className="tool-label">YAML Output</label>
          <pre className="tool-output">{output || "Output will appear here..."}</pre>
        </div>
      </div>
    </div>
  );
}
