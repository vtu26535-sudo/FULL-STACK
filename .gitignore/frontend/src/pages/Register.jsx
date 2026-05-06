import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Create User in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      // 2. Update Firebase Profile
      await updateProfile(userCredential.user, {
        displayName: formData.name
      });

      // 3. Send Email Verification
      await sendEmailVerification(userCredential.user);
      
      // Navigate to Verification Notice
      navigate('/verify-email');
    } catch (err) {
      // FALLBACK: If Firebase throws invalid API key, fallback to local backend DB authentication
      if (err.code === 'auth/api-key-not-valid' || err.message?.includes('api-key-not-valid')) {
        console.warn("Firebase not configured. Falling back to local database registration.");
        try {
           const response = await api.post('/auth/register', formData);
           if (response.data) {
             navigate('/login');
             return;
           }
        } catch (localErr) {
           setError('Registration failed. Please try again.');
           setLoading(false);
           return;
        }
      }

      if (err.code === 'auth/email-already-in-use') {
        setError('Email is already registered.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError('Registration failed: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '400px', margin: '4rem auto' }}>
      <h2 className="page-title" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Register</h2>
      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" className="form-control" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" className="form-control" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Department</label>
          <input type="text" name="department" className="form-control" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" className="form-control" onChange={handleChange} required minLength="6" />
        </div>
        <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--sky-mist-primary)' }}>Login</Link>
      </p>
    </div>
  );
};

export default Register;
