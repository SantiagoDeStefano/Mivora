import { useEffect, useMemo, useState } from "react";
import Container from "../../components/Container/Container";
import Badge from "../../components/Badge/Badge";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

type EventStatus = "draft" | "published";

interface EventItem {
  id: string;
  name: string;
  date: string; // ISO or display string
  status: EventStatus;
}

const sampleEvents: EventItem[] = [
  { id: "evt_1", name: "Neon Nights", date: "2025-12-01", status: "published" },
  { id: "evt_2", name: "Summer Jam", date: "2025-08-15", status: "draft" },
  { id: "evt_3", name: "Tech Expo 2025", date: "2025-09-20", status: "published" },
  { id: "evt_4", name: "Indie Film Fest", date: "2025-10-05", status: "draft" },
];

export default function ManageEventPage() {
  const navigate = useNavigate();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EventStatus | "all">("all");

  useEffect(() => {
    setLoading(true);

    // TODO: fetch events created by current organizer
    setEvents(sampleEvents);

    setLoading(false);
  }, []);

  const filtered = useMemo(() => {
    let list = [...events];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((e) => e.name.toLowerCase().includes(q));
    }

    if (statusFilter !== "all") {
      list = list.filter((e) => e.status === statusFilter);
    }

    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [events, search, statusFilter]);

  const total = events.length;
  const totalDraft = events.filter((e) => e.status === "draft").length;
  const totalPublished = events.filter((e) => e.status === "published").length;

  return (
    <section className="py-10 sm:py-14">
      <Container>
        {/* Header + create button */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl sm:text-3xl font-semibold">
              Manage Events
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge tone="neutral">Total: {total}</Badge>
              <Badge tone="neutral">Draft: {totalDraft}</Badge>
              <Badge tone="success">Published: {totalPublished}</Badge>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full bg-pink-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
            onClick={() => {
              // TODO: navigate to create event page
              navigate("/dashboard/events/create");
            }}
          >
            Create event
          </button>
        </div>

        {/* Controls: search + filter */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
              Search events
            </label>
            <input
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 dark:border-gray-800 bg-gray-100 dark:text-gray-100 dark:focus:border-gray-600 dark:focus:ring-gray-700"
              placeholder="Type event name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Status
            </span>
            <div className="inline-flex rounded-full border border-gray-200 bg-gray-50 p-1 text-xs dark:border-gray-800 dark:bg-gray-900">
              {[
                { label: "All", value: "all" as const },
                { label: "Draft", value: "draft" as const },
                { label: "Published", value: "published" as const },
              ].map((opt) => {
                const active = statusFilter === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    className={[
                      "rounded-full px-3 py-1 font-medium transition-colors",
                      active
                        ? "bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-gray-50"
                        : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50",
                    ].join(" ")}
                    onClick={() => setStatusFilter(opt.value)}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="mt-4 grid gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-12 rounded-lg animate-pulse bg-gray-200 dark:bg-gray-800"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="mt-4 rounded-2xl border border-dashed p-8 text-center text-sm text-gray-600 dark:border-gray-800 dark:text-gray-300">
            No events found.
          </div>
        )}

        {/* Table */}
        {!loading && filtered.length > 0 && (
          <div className="mt-4 overflow-auto rounded-xl border border-gray-100 dark:border-gray-800">
            <table
              className="min-w-full text-left text-sm"
              aria-label="Events table"
            >
              <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Date</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((event) => (
                  <tr
                    key={event.id}
                    className="border-t border-gray-100 dark:border-gray-800"
                  >
                    <td className="px-3 py-3 font-medium">{event.name}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">
                      {event.date}
                    </td>
                    <td className="px-3 py-3">
                      {event.status === "published" ? (
                        <Badge tone="success">Published</Badge>
                      ) : (
                        <Badge tone="neutral">Draft</Badge>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-full bg-gray-900 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus:ring-gray-300 dark:focus:ring-offset-gray-950"
                          onClick={() => {
                            // TODO: navigate to event details
                            navigate(`/dashboard/events/${event.id}`);
                          }}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Container>
    </section>
  );
}
