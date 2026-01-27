import { useState } from "react";
import api from "../../../lib/api";

export default function RandomStringTool() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.randomString({ length, uppercase, lowercase, digits, symbols });
      if (res.success) setOutput(res.value as string);
    } catch (e: any) {
      setError(e.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    if (output) navigator.clipboard.writeText(output);
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">Random String Generator</h2>
        <p className="tool-description">Generate random strings with custom charset</p>
      </div>
      <div className="tool-content">
        <div className="tool-options" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
          <div className="tool-option">
            <label className="tool-label">Length</label>
            <input
              className="tool-input"
              type="number"
              min={1}
              max={256}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
            />
          </div>
          <label className="tool-checkbox-label">
            <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} /> Uppercase
          </label>
          <label className="tool-checkbox-label">
            <input type="checkbox" checked={lowercase} onChange={(e) => setLowercase(e.target.checked)} /> Lowercase
          </label>
          <label className="tool-checkbox-label">
            <input type="checkbox" checked={digits} onChange={(e) => setDigits(e.target.checked)} /> Digits
          </label>
          <label className="tool-checkbox-label">
            <input type="checkbox" checked={symbols} onChange={(e) => setSymbols(e.target.checked)} /> Symbols
          </label>
        </div>
        <div className="tool-actions">
          <button className="btn primary" onClick={generate} disabled={loading}>
            {loading ? "Generating..." : "Generate"}
          </button>
          <button className="btn secondary" onClick={copy} disabled={!output}>
            Copy
          </button>
        </div>
        {error && <div className="tool-error">{error}</div>}
        <div className="tool-output-section">
          <label className="tool-label">Result</label>
          <div className="tool-output">{output || "Click Generate to create a string"}</div>
        </div>
      </div>
    </div>
  );
}
