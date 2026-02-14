"use client";

import { Scan } from "lucide-react";
import { useSerialScanner } from "@/hooks/useSerialScanner";
import { StatusBadge } from "@/components/StatusBadge";
import { ScannerControls } from "@/components/ScannerControls";
import { ResultCard } from "@/components/ResultCard";

export default function Page() {
  const {
    connected,
    canSerial,
    connect,
    disconnect,
    finalCode,
    status,
    error,
  } = useSerialScanner();

  const handleCopyFinal = async () => {
    if (finalCode === "-") return;
    await navigator.clipboard.writeText(finalCode);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24 bg-gradient-to-br from-neutral-900 to-black text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="z-10 w-full max-w-3xl space-y-8 animate-fade-in flex flex-col items-center">
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

        <StatusBadge status={status} error={error} canSerial={canSerial} />

        {/* Connection Controls */}
        <ScannerControls
          connected={connected}
          canSerial={canSerial}
          onConnect={connect}
          onDisconnect={disconnect}
          onCopyFinal={handleCopyFinal}
          hasFinalCode={finalCode !== "-"}
        />

        {/* Data Display - Only Final Code */}
        {connected && (
          <div className="w-full max-w-2xl mt-8">
            <ResultCard
              label="Final Code (UID + LRC)"
              value={finalCode}
              isLarge={true}
            />
          </div>
        )}
      </div>
    </main>
  );
}
