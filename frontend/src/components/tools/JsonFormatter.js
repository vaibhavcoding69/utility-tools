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
export function JsonFormatter() {
    var _this = this;
    var _a = useState(''), input = _a[0], setInput = _a[1];
    var _b = useState(''), output = _b[0], setOutput = _b[1];
    var _c = useState(2), indent = _c[0], setIndent = _c[1];
    var _d = useState(false), sortKeys = _d[0], setSortKeys = _d[1];
    var _e = useState(''), error = _e[0], setError = _e[1];
    var _f = useState(false), loading = _f[0], setLoading = _f[1];
    var handleFormat = function () { return __awaiter(_this, void 0, void 0, function () {
        var result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError('');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, api.formatJson(input, indent, sortKeys)];
                case 2:
                    result = _a.sent();
                    if (result.success && result.valid) {
                        setOutput(result.formatted);
                    }
                    else {
                        setError(result.error || 'Invalid JSON');
                    }
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    setError(err_1 instanceof Error ? err_1.message : 'Failed to format JSON');
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleMinify = function () { return __awaiter(_this, void 0, void 0, function () {
        var result, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError('');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, api.minifyJson(input)];
                case 2:
                    result = _a.sent();
                    if (result.success && result.valid) {
                        setOutput(result.minified);
                    }
                    else {
                        setError(result.error || 'Invalid JSON');
                    }
                    return [3 /*break*/, 5];
                case 3:
                    err_2 = _a.sent();
                    setError(err_2 instanceof Error ? err_2.message : 'Failed to minify JSON');
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleCopy = function () { return __awaiter(_this, void 0, void 0, function () {
        var err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, navigator.clipboard.writeText(output)];
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
    return (_jsxs("div", { className: "tool-container", children: [_jsxs("div", { className: "tool-header", children: [_jsx("h2", { className: "tool-title", children: "JSON Formatter" }), _jsx("p", { className: "tool-description", children: "Format and validate JSON data" })] }), _jsxs("div", { className: "tool-content", children: [_jsxs("div", { className: "tool-input-section", children: [_jsx("label", { className: "tool-label", children: "Input JSON" }), _jsx("textarea", { className: "tool-textarea", value: input, onChange: function (e) { return setInput(e.target.value); }, placeholder: '{"key": "value"}', rows: 10 })] }), _jsxs("div", { className: "tool-options", children: [_jsxs("div", { className: "tool-option", children: [_jsx("label", { className: "tool-label", children: "Indent" }), _jsx("input", { type: "number", className: "tool-input-small", value: indent, onChange: function (e) { return setIndent(Number(e.target.value)); }, min: 0, max: 8 })] }), _jsx("div", { className: "tool-option", children: _jsxs("label", { className: "tool-checkbox-label", children: [_jsx("input", { type: "checkbox", checked: sortKeys, onChange: function (e) { return setSortKeys(e.target.checked); } }), "Sort keys"] }) })] }), _jsxs("div", { className: "tool-actions", children: [_jsx("button", { className: "btn btn-primary", onClick: handleFormat, disabled: loading || !input, children: loading ? 'Processing...' : 'Format' }), _jsx("button", { className: "btn btn-secondary", onClick: handleMinify, disabled: loading || !input, children: "Minify" }), _jsx("button", { className: "btn btn-secondary", onClick: handleCopy, disabled: !output, children: "Copy" })] }), error && (_jsx("div", { className: "tool-error", children: error })), output && (_jsxs("div", { className: "tool-output-section", children: [_jsx("label", { className: "tool-label", children: "Output" }), _jsx("pre", { className: "tool-output", children: _jsx("code", { children: output }) })] }))] })] }));
}
export default JsonFormatter;
