interface ApiResponse<T> {
    success: boolean;
    [key: string]: any;
}
declare class ApiClient {
    private baseUrl;
    constructor(baseUrl?: string);
    private request;
    health(): Promise<ApiResponse<any>>;
    formatJson(data: string, indent?: number, sortKeys?: boolean): Promise<ApiResponse<{
        formatted: string;
        valid: boolean;
    }>>;
    minifyJson(data: string): Promise<ApiResponse<{
        minified: string;
        valid: boolean;
    }>>;
    encodeBase64(data: string): Promise<ApiResponse<{
        encoded: string;
    }>>;
    decodeBase64(data: string): Promise<ApiResponse<{
        decoded: string;
    }>>;
    testRegex(pattern: string, text: string, flags?: string): Promise<ApiResponse<{
        matches: any[];
        count: number;
    }>>;
    generateUuid(): Promise<ApiResponse<{
        uuid: string;
    }>>;
    generateHash(data: string, algorithm?: string): Promise<ApiResponse<{
        hash: string;
        algorithm: string;
    }>>;
    generatePassword(options?: {
        length?: number;
        include_uppercase?: boolean;
        include_lowercase?: boolean;
        include_numbers?: boolean;
        include_symbols?: boolean;
    }): Promise<ApiResponse<{
        password: string;
        length: number;
    }>>;
    checkPasswordStrength(password: string): Promise<ApiResponse<{
        strength: string;
        score: number;
        max_score: number;
        feedback: string[];
    }>>;
    wordCount(text: string): Promise<ApiResponse<{
        words: number;
        characters: number;
        characters_no_spaces: number;
        lines: number;
    }>>;
    convertCase(text: string): Promise<ApiResponse<any>>;
}
export declare const api: ApiClient;
export default api;
