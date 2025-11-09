// EventDetailsPage.tsx
// Presentational-only version (no state, no effects, no local logic)

import { Surface } from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import Badge from "../../components/Badge/Badge";
import Container from "../../components/Container/Container";



export type EventDetails = {
  id: string;
  title: string;
  description: string; // human-readable description
  date: string; // human-readable (e.g., "Sat, Nov 9 • 7:30 PM")
  location: string; // human-readable address or venue
  price: number; // in VND
  currency?: string; // default VND
  posterUrl?: string | null;
  trending?: boolean;
};

type EventDetailsPageProps = {
  event?: EventDetails | null;
  loading?: boolean;
  error?: string | null;
};

export default function EventDetailsPage({
  event = null,
  loading = false,
  error = null,
}: EventDetailsPageProps) {
  return (
    <section id="event-details" className="py-10 sm:py-14">
      <Container>
        {loading && <DetailsSkeleton />}

        {!loading && error && (
          <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-gray-600 dark:border-gray-800 dark:text-gray-300">
            {error}
          </div>
        )}

        {!loading && !error && event && (
          <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
            {/* Left column: Poster + Content */}
            <Surface className="overflow-hidden border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
              <Poster url={event.posterUrl} title={event.title} />
              <div className="p-6 sm:p-8">
                <header className="flex items-start gap-3">
                  {event.trending && <Badge tone="pink">Trending</Badge>}
                  <div>
                    <h1 className="text-2xl font-semibold sm:text-3xl">{event.title}</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{event.date}</p>
                  </div>
                </header>

                <dl className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                  <DetailRow label="When" value={event.date} />
                  <DetailRow label="Where" value={event.location} />
                  <DetailRow
                    label="Price"
                    value={formatPrice(event.price, event.currency)}
                  />
                </dl>

                <article className="prose prose-sm mt-6 max-w-none dark:prose-invert">
                  <p>{event.description}</p>
                </article>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button size="lg" aria-label={`Book ticket for ${event.title}`}>
                    Book ticket
                  </Button>
                  <Button variant="secondary" size="lg">
                    Share
                  </Button>
                </div>
              </div>
            </Surface>

            {/* Right column: Chat helper (UI only, disabled) */}
            <Surface className="h-max border-gray-200 bg-white p-0 dark:border-gray-800 dark:bg-gray-900">
              <ChatBox eventTitle={event.title} />
            </Surface>
          </div>
        )}
      </Container>
    </section>
  );
}

function Poster({ url, title }: { url?: string | null; title: string }) {
  if (!url) {
    return (
      <div
        className="aspect-[4/3] w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900"
        role="img"
        aria-label={`${title} poster placeholder`}
      />
    );
  }
  return (
    <img
      src={url}
      alt={`${title} poster`}
      className="aspect-[4/3] w-full object-cover"
      loading="lazy"
    />
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </div>
      <div className="mt-1 font-medium text-gray-900 dark:text-gray-100">{value}</div>
    </div>
  );
}

function formatPrice(amount: number, currency = "VND") {
  try {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    });
    return formatter.format(amount);
  } catch {
    return `${amount.toLocaleString()} ${currency}`;
  }
}

/** ---------------------------
 * Chat Box (UI only)
 * ----------------------------*/
function ChatBox({ eventTitle }: { eventTitle: string }) {
  const initialText = `Hi! I can help with questions about “${eventTitle}”. Ask about parking, dress code, schedule, or anything else.`;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 p-4 dark:border-gray-800">
        <h2 className="text-lg font-semibold">Event assistant</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">Got questions? Ask away.</p>
      </div>

      <div className="flex-1 space-y-3 overflow-auto p-4">
        <MessageBubble role="assistant" content={initialText} />
      </div>

      <div className="flex items-center gap-2 border-t border-gray-200 p-3 dark:border-gray-800">
        <input
          aria-label="Chat message"
          className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-950"
          placeholder="Chat is disabled in demo"
          disabled
          value=""
          onChange={() => {}}
        />
        <Button size="sm" aria-label="Send message" disabled>
          Send
        </Button>
      </div>
    </div>
  );
}

type ChatMessageRole = "assistant" | "user";

function MessageBubble({ role, content }: { role: ChatMessageRole; content: string }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
          isUser
            ? "bg-pink-600 text-white"
            : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
        }`}
      >
        {content}
      </div>
    </div>
  );
}

/** ---------------------------
 * Skeleton (unchanged, purely visual)
 * ----------------------------*/
function DetailsSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
      <Surface className="overflow-hidden border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="aspect-[4/3] animate-pulse bg-gray-200 dark:bg-gray-800" />
        <div className="space-y-4 p-6 sm:p-8">
          <div className="h-7 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-950" />
            ))}
          </div>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            ))}
          </div>
          <div className="h-10 w-32 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
        </div>
      </Surface>

      <Surface className="h-max border-gray-200 bg-white p-0 dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-200 p-4 dark:border-gray-800">
          <div className="h-6 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        </div>
        <div className="space-y-2 p-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-950" />
          ))}
        </div>
      </Surface>
    </div>
  );
}
