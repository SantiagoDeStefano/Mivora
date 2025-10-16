import { useEffect, useState } from 'react';
// 1. Import useParams from react-router-dom
import { useParams } from 'react-router-dom';
import { Container } from '../../layouts/Container';
import { Badge } from '../../components/Badge';

// Dummy data structure
interface Attendee {
  id: string;
  name: string;
  ticketId: string;
  status: 'Checked-in' | 'Not Checked-in';
}

// Sample data to make the component render something
const sampleAttendees: Attendee[] = [
  { id: 'att_1', name: 'Alice Johnson', ticketId: 'TIX-A1B2', status: 'Checked-in' },
  { id: 'att_2', name: 'Bob Williams', ticketId: 'TIX-C3D4', status: 'Not Checked-in' },
  { id: 'att_3', name: 'Charlie Brown', ticketId: 'TIX-E5F6', status: 'Not Checked-in' },
  { id: 'att_4', name: 'Diana Prince', ticketId: 'TIX-G7H8', status: 'Checked-in' },
];

export default function ManageEventPage() {
  // 2. Use useParams to get URL parameters like 'eventId'
  const { eventId } = useParams<{ eventId: string }>();

  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [eventName, setEventName] = useState('');

  useEffect(() => {
    if (!eventId) return;

    // --- LOGIC UPDATED FOR DEMONSTRATION ---
    console.log("Fetching data for event:", eventId);
    
    // 1. Fetch event name and attendees for the given eventId from your API
    // For now, we'll use our sample data.
    setEventName("Neon Nights"); 
    setAttendees(sampleAttendees);
    
    // 2. Your real-time listener setup would go here.
    // This part remains conceptually the same.

  }, [eventId]); 

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <h2 className="text-2xl sm:text-3xl font-semibold">Manage: {eventName}</h2>
        <h3 className="mt-4 text-lg font-semibold">Attendee List</h3>
        <div className="mt-3 overflow-auto rounded-xl border border-gray-100 dark:border-gray-800">
          <table className="min-w-full text-left text-sm">
            {/* Added a table header for clarity */}
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-3 py-2 font-medium">Name</th>
                <th className="px-3 py-2 font-medium">Ticket ID</th>
                <th className="px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendees.map(attendee => (
                <tr key={attendee.id} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="px-3 py-3 font-medium">{attendee.name}</td>
                  <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{attendee.ticketId}</td>
                  <td className="px-3 py-3">
                    {attendee.status === 'Checked-in' 
                      ? <Badge tone="success">{attendee.status}</Badge> 
                      : <Badge tone="neutral">{attendee.status}</Badge>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}