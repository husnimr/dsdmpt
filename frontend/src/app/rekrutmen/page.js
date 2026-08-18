"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { 
  Menu, 
  ArrowRight
} from 'lucide-react';

const BACKEND_URL = 'http://localhost:8081';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('/uploads')) {
    return `${BACKEND_URL}${path}`;
  }
  return path;
};

export default function Rekrutmen() {
  const [settings, setSettings] = useState({});
  const [recs, setRecs] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/settings`)
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error(err));

    fetch(`${BACKEND_URL}/api/rekrutmen`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRecs(data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: 'var(--text-main)', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      
      <Navbar />

      {/* ── HERO BANNER ── */}
      <div className="subpage-hero-wrapper">
        <section
          className="subpage-hero"
          style={{ backgroundImage: `url(${getImageUrl(settings.hero_image || '/uploads/ui_rectorate_hero.png')})` }}
        >
          <div className="subpage-hero-overlay" />
          <div className="subpage-hero-content">
            <h1 className="subpage-hero-title">Rekrutmen</h1>
            <p className="subpage-hero-sub">Membangun Masa Depan Melalui Talenta Unggul & Impactful</p>
          </div>
        </section>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main style={{ padding: '5rem 0', backgroundColor: '#FFFFFF', minHeight: 'calc(100vh - 430px)' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#475569', marginBottom: '3rem', textAlign: 'center' }}>
            Direktorat Sumber Daya Manusia dan Pengembangan Talenta (DSDMPT) berkomitmen untuk merekrut individu yang berdedikasi tinggi demi memajukan visi pendidikan nasional. Kami mencari talenta yang siap berkontribusi pada ekosistem akademik yang prestisius, inovatif, dan berintegritas.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}>
            {recs.map((item) => (
              <a 
                key={item.id}
                href={item.link} 
                target="_blank" 
                rel="noreferrer"
                className="recruitment-link-btn" 
                style={{ 
                  fontSize: '1rem', 
                  padding: '1.1rem 2.5rem', 
                  borderRadius: '12px', 
                  fontWeight: '700', 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#FFFFFF',
                  color: '#0A1E38',
                  border: '2px solid #E2E8F0',
                  width: '100%',
                  maxWidth: '640px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                }}
              >
                <span style={{ textAlign: 'left', marginRight: '1rem' }}>{item.title}</span>
                <span className="arrow-icon" style={{ display: 'flex', alignItems: 'center', color: '#F2C94C' }}>
                  <ArrowRight size={20} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </main>

      <style>{`
        .recruitment-link-btn:hover {
          border-color: #0A1E38 !important;
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05) !important;
        }
      `}</style>


      {/* ── FOOTER ── */}
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
            <div className="footer-social-side">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon" id="instagram-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-icon" id="youtube-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon" id="linkedin-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

