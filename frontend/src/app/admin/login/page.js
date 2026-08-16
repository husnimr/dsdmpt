"use client";

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, LogIn, Shield } from 'lucide-react';

const BACKEND_URL = 'http://localhost:8081';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already logged in, redirect to admin
    const token = localStorage.getItem('admin_token');
    if (token) {
      window.location.href = '/admin/profil';
    }
  }, []);

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
      window.location.href = '/admin/profil';
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
            <div className="login-brand-icon">
              <Shield size={40} strokeWidth={1.5} />
            </div>
            <h1 className="login-brand-title">DSDMPT</h1>
            <p className="login-brand-subtitle">Admin Panel</p>
            <div className="login-brand-divider" />
            <p className="login-brand-desc">
              Direktorat SDM dan Pengembangan Talenta<br />Universitas Indonesia
            </p>
          </div>
          <div className="login-brand-pattern" />
        </div>

        {/* Right form panel */}
        <div className="login-form-panel">
          <div className="login-form-wrapper">
            <div className="login-form-header">
              <h2>Masuk ke Admin</h2>
              <p>Silakan masukkan kredensial Anda</p>
            </div>

            {error && (
              <div className="login-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-field">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="login-field">
                <label htmlFor="password">Password</label>
                <div className="login-password-wrap">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
                    Masuk
                  </>
                )}
              </button>
            </form>

            <div className="login-footer">
              <a href="/">← Kembali ke halaman utama</a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #F8FAFC;
          padding: 1rem;
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        }
        .login-container {
          display: flex;
          width: 100%;
          max-width: 880px;
          min-height: 520px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(15,23,42,0.08), 0 4px 16px rgba(15,23,42,0.04);
          border: 1px solid #E2E8F0;
        }

        /* Brand panel */
        .login-brand-panel {
          width: 380px;
          background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 3rem 2.5rem;
          position: relative;
          overflow: hidden;
        }
        .login-brand-pattern {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 20% 80%, rgba(37,99,235,0.08) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(255,255,255,0.04) 0%, transparent 40%);
          pointer-events: none;
        }
        .login-brand-content {
          position: relative;
          z-index: 1;
          text-align: center;
        }
        .login-brand-icon {
          width: 72px;
          height: 72px;
          border-radius: 16px;
          background: rgba(37,99,235,0.15);
          border: 1px solid rgba(37,99,235,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: #3B82F6;
        }
        .login-brand-title {
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin-bottom: 0.25rem;
          color: #fff;
        }
        .login-brand-subtitle {
          font-size: 0.85rem;
          font-weight: 500;
          color: rgba(255,255,255,0.6);
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .login-brand-divider {
          width: 40px;
          height: 2px;
          background: #3B82F6;
          margin: 1.5rem auto;
          border-radius: 1px;
        }
        .login-brand-desc {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.5);
          line-height: 1.6;
        }

        /* Form panel */
        .login-form-panel {
          flex: 1;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem;
        }
        .login-form-wrapper {
          width: 100%;
          max-width: 340px;
        }
        .login-form-header h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 0.35rem;
        }
        .login-form-header p {
          font-size: 0.88rem;
          color: #64748B;
          margin-bottom: 2rem;
        }

        .login-error {
          background: #FEF2F2;
          color: #DC2626;
          border: 1px solid #FECACA;
          border-radius: 8px;
          padding: 0.75rem 1rem;
          font-size: 0.82rem;
          font-weight: 500;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .login-field label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: #475569;
          margin-bottom: 0.4rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .login-field input {
          width: 100%;
          padding: 0.7rem 0.9rem;
          border: 1.5px solid #E2E8F0;
          border-radius: 8px;
          font-size: 0.92rem;
          font-family: inherit;
          color: #1E293B;
          background: #FFFFFF;
          transition: all 0.2s;
          outline: none;
          box-sizing: border-box;
        }
        .login-field input:focus {
          border-color: #2563EB;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        .login-field input::placeholder {
          color: #94A3B8;
        }

        .login-password-wrap {
          position: relative;
        }
        .login-password-wrap input {
          padding-right: 2.8rem;
        }
        .login-password-toggle {
          position: absolute;
          right: 0.6rem;
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
          color: #475569;
        }

        .login-submit-btn {
          width: 100%;
          padding: 0.75rem;
          background: #2563EB;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 0.92rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s;
          margin-top: 0.5rem;
        }
        .login-submit-btn:hover:not(:disabled) {
          background: #1D4ED8;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
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

        .login-footer {
          margin-top: 2rem;
          text-align: center;
        }
        .login-footer a {
          font-size: 0.82rem;
          color: #64748B;
          text-decoration: none;
          transition: color 0.2s;
        }
        .login-footer a:hover {
          color: #2563EB;
        }

        @media (max-width: 768px) {
          .login-brand-panel { display: none; }
          .login-container { max-width: 420px; }
          .login-form-panel { padding: 2rem 1.5rem; }
        }
      `}</style>
    </div>
  );
}
