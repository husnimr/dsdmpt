"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { 
  Menu, 
  X,
  Calendar,
  Clock,
  MapPin,
  Phone,
  FileText,
  CheckCircle2,
  Download
} from 'lucide-react';

const BACKEND_URL = 'http://localhost:8081';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('/uploads')) {
    return `${BACKEND_URL}${path}`;
  }
  return path;
};

const PROGRAMS = [
  {
    id: 1,
    title: "Pelatihan Kepemimpinan Universitas",
    organizer: "DSDMPT Universitas Indonesia",
    date: "15 Maret 2026",
    time: "08:00 - 16:00 WIB",
    location: "Gedung Rektorat Lt. 5",
    image: "/uploads/talent_1.jpg",
    type: "internal",
    agenda: [
      { time: "08:00 - 10:00", activity: "Sesi 1: Dasar Kepemimpinan Strategis di Lingkungan UI" },
      { time: "10:30 - 12:30", activity: "Sesi 2: Workshop Tata Kelola Talenta DSDMPT" },
      { time: "13:30 - 15:30", activity: "Sesi 3: Panel Diskusi Strategi Pengembangan Karier" },
      { time: "15:30 - 16:00", activity: "Penutup & Networking" }
    ]
  },
  {
    id: 2,
    title: "Pengembangan Kompetensi Pedagogik",
    organizer: "Direktorat Pendidikan",
    date: "22 April 2026",
    time: "08:30 - 15:30 WIB",
    location: "Auditorium",
    image: "/uploads/talent_2.jpg",
    type: "internal",
    agenda: [
      { time: "08:30 - 10:30", activity: "Sesi 1: Pengantar Metode Pembelajaran Interaktif" },
      { time: "11:00 - 13:00", activity: "Sesi 2: Penyusunan Kurikulum Berbasis OBE" },
      { time: "14:00 - 15:30", activity: "Sesi 3: Praktik & Evaluasi Pedagogik" }
    ]
  },
  {
    id: 3,
    title: "Manajemen Karir Tendik",
    organizer: "Pusat Sistem Informasi",
    date: "22 Juni 2026",
    time: "09:00 - 15:00 WIB",
    location: "Lab Komputer Terpadu",
    image: "/uploads/talent_3.jpg",
    type: "internal",
    agenda: [
      { time: "09:00 - 11:00", activity: "Sesi 1: Perencanaan Karir Staf Kependidikan" },
      { time: "11:30 - 13:30", activity: "Sesi 2: Sertifikasi & Portofolio Profesional" },
      { time: "14:00 - 15:00", activity: "Sesi 3: Tanya Jawab Jalur Fungsional" }
    ]
  },
  {
    id: 4,
    title: "Sertifikasi Kompetensi Global",
    organizer: "DSDMPT Universitas Indonesia",
    date: "12 Juli 2026",
    time: "08:00 - 17:00 WIB",
    location: "Ruang Rapat Utama",
    image: "/uploads/talent_4.jpg",
    type: "public",
    agenda: [
      { time: "08:00 - 10:00", activity: "Sesi 1: Standarisasi Sertifikasi Global" },
      { time: "10:30 - 12:30", activity: "Sesi 2: Pembahasan Ujian & Persiapan" },
      { time: "13:30 - 16:30", activity: "Sesi 3: Simulasi Ujian Sertifikasi" },
      { time: "16:30 - 17:00", activity: "Penutup & Pengumuman Hasil" }
    ]
  },
  {
    id: 5,
    title: "Literasi Digital Administrasi",
    organizer: "Biro Komunikasi",
    date: "18 Agustus 2026",
    time: "08:00 - 15:00 WIB",
    location: "Gedung IASTH Lt.3",
    image: "/uploads/talent_2.jpg",
    type: "public",
    agenda: [
      { time: "08:00 - 10:00", activity: "Sesi 1: Keamanan Informasi Administrasi" },
      { time: "10:30 - 12:30", activity: "Sesi 2: Otomasi Dokumen & Surat Digital" },
      { time: "13:30 - 15:00", activity: "Sesi 3: Kolaborasi Cloud dalam Tim Kerja" }
    ]
  },
  {
    id: 6,
    title: "Pelatihan Komunikasi Efektif",
    organizer: "DSDMPT Universitas Indonesia",
    date: "18 Agustus 2026",
    time: "09:00 - 16:00 WIB",
    location: "Balai Sidang UI",
    image: "/uploads/talent_1.jpg",
    type: "public",
    agenda: [
      { time: "09:00 - 11:00", activity: "Sesi 1: Teknik Komunikasi Asertif" },
      { time: "11:30 - 13:30", activity: "Sesi 2: Public Speaking & Presentasi Efektif" },
      { time: "14:30 - 16:00", activity: "Sesi 3: Manajemen Konflik & Komunikasi Tim" }
    ]
  }
];

