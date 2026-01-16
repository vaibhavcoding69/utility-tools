import { useState } from 'react'
import JsonFormatter from './components/JsonFormatter'
import Base64Tool from './components/Base64Tool'
import PasswordGenerator from './components/PasswordGenerator'
import HashGenerator from './components/HashGenerator'
import UuidGenerator from './components/UuidGenerator'
import JwtDecoder from './components/JwtDecoder'
import RegexTester from './components/RegexTester'
import UrlEncoder from './components/UrlEncoder'
import DiffTool from './components/DiffTool'
import TotpGenerator from './components/TotpGenerator'

type ToolType = 'json' | 'base64' | 'password' | 'hash' | 'uuid' | 'jwt' | 'regex' | 'url' | 'diff' | 'totp' | null;
type CategoryType = 'developer' | 'security' | 'all';

export function ToolsPage() {
  const [selectedTool, setSelectedTool] = useState<ToolType>('json');
  const [category, setCategory] = useState<CategoryType>('all');

  const tools = [
    // Developer Tools
    { id: 'json', name: 'JSON Formatter', description: 'Format and validate JSON', category: 'developer' },
    { id: 'base64', name: 'Base64', description: 'Encode and decode Base64', category: 'developer' },
    { id: 'url', name: 'URL Encoder', description: 'Encode and decode URLs', category: 'developer' },
    { id: 'uuid', name: 'UUID Generator', description: 'Generate unique identifiers', category: 'developer' },
    { id: 'regex', name: 'Regex Tester', description: 'Test regular expressions', category: 'developer' },
    { id: 'jwt', name: 'JWT Decoder', description: 'Decode JSON Web Tokens', category: 'developer' },
    { id: 'diff', name: 'Text Diff', description: 'Compare two texts', category: 'developer' },
    
    // Security Tools
    { id: 'password', name: 'Password Generator', description: 'Generate secure passwords', category: 'security' },
    { id: 'hash', name: 'Hash Generator', description: 'Generate cryptographic hashes', category: 'security' },
    { id: 'totp', name: 'TOTP Generator', description: 'Generate 2FA codes', category: 'security' },
  ];

  const filteredTools = category === 'all' 
    ? tools 
    : tools.filter(t => t.category === category);

  const renderTool = () => {
    switch (selectedTool) {
      case 'json':
        return <JsonFormatter />;
      case 'base64':
        return <Base64Tool />;
      case 'password':
        return <PasswordGenerator />;
      case 'hash':
        return <HashGenerator />;
      case 'uuid':
        return <UuidGenerator />;
      case 'jwt':
        return <JwtDecoder />;
      case 'regex':
        return <RegexTester />;
      case 'url':
        return <UrlEncoder />;
      case 'diff':
        return <DiffTool />;
      case 'totp':
        return <TotpGenerator />;
      default:
        return (
          <div className="tool-placeholder">
            <p>Select a tool from the list</p>
          </div>
        );
    }
  };

  return (
    <div className="tools-page">
      <div className="tools-sidebar">
        <h2 className="sidebar-title">Utility Tools</h2>
        
        <div className="category-filters">
          <button 
            className={`category-btn ${category === 'all' ? 'active' : ''}`}
            onClick={() => setCategory('all')}
          >
            All
          </button>
          <button 
            className={`category-btn ${category === 'developer' ? 'active' : ''}`}
            onClick={() => setCategory('developer')}
          >
            Developer
          </button>
          <button 
            className={`category-btn ${category === 'security' ? 'active' : ''}`}
            onClick={() => setCategory('security')}
          >
            Security
          </button>
        </div>

        <nav className="tools-nav">
          {filteredTools.map((tool) => (
            <button
              key={tool.id}
              className={`tool-nav-item ${selectedTool === tool.id ? 'active' : ''}`}
              onClick={() => setSelectedTool(tool.id as ToolType)}
            >
              <div className="tool-nav-name">{tool.name}</div>
              <div className="tool-nav-description">{tool.description}</div>
            </button>
          ))}
        </nav>
      </div>
      <div className="tools-main">
        {renderTool()}
      </div>
    </div>
  );
}

export default ToolsPage;
