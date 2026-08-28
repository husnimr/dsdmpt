"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
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
  const [programs, setPrograms] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

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

    fetch(`${BACKEND_URL}/api/pengembangan-talenta`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPrograms(data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const getFilteredPrograms = () => {
    if (activeTab === 'semua') return programs;
    return programs.filter(p => p.type === activeTab);
  };

  const getPaginatedPrograms = () => {
    const filtered = getFilteredPrograms();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(getFilteredPrograms().length / itemsPerPage);

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
          style={{ backgroundImage: `url(${getImageUrl(settings.pengembangan_talenta_hero_image || settings.hero_image || '/uploads/ui_rectorate_hero.png')})` }}
        >
          <div className="subpage-hero-overlay" />
          <div className="subpage-hero-content">
            <h1 className="subpage-hero-title">{settings.pengembangan_talenta_hero_title || 'Pengembangan Talenta'}</h1>
            {settings.pengembangan_talenta_hero_desc && <p className="subpage-hero-sub">{settings.pengembangan_talenta_hero_desc}</p>}
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
              Publik
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
            {getPaginatedPrograms().map((item) => (
              <div key={item.id} className="talent-card">
                <div className="talent-card-img-wrap">
                  <img src={getImageUrl(item.image)} alt={item.title} className="talent-card-img" />
                </div>
                <div className="talent-card-body">
                  <h3 className="talent-card-title">{item.title}</h3>
                  <div className="talent-card-meta">
                    <span className="talent-meta-item"><Building size={14} /> {item.organizer}</span>
                    <span className="talent-meta-item">
                      <Calendar size={14} />{' '}
                      {(() => {
                        const dateStr = item.date;
                        if (!dateStr) return '';
                        if (isNaN(Date.parse(dateStr))) return dateStr;
                        const months = [
                          'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                          'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
                        ];
                        const d = new Date(dateStr);
                        if (isNaN(d.getTime())) return dateStr;
                        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
                      })()}
                    </span>
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '3.5rem'
            }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '0.55rem 1.1rem',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: '8px',
                  background: '#FFFFFF',
                  color: '#475569',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 1 ? 0.5 : 1,
                  transition: 'all 0.2s'
                }}
              >
                Sebelumnya
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  style={{
                    width: '38px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px solid',
                    borderColor: i + 1 === currentPage ? '#0A1E38' : '#CBD5E1',
                    borderRadius: '8px',
                    background: i + 1 === currentPage ? '#0A1E38' : '#FFFFFF',
                    color: i + 1 === currentPage ? '#FFFFFF' : '#475569',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '0.55rem 1.1rem',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: '8px',
                  background: '#FFFFFF',
                  color: '#475569',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  opacity: currentPage === totalPages ? 0.5 : 1,
                  transition: 'all 0.2s'
                }}
              >
                Selanjutnya
              </button>
            </div>
          )}

        </div>
      </main>

      <Footer />

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
