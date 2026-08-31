"use client";

import React from 'react';

const BACKEND_URL = 'http://localhost:8081';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('/uploads')) return `${BACKEND_URL}${path}`;
  return path;
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-logo-side">
            <div className="footer-logo-row" style={{ marginBottom: '1rem' }}>
              <img 
                src={getImageUrl('/uploads/footer_logo.png')} 
                alt="DSDMPTUI Logo" 
                style={{ height: '68px', width: 'auto', objectFit: 'contain' }}
              />
            </div>
            <p className="footer-desc">Direktorat Sumber Daya Manusia dan Pengembangan Talenta</p>
            <p className="footer-copyright">&copy; {new Date().getFullYear()}. All Right Reserved</p>
          </div>
          <div className="footer-links-side">
            <ul className="footer-links-list">
              <li><a href="https://izin-pdln.dsdm.ui.ac.id" target="_blank" rel="noreferrer">Izin PDLN</a></li>
              <li><a href="https://hris.ui.ac.id" target="_blank" rel="noreferrer">HRIS UI</a></li>
              <li><a href="https://sipeg.ui.ac.id" target="_blank" rel="noreferrer">SIPEG UI</a></li>
              <li><a href="https://sister.kemdiktisaintek.go.id" target="_blank" rel="noreferrer">SISTER</a></li>
              <li><a href="https://stellar-dsdm.ui.ac.id" target="_blank" rel="noreferrer">STELLAR BKD</a></li>
              <li><a href="https://recruitment.ui.ac.id" target="_blank" rel="noreferrer">Rekrutmen UI</a></li>
            </ul>
            
            <div className="footer-social-side" style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon" id="instagram-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-icon" id="youtube-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon" id="linkedin-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
