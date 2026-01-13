// API client for z1x utility tools
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
var ApiClient = /** @class */ (function () {
    function ApiClient(baseUrl) {
        if (baseUrl === void 0) { baseUrl = API_BASE_URL; }
        this.baseUrl = baseUrl;
    }
    ApiClient.prototype.request = function (endpoint_1) {
        return __awaiter(this, arguments, void 0, function (endpoint, options) {
            var url, response, error;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.baseUrl).concat(endpoint);
                        return [4 /*yield*/, fetch(url, __assign(__assign({}, options), { headers: __assign({ 'Content-Type': 'application/json' }, options.headers) }))];
                    case 1:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json().catch(function () { return ({}); })];
                    case 2:
                        error = _a.sent();
                        throw new Error(error.detail || "HTTP ".concat(response.status, ": ").concat(response.statusText));
                    case 3: return [2 /*return*/, response.json()];
                }
            });
        });
    };
    // Health check
    ApiClient.prototype.health = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request('/health')];
            });
        });
    };
    // Developer Tools
    ApiClient.prototype.formatJson = function (data_1) {
        return __awaiter(this, arguments, void 0, function (data, indent, sortKeys) {
            if (indent === void 0) { indent = 2; }
            if (sortKeys === void 0) { sortKeys = false; }
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request('/developer/json/format', {
                        method: 'POST',
                        body: JSON.stringify({ data: data, indent: indent, sort_keys: sortKeys }),
                    })];
            });
        });
    };
    ApiClient.prototype.minifyJson = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request('/developer/json/minify', {
                        method: 'POST',
                        body: JSON.stringify({ data: data }),
                    })];
            });
        });
    };
    ApiClient.prototype.encodeBase64 = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request('/developer/base64/encode', {
                        method: 'POST',
                        body: JSON.stringify({ data: data }),
                    })];
            });
        });
    };
    ApiClient.prototype.decodeBase64 = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request('/developer/base64/decode', {
                        method: 'POST',
                        body: JSON.stringify({ data: data }),
                    })];
            });
        });
    };
    ApiClient.prototype.testRegex = function (pattern_1, text_1) {
        return __awaiter(this, arguments, void 0, function (pattern, text, flags) {
            if (flags === void 0) { flags = ''; }
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request('/developer/regex/test', {
                        method: 'POST',
                        body: JSON.stringify({ pattern: pattern, text: text, flags: flags }),
                    })];
            });
        });
    };
    ApiClient.prototype.generateUuid = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request('/developer/uuid/generate')];
            });
        });
    };
    // Security Tools
    ApiClient.prototype.generateHash = function (data_1) {
        return __awaiter(this, arguments, void 0, function (data, algorithm) {
            if (algorithm === void 0) { algorithm = 'sha256'; }
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request('/security/hash/generate', {
                        method: 'POST',
                        body: JSON.stringify({ data: data, algorithm: algorithm }),
                    })];
            });
        });
    };
    ApiClient.prototype.generatePassword = function () {
        return __awaiter(this, arguments, void 0, function (options) {
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request('/security/password/generate', {
                        method: 'POST',
                        body: JSON.stringify(__assign({ length: 16, include_uppercase: true, include_lowercase: true, include_numbers: true, include_symbols: true }, options)),
                    })];
            });
        });
    };
    ApiClient.prototype.checkPasswordStrength = function (password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request('/security/password/strength', {
                        method: 'POST',
                        body: JSON.stringify({ data: password }),
                    })];
            });
        });
    };
    // Data Tools
    ApiClient.prototype.wordCount = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request('/data/text/word-count', {
                        method: 'POST',
                        body: JSON.stringify({ data: text }),
                    })];
            });
        });
    };
    ApiClient.prototype.convertCase = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request('/data/text/case-convert', {
                        method: 'POST',
                        body: JSON.stringify({ data: text }),
                    })];
            });
        });
    };
    return ApiClient;
}());
// Export singleton instance
export var api = new ApiClient();
export default api;
