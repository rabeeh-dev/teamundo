import React from 'react';
import './LandingPage.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const REDIRECT_URI    = import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/callback`;

function handleGoogleSignIn() {
  const params = new URLSearchParams({
    client_id:     GOOGLE_CLIENT_ID,
    redirect_uri:  REDIRECT_URI,
    response_type: 'code',
    scope:         'openid email profile',
    access_type:   'offline',
    prompt:        'select_account',
  });
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export default function LandingPage() {
  return (
    <div className="landing">
      {/* ── Navbar ── */}
      <nav className="landing__nav container">
        <span className="landing__logo">teamundo</span>
        <button className="btn-outline" onClick={handleGoogleSignIn}>
          KERI VADA
        </button>
      </nav>

      {/* ── Hero ── */}
      <section className="landing__hero container">
        <div className="landing__badge">
          <span className="badge-dot" />
          GOD'S OWN NETWORKING HUB
        </div>
        <h1 className="landing__headline">
          KERI VADA MAKKALE
        </h1>
        <p className="landing__sub">
          Team illa nno? Athinaalle paavam admin ith undakkiyath. Nee vaada muthe, namukku team set aakkam. 😌❤️
        </p>
        <button className="btn-primary btn-lg" onClick={handleGoogleSignIn}>
          KERI VADA
        </button>
      </section>

      {/* ── How It Works ── */}
      <section className="landing__how container">
        <h2 className="section-title">HOW IT WORKS</h2>
        <div className="landing__steps">
          <div className="step-card">
            <span className="step-num">01</span>
            <h3>Create Profile</h3>
            <p>Set up your name, district, profession and contact details.</p>
            <div className="step-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          </div>
          <div className="step-card">
            <span className="step-num">02</span>
            <h3>Explore Your District</h3>
            <p>Browse professionals from your district and discover talent nearby.</p>
            <div className="step-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </div>
          <div className="step-card step-card--accent">
            <span className="step-num">03</span>
            <h3>Connect</h3>
            <p>Reach out via phone or Instagram and start collaborating.</p>
            <div className="step-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="landing__cta container">
        <div className="cta-block">
          <h2>Admin oru kaythaang</h2>
          <a href="https://razorpay.me/@rabeeh1730" target="_blank" rel="noopener noreferrer" className="btn-primary btn-lg" style={{ textDecoration: 'none' }}>
            DONATE
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing__footer container">
        <span className="landing__logo">teamundo</span>
        <span className="footer-copy">© 2026 · Kerala's Own Networking Hub</span>
      </footer>
    </div>
  );
}
