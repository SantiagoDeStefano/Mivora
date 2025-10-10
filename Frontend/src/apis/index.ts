export type EventCard = { id: number; date: string; title: string; meta: string; trending?: boolean };

export const EventsAPI = {
  async listExplore(): Promise<EventCard[]> {
    return Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      date: "Sat, Nov 8 • 7:30 PM",
      title: [
        "Neon Nights: Live DJ Set",
        "Indie Sunset Sessions",
        "Startup Night: Pitches & Beers",
        "Pink Expo 2025",
        "Art & Chill",
        "Saigon Comedy Hour",
      ][i % 6],
      meta: "District 1, HCMC • From 300K",
      trending: i % 2 === 0,
    }));
  },
};