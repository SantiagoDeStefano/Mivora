import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import Label from "../../../components/Label/Label";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button";

/**
 * ForgotPasswordModal (UI-only)
 * - Pop-out modal dialog for requesting a reset link via email
 * - Pure presentation: no API calls; you wire the submit handler if needed
 * - Accessibility: ESC to close, overlay click to close, labelled dialog
 */
export default function ForgotPasswordModal({ open, onClose }) {
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    // focus email field when opening
    const t = setTimeout(() => inputRef.current?.focus(), 0);

    // close on ESC
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    // prevent background scroll
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = original;
    };
  }, [open, onClose]);

  if (!open) return null;

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
        <div
          ref={containerRef}
          className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <h2 id="fp-title" className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Forgot your password?
            </h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
            >
              ×
            </button>
          </div>

          {/* Body */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="px-4 py-4 grid gap-3"
            noValidate
          >
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Enter your email address and we'll send you a reset link.
            </div>

            <div>
              <Label htmlFor="fp-email">Email address</Label>
              <Input
                id="fp-email"
                name="email"
                type="email"
                placeHolder="you@example.com"
                className="mt-1"
                ref={inputRef}
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

