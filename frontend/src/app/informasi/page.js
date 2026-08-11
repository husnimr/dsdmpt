"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { 
  Menu, 
  X, 
  FileText,
  Download,
  Eye
} from 'lucide-react';

const BACKEND_URL = 'http://localhost:8081';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('/uploads')) {
    return `${BACKEND_URL}${path}`;
  }
  return path;
};

export default function Informasi() {
  const [settings, setSettings] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showPdfReader, setShowPdfReader] = useState(false);

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
            <h1 className="subpage-hero-title">Informasi</h1>
          </div>
        </section>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main style={{ padding: '3rem 0' }}>
        <div className="container">
          {/* Tabs */}
          <div className="informasi-tabs">
            <a
              href="/berita"
              className="informasi-tab"
              id="tab-berita"
            >
              Berita
            </a>
            <button
              className="informasi-tab active"
              id="tab-informasi"
            >
              Informasi
            </button>
          </div>
        </div>

        <div className="container" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem' }}>
          
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* Card 1: Jadwal Pengisian BKD */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#0A1E38', borderBottom: '3px solid #F2C94C', paddingBottom: '0.5rem', marginBottom: '1.5rem', display: 'inline-block' }}>
                Jadwal Pengisian BKD
              </h2>
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)' }}>
                <img 
                  src={getImageUrl('/uploads/jadwal_bkd.png')} 
                  alt="Jadwal Pengisian BKD Semester Genap 2025/2026" 
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            </div>

            {/* Card 2: 9 Nilai Dasar UI */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#0A1E38', borderBottom: '3px solid #F2C94C', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'inline-block' }}>
                9 Nilai Dasar Universitas Indonesia
              </h2>
              <p style={{ color: '#576574', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '2rem' }}>
                Demi Mewujudkan Visi, Universitas Indonesia Miliki 9 Nilai Dasar. Sesuai dengan fungsi universalnya sebagai rumah dan lumbung pengetahuan, teladan, dan kekuatan moral bagi masyarakat, Universitas Indonesia (UI) memiliki nilai-nilai dasar yang harus dijunjung tinggi oleh para sivitas-nya.
              </p>

              {/* Cover & PDF Actions */}
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                <div style={{ width: '130px', height: '180px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.15)', flexShrink: 0, border: '1px solid #E2E8F0', backgroundColor: '#F2C94C', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.25rem 0.75rem', position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.25rem' }}>
                    <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
                      <circle cx="50" cy="50" r="46" fill="#0A1E38" />
                      <circle cx="50" cy="50" r="38" fill="#F2C94C" />
                      <path d="M50 20C42 35 32 45 32 60C32 70 40 76 50 76C60 76 68 70 68 60C68 45 58 35 50 20Z" fill="#0A1E38" />
                      <circle cx="50" cy="62" r="6" fill="#F2C94C" />
                    </svg>
                    <span style={{ fontSize: '0.5rem', fontWeight: '800', color: '#0A1E38', lineHeight: '1' }}>UNIVERSITAS<br/>INDONESIA</span>
                  </div>
                  <div style={{ textAlign: 'center', color: '#0A1E38' }}>
                    <h3 style={{ fontSize: '0.75rem', fontWeight: '800', lineHeight: '1.1', color: '#0A1E38', margin: 0 }}>NILAI-NILAI</h3>
                    <p style={{ fontSize: '0.45rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', margin: '2px 0 0 0' }}>Universitas Indonesia</p>
                  </div>
                  <div style={{ backgroundColor: '#0A1E38', color: '#F2C94C', fontSize: '0.45rem', padding: '0.2rem 0.4rem', borderRadius: '3px', fontWeight: '700', alignSelf: 'flex-start' }}>
                    BUKU SAKU
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', color: '#0A1E38', fontWeight: '700' }}>Buku Saku Nilai-Nilai Universitas Indonesia</h3>
                  <p style={{ fontSize: '0.85rem', color: '#576574', margin: 0 }}>Unduh atau baca langsung panduan resmi 9 nilai budaya dan nilai dasar Universitas Indonesia.</p>
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button 
                      onClick={() => setShowPdfReader(!showPdfReader)} 
                      className="btn-primary" 
                      style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', gap: '0.5rem', borderRadius: '8px' }}
                    >
                      <Eye size={16} /> {showPdfReader ? 'Tutup' : 'Baca'}
                    </button>
                    <a 
                      href={getImageUrl('/uploads/buku_saku_9_nilai_ui.pdf')} 
                      download
                      className="btn-secondary" 
                      style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', gap: '0.5rem', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#ffffff' }}
                    >
                      <Download size={16} /> Unduh
                    </a>
                  </div>
                </div>
              </div>

              {/* Embedded PDF Reader */}
              {showPdfReader && (
                <div style={{ marginTop: '2rem', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
                  <div style={{ backgroundColor: '#0A1E38', padding: '0.75rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ffffff' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>PDF Preview: Buku Saku Nilai-Nilai UI</span>
                    <button 
                      onClick={() => setShowPdfReader(false)} 
                      style={{ color: '#ffffff', opacity: '0.8', background: 'transparent', cursor: 'pointer' }}
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <iframe 
                    src={getImageUrl('/uploads/buku_saku_9_nilai_ui.pdf')} 
                    width="100%" 
                    height="580px" 
                    style={{ border: 'none', display: 'block' }}
                  />
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Dokumen Terkini */}
          <div>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '2rem', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: '96px' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#0A1E38', borderBottom: '3px solid #F2C94C', paddingBottom: '0.5rem', marginBottom: '1.5rem', display: 'inline-block' }}>
                Dokumen Terkini
              </h2>
              
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', padding: 0, margin: 0 }}>
                <li>
                  <a 
                    href={getImageUrl('/uploads/buku_saku_9_nilai_ui.pdf')} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', textDecoration: 'none' }}
                  >
                    <FileText size={20} style={{ color: '#E28743', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.88rem', fontWeight: '600', color: '#0A1E38', lineHeight: '1.3' }}>Surat Edaran Libur Nasional 2026</span>
                  </a>
                </li>
                <li>
                  <a 
                    href={getImageUrl('/uploads/buku_saku_9_nilai_ui.pdf')} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', textDecoration: 'none' }}
                  >
                    <FileText size={20} style={{ color: '#E28743', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.88rem', fontWeight: '600', color: '#0A1E38', lineHeight: '1.3' }}>Pedoman Evaluasi Kinerja Pegawai</span>
                  </a>
                </li>
                <li>
                  <a 
                    href={getImageUrl('/uploads/buku_saku_9_nilai_ui.pdf')} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', textDecoration: 'none' }}
                  >
                    <FileText size={20} style={{ color: '#E28743', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.88rem', fontWeight: '600', color: '#0A1E38', lineHeight: '1.3' }}>Kalender Akademik & Kepegawaian</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

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

      <style>{`
        .informasi-tabs {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
          justify-content: center;
        }
        .informasi-tab {
          padding: 0.45rem 1.25rem;
          border-radius: 50px;
          border: 1.5px solid #E2E8F0;
          font-family: var(--font-heading);
          font-size: 0.82rem;
          font-weight: 600;
          color: #576574;
          background: #fff;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .informasi-tab.active {
          background: #E0ECFB;
          color: #0A1E38;
          border-color: #A0C3F7;
        }
        .informasi-tab:hover:not(.active) {
          border-color: #0A1E38;
          color: #0A1E38;
        }
      `}</style>
    </div>
  );
}

