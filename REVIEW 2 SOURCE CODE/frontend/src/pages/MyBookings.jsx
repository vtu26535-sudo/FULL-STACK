import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { getAuthUser } from '../utils/auth';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getAuthUser();

  useEffect(() => {
    if (user) {
      api.get('/book/me')
        .then(res => {
          setBookings(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  if (!user) {
    return <div className="container"><h2>Please log in to view your bookings.</h2></div>;
  }

  return (
    <div className="container">
      <h1 className="page-title">My Registered Events</h1>
      
      {loading ? (
        <p>Loading your bookings...</p>
      ) : bookings.length === 0 ? (
        <p>You have not registered for any events yet.</p>
      ) : (
        <div className="glass-panel">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Event Name</th>
                <th>Date / Time</th>
                <th>Tickets Booked</th>
                <th>Total Paid</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(bk => (
                <tr key={bk.bookingId}>
                  <td>{bk.bookingId}</td>
                  <td>{bk.eventName}</td>
                  <td>-</td> {/* If we had date in Bookings, we could show it. Skipping date for simplicity as it lives on Event */}
                  <td>{bk.numberOfTickets}</td>
                  <td>{bk.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
