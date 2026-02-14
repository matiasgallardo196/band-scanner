import { Scan } from "lucide-react";

type ResultCardProps = {
  label: string;
  value: string;
  variant?: "default" | "highlight";
  isLarge?: boolean;
};

export function ResultCard({
  label,
  value,
  variant = "default",
  isLarge = false,
}: ResultCardProps) {
  if (isLarge) {
    return (
      <div className="w-full bg-royal-800/30 border border-royal-700/50 rounded-3xl p-10 backdrop-blur-xl relative overflow-hidden group shadow-2xl">
        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
          <Scan size={120} />
        </div>
        
        <div className="flex flex-col items-center justify-center text-center space-y-4 relative z-10">
          <div className="text-sm font-bold text-royal-400 uppercase tracking-[0.2em] mb-2">
            {label}
          </div>
          <div className="font-mono text-4xl md:text-6xl text-white font-bold tracking-tight drop-shadow-xl break-all">
            {value}
          </div>
        </div>
      </div>
    );
  }

  // Not used in simplified view but kept for compatibility
  return (
    <div className="bg-royal-800/30 border border-royal-700/50 rounded-2xl p-6 backdrop-blur-xl">
      <div className="text-xs font-medium text-royal-400 uppercase tracking-wider mb-2">
        {label}
      </div>
      <div
        className={`font-mono text-xl break-all ${
          variant === "highlight" ? "text-royal-400" : "text-white/90"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
