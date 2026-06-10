import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';

import LandingPage from '../pages/Landing/LandingPage';
import GoogleCallback from '../pages/Auth/GoogleCallback';
import Onboarding from '../pages/Onboarding/Onboarding';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import ProfilePage from '../pages/Profile/ProfilePage';
import SettingsPage from '../pages/Settings/SettingsPage';
import AdminPage from '../pages/Admin/AdminPage';
import AdminLogin from '../pages/Admin/AdminLogin';
import AdminUserDetail from '../pages/Admin/AdminUserDetail';
import NotFoundPage from '../pages/NotFound/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/callback" element={<GoogleCallback />} />

      {/* Onboarding (needs auth, no onboarding check) */}
      <Route path="/onboarding" element={<Onboarding />} />

      {/* Protected */}
      <Route path="/home" element={
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
      } />
      <Route path="/profile/:id" element={
        <ProtectedRoute><ProfilePage /></ProtectedRoute>
      } />
      <Route path="/edit-profile" element={
        <ProtectedRoute><SettingsPage /></ProtectedRoute>
      } />
      
      {/* Admin Portal (Standalone) */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminPage />} />
      <Route path="/admin/users/:id" element={<AdminUserDetail />} />

      {/* 404 */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
