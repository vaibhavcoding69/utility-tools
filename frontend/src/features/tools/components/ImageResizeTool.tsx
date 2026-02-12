import { useState } from "react";

export default function ImageResizeTool() {
  const [data, setData] = useState("");
  const [width, setWidth] = useState<number | undefined>();
  const [height, setHeight] = useState<number | undefined>();
  const [format, setFormat] = useState("webp");
  const [quality, setQuality] = useState(80);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    setLoading(true);
    setError("");
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = data;
      });

      const targetWidth = width || img.naturalWidth;
      const targetHeight = height || img.naturalHeight;

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context not available");

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      const mimeType = format === "webp" ? "image/webp" : format === "png" ? "image/png" : "image/jpeg";
      const result = canvas.toDataURL(mimeType, quality / 100);
      setOutput(result);
    } catch (e: any) {
      setError(e.message || "Conversion failed");
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
        <h2 className="tool-title">Image Resizer / WebP Converter</h2>
        <p className="tool-description">Resize or convert images (supports WebP, PNG, JPEG)</p>
      </div>
      <div className="tool-content">
        <div className="tool-input-section">
          <label className="tool-label">Image Base64 (data URI accepted)</label>
          <textarea
            className="tool-textarea"
            rows={6}
            value={data}
            onChange={(e) => setData(e.target.value)}
            placeholder="data:image/png;base64,..."
          />
        </div>
        <div className="tool-options" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
          <div className="tool-option">
            <label className="tool-label">Width (px)</label>
            <input
              className="tool-input"
              type="number"
              min={1}
              value={width ?? ""}
              onChange={(e) => setWidth(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Keep original"
            />
          </div>
          <div className="tool-option">
            <label className="tool-label">Height (px)</label>
            <input
              className="tool-input"
              type="number"
              min={1}
              value={height ?? ""}
              onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Keep original"
            />
          </div>
          <div className="tool-option">
            <label className="tool-label">Format</label>
            <select className="tool-select" value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="webp">WEBP</option>
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
            </select>
          </div>
          <div className="tool-option">
            <label className="tool-label">Quality</label>
            <input
              className="tool-input"
              type="number"
              min={1}
              max={100}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="tool-actions">
          <button className="btn primary" onClick={handleConvert} disabled={!data || loading} title={loading ? "Processing..." : !data ? "Enter image data first" : undefined}>
            {loading ? "Processing..." : "Convert"}
          </button>
          <button className="btn secondary" onClick={copy} disabled={!output}>
            Copy output
          </button>
        </div>
        {error && <div className="tool-error">{error}</div>}
        {output && (
          <div className="tool-output-section">
            <label className="tool-label">Result (Base64)</label>
            <textarea className="tool-textarea" value={output} readOnly rows={6} />
            <div style={{ marginTop: "12px" }}>
              <img src={output} alt="Converted preview" style={{ maxWidth: "100%", maxHeight: 240, border: "1px solid var(--border)", borderRadius: 8 }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
