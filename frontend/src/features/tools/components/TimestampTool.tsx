import { useState } from "react";

export default function TimestampTool() {
  const [timestamp, setTimestamp] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [mode, setMode] = useState<"to-date" | "to-timestamp">("to-date");
  const [output, setOutput] = useState("");

  const convert = () => {
    if (mode === "to-date") {
      const ts = parseInt(timestamp, 10);
      if (isNaN(ts)) {
        setOutput("Invalid timestamp");
        return;
      }
      const date = new Date(ts * 1000);
      setOutput(
        `UTC: ${date.toUTCString()}\nLocal: ${date.toLocaleString()}\nISO: ${date.toISOString()}`,
      );
    } else {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        setOutput("Invalid date");
        return;
      }
      setOutput(
        `Timestamp (seconds): ${Math.floor(date.getTime() / 1000)}\nTimestamp (ms): ${date.getTime()}`,
      );
    }
  };

  const now = () => {
    const date = new Date();
    setOutput(
      `Current timestamp: ${Math.floor(date.getTime() / 1000)}\nCurrent date: ${date.toISOString()}`,
    );
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">Timestamp Converter</h2>
        <p className="tool-description">
          Convert between Unix timestamps and human-readable dates
        </p>
      </div>
      <div className="tool-content">
        <div className="tool-options">
          <div className="tool-option">
            <label className="tool-label">Mode</label>
            <select
              className="tool-select"
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
            >
              <option value="to-date">Timestamp → Date</option>
              <option value="to-timestamp">Date → Timestamp</option>
            </select>
          </div>
        </div>
        <div className="tool-input-section">
          <label className="tool-label">
            {mode === "to-date" ? "Unix Timestamp" : "Date String"}
          </label>
          {mode === "to-date" ? (
            <input
              className="tool-input"
              type="text"
              placeholder="e.g., 1700000000"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
            />
          ) : (
            <input
              className="tool-input"
              type="text"
              placeholder="e.g., 2024-01-15 or Jan 15, 2024"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
            />
          )}
        </div>
        <div className="tool-actions">
          <button className="btn primary" onClick={convert}>
            Convert
          </button>
          <button className="btn secondary" onClick={now}>
            Now
          </button>
        </div>
        <div className="tool-output-section">
          <label className="tool-label">Result</label>
          <pre className="tool-output">
            {output || "Result will appear here"}
          </pre>
        </div>
      </div>
    </div>
  );
}
