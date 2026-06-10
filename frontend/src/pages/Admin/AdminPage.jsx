import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminUsers, sendAdminWarning, toggleUserBlock } from '../../services/users/user.service';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/ui/Spinner';
import './AdminPage.css';

export default function AdminPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [districtFilter, setDistrictFilter] = useState('');
  const [professionFilter, setProfessionFilter] = useState('');

  // Warning Modal State
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [warningMsg, setWarningMsg] = useState('');
  const [sendingWarning, setSendingWarning] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchUsers();
  }, [navigate, districtFilter, professionFilter]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getAdminUsers(districtFilter, professionFilter);
      setUsers(data.users || []);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const openWarningModal = (u) => {
    setSelectedUser(u);
    setWarningMsg('');
    setWarningModalOpen(true);
  };

  const handleSendWarning = async () => {
    if (!warningMsg.trim()) return;
    setSendingWarning(true);
    try {
      await sendAdminWarning(selectedUser._id, warningMsg);
      setWarningModalOpen(false);
      setSelectedUser(null);
      alert('Warning sent successfully');
      fetchUsers(); // Refresh to see updated data if needed
    } catch (err) {
      alert('Failed to send warning');
    } finally {
      setSendingWarning(false);
    }
  };

  const handleToggleBlock = async (userToToggle) => {
    const action = userToToggle.isBlocked ? 'unblock' : 'block';
    if (!window.confirm(`Are you sure you want to ${action} ${userToToggle.name}?`)) return;
    
    try {
      await toggleUserBlock(userToToggle._id);
      fetchUsers();
    } catch (err) {
      alert(`Failed to ${action} user`);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="admin-page">
      <nav className="admin-nav container">
        <span className="admin-logo">teamundo admin</span>
        <button className="btn-outline" onClick={handleLogout}>Admin Logout</button>
      </nav>

      <div className="admin-content container">
        <h1 className="admin-title">Manage Users</h1>
        {error && <p className="admin-error">{error}</p>}

        {/* Filters */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <select 
            className="ob-input" 
            style={{ width: 'auto', padding: '10px' }}
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
          >
            <option value="">All Districts</option>
            {['Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'].map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select 
            className="ob-input" 
            style={{ width: 'auto', padding: '10px' }}
            value={professionFilter}
            onChange={(e) => setProfessionFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {['developer', 'entrepreneur', 'designer', 'marketer', 'student', 'government_official', 'freelancer', 'artist', 'educator', 'healthcare', 'finance', 'other'].map(p => (
              <option key={p} value={p}>{p.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
            ))}
          </select>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name & Email</th>
                <th>District</th>
                <th>Profession</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>
                    {u.profilePhoto ? (
                      <img src={u.profilePhoto} alt={u.name} className="admin-avatar" />
                    ) : (
                      <div className="admin-avatar-placeholder">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="admin-user-info">
                      <span className="admin-user-name">
                        {u.name}
                        {u.isBlocked && <span className="admin-badge" style={{background: '#ff0000'}}>BLOCKED</span>}
                      </span>
                      <span className="admin-user-email">{u.email}</span>
                    </div>
                  </td>
                  <td>{u.district || '-'}</td>
                  <td>{u.profession || '-'}</td>
                  <td>{u.phone || '-'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn-primary"
                        onClick={() => navigate(`/admin/users/${u._id}`)}
                      >
                        View Details
                      </button>
                      <button
                        className="btn-outline admin-warn-btn"
                        onClick={() => openWarningModal(u)}
                      >
                        Warning
                      </button>
                      <button
                        className={`btn-outline admin-warn-btn`}
                        style={{ color: u.isBlocked ? '#4ade80' : '#ff3366', borderColor: u.isBlocked ? '#4ade80' : '#ff3366' }}
                        onClick={() => handleToggleBlock(u)}
                      >
                        {u.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {warningModalOpen && (
        <div className="warning-modal-overlay">
          <div className="warning-modal-content">
            <h2>Send Warning to {selectedUser?.name}</h2>
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
