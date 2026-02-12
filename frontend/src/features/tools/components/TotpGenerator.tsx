import { useState } from "react";
import api from "../../../lib/api";

export function TotpGenerator() {
  const [secret, setSecret] = useState("");
  const [result, setResult] = useState<{
    secret: string;
    current_code: string;
    time_remaining: number;
    provisioning_uri: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.generateTotp(secret || undefined, 6, 30);
      if (res.success) {
        setResult({
          secret: res.secret as string,
          current_code: res.current_code as string,
          time_remaining: res.time_remaining as number,
          provisioning_uri: res.provisioning_uri as string,
        });
        setCountdown(res.time_remaining as number);

        const interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 30;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate TOTP");
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
        <h2 className="tool-title">TOTP Generator</h2>
        <p className="tool-description">
          Generate Time-based One-Time Passwords
        </p>
      </div>

      <div className="tool-content">
        <div className="tool-input-section">
          <label className="tool-label">
            Secret (optional - leave empty to generate new)
          </label>
          <input
            type="text"
            className="tool-input"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Base32 encoded secret"
          />
        </div>

        <div className="tool-actions">
          <button
            className="btn primary"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate TOTP"}
          </button>
        </div>

        {error && <div className="tool-error">{error}</div>}

        {result && (
          <div className="tool-output-section">
            <div className="totp-code-container">
              <div className="totp-code">
                <span className="code-value">{result.current_code}</span>
                <div className="code-timer">
                  <div
                    className="timer-bar"
                    style={{ width: `${(countdown / 30) * 100}%` }}
                  />
                </div>
                <span className="timer-text">{countdown}s</span>
              </div>
              <button
                className="btn-icon"
                onClick={() => handleCopy(result.current_code)}
                title="Copy code"
              >
                <i className="bi bi-clipboard" />
              </button>
            </div>

            <div className="totp-details">
              <div className="totp-detail-item">
                <label className="tool-label">Secret</label>
                <div className="detail-value">
                  <code>{result.secret}</code>
                  <button
                    className="btn-icon"
                    onClick={() => handleCopy(result.secret)}
                    title="Copy"
                  >
                    <i className="bi bi-clipboard" />
                  </button>
                </div>
              </div>

              <div className="totp-detail-item">
                <label className="tool-label">Provisioning URI</label>
                <div className="detail-value">
                  <code className="uri-text">{result.provisioning_uri}</code>
                  <button
                    className="btn-icon"
                    onClick={() => handleCopy(result.provisioning_uri)}
                    title="Copy"
                  >
                    <i className="bi bi-clipboard" />
                  </button>
                </div>
              </div>
            </div>

            <p className="totp-note">
              <i className="bi bi-lightbulb" /> Use the secret or provisioning URI to set up in your
              authenticator app
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TotpGenerator;
