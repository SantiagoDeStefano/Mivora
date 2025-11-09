import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ExplorePage, { EventItem, Filter } from './Explore'

// Mock data for UI display
const mockEvents: EventItem[] = [
  {
    id: 1,
    title: "Neon Nights: Live DJ Set",
    date: "Sat, Nov 8 • 7:30 PM",
    meta: "District 1, HCMC • From 300K",
    trending: true
  },
  {
    id: 2,
    title: "Indie Sunset Sessions",
    date: "Sun, Nov 9 • 6:00 PM",
    meta: "District 2, HCMC • From 250K",
    trending: false
  },
  {
    id: 3,
    title: "Startup Night: Pitches & Beers",
    date: "Mon, Nov 10 • 7:00 PM",
    meta: "District 1, HCMC • From 150K",
    trending: true
  },
  {
    id: 4,
    title: "Pink Expo 2025",
    date: "Fri, Nov 14 • 9:00 AM",
    meta: "District 7, HCMC • From 500K",
    trending: false
  },
  {
    id: 5,
    title: "Art & Chill",
    date: "Sat, Nov 15 • 4:00 PM",
    meta: "District 3, HCMC • From 200K",
    trending: true
  },
  {
    id: 6,
    title: "Saigon Comedy Hour",
    date: "Sun, Nov 16 • 8:00 PM",
    meta: "District 1, HCMC • From 350K",
    trending: false
  }
]

export default function ExploreContainer() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<Filter>({ when: 'any', price: 'any' })

  const handleFilterChange = (nextFilter: Filter) => {
    setFilter(nextFilter)
  }

  const handleViewEvent = (id: string | number) => {
    navigate(`/events/${id}`)
  }

  const handleGetTickets = (id: string | number) => {
    navigate(`/events/${id}`)
  }

  const handleApply = () => {
    console.log('Applying filters:', filter)
  }

  return (
    <ExplorePage
      events={mockEvents}
      loading={false}
      filter={filter}
      onFilterChange={handleFilterChange}
      onViewEvent={handleViewEvent}
      onGetTickets={handleGetTickets}
      onApply={handleApply}
    />
  )
}

