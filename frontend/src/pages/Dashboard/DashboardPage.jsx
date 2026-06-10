import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDistrictUsers } from '../../services/users/user.service';
import { PROFESSION_FILTER_TABS } from '../../constants';
import UserCard from '../../components/users/UserCard';
import { formatProfession, getInitials } from '../../utils/formatters';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [users,      setUsers]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [activeTab,  setActiveTab]  = useState('');
  const [menuOpen,   setMenuOpen]   = useState(false);

  const fetchUsers = useCallback(async (profession = '') => {
    if (!user?.district) return;
    setLoading(true);
    try {
      const { data } = await getDistrictUsers(user.district, profession);
      setUsers(data.users || []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [user?.district]);

  useEffect(() => { fetchUsers(''); }, [fetchUsers]);

  const handleTabChange = (val) => {
    setActiveTab(val);
    fetchUsers(val);
  };

  const districtGreeting = user?.district
    ? user.district.toUpperCase()
    : 'YOUR DISTRICT';

  const initials = getInitials(user?.name);

  return (
    <div className="home">
      {/* ── Navbar ── */}
      <nav className="home-nav">
        <div className="container home-nav__inner">
          <span className="home-nav__logo">teamundo</span>

          <div className="home-nav__right">
            <div className="home-nav__avatar" onClick={() => setMenuOpen(o => !o)}>
              {user?.profilePhoto
                ? <img src={user.profilePhoto} alt={user.name} />
                : <span>{initials}</span>
              }
            </div>
            {menuOpen && (
              <div className="home-nav__menu">
                <button onClick={() => { setMenuOpen(false); navigate(`/profile/${user._id}`); }}>
                  My Profile
                </button>
                <button onClick={() => { logout(); navigate('/'); }}>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="home-hero container">
        <h1 className="home-hero__title">{districtGreeting}</h1>
        <p className="home-hero__sub">
          {users.length > 0
            ? `${users.length} professionals from your district`
            : 'Discover people around you'}
        </p>
      </section>

      {/* ── Filter Tabs ── */}
      <div className="home-tabs container">
        {PROFESSION_FILTER_TABS.map(tab => (
          <button
            key={tab.value}
            className={`home-tab ${activeTab === tab.value ? 'active' : ''}`}
            onClick={() => handleTabChange(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Grid ── */}
      <section className="home-grid container">
        {loading ? (
          <div className="home-loading">
            <div className="spinner" />
          </div>
        ) : users.length === 0 ? (
          <div className="home-empty">
            <p>No members found in {user?.district} yet.</p>
            <p className="home-empty__sub">Be the first to connect!</p>
          </div>
        ) : (
          <div className="uc-grid">
            {users.map(u => (
              <UserCard key={u._id} user={u} />
            ))}
          </div>
        )}
      </section>

      {/* ── Invite Banner ── */}
      <section className="home-invite container">
        <div className="invite-block">
          <div className="invite-block__text">
            <h2>SHARE CHEYY MWONE<br />ELLAARUM ARIYATTE</h2>
          </div>
          <button
            className="btn-invite"
            onClick={() => {
              const url = 'https://teamundo.rabeeh.online';
              if (navigator.share) {
                navigator.share({ title: 'teamundo', text: 'Kerala\'s own networking hub', url });
              } else {
                navigator.clipboard.writeText(url);
              }
            }}
          >
            INVITE FRIENDS
          </button>
        </div>
      </section>

      {/* ── Donate Banner ── */}
      <section className="home-invite container" style={{ marginTop: '24px' }}>
        <div className="invite-block">
          <div className="invite-block__text">
            <h2>Admin oru kaythaang</h2>
          </div>
          <a
            href="https://razorpay.me/@rabeeh1730"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-invite"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            DONATE
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="home-footer container">
        <span className="home-footer__logo">teamundo</span>
      </footer>
    </div>
  );
}
