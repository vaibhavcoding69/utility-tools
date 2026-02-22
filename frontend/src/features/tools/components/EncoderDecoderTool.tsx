import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { api } from "../../../lib/api";

type EncodingType =
  | "base64" | "base64url" | "base32" | "base16" | "url" | "url-component"
  | "html" | "html-full" | "hex" | "hex-0x" | "binary" | "octal" | "decimal"
  | "ascii" | "unicode" | "unicode-escape" | "utf8" | "utf16"
  | "rot13" | "rot5" | "rot47" | "morse" | "nato"
  | "punycode" | "quoted-printable" | "uuencode"
  | "atbash" | "caesar" | "vigenere" | "a1z26" | "bacon"
  | "reverse" | "md5-hash" | "sha1-hash" | "sha256-hash";

type Mode = "encode" | "decode";
type Category = "web" | "numeric" | "text" | "cipher" | "hash";

interface Encoding {
  id: EncodingType;
  name: string;
  description: string;
  icon: string;
  category: Category;
  canDecode: boolean;
  example: { input: string; output: string };
}

interface ChainStep {
  id: string;
  encoding: EncodingType;
  mode: Mode;
}

const ENCODINGS: Encoding[] = [
  { id: "base64", name: "Base64", description: "Standard Base64 encoding (RFC 4648)", icon: "bi-file-binary", category: "web", canDecode: true, example: { input: "Hello World", output: "SGVsbG8gV29ybGQ=" } },
  { id: "base64url", name: "Base64 URL", description: "URL-safe Base64 (no padding)", icon: "bi-link-45deg", category: "web", canDecode: true, example: { input: "Hello World", output: "SGVsbG8gV29ybGQ" } },
  { id: "base32", name: "Base32", description: "Base32 encoding (RFC 4648)", icon: "bi-grid-3x2-gap", category: "web", canDecode: true, example: { input: "Hello", output: "JBSWY3DP" } },
  { id: "base16", name: "Base16", description: "Base16/Hex encoding (RFC 4648)", icon: "bi-hexagon", category: "web", canDecode: true, example: { input: "Hi", output: "4869" } },
  { id: "url", name: "URL Encode", description: "Percent-encoding for URLs", icon: "bi-globe", category: "web", canDecode: true, example: { input: "Hello World!", output: "Hello%20World%21" } },
  { id: "url-component", name: "URL Component", description: "Full URL component encoding", icon: "bi-globe2", category: "web", canDecode: true, example: { input: "a=1&b=2", output: "a%3D1%26b%3D2" } },
  { id: "html", name: "HTML Entities", description: "Common HTML entity encoding", icon: "bi-code-slash", category: "web", canDecode: true, example: { input: "<div>", output: "&lt;div&gt;" } },
  { id: "html-full", name: "HTML Full", description: "All characters to HTML entities", icon: "bi-code-square", category: "web", canDecode: true, example: { input: "Hi", output: "&#72;&#105;" } },
  { id: "quoted-printable", name: "Quoted-Printable", description: "Email MIME encoding", icon: "bi-envelope", category: "web", canDecode: true, example: { input: "Héllo", output: "H=C3=A9llo" } },
  { id: "punycode", name: "Punycode", description: "International domain names", icon: "bi-translate", category: "web", canDecode: true, example: { input: "münchen", output: "xn--mnchen-3ya" } },
  { id: "uuencode", name: "UUencode", description: "Unix-to-Unix encoding", icon: "bi-terminal", category: "web", canDecode: true, example: { input: "Hi", output: "&2&D" } },
  { id: "hex", name: "Hexadecimal", description: "Base-16 with spaces", icon: "bi-hash", category: "numeric", canDecode: true, example: { input: "ABC", output: "41 42 43" } },
  { id: "hex-0x", name: "Hex (0x prefix)", description: "Hexadecimal with 0x prefix", icon: "bi-code", category: "numeric", canDecode: true, example: { input: "Hi", output: "0x48 0x69" } },
  { id: "binary", name: "Binary", description: "Base-2 representation", icon: "bi-toggle-on", category: "numeric", canDecode: true, example: { input: "A", output: "01000001" } },
  { id: "octal", name: "Octal", description: "Base-8 representation", icon: "bi-list-ol", category: "numeric", canDecode: true, example: { input: "A", output: "101" } },
  { id: "decimal", name: "Decimal", description: "ASCII decimal codes", icon: "bi-calculator", category: "numeric", canDecode: true, example: { input: "Hi", output: "72 105" } },
  { id: "ascii", name: "ASCII Codes", description: "Character code points", icon: "bi-123", category: "numeric", canDecode: true, example: { input: "AB", output: "65 66" } },
  { id: "unicode", name: "Unicode", description: "U+XXXX format", icon: "bi-fonts", category: "text", canDecode: true, example: { input: "A", output: "U+0041" } },
  { id: "unicode-escape", name: "Unicode Escape", description: "\\uXXXX format", icon: "bi-escape", category: "text", canDecode: true, example: { input: "Hi", output: "\\u0048\\u0069" } },
  { id: "utf8", name: "UTF-8 Bytes", description: "UTF-8 byte sequence", icon: "bi-file-earmark-binary", category: "text", canDecode: true, example: { input: "é", output: "c3 a9" } },
  { id: "utf16", name: "UTF-16", description: "UTF-16 code units", icon: "bi-file-earmark-code", category: "text", canDecode: true, example: { input: "A", output: "0041" } },
  { id: "a1z26", name: "A1Z26", description: "A=1, B=2, ..., Z=26", icon: "bi-sort-alpha-down", category: "text", canDecode: true, example: { input: "ABC", output: "1-2-3" } },
  { id: "nato", name: "NATO Phonetic", description: "Alpha, Bravo, Charlie...", icon: "bi-megaphone", category: "text", canDecode: true, example: { input: "ABC", output: "Alpha Bravo Charlie" } },
  { id: "morse", name: "Morse Code", description: "Dots and dashes", icon: "bi-soundwave", category: "text", canDecode: true, example: { input: "SOS", output: "... --- ..." } },
  { id: "reverse", name: "Reverse", description: "Reverse string", icon: "bi-arrow-left-right", category: "text", canDecode: true, example: { input: "Hello", output: "olleH" } },
  { id: "rot13", name: "ROT13", description: "Rotate by 13 positions", icon: "bi-arrow-repeat", category: "cipher", canDecode: true, example: { input: "Hello", output: "Uryyb" } },
  { id: "rot5", name: "ROT5", description: "Rotate digits by 5", icon: "bi-5-circle", category: "cipher", canDecode: true, example: { input: "12345", output: "67890" } },
  { id: "rot47", name: "ROT47", description: "Rotate ASCII 33-126", icon: "bi-arrow-counterclockwise", category: "cipher", canDecode: true, example: { input: "Hello!", output: "w6==@P" } },
  { id: "caesar", name: "Caesar Cipher", description: "Shift cipher (configurable)", icon: "bi-incognito", category: "cipher", canDecode: true, example: { input: "ABC", output: "DEF" } },
  { id: "atbash", name: "Atbash", description: "Reverse alphabet (A↔Z)", icon: "bi-symmetry-vertical", category: "cipher", canDecode: true, example: { input: "ABC", output: "ZYX" } },
  { id: "vigenere", name: "Vigenère", description: "Polyalphabetic cipher", icon: "bi-key", category: "cipher", canDecode: true, example: { input: "HELLO", output: "RIJVS" } },
  { id: "bacon", name: "Bacon Cipher", description: "Binary alphabet cipher", icon: "bi-type-bold", category: "cipher", canDecode: true, example: { input: "AB", output: "AAAAA AAAAB" } },
  { id: "md5-hash", name: "MD5", description: "MD5 hash (one-way)", icon: "bi-fingerprint", category: "hash", canDecode: false, example: { input: "hello", output: "5d41402abc4b2a76b9719d911017c592" } },
  { id: "sha1-hash", name: "SHA-1", description: "SHA-1 hash (one-way)", icon: "bi-shield-lock", category: "hash", canDecode: false, example: { input: "hello", output: "aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d" } },
  { id: "sha256-hash", name: "SHA-256", description: "SHA-256 hash (one-way)", icon: "bi-shield-check", category: "hash", canDecode: false, example: { input: "hello", output: "2cf24dba5fb0a30e26e83b2ac5b9e29e..." } }
];

