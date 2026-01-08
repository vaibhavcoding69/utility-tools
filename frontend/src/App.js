import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './index.css';
import Header from './components/layout/Header';
import { Hero } from './components/hero/Hero';
import { FeaturedCard } from './components/hero/FeaturedCard';
import { CategoryGrid } from './components/categories/CategoryGrid';
export default function App() {
    return (_jsxs("div", { className: "app-shell", children: [_jsx(Header, {}), _jsxs("main", { children: [_jsxs("section", { className: "hero", children: [_jsx(Hero, {}), _jsx("div", { className: "hero-right", children: _jsx(FeaturedCard, {}) })] }), _jsx(CategoryGrid, {})] })] }));
}
