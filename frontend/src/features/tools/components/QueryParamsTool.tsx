import { useState } from "react";

export default function QueryParamsTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const convert = () => {
    try {
      let queryString = input.trim();
      if (queryString.includes("?")) {
        queryString = queryString.split("?")[1];
      }
      const params = new URLSearchParams(queryString);
      const obj: Record<string, string> = {};
      params.forEach((value, key) => {
        obj[key] = value;
      });
      setOutput(JSON.stringify(obj, null, 2));
    } catch {
      setOutput("Invalid query string");
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">
          <span className="tool-title-icon">
            <i className="bi bi-question-circle" />
          </span>
          Query Params to JSON
        </h2>
        <p className="tool-description">
          Parse URL query parameters into a clean JSON object.
        </p>
      </div>
      <div className="tool-content">
        <div className="tool-input-section">
          <div className="tool-section-header">
            <label className="tool-label">
              <i className="bi bi-link-45deg" />
              Query String or URL
            </label>
          </div>
          <input
            className="tool-input"
            type="text"
            placeholder="e.g., ?name=John&age=30 or https://example.com?foo=bar"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="input-hint">
            Paste a full URL or just the query string starting with ?
          </div>
        </div>
        <div className="tool-actions">
          <button className="btn primary" onClick={convert}>
            <i className="bi bi-arrow-repeat" style={{ marginRight: "6px" }} />
            Convert
          </button>
          <button
            className="btn secondary"
            onClick={copyOutput}
            disabled={!output}
          >
            <i className="bi bi-clipboard" style={{ marginRight: "6px" }} />
            Copy
          </button>
        </div>
        <div className="tool-output-section">
          <div className="tool-section-header">
            <label className="tool-label">
              <i className="bi bi-braces" />
              JSON Output
            </label>
          </div>
          <pre className="tool-output">{output || "{\n  \n}"}</pre>
        </div>
      </div>
    </div>
  );
}
