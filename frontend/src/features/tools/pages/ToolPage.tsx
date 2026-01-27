import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import {
  JsonFormatter,
  Base64Tool,
  UuidGenerator,
  JwtDecoder,
  RegexTester,
  UrlEncoder,
  DiffTool,
  PasswordGenerator,
  TotpGenerator,
} from "../components";
import {
  CsvToJsonTool,
  JsonToCsvTool,
  SqlFormatterTool,
  FakeDataTool,
  BaseConverterTool,
} from "./data-tools";
import YamlJsonTool from "../components/YamlJsonTool";
import TimestampTool from "../components/TimestampTool";
import QueryParamsTool from "../components/QueryParamsTool";
import HexRgbTool from "../components/HexRgbTool";
import ImageBase64Tool from "../components/ImageBase64Tool";
import Base64ImageTool from "../components/Base64ImageTool";
import NumberBaseTool from "../components/NumberBaseTool";
import CssUnitsTool from "../components/CssUnitsTool";
import XmlJsonTool from "../components/XmlJsonTool";
import SvgViewerTool from "../components/SvgViewerTool";
import LoremTool from "../components/LoremTool";
import CaseConverterTool from "../components/CaseConverterTool";
import QrGeneratorTool from "../components/QrGeneratorTool";
import MarkdownTool from "../components/MarkdownTool";
import ColorPickerTool from "../components/ColorPickerTool";
import HtmlEntitiesTool from "../components/HtmlEntitiesTool";
import CronParserTool from "../components/CronParserTool";
import CssInlineTool from "../components/CssInlineTool";
import EnvNetlifyTool from "../components/EnvNetlifyTool";
import HarViewerTool from "../components/HarViewerTool";
import RandomStringTool from "../components/RandomStringTool";
import SpeedtestTool from "../components/SpeedtestTool";
import SqlMinifyTool from "../components/SqlMinifyTool";
import JsonYamlTool from "../components/JsonYamlTool";
import ImageResizeTool from "../components/ImageResizeTool";

type ToolConfig = {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType;
};

const developerTools: ToolConfig[] = [
  {
    id: "json",
    name: "JSON Formatter",
    description: "Format and validate JSON",
    component: JsonFormatter,
  },
  {
    id: "jwt",
    name: "JWT Decoder",
    description: "Decode JSON Web Tokens",
    component: JwtDecoder,
  },
  {
    id: "uuid",
    name: "UUID Generator",
    description: "Generate unique identifiers",
    component: UuidGenerator,
  },
  {
    id: "regex",
    name: "Regex Tester",
    description: "Test regular expressions",
    component: RegexTester,
  },
  {
    id: "diff",
    name: "Text Diff",
    description: "Compare two texts",
    component: DiffTool,
  },
  {
    id: "image-base64",
    name: "Image to Base64",
    description: "Convert images to Base64",
    component: ImageBase64Tool,
  },
  {
    id: "base64-image",
    name: "Base64 to Image",
    description: "Decode Base64 to images",
    component: Base64ImageTool,
  },
  {
    id: "image-resize",
    name: "Image Resizer / WebP",
    description: "Resize or convert images",
    component: ImageResizeTool,
  },
  {
    id: "css-units",
    name: "CSS Units Converter",
    description: "Convert px, em, rem, pt",
    component: CssUnitsTool,
  },
  {
    id: "css-inline",
    name: "CSS Inliner",
    description: "Inline CSS for emails",
    component: CssInlineTool,
  },
  {
    id: "svg-viewer",
    name: "SVG Viewer",
    description: "Preview and export SVGs",
    component: SvgViewerTool,
  },
  {
    id: "har-viewer",
    name: "HAR Viewer",
    description: "Summarize HAR files",
    component: HarViewerTool,
  },
  {
    id: "qr-generator",
    name: "QR Code Generator",
    description: "Generate QR codes",
    component: QrGeneratorTool,
  },
  {
    id: "markdown",
    name: "Markdown Preview",
    description: "Preview and convert Markdown",
    component: MarkdownTool,
  },
  {
    id: "speedtest",
    name: "Internet Speed Test",
    description: "Measure connectivity",
    component: SpeedtestTool,
  },
];

