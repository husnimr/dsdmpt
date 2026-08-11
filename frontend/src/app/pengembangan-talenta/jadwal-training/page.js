"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { 
  Menu, 
  X,
  Calendar,
  Clock,
  MapPin,
  ChevronDown,
  Building
} from 'lucide-react';

const BACKEND_URL = 'http://localhost:8081';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('/uploads')) {
    return `${BACKEND_URL}${path}`;
  }
  return path;
};

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const SCHEDULE_DATA = {
  "Maret": [
    {
      id: 1,
      title: "Pelatihan Kepemimpinan Universitas",
      organizer: "DSDMPT Universitas Indonesia",
      date: "15 Maret 2026",
      time: "09:00 - 15:00",
      location: "Gedung Rektorat Lt. 8",
      type: "public"
    }
  ],
  "April": [
    {
      id: 2,
      title: "Pengembangan Kompetensi Pedagogik",
      organizer: "Direktorat Pendidikan",
      date: "22 April 2026",
      time: "08:30 - 16:00",
      location: "Auditorium",
      type: "public"
    }
  ],
  "Juni": [
    {
      id: 3,
      title: "Manajemen Karir Tendik",
      organizer: "Pusat Sistem Informasi",
      date: "05 Juni 2026",
      time: "10:00 - 14:00",
      location: "Lab Komputer Terpadu",
      type: "internal"
    }
  ],
  "Juli": [
    {
      id: 4,
      title: "Sertifikasi Kompetensi Global",
      organizer: "DSDMPT Universitas Indonesia",
      date: "12 Juli 2026",
      time: "09:00 - 16:00",
      location: "Ruang Rapat Utama",
      type: "public"
    }
  ],
  "Agustus": [
    {
      id: 5,
      title: "Literasi Digital Administrasi",
      organizer: "Biro Komunikasi",
      date: "18 Agustus 2026",
      time: "08:00 - 15:00",
      location: "Gedung IASTH Lt.3",
      type: "public"
    },
    {
      id: 6,
      title: "Pelatihan Komunikasi Efektif",
      organizer: "DSDMPT Universitas Indonesia",
      date: "18 Agustus 2026",
      time: "09:00 - 16:00",
      location: "Balai Sidang UI",
      type: "public"
    }
  ]
};

