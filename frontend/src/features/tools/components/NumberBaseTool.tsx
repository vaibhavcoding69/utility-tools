import { useState } from "react";

export default function NumberBaseTool() {
  const [input, setInput] = useState("");
  const [fromBase, setFromBase] = useState(10);
  const [toBase, setToBase] = useState(16);
  const [output, setOutput] = useState("");

  const bases = [
    { value: 2, label: "Binary (2)" },
    { value: 8, label: "Octal (8)" },
    { value: 10, label: "Decimal (10)" },
    { value: 16, label: "Hexadecimal (16)" },
  ];

  const convert = () => {
    try {
      const decimal = parseInt(input, fromBase);
      if (isNaN(decimal)) {
        setOutput("Invalid input for selected base");
        return;
      }
      setOutput(decimal.toString(toBase).toUpperCase());
    } catch {
      setOutput("Conversion error");
    }
  };

  const swap = () => {
    setFromBase(toBase);
    setToBase(fromBase);
    setOutput("");
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">Number Base Converter</h2>
        <p className="tool-description">
          Convert numbers between different bases (binary, octal, decimal, hex)
        </p>
      </div>
      <div className="tool-content">
        <div className="tool-input-section">
          <label className="tool-label">Input Number</label>
          <input
            className="tool-input"
            type="text"
            placeholder="Enter number..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: "150px" }}>
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
          <button
            className="btn secondary"
            onClick={swap}
            style={{ marginTop: "24px" }}
          >
            ⇄
          </button>
          <div style={{ flex: 1, minWidth: "150px" }}>
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
          <button className="btn primary" onClick={convert}>
            Convert
          </button>
          <button
            className="btn secondary"
            onClick={copyOutput}
            disabled={!output}
          >
            Copy
          </button>
        </div>
        <div className="tool-output-section">
          <label className="tool-label">Result</label>
          <div className="tool-output">
            {output || "Enter a number and click Convert"}
          </div>
        </div>
      </div>
    </div>
  );
}
