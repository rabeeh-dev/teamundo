import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile } from '../../services/users/user.service';
import { formatProfession, getInitials } from '../../utils/formatters';
import Spinner from '../../components/ui/Spinner';
import './ProfilePage.css';

export default function ProfilePage() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    getUserProfile(id)
      .then(({ data }) => setProfile(data.user))
      .catch(() => setError('User not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="profile-loading">
      <Spinner />
    </div>
  );

  if (error || !profile) return (
    <div className="profile-error container">
      <p>{error || 'User not found'}</p>
      <button className="btn-primary" onClick={() => navigate('/home')}>← Back</button>
    </div>
  );

  const profLabel = formatProfession(profile.profession);
  const initials = getInitials(profile.name);
  const isOwn = currentUser?._id === profile._id;

  return (
    <div className="profile">
      {/* Navbar */}
      <nav className="prof-nav container">
        <span className="prof-nav__logo">teamundo</span>
        <button className="btn-outline" onClick={() => navigate('/home')}>
          ← Back
        </button>
      </nav>

      {/* Hero card */}
      <div className="container">
        <div className="prof-hero">
          <div className="prof-hero__bg" />
          <div className="prof-hero__content">
            <div className="prof-avatar">
              {profile.profilePhoto
                ? <img src={profile.profilePhoto} alt={profile.name} />
                : <span>{initials}</span>
              }
            </div>
            <div className="prof-identity">
              <h1 className="prof-name">{profile.name}</h1>
              <p className="prof-role">{profLabel}</p>
              <div className="prof-location">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {profile.district}, Kerala
              </div>
            </div>
            {isOwn ? (
              <div className="prof-actions">
                <button
                  className="btn-primary prof-action-btn"
                  onClick={() => navigate('/edit-profile')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit Profile
                </button>
              </div>
            ) : (
              <div className="prof-actions">
                {profile.phone && (
                  <a className="btn-primary prof-action-btn" href={`tel:+91${profile.phone}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2.69h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.09a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    Call User
                  </a>
                )}
                {profile.instagram && (
                  <a
                    className="btn-outline prof-action-btn"
                    href={`https://instagram.com/${profile.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                      <polyline points="16 6 12 2 8 6" />
                      <line x1="12" y1="2" x2="12" y2="15" />
                    </svg>
                    Open Instagram
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container prof-body">
        {/* About + Activity */}
        <div className="prof-cols">
          <div className="prof-main">
            {profile.bio && (
              <div className="prof-section">
                <h2 className="prof-section__title">About</h2>
                <p className="prof-bio">{profile.bio}</p>
              </div>
            )}

            {/* Info pills */}
            <div className="prof-pills">
              <div className="prof-pill">
                <svg className="pill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <div>
                  <span className="pill-label">Profession</span>
                  <span className="pill-val">{profLabel}</span>
                </div>
              </div>
              <div className="prof-pill">
                <svg className="pill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <div>
                  <span className="pill-label">Age</span>
                  <span className="pill-val">{profile.age} Years</span>
                </div>
              </div>
              <div className="prof-pill">
                <svg className="pill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <div>
                  <span className="pill-label">District</span>
                  <span className="pill-val">{profile.district}</span>
                </div>
              </div>
              {profile.instagram && (
                <div className="prof-pill">
                  <svg className="pill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                  </svg>
                  <div>
                    <span className="pill-label">Instagram</span>
                    <span className="pill-val">@{profile.instagram}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: contact info */}
          {!isOwn && (
            <div className="prof-sidebar">
              <div className="prof-contact-card">
                <h3 className="prof-contact-title">Connect</h3>
                {profile.phone ? (
                  <a className="prof-contact-item" href={`tel:+91${profile.phone}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2.69h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.09a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    +91 {profile.phone}
                  </a>
                ) : (
                  <p className="prof-no-contact">Phone not shared</p>
                )}
                {profile.instagram && (
                  <a
                    className="prof-contact-item"
                    href={`https://instagram.com/${profile.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                    </svg>
                    @{profile.instagram}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="prof-footer container">
        <span className="prof-nav__logo">teamundo</span>
      </footer>
    </div>
  );
}
