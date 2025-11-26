import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Container from "../../components/Container/Container";
import Badge from "../../components/Badge/Badge";

interface Attendee {
  id: string;
  name: string;
  ticketId: string;
  status: "Checked-in" | "Not Checked-in";
}

const sampleAttendees: Attendee[] = [
  { id: "att_1", name: "Alice Johnson", ticketId: "TIX-A1B2", status: "Checked-in" },
  { id: "att_2", name: "Bob Williams", ticketId: "TIX-C3D4", status: "Not Checked-in" },
  { id: "att_3", name: "Charlie Brown", ticketId: "TIX-E5F6", status: "Not Checked-in" },
  { id: "att_4", name: "Diana Prince", ticketId: "TIX-G7H8", status: "Checked-in" },
];

export default function ManageEventPage() {
  const { eventId } = useParams<{ eventId: string }>();

  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [eventName, setEventName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);

    // TODO: fetch by eventId
    setEventName("Neon Nights");
    setAttendees(sampleAttendees);

    setLoading(false);
  }, [eventId]);

  const sorted = useMemo(
    () => [...attendees].sort((a, b) => a.name.localeCompare(b.name)),
    [attendees]
  );
  const total = sorted.length;
  const checkedIn = sorted.filter((a) => a.status === "Checked-in").length;

  if (!eventId) {
    return (
      <section className="py-10 sm:py-14">
        <Container>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Missing event id.
          </p>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <div className="flex items-end gap-3 flex-wrap">
          <h2 className="text-2xl sm:text-3xl font-semibold">Manage: {eventName}</h2>
          <div className="flex items-center gap-2">
            <Badge tone="neutral">Total: {total}</Badge>
            <Badge tone="success">Checked-in: {checkedIn}</Badge>
          </div>
        </div>

        <h3 className="mt-4 text-lg font-semibold">Attendee List</h3>

        {/* Loading skeleton */}
        {loading && (
          <div className="mt-3 grid gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 rounded-lg animate-pulse bg-gray-200 dark:bg-gray-800" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && total === 0 && (
          <div className="mt-3 rounded-2xl border border-dashed p-8 text-center text-sm text-gray-600 dark:border-gray-800 dark:text-gray-300">
            No attendees yet.
          </div>
        )}

        {/* Table */}
        {!loading && total > 0 && (
          <div className="mt-3 overflow-auto rounded-xl border border-gray-100 dark:border-gray-800">
            <table
              className="min-w-full text-left text-sm"
              aria-label="Attendees table"
            >
              <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Ticket ID</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((attendee) => (
                  <tr key={attendee.id} className="border-t border-gray-100 dark:border-gray-800">
                    <td className="px-3 py-3 font-medium">{attendee.name}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{attendee.ticketId}</td>
                    <td className="px-3 py-3">
                      {attendee.status === "Checked-in" ? (
                        <Badge tone="success">Checked-in</Badge>
                      ) : (
                        <Badge tone="neutral">Not Checked-in</Badge>
                      )}
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
