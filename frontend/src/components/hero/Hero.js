import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var meta = [
    { label: 'Tools', value: '50+' },
    { label: 'Categories', value: '5' },
    { label: 'Offline', value: 'Many local' },
];
export function Hero() {
    return (_jsx("section", { className: "hero", children: _jsxs("div", { className: "hero-left", children: [_jsx("div", { className: "badge", children: "All-in-one utility desk" }), _jsx("h1", { className: "hero-title", children: "Plain, fast, useful." }), _jsx("p", { className: "hero-subtitle", children: "z1x is a focused toolkit for builders: APIs, data, security, media, and productivity tools in a clean, distraction-free workspace." }), _jsxs("div", { className: "hero-actions", children: [_jsx("button", { className: "btn", children: "Open workspace" }), _jsx("button", { className: "btn secondary", children: "View tools" })] }), _jsx("div", { className: "hero-meta", children: meta.map(function (m) { return (_jsxs("div", { children: [_jsx("div", { className: "meta-number", children: m.value }), _jsx("div", { className: "meta-label", children: m.label })] }, m.label)); }) })] }) }));
}
export default Hero;
