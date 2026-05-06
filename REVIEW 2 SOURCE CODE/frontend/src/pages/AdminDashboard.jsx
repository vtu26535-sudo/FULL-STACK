import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { isAdmin } from '../utils/auth';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  // Create Event Form state
  const [newEvent, setNewEvent] = useState({
    name: '', department: '', eventDateTime: '', venue: '', ticketPrice: '', availableTickets: ''
  });

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/events');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const evtRes = await api.get('/admin/events');
      setEvents(evtRes.data);
      const bkgRes = await api.get('/admin/bookings');
      setBookings(bkgRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/events', newEvent);
      alert('Event Created Successfully!');
      setNewEvent({ name: '', department: '', eventDateTime: '', venue: '', ticketPrice: '', availableTickets: '' });
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to create event');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await api.delete(`/admin/events/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
        alert('Failed to delete event.');
      }
    }
  };

  return (
    <div>
      <h1 className="page-title">Admin Dashboard</h1>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
        <button 
          className={activeTab === 'events' ? 'btn-primary' : 'btn-secondary'} 
          onClick={() => setActiveTab('events')}
        >
          Manage Events
        </button>
        <button 
          className={activeTab === 'bookings' ? 'btn-primary' : 'btn-secondary'} 
          onClick={() => setActiveTab('bookings')}
        >
          View Bookings
        </button>
      </div>

      {activeTab === 'events' && (
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div className="glass-panel" style={{ flex: '1 1 300px' }}>
            <h3>Create New Event</h3>
            <form onSubmit={handleCreateEvent} style={{ marginTop: '1rem' }}>
              <div className="form-group"><input type="text" className="form-control" placeholder="Event Name" value={newEvent.name} onChange={e => setNewEvent({...newEvent, name: e.target.value})} required/></div>
              <div className="form-group"><input type="text" className="form-control" placeholder="Department" value={newEvent.department} onChange={e => setNewEvent({...newEvent, department: e.target.value})} required/></div>
              <div className="form-group"><input type="datetime-local" className="form-control" placeholder="Registration Deadline" value={newEvent.eventDateTime} onChange={e => setNewEvent({...newEvent, eventDateTime: e.target.value})} required/></div>
              <div className="form-group"><input type="text" className="form-control" placeholder="Venue" value={newEvent.venue} onChange={e => setNewEvent({...newEvent, venue: e.target.value})} required/></div>
              <div className="form-group"><input type="number" className="form-control" placeholder="Ticket Price" value={newEvent.ticketPrice} onChange={e => setNewEvent({...newEvent, ticketPrice: e.target.value})} required/></div>
              <div className="form-group"><input type="number" className="form-control" placeholder="Total Tickets" value={newEvent.availableTickets} onChange={e => setNewEvent({...newEvent, availableTickets: e.target.value})} required/></div>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Create Event</button>
            </form>
          </div>

          <div style={{ flex: '2 1 500px' }}>
            <h3>All Events</h3>
            <table className="styled-table">
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>Dept</th><th>Price</th><th>Tickets</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {events.map(ev => (
                  <tr key={ev.id}>
                    <td>{ev.id}</td><td>{ev.name}</td><td>{ev.department}</td><td>{ev.ticketPrice}</td><td>{ev.availableTickets}</td>
                    <td><button onClick={() => handleDeleteEvent(ev.id)} style={{background: '#ff4d4d', color:'white', border:'none', padding:'0.5rem', borderRadius:'4px', cursor:'pointer'}}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div>
          <h3>All Registered Students / Bookings (Total: {bookings.length})</h3>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Booking ID</th><th>User / Student</th><th>Email</th><th>Event ID</th><th>Event Name</th><th>Tickets</th><th>Total Amt</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(bk => (
                <tr key={bk.bookingId}>
                  <td>{bk.bookingId}</td><td>{bk.userName}</td><td>{bk.email}</td><td>{bk.eventId}</td><td>{bk.eventName}</td><td>{bk.numberOfTickets}</td><td>{bk.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
