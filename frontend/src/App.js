import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import './index.css';
import { useState } from 'react';
import Header from './components/layout/Header';
import { Hero } from './components/hero/Hero';
import ToolsPage from './pages/ToolsPage';
export default function App() {
    var _a = useState(false), showTools = _a[0], setShowTools = _a[1];
    return (_jsxs("div", { className: "app-shell", children: [_jsx(Header, {}), _jsx("main", { children: showTools ? (_jsx(ToolsPage, {})) : (_jsxs(_Fragment, { children: [_jsx(Hero, {}), _jsx("div", { className: "hero-cta", children: _jsx("button", { className: "btn btn-primary btn-large", onClick: function () { return setShowTools(true); }, children: "Try Tools Now" }) })] })) }), showTools && (_jsx("button", { className: "back-button", onClick: function () { return setShowTools(false); }, children: "\u2190 Back to Home" }))] }));
}
