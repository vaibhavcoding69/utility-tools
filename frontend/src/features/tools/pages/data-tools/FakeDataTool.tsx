import { useState } from "react";
import api from "../../../../lib/api";

export function FakeDataTool() {
  const [dataType, setDataType] = useState("person");
  const [count, setCount] = useState(5);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dataTypes = [
    "person",
    "address",
    "company",
    "email",
    "phone",
    "date",
    "text",
  ];

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await api.generateFakeData(dataType, count);
      if (result.success) {
        setOutput(JSON.stringify(result.data || result.rows, null, 2));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">Fake Data Generator</h2>
        <p className="tool-description">
          Generate fake test data for development
        </p>
      </div>
      <div className="tool-content">
        <div className="tool-options">
          <div className="tool-option">
            <label className="tool-label">Data Type</label>
            <select
              className="tool-select"
              value={dataType}
              onChange={(e) => setDataType(e.target.value)}
            >
              {dataTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
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
            {loading ? "Generating..." : "Generate Data"}
          </button>
        </div>
        {error && <div className="tool-error">{error}</div>}
        {output && (
          <div className="tool-output-section">
            <label className="tool-label">Generated Data</label>
            <pre className="tool-output">
              <code>{output}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