const securityTools: ToolConfig[] = [
  {
    id: "password",
    name: "Password Generator",
    description: "Generate secure passwords",
    component: PasswordGenerator,
  },
  {
    id: "json",
    name: "JSON Formatter",
    description: "Format and validate JSON",
    component: JsonFormatter,
  },
  {
    id: "totp",
    name: "TOTP Generator",
    description: "Generate 2FA codes",
    component: TotpGenerator,
  },
  {
    id: "random-string",
    name: "Random String",
    description: "Generate random strings",
    component: RandomStringTool,
  },
  {
    id: "base64",
    name: "Base64",
    description: "Encode and decode Base64",
    component: Base64Tool,
  },
  {
    id: "url",
    name: "URL Encoder",
    description: "Encode and decode URLs",
    component: UrlEncoder,
  },
  {
    id: "regex",
    name: "Regex Tester",
    description: "Test regular expressions",
    component: RegexTester,
  },
  {
    id: "html-entities",
    name: "HTML Entities",
    description: "Encode/decode HTML entities",
    component: HtmlEntitiesTool,
  },
  {
    id: "diff",
    name: "Text Diff",
    description: "Compare two texts",
    component: DiffTool,
  },
  {
    id: "cron-parser",
    name: "Cron Parser",
    description: "Parse cron expressions",
    component: CronParserTool,
  },
  {
    id: "query-params",
    name: "Query Params to JSON",
    description: "Parse URL query strings",
    component: QueryParamsTool,
  },
  {
    id: "json",
    name: "JSON Formatter",
    description: "Format and validate JSON",
    component: JsonFormatter,
  },
];

const dataTools: ToolConfig[] = [
  {
    id: "csv-to-json",
    name: "CSV to JSON",
    description: "Convert CSV to JSON",
    component: CsvToJsonTool,
  },
  {
    id: "json-to-csv",
    name: "JSON to CSV",
    description: "Convert JSON to CSV",
    component: JsonToCsvTool,
  },
  {
    id: "timestamp",
    name: "Timestamp Converter",
    description: "Convert Unix timestamps",
    component: TimestampTool,
  },
  {
    id: "xml-json",
    name: "XML ↔ JSON",
    description: "Convert XML and JSON",
    component: XmlJsonTool,
  },
  {
    id: "hex-rgb",
    name: "HEX ↔ RGB",
    description: "Convert color formats",
    component: HexRgbTool,
  },
  {
    id: "number-base",
    name: "Number Base Converter",
    description: "Binary, octal, decimal, hex",
    component: NumberBaseTool,
  },
  {
    id: "sql",
    name: "SQL Formatter",
    description: "Format SQL queries",
    component: SqlFormatterTool,
  },
  {
    id: "yaml-json",
    name: "YAML to JSON",
    description: "Convert YAML to JSON",
    component: YamlJsonTool,
  },
  {
    id: "json-yaml",
    name: "JSON to YAML",
    description: "Convert JSON to YAML",
    component: JsonYamlTool,
  },
  {
    id: "lorem",
    name: "Lorem Ipsum",
    description: "Generate placeholder text",
    component: LoremTool,
  },
  {
    id: "env-netlify",
    name: ".env → netlify.toml",
    description: "Convert env to netlify config",
    component: EnvNetlifyTool,
  },
  {
    id: "case-converter",
    name: "Case Converter",
    description: "Convert text cases",
    component: CaseConverterTool,
  },
  {
    id: "color-picker",
    name: "Color Picker",
    description: "Pick and convert colors",
    component: ColorPickerTool,
  },
  {
    id: "html-entities",
    name: "HTML Entities",
    description: "Encode/decode HTML entities",
    component: HtmlEntitiesTool,
  },
  {
    id: "cron-parser",
    name: "Cron Parser",
    description: "Parse cron expressions",
    component: CronParserTool,
  },
  {
    id: "random-string",
    name: "Random String",
    description: "Generate random strings",
    component: RandomStringTool,
  },
  {
    id: "sql-minify",
    name: "SQL Minifier",
    description: "Minify SQL queries",
    component: SqlMinifyTool,
  },
  {
    id: "fake-data",
    name: "Fake Data",
    description: "Generate fake test data",
    component: FakeDataTool,
  },
  {
    id: "base-converter",
    name: "Base Converter",
    description: "Convert between number bases",
    component: BaseConverterTool,
  },
];

