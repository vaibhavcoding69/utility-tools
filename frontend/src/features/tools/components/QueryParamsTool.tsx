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
        <h2 className="tool-title">Query Params to JSON</h2>
        <p className="tool-description">
          Parse URL query parameters into a JSON object
        </p>
      </div>
      <div className="tool-content">
        <div className="tool-input-section">
          <label className="tool-label">Query String or URL</label>
          <input
            className="tool-input"
            type="text"
            placeholder="e.g., ?name=John&age=30 or https://example.com?foo=bar"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="tool-actions">
          <button className="btn primary" onClick={convert}>
            Convert
          </button>
          <button
            className="btn secondary"
            onClick={copyOutput}
            disabled={!output}
          >
            Copy
          </button>
        </div>
        <div className="tool-output-section">
          <label className="tool-label">JSON Output</label>
          <pre className="tool-output">{output || "{\n  \n}"}</pre>
        </div>
      </div>
    </div>
  );
}
