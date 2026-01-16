import { useState } from 'react'
import api from '../../../lib/api'

export function UrlEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEncode = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await api.encodeUrl(input);
      if (result.success) {
        setOutput(result.encoded as string);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to encode URL');
    } finally {
      setLoading(false);
    }
  };

  const handleDecode = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await api.decodeUrl(input);
      if (result.success) {
        setOutput(result.decoded as string);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to decode URL');
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
        <h2 className="tool-title">URL Encoder/Decoder</h2>
        <p className="tool-description">Encode and decode URL strings</p>
      </div>

      <div className="tool-content">
        <div className="tool-input-section">
          <label className="tool-label">Input</label>
          <textarea
            className="tool-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter URL or text to encode/decode"
            rows={4}
          />
        </div>

        <div className="tool-actions">
          <button
            className="btn primary"
            onClick={handleEncode}
            disabled={loading || !input}
          >
            Encode
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
          <div className="tool-error">{error}</div>
        )}

        {output && (
          <div className="tool-output-section">
            <label className="tool-label">Output</label>
            <textarea
              className="tool-textarea"
              value={output}
              readOnly
              rows={4}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default UrlEncoder;
