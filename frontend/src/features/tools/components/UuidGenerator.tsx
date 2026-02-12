import { useState, useEffect } from "react";
import api from "../../../lib/api";

export function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [version, setVersion] = useState(4);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  useEffect(() => {
    handleGenerate();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setCopiedIndex(null);
    setCopiedAll(false);
    try {
      const result = await api.generateUuid(version, count);
      if (result.success) {
        if (result.uuids) {
          setUuids(result.uuids as string[]);
        } else if (result.uuid) {
          setUuids([result.uuid as string]);
        }
      }
    } catch (err) {
      console.error("Failed to generate UUID:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(uuids.join("\n"));
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">
          <span className="tool-title-icon">
            <i className="bi bi-upc-scan" />
          </span>
          UUID Generator
        </h2>
        <p className="tool-description">
          Generate universally unique identifiers (UUIDs) for database keys, session tokens, and more.
        </p>
      </div>

      <div className="tool-content">
        <div className="tool-options-panel">
          <div className="tool-section-header">
            <label className="tool-label">
              <i className="bi bi-sliders" />
              Generation Options
            </label>
          </div>

          <div className="uuid-version-grid">
            <button
              className={`uuid-version-card ${version === 4 ? "selected" : ""}`}
              onClick={() => setVersion(4)}
            >
              <div className="version-badge">v4</div>
              <div className="version-info">
                <div className="version-name">Random</div>
                <div className="version-desc">Cryptographically random (recommended)</div>
              </div>
            </button>
            <button
              className={`uuid-version-card ${version === 1 ? "selected" : ""}`}
              onClick={() => setVersion(1)}
            >
              <div className="version-badge">v1</div>
              <div className="version-info">
                <div className="version-name">Time-based</div>
                <div className="version-desc">Based on timestamp and MAC address</div>
              </div>
            </button>
          </div>

          <div className="tool-option-row">
            <label className="tool-label">
              <i className="bi bi-plus-slash-minus" />
              Quantity
            </label>
            <div className="slider-wrapper">
              <input
                type="range"
                min={1}
                max={50}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="tool-slider"
              />
              <span className="slider-value">{count}</span>
            </div>
          </div>
        </div>

        <div className="tool-actions">
          <button
            className="btn primary"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="bi bi-arrow-repeat" style={{ animation: "spin 1s linear infinite" }} />
                Generating...
              </>
            ) : (
              <>
                <i className="bi bi-shuffle" />
                Generate {count > 1 ? `${count} UUIDs` : "UUID"}
              </>
            )}
          </button>
          {uuids.length > 1 && (
            <button className="btn secondary" onClick={handleCopyAll}>
              <i className={copiedAll ? "bi bi-check-lg" : "bi bi-clipboard"} />
              {copiedAll ? "Copied All!" : "Copy All"}
            </button>
          )}
        </div>

        {uuids.length > 0 && (
          <div className="tool-output-section">
            <div className="tool-section-header">
              <label className="tool-label">
                <i className="bi bi-list-check" />
                Generated UUIDs
              </label>
              <span className="result-count">{uuids.length} {uuids.length === 1 ? "UUID" : "UUIDs"}</span>
            </div>
            <div className="uuid-results">
              {uuids.map((uuid, index) => (
                <div key={index} className="uuid-result-item">
                  <span className="uuid-index">{index + 1}</span>
                  <code className="uuid-value">{uuid}</code>
                  <button
                    className="btn-icon"
                    onClick={() => handleCopy(uuid, index)}
                    title="Copy to clipboard"
                  >
                    <i className={copiedIndex === index ? "bi bi-check-lg" : "bi bi-clipboard"} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UuidGenerator;
