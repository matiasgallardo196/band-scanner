import { Plug, PlugZap, Copy, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

type ScannerControlsProps = {
  connected: boolean;
  canSerial: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onCopyFinal: () => void;
  hasFinalCode: boolean;
};

export function ScannerControls({
  connected,
  canSerial,
  onConnect,
  onDisconnect,
  onCopyFinal,
  hasFinalCode,
}: ScannerControlsProps) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timeout = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [isCopied]);

  const handleCopyFinal = () => {
    onCopyFinal();
    setIsCopied(true);
  };

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {!connected ? (
        <button
          onClick={onConnect}
          disabled={!canSerial}
          className="group relative px-8 py-3 bg-white text-royal-950 font-bold rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:bg-gray-100 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 tracking-wide"
        >
          <Plug size={20} />
          CONNECT READER
        </button>
      ) : (
        <button
          onClick={onDisconnect}
          className="px-8 py-3 bg-red-500/10 border border-red-500/30 text-red-200 font-bold rounded-full hover:bg-red-500/20 transition-all active:scale-95 flex items-center gap-2 tracking-wide"
        >
          <PlugZap size={20} />
          DISCONNECT
        </button>
      )}

      <button
        onClick={handleCopyFinal}
        disabled={!hasFinalCode}
        className="px-8 py-3 bg-royal-800/50 border border-royal-700 text-white font-bold rounded-full hover:bg-royal-700/50 hover:border-royal-600 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 tracking-wide backdrop-blur-md"
      >
        {isCopied ? <CheckCircle size={20} className="text-green-400" /> : <Copy size={20} />}
        COPY FINAL CODE
      </button>
    </div>
  );
}
