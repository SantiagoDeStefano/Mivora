interface PopupProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

export default function Popup({ open, message, onClose }: PopupProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-[92%] max-w-sm shadow-2xl animate-scale-in">
        <h2 className="text-xl font-semibold mb-4 text-center">Notification</h2>

        <p className="text-xm text-gray-300 text-center leading-relaxed">
          {message}
        </p>

        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="px-10 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 transition text-white font-medium shadow-md"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
