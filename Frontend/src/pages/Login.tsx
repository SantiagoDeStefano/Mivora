import { useMemo, useState } from "react";
import { Card } from "../components/Card";
import { Label } from "../components/Label";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Container } from "../layouts/Container";
import { useNavigate } from "../hooks/useNavigate";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const canSubmit = useMemo(
    () => /\S+@\S+\.\S+/.test(email) && pwd.length >= 8 && !busy,
    [email, pwd, busy]
  );

  return (
    <section id="login" className="py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-md">
          <Card>
            <header>
              <h2 className="text-2xl font-semibold">Log in</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Welcome back</p>
            </header>

            <div className="mt-4 grid gap-3">
              <button className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                Continue with Google
              </button>
              <button className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                Continue with Apple
              </button>
            </div>

            <div className="my-5 flex items-center gap-3 text-xs text-gray-500">
              <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
              <span>or continue with email</span>
              <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
            </div>

            <form
              className="grid gap-4"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!canSubmit) return;
                setBusy(true);
                // await auth…
                setTimeout(() => {
                  setBusy(false);
                  nav("/");
                }, 800);
              }}
            >
              <div>
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={email.length > 0 && !/\S+@\S+\.\S+/.test(email)}
                />
              </div>
              <div>
                <Label htmlFor="login-pass">Password</Label>
                <div className="relative">
                  <Input
                    id="login-pass"
                    type={show ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    className="absolute inset-y-0 right-2 my-auto rounded-md px-2 text-xs text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    aria-label={show ? "Hide password" : "Show password"}
                  >
                    {show ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4" /> Remember me
                </label>
                <a href="#" className="text-pink-600 hover:underline">
                  Forgot password?
                </a>
              </div>

              <Button type="submit" disabled={!canSubmit}>
                {busy ? "Logging in…" : "Log in"}
              </Button>
            </form>

            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              New to Mivora?{" "}
              <a href="/signup" className="text-pink-600 hover:underline">
                Create an account
              </a>
            </p>
          </Card>
        </div>
      </Container>
    </section>
  );
}
