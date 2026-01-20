import { useState } from "react";

export default function XmlJsonTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"xml-to-json" | "json-to-xml">(
    "xml-to-json",
  );

  const xmlToJson = (xml: string): any => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "text/xml");

    const parseError = doc.querySelector("parsererror");
    if (parseError) {
      throw new Error("Invalid XML");
    }

    const nodeToJson = (node: Element): any => {
      const obj: any = {};

      if (node.attributes.length > 0) {
        obj["@attributes"] = {};
        for (let i = 0; i < node.attributes.length; i++) {
          const attr = node.attributes[i];
          obj["@attributes"][attr.name] = attr.value;
        }
      }

      if (
        node.childNodes.length === 1 &&
        node.childNodes[0].nodeType === Node.TEXT_NODE
      ) {
        const text = node.childNodes[0].textContent?.trim();
        if (text) {
          if (Object.keys(obj).length === 0) return text;
          obj["#text"] = text;
        }
        return obj;
      }

      for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes[i];
        if (child.nodeType === Node.ELEMENT_NODE) {
          const childElement = child as Element;
          const childName = childElement.tagName;
          const childValue = nodeToJson(childElement);

          if (obj[childName]) {
            if (!Array.isArray(obj[childName])) {
              obj[childName] = [obj[childName]];
            }
            obj[childName].push(childValue);
          } else {
            obj[childName] = childValue;
          }
        }
      }
      return obj;
    };

    return { [doc.documentElement.tagName]: nodeToJson(doc.documentElement) };
  };

  const jsonToXml = (obj: any, rootName = "root"): string => {
    const toXml = (data: any, name: string): string => {
      if (data === null || data === undefined) return `<${name}/>`;
      if (typeof data !== "object") return `<${name}>${data}</${name}>`;
      if (Array.isArray(data)) {
        return data.map((item) => toXml(item, name)).join("\n");
      }

      let attrs = "";
      let children = "";

      for (const [key, value] of Object.entries(data)) {
        if (key === "@attributes") {
          for (const [attrKey, attrVal] of Object.entries(value as any)) {
            attrs += ` ${attrKey}="${attrVal}"`;
          }
        } else if (key === "#text") {
          children += value;
        } else {
          children += toXml(value, key);
        }
      }

      if (!children) return `<${name}${attrs}/>`;
      return `<${name}${attrs}>${children}</${name}>`;
    };

    const keys = Object.keys(obj);
    if (keys.length === 1) {
      return `<?xml version="1.0" encoding="UTF-8"?>\n${toXml(obj[keys[0]], keys[0])}`;
    }
    return `<?xml version="1.0" encoding="UTF-8"?>\n${toXml(obj, rootName)}`;
  };

  const convert = () => {
    try {
      if (mode === "xml-to-json") {
        const result = xmlToJson(input);
        setOutput(JSON.stringify(result, null, 2));
      } else {
        const parsed = JSON.parse(input);
        setOutput(jsonToXml(parsed));
      }
    } catch (err) {
      setOutput(
        `Error: ${err instanceof Error ? err.message : "Conversion failed"}`,
      );
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">XML ↔ JSON Converter</h2>
        <p className="tool-description">Convert between XML and JSON formats</p>
      </div>
      <div className="tool-content">
        <div className="tool-tabs">
          <button
            className={`tool-tab ${mode === "xml-to-json" ? "active" : ""}`}
            onClick={() => setMode("xml-to-json")}
          >
            XML → JSON
          </button>
          <button
            className={`tool-tab ${mode === "json-to-xml" ? "active" : ""}`}
            onClick={() => setMode("json-to-xml")}
          >
            JSON → XML
          </button>
        </div>
        <div className="tool-input-section">
          <label className="tool-label">
            {mode === "xml-to-json" ? "XML Input" : "JSON Input"}
          </label>
          <textarea
            className="tool-textarea"
            placeholder={
              mode === "xml-to-json" ? "<root>...</root>" : '{ "key": "value" }'
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={8}
          />
        </div>
        <div className="tool-actions">
          <button className="btn primary" onClick={convert}>
            Convert
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
          <label className="tool-label">
            {mode === "xml-to-json" ? "JSON Output" : "XML Output"}
          </label>
          <pre className="tool-output">
            {output || "Output will appear here..."}
          </pre>
        </div>
      </div>
    </div>
  );
}
