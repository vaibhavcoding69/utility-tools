import { useState } from "react";

export default function QrGeneratorTool() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(256);
  const [qrUrl, setQrUrl] = useState("");

  const generateQR = () => {
    if (!text.trim()) return;
    // Using Google Charts API for simplicity
    const url = `https://chart.googleapis.com/chart?cht=qr&chs=${size}x${size}&chl=${encodeURIComponent(text)}&choe=UTF-8`;
    setQrUrl(url);
  };

  const downloadQR = () => {
    if (!qrUrl) return;
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = "qrcode.png";
    link.click();
  };

  const copyQrUrl = () => {
    navigator.clipboard.writeText(qrUrl);
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">QR Code Generator</h2>
        <p className="tool-description">Generate QR codes from text or URLs</p>
      </div>
      <div className="tool-content">
        <div className="tool-input-section">
          <label className="tool-label">Text or URL</label>
          <textarea
            className="tool-textarea"
            placeholder="Enter text or URL to encode..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
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
          <div style={{ flex: 1, minWidth: "150px" }}>
            <label className="tool-label">Size: {size}px</label>
            <input
              type="range"
              min="128"
              max="512"
              step="32"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
        </div>
        <div className="tool-actions">
          <button className="btn primary" onClick={generateQR}>
            Generate
          </button>
          <button
            className="btn secondary"
            onClick={downloadQR}
            disabled={!qrUrl}
          >
            Download
          </button>
          <button
            className="btn secondary"
            onClick={copyQrUrl}
            disabled={!qrUrl}
          >
            Copy URL
          </button>
        </div>
        {qrUrl && (
          <div className="tool-output-section">
            <label className="tool-label">QR Code</label>
            <div
              style={{
                padding: "24px",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                background: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img src={qrUrl} alt="QR Code" style={{ maxWidth: "100%" }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
