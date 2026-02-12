import { useState, useEffect } from "react";
import api from "../../../lib/api";

interface CharOption {
  id: string;
  label: string;
  preview: string;
  enabled: boolean;
}

export default function RandomStringTool() {
  const [length, setLength] = useState(16);
  const [charOptions, setCharOptions] = useState<CharOption[]>([
    { id: "uppercase", label: "Uppercase Letters", preview: "A-Z", enabled: true },
    { id: "lowercase", label: "Lowercase Letters", preview: "a-z", enabled: true },
    { id: "digits", label: "Numbers", preview: "0-9", enabled: true },
    { id: "symbols", label: "Special Characters", preview: "!@#$%", enabled: false },
  ]);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    generate();
  }, []);

  const toggleOption = (id: string) => {
    setCharOptions(prev => {
      const newOptions = prev.map(opt => 
        opt.id === id ? { ...opt, enabled: !opt.enabled } : opt
      );
      const hasEnabled = newOptions.some(opt => opt.enabled);
      if (!hasEnabled) return prev;
      return newOptions;
    });
  };

  const generate = async () => {
    const enabledOptions = charOptions.reduce((acc, opt) => ({
      ...acc,
      [opt.id]: opt.enabled
    }), {} as Record<string, boolean>);

    setLoading(true);
    setError("");
    try {
      const res = await api.randomString({ 
        length, 
        uppercase: enabledOptions.uppercase,
        lowercase: enabledOptions.lowercase,
        digits: enabledOptions.digits,
        symbols: enabledOptions.symbols
      });
      if (res.success) {
        const newString = (res.string || res.value) as string;
        setOutput(newString);
        setHistory(prev => [newString, ...prev.slice(0, 4)]);
      }
    } catch (e: any) {
      setError(e.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const copyFromHistory = async (str: string) => {
    try {
      await navigator.clipboard.writeText(str);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const lengthPresets = [8, 16, 24, 32, 48, 64];

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">
          <span className="tool-title-icon">
            <i className="bi bi-shuffle" />
          </span>
          Random String Generator
        </h2>
        <p className="tool-description">
          Generate cryptographically secure random strings with customizable character sets.
        </p>
      </div>

      <div className="tool-content">
        {output && (
          <div className="string-output-display">
            <code className="string-output-text">{output}</code>
            <div className="string-output-actions">
              <button
                className="btn-icon"
                onClick={copy}
                title={copied ? "Copied!" : "Copy to clipboard"}
              >
                <i className={copied ? "bi bi-check-lg" : "bi bi-clipboard"} />
              </button>
              <button
                className="btn-icon"
                onClick={generate}
                disabled={loading}
                title="Regenerate"
              >
                <i className="bi bi-arrow-clockwise" style={loading ? { animation: "spin 1s linear infinite" } : {}} />
              </button>
            </div>
          </div>
        )}

        <div className="option-card">
          <div className="option-header">
            <i className="bi bi-rulers" />
            <span>String Length</span>
            <span className="size-indicator">{length} characters</span>
          </div>
          <div className="option-content">
            <div className="size-presets">
              {lengthPresets.map(preset => (
                <button
                  key={preset}
                  className={`size-preset-btn ${length === preset ? "active" : ""}`}
                  onClick={() => setLength(preset)}
                >
                  {preset}
                </button>
              ))}
            </div>
            <input
              type="range"
              min="4"
              max="128"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="option-slider"
            />
            <input
              className="tool-input"
              type="number"
              min={1}
              max={256}
              value={length}
              onChange={(e) => setLength(Math.max(1, Math.min(256, Number(e.target.value))))}
              style={{ marginTop: "var(--space-2)" }}
            />
          </div>
        </div>

        <div className="tool-section">
          <div className="tool-section-header">
            <label className="tool-label">
              <i className="bi bi-fonts" />
              Character Types
            </label>
          </div>
          <div className="char-options-grid">
            {charOptions.map(option => (
              <div
                key={option.id}
                className={`char-option ${option.enabled ? "active" : ""}`}
                onClick={() => toggleOption(option.id)}
              >
                <div className="char-option-checkbox">
                  <i className="bi bi-check" />
                </div>
                <span className="char-option-label">{option.label}</span>
                <span className="char-option-preview">{option.preview}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="tool-actions">
          <button 
            className="btn primary" 
            onClick={generate} 
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="bi bi-hourglass-split" style={{ marginRight: "6px" }} />
                Generating...
              </>
            ) : (
              <>
                <i className="bi bi-shuffle" style={{ marginRight: "6px" }} />
                Generate New
              </>
            )}
          </button>
          <button 
            className="btn secondary" 
            onClick={copy} 
            disabled={!output}
          >
            <i className={copied ? "bi bi-check-lg" : "bi bi-clipboard"} style={{ marginRight: "6px" }} />
            {copied ? "Copied!" : "Copy String"}
          </button>
        </div>

        {error && (
          <div className="tool-error">
            <i className="bi bi-exclamation-triangle" style={{ marginRight: "8px" }} />
            {error}
          </div>
        )}

        {history.length > 1 && (
          <div className="tool-output-section">
            <div className="tool-section-header">
              <label className="tool-label">
                <i className="bi bi-clock-history" />
                Recent Strings
              </label>
            </div>
            <div className="history-list">
              {history.slice(1).map((str, index) => (
                <div
                  key={index}
                  className="history-item"
                  onClick={() => copyFromHistory(str)}
                  title="Click to copy"
                >
                  <code>{str.length > 50 ? str.slice(0, 50) + "..." : str}</code>
                  <span className="history-item-length">{str.length} chars</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="tool-info-card">
          <div className="info-card-header">
            <i className="bi bi-shield-check" />
            <span>Security Note</span>
          </div>
          <div className="info-card-content">
            <p>These strings are generated using cryptographically secure random number generation. They're suitable for API keys, tokens, and other security-sensitive purposes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
