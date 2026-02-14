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
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24 bg-gradient-to-br from-royal-900 to-royal-950 text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-royal-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="z-10 w-full max-w-3xl space-y-10 animate-fade-in flex flex-col items-center">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center p-4 bg-royal-800/30 rounded-full mb-2 ring-1 ring-royal-700/50 shadow-[0_0_30px_rgba(59,130,246,0.15)] backdrop-blur-md">
            <Scan size={40} className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-md">
              BAND SCANNER
            </h1>
            <p className="text-lg text-royal-200 font-light tracking-wide">
              Serial Port Reader & XOR Calculator
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-6 text-xs font-bold text-royal-400 uppercase tracking-widest border-t border-b border-royal-800/50 py-3 mx-auto w-fit px-8">
            <span>Serial: 19200</span>
            <span className="text-royal-600">•</span>
            <span>Flow: None</span>
            <span className="text-royal-600">•</span>
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
          <div className="w-full max-w-2xl mt-8 transition-all duration-500 ease-out transform">
            <ResultCard
              label="FINAL CODE"
              value={finalCode}
              isLarge={true}
            />
          </div>
        )}
      </div>
    </main>
  );
}
