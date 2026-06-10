import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAdminUserById, toggleUserBlock, sendAdminWarning } from '../../services/users/user.service';
import Spinner from '../../components/ui/Spinner';
import './AdminUserDetail.css';

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Warning Modal State
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [warningMsg, setWarningMsg] = useState('');
  const [sendingWarning, setSendingWarning] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchUserDetails();
  }, [id, navigate]);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const { data } = await getAdminUserById(id);
      setUser(data.user);
    } catch (err) {
      setError('Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async () => {
    const action = user.isBlocked ? 'unblock' : 'block';
    if (!window.confirm(`Are you sure you want to ${action} ${user.name}?`)) return;
    
    try {
      await toggleUserBlock(user._id);
      fetchUserDetails(); // refresh state
    } catch (err) {
      alert(`Failed to ${action} user`);
    }
  };

  const handleSendWarning = async () => {
    if (!warningMsg.trim()) return;
    setSendingWarning(true);
    try {
      await sendAdminWarning(user._id, warningMsg);
      setWarningModalOpen(false);
      setWarningMsg('');
      alert('Warning sent successfully');
      fetchUserDetails();
    } catch (err) {
      alert('Failed to send warning');
    } finally {
      setSendingWarning(false);
    }
  };

  if (loading) return <div className="admin-page"><Spinner /></div>;
  if (error || !user) return <div className="admin-page container"><p className="admin-error">{error || 'User not found'}</p></div>;

  return (
    <div className="admin-page">
      <nav className="admin-nav container">
        <span className="admin-logo">teamundo admin</span>
        <button className="btn-outline" onClick={() => navigate('/admin/dashboard')}>&larr; Back to Dashboard</button>
      </nav>

      <div className="admin-detail-container container">
        
        {/* Header Section */}
        <div className="admin-detail-header">
          <div className="admin-detail-profile-info">
            {user.profileImage ? (
              <img src={user.profileImage} alt={user.name} className="admin-detail-avatar" />
            ) : (
              <div className="admin-detail-avatar placeholder">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="admin-detail-titles">
              <h1 className="admin-detail-name">
                {user.name}
                {user.isBlocked && <span className="admin-badge" style={{background: '#ff0000'}}>BLOCKED</span>}
              </h1>
              <p className="admin-detail-email">{user.email}</p>
            </div>
          </div>
          
          <div className="admin-detail-actions">
            <button className="btn-primary" onClick={() => setWarningModalOpen(true)}>
              Send Warning
            </button>
            <button 
              className="btn-outline" 
              style={{ color: user.isBlocked ? '#4ade80' : '#ff3366', borderColor: user.isBlocked ? '#4ade80' : '#ff3366' }}
              onClick={handleToggleBlock}
            >
              {user.isBlocked ? 'Unblock User' : 'Block User'}
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="admin-detail-grid">
          <div className="admin-detail-card">
            <h3>Personal Info</h3>
            <div className="info-row"><span>District:</span> <strong>{user.district || 'Not provided'}</strong></div>
            <div className="info-row"><span>Profession:</span> <strong>{user.profession || 'Not provided'}</strong></div>
            <div className="info-row"><span>Profile Complete:</span> <strong>{user.isProfileCompleted ? 'Yes' : 'No'}</strong></div>
          </div>
          <div className="admin-detail-card">
            <h3>Links & Contact</h3>
            <div className="info-row">
              <span>Email:</span> 
              <a href={`mailto:${user.email}`} className="admin-link">{user.email}</a>
            </div>
            <div className="info-row">
              <span>Phone:</span> 
              {user.phone ? <a href={`tel:${user.phone}`} className="admin-link">{user.phone}</a> : <strong>None</strong>}
            </div>
            <div className="info-row">
              <span>Instagram:</span> 
              {user.instagram ? <a href={`https://instagram.com/${user.instagram}`} target="_blank" rel="noreferrer" className="admin-link">@{user.instagram}</a> : <strong>None</strong>}
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="admin-detail-card admin-bio-card">
          <h3>Bio</h3>
          <p>{user.bio || 'This user has not written a bio yet.'}</p>
        </div>

        {/* Warnings Section */}
        <div className="admin-detail-card">
          <h3>Warning History ({user.customWarnings?.length || 0})</h3>
          {user.customWarnings && user.customWarnings.length > 0 ? (
            <ul className="admin-warnings-list">
              {user.customWarnings.slice().reverse().map((warn, i) => (
                <li key={i} className={`warning-item ${warn.isRead ? 'read' : 'unread'}`}>
                  <p className="warning-msg">"{warn.message}"</p>
                  <span className="warning-status">
                    {warn.isRead ? '✅ Read by user' : '❌ Unread'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-warnings">No warnings sent to this user.</p>
          )}
        </div>

      </div>

      {warningModalOpen && (
        <div className="warning-modal-overlay">
          <div className="warning-modal-content">
            <h2>Send Warning to {user.name}</h2>
            <textarea
              className="admin-textarea"
              placeholder="Type your warning message here..."
              rows={4}
              value={warningMsg}
              onChange={(e) => setWarningMsg(e.target.value)}
            />
            <div className="warning-modal-actions">
              <button
                className="btn-outline"
                onClick={() => setWarningModalOpen(false)}
                disabled={sendingWarning}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleSendWarning}
                disabled={sendingWarning || !warningMsg.trim()}
              >
                {sendingWarning ? 'Sending...' : 'Send Warning'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
