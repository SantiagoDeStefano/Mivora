import { Card } from "../../components/Card";
import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import { Container } from "../../layouts/Container";
import { useNavigate } from "../../hooks/useNavigate";

export default function OrganizerDashboard() {
  // Initialize the navigate function from your hook
  const navigate = useNavigate();

  const rows = [
    { id: "evt_1", name: "Neon Nights", date: "Nov 8", tickets: "1,024", revenue: "₫339M", status: "On sale" },
    { id: "evt_2", name: "Pink Expo 2025", date: "Oct 2", tickets: "2,411", revenue: "₫920M", status: "Completed" },
  ];

  return (
    <section id="org-dashboard" className="py-10 sm:py-14">
      <Container>
        {/* Header and KPI sections remain the same */}
        
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 overflow-hidden">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">Events</h4>
              <div className="flex gap-2">
                <Button variant="secondary">Export CSV</Button>
                {/* Use onClick for programmatic navigation */}
                <Button onClick={() => navigate('/organizer/create-event')}>
                  Create event
                </Button>
              </div>
            </div>

            <div className="mt-3 overflow-auto rounded-xl border ...">
              <table className="min-w-[720px] text-left text-sm">
                {/* ... thead ... */}
                <tbody>
                  {rows.map((event) => (
                    // Add onClick to the table row for navigation
                    <tr 
                      key={event.id} 
                      className="border-t border-gray-100 align-middle dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
                      onClick={() => navigate(`/organizer/events/${event.id}`)}
                    >
                      <td className="px-3 py-3 font-medium">{event.name}</td>
                      <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{event.date}</td>
                      <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{event.tickets}</td>
                      <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{event.revenue}</td>
                      <td className="px-3 py-3">{event.status === "On sale" ? <Badge tone="info">{event.status}</Badge> : <Badge tone="success">{event.status}</Badge>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          {/* ... other cards ... */}
        </div>
      </Container>
    </section>
  );
}