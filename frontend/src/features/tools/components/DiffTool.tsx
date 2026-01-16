import { useState } from 'react'
import api from '../../../lib/api'

export function DiffTool() {
  const [original, setOriginal] = useState('');
  const [modified, setModified] = useState('');
  const [diff, setDiff] = useState<{
    unified_diff: string;
    stats: {
      additions: number;
      deletions: number;
      changes: number;
    };
  } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDiff = async () => {
    setLoading(true);
    setError('');
    setDiff(null);
    try {
      const result = await api.diffText(original, modified, 3);
      if (result.success) {
        setDiff({
          unified_diff: result.unified_diff as string,
          stats: result.stats as { additions: number; deletions: number; changes: number },
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate diff');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (diff) {
      try {
        await navigator.clipboard.writeText(diff.unified_diff);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const renderDiff = () => {
    if (!diff) return null;

    const lines = diff.unified_diff.split('\n');
    return lines.map((line, index) => {
      let className = 'diff-line';
      if (line.startsWith('+') && !line.startsWith('+++')) {
        className += ' diff-addition';
      } else if (line.startsWith('-') && !line.startsWith('---')) {
        className += ' diff-deletion';
      } else if (line.startsWith('@@')) {
        className += ' diff-header';
      }
      return (
        <div key={index} className={className}>
          {line}
        </div>
      );
    });
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">Text Diff</h2>
        <p className="tool-description">Compare two texts and see the differences</p>
      </div>

      <div className="tool-content">
        <div className="diff-inputs">
          <div className="tool-input-section">
            <label className="tool-label">Original</label>
            <textarea
              className="tool-textarea"
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              placeholder="Enter original text"
              rows={8}
            />
          </div>

          <div className="tool-input-section">
            <label className="tool-label">Modified</label>
            <textarea
              className="tool-textarea"
              value={modified}
              onChange={(e) => setModified(e.target.value)}
              placeholder="Enter modified text"
              rows={8}
            />
          </div>
        </div>

        <div className="tool-actions">
          <button
            className="btn primary"
            onClick={handleDiff}
            disabled={loading || !original || !modified}
          >
            {loading ? 'Comparing...' : 'Compare'}
          </button>
          <button
            className="btn ghost"
            onClick={handleCopy}
            disabled={!diff}
          >
            Copy Diff
          </button>
        </div>

        {error && (
          <div className="tool-error">{error}</div>
        )}

        {diff && (
          <div className="tool-output-section">
            <div className="diff-stats">
              <span className="stat-item additions">+{diff.stats.additions} additions</span>
              <span className="stat-item deletions">-{diff.stats.deletions} deletions</span>
            </div>

            <label className="tool-label">Unified Diff</label>
            <div className="diff-output">
              <pre>{renderDiff()}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DiffTool;
