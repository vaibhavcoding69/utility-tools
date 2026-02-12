import { useState, useEffect } from "react";

interface DateFormats {
  utc: string;
  local: string;
  iso: string;
  relative: string;
  unix: number;
  unixMs: number;
}

export default function TimestampTool() {
  const [timestamp, setTimestamp] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [mode, setMode] = useState<"to-date" | "to-timestamp">("to-date");
  const [output, setOutput] = useState<DateFormats | null>(null);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(Math.abs(diffMs) / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);

    const prefix = diffMs > 0 ? "" : "in ";
    const suffix = diffMs > 0 ? " ago" : "";

    if (diffYear > 0) return `${prefix}${diffYear} year${diffYear > 1 ? "s" : ""}${suffix}`;
    if (diffMonth > 0) return `${prefix}${diffMonth} month${diffMonth > 1 ? "s" : ""}${suffix}`;
    if (diffDay > 0) return `${prefix}${diffDay} day${diffDay > 1 ? "s" : ""}${suffix}`;
    if (diffHour > 0) return `${prefix}${diffHour} hour${diffHour > 1 ? "s" : ""}${suffix}`;
    if (diffMin > 0) return `${prefix}${diffMin} minute${diffMin > 1 ? "s" : ""}${suffix}`;
    return `${prefix}${diffSec} second${diffSec !== 1 ? "s" : ""}${suffix}`;
  };

  const convert = () => {
    setError("");
    
    if (mode === "to-date") {
      const ts = parseInt(timestamp, 10);
      if (isNaN(ts)) {
        setError("Please enter a valid Unix timestamp");
        setOutput(null);
        return;
      }
      const isMs = ts > 9999999999;
      const date = new Date(isMs ? ts : ts * 1000);
      
      if (isNaN(date.getTime())) {
        setError("Invalid timestamp");
        setOutput(null);
        return;
      }
      
      setOutput({
        utc: date.toUTCString(),
        local: date.toLocaleString(),
        iso: date.toISOString(),
        relative: getRelativeTime(date),
        unix: Math.floor(date.getTime() / 1000),
        unixMs: date.getTime(),
      });
    } else {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        setError("Please enter a valid date string");
        setOutput(null);
        return;
      }
      setOutput({
        utc: date.toUTCString(),
        local: date.toLocaleString(),
        iso: date.toISOString(),
        relative: getRelativeTime(date),
        unix: Math.floor(date.getTime() / 1000),
        unixMs: date.getTime(),
      });
    }
  };

  const useNow = () => {
    const date = new Date();
    setTimestamp(Math.floor(date.getTime() / 1000).toString());
    setDateStr(date.toISOString());
    setOutput({
      utc: date.toUTCString(),
      local: date.toLocaleString(),
      iso: date.toISOString(),
      relative: "just now",
      unix: Math.floor(date.getTime() / 1000),
      unixMs: date.getTime(),
    });
    setError("");
  };

  const copyValue = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatResults = [
    { label: "Unix Timestamp", value: output?.unix.toString() || "", icon: "bi-clock-history" },
    { label: "Unix Timestamp (ms)", value: output?.unixMs.toString() || "", icon: "bi-stopwatch" },
    { label: "UTC Format", value: output?.utc || "", icon: "bi-globe" },
    { label: "Local Format", value: output?.local || "", icon: "bi-geo-alt" },
    { label: "ISO 8601", value: output?.iso || "", icon: "bi-calendar-date" },
    { label: "Relative Time", value: output?.relative || "", icon: "bi-hourglass-split" },
  ];

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">
          <span className="tool-title-icon">
            <i className="bi bi-clock" />
          </span>
          Timestamp Converter
        </h2>
        <p className="tool-description">
          Convert between Unix timestamps and human-readable dates with multiple format options.
        </p>
      </div>

      <div className="tool-content">
        <div className="live-clock-card">
          <div className="live-clock-header">
            <i className="bi bi-clock-fill" />
            <span>Current Time</span>
          </div>
          <div className="live-clock-content">
            <div className="live-clock-time">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="live-clock-details">
              <span className="clock-detail">
                <i className="bi bi-calendar3" />
                {currentTime.toLocaleDateString()}
              </span>
              <span className="clock-detail">
                <i className="bi bi-hash" />
                {Math.floor(currentTime.getTime() / 1000)}
              </span>
            </div>
          </div>
        </div>

        <div className="tool-tabs">
          <button
            className={`tool-tab ${mode === "to-date" ? "active" : ""}`}
            onClick={() => setMode("to-date")}
          >
            <i className="bi bi-arrow-right" style={{ marginRight: "6px" }} />
            Timestamp → Date
          </button>
          <button
            className={`tool-tab ${mode === "to-timestamp" ? "active" : ""}`}
            onClick={() => setMode("to-timestamp")}
          >
            <i className="bi bi-arrow-left" style={{ marginRight: "6px" }} />
            Date → Timestamp
          </button>
        </div>

        <div className="tool-input-section">
          <div className="tool-section-header">
            <label className="tool-label">
              <i className={mode === "to-date" ? "bi bi-hash" : "bi bi-calendar"} />
              {mode === "to-date" ? "Unix Timestamp" : "Date String"}
            </label>
          </div>
          {mode === "to-date" ? (
            <input
              className="tool-input"
              type="text"
              placeholder="Enter Unix timestamp (e.g., 1700000000 or 1700000000000)"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && convert()}
            />
          ) : (
            <input
              className="tool-input"
              type="text"
              placeholder="Enter date string (e.g., 2024-01-15, Jan 15 2024, or ISO format)"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && convert()}
            />
          )}
          <div className="input-hint">
            {mode === "to-date" 
              ? "Supports both seconds and milliseconds timestamps"
              : "Supports various date formats including ISO 8601"
            }
          </div>
        </div>

        <div className="tool-actions">
          <button 
            className="btn primary" 
            onClick={convert}
            disabled={mode === "to-date" ? !timestamp : !dateStr}
          >
            <i className="bi bi-arrow-repeat" style={{ marginRight: "6px" }} />
            Convert
          </button>
          <button className="btn secondary" onClick={useNow}>
            <i className="bi bi-clock" style={{ marginRight: "6px" }} />
            Use Current Time
          </button>
        </div>

        {error && (
          <div className="tool-error">
            <i className="bi bi-exclamation-triangle" style={{ marginRight: "8px" }} />
            {error}
          </div>
        )}

        {output && (
          <div className="tool-output-section">
            <div className="tool-section-header">
              <label className="tool-label">
                <i className="bi bi-list-check" />
                Conversion Results
              </label>
            </div>
            
            <div className="timestamp-results-grid">
              {formatResults.map((result) => (
                <div
                  key={result.label}
                  className={`timestamp-result-card ${copied === result.label ? "copied" : ""}`}
                  onClick={() => copyValue(result.value, result.label)}
                >
                  <div className="timestamp-result-header">
                    <span className="timestamp-result-icon">
                      <i className={`bi ${result.icon}`} />
                    </span>
                    <span className="timestamp-result-label">{result.label}</span>
                    <span className="timestamp-result-copy">
                      <i className={copied === result.label ? "bi bi-check-lg" : "bi bi-clipboard"} />
                    </span>
                  </div>
                  <div className="timestamp-result-value">
                    <code>{result.value}</code>
                  </div>
                </div>
              ))}
            </div>

            <div className="tool-hint">
              <i className="bi bi-lightbulb" />
              Click any result to copy its value
            </div>
          </div>
        )}

        {!output && !error && (
          <div className="tool-empty-state">
            <div className="empty-state-icon">
              <i className="bi bi-clock-history" />
            </div>
            <h3>Enter a Timestamp or Date</h3>
            <p>Convert between Unix timestamps and human-readable date formats</p>
          </div>
        )}
      </div>
    </div>
  );
}
