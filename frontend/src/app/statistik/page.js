"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { 
  Menu, 
  X,
  Users,
  User,
  Briefcase,
  Award
} from 'lucide-react';

const BACKEND_URL = 'http://localhost:8081';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('/uploads')) {
    return `${BACKEND_URL}${path}`;
  }
  return path;
};

// Data Statistik Dosen
const DATA_DOSEN = [
  { no: 1, fakultas: "Fakultas Kedokteran", pns: 170, tetapNonPns: 125, nidk: 342, total: 637 },
  { no: 2, fakultas: "Fakultas Kedokteran Gigi", pns: 62, tetapNonPns: 33, nidk: 14, total: 109 },
  { no: 3, fakultas: "Fakultas Matematika dan Ilmu Pengetahuan Alam", pns: 129, tetapNonPns: 46, nidk: 2, total: 177 },
  { no: 4, fakultas: "Fakultas Teknik", pns: 158, tetapNonPns: 100, nidk: 6, total: 264 },
  { no: 5, fakultas: "Fakultas Hukum", pns: 51, tetapNonPns: 61, nidk: 3, total: 115 },
  { no: 6, fakultas: "Fakultas Ekonomi dan Bisnis", pns: 93, tetapNonPns: 154, nidk: 11, total: 258 },
  { no: 7, fakultas: "Fakultas Ilmu Pengetahuan Budaya", pns: 87, tetapNonPns: 97, nidk: 0, total: 184 },
  { no: 8, fakultas: "Fakultas Psikologi", pns: 33, tetapNonPns: 46, nidk: 4, total: 83 },
  { no: 9, fakultas: "Fakultas Ilmu Sosial dan Politik", pns: 69, tetapNonPns: 71, nidk: 5, total: 145 },
  { no: 10, fakultas: "Fakultas Kesehatan Masyarakat", pns: 63, tetapNonPns: 19, nidk: 13, total: 95 },
  { no: 11, fakultas: "Fakultas Ilmu Komputer", pns: 37, tetapNonPns: 17, nidk: 2, total: 56 },
  { no: 12, fakultas: "Fakultas Ilmu Keperawatan", pns: 60, tetapNonPns: 8, nidk: 6, total: 74 },
  { no: 13, fakultas: "Program Pendidikan Vokasi", pns: 9, tetapNonPns: 61, nidk: 17, total: 87 },
  { no: 14, fakultas: "Fakultas Farmasi", pns: 31, tetapNonPns: 19, nidk: 2, total: 52 },
  { no: 15, fakultas: "Fakultas Ilmu Administrasi", pns: 28, tetapNonPns: 37, nidk: 8, total: 73 },
  { no: 16, fakultas: "Sekolah Pascasarjana Pembangunan Berkelanjutan", pns: 17, tetapNonPns: 30, nidk: 15, total: 62 }
];

// Data Statistik Tendik
const DATA_TENDIK = [
  { no: 1, unit: "FK", nonPns: 162, pns: 57, total: 219 },
  { no: 2, unit: "FKG", nonPns: 79, pns: 3, total: 82 },
  { no: 3, unit: "FMIPA", nonPns: 62, pns: 18, total: 80 },
  { no: 4, unit: "FT", nonPns: 101, pns: 19, total: 120 },
  { no: 5, unit: "FH", nonPns: 88, pns: 2, total: 90 },
  { no: 6, unit: "FEB", nonPns: 208, pns: 14, total: 222 },
  { no: 7, unit: "FIB", nonPns: 75, pns: 5, total: 80 },
  { no: 8, unit: "FPsi", nonPns: 52, pns: 0, total: 52 },
  { no: 9, unit: "FISIP", nonPns: 90, pns: 2, total: 92 },
  { no: 10, unit: "FKM", nonPns: 49, pns: 31, total: 80 },
  { no: 11, unit: "FASILKOM", nonPns: 34, pns: 3, total: 37 },
  { no: 12, unit: "FIK", nonPns: 31, pns: 4, total: 35 },
  { no: 13, unit: "PAU", nonPns: 587, pns: 117, total: 704 },
  { no: 14, unit: "VOKASI", nonPns: 54, pns: 5, total: 59 },
  { no: 15, unit: "FF", nonPns: 28, pns: 0, total: 28 },
  { no: 16, unit: "FIA", nonPns: 26, pns: 0, total: 26 },
  { no: 17, unit: "SPPB", nonPns: 18, pns: 16, total: 34 },
  { no: 18, unit: "RIK", nonPns: 21, pns: 3, total: 24 }
];

