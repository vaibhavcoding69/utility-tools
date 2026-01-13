import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import JsonFormatter from '../components/tools/JsonFormatter';
import Base64Tool from '../components/tools/Base64Tool';
import PasswordGenerator from '../components/tools/PasswordGenerator';
export function ToolsPage() {
    var _a = useState('json'), selectedTool = _a[0], setSelectedTool = _a[1];
    var tools = [
        { id: 'json', name: 'JSON Formatter', description: 'Format and validate JSON' },
        { id: 'base64', name: 'Base64 Encoder/Decoder', description: 'Encode and decode Base64' },
        { id: 'password', name: 'Password Generator', description: 'Generate secure passwords' },
    ];
    var renderTool = function () {
        switch (selectedTool) {
            case 'json':
                return _jsx(JsonFormatter, {});
            case 'base64':
                return _jsx(Base64Tool, {});
            case 'password':
                return _jsx(PasswordGenerator, {});
            default:
                return (_jsx("div", { className: "tool-placeholder", children: _jsx("p", { children: "Select a tool from the list" }) }));
        }
    };
    return (_jsxs("div", { className: "tools-page", children: [_jsxs("div", { className: "tools-sidebar", children: [_jsx("h2", { className: "sidebar-title", children: "Utility Tools" }), _jsx("nav", { className: "tools-nav", children: tools.map(function (tool) { return (_jsxs("button", { className: "tool-nav-item ".concat(selectedTool === tool.id ? 'active' : ''), onClick: function () { return setSelectedTool(tool.id); }, children: [_jsx("div", { className: "tool-nav-name", children: tool.name }), _jsx("div", { className: "tool-nav-description", children: tool.description })] }, tool.id)); }) })] }), _jsx("div", { className: "tools-main", children: renderTool() })] }));
}
export default ToolsPage;
