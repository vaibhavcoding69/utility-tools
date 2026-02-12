import { useState } from "react";
import api from "../../../lib/api";

export function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFormat = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setOutput("");
    try {
      const result = await api.formatJson(input, indent, sortKeys);
      if (result.success && result.valid) {
        setOutput(result.formatted as string);
      } else {
        setError((result.error as string) || "Invalid JSON syntax");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to format JSON");
    } finally {
      setLoading(false);
    }
  };

  const handleMinify = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setOutput("");
    try {
      const result = await api.formatJson(input, 0, false);
      if (result.success && result.valid) {
        setOutput(result.formatted as string);
      } else {
        setError((result.error as string) || "Invalid JSON syntax");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to minify JSON");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch (err) {
      console.error("Failed to paste:", err);
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">
          <span className="tool-title-icon">
            <i className="bi bi-braces" />
          </span>
          JSON Formatter
        </h2>
        <p className="tool-description">
          Format, validate, and beautify JSON data with customizable indentation and key sorting options.
        </p>
      </div>

      <div className="tool-content">
        <div className="tool-options">
          <div className="tool-option">
            <label className="tool-label">
              <i className="bi bi-text-indent-left" />
              Indentation
            </label>
            <div className="tool-option-inline">
              <input
                type="number"
                className="tool-input-small"
                value={indent}
                onChange={(e) => setIndent(Math.max(0, Math.min(8, Number(e.target.value))))}
                min={0}
                max={8}
              />
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>spaces</span>
            </div>
          </div>
          
          <div className="tool-option">
            <label className="tool-label">
              <i className="bi bi-sort-alpha-down" />
              Options
            </label>
            <label className="tool-checkbox-label">
              <input
                type="checkbox"
                checked={sortKeys}
                onChange={(e) => setSortKeys(e.target.checked)}
              />
              Sort keys alphabetically
            </label>
          </div>
        </div>

        <div className="tool-input-section">
          <div className="tool-section-header">
            <label className="tool-label">
              <i className="bi bi-code-slash" />
              Input JSON
            </label>
            <button className="btn-icon" onClick={handlePaste} title="Paste from clipboard">
              <i className="bi bi-clipboard" />
            </button>
          </div>
          <textarea
            className="tool-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"name": "John", "age": 30, "city": "New York"}'
            rows={10}
            spellCheck={false}
          />
        </div>

        <div className="tool-actions">
          <button
            className="btn primary"
            onClick={handleFormat}
            disabled={loading || !input.trim()}
            title={loading ? "Processing..." : !input.trim() ? "Enter JSON input first" : undefined}
          >
            {loading ? (
              <>
                <i className="bi bi-arrow-repeat" style={{ animation: "spin 1s linear infinite" }} />
                Processing...
              </>
            ) : (
              <>
                <i className="bi bi-magic" />
                Format
              </>
            )}
          </button>
          <button
            className="btn secondary"
            onClick={handleMinify}
            disabled={loading || !input.trim()}
            title={loading ? "Processing..." : !input.trim() ? "Enter JSON input first" : undefined}
          >
            <i className="bi bi-arrows-collapse" />
            Minify
          </button>
          <button
            className="btn ghost"
            onClick={handleCopy}
            disabled={!output}
          >
            <i className={copied ? "bi bi-check-lg" : "bi bi-clipboard"} />
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            className="btn ghost"
            onClick={handleClear}
            disabled={!input && !output}
          >
            <i className="bi bi-x-lg" />
            Clear
          </button>
        </div>

        {error && (
          <div className="tool-error">
            {error}
          </div>
        )}

        {output && (
          <div className="tool-output-section">
            <div className="tool-section-header">
              <label className="tool-label">
                <i className="bi bi-check-circle" />
                Formatted Output
                <span className="tool-label-badge">Valid JSON</span>
              </label>
            </div>
            <div className="code-block">
              <div className="code-block-header">
                <span className="code-block-lang">JSON</span>
                <button className="btn-icon" onClick={handleCopy} title="Copy to clipboard">
                  <i className={copied ? "bi bi-check-lg" : "bi bi-clipboard"} />
                </button>
              </div>
              <div className="code-block-content">
                <pre><code>{output}</code></pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JsonFormatter;
