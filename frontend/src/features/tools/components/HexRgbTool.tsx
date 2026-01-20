import { useState } from "react";

export default function HexRgbTool() {
  const [hex, setHex] = useState("");
  const [rgb, setRgb] = useState({ r: "", g: "", b: "" });
  const [mode, setMode] = useState<"hex-to-rgb" | "rgb-to-hex">("hex-to-rgb");
  const [output, setOutput] = useState("");

  const hexToRgb = () => {
    let h = hex.replace("#", "");
    if (h.length === 3) {
      h = h
        .split("")
        .map((c) => c + c)
        .join("");
    }
    if (h.length !== 6) {
      setOutput("Invalid HEX color");
      return;
    }
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    setOutput(`rgb(${r}, ${g}, ${b})`);
  };

  const rgbToHex = () => {
    const r = parseInt(rgb.r) || 0;
    const g = parseInt(rgb.g) || 0;
    const b = parseInt(rgb.b) || 0;
    if ([r, g, b].some((v) => v < 0 || v > 255)) {
      setOutput("RGB values must be 0-255");
      return;
    }
    const toHex = (n: number) => n.toString(16).padStart(2, "0");
    setOutput(`#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase());
  };

  const convert = () => {
    mode === "hex-to-rgb" ? hexToRgb() : rgbToHex();
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">HEX ↔ RGB Converter</h2>
        <p className="tool-description">
          Convert between HEX and RGB color formats
        </p>
      </div>
      <div className="tool-content">
        <div className="tool-tabs">
          <button
            className={`tool-tab ${mode === "hex-to-rgb" ? "active" : ""}`}
            onClick={() => setMode("hex-to-rgb")}
          >
            HEX → RGB
          </button>
          <button
            className={`tool-tab ${mode === "rgb-to-hex" ? "active" : ""}`}
            onClick={() => setMode("rgb-to-hex")}
          >
            RGB → HEX
          </button>
        </div>
        <div className="tool-input-section">
          {mode === "hex-to-rgb" ? (
            <>
              <label className="tool-label">HEX Color</label>
              <input
                className="tool-input"
                type="text"
                placeholder="#FF5733 or FF5733"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
              />
            </>
          ) : (
            <>
              <label className="tool-label">RGB Values</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  className="tool-input"
                  type="number"
                  placeholder="R (0-255)"
                  min="0"
                  max="255"
                  value={rgb.r}
                  onChange={(e) => setRgb({ ...rgb, r: e.target.value })}
                />
                <input
                  className="tool-input"
                  type="number"
                  placeholder="G (0-255)"
                  min="0"
                  max="255"
                  value={rgb.g}
                  onChange={(e) => setRgb({ ...rgb, g: e.target.value })}
                />
                <input
                  className="tool-input"
                  type="number"
                  placeholder="B (0-255)"
                  min="0"
                  max="255"
                  value={rgb.b}
                  onChange={(e) => setRgb({ ...rgb, b: e.target.value })}
                />
              </div>
            </>
          )}
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
          <div
            className="tool-output"
            style={{ display: "flex", alignItems: "center", gap: "12px" }}
          >
            {output && (
              <span
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "4px",
                  backgroundColor:
                    mode === "hex-to-rgb"
                      ? hex.startsWith("#")
                        ? hex
                        : `#${hex}`
                      : output,
                  border: "1px solid var(--border)",
                }}
              />
            )}
            <span>{output || "Enter a color value"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
