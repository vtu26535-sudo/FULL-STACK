import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getAuthUser } from '../utils/auth';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const user = getAuthUser();

  useEffect(() => {
    // Both logged in and guests may view events based on backend security, but usually need auth if they book.
    api.get('/events').then((res) => {
      setEvents(res.data);
    }).catch(err => {
      console.error("Failed to fetch events", err);
    });
  }, []);

  const handleBookClick = (evt) => {
    if (new Date() > new Date(evt.eventDateTime)) {
      alert("Time completed! Event registration deadline has passed.");
      return;
    }
    if (!user) {
      navigate('/login');
    } else {
      navigate(`/book/${evt.id}`);
    }
  };

  return (
    <div>
      <h1 className="page-title">Available Events</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {events.map((evt) => {
          const isActive = evt.availableTickets > 0;
          return (
            <div key={evt.id} className="glass-card">
              <h3 style={{ marginBottom: '1rem', color: 'var(--sky-mist-accent)' }}>{evt.name}</h3>
              <p><strong>Department:</strong> {evt.department}</p>
              <p><strong>Venue:</strong> {evt.venue}</p>
              <p><strong>Registration Deadline:</strong> {evt.eventDateTime}</p>
              <p><strong>Price:</strong> {evt.ticketPrice}</p>
              <p><strong>Tickets Available:</strong> {evt.availableTickets}</p>
              <div style={{ marginTop: '1.5rem' }}>
                {isActive ? (
                  <button className="btn-primary" onClick={() => handleBookClick(evt)} style={{ width: '100%' }}>
                    Book Now
                  </button>
                ) : (
                  <button className="btn-secondary" disabled style={{ width: '100%', opacity: 0.6, cursor: 'not-allowed' }}>
                    Sold Out / Closed
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventList;
