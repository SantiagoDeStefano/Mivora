import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import Container from "../../components/Container/Container";
import path from "../../constants/path";
type Ticket = {
  id: string;
  title: string;
  user_id: string;
  status: "booked" | "checked_in" | string;
  checked_in_at: string | null;
  price_cents: number;
  qr_code: string; // data:image/png;base64,...
};

// type ApiResponse = {
//   message: string;
//   result: {
//     tickets: Ticket[];
//   };
// };

// Mock tickets for local UI/testing
const mockTickets: Ticket[] = [
  {
    id: 'f5d09842-e566-4eb6-9a1f-59cbf8db712c',
    title: 'Tech Summit 2025',
    user_id: '88945d98-a228-42fe-89c8-f82c20bfc808',
    status: 'booked',
    checked_in_at: null,
    price_cents: 2500,
    qr_code: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASQAAAEkCAYAAACG+Uzs...'
  },
  {
    id: 'a1b2c3d4-e566-4eb6-9a1f-111111111111',
    title: 'Design Workshop',
    user_id: '88945d98-a228-42fe-89c8-f82c20bfc808',
    status: 'checked_in',
    checked_in_at: '2025-11-20T09:15:00.000Z',
    price_cents: 0,
    qr_code: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASQAAAEkCAYAAACG+Uzs...'
  },
  {
    id: 'z9y8x7w6-e566-4eb6-9a1f-222222222222',
    title: 'Music Fest',
    user_id: '88945d98-a228-42fe-89c8-f82c20bfc808',
    status: 'checked_in',
    checked_in_at: null,
    price_cents: 5000,
    qr_code: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASQAAAEkCAYAAACG+Uzs...'
  }
];

const statusLabel: Record<string, string> = {
  booked: "Booked",
  checked_in: "Checked-in",
};

const statusClass: Record<string, string> = {
  booked: "bg-yellow-100/80 text-yellow-800",
    checked_in: "bg-green-100/80 text-green-800",
};

function formatPrice(price_cents: number): string {
  const value = price_cents / 100;
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function formatCheckedIn(checked_in_at: string | null): string {
  if (!checked_in_at) return "Not checked in";
  const d = new Date(checked_in_at);
  return d.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate()

  useEffect(() => {
    // Use mock data for local development / UI
    // Simulate small delay so loading state is visible
    const t = setTimeout(() => {
      setTickets(mockTickets);
      setLoading(false);
    }, 200);

    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <section className="py-10 sm:py-14">
        <Container>
          <div className="min-h-[60vh] flex items-center justify-center">
            <p className="text-slate-500">Loading your tickets...</p>
          </div>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-10 sm:py-14">
        <Container>
          <div className="min-h-[60vh] flex items-center justify-center">
            <p className="text-red-500">{error}</p>
          </div>
        </Container>
      </section>
    );
  }

  if (!tickets.length) {
    return (
      <section className="py-10 sm:py-14">
        <Container>
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-slate-900">You have no tickets</h1>
              <p className="mt-2 text-slate-500">Once you book tickets, they will appear here.</p>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <div className="max-w-5xl mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-300">My Tickets</h1>
            <p className="mt-1 text-slate-500">View and use your tickets. Show the QR code at the event to check in.</p>
          </header> 

          <div className="flex flex-col gap-4">
            {tickets.map((ticket) => {
              const label = statusLabel[ticket.status] || ticket.status;
              const badgeClass =
                statusClass[ticket.status] || "bg-slate-50 text-slate-800";

              

              return (
                <div
                  key={ticket.id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-600 p-5 flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-300 line-clamp-2">
                        {ticket.title}
                      </h2>
                      <p className="mt-1 text-sm text-slate-300">
                        <span className="font-medium">Price:</span> {formatPrice(ticket.price_cents)}
                      </p>
                    </div>

                    <div className="flex items-start">
                      <span
                        className={
                          "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium " +
                          badgeClass
                        }
                      >
                        {label}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <div>
                      <span className="font-medium">Checked in at:</span>{' '}
                      {formatCheckedIn(ticket.checked_in_at)}
                    </div>
                    <div>
                      <button
                        onClick={() => navigate(path.my_ticket_details.replace(':id', ticket.id))}
                        className="inline-flex items-center justify-center rounded-full border border-transparent bg-pink-600 text-white px-4 py-2 text-xs font-medium hover:bg-pink-700"
                      >
                        View details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
      </div>
    </Container>
  </section>
  );
}
