import { useState } from 'react';
import api from '../../lib/api';

export function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState<any>(null);
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await api.generatePassword({
        length,
        include_uppercase: includeUppercase,
        include_lowercase: includeLowercase,
        include_numbers: includeNumbers,
        include_symbols: includeSymbols,
      });
      if (result.success) {
        setPassword(result.password);
        // Check strength
        checkStrength(result.password);
      }
    } catch (err) {
      console.error('Failed to generate password:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkStrength = async (pwd: string) => {
    try {
      const result = await api.checkPasswordStrength(pwd);
      if (result.success) {
        setStrength(result);
      }
    } catch (err) {
      console.error('Failed to check strength:', err);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">Password Generator</h2>
        <p className="tool-description">Generate secure random passwords</p>
      </div>

      <div className="tool-content">
        <div className="tool-options">
          <div className="tool-option">
            <label className="tool-label">Length: {length}</label>
            <input
              type="range"
              min={8}
              max={64}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="tool-slider"
            />
          </div>

          <div className="tool-option">
            <label className="tool-checkbox-label">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
              />
              Include Uppercase (A-Z)
            </label>
          </div>

          <div className="tool-option">
            <label className="tool-checkbox-label">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
              />
              Include Lowercase (a-z)
            </label>
          </div>

          <div className="tool-option">
            <label className="tool-checkbox-label">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
              />
              Include Numbers (0-9)
            </label>
          </div>

          <div className="tool-option">
            <label className="tool-checkbox-label">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
              />
              Include Symbols (!@#$...)
            </label>
          </div>
        </div>

        <div className="tool-actions">
          <button
            className="btn btn-primary"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Password'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleCopy}
            disabled={!password}
          >
            Copy
          </button>
        </div>

        {password && (
          <div className="tool-output-section">
            <label className="tool-label">Generated Password</label>
            <div className="password-output">
              <code className="password-text">{password}</code>
            </div>
            
            {strength && (
              <div className="password-strength">
                <div className="strength-header">
                  <span className="tool-label">Strength:</span>
                  <span className={`strength-badge strength-${strength.strength}`}>
                    {strength.strength}
                  </span>
                  <span className="strength-score">
                    {strength.score}/{strength.max_score}
                  </span>
                </div>
                {strength.feedback && strength.feedback.length > 0 && (
                  <ul className="strength-feedback">
                    {strength.feedback.map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PasswordGenerator;
