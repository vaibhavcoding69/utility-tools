import { useState, useRef } from "react";

export default function ImageBase64Tool() {
  const [base64, setBase64] = useState("");
  const [preview, setPreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setBase64(result);
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const copyDataUri = () => {
    navigator.clipboard.writeText(base64);
  };

  const copyRawBase64 = () => {
    const raw = base64.split(",")[1] || base64;
    navigator.clipboard.writeText(raw);
  };

  const clear = () => {
    setBase64("");
    setPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">Image to Base64</h2>
        <p className="tool-description">
          Convert images to Base64 encoded strings
        </p>
      </div>
      <div className="tool-content">
        <div className="tool-input-section">
          <label className="tool-label">Select Image</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="tool-input"
            style={{ padding: "8px" }}
          />
        </div>
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
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
        )}
        {base64 && (
          <>
            <div className="tool-output-section">
              <label className="tool-label">Base64 Output</label>
              <textarea
                className="tool-textarea"
                value={base64}
                readOnly
                rows={6}
                style={{ fontFamily: "monospace", fontSize: "12px" }}
              />
            </div>
            <div className="tool-actions">
              <button className="btn primary" onClick={copyDataUri}>
                Copy Data URI
              </button>
              <button className="btn secondary" onClick={copyRawBase64}>
                Copy Raw Base64
              </button>
              <button className="btn secondary" onClick={clear}>
                Clear
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
