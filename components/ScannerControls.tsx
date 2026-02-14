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
          className="group relative px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
        >
          <Plug size={18} />
          Connect Reader
          <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      ) : (
        <button
          onClick={onDisconnect}
          className="px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-400 font-semibold rounded-xl hover:bg-red-500/20 transition-all active:scale-95 flex items-center gap-2"
        >
          <PlugZap size={18} />
          Disconnect
        </button>
      )}

      <button
        onClick={handleCopyFinal}
        disabled={!hasFinalCode}
        className="px-6 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
      >
        {isCopied ? <CheckCircle size={18} className="text-green-400" /> : <Copy size={18} />}
        Copy Final
      </button>
    </div>
  );
}
