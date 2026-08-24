"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { 
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const BACKEND_URL = 'http://localhost:8081';

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const STATIC_FALLBACK_DATA = [
  {
    id: 1,
    title: "Kepemimpinan Strategis",
    organizer: "DSDMPT Universitas Indonesia",
    date: "15 Maret 2026",
    time: "09:00 - 15:00",
    location: "Gedung Rektorat Lt. 2",
    type: "public"
  },
  {
    id: 2,
    title: "Sertifikasi Kompetensi",
    organizer: "Direktorat Pendidikan",
    date: "22 April 2026",
    time: "08:30 - 16:00",
    location: "Auditorium Juwono",
    type: "public"
  },
  {
    id: 3,
    title: "Literasi Digital",
    organizer: "Pusat Sistem Informasi",
    date: "05 Juni 2026",
    time: "10:00 - 14:00",
    location: "Lab Komputer",
    type: "internal"
  },
  {
    id: 4,
    title: "Manajemen Proyek Agile",
    organizer: "DSDMPT Universitas Indonesia",
    date: "12 Juli 2026",
    time: "09:00 - 16:00",
    location: "Ruang Rapat Utama",
    type: "public"
  },
  {
    id: 5,
    title: "Komunikasi Efektif",
    organizer: "Biro Komunikasi",
    date: "18 Agustus 2026",
    time: "08:00 - 15:00",
    location: "Gedung IASTH Lt. 3",
    type: "internal"
  },
  {
    id: 6,
    title: "Etika Profesi & Integritas",
    organizer: "DSDMPT Universitas Indonesia",
    date: "05 September 2026",
    time: "09:00 - 16:00",
    location: "Balai Sidang UI",
    type: "public"
  }
];

