import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatProfession, getInitials } from '../../utils/formatters';
import './UserCard.css';

export default function UserCard({ user }) {
  const navigate = useNavigate();

  const initials = getInitials(user.name);
  const profLabel = formatProfession(user.profession);

  return (
    <div className="user-card">
      <div className="uc-header">
        <div className="uc-avatar">
          {user.profilePhoto
            ? <img src={user.profilePhoto} alt={user.name} />
            : <span>{initials}</span>
          }
        </div>
        <div className="uc-identity">
          <h3 className="uc-name">{user.name}</h3>
          <span className="uc-prof">{profLabel}</span>
        </div>
      </div>

      <div className="uc-meta">
        <div className="uc-meta-row">
          <svg className="uc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>{user.age} Years</span>
        </div>
        <div className="uc-meta-row">
          <svg className="uc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{user.district}</span>
        </div>
        {user.instagram && (
          <div className="uc-meta-row">
            <svg className="uc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
            </svg>
            <span>@{user.instagram}</span>
          </div>
        )}
      </div>

      <button
        className="uc-view-btn"
        onClick={() => navigate(`/profile/${user._id}`)}
      >
        VIEW PROFILE
      </button>
    </div>
  );
}
