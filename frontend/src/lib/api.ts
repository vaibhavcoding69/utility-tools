// API client for z1x utility tools

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface ApiResponse<T> {
  success: boolean;
  [key: string]: any;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Health check
  async health() {
    return this.request<ApiResponse<any>>('/health');
  }

  // Developer Tools
  async formatJson(data: string, indent: number = 2, sortKeys: boolean = false) {
    return this.request<ApiResponse<{ formatted: string; valid: boolean }>>('/developer/json/format', {
      method: 'POST',
      body: JSON.stringify({ data, indent, sort_keys: sortKeys }),
    });
  }

  async minifyJson(data: string) {
    return this.request<ApiResponse<{ minified: string; valid: boolean }>>('/developer/json/minify', {
      method: 'POST',
      body: JSON.stringify({ data }),
    });
  }

  async encodeBase64(data: string) {
    return this.request<ApiResponse<{ encoded: string }>>('/developer/base64/encode', {
      method: 'POST',
      body: JSON.stringify({ data }),
    });
  }

  async decodeBase64(data: string) {
    return this.request<ApiResponse<{ decoded: string }>>('/developer/base64/decode', {
      method: 'POST',
      body: JSON.stringify({ data }),
    });
  }

  async testRegex(pattern: string, text: string, flags: string = '') {
    return this.request<ApiResponse<{ matches: any[]; count: number }>>('/developer/regex/test', {
      method: 'POST',
      body: JSON.stringify({ pattern, text, flags }),
    });
  }

  async generateUuid() {
    return this.request<ApiResponse<{ uuid: string }>>('/developer/uuid/generate');
  }

  // Security Tools
  async generateHash(data: string, algorithm: string = 'sha256') {
    return this.request<ApiResponse<{ hash: string; algorithm: string }>>('/security/hash/generate', {
      method: 'POST',
      body: JSON.stringify({ data, algorithm }),
    });
  }

  async generatePassword(options: {
    length?: number;
    include_uppercase?: boolean;
    include_lowercase?: boolean;
    include_numbers?: boolean;
    include_symbols?: boolean;
  } = {}) {
    return this.request<ApiResponse<{ password: string; length: number }>>('/security/password/generate', {
      method: 'POST',
      body: JSON.stringify({
        length: 16,
        include_uppercase: true,
        include_lowercase: true,
        include_numbers: true,
        include_symbols: true,
        ...options,
      }),
    });
  }

  async checkPasswordStrength(password: string) {
    return this.request<ApiResponse<{ strength: string; score: number; max_score: number; feedback: string[] }>>('/security/password/strength', {
      method: 'POST',
      body: JSON.stringify({ data: password }),
    });
  }

  // Data Tools
  async wordCount(text: string) {
    return this.request<ApiResponse<{ words: number; characters: number; characters_no_spaces: number; lines: number }>>('/data/text/word-count', {
      method: 'POST',
      body: JSON.stringify({ data: text }),
    });
  }

  async convertCase(text: string) {
    return this.request<ApiResponse<any>>('/data/text/case-convert', {
      method: 'POST',
      body: JSON.stringify({ data: text }),
    });
  }
}

// Export singleton instance
export const api = new ApiClient();
export default api;
