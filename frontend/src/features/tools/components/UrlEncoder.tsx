import { useState } from "react";
import api from "../../../lib/api";

export function UrlEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);

  const handleProcess = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setOutput("");
    try {
      if (mode === "encode") {
        const result = await api.encodeUrl(input);
        if (result.success) {
          setOutput(result.encoded as string);
        }
      } else {
        const result = await api.decodeUrl(input);
        if (result.success) {
          setOutput(result.decoded as string);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${mode} URL`);
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

  const handleSwap = () => {
    setInput(output);
    setOutput("");
    setError("");
    setMode(mode === "encode" ? "decode" : "encode");
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">
          <span className="tool-title-icon">
            <i className="bi bi-link-45deg" />
          </span>
          URL Encoder/Decoder
        </h2>
        <p className="tool-description">
          Encode special characters for URLs or decode percent-encoded URL strings back to readable text.
        </p>
      </div>

      <div className="tool-content">
        {/* Mode Toggle */}
        <div className="tool-tabs">
          <button
            className={`tool-tab ${mode === "encode" ? "active" : ""}`}
            onClick={() => setMode("encode")}
          >
            <i className="bi bi-box-arrow-in-right" style={{ marginRight: "6px" }} />
            Encode
          </button>
          <button
            className={`tool-tab ${mode === "decode" ? "active" : ""}`}
            onClick={() => setMode("decode")}
          >
            <i className="bi bi-box-arrow-left" style={{ marginRight: "6px" }} />
            Decode
          </button>
        </div>

        {/* Input Section */}
        <div className="tool-input-section">
          <div className="tool-section-header">
            <label className="tool-label">
              <i className="bi bi-input-cursor-text" />
              {mode === "encode" ? "Text to Encode" : "URL to Decode"}
            </label>
            <span className="char-count">{input.length} characters</span>
          </div>
          <textarea
            className="tool-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" 
              ? "Enter text with special characters to encode (e.g., Hello World!)" 
              : "Enter percent-encoded URL (e.g., Hello%20World%21)"
            }
            rows={5}
            spellCheck={false}
          />
        </div>

        {/* Action Buttons */}
        <div className="tool-actions">
          <button
            className="btn primary"
            onClick={handleProcess}
            disabled={loading || !input.trim()}
          >
            {loading ? (
              <>
                <i className="bi bi-hourglass-split" style={{ marginRight: "6px" }} />
                Processing...
              </>
            ) : (
              <>
                <i className={`bi ${mode === "encode" ? "bi-arrow-right-circle" : "bi-arrow-left-circle"}`} style={{ marginRight: "6px" }} />
                {mode === "encode" ? "Encode" : "Decode"}
              </>
            )}
          </button>
          <button
            className="btn secondary"
            onClick={handleSwap}
            disabled={!output}
            title="Swap input and output, switch mode"
          >
            <i className="bi bi-arrow-down-up" style={{ marginRight: "6px" }} />
            Swap
          </button>
          <button
            className="btn ghost"
            onClick={handleClear}
            disabled={!input && !output}
            title="Clear all"
          >
            <i className="bi bi-x-lg" style={{ marginRight: "6px" }} />
            Clear
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="tool-error">
            <i className="bi bi-exclamation-triangle" style={{ marginRight: "8px" }} />
            {error}
          </div>
        )}

        {/* Output Section */}
        {output && (
          <div className="tool-output-section">
            <div className="tool-section-header">
              <label className="tool-label">
                <i className="bi bi-file-text" />
                {mode === "encode" ? "Encoded URL" : "Decoded Text"}
              </label>
              <div className="tool-section-actions">
                <button
                  className="btn-icon"
                  onClick={handleCopy}
                  title={copied ? "Copied!" : "Copy to clipboard"}
                >
                  <i className={copied ? "bi bi-check-lg" : "bi bi-clipboard"} />
                </button>
              </div>
            </div>
            <div className="code-block">
              <code>{output}</code>
            </div>
            <div className="output-stats">
              <span className="output-stat">
                <i className="bi bi-text-paragraph" />
                {output.length} characters
              </span>
              {mode === "encode" && (
                <span className="output-stat">
                  <i className="bi bi-percent" />
                  {Math.round(((output.length - input.length) / input.length) * 100)}% size increase
                </span>
              )}
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="tool-info-card">
          <div className="info-card-header">
            <i className="bi bi-info-circle" />
            <span>About URL Encoding</span>
          </div>
          <div className="info-card-content">
            <p>URL encoding converts special characters into a format that can be safely transmitted in URLs. Common conversions:</p>
            <div className="info-examples">
              <code>Space → %20</code>
              <code>! → %21</code>
              <code>& → %26</code>
              <code>= → %3D</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UrlEncoder;
