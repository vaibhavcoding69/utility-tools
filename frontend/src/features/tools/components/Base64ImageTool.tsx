import { useState } from "react";

export default function Base64ImageTool() {
  const [input, setInput] = useState("");
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

  const decode = () => {
    setError("");
    try {
      let dataUri = input.trim();
      if (!dataUri.startsWith("data:")) {
        dataUri = `data:image/png;base64,${dataUri}`;
      }
      const img = new Image();
      img.onload = () => {
        setPreview(dataUri);
      };
      img.onerror = () => {
        setError("Invalid image data");
        setPreview("");
      };
      img.src = dataUri;
    } catch {
      setError("Failed to decode Base64");
      setPreview("");
    }
  };

  const downloadImage = () => {
    if (!preview) return;
    const link = document.createElement("a");
    link.href = preview;
    link.download = "decoded-image.png";
    link.click();
  };

  const clear = () => {
    setInput("");
    setPreview("");
    setError("");
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">Base64 to Image</h2>
        <p className="tool-description">Decode Base64 strings back to images</p>
      </div>
      <div className="tool-content">
        <div className="tool-input-section">
          <label className="tool-label">Base64 String</label>
          <textarea
            className="tool-textarea"
            placeholder="Paste Base64 string or data URI here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            style={{ fontFamily: "monospace", fontSize: "12px" }}
          />
        </div>
        <div className="tool-actions">
          <button className="btn primary" onClick={decode}>
            Decode
          </button>
          <button className="btn secondary" onClick={clear}>
            Clear
          </button>
        </div>
        {error && <div className="tool-error">{error}</div>}
        {preview && (
          <div className="tool-output-section">
            <label className="tool-label">Preview</label>
            <div
              style={{
                padding: "16px",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                background: "var(--surface)",
              }}
            >
              <img
                src={preview}
                alt="Decoded"
                style={{
                  maxWidth: "100%",
                  maxHeight: "300px",
                  objectFit: "contain",
                }}
              />
            </div>
            <div className="tool-actions" style={{ marginTop: "12px" }}>
              <button className="btn primary" onClick={downloadImage}>
                Download Image
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
