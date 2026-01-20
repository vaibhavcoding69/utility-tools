import { useState } from "react";

const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  " ": "&nbsp;",
  "©": "&copy;",
  "®": "&reg;",
  "™": "&trade;",
  "€": "&euro;",
  "£": "&pound;",
  "¥": "&yen;",
  "¢": "&cent;",
  "§": "&sect;",
  "°": "&deg;",
  "±": "&plusmn;",
  "×": "&times;",
  "÷": "&divide;",
  "∞": "&infin;",
  "≠": "&ne;",
  "≤": "&le;",
  "≥": "&ge;",
  "←": "&larr;",
  "→": "&rarr;",
  "↑": "&uarr;",
  "↓": "&darr;",
  "•": "&bull;",
  "…": "&hellip;",
  "—": "&mdash;",
  "–": "&ndash;",
};

const REVERSE_ENTITIES: Record<string, string> = Object.fromEntries(
  Object.entries(HTML_ENTITIES).map(([k, v]) => [v, k]),
);

export default function HtmlEntitiesTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const encode = (str: string): string => {
    let result = str;
    for (const [char, entity] of Object.entries(HTML_ENTITIES)) {
      if (char !== " ") {
        // Don't replace regular spaces by default
        result = result.split(char).join(entity);
      }
    }
    return result;
  };

  const decode = (str: string): string => {
    let result = str;
    // Decode named entities
    for (const [entity, char] of Object.entries(REVERSE_ENTITIES)) {
      result = result.split(entity).join(char);
    }
    // Decode numeric entities
    result = result.replace(/&#(\d+);/g, (_, code) =>
      String.fromCharCode(parseInt(code, 10)),
    );
    result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, code) =>
      String.fromCharCode(parseInt(code, 16)),
    );
    return result;
  };

  const convert = () => {
    if (mode === "encode") {
      setOutput(encode(input));
    } else {
      setOutput(decode(input));
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">HTML Entities Encoder/Decoder</h2>
        <p className="tool-description">
          Encode or decode HTML entities in text
        </p>
      </div>
      <div className="tool-content">
        <div className="tool-tabs">
          <button
            className={`tool-tab ${mode === "encode" ? "active" : ""}`}
            onClick={() => setMode("encode")}
          >
            Encode
          </button>
          <button
            className={`tool-tab ${mode === "decode" ? "active" : ""}`}
            onClick={() => setMode("decode")}
          >
            Decode
          </button>
        </div>
        <div className="tool-input-section">
          <label className="tool-label">
            {mode === "encode" ? "Text to Encode" : "Text to Decode"}
          </label>
          <textarea
            className="tool-textarea"
            placeholder={
              mode === "encode"
                ? "<div>Hello & World</div>"
                : "&lt;div&gt;Hello &amp; World&lt;/div&gt;"
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
          />
        </div>
        <div className="tool-actions">
          <button className="btn primary" onClick={convert}>
            {mode === "encode" ? "Encode" : "Decode"}
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
          <label className="tool-label">Result</label>
          <textarea
            className="tool-textarea"
            value={output}
            readOnly
            rows={6}
            placeholder="Output will appear here..."
          />
        </div>
        <div className="tool-output-section">
          <label className="tool-label">Common HTML Entities</label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              gap: "8px",
              fontSize: "12px",
            }}
          >
            {Object.entries(HTML_ENTITIES)
              .slice(0, 16)
              .map(([char, entity]) => (
                <div
                  key={entity}
                  style={{
                    padding: "8px",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    background: "var(--surface)",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{char === " " ? "(space)" : char}</span>
                  <code style={{ color: "var(--text-muted)" }}>{entity}</code>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
