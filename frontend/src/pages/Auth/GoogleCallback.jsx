import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { googleAuthCallback } from '../../services/auth/auth.service';
import './AuthCallback.css';

export default function GoogleCallback() {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const called     = useRef(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const params = new URLSearchParams(window.location.search);
    const code   = params.get('code');
    const error  = params.get('error');

    if (error) {
      console.error('Google OAuth error from URL:', error);
      setErrorMessage(`Google OAuth Error: ${error}`);
      return;
    }

    if (!code) {
      console.error('No authorization code found in URL redirect.');
      setErrorMessage('Authentication Failed: No authorization code was returned from Google.');
      return;
    }

    console.log('Exchanging authorization code with backend...');
    googleAuthCallback(code)
      .then(({ data }) => {
        console.log('Backend authentication successful!', data);
        login(data.user, data.token);
        
        // If onboarding not complete → go to onboarding, else → home
        if (!data.user.onboardingComplete) {
          console.log('Profile onboarding incomplete. Redirecting to onboarding...');
          navigate('/onboarding', { replace: true });
        } else {
          console.log('Profile onboarding complete. Redirecting to home...');
          navigate('/home', { replace: true });
        }
      })
      .catch((err) => {
        console.error('Backend token exchange error:', err);
        const backendMessage = err?.response?.data?.message || err.message || 'Unknown network error';
        setErrorMessage(`Backend Authentication Error: ${backendMessage}`);
      });
  }, [login, navigate]);

  if (errorMessage) {
    return (
      <div className="auth-callback">
        <div className="auth-error-card">
          <h2>Authentication Failed</h2>
          <p className="auth-error-details">{errorMessage}</p>
          <p className="auth-error-help">
            Please check that your backend is running, database is connected, and your Google OAuth Credentials match exactly.
          </p>
          <button className="btn-primary" onClick={() => navigate('/', { replace: true })}>
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-callback">
      <div className="auth-callback__spinner" />
      <p>Signing you in…</p>
    </div>
  );
}
