import { useState } from 'react';
import { Button } from "../../components/Button";
import { Container } from "../../layouts/Container";
import { Card } from '../../components/Card';
import { useNavigate } from '../../hooks/useNavigate';

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [price, setPrice] = useState(''); // Use string for input, parse on submit
  const [capacity, setCapacity] = useState(''); // Use string for input, parse on submit

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Logic to send form data to your API endpoint
    const eventData = { 
      title, 
      description, 
      location, 
      dateTime, 
      price: parseFloat(price) || 0, // Convert to number for API
      capacity: parseInt(capacity, 10) || 0 // Convert to number for API
    };

    console.log("Submitting event:", eventData);
    const response = await fetch('/api/events', { method: 'POST', body: JSON.stringify(eventData) });
    if (response.ok) {
      navigate('/organizer/dashboard'); // Navigate back to dashboard on success
    }
  };

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <header className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold">Create a New Event</h2>
        </header>
        <Card>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Title */}
            <div className="sm:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium">Event Title</label>
              <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium">Description</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
            </div>

            {/* --- ADDED THIS SECTION --- */}
            {/* Location */}
            <div className="sm:col-span-2">
              <label htmlFor="location" className="block text-sm font-medium">Location</label>
              <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
            </div>

            {/* Date and Time */}
            <div>
              <label htmlFor="dateTime" className="block text-sm font-medium">Date & Time</label>
              <input type="datetime-local" id="dateTime" value={dateTime} onChange={(e) => setDateTime(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium">Price (₫)</label>
              <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} min="0" placeholder="e.g., 150000" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
            </div>
            
            {/* Capacity */}
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium">Capacity</label>
              <input type="number" id="capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} min="1" placeholder="e.g., 500" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
            </div>
            {/* --- END OF ADDED SECTION --- */}

            <div className="sm:col-span-2 text-right">
              <Button type="submit">Publish Event</Button>
            </div>
          </form>
        </Card>
      </Container>
    </section>
  );
}






