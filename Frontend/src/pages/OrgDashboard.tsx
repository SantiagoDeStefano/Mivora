import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Container } from "../layouts/Container";

function Kpi({ label, value, hint, gradient = "from-pink-100 to-pink-50" }: { label: string; value: string; hint?: string; gradient?: string }) {
  return (
    <Card>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">{hint}</p>}
      <div className={["mt-4 h-20 rounded-lg bg-gradient-to-r", gradient].join(" ")} aria-hidden />
    </Card>
  );
}

export default function OrgDashboard() {
  const rows = [
    ["Neon Nights", "Nov 8", "1,024", "₫339M", "On sale"],
    ["Pink Expo 2025", "Oct 2", "2,411", "₫920M", "Completed"],
    ["Startup Night", "Sep 20", "884", "₫310M", "Completed"],
  ];

  return (
    <section id="org-dashboard" className="py-10 sm:py-14">
      <Container>
        <header className="mb-6 sm:mb-8">
          <p className="text-sm font-medium uppercase tracking-wider text-pink-600">Organizer</p>
          <h2 className="mt-1 text-2xl sm:text-3xl font-semibold">Dashboard</h2>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          <Kpi label="Today’s sales" value="₫12,450,000" hint="+14% vs yesterday" />
          <Kpi label="Check-ins" value="842" hint="Peak: 7:15 PM" gradient="from-gray-100 to-white" />
          <Card>
            <p className="text-sm text-gray-500 dark:text-gray-400">Conversion funnel</p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              {[["Views", "12.3k"], ["Adds", "1.9k"], ["Purchases", "864"]].map(([k, v]) => (
                <div key={k as string} className="rounded-xl border border-gray-100 p-3 dark:border-gray-800">
                  <p className="text-gray-500 dark:text-gray-400">{k}</p>
                  <p className="mt-1 font-semibold">{v}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 overflow-hidden">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">Events</h4>
              <div className="flex gap-2">
                <Button variant="secondary">Export CSV</Button>
                <Button>Create event</Button>
              </div>
            </div>

            <div className="mt-3 overflow-auto rounded-xl border border-gray-100 dark:border-gray-800">
              <table className="min-w-[720px] text-left text-sm">
                <thead className="sticky top-0 bg-white/80 backdrop-blur dark:bg-gray-950/70">
                  <tr className="text-gray-500 dark:text-gray-400">
                    {["Event", "Date", "Tickets", "Revenue", "Status"].map((h) => (
                      <th key={h} className="px-3 py-2 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 && (
                    <tr><td colSpan={5} className="px-3 py-6 text-center text-gray-500">No events yet.</td></tr>
                  )}
                  {rows.map(([e, d, t, r, s]) => (
                    <tr key={e as string} className="border-t border-gray-100 align-middle dark:border-gray-800">
                      <td className="px-3 py-3 font-medium">{e}</td>
                      <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{d}</td>
                      <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{t}</td>
                      <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{r}</td>
                      <td className="px-3 py-3">{s === "On sale" ? <Badge tone="info">{s}</Badge> : <Badge tone="success">{s}</Badge>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <h4 className="text-lg font-semibold">Quick actions</h4>
            <div className="mt-3 grid gap-3">
              {[["Create event", "Start from a template"], ["Issue refund", "Partial or full"], ["Export attendees", "CSV"], ["Invite teammate", "Set roles & perms"]].map(([t, d]) => (
                <button
                  key={t as string}
                  className="flex w-full items-center justify-between rounded-xl border border-gray-200 p-4 text-left hover:border-pink-200 focus-visible:ring-2 focus-visible:ring-pink-500 dark:border-gray-800 dark:hover:border-pink-700"
                >
                  <span>
                    <span className="block font-medium">{t}</span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400">{d}</span>
                  </span>
                  <span aria-hidden className="ml-3">→</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Card>
            <h4 className="text-lg font-semibold">Event builder</h4>
            <ol className="mt-3 space-y-2 text-sm">
              {["Basics", "Content", "Ticketing", "Preview", "Publish"].map((s, i) => (
                <li key={s} className={i < 2 ? "rounded-xl border p-3 border-pink-300 bg-pink-50 dark:border-pink-700/40 dark:bg-pink-900/10" : "rounded-xl border p-3 border-gray-200 dark:border-gray-800"}>
                  {i + 1}. {s}
                </li>
              ))}
            </ol>
          </Card>
          <Card>
            <h4 className="text-lg font-semibold">Check-in hub</h4>
            <ul className="mt-3 space-y-3 text-sm">
              <li className="flex items-center justify-between rounded-xl border border-gray-200 p-3 dark:border-gray-800"><span>Scan mode</span><Badge>Fast</Badge></li>
              <li className="flex items-center justify-between rounded-xl border border-gray-200 p-3 dark:border-gray-800"><span>Duplicate detection</span><Badge tone="success">On</Badge></li>
              <li className="flex items-center justify-between rounded-xl border border-gray-200 p-3 dark:border-gray-800"><span>Offline</span><Badge tone="warn">Ready</Badge></li>
              <li className="flex items-center justify-between rounded-xl border border-gray-200 p-3 dark:border-gray-800"><span>Staff passes</span><Badge tone="info">3 active</Badge></li>
            </ul>
            <div className="mt-4 grid gap-2">
              <Button>Open scanner</Button>
              <Button variant="secondary">Generate staff code</Button>
            </div>
          </Card>
          <Card>
            <h4 className="text-lg font-semibold">Payouts</h4>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">Next payout in 2 days • Fees breakdown available</div>
            <div className="mt-3 h-24 rounded-lg bg-gradient-to-r from-violet-100 to-white dark:from-violet-900/20 dark:to-gray-900" aria-hidden />
          </Card>
        </div>
      </Container>
    </section>
  );
}
