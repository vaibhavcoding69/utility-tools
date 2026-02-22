import { useState } from "react";
import api from "../../../lib/api";

export function UrlShortenerTool() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalUrl.trim()) {
      setError("Please enter a URL");
      return;
    }

    setLoading(true);
    setError("");
    setCopied(false);

    try {
      const result = await api.shortenUrl(originalUrl, customSlug || undefined);
      if (result.success) {
        setShortUrl(result.short_url);
        setSlug(result.slug);
      } else {
        setError(result.detail || "Failed to shorten URL");
      }
    } catch (err: any) {
      setError(err.message || "Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      const fullUrl = `https://z1x.qzz.io${shortUrl}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleClear = () => {
    setOriginalUrl("");
    setCustomSlug("");
    setShortUrl("");
    setSlug("");
    setError("");
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">
          <span className="tool-title-icon">
            <i className="bi bi-link-45deg" />
          </span>
          URL Shortener
        </h2>
        <p className="tool-description">
          Create short, memorable URLs with custom slugs
        </p>
      </div>

      <div className="tool-content">
        <form onSubmit={handleShorten}>
          <div className="tool-option-row">
            <label className="tool-label">
              <i className="bi bi-globe" />
              Original URL
            </label>
            <input
              type="url"
              className="tool-input"
              placeholder="https://example.com/very/long/url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="tool-option-row">
            <label className="tool-label">
              <i className="bi bi-tag" />
              Custom Slug (Optional)
            </label>
            <input
              type="text"
              className="tool-input"
              placeholder="myslug (auto-generated if empty)"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
              disabled={loading}
            />
            <span className="hint-text">Letters, numbers, and hyphens only</span>
          </div>

          {error && (
            <div className="error-banner">
              <i className="bi bi-exclamation-circle" />
              <span>{error}</span>
            </div>
          )}

          <div className="tool-action-buttons">
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !originalUrl.trim()}
            >
              {loading ? (
                <>
                  <i className="bi bi-hourglass-split" />
                  Shortening...
                </>
              ) : (
                <>
                  <i className="bi bi-scissors" />
                  Shorten URL
                </>
              )}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleClear}
              disabled={loading}
            >
              <i className="bi bi-arrow-counterclockwise" />
              Clear
            </button>
          </div>
        </form>

        {shortUrl && (
          <div className="result-section">
            <div className="result-item">
              <div className="result-label">
                <i className="bi bi-check-circle-fill" style={{ color: "var(--color-success)" }} />
                Shortened URL
              </div>
              <div className="result-output">
                <code>{`https://z1x.qzz.io${shortUrl}`}</code>
                <button
                  className="btn-icon"
                  onClick={handleCopy}
                  title="Copy short URL"
                >
                  <i className={copied ? "bi bi-check-lg" : "bi bi-clipboard"} />
                </button>
              </div>
            </div>

            <div className="result-item">
              <div className="result-label">
                <i className="bi bi-code" />
                Slug
              </div>
              <div className="result-output-readonly">
                <code>{slug}</code>
              </div>
            </div>

            <div className="result-item">
              <div className="result-label">
                <i className="bi bi-arrow-right" />
                Original URL
              </div>
              <div className="result-output-readonly">
                <code className="url-text">{originalUrl}</code>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UrlShortenerTool;
