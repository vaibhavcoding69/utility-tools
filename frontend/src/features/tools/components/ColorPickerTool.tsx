import { useState, useEffect } from "react";

interface ColorInfo {
  hex: string;
  rgb: string;
  rgbValues: { r: number; g: number; b: number };
  hsl: string;
  hslValues: { h: number; s: number; l: number };
  hsv: string;
  cmyk: string;
}

export default function ColorPickerTool() {
  const [color, setColor] = useState("#737373");
  const [colorInfo, setColorInfo] = useState<ColorInfo | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [savedColors, setSavedColors] = useState<string[]>([]);
  const [hexInput, setHexInput] = useState("#737373");

  useEffect(() => {
    updateColorInfo(color);
    setHexInput(color);
  }, [color]);

  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const rgbToHsv = (r: number, g: number, b: number): { h: number; s: number; v: number } => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0;
    const v = max;
    const d = max - min;
    const s = max === 0 ? 0 : d / max;

    if (max !== min) {
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
  };

  const rgbToCmyk = (r: number, g: number, b: number): string => {
    if (r === 0 && g === 0 && b === 0) return "cmyk(0%, 0%, 0%, 100%)";
    const c = 1 - (r / 255);
    const m = 1 - (g / 255);
    const y = 1 - (b / 255);
    const k = Math.min(c, m, y);
    const cyan = Math.round(((c - k) / (1 - k)) * 100);
    const magenta = Math.round(((m - k) / (1 - k)) * 100);
    const yellow = Math.round(((y - k) / (1 - k)) * 100);
    const black = Math.round(k * 100);
    return `cmyk(${cyan}%, ${magenta}%, ${yellow}%, ${black}%)`;
  };

  const updateColorInfo = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      setColorInfo({
        hex: hex.toUpperCase(),
        rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        rgbValues: rgb,
        hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
        hslValues: hsl,
        hsv: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
        cmyk: rgbToCmyk(rgb.r, rgb.g, rgb.b),
      });
    }
  };

  const copyValue = async (val: string, label: string) => {
    try {
      await navigator.clipboard.writeText(val);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const generateRandomColor = () => {
    const randomHex = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    setColor(randomHex);
  };

  const saveColor = () => {
    if (!savedColors.includes(color)) {
      setSavedColors([...savedColors, color]);
    }
  };

  const removeSavedColor = (colorToRemove: string) => {
    setSavedColors(savedColors.filter(c => c !== colorToRemove));
  };

  const handleHexInputChange = (value: string) => {
    setHexInput(value);
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      setColor(value);
    }
  };

  const getContrastColor = (hex: string): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return "#000000";
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance > 0.5 ? "#000000" : "#ffffff";
  };

  const colorFormats = colorInfo ? [
    { label: "HEX", value: colorInfo.hex, icon: "bi-hash" },
    { label: "RGB", value: colorInfo.rgb, icon: "bi-palette" },
    { label: "HSL", value: colorInfo.hsl, icon: "bi-circle-half" },
    { label: "HSV", value: colorInfo.hsv, icon: "bi-brightness-high" },
    { label: "CMYK", value: colorInfo.cmyk, icon: "bi-printer" },
  ] : [];

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">
          <span className="tool-title-icon">
            <i className="bi bi-palette" />
          </span>
          Color Picker
        </h2>
        <p className="tool-description">
          Pick colors and convert between HEX, RGB, HSL, HSV, and CMYK formats.
        </p>
      </div>

      <div className="tool-content">
        <div className="color-picker-main">
          <div className="color-picker-preview-section">
            <div 
              className="color-preview-large"
              style={{ backgroundColor: color }}
            >
              <span style={{ color: getContrastColor(color) }}>{color.toUpperCase()}</span>
            </div>
            <div className="color-picker-controls">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="color-input-native"
                title="Click to pick a color"
              />
              <div className="hex-input-wrapper">
                <span className="hex-prefix">#</span>
                <input
                  type="text"
                  value={hexInput.replace("#", "")}
                  onChange={(e) => handleHexInputChange("#" + e.target.value)}
                  className="hex-input"
                  maxLength={6}
                  placeholder="3b82f6"
                />
              </div>
            </div>
          </div>

          <div className="color-formats-section">
            <div className="tool-section-header">
              <label className="tool-label">
                <i className="bi bi-list-ul" />
                Color Values
              </label>
            </div>
            <div className="color-formats-grid">
              {colorFormats.map((format) => (
                <div
                  key={format.label}
                  className={`color-format-card ${copied === format.label ? "copied" : ""}`}
                  onClick={() => copyValue(format.value, format.label)}
                >
                  <div className="color-format-header">
                    <span className="color-format-icon">
                      <i className={`bi ${format.icon}`} />
                    </span>
                    <span className="color-format-label">{format.label}</span>
                    <span className="color-format-copy">
                      <i className={copied === format.label ? "bi bi-check-lg" : "bi bi-clipboard"} />
                    </span>
                  </div>
                  <div className="color-format-value">
                    <code>{format.value}</code>
                  </div>
                </div>
              ))}
            </div>
            <div className="tool-hint">
              <i className="bi bi-lightbulb" />
              Click any format to copy its value
            </div>
          </div>
        </div>

        {colorInfo && (
          <div className="color-sliders-section">
            <div className="tool-section-header">
              <label className="tool-label">
                <i className="bi bi-sliders" />
                Adjust RGB Values
              </label>
            </div>
            <div className="color-sliders">
              <div className="color-slider-row">
                <span className="slider-label" style={{ color: "#a3a3a3" }}>R</span>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={colorInfo.rgbValues.r}
                  onChange={(e) => {
                    const newHex = `#${parseInt(e.target.value).toString(16).padStart(2, "0")}${colorInfo.rgbValues.g.toString(16).padStart(2, "0")}${colorInfo.rgbValues.b.toString(16).padStart(2, "0")}`;
                    setColor(newHex);
                  }}
                  className="color-slider red"
                />
                <span className="slider-value">{colorInfo.rgbValues.r}</span>
              </div>
              <div className="color-slider-row">
                <span className="slider-label" style={{ color: "#d4d4d4" }}>G</span>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={colorInfo.rgbValues.g}
                  onChange={(e) => {
                    const newHex = `#${colorInfo.rgbValues.r.toString(16).padStart(2, "0")}${parseInt(e.target.value).toString(16).padStart(2, "0")}${colorInfo.rgbValues.b.toString(16).padStart(2, "0")}`;
                    setColor(newHex);
                  }}
                  className="color-slider green"
                />
                <span className="slider-value">{colorInfo.rgbValues.g}</span>
              </div>
              <div className="color-slider-row">
                <span className="slider-label" style={{ color: "#a3a3a3" }}>B</span>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={colorInfo.rgbValues.b}
                  onChange={(e) => {
                    const newHex = `#${colorInfo.rgbValues.r.toString(16).padStart(2, "0")}${colorInfo.rgbValues.g.toString(16).padStart(2, "0")}${parseInt(e.target.value).toString(16).padStart(2, "0")}`;
                    setColor(newHex);
                  }}
                  className="color-slider blue"
                />
                <span className="slider-value">{colorInfo.rgbValues.b}</span>
              </div>
            </div>
          </div>
        )}

        <div className="tool-actions">
          <button className="btn primary" onClick={generateRandomColor}>
            <i className="bi bi-shuffle" style={{ marginRight: "6px" }} />
            Random Color
          </button>
          <button className="btn secondary" onClick={saveColor}>
            <i className="bi bi-bookmark-plus" style={{ marginRight: "6px" }} />
            Save Color
          </button>
        </div>

        {savedColors.length > 0 && (
          <div className="saved-colors-section">
            <div className="tool-section-header">
              <label className="tool-label">
                <i className="bi bi-bookmarks" />
                Saved Colors ({savedColors.length})
              </label>
            </div>
            <div className="saved-colors-grid">
              {savedColors.map((savedColor) => (
                <div
                  key={savedColor}
                  className="saved-color-item"
                  style={{ backgroundColor: savedColor }}
                  onClick={() => setColor(savedColor)}
                  title={`Click to use ${savedColor}`}
                >
                  <span style={{ color: getContrastColor(savedColor) }}>
                    {savedColor}
                  </span>
                  <button
                    className="remove-saved-color"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSavedColor(savedColor);
                    }}
                    title="Remove color"
                  >
                    <i className="bi bi-x" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="contrast-preview-section">
          <div className="tool-section-header">
            <label className="tool-label">
              <i className="bi bi-fonts" />
              Contrast Preview
            </label>
          </div>
          <div className="contrast-previews">
            <div className="contrast-card" style={{ backgroundColor: color, color: "#ffffff" }}>
              <span className="contrast-sample">White Text on Color</span>
            </div>
            <div className="contrast-card" style={{ backgroundColor: color, color: "#000000" }}>
              <span className="contrast-sample">Black Text on Color</span>
            </div>
            <div className="contrast-card" style={{ backgroundColor: "#ffffff", color: color }}>
              <span className="contrast-sample">Color Text on White</span>
            </div>
            <div className="contrast-card" style={{ backgroundColor: "#171717", color: color }}>
              <span className="contrast-sample">Color Text on Dark</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
