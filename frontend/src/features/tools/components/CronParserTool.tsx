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
        <h2 className="tool-title">Cron Expression Parser</h2>
        <p className="tool-description">
          Parse and understand cron expressions
        </p>
      </div>
      <div className="tool-content">
        <div className="tool-input-section">
          <label className="tool-label">Cron Expression</label>
          <input
            className="tool-input"
            type="text"
            placeholder="* * * * *"
            value={cronExpression}
            onChange={(e) => setCronExpression(e.target.value)}
            style={{ fontFamily: "monospace", fontSize: "16px" }}
          />
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-muted)",
              marginTop: "4px",
            }}
          >
            Format: minute hour day-of-month month day-of-week
          </p>
        </div>
        <div className="tool-output-section">
          <label className="tool-label">Presets</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {presets.map((preset) => (
              <button
                key={preset.value}
                className="btn secondary"
                onClick={() => setCronExpression(preset.value)}
                style={{ fontSize: "12px", padding: "6px 12px" }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
        <div className="tool-actions">
          <button className="btn primary" onClick={parseCron}>
            Parse
          </button>
          <button className="btn secondary" onClick={copyExpression}>
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
            <label className="tool-label">
              Next Scheduled Runs (approximate)
            </label>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              {nextRuns.map((run, i) => (
                <div
                  key={i}
                  style={{
                    padding: "8px 12px",
                    background: "var(--surface)",
                    borderRadius: "4px",
                    fontFamily: "monospace",
                    fontSize: "13px",
                  }}
                >
                  {run}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="tool-output-section">
          <label className="tool-label">Field Reference</label>
          <div style={{ fontSize: "12px", lineHeight: 1.6 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "8px",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    Field
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "8px",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    Values
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "8px",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    Special
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "8px" }}>Minute</td>
                  <td>0-59</td>
                  <td>* , - /</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px" }}>Hour</td>
                  <td>0-23</td>
                  <td>* , - /</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px" }}>Day of Month</td>
                  <td>1-31</td>
                  <td>* , - /</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px" }}>Month</td>
                  <td>1-12</td>
                  <td>* , - /</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px" }}>Day of Week</td>
                  <td>0-6 (Sun=0)</td>
                  <td>* , - /</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
