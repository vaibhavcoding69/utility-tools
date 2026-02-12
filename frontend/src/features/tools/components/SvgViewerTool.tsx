import { useState } from "react";

export default function SvgViewerTool() {
  const [svgCode, setSvgCode] = useState("");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [zoom, setZoom] = useState(100);

  const downloadSvg = () => {
    const blob = new Blob([svgCode], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "image.svg";
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadPng = () => {
    const svg = new Blob([svgCode], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svg);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width * (zoom / 100);
      canvas.height = img.height * (zoom / 100);
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "image.png";
        link.click();
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const copySvg = () => {
    navigator.clipboard.writeText(svgCode);
  };

  const formatSvg = () => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgCode, "image/svg+xml");
      const serializer = new XMLSerializer();
      const formatted = serializer.serializeToString(doc);
      setSvgCode(formatted);
    } catch {
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">SVG Viewer & Editor</h2>
        <p className="tool-description">Preview, edit, and export SVG images</p>
      </div>
      <div className="tool-content">
        <div className="tool-input-section">
          <label className="tool-label">SVG Code</label>
          <textarea
            className="tool-textarea"
            placeholder='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">...</svg>'
            value={svgCode}
            onChange={(e) => setSvgCode(e.target.value)}
            rows={8}
            style={{ fontFamily: "monospace", fontSize: "12px" }}
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            alignItems: "flex-end",
          }}
        >
          <div>
            <label className="tool-label">Background</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              style={{
                width: "50px",
                height: "36px",
                cursor: "pointer",
                border: "1px solid var(--border)",
                borderRadius: "4px",
              }}
            />
          </div>
          <div>
            <label className="tool-label">Zoom: {zoom}%</label>
            <input
              type="range"
              min="25"
              max="200"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              style={{ width: "150px" }}
            />
          </div>
          <div className="tool-actions">
            <button className="btn secondary" onClick={formatSvg}>
              Format
            </button>
            <button className="btn secondary" onClick={copySvg}>
              Copy SVG
            </button>
          </div>
        </div>
        {svgCode && (
          <div className="tool-output-section">
            <label className="tool-label">Preview</label>
            <div
              style={{
                padding: "24px",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                backgroundColor: bgColor,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "200px",
                overflow: "auto",
              }}
            >
              <div
                style={{
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "center",
                }}
                dangerouslySetInnerHTML={{ __html: svgCode }}
              />
            </div>
            <div className="tool-actions" style={{ marginTop: "12px" }}>
              <button className="btn primary" onClick={downloadSvg}>
                Download SVG
              </button>
              <button className="btn secondary" onClick={downloadPng}>
                Download PNG
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
