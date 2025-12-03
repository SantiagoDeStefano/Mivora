import { useEffect } from "react";

interface PopupProps {
  open: boolean;
  title?: string;
  message: string;
  variant?: "success" | "error" | "info";
  onClose: () => void;
}

export default function Popup({
  open,
  title = "Notification",
  message,
  variant = "info",
  onClose,
}: PopupProps) {
  // Close on ESC
  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  // Variant styles
  const theme = {
    success: {
      color: "text-green-500",
      bg: "bg-green-600",
      ring: "ring-green-600/40",
      icon: "✔",
    },
    error: {
      color: "text-red-500",
      bg: "bg-red-600",
      ring: "ring-red-600/40",
      icon: "✕",
    },
    info: {
      color: "text-pink-500",
      bg: "bg-pink-600",
      ring: "ring-pink-600/40",
      icon: "!",
    },
  }[variant];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-[92%] max-w-sm rounded-2xl border border-gray-700 bg-gradient-to-b from-gray-900 via-gray-900/95 to-black p-6 shadow-2xl animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-1 text-gray-400 hover:bg-white/5 hover:text-white transition"
        >
          <span className="block h-4 w-4 leading-none">✕</span>
        </button>

        {/* Icon */}
        <div
          className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${theme.color}/10 ring-2 ${theme.ring}`}
        >
          <span className={`text-2xl ${theme.color}`}>{theme.icon}</span>
        </div>

        <h2 className="mb-2 text-center text-lg font-semibold text-white tracking-wide">
          {title}
        </h2>

        <p className="text-center text-sm text-gray-300 leading-relaxed">
          {message}
        </p>

        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className={`inline-flex min-w-[120px] items-center justify-center rounded-xl px-6 py-2.5 text-sm font-medium text-white shadow-md transition hover:opacity-90 active:scale-[0.98] ${theme.bg}`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