const slugify = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export default function DetailTalentaPage() {
  const { id } = useParams();
  const [program, setProgram] = useState(null);
  const [settings, setSettings] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`${BACKEND_URL}/api/pengembangan-talenta/${id}`)
        .then(res => {
          if (!res.ok) throw new Error('Program tidak ditemukan');
          return res.json();
        })
        .then(data => {
          setProgram(data || null);
        })
        .catch(err => {
          console.error(err);
          setProgram(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', backgroundColor: '#FFFFFF' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #0A1E38', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ marginTop: '1.5rem', fontFamily: 'Outfit, sans-serif', fontWeight: 600, color: '#0A1E38' }}>Memuat Detail Program...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!program) {
    return (
      <div style={{ padding: '8rem 2rem', textAlign: 'center', minHeight: '60vh' }}>
        <h2>Program tidak ditemukan</h2>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: 'var(--text-main)', backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      
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
          
          <div className="detail-grid-layout">
            
            {/* Left Column: Details */}
            <div className="detail-main-col">
              <h2 className="program-detail-title">{program.title}</h2>
              
              {program.description ? (
                <div className="program-desc-wrapper" style={{ whiteSpace: 'pre-wrap', color: '#475569', fontSize: '1.02rem', lineHeight: '1.7', marginBottom: '2rem' }}>
                  {program.description}
                </div>
              ) : (
                <>
                  <p className="program-desc">
                    Program pengembangan talenta ini dikelola secara profesional oleh Direktorat Sumber Daya Manusia dan Pengembangan Talenta (DSDMPT) UI. Dirancang khusus untuk civitas akademika dan tenaga kependidikan guna meningkatkan kapasitas kepemimpinan strategis dalam ekosistem universitas yang dinamis.
                  </p>
                  <p className="program-desc">
                    Materi difokuskan pada manajemen perubahan, tata kelola modern perguruan tinggi, serta pengembangan budaya kerja kolaboratif. Peserta akan mendapatkan wawasan mendalam dari praktisi dan pakar terbaik di lingkungan Universitas Indonesia.
                  </p>
                </>
              )}

              {/* Jadwal Pelaksanaan */}
              <div className="schedule-section">
                <h3 className="section-subtitle">Jadwal Pelaksanaan</h3>
                <div className="schedule-cards">
                  <div className="schedule-card">
                    <div className="icon-box-calendar">
                      <Calendar size={22} />
                    </div>
                    <div>
                      <span className="schedule-label">Tanggal</span>
                      <strong className="schedule-value">
                        {(() => {
                          const dateStr = program.date;
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
                      </strong>
                    </div>
                  </div>
                  <div className="schedule-card">
                    <div className="icon-box-clock">
                      <Clock size={22} />
                    </div>
                    <div>
                      <span className="schedule-label">Waktu</span>
                      <strong className="schedule-value">{program.time}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agenda */}
              <div className="agenda-section">
                <div className="agenda-box">
                  <h4 className="agenda-title">Agenda :</h4>
                  <div className="agenda-list">
                    {(() => {
                      let agendaList = [];
                      if (program.agenda) {
                        if (Array.isArray(program.agenda)) {
                          agendaList = program.agenda;
                        } else {
                          try {
                            agendaList = JSON.parse(program.agenda);
                          } catch (e) {}
                        }
                      }
                      if (!agendaList || agendaList.length === 0) {
                        return <p style={{ fontSize: '0.88rem', color: '#94A3B8', fontStyle: 'italic', padding: '0.5rem 1rem' }}>Tidak ada agenda khusus untuk program ini.</p>;
                      }
                      return agendaList.map((item, idx) => (
                        <div key={idx} className="agenda-row">
                          <span className="agenda-activity">{item.activity}</span>
                          <span className="agenda-time">{item.time}</span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Registration Sidebar */}
            <div className="detail-side-col">
              <div className="registration-card">
                <h3 className="reg-title">Pendaftaran Training</h3>
                
                {(() => {
                  const link = program.registration_link;
                  if (!link) {
                    return (
                      <button className="reg-btn-primary" onClick={() => alert('Pendaftaran belum dibuka atau silakan hubungi admin.')}>
                        Daftar Sekarang
                      </button>
                    );
                  }
                  const clean = link.trim();
                  let target = clean;
                  if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
                    const digitsOnly = clean.replace(/[^0-9+]/g, '');
                    if (digitsOnly.length > 5) {
                      let phone = digitsOnly;
                      if (phone.startsWith('0')) {
                        phone = '62' + phone.substring(1);
                      }
                      target = `https://wa.me/${phone}`;
                    }
                  }
                  return (
                    <a 
                      className="reg-btn-primary" 
                      href={target} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none', display: 'block', textAlign: 'center', boxSizing: 'border-box' }}
                    >
                      Daftar Sekarang
                    </a>
                  );
                })()}
                
                {program.syllabus_url && (
                  <a 
                    className="reg-btn-secondary" 
                    href={getImageUrl(program.syllabus_url)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxSizing: 'border-box', marginTop: '0.75rem' }}
                  >
                    <Download size={16} /> Unduh Silabus Program
                  </a>
                )}
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />

      <style>{`
        .detail-grid-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2.5rem;
        }
        .detail-main-col {
          display: flex;
          flex-direction: column;
        }
        .program-detail-title {
          font-size: 2rem;
          font-weight: 800;
          color: #0A1E38;
          line-height: 1.25;
          margin-bottom: 1.5rem;
        }
        .program-desc {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #576574;
          margin-bottom: 1.25rem;
          text-align: justify;
        }
        .checklist-container {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin: 1rem 0 2rem 0;
        }
        .checklist-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.92rem;
          color: #2C3A47;
          font-weight: 500;
        }
        .check-icon {
          color: #F2C94C;
          flex-shrink: 0;
        }
        .section-subtitle {
          font-size: 1.4rem;
          color: #0A1E38;
          margin-bottom: 1.25rem;
          font-weight: 800;
        }
        .schedule-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
          margin-bottom: 2rem;
        }
        .schedule-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-left: 4px solid #0A1E38;
          border-radius: 12px;
        }
        .icon-box-calendar {
          width: 44px; height: 44px;
          border-radius: 8px;
          background-color: #FEF9E7;
          color: #F2C94C;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .icon-box-clock {
          width: 44px; height: 44px;
          border-radius: 8px;
          background-color: #E2ECFC;
          color: #2F80ED;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .schedule-label {
          display: block;
          font-size: 0.78rem;
          color: #64748B;
          font-weight: 600;
          margin-bottom: 0.15rem;
        }
        .schedule-value {
          font-size: 0.95rem;
          color: #0A1E38;
          font-weight: 700;
        }
        .agenda-section {
          margin-top: 1rem;
        }
        .agenda-box {
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.5rem;
          background-color: #F8FAFC;
        }
        .agenda-title {
          font-size: 0.95rem;
          font-weight: 800;
          color: #0A1E38;
          margin-bottom: 1.25rem;
        }
        .agenda-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .agenda-row {
          display: flex;
          justify-content: space-between;
          padding-bottom: 0.85rem;
          border-bottom: 1px solid #E2E8F0;
          font-size: 0.88rem;
        }
        .agenda-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .agenda-activity {
          color: #334155;
          font-weight: 600;
        }
        .agenda-time {
          color: #0A1E38;
          font-weight: 700;
          flex-shrink: 0;
          margin-left: 1rem;
        }

        /* Side Column styles */
        .registration-card {
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 2rem;
          background-color: #FFFFFF;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          position: sticky;
          top: 92px;
        }
        .reg-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: #0A1E38;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .reg-btn-primary {
          width: 100%;
          padding: 0.85rem;
          background-color: #0A1E38;
          color: #ffffff;
          font-weight: 700;
          font-size: 0.9rem;
          border-radius: 8px;
          margin-bottom: 0.85rem;
          text-align: center;
          box-shadow: var(--shadow-sm);
        }
        .reg-btn-primary:hover {
          background-color: #1E3A5F;
        }
        .reg-btn-secondary {
          width: 100%;
          padding: 0.85rem;
          background-color: #ffffff;
          border: 1.5px solid #0A1E38;
          color: #0A1E38;
          font-weight: 700;
          font-size: 0.9rem;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .reg-btn-secondary:hover {
          background-color: #F8FAFC;
        }
        .reg-divider {
          border: 0;
          height: 1px;
          background-color: #E2E8F0;
          margin: 1.5rem 0;
        }
        .contact-title {
          font-size: 0.95rem;
          font-weight: 800;
          color: #0A1E38;
          margin-bottom: 1rem;
        }
        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .contact-item {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }
        .contact-icon {
          color: #0A1E38;
          flex-shrink: 0;
          margin-top: 0.15rem;
        }
        .contact-text {
          font-size: 0.82rem;
          color: #576574;
          line-height: 1.45;
          font-weight: 500;
        }

        @media (max-width: 992px) {
          .detail-grid-layout {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .registration-card {
            position: static;
          }
        }
      `}</style>
    </div>
  );
}
