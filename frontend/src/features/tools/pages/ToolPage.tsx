import { useParams, Link, Navigate } from 'react-router-dom'
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
} from '../components'
import {
  CsvToJsonTool,
  JsonToCsvTool,
  SqlFormatterTool,
  FakeDataTool,
  BaseConverterTool,
} from './data-tools'

type ToolConfig = {
  id: string
  name: string
  description: string
  component: React.ComponentType
}

const developerTools: ToolConfig[] = [
  { id: 'json', name: 'JSON Formatter', description: 'Format and validate JSON', component: JsonFormatter },
  { id: 'base64', name: 'Base64', description: 'Encode and decode Base64', component: Base64Tool },
  { id: 'url', name: 'URL Encoder', description: 'Encode and decode URLs', component: UrlEncoder },
  { id: 'uuid', name: 'UUID Generator', description: 'Generate unique identifiers', component: UuidGenerator },
  { id: 'regex', name: 'Regex Tester', description: 'Test regular expressions', component: RegexTester },
  { id: 'jwt', name: 'JWT Decoder', description: 'Decode JSON Web Tokens', component: JwtDecoder },
  { id: 'diff', name: 'Text Diff', description: 'Compare two texts', component: DiffTool },
]

const securityTools: ToolConfig[] = [
  { id: 'password', name: 'Password Generator', description: 'Generate secure passwords', component: PasswordGenerator },
  { id: 'hash', name: 'Hash Generator', description: 'Generate cryptographic hashes', component: HashGenerator },
  { id: 'totp', name: 'TOTP Generator', description: 'Generate 2FA codes', component: TotpGenerator },
]

const dataTools: ToolConfig[] = [
  { id: 'csv-to-json', name: 'CSV to JSON', description: 'Convert CSV to JSON', component: CsvToJsonTool },
  { id: 'json-to-csv', name: 'JSON to CSV', description: 'Convert JSON to CSV', component: JsonToCsvTool },
  { id: 'sql', name: 'SQL Formatter', description: 'Format SQL queries', component: SqlFormatterTool },
  { id: 'fake-data', name: 'Fake Data', description: 'Generate fake test data', component: FakeDataTool },
  { id: 'base-converter', name: 'Base Converter', description: 'Convert between number bases', component: BaseConverterTool },
]

const toolsByCategory: Record<string, ToolConfig[]> = {
  developer: developerTools,
  security: securityTools,
  data: dataTools,
}

const categoryNames: Record<string, string> = {
  developer: 'Developer',
  security: 'Security',
  data: 'Data',
}

type ToolPageProps = {
  category: 'developer' | 'security' | 'data'
}

export default function ToolPage({ category }: ToolPageProps) {
  const { toolId } = useParams<{ toolId: string }>()
  
  const tools = toolsByCategory[category]
  const currentTool = tools.find(t => t.id === toolId)
  
  if (!currentTool) {
    return <Navigate to={`/tools/${category}`} replace />
  }
  
  const ToolComponent = currentTool.component

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
        <aside className="tool-page-sidebar">
          <h3 className="sidebar-title">{categoryNames[category]} Tools</h3>
          <nav className="tool-page-nav">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                to={`/tools/${category}/${tool.id}`}
                className={`tool-page-nav-item ${tool.id === toolId ? 'active' : ''}`}
              >
                {tool.name}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="tool-page-main">
          <ToolComponent />
        </div>
      </div>
    </div>
  )
}
