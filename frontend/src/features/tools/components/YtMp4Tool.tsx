import { useState } from "react";
import { Download, AlertCircle, CheckCircle, Loader } from "lucide-react";
import api from "../../../lib/api";

export function YtMp4Tool() {
  const [url, setUrl] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [quality, setQuality] = useState<"high" | "medium" | "low">("high");

  const validateYoutubeUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie|youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  };

  const handleConvert = async () => {
    if (!url.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    if (!validateYoutubeUrl(url)) {
      setError("Invalid YouTube URL. Please provide a valid YouTube video link.");
      return;
    }

    setLoading(true);
    setError("");
    setOutput("");
    setVideoInfo(null);

    try {
      const result = await api.convertYtToMp4(url, quality);
      if (result.success) {
        setOutput(result.downloadUrl || "Conversion completed");
        setVideoInfo({
          title: result.title,
          duration: result.duration,
          thumbnail: result.thumbnail,
          fileSize: result.fileSize,
        });
      } else {
        setError(result.message || "Failed to convert video");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process YouTube video");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleClear = () => {
    setUrl("");
    setOutput("");
    setError("");
    setVideoInfo(null);
  };

  const handleDownload = () => {
    if (output && output.startsWith("http")) {
      window.open(output, "_blank");
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">
          <span className="tool-title-icon">
            <i className="bi bi-play-circle" />
          </span>
          YouTube to MP4
        </h2>
        <p className="tool-description">
          Convert YouTube videos to MP4 video format. Download videos in your preferred quality from any YouTube source.
        </p>
      </div>

      <div className="tool-content">
        {/* URL Input */}
        <div className="tool-section">
          <label className="tool-label">YouTube Video URL</label>
          <div className="input-group-with-button">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="tool-input"
              onKeyPress={(e) => e.key === "Enter" && handleConvert()}
              disabled={loading}
            />
            <button
              onClick={handleConvert}
              disabled={loading || !url.trim()}
              className="tool-button tool-button-primary"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Convert
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quality Selection */}
        <div className="tool-section">
          <label className="tool-label">Video Quality</label>
          <div className="tool-tabs">
            <button
              className={`tool-tab ${quality === "high" ? "active" : ""}`}
              onClick={() => setQuality("high")}
              disabled={loading}
            >
              <span className="tab-label">High (1080p)</span>
              <span className="tab-info">~200MB</span>
            </button>
            <button
              className={`tool-tab ${quality === "medium" ? "active" : ""}`}
              onClick={() => setQuality("medium")}
              disabled={loading}
            >
              <span className="tab-label">Medium (720p)</span>
              <span className="tab-info">~100MB</span>
            </button>
            <button
              className={`tool-tab ${quality === "low" ? "active" : ""}`}
              onClick={() => setQuality("low")}
              disabled={loading}
            >
              <span className="tab-label">Low (480p)</span>
              <span className="tab-info">~50MB</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Video Preview */}
        {videoInfo && (
          <div className="video-preview-card">
            {videoInfo.thumbnail && (
              <img
                src={videoInfo.thumbnail}
                alt={videoInfo.title}
                className="video-preview-thumbnail"
              />
            )}
            <div className="video-preview-info">
              <h3 className="video-preview-title">{videoInfo.title}</h3>
              <div className="video-preview-meta">
                {videoInfo.duration && (
                  <p>Duration: {videoInfo.duration}</p>
                )}
                {videoInfo.fileSize && (
                  <p>File Size: {videoInfo.fileSize}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Download Link */}
        {output && (
          <div className="tool-section">
            <label className="tool-label">Download Link</label>
            <div className="output-group">
              <input
                type="text"
                value={output}
                readOnly
                className="tool-input tool-input-readonly"
              />
              <div className="output-button-group">
                <button
                  onClick={handleCopy}
                  className="tool-button tool-button-secondary"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <i className="bi bi-clipboard" />
                      Copy
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="tool-button tool-button-primary"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="tool-actions">
          <button
            onClick={handleClear}
            className="tool-button tool-button-secondary"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}
