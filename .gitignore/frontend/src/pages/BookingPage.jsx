import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { auth } from '../config/firebase';

const BookingPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMockModal, setShowMockModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [mockPaymentLoading, setMockPaymentLoading] = useState(false);
  const [currentBookingData, setCurrentBookingData] = useState(null);

  useEffect(() => {
    api.get(`/events/${eventId}`).then(res => {
      setEventData(res.data);
    }).catch(err => {
      console.error(err);
    });
  }, [eventId]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (eventData && ticketCount > eventData.availableTickets) {
      setMessage(`Only ${eventData.availableTickets} tickets available!`);
      return;
    }

    // Check Firebase Email Verification
    if (auth.currentUser && !auth.currentUser.emailVerified) {
      setMessage('Please verify your email before booking tickets.');
      setTimeout(() => navigate('/verify-email'), 2000);
      return;
    }
    
    setLoading(true);
    const res = await loadRazorpay();
    if (!res) {
      setMessage('Razorpay SDK failed to load. Are you online?');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        eventId: parseInt(eventId),
        numberOfTickets: ticketCount
      };
      
      // Step 1: Create Order & Booking on Backend
      const response = await api.post('/book', payload);
      const bookingData = response.data;
      
      // Step 2: Open Razorpay Checkout
      const razorpayKey = 'rzp_test_YourTestKeyIdHere'; // Replace with actual key
      
      if (razorpayKey.includes('YourTestKey')) {
         // MOCK MODE: Show custom Mock Payment UI
         setCurrentBookingData(bookingData);
         setShowMockModal(true);
         setLoading(false);
         return;
      }

      const options = {
        key: razorpayKey,
        amount: bookingData.totalAmount * 100, // Amount is in currency subunits (paise)
        currency: 'INR',
        name: 'EventHub Booking',
        description: `Tickets for ${eventData.name}`,
        order_id: bookingData.razorpayOrderId, // This is the order ID created in the backend
        handler: async function (response) {
          // Step 3: Verify Payment Signature on Backend
          try {
            await api.post('/payment/verify', {
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              bookingId: bookingData.id
            });
            setMessage('Payment successful! Redirecting to My Bookings...');
            setTimeout(() => navigate('/my-bookings'), 2000);
          } catch (verifyErr) {
             setMessage('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: bookingData.name || '',
          email: bookingData.email || '',
          contact: '9999999999' // Dummy default contact
        },
        theme: {
          color: '#38bdf8' // Matches Sky Mist accent
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
         setMessage(`Payment failed: ${response.error.description}`);
      });
      paymentObject.open();

    } catch (err) {
      setMessage(err.response?.data || 'Error creating booking order.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '600px', margin: '4rem auto' }}>
      <h2 className="page-title" style={{ fontSize: '2rem' }}>Complete Booking</h2>
      {eventData && (
        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.5)', borderRadius: '8px' }}>
          <h4>Booking for: {eventData.name}</h4>
          <p>Price per ticket: ₹{eventData.ticketPrice}</p>
        </div>
      )}
      
      {message && (
        <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '8px', background: message.includes('success') ? 'var(--success)' : 'var(--danger)', color: 'white' }}>
          {message}
        </div>
      )}

      <form onSubmit={handleBooking}>
        <div className="form-group">
          <label>Number of Tickets</label>
          <input 
            type="number" 
            min="1" 
            max={eventData ? eventData.availableTickets : 10}
            className="form-control" 
            value={ticketCount} 
            onChange={(e) => setTicketCount(parseInt(e.target.value) || 1)} 
            required 
            disabled={loading}
          />
        </div>

        {eventData && (
          <div style={{ margin: '1.5rem 0', fontSize: '1.2rem', fontWeight: 'bold' }}>
            Total Amount: ₹{(eventData.ticketPrice * ticketCount).toFixed(2)}
          </div>
        )}

        {eventData && new Date() > new Date(eventData.eventDateTime) ? (
          <button type="button" className="btn-secondary" style={{ width: '100%', fontSize: '1.1rem', opacity: 0.6, cursor: 'not-allowed' }} disabled>
            Deadline Passed
          </button>
        ) : (
          <button type="submit" className="btn-success" style={{ width: '100%', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }} disabled={loading}>
            {loading ? (
              <span style={{ display: 'inline-block', width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderRadius: '50%', borderTopColor: '#fff', animation: 'spin 1s ease-in-out infinite' }}></span>
            ) : (
              'Pay with Razorpay'
            )}
          </button>
        )}
      </form>

      {showMockModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-panel" style={{ width: '90%', maxWidth: '400px', background: 'white', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#0f172a' }}>
              Test Payment Gateway
            </h3>
            
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {['card', 'upi', 'qr'].map(method => (
                <button 
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  style={{
                    flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1',
                    background: paymentMethod === method ? '#e0f2fe' : 'transparent',
                    color: paymentMethod === method ? '#0284c7' : '#64748b',
                    cursor: 'pointer', fontWeight: paymentMethod === method ? 'bold' : 'normal'
                  }}
                >
                  {method.toUpperCase()}
                </button>
              ))}
            </div>

            <div style={{ minHeight: '150px', marginBottom: '1.5rem' }}>
              {paymentMethod === 'card' && (
                <div>
                  <input type="text" placeholder="Card Number (Test)" defaultValue="4242 4242 4242 4242" className="form-control" style={{ marginBottom: '0.5rem' }} />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="text" placeholder="MM/YY" defaultValue="12/26" className="form-control" />
                    <input type="text" placeholder="CVV" defaultValue="123" className="form-control" />
                  </div>
                </div>
              )}
              {paymentMethod === 'upi' && (
                <div>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Enter any UPI ID for testing:</p>
                  <input type="text" placeholder="e.g. success@razorpay" defaultValue="success@razorpay" className="form-control" />
                </div>
              )}
              {paymentMethod === 'qr' && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=demo@ybl&pn=EventHub&am=${(eventData?.ticketPrice * ticketCount).toFixed(2)}&cu=INR`)}`} 
                      alt="UPI QR Code" 
                      style={{ border: '4px solid white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                  </div>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.5rem' }}>Scan with PhonePe, GPay, or Paytm</p>
                </div>
              )}
            </div>

            <button 
              onClick={async () => {
                setMockPaymentLoading(true);
                // Simulate network delay
                await new Promise(r => setTimeout(r, 1500));
                try {
                  await api.post('/payment/verify', {
                    razorpayPaymentId: 'mock_pay_' + Date.now(),
                    razorpayOrderId: currentBookingData.razorpayOrderId || 'mock_order',
                    razorpaySignature: 'mock_sig',
                    bookingId: currentBookingData.id
                  });
                  setMessage('Payment successful! Redirecting to My Bookings...');
                  setShowMockModal(false);
                  setTimeout(() => navigate('/my-bookings'), 2000);
                } catch (verifyErr) {
                  setMessage('Mock Payment verification failed.');
                  setShowMockModal(false);
                }
                setMockPaymentLoading(false);
              }}
              className="btn-primary" 
              style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              disabled={mockPaymentLoading}
            >
              {mockPaymentLoading ? (
                <span style={{ display: 'inline-block', width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderRadius: '50%', borderTopColor: '#fff', animation: 'spin 1s ease-in-out infinite' }}></span>
              ) : (
                `Pay ₹${(eventData?.ticketPrice * ticketCount).toFixed(2)}`
              )}
            </button>
            <button 
              onClick={() => setShowMockModal(false)} 
              style={{ width: '100%', background: 'transparent', border: 'none', color: '#64748b', marginTop: '1rem', cursor: 'pointer' }}
              disabled={mockPaymentLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default BookingPage;
