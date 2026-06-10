import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { completeOnboarding } from '../../services/users/user.service';
import { KERALA_DISTRICTS, PROFESSIONS } from '../../constants';
import './Onboarding.css';

const TOTAL_STEPS = 5;

export default function Onboarding() {
  const { user, token, updateUser } = useAuth();
  const navigate = useNavigate();

  const [step,    setStep]    = useState(1);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  // Form state
  const [form, setForm] = useState({
    name:       user?.name || '',
    district:   '',
    age:        22,
    profession: '',
    phone:      '',
    instagram:  '',
    bio:        '',
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const progress = Math.round((step / TOTAL_STEPS) * 100);

  const next = () => { setError(''); setStep(s => s + 1); };
  const back = () => { setError(''); setStep(s => s - 1); };

  const handleSubmit = async () => {
    if (!form.instagram.trim()) { setError('Instagram username is required'); return; }
    setLoading(true);
    try {
      const { data } = await completeOnboarding(form);
      updateUser(data.user);
      navigate('/home', { replace: true });
    } catch (e) {
      setError(e?.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding">
      {/* Navbar */}
      <nav className="ob-nav container">
        <span className="ob-logo">teamundo</span>
        <button className="ob-exit" onClick={() => navigate('/')}>EXIT</button>
      </nav>

      {/* Progress */}
      <div className="ob-progress container">
        <span className="ob-step-label">Step {step} of {TOTAL_STEPS}</span>
        <span className="ob-pct-label">{progress}% Complete</span>
        <div className="ob-bar-track">
          <div className="ob-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Step Content */}
      <main className="ob-main container">
        <div className="ob-card">

          {/* ─── Step 1: Name ─── */}
          {step === 1 && (
            <div className="ob-step">
              <h2 className="ob-question">mwonte perentha</h2>
              <label className="ob-label">FULL NAME</label>
              <input
                className="ob-input"
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                autoFocus
              />
              {form.name.trim().length > 0 && (
                <p className="ob-warning" style={{ textAlign: 'center', marginTop: '8px' }}>
                  nalla per
                </p>
              )}
              {error && <p className="ob-error">{error}</p>}
              <div className="ob-actions">
                <button
                  className="btn-primary btn-lg ob-continue"
                  disabled={!form.name.trim()}
                  onClick={() => {
                    if (!form.name.trim()) { setError('Please enter your name'); return; }
                    next();
                  }}
                >
                  CONTINUE →
                </button>
              </div>
            </div>
          )}

          {/* ─── Step 2: District ─── */}
          {step === 2 && (
            <div className="ob-step">
              <h2 className="ob-question">evideyaanu nee??</h2>
              <p className="ob-hint">Select your district in Kerala</p>
              <div className="ob-district-grid">
                {KERALA_DISTRICTS.map(d => (
                  <button
                    key={d}
                    className={`ob-district-chip ${form.district === d ? 'selected' : ''}`}
                    onClick={() => set('district', d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
              {error && <p className="ob-error">{error}</p>}
              <div className="ob-actions">
                <button className="ob-back" onClick={back}>← BACK</button>
                <button
                  className="btn-primary btn-lg ob-continue"
                  disabled={!form.district}
                  onClick={() => {
                    if (!form.district) { setError('Please select your district'); return; }
                    next();
                  }}
                >
                  CONTINUE →
                </button>
              </div>
            </div>
          )}

          {/* ─── Step 3: Age ─── */}
          {step === 3 && (
            <div className="ob-step">
              <h2 className="ob-question">praayam??</h2>
              <p className="ob-hint">Age is just a number, but we need it to tailor your network experience.</p>
              <div className="ob-age-picker">
                <span className="ob-label">SELECT AGE</span>
                <div className="ob-age-controls">
                  <button
                    className="ob-age-btn"
                    onClick={() => set('age', Math.max(16, form.age - 1))}
                  >−</button>
                  <span className="ob-age-val">{form.age}</span>
                  <button
                    className="ob-age-btn"
                    onClick={() => set('age', Math.min(80, form.age + 1))}
                  >+</button>
                </div>
                <div className="ob-age-scroll">
                  {[-2,-1,0,1,2].map(offset => {
                    const val = form.age + offset;
                    return (
                      <span
                        key={offset}
                        className={`ob-age-scroll-item ${offset === 0 ? 'active' : ''}`}
                        onClick={() => val >= 16 && val <= 80 && set('age', val)}
                      >
                        {val >= 16 && val <= 80 ? val : ''}
                      </span>
                    );
                  })}
                </div>
              </div>

              {form.age < 18 && (
                <p className="ob-error" style={{ textAlign: 'center', marginTop: '8px' }}>
                  mwone ninakk prayam aayeella
                </p>
              )}
              {form.age === 18 && (
                <p className="ob-warning" style={{ textAlign: 'center', marginTop: '8px' }}>
                  sathyam aahno dey
                </p>
              )}
              {form.age > 27 && (
                <p className="ob-warning" style={{ textAlign: 'center', marginTop: '8px' }}>
                  praayam ichiri kodduthalaan seenilla
                </p>
              )}

              <div className="ob-actions">
                <button className="ob-back" onClick={back}>← BACK</button>
                <button 
                  className="btn-primary btn-lg ob-continue" 
                  onClick={next}
                  disabled={form.age < 18}
                >
                  CONTINUE →
                </button>
              </div>
            </div>
          )}

          {/* ─── Step 4: Profession ─── */}
          {step === 4 && (
            <div className="ob-step">
              <h2 className="ob-question">entha pani??</h2>
              <p className="ob-hint">What do you do for a living?</p>
              <div className="ob-prof-grid">
                {PROFESSIONS.map(p => (
                  <button
                    key={p.value}
                    className={`ob-prof-chip ${form.profession === p.value ? 'selected' : ''}`}
                    onClick={() => set('profession', p.value)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              {form.profession === 'other' && (
                <p className="ob-warning" style={{ textAlign: 'center', marginTop: '8px' }}>
                  pani onnum illa alle 😂
                </p>
              )}
              {form.profession && form.profession !== 'other' && (
                <p className="ob-warning" style={{ textAlign: 'center', marginTop: '8px' }}>
                  {PROFESSIONS.find(p => p.value === form.profession)?.label} oo? neeyo?? 😒
                </p>
              )}
              {error && <p className="ob-error">{error}</p>}
              <div className="ob-actions">
                <button className="ob-back" onClick={back}>← BACK</button>
                <button
                  className="btn-primary btn-lg ob-continue"
                  disabled={!form.profession}
                  onClick={() => {
                    if (!form.profession) { setError('Please select a profession'); return; }
                    next();
                  }}
                >
                  CONTINUE →
                </button>
              </div>
            </div>
          )}

          {/* ─── Step 5: Instagram + Phone + Bio ─── */}
          {step === 5 && (
            <div className="ob-step">
              <h2 className="ob-question">engane connect cheyya?</h2>
              <p className="ob-hint">oombikkale correct kodukk</p>
 
              <label className="ob-label">INSTAGRAM USERNAME (REQUIRED)</label>
              <div className="ob-ig-wrap">
                <span className="ob-ig-at">@</span>
                <input
                  className="ob-input ob-input--ig"
                  type="text"
                  placeholder="your_username"
                  value={form.instagram}
                  onChange={e => set('instagram', e.target.value.replace(/^@/, ''))}
                  autoFocus
                />
                <span className="ob-ig-icon">@</span>
              </div>
 
              <label className="ob-label" style={{ marginTop: 20 }}>PHONE NUMBER (OPTIONAL)</label>
              <div className="ob-phone-wrap">
                <span className="ob-phone-prefix">+91</span>
                <input
                  className="ob-input ob-input--phone"
                  type="tel"
                  placeholder="00000 00000"
                  value={form.phone}
                  onChange={e => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
              </div>
 
              <label className="ob-label" style={{ marginTop: 20 }}>TELL US ABOUT YOURSELF (BIO)</label>
              <div className="ob-bio-wrap">
                <textarea
                  className="ob-textarea"
                  placeholder="Share a little about yourself…"
                  value={form.bio}
                  onChange={e => set('bio', e.target.value.slice(0, 160))}
                  rows={4}
                />
                <span className="ob-bio-count">{form.bio.length}/160</span>
              </div>
              {form.bio.trim().length > 10 && (
                <p className="ob-warning" style={{ textAlign: 'center', marginTop: '8px' }}>
                  thalli marikkaadhe dey
                </p>
              )}
 
              {error && <p className="ob-error">{error}</p>}
 
              <div className="ob-actions">
                <button className="ob-back" onClick={back}>BACK</button>
                <button
                  className="btn-primary btn-lg ob-continue ob-finish"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'SAVING…' : 'FINISH REGISTRATION →'}
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="ob-footer container">
        <span className="ob-logo-sm">teamundo</span>
        <div className="ob-footer-links">
          <a href="#">PRIVACY</a>
          <a href="#">TERMS</a>
          <a href="#">SUPPORT</a>
        </div>
        <span className="ob-footer-year">TEAMUNDO 2026</span>
      </footer>
    </div>
  );
}
