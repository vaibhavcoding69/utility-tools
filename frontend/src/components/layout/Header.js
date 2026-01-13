import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronDown } from 'lucide-react';
var navItems = [
    { label: 'Model Platform', hasDropdown: true },
    { label: 'GPU Cloud', hasDropdown: true },
    { label: 'Solutions', hasDropdown: true },
    { label: 'Developers', hasDropdown: true },
    { label: 'Pricing', hasDropdown: true },
    { label: 'Company', hasDropdown: true },
];
export function Header() {
    return (_jsxs("header", { className: "nav", children: [_jsxs("div", { className: "nav-left", children: [_jsx("div", { className: "logo", children: "together.ai" }), _jsx("nav", { className: "nav-menu", children: navItems.map(function (item) { return (_jsxs("button", { className: "nav-item", children: [item.label, item.hasDropdown && _jsx(ChevronDown, { size: 14 })] }, item.label)); }) })] }), _jsxs("div", { className: "nav-actions", children: [_jsx("button", { className: "btn-signin", children: "Sign in" }), _jsx("button", { className: "btn-contact", children: "Contact sales" })] })] }));
}
export default Header;
