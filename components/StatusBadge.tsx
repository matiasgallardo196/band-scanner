type StatusBadgeProps = {
  status: string;
  error: string | null;
  canSerial: boolean;
};

import { AlertCircle } from "lucide-react";

export function StatusBadge({ status, error, canSerial }: StatusBadgeProps) {
  if (!canSerial) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-200">
        <AlertCircle size={20} />
        <p>Your browser does not support Web Serial. Please use Chrome or Edge.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-center text-sm">
        {error}
      </div>
    );
  }

  if (status) {
    return (
      <div className="bg-blue-500/10 border border-blue-500/20 text-blue-300 px-4 py-3 rounded-xl text-center text-sm font-medium animate-pulse">
        {status}
      </div>
    );
  }

  return null;
}
