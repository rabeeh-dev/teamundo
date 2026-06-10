import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL || '/api'}/auth/admin/login`, {
        username,
        password
      });
      
      if (data.success && data.token) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <h1 className="admin-login-title">teamundo</h1>
        <h2 className="admin-login-subtitle">Admin Portal</h2>
        
        {error && <p className="admin-login-error">{error}</p>}
        
        <form onSubmit={handleLogin} className="admin-login-form">
          <input
            type="text"
            placeholder="Admin Username"
            className="admin-login-input"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoFocus
          />
          <input
            type="password"
            placeholder="Admin Password"
            className="admin-login-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
