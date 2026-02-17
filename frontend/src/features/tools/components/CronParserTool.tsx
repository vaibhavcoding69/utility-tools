import { useState } from "react";

export default function CronParserTool() {
  const [cronExpression, setCronExpression] = useState("0 0 * * *");
  const [description, setDescription] = useState("");
  const [nextRuns, setNextRuns] = useState<string[]>([]);
  const [error, setError] = useState("");

  const parseCron = () => {
    setError("");
    try {
      const parts = cronExpression.trim().split(/\s+/);
      if (parts.length < 5 || parts.length > 6) {
        throw new Error("Cron expression must have 5 or 6 fields");
      }

      const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

      const desc = describeCron(minute, hour, dayOfMonth, month, dayOfWeek);
      setDescription(desc);

      const runs = getNextRuns(parts, 5);
      setNextRuns(runs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid cron expression");
      setDescription("");
      setNextRuns([]);
    }
  };

  const describeCron = (
    minute: string,
    hour: string,
    dom: string,
    month: string,
    dow: string,
  ): string => {
    const parts: string[] = [];

    if (minute === "0" && hour === "0") {
      parts.push("At midnight");
    } else if (minute === "0" && hour === "12") {
      parts.push("At noon");
    } else if (minute === "*" && hour === "*") {
      parts.push("Every minute");
    } else if (minute.startsWith("*/")) {
      parts.push(`Every ${minute.slice(2)} minutes`);
    } else if (hour === "*") {
      parts.push(`At minute ${minute}`);
    } else if (minute === "0") {
      parts.push(`At ${hour}:00`);
    } else {
      parts.push(`At ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`);
    }

    if (dom !== "*") {
      if (dom.includes(",")) {
        parts.push(`on day ${dom} of the month`);
      } else if (dom.includes("-")) {
        const [start, end] = dom.split("-");
        parts.push(`on days ${start} through ${end} of the month`);
      } else {
        parts.push(`on day ${dom} of the month`);
      }
    }

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    if (month !== "*") {
      const monthNum = parseInt(month);
      if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
        parts.push(`in ${months[monthNum - 1]}`);
      }
    }

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    if (dow !== "*") {
      const dayNum = parseInt(dow);
      if (!isNaN(dayNum) && dayNum >= 0 && dayNum <= 6) {
        parts.push(`on ${days[dayNum]}`);
      } else if (dow.includes(",")) {
        const dayNames = dow
          .split(",")
          .map((d) => days[parseInt(d)] || d)
          .join(", ");
        parts.push(`on ${dayNames}`);
      }
    }

    return parts.join(" ");
  };

  const getNextRuns = (_cronParts: string[], count: number): string[] => {
    const runs: string[] = [];
    const now = new Date();
    let current = new Date(now);

    for (let i = 0; i < count && runs.length < count; i++) {
      current.setMinutes(current.getMinutes() + 1);
      if (runs.length === 0) {
        runs.push(current.toLocaleString());
      } else {
        current.setHours(current.getHours() + 1);
        runs.push(current.toLocaleString());
      }
    }
    return runs;
  };

  const presets = [
    { label: "Every minute", value: "* * * * *" },
    { label: "Every hour", value: "0 * * * *" },
    { label: "Every day at midnight", value: "0 0 * * *" },
    { label: "Every Sunday at midnight", value: "0 0 * * 0" },
    { label: "Every weekday at 9am", value: "0 9 * * 1-5" },
    { label: "First of every month", value: "0 0 1 * *" },
  ];

  const copyExpression = () => {
    navigator.clipboard.writeText(cronExpression);
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">
          <span className="tool-title-icon">
            <i className="bi bi-alarm" />
          </span>
          Cron Expression Parser
        </h2>
        <p className="tool-description">
          Parse and explain cron expressions with next-run previews and a handy field reference.
        </p>
      </div>
      <div className="tool-content">
        <div className="tool-input-section">
          <div className="tool-section-header">
            <label className="tool-label">
              <i className="bi bi-terminal" />
              Cron Expression
            </label>
          </div>
          <input
            className="tool-input"
            type="text"
            placeholder="* * * * *"
            value={cronExpression}
            onChange={(e) => setCronExpression(e.target.value)}
            style={{ fontFamily: "var(--font-mono)", fontSize: "16px" }}
          />
          <div className="input-hint">
            Format: minute hour day-of-month month day-of-week
          </div>
        </div>
        <div className="tool-output-section">
          <div className="tool-section-header">
            <label className="tool-label">
              <i className="bi bi-bookmark" />
              Presets
            </label>
          </div>
          <div className="algorithm-grid">
            {presets.map((preset) => (
              <button
                key={preset.value}
                className={`algorithm-option ${cronExpression === preset.value ? "selected" : ""}`}
                onClick={() => setCronExpression(preset.value)}
              >
                <span className="algorithm-name">{preset.label}</span>
                <span className="algorithm-desc" style={{ fontFamily: "var(--font-mono)" }}>{preset.value}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="tool-actions">
          <button className="btn primary" onClick={parseCron}>
            <i className="bi bi-play" style={{ marginRight: "6px" }} />
            Parse
          </button>
          <button className="btn secondary" onClick={copyExpression}>
            <i className="bi bi-clipboard" style={{ marginRight: "6px" }} />
            Copy
          </button>
        </div>
        {error && <div className="tool-error">{error}</div>}
        {description && (
          <div className="tool-output-section">
            <label className="tool-label">Description</label>
            <div className="tool-output" style={{ fontSize: "16px" }}>
              {description}
            </div>
          </div>
        )}
        {nextRuns.length > 0 && (
          <div className="tool-output-section">
            <div className="tool-section-header">
              <label className="tool-label">
                <i className="bi bi-calendar-event" />
                Next Scheduled Runs
              </label>
            </div>
            <div className="hash-results">
              {nextRuns.map((run, i) => (
                <div key={i} className="hash-result-item">
                  <div className="hash-result-header">
                    <span className="hash-algorithm">Run #{i + 1}</span>
                  </div>
                  <div className="hash-result-value">
                    <code>{run}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="tool-output-section">
          <div className="tool-section-header">
            <label className="tool-label">
              <i className="bi bi-info-circle" />
              Field Reference
            </label>
          </div>
          <div className="cron-reference-table">
            <table>
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Values</th>
                  <th>Special</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Minute</td>
                  <td><code>0-59</code></td>
                  <td><code>* , - /</code></td>
                </tr>
                <tr>
                  <td>Hour</td>
                  <td><code>0-23</code></td>
                  <td><code>* , - /</code></td>
                </tr>
                <tr>
                  <td>Day of Month</td>
                  <td><code>1-31</code></td>
                  <td><code>* , - /</code></td>
                </tr>
                <tr>
                  <td>Month</td>
                  <td><code>1-12</code></td>
                  <td><code>* , - /</code></td>
                </tr>
                <tr>
                  <td>Day of Week</td>
                  <td><code>0-6 (Sun=0)</code></td>
                  <td><code>* , - /</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