export default function Statistik() {
  const [activeTab, setActiveTab] = useState('dosen'); // 'dosen' or 'tendik'
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
            <h1 className="subpage-hero-title">
              {activeTab === 'dosen' ? 'Statistik Dosen' : 'Tenaga Kependidikan'}
            </h1>
          </div>
        </section>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main style={{ padding: '3rem 0' }}>
        <div className="container">
          
          {/* Sub Navigation Tabs */}
          <div className="statistik-tabs">
            <button
              onClick={() => setActiveTab('dosen')}
              className={`statistik-tab ${activeTab === 'dosen' ? 'active' : ''}`}
            >
              Dosen
            </button>
            <button
              onClick={() => setActiveTab('tendik')}
              className={`statistik-tab ${activeTab === 'tendik' ? 'active' : ''}`}
            >
              Tenaga Kependidikan
            </button>
          </div>

          {/* ── TAB CONTENT: DOSEN ── */}
          {activeTab === 'dosen' && (
            <div>
              {/* Cards Section */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ backgroundColor: '#0A1E38', color: '#ffffff', borderRadius: '8px', padding: '1.5rem', borderTop: '4px solid #F2C94C', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: '0.8', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                    <Users size={16} /> Total Dosen
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800' }}>2.471</div>
                </div>

                <div style={{ backgroundColor: '#ffffff', color: '#0C1A30', borderRadius: '8px', padding: '1.5rem', borderTop: '4px solid #0A1E38', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#576574', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                    <User size={16} /> Dosen PNS
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0C1A30' }}>1.097</div>
                </div>

                <div style={{ backgroundColor: '#ffffff', color: '#0C1A30', borderRadius: '8px', padding: '1.5rem', borderTop: '4px solid #0A1E38', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#576574', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                    <Briefcase size={16} /> Dosen Tetap Non PNS
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0C1A30' }}>824</div>
                </div>

                <div style={{ backgroundColor: '#ffffff', color: '#0C1A30', borderRadius: '8px', padding: '1.5rem', borderTop: '4px solid #0A1E38', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#576574', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                    <Award size={16} /> Dosen NIDK
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0C1A30' }}>450</div>
                </div>
              </div>

              {/* Table Section */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#0A1E38', color: '#ffffff', fontWeight: 'bold' }}>
                      <th style={{ padding: '1.2rem 1.5rem' }}>No</th>
                      <th style={{ padding: '1.2rem 1.5rem' }}>Nama Fakultas</th>
                      <th style={{ padding: '1.2rem 1.5rem', textAlign: 'center' }}>Dosen PNS</th>
                      <th style={{ padding: '1.2rem 1.5rem', textAlign: 'center' }}>Dosen Tetap Non PNS</th>
                      <th style={{ padding: '1.2rem 1.5rem', textAlign: 'center' }}>Dosen NIDK</th>
                      <th style={{ padding: '1.2rem 1.5rem', textAlign: 'center' }}>Total Dosen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DATA_DOSEN.map((row, index) => (
                      <tr key={row.no} style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F8FAFC' }}>
                        <td style={{ padding: '1.1rem 1.5rem', textAlign: 'center', color: '#576574' }}>{row.no}</td>
                        <td style={{ padding: '1.1rem 1.5rem', fontWeight: '600', color: '#0C1A30' }}>{row.fakultas}</td>
                        <td style={{ padding: '1.1rem 1.5rem', textAlign: 'center', color: '#2C3A47' }}>{row.pns.toLocaleString('id-ID')}</td>
                        <td style={{ padding: '1.1rem 1.5rem', textAlign: 'center', color: '#2C3A47' }}>{row.tetapNonPns.toLocaleString('id-ID')}</td>
                        <td style={{ padding: '1.1rem 1.5rem', textAlign: 'center', color: '#2C3A47' }}>{row.nidk.toLocaleString('id-ID')}</td>
                        <td style={{ padding: '1.1rem 1.5rem', textAlign: 'center', fontWeight: 'bold', color: '#0C1A30' }}>{row.total.toLocaleString('id-ID')}</td>
                      </tr>
                    ))}
                    {/* Grand Total Row */}
                    <tr style={{ backgroundColor: '#F2C94C', color: '#0A1E38', fontWeight: '800', fontSize: '1rem' }}>
                      <td colSpan="2" style={{ padding: '1.2rem 1.5rem' }}>Grand Total</td>
                      <td style={{ padding: '1.2rem 1.5rem', textAlign: 'center' }}>1.097</td>
                      <td style={{ padding: '1.2rem 1.5rem', textAlign: 'center' }}>824</td>
                      <td style={{ padding: '1.2rem 1.5rem', textAlign: 'center' }}>450</td>
                      <td style={{ padding: '1.2rem 1.5rem', textAlign: 'center' }}>2.471</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#576574', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span role="img" aria-label="clock">🕒</span> Terakhir diperbarui: Februari 2025
              </div>
            </div>
          )}

          {/* ── TAB CONTENT: TENDIK ── */}
          {activeTab === 'tendik' && (
            <div>
              {/* Cards Section */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ backgroundColor: '#0A1E38', color: '#ffffff', borderRadius: '8px', padding: '1.5rem', borderTop: '4px solid #F2C94C', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: '0.8', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                    <Users size={16} /> Total Tendik
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800' }}>2.064</div>
                </div>

                <div style={{ backgroundColor: '#ffffff', color: '#0C1A30', borderRadius: '8px', padding: '1.5rem', borderTop: '4px solid #0A1E38', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#576574', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                    <User size={16} /> Pegawai PNS
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0C1A30' }}>299</div>
                </div>

                <div style={{ backgroundColor: '#ffffff', color: '#0C1A30', borderRadius: '8px', padding: '1.5rem', borderTop: '4px solid #0A1E38', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#576574', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                    <Briefcase size={16} /> Pegawai Non-PNS
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0C1A30' }}>1.765</div>
                </div>
              </div>

              {/* Table Section */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#0A1E38', color: '#ffffff', fontWeight: 'bold' }}>
                      <th style={{ padding: '1.2rem 1.5rem' }}>No</th>
                      <th style={{ padding: '1.2rem 1.5rem' }}>Unit Kerja</th>
                      <th style={{ padding: '1.2rem 1.5rem', textAlign: 'center' }}>Non PNS</th>
                      <th style={{ padding: '1.2rem 1.5rem', textAlign: 'center' }}>PNS</th>
                      <th style={{ padding: '1.2rem 1.5rem', textAlign: 'center' }}>Grand Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DATA_TENDIK.map((row, index) => (
                      <tr key={row.no} style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F8FAFC' }}>
                        <td style={{ padding: '1.1rem 1.5rem', textAlign: 'center', color: '#576574' }}>{row.no}</td>
                        <td style={{ padding: '1.1rem 1.5rem', fontWeight: '600', color: '#0C1A30' }}>{row.unit}</td>
                        <td style={{ padding: '1.1rem 1.5rem', textAlign: 'center', color: '#2C3A47' }}>{row.nonPns.toLocaleString('id-ID')}</td>
                        <td style={{ padding: '1.1rem 1.5rem', textAlign: 'center', color: '#2C3A47' }}>{row.pns.toLocaleString('id-ID')}</td>
                        <td style={{ padding: '1.1rem 1.5rem', textAlign: 'center', fontWeight: 'bold', color: '#0C1A30' }}>{row.total.toLocaleString('id-ID')}</td>
                      </tr>
                    ))}
                    {/* Grand Total Row */}
                    <tr style={{ backgroundColor: '#F2C94C', color: '#0A1E38', fontWeight: '800', fontSize: '1rem' }}>
                      <td colSpan="2" style={{ padding: '1.2rem 1.5rem' }}>Grand Total</td>
                      <td style={{ padding: '1.2rem 1.5rem', textAlign: 'center' }}>1.765</td>
                      <td style={{ padding: '1.2rem 1.5rem', textAlign: 'center' }}>299</td>
                      <td style={{ padding: '1.2rem 1.5rem', textAlign: 'center' }}>2.064</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#576574', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span role="img" aria-label="clock">🕒</span> Terakhir diperbarui: April 2026
              </div>
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

      <style>{`
        .statistik-tabs {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
          justify-content: center;
        }
        .statistik-tab {
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
        .statistik-tab.active {
          background: #E0ECFB;
          color: #0A1E38;
          border-color: #A0C3F7;
        }
        .statistik-tab:hover:not(.active) {
          border-color: #0A1E38;
          color: #0A1E38;
        }
        table th, table td {
          border: 1px solid #E2E8F0;
        }
      `}</style>
    </div>
  );
}

