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
  HashGenerator,
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
    id: "jwt",
    name: "JWT Decoder",
    description: "Decode JSON Web Tokens",
    component: JwtDecoder,
  },
  {
    id: "diff",
    name: "Text Diff",
    description: "Compare two texts",
    component: DiffTool,
  },
  {
    id: "yaml-json",
    name: "YAML ↔ JSON",
    description: "Convert between YAML and JSON",
    component: YamlJsonTool,
  },
  {
    id: "timestamp",
    name: "Timestamp Converter",
    description: "Convert Unix timestamps",
    component: TimestampTool,
  },
  {
    id: "query-params",
    name: "Query Params to JSON",
    description: "Parse URL query strings",
    component: QueryParamsTool,
  },
  {
    id: "hex-rgb",
    name: "HEX ↔ RGB",
    description: "Convert color formats",
    component: HexRgbTool,
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
    id: "number-base",
    name: "Number Base Converter",
    description: "Binary, octal, decimal, hex",
    component: NumberBaseTool,
  },
  {
    id: "css-units",
    name: "CSS Units Converter",
    description: "Convert px, em, rem, pt",
    component: CssUnitsTool,
  },
  {
    id: "xml-json",
    name: "XML ↔ JSON",
    description: "Convert XML and JSON",
    component: XmlJsonTool,
  },
  {
    id: "svg-viewer",
    name: "SVG Viewer",
    description: "Preview and export SVGs",
    component: SvgViewerTool,
  },
  {
    id: "lorem",
    name: "Lorem Ipsum",
    description: "Generate placeholder text",
    component: LoremTool,
  },
  {
    id: "case-converter",
    name: "Case Converter",
    description: "Convert text cases",
    component: CaseConverterTool,
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
];

const securityTools: ToolConfig[] = [
  {
    id: "password",
    name: "Password Generator",
    description: "Generate secure passwords",
    component: PasswordGenerator,
  },
  {
    id: "hash",
    name: "Hash Generator",
    description: "Generate cryptographic hashes",
    component: HashGenerator,
  },
  {
    id: "totp",
    name: "TOTP Generator",
    description: "Generate 2FA codes",
    component: TotpGenerator,
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
    id: "sql",
    name: "SQL Formatter",
    description: "Format SQL queries",
    component: SqlFormatterTool,
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

export default function ToolPage({ category }: ToolPageProps) {
  const { toolId } = useParams<{ toolId: string }>();
  const [navOpen, setNavOpen] = useState(true);

  const tools = toolsByCategory[category];
  const currentTool = tools.find((t) => t.id === toolId);

  // Reset scroll so each tool starts at the top, preventing mid-page offsets after navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [toolId]);

  if (!currentTool) {
    return <Navigate to={`/tools/${category}`} replace />;
  }

  const ToolComponent = currentTool.component;

  return (
    <div className="tool-page-wrapper">
      <div className="tool-page-header">
        <div className="tool-breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-sep">/</span>
          <Link to={`/tools/${category}`}>{categoryNames[category]} Tools</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{currentTool.name}</span>
        </div>
        <h1>{currentTool.name}</h1>
        <p className="muted">{currentTool.description}</p>
      </div>

      <div className="tool-page-layout">
        <div className="tool-page-main">
          <ToolComponent />

          <section className={`tool-page-nav-block ${navOpen ? "" : "collapsed"}`}>
            <div className="tool-page-nav-heading">
              <div>
                <h3 className="sidebar-title">More {categoryNames[category]} tools</h3>
                <p className="muted">Jump to another tool without losing your place.</p>
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
    </div>
  );
}
