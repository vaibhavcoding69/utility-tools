import { useState } from "react";
import api from "../../../lib/api";

interface FileMetadata {
  success: boolean;
  file_name: string;
  file_size_bytes: number;
  extension: string;
  mime_type: string;
  type?: string;
  width?: number;
  height?: number;
  pages?: number;
  valid_json?: boolean;
  keys?: string[];
  line_count?: number;
  character_count?: number;
  [key: string]: any;
}

export function FileMetadataAnalyzerTool() {
  const [metadata, setMetadata] = useState<FileMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");
    setMetadata(null);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const base64 = (event.target?.result as string).split(",")[1];
          setFileName(file.name);

          const result = await api.analyzeFileMetadata(base64, file.name);
          if (result.success) {
            setMetadata(result as unknown as FileMetadata);
          } else {
            setError((result as any).detail || "Failed to analyze file");
          }
        } catch (err: any) {
          setError(err.message || "Failed to process file");
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMetadata(null);
    setFileName("");
    setError("");
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">
          <span className="tool-title-icon">
            <i className="bi bi-file-earmark" />
          </span>
          File Metadata Analyzer
        </h2>
        <p className="tool-description">
          Extract and analyze metadata from files (images, PDFs, JSON, text, etc.)
        </p>
      </div>

      <div className="tool-content">
        <div className="file-upload-section">
          <label className="tool-label">
            <i className="bi bi-upload" />
            Select File
          </label>
          <div className="file-input-wrapper">
            <input
              type="file"
              id="file-input"
              className="file-input"
              onChange={handleFileChange}
              disabled={loading}
            />
            <label htmlFor="file-input" className="file-input-label">
              <i className="bi bi-cloud-upload" />
              <span>Click to select file or drag and drop</span>
              <span className="hint-text">Any file type is supported</span>
            </label>
          </div>
          {fileName && (
            <div className="file-selected">
              <i className="bi bi-check-circle-fill" style={{ color: "var(--color-success)" }} />
              <span>{fileName}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="error-banner">
            <i className="bi bi-exclamation-circle" />
            <span>{error}</span>
          </div>
        )}

        {loading && (
          <div className="loading-spinner">
            <i className="bi bi-hourglass-split" style={{ animation: "spin 1s linear infinite" }} />
            <span>Analyzing file...</span>
          </div>
        )}

        {metadata && (
          <div className="result-section">
            <div className="metadata-grid">
              {}
              <div className="metadata-card">
                <div className="metadata-title">
                  <i className="bi bi-info-circle" />
                  General Info
                </div>
                <div className="metadata-content">
                  <div className="metadata-row">
                    <span className="metadata-key">File Name</span>
                    <span className="metadata-value">{metadata.file_name}</span>
                  </div>
                  <div className="metadata-row">
                    <span className="metadata-key">Extension</span>
                    <span className="metadata-value">{metadata.extension || "Unknown"}</span>
                  </div>
                  <div className="metadata-row">
                    <span className="metadata-key">MIME Type</span>
                    <span className="metadata-value">{metadata.mime_type}</span>
                  </div>
                  <div className="metadata-row">
                    <span className="metadata-key">File Size</span>
                    <span className="metadata-value">
                      {formatBytes(metadata.file_size_bytes)} ({metadata.file_size_bytes.toLocaleString()} bytes)
                    </span>
                  </div>
                  <div className="metadata-row">
                    <span className="metadata-key">File Type</span>
                    <span className="metadata-value" style={{ textTransform: "capitalize" }}>
                      {metadata.type || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>

              {}
              {metadata.type === "image" && (metadata.width || metadata.height) && (
                <div className="metadata-card">
                  <div className="metadata-title">
                    <i className="bi bi-image" />
                    Image Info
                  </div>
                  <div className="metadata-content">
                    {metadata.width && (
                      <div className="metadata-row">
                        <span className="metadata-key">Width</span>
                        <span className="metadata-value">{metadata.width}px</span>
                      </div>
                    )}
                    {metadata.height && (
                      <div className="metadata-row">
                        <span className="metadata-key">Height</span>
                        <span className="metadata-value">{metadata.height}px</span>
                      </div>
                    )}
                    {metadata.width && metadata.height && (
                      <div className="metadata-row">
                        <span className="metadata-key">Aspect Ratio</span>
                        <span className="metadata-value">
                          {(metadata.width / metadata.height).toFixed(2)}:1
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {}
              {metadata.type === "pdf" && (
                <div className="metadata-card">
                  <div className="metadata-title">
                    <i className="bi bi-file-pdf" />
                    PDF Info
                  </div>
                  <div className="metadata-content">
                    {metadata.pages && (
                      <div className="metadata-row">
                        <span className="metadata-key">Pages</span>
                        <span className="metadata-value">{metadata.pages}</span>
                      </div>
                    )}
                    {!metadata.pages && (
                      <div className="metadata-row">
                        <span className="metadata-key">Pages</span>
                        <span className="metadata-value">Unknown</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {}
              {metadata.type === "json" && (
                <div className="metadata-card">
                  <div className="metadata-title">
                    <i className="bi bi-braces" />
                    JSON Info
                  </div>
                  <div className="metadata-content">
                    <div className="metadata-row">
                      <span className="metadata-key">Valid JSON</span>
                      <span className="metadata-value">
                        {metadata.valid_json ? (
                          <span style={{ color: "var(--color-success)" }}>✓ Yes</span>
                        ) : (
                          <span style={{ color: "var(--color-error)" }}>✗ No</span>
                        )}
                      </span>
                    </div>
                    {metadata.keys && metadata.valid_json && (
                      <div className="metadata-row">
                        <span className="metadata-key">Top-level Keys</span>
                        <span className="metadata-value">
                          <code style={{ display: "block", marginTop: "0.5rem" }}>
                            {metadata.keys.join(", ")}
                          </code>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {}
              {metadata.type === "text" && (
                <div className="metadata-card">
                  <div className="metadata-title">
                    <i className="bi bi-file-text" />
                    Text Info
                  </div>
                  <div className="metadata-content">
                    {metadata.line_count && (
                      <div className="metadata-row">
                        <span className="metadata-key">Lines</span>
                        <span className="metadata-value">{metadata.line_count.toLocaleString()}</span>
                      </div>
                    )}
                    {metadata.character_count && (
                      <div className="metadata-row">
                        <span className="metadata-key">Characters</span>
                        <span className="metadata-value">{metadata.character_count.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="tool-action-buttons">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleClear}
              >
                <i className="bi bi-arrow-counterclockwise" />
                Analyze Another File
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .file-upload-section {
          margin-bottom: 2rem;
        }

        .file-input-wrapper {
          position: relative;
          display: block;
        }

        .file-input {
          display: none;
        }

        .file-input-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 3rem 2rem;
          border: 2px dashed var(--color-border);
          border-radius: 0.75rem;
          background: var(--color-background-secondary);
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .file-input-label:hover {
          border-color: var(--color-primary);
          background: var(--color-background);
        }

        .file-input-label > span:first-child {
          font-size: 2rem;
          color: var(--color-primary);
        }

        .file-input-label > span:nth-child(2) {
          font-weight: 500;
          color: var(--color-text);
        }

        .hint-text {
          font-size: 0.875rem;
          color: var(--color-text-muted);
        }

        .file-selected {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          margin-top: 1rem;
          background: var(--color-background-secondary);
          border-radius: 0.5rem;
          font-size: 0.875rem;
        }

        .metadata-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .metadata-card {
          border: 1px solid var(--color-border);
          border-radius: 0.75rem;
          padding: 1.5rem;
          background: var(--color-background-secondary);
        }

        .metadata-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: var(--color-text);
        }

        .metadata-title i {
          color: var(--color-primary);
        }

        .metadata-content {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .metadata-row {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--color-border);
        }

        .metadata-row:last-child {
          border-bottom: none;
        }

        .metadata-key {
          font-weight: 500;
          color: var(--color-text-muted);
          font-size: 0.875rem;
        }

        .metadata-value {
          text-align: right;
          word-break: break-word;
          color: var(--color-text);
          font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace;
          font-size: 0.875rem;
        }

        .loading-spinner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 2rem;
          text-align: center;
        }

        .loading-spinner i {
          font-size: 1.5rem;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default FileMetadataAnalyzerTool;
