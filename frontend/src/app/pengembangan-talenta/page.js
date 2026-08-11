"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { 
  Menu, 
  X,
  Calendar,
  MapPin,
  Building,
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

const slugify = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const PROGRAMS = [
  {
    id: 1,
    title: "Pelatihan Kepemimpinan Universitas",
    organizer: "DSDMPT Universitas Indonesia",
    date: "15 Maret 2026",
    location: "Gedung Rektorat Lt. 5",
    image: "/uploads/talent_1.jpg",
    type: "internal"
  },
  {
    id: 2,
    title: "Pengembangan Kompetensi Pedagogik",
    organizer: "Direktorat Pendidikan",
    date: "22 April 2026",
    location: "Auditorium",
    image: "/uploads/talent_2.jpg",
    type: "internal"
  },
  {
    id: 3,
    title: "Manajemen Karir Tendik",
    organizer: "Pusat Sistem Informasi",
    date: "22 Juni 2026",
    location: "Lab Komputer Terpadu",
    image: "/uploads/talent_3.jpg",
    type: "internal"
  },
  {
    id: 4,
    title: "Sertifikasi Kompetensi Global",
    organizer: "DSDMPT Universitas Indonesia",
    date: "12 Juli 2026",
    location: "Ruang Rapat Utama",
    image: "/uploads/talent_4.jpg",
    type: "public"
  },
  {
    id: 5,
    title: "Literasi Digital Administrasi",
    organizer: "Biro Komunikasi",
    date: "18 Agustus 2026",
    location: "Gedung IASTH Lt.3",
    image: "/uploads/talent_2.jpg",
    type: "public"
  },
  {
    id: 6,
    title: "Pelatihan Komunikasi Efektif",
    organizer: "DSDMPT Universitas Indonesia",
    date: "18 Agustus 2026",
    location: "Balai Sidang UI",
    image: "/uploads/talent_1.jpg",
    type: "public"
  }
];

export default function PengembanganTalenta() {
  const [activeTab, setActiveTab] = useState('semua'); // 'semua', 'public', 'internal'
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

  const getFilteredPrograms = () => {
    if (activeTab === 'semua') return PROGRAMS;
    return PROGRAMS.filter(p => p.type === activeTab);
  };

  const getTabText = () => {
    switch (activeTab) {
      case 'public':
        return "Program ini dirancang untuk masyarakat umum yang ingin membangun karier atau mengikuti kegiatan yang diselenggarakan oleh UI.";
      case 'internal':
        return "Program ini ditujukan khusus bagi sivitas akademika dan pegawai internal UI.";
      default:
        return "Pusat layanan rekrutmen dan pengembangan kompetensi yang terbuka untuk sivitas akademika UI maupun masyarakat umum.";
    }
  };

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
            <h1 className="subpage-hero-title">Pengembangan Talenta</h1>
          </div>
        </section>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main style={{ padding: '3rem 0' }}>
        <div className="container">
          
          {/* Tabs */}
          <div className="talent-tabs">
            <button
              onClick={() => setActiveTab('semua')}
              className={`talent-tab ${activeTab === 'semua' ? 'active' : ''}`}
            >
              Semua
            </button>
            <button
              onClick={() => setActiveTab('public')}
              className={`talent-tab ${activeTab === 'public' ? 'active' : ''}`}
            >
              Public
            </button>
            <button
              onClick={() => setActiveTab('internal')}
              className={`talent-tab ${activeTab === 'internal' ? 'active' : ''}`}
            >
              Internal
            </button>
          </div>

          {/* Dynamic Tab Description */}
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem auto' }}>
            <p className="talent-description">{getTabText()}</p>
          </div>

          {/* Grid Container */}
          <div className="talent-grid">
            {getFilteredPrograms().map((item) => (
              <div key={item.id} className="talent-card">
                <div className="talent-card-img-wrap">
                  <img src={getImageUrl(item.image)} alt={item.title} className="talent-card-img" />
                </div>
                <div className="talent-card-body">
                  <h3 className="talent-card-title">{item.title}</h3>
                  <div className="talent-card-meta">
                    <span className="talent-meta-item"><Building size={14} /> {item.organizer}</span>
                    <span className="talent-meta-item"><Calendar size={14} /> {item.date}</span>
                    <span className="talent-meta-item"><MapPin size={14} /> {item.location}</span>
                  </div>
                  <a 
                    href={`/pengembangan-talenta/${slugify(item.title)}`}
                    className="talent-card-btn"
                    style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}
                  >
                    Lihat Program
                  </a>
                </div>
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
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .talent-tabs {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          justify-content: center;
        }
        .talent-tab {
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
        }
        .talent-tab.active {
          background: #E0ECFB;
          color: #0A1E38;
          border-color: #A0C3F7;
        }
        .talent-tab:hover:not(.active) {
          border-color: #0A1E38;
          color: #0A1E38;
        }
        .talent-description {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #576574;
          font-weight: 500;
        }
        .talent-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-top: 1rem;
        }
        .talent-card {
          background: #ffffff;
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .talent-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }
        .talent-card-img-wrap {
          aspect-ratio: 16/10;
          overflow: hidden;
          background-color: #F1F5F9;
        }
        .talent-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }
        .talent-card:hover .talent-card-img {
          transform: scale(1.03);
        }
        .talent-card-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .talent-card-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: #0A1E38;
          line-height: 1.35;
          margin-bottom: 0.75rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .talent-card-meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        .talent-meta-item {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: #64748B;
          font-weight: 500;
        }
        .talent-card-btn {
          width: 100%;
          padding: 0.65rem;
          text-align: center;
          background-color: #0A1E38;
          color: #ffffff;
          font-weight: 700;
          font-size: 0.82rem;
          border-radius: 8px;
          margin-top: auto;
          transition: background-color 0.2s;
        }
        .talent-card-btn:hover {
          background-color: #1E3A5F;
        }
        @media (max-width: 992px) {
          .talent-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .talent-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
