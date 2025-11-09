import React from "react";
import Container from "../../../components/Container";
import Button from "../../../components/Button";
import Badge from "../../../components/Badge";

/**
 * ProfilePage (UI-only)
 * - Pure presentation based on the provided payload
 * - No API calls or mutation logic; wire your handlers later
 */
export default function ProfilePage({ profile }) {
  const demo = {
    name: "Tran Ngoc Thao Vy",
    email: "TNTV9@gmail.com",
    avatar_url:
      "https://mivora-ap-southeast-1.s3.ap-southeast-1.amazonaws.com/avatar-images/egzwcma6gxnfuitlb2x17n3oq.jpg",
    verified: "verified",
    role: ["Attendee", "Organizer"],
  };

  const me = profile || demo;
  const isVerified = String(me.verified).toLowerCase() === "verified";

  return (
    <section id="profile" className="py-10 sm:py-14">
      <Container>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              My account
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              View and update your account information.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary">Cancel</Button>
            <Button>Save changes</Button>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Left: Avatar & meta */}
          <div className="rounded-lg h-45 border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50 p-2.5 shadow-sm ">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={me.avatar_url}
                  alt={me.name}
                  className="size-20 sm:size-24 rounded-2xl object-cover bg-gray-200 dark:bg-gray-800"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="text-base sm:text-lg font-semibold truncate max-w-[16rem]">
                    {me.name}
                  </div>
                  {isVerified ? (
                    <Badge tone="success">Verified</Badge>
                  ) : (
                    <Badge tone="neutral">Unverified</Badge>
                  )}
                </div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-300 truncate max-w-[20rem]">
                  {me.email}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {(me.role || []).map((r) => (
                    <Badge key={r} tone="pink" aria-label={`role: ${r}`}>
                      {r}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="secondary">Change avatar</Button>
              <Button variant="ghost">Remove</Button>
            </div>
          </div>

          {/* Right: Form fields (UI-only) */}
           <div className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/70 backdrop-blur p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Account</h2>

            <form className="flex flex-col gap-5">
              <div>
                <label
                  htmlFor="pf-name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  Full name
                </label>
                <input
                  id="pf-name"
                  type="text"
                  defaultValue={me.name}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-pink-500/60"
                />
              </div>

              <div>
                <label
                  htmlFor="pf-email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  Email
                </label>
                <input
                  id="pf-email"
                  type="email"
                  defaultValue={me.email}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/60 px-3 py-2 text-sm cursor-not-allowed text-gray-700 dark:text-gray-300"
                  readOnly
                />
              </div>

              <div>
                <label
                  htmlFor="pf-verified"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  Verification
                </label>
                <input
                  id="pf-verified"
                  type="text"
                  defaultValue={isVerified ? "Verified" : "Unverified"}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/60 px-3 py-2 text-sm cursor-not-allowed text-gray-700 dark:text-gray-300"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Roles
                </label>
                <div className="flex flex-wrap gap-2">
                  {(me.role || []).map((r) => (
                    <span
                      key={r}
                      className="inline-flex items-center gap-1 rounded-xl border border-gray-200 dark:border-gray-800 px-3 py-1.5 text-xs font-medium bg-white dark:bg-gray-900"
                    >
                      • {r}
                    </span>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}