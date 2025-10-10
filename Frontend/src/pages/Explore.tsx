import { useEffect, useMemo, useState } from "react";
import { Surface } from "../components/Card";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { Container } from "../layouts/Container";
import { EventsAPI, type EventCard } from "../apis";

type Filter = { when: "any" | "today" | "this-weekend"; price: "any" | "lt300" | "300-700" | "gt700" };

export default function ExplorePage() {
  const [events, setEvents] = useState<EventCard[] | null>(null);
  const [filter, setFilter] = useState<Filter>({ when: "any", price: "any" });

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await EventsAPI.listExplore();
      if (mounted) setEvents(data);
    })();
    return () => { mounted = false; };
  }, []);

  const visible = useMemo(() => {
    if (!events) return null;
    // demo filters (client-side only)
    return events.filter(() => {
      const okWhen = filter.when === "any" ? true : true; // plug real logic later
      const okPrice = filter.price === "any" ? true : true;
      return okWhen && okPrice;
    });
  }, [events, filter]);

  return (
    <section id="explore" className="py-10 sm:py-14">
      <Container>
        <header className="mb-6 sm:mb-8">
          <h2 className="mt-1 text-2xl sm:text-3xl font-semibold">Explore events</h2>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900">
              <span className="text-gray-600 dark:text-gray-300">When</span>
              <select
                className="bg-transparent outline-none"
                value={filter.when}
                onChange={(e) => setFilter((f) => ({ ...f, when: e.target.value as Filter["when"] }))}
              >
                <option value="any">Anytime</option>
                <option value="today">Today</option>
                <option value="this-weekend">This weekend</option>
              </select>
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900">
              <span className="text-gray-600 dark:text-gray-300">Price</span>
              <select
                className="bg-transparent outline-none"
                value={filter.price}
                onChange={(e) => setFilter((f) => ({ ...f, price: e.target.value as Filter["price"] }))}
              >
                <option value="any">Any</option>
                <option value="lt300">&lt; 300K</option>
                <option value="300-700">300K–700K</option>
                <option value="gt700">&gt; 700K</option>
              </select>
            </div>

            <Button className="ml-auto">Apply</Button>
          </div>
        </header>

        {/* Loading */}
        {events === null && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Surface key={i} className="overflow-hidden border-gray-200 dark:border-gray-800">
                <div className="aspect-[4/3] animate-pulse bg-gray-200 dark:bg-gray-800" />
                <div className="p-5 space-y-2">
                  <div className="h-3 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-4 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-3 w-36 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                </div>
              </Surface>
            ))}
          </div>
        )}

        {/* Empty */}
        {events?.length === 0 && (
          <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-gray-600 dark:border-gray-800 dark:text-gray-300">
            No events yet — try adjusting filters.
          </div>
        )}

        {/* Grid */}
        {visible && visible.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((e) => (
              <Surface
                key={e.id}
                className="overflow-hidden border-gray-800 bg-gray-950 text-white transition hover:shadow-lg focus-within:ring-2 focus-within:ring-pink-500"
              >
                <div className="aspect-[4/3] w-full bg-gradient-to-br from-gray-800 to-gray-900" />
                <div className="p-5">
                  <div className="text-xs font-medium uppercase tracking-wide text-pink-400">{e.date}</div>
                  <h3 className="mt-1 text-base font-semibold">{e.title}</h3>
                  <p className="mt-1 text-sm text-gray-300">{e.meta}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <Button size="sm" aria-label={`Get tickets for ${e.title}`}>Get tickets</Button>
                    {e.trending && <Badge tone="pink">Trending</Badge>}
                  </div>
                </div>
              </Surface>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
