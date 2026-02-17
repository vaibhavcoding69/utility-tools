import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { encode, decode } from "../../../lib/api";

type Mode = "encode" | "decode";

 type CipherAlgo =
  | "rot13"
  | "rot5"
  | "rot47"
  | "caesar"
  | "vigenere"
  | "atbash"
  | "a1z26"
  | "bacon"
  | "reverse"
  | "xor"
  | "rail-fence";

type HashAlgo = "md5" | "sha1" | "sha256" | "sha512";

type Algo = CipherAlgo | HashAlgo;

type HistoryItem = {
  id: string;
  algo: Algo;
  mode: Mode;
  input: string;
  output: string;
  ts: number;
  viaApi: boolean;
};

const caesarAlphabet = "abcdefghijklmnopqrstuvwxyz";

const baconMap: Record<string, string> = {
  A: "AAAAA",
  B: "AAAAB",
  C: "AAABA",
  D: "AAABB",
  E: "AABAA",
  F: "AABAB",
  G: "AABBA",
  H: "AABBB",
  I: "ABAAA",
  J: "ABAAB",
  K: "ABABA",
  L: "ABABB",
  M: "ABBAA",
  N: "ABBAB",
  O: "ABBBA",
  P: "ABBBB",
  Q: "BAAAA",
  R: "BAAAB",
  S: "BAABA",
  T: "BAABB",
  U: "BABAA",
  V: "BABAB",
  W: "BABBA",
  X: "BABBB",
  Y: "BBAAA",
  Z: "BBAAB",
  " ": " ",
};

const xorKeys = ["00", "0F", "1A", "2B", "55", "AA", "FF"];

const railFenceHeights = [2, 3, 4, 5];

const defaultInput = "Attack at dawn";

const uid = () => crypto.randomUUID();

