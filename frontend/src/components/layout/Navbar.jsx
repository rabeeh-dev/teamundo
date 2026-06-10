import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/formatters';

export default function Navbar({ showDistrict = false, showBack = false }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const initials = getInitials(user?.name);

  if (showBack) {
    return (
      <nav className="prof-nav container">
        <span className="prof-nav__logo">teamundo</span>
        <button className="btn-outline" onClick={() => navigate('/home')}>
          ← Back
        </button>
      </nav>
    );
  }

  return (
    <nav className="home-nav">
      <div className="container home-nav__inner">
        <span className="home-nav__logo">teamundo</span>

        <div className="home-nav__right">
          <div className="home-nav__avatar" onClick={() => setMenuOpen(o => !o)}>
            {user?.profilePhoto
              ? <img src={user.profilePhoto} alt={user?.name} />
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
  );
}