export default function JadwalTrainingPage() {
  const [expandedMonths, setExpandedMonths] = useState({
    "Maret": true,
    "April": true,
    "Juni": true,
    "Juli": true,
    "Agustus": true
  });
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

  const toggleMonth = (month) => {
    setExpandedMonths(prev => ({
      ...prev,
      [month]: !prev[month]
    }));
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
            <h1 className="subpage-hero-title">Jadwal Training</h1>
          </div>
        </section>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main style={{ padding: '4rem 0' }}>
        <div className="container">
          
          {/* Top Intro Section */}
          <div className="intro-grid">
            <div className="intro-text-col">
              <p className="intro-p">
                Pada Direktorat Sumber Daya Manusia dan Pengembangan Talenta Universitas Indonesia (DSDMPT UI), pengembangan talenta mencakup pelatihan berkala dan terstruktur untuk membangun kapasitas, kompetensi, serta komitmen para dosen dan tenaga kependidikan (tendik).
              </p>
              <p className="intro-p">
                Melalui berbagai program pelatihan ini, DSDMPT UI menerapkan merit system dalam manajemen talenta—memastikan seluruh sivitas akademika memiliki jalur pengembangan karir yang jelas, adaptif terhadap perkembangan zaman, serta siap mendukung UI sebagai perguruan tinggi berkelas dunia.
              </p>
              <p className="intro-p">
                Secara keseluruhan, program pelatihan di DSDMPT UI bukan sekadar kegiatan rutin, melainkan investasi berkelanjutan untuk menerapkan merit system—di mana setiap SDM diberikan kesempatan tumbuh sesuai potensi terbaiknya demi mendukung reputasi Universitas Indonesia sebagai perguruan tinggi berkelas dunia.
              </p>
            </div>
            <div className="intro-img-col">
              <div className="intro-img-wrapper">
                <img 
                  src={getImageUrl('/uploads/talent_1.jpg')} 
                  alt="DSDMPT UI Group Photo" 
                  className="intro-img"
                />
              </div>
            </div>
          </div>

          {/* Centered Schedule Header */}
          <div className="schedule-header-section">
            <h2 className="schedule-main-title">Jadwal Training</h2>
            <p className="schedule-subtitle">Tahun Akademik 2026</p>
            <div className="header-bar" />
          </div>

          {/* Centered & Half-Width Accordion Component */}
          <div className="accordion-wrapper">
            <div className="accordion-container">
              {MONTHS.map((month) => {
                const isOpen = expandedMonths[month];
                const programs = SCHEDULE_DATA[month] || [];
                
                return (
                  <div key={month} className="accordion-item">
                    <button 
                      className={`accordion-header ${isOpen ? 'active' : ''}`}
                      onClick={() => toggleMonth(month)}
                    >
                      <span className="accordion-month">{month}</span>
                      <div className="accordion-arrow-box">
                        <ChevronDown size={18} className={`accordion-arrow ${isOpen ? 'rotate' : ''}`} />
                      </div>
                    </button>
                    
                    {isOpen && (
                      <div className="accordion-content">
                        {programs.length > 0 ? (
                          <div className="program-list">
                            {programs.map((prog) => (
                              <div key={prog.id} className="schedule-card-item">
                                <div className="schedule-card-body">
                                  <h4 className="schedule-card-title">{prog.title}</h4>
                                  <span className="schedule-card-organizer">{prog.organizer}</span>
                                  
                                  <div className="schedule-card-meta-row">
                                    <span className={`schedule-badge ${prog.type}`}>
                                      {prog.type === 'public' ? 'PUBLIK' : 'INTERNAL'}
                                    </span>
                                    <span className="schedule-meta-item">
                                      <Clock size={14} /> {prog.date} • {prog.time}
                                    </span>
                                    <span className="schedule-meta-item">
                                      <MapPin size={14} /> {prog.location}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="empty-schedule">
                            Tidak ada jadwal pelatihan untuk bulan {month} 2026.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
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
        .intro-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 3rem;
          align-items: flex-start;
        }
        .intro-text-col {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .intro-p {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #576574;
          text-align: justify;
          margin: 0;
        }
        .intro-img-col {
          display: flex;
          justify-content: center;
        }
        .intro-img-wrapper {
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          border: 1px solid #E2E8F0;
        }
        .intro-img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
        }

        /* Centered Header Section */
        .schedule-header-section {
          text-align: center;
          margin-top: 5rem;
          margin-bottom: 3rem;
        }
        .schedule-main-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #0A1E38;
          margin-bottom: 0.25rem;
        }
        .schedule-subtitle {
          font-size: 1.05rem;
          color: #64748B;
          font-weight: 600;
          margin: 0;
        }
        .header-bar {
          width: 50px;
          height: 4px;
          background-color: #F2C94C;
          margin: 1.15rem auto 0 auto;
          border-radius: 2px;
        }

        /* Half-Width Accordion Wrapper */
        .accordion-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
        }
        .accordion-container {
          width: 100%;
          max-width: 760px; /* Centered half-width of container */
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .accordion-item {
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          overflow: hidden;
          background-color: #FFFFFF;
          box-shadow: 0 2px 10px rgba(0,0,0,0.02);
          transition: all 0.2s ease;
        }
        .accordion-item:hover {
          border-color: #CBD5E1;
          box-shadow: 0 4px 15px rgba(0,0,0,0.04);
        }
        .accordion-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 2rem;
          background: #FFFFFF;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }
        .accordion-header:hover {
          background-color: #F8FAFC;
        }
        .accordion-header.active {
          border-bottom: 1px solid #E2E8F0;
          background-color: #F8FAFC;
        }
        .accordion-month {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 700;
          color: #0A1E38;
        }
        .accordion-arrow-box {
          color: #0A1E38;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .accordion-arrow {
          transition: transform 0.3s ease;
        }
        .accordion-arrow.rotate {
          transform: rotate(180deg);
        }
        .accordion-content {
          padding: 1.75rem;
          background-color: #FFFFFF;
        }

        /* Re-implemented Premium Card List styles */
        .program-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .schedule-card-item {
          border: 1.5px solid #F1F5F9;
          border-left: 5px solid #0A1E38;
          border-radius: 12px;
          background-color: #FFFFFF;
          box-shadow: 0 4px 15px rgba(0,0,0,0.02);
          transition: all 0.2s;
        }
        .schedule-card-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.05);
          border-color: #E2E8F0;
        }
        .schedule-card-body {
          padding: 1.5rem;
        }
        .schedule-card-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0A1E38;
          margin-bottom: 0.25rem;
          line-height: 1.35;
        }
        .schedule-card-organizer {
          display: block;
          font-size: 0.82rem;
          color: #64748B;
          font-weight: 600;
          margin-bottom: 1.25rem;
        }
        .schedule-card-meta-row {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          flex-wrap: wrap;
        }
        .schedule-badge {
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          letter-spacing: 0.5px;
        }
        .schedule-badge.public {
          background-color: #FEF9E7;
          color: #D4AC0D;
        }
        .schedule-badge.internal {
          background-color: #E2ECFC;
          color: #2F80ED;
        }
        .schedule-meta-item {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: #576574;
          font-weight: 500;
        }

        .empty-schedule {
          font-size: 0.92rem;
          color: #94A3B8;
          text-align: center;
          padding: 1.5rem 0;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