export default function JadwalTrainingPage() {
  const [selectedMonth, setSelectedMonth] = useState("Agustus");
  const [selectedYear, setSelectedYear] = useState(2026);
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  
  const [trainings, setTrainings] = useState([]);
  const [yearsList, setYearsList] = useState([2025, 2026]);
  const [settings, setSettings] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when month or year filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    // Fetch settings
    fetch(`${BACKEND_URL}/api/settings`)
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error(err));

    // Fetch dynamic trainings
    fetch(`${BACKEND_URL}/api/pengembangan-talenta`)
      .then(res => res.json())
      .then(data => {
        const listData = (data && data.length > 0) ? data : STATIC_FALLBACK_DATA;
        setTrainings(listData);
        
        // Extract unique years from the dates
        const extractedYears = listData.map(item => {
          if (!item.date) return null;
          const match = item.date.match(/\b(20\d{2})\b/);
          return match ? parseInt(match[1]) : null;
        }).filter(Boolean);
        
        // Get sorted unique years list
        const uniqueYears = Array.from(new Set(extractedYears)).sort((a, b) => a - b);
        
        if (uniqueYears.length > 0) {
          // Always ensure at least 2025 is in the list
          if (!uniqueYears.includes(2025)) {
            uniqueYears.unshift(2025);
          }
          setYearsList(uniqueYears);
          // Set default selected year to the first non-2025 year or 2026 if available
          const defaultYear = uniqueYears.find(y => y !== 2025) || 2025;
          setSelectedYear(defaultYear);
        } else {
          setYearsList([2025, 2026]);
          setSelectedYear(2026);
        }
      })
      .catch(() => {
        setTrainings(STATIC_FALLBACK_DATA);
        setYearsList([2025, 2026]);
        setSelectedYear(2026);
      });
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const closeDropdowns = () => {
      setMonthDropdownOpen(false);
      setYearDropdownOpen(false);
    };
    window.addEventListener('click', closeDropdowns);
    return () => window.removeEventListener('click', closeDropdowns);
  }, []);

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('/uploads')) {
      return `${BACKEND_URL}${path}`;
    }
    return path;
  };

  const handlePrevMonth = () => {
    const currentIndex = MONTHS.indexOf(selectedMonth);
    if (currentIndex === 0) {
      // Go to December of previous year if possible
      const prevYearIndex = yearsList.indexOf(selectedYear) - 1;
      if (prevYearIndex >= 0) {
        setSelectedMonth("Desember");
        setSelectedYear(yearsList[prevYearIndex]);
      }
    } else {
      setSelectedMonth(MONTHS[currentIndex - 1]);
    }
  };

  const handleNextMonth = () => {
    const currentIndex = MONTHS.indexOf(selectedMonth);
    if (currentIndex === 11) {
      // Go to January of next year if possible
      const nextYearIndex = yearsList.indexOf(selectedYear) + 1;
      if (nextYearIndex < yearsList.length) {
        setSelectedMonth("Januari");
        setSelectedYear(yearsList[nextYearIndex]);
      }
    } else {
      setSelectedMonth(MONTHS[currentIndex + 1]);
    }
  };

  // Helper to format Date string to Indonesian format (e.g. "2026-08-20" -> "20 Agustus 2026")
  const formatIndonesianDate = (dateStr) => {
    if (!dateStr) return '';
    const hasIndoMonth = MONTHS.some(m => dateStr.toLowerCase().includes(m.toLowerCase()));
    if (hasIndoMonth) return dateStr;

    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  };

  // Filter trainings matching the selected month name and year
  const filteredTrainings = trainings.filter(item => {
    if (!item.date) return false;
    const normalized = item.date.toLowerCase();
    
    // 1. Textual format match (e.g. "18 Agustus 2026")
    if (normalized.includes(selectedMonth.toLowerCase()) && normalized.includes(String(selectedYear))) {
      return true;
    }
    
    // 2. ISO format match (e.g. "2026-08-20")
    const d = new Date(item.date);
    if (!isNaN(d.getTime())) {
      const monthIndex = d.getMonth();
      const year = d.getFullYear();
      const expectedMonthIndex = MONTHS.indexOf(selectedMonth);
      return monthIndex === expectedMonthIndex && year === selectedYear;
    }
    
    return false;
  });

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredTrainings.length / itemsPerPage);
  const displayedTrainings = filteredTrainings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: 'var(--text-main)', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      
      <Navbar />

      {/* ── HERO BANNER ── */}
      <div className="subpage-hero-wrapper">
        <section
          className="subpage-hero"
          style={{ backgroundImage: `url(${getImageUrl(settings.jadwal_training_hero_image || settings.hero_image || '/uploads/ui_rectorate_hero.png')})` }}
        >
          <div className="subpage-hero-overlay" />
          <div className="subpage-hero-content">
            <h1 className="subpage-hero-title">{settings.jadwal_training_hero_title || 'Jadwal Training'}</h1>
            {settings.jadwal_training_hero_desc && (
              <p className="subpage-hero-sub" style={{ color: 'rgba(255,255,255,0.9)', marginTop: '0.5rem', fontSize: '1.1rem' }}>
                {settings.jadwal_training_hero_desc}
              </p>
            )}
          </div>
        </section>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main style={{ padding: '4rem 0' }}>
        <div className="container">
          
          {/* Top Intro Section */}
          <div className="intro-grid">
            <div className="intro-text-col">
              {settings.jadwal_training_description ? (
                settings.jadwal_training_description.split('\n').filter(Boolean).map((para, idx) => (
                  <p key={idx} className="intro-p">{para}</p>
                ))
              ) : (
                <>
                  <p className="intro-p">
                    {settings.jadwal_training_intro_p1 || 'Pada Direktorat Sumber Daya Manusia dan Pengembangan Talenta Universitas Indonesia (DSDMPT UI), pengembangan talenta mencakup pelatihan berkala dan terstruktur untuk membangun kapasitas, kompetensi, serta komitmen para dosen dan tenaga kependidikan (tendik).'}
                  </p>
                  <p className="intro-p">
                    {settings.jadwal_training_intro_p2 || 'Melalui berbagai program pelatihan ini, DSDMPT UI menerapkan merit system dalam manajemen talenta—memastikan seluruh sivitas akademika memiliki jalur pengembangan karir yang jelas, adaptif terhadap perkembangan zaman, serta siap mendukung UI sebagai perguruan tinggi berkelas dunia.'}
                  </p>
                  <p className="intro-p">
                    {settings.jadwal_training_intro_p3 || 'Secara keseluruhan, program pelatihan di DSDMPT UI bukan sekadar kegiatan rutin, melainkan investasi berkelanjutan untuk menerapkan merit system—di mana setiap SDM diberikan kesempatan tumbuh sesuai potensi terbaiknya demi mendukung reputasi Universitas Indonesia sebagai perguruan tinggi berkelas dunia.'}
                  </p>
                </>
              )}
            </div>
            <div className="intro-img-col">
              <div className="intro-img-wrapper">
                <img 
                  src={getImageUrl(settings.jadwal_training_intro_image || '/uploads/talent_1.jpg')} 
                  alt="DSDMPT UI Group Photo" 
                  className="intro-img"
                />
              </div>
            </div>
          </div>

          {/* Main Wrapper Panel Card */}
          <div className="schedule-panel-card">
            
            {/* Header inside the panel card */}
            <div className="schedule-panel-header">
              <div className="schedule-title-area">
                <h2 className="schedule-main-title">Jadwal Training</h2>
                <p className="schedule-subtitle">Tahun Akademik {selectedYear}</p>
              </div>

              {/* Month & Year Slider & Dropdown Navigation */}
              <div className="month-navigation">
                <button 
                  onClick={(e) => { e.stopPropagation(); handlePrevMonth(); }} 
                  className="btn-nav-month" 
                  title="Bulan Sebelumnya"
                >
                  <ChevronLeft size={18} />
                </button>
                
                <div className="inline-selector-group">
                  {/* Month Dropdown */}
                  <div className="dropdown-container-inline" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => {
                        setMonthDropdownOpen(!monthDropdownOpen);
                        setYearDropdownOpen(false);
                      }} 
                      className="current-inline-btn"
                      title="Pilih Bulan"
                    >
                      {selectedMonth}
                    </button>
                    
                    {monthDropdownOpen && (
                      <div className="month-dropdown-list">
                        {MONTHS.map((month) => (
                          <div 
                            key={month} 
                            className={`month-dropdown-item ${selectedMonth === month ? 'selected' : ''}`}
                            onClick={() => {
                              setSelectedMonth(month);
                              setMonthDropdownOpen(false);
                            }}
                          >
                            {month}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Spacer Space */}
                  <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0A1E38', userSelect: 'none' }}>&nbsp;</span>

                  {/* Year Dropdown */}
                  <div className="dropdown-container-inline" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => {
                        setYearDropdownOpen(!yearDropdownOpen);
                        setMonthDropdownOpen(false);
                      }} 
                      className="current-inline-btn"
                      title="Pilih Tahun"
                    >
                      {selectedYear}
                    </button>
                    
                    {yearDropdownOpen && (
                      <div className="month-dropdown-list year-list">
                        {yearsList.map((year) => (
                          <div 
                            key={year} 
                            className={`month-dropdown-item ${selectedYear === year ? 'selected' : ''}`}
                            onClick={() => {
                              setSelectedYear(year);
                              setYearDropdownOpen(false);
                            }}
                          >
                            {year}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); handleNextMonth(); }} 
                  className="btn-nav-month" 
                  title="Bulan Selanjutnya"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="schedule-panel-divider" />

             {/* Grid Layout of Premium Cards */}
            <div className="training-grid">
              {displayedTrainings.length > 0 ? (
                displayedTrainings.map((prog) => {
                  const isPublic = prog.type === 'public' || prog.type === 'PUBLIK';
                  return (
                    <div key={prog.id} className="training-card">
                      <div className="training-card-header-block">
                        <h4 className="training-card-title">{prog.title}</h4>
                        <span className="training-card-organizer">{prog.organizer}</span>
                      </div>
                      
                      <div className="training-card-meta-block">
                        <div className="training-card-badge-row">
                          <span className={`training-badge ${isPublic ? 'public' : 'internal'}`}>
                            {isPublic ? 'PUBLIK' : 'INTERNAL'}
                          </span>
                          <span className="training-meta-item">
                            <Calendar size={13} /> {formatIndonesianDate(prog.date)}
                          </span>
                        </div>
                        
                        <div className="training-card-location">
                          <MapPin size={13} /> {prog.location}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty-training-state">
                  Tidak ada jadwal pelatihan untuk bulan {selectedMonth} {selectedYear}.
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination-wrapper">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="pagination-arrow-btn"
                  title="Halaman Sebelumnya"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`pagination-number-btn ${currentPage === pageNum ? 'active' : ''}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="pagination-arrow-btn"
                  title="Halaman Selanjutnya"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

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

      <style dangerouslySetInnerHTML={{ __html: `
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

        /* Main Panel Card Wrapper - Matches content width exactly */
        .schedule-panel-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.02);
          width: 100%;
          margin: 4rem 0 0 0;
        }
        .schedule-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.5rem;
        }
        .schedule-title-area {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .schedule-main-title {
          font-size: 1.65rem;
          font-weight: 800;
          color: #0A1E38;
          margin: 0;
        }
        .schedule-subtitle {
          font-size: 0.88rem;
          color: #64748B;
          font-weight: 600;
          margin: 0;
        }
        .schedule-panel-divider {
          height: 1px;
          background-color: #F1F5F9;
          margin: 1.5rem 0 2rem 0;
        }

        /* Month & Year Navigation & Dropdown Selection */
        .month-navigation {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 50px;
          padding: 0.35rem 0.75rem;
        }
        .btn-nav-month {
          background: none;
          border: none;
          color: #64748B;
          cursor: pointer;
          transition: all 0.2s;
          padding: 0.35rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
        .btn-nav-month:hover {
          color: #0A1E38;
          background-color: #E2E8F0;
        }
        
        .inline-selector-group {
          display: flex;
          align-items: center;
        }
        .dropdown-container-inline {
          position: relative;
        }
        .current-inline-btn {
          background: none;
          border: none;
          font-family: var(--font-heading);
          font-size: 0.95rem;
          font-weight: 800;
          color: #0A1E38;
          cursor: pointer;
          padding: 0.25rem 0.4rem;
          border-radius: 4px;
          transition: background-color 0.2s;
        }
        .current-inline-btn:hover {
          background-color: #E2E8F0;
        }
        .month-dropdown-list {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(8px);
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          width: 140px;
          z-index: 100;
          max-height: 240px;
          overflow-y: auto;
          padding: 0.4rem;
        }
        .month-dropdown-list.year-list {
          width: 90px;
        }
        .month-dropdown-item {
          padding: 0.45rem 0.75rem;
          font-size: 0.82rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.15s;
          text-align: center;
        }
        .month-dropdown-item:hover {
          background-color: #F1F5F9;
          color: #0A1E38;
        }
        .month-dropdown-item.selected {
          background-color: #E0ECFB;
          color: #0A1E38;
        }

        /* Training Grid */
        .training-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .training-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.75rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 200px;
        }
        .training-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.06);
          border-color: #CBD5E1;
        }
        
        .training-card-header-block {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .training-card-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: #0A1E38;
          margin: 0;
          line-height: 1.35;
        }
        .training-card-organizer {
          font-size: 0.8rem;
          color: #64748B;
          font-weight: 500;
        }
        .training-card-meta-block {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          border-top: 1px solid #F1F5F9;
          padding-top: 1rem;
        }
        .training-card-badge-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .training-badge {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.25rem 0.65rem;
          border-radius: 4px;
          letter-spacing: 0.5px;
        }
        .training-badge.public {
          background-color: #E0F2FE;
          color: #0284C7;
        }
        .training-badge.internal {
          background-color: #FEF3C7;
          color: #D97706;
        }
        .training-meta-item {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.78rem;
          color: #64748B;
          font-weight: 600;
        }
        .training-card-location {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.78rem;
          color: #64748B;
          font-weight: 600;
        }
        .empty-training-state {
          grid-column: span 3;
          text-align: center;
          padding: 5rem 0;
          color: #94A3B8;
          font-size: 0.95rem;
          font-style: italic;
        }

        @media (max-width: 991px) {
          .training-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .empty-training-state {
            grid-column: span 2;
          }
        }
        @media (max-width: 640px) {
          .training-grid {
            grid-template-columns: 1fr;
          }
          .empty-training-state {
            grid-column: span 1;
          }
          .schedule-panel-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        /* Pagination Styles */
        .pagination-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          margin-top: 3rem;
          user-select: none;
        }
        .pagination-arrow-btn {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          color: #475569;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .pagination-arrow-btn:hover:not(:disabled) {
          background: #F1F5F9;
          border-color: #CBD5E1;
          color: #0F172A;
        }
        .pagination-arrow-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .pagination-number-btn {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          color: #475569;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pagination-number-btn:hover {
          background: #F1F5F9;
          border-color: #CBD5E1;
          color: #0F172A;
        }
        .pagination-number-btn.active {
          background: #0B2F61;
          border-color: #0B2F61;
          color: #FFFFFF;
        }
      `}} />
    </div>
  );
}