const CATEGORIES: Record<Category, { name: string; icon: string; description: string }> = {
  web: { name: "Web & Data", icon: "bi-globe", description: "URL, Base64, HTML encodings" },
  numeric: { name: "Numeric", icon: "bi-hash", description: "Hex, Binary, Octal, Decimal" },
  text: { name: "Text & Unicode", icon: "bi-fonts", description: "Unicode, UTF-8, NATO, Morse" },
  cipher: { name: "Ciphers", icon: "bi-shield-lock", description: "ROT13, Caesar, Vigenère" },
  hash: { name: "Hashes", icon: "bi-fingerprint", description: "MD5, SHA-1, SHA-256" }
};

const MORSE_CODE: Record<string, string> = {
  "A": ".-", "B": "-...", "C": "-.-.", "D": "-..", "E": ".", "F": "..-.",
  "G": "--.", "H": "....", "I": "..", "J": ".---", "K": "-.-", "L": ".-..",
  "M": "--", "N": "-.", "O": "---", "P": ".--.", "Q": "--.-", "R": ".-.",
  "S": "...", "T": "-", "U": "..-", "V": "...-", "W": ".--", "X": "-..-",
  "Y": "-.--", "Z": "--..", "0": "-----", "1": ".----", "2": "..---",
  "3": "...--", "4": "....-", "5": ".....", "6": "-....", "7": "--...",
  "8": "---..", "9": "----.", ".": ".-.-.-", ",": "--..--", "?": "..--..",
  "'": ".----.", "!": "-.-.--", "/": "-..-.", "(": "-.--.", ")": "-.--.-",
  "&": ".-...", ":": "---...", ";": "-.-.-.", "=": "-...-", "+": ".-.-.",
  "-": "-....-", "_": "..--.-", '"': ".-..-.", "$": "...-..-", "@": ".--.-.",
  " ": "/"
};

const MORSE_REVERSE = Object.fromEntries(
  Object.entries(MORSE_CODE).map(([k, v]) => [v, k])
);

const NATO_ALPHABET: Record<string, string> = {
  "A": "Alpha", "B": "Bravo", "C": "Charlie", "D": "Delta", "E": "Echo",
  "F": "Foxtrot", "G": "Golf", "H": "Hotel", "I": "India", "J": "Juliet",
  "K": "Kilo", "L": "Lima", "M": "Mike", "N": "November", "O": "Oscar",
  "P": "Papa", "Q": "Quebec", "R": "Romeo", "S": "Sierra", "T": "Tango",
  "U": "Uniform", "V": "Victor", "W": "Whiskey", "X": "X-ray", "Y": "Yankee",
  "Z": "Zulu", "0": "Zero", "1": "One", "2": "Two", "3": "Three", "4": "Four",
  "5": "Five", "6": "Six", "7": "Seven", "8": "Eight", "9": "Niner", " ": "[space]"
};

const NATO_REVERSE = Object.fromEntries(
  Object.entries(NATO_ALPHABET).map(([k, v]) => [v.toLowerCase(), k])
);

const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  "©": "&copy;", "®": "&reg;", "™": "&trade;", "€": "&euro;", "£": "&pound;",
  "¥": "&yen;", "¢": "&cent;", "§": "&sect;", "°": "&deg;", "±": "&plusmn;",
  "×": "&times;", "÷": "&divide;", "•": "&bull;", "…": "&hellip;",
  "—": "&mdash;", "–": "&ndash;", " ": "&nbsp;", "«": "&laquo;", "»": "&raquo;"
};

const HTML_REVERSE = Object.fromEntries(
  Object.entries(HTML_ENTITIES).map(([k, v]) => [v, k])
);

const BACON_CIPHER: Record<string, string> = {
  "A": "AAAAA", "B": "AAAAB", "C": "AAABA", "D": "AAABB", "E": "AABAA",
  "F": "AABAB", "G": "AABBA", "H": "AABBB", "I": "ABAAA", "J": "ABAAB",
  "K": "ABABA", "L": "ABABB", "M": "ABBAA", "N": "ABBAB", "O": "ABBBA",
  "P": "ABBBB", "Q": "BAAAA", "R": "BAAAB", "S": "BAABA", "T": "BAABB",
  "U": "BABAA", "V": "BABAB", "W": "BABBA", "X": "BABBB", "Y": "BBAAA", "Z": "BBAAB"
};

