"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Plug, PlugZap, Copy, CheckCircle, AlertCircle, Scan } from "lucide-react";

function cleanHex(input: string) {
  return input.toUpperCase().replace(/[^0-9A-F]/g, "");
}

function xorLrcFromHex(hex: string) {
  const h = cleanHex(hex);
  if (!h || h.length % 2 !== 0) return null;

  let lrc = 0;
  for (let i = 0; i < h.length; i += 2) {
    const b = parseInt(h.slice(i, i + 2), 16);
    if (Number.isNaN(b)) return null;
    lrc ^= b;
  }
  return lrc.toString(16).toUpperCase().padStart(2, "0");
}

function buildCodes(hexInput: string) {
  const uid = cleanHex(hexInput);

  // Case 10 hex: UID (5 bytes) -> calculate LRC and build final
  if (uid.length === 10) {
    const lrc = xorLrcFromHex(uid);
    if (!lrc) return null;
    return { uid, lrc, final: uid + lrc };
  }

  // Case 12 hex: assume UID+LRC
  if (uid.length === 12) {
    const uidPart = uid.slice(0, 10);
    const lrcPart = uid.slice(10, 12);
    const calc = xorLrcFromHex(uidPart);
    return { uid: uidPart, lrc: lrcPart, final: uid, ok: calc === lrcPart };
  }

  // Other lengths: try anyway (in case device sends more bytes)
  if (uid.length >= 8 && uid.length % 2 === 0) {
    const lrc = xorLrcFromHex(uid);
    if (!lrc) return null;
    return { uid, lrc, final: uid + lrc };
  }

  return null;
}

export default function Page() {
  const [connected, setConnected] = useState(false);
  const [uid, setUid] = useState("-");
  const [lrc, setLrc] = useState("-");
  const [finalCode, setFinalCode] = useState("-");
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const portRef = useRef<SerialPort | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);

  const canSerial = useMemo(
    () => typeof navigator !== "undefined" && "serial" in navigator,
    []
  );

  useEffect(() => {
    if (isCopied) {
      const timeout = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [isCopied]);

  function applyScan(text: string) {
    const cleaned = cleanHex(text);
    if (!cleaned) return;

    const parsed = buildCodes(cleaned);
    if (!parsed) return;

    setUid(parsed.uid);
    setLrc(parsed.lrc);
    setFinalCode(parsed.final);

    if ("ok" in parsed) {
      setStatus(parsed.ok ? "✅ Valid LRC" : "⚠️ Invalid LRC");
    } else {
      setStatus("✅ OK");
    }
  }

  async function connect() {
    setError(null);
    setStatus("");
    try {
      // @ts-ignore
      const port: SerialPort = await navigator.serial.requestPort();
      await port.open({
        baudRate: 19200,
        dataBits: 8,
        stopBits: 1,
        parity: "none",
        flowControl: "none",
      });

      portRef.current = port;
      setConnected(true);

      const decoder = new TextDecoder();
      const reader = port.readable!.getReader();
      readerRef.current = reader;

      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        if (value) {
          buffer += decoder.decode(value, { stream: true });

          // If there are CR/LF, process complete lines
          if (buffer.match(/[\r\n]/)) {
            const parts = buffer.split(/\r\n|\n|\r/g);
            buffer = parts.pop() ?? "";
            for (const p of parts) applyScan(p);
          } else {
            // No enter: look for the last reasonable hex block
            const matches = buffer.toUpperCase().match(/[0-9A-F]{8,}/g);
            if (matches?.length) {
              const last = matches[matches.length - 1];
              // With your reader it is usually 10 hex (UID) or 12 (UID+LRC)
              if (last.length === 10 || last.length === 12) applyScan(last);
            }
          }
        }
      }
    } catch (e: any) {
      setError(e?.message ?? "Could not connect");
      setConnected(false);
    }
  }

  async function disconnect() {
    try {
      await readerRef.current?.cancel();
      readerRef.current?.releaseLock();
      readerRef.current = null;

      await portRef.current?.close();
      portRef.current = null;
    } finally {
      setConnected(false);
      setStatus("");
    }
  }

  async function copyFinal() {
    if (finalCode === "-") return;
    await navigator.clipboard.writeText(finalCode);
    setStatus("📋 Copied FINAL");
    setIsCopied(true);
  }

  async function copyAll() {
    if (finalCode === "-") return;
    const text =
      `UID:   ${uid}\n` + `LRC:   ${lrc}\n` + `FINAL: ${finalCode}\n`;
    await navigator.clipboard.writeText(text);
    setStatus("📋 Copied ALL (UID/LRC/FINAL)");
    setIsCopied(true);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24 bg-gradient-to-br from-neutral-900 to-black text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="z-10 w-full max-w-3xl space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl mb-4 ring-1 ring-white/10 shadow-xl backdrop-blur-sm">
            <Scan size={32} className="text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Band Scanner
          </h1>
          <p className="text-lg text-white/50">
            Serial Port Reader & XOR Calculator
          </p>
          <div className="flex items-center justify-center gap-4 text-xs font-mono text-white/40 uppercase tracking-wider">
            <span>Serial: 19200</span>
            <span>•</span>
            <span>Flow: None</span>
            <span>•</span>
            <span>Chrome/Edge</span>
          </div>
        </div>

        {!canSerial && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-200">
            <AlertCircle size={20} />
            <p>Your browser does not support Web Serial. Please use Chrome or Edge.</p>
          </div>
        )}

        {/* Connection Controls */}
        <div className="flex flex-wrap justify-center gap-4">
          {!connected ? (
            <button
              onClick={connect}
              disabled={!canSerial}
              className="group relative px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
            >
              <Plug size={18} />
              Connect Reader
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ) : (
            <button
              onClick={disconnect}
              className="px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-400 font-semibold rounded-xl hover:bg-red-500/20 transition-all active:scale-95 flex items-center gap-2"
            >
              <PlugZap size={18} />
              Disconnect
            </button>
          )}

          <button
            onClick={copyFinal}
            disabled={finalCode === "-"}
            className="px-6 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
          >
            {isCopied ? <CheckCircle size={18} className="text-green-400" /> : <Copy size={18} />}
            Copy Final
          </button>

          <button
            onClick={copyAll}
            disabled={finalCode === "-"}
            className="px-6 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            Copy All
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-center text-sm">
            {error}
          </div>
        )}

        {status && (
          <div className="bg-blue-500/10 border border-blue-500/20 text-blue-300 px-4 py-3 rounded-xl text-center text-sm font-medium animate-pulse">
            {status}
          </div>
        )}

        {/* Data Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* UID Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <div className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
              UID (Raw)
            </div>
            <div className="font-mono text-xl text-white/90 break-all">
              {uid}
            </div>
          </div>

          {/* LRC Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <div className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
              LRC (XOR)
            </div>
            <div className="font-mono text-xl text-blue-400 break-all">
              {lrc}
            </div>
          </div>

          {/* Final Code Card (Full Width) */}
          <div className="md:col-span-2 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Scan size={64} />
            </div>
            <div className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
              Final Code (UID + LRC)
            </div>
            <div className="font-mono text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 font-bold break-all">
              {finalCode}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
