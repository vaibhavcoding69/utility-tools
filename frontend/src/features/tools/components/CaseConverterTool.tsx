import { useState } from "react";

interface CaseResult {
  name: string;
  value: string;
  icon: string;
  description: string;
}

export default function CaseConverterTool() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<CaseResult[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

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

  const toDotCase = (str: string): string => {
    return str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, ".")
      .replace(/^\.|\.$/g, "");
  };

  const toPathCase = (str: string): string => {
    return str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, "/")
      .replace(/^\/|\/$/g, "");
  };

  const convert = () => {
    if (!input.trim()) {
      setResults([]);
      return;
    }

    setResults([
      { name: "lowercase", value: input.toLowerCase(), icon: "bi-type", description: "All characters in lowercase" },
      { name: "UPPERCASE", value: input.toUpperCase(), icon: "bi-fonts", description: "All characters in uppercase" },
      { name: "Title Case", value: toTitleCase(input), icon: "bi-card-heading", description: "First letter of each word capitalized" },
      { name: "Sentence case", value: toSentenceCase(input), icon: "bi-text-paragraph", description: "First letter of sentences capitalized" },
      { name: "camelCase", value: toCamelCase(input), icon: "bi-code", description: "Used in JavaScript variables" },
      { name: "PascalCase", value: toPascalCase(input), icon: "bi-code-square", description: "Used in class names" },
      { name: "snake_case", value: toSnakeCase(input), icon: "bi-file-code", description: "Used in Python variables" },
      { name: "kebab-case", value: toKebabCase(input), icon: "bi-dash-lg", description: "Used in URLs and CSS" },
      { name: "CONSTANT_CASE", value: toConstantCase(input), icon: "bi-shield-lock", description: "Used for constants" },
      { name: "dot.case", value: toDotCase(input), icon: "bi-three-dots", description: "Used in file extensions" },
      { name: "path/case", value: toPathCase(input), icon: "bi-folder", description: "Used in file paths" },
    ]);
  };

  const copyValue = async (val: string, index: number) => {
    try {
      await navigator.clipboard.writeText(val);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const copyAll = async () => {
    const allText = results.map(r => `${r.name}: ${r.value}`).join('\n');
    try {
      await navigator.clipboard.writeText(allText);
      setCopiedIndex(-1);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleClear = () => {
    setInput("");
    setResults([]);
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">
          <span className="tool-title-icon">
            <i className="bi bi-type" />
          </span>
          Case Converter
        </h2>
        <p className="tool-description">
          Convert text between different case formats including camelCase, snake_case, kebab-case, and more.
        </p>
      </div>

      <div className="tool-content">
        <div className="tool-input-section">
          <div className="tool-section-header">
            <label className="tool-label">
              <i className="bi bi-input-cursor-text" />
              Input Text
            </label>
            <span className="char-count">{input.length} characters</span>
          </div>
          <textarea
            className="tool-textarea"
            placeholder="Enter text to convert between different cases..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            spellCheck={false}
          />
        </div>

        <div className="tool-actions">
          <button 
            className="btn primary" 
            onClick={convert}
            disabled={!input.trim()}
          >
            <i className="bi bi-arrow-repeat" style={{ marginRight: "6px" }} />
            Convert All
          </button>
          {results.length > 0 && (
            <button 
              className="btn secondary" 
              onClick={copyAll}
            >
              <i className={copiedIndex === -1 ? "bi bi-check-lg" : "bi bi-clipboard"} style={{ marginRight: "6px" }} />
              {copiedIndex === -1 ? "Copied!" : "Copy All"}
            </button>
          )}
          <button 
            className="btn ghost" 
            onClick={handleClear}
            disabled={!input && results.length === 0}
          >
            <i className="bi bi-x-lg" style={{ marginRight: "6px" }} />
            Clear
          </button>
        </div>

        {results.length > 0 && (
          <div className="tool-output-section">
            <div className="tool-section-header">
              <label className="tool-label">
                <i className="bi bi-list-check" />
                Converted Results
              </label>
              <span className="result-count">{results.length} formats</span>
            </div>
            
            <div className="case-results-grid">
              {results.map((result, index) => (
                <div
                  key={result.name}
                  className={`case-result-card ${copiedIndex === index ? "copied" : ""}`}
                  onClick={() => copyValue(result.value, index)}
                  title={`${result.description} • Click to copy`}
                >
                  <div className="case-result-header">
                    <span className="case-result-icon">
                      <i className={`bi ${result.icon}`} />
                    </span>
                    <span className="case-result-name">{result.name}</span>
                    <span className="case-result-copy">
                      <i className={copiedIndex === index ? "bi bi-check-lg" : "bi bi-clipboard"} />
                    </span>
                  </div>
                  <div className="case-result-value">
                    <code>{result.value}</code>
                  </div>
                  <div className="case-result-description">
                    {result.description}
                  </div>
                </div>
              ))}
            </div>

            <div className="tool-hint">
              <i className="bi bi-lightbulb" />
              Click any card to copy its value
            </div>
          </div>
        )}

        {!input && results.length === 0 && (
          <div className="tool-empty-state">
            <div className="empty-state-icon">
              <i className="bi bi-fonts" />
            </div>
            <h3>Enter Text to Convert</h3>
            <p>Type or paste text above to see it converted to different case formats</p>
          </div>
        )}
      </div>
    </div>
  );
}