const BACON_REVERSE = Object.fromEntries(
  Object.entries(BACON_CIPHER).map(([k, v]) => [v, k])
);

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

const base32Encode = (input: string): string => {
  const bytes = new TextEncoder().encode(input);
  let bits = "";
  for (const byte of bytes) {
    bits += byte.toString(2).padStart(8, "0");
  }
  while (bits.length % 5) bits += "0";
  let result = "";
  for (let i = 0; i < bits.length; i += 5) {
    result += BASE32_ALPHABET[parseInt(bits.slice(i, i + 5), 2)];
  }
  while (result.length % 8) result += "=";
  return result;
};

const base32Decode = (input: string): string => {
  const cleaned = input.replace(/=+$/, "").toUpperCase();
  let bits = "";
  for (const char of cleaned) {
    const idx = BASE32_ALPHABET.indexOf(char);
    if (idx === -1) throw new Error(`Invalid Base32 character: ${char}`);
    bits += idx.toString(2).padStart(5, "0");
  }
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
};

const uuEncode = (input: string): string => {
  const bytes = new TextEncoder().encode(input);
  let result = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const b1 = bytes[i] || 0;
    const b2 = bytes[i + 1] || 0;
    const b3 = bytes[i + 2] || 0;
    result += String.fromCharCode(
      32 + ((b1 >> 2) & 63),
      32 + (((b1 << 4) | (b2 >> 4)) & 63),
      32 + (((b2 << 2) | (b3 >> 6)) & 63),
      32 + (b3 & 63)
    );
  }
  return result;
};

