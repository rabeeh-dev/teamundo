import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../ui/Spinner';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Spinner />
    </div>
  );

  if (!user) return <Navigate to="/" replace />;
  if (!user.onboardingComplete) return <Navigate to="/onboarding" replace />;

  return children;
}
