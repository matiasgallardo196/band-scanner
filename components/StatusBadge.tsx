type StatusBadgeProps = {
  status: string;
  error: string | null;
  canSerial: boolean;
};

import { AlertCircle, CheckCircle2 } from "lucide-react";

export function StatusBadge({ status, error, canSerial }: StatusBadgeProps) {
  if (!canSerial) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-200 backdrop-blur-sm">
        <AlertCircle size={20} />
        <p>Your browser does not support Web Serial. Please use Chrome or Edge.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-6 py-3 rounded-full text-center text-sm font-medium backdrop-blur-sm">
        {error}
      </div>
    );
  }

  if (status) {
    return (
      <div className="flex items-center gap-2 bg-royal-500/20 border border-royal-500/30 text-royal-200 px-6 py-2 rounded-full text-center text-sm font-bold tracking-wide backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.1)]">
        <CheckCircle2 size={16} className="text-royal-400" />
        {status}
      </div>
    );
  }

  return null;
}
