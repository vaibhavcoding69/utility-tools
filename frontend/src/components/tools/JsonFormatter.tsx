import { useState } from 'react';
import api from '../../lib/api';

export function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indent, setIndent] = useState(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFormat = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await api.formatJson(input, indent, sortKeys);
      if (result.success && result.valid) {
        setOutput(result.formatted);
      } else {
        setError(result.error || 'Invalid JSON');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to format JSON');
    } finally {
      setLoading(false);
    }
  };

  const handleMinify = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await api.minifyJson(input);
      if (result.success && result.valid) {
        setOutput(result.minified);
      } else {
        setError(result.error || 'Invalid JSON');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to minify JSON');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">JSON Formatter</h2>
        <p className="tool-description">Format and validate JSON data</p>
      </div>

      <div className="tool-content">
        <div className="tool-input-section">
          <label className="tool-label">Input JSON</label>
          <textarea
            className="tool-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            rows={10}
          />
        </div>

        <div className="tool-options">
          <div className="tool-option">
            <label className="tool-label">Indent</label>
            <input
              type="number"
              className="tool-input-small"
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              min={0}
              max={8}
            />
          </div>
          <div className="tool-option">
            <label className="tool-checkbox-label">
              <input
                type="checkbox"
                checked={sortKeys}
                onChange={(e) => setSortKeys(e.target.checked)}
              />
              Sort keys
            </label>
          </div>
        </div>

        <div className="tool-actions">
          <button
            className="btn btn-primary"
            onClick={handleFormat}
            disabled={loading || !input}
          >
            {loading ? 'Processing...' : 'Format'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleMinify}
            disabled={loading || !input}
          >
            Minify
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleCopy}
            disabled={!output}
          >
            Copy
          </button>
        </div>

        {error && (
          <div className="tool-error">
            {error}
          </div>
        )}

        {output && (
          <div className="tool-output-section">
            <label className="tool-label">Output</label>
            <pre className="tool-output">
              <code>{output}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default JsonFormatter;
