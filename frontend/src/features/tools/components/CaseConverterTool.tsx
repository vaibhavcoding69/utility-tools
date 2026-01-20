import { useState } from "react";

export default function CaseConverterTool() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Record<string, string>>({});

  const toTitleCase = (str: string): string => {
    return str
      .toLowerCase()
      .replace(/(?:^|\s)\w/g, (match) => match.toUpperCase());
  };

  const toSentenceCase = (str: string): string => {
    return str
      .toLowerCase()
      .replace(/(^\s*\w|[.!?]\s*\w)/g, (match) => match.toUpperCase());
  };

  const toCamelCase = (str: string): string => {
    return str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
      .replace(/^[A-Z]/, (chr) => chr.toLowerCase());
  };

  const toPascalCase = (str: string): string => {
    return str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
      .replace(/^[a-z]/, (chr) => chr.toUpperCase());
  };

  const toSnakeCase = (str: string): string => {
    return str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, "_")
      .replace(/^_|_$/g, "");
  };

  const toKebabCase = (str: string): string => {
    return str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const toConstantCase = (str: string): string => {
    return str
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "_")
      .replace(/^_|_$/g, "");
  };

  const convert = () => {
    if (!input.trim()) {
      setResults({});
      return;
    }

    setResults({
      lowercase: input.toLowerCase(),
      UPPERCASE: input.toUpperCase(),
      "Title Case": toTitleCase(input),
      "Sentence case": toSentenceCase(input),
      camelCase: toCamelCase(input),
      PascalCase: toPascalCase(input),
      snake_case: toSnakeCase(input),
      "kebab-case": toKebabCase(input),
      CONSTANT_CASE: toConstantCase(input),
    });
  };

  const copyValue = (val: string) => {
    navigator.clipboard.writeText(val);
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">Case Converter</h2>
        <p className="tool-description">
          Convert text between different case formats
        </p>
      </div>
      <div className="tool-content">
        <div className="tool-input-section">
          <label className="tool-label">Input Text</label>
          <textarea
            className="tool-textarea"
            placeholder="Enter text to convert..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
          />
        </div>
        <div className="tool-actions">
          <button className="btn primary" onClick={convert}>
            Convert All
          </button>
        </div>
        {Object.keys(results).length > 0 && (
          <div className="tool-output-section">
            <label className="tool-label">Results</label>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {Object.entries(results).map(([label, value]) => (
                <div
                  key={label}
                  onClick={() => copyValue(value)}
                  style={{
                    padding: "12px",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    background: "var(--surface)",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      minWidth: "120px",
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontFamily: "monospace",
                      flex: 1,
                      wordBreak: "break-all",
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <p
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                marginTop: "8px",
              }}
            >
              Click any result to copy
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
