import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Surface } from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import Badge from "../../components/Badge/Badge";
import Container from "../../components/Container/Container";
import { EventsAPI, type EventCard } from "../../apis";

/**
 * Event Details page
 *
 * Shows: title, description, date, location, price, poster
 * Extras: chat box (simple on-page helper) + "Book Ticket" button
 */

type EventDetails = {
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

// Some backends may not include these fields on EventCard. Support both via a widened type.
type EventCardExtended = EventCard & {
  description?: string;
  location?: string;
  price?: number;
  posterUrl?: string | null;
  trending?: boolean;
};

function mapToDetails(src: EventCard): EventDetails {
  const e = src as EventCardExtended; // safe, we only *read* optional fields
  return {
    id: String(src.id),
    title: src.title,
    description:
      typeof e.description === "string" && e.description.trim().length > 0
        ? e.description
        : "No description provided yet. This event looks exciting—stay tuned for more details!",
    date: src.date,
    location: e.location ?? "TBA",
    price: typeof e.price === "number" ? e.price : 0,
    currency: "VND",
    posterUrl: e.posterUrl ?? null,
    trending: e.trending ?? false,
  };
}

export default function EventDetailsPage({ eventId: eventIdProp }: { eventId?: string }) {
  const params = useParams();
  const eventId = eventIdProp ?? params.id ?? "";

  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        // If you already expose a details endpoint, prefer that:
        // const data = await EventsAPI.getDetails(eventId);
        // For demo, try to build from listExplore when getDetails isn't available
        const list: EventCard[] = await EventsAPI.listExplore();
        const found = list?.find((e: EventCard) => String(e.id) === String(eventId));
        if (!mounted) return;
        if (!found) {
          setError("Event not found.");
          setLoading(false);
          return;
        }
        // Map to EventDetails shape (extend here if your API already has these fields)
        const mapped = mapToDetails(found);
        setEvent(mapped);
        setLoading(false);
      } catch (err: unknown) {
        if (!mounted) return;
        if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load event.");
      }
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [eventId]);

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

            {/* Right column: Chat helper */}
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
    // Default to VND formatting; tweak as needed
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

// --- Chat Box ---

type ChatMessage = { id: string; role: "assistant" | "user"; content: string };

function ChatBox({ eventTitle }: { eventTitle: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: "m0",
    role: "assistant",
    content: `Hi! I can help with questions about “${eventTitle}”. Ask about parking, dress code, schedule, or anything else.`,
  }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || busy) return;

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    // Demo assistant: lightweight, local heuristics. Replace with your backend/LLM call.
    setBusy(true);
    const reply = await fakeAssistantReply(text);
    setBusy(false);

    const asstMsg: ChatMessage = { id: crypto.randomUUID(), role: "assistant", content: reply };
    setMessages((m) => [...m, asstMsg]);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 p-4 dark:border-gray-800">
        <h2 className="text-lg font-semibold">Event assistant</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">Got questions? Ask away.</p>
      </div>

      <div className="flex-1 space-y-3 overflow-auto p-4">
        {messages.map((m) => (
          <MessageBubble key={m.id} role={m.role} content={m.content} />
        ))}
        {busy && (
          <div className="text-xs text-gray-500">Typing…</div>
        )}
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-gray-200 p-3 dark:border-gray-800">
        <input
          aria-label="Chat message"
          className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-pink-500 dark:border-gray-700 dark:bg-gray-950"
          placeholder="Ask about parking, refunds, schedule…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button type="submit" size="sm" disabled={busy || input.trim().length === 0} aria-label="Send message">
          Send
        </Button>
      </form>
    </div>
  );
}

function MessageBubble({ role, content }: { role: ChatMessage["role"]; content: string }) {
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

async function fakeAssistantReply(text: string) {
  // super tiny rule-based demo; replace with real API
  const t = text.toLowerCase();
  if (/(refund|cancel)/.test(t)) {
    return "Tickets are refundable up to 48 hours before the event starts. After that, transfers are allowed but not refunds.";
  }
  if (/(park|parking)/.test(t)) {
    return "There is on-site parking (first come, first served). Nearby public lots are available at 123 Nguyen Hue and 9 Dong Khoi.";
  }
  if (/(dress|code)/.test(t)) {
    return "Smart casual is perfect. The venue is air-conditioned.";
  }
  if (/(door|open|schedule|time)/.test(t)) {
    return "Doors open 60 minutes before showtime. The main act starts on the hour.";
  }
  return "Thanks for your question! A team member will get back to you soon. In the meantime, check your confirmation email for specifics.";
}

// --- Skeleton ---

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
