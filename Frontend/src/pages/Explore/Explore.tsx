import React from "react";
import { Surface } from "../../components/Card/Card";
import Button from "../../components/Button";
import Badge from "../../components/Badge/Badge";
import Container from "../../components/Container/Container";

export type Filter = {
  when: "any" | "today" | "this-weekend";
  price: "any" | "lt300" | "300-700" | "gt700";
};

export type EventItem = {
  id: string | number;
  title: string;
  date: string;
  meta?: string;
  trending?: boolean;
};

type ExplorePageProps = {
  events?: EventItem[] | null;
  loading?: boolean;
  filter?: Filter;
  onFilterChange?: (next: Filter) => void;
  onViewEvent?: (id: string | number) => void;
  onGetTickets?: (id: string | number) => void;
  onApply?: () => void;
};

export default function ExplorePage({
  events = null,
  loading = false,
  filter = { when: "any", price: "any" },
  onFilterChange,
  onViewEvent,
  onGetTickets,
  onApply,
}: ExplorePageProps) {
  const disabled = !onFilterChange;

  return (
    <section id="explore" className="py-10 sm:py-14">
      <Container>
        <header className="mb-6 sm:mb-8">
          <h2 className="mt-1 text-2xl sm:text-3xl font-semibold">Explore events</h2>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900">
              <span className="text-gray-600 dark:text-gray-300">When</span>
              <select
                className="bg-transparent outline-none disabled:opacity-60"
                value={filter.when}
                onChange={(e) =>
                  onFilterChange?.({ ...filter, when: e.target.value as Filter["when"] })
                }
                disabled={disabled}
              >
                <option value="any">Anytime</option>
                <option value="today">Today</option>
                <option value="this-weekend">This weekend</option>
              </select>
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900">
              <span className="text-gray-600 dark:text-gray-300">Price</span>
              <select
                className="bg-transparent outline-none disabled:opacity-60"
                value={filter.price}
                onChange={(e) =>
                  onFilterChange?.({ ...filter, price: e.target.value as Filter["price"] })
                }
                disabled={disabled}
              >
                <option value="any">Any</option>
                <option value="lt300">&lt; 300K</option>
                <option value="300-700">300K–700K</option>
                <option value="gt700">&gt; 700K</option>
              </select>
            </div>

            <Button className="ml-auto" onClick={onApply} disabled={!onApply}>
              Apply
            </Button>
          </div>
        </header>

        {/* Loading skeleton */}
        {(loading || events === null) && (
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

        {/* Empty state */}
        {Array.isArray(events) && events.length === 0 && !loading && (
          <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-gray-600 dark:border-gray-800 dark:text-gray-300">
            No events yet — try adjusting filters.
          </div>
        )}

        {/* Grid of events */}
        {Array.isArray(events) && events.length > 0 && !loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => (
              <Surface
                key={e.id}
                className="overflow-hidden border-gray-800 bg-gray-950 text-white transition hover:shadow-lg focus-within:ring-2 focus-within:ring-pink-500"
              >
                <div className="aspect-[4/3] w-full bg-gradient-to-br from-gray-800 to-gray-900" />
                <div className="p-5">
                  <div className="text-xs font-medium uppercase tracking-wide text-pink-400">
                    {e.date}
                  </div>
                  <h3 className="mt-1 text-base font-semibold">{e.title}</h3>
                  {e.meta && <p className="mt-1 text-sm text-gray-300">{e.meta}</p>}

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        aria-label={`Get tickets for ${e.title}`}
                        onClick={() => onGetTickets?.(e.id)}
                        disabled={!onGetTickets}
                      >
                        Get tickets
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onViewEvent?.(e.id)}
                        aria-label={`View details for ${e.title}`}
                        disabled={!onViewEvent}
                      >
                        View event
                      </Button>
                    </div>
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
