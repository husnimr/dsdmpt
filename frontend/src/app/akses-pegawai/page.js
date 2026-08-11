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
  BarChart2
} from 'lucide-react';

const BACKEND_URL = 'http://localhost:8081';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('/uploads')) {
    return `${BACKEND_URL}${path}`;
  }
  return path;
};

const AKSES_LINKS = [
  {
    title: "Izin PDLN",
    description: "Layanan permohonan izin perjalanan dinas luar negeri bagi pegawai.",
    link: "https://script.google.com/macros/s/AKfycbw7CdgMgY293NveC9b4B96d8yeqZDwCIU-ywVLBr14iNJYbLQRsRufUeYfFTV5qvS_I/exec",
    icon: <Globe size={32} style={{ color: '#0A1E38' }} />,
    colorAccent: "#F2C94C"
  },
  {
    title: "HRIS",
    description: "Sistem informasi terintegrasi untuk manajemen data sumber daya manusia.",
    link: "https://hris.ui.ac.id/",
    icon: <Database size={32} style={{ color: '#0A1E38' }} />,
    colorAccent: "#0A1E38"
  },
  {
    title: "SIPEG",
    description: "Portal pelayanan administrasi kepegawaian internal.",
    link: "https://sipeg.ui.ac.id/ng/otorisasi",
    icon: <FileText size={32} style={{ color: '#0A1E38' }} />,
    colorAccent: "#F2C94C"
  },
  {
    title: "SISTER",
    description: "Layanan administrasi dan pemutakhiran data pendidik maupun tenaga kependidikan.",
    link: "https://sister.kemdiktisaintek.go.id/beranda",
    icon: <Award size={32} style={{ color: '#0A1E38' }} />,
    colorAccent: "#0A1E38"
  },
  {
    title: "STELLAR-BKD",
    description: "Platform pengembangan talenta dan manajemen kinerja pegawai.",
    link: "https://stellar-dsdm.ui.ac.id/",
    icon: <TrendingUp size={32} style={{ color: '#0A1E38' }} />,
    colorAccent: "#F2C94C"
  },
  {
    title: "STELLAR-Executive",
    description: "Sistem Terpadu Laporan & Layanan Aktivitas Rekapitulasi Data Pegawai Tendik dan Dosen.",
    link: "https://stellar-dsdm.ui.ac.id/",
    icon: <BarChart2 size={32} style={{ color: '#0A1E38' }} />,
    colorAccent: "#0A1E38"
  }
];

export default function AksesPegawai() {
  const [settings, setSettings] = useState({});
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            {AKSES_LINKS.map((item, index) => (
              <div 
                key={index} 
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
                  borderTop: `4px solid ${item.colorAccent}`,
                  position: 'relative'
                }}
              >
                <div style={{ marginBottom: '1.25rem' }}>
                  {item.icon}
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

