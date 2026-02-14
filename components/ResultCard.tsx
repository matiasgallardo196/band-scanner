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
      <div className="md:col-span-2 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Scan size={64} />
        </div>
        <div className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
          {label}
        </div>
        <div className="font-mono text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 font-bold break-all">
          {value}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
      <div className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
        {label}
      </div>
      <div
        className={`font-mono text-xl break-all ${
          variant === "highlight" ? "text-blue-400" : "text-white/90"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
