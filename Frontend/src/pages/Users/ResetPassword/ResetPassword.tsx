import { useNavigate, useSearchParams } from "react-router-dom";
import ReactDOM from "react-dom";
import Label from "../../../components/Label/Label";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button";

export default function ResetPasswordModal() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  // Nếu cần, token verify sẽ nằm ở query ?token=...
  const token = params.get("token"); // hiện tại chỉ đọc, chưa dùng

  const onClose = () => navigate("/users/login");
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // UI-only: sau khi “đổi mật khẩu” xong thì quay về login
    navigate("/users/login");
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[100]"
      aria-labelledby="rp-title"
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
        <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <h2
              id="rp-title"
              className="text-lg font-semibold text-gray-900 dark:text-gray-50"
            >
              Reset your password
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
          <form onSubmit={onSubmit} className="px-4 py-4 grid gap-3" noValidate>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Enter a new password for your account.
            </div>

            {/* (Optional) Hiển thị token đã verify cho dev check */}
            {/* <div className="text-xs text-gray-400">token: {token}</div> */}

            <div>
              <Label htmlFor="rp-pass">New password</Label>
              <Input
                id="rp-pass"
                name="password"
                type="password"
                placeHolder="At least 8 characters"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="rp-pass-confirm">Confirm new password</Label>
              <Input
                id="rp-pass-confirm"
                name="passwordConfirm"
                type="password"
                placeHolder="Re-enter new password"
                className="mt-1"
              />
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button type="button" onClick={onClose} variant="secondary">
                Cancel
              </Button>
              <Button type="submit">Change password</Button>
            </div>

            {/* Gợi ý nhỏ */}
            <p className="text-xs text-gray-500 mt-1">
              Use at least 8 characters with a mix of letters and numbers.
            </p>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
