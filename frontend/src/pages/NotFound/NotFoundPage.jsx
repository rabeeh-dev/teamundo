import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFoundPage.css';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <div className="not-found__content">
        <span className="not-found__code">404</span>
        <h1 className="not-found__title">PAGE NOT FOUND</h1>
        <p className="not-found__sub">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button className="btn-primary btn-lg" onClick={() => navigate('/')}>
          GO HOME
        </button>
      </div>
      <footer className="not-found__footer">
        <span className="not-found__logo">teamundo</span>
      </footer>
    </div>
  );
}
