import { useState, useRef, useMemo } from "react";
import { buildCodes, cleanHex } from "@/lib/hexUtils";

export function useSerialScanner() {
  const [connected, setConnected] = useState(false);
  const [uid, setUid] = useState("-");
  const [lrc, setLrc] = useState("-");
  const [finalCode, setFinalCode] = useState("-");
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const portRef = useRef<SerialPort | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);

  const canSerial = useMemo(
    () => typeof navigator !== "undefined" && "serial" in navigator,
    []
  );

  function applyScan(text: string) {
    const cleaned = cleanHex(text);
    if (!cleaned) return;

    const parsed = buildCodes(cleaned);
    if (!parsed) return;

    setUid(parsed.uid);
    setLrc(parsed.lrc);
    setFinalCode(parsed.final);

    if (parsed.ok !== undefined) {
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

      // Start reading loop
      readLoop(reader, decoder, buffer);
    } catch (e: any) {
      setError(e?.message ?? "Could not connect");
      setConnected(false);
    }
  }

  async function readLoop(
    reader: ReadableStreamDefaultReader<Uint8Array>,
    decoder: TextDecoder,
    initialBuffer: string
  ) {
    let buffer = initialBuffer;
    while (true) {
      try {
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
              if (last.length === 10 || last.length === 12) applyScan(last);
            }
          }
        }
      } catch (err) {
        console.error("Read error:", err);
        break;
      }
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

  return {
    connected,
    canSerial,
    connect,
    disconnect,
    uid,
    lrc,
    finalCode,
    status,
    error,
  };
}
