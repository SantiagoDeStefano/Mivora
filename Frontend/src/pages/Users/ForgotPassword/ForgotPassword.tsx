import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import Label from "../../../components/Label/Label";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button";

export default function ForgotPasswordModal() {
  const navigate = useNavigate();

  const onClose = () => navigate("/users/login");

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[100]"
      aria-labelledby="fp-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute inset-0 grid place-items-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <h2 id="fp-title" className="text-lg font-semibold text-gray-50">
              Forgot your password?
            </h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-gray-800 text-gray-300"
            >
              ×
            </button>
          </div>

          {/* Body */}
          <form className="px-4 py-4 grid gap-3" noValidate>
            <div className="text-sm text-gray-400">Enter your email address and we'll send you a reset link.</div>

            <div>
              <Label htmlFor="fp-email">Email address</Label>
              <Input
                id="fp-email"
                name="email"
                type="email"
                placeHolder="you@example.com"
                className="mt-1"
              />
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button type="button" onClick={onClose} variant="secondary">
                Cancel
              </Button>
              <Button type="submit">Send reset link</Button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
