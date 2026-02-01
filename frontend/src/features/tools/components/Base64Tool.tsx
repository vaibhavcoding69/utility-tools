import { useState } from "react";
import api from "../../../lib/api";

export function Base64Tool() {
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
        const result = await api.encodeBase64(input);
        if (result.success) {
          setOutput(result.encoded);
        }
      } else {
        const result = await api.decodeBase64(input);
        if (result.success) {
          setOutput(result.decoded);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${mode}`);
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
            <i className="bi bi-file-binary" />
          </span>
          Base64 Encoder/Decoder
        </h2>
        <p className="tool-description">
          Convert text to Base64 encoding or decode Base64 strings back to plain text.
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
              {mode === "encode" ? "Plain Text" : "Base64 String"}
            </label>
          </div>
          <textarea
            className="tool-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" 
              ? "Enter text to encode to Base64..." 
              : "Enter Base64 string to decode..."
            }
            rows={8}
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
                <i className="bi bi-arrow-repeat" style={{ animation: "spin 1s linear infinite" }} />
                Processing...
              </>
            ) : (
              <>
                <i className={mode === "encode" ? "bi bi-lock" : "bi bi-unlock"} />
                {mode === "encode" ? "Encode" : "Decode"}
              </>
            )}
          </button>
          <button
            className="btn secondary"
            onClick={handleSwap}
            disabled={!output}
            title="Swap input and output"
          >
            <i className="bi bi-arrow-down-up" />
            Swap
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

        {/* Error Display */}
        {error && <div className="tool-error">{error}</div>}

        {/* Output Section */}
        {output && (
          <div className="tool-output-section">
            <div className="tool-section-header">
              <label className="tool-label">
                <i className="bi bi-check-circle" />
                {mode === "encode" ? "Base64 Output" : "Decoded Text"}
              </label>
              <button className="btn-icon" onClick={handleCopy} title="Copy to clipboard">
                <i className={copied ? "bi bi-check-lg" : "bi bi-clipboard"} />
              </button>
            </div>
            <textarea
              className="tool-textarea"
              value={output}
              readOnly
              rows={8}
              style={{ cursor: "default" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Base64Tool;
