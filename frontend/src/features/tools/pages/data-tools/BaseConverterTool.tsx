import { useState } from "react";
import api from "../../../../lib/api";

export function BaseConverterTool() {
  const [value, setValue] = useState("");
  const [fromBase, setFromBase] = useState(10);
  const [toBase, setToBase] = useState(16);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const bases = [
    { value: 2, label: "Binary (2)" },
    { value: 8, label: "Octal (8)" },
    { value: 10, label: "Decimal (10)" },
    { value: 16, label: "Hexadecimal (16)" },
  ];

  const handleConvert = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await api.convertBase(value, fromBase, toBase);
      if (result.success) {
        setOutput((result.result as string) || (result.value as string));
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
        <h2 className="tool-title">Base Converter</h2>
        <p className="tool-description">
          Convert numbers between different bases (binary, octal, decimal, hex)
        </p>
      </div>
      <div className="tool-content">
        <div className="tool-input-section">
          <label className="tool-label">Value</label>
          <input
            type="text"
            className="tool-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter a number (e.g., 255 for decimal)"
          />
        </div>
        <div className="tool-options">
          <div className="tool-option">
            <label className="tool-label">From Base</label>
            <select
              className="tool-select"
              value={fromBase}
              onChange={(e) => setFromBase(Number(e.target.value))}
            >
              {bases.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>
          <div className="tool-option">
            <label className="tool-label">To Base</label>
            <select
              className="tool-select"
              value={toBase}
              onChange={(e) => setToBase(Number(e.target.value))}
            >
              {bases.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="tool-actions">
          <button
            className="btn primary"
            onClick={handleConvert}
            disabled={loading || !value}
            title={loading ? "Processing..." : !value ? "Enter a number first" : undefined}
          >
            {loading ? "Converting..." : "Convert"}
          </button>
        </div>
        {error && <div className="tool-error">{error}</div>}
        {output && (
          <div className="tool-output-section">
            <label className="tool-label">
              Result ({bases.find((b) => b.value === toBase)?.label})
            </label>
            <div className="tool-output-mono">
              <code>{output}</code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
