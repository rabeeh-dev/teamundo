import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import WarningPopup from './components/ui/WarningPopup';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <WarningPopup />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
