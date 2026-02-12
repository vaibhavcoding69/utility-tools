import { useState } from "react";

export default function CssInlineTool() {
  const [html, setHtml] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inline = () => {
    setLoading(true);
    setError("");
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      
      const styleTags = doc.querySelectorAll("style");
      const cssRules: { selector: string; styles: string }[] = [];
      
      styleTags.forEach((styleTag) => {
        const cssText = styleTag.textContent || "";
        const ruleRegex = /([^{]+)\{([^}]+)\}/g;
        let match;
        while ((match = ruleRegex.exec(cssText)) !== null) {
          const selector = match[1].trim();
          const styles = match[2].trim();
          cssRules.push({ selector, styles });
        }
      });
      
      cssRules.forEach(({ selector, styles }) => {
        try {
          const elements = doc.querySelectorAll(selector);
          elements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            const existingStyle = htmlEl.getAttribute("style") || "";
            htmlEl.setAttribute("style", existingStyle + (existingStyle ? "; " : "") + styles);
          });
        } catch {
        }
      });
      
      styleTags.forEach((tag) => tag.remove());
      
      const serializer = new XMLSerializer();
      const result = serializer.serializeToString(doc);
      setOutput(result);
    } catch (e: any) {
      setError(e.message || "Failed to inline");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">CSS Inliner</h2>
        <p className="tool-description">Inline CSS for HTML emails</p>
      </div>
      <div className="tool-content">
        <div className="tool-input-section">
          <label className="tool-label">HTML</label>
          <textarea
            className="tool-textarea"
            rows={8}
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            placeholder="<html><head><style>...</style></head><body>...</body></html>"
          />
        </div>
        <div className="tool-actions">
          <button className="btn primary" onClick={inline} disabled={!html || loading} title={loading ? "Processing..." : !html ? "Enter HTML input first" : undefined}>
            {loading ? "Inliner running..." : "Inline CSS"}
          </button>
        </div>
        {error && <div className="tool-error">{error}</div>}
        {output && (
          <div className="tool-output-section">
            <label className="tool-label">Inlined HTML</label>
            <textarea className="tool-textarea" value={output} readOnly rows={10} />
          </div>
        )}
      </div>
    </div>
  );
}
