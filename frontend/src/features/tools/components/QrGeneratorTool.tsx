import { useState } from "react";

export default function QrGeneratorTool() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(256);
  const [qrUrl, setQrUrl] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [inputType, setInputType] = useState<"text" | "url" | "email" | "phone" | "wifi">("text");

  const generateQR = () => {
    if (!text.trim()) return;
    let qrContent = text;
    
    switch (inputType) {
      case "email":
        qrContent = `mailto:${text}`;
        break;
      case "phone":
        qrContent = `tel:${text}`;
        break;
      case "wifi":
        qrContent = text;
        break;
      default:
        qrContent = text;
    }
    

    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(qrContent)}&format=png`;
    setQrUrl(url);
  };

  const downloadQR = () => {
    if (!qrUrl) return;

    fetch(qrUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `qrcode-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(blobUrl);
        showCopiedFeedback("download");
      })
      .catch((err) => console.error("Failed to download QR:", err));
  };

  const copyQrUrl = async () => {
    try {
      await navigator.clipboard.writeText(qrUrl);
      showCopiedFeedback("url");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const showCopiedFeedback = (type: string) => {
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleClear = () => {
    setText("");
    setQrUrl("");
  };

  const inputTypes = [
    { value: "text", label: "Text", icon: "bi-type", placeholder: "Enter any text to encode..." },
    { value: "url", label: "URL", icon: "bi-link-45deg", placeholder: "https://example.com" },
    { value: "email", label: "Email", icon: "bi-envelope", placeholder: "email@example.com" },
    { value: "phone", label: "Phone", icon: "bi-telephone", placeholder: "+1234567890" },
  ];

  const sizePresets = [
    { label: "Small", size: 128 },
    { label: "Medium", size: 256 },
    { label: "Large", size: 384 },
    { label: "XL", size: 512 },
  ];

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">
          <span className="tool-title-icon">
            <i className="bi bi-qr-code" />
          </span>
          QR Code Generator
        </h2>
        <p className="tool-description">
          Generate QR codes from text, URLs, emails, or phone numbers. Download or share instantly.
        </p>
      </div>

      <div className="tool-content">
        <div className="qr-type-selector">
          {inputTypes.map((type) => (
            <button
              key={type.value}
              className={`qr-type-option ${inputType === type.value ? "active" : ""}`}
              onClick={() => setInputType(type.value as typeof inputType)}
            >
              <i className={`bi ${type.icon}`} />
              <span>{type.label}</span>
            </button>
          ))}
        </div>

        <div className="tool-input-section">
          <div className="tool-section-header">
            <label className="tool-label">
              <i className={`bi ${inputTypes.find(t => t.value === inputType)?.icon}`} />
              {inputTypes.find(t => t.value === inputType)?.label} Content
            </label>
            <span className="char-count">{text.length} characters</span>
          </div>
          <textarea
            className="tool-textarea"
            placeholder={inputTypes.find(t => t.value === inputType)?.placeholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            onKeyDown={(e) => e.key === "Enter" && e.ctrlKey && generateQR()}
          />
        </div>

        <div className="qr-options-section">
          <div className="tool-section-header">
            <label className="tool-label">
              <i className="bi bi-aspect-ratio" />
              QR Code Size
            </label>
            <span className="size-indicator">{size}×{size}px</span>
          </div>
          <div className="qr-size-options">
            <div className="size-presets">
              {sizePresets.map((preset) => (
                <button
                  key={preset.label}
                  className={`size-preset-btn ${size === preset.size ? "active" : ""}`}
                  onClick={() => setSize(preset.size)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <input
              type="range"
              min="128"
              max="512"
              step="32"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="qr-size-slider"
            />
          </div>
        </div>

        <div className="tool-actions">
          <button 
            className="btn primary" 
            onClick={generateQR}
            disabled={!text.trim()}
          >
            <i className="bi bi-qr-code" style={{ marginRight: "6px" }} />
            Generate QR Code
          </button>
          {qrUrl && (
            <>
              <button className="btn secondary" onClick={downloadQR}>
                <i className={copied === "download" ? "bi bi-check-lg" : "bi bi-download"} style={{ marginRight: "6px" }} />
                {copied === "download" ? "Downloaded!" : "Download PNG"}
              </button>
              <button className="btn ghost" onClick={copyQrUrl}>
                <i className={copied === "url" ? "bi bi-check-lg" : "bi bi-link"} style={{ marginRight: "6px" }} />
                {copied === "url" ? "Copied!" : "Copy URL"}
              </button>
            </>
          )}
          <button 
            className="btn ghost" 
            onClick={handleClear}
            disabled={!text && !qrUrl}
          >
            <i className="bi bi-x-lg" style={{ marginRight: "6px" }} />
            Clear
          </button>
        </div>

        {qrUrl ? (
          <div className="tool-output-section">
            <div className="tool-section-header">
              <label className="tool-label">
                <i className="bi bi-image" />
                Generated QR Code
              </label>
            </div>
            <div className="qr-output-container">
              <div className="qr-code-display">
                <img src={qrUrl} alt="QR Code" />
              </div>
              <div className="qr-output-info">
                <div className="qr-info-item">
                  <span className="qr-info-label">Size</span>
                  <span className="qr-info-value">{size}×{size} pixels</span>
                </div>
                <div className="qr-info-item">
                  <span className="qr-info-label">Type</span>
                  <span className="qr-info-value">{inputTypes.find(t => t.value === inputType)?.label}</span>
                </div>
                <div className="qr-info-item">
                  <span className="qr-info-label">Content</span>
                  <span className="qr-info-value qr-content-preview">{text.length > 50 ? text.slice(0, 50) + "..." : text}</span>
                </div>
              </div>
            </div>
            <div className="tool-hint">
              <i className="bi bi-lightbulb" />
              Scan with your phone camera or any QR code reader app
            </div>
          </div>
        ) : (
          <div className="tool-empty-state">
            <div className="empty-state-icon">
              <i className="bi bi-qr-code" />
            </div>
            <h3>Ready to Generate</h3>
            <p>Enter text or URL above and click "Generate QR Code" to create your QR code</p>
          </div>
        )}

        <div className="tool-info-card">
          <div className="info-card-header">
            <i className="bi bi-info-circle" />
            <span>QR Code Tips</span>
          </div>
          <div className="info-card-content">
            <p>QR codes can store up to 4,296 alphanumeric characters. Keep content short for better scanning reliability. Use larger sizes when printing for better scanability at distance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