const toolsByCategory: Record<string, ToolConfig[]> = {
  developer: developerTools,
  security: securityTools,
  data: dataTools,
};

const categoryNames: Record<string, string> = {
  developer: "Developer",
  security: "Security",
  data: "Data",
};

type ToolPageProps = {
  category: "developer" | "security" | "data";
};

const baseTitle = "z1x-utility tools";
const baseDescription = "z1x-utility tools.";

function setSeo({ title, description, path }: { title: string; description: string; path: string }) {
  document.title = title;

  const descriptionTag = document.querySelector('meta[name="description"]');
  if (descriptionTag) {
    descriptionTag.setAttribute("content", description);
  }

  const canonicalTag = document.querySelector('link[rel="canonical"]');
  if (canonicalTag) {
    canonicalTag.setAttribute("href", `https://z1x.qzz.io${path}`);
  }

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute("content", title);
  }

  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) {
    ogDescription.setAttribute("content", description);
  }

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) {
    ogUrl.setAttribute("content", `https://z1x.qzz.io${path}`);
  }

  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitle) {
    twitterTitle.setAttribute("content", title);
  }

  const twitterDescription = document.querySelector('meta[name="twitter:description"]');
  if (twitterDescription) {
    twitterDescription.setAttribute("content", description);
  }
}

export default function ToolPage({ category }: ToolPageProps) {
  const { toolId } = useParams<{ toolId: string }>();
  const [navOpen, setNavOpen] = useState(true);

  const tools = toolsByCategory[category];
  const currentTool = tools.find((t) => t.id === toolId);

  // Reset scroll so each tool starts at the top, preventing mid-page offsets after navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [toolId]);

  useEffect(() => {
    if (!currentTool) return;
    const title = `${baseTitle} - ${currentTool.name}`;
    const path = `/tools/${category}/${currentTool.id}`;
    setSeo({ title, description: baseDescription, path });
  }, [category, currentTool]);

  if (!currentTool) {
    return <Navigate to={`/tools/${category}`} replace />;
  }

  const ToolComponent = currentTool.component;

  return (
    <div className="tool-page-wrapper">
      <div className="tools-page-header">
        <Link to={`/tools/${category}`} className="back-link">
          ← Back to {categoryNames[category]} tools
        </Link>
        <div className="section-badge">{categoryNames[category]} tool</div>
        <h1>{currentTool.name}</h1>
        <p className="muted">{currentTool.description}</p>
      </div>

      <div className="tool-page-body">
        <section className="tool-page-content">
          <div className="tool-page-card">
            <ToolComponent />
          </div>
        </section>

        <section className="tool-page-nav-section">
          <div className="tool-page-nav-header">
            <div className="tool-page-nav-title">
              More {categoryNames[category]} tools
            </div>
            <button
              className={`collapse-toggle ${navOpen ? "open" : ""}`}
              onClick={() => setNavOpen((v) => !v)}
              aria-expanded={navOpen}
            >
              <span>{navOpen ? "Hide" : "Show"} tools</span>
              <span className="collapse-icon" aria-hidden>
                ▾
              </span>
            </button>
          </div>
          <div className={`tool-page-nav-wrap ${navOpen ? "open" : "collapsed"}`}>
            <nav className="tool-page-nav tool-page-nav-grid">
              {tools.map((tool) => (
                <Link
                  key={tool.id}
                  to={`/tools/${category}/${tool.id}`}
                  className={`tool-page-nav-item ${tool.id === toolId ? "active" : ""}`}
                >
                  {tool.name}
                </Link>
              ))}
            </nav>
          </div>
        </section>
      </div>
    </div>
  );
}
