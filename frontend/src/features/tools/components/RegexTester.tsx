import { useState } from "react";
import api from "../../../lib/api";

export function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [text, setText] = useState("");
  const [flags, setFlags] = useState("");
  const [result, setResult] = useState<{
    matches: boolean;
    match_count: number;
    groups: string[];
    positions: Array<{ start: number; end: number; match: string }>;
  } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await api.testRegex(pattern, text, flags);
      if (res.success) {
        setResult({
          matches: res.matches as boolean,
          match_count: res.match_count as number,
          groups: res.groups as string[],
          positions: res.positions as Array<{
            start: number;
            end: number;
            match: string;
          }>,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to test regex");
    } finally {
      setLoading(false);
    }
  };

  const highlightMatches = () => {
    if (!result || !result.positions || result.positions.length === 0) {
      return text;
    }

    let highlighted = "";
    let lastIndex = 0;

    result.positions.forEach((pos) => {
      highlighted += text.slice(lastIndex, pos.start);
      highlighted += `<mark>${text.slice(pos.start, pos.end)}</mark>`;
      lastIndex = pos.end;
    });

    highlighted += text.slice(lastIndex);
    return highlighted;
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">Regex Tester</h2>
        <p className="tool-description">
          Test regular expressions with live highlighting
        </p>
      </div>

      <div className="tool-content">
        <div className="tool-input-section">
          <label className="tool-label">Pattern</label>
          <input
            type="text"
            className="tool-input"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter regex pattern (e.g., \d+)"
          />
        </div>

        <div className="tool-input-section">
          <label className="tool-label">Flags</label>
          <div className="regex-flags">
            {["g", "i", "m", "s"].map((flag) => (
              <label key={flag} className="tool-checkbox-label">
                <input
                  type="checkbox"
                  checked={flags.includes(flag)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFlags(flags + flag);
                    } else {
                      setFlags(flags.replace(flag, ""));
                    }
                  }}
                />
                {flag} (
                {flag === "g"
                  ? "global"
                  : flag === "i"
                    ? "case-insensitive"
                    : flag === "m"
                      ? "multiline"
                      : "dotall"}
                )
              </label>
            ))}
          </div>
        </div>

        <div className="tool-input-section">
          <label className="tool-label">Test String</label>
          <textarea
            className="tool-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to test against"
            rows={6}
          />
        </div>

        <div className="tool-actions">
          <button
            className="btn primary"
            onClick={handleTest}
            disabled={loading || !pattern || !text}
            title={loading ? "Processing..." : !pattern && !text ? "Enter pattern and text first" : !pattern ? "Enter a regex pattern first" : !text ? "Enter test text first" : undefined}
          >
            {loading ? "Testing..." : "Test Pattern"}
          </button>
        </div>

        {error && <div className="tool-error">{error}</div>}

        {result && (
          <div className="tool-output-section">
            <div
              className={`regex-status ${result.matches ? "match" : "no-match"}`}
            >
              {result.matches
                ? <><i className="bi bi-check-circle" /> {result.match_count} match(es) found</>
                : <><i className="bi bi-x-circle" /> No matches</>}
            </div>

            {result.matches &&
              result.positions &&
              result.positions.length > 0 && (
                <>
                  <label className="tool-label">Highlighted Matches</label>
                  <div
                    className="regex-highlighted"
                    dangerouslySetInnerHTML={{ __html: highlightMatches() }}
                  />

                  <label className="tool-label">Match Details</label>
                  <div className="regex-matches">
                    {result.positions.map((pos, index) => (
                      <div key={index} className="regex-match-item">
                        <span className="match-index">#{index + 1}</span>
                        <code className="match-text">{pos.match}</code>
                        <span className="match-position">
                          pos {pos.start}-{pos.end}
                        </span>
                      </div>
                    ))}
                  </div>

                  {result.groups && result.groups.length > 0 && (
                    <>
                      <label className="tool-label">Capture Groups</label>
                      <div className="regex-groups">
                        {result.groups.map((group, index) => (
                          <div key={index} className="regex-group-item">
                            <span className="group-index">Group {index}</span>
                            <code>{group}</code>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
          </div>
        )}
      </div>
    </div>
  );
}

export default RegexTester;
