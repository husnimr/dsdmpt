"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  GraduationCap,
  UserPlus,
  Award,
  Wallet,
  FlaskConical,
  FileText,
  TrendingUp,
  Star,
  Menu,
  BookOpen,
  Briefcase,
  Calendar,
  Compass,
  Cpu,
  Globe,
  Heart,
  Laptop,
  Shield,
  Activity,
  Book,
  Users,
  Target,
  Zap,
  Settings,
  Layers,
  MessageSquare,
  Search,
  Lock,
  FolderOpen,
  Users2,
  Network,
  Presentation,
  X,
  ChevronRight,
  ArrowRight
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
  TrendingUp,
  BookOpen,
  Briefcase,
  Calendar,
  Compass,
  Cpu,
  Globe,
  Heart,
  Laptop,
  Shield,
  Activity,
  Book,
  Users,
  Target,
  Zap,
  Settings,
  Layers,
  MessageSquare,
  Search,
  Lock,
  FolderOpen,
  Users2,
  Network,
  Presentation
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
  const [selectedKasie, setSelectedKasie] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
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

  // Parse dynamic Pimpinan data from settings
  let pimpinanData = PIMPINAN_DATA;
  if (settings.profil_pimpinan_json) {
    try {
      pimpinanData = JSON.parse(settings.profil_pimpinan_json);
    } catch (e) {
      console.error("Gagal parse dynamic pimpinan data", e);
    }
  }


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
              {activeTab === 'profil' ? (settings.profil_hero_title || 'Profil') : (activeTab === 'struktur' ? 'Struktur Organisasi DSDMPT' : 'Pimpinan Direktorat DSDMPT')}
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
              {(() => {
                let structureData = null;
                if (settings.profil_struktur_organisasi_json) {
                  try {
                    structureData = JSON.parse(settings.profil_struktur_organisasi_json);
                  } catch (e) {
                    console.error("Gagal parse json struktur organisasi", e);
                  }
                }

                // Fallback to default hardcoded structure if settings key is missing or invalid
                if (!structureData || !structureData.columns || !Array.isArray(structureData.columns)) {
                  return (
                    <>
                      {/* Top Leader Card (Direktur) */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                        <div style={{ 
                          backgroundColor: '#ffffff', 
                          borderRadius: '12px', 
                          border: '1px solid #E2E8F0', 
                          borderLeft: '5px solid #F2C94C', 
                          padding: '1.25rem 2rem 1.6rem 2rem', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '1rem',
                          boxShadow: 'var(--shadow-md)',
                          maxWidth: '450px',
                          width: '100%',
                          zIndex: 2,
                          position: 'relative'
                        }}>
                          <div style={{ width: '42px', height: '50px', borderRadius: '50%', backgroundColor: '#FEF9E7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F2C94C', flexShrink: 0 }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          </div>
                          <div>
                            <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#0A1E38', fontWeight: '800', lineHeight: '1.3' }}>Direktur SDM</h4>
                            <p style={{ margin: 0, fontSize: '1.05rem', color: '#0A1E38', fontWeight: '800', lineHeight: '1.3' }}>dan Pengembangan Talenta</p>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedNode({ type: 'director' });
                            }}
                            style={{
                              position: 'absolute',
                              bottom: '0.4rem',
                              right: '0.4rem',
                              background: '#F1F5F9',
                              border: 'none',
                              borderRadius: '50%',
                              width: '24px',
                              height: '24px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#0A1E38',
                              transition: 'background-color 0.2s',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
                            title="Lihat Bawahan Direktur"
                          >
                            <ChevronRight size={14} />
                          </button>
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

                         {/* 4 Columns Container */}
                         <div style={{ display: 'flex', width: '100%', boxSizing: 'border-box' }}>
                           {/* Column 1 */}
                           <div style={{ width: '25%', padding: '0 0.75rem', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                             <div style={{ width: '2px', height: '20px', backgroundColor: '#CBD5E1', zIndex: 1 }} />
                             <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #E2E8F0', borderLeft: '4px solid #0A1E38', padding: '0.85rem 1rem 1.6rem 1rem', boxShadow: 'var(--shadow-sm)', width: '100%', minHeight: '85px', display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 2, position: 'relative' }}>
                               <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, overflow: 'hidden' }}>
                                 <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.8rem', color: '#576574', fontWeight: '800' }}>Sub Direktorat</h5>
                                 <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis' }}>Layanan, Pembinaan, dan Karier SDM</p>
                               </div>
                               <button 
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   setSelectedNode({ type: 'subdit', colIdx: 0 });
                                 }}
                                 style={{
                                   position: 'absolute',
                                   bottom: '0.4rem',
                                   right: '0.4rem',
                                   background: '#F1F5F9',
                                   border: 'none',
                                   borderRadius: '50%',
                                   width: '24px',
                                   height: '24px',
                                   cursor: 'pointer',
                                   display: 'flex',
                                   alignItems: 'center',
                                   justifyContent: 'center',
                                   color: '#0A1E38',
                                   transition: 'background-color 0.2s',
                                   boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                 }}
                                 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'}
                                 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
                                 title="Lihat Bagan Struktur"
                               >
                                 <ChevronRight size={14} />
                               </button>
                             </div>
                             <div style={{ width: '2px', height: '24px', backgroundColor: '#CBD5E1', zIndex: 1 }} />
                             <div style={{ backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #E2E8F0', borderLeft: '3px solid #0A1E38', padding: '0.85rem 1.8rem 0.85rem 1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', width: '100%', minHeight: '52px', display: 'flex', alignItems: 'center', zIndex: 2, position: 'relative' }}>
                               <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.3' }}>Seksi Karir Jabatan Fungsional Dosen</p>
                                <button onClick={(e) => { e.stopPropagation(); setSelectedNode({ type: 'kasie', colIdx: 0, kasieIdx: 0 }); }} style={{ position: 'absolute', bottom: '0.3rem', right: '0.3rem', background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A1E38', transition: 'background-color 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'} title="Lihat Staf Seksi"><ChevronRight size={10} /></button>
                             </div>
                             <div style={{ width: '2px', height: '24px', backgroundColor: '#CBD5E1', zIndex: 1 }} />
                             <div style={{ backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #E2E8F0', borderLeft: '3px solid #0A1E38', padding: '0.85rem 1.8rem 0.85rem 1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', width: '100%', minHeight: '52px', display: 'flex', alignItems: 'center', zIndex: 2, position: 'relative' }}>
                               <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.3' }}>Seksi Karir Tenaga Kependidikan</p>
                                <button onClick={(e) => { e.stopPropagation(); setSelectedNode({ type: 'kasie', colIdx: 0, kasieIdx: 1 }); }} style={{ position: 'absolute', bottom: '0.3rem', right: '0.3rem', background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A1E38', transition: 'background-color 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'} title="Lihat Staf Seksi"><ChevronRight size={10} /></button>
                             </div>
                             <div style={{ width: '2px', height: '24px', backgroundColor: '#CBD5E1', zIndex: 1 }} />
                             <div style={{ backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #E2E8F0', borderLeft: '3px solid #0A1E38', padding: '0.85rem 1.8rem 0.85rem 1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', width: '100%', minHeight: '52px', display: 'flex', alignItems: 'center', zIndex: 2, position: 'relative' }}>
                               <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.3' }}>Seksi Layanan dan Pembinaan SDM</p>
                                <button onClick={(e) => { e.stopPropagation(); setSelectedNode({ type: 'kasie', colIdx: 0, kasieIdx: 2 }); }} style={{ position: 'absolute', bottom: '0.3rem', right: '0.3rem', background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A1E38', transition: 'background-color 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'} title="Lihat Staf Seksi"><ChevronRight size={10} /></button>
                             </div>
                           </div>
 
                           {/* Column 2 */}
                           <div style={{ width: '25%', padding: '0 0.75rem', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                             <div style={{ width: '2px', height: '20px', backgroundColor: '#CBD5E1', zIndex: 1 }} />
                             <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #E2E8F0', borderLeft: '4px solid #27AE60', padding: '0.85rem 1rem 1.6rem 1rem', boxShadow: 'var(--shadow-sm)', width: '100%', minHeight: '85px', display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 2, position: 'relative' }}>
                               <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, overflow: 'hidden' }}>
                                 <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.8rem', color: '#576574', fontWeight: '800' }}>Sub Direktorat</h5>
                                 <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis' }}>Pengembangan Organisasi Tata Laksana dan Sistem SDM</p>
                               </div>
                               <button 
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   setSelectedNode({ type: 'subdit', colIdx: 1 });
                                 }}
                                 style={{
                                   position: 'absolute',
                                   bottom: '0.4rem',
                                   right: '0.4rem',
                                   background: '#F1F5F9',
                                   border: 'none',
                                   borderRadius: '50%',
                                   width: '24px',
                                   height: '24px',
                                   cursor: 'pointer',
                                   display: 'flex',
                                   alignItems: 'center',
                                   justifyContent: 'center',
                                   color: '#0A1E38',
                                   transition: 'background-color 0.2s',
                                   boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                 }}
                                 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'}
                                 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
                                 title="Lihat Bagan Struktur"
                               >
                                 <ChevronRight size={14} />
                               </button>
                             </div>
                             <div style={{ width: '2px', height: '24px', backgroundColor: '#CBD5E1', zIndex: 1 }} />
                             <div style={{ backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #E2E8F0', borderLeft: '3px solid #27AE60', padding: '0.85rem 1.8rem 0.85rem 1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', width: '100%', minHeight: '52px', display: 'flex', alignItems: 'center', zIndex: 2, position: 'relative' }}>
                               <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.3' }}>Seksi Organisasi dan Tata Laksana</p>
                                <button onClick={(e) => { e.stopPropagation(); setSelectedNode({ type: 'kasie', colIdx: 1, kasieIdx: 0 }); }} style={{ position: 'absolute', bottom: '0.3rem', right: '0.3rem', background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A1E38', transition: 'background-color 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'} title="Lihat Staf Seksi"><ChevronRight size={10} /></button>
                             </div>
                             <div style={{ width: '2px', height: '24px', backgroundColor: '#CBD5E1', zIndex: 1 }} />
                             <div style={{ backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #E2E8F0', borderLeft: '3px solid #27AE60', padding: '0.85rem 1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', width: '100%', minHeight: '52px', display: 'flex', alignItems: 'center', zIndex: 2 }}>
                               <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.3' }}>Seksi Pengembangan Sistem SDM</p>
                             </div>
                             <div style={{ width: '2px', height: '24px', backgroundColor: '#CBD5E1', zIndex: 1 }} />
                             <div style={{ backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #E2E8F0', borderLeft: '3px solid #27AE60', padding: '0.85rem 1.8rem 0.85rem 1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', width: '100%', minHeight: '52px', display: 'flex', alignItems: 'center', zIndex: 2, position: 'relative' }}>
                               <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.3' }}>Seksi Perencanaan dan Evaluasi Organisasi</p>
                                <button onClick={(e) => { e.stopPropagation(); setSelectedNode({ type: 'kasie', colIdx: 1, kasieIdx: 1 }); }} style={{ position: 'absolute', bottom: '0.3rem', right: '0.3rem', background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A1E38', transition: 'background-color 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'} title="Lihat Staf Seksi"><ChevronRight size={10} /></button>
                             </div>
                           </div>
 
                           {/* Column 3 */}
                           <div style={{ width: '25%', padding: '0 0.75rem', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                             <div style={{ width: '2px', height: '20px', backgroundColor: '#CBD5E1', zIndex: 1 }} />
                             <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #E2E8F0', borderLeft: '4px solid #C0392B', padding: '0.85rem 1rem 1.6rem 1rem', boxShadow: 'var(--shadow-sm)', width: '100%', minHeight: '85px', display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 2, position: 'relative' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, overflow: 'hidden' }}>
                                  <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.8rem', color: '#576574', fontWeight: '800' }}>Sub Direktorat</h5>
                                  <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis' }}>Perencanaan, Penempatan, Pengembangan SDM</p>
                                </div>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedNode({ type: 'subdit', colIdx: 2 });
                                  }}
                                  style={{
                                    position: 'absolute',
                                    bottom: '0.4rem',
                                    right: '0.4rem',
                                    background: '#F1F5F9',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '24px',
                                    height: '24px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#0A1E38',
                                    transition: 'background-color 0.2s',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
                                  title="Lihat Bagan Struktur"
                                >
                                  <ChevronRight size={14} />
                                </button>
                             </div>
                             <div style={{ width: '2px', height: '24px', backgroundColor: '#CBD5E1', zIndex: 1 }} />
                             <div style={{ backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #E2E8F0', borderLeft: '3px solid #C0392B', padding: '0.85rem 1.8rem 0.85rem 1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', width: '100%', minHeight: '52px', display: 'flex', alignItems: 'center', zIndex: 2, position: 'relative' }}>
                               <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.3' }}>Seksi Pengembangan Dosen</p>
                                <button onClick={(e) => { e.stopPropagation(); setSelectedNode({ type: 'kasie', colIdx: 2, kasieIdx: 0 }); }} style={{ position: 'absolute', bottom: '0.3rem', right: '0.3rem', background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A1E38', transition: 'background-color 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'} title="Lihat Staf Seksi"><ChevronRight size={10} /></button>
                             </div>
                             <div style={{ width: '2px', height: '24px', backgroundColor: '#CBD5E1', zIndex: 1 }} />
                             <div style={{ backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #E2E8F0', borderLeft: '3px solid #C0392B', padding: '0.85rem 1.8rem 0.85rem 1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', width: '100%', minHeight: '52px', display: 'flex', alignItems: 'center', zIndex: 2, position: 'relative' }}>
                               <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.3' }}>Seksi Pengembangan Tenaga Kependidikan</p>
                                <button onClick={(e) => { e.stopPropagation(); setSelectedNode({ type: 'kasie', colIdx: 2, kasieIdx: 1 }); }} style={{ position: 'absolute', bottom: '0.3rem', right: '0.3rem', background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A1E38', transition: 'background-color 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'} title="Lihat Staf Seksi"><ChevronRight size={10} /></button>
                             </div>
                             <div style={{ width: '2px', height: '24px', backgroundColor: '#CBD5E1', zIndex: 1 }} />
                             <div style={{ backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #E2E8F0', borderLeft: '3px solid #C0392B', padding: '0.85rem 1.8rem 0.85rem 1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', width: '100%', minHeight: '52px', display: 'flex', alignItems: 'center', zIndex: 2, position: 'relative' }}>
                               <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.3' }}>Seksi Perencanaan dan Penempatan SDM</p>
                                <button onClick={(e) => { e.stopPropagation(); setSelectedNode({ type: 'kasie', colIdx: 2, kasieIdx: 2 }); }} style={{ position: 'absolute', bottom: '0.3rem', right: '0.3rem', background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A1E38', transition: 'background-color 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'} title="Lihat Staf Seksi"><ChevronRight size={10} /></button>
                             </div>
                           </div>
 
                           {/* Column 4 */}
                           <div style={{ width: '25%', padding: '0 0.75rem', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                             <div style={{ width: '2px', height: '20px', backgroundColor: '#CBD5E1', zIndex: 1 }} />
                             <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #E2E8F0', borderLeft: '4px solid #F2C94C', padding: '0.85rem 1rem 1.6rem 1rem', boxShadow: 'var(--shadow-sm)', width: '100%', minHeight: '85px', display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 2, position: 'relative' }}>
                               <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, overflow: 'hidden' }}>
                                 <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.8rem', color: '#576574', fontWeight: '800' }}>Sub Direktorat</h5>
                                 <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis' }}>Remunerasi dan Kesejahteraan</p>
                               </div>
                               <button 
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   setSelectedNode({ type: 'subdit', colIdx: 3 });
                                 }}
                                 style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A1E38', transition: 'background-color 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'}
                                 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
                                 title="Lihat Bagan Struktur"
                               >
                                 <ChevronRight size={14} />
                               </button>
                             </div>
                             <div style={{ width: '2px', height: '24px', backgroundColor: '#CBD5E1', zIndex: 1 }} />
                             <div style={{ backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #E2E8F0', borderLeft: '3px solid #F2C94C', padding: '0.85rem 1.8rem 0.85rem 1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', width: '100%', minHeight: '52px', display: 'flex', alignItems: 'center', zIndex: 2, position: 'relative' }}>
                               <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.3' }}>Seksi Remunerasi dan Kesejahteraan 3 (Payroll)</p>
                                <button onClick={(e) => { e.stopPropagation(); setSelectedNode({ type: 'kasie', colIdx: 3, kasieIdx: 0 }); }} style={{ position: 'absolute', bottom: '0.3rem', right: '0.3rem', background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A1E38', transition: 'background-color 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'} title="Lihat Staf Seksi"><ChevronRight size={10} /></button>
                             </div>
                             <div style={{ width: '2px', height: '24px', backgroundColor: '#CBD5E1', zIndex: 1 }} />
                             <div style={{ backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #E2E8F0', borderLeft: '3px solid #F2C94C', padding: '0.85rem 1.8rem 0.85rem 1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', width: '100%', minHeight: '52px', display: 'flex', alignItems: 'center', zIndex: 2, position: 'relative' }}>
                               <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.3' }}>Seksi Remunerasi dan Kesejahteraan 1 (Dana Dipa)</p>
                                <button onClick={(e) => { e.stopPropagation(); setSelectedNode({ type: 'kasie', colIdx: 3, kasieIdx: 1 }); }} style={{ position: 'absolute', bottom: '0.3rem', right: '0.3rem', background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A1E38', transition: 'background-color 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'} title="Lihat Staf Seksi"><ChevronRight size={10} /></button>
                             </div>
                             <div style={{ width: '2px', height: '24px', backgroundColor: '#CBD5E1', zIndex: 1 }} />
                             <div style={{ backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #E2E8F0', borderLeft: '3px solid #F2C94C', padding: '0.85rem 1.8rem 0.85rem 1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', width: '100%', minHeight: '52px', display: 'flex', alignItems: 'center', zIndex: 2, position: 'relative' }}>
                               <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.3' }}>Seksi Remunerasi dan Kesejahteraan 2 (Dana BPPTN dan Damas)</p>
                                <button onClick={(e) => { e.stopPropagation(); setSelectedNode({ type: 'kasie', colIdx: 3, kasieIdx: 2 }); }} style={{ position: 'absolute', bottom: '0.3rem', right: '0.3rem', background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A1E38', transition: 'background-color 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'} title="Lihat Staf Seksi"><ChevronRight size={10} /></button>
                             </div>
                           </div>
                         </div>
                       </div>
                    </>
                  );
                }

                // Render dynamic parsed data cleanly!
                const totalCols = structureData.columns.length;
                const colWidthPercent = `${100 / Math.max(1, totalCols)}%`;
                
                // Horizontal connector lines should span from center of first column to center of last column
                // Center of Col i in N columns: ( (i - 0.5) / N ) * 100%
                const leftPercent = `${(0.5 / totalCols) * 100}%`;
                const rightPercent = `${(0.5 / totalCols) * 100}%`;

                return (
                  <>
                    {/* Dynamic Director Node */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                      <div style={{ 
                        backgroundColor: '#ffffff', 
                        borderRadius: '12px', 
                        border: '1px solid #E2E8F0', 
                        borderLeft: '5px solid #F2C94C', 
                        padding: '1.25rem 2rem 1.6rem 2rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1rem',
                        boxShadow: 'var(--shadow-md)',
                        maxWidth: '450px',
                        width: '100%',
                        zIndex: 2,
                        position: 'relative'
                      }}>
                        <div style={{ width: '42px', height: '50px', borderRadius: '50%', backgroundColor: '#FEF9E7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F2C94C', flexShrink: 0 }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#0A1E38', fontWeight: '800', lineHeight: '1.3' }}>
                            {structureData.director?.title || 'Direktur SDM dan Pengembangan Talenta'}
                          </h4>
                          {structureData.director?.subTitle && (
                            <p style={{ margin: 0, fontSize: '1.05rem', color: '#0A1E38', fontWeight: '800', lineHeight: '1.3' }}>
                              {structureData.director.subTitle}
                            </p>
                          )}
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedNode({ type: 'director' });
                          }}
                          style={{
                            position: 'absolute',
                            bottom: '0.4rem',
                            right: '0.4rem',
                            background: '#F1F5F9',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#0A1E38',
                            transition: 'background-color 0.2s',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
                          title="Lihat Bawahan Direktur"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Vertical connector line directly between Direktur and Columns */}
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <div style={{ width: '2px', height: '40px', backgroundColor: '#CBD5E1', zIndex: 1 }} />
                    </div>

                    {/* Sub-Directorate Columns Connected by tree structure */}
                    <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      {/* Horizontal line spans center of col 1 to center of col N */}
                      {totalCols > 1 && (
                        <div style={{ 
                          position: 'absolute', 
                          top: 0, 
                          left: leftPercent, 
                          right: rightPercent, 
                          height: '2px', 
                          backgroundColor: '#CBD5E1',
                          zIndex: 1
                        }} />
                      )}

                      {/* Columns Container */}
                      <div style={{ display: 'flex', width: '100%', boxSizing: 'border-box' }}>
                        {structureData.columns.map((col, colIdx) => (
                          <div 
                            key={colIdx} 
                            style={{ 
                              width: colWidthPercent, 
                              padding: '0 0.75rem', 
                              boxSizing: 'border-box', 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center', 
                              position: 'relative' 
                            }}
                          >
                            {/* Vertical line from horizontal line to card */}
                            <div style={{ width: '2px', height: '20px', backgroundColor: '#CBD5E1', zIndex: 1 }} />
                            
                            {/* Subdirectorate Node */}
                            <div style={{ 
                              backgroundColor: '#ffffff', 
                              borderRadius: '8px', 
                              border: '1px solid #E2E8F0', 
                              borderLeft: `4px solid ${col.color || '#0A1E38'}`, 
                              padding: '0.85rem 1rem 1.6rem 1rem', 
                              boxShadow: 'var(--shadow-sm)',
                              width: '100%',
                              height: '100px',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              zIndex: 2,
                              position: 'relative'
                            }}>
                              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, overflow: 'hidden' }}>
                                <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.8rem', color: '#576574', fontWeight: '800' }}>Sub Direktorat</h5>
                                <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis' }}>{col.name}</p>
                              </div>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedNode({ type: 'subdit', colIdx: colIdx });
                                }}
                                style={{
                                  position: 'absolute',
                                  bottom: '0.4rem',
                                  right: '0.4rem',
                                  background: '#F1F5F9',
                                  border: 'none',
                                  borderRadius: '50%',
                                  width: '24px',
                                  height: '24px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#0A1E38',
                                  transition: 'background-color 0.2s',
                                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
                                title="Lihat Bagan Struktur"
                              >
                                <ChevronRight size={14} />
                              </button>
                            </div>

                            {/* Render Sections (Seksi) list vertically */}
                            {col.sections && col.sections.map((seksi, seksiIdx) => (
                              <React.Fragment key={seksiIdx}>
                                <div style={{ width: '2px', height: '24px', backgroundColor: '#CBD5E1', zIndex: 1 }} />
                                <div style={{ 
                                  backgroundColor: '#ffffff', 
                                  borderRadius: '6px', 
                                  border: '1px solid #E2E8F0', 
                                  borderLeft: `3px solid ${col.color || '#0A1E38'}`,
                                  padding: '0.85rem 1.8rem 0.85rem 1rem',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                                  width: '100%',
                                  height: '68px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  zIndex: 2,
                                  position: 'relative'
                                }}>
                                  <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.3', overflow: 'hidden', textOverflow: 'ellipsis' }}>{seksi}</p>
                                  <button onClick={(e) => { e.stopPropagation(); setSelectedNode({ type: 'kasie', colIdx: colIdx, kasieIdx: seksiIdx }); }} style={{ position: 'absolute', bottom: '0.3rem', right: '0.3rem', background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A1E38', transition: 'background-color 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'} title="Lihat Staf Seksi"><ChevronRight size={10} /></button>
                                </div>
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
          )}

          {activeTab === 'pimpinan' && pimpinanData && pimpinanData.director && (
            <div className="pimpinan-direktorat-container" style={{ padding: '1rem 0 4rem 0', width: '100%', overflowX: 'auto' }}>
              <div style={{ minWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 1rem' }}>
                
                {/* Leader Card component helper */}
                {(() => {
                  const PimpinanCard = ({ name, role, imageSrc, isDirector, isKasie, onClick }) => {
                    return (
                      <div 
                        className={`pimpinan-node-card ${isDirector ? 'director-card' : ''} ${isKasie ? 'kasie-card' : ''}`}
                        onClick={isKasie ? undefined : onClick}
                        style={isKasie ? { transition: 'all 0.2s' } : {}}
                      >
                        <div className="pimpinan-photo-frame">
                          {imageSrc ? (
                            <img src={getImageUrl(imageSrc)} alt={name} className="pimpinan-photo" />
                          ) : (
                            <div className="pimpinan-photo-placeholder">
                              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            </div>
                          )}
                        </div>
                        <div className="pimpinan-info" style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
                          <h4 className="pimpinan-name">{name}</h4>
                          <p className="pimpinan-role" style={{ flexGrow: 1 }}>{role}</p>
                        </div>
                      </div>
                    );
                  };

                  const colsCount = (pimpinanData.subdirectorates || []).length || 1;
                  const horizontalSpanPercent = colsCount > 1 ? 100 - (100 / colsCount) : 0;
                  const horizontalOffsetPercent = colsCount > 1 ? (50 / colsCount) : 50;

                  return (
                    <>
                      {/* Top Level: Director */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', width: '25%' }}>
                        <PimpinanCard 
                          name={pimpinanData.director.name} 
                          role={pimpinanData.director.role} 
                          imageSrc={pimpinanData.director.image} 
                          isDirector={true}
                        />
                      </div>

                      {/* Vertical connector line directly between Direktur and Columns */}
                      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <div style={{ width: '2px', height: '28px', backgroundColor: '#CBD5E1', zIndex: 1 }} />
                      </div>

                      {/* Sub-Directorate Columns Connected by tree structure */}
                      <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        
                        {/* Horizontal line: Dynamically calculated based on column count */}
                        {colsCount > 1 && (
                          <div style={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: `${horizontalOffsetPercent}%`, 
                            right: `${horizontalOffsetPercent}%`, 
                            height: '2px', 
                            backgroundColor: '#CBD5E1',
                            zIndex: 1
                          }} />
                        )}

                        {/* Columns Container */}
                        <div style={{ display: 'flex', width: '100%', boxSizing: 'border-box', alignItems: 'stretch' }}>
                          {(pimpinanData.subdirectorates || []).map((sub) => (
                            <div key={sub.id} style={{ width: `${100 / colsCount}%`, padding: '0 0.75rem', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                              {/* Vertical line from horizontal line to Kasubdit card */}
                              <div style={{ width: '2px', height: '14px', backgroundColor: '#CBD5E1', zIndex: 1, flexShrink: 0 }} />
                              
                              {/* Kasubdit Card */}
                              <PimpinanCard 
                                name={sub.kasubdit.name} 
                                role={sub.kasubdit.role} 
                                imageSrc={sub.kasubdit.image}
                              />

                              {/* Kasie list connected vertically under each Kasubdit */}
                              {(sub.kasie || []).map((ks, index) => (
                                <React.Fragment key={index}>
                                  <div style={{ width: '2px', height: '16px', backgroundColor: '#CBD5E1', zIndex: 1, flexShrink: 0 }} />
                                  <PimpinanCard 
                                    name={ks.name} 
                                    role={ks.role} 
                                    imageSrc={ks.image}
                                    isKasie={true}
                                    onClick={() => setSelectedKasie(ks)}
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

      {selectedNode !== null && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem'
          }}
          onClick={() => setSelectedNode(null)}
        >
          <div 
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '900px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div 
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#0A1E38',
                color: '#FFFFFF'
              }}
            >
              <h3 style={{ fontWeight: '700', fontSize: '1.1rem', margin: 0, color: '#FFFFFF' }}>
                {selectedNode.type === 'director' ? 'Pimpinan Direktorat' : selectedNode.type === 'subdit' ? 'Pimpinan Sub Direktorat' : 'Pimpinan Seksi'}
              </h3>
              <button 
                onClick={() => setSelectedNode(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  opacity: 0.8,
                  fontSize: '1.5rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body: Bagan Struktur */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {(() => {
                let structureData = null;
                if (settings.profil_struktur_organisasi_json) {
                  try {
                    structureData = JSON.parse(settings.profil_struktur_organisasi_json);
                  } catch (e) {}
                }
                
                const cols = (structureData?.columns && Array.isArray(structureData.columns)) ? structureData.columns : [
                  { name: "Layanan, Pembinaan, dan Karier SDM", color: "#0A1E38" },
                  { name: "Pengembangan Organisasi Tata Laksana dan Sistem SDM", color: "#27AE60" },
                  { name: "Perencanaan, Penempatan, Pengembangan SDM", color: "#C0392B" },
                  { name: "Remunerasi dan Kesejahteraan", color: "#F2C94C" }
                ];

                let titleLabel = "";
                let titleName = "";
                let colColor = "#0A1E38";

                // Leader info
                let leaderName = "";
                let leaderRole = "";
                let leaderImage = "";

                // Subordinates info
                let subordinates = [];

                if (selectedNode.type === 'director') {
                  titleLabel = "Direktorat";
                  titleName = "Direktorat SDM dan Pengembangan Talenta";
                  colColor = "#F2C94C";

                  leaderName = structureData?.director?.name || pimpinanData?.director?.name || "Dr. Abdillah Ahsan, S.E., M.S.E.";
                  leaderRole = structureData?.director?.title || pimpinanData?.director?.role || "Direktur SDM dan Pengembangan Talenta";
                  leaderImage = structureData?.director?.image || pimpinanData?.director?.image || "/uploads/pimpinan_1.png";

                  subordinates = cols.map((col, idx) => {
                    const sub = pimpinanData?.subdirectorates && pimpinanData.subdirectorates[idx];
                    const defaultName = idx === 0 ? "Agus Anang, S.Kom., M.T.I., CHRS." : idx === 1 ? "Yasinta Estherina Puspitasari, S.E." : idx === 2 ? "Meidi Derriansyah, S.Pd., M.Si." : "Arli Setiawati, M.S.M.";
                    const defaultRole = idx === 0 ? "Kasubdit Layanan, Pembinaan, dan Karier SDM" : idx === 1 ? "Kasubdit Pengembangan Organisasi Tata Laksana" : idx === 2 ? "Kasubdit Perencanaan, Penempatan, Pengembangan SDM" : "Kasubdit Remunerasi dan Kesejahteraan";
                    const defaultImg = idx === 0 ? "/uploads/pimpinan_4.png" : idx === 1 ? "/uploads/pimpinan_2.png" : idx === 2 ? "/uploads/pimpinan_11.png" : "/uploads/pimpinan_3.png";

                    return {
                      name: col.kasubdit_name || sub?.kasubdit?.name || defaultName,
                      role: col.kasubdit_title || sub?.kasubdit?.role || defaultRole,
                      image: col.kasubdit_image || sub?.kasubdit?.image || defaultImg,
                      borderColor: col.color || "#0A1E38"
                    };
                  });
                } else if (selectedNode.type === 'subdit') {
                  const colIdx = selectedNode.colIdx;
                  const col = cols[colIdx];
                  if (!col) return null;

                  titleLabel = "Sub Direktorat";
                  titleName = col.name;
                  colColor = col.color || "#0A1E38";

                  const sub = pimpinanData?.subdirectorates && pimpinanData.subdirectorates[colIdx];
                  const defaultName = colIdx === 0 ? "Agus Anang, S.Kom., M.T.I., CHRS." : colIdx === 1 ? "Yasinta Estherina Puspitasari, S.E." : colIdx === 2 ? "Meidi Derriansyah, S.Pd., M.Si." : "Arli Setiawati, M.S.M.";
                  const defaultRole = colIdx === 0 ? "Kasubdit Layanan, Pembinaan, dan Karier SDM" : colIdx === 1 ? "Kasubdit Pengembangan Organisasi Tata Laksana" : colIdx === 2 ? "Kasubdit Perencanaan, Penempatan, Pengembangan SDM" : "Kasubdit Remunerasi dan Kesejahteraan";
                  const defaultImg = colIdx === 0 ? "/uploads/pimpinan_4.png" : colIdx === 1 ? "/uploads/pimpinan_2.png" : colIdx === 2 ? "/uploads/pimpinan_11.png" : "/uploads/pimpinan_3.png";

                  leaderName = col.kasubdit_name || sub?.kasubdit?.name || defaultName;
                  leaderRole = col.kasubdit_title || sub?.kasubdit?.role || defaultRole;
                  leaderImage = col.kasubdit_image || sub?.kasubdit?.image || defaultImg;

                  const kasieList = sub?.kasie || (PIMPINAN_DATA?.subdirectorates && PIMPINAN_DATA.subdirectorates[colIdx]?.kasie) || [];
                  subordinates = kasieList.map(ks => ({
                    name: ks.name || 'Nama Seksi',
                    role: ks.role || 'Kepala Seksi',
                    image: ks.image || '',
                    borderColor: colColor
                  }));
                } else if (selectedNode.type === 'kasie') {
                  const colIdx = selectedNode.colIdx;
                  const kasieIdx = selectedNode.kasieIdx;
                  const col = cols[colIdx];
                  colColor = col?.color || "#0A1E38";

                  const sub = pimpinanData?.subdirectorates && pimpinanData.subdirectorates[colIdx];
                  const fallbackSub = PIMPINAN_DATA?.subdirectorates && PIMPINAN_DATA.subdirectorates[colIdx];
                  const ks = sub?.kasie?.[kasieIdx] || fallbackSub?.kasie?.[kasieIdx];
                  if (!ks) return null;

                  titleLabel = "Seksi";
                  titleName = ks.role || "Kepala Seksi";

                  leaderName = ks.name || "Nama Seksi";
                  leaderRole = ks.role || "Kepala Seksi";
                  leaderImage = ks.image || "";

                  const staffList = ks.staff || [];
                  subordinates = staffList.map(st => ({
                    name: st.name || 'Nama Staf',
                    role: st.role || 'Staf',
                    image: st.image || '',
                    borderColor: colColor
                  }));
                }

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', minWidth: '600px' }}>
                    {/* Title Header */}
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '800', color: colColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{titleLabel}</span>
                      <h4 style={{ margin: '0.25rem 0 0 0', fontSize: '1.25rem', color: '#0A1E38', fontWeight: '800' }}>{titleName}</h4>
                    </div>

                    {/* Leader Card (Top Level) */}
                    <div style={{ 
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      borderLeft: `5px solid ${colColor}`,
                      padding: '0.85rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                      width: '380px',
                      zIndex: 2
                    }}>
                      {leaderImage ? (
                        <img 
                          src={getImageUrl(leaderImage)} 
                          alt={leaderName} 
                          style={{ width: '55px', height: '55px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #E2E8F0', flexShrink: 0 }}
                        />
                      ) : (
                        <div style={{ width: '55px', height: '55px', borderRadius: '50%', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', border: '2px solid #E2E8F0', flexShrink: 0 }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </div>
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', overflow: 'hidden' }}>
                        <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#0A1E38', fontWeight: '800', lineHeight: '1.2' }}>{leaderName}</h4>
                        <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748B', fontWeight: '600' }}>{leaderRole}</p>
                      </div>
                    </div>

                    {/* Vertical Connector Line */}
                    {subordinates.length > 0 && (
                      <div style={{ width: '2px', height: '30px', backgroundColor: '#CBD5E1', zIndex: 1 }} />
                    )}

                    {/* Horizontal Line for branching to Subordinates */}
                    {subordinates.length > 0 && (
                      <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {subordinates.length > 1 && (
                          <div style={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: `${(0.5 / subordinates.length) * 100}%`, 
                            right: `${(0.5 / subordinates.length) * 100}%`, 
                            height: '2px', 
                            backgroundColor: '#CBD5E1',
                            zIndex: 1
                          }} />
                        )}

                        {/* Subordinates Columns */}
                        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                          {subordinates.map((subNode, idx) => {
                            const subNodeName = subNode.name || 'Nama';
                            const subNodeRole = subNode.role || 'Jabatan';
                            const subNodeImage = subNode.image || '';

                            return (
                              <div key={idx} style={{ width: `${100 / subordinates.length}%`, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', padding: '0 0.35rem', boxSizing: 'border-box' }}>
                                <div style={{ width: '2px', height: '15px', backgroundColor: '#CBD5E1', zIndex: 1 }} />
                                
                                <div style={{ 
                                  backgroundColor: '#ffffff',
                                  borderRadius: '10px',
                                  border: '1px solid #E2E8F0',
                                  borderLeft: `4px solid ${subNode.borderColor || colColor}`,
                                  padding: '0.65rem 0.85rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.75rem',
                                  boxShadow: '0 4px 6px rgba(0,0,0,0.03)',
                                  width: '100%',
                                  maxWidth: selectedNode.type === 'director' ? '205px' : '230px',
                                  zIndex: 2
                                }}>
                                  {subNodeImage ? (
                                    <img 
                                      src={getImageUrl(subNodeImage)} 
                                      alt={subNodeName} 
                                      style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #E2E8F0', flexShrink: 0 }}
                                    />
                                  ) : (
                                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', border: '1.5px solid #E2E8F0', flexShrink: 0 }}>
                                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                    </div>
                                  )}
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', textAlign: 'left', overflow: 'hidden' }}>
                                    <h4 style={{ margin: 0, fontSize: '0.7rem', color: '#0A1E38', fontWeight: '800', lineHeight: '1.2', wordBreak: 'break-word' }}>{subNodeName}</h4>
                                    <p style={{ margin: 0, fontSize: '0.6rem', color: '#64748B', fontWeight: '600', lineHeight: '1.2', wordBreak: 'break-word' }}>{subNodeRole}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {selectedNode.type === 'kasie' && subordinates.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '2rem', color: '#64748B', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', width: '380px', marginTop: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.03)' }}>
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '0.5rem', opacity: 0.6 }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#0A1E38', fontWeight: '800' }}>Belum Ada Daftar Staf</h4>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.72rem', color: '#64748B' }}>Staf pendukung untuk seksi ini belum dimasukkan.</p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ── KASIE STAFF POPUP MODAL ── */}
      {selectedKasie && (
        <div className="staff-modal-backdrop" onClick={() => setSelectedKasie(null)}>
          <div className="staff-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="staff-modal-header">
              <div>
                <h3 className="staff-modal-title">Staf</h3>
                <p className="staff-modal-subtitle">{selectedKasie.name} ({selectedKasie.role})</p>
              </div>
              <button className="staff-modal-close" onClick={() => setSelectedKasie(null)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="staff-modal-body">
              {!selectedKasie.staff || selectedKasie.staff.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748B' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '0.75rem', opacity: 0.6 }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  <p style={{ fontSize: '0.95rem', fontWeight: '700', margin: 0, color: '#0A1E38' }}>Belum Ada Daftar Staf</p>
                  <p style={{ fontSize: '0.8rem', margin: '0.25rem 0 0', color: '#64748B' }}>Staf pendukung untuk seksi ini belum dimasukkan.</p>
                </div>
              ) : (
                <div className="staff-grid">
                  {selectedKasie.staff.map((st, sIdx) => (
                    <div key={sIdx} className="staff-member-card">
                      <div className="staff-photo-frame">
                        {st.image ? (
                          <img src={getImageUrl(st.image)} alt={st.name} className="staff-photo" />
                        ) : (
                          <div className="staff-photo-placeholder">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          </div>
                        )}
                      </div>
                      <div className="staff-info">
                        <h4 className="staff-name">{st.name || '-'}</h4>
                        <p className="staff-role">{st.role || 'Staf Pendukung'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
      <Footer />

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

        /* KASIE STAF POPUP STYLING */
        .staff-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.25s ease-out;
        }
        .staff-modal-content {
          background: #FFFFFF;
          border-radius: 20px;
          width: 90%;
          max-width: 820px;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15);
          overflow: hidden;
          animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .staff-modal-header {
          padding: 1.75rem 2rem;
          border-bottom: 1px solid #F1F5F9;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #F8FAFC;
        }
        .staff-modal-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0A1E38;
          margin: 0 0 0.35rem 0;
        }
        .staff-modal-subtitle {
          font-size: 0.9rem;
          color: #576574;
          margin: 0;
          font-weight: 600;
        }
        .staff-modal-close {
          background: none;
          border: none;
          color: #94A3B8;
          cursor: pointer;
          transition: color 0.15s;
          display: flex;
          align-items: center;
          padding: 0.5rem;
          border-radius: 50%;
        }
        .staff-modal-close:hover {
          color: #EF4444;
          background: #F1F5F9;
        }
        .staff-modal-body {
          padding: 2rem;
          max-height: 60vh;
          overflow-y: auto;
        }
        .staff-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }
        .staff-member-card {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.01);
          transition: all 0.25s ease;
        }
        .staff-member-card:hover {
          border-color: #A0C3F7;
          background: #FFFFFF;
          box-shadow: 0 10px 20px rgba(10,30,56,0.05);
          transform: translateY(-2px);
        }
        .staff-photo-frame {
          width: 80px;
          height: 100px;
          border-radius: 8px;
          overflow: hidden;
          background: #F1F5F9;
          border: 1.5px solid #E2E8F0;
          flex-shrink: 0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.04);
        }
        .staff-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .staff-photo-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .staff-info {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          min-width: 0;
        }
        .staff-name {
          font-size: 0.95rem;
          font-weight: 800;
          color: #0A1E38;
          margin: 0;
          line-height: 1.35;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .staff-role {
          font-size: 0.78rem;
          color: #576574;
          margin: 0;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        /* HOVER KASIE CARD */
        .kasie-card:hover {
          transform: translateY(-4px);
          border-color: #A0C3F7;
          box-shadow: 0 8px 20px rgba(10,30,56,0.08);
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
          justify-content: flex-start;
          width: 100%;
          min-height: 80px;
          box-sizing: border-box;
          padding-top: 0.25rem;
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
