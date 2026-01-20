import { useState } from "react";

const units = {
  px: 1,
  em: 16,
  rem: 16,
  pt: 1.333333,
  pc: 16,
  in: 96,
  cm: 37.795275591,
  mm: 3.7795275591,
  vw: 0,
  vh: 0,
  "%": 0,
};

type UnitKey = keyof typeof units;

export default function CssUnitsTool() {
  const [value, setValue] = useState("");
  const [fromUnit, setFromUnit] = useState<UnitKey>("px");
  const [baseSize, setBaseSize] = useState("16");
  const [results, setResults] = useState<Record<string, string>>({});

  const convert = () => {
    const num = parseFloat(value);
    if (isNaN(num)) {
      setResults({});
      return;
    }

    const base = parseFloat(baseSize) || 16;
    let pxValue: number;

    if (fromUnit === "em" || fromUnit === "rem") {
      pxValue = num * base;
    } else if (fromUnit === "%") {
      pxValue = (num / 100) * base;
    } else {
      pxValue = num * units[fromUnit];
    }

    const newResults: Record<string, string> = {
      px: pxValue.toFixed(4).replace(/\.?0+$/, ""),
      em: (pxValue / base).toFixed(4).replace(/\.?0+$/, ""),
      rem: (pxValue / base).toFixed(4).replace(/\.?0+$/, ""),
      pt: (pxValue / 1.333333).toFixed(4).replace(/\.?0+$/, ""),
      pc: (pxValue / 16).toFixed(4).replace(/\.?0+$/, ""),
      in: (pxValue / 96).toFixed(4).replace(/\.?0+$/, ""),
      cm: (pxValue / 37.795275591).toFixed(4).replace(/\.?0+$/, ""),
      mm: (pxValue / 3.7795275591).toFixed(4).replace(/\.?0+$/, ""),
      "%": ((pxValue / base) * 100).toFixed(4).replace(/\.?0+$/, ""),
    };

    setResults(newResults);
  };

  const copyValue = (val: string, unit: string) => {
    navigator.clipboard.writeText(`${val}${unit}`);
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">CSS Units Converter</h2>
        <p className="tool-description">
          Convert between CSS units (px, em, rem, pt, etc.)
        </p>
      </div>
      <div className="tool-content">
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ flex: 2, minWidth: "150px" }}>
            <label className="tool-label">Value</label>
            <input
              className="tool-input"
              type="number"
              placeholder="Enter value..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <div style={{ flex: 1, minWidth: "120px" }}>
            <label className="tool-label">Unit</label>
            <select
              className="tool-select"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value as UnitKey)}
            >
              {Object.keys(units).map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: "120px" }}>
            <label className="tool-label">Base Size (px)</label>
            <input
              className="tool-input"
              type="number"
              placeholder="16"
              value={baseSize}
              onChange={(e) => setBaseSize(e.target.value)}
            />
          </div>
        </div>
        <div className="tool-actions">
          <button className="btn primary" onClick={convert}>
            Convert
          </button>
        </div>
        {Object.keys(results).length > 0 && (
          <div className="tool-output-section">
            <label className="tool-label">Results</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: "8px",
              }}
            >
              {Object.entries(results).map(([unit, val]) => (
                <div
                  key={unit}
                  onClick={() => copyValue(val, unit)}
                  style={{
                    padding: "12px",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    background: "var(--surface)",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      marginBottom: "4px",
                    }}
                  >
                    {unit}
                  </div>
                  <div style={{ fontFamily: "monospace", fontWeight: 500 }}>
                    {val}
                  </div>
                </div>
              ))}
            </div>
            <p
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                marginTop: "8px",
              }}
            >
              Click any value to copy
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
