// src/pages/About/AboutPage.tsx
import React from 'react'
import Container from '../../components/Container/Container'

export default function AboutPage() {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-slate-950 to-slate-900">
      <Container>
        <div className="max-w-5xl mx-auto px-4">
          {/* Header */}
          <header className="mb-10 text-center">
            <span className="inline-flex items-center rounded-full border border-slate-700/70 bg-slate-900/70 px-3 py-1 text-xs font-medium text-slate-300 uppercase tracking-wide">
              Event Booking & Check-in
            </span>
            <h1 className="mt-4 text-3xl sm:text-4xl font-semibold text-slate-50">
              About This Platform
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
              Discover events, book tickets in seconds, and check in with a single QR scan.
              No printing, no hassle.
            </p>
          </header>

          {/* Main content */}
          <div className="grid gap-6 lg:grid-cols-[2fr,1.2fr] items-start">
            {/* Left column */}
            <div className="space-y-6 text-sm text-slate-200">
              <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
                <h2 className="text-base font-semibold text-slate-50">
                  What is this?
                </h2>
                <p className="mt-3 leading-relaxed">
                  This platform lets you browse events, book tickets online, and
                  use secure QR codes to check in at the venue. No printing, no
                  paperwork – just your phone and your ticket.
                </p>
              </section>

              <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
                <h2 className="text-base font-semibold text-slate-50">
                  How it works
                </h2>
                <ul className="mt-3 space-y-2.5 text-slate-200">
                  <li className="flex gap-3">
                    <span className="mt-1 h-5 w-5 flex-none rounded-full border border-pink-500/70 bg-pink-500/10 text-[10px] flex items-center justify-center text-pink-300">
                      1
                    </span>
                    <span>Browse available events and choose what you want to attend.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 h-5 w-5 flex-none rounded-full border border-pink-500/70 bg-pink-500/10 text-[10px] flex items-center justify-center text-pink-300">
                      2
                    </span>
                    <span>Book your ticket securely in a few clicks.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 h-5 w-5 flex-none rounded-full border border-pink-500/70 bg-pink-500/10 text-[10px] flex items-center justify-center text-pink-300">
                      3
                    </span>
                    <span>
                      Access all your tickets on the{' '}
                      <span className="font-semibold text-pink-300">My Tickets</span>{' '}
                      page.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 h-5 w-5 flex-none rounded-full border border-pink-500/70 bg-pink-500/10 text-[10px] flex items-center justify-center text-pink-300">
                      4
                    </span>
                    <span>Show your QR code at the event for fast check-in.</span>
                  </li>
                </ul>
              </section>

              <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
                <h2 className="text-base font-semibold text-slate-50">
                  Why we built this
                </h2>
                <p className="mt-3 leading-relaxed">
                  Managing events should not be painful. We focus on a clean,
                  minimal experience for both organizers and attendees, so you
                  spend less time fighting the system and more time running or
                  enjoying the event.
                </p>
              </section>
            </div>

            {/* Right column */}
            <aside className="space-y-6">
              {/* Stats / highlights */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6">
                <h3 className="text-sm font-semibold text-slate-50">
                  Built for real-world events
                </h3>
                <p className="mt-2 text-xs text-slate-300">
                  Everything is designed around speed at the door and clarity for
                  organizers.
                </p>

                <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-xl bg-slate-900 border border-slate-800 p-3">
                    <dt className="text-[11px] uppercase tracking-wide text-slate-400">
                      Check-in
                    </dt>
                    <dd className="mt-1 text-base font-semibold text-slate-50">
                      Under 3s
                    </dd>
                  </div>
                  <div className="rounded-xl bg-slate-900 border border-slate-800 p-3">
                    <dt className="text-[11px] uppercase tracking-wide text-slate-400">
                      Paperwork
                    </dt>
                    <dd className="mt-1 text-base font-semibold text-slate-50">
                      0 forms
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Contact */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6">
                <h2 className="text-base font-semibold text-slate-50">
                  Contact
                </h2>
                <p className="mt-3 text-sm text-slate-300">
                  Have feedback or found a bug? We would love to hear from you.
                </p>
                <a
                  href="mailto:support@example.com"
                  className="mt-4 inline-flex items-center justify-center rounded-xl border border-pink-500/70 bg-pink-500/10 px-4 py-2 text-sm font-medium text-pink-200 hover:bg-pink-500/20 transition"
                >
                  mivora@gmail.com
                </a>
              </div>

              {/* API Docs */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6">
                <h2 className="text-base font-semibold text-slate-50">
                  API Documentation
                </h2>
                <p className="mt-3 text-sm text-slate-300">
                  Explore our API documentation for developers who want to integrate with our platform.
                </p>
                <a
                  href="https://khoinguyenpham.name.vn/mivora/api-docs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center rounded-xl border border-pink-500/70 bg-pink-500/10 px-4 py-2 text-sm font-medium text-pink-200 hover:bg-pink-500/20 transition"
                >
                  View API Docs
                </a>
              </div>
            </aside>
          </div>
        </div>
      </Container>
    </section>
  )
}
