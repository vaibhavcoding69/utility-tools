import { useState, useEffect } from "react";
import api from "../../../lib/api";

export function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState<any>(null);
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    handleGenerate();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setCopied(false);
    try {
      const result = await api.generatePassword({
        length,
        include_uppercase: includeUppercase,
        include_lowercase: includeLowercase,
        include_numbers: includeNumbers,
        include_symbols: includeSymbols,
      });
      if (result.success) {
        setPassword(result.password);
        checkStrength(result.password);
      }
    } catch (err) {
      console.error("Failed to generate password:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkStrength = async (pwd: string) => {
    try {
      const result = await api.checkPasswordStrength(pwd);
      if (result.success) {
        setStrength(result);
      }
    } catch (err) {
      console.error("Failed to check strength:", err);
    }
  };

  const handleCopy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getStrengthColor = (str: string) => {
    switch (str?.toLowerCase()) {
      case "very_strong":
      case "strong":
        return "var(--color-success)";
      case "medium":
        return "var(--color-warning)";
      case "weak":
      case "very_weak":
        return "var(--color-error)";
      default:
        return "var(--color-text-muted)";
    }
  };

  const getStrengthPercent = () => {
    if (!strength) return 0;
    return (strength.score / strength.max_score) * 100;
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">
          <span className="tool-title-icon">
            <i className="bi bi-key" />
          </span>
          Password Generator
        </h2>
        <p className="tool-description">
          Generate cryptographically secure random passwords with customizable options.
        </p>
      </div>

      <div className="tool-content">
        {password && (
          <div className="password-display">
            <div className="password-output-wrapper">
              <code className="password-text">{password}</code>
              <div className="password-actions">
                <button
                  className="btn-icon"
                  onClick={handleCopy}
                  title="Copy password"
                >
                  <i className={copied ? "bi bi-check-lg" : "bi bi-clipboard"} />
                </button>
                <button
                  className="btn-icon"
                  onClick={handleGenerate}
                  disabled={loading}
                  title="Regenerate"
                >
                  <i className="bi bi-arrow-clockwise" style={loading ? { animation: "spin 1s linear infinite" } : {}} />
                </button>
              </div>
            </div>
            
            {strength && (
              <div className="password-strength-section">
                <div className="strength-meter">
                  <div 
                    className="strength-meter-fill"
                    style={{ 
                      width: `${getStrengthPercent()}%`,
                      backgroundColor: getStrengthColor(strength.strength)
                    }}
                  />
                </div>
                <div className="strength-info">
                  <span 
                    className="strength-label"
                    style={{ color: getStrengthColor(strength.strength) }}
                  >
                    {strength.strength?.replace("_", " ")}
                  </span>
                  <span className="strength-score">
                    {strength.score}/{strength.max_score} points
                  </span>
                </div>
                {strength.feedback && strength.feedback.length > 0 && (
                  <ul className="strength-feedback">
                    {strength.feedback.map((item: string, index: number) => (
                      <li key={index}>
                        <i className="bi bi-info-circle" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}

        <div className="tool-options-panel">
          <div className="tool-section-header">
            <label className="tool-label">
              <i className="bi bi-sliders" />
              Password Options
            </label>
          </div>

          <div className="tool-option-row">
            <label className="tool-label">
              <i className="bi bi-rulers" />
              Length
            </label>
            <div className="slider-wrapper">
              <input
                type="range"
                min={8}
                max={64}
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="tool-slider"
              />
              <span className="slider-value">{length}</span>
            </div>
          </div>

          <div className="checkbox-grid">
            <label className="tool-checkbox-label">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
              />
              <span className="checkbox-custom" />
              <span className="checkbox-text">
                <span className="checkbox-title">Uppercase</span>
                <span className="checkbox-hint">A-Z</span>
              </span>
            </label>

            <label className="tool-checkbox-label">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
              />
              <span className="checkbox-custom" />
              <span className="checkbox-text">
                <span className="checkbox-title">Lowercase</span>
                <span className="checkbox-hint">a-z</span>
              </span>
            </label>

            <label className="tool-checkbox-label">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
              />
              <span className="checkbox-custom" />
              <span className="checkbox-text">
                <span className="checkbox-title">Numbers</span>
                <span className="checkbox-hint">0-9</span>
              </span>
            </label>

            <label className="tool-checkbox-label">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
              />
              <span className="checkbox-custom" />
              <span className="checkbox-text">
                <span className="checkbox-title">Symbols</span>
                <span className="checkbox-hint">!@#$%^&*</span>
              </span>
            </label>
          </div>
        </div>

        <div className="tool-actions">
          <button
            className="btn primary"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="bi bi-arrow-repeat" style={{ animation: "spin 1s linear infinite" }} />
                Generating...
              </>
            ) : (
              <>
                <i className="bi bi-shuffle" />
                Generate New Password
              </>
            )}
          </button>
          <button
            className="btn secondary"
            onClick={handleCopy}
            disabled={!password}
          >
            <i className={copied ? "bi bi-check-lg" : "bi bi-clipboard"} />
            {copied ? "Copied!" : "Copy Password"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PasswordGenerator;
