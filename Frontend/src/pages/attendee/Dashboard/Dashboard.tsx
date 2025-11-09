import { Link } from "react-router-dom";
import { useMemo } from "react";

export default function AttendeeHomePage({ user, events = [], tickets = []}) {
  // Fallback demo data so the page looks n ice before you wire the API
  const demoUser = useMemo(
    () => ({ name: "Attendee", email: "attendee@example.com" }),
    []
  );

  const me = user || demoUser;

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    const source = events?.length ? events : [
      {
        id: "evt_1",
        title: "TechConf 2026 — Day 1",
        startsAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 9, 0).toISOString(),
        venue: "Hall A, City Expo",
        cover: "/src/assets/event-cover-1.jpg",
      },
      {
        id: "evt_2",
        title: "Design Summit — Workshops",
        startsAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 21, 13, 30).toISOString(),
        venue: "Studio B",
        cover: "/src/assets/event-cover-2.jpg",
      },
    ];

    return [...source].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  }, [events]);

  const myTickets = useMemo(() => {
    const source = tickets?.length ? tickets : [
      {
        id: "tkt_1234",
        eventId: upcomingEvents?.[0]?.id || "evt_1",
        eventTitle: upcomingEvents?.[0]?.title || "TechConf 2026 — Day 1",
        status: "Confirmed",
        qr: "QR-ABCDEF",
      },
      {
        id: "tkt_5678",
        eventId: upcomingEvents?.[1]?.id || "evt_2",
        eventTitle: upcomingEvents?.[1]?.title || "Design Summit — Workshops",
        status: "Pending",
        qr: "QR-ZYXWVU",
      },
    ];
    return source;
  }, [tickets, upcomingEvents]);

  return (
    <div className="min-h-[100dvh] bg-gray-50 dark:bg-gray-950">

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Welcome */}
        <section className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
                Chào {me?.name} 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Đây là trang tổng quan của bạn. Xem sự kiện sắp tới, vé của bạn và cập nhật hồ sơ.
              </p>
            </div>
          </div>
        </section>

        {/* Quick stats */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card title="Sự kiện sắp tới" value={upcomingEvents.length} footer="Được sắp xếp theo thời gian" />
          <Card title="Vé của tôi" value={myTickets.length} footer="Bao gồm vé chờ xác nhận" />
          <Card title="Thông báo" value={3} footer="Tin mới từ ban tổ chức" />
        </section>

        {/* Two columns */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Upcoming events */}
          <div className="lg:col-span-2 space-y-4">
            <SectionHeader title="Sự kiện sắp diễn ra" link={{ to: "/events", label: "Xem tất cả" }} />
            {upcomingEvents?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingEvents.slice(0, 4).map((ev) => (
                  <EventCard key={ev.id} ev={ev} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Chưa có sự kiện nào"
                description="Theo dõi trang Explore để tìm sự kiện phù hợp."
                action={{ to: "/events", label: "Khám phá sự kiện" }}
              />
            )}
          </div>

          {/* My tickets */}
          <div className="space-y-4">
            <SectionHeader title="Vé của tôi" link={{ to: "/tickets", label: "Xem tất cả" }} />
            {myTickets?.length ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-800 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900">
                {myTickets.slice(0, 5).map((t) => (
                  <TicketRow key={t.id} ticket={t} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Bạn chưa có vé"
                description="Vé đã mua sẽ hiển thị tại đây."
                action={{ to: "/events", label: "Mua vé ngay" }}
              />
            )}
          </div>
        </section>
      </main>

    </div>
  );
}

/*** UI bits ***/
function Card({ title, value, footer }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
      <div className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-50">{value}</div>
      {footer && (
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">{footer}</div>
      )}
    </div>
  );
}

function SectionHeader({ title, link }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-50">
        {title}
      </h2>
      {link && (
        <Link
          to={link.to}
          className="text-sm font-medium text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300"
        >
          {link.label}
        </Link>
      )}
    </div>
  );
}

function EventCard({ ev }) {
  const starts = new Date(ev.startsAt);
  const date = starts.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const time = starts.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link
      to={`/events/${ev.id}`}
      className="group rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900 hover:shadow-sm transition-shadow"
    >
      <div className="relative aspect-[16/9] bg-gray-100 dark:bg-gray-800">
        {ev.cover ? (
          <img
            src={ev.cover}
            alt="Event cover"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-2 left-2 rounded-xl bg-white/80 dark:bg-gray-900/70 backdrop-blur px-2 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-200">
          {date} • {time}
        </div>
      </div>
      <div className="p-4">
        <div className="font-medium text-gray-900 dark:text-gray-50 line-clamp-1">
          {ev.title}
        </div>
        {ev.venue && (
          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
            {ev.venue}
          </div>
        )}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-lg bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300">
            Đăng ký
          </span>
          <span className="text-xs px-2 py-1 rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            Chi tiết
          </span>
        </div>
      </div>
    </Link>
  );
}

function TicketRow({ ticket }) {
  return (
    <Link
      to={`/tickets/${ticket.id}`}
      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900/70 transition-colors"
    >
      <div className="size-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-semibold text-gray-700 dark:text-gray-300">
        QR
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 dark:text-gray-50 truncate">
          {ticket.eventTitle}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{ticket.id}</div>
      </div>
      <span
        className={
          "text-xs font-medium px-2.5 py-1 rounded-xl " +
          (ticket.status === "Confirmed"
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
            : ticket.status === "Pending"
            ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300")
        }
      >
        {ticket.status}
      </span>
    </Link>
  );
}

function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 p-6 text-center">
      <div className="text-base font-medium text-gray-900 dark:text-gray-50">{title}</div>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
      {action && (
        <Link
          to={action.to}
          className="inline-flex mt-3 px-3 py-1.5 rounded-xl text-sm font-medium bg-pink-600 text-white hover:bg-pink-700"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
