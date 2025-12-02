import React from "react";
import { Link, useParams } from "react-router-dom";
import path from "../../constants/path";
type EventDetails = {
	id: string;
	organizer_id?: string;
	title: string;
	description?: string;
	poster_url?: string | null;
	location_text?: string;
	start_at?: string;
	end_at?: string;
	price_cents?: number;
	checked_in?: number;
	capacity?: number;
	status?: string;
};

type Props = {
	event?: EventDetails | null;
};

export default function EventDetailsPage({ event }: Props) {
	const { id } = useParams();

	const demo: EventDetails = {
		id: id ?? "demo",
		organizer_id: "unknown",
		title: "Sample Event",
		description:
			"A conference exploring emerging technologies and innovation trends.",
		start_at: "2025-11-20T09:00:00.000Z",
		end_at: "2025-11-20T17:00:00.000Z",
		poster_url: null,
		location_text: "Hall A · City Expo Center",
		price_cents: 2500,
		checked_in: 0,
		capacity: 150,
		status: "published",
	};

	const ev = event ?? demo;

	const formatDate = (iso?: string) => {
		if (!iso) return "TBA";
		const d = new Date(iso);
		return d.toLocaleString(undefined, {
			weekday: "short",
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "2-digit",
		});
	};

	return (
		<section id="event-details" className="py-10 sm:py-14">
			<div className="max-w-7xl mx-auto px-4">
				{/* Breadcrumb */}
						<nav className="mb-4 text-sm text-gray-400">
					<Link to="/events" className="hover:underline">
						Events
					</Link>
					<span className="mx-2">/</span>
							<span className="text-gray-100 font-medium">{ev.title}</span>
				</nav>

				{/* Header / Cover */}
						<div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
					<div className="relative">
						{ev.poster_url ? (
							<img
								src={ev.poster_url}
								alt={`${ev.title} poster`}
								className="aspect-[16/9] w-full object-cover"
								loading="lazy"
							/>
						) : (
							<div className="aspect-[16/9] w-full bg-gradient-to-br from-gray-800 to-gray-900" />
						)}
					</div>

					<div className="p-5">
						<div className="flex items-start justify-between gap-4">
							<div>
								<div className="text-xs font-medium uppercase tracking-wide text-pink-400">{formatDate(ev.start_at)}</div>
								<h1 className="mt-1 text-2xl sm:text-3xl font-semibold">{ev.title}</h1>
								<div className="mt-1 text-sm text-gray-300 flex flex-wrap items-center gap-2">
									<span>{ev.location_text}</span>
								</div>
							</div>
						</div>

						{/* Actions */}
						<div className="mt-4 flex flex-wrap items-center gap-2">
							<button className="px-3 py-2 rounded-xl text-sm font-medium bg-pink-600 text-white hover:bg-pink-700">
              <Link to={path.book_ticket} className="hover:underline">
						    Get tickets
					      </Link> 
            </button>
						</div>
					</div>
				</div>

				{/* Content grid */}
				<div className="mt-6 grid gap-6 lg:grid-cols-3 items-start">
					{/* Left: About + Organizer stacked */}
					<div className="lg:col-span-2 space-y-6">
						{/* About */}
								<div className="rounded-2xl border border-gray-800 bg-gray-900">
							<div className="p-5">
								<h2 className="text-lg font-semibold">About this event</h2>
								<p className="mt-2 text-sm text-gray-300">{ev.description}</p>
							</div>
						</div>
					</div>

					{/* Right: Details card */}
					<aside className="space-y-6">
								<div className="rounded-2xl border border-gray-800 bg-gray-900">
							<div className="p-5 space-y-3 text-sm">
								<div className="flex items-center justify-between">
									<span className="text-gray-300">Price</span>
									<span className="font-medium">{ev.price_cents}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-gray-300">Start</span>
									<span className="font-medium">{formatDate(ev.start_at)}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-gray-300">End</span>
									<span className="font-medium">{formatDate(ev.end_at)}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-gray-300">Location</span>
									<span className="font-medium">{ev.location_text}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-gray-300">Capacity</span>
									<span className="font-medium">{ev.capacity ?? '—'}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-gray-300">Checked in</span>
									<span className="font-medium">{ev.checked_in ?? 0}</span>
								</div>
							</div>
						</div>
					</aside>
				</div>
			</div>
		</section>
	);
}
