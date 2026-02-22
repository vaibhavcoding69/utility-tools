const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

interface ApiResponse<T = any> {
  success: boolean;
  [key: string]: T | boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.detail || `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    return response.json();
  }

  async health() {
    return this.request<ApiResponse>("/health");
  }

  async formatJson(
    data: string,
    indent: number = 2,
    sortKeys: boolean = false,
  ) {
    return this.request<ApiResponse>("/developer/json/format", {
      method: "POST",
      body: JSON.stringify({ data, indent, sort_keys: sortKeys }),
    });
  }

  async validateJson(data: string) {
    return this.request<ApiResponse>("/developer/json/validate", {
      method: "POST",
      body: JSON.stringify({ data }),
    });
  }

  async encodeBase64(data: string, urlSafe: boolean = false) {
    return this.request<ApiResponse>("/developer/base64/encode", {
      method: "POST",
      body: JSON.stringify({ data, url_safe: urlSafe }),
    });
  }

  async decodeBase64(data: string) {
    return this.request<ApiResponse>("/developer/base64/decode", {
      method: "POST",
      body: JSON.stringify({ data }),
    });
  }

  async encodeUrl(data: string) {
    return this.request<ApiResponse>("/developer/url/encode", {
      method: "POST",
      body: JSON.stringify({ data }),
    });
  }

  async decodeUrl(data: string) {
    return this.request<ApiResponse>("/developer/url/decode", {
      method: "POST",
      body: JSON.stringify({ data }),
    });
  }

  async testRegex(pattern: string, text: string, flags: string = "") {
    return this.request<ApiResponse>("/developer/regex/test", {
      method: "POST",
      body: JSON.stringify({ pattern, text, flags }),
    });
  }

  async generateUuid(version: number = 4, count: number = 1) {
    return this.request<ApiResponse>(
      `/developer/uuid/generate?version=${version}&count=${count}`,
    );
  }

  async diffText(original: string, modified: string, contextLines: number = 3) {
    return this.request<ApiResponse>("/developer/diff", {
      method: "POST",
      body: JSON.stringify({ original, modified, context_lines: contextLines }),
    });
  }

  async decodeJwt(token: string) {
    return this.request<ApiResponse>("/developer/jwt/decode", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  }

  async cronNext(expression: string, count: number = 5) {
    return this.request<ApiResponse>("/developer/cron/next", {
      method: "POST",
      body: JSON.stringify({ expression, count }),
    });
  }

  async httpPing(url: string, method: string = "GET") {
    return this.request<ApiResponse>("/developer/http/ping", {
      method: "POST",
      body: JSON.stringify({ url, method }),
    });
  }

  async yamlToJson(data: string) {
    return this.request<ApiResponse>("/developer/yaml-to-json", {
      method: "POST",
      body: JSON.stringify({ data }),
    });
  }

  async jsonToYaml(data: string) {
    return this.request<ApiResponse>("/developer/json-to-yaml", {
      method: "POST",
      body: JSON.stringify({ data }),
    });
  }

  async encode(
    data: string,
    encoding: string,
    options?: { shift?: number; key?: string; separator?: string }
  ) {
    return this.request<ApiResponse>("/developer/encode", {
      method: "POST",
      body: JSON.stringify({ data, encoding, mode: "encode", options }),
    });
  }

  async decode(
    data: string,
    encoding: string,
    options?: { shift?: number; key?: string }
  ) {
    return this.request<ApiResponse>("/developer/decode", {
      method: "POST",
      body: JSON.stringify({ data, encoding, mode: "decode", options }),
    });
  }

  async encodeDecode(
    data: string,
    encoding: string,
    mode: "encode" | "decode",
    options?: { shift?: number; key?: string; separator?: string }
  ) {
    return this.request<ApiResponse>("/developer/encode-decode", {
      method: "POST",
      body: JSON.stringify({ data, encoding, mode, options }),
    });
  }

  async listEncodings() {
    return this.request<ApiResponse>("/developer/encodings");
  }

  async generatePassword(
    options: {
      length?: number;
      include_uppercase?: boolean;
      include_lowercase?: boolean;
      include_numbers?: boolean;
      include_symbols?: boolean;
      exclude_ambiguous?: boolean;
      count?: number;
    } = {},
  ) {
    return this.request<ApiResponse>("/security/password/generate", {
      method: "POST",
      body: JSON.stringify({
        length: options.length ?? 16,
        include_uppercase: options.include_uppercase ?? true,
        include_lowercase: options.include_lowercase ?? true,
        include_numbers: options.include_numbers ?? true,
        include_symbols: options.include_symbols ?? true,
      }),
    });
  }

  async checkPasswordStrength(password: string) {
    return this.request<ApiResponse>("/security/password/strength", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
  }

  async checkPasswordPolicy(
    password: string,
    policy: {
      min_length?: number;
      require_uppercase?: boolean;
      require_lowercase?: boolean;
      require_numbers?: boolean;
      require_symbols?: boolean;
      banned_words?: string[];
    } = {},
  ) {
    return this.request<ApiResponse>("/security/password/policy", {
      method: "POST",
      body: JSON.stringify({ password, ...policy }),
    });
  }

  async generateHash(
    data: string,
    algorithm: string = "sha256",
    encoding: string = "hex",
  ) {
    return this.request<ApiResponse>("/security/hash/generate", {
      method: "POST",
      body: JSON.stringify({ data, algorithm, encoding }),
    });
  }

  async verifyHash(data: string, hash: string, algorithm: string = "sha256") {
    return this.request<ApiResponse>("/security/hash/verify", {
      method: "POST",
      body: JSON.stringify({ data, hash, algorithm }),
    });
  }

  async generateAllHashes(data: string) {
    return this.request<ApiResponse>("/security/hash/all", {
      method: "POST",
      body: JSON.stringify({ data, algorithm: "sha256" }),
    });
  }

  async generateHmac(data: string, key: string, algorithm: string = "sha256") {
    return this.request<ApiResponse>("/security/hmac/generate", {
      method: "POST",
      body: JSON.stringify({ data, key, algorithm }),
    });
  }

  async validateEmail(email: string) {
    return this.request<ApiResponse>("/security/validate/email", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async generateSecret(length: number = 32, format: string = "hex") {
    return this.request<ApiResponse>("/security/secret/generate", {
      method: "POST",
      body: JSON.stringify({ length, format }),
    });
  }

  async generateApiKey(prefix: string = "sk", length: number = 32) {
    return this.request<ApiResponse>(
      `/security/secret/api-key?prefix=${prefix}&length=${length}`,
    );
  }

  async calculateChecksum(data: string, algorithm: string = "crc32") {
    return this.request<ApiResponse>("/security/checksum/calculate", {
      method: "POST",
      body: JSON.stringify({ data, algorithm }),
    });
  }

  async generateTotp(secret?: string, digits: number = 6, period: number = 30) {
    return this.request<ApiResponse>("/security/otp/generate", {
      method: "POST",
      body: JSON.stringify({ secret, digits, period }),
    });
  }

  async shortenUrl(url: string, customSlug?: string) {
    return this.request<ApiResponse>("/security/url/shorten", {
      method: "POST",
      body: JSON.stringify({ url, custom_slug: customSlug }),
    });
  }

  async analyzeFileMetadata(fileData: string, fileName: string) {
    return this.request<ApiResponse>("/security/metadata/file", {
      method: "POST",
      body: JSON.stringify({ file_data: fileData, file_name: fileName }),
    });
  }

  async csvToJson(data: string) {
    return this.request<ApiResponse>("/data/csv-to-json", {
      method: "POST",
      body: JSON.stringify({ data }),
    });
  }

  async jsonToCsv(data: string) {
    return this.request<ApiResponse>("/data/json-to-csv", {
      method: "POST",
      body: JSON.stringify({ data }),
    });
  }

  async formatSql(data: string) {
    return this.request<ApiResponse>("/data/sql/format", {
      method: "POST",
      body: JSON.stringify({ data }),
    });
  }

  async minifySql(data: string) {
    return this.request<ApiResponse>("/data/sql/minify", {
      method: "POST",
      body: JSON.stringify({ data }),
    });
  }

  async generateFakeData(
    dataType: string,
    count: number = 10,
    locale: string = "en_US",
  ) {
    return this.request<ApiResponse>("/data/fake/generate", {
      method: "POST",
      body: JSON.stringify({ data_type: dataType, count, locale }),
    });
  }

  async envToNetlify(envText: string, siteName?: string) {
    return this.request<ApiResponse>("/developer/env/netlify", {
      method: "POST",
      body: JSON.stringify({ data: envText, site_name: siteName }),
    });
  }

  async harSummary(jsonString: string, maxEntries: number = 50) {
    return this.request<ApiResponse>("/developer/har/summary", {
      method: "POST",
      body: JSON.stringify({ data: jsonString, max_entries: maxEntries }),
    });
  }

  async inlineCss(html: string, baseUrl?: string) {
    return this.request<ApiResponse>("/developer/css/inline", {
      method: "POST",
      body: JSON.stringify({ html, base_url: baseUrl }),
    });
  }

  async resizeImage(
    data: string,
    opts: { width?: number; height?: number; format?: string; quality?: number } = {},
  ) {
    return this.request<ApiResponse>("/developer/image/resize", {
      method: "POST",
      body: JSON.stringify({ data, ...opts }),
    });
  }

  async randomString(options: {
    length?: number;
    uppercase?: boolean;
    lowercase?: boolean;
    digits?: boolean;
    symbols?: boolean;
  } = {}) {
    return this.request<ApiResponse>("/data/random/string", {
      method: "POST",
      body: JSON.stringify(options),
    });
  }

  async convertBase(value: string, fromBase: number, toBase: number) {
    return this.request<ApiResponse>("/data/base/convert", {
      method: "POST",
      body: JSON.stringify({ value, from_base: fromBase, to_base: toBase }),
    });
  }
}

export const api = new ApiClient();

export const encode = (data: string, encoding: string, options?: any) =>
  api.encode(data, encoding, options);

export const decode = (data: string, encoding: string, options?: any) =>
  api.decode(data, encoding, options);

export default api;
