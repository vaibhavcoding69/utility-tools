import { useState } from "react";
import api from "../../../../lib/api";

export function JsonToCsvTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await api.jsonToCsv(input);
      if (result.success) {
        setOutput(result.csv as string);
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
        <h2 className="tool-title">JSON to CSV</h2>
        <p className="tool-description">Convert JSON array to CSV format</p>
      </div>
      <div className="tool-content">
        <div className="tool-input-section">
          <label className="tool-label">JSON Input</label>
          <textarea
            className="tool-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='[{"name": "John", "email": "john@example.com"}, {"name": "Jane", "email": "jane@example.com"}]'
            rows={8}
          />
        </div>
        <div className="tool-actions">
          <button
            className="btn primary"
            onClick={handleConvert}
            disabled={loading || !input}
            title={loading ? "Processing..." : !input ? "Enter JSON data first" : undefined}
          >
            {loading ? "Converting..." : "Convert to CSV"}
          </button>
        </div>
        {error && <div className="tool-error">{error}</div>}
        {output && (
          <div className="tool-output-section">
            <label className="tool-label">CSV Output</label>
            <pre className="tool-output">
              <code>{output}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
