import { useState } from "react";
import api from "../../../../lib/api";

export function SqlFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFormat = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await api.formatSql(input);
      if (result.success) {
        setOutput(result.formatted as string);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Formatting failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">SQL Formatter</h2>
        <p className="tool-description">Format and beautify SQL queries</p>
      </div>
      <div className="tool-content">
        <div className="tool-input-section">
          <label className="tool-label">SQL Query</label>
          <textarea
            className="tool-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="SELECT * FROM users WHERE id = 1 AND status = 'active'"
            rows={8}
          />
        </div>
        <div className="tool-actions">
          <button
            className="btn primary"
            onClick={handleFormat}
            disabled={loading || !input}
            title={loading ? "Processing..." : !input ? "Enter SQL query first" : undefined}
          >
            {loading ? "Formatting..." : "Format SQL"}
          </button>
        </div>
        {error && <div className="tool-error">{error}</div>}
        {output && (
          <div className="tool-output-section">
            <label className="tool-label">Formatted SQL</label>
            <pre className="tool-output">
              <code>{output}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
