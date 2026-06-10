import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/users/user.service';
import { PROFESSIONS } from '../../constants';
import { getInitials } from '../../utils/formatters';
import './SettingsPage.css';

export default function SettingsPage() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Profile Form State
  const [form, setForm] = useState({
    name: user?.name || '',
    profession: user?.profession || '',
    phone: user?.phone || '',
    instagram: user?.instagram || '',
    bio: user?.bio || '',
    profilePhoto: user?.profilePhoto || '',
  });

  // Image Cropping States
  const [cropImage, setCropImage] = useState(null);
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1.0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const fileInputRef = useRef(null);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data } = await updateProfile(form);
      updateUser(data.user);
      setMessage('Profile updated successfully!');
      setTimeout(() => {
        setMessage('');
        navigate(`/profile/${data.user._id}`);
      }, 1500);
    } catch (e) {
      setMessage(e?.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Profile Picture File Selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        setImgDimensions({ width: img.width, height: img.height });
        setCropImage(reader.result);
        setZoom(1.0);
        setOffset({ x: 0, y: 0 });
      };
    };
    reader.readAsDataURL(file);
    // Reset file input value so same file can be selected again
    e.target.value = '';
  };

  // Drag Interaction Handlers for Cropper Viewport
  const startDrag = (clientX, clientY) => {
    setIsDragging(true);
    setDragStart({ x: clientX - offset.x, y: clientY - offset.y });
  };

  const onDrag = (clientX, clientY) => {
    if (!isDragging) return;
    setOffset({ x: clientX - dragStart.x, y: clientY - dragStart.y });
  };

  const stopDrag = () => {
    setIsDragging(false);
  };

  // Canvas Cropping Handler
  const handleCrop = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = cropImage;
    img.onload = () => {
      ctx.clearRect(0, 0, 300, 300);

      // Math mirroring the CSS preview layout:
      let baseW = 280;
      let baseH = 280;
      const aspect = img.width / img.height;
      if (aspect > 1) {
        baseW = 280 * aspect;
      } else {
        baseH = 280 / aspect;
      }

      const dispW = baseW * zoom;
      const dispH = baseH * zoom;

      // Center of viewport (140, 140) minus half of displayed size plus offsets
      const vx = 140 + offset.x - dispW / 2;
      const vy = 140 + offset.y - dispH / 2;

      // Crop circle offset relative to viewport top-left is (20, 20)
      const rx = vx - 20;
      const ry = vy - 20;

      // Scale factor to map 240px circle to 300px canvas
      const cx = rx * 1.25;
      const cy = ry * 1.25;
      const cw = dispW * 1.25;
      const ch = dispH * 1.25;

      ctx.drawImage(img, cx, cy, cw, ch);

      const croppedBase64 = canvas.toDataURL('image/jpeg', 0.85);
      set('profilePhoto', croppedBase64);
      setCropImage(null);
    };
  };

  // Preview dimensions inside viewport
  let previewW = 280;
  let previewH = 280;
  if (imgDimensions.width && imgDimensions.height) {
    const aspect = imgDimensions.width / imgDimensions.height;
    if (aspect > 1) {
      previewW = 280 * aspect;
    } else {
      previewH = 280 / aspect;
    }
  }

  const initials = getInitials(form.name || user?.name);

  return (
    <div className="settings">
      <nav className="settings-nav container">
        <span className="settings-nav__logo">teamundo</span>
        <button className="btn-outline" onClick={() => navigate(-1)}>← Back</button>
      </nav>

      <main className="settings-main container">
        <h1 className="settings-title">EDIT PROFILE</h1>

        {message && <div className="settings-message">{message}</div>}

        {/* ── Profile Picture Cropper Modal ── */}
        {cropImage && (
          <div className="crop-modal-overlay">
            <div className="crop-modal-card">
              <h3 className="crop-modal-title">Position and Size</h3>
              
              <div 
                className="crop-viewport"
                onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
                onMouseMove={(e) => onDrag(e.clientX, e.clientY)}
                onMouseUp={stopDrag}
                onMouseLeave={stopDrag}
                onTouchStart={(e) => {
                  if (e.touches.length === 1) startDrag(e.touches[0].clientX, e.touches[0].clientY);
                }}
                onTouchMove={(e) => {
                  if (e.touches.length === 1) onDrag(e.touches[0].clientX, e.touches[0].clientY);
                }}
                onTouchEnd={stopDrag}
              >
                <img 
                  className="crop-preview-image" 
                  src={cropImage} 
                  alt="Crop preview" 
                  style={{
                    width: `${previewW}px`,
                    height: `${previewH}px`,
                    left: '50%',
                    top: '50%',
                    marginLeft: `-${previewW / 2}px`,
                    marginTop: `-${previewH / 2}px`,
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`
                  }}
                />
                <div className="crop-cutout-overlay" />
                <div className="crop-cutout-border" />
              </div>

              <div className="crop-zoom-container">
                <span className="crop-zoom-label">Zoom</span>
                <input 
                  type="range" 
                  className="crop-zoom-slider"
                  min="1.0" 
                  max="3.0" 
                  step="0.05"
                  value={zoom} 
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                />
              </div>

              <div className="crop-modal-actions">
                <button className="btn-primary" onClick={handleCrop}>Crop & Save</button>
                <button className="btn-outline" onClick={() => setCropImage(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="settings-card">
          <div className="settings-section">
            <h2 className="settings-section__title">Profile Information</h2>

            {/* ── Profile Picture Upload Section ── */}
            <div className="settings-photo-section">
              <div className="settings-avatar-wrapper">
                {form.profilePhoto ? (
                  <img src={form.profilePhoto} alt="Profile preview" />
                ) : (
                  <span className="settings-avatar-initials">{initials}</span>
                )}
              </div>
              <div className="settings-photo-actions">
                <label className="btn-upload-photo">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Upload Photo
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    accept="image/*" 
                    onChange={handleFileChange} 
                    style={{ display: 'none' }} 
                  />
                </label>
                {form.profilePhoto && (
                  <button type="button" className="btn-remove-photo" onClick={() => set('profilePhoto', '')}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    Remove Photo
                  </button>
                )}
              </div>
            </div>

            <div className="settings-field">
              <label className="settings-label">NAME</label>
              <input
                className="settings-input"
                value={form.name}
                onChange={e => set('name', e.target.value)}
              />
            </div>

            <div className="settings-field">
              <label className="settings-label">DISTRICT</label>
              <p className="settings-value">{user?.district} <span className="settings-hint">(cannot be changed)</span></p>
            </div>

            <div className="settings-field">
              <label className="settings-label">PROFESSION</label>
              <select
                className="settings-input"
                value={form.profession}
                onChange={e => set('profession', e.target.value)}
              >
                {PROFESSIONS.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            <div className="settings-field">
              <label className="settings-label">INSTAGRAM</label>
              <input
                className="settings-input"
                value={form.instagram}
                onChange={e => set('instagram', e.target.value.replace(/^@/, ''))}
                placeholder="your_username"
              />
            </div>

            <div className="settings-field">
              <label className="settings-label">PHONE</label>
              <input
                className="settings-input"
                value={form.phone}
                onChange={e => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="0000000000"
              />
            </div>

            <div className="settings-field">
              <label className="settings-label">BIO</label>
              <textarea
                className="settings-textarea"
                value={form.bio}
                onChange={e => set('bio', e.target.value.slice(0, 160))}
                rows={3}
                placeholder="Tell us about yourself..."
              />
              {form.bio.trim().length > 10 && (
                <p className="ob-warning" style={{ marginTop: '8px' }}>
                  thalli marikkaadhe dey
                </p>
              )}
            </div>

            <div className="settings-actions">
              <button className="btn-primary" onClick={handleSave} disabled={loading}>
                {loading ? 'SAVING...' : 'SAVE CHANGES'}
              </button>
              <button className="btn-outline" onClick={() => navigate(`/profile/${user?._id}`)}>CANCEL</button>
            </div>
          </div>
        </div>

        <div className="settings-card settings-card--danger">
          <div className="settings-section">
            <h2 className="settings-section__title">Account</h2>
            <p className="settings-hint">Signed in as {user?.email}</p>
            <div className="settings-actions">
              <button className="btn-outline settings-logout" onClick={handleLogout}>
                SIGN OUT
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="home-footer container">
        <span className="home-footer__logo">teamundo</span>
      </footer>
    </div>
  );
}
