import { useState } from "react";
import api from "../../../lib/api";

export function DiffTool() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [diff, setDiff] = useState<{
    unified_diff: string;
    stats: {
      additions: number;
      deletions: number;
      changes: number;
    };
  } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contextLines, setContextLines] = useState(3);

  const handleDiff = async () => {
    setLoading(true);
    setError("");
    setDiff(null);
    try {
      const result = await api.diffText(original, modified, contextLines);
      if (result.success) {
        setDiff({
          unified_diff: result.unified_diff as string,
          stats: result.stats as {
            additions: number;
            deletions: number;
            changes: number;
          },
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate diff");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (diff) {
      try {
        await navigator.clipboard.writeText(diff.unified_diff);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const handleSwap = () => {
    const temp = original;
    setOriginal(modified);
    setModified(temp);
    setDiff(null);
  };

  const handleClear = () => {
    setOriginal("");
    setModified("");
    setDiff(null);
    setError("");
  };

  const renderDiff = () => {
    if (!diff) return null;

    const lines = diff.unified_diff.split("\n");
    return lines.map((line, index) => {
      let className = "diff-line";
      let icon = "";
      if (line.startsWith("+") && !line.startsWith("+++")) {
        className += " diff-addition";
        icon = "bi-plus";
      } else if (line.startsWith("-") && !line.startsWith("---")) {
        className += " diff-deletion";
        icon = "bi-dash";
      } else if (line.startsWith("@@")) {
        className += " diff-header";
        icon = "bi-three-dots";
      }
      return (
        <div key={index} className={className}>
          {icon && <i className={`bi ${icon} diff-line-icon`} />}
          <span className="diff-line-number">{index + 1}</span>
          <span className="diff-line-content">{line}</span>
        </div>
      );
    });
  };

  const totalLines = {
    original: original.split("\n").filter(l => l.length > 0).length,
    modified: modified.split("\n").filter(l => l.length > 0).length,
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">
          <span className="tool-title-icon">
            <i className="bi bi-file-diff" />
          </span>
          Text Diff Checker
        </h2>
        <p className="tool-description">
          Compare two texts side by side and see exactly what changed with additions, deletions, and modifications highlighted.
        </p>
      </div>

      <div className="tool-content">
        <div className="diff-inputs-grid">
          <div className="diff-input-panel">
            <div className="diff-panel-header">
              <div className="diff-panel-title">
                <i className="bi bi-file-earmark-text" />
                <span>Original Text</span>
              </div>
              <div className="diff-panel-stats">
                <span className="line-count">{totalLines.original} lines</span>
                <span className="char-count">{original.length} chars</span>
              </div>
            </div>
            <textarea
              className="tool-textarea diff-textarea"
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              placeholder="Paste or type the original text here..."
              spellCheck={false}
            />
          </div>

          <div className="diff-swap-button-container">
            <button
              className="diff-swap-button"
              onClick={handleSwap}
              title="Swap original and modified"
              disabled={!original && !modified}
            >
              <i className="bi bi-arrow-left-right" />
            </button>
          </div>

          <div className="diff-input-panel">
            <div className="diff-panel-header">
              <div className="diff-panel-title">
                <i className="bi bi-file-earmark-diff" />
                <span>Modified Text</span>
              </div>
              <div className="diff-panel-stats">
                <span className="line-count">{totalLines.modified} lines</span>
                <span className="char-count">{modified.length} chars</span>
              </div>
            </div>
            <textarea
              className="tool-textarea diff-textarea"
              value={modified}
              onChange={(e) => setModified(e.target.value)}
              placeholder="Paste or type the modified text here..."
              spellCheck={false}
            />
          </div>
        </div>

        <div className="diff-options">
          <div className="diff-option">
            <label className="diff-option-label">
              <i className="bi bi-list-nested" />
              Context Lines
            </label>
            <div className="context-selector">
              {[1, 3, 5, 10].map(num => (
                <button
                  key={num}
                  className={`context-btn ${contextLines === num ? "active" : ""}`}
                  onClick={() => setContextLines(num)}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="tool-actions">
          <button
            className="btn primary"
            onClick={handleDiff}
            disabled={loading || !original || !modified}
            title={loading ? "Processing..." : !original && !modified ? "Enter both texts first" : !original ? "Enter original text first" : !modified ? "Enter modified text first" : undefined}
          >
            {loading ? (
              <>
                <i className="bi bi-hourglass-split" style={{ marginRight: "6px" }} />
                Comparing...
              </>
            ) : (
              <>
                <i className="bi bi-file-diff" style={{ marginRight: "6px" }} />
                Compare Texts
              </>
            )}
          </button>
          <button 
            className="btn secondary" 
            onClick={handleCopy} 
            disabled={!diff}
          >
            <i className={copied ? "bi bi-check-lg" : "bi bi-clipboard"} style={{ marginRight: "6px" }} />
            {copied ? "Copied!" : "Copy Diff"}
          </button>
          <button 
            className="btn ghost" 
            onClick={handleClear}
            disabled={!original && !modified && !diff}
          >
            <i className="bi bi-x-lg" style={{ marginRight: "6px" }} />
            Clear All
          </button>
        </div>

        {error && (
          <div className="tool-error">
            <i className="bi bi-exclamation-triangle" style={{ marginRight: "8px" }} />
            {error}
          </div>
        )}

        {diff && (
          <div className="tool-output-section">
            <div className="tool-section-header">
              <label className="tool-label">
                <i className="bi bi-code-square" />
                Unified Diff Output
              </label>
            </div>

            <div className="diff-stats-grid">
              <div className="diff-stat-card additions">
                <div className="diff-stat-icon">
                  <i className="bi bi-plus-circle" />
                </div>
                <div className="diff-stat-content">
                  <span className="diff-stat-value">+{diff.stats.additions}</span>
                  <span className="diff-stat-label">Additions</span>
                </div>
              </div>
              <div className="diff-stat-card deletions">
                <div className="diff-stat-icon">
                  <i className="bi bi-dash-circle" />
                </div>
                <div className="diff-stat-content">
                  <span className="diff-stat-value">-{diff.stats.deletions}</span>
                  <span className="diff-stat-label">Deletions</span>
                </div>
              </div>
              <div className="diff-stat-card changes">
                <div className="diff-stat-icon">
                  <i className="bi bi-arrow-left-right" />
                </div>
                <div className="diff-stat-content">
                  <span className="diff-stat-value">{diff.stats.changes}</span>
                  <span className="diff-stat-label">Changes</span>
                </div>
              </div>
            </div>

            <div className="diff-output-container">
              <div className="diff-output">
                {renderDiff()}
              </div>
            </div>
          </div>
        )}

        {!diff && !error && (!original || !modified) && (
          <div className="tool-empty-state">
            <div className="empty-state-icon">
              <i className="bi bi-file-diff" />
            </div>
            <h3>Ready to Compare</h3>
            <p>Enter text in both panels above and click "Compare Texts" to see the differences</p>
          </div>
        )}

        <div className="tool-info-card">
          <div className="info-card-header">
            <i className="bi bi-info-circle" />
            <span>About Text Diff</span>
          </div>
          <div className="info-card-content">
            <p>This tool uses unified diff format, the same format used by Git and other version control systems. Lines starting with <code>+</code> are additions, lines with <code>-</code> are deletions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiffTool;
