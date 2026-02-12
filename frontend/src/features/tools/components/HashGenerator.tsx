import { useState } from "react";
import api from "../../../lib/api";

const ALGORITHMS = [
  { id: "md5", name: "MD5", description: "128-bit (legacy)" },
  { id: "sha1", name: "SHA-1", description: "160-bit (legacy)" },
  { id: "sha256", name: "SHA-256", description: "256-bit (recommended)" },
  { id: "sha384", name: "SHA-384", description: "384-bit" },
  { id: "sha512", name: "SHA-512", description: "512-bit (strongest)" },
  { id: "blake2b", name: "BLAKE2b", description: "Fast & secure" },
  { id: "blake2s", name: "BLAKE2s", description: "Optimized for 32-bit" },
];

export function HashGenerator() {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState("sha256");
  const [output, setOutput] = useState("");
  const [allHashes, setAllHashes] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [mode, setMode] = useState<"single" | "all">("single");

  const handleHash = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setAllHashes(null);
    setOutput("");
    try {
      const result = await api.generateHash(input, algorithm);
      if (result.success) {
        setOutput(result.hash as string);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate hash");
    } finally {
      setLoading(false);
    }
  };

  const handleHashAll = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setOutput("");
    try {
      const result = await api.generateAllHashes(input);
      if (result.success) {
        setAllHashes(result.hashes as Record<string, string>);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate hashes");
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = () => {
    if (mode === "single") {
      handleHash();
    } else {
      handleHashAll();
    }
  };

  const handleCopy = async (text: string, id?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedHash(id || "main");
      setTimeout(() => setCopiedHash(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setAllHashes(null);
    setError("");
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">
          <span className="tool-title-icon">
            <i className="bi bi-fingerprint" />
          </span>
          Hash Generator
        </h2>
        <p className="tool-description">
          Generate cryptographic hashes using industry-standard algorithms like SHA-256, SHA-512, and BLAKE2.
        </p>
      </div>

      <div className="tool-content">
        <div className="tool-tabs">
          <button
            className={`tool-tab ${mode === "single" ? "active" : ""}`}
            onClick={() => setMode("single")}
          >
            <i className="bi bi-hash" style={{ marginRight: "6px" }} />
            Single Algorithm
          </button>
          <button
            className={`tool-tab ${mode === "all" ? "active" : ""}`}
            onClick={() => setMode("all")}
          >
            <i className="bi bi-collection" style={{ marginRight: "6px" }} />
            All Algorithms
          </button>
        </div>

        <div className="tool-input-section">
          <div className="tool-section-header">
            <label className="tool-label">
              <i className="bi bi-input-cursor-text" />
              Input Text
            </label>
            <span className="input-length">{input.length} characters</span>
          </div>
          <textarea
            className="tool-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to generate hash..."
            rows={6}
            spellCheck={false}
          />
        </div>

        {mode === "single" && (
          <div className="tool-options-panel">
            <div className="tool-section-header">
              <label className="tool-label">
                <i className="bi bi-gear" />
                Algorithm
              </label>
            </div>
            <div className="algorithm-grid">
              {ALGORITHMS.map((alg) => (
                <button
                  key={alg.id}
                  className={`algorithm-option ${algorithm === alg.id ? "selected" : ""}`}
                  onClick={() => setAlgorithm(alg.id)}
                >
                  <span className="algorithm-name">{alg.name}</span>
                  <span className="algorithm-desc">{alg.description}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="tool-actions">
          <button
            className="btn primary"
            onClick={handleProcess}
            disabled={loading || !input.trim()}
            title={loading ? "Processing..." : !input.trim() ? "Enter text to hash first" : undefined}
          >
            {loading ? (
              <>
                <i className="bi bi-arrow-repeat" style={{ animation: "spin 1s linear infinite" }} />
                Generating...
              </>
            ) : (
              <>
                <i className="bi bi-hash" />
                {mode === "single" ? `Generate ${algorithm.toUpperCase()}` : "Generate All Hashes"}
              </>
            )}
          </button>
          {output && (
            <button
              className="btn secondary"
              onClick={() => handleCopy(output)}
            >
              <i className={copiedHash === "main" ? "bi bi-check-lg" : "bi bi-clipboard"} />
              {copiedHash === "main" ? "Copied!" : "Copy Hash"}
            </button>
          )}
          <button
            className="btn ghost"
            onClick={handleClear}
            disabled={!input && !output && !allHashes}
          >
            <i className="bi bi-x-lg" />
            Clear
          </button>
        </div>

        {error && <div className="tool-error">{error}</div>}

        {output && mode === "single" && (
          <div className="tool-output-section">
            <div className="tool-section-header">
              <label className="tool-label">
                <i className="bi bi-check-circle" />
                {algorithm.toUpperCase()} Hash
              </label>
              <button
                className="btn-icon"
                onClick={() => handleCopy(output)}
                title="Copy to clipboard"
              >
                <i className={copiedHash === "main" ? "bi bi-check-lg" : "bi bi-clipboard"} />
              </button>
            </div>
            <div className="hash-output-display">
              <code className="hash-value-code">{output}</code>
            </div>
          </div>
        )}

        {allHashes && (
          <div className="tool-output-section">
            <div className="tool-section-header">
              <label className="tool-label">
                <i className="bi bi-list-check" />
                Generated Hashes
              </label>
            </div>
            <div className="hash-results">
              {Object.entries(allHashes).map(([alg, hash]) => (
                <div key={alg} className="hash-result-item">
                  <div className="hash-result-header">
                    <span className="hash-algorithm">{alg.toUpperCase()}</span>
                    <button
                      className="btn-icon"
                      onClick={() => handleCopy(hash, alg)}
                      title="Copy hash"
                    >
                      <i className={copiedHash === alg ? "bi bi-check-lg" : "bi bi-clipboard"} />
                    </button>
                  </div>
                  <div className="hash-result-value">
                    <code>{hash}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HashGenerator;
