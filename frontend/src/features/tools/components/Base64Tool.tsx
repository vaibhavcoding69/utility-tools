import { useState } from 'react'
import api from '../../../lib/api'

export function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEncode = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await api.encodeBase64(input);
      if (result.success) {
        setOutput(result.encoded);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to encode');
    } finally {
      setLoading(false);
    }
  };

  const handleDecode = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await api.decodeBase64(input);
      if (result.success) {
        setOutput(result.decoded);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to decode');
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
        <h2 className="tool-title">Base64 Encoder/Decoder</h2>
        <p className="tool-description">Encode and decode Base64 strings</p>
      </div>

      <div className="tool-content">
        <div className="tool-input-section">
          <label className="tool-label">Input</label>
          <textarea
            className="tool-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to encode or Base64 to decode"
            rows={6}
          />
        </div>

        <div className="tool-actions">
          <button
            className="btn primary"
            onClick={handleEncode}
            disabled={loading || !input}
          >
            {loading ? 'Processing...' : 'Encode'}
          </button>
          <button
            className="btn ghost"
            onClick={handleDecode}
            disabled={loading || !input}
          >
            Decode
          </button>
          <button
            className="btn ghost"
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
            <textarea
              className="tool-textarea"
              value={output}
              readOnly
              rows={6}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Base64Tool;
