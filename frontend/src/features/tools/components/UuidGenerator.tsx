import { useState } from "react";
import api from "../../../lib/api";

export function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [version, setVersion] = useState(4);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
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

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(uuids.join("\n"));
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">UUID Generator</h2>
        <p className="tool-description">
          Generate universally unique identifiers
        </p>
      </div>

      <div className="tool-content">
        <div className="tool-options">
          <div className="tool-option">
            <label className="tool-label">Version</label>
            <select
              className="tool-select"
              value={version}
              onChange={(e) => setVersion(Number(e.target.value))}
            >
              <option value={1}>UUID v1 (Time-based)</option>
              <option value={4}>UUID v4 (Random)</option>
            </select>
          </div>

          <div className="tool-option">
            <label className="tool-label">Count: {count}</label>
            <input
              type="range"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="tool-slider"
            />
          </div>
        </div>

        <div className="tool-actions">
          <button
            className="btn primary"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate UUID"}
          </button>
          {uuids.length > 1 && (
            <button className="btn ghost" onClick={handleCopyAll}>
              Copy All
            </button>
          )}
        </div>

        {uuids.length > 0 && (
          <div className="tool-output-section">
            <label className="tool-label">Generated UUIDs</label>
            <div className="uuid-results">
              {uuids.map((uuid, index) => (
                <div key={index} className="uuid-result-item">
                  <code>{uuid}</code>
                  <button
                    className="btn-icon"
                    onClick={() => handleCopy(uuid)}
                    title="Copy"
                  >
                    📋
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
