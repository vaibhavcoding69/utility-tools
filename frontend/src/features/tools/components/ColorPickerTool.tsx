import { useState, useEffect } from "react";

interface ColorInfo {
  hex: string;
  rgb: string;
  hsl: string;
}

export default function ColorPickerTool() {
  const [color, setColor] = useState("#3b82f6");
  const [colorInfo, setColorInfo] = useState<ColorInfo>({
    hex: "",
    rgb: "",
    hsl: "",
  });

  useEffect(() => {
    updateColorInfo(color);
  }, [color]);

  const hexToRgb = (
    hex: string,
  ): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const rgbToHsl = (
    r: number,
    g: number,
    b: number,
  ): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const updateColorInfo = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setColorInfo({
        hex: hex.toUpperCase(),
        rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      });
    }
  };

  const copyValue = (val: string) => {
    navigator.clipboard.writeText(val);
  };

  const generateRandomColor = () => {
    const randomHex =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");
    setColor(randomHex);
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">Color Picker</h2>
        <p className="tool-description">
          Pick colors and get values in different formats
        </p>
      </div>
      <div className="tool-content">
        <div
          style={{
            display: "flex",
            gap: "24px",
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          <div style={{ flex: "0 0 auto" }}>
            <label className="tool-label">Pick a Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{
                width: "150px",
                height: "150px",
                cursor: "pointer",
                border: "2px solid var(--border)",
                borderRadius: "12px",
                padding: "4px",
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <label className="tool-label">Color Values</label>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {Object.entries(colorInfo).map(([format, value]) => (
                <div
                  key={format}
                  onClick={() => copyValue(value)}
                  style={{
                    padding: "12px 16px",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    background: "var(--surface)",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    {format}
                  </span>
                  <span style={{ fontFamily: "monospace", fontWeight: 500 }}>
                    {value}
                  </span>
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
              Click to copy
            </p>
          </div>
        </div>
        <div style={{ marginTop: "16px" }}>
          <label className="tool-label">Preview</label>
          <div
            style={{
              height: "60px",
              borderRadius: "8px",
              backgroundColor: color,
              border: "1px solid var(--border)",
            }}
          />
        </div>
        <div className="tool-actions">
          <button className="btn primary" onClick={generateRandomColor}>
            Random Color
          </button>
        </div>
      </div>
    </div>
  );
}
