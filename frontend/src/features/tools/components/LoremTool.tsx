import { useState } from "react";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum"
];

type UnitType = "words" | "sentences" | "paragraphs";

export default function LoremTool() {
  const [count, setCount] = useState(5);
  const [unit, setUnit] = useState<UnitType>("paragraphs");
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ words: 0, chars: 0, paragraphs: 0 });

  const generateWords = (n: number, first = false): string => {
    const words: string[] = [];
    for (let i = 0; i < n; i++) {
      if (first && startWithLorem && i < 2) {
        words.push(i === 0 ? "Lorem" : "ipsum");
      } else {
        words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
      }
    }
    return words.join(" ");
  };

  const generateSentence = (first = false): string => {
    const wordCount = Math.floor(Math.random() * 10) + 8;
    const sentence = generateWords(wordCount, first);
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
  };

  const generateParagraph = (first = false): string => {
    const sentenceCount = Math.floor(Math.random() * 4) + 4;
    const sentences: string[] = [];
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence(first && i === 0));
    }
    return sentences.join(" ");
  };

  const generate = () => {
    let result = "";

    if (unit === "words") {
      result = generateWords(count, true);
    } else if (unit === "sentences") {
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        sentences.push(generateSentence(i === 0));
      }
      result = sentences.join(" ");
    } else {
      const paragraphs: string[] = [];
      for (let i = 0; i < count; i++) {
        paragraphs.push(generateParagraph(i === 0));
      }
      result = paragraphs.join("\n\n");
    }

    setOutput(result);
    
    const wordCount = result.split(/\s+/).filter(w => w.length > 0).length;
    const charCount = result.length;
    const paragraphCount = result.split(/\n\n+/).filter(p => p.trim().length > 0).length;
    setStats({ words: wordCount, chars: charCount, paragraphs: paragraphCount });
  };

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleClear = () => {
    setOutput("");
    setStats({ words: 0, chars: 0, paragraphs: 0 });
  };

  const unitOptions = [
    { value: "words", label: "Words", icon: "bi-type" },
    { value: "sentences", label: "Sentences", icon: "bi-text-left" },
    { value: "paragraphs", label: "Paragraphs", icon: "bi-text-paragraph" },
  ];

  const presets = [
    { label: "Short", count: 1, unit: "paragraphs" as UnitType },
    { label: "Medium", count: 3, unit: "paragraphs" as UnitType },
    { label: "Long", count: 5, unit: "paragraphs" as UnitType },
    { label: "50 Words", count: 50, unit: "words" as UnitType },
    { label: "100 Words", count: 100, unit: "words" as UnitType },
  ];

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">
          <span className="tool-title-icon">
            <i className="bi bi-text-paragraph" />
          </span>
          Lorem Ipsum Generator
        </h2>
        <p className="tool-description">
          Generate placeholder text for your designs, mockups, and prototypes.
        </p>
      </div>

      <div className="tool-content">
        <div className="tool-presets">
          <span className="presets-label">
            <i className="bi bi-lightning" />
            Quick Presets
          </span>
          <div className="presets-buttons">
            {presets.map((preset) => (
              <button
                key={preset.label}
                className="preset-btn"
                onClick={() => {
                  setCount(preset.count);
                  setUnit(preset.unit);
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="lorem-options-grid">
          <div className="option-card">
            <div className="option-header">
              <i className="bi bi-hash" />
              <span>Count</span>
            </div>
            <div className="option-content">
              <input
                className="tool-input"
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value))))}
              />
              <input
                type="range"
                min="1"
                max="50"
                value={count > 50 ? 50 : count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="option-slider"
              />
            </div>
          </div>

          <div className="option-card">
            <div className="option-header">
              <i className="bi bi-rulers" />
              <span>Unit Type</span>
            </div>
            <div className="option-content">
              <div className="unit-selector">
                {unitOptions.map((opt) => (
                  <button
                    key={opt.value}
                    className={`unit-option ${unit === opt.value ? "active" : ""}`}
                    onClick={() => setUnit(opt.value as UnitType)}
                  >
                    <i className={`bi ${opt.icon}`} />
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="option-card">
            <div className="option-header">
              <i className="bi bi-gear" />
              <span>Options</span>
            </div>
            <div className="option-content">
              <label className="modern-checkbox">
                <input
                  type="checkbox"
                  checked={startWithLorem}
                  onChange={(e) => setStartWithLorem(e.target.checked)}
                />
                <span className="checkbox-visual">
                  <i className="bi bi-check" />
                </span>
                <span className="checkbox-label">Start with "Lorem ipsum"</span>
              </label>
            </div>
          </div>
        </div>

        <div className="tool-actions">
          <button className="btn primary" onClick={generate}>
            <i className="bi bi-magic" style={{ marginRight: "6px" }} />
            Generate Lorem Ipsum
          </button>
          {output && (
            <>
              <button className="btn secondary" onClick={copyOutput}>
                <i className={copied ? "bi bi-check-lg" : "bi bi-clipboard"} style={{ marginRight: "6px" }} />
                {copied ? "Copied!" : "Copy Text"}
              </button>
              <button className="btn ghost" onClick={handleClear}>
                <i className="bi bi-x-lg" style={{ marginRight: "6px" }} />
                Clear
              </button>
            </>
          )}
        </div>

        {output ? (
          <div className="tool-output-section">
            <div className="tool-section-header">
              <label className="tool-label">
                <i className="bi bi-file-text" />
                Generated Text
              </label>
              <div className="output-stats">
                <span className="output-stat">
                  <i className="bi bi-type" />
                  {stats.words} words
                </span>
                <span className="output-stat">
                  <i className="bi bi-text-paragraph" />
                  {stats.paragraphs} paragraphs
                </span>
                <span className="output-stat">
                  <i className="bi bi-keyboard" />
                  {stats.chars} chars
                </span>
              </div>
            </div>
            <div className="lorem-output">
              <div className="lorem-output-text">{output}</div>
            </div>
          </div>
        ) : (
          <div className="tool-empty-state">
            <div className="empty-state-icon">
              <i className="bi bi-text-paragraph" />
            </div>
            <h3>Ready to Generate</h3>
            <p>Configure your options above and click "Generate Lorem Ipsum" to create placeholder text</p>
          </div>
        )}

        <div className="tool-info-card">
          <div className="info-card-header">
            <i className="bi bi-info-circle" />
            <span>About Lorem Ipsum</span>
          </div>
          <div className="info-card-content">
            <p>Lorem Ipsum has been the industry's standard dummy text since the 1500s. It helps designers and developers focus on visual design without being distracted by meaningful content.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
