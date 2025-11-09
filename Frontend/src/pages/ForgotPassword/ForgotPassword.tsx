import { Link } from "react-router-dom";

/**
 * ForgotPassword (UI only)
 * - Pure presentation: no state, no API calls, no business logic
 * - Accessible labels, focus styles, responsive & dark mode ready
 */
export default function ForgotPassword() {
  return (
    <div className="min-h-[100dvh] flex flex-col">

      <main className="flex-1 grid place-items-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
              Forgot your password?
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Enter your email address and we'll send you a reset link.
            </p>
          </div>

          {/* UI-only form: prevent default submit, no logic */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-5 space-y-4"
            noValidate
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Email address
              </label>
              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/60"
              />
            </div>

            <button
              type="submit"
              className="w-full px-3 py-2 rounded-xl text-sm font-medium bg-pink-600 text-white hover:bg-pink-700"
            >
              Send reset link
            </button>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span>Remember your password? </span>
              <Link to="/login" className="text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 font-medium">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