async function subtleHash(algo: "SHA-1" | "SHA-256" | "SHA-512", input: string) {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function rot(value: string, shift: number, alphabet = caesarAlphabet) {
  const size = alphabet.length;
  return value
    .split("")
    .map((ch) => {
      const idx = alphabet.indexOf(ch.toLowerCase());
      if (idx === -1) return ch;
      const rotated = alphabet[(idx + shift + size) % size];
      return ch === ch.toUpperCase() ? rotated.toUpperCase() : rotated;
    })
    .join("");
}

function atbash(value: string) {
  return value
    .split("")
    .map((ch) => {
      const idx = caesarAlphabet.indexOf(ch.toLowerCase());
      if (idx === -1) return ch;
      const mirrored = caesarAlphabet[caesarAlphabet.length - 1 - idx];
      return ch === ch.toUpperCase() ? mirrored.toUpperCase() : mirrored;
    })
    .join("");
}

function vigenere(value: string, key: string, mode: Mode) {
  if (!key) return value;
  const normKey = key.replace(/[^a-z]/gi, "").toLowerCase();
  let k = 0;
  return value
    .split("")
    .map((ch) => {
      const idx = caesarAlphabet.indexOf(ch.toLowerCase());
      if (idx === -1) return ch;
      const shift = caesarAlphabet.indexOf(normKey[k % normKey.length]);
      k += 1;
      const delta = mode === "encode" ? shift : -shift;
      const out = caesarAlphabet[(idx + delta + caesarAlphabet.length) % caesarAlphabet.length];
      return ch === ch.toUpperCase() ? out.toUpperCase() : out;
    })
    .join("");
}

function a1z26(value: string, mode: Mode) {
  if (mode === "encode") {
    return value
      .toLowerCase()
      .split("")
      .map((ch) => {
        const idx = caesarAlphabet.indexOf(ch);
        return idx === -1 ? ch : String(idx + 1);
      })
      .join(" ");
  }
  return value
    .split(/\s+/)
    .map((token) => {
      const num = parseInt(token, 10);
      if (Number.isNaN(num)) return token;
      const ch = caesarAlphabet[num - 1];
      return ch ?? token;
    })
    .join("");
}

function baconEncode(value: string) {
  return value
    .toUpperCase()
    .split("")
    .map((ch) => baconMap[ch] ?? ch)
    .join(" ");
}

function baconDecode(value: string) {
  const inverse = Object.fromEntries(Object.entries(baconMap).map(([k, v]) => [v, k]));
  return value
    .split(/\s+/)
    .map((token) => inverse[token] ?? token)
    .join("");
}

function xorCipher(value: string, hexKey: string) {
  const key = parseInt(hexKey, 16) & 0xff;
  return value
    .split("")
    .map((ch) => String.fromCharCode(ch.charCodeAt(0) ^ key))
    .join("");
}

function railFence(value: string, rails: number, mode: Mode) {
  if (rails < 2) return value;
  if (mode === "encode") {
    const rows = Array.from({ length: rails }, () => [] as string[]);
    let rail = 0;
    let dir = 1;
    for (const ch of value) {
      rows[rail].push(ch);
      rail += dir;
      if (rail === 0 || rail === rails - 1) dir *= -1;
    }
    return rows.flat().join("");
  }
  const pattern: number[] = [];
  let rail = 0;
  let dir = 1;
  for (let i = 0; i < value.length; i += 1) {
    pattern.push(rail);
    rail += dir;
    if (rail === 0 || rail === rails - 1) dir *= -1;
  }
  const railCounts = Array.from({ length: rails }, () => 0);
  pattern.forEach((r) => {
    railCounts[r] += 1;
  });
  const railsArr: string[][] = [];
  let idx = 0;
  for (const count of railCounts) {
    railsArr.push(value.slice(idx, idx + count).split(""));
    idx += count;
  }
  const pointers = Array.from({ length: rails }, () => 0);
  const out: string[] = [];
  pattern.forEach((r) => {
    const segment = railsArr[r];
    out.push(segment[pointers[r]]);
    pointers[r] += 1;
  });
  return out.join("");
}

const algoGroups: { title: string; items: { algo: Algo; label: string; mode: Mode }[] }[] = [
  {
    title: "Rotation",
    items: [
      { algo: "rot13", label: "ROT13", mode: "encode" },
      { algo: "rot5", label: "ROT5", mode: "encode" },
      { algo: "rot47", label: "ROT47", mode: "encode" },
      { algo: "caesar", label: "Caesar", mode: "encode" },
      { algo: "vigenere", label: "Vigenere", mode: "encode" },
    ],
  },
  {
    title: "Substitution",
    items: [
      { algo: "atbash", label: "Atbash", mode: "encode" },
      { algo: "a1z26", label: "A1Z26", mode: "encode" },
      { algo: "bacon", label: "Baconian", mode: "encode" },
      { algo: "reverse", label: "Reverse", mode: "encode" },
      { algo: "xor", label: "XOR", mode: "encode" },
    ],
  },
  {
    title: "Transposition",
    items: [{ algo: "rail-fence", label: "Rail Fence", mode: "encode" }],
  },
  {
    title: "Hashes",
    items: [
      { algo: "md5", label: "MD5", mode: "encode" },
      { algo: "sha1", label: "SHA-1", mode: "encode" },
      { algo: "sha256", label: "SHA-256", mode: "encode" },
      { algo: "sha512", label: "SHA-512", mode: "encode" },
    ],
  },
];

const presets = [
  {
    label: "ROT13 demo",
    algo: "rot13" as Algo,
    mode: "encode" as Mode,
    input: "Gur synt vf: 12345",
    key: "",
    shift: 13,
    rails: 3,
  },
  {
    label: "Vigenere secret",
    algo: "vigenere" as Algo,
    mode: "encode" as Mode,
    input: "defendtheeastwall",
    key: "fortification",
    shift: 0,
    rails: 3,
  },
  {
    label: "Bacon SOS",
    algo: "bacon" as Algo,
    mode: "encode" as Mode,
    input: "sos",
    key: "",
    shift: 0,
    rails: 2,
  },
  {
    label: "Rail fence",
    algo: "rail-fence" as Algo,
    mode: "encode" as Mode,
    input: "WEAREDISCOVEREDFLEEATONCE",
    key: "",
    shift: 0,
    rails: 3,
  },
  {
    label: "SHA-256 sample",
    algo: "sha256" as Algo,
    mode: "encode" as Mode,
    input: "hash me",
    key: "",
    shift: 0,
    rails: 3,
  },
];

export default function CipherHashLab() {
  const [algo, setAlgo] = useState<Algo>("rot13");
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState<string>(defaultInput);
  const [output, setOutput] = useState<string>("");
  const [shift, setShift] = useState<number>(13);
  const [key, setKey] = useState<string>("secret");
  const [rails, setRails] = useState<number>(3);
  const [useApi, setUseApi] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string>("");
  const outputRef = useRef<HTMLTextAreaElement>(null);

  const isHash = useMemo(() => algo === "md5" || algo === "sha1" || algo === "sha256" || algo === "sha512", [algo]);

  const activePreset = useMemo(() => presets.find((p) => p.algo === algo), [algo]);

  const runLocal = useCallback(
    async (value: string): Promise<string> => {
      switch (algo) {
        case "rot13":
          return rot(value, 13);
        case "rot5":
          return value.replace(/[0-9]/g, (d) => String(((parseInt(d, 10) + 5) % 10)));
        case "rot47": {
          return value
            .split("")
            .map((ch) => {
              const code = ch.charCodeAt(0);
              if (code < 33 || code > 126) return ch;
              return String.fromCharCode(33 + ((code + 14) % 94));
            })
            .join("");
        }
        case "caesar":
          return rot(value, shift);
        case "vigenere":
          return vigenere(value, key, mode);
        case "atbash":
          return atbash(value);
        case "a1z26":
          return a1z26(value, mode);
        case "bacon":
          return mode === "encode" ? baconEncode(value) : baconDecode(value);
        case "reverse":
          return value.split("").reverse().join("");
        case "xor":
          return xorCipher(value, key || "00");
        case "rail-fence":
          return railFence(value, rails, mode);
        case "md5":
          throw new Error("MD5 requires API mode");
        case "sha1":
          return subtleHash("SHA-1", value);
        case "sha256":
          return subtleHash("SHA-256", value);
        case "sha512":
          return subtleHash("SHA-512", value);
        default:
          return value;
      }
    },
    [algo, key, mode, rails, shift]
  );

  const runApi = useCallback(
    async (value: string): Promise<string> => {
      if (isHash || algo === "bacon" || algo === "a1z26" || algo === "rail-fence" || algo === "xor" || algo === "vigenere" || algo === "caesar" || algo === "rot13" || algo === "rot5" || algo === "rot47" || algo === "atbash" || algo === "reverse") {
        const encodingName = apiName(algo);
        if (mode === "encode" || isHash) {
          const res = await encode(value, encodingName, { shift, key, rails });
          return res.result ?? "";
        } else {
          const res = await decode(value, encodingName, { key });
          return res.result ?? "";
        }
      }
      return value;
    },
    [algo, isHash, key, mode, rails, shift]
  );

  const process = useCallback(
    async (value: string) => {
      setIsProcessing(true);
      setError("");
      try {
        const out = await (useApi ? runApi(value) : runLocal(value));
        setOutput(typeof out === "string" ? out : String(out));
        setHistory((prev) => [
          {
            id: uid(),
            algo,
            mode,
            input: value,
            output: typeof out === "string" ? out : String(out),
            ts: Date.now(),
            viaApi: useApi,
          },
          ...prev.slice(0, 39),
        ]);
      } catch (err: any) {
        setError(err?.message ?? "Failed to process");
        setOutput("");
      } finally {
        setIsProcessing(false);
      }
    },
    [algo, mode, runApi, runLocal, useApi]
  );

  useEffect(() => {
    process(input);
  }, [algo, mode, shift, key, rails, useApi]);

  const apiName = (name: Algo) => {
    switch (name) {
      case "rot13":
        return "rot13";
      case "rot5":
        return "rot5";
      case "rot47":
        return "rot47";
      case "caesar":
        return "caesar";
      case "vigenere":
        return "vigenere";
      case "atbash":
        return "atbash";
      case "a1z26":
        return "a1z26";
      case "bacon":
        return "bacon";
      case "reverse":
        return "reverse";
      case "xor":
        return "xor";
      case "rail-fence":
        return "rail-fence";
      case "md5":
        return "md5-hash";
      case "sha1":
        return "sha1-hash";
      case "sha256":
        return "sha256-hash";
      case "sha512":
        return "sha512-hash";
      default:
        return name;
    }
  };

  const handlePreset = (label: string) => {
    const preset = presets.find((p) => p.label === label);
    if (!preset) return;
    setAlgo(preset.algo);
    setMode(preset.mode);
    setInput(preset.input);
    setShift(preset.shift);
    setKey(preset.key);
    setRails(preset.rails);
  };

  const copyOutput = () => {
    if (outputRef.current) {
      outputRef.current.select();
      document.execCommand("copy");
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">
          <span className="tool-title-icon">
            <i className="bi bi-shield-lock" />
          </span>
          Cipher & Hash Lab
        </h2>
        <p className="tool-description">
          Encode, decode, and hash text using classical ciphers (ROT13, Caesar, Vigenere) and modern hash algorithms (MD5, SHA-256). Toggle API mode to test backend endpoints.
        </p>
      </div>

      <div className="tool-content">
        <div className="tool-options">
          <div className="tool-option">
            <label className="tool-label">
              <i className="bi bi-arrow-left-right" />
              Mode
            </label>
            <div className="flex rounded border border-secondary overflow-hidden">
              {( ["encode", "decode"] as Mode[]).map((m) => (
                <button
                  key={m}
                  className={clsx("btn", m === mode ? "primary" : "ghost")}
                  onClick={() => setMode(m)}
                >
                  {m.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="tool-option">
            <label className="tool-label">
              <i className="bi bi-server" />
              Backend API
            </label>
            <button
              className={clsx("btn", useApi ? "primary" : "ghost")}
              onClick={() => setUseApi((v) => !v)}
            >
              {useApi ? "On" : "Off"}
            </button>
          </div>

          <div className="tool-option">
            <label className="tool-label">
              <i className="bi bi-cpu" />
              Algorithm
            </label>
            <select
              className="tool-select"
              value={algo}
              onChange={(e) => setAlgo(e.target.value as Algo)}
            >
              {algoGroups.map((group) => (
                <optgroup key={group.title} label={group.title}>
                  {group.items.map((item) => (
                    <option key={item.algo} value={item.algo}>
                      {item.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="tool-input-section">
            <div className="tool-section-header">
              <label className="tool-label">
                <i className="bi bi-pencil" />
                Input
              </label>
              {activePreset && (
                <button
                  className="btn-icon"
                  onClick={() => handlePreset(activePreset.label)}
                  title={`Apply ${activePreset.label}`}
                >
                  <i className="bi bi-lightning" />
                </button>
              )}
            </div>
            <textarea
              className="tool-textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text"
              rows={10}
              spellCheck={false}
            />

            <div className="flex flex-wrap gap-3 text-xs text-neutral-300">
              {algo === "caesar" && (
                <label className="flex items-center gap-2">
                  Shift
                  <input
                    type="number"
                    className="tool-input-small"
                    value={shift}
                    onChange={(e) => setShift(parseInt(e.target.value || "0", 10))}
                  />
                </label>
              )}
              {algo === "vigenere" && (
                <label className="flex items-center gap-2">
                  Key
                  <input
                    type="text"
                    className="tool-input"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                  />
                </label>
              )}
              {algo === "xor" && (
                <label className="flex items-center gap-2">
                  XOR Key
                  <select
                    className="tool-select"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                  >
                    {xorKeys.map((k) => (
                      <option key={k} value={k}>
                        0x{k}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              {algo === "rail-fence" && (
                <label className="flex items-center gap-2">
                  Rails
                  <select
                    className="tool-select"
                    value={rails}
                    onChange={(e) => setRails(parseInt(e.target.value, 10))}
                  >
                    {railFenceHeights.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>
          </div>

          <div className="tool-output-section">
            <div className="tool-section-header">
              <label className="tool-label">
                <i className="bi bi-code-slash" />
                Output
              </label>
              <div className="flex items-center gap-2">
                <button
                  className="btn-icon"
                  onClick={() => process(input)}
                  disabled={isProcessing}
                  title="Run transformation"
                >
                  <i className={isProcessing ? "bi bi-arrow-repeat" : "bi bi-play-fill"} />
                </button>
                <button
                  className="btn-icon"
                  onClick={copyOutput}
                  title="Copy output"
                >
                  <i className="bi bi-clipboard" />
                </button>
              </div>
            </div>
            <textarea
              ref={outputRef}
              className="tool-textarea"
              value={output}
              readOnly
              rows={10}
              spellCheck={false}
            />
            {error && <div className="tool-error">{error}</div>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded border border-secondary bg-secondary p-3">
            <h4 className="text-sm font-semibold text-primary">Algorithms</h4>
            <div className="space-y-3 max-h-72 overflow-auto pr-1">
              {algoGroups.map((group) => (
                <div key={group.title} className="space-y-1">
                  <div className="text-xs uppercase tracking-wide text-secondary">{group.title}</div>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <button
                        key={item.algo}
                        className={clsx("btn", item.algo === algo ? "primary" : "ghost", "text-xs")}
                        onClick={() => {
                          setAlgo(item.algo);
                          setMode(item.mode);
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded border border-secondary bg-secondary p-3">
            <h4 className="text-sm font-semibold text-primary">Presets</h4>
            <div className="space-y-2">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  className="w-full text-left px-3 py-2 btn ghost"
                  onClick={() => handlePreset(preset.label)}
                >
                  <div className="text-sm text-primary">{preset.label}</div>
                  <div className="text-xs text-secondary">{preset.algo.toUpperCase()} • {preset.mode}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded border border-neutral-800 bg-neutral-950/70 p-3 space-y-2">
            <h4 className="text-sm font-semibold text-neutral-100">History</h4>
            <div className="space-y-2 max-h-72 overflow-auto pr-1">
              {history.length === 0 && <div className="text-xs text-neutral-500">No history yet</div>}
              {history.map((item) => (
                <div
                  key={item.id}
                  className="rounded border border-neutral-800 bg-neutral-900 p-2 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-neutral-300">
                    <span className="font-semibold">{item.algo.toUpperCase()}</span>
                    <span className="text-neutral-500">{new Date(item.ts).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-neutral-400 line-clamp-2">{item.input || "(empty)"}</div>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                    <span>{item.mode}</span>
                    <span>•</span>
                    <span>{item.viaApi ? "API" : "Local"}</span>
                  </div>
                  <button
                    className="text-emerald-300 hover:text-emerald-200"
                    onClick={() => {
                      setAlgo(item.algo);
                      setMode(item.mode);
                      setInput(item.input);
                      setOutput(item.output);
                    }}
                  >
                    Re-run
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded border border-neutral-800 bg-neutral-950/70 p-3 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-neutral-100">Notes</h4>
            <div className="text-xs text-neutral-400">Client-side ciphers; hashes may use API</div>
          </div>
          <ul className="list-disc list-inside text-xs text-neutral-400 space-y-1">
            <li>MD5 uses the backend API for consistent output.</li>
            <li>SHA hashes use the Web Crypto API in-browser.</li>
            <li>Rail Fence uses zig-zag traversal; choose rails 2-5.</li>
            <li>XOR uses a single-byte hex key; both encode/decode use XOR.</li>
            <li>History keeps the latest 40 runs; re-run to restore state.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
