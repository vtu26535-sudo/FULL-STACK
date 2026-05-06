import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // 1. Log into Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Check Email Verification
      if (!user.emailVerified) {
        navigate('/verify-email');
        return;
      }

      // 3. Get Firebase ID Token
      const idToken = await user.getIdToken();

      // 4. Sync with Backend to get standard JWT
      const response = await api.post('/auth/firebase-sync', null, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      });

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/events');
      }
    } catch (err) {
      // FALLBACK: If Firebase throws invalid API key, fallback to local backend DB authentication
      if (err.code === 'auth/api-key-not-valid' || err.message?.includes('api-key-not-valid')) {
        console.warn("Firebase not configured. Falling back to local database login.");
        try {
           const localRes = await api.post('/auth/login', { email, password });
           if (localRes.data && localRes.data.token) {
             localStorage.setItem('token', localRes.data.token);
             navigate('/events');
             return;
           }
        } catch (localErr) {
           setError('Invalid credentials.');
           setLoading(false);
           return;
        }
      }

      if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.response) {
        setError('Server synchronization failed.');
      } else {
        setError('Login failed: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '400px', margin: '4rem auto' }}>
      <h2 className="page-title" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Login</h2>
      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            className="form-control" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            className="form-control" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Don't have an account? <Link to="/register" style={{ color: 'var(--sky-mist-primary)' }}>Register</Link>
      </p>
    </div>
  );
};

export default Login;
