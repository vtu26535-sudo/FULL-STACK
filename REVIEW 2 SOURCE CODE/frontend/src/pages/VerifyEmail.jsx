import React, { useState } from 'react';
import { auth } from '../config/firebase';
import { sendEmailVerification } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResend = async () => {
    if (auth.currentUser) {
      setLoading(true);
      try {
        await sendEmailVerification(auth.currentUser);
        setMessage('Verification email sent! Please check your inbox.');
      } catch (err) {
        setMessage('Failed to send verification email. Try again later.');
      } finally {
        setLoading(false);
      }
    } else {
      // MOCK MODE fallback
      setMessage('Mock Mode: Email "sent". Please click "I\'ve Verified".');
    }
  };

  const handleDone = () => {
    if (auth.currentUser) {
      // Force reload to refresh user token and state
      auth.currentUser.reload().then(() => {
          if (auth.currentUser.emailVerified) {
               navigate('/events');
          } else {
               setMessage('Email is not verified yet. Please check your inbox.');
          }
      }).catch(() => {
          navigate('/login');
      });
    } else {
      // MOCK MODE fallback
      navigate('/login');
    }
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '500px', margin: '4rem auto', textAlign: 'center' }}>
      <h2 className="page-title" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Verify Your Email</h2>
      <p style={{ marginBottom: '1rem' }}>
        We have sent an email verification link to your email address. 
        <strong> You must verify your email before booking tickets.</strong>
      </p>
      
      {message && (
        <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '8px', background: message.includes('sent') || message.includes('Mock') ? 'var(--success)' : 'var(--danger)', color: 'white' }}>
          {message}
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
        <button className="btn-secondary" onClick={handleResend} disabled={loading}>
          {loading ? 'Sending...' : 'Resend Email'}
        </button>
        <button className="btn-primary" onClick={handleDone}>
          I've Verified
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
