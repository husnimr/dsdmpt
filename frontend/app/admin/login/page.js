"use client";

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, LogIn, Lock, User } from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL || 'http://localhost:3000';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLegacyForm, setShowLegacyForm] = useState(false);

  useEffect(() => {
    // If already logged in, redirect to admin
    const getCookie = (name) => {
      if (typeof document === 'undefined') return null;
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? decodeURIComponent(match[2]) : null;
    };
    const token = localStorage.getItem('admin_token') || getCookie('token');
    if (token) {
      window.location.href = '/admin/dashboard';
    }
  }, []);

  const handleSSOLogin = () => {
    const callbackUrl = window.location.origin + '/admin/dashboard';
    window.location.href = `${PORTAL_URL}/login?callback=${encodeURIComponent(callbackUrl)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Login gagal');
      }

      const data = await res.json();
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      window.location.href = '/admin/dashboard';
    } catch (err) {
      setError(err.message || 'Username atau password salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left decorative panel */}
        <div className="login-brand-panel">
          <div className="login-brand-content">
            <div className="logo-wrapper">
              <img 
                src={`${BACKEND_URL}/uploads/logo.png`} 
                alt="DSDMPTUI Logo" 
                className="brand-logo-img"
              />
            </div>
            <div className="login-brand-divider" />
            <p className="login-brand-desc">
              Direktorat Sumber Daya Manusia dan Pengembangan Talenta
            </p>
            <span className="brand-tagline">Universitas Indonesia</span>
          </div>
          <div className="login-brand-pattern" />
        </div>

        {/* Right form panel */}
        <div className="login-form-panel">
          <div className="login-form-wrapper">
            <div className="login-form-header">
              <h2>Log In Admin</h2>
              <p>Masuk menggunakan akun SSO UI untuk mengelola website DSDMPT.</p>
            </div>

            {error && (
              <div className="login-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                {error}
              </div>
            )}

            {/* SSO Primary Action */}
            <div className="sso-container">
              <button
                type="button"
                onClick={handleSSOLogin}
                className="login-submit-btn sso-btn"
              >
                <LogIn size={20} />
                <span>Masuk dengan SSO UI</span>
              </button>
              <p className="sso-hint">
                Autentikasi terpusat melalui Keycloak & Portal SDM UI.
              </p>
            </div>

            {/* Optional legacy login accordion */}
            <div className="legacy-login-toggle-wrap">
              <button 
                type="button" 
                className="legacy-toggle-btn"
                onClick={() => setShowLegacyForm(!showLegacyForm)}
              >
                {showLegacyForm ? 'Sembunyikan Form Manual' : 'Login Manual Akun Lokal'}
              </button>
            </div>

            {showLegacyForm && (
              <form onSubmit={handleSubmit} className="login-form animate-in fade-in duration-200">
                <div className="login-field">
                  <label htmlFor="username">Username</label>
                  <div className="login-input-icon-wrap">
                    <span className="login-input-icon"><User size={18} /></span>
                    <input
                      id="username"
                      type="text"
                      placeholder="Masukkan username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="login-field">
                  <label htmlFor="password">Password</label>
                  <div className="login-input-icon-wrap">
                    <span className="login-input-icon"><Lock size={18} /></span>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Masukkan password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ paddingRight: '2.8rem' }}
                    />
                    <button
                      type="button"
                      className="login-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="login-submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="login-spinner" />
                  ) : (
                    <>
                      <LogIn size={18} />
                      Masuk Manual
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at 10% 20%, rgba(241, 245, 249, 0.9) 0%, rgba(226, 232, 240, 0.9) 100%);
          padding: 1.5rem;
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        .login-container {
          display: flex;
          width: 100%;
          max-width: 920px;
          min-height: 560px;
          border-radius: 24px;
          overflow: hidden;
          background: #ffffff;
          box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(15, 23, 42, 0.04);
        }

        /* Brand panel */
        .login-brand-panel {
          width: 420px;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 3rem;
          position: relative;
          overflow: hidden;
          border-right: 1px solid rgba(255, 255, 255, 0.05);
        }
        .login-brand-pattern {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0);
          background-size: 20px 20px;
          mask-image: radial-gradient(circle at 50% 50%, black, transparent);
          pointer-events: none;
        }
        .login-brand-content {
          position: relative;
          z-index: 1;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .logo-wrapper {
          background: #ffffff;
          padding: 1.25rem 2rem;
          border-radius: 20px;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .brand-logo-img {
          height: 60px;
          width: auto;
          object-fit: contain;
        }
        .login-brand-divider {
          width: 50px;
          height: 3px;
          background: #F2C94C;
          margin: 1rem auto 1.5rem;
          border-radius: 2px;
        }
        .login-brand-desc {
          font-size: 0.95rem;
          color: #94A3B8;
          line-height: 1.6;
          font-weight: 500;
          max-width: 280px;
          margin-bottom: 1.5rem;
        }
        .brand-tagline {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 3px;
          color: #F2C94C;
          font-weight: 800;
        }

        /* Form panel */
        .login-form-panel {
          flex: 1;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 4rem;
        }
        .login-form-wrapper {
          width: 100%;
          max-width: 360px;
        }
        .login-form-header h2 {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 0.5rem;
          letter-spacing: -0.5px;
        }
        .login-form-header p {
          font-size: 0.9rem;
          color: #64748B;
          margin-bottom: 2.25rem;
          line-height: 1.5;
        }

        .login-error {
          background: #FEE2E2;
          color: #991B1B;
          border: 1px solid #FCA5A5;
          border-radius: 12px;
          padding: 0.85rem 1.25rem;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .login-field label {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          color: #334155;
          margin-bottom: 0.5rem;
        }
        
        .login-input-icon-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .login-input-icon {
          position: absolute;
          left: 0.95rem;
          color: #94A3B8;
          display: flex;
          align-items: center;
          pointer-events: none;
        }
        .login-input-icon-wrap input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1.5px solid #CBD5E1;
          border-radius: 12px;
          font-size: 0.95rem;
          font-family: inherit;
          color: #0F172A;
          background: #F8FAFC;
          transition: all 0.2s ease-in-out;
          outline: none;
          box-sizing: border-box;
        }
        .login-input-icon-wrap input:focus {
          border-color: #0F172A;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.08);
        }
        .login-input-icon-wrap input::placeholder {
          color: #94A3B8;
        }

        .login-password-toggle {
          position: absolute;
          right: 0.9rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #94A3B8;
          cursor: pointer;
          padding: 0.25rem;
          display: flex;
          align-items: center;
        }
        .login-password-toggle:hover {
          color: #334155;
        }

        .login-submit-btn {
          width: 100%;
          padding: 0.85rem;
          background: #0F172A;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          transition: all 0.2s ease-in-out;
          margin-top: 0.75rem;
        }
        .login-submit-btn:hover:not(:disabled) {
          background: #1E293B;
          box-shadow: 0 10px 20px -5px rgba(15, 23, 42, 0.2);
        }
        .login-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-spinner {
          width: 20px;
          height: 20px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .sso-container {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .sso-btn {
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
          padding: 1rem 1.5rem;
          font-size: 1rem;
          border-radius: 14px;
          box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.25);
          cursor: pointer;
        }
        .sso-btn:hover {
          background: linear-gradient(135deg, #1E293B 0%, #334155 100%);
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -5px rgba(15, 23, 42, 0.35);
        }
        .sso-hint {
          font-size: 0.8rem;
          color: #94A3B8;
          text-align: center;
          margin: 0;
        }
        .legacy-login-toggle-wrap {
          text-align: center;
          margin-top: 1rem;
          margin-bottom: 1rem;
          border-top: 1px dashed #E2E8F0;
          padding-top: 1rem;
        }
        .legacy-toggle-btn {
          background: none;
          border: none;
          font-size: 0.8rem;
          color: #64748B;
          font-weight: 700;
          cursor: pointer;
          text-decoration: underline;
        }
        .legacy-toggle-btn:hover {
          color: #0F172A;
        }

        @media (max-width: 768px) {
          .login-brand-panel { display: none; }
          .login-container { max-width: 460px; }
          .login-form-panel { padding: 3rem 2rem; }
        }
      `}} />
    </div>
  );
}