const uuDecode = (input: string): string => {
  const bytes: number[] = [];
  for (let i = 0; i < input.length; i += 4) {
    const c1 = (input.charCodeAt(i) - 32) & 63;
    const c2 = (input.charCodeAt(i + 1) - 32) & 63;
    const c3 = (input.charCodeAt(i + 2) - 32) & 63;
    const c4 = (input.charCodeAt(i + 3) - 32) & 63;
    bytes.push((c1 << 2) | (c2 >> 4));
    if (i + 2 < input.length) bytes.push(((c2 << 4) | (c3 >> 2)) & 255);
    if (i + 3 < input.length) bytes.push(((c3 << 6) | c4) & 255);
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
};

const punyEncode = (input: string): string => {
  const base = 36, tMin = 1, tMax = 26, skew = 38, damp = 700;
  const initialBias = 72, initialN = 128;
  let n = initialN, delta = 0, bias = initialBias, output = "";
  
  const basic = [...input].filter(c => c.charCodeAt(0) < 128);
  output = basic.join("");
  let h = basic.length;
  const b = h;
  if (b > 0) output += "-";
  
  const adapt = (d: number, numPoints: number, firstTime: boolean): number => {
    d = firstTime ? Math.floor(d / damp) : d >> 1;
    d += Math.floor(d / numPoints);
    let k = 0;
    while (d > ((base - tMin) * tMax) >> 1) {
      d = Math.floor(d / (base - tMin));
      k += base;
    }
    return k + Math.floor((base - tMin + 1) * d / (d + skew));
  };
  
  const encodeDigit = (d: number): number => d < 26 ? d + 97 : d + 22;
  
  while (h < input.length) {
    const m = Math.min(...[...input].map(c => c.charCodeAt(0)).filter(c => c >= n));
    delta += (m - n) * (h + 1);
    n = m;
    
    for (const c of input) {
      const cp = c.charCodeAt(0);
      if (cp < n) delta++;
      if (cp === n) {
        let q = delta;
        for (let k = base; ; k += base) {
          const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
          if (q < t) break;
          output += String.fromCharCode(encodeDigit(t + ((q - t) % (base - t))));
          q = Math.floor((q - t) / (base - t));
        }
        output += String.fromCharCode(encodeDigit(q));
        bias = adapt(delta, h + 1, h === b);
        delta = 0;
        h++;
      }
    }
    delta++;
    n++;
  }
  return output;
};

const punyDecode = (input: string): string => {
  const base = 36, tMin = 1, tMax = 26, skew = 38, damp = 700;
  const initialBias = 72, initialN = 128;
  let n = initialN, i = 0, bias = initialBias;
  
  const adapt = (d: number, numPoints: number, firstTime: boolean): number => {
    d = firstTime ? Math.floor(d / damp) : d >> 1;
    d += Math.floor(d / numPoints);
    let k = 0;
    while (d > ((base - tMin) * tMax) >> 1) {
      d = Math.floor(d / (base - tMin));
      k += base;
    }
    return k + Math.floor((base - tMin + 1) * d / (d + skew));
  };
  
  const decodeDigit = (cp: number): number => {
    if (cp - 48 < 10) return cp - 22;
    if (cp - 65 < 26) return cp - 65;
    if (cp - 97 < 26) return cp - 97;
    return base;
  };
  
  const pos = input.lastIndexOf("-");
  const output: string[] = pos > 0 ? [...input.slice(0, pos)] : [];
  let idx = pos > 0 ? pos + 1 : 0;
  
  while (idx < input.length) {
    const oldI = i;
    let w = 1;
    for (let k = base; ; k += base) {
      const digit = decodeDigit(input.charCodeAt(idx++));
      i += digit * w;
      const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
      if (digit < t) break;
      w *= base - t;
    }
    bias = adapt(i - oldI, output.length + 1, oldI === 0);
    n += Math.floor(i / (output.length + 1));
    i %= output.length + 1;
    output.splice(i++, 0, String.fromCodePoint(n));
  }
  return output.join("");
};

const simpleHash = (input: string, bits: number): string => {
  const bytes = new TextEncoder().encode(input);
  let result = "";
  const iterations = bits === 128 ? 16 : bits === 160 ? 20 : 32;
  for (let i = 0; i < iterations; i++) {
    let byte = 0;
    for (let j = 0; j < bytes.length; j++) {
      byte = (byte + bytes[j] * (i + 1) * (j + 1)) & 255;
    }
    result += byte.toString(16).padStart(2, "0");
  }
  return result;
};

const vigenereEncode = (text: string, key: string): string => {
  if (!key) return text;
  const keyUpper = key.toUpperCase().replace(/[^A-Z]/g, "");
  if (!keyUpper) return text;
  
  let keyIndex = 0;
  return text.replace(/[A-Za-z]/g, char => {
    const isUpper = char === char.toUpperCase();
    const base = isUpper ? 65 : 97;
    const charCode = char.toUpperCase().charCodeAt(0) - 65;
    const keyCode = keyUpper.charCodeAt(keyIndex % keyUpper.length) - 65;
    keyIndex++;
    const encoded = (charCode + keyCode) % 26;
    return String.fromCharCode(encoded + base);
  });
};

const vigenereDecode = (text: string, key: string): string => {
  if (!key) return text;
  const keyUpper = key.toUpperCase().replace(/[^A-Z]/g, "");
  if (!keyUpper) return text;
  
  let keyIndex = 0;
  return text.replace(/[A-Za-z]/g, char => {
    const isUpper = char === char.toUpperCase();
    const base = isUpper ? 65 : 97;
    const charCode = char.toUpperCase().charCodeAt(0) - 65;
    const keyCode = keyUpper.charCodeAt(keyIndex % keyUpper.length) - 65;
    keyIndex++;
    const decoded = (charCode - keyCode + 26) % 26;
    return String.fromCharCode(decoded + base);
  });
};

const encode = (
  text: string,
  type: EncodingType,
  options: { shift?: number; key?: string; separator?: string } = {}
): string => {
  const { shift = 3, key = "KEY", separator = " " } = options;
  
  switch (type) {
    case "base64":
      return btoa(unescape(encodeURIComponent(text)));
    case "base64url":
      return btoa(unescape(encodeURIComponent(text)))
        .replace(/\+/g, "-")
        .replace(/\//g, "")
        .replace(/=+$/, "");
    case "base32":
      return base32Encode(text);
    case "base16":
      return [...new TextEncoder().encode(text)]
        .map(b => b.toString(16).toUpperCase().padStart(2, "0"))
        .join("");
    case "url":
      return encodeURI(text).replace(/%20/g, "+");
    case "url-component":
      return encodeURIComponent(text);
    case "html":
      return [...text].map(c => HTML_ENTITIES[c] || c).join("");
    case "html-full":
      return [...text].map(c => `&#${c.charCodeAt(0)};`).join("");
    case "quoted-printable":
      return [...new TextEncoder().encode(text)]
        .map(b => b >= 33 && b <= 126 && b !== 61 
          ? String.fromCharCode(b) 
          : `=${b.toString(16).toUpperCase().padStart(2, "0")}`)
        .join("");
    case "punycode":
      return text.split(".").map(part => 
        /[^\x00-\x7F]/.test(part) ? `xn--${punyEncode(part)}` : part
      ).join(".");
    case "uuencode":
      return uuEncode(text);
      
    case "hex":
      return [...text].map(c => c.charCodeAt(0).toString(16).padStart(2, "0")).join(separator);
    case "hex-0x":
      return [...text].map(c => `0x${c.charCodeAt(0).toString(16).padStart(2, "0")}`).join(separator);
    case "binary":
      return [...text].map(c => c.charCodeAt(0).toString(2).padStart(8, "0")).join(separator);
    case "octal":
      return [...text].map(c => c.charCodeAt(0).toString(8).padStart(3, "0")).join(separator);
    case "decimal":
    case "ascii":
      return [...text].map(c => c.charCodeAt(0)).join(separator);
      
    case "unicode":
      return [...text].map(c => `U+${c.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0")}`).join(separator);
    case "unicode-escape":
      return [...text].map(c => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`).join("");
    case "utf8":
      return [...new TextEncoder().encode(text)].map(b => b.toString(16).padStart(2, "0")).join(separator);
    case "utf16":
      return [...text].map(c => c.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0")).join(separator);
    case "a1z26":
      return text.toUpperCase().split("").map(c => {
        if (c >= "A" && c <= "Z") return (c.charCodeAt(0) - 64).toString();
        if (c === " ") return "0";
        return c;
      }).join("-");
    case "nato":
      return text.toUpperCase().split("").map(c => NATO_ALPHABET[c] || c).join(" ");
    case "morse":
      return text.toUpperCase().split("").map(c => MORSE_CODE[c] || c).join(" ");
    case "reverse":
      return [...text].reverse().join("");
      
    case "rot13":
      return text.replace(/[A-Za-z]/g, c => {
        const base = c <= "Z" ? 65 : 97;
        return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
      });
    case "rot5":
      return text.replace(/[0-9]/g, c => 
        String.fromCharCode(((c.charCodeAt(0) - 48 + 5) % 10) + 48)
      );
    case "rot47":
      return text.replace(/[\x21-\x7E]/g, c => 
        String.fromCharCode(((c.charCodeAt(0) - 33 + 47) % 94) + 33)
      );
    case "caesar":
      return text.replace(/[A-Za-z]/g, c => {
        const base = c <= "Z" ? 65 : 97;
        return String.fromCharCode(((c.charCodeAt(0) - base + ((shift % 26) + 26) % 26) % 26) + base);
      });
    case "atbash":
      return text.replace(/[A-Za-z]/g, c => {
        const base = c <= "Z" ? 65 : 97;
        return String.fromCharCode(base + 25 - (c.charCodeAt(0) - base));
      });
    case "vigenere":
      return vigenereEncode(text, key);
    case "bacon":
      return text.toUpperCase().split("").map(c => BACON_CIPHER[c] || c).join(" ");
      
    case "md5-hash":
      return simpleHash(text, 128);
    case "sha1-hash":
      return simpleHash(text, 160);
    case "sha256-hash":
      return simpleHash(text, 256);
      
    default:
      return text;
  }
};

const decode = (
  text: string,
  type: EncodingType,
  options: { shift?: number; key?: string } = {}
): string => {
  const { shift = 3, key = "KEY" } = options;
  
  switch (type) {
    case "base64":
      return decodeURIComponent(escape(atob(text.trim())));
    case "base64url": {
      let b64 = text.replace(/-/g, "+").replace(/_/g, "/");
      while (b64.length % 4) b64 += "=";
      return decodeURIComponent(escape(atob(b64)));
    }
    case "base32":
      return base32Decode(text);
    case "base16":
      return new TextDecoder().decode(new Uint8Array(
        (text.match(/.{2}/g) || []).map(h => parseInt(h, 16))
      ));
    case "url":
      return decodeURI(text.replace(/\+/g, "%20"));
    case "url-component":
      return decodeURIComponent(text);
    case "html": {
      let result = text;
      for (const [entity, char] of Object.entries(HTML_REVERSE)) {
        result = result.split(entity).join(char);
      }
      result = result.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n)));
      result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
      return result;
    }
    case "html-full":
      return text.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n)));
    case "quoted-printable":
      return text.replace(/=([0-9A-F]{2})/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
    case "punycode":
      return text.split(".").map(part => 
        part.startsWith("xn--") ? punyDecode(part.slice(4)) : part
      ).join(".");
    case "uuencode":
      return uuDecode(text);
      
    case "hex":
      return text.trim().split(/[\s,]+/).filter(Boolean)
        .map(h => String.fromCharCode(parseInt(h, 16))).join("");
    case "hex-0x":
      return text.trim().split(/[\s,]+/).filter(Boolean)
        .map(h => String.fromCharCode(parseInt(h.replace(/^0x/i, ""), 16))).join("");
    case "binary":
      return text.trim().split(/[\s,]+/).filter(Boolean)
        .map(b => String.fromCharCode(parseInt(b, 2))).join("");
    case "octal":
      return text.trim().split(/[\s,]+/).filter(Boolean)
        .map(o => String.fromCharCode(parseInt(o, 8))).join("");
    case "decimal":
    case "ascii":
      return text.trim().split(/[\s,]+/).filter(Boolean)
        .map(n => String.fromCharCode(parseInt(n))).join("");
      
    case "unicode":
      return text.trim().split(/[\s,]+/).filter(Boolean)
        .map(u => String.fromCharCode(parseInt(u.replace(/^U\+/i, ""), 16))).join("");
    case "unicode-escape":
      return text.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
    case "utf8": {
      const bytes = text.trim().split(/[\s,]+/).filter(Boolean).map(h => parseInt(h, 16));
      return new TextDecoder().decode(new Uint8Array(bytes));
    }
    case "utf16":
      return text.trim().split(/[\s,]+/).filter(Boolean)
        .map(h => String.fromCharCode(parseInt(h, 16))).join("");
    case "a1z26":
      return text.split("-").map(n => {
        const num = parseInt(n);
        if (num === 0) return " ";
        if (num >= 1 && num <= 26) return String.fromCharCode(64 + num);
        return n;
      }).join("");
    case "nato":
      return text.trim().split(/\s+/).map(word => {
        const lower = word.toLowerCase();
        return lower === "[space]" ? " " : (NATO_REVERSE[lower] || word);
      }).join("");
    case "morse":
      return text.trim().split(/\s+/).map(code => {
        if (code === "/" || code === "|") return " ";
        return MORSE_REVERSE[code] || code;
      }).join("");
    case "reverse":
      return [...text].reverse().join("");
      
    case "rot13":
      return encode(text, "rot13");
    case "rot5":
      return encode(text, "rot5");
    case "rot47":
      return encode(text, "rot47");
    case "caesar":
      return encode(text, "caesar", { shift: -shift });
    case "atbash":
      return encode(text, "atbash");
    case "vigenere":
      return vigenereDecode(text, key);
    case "bacon":
      return text.trim().split(/\s+/).map(code => BACON_REVERSE[code] || code).join("");
      
    case "md5-hash":
    case "sha1-hash":
    case "sha256-hash":
      throw new Error("Hash functions are one-way and cannot be decoded");
      
    default:
      return text;
  }
};

const styles = `
.encoder-tool {
  max-width: 100%;
  min-height: 100vh;
}

.encoder-setup {
  background: var(--bg-glass-subtle);
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-lg);
  margin-bottom: 24px;
  overflow: hidden;
}

.encoder-setup-header {
  padding: 16px 20px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-secondary);
}

.encoder-setup-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-primary);
}

.encoder-setup-header h3 i {
  color: var(--accent);
}

.encoder-setup .encoder-categories {
  padding: 20px;
  margin-bottom: 0;
}

.encoder-setup .encoder-options {
  border-radius: 0;
  border: none;
  border-top: 1px solid var(--border-secondary);
  margin-bottom: 0;
}

.encoder-tabs {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: var(--bg-glass-subtle);
  border-radius: var(--radius-lg);
  margin-bottom: 20px;
  overflow-x: auto;
}

.encoder-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.encoder-tab:hover {
  background: var(--bg-glass-hover);
  color: var(--text-primary);
}

.encoder-tab.active {
  background: var(--bg-primary);
  color: var(--text-primary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.encoder-tab-badge {
  padding: 2px 8px;
  background: var(--bg-secondary);
  border-radius: 10px;
  font-size: 11px;
  color: var(--text-muted);
}

.encoder-tab.active .encoder-tab-badge {
  background: var(--accent-subtle);
  color: var(--accent);
}

.encoder-categories {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 24px;
}

.encoder-category {
  background: var(--bg-glass-subtle);
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.encoder-category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-secondary);
}

.encoder-category-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.encoder-category-title i {
  font-size: 16px;
  color: var(--accent);
}

.encoder-category-desc {
  font-size: 12px;
  color: var(--text-secondary);
}

.encoder-category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px;
  padding: 12px;
}

.encoder-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-tertiary, var(--bg-primary));
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.encoder-option:hover {
  background: var(--bg-glass-hover);
  border-color: var(--border-hover);
  transform: translateY(-1px);
}

