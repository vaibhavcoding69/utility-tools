import { useState } from "react";
import api from "../../../../lib/api";

export function CsvToJsonTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await api.csvToJson(input);
      if (result.success) {
        setOutput(
          typeof result.json === "string"
            ? result.json
            : JSON.stringify(result.data, null, 2),
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">CSV to JSON</h2>
        <p className="tool-description">Convert CSV data to JSON format</p>
      </div>
      <div className="tool-content">
        <div className="tool-input-section">
          <label className="tool-label">CSV Input</label>
          <textarea
            className="tool-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="name,email,age&#10;John,john@example.com,30&#10;Jane,jane@example.com,25"
            rows={8}
          />
        </div>
        <div className="tool-actions">
          <button
            className="btn primary"
            onClick={handleConvert}
            disabled={loading || !input}
            title={loading ? "Processing..." : !input ? "Enter CSV data first" : undefined}
          >
            {loading ? "Converting..." : "Convert to JSON"}
          </button>
        </div>
        {error && <div className="tool-error">{error}</div>}
        {output && (
          <div className="tool-output-section">
            <label className="tool-label">JSON Output</label>
            <pre className="tool-output">
              <code>{output}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
