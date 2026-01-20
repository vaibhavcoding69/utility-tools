import { useState } from "react";

const LOREM_WORDS = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "sed",
  "do",
  "eiusmod",
  "tempor",
  "incididunt",
  "ut",
  "labore",
  "et",
  "dolore",
  "magna",
  "aliqua",
  "enim",
  "ad",
  "minim",
  "veniam",
  "quis",
  "nostrud",
  "exercitation",
  "ullamco",
  "laboris",
  "nisi",
  "aliquip",
  "ex",
  "ea",
  "commodo",
  "consequat",
  "duis",
  "aute",
  "irure",
  "in",
  "reprehenderit",
  "voluptate",
  "velit",
  "esse",
  "cillum",
  "fugiat",
  "nulla",
  "pariatur",
  "excepteur",
  "sint",
  "occaecat",
  "cupidatat",
  "non",
  "proident",
  "sunt",
  "culpa",
  "qui",
  "officia",
  "deserunt",
  "mollit",
  "anim",
  "id",
  "est",
  "laborum",
];

type UnitType = "words" | "sentences" | "paragraphs";

export default function LoremTool() {
  const [count, setCount] = useState(5);
  const [unit, setUnit] = useState<UnitType>("paragraphs");
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState("");

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
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">Lorem Ipsum Generator</h2>
        <p className="tool-description">
          Generate placeholder text for your designs
        </p>
      </div>
      <div className="tool-content">
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            alignItems: "flex-end",
          }}
        >
          <div style={{ flex: 1, minWidth: "100px" }}>
            <label className="tool-label">Count</label>
            <input
              className="tool-input"
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            />
          </div>
          <div style={{ flex: 1, minWidth: "150px" }}>
            <label className="tool-label">Unit</label>
            <select
              className="tool-select"
              value={unit}
              onChange={(e) => setUnit(e.target.value as UnitType)}
            >
              <option value="words">Words</option>
              <option value="sentences">Sentences</option>
              <option value="paragraphs">Paragraphs</option>
            </select>
          </div>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              marginBottom: "8px",
            }}
          >
            <input
              type="checkbox"
              checked={startWithLorem}
              onChange={(e) => setStartWithLorem(e.target.checked)}
            />
            <span>Start with "Lorem ipsum"</span>
          </label>
        </div>
        <div className="tool-actions">
          <button className="btn primary" onClick={generate}>
            Generate
          </button>
          <button
            className="btn secondary"
            onClick={copyOutput}
            disabled={!output}
          >
            Copy
          </button>
        </div>
        <div className="tool-output-section">
          <label className="tool-label">Generated Text</label>
          <textarea
            className="tool-textarea"
            value={output}
            readOnly
            rows={10}
            placeholder="Click Generate to create Lorem Ipsum text..."
          />
        </div>
      </div>
    </div>
  );
}
