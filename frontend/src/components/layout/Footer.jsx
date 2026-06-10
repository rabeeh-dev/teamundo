import React from 'react';

export default function Footer({ className = '' }) {
  return (
    <footer className={`home-footer container ${className}`}>
      <span className="home-footer__logo">teamundo</span>
      <span className="footer-copy" style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        color: 'var(--text-dim)',
        letterSpacing: '0.05em',
      }}>© 2026 · Kerala's Own Networking Hub</span>
    </footer>
  );
}
