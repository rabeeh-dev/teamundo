import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { markWarningRead } from '../../services/users/user.service';
import './WarningPopup.css';

export default function WarningPopup() {
  const { user, updateUser } = useAuth();
  const [activeWarning, setActiveWarning] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.customWarnings && user.customWarnings.length > 0) {
      const unreadWarning = user.customWarnings.find(w => !w.isRead);
      if (unreadWarning) {
        setActiveWarning(unreadWarning);
      } else {
        setActiveWarning(null);
      }
    } else {
      setActiveWarning(null);
    }
  }, [user]);

  if (!activeWarning) return null;

  const handleAcknowledge = async () => {
    setLoading(true);
    try {
      await markWarningRead(activeWarning._id);
      const updatedUser = { ...user };
      const warningIndex = updatedUser.customWarnings.findIndex(w => w._id === activeWarning._id);
      if (warningIndex > -1) {
        updatedUser.customWarnings[warningIndex].isRead = true;
      }
      updateUser(updatedUser);
      setActiveWarning(null);
    } catch (error) {
      console.error('Failed to mark warning as read:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="warning-overlay">
      <div className="warning-modal">
        <h2 className="warning-title">⚠️ Warning from Admin</h2>
        <p className="warning-message">{activeWarning.message}</p>
        <button
          className="btn-primary warning-btn"
          onClick={handleAcknowledge}
          disabled={loading}
        >
          {loading ? 'Acknowledging...' : 'I Understand'}
        </button>
      </div>
    </div>
  );
}
