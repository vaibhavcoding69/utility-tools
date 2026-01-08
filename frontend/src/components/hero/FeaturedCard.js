import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function FeaturedCard() {
    return (_jsx("div", { className: "card hero-feature", children: _jsxs("div", { className: "card-body", children: [_jsx("div", { className: "section-title", children: "Featured tool" }), _jsxs("div", { className: "mini-card", children: [_jsxs("div", { className: "mini-card-header", children: [_jsx("div", { className: "mini-title", children: "JSON Formatter" }), _jsx("span", { className: "pill", children: "Dev" })] }), _jsx("p", { className: "mini-sub", children: "Format and validate JSON data quickly." }), _jsx("div", { className: "mini-preview", children: _jsx("pre", { children: "{\n  \"status\": \"ok\",\n  \"items\": 3\n}" }) }), _jsxs("div", { className: "mini-actions", children: [_jsx("button", { className: "btn", children: "Launch" }), _jsx("button", { className: "btn secondary", children: "Copy sample" })] })] })] }) }));
}
export default FeaturedCard;
