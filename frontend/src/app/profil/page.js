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
  Star,
  Menu
} from 'lucide-react';

const BACKEND_URL = 'http://localhost:8081';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('/uploads')) return `${BACKEND_URL}${path}`;
  return path;
};

// Lucide Icon Map for Program Kerja
const IconComponents = {
  GraduationCap,
  UserPlus,
  Award,
  Wallet,
  FlaskConical,
  FileText,
  Star,
  TrendingUp
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


// Data Pimpinan Direktorat matching structure exactly
const PIMPINAN_DATA = {
  director: {
    name: "Dr.Eng.Ir. Muhammad Arif Budiyanto, S.T., M.T. IPM",
    role: "DIREKTUR SDM DAN PENGEMBANGAN TALENTA",
    image: "/uploads/pimpinan_0.png"
  },
  subdirectorates: [
    {
      id: 1,
      kasubdit: {
        name: "Agus Anang, S.Kom., M.T.I., CHRS.",
        role: "KASUBDIT LAYANAN, PEMBINAAN, DAN KARIER SDM",
        image: "/uploads/pimpinan_4.png"
      },
      kasie: [
        {
          name: "Faisal Ali Ramdhani, S.Kom., CPS.",
          role: "KASIE JABATAN FUNGSIONAL DOSEN",
          image: "/uploads/pimpinan_5.png"
        },
        {
          name: "Prilly Wiashari, S.H.",
          role: "KASIE KARIR TENAGA KEPENDIDIKAN",
          image: "/uploads/pimpinan_6.png"
        },
        {
          name: "Muhammad Wirawan Putra, S.E., M.Ak., CHRS",
          role: "KASIE LAYANAN DAN PEMBINAAN SDM",
          image: "/uploads/pimpinan_7.png"
        }
      ]
    },
    {
      id: 2,
      kasubdit: {
        name: "Yasinta Estherina Puspitasari, S.E.",
        role: "KASUBDIT PENGEMBANGAN ORGANISASI, TATA LAKSANA, DAN SISTEM SDM",
        image: "/uploads/pimpinan_1.png"
      },
      kasie: [
        {
          name: "Heryna Oktaviana Kurniawati",
          role: "KASIE ORGANISASI DAN TATA LAKSANA",
          image: "/uploads/pimpinan_8.png"
        },
        {
          name: "Yusuf Setiadi, S.Kom., M.T.I., CDCP, CHRS, CertDa",
          role: "KASIE PENGEMBANGAN SISTEM SDM",
          image: "/uploads/pimpinan_9.png"
        },
        {
          name: "Sri Haniati, S.E., CHRS, CODP",
          role: "KASIE PERENCANAAN DAN EVALUASI ORGANISASI",
          image: "/uploads/pimpinan_10.png"
        }
      ]
    },
    {
      id: 3,
      kasubdit: {
        name: "Dr.-Ing. Reza Miftahul Ulum, S.T.",
        role: "KASUBDIT PERENCANAAN, PENEMPATAN, DAN PENGEMBANGAN SDM",
        image: "/uploads/pimpinan_2.png"
      },
      kasie: [
        {
          name: "Wiyasti Dwiandini, S.I.A., CODP",
          role: "KASIE PENGEMBANGAN DOSEN",
          image: "/uploads/pimpinan_11.png"
        },
        {
          name: "Meidi Derriansyah, S.Pd., M.Si.,CHRS, CODP, CHt",
          role: "KASIE PENGEMBANGAN TENAGA KEPENDIDIKAN",
          image: "/uploads/pimpinan_12.png"
        },
        {
          name: "Muthiah Rahimah, S.E., M.S.M.",
          role: "KASIE PERENCANAAN DAN PENEMPATAN SDM",
          image: "/uploads/pimpinan_13.png"
        }
      ]
    },
    {
      id: 4,
      kasubdit: {
        name: "Arli Setiawati, M.S.M.",
        role: "KASUBDIT REMUNERASI DAN KESEJAHTERAAN SDM",
        image: "/uploads/pimpinan_3.png"
      },
      kasie: [
        {
          name: "Tria Purnama Sari, S.T., M.T., CHRS",
          role: "KASIE REMUNERASI DAN KESEJAHTERAAN 3 (PAYROLL)",
          image: "/uploads/pimpinan_14.png"
        },
        {
          name: "Diana Fitriasari, S.E., CHRS",
          role: "KASIE REMUNERASI DAN KESEJAHTERAAN 1 (DANA DIPA)",
          image: "/uploads/pimpinan_15.png"
        },
        {
          name: "Nurqamari Lailatul Fatimah, S.Kom., CHRS",
          role: "KASIE REMUNERASI DAN KESEJAHTERAAN 2 (DANA BPPTN DAN DAMAS)",
          image: "/uploads/pimpinan_16.png"
        }
      ]
    }
  ]
};

export default function ProfilPage() {
  const [activeTab, setActiveTab] = useState('profil');
  const [settings, setSettings] = useState({});
  const [pkList, setPkList] = useState([]);
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

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/program-kerja`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((item) => {
          const IconComp = IconComponents[item.icon_name] || Award;
          return {
            title: item.title,
            description: item.description,
            icon: <IconComp size={22} />
          };
        });
        setPkList(formatted);
      })
      .catch(err => {
        console.error(err);
        setPkList(PROGRAM_KERJA);
      });
  }, []);

  const pkSubtitle = settings.profil_program_kerja_subtitle || 'Program kerja utama yang diamanatkan dalam rencana strategis universitas guna mendukung sasaran strategis pusat talenta terbaik adalah sebagai berikut';


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
          <div className="subpage-hero-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 2 }}>
            <h1 className="subpage-hero-title">
              {activeTab === 'profil' ? (settings.profil_hero_title || 'Profil') : 'Struktur Organisasi DSDMPT'}
            </h1>
            {activeTab === 'profil' && settings.profil_hero_desc && (
              <p className="subpage-hero-desc" style={{ color: 'rgba(255, 255, 255, 0.85)', marginTop: '0.75rem', fontSize: '1.05rem', maxWidth: '700px', fontWeight: '400', lineHeight: '1.5' }}>
                {settings.profil_hero_desc}
              </p>
            )}
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
            <button
              className={`profil-tab ${activeTab === 'pimpinan' ? 'active' : ''}`}
              onClick={() => setActiveTab('pimpinan')}
            >
              Pimpinan Direktorat
            </button>
          </div>

          {activeTab === 'profil' && (
            <>
              {/* Profile Details (Description + Image) */}
              <div className="profil-intro-grid" style={{ marginBottom: '4rem' }}>
                <div className="profil-intro-img-wrap">
                  <img src={getImageUrl(settings.profil_image || '/uploads/profile_group.jpg')} alt="DSDMPT UI Staff" className="profil-intro-img" />
                </div>
                <div className="profil-intro-content">
                  <p className="profil-text-normal">
                    <strong>Direktorat SDM dan Pengembangan Talenta</strong> {settings.profil_text_1 || 'adalah salah satu Direktorat yang dibawahi oleh Wakil Rektor bidang Perencanaan, Keuangan, dan SDM. Menjadikan UI sebagai Pusat Talenta terbaik merupakan sasaran strategis yang diamanahkan kepada Direktorat SDM dan Pengembangan Talenta sebagaimana tertuang dalam Rencana Strategis (Renstra) Universitas Indonesia tahun 2024-2029.'}
                  </p>
                  <p className="profil-text-normal">
                    {settings.profil_text_2 || 'Direktorat SDM dan Pengembangan Talenta terus memodernisasi sistem TI untuk meningkatkan kecepatan dan akurasi layanan. Langkah ini dilakukan agar Direktorat dapat berfokus penuh pada perencanaan serta pengembangan yang bersifat strategis.'}
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

          {activeTab === 'pimpinan' && (
            <div className="pimpinan-direktorat-container" style={{ padding: '1rem 0 4rem 0', width: '100%', overflowX: 'auto' }}>
              <div style={{ minWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 1rem' }}>
                
                {/* Leader Card component helper */}
                {(() => {
                  const PimpinanCard = ({ name, role, imageSrc, isDirector }) => {
                    return (
                      <div className={`pimpinan-node-card ${isDirector ? 'director-card' : ''}`}>
                        <div className="pimpinan-photo-frame">
                          {imageSrc ? (
                            <img src={getImageUrl(imageSrc)} alt={name} className="pimpinan-photo" />
                          ) : (
                            <div className="pimpinan-photo-placeholder">
                              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            </div>
                          )}
                        </div>
                        <div className="pimpinan-info">
                          <h4 className="pimpinan-name">{name}</h4>
                          <p className="pimpinan-role">{role}</p>
                        </div>
                      </div>
                    );
                  };

                  return (
                    <>
                      {/* Top Level: Director */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', width: '25%' }}>
                        <PimpinanCard 
                          name={PIMPINAN_DATA.director.name} 
                          role={PIMPINAN_DATA.director.role} 
                          imageSrc={PIMPINAN_DATA.director.image} 
                          isDirector={true}
                        />
                      </div>

                      {/* Vertical connector line directly between Direktur and Columns */}
                      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <div style={{ width: '2px', height: '28px', backgroundColor: '#CBD5E1', zIndex: 1 }} />
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

                        {/* 4 Columns Container */}
                        <div style={{ display: 'flex', width: '100%', boxSizing: 'border-box', alignItems: 'stretch' }}>
                          {PIMPINAN_DATA.subdirectorates.map((sub) => (
                            <div key={sub.id} style={{ width: '25%', padding: '0 0.75rem', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                              {/* Vertical line from horizontal line to Kasubdit card */}
                              <div style={{ width: '2px', height: '14px', backgroundColor: '#CBD5E1', zIndex: 1, flexShrink: 0 }} />
                              
                              {/* Kasubdit Card */}
                              <PimpinanCard 
                                name={sub.kasubdit.name} 
                                role={sub.kasubdit.role} 
                                imageSrc={sub.kasubdit.image}
                              />

                              {/* Kasie list connected vertically under each Kasubdit */}
                              {sub.kasie.map((ks, index) => (
                                <React.Fragment key={index}>
                                  <div style={{ width: '2px', height: '16px', backgroundColor: '#CBD5E1', zIndex: 1, flexShrink: 0 }} />
                                  <PimpinanCard 
                                    name={ks.name} 
                                    role={ks.role} 
                                    imageSrc={ks.image}
                                  />
                                </React.Fragment>
                              ))}
                            </div>
                          ))}
                        </div>

                      </div>
                    </>
                  );
                })()}

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
                {pkSubtitle}
              </p>

              <div className="pk-grid">
                {pkList.map((pk, idx) => (
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

        /* PIMPINAN TAB STYLES */
        .pimpinan-node-card {
          background: #ffffff;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 0.75rem 0.65rem;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          width: 100%;
          height: auto;
          justify-content: flex-start;
          transition: all 0.3s ease;
          z-index: 2;
          box-sizing: border-box;
        }
        .pimpinan-node-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
          border-color: #A0C3F7;
        }
        .pimpinan-node-card.director-card {
          max-width: 100%;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
        }
        .pimpinan-info {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          justify-content: center;
          width: 100%;
        }
        .pimpinan-photo-frame {
          width: 100%;
          aspect-ratio: 3 / 4;
          border-radius: 6px;
          overflow: hidden;
          background-color: #F1F5F9;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
          border: 1px solid #E2E8F0;
          flex-shrink: 0;
        }
        .pimpinan-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
        }
        .pimpinan-photo-placeholder {
          width: 100%;
          height: 100%;
          background-color: #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pimpinan-name {
          font-size: 0.7rem;
          font-weight: 800;
          color: #0A1E38;
          margin-bottom: 0.2rem;
          line-height: 1.3;
        }
        .pimpinan-role {
          font-size: 0.55rem;
          font-weight: 600;
          color: #64748B;
          line-height: 1.4;
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
}
