import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Moon } from 'lucide-react';
var categories = ['Dev', 'Data', 'Security', 'Media', 'Productivity'];
export function Header() {
    return (_jsxs("header", { className: "nav", children: [_jsxs("div", { className: "nav-left", children: [_jsx("div", { style: { fontWeight: 700, letterSpacing: '-0.02em' }, children: "z1x" }), _jsx("div", { className: "nav-tabs", children: categories.map(function (cat) { return (_jsx("span", { className: "nav-tab muted", children: cat }, cat)); }) })] }), _jsx("div", { className: "nav-actions", children: _jsx("button", { className: "theme-toggle", "aria-label": "Toggle theme", children: _jsx(Moon, { size: 16 }) }) })] }));
}
export default Header;
