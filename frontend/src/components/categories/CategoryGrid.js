import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var categories = [
    {
        name: 'Dev',
        tools: ['API Tester', 'Webhook Tester', 'JWT Inspector', 'Cron Builder', 'Regex Builder'],
    },
    {
        name: 'Data',
        tools: ['Data Transformer', 'SQL to NoSQL', 'Schema Designer', 'Log Parser', 'Diff Tool'],
    },
    {
        name: 'Security',
        tools: ['Password Vault', 'File Encryptor', 'Hash Generator', 'SSL Checker', 'Headers Check'],
    },
    {
        name: 'Media',
        tools: ['QR Studio', 'Image Optimizer', 'Icon Generator', 'Palette Extractor', 'Video → GIF'],
    },
    {
        name: 'Productivity',
        tools: ['Pomodoro', 'Quick Notes', 'Kanban', 'Time Zone Planner', 'Clipboard History'],
    },
];
export function CategoryGrid() {
    return (_jsxs("section", { className: "category-section", children: [_jsxs("div", { className: "section-head", children: [_jsxs("div", { children: [_jsx("div", { className: "section-label", children: "Browse" }), _jsx("h2", { className: "section-title-lg", children: "Tools by category" })] }), _jsx("button", { className: "btn secondary", children: "See all" })] }), _jsx("div", { className: "card-grid", children: categories.map(function (cat) { return (_jsx("div", { className: "card hoverable", children: _jsxs("div", { className: "card-body", children: [_jsxs("div", { className: "card-head", children: [_jsx("div", { className: "card-title", children: cat.name }), _jsxs("span", { className: "pill pill-ghost", children: [cat.tools.length, " tools"] })] }), _jsx("ul", { className: "tool-list", children: cat.tools.map(function (tool) { return (_jsx("li", { children: tool }, tool)); }) }), _jsx("div", { className: "card-footer", children: _jsx("button", { className: "btn secondary", children: "Open" }) })] }) }, cat.name)); }) })] }));
}
export default CategoryGrid;