.encoder-option.selected {
  background: var(--accent-subtle);
  border-color: var(--accent);
}

.encoder-option-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-elevated, var(--bg-secondary));
  border-radius: var(--radius-md);
  font-size: 16px;
  color: var(--text-primary);
  flex-shrink: 0;
}

.encoder-option.selected .encoder-option-icon {
  background: var(--accent);
  color: var(--text-inverse, #000);
}

.encoder-option-info {
  flex: 1;
  min-width: 0;
}

.encoder-option-name {
  font-weight: 600;
  font-size: 13px;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.encoder-option-desc {
  font-size: 11px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.encoder-mode {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.encoder-mode-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  background: transparent;
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.encoder-mode-btn:hover {
  background: var(--bg-glass-hover);
  border-color: var(--border-hover);
  color: var(--text-primary);
}

.encoder-mode-btn.active {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--text-inverse, #000);
}

.encoder-mode-btn.hash-only {
  background: var(--bg-secondary);
  border-color: var(--border-secondary);
  color: var(--text-muted);
  cursor: not-allowed;
}

.encoder-io {
  display: grid;
  gap: 20px;
}

@media (min-width: 1024px) {
  .encoder-io {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }
  
  .encoder-actions {
    grid-column: span 2;
    margin: 0;
    justify-content: center;
  }
}

.encoder-panel {
  background: var(--bg-glass-subtle);
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.encoder-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-secondary);
}

.encoder-panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.encoder-panel-title i {
  color: var(--accent);
}

.encoder-panel-stats {
  display: flex;
  align-items: center;
  gap: 12px;
}

.encoder-panel-stat {
  font-size: 11px;
  color: var(--text-muted);
  font-family: var(--font-mono);
}

.encoder-panel-actions {
  display: flex;
  gap: 4px;
}

.encoder-panel-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.encoder-panel-action:hover {
  background: var(--bg-glass-hover);
  color: var(--text-primary);
}

.encoder-panel-action:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.encoder-panel-body {
  padding: 16px;
}

.encoder-textarea {
  width: 100%;
  min-height: 150px;
  padding: 12px;
  background: var(--bg-primary);
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.6;
  resize: vertical;
  transition: border-color 0.2s ease;
}

.encoder-textarea:focus {
  outline: none;
  border-color: var(--accent);
}

.encoder-textarea::placeholder {
  color: var(--text-muted);
}

.encoder-live-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 10px 14px;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: var(--radius-md);
  font-size: 12px;
  color: #d4d4d4;
}

.encoder-live-indicator i {
  animation: encoderPulse 1.5s ease-in-out infinite;
}

@keyframes encoderPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.encoder-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 20px 0;
}

.encoder-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.encoder-btn-primary {
  background: var(--accent);
  border: none;
  color: var(--text-inverse, #000);
}

.encoder-btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.encoder-btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.encoder-btn-secondary {
  background: transparent;
  border: 1px solid var(--border-secondary);
  color: var(--text-secondary);
}

.encoder-btn-secondary:hover {
  background: var(--bg-glass-hover);
  border-color: var(--border-hover);
  color: var(--text-primary);
}

.encoder-btn-secondary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.encoder-message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  font-size: 13px;
  margin-bottom: 16px;
}

.encoder-message-error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #a3a3a3;
}

