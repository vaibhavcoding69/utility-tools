import { useState } from 'react';
import JsonFormatter from '../components/tools/JsonFormatter';
import Base64Tool from '../components/tools/Base64Tool';
import PasswordGenerator from '../components/tools/PasswordGenerator';

type ToolType = 'json' | 'base64' | 'password' | null;

export function ToolsPage() {
  const [selectedTool, setSelectedTool] = useState<ToolType>('json');

  const tools = [
    { id: 'json', name: 'JSON Formatter', description: 'Format and validate JSON' },
    { id: 'base64', name: 'Base64 Encoder/Decoder', description: 'Encode and decode Base64' },
    { id: 'password', name: 'Password Generator', description: 'Generate secure passwords' },
  ];

  const renderTool = () => {
    switch (selectedTool) {
      case 'json':
        return <JsonFormatter />;
      case 'base64':
        return <Base64Tool />;
      case 'password':
        return <PasswordGenerator />;
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
        <nav className="tools-nav">
          {tools.map((tool) => (
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
