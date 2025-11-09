import React from "react";
import { Link, useParams } from "react-router-dom";

type EventDetails = {
  id: string;
  title: string;
  description: string;
  date: string;        // e.g. "Fri, May 9 • 7:30 PM"
  location: string;    // e.g. "Hall A · City Expo Center"
  price: number;       // e.g. 350000
  currency: string;    // e.g. "VND" | "USD"
  posterUrl: string | null;
  trending?: boolean;
};

type Props = {
  event?: EventDetails | null; // có thể truyền từ parent; nếu không có sẽ dùng demo fallback
};

export default function EventDetailsPage({ event }: Props) {
  const { id } = useParams();

  // Fallback demo để UI không bị trống khi event chưa có
  const demo: EventDetails = {
    id: id ?? "demo",
    title: "Sample Event",
    description:
      "This is a demo description for the event details page. Replace it with real data once your API is wired.",
    date: "Fri, May 9 • 7:30 PM",
    location: "Hall A · City Expo Center",
    price: 350000,
    currency: "VND",
    posterUrl: null,
    trending: true,
  };

  // Luôn dùng `ev` trong JSX để tránh đọc từ `event` (có thể null)
  const ev = event ?? demo;

  // Helper hiển thị giá
  const formatPrice = (value: number, currency: string) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency === "VND" ? "VND" : currency,
      maximumFractionDigits: currency === "VND" ? 0 : 2,
    }).format(value);

  return (
    <section id="event-details" className="py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          <Link to="/events" className="hover:underline">
            Events
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-gray-100 font-medium">
            {ev.title}
          </span>
        </nav>

        {/* Header / Cover */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="relative">
            {ev.posterUrl ? (
              <img
                src={ev.posterUrl}
                alt={`${ev.title} poster`}
                className="aspect-[16/9] w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="aspect-[16/9] w-full bg-gradient-to-br from-gray-800 to-gray-900" />
            )}
            {ev.trending && (
              <span className="absolute left-3 top-3 rounded-xl bg-pink-600/90 px-2 py-1 text-xs font-medium text-white">
                Trending
              </span>
            )}
          </div>

          <div className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-pink-600 dark:text-pink-400">
                  {ev.date}
                </div>
                <h1 className="mt-1 text-2xl sm:text-3xl font-semibold">
                  {ev.title}
                </h1>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400 flex flex-wrap items-center gap-2">
                  <span>{ev.location}</span>
                </div>
              </div>

              <div className="ml-auto text-sm text-gray-700 dark:text-gray-300 shrink-0">
                From{" "}
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatPrice(ev.price, ev.currency)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button className="px-3 py-2 rounded-xl text-sm font-medium bg-pink-600 text-white hover:bg-pink-700">
                Get tickets
              </button>
              <a
                href="#agenda"
                className="px-3 py-2 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                View agenda
              </a>
            </div>
          </div>
        </div>

        {/* Content grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3 items-start">
          {/* Left: About & Agenda */}
          <div className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="p-5 space-y-5">
              <section>
                <h2 className="text-lg font-semibold">About this event</h2>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  {ev.description}
                </p>
              </section>

              <section id="agenda" className="pt-2">
                <h3 className="text-base font-semibold">Agenda</h3>
                <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>09:00 – Opening keynote</li>
                  <li>10:30 – Workshops (Track A/B)</li>
                  <li>12:30 – Lunch & expo</li>
                  <li>14:00 – Panel: The future of AI tooling</li>
                </ul>
              </section>
            </div>
          </div>

          {/* Right: Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="p-5 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Price</span>
                  <span className="font-medium">
                    {formatPrice(ev.price, ev.currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Date</span>
                  <span className="font-medium">{ev.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Venue</span>
                  <span className="font-medium">{ev.location}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="p-5">
                <h3 className="text-base font-semibold">Organizer</h3>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  BrandName Team
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <a
                    href="#contact"
                    className="px-3 py-1.5 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Contact
                  </a>
                  <a
                    href="#follow"
                    className="px-3 py-1.5 rounded-xl text-sm font-medium bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:opacity-90"
                  >
                    Follow
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
