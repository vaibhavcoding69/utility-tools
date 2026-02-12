import { useState } from "react";

export default function MarkdownTool() {
  const [markdown, setMarkdown] = useState("");
  const [html, setHtml] = useState("");

  const convertToHtml = () => {
    let result = markdown;

    result = result.replace(/^###### (.*$)/gm, "<h6>$1</h6>");
    result = result.replace(/^##### (.*$)/gm, "<h5>$1</h5>");
    result = result.replace(/^#### (.*$)/gm, "<h4>$1</h4>");
    result = result.replace(/^### (.*$)/gm, "<h3>$1</h3>");
    result = result.replace(/^## (.*$)/gm, "<h2>$1</h2>");
    result = result.replace(/^# (.*$)/gm, "<h1>$1</h1>");

    result = result.replace(
      /\*\*\*(.*?)\*\*\*/g,
      "<strong><em>$1</em></strong>",
    );
    result = result.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    result = result.replace(/\*(.*?)\*/g, "<em>$1</em>");
    result = result.replace(/__(.*?)__/g, "<strong>$1</strong>");
    result = result.replace(/_(.*?)_/g, "<em>$1</em>");

    result = result.replace(
      /```(\w*)\n([\s\S]*?)```/g,
      '<pre><code class="language-$1">$2</code></pre>',
    );
    result = result.replace(/`([^`]+)`/g, "<code>$1</code>");

    result = result.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">');
    result = result.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

    result = result.replace(/^\s*[-*+]\s+(.*$)/gm, "<li>$1</li>");
    result = result.replace(/(<li>.*<\/li>)\n(<li>)/g, "$1$2");
    result = result.replace(/(<li>.*<\/li>)(?!\n<li>)/g, "<ul>$1</ul>");

    result = result.replace(/^\d+\.\s+(.*$)/gm, "<li>$1</li>");

    result = result.replace(/^>\s+(.*$)/gm, "<blockquote>$1</blockquote>");

    result = result.replace(/^---$/gm, "<hr>");
    result = result.replace(/^\*\*\*$/gm, "<hr>");

    result = result.replace(/\n\n/g, "</p><p>");
    result = result.replace(/\n/g, "<br>");

    if (!result.startsWith("<")) {
      result = "<p>" + result + "</p>";
    }

    setHtml(result);
  };

  const copyHtml = () => {
    navigator.clipboard.writeText(html);
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">Markdown Preview</h2>
        <p className="tool-description">Preview Markdown and convert to HTML</p>
      </div>
      <div className="tool-content">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div className="tool-input-section">
            <label className="tool-label">Markdown</label>
            <textarea
              className="tool-textarea"
              placeholder="# Hello World&#10;&#10;Write your **markdown** here..."
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              rows={15}
              style={{ fontFamily: "monospace" }}
            />
          </div>
          <div className="tool-output-section">
            <label className="tool-label">Preview</label>
            <div
              style={{
                padding: "16px",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                background: "var(--surface)",
                minHeight: "300px",
                overflow: "auto",
              }}
              dangerouslySetInnerHTML={{
                __html:
                  html ||
                  '<p style="color: var(--text-muted)">Preview will appear here...</p>',
              }}
            />
          </div>
        </div>
        <div className="tool-actions">
          <button className="btn primary" onClick={convertToHtml}>
            Convert
          </button>
          <button className="btn secondary" onClick={copyHtml} disabled={!html}>
            Copy HTML
          </button>
        </div>
        {html && (
          <div className="tool-output-section">
            <label className="tool-label">HTML Output</label>
            <pre className="tool-output" style={{ fontSize: "12px" }}>
              {html}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
