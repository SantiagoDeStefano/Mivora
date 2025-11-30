import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import path from "../../constants/path";
import Container from "../../components/Container/Container";


type Ticket = {
  id: string;
  event_id: string;
  user_id: string;
  status: string;
  checked_in_at: string | null;
  price_cents: number;
  qr_code: string;
};

type BookingResponse = {
  message: string;
  result: { ticket: Ticket };
};

interface TicketSuccessProps {
  response?: BookingResponse;
  onViewEvent?: (eventId: string) => void;
  onGoToMyTickets?: () => void;
}

export default function TicketSuccess({ response, onViewEvent, onGoToMyTickets }: TicketSuccessProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // Prefer prop, then location.state.response, fallback to SAMPLE mock
  const SAMPLE: BookingResponse = {
    message: "Book ticket successfully",
    result: {
      ticket: {
        id: "f5d09842-e566-4eb6-9a1f-59cbf8db712c",
        event_id: "c278cbc0-26ce-4332-9d4f-64bb85a6969c",
        user_id: "88945d98-a228-42fe-89c8-f82c20bfc808",
        status: "booked",
        checked_in_at: null,
        price_cents: 2500,
        qr_code:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASQAAAEkCAYAAACG+UzsAAAAAklEQVR4AewaftIAABSsSURBVO3BQW7g2rLgQFLw/rfMrmGODiBI9tX7nRH2D2ut9QEXa631ERdrrfURF2ut9REXa631ERdrrfURF2ut9REXa631ERdrrfURF2ut9REXa631ERdrrfURF2ut9REXa631ER/PKTylyr+kspJxR0qU8WkMlVMKlPFpHJScaJyR8WkMlVMKicVb1I5qZhUpopJ5aTiCZWpYlKZKk5U/lLFExdrrfURF2ut9REXa631ET+8rOJNKneoTBWTyknFVDGpTConFW+qeEJlqpgq7lCZKk4qJpVJZaqYVKaKSeWk4qTipGJSmVSmikllqrijYlKZKk4q3qTypou11vqIi7XW+oiLtdb6iB9+mcodFXeo3FExqdxRcaIyqZyoTBWTylQxqUwVk8pUcaJyUjFVTCpTxaQyVUwqk8pUcVJxovJExVRxonKiMlVMKlPFm1TuqPhNF2ut9REXa631ERdrrfURP/x/RmWqmFROKiaVN6mcqJyonKjcUTGpnFRMKicqU8WkcofKScWJyonKHRV3qJyoTBX/l1ystdZHXKy11kdcrLXWR/zwf0zFScWkMlVMKpPKVDGpTBWTyknFicpJxYnKVHGicofKEypTxaTyhMpUMVWcqEwVk8qbKk5Upor/ZRdrrfURF2ut9REXa631ET/8soq/pHJHxR0Vb6qYVKaKO1SmijtUTiruUJkqJpU7KiaVqWJSOVE5qZgqTipOVKaKqWJSmSqmiicqvuRirbU+4mKttT7iYq21PuKHl6n8lyomlaliUpkq7lCZKiaVqWJSmSomlaliUpkqJpWpYlKZKiaVE5Wp4omKSWWqeKJiUpkqJpWpYlKZKiaVqWJSmSruUJkqTlS+7GKttT7iYq21PuJirbU+wv7hf5jKScWkMlWcqNxR8SUqJxUnKlPFHSpTxaTyRMWbVE4qTlSmikllqphU7qj4v+RirbU+4mKttT7iYq21PsL+4QGVqWJSeVPFicpUcaIyVZyovKniRGWqOFGZKiaVk4pJ5S9VTCpTxYnKHRWTyhMVb1I5qThReVPFb7pYa62PuFhrrY+4WGutj7B/eJHKmyruUJkq3qQyVTyhMlVMKlPFm1SmijtUpopJZaqYVO6o+EsXa631ERdrrfURF2ut9RE/PFTxRMWbKk4qnlCZKiaVE5Wp4kRlqrhDZap4ouJEZVKZKiaVL6mYVKaKSWWqmFTuUJkqpoo7VE4q7lCZKt50sdZaH3Gx1lofcbHWWh/xwy9TmSomlaliUnlCZao4UZkqJpVJZao4qbij4g6VqeJE5Q6VqWKqOFE5qZhUpooTlSdUpopJ5YmKO1TeVDGp3FExqUwVT1ystdZHXKy11kdcrLXWR/zwH6s4qZhUTlSmiknlDpWTijtUpopJ5S9VTCr/JZWpYlKZKt5UcVJxojJV/KaK/1LFmy7WWusjLtZa6yMu1lrrI354SGWqeELlpOJE5YmKE5VJ5Y6KSWWq+C9VTCp3qJxUnKicVJxU3KEyVTxRcYfKVHGicqJyUvFlF2ut9REXa631ERdrrfURPzxUcYfKVHFSMancoXJScUfFicpU8YTKb6qYVO5QmSomlROVE5WTikllqjipOFGZKiaVJypOVE5UflPFX7pYa62PuFhrrY+4WGutj7B/eJHKScWkMlVMKlPFicodFZPKScWkckfFm1ROKk5UpopJZaq4Q+VNFU+oTBUnKm+qOFE5qXhC5aTiDpWp4omLtdb6iIu11vqIi7XW+oiLtdb6gIu11vqIi7XW+oiLtdb6iIu11vqIi7XW+oiLtdb6iIu11vqIi7XW+oiLtdb6iIu11vqIi7XW+oiLtdb6iIu11vqIi7XW+oiLtdb6iIu11vqIi7XW+oiLtdb6iP8H6WwYpyiz46AAAAAASUVORK5CYII="
      }
    }
  };

  const resp: BookingResponse = response ?? (location.state as any)?.response ?? SAMPLE;
  const { message, result } = resp;
  const ticket = result.ticket;

  // Event title: prefer `resp.result.event.title` if present, then location.state.eventTitle, otherwise a sample title
  const eventTitle = (result as any).event?.title ?? (location.state as any)?.eventTitle ?? "Sample Event Title";

  const priceLabel = ticket.price_cents
    ? `$${(ticket.price_cents / 100).toFixed(2)}`
    : "Free ticket";  

  const isCheckedIn = Boolean(ticket.checked_in_at);

  const formatCheckedIn = (iso: string | null) => {
    if (!iso) return "Not checked in yet";
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch {
      return iso;
    }
  };

  const handleViewEventInternal = (eventId: string) => {
    if (onViewEvent) return onViewEvent(eventId);
    navigate(path.event_details.replace(":id", eventId));
  };

  const handleGoToMyTicketsInternal = () => {
    if (onGoToMyTickets) return onGoToMyTickets();
    navigate(path.my_tickets);
  };

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <div className="w-full max-w-2xl mx-auto">
        {/* Card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
          {/* Header */}
          <div className="border-b border-gray-100 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 px-6 py-4 text-white">
            <div className="text-xs uppercase tracking-[0.15em] opacity-80">
              Ticket confirmation
            </div>
            <div className="mt-1 text-lg font-semibold">
              {message || "Your ticket is booked"}
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-6 sm:py-7">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              {/* QR */}
              <div className="flex justify-center sm:block">
                <div className="inline-flex flex-col items-center gap-2">
                  <div className="rounded-xl bg-white p-2 shadow-sm">
                    <img
                      src={ticket.qr_code}
                      alt="Ticket QR"
                      className="h-40 w-40 sm:h-44 sm:w-44 rounded-lg object-contain"
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Scan this QR at the entrance to check in.
                  </p>
                </div>
              </div>

              {/* Right content */}
              <div className="flex-1 space-y-5">
                {/* Status + price */}
                <div>

                  <div className="mt-4">
                    <div className="text-xm uppercase tracking-wide text-gray-400">Ticket price</div>
                    <div className="mt-1 text-4xl font-semibold text-gray-100">{priceLabel}</div>
                    <div className="mt-2 text-xm text-gray-300">Event: <span className="font-medium">{eventTitle}</span></div>
                    <div className="mt-2 text-sm text-gray-500">{isCheckedIn ? `Checked in at ${formatCheckedIn(ticket.checked_in_at)}` : "Not checked in yet"}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">

                  <button
                    type="button"
                    onClick={() => handleViewEventInternal(ticket.event_id)}
                    className="mt-4 inline-flex items-center justify-center rounded-full border border-gray-200 bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-black active:bg-black/90 transition"
                  >
                    View event
                  </button>

                  <button
                    type="button"
                    onClick={handleGoToMyTicketsInternal}
                    className="mt-4 inline-flex items-center justify-center rounded-full border border-transparent bg-pink-900 px-4 py-2 text-sm font-medium text-white hover:bg-black active:bg-black/90 transition"
                  >
                    My tickets
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub copy */}
        <p className="mt-4 text-center text-xs text-gray-400">Keep this QR safe. Do not share it publicly.</p>
        </div>
      </Container>
    </section>
  );
}