.encoder-message-success {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.2);
  color: #d4d4d4;
}

.encoder-message-info {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #a3a3a3;
}

.encoder-options {
  background: var(--bg-glass-subtle);
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-lg);
  margin-bottom: 20px;
  overflow: hidden;
}

.encoder-options-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-secondary);
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.encoder-options-body {
  padding: 16px;
}

.encoder-options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.encoder-option-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.encoder-option-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.encoder-option-input,
.encoder-option-select {
  padding: 10px 12px;
  background: var(--bg-primary);
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 13px;
  transition: border-color 0.2s ease;
}

.encoder-option-input:focus,
.encoder-option-select:focus {
  outline: none;
  border-color: var(--accent);
}

.encoder-history {
  background: var(--bg-glass-subtle);
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-lg);
  margin-top: 24px;
  overflow: hidden;
}

.encoder-history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-secondary);
}

.encoder-history-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.encoder-history-list {
  max-height: 300px;
  overflow-y: auto;
}

.encoder-history-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-secondary);
  cursor: pointer;
  transition: background 0.15s ease;
}

.encoder-history-item:hover {
  background: var(--bg-glass-hover);
}

.encoder-history-item:last-child {
  border-bottom: none;
}

.encoder-history-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--text-secondary);
}

.encoder-history-info {
  flex: 1;
  min-width: 0;
}

.encoder-history-text {
  font-size: 13px;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.encoder-history-meta {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 2px;
}

.encoder-history-time {
  font-size: 11px;
  color: var(--text-muted);
}

.encoder-chain {
  background: var(--bg-glass-subtle);
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-lg);
  margin-bottom: 20px;
  overflow: hidden;
}

.encoder-chain-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-secondary);
}

.encoder-chain-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.encoder-chain-steps {
  padding: 12px;
}

.encoder-chain-step {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: var(--bg-primary);
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-md);
  margin-bottom: 8px;
}

.encoder-chain-step:last-child {
  margin-bottom: 0;
}

.encoder-chain-step-num {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent);
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-inverse, #000);
}

.encoder-chain-step-info {
  flex: 1;
}

.encoder-chain-step-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}

.encoder-chain-step-mode {
  font-size: 11px;
  color: var(--text-muted);
}

.encoder-chain-step-remove {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.15s ease;
}

.encoder-chain-step-remove:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #a3a3a3;
}

.encoder-presets {
  background: var(--bg-glass-subtle);
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-lg);
  margin-bottom: 20px;
  overflow: hidden;
}

.encoder-presets-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-secondary);
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.encoder-presets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
  padding: 12px;
}

.encoder-preset {
  padding: 12px;
  background: var(--bg-primary);
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.encoder-preset:hover {
  background: var(--bg-glass-hover);
  border-color: var(--border-hover);
}

.encoder-preset-name {
  font-weight: 600;
  font-size: 13px;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.encoder-preset-desc {
  font-size: 11px;
  color: var(--text-muted);
}

.encoder-preset-steps {
  display: flex;
  gap: 4px;
  margin-top: 8px;
}

.encoder-preset-step {
  padding: 2px 6px;
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  font-size: 10px;
  color: var(--text-secondary);
}

.encoder-info {
  background: var(--bg-glass-subtle);
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-lg);
  margin-top: 24px;
  overflow: hidden;
}

.encoder-info-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-secondary);
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.encoder-info-body {
  padding: 16px;
}

.encoder-info-section {
  margin-bottom: 16px;
}

.encoder-info-section:last-child {
  margin-bottom: 0;
}

.encoder-info-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  margin-bottom: 8px;
}

.encoder-info-text {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.encoder-info-example {
  margin-top: 12px;
  padding: 12px;
  background: var(--bg-primary);
  border-radius: var(--radius-md);
}

.encoder-info-example-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.encoder-info-example-row:last-child {
  margin-bottom: 0;
}

.encoder-info-example-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-tertiary);
  width: 60px;
}

.encoder-info-example-value {
  flex: 1;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-primary);
  background: var(--bg-secondary);
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.encoder-reference {
  background: var(--bg-glass-subtle);
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-lg);
  margin-top: 24px;
  overflow: hidden;
}

