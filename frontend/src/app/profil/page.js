"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import {
  GraduationCap,
  UserPlus,
  Award,
  Wallet,
  FlaskConical,
  FileText,
  TrendingUp,
  Menu
} from 'lucide-react';

const BACKEND_URL = 'http://localhost:8081';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('/uploads')) return `${BACKEND_URL}${path}`;
  return path;
};

// Program Kerja mock data matching screenshot exactly
const PROGRAM_KERJA = [
  {
    title: "Pengembangan Kapasitas",
    description: "Melakukan pelatihan berkala untuk membangun kapasitas dan komitmen dosen serta tenaga kependidikan secara berkelanjutan.",
    icon: <GraduationCap size={22} />
  },
  {
    title: "Akuisisi Talenta",
    description: "Mengundang profesional dengan talenta terbaik dari berbagai bidang untuk bergabung dan berkarya di Universitas Indonesia.",
    icon: <UserPlus size={22} />
  },
  {
    title: "Merit System",
    description: "Mengupayakan penerapan sistem merit yang objektif dalam proses rekrutmen dan manajemen talenta di lingkungan UI.",
    icon: <Award size={22} />
  },
  {
    title: "Optimasi Insentif",
    description: "Menyempurnakan kebijakan insentif untuk mendorong produktivitas dan kesejahteraan civitas akademika.",
    icon: <Wallet size={22} />
  },
  {
    title: "Jabatan Peneliti",
    description: "Menciptakan dan mengelola jabatan fungsional peneliti guna memperkuat ekosistem riset di universitas.",
    icon: <FlaskConical size={22} />
  },
  {
    title: "Publikasi Bereputasi",
    description: "Meningkatkan kemampuan peneliti dalam menghasilkan publikasi berkualitas pada jurnal internasional bereputasi.",
    icon: <FileText size={22} />
  },
  {
    title: "Dosen Berkualitas",
    description: "Meningkatkan jumlah dosen dengan kualifikasi unggul melalui program sertifikasi dan pengembangan berkelanjutan.",
    icon: <Award size={22} />
  },
  {
    title: "Percepatan Karier",
    description: "Mendorong percepatan kenaikan jabatan fungsional akademik, mulai dari Lektor hingga pencapaian Guru Besar.",
    icon: <TrendingUp size={22} />
  }
];

