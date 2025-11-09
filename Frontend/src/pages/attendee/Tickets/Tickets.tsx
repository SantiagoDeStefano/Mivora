import { useState } from "react";
import Card from "../../../components/Card/Card";
import Badge from "../../../components/Badge/Badge";
import Button from "../../../components/Button/Button";

export default function TicketsPage() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [showQR, setShowQR] = useState(false);

  return (
    <section id="tickets" className="py-10 sm:py-14">
      <div className="mx-auto w-full max-w-3xl">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="mt-1 text-2xl sm:text-3xl font-semibold">Your tickets</h2>

        <div className="mt-4 sm:mt-0 inline-flex rounded-xl border border-gray-200 p-1 text-sm dark:border-gray-800">
          <button
            onClick={() => setTab("upcoming")}
            className={[
              "rounded-lg px-3 py-1.5",
              tab === "upcoming"
                ? "bg-gray-100 dark:bg-gray-800"
                : "hover:bg-gray-50 dark:hover:bg-gray-900",
            ].join(" ")}
          >
            Upcoming
          </button>
          <button
            onClick={() => setTab("past")}
            className={[
              "rounded-lg px-3 py-1.5",
              tab === "past"
                ? "bg-gray-100 dark:bg-gray-800"
                : "hover:bg-gray-50 dark:hover:bg-gray-900",
            ].join(" ")}
          >
            Past
          </button>
        </div>
      </header>
      </div>

 <div className="flex justify-center">
  <div className="w-full max-w-3xl">
    {tab === "upcoming" ? (
      <Card className="bg-gradient-to-br from-pink-50 to-white dark:from-pink-950/20 dark:to-gray-900">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h4 className="text-lg font-semibold">Neon Nights</h4>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Sat, Nov 8 • 7:30 PM • District 1, HCMC
            </p>
            <div className="mt-2">
              <Badge>VIP • Row B</Badge>
            </div>
          </div>
          <div className="text-right text-xs text-gray-500">
            <div>Order #MV-10284</div>
            <div className="mt-1 text-gray-400">Issued to you</div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {/* Left: QR */}
          <div className="relative rounded-2xl border border-gray-200 bg-white p-4 dark:bg-gray-900 dark:border-gray-800">
            <button onClick={() => setShowQR(true)} className="block w-full">
              <div
                className="aspect-square w-full rounded-lg bg-[conic-gradient(at_25%_25%,#000_0_25%,#fff_0_50%,#000_0_75%,#fff_0)] [background-size:16px_16px]"
                role="img"
                aria-label="Ticket QR"
              />
            </button>
            <p className="mt-2 text-center text-xs text-gray-500">
              Tap QR to enlarge • Refreshes every 30s
            </p>
          </div>

          {/* Right: Info */}
          <div className="space-y-3">
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
              <p className="text-xs text-gray-500">Admission</p>
              <p className="font-medium">Single-use • 1 of 1</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
              <p className="text-xs text-gray-500">Name on ticket</p>
              <p className="font-medium">Pham Khoi Nguyen</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
              <p className="text-xs text-gray-500">Add to wallet</p>
              <div className="mt-2 flex gap-2">
                <Button variant="secondary">Apple Wallet</Button>
                <Button variant="secondary">Google Wallet</Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    ) : (
      <Card>
        <h4 className="text-lg font-semibold">Past tickets</h4>
        <ul className="mt-4 space-y-3 text-sm">
          {[["Pink Expo 2025", "Checked in", "Oct 02, 2025"], ["Startup Night", "No-show", "Sep 20, 2025"], ["Art & Chill", "Checked in", "Aug 14, 2025"]].map(
            ([name, status, date]) => (
              <li
                key={name as string}
                className="flex items-center justify-between rounded-xl border border-gray-100 p-4 dark:border-gray-800"
              >
                <div>
                  <p className="font-medium">{name}</p>
                  <p className="text-xs text-gray-500">{date}</p>
                </div>
                <Badge tone={status === "Checked in" ? "success" : "warn"}>{status}</Badge>
              </li>
            )
          )}
        </ul>
      </Card>
    )}
  </div>
</div>


{/* Simple QR modal */}
{showQR && (
  <div
    role="dialog"
    aria-modal="true"
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6"
    onClick={() => setShowQR(false)}
  >
    <div
      className="w-full max-w-sm rounded-2xl bg-white p-4 shadow-xl dark:bg-gray-900"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="aspect-square w-full rounded-lg bg-[conic-gradient(at_25%_25%,#000_0_25%,#fff_0_50%,#000_0_75%,#fff_0)] [background-size:16px_16px]"
        aria-label="Ticket QR enlarged"
      />
      <div className="mt-3 text-right">
        <Button onClick={() => setShowQR(false)}>Close</Button>
      </div>
    </div>
  </div>
)}
    </section>
  );
}
