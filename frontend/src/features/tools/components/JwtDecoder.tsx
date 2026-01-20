import { useState } from "react";
import api from "../../../lib/api";

export function JwtDecoder() {
  const [token, setToken] = useState("");
  const [decoded, setDecoded] = useState<{
    header: Record<string, any>;
    payload: Record<string, any>;
    signature: string;
    expired?: boolean;
    exp_date?: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDecode = async () => {
    setLoading(true);
    setError("");
    setDecoded(null);
    try {
      const result = await api.decodeJwt(token);
      if (result.success) {
        setDecoded({
          header: result.header as Record<string, any>,
          payload: result.payload as Record<string, any>,
          signature: result.signature as string,
          expired: result.expired as boolean,
          exp_date: result.exp_date as string,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to decode JWT");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">JWT Decoder</h2>
        <p className="tool-description">Decode and inspect JSON Web Tokens</p>
      </div>

      <div className="tool-content">
        <div className="tool-input-section">
          <label className="tool-label">JWT Token</label>
          <textarea
            className="tool-textarea"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            rows={4}
          />
        </div>

        <div className="tool-actions">
          <button
            className="btn primary"
            onClick={handleDecode}
            disabled={loading || !token}
          >
            {loading ? "Decoding..." : "Decode"}
          </button>
        </div>

        {error && <div className="tool-error">{error}</div>}

        {decoded && (
          <div className="tool-output-section">
            {decoded.expired !== undefined && (
              <div
                className={`jwt-status ${decoded.expired ? "expired" : "valid"}`}
              >
                {decoded.expired ? "⚠️ Token Expired" : "✅ Token Valid"}
                {decoded.exp_date && (
                  <span className="exp-date">Expires: {decoded.exp_date}</span>
                )}
              </div>
            )}

            <div className="jwt-section">
              <div className="jwt-section-header">
                <label className="tool-label">Header</label>
                <button
                  className="btn-icon"
                  onClick={() =>
                    handleCopy(JSON.stringify(decoded.header, null, 2))
                  }
                  title="Copy"
                >
                  📋
                </button>
              </div>
              <pre className="tool-output">
                <code>{JSON.stringify(decoded.header, null, 2)}</code>
              </pre>
            </div>

            <div className="jwt-section">
              <div className="jwt-section-header">
                <label className="tool-label">Payload</label>
                <button
                  className="btn-icon"
                  onClick={() =>
                    handleCopy(JSON.stringify(decoded.payload, null, 2))
                  }
                  title="Copy"
                >
                  📋
                </button>
              </div>
              <pre className="tool-output">
                <code>{JSON.stringify(decoded.payload, null, 2)}</code>
              </pre>
            </div>

            <div className="jwt-section">
              <div className="jwt-section-header">
                <label className="tool-label">Signature</label>
              </div>
              <div className="tool-output-mono">
                <code>{decoded.signature}</code>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JwtDecoder;