export default function ProfilPage() {
  const [activeTab, setActiveTab] = useState('profil');
  const [settings, setSettings] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
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
    <div>
      <Navbar />

      {/* ── HERO BANNER ── */}
      <div className="subpage-hero-wrapper">
        <section
          className="subpage-hero"
          style={{ backgroundImage: `url(${getImageUrl(settings.hero_image)})` }}
        >
          <div className="subpage-hero-overlay" />
          <div className="subpage-hero-content">
            <h1 className="subpage-hero-title">
              {activeTab === 'profil' ? 'Profil' : 'Struktur Organisasi DSDMPT'}
            </h1>
          </div>
        </section>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="profil-main">
        <div className="container">
          
          {/* Tabs */}
          <div className="profil-tabs" style={{ marginBottom: '3rem' }}>
            <button
              className={`profil-tab ${activeTab === 'profil' ? 'active' : ''}`}
              onClick={() => setActiveTab('profil')}
            >
              Profil
            </button>
            <button
              className={`profil-tab ${activeTab === 'struktur' ? 'active' : ''}`}
              onClick={() => setActiveTab('struktur')}
            >
              Struktur Organisasi
            </button>
          </div>

          {activeTab === 'profil' && (
            <>
              {/* Profile Details (Description + Image) */}
              <div className="profil-intro-grid" style={{ marginBottom: '4rem' }}>
                <div className="profil-intro-img-wrap">
                  <img src={getImageUrl('/uploads/profile_group.jpg')} alt="DSDMPT UI Staff" className="profil-intro-img" />
                </div>
                <div className="profil-intro-content">
                  <p className="profil-text-normal">
                    <strong>Direktorat SDM dan Pengembangan Talenta</strong> adalah salah satu Direktorat yang dibawahi oleh Wakil Rektor bidang Perencanaan, Keuangan, dan SDM. Menjadikan UI sebagai Pusat Talenta terbaik merupakan sasaran strategis yang diamanahkan kepada Direktorat SDM dan Pengembangan Talenta sebagaimana tertuang dalam Rencana Strategis (Renstra) Universitas Indonesia tahun 2024-2029.
                  </p>
                  <p className="profil-text-normal">
                    Direktorat SDM dan Pengembangan Talenta terus memodernisasi sistem TI untuk meningkatkan kecepatan dan akurasi layanan. Langkah ini dilakukan agar Direktorat dapat berfokus penuh pada perencanaan serta pengembangan yang bersifat strategis.
                  </p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'struktur' && (
            <div className="struktur-organisasi-container" style={{ padding: '1rem 0 4rem 0' }}>
              
              {/* Top Leader Card (Direktur) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                <div style={{ 
                  backgroundColor: '#ffffff', 
                  borderRadius: '12px', 
                  border: '1px solid #E2E8F0', 
                  borderLeft: '5px solid #F2C94C', 
                  padding: '1.25rem 2rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                  boxShadow: 'var(--shadow-md)',
                  maxWidth: '450px',
                  width: '100%',
                  zIndex: 2
                }}>
                  <div style={{ width: '42px', height: '50px', borderRadius: '50%', backgroundColor: '#FEF9E7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F2C94C', flexShrink: 0 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#0A1E38', fontWeight: '800', lineHeight: '1.3' }}>Direktur SDM</h4>
                    <p style={{ margin: 0, fontSize: '1.05rem', color: '#0A1E38', fontWeight: '800', lineHeight: '1.3' }}>dan Pengembangan Talenta</p>
                  </div>
                </div>
              </div>
              
              {/* Vertical connector line directly between Direktur and Columns */}
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <div style={{ width: '2px', height: '40px', backgroundColor: '#CBD5E1', zIndex: 1 }} />
              </div>

              {/* Sub-Directorate Columns Connected by tree structure */}
              <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                
                {/* Horizontal line: Spans exactly from center of column 1 (12.5%) to center of column 4 (87.5%) */}
                <div style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: '12.5%', 
                  right: '12.5%', 
                  height: '2px', 
                  backgroundColor: '#CBD5E1',
                  zIndex: 1
                }} />

                {/* 4 Columns Container (using flexbox with 25% width and padding for perfect percentage alignment) */}
                <div style={{ display: 'flex', width: '100%', boxSizing: 'border-box' }}>
                  
                  {/* Column 1 */}
                  <div style={{ width: '25%', padding: '0 0.75rem', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                    {/* Vertical line from horizontal line to card */}
                    <div style={{ width: '2px', height: '20px', backgroundColor: '#CBD5E1', zIndex: 1 }} />
                    
                    <div style={{ 
                      backgroundColor: '#ffffff', 
                      borderRadius: '8px', 
                      border: '1px solid #E2E8F0', 
                      borderLeft: '4px solid #0A1E38', 
                      padding: '1.25rem 1rem', 
                      boxShadow: 'var(--shadow-sm)',
                      width: '100%',
                      minHeight: '85px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      zIndex: 2
                    }}>
                      <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.8rem', color: '#576574', fontWeight: '800' }}>Sub Direktorat</h5>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.4' }}>Layanan, Pembinaan, dan Karier SDM</p>
                    </div>

                    <div style={{ width: '2px', height: '24px', backgroundColor: '#CBD5E1', zIndex: 1 }} />

                    <div style={{ 
                      backgroundColor: '#ffffff', 
                      borderRadius: '6px', 
                      border: '1px solid #E2E8F0', 
                      borderLeft: '3px solid #0A1E38', 
                      padding: '0.85rem 1rem', 
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      width: '100%',
                      minHeight: '52px',
                      display: 'flex',
                      alignItems: 'center',
                      zIndex: 2
                    }}>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.3' }}>Seksi Karir Jabatan Fungsional Dosen</p>
                    </div>

                    <div style={{ width: '2px', height: '24px', backgroundColor: '#CBD5E1', zIndex: 1 }} />

                    <div style={{ 
                      backgroundColor: '#ffffff', 
                      borderRadius: '6px', 
                      border: '1px solid #E2E8F0', 
                      borderLeft: '3px solid #0A1E38', 
                      padding: '0.85rem 1rem', 
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      width: '100%',
                      minHeight: '52px',
                      display: 'flex',
                      alignItems: 'center',
                      zIndex: 2
                    }}>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.3' }}>Seksi Karir Tenaga Kependidikan</p>
                    </div>

                    <div style={{ width: '2px', height: '24px', backgroundColor: '#CBD5E1', zIndex: 1 }} />

                    <div style={{ 
                      backgroundColor: '#ffffff', 
                      borderRadius: '6px', 
                      border: '1px solid #E2E8F0', 
                      borderLeft: '3px solid #0A1E38', 
                      padding: '0.85rem 1rem', 
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      width: '100%',
                      minHeight: '52px',
                      display: 'flex',
                      alignItems: 'center',
                      zIndex: 2
                    }}>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.3' }}>Seksi Layanan dan Pembinaan SDM</p>
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div style={{ width: '25%', padding: '0 0.75rem', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                    <div style={{ width: '2px', height: '20px', backgroundColor: '#CBD5E1', zIndex: 1 }} />
                    
                    <div style={{ 
                      backgroundColor: '#ffffff', 
                      borderRadius: '8px', 
                      border: '1px solid #E2E8F0', 
                      borderLeft: '4px solid #27AE60', 
                      padding: '1.25rem 1rem', 
                      boxShadow: 'var(--shadow-sm)',
                      width: '100%',
                      minHeight: '85px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      zIndex: 2
                    }}>
                      <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.8rem', color: '#576574', fontWeight: '800' }}>Sub Direktorat</h5>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.4' }}>Pengembangan Organisasi Tata Laksana dan Sistem SDM</p>
                    </div>

                    <div style={{ width: '2px', height: '24px', backgroundColor: '#CBD5E1', zIndex: 1 }} />

                    <div style={{ 
                      backgroundColor: '#ffffff', 
                      borderRadius: '6px', 
                      border: '1px solid #E2E8F0', 
                      borderLeft: '3px solid #27AE60', 
                      padding: '0.85rem 1rem', 
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      width: '100%',
                      minHeight: '52px',
                      display: 'flex',
                      alignItems: 'center',
                      zIndex: 2
                    }}>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.3' }}>Seksi Organisasi dan Tata Laksana</p>
                    </div>

                    <div style={{ width: '2px', height: '24px', backgroundColor: '#CBD5E1', zIndex: 1 }} />

                    <div style={{ 
                      backgroundColor: '#ffffff', 
                      borderRadius: '6px', 
                      border: '1px solid #E2E8F0', 
                      borderLeft: '3px solid #27AE60', 
                      padding: '0.85rem 1rem', 
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      width: '100%',
                      minHeight: '52px',
                      display: 'flex',
                      alignItems: 'center',
                      zIndex: 2
                    }}>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.3' }}>Seksi Pengembangan Sistem SDM</p>
                    </div>

                    <div style={{ width: '2px', height: '24px', backgroundColor: '#CBD5E1', zIndex: 1 }} />

                    <div style={{ 
                      backgroundColor: '#ffffff', 
                      borderRadius: '6px', 
                      border: '1px solid #E2E8F0', 
                      borderLeft: '3px solid #27AE60', 
                      padding: '0.85rem 1rem', 
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      width: '100%',
                      minHeight: '52px',
                      display: 'flex',
                      alignItems: 'center',
                      zIndex: 2
                    }}>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.3' }}>Seksi Perencanaan dan Evaluasi Organisasi</p>
                    </div>
                  </div>

                  {/* Column 3 */}
                  <div style={{ width: '25%', padding: '0 0.75rem', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                    <div style={{ width: '2px', height: '20px', backgroundColor: '#CBD5E1', zIndex: 1 }} />
                    
                    <div style={{ 
                      backgroundColor: '#ffffff', 
                      borderRadius: '8px', 
                      border: '1px solid #E2E8F0', 
                      borderLeft: '4px solid #C0392B', 
                      padding: '1.25rem 1rem', 
                      boxShadow: 'var(--shadow-sm)',
                      width: '100%',
                      minHeight: '85px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      zIndex: 2
                    }}>
                      <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.8rem', color: '#576574', fontWeight: '800' }}>Sub Direktorat</h5>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.4' }}>Perencanaan, Penempatan, Pengembangan SDM</p>
                    </div>

                    <div style={{ width: '2px', height: '24px', backgroundColor: '#CBD5E1', zIndex: 1 }} />

                    <div style={{ 
                      backgroundColor: '#ffffff', 
                      borderRadius: '6px', 
                      border: '1px solid #E2E8F0', 
                      borderLeft: '3px solid #C0392B', 
                      padding: '0.85rem 1rem', 
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      width: '100%',
                      minHeight: '52px',
                      display: 'flex',
                      alignItems: 'center',
                      zIndex: 2
                    }}>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.3' }}>Seksi Pengembangan Dosen</p>
                    </div>

                    <div style={{ width: '2px', height: '24px', backgroundColor: '#CBD5E1', zIndex: 1 }} />

                    <div style={{ 
                      backgroundColor: '#ffffff', 
                      borderRadius: '6px', 
                      border: '1px solid #E2E8F0', 
                      borderLeft: '3px solid #C0392B', 
                      padding: '0.85rem 1rem', 
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      width: '100%',
                      minHeight: '52px',
                      display: 'flex',
                      alignItems: 'center',
                      zIndex: 2
                    }}>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.3' }}>Seksi Pengembangan Tenaga Kependidikan</p>
                    </div>

                    <div style={{ width: '2px', height: '24px', backgroundColor: '#CBD5E1', zIndex: 1 }} />

                    <div style={{ 
                      backgroundColor: '#ffffff', 
                      borderRadius: '6px', 
                      border: '1px solid #E2E8F0', 
                      borderLeft: '3px solid #C0392B', 
                      padding: '0.85rem 1rem', 
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      width: '100%',
                      minHeight: '52px',
                      display: 'flex',
                      alignItems: 'center',
                      zIndex: 2
                    }}>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.3' }}>Seksi Perencanaan dan Penempatan SDM</p>
                    </div>
                  </div>

                  {/* Column 4 */}
                  <div style={{ width: '25%', padding: '0 0.75rem', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                    <div style={{ width: '2px', height: '20px', backgroundColor: '#CBD5E1', zIndex: 1 }} />
                    
                    <div style={{ 
                      backgroundColor: '#ffffff', 
                      borderRadius: '8px', 
                      border: '1px solid #E2E8F0', 
                      borderLeft: '4px solid #F2C94C', 
                      padding: '1.25rem 1rem', 
                      boxShadow: 'var(--shadow-sm)',
                      width: '100%',
                      minHeight: '85px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      zIndex: 2
                    }}>
                      <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.8rem', color: '#576574', fontWeight: '800' }}>Sub Direktorat</h5>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.4' }}>Remunerasi dan Kesejahteraan</p>
                    </div>

                    <div style={{ width: '2px', height: '24px', backgroundColor: '#CBD5E1', zIndex: 1 }} />

                    <div style={{ 
                      backgroundColor: '#ffffff', 
                      borderRadius: '6px', 
                      border: '1px solid #E2E8F0', 
                      borderLeft: '3px solid #F2C94C', 
                      padding: '0.85rem 1rem', 
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      width: '100%',
                      minHeight: '52px',
                      display: 'flex',
                      alignItems: 'center',
                      zIndex: 2
                    }}>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.3' }}>Seksi Remunerasi dan Kesejahteraan 3 (Payroll)</p>
                    </div>

                    <div style={{ width: '2px', height: '24px', backgroundColor: '#CBD5E1', zIndex: 1 }} />

                    <div style={{ 
                      backgroundColor: '#ffffff', 
                      borderRadius: '6px', 
                      border: '1px solid #E2E8F0', 
                      borderLeft: '3px solid #F2C94C', 
                      padding: '0.85rem 1rem', 
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      width: '100%',
                      minHeight: '52px',
                      display: 'flex',
                      alignItems: 'center',
                      zIndex: 2
                    }}>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.3' }}>Seksi Remunerasi dan Kesejahteraan 1 (Dana Dipa)</p>
                    </div>

                    <div style={{ width: '2px', height: '24px', backgroundColor: '#CBD5E1', zIndex: 1 }} />

                    <div style={{ 
                      backgroundColor: '#ffffff', 
                      borderRadius: '6px', 
                      border: '1px solid #E2E8F0', 
                      borderLeft: '3px solid #F2C94C', 
                      padding: '0.85rem 1rem', 
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      width: '100%',
                      minHeight: '52px',
                      display: 'flex',
                      alignItems: 'center',
                      zIndex: 2
                    }}>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.3' }}>Seksi Remunerasi dan Kesejahteraan 2 (Dana BPPTN dan Damas)</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>

        {/* ── PROGRAM KERJA SECTION ── */}
        {activeTab === 'profil' && (
          <section className="program-kerja-section">
            <div className="container">
              <h2 className="pk-title">Program Kerja</h2>
              <p className="pk-sub">
                Program kerja utama yang diamanatkan dalam rencana strategis universitas guna mendukung sasaran strategis pusat talenta terbaik adalah sebagai berikut
              </p>

              <div className="pk-grid">
                {PROGRAM_KERJA.map((pk, idx) => (
                  <div key={idx} className="pk-card">
                    <div className="pk-icon-wrapper">
                      {pk.icon}
                    </div>
                    <h4 className="pk-card-title">{pk.title}</h4>
                    <p className="pk-card-desc">{pk.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Page specific styles */}
      <style>{`
        /* HERO */
        .profil-hero {
          margin-top: 72px;
          height: 300px;
          position: relative;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .profil-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(10,30,56,0.8) 0%, rgba(10,30,56,0.55) 100%);
          z-index: 1;
        }
        .profil-hero-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #fff;
          z-index: 2;
          position: relative;
          text-align: center;
          width: 100%;
        }

        .profil-tabs {
          display: flex;
          gap: 0.75rem;
          margin-top: 2rem;
          margin-bottom: 2.5rem;
          justify-content: center;
        }
        .profil-tab {
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
        .profil-tab.active {
          background: #E0ECFB;
          color: #0A1E38;
          border-color: #A0C3F7;
        }
        .profil-tab:hover:not(.active) {
          border-color: #0A1E38;
          color: #0A1E38;
        }

        /* INTRO GRID */
        .profil-intro-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 3.5rem;
          align-items: center;
          margin-bottom: 4rem;
        }
        .profil-intro-img-wrap {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.06);
          aspect-ratio: 16/10;
        }
        .profil-intro-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .profil-intro-content {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .profil-text-bold {
          font-size: 0.95rem;
          line-height: 1.75;
          color: #1E293B;
        }
        .profil-text-normal {
          font-size: 0.92rem;
          line-height: 1.75;
          color: #475569;
        }

        /* PROGRAM KERJA SECTION */
        .program-kerja-section {
          background-color: #F8FAFC;
          padding: 4.5rem 0;
          border-top: 1px solid #F1F5F9;
        }
        .pk-title {
          font-size: 2rem;
          font-weight: 800;
          color: #0A1E38;
          text-align: center;
          margin-bottom: 0.75rem;
        }
        .pk-sub {
          max-width: 780px;
          margin: 0 auto 3rem;
          text-align: center;
          color: #64748B;
          font-size: 0.95rem;
          line-height: 1.6;
        }
        .pk-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }
        .pk-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.75rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transition: all 0.25s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .pk-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(10,30,56,0.06);
          border-color: #A0C3F7;
        }
        .pk-icon-wrapper {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          background-color: #F8FAFC;
          color: #0A1E38;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
          border: 1px solid #E2E8F0;
        }
        .pk-card-title {
          font-size: 0.98rem;
          font-weight: 700;
          color: #0A1E38;
          margin-bottom: 0.75rem;
          line-height: 1.35;
        }
        .pk-card-desc {
          font-size: 0.8rem;
          color: #576574;
          line-height: 1.55;
        }

        @media (max-width: 1024px) {
          .pk-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .profil-intro-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .pk-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