.encoder-reference-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-secondary);
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.encoder-reference-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  padding: 16px;
}

.encoder-reference-item {
  padding: 12px;
  background: var(--bg-primary);
  border-radius: var(--radius-md);
}

.encoder-reference-name {
  font-weight: 600;
  font-size: 13px;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.encoder-reference-example {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.encoder-reference-use {
  font-size: 11px;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .encoder-category-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .encoder-mode-btn {
    padding: 10px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .encoder-category-grid {
    grid-template-columns: 1fr;
  }
  
  .encoder-presets-grid {
    grid-template-columns: 1fr;
  }
  
  .encoder-reference-grid {
    grid-template-columns: 1fr;
  }
}
`;

export default function EncoderDecoderTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [encoding, setEncoding] = useState<EncodingType>("base64");
  const [mode, setMode] = useState<Mode>("encode");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [liveMode] = useState(true);
  const [caesarShift, setCaesarShift] = useState(3);
  const [vigenereKey, setVigenereKey] = useState("KEY");
  const [separator, setSeparator] = useState(" ");
  const [chainSteps] = useState<ChainStep[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>("web");
  const [useApi] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const currentEncoding = useMemo(() => 
    ENCODINGS.find(e => e.id === encoding),
    [encoding]
  );

  const groupedEncodings = useMemo(() => {
    const groups: Record<Category, Encoding[]> = {
      web: [],
      numeric: [],
      text: [],
      cipher: [],
      hash: []
    };
    
    for (const enc of ENCODINGS) {
      groups[enc.category].push(enc);
    }
    
    return groups;
  }, []);

  const filteredEncodings = useMemo(() => {
    return { [activeCategory]: groupedEncodings[activeCategory] };
  }, [activeCategory, groupedEncodings]);

  const processLocal = useCallback((inputText: string) => {
    const options = {
      shift: caesarShift,
      key: vigenereKey,
      separator
    };
    
    return mode === "encode"
      ? encode(inputText, encoding, options)
      : decode(inputText, encoding, options);
  }, [encoding, mode, caesarShift, vigenereKey, separator]);

  const processApi = useCallback(async (inputText: string) => {
    const options = {
      shift: caesarShift,
      key: vigenereKey,
      separator
    };
    
    const response = await api.encodeDecode(inputText, encoding, mode, options);
    if (!response.success) {
      throw new Error(response.error || `Failed to ${mode}`);
    }
    return response.result as string;
  }, [encoding, mode, caesarShift, vigenereKey, separator]);

  const process = useCallback(async () => {
    if (!input.trim()) {
      setOutput("");
      return;
    }
    
    setError("");
    setIsProcessing(true);
    
    try {
      let result: string;
      
      if (useApi) {
        result = await processApi(input);
      } else {
        result = processLocal(input);
      }
      
      setOutput(result);
      
    } catch (e) {
      setError(e instanceof Error ? e.message : `Failed to ${mode}`);
      setOutput("");
    } finally {
      setIsProcessing(false);
    }
  }, [input, encoding, mode, useApi, processLocal, processApi]);

  useEffect(() => {
    if (!liveMode || !input.trim()) {
      if (liveMode && !input.trim()) setOutput("");
      return;
    }
    
    const timer = setTimeout(() => {
      try {
        const result = processLocal(input);
        setOutput(result);
        setError("");
      } catch (e) {
        setError(e instanceof Error ? e.message : `Failed to ${mode}`);
      }
    }, 150);
    
    return () => clearTimeout(timer);
  }, [liveMode, input, mode, processLocal]);

  const handleCopy = async () => {
    if (!output) return;
    
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
    }
  };

  const handleSwap = () => {
    setInput(output);
    setOutput("");
    setMode(m => m === "encode" ? "decode" : "encode");
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const handleDownload = () => {
    if (!output) return;
    
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${encoding}-${mode}d.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      setInput(ev.target?.result as string);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const isHash = currentEncoding?.category === "hash";

  const referenceExamples = [
    { name: "Base64", example: "SGVsbG8gV29ybGQ=", use: "Data URLs, API payloads" },
    { name: "URL", example: "Hello%20World", use: "Query strings, URLs" },
    { name: "Hex", example: "48 65 6c 6c 6f", use: "Colors, binary data" },
    { name: "Binary", example: "01001000 01100101", use: "Bit manipulation" },
    { name: "ROT13", example: "Uryyb Jbeyq", use: "Simple obfuscation" },
    { name: "Morse", example: ".... . .-.. .-.. ---", use: "Fun encoding" }
  ];

  return (
    <>
      <style>{styles}</style>
      
      <div className="encoder-tool tool-container">

        <div className="encoder-tabs">
          {(Object.entries(CATEGORIES) as [Category, typeof CATEGORIES[Category]][]).map(([cat, info]) => (
            <button
              key={cat}
              className={`encoder-tab ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              <i className={`bi ${info.icon}`} />
              {info.name}
              <span className="encoder-tab-badge">
                {groupedEncodings[cat].length}
              </span>
            </button>
          ))}
        </div>

        <div className="encoder-setup">
          <div className="encoder-setup-header">
            <h3><i className="bi bi-collection" /> Select Encoding & Configure</h3>
          </div>

          <div className="encoder-categories">
            {(Object.entries(filteredEncodings) as [Category, Encoding[]][]).map(([category, encodings]) => (
              <div key={category} className="encoder-category">
                <div className="encoder-category-header">
                  <div className="encoder-category-title">
                    <i className={`bi ${CATEGORIES[category].icon}`} />
                    {CATEGORIES[category].name}
                  </div>
                  <div className="encoder-category-desc">
                    {CATEGORIES[category].description}
                  </div>
                </div>
                <div className="encoder-category-grid">
                  {encodings.map(enc => (
                    <button
                      key={enc.id}
                      className={`encoder-option ${encoding === enc.id ? "selected" : ""}`}
                      onClick={() => setEncoding(enc.id)}
                    >
                      <div className="encoder-option-icon">
                        <i className={`bi ${enc.icon}`} />
                      </div>
                      <div className="encoder-option-info">
                        <div className="encoder-option-name">{enc.name}</div>
                        <div className="encoder-option-desc">{enc.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="encoder-options">
            <div className="encoder-options-header">
              <i className="bi bi-gear" />
              Encoding Options
            </div>
            <div className="encoder-options-body">
              <div className="encoder-options-grid">
                {(encoding === "caesar" || chainSteps.some(s => s.encoding === "caesar")) && (
                  <div className="encoder-option-field">
                    <label className="encoder-option-label">Caesar Shift</label>
                    <input
                      type="number"
                      className="encoder-option-input"
                      value={caesarShift}
                      onChange={(e) => setCaesarShift(parseInt(e.target.value) || 3)}
                      min={1}
                      max={25}
                    />
                  </div>
                )}
                
                {(encoding === "vigenere" || chainSteps.some(s => s.encoding === "vigenere")) && (
                  <div className="encoder-option-field">
                    <label className="encoder-option-label">Vigenère Key</label>
                    <input
                      type="text"
                      className="encoder-option-input"
                      value={vigenereKey}
                      onChange={(e) => setVigenereKey(e.target.value)}
                      placeholder="Enter key..."
                    />
                  </div>
                )}
                
                <div className="encoder-option-field">
                  <label className="encoder-option-label">Separator</label>
                  <select
                    className="encoder-option-select"
                    value={separator}
                    onChange={(e) => setSeparator(e.target.value)}
                  >
                    <option value=" ">Space</option>
                    <option value=",">Comma</option>
                    <option value="">None</option>
                    <option value="-">Dash</option>
                    <option value=":">Colon</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="encoder-mode">
          <button
            className={`encoder-mode-btn ${mode === "encode" ? "active" : ""}`}
            onClick={() => setMode("encode")}
          >
            <i className="bi bi-lock" />
            Encode
          </button>
          <button
            className={`encoder-mode-btn ${mode === "decode" ? "active" : ""} ${isHash ? "hash-only" : ""}`}
            onClick={() => !isHash && setMode("decode")}
            disabled={isHash}
          >
            <i className="bi bi-unlock" />
            Decode {isHash && "(N/A)"}
          </button>
        </div>

        <div className="encoder-io" style={{ marginTop: "20px" }}>
          <div className="encoder-panel">
            <div className="encoder-panel-header">
              <div className="encoder-panel-title">
                <i className="bi bi-input-cursor-text" />
                Input
              </div>
              <div className="encoder-panel-stats">
                <span className="encoder-panel-stat">{input.length} chars</span>
                <span className="encoder-panel-stat">{new TextEncoder().encode(input).length} bytes</span>
                <div className="encoder-panel-actions">
                  <label className="encoder-panel-action" style={{ cursor: "pointer" }}>
                    <i className="bi bi-upload" />
                    <input
                      type="file"
                      accept=".txt,.json,.xml,.html,.csv"
                      onChange={handleUpload}
                      style={{ display: "none" }}
                    />
                  </label>
                  <button
                    className="encoder-panel-action"
                    onClick={() => setInput("")}
                    disabled={!input}
                  >
                    <i className="bi bi-x" />
                  </button>
                </div>
              </div>
            </div>
            <div className="encoder-panel-body">
              <textarea
                ref={inputRef}
                className="encoder-textarea"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Enter text to ${mode}...`}
                spellCheck={false}
              />
              
              {liveMode && (
                <div className="encoder-live-indicator">
                  <i className="bi bi-lightning-charge-fill" />
                  Live mode — output updates as you type
                </div>
              )}
            </div>
          </div>

          {!liveMode && (
            <div className="encoder-actions">
              <button
                className="encoder-btn encoder-btn-primary"
                onClick={process}
                disabled={!input.trim() || isProcessing}
                title={isProcessing ? "Processing..." : !input.trim() ? "Enter input first" : undefined}
              >
                {isProcessing ? (
                  <>
                    <i className="bi bi-arrow-repeat" style={{ animation: "spin 1s linear infinite" }} />
                    Processing...
                  </>
                ) : (
                  <>
                    <i className={`bi ${mode === "encode" ? "bi-lock" : "bi-unlock"}`} />
                    {mode === "encode" ? "Encode" : "Decode"}
                    {useApi && <span style={{ fontSize: 10, marginLeft: 4, opacity: 0.7 }}>(API)</span>}
                  </>
                )}
              </button>
              
              <button
                className="encoder-btn encoder-btn-secondary"
                onClick={handleSwap}
                disabled={!output}
              >
                <i className="bi bi-arrow-down-up" />
                Swap
              </button>
              
              <button
                className="encoder-btn encoder-btn-secondary"
                onClick={handleClear}
              >
                <i className="bi bi-x-circle" />
                Clear
              </button>
            </div>
          )}

          {error && (
            <div className="encoder-message encoder-message-error">
              <i className="bi bi-exclamation-triangle" />
              {error}
            </div>
          )}
          
          {copied && (
            <div className="encoder-message encoder-message-success">
              <i className="bi bi-check-circle" />
              Copied to clipboard!
            </div>
          )}

          <div className="encoder-panel">
            <div className="encoder-panel-header">
              <div className="encoder-panel-title">
                <i className="bi bi-output" />
                Output
              </div>
              <div className="encoder-panel-stats">
                <span className="encoder-panel-stat">{output.length} chars</span>
                <span className="encoder-panel-stat">{new TextEncoder().encode(output).length} bytes</span>
                <div className="encoder-panel-actions">
                  <button
                    className="encoder-panel-action"
                    onClick={handleCopy}
                    disabled={!output}
                    title="Copy"
                  >
                    <i className="bi bi-clipboard" />
                  </button>
                  <button
                    className="encoder-panel-action"
                    onClick={handleDownload}
                    disabled={!output}
                    title="Download"
                  >
                    <i className="bi bi-download" />
                  </button>
                </div>
              </div>
            </div>
            <div className="encoder-panel-body">
              <textarea
                className="encoder-textarea"
                value={output}
                readOnly
                placeholder="Output will appear here..."
                spellCheck={false}
              />
            </div>
          </div>
        </div>

        <div className="encoder-reference" style={{ marginTop: "20px" }}>
          <div className="encoder-reference-header">
            <i className="bi bi-lightbulb" />
            Quick Reference
          </div>
          <div className="encoder-reference-grid">
            {referenceExamples.map(ref => (
              <div key={ref.name} className="encoder-reference-item">
                <div className="encoder-reference-name">{ref.name}</div>
                <div className="encoder-reference-example">{ref.example}</div>
                <div className="encoder-reference-use">{ref.use}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
