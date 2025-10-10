import { useMemo, useState } from "react";
import { Card } from "../components/Card";
import { Label } from "../components/Label";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { Button } from "../components/Button";
import { Container } from "../layouts/Container";
import { useNavigate } from "../hooks/useNavigate";

type Role = "attendee" | "organizer";

export default function SigninPage() {
  const nav = useNavigate();
  const [role, setRole] = useState<Role>("attendee");

  const [fn, setFn] = useState("");
  const [ln, setLn] = useState("");
  const [email, setEmail] = useState("");
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [agreed, setAgreed] = useState(false);

  // organizer-only fields
  const [orgName, setOrgName] = useState("");
  const [orgWebsite, setOrgWebsite] = useState("");

  const valid = useMemo(() => {
    const baseOk = fn && ln && /\S+@\S+\.\S+/.test(email) && p1.length >= 8 && p1 === p2 && agreed;
    if (role === "attendee") return baseOk;
    return baseOk && !!orgName; // organizer must provide org name
  }, [fn, ln, email, p1, p2, agreed, role, orgName]);

  return (
    <section id="signin" className="py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-md">
          <Card>
            <header>
              <h2 className="text-2xl font-semibold">Create your account</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Choose how you’ll use Mivora
              </p>
            </header>

            {/* Role selector */}
            <div className="mt-4 inline-flex w-full justify-between rounded-xl border border-gray-200 p-1 text-sm dark:border-gray-800">
              <button
                type="button"
                onClick={() => setRole("attendee")}
                className={[
                  "flex-1 rounded-lg px-3 py-2",
                  role === "attendee"
                    ? "bg-gray-100 dark:bg-gray-800"
                    : "hover:bg-gray-50 dark:hover:bg-gray-900",
                ].join(" ")}
                aria-pressed={role === "attendee"}
              >
                Attendee
              </button>
              <button
                type="button"
                onClick={() => setRole("organizer")}
                className={[
                  "flex-1 rounded-lg px-3 py-2",
                  role === "organizer"
                    ? "bg-gray-100 dark:bg-gray-800"
                    : "hover:bg-gray-50 dark:hover:bg-gray-900",
                ].join(" ")}
                aria-pressed={role === "organizer"}
              >
                Organizer
              </button>
            </div>

            <form
              className="mt-4 grid gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!valid) return;
                // Redirect by role (tweak as you wire real auth)
                if (role === "organizer") nav("/organizer");
                else nav("/tickets");
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="su-fn">First name</Label>
                  <Input id="su-fn" value={fn} onChange={(e) => setFn(e.target.value)} placeholder="Nguyen" />
                </div>
                <div>
                  <Label htmlFor="su-ln">Last name</Label>
                  <Input id="su-ln" value={ln} onChange={(e) => setLn(e.target.value)} placeholder="Tran" />
                </div>
              </div>

              <div>
                <Label htmlFor="su-email">Email</Label>
                <Input id="su-email" type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div>
                <Label htmlFor="su-pass">Password</Label>
                <Input id="su-pass" type="password" placeholder="At least 8 characters" value={p1} onChange={(e) => setP1(e.target.value)} />
              </div>

              <div>
                <Label htmlFor="su-pass-2">Confirm password</Label>
                <Input id="su-pass-2" type="password" placeholder="Re-enter your password" value={p2} onChange={(e) => setP2(e.target.value)} />
                {p2.length > 0 && p1 !== p2 && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">Passwords don’t match.</p>
                )}
              </div>

              {/* Organizer-only fields */}
              {role === "organizer" && (
                <>
                  <div>
                    <Label htmlFor="org-name">Organization name</Label>
                    <Input id="org-name" placeholder="Your brand or company" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="org-website">Website (optional)</Label>
                    <Input id="org-website" placeholder="https://example.com" value={orgWebsite} onChange={(e) => setOrgWebsite(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="su-locale">Primary language</Label>
                    <Select id="su-locale" defaultValue="en">
                      <option value="en">English</option>
                      <option value="vi">Tiếng Việt</option>
                      <option value="ar">العربية (RTL)</option>
                    </Select>
                  </div>
                </>
              )}

              {/* Attendee language (optional) */}
              {role === "attendee" && (
                <div>
                  <Label htmlFor="su-locale">Preferred language</Label>
                  <Select id="su-locale" defaultValue="en">
                    <option value="en">English</option>
                    <option value="vi">Tiếng Việt</option>
                    <option value="ar">العربية (RTL)</option>
                  </Select>
                </div>
              )}

              <label className="text-xs text-gray-600 dark:text-gray-400">
                <input type="checkbox" className="mr-2" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                I agree to the <a href="#" className="text-pink-600 hover:underline">Terms</a> and{" "}
                <a href="#" className="text-pink-600 hover:underline">Privacy Policy</a>.
              </label>

              <Button type="submit" disabled={!valid}>
                {role === "organizer" ? "Create organizer account" : "Create account"}
              </Button>
            </form>

            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <a href="/login" className="text-pink-600 hover:underline">Log in</a>
            </p>
          </Card>
        </div>
      </Container>
    </section>
  );
}
