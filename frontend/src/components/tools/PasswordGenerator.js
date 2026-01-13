var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import api from '../../lib/api';
export function PasswordGenerator() {
    var _this = this;
    var _a = useState(''), password = _a[0], setPassword = _a[1];
    var _b = useState(null), strength = _b[0], setStrength = _b[1];
    var _c = useState(16), length = _c[0], setLength = _c[1];
    var _d = useState(true), includeUppercase = _d[0], setIncludeUppercase = _d[1];
    var _e = useState(true), includeLowercase = _e[0], setIncludeLowercase = _e[1];
    var _f = useState(true), includeNumbers = _f[0], setIncludeNumbers = _f[1];
    var _g = useState(true), includeSymbols = _g[0], setIncludeSymbols = _g[1];
    var _h = useState(false), loading = _h[0], setLoading = _h[1];
    var handleGenerate = function () { return __awaiter(_this, void 0, void 0, function () {
        var result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, api.generatePassword({
                            length: length,
                            include_uppercase: includeUppercase,
                            include_lowercase: includeLowercase,
                            include_numbers: includeNumbers,
                            include_symbols: includeSymbols,
                        })];
                case 2:
                    result = _a.sent();
                    if (result.success) {
                        setPassword(result.password);
                        // Check strength
                        checkStrength(result.password);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    console.error('Failed to generate password:', err_1);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var checkStrength = function (pwd) { return __awaiter(_this, void 0, void 0, function () {
        var result, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, api.checkPasswordStrength(pwd)];
                case 1:
                    result = _a.sent();
                    if (result.success) {
                        setStrength(result);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    console.error('Failed to check strength:', err_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleCopy = function () { return __awaiter(_this, void 0, void 0, function () {
        var err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, navigator.clipboard.writeText(password)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_3 = _a.sent();
                    console.error('Failed to copy:', err_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs("div", { className: "tool-container", children: [_jsxs("div", { className: "tool-header", children: [_jsx("h2", { className: "tool-title", children: "Password Generator" }), _jsx("p", { className: "tool-description", children: "Generate secure random passwords" })] }), _jsxs("div", { className: "tool-content", children: [_jsxs("div", { className: "tool-options", children: [_jsxs("div", { className: "tool-option", children: [_jsxs("label", { className: "tool-label", children: ["Length: ", length] }), _jsx("input", { type: "range", min: 8, max: 64, value: length, onChange: function (e) { return setLength(Number(e.target.value)); }, className: "tool-slider" })] }), _jsx("div", { className: "tool-option", children: _jsxs("label", { className: "tool-checkbox-label", children: [_jsx("input", { type: "checkbox", checked: includeUppercase, onChange: function (e) { return setIncludeUppercase(e.target.checked); } }), "Include Uppercase (A-Z)"] }) }), _jsx("div", { className: "tool-option", children: _jsxs("label", { className: "tool-checkbox-label", children: [_jsx("input", { type: "checkbox", checked: includeLowercase, onChange: function (e) { return setIncludeLowercase(e.target.checked); } }), "Include Lowercase (a-z)"] }) }), _jsx("div", { className: "tool-option", children: _jsxs("label", { className: "tool-checkbox-label", children: [_jsx("input", { type: "checkbox", checked: includeNumbers, onChange: function (e) { return setIncludeNumbers(e.target.checked); } }), "Include Numbers (0-9)"] }) }), _jsx("div", { className: "tool-option", children: _jsxs("label", { className: "tool-checkbox-label", children: [_jsx("input", { type: "checkbox", checked: includeSymbols, onChange: function (e) { return setIncludeSymbols(e.target.checked); } }), "Include Symbols (!@#$...)"] }) })] }), _jsxs("div", { className: "tool-actions", children: [_jsx("button", { className: "btn btn-primary", onClick: handleGenerate, disabled: loading, children: loading ? 'Generating...' : 'Generate Password' }), _jsx("button", { className: "btn btn-secondary", onClick: handleCopy, disabled: !password, children: "Copy" })] }), password && (_jsxs("div", { className: "tool-output-section", children: [_jsx("label", { className: "tool-label", children: "Generated Password" }), _jsx("div", { className: "password-output", children: _jsx("code", { className: "password-text", children: password }) }), strength && (_jsxs("div", { className: "password-strength", children: [_jsxs("div", { className: "strength-header", children: [_jsx("span", { className: "tool-label", children: "Strength:" }), _jsx("span", { className: "strength-badge strength-".concat(strength.strength), children: strength.strength }), _jsxs("span", { className: "strength-score", children: [strength.score, "/", strength.max_score] })] }), strength.feedback && strength.feedback.length > 0 && (_jsx("ul", { className: "strength-feedback", children: strength.feedback.map(function (item, index) { return (_jsx("li", { children: item }, index)); }) }))] }))] }))] })] }));
}
export default PasswordGenerator;
