import { useState } from "react";
import api from "../../../lib/api";

const ALGORITHMS = [
  "md5",
  "sha1",
  "sha256",
  "sha384",
  "sha512",
  "blake2b",
  "blake2s",
];

export function HashGenerator() {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState("sha256");
  const [output, setOutput] = useState("");
  const [allHashes, setAllHashes] = useState<Record<string, string> | null>(
    null,
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleHash = async () => {
    setLoading(true);
    setError("");
    setAllHashes(null);
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
    setLoading(true);
    setError("");
    setOutput("");
    try {
      const result = await api.generateAllHashes(input);
      if (result.success) {
        setAllHashes(result.hashes as Record<string, string>);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate hashes",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">Hash Generator</h2>
        <p className="tool-description">
          Generate cryptographic hashes using various algorithms
        </p>
      </div>

      <div className="tool-content">
        <div className="tool-input-section">
          <label className="tool-label">Input Text</label>
          <textarea
            className="tool-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to hash"
            rows={6}
          />
        </div>

        <div className="tool-options">
          <div className="tool-option">
            <label className="tool-label">Algorithm</label>
            <select
              className="tool-select"
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
            >
              {ALGORITHMS.map((alg) => (
                <option key={alg} value={alg}>
                  {alg.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="tool-actions">
          <button
            className="btn primary"
            onClick={handleHash}
            disabled={loading || !input}
          >
            {loading ? "Hashing..." : "Generate Hash"}
          </button>
          <button
            className="btn ghost"
            onClick={handleHashAll}
            disabled={loading || !input}
          >
            All Algorithms
          </button>
          <button
            className="btn ghost"
            onClick={() => handleCopy(output)}
            disabled={!output}
          >
            Copy
          </button>
        </div>

        {error && <div className="tool-error">{error}</div>}

        {output && (
          <div className="tool-output-section">
            <label className="tool-label">
              Hash ({algorithm.toUpperCase()})
            </label>
            <div className="tool-output-mono">
              <code>{output}</code>
            </div>
          </div>
        )}

        {allHashes && (
          <div className="tool-output-section">
            <label className="tool-label">All Hashes</label>
            <div className="hash-results">
              {Object.entries(allHashes).map(([alg, hash]) => (
                <div key={alg} className="hash-result-item">
                  <div className="hash-algorithm">{alg.toUpperCase()}</div>
                  <div className="hash-value">
                    <code>{hash}</code>
                    <button
                      className="btn-icon"
                      onClick={() => handleCopy(hash)}
                      title="Copy"
                    >
                      <i className="bi bi-clipboard" />
                    </button>
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
