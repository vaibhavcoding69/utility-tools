import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var companyLogos = [
    'CURSOR',
    'Decagon',
    'zoom',
    'Salesforce',
    'Merrily',
    'K3',
    'Cog',
];
export function Hero() {
    return (_jsxs("section", { className: "hero-section", children: [_jsxs("div", { className: "hero-background", children: [_jsx("div", { className: "hero-arc" }), _jsx("div", { className: "hero-dots" })] }), _jsxs("div", { className: "hero-content", children: [_jsxs("h1", { className: "hero-title", children: ["Build on the ", _jsx("span", { className: "text-gradient", children: "AI Native Cloud" })] }), _jsx("p", { className: "hero-subtitle", children: "Engineered for AI natives, powered by cutting-edge research" }), _jsxs("div", { className: "hero-actions", children: [_jsx("button", { className: "btn btn-primary", children: "Start building now" }), _jsx("button", { className: "btn btn-outline", children: "Contact sales" })] })] }), _jsx("div", { className: "company-logos", children: companyLogos.map(function (logo) { return (_jsx("div", { className: "company-logo", children: logo }, logo)); }) })] }));
}
export default Hero;
