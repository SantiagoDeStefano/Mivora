// src/pages/About/AboutPage.tsx
import React from "react";
import Container from "../../components/Container/Container";

export default function AboutPage() {
  return (
    <section className="py-10 sm:py-14">
      <Container>
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-300">
              About This Platform
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              A simple way to discover events, book tickets, and check in
              seamlessly at the venue.
            </p>
          </header>

          {/* Main content */}
          <div className="space-y-8 text-sm text-slate-300">
            <section>
              <h2 className="text-base font-semibold text-slate-300">
                What is this?
              </h2>
              <p className="mt-2">
                This platform lets you browse events, book tickets online, and
                use secure QR codes to check in at the venue. No printing, no
                paperwork – just your phone and your ticket.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-slate-300">
                How it works
              </h2>
              <ul className="mt-2 space-y-2 list-disc list-inside">
                <li>Browse available events and choose what you want to attend.</li>
                <li>Book your ticket securely in a few clicks.</li>
                <li>
                  Access all your tickets on the{" "}
                  <span className="font-medium text-slate-900">My Tickets</span>{" "}
                  page.
                </li>
                <li>Show your QR code at the event for fast check-in.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-slate-900">
                Why we built this
              </h2>
              <p className="mt-2">
                Managing events should not be painful. We focus on a clean,
                minimal experience for both organizers and attendees, so you
                spend less time fighting the system and more time running or
                enjoying the event.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-slate-900">
                Contact
              </h2>
              <p className="mt-2">
                Have feedback or found a bug? Reach out to us at{" "}
                <a
                  href="mailto:support@example.com"
                  className="font-medium text-slate-900 underline underline-offset-2"
                >
                  support@example.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </Container>
    </section>
  );
}
