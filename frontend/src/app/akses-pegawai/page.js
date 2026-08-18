"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { 
  Menu, 
  Globe,
  Database,
  FileText,
  Award,
  TrendingUp,
  BarChart2,
  ExternalLink
} from 'lucide-react';

const BACKEND_URL = 'http://localhost:8081';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('/uploads')) {
    return `${BACKEND_URL}${path}`;
  }
  return path;
};

const getIconForTitle = (title) => {
  const t = title.toLowerCase();
  if (t.includes('pdln')) return <Globe size={32} style={{ color: '#0A1E38' }} />;
  if (t.includes('hris')) return <Database size={32} style={{ color: '#0A1E38' }} />;
  if (t.includes('sipeg')) return <FileText size={32} style={{ color: '#0A1E38' }} />;
  if (t.includes('sister')) return <Award size={32} style={{ color: '#0A1E38' }} />;
  if (t.includes('bkd')) return <TrendingUp size={32} style={{ color: '#0A1E38' }} />;
  if (t.includes('executive')) return <BarChart2 size={32} style={{ color: '#0A1E38' }} />;
  return <ExternalLink size={32} style={{ color: '#0A1E38' }} />;
};

const getAccentColor = (title, index) => {
  const t = title.toLowerCase();
  if (t.includes('pdln') || t.includes('sipeg') || t.includes('bkd')) return "#F2C94C";
  if (t.includes('hris') || t.includes('sister') || t.includes('executive')) return "#0A1E38";
  return index % 2 === 0 ? "#F2C94C" : "#0A1E38";
};

export default function AksesPegawai() {
  const [settings, setSettings] = useState({});
  const [aksesLinks, setAksesLinks] = useState([]);
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

    fetch(`${BACKEND_URL}/api/akses-pegawai`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAksesLinks(data);
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
            <h1 className="subpage-hero-title">Akses Pegawai</h1>
          </div>
        </section>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main style={{ padding: '4rem 0' }}>
        <div className="container">
          {aksesLinks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#64748B' }}>
              Belum ada data akses pegawai.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
              {aksesLinks.map((item, index) => (
                <div 
                  key={item.id || index} 
                  style={{ 
                    backgroundColor: '#ffffff', 
                    borderRadius: '12px', 
                    border: '1px solid #E2E8F0', 
                    padding: '2rem', 
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    borderTop: `4px solid ${getAccentColor(item.title, index)}`,
                    position: 'relative',
                    transition: 'transform 0.2s',
                  }}
                  className="akses-card"
                >
                  <div style={{ marginBottom: '1.25rem' }}>
                    {getIconForTitle(item.title)}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', color: '#0A1E38', fontWeight: '800', marginBottom: '0.75rem' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#576574', lineHeight: '1.6', marginBottom: '1.5rem', flexGrow: 1 }}>
                    {item.description}
                  </p>
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn-primary" 
                    style={{ 
                      padding: '0.55rem 1.75rem', 
                      fontSize: '0.85rem', 
                      borderRadius: '6px', 
                      width: '100%', 
                      justifyContent: 'center',
                      backgroundColor: '#0A1E38',
                      color: '#ffffff'
                    }}
                  >
                    Akses Sistem
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>


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

