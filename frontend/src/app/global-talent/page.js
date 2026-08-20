"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { 
  Menu, 
  X,
  BookOpen,
  Shield,
  Target,
  Settings,
  CheckSquare
} from 'lucide-react';

const BACKEND_URL = 'http://localhost:8081';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('/uploads')) {
    return `${BACKEND_URL}${path}`;
  }
  return path;
};

export default function GlobalTalent() {
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
          style={{ backgroundImage: `url(${getImageUrl(settings.global_talent_hero_image || settings.hero_image || '/uploads/ui_rectorate_hero.png')})` }}
        >
          <div className="subpage-hero-overlay" />
          <div className="subpage-hero-content">
            <h1 className="subpage-hero-title">{settings.global_talent_hero_title || 'Global Talent'}</h1>
            {settings.global_talent_hero_desc && <p className="subpage-hero-sub">{settings.global_talent_hero_desc}</p>}
          </div>
        </section>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main>
        
        {/* Section 1: Intro */}
        <section style={{ padding: '2rem 0', backgroundColor: '#FFFFFF' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.9fr', gap: '3.5rem', alignItems: 'center' }}>
            <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '1px solid #E2E8F0' }}>
              <img 
                src={getImageUrl(settings.global_talent_image || '/uploads/global.jpg')} 
                alt="Universitas Indonesia Rectorate" 
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
            <div>
              <p 
                style={{ fontSize: '0.98rem', lineHeight: '1.8', color: '#2C3A47', margin: 0 }}
                dangerouslySetInnerHTML={{ 
                  __html: settings.global_talent_text_1 || '<strong>Global Talent</strong> merupakan program Universitas Indonesia yang bertujuan untuk memperkuat kapasitas dan jejaring talenta akademik di tingkat internasional melalui kolaborasi, mobilitas, dan pengembangan kegiatan akademik serta riset. Program ini merupakan bagian dari upaya UI dalam meningkatkan kualitas sumber daya manusia, memperluas jejaring global, meningkatkan kualitas publikasi dan riset, serta memperkuat posisi UI sebagai universitas berkelas dunia.<br/><br/>Program Global Talent dapat melibatkan dosen, peneliti, mahasiswa pascadoktoral, dan mitra akademik dari institusi luar negeri. Bentuk kegiatannya antara lain kolaborasi riset internasional, postdoctoral researcher dari luar negeri, joint supervision, visiting professor, serta kegiatan mobilitas akademik lainnya sesuai dengan program yang tersedia di SDM dan Pengembangan Talenta sebagaimana tertuang dalam Rencana Strategis (Renstra) Universitas Indonesia tahun 2024-2029.' 
                }}
              />
            </div>
          </div>
        </section>

        {/* Section 2: Aturan Umum */}
        <section style={{ padding: '4rem 0', backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 style={{ fontSize: '1.8rem', color: '#0A1E38', fontWeight: '800', marginBottom: '0.5rem' }}>Aturan Umum</h2>
              <p style={{ color: '#576574', fontSize: '0.9rem' }}>Kerangka kerja dan standar pelaksanaan program Global Talent</p>
            </div>
            
            {/* Dynamic Aturan Grid */}
            {(() => {
              let aturanList = [
                'Kegiatan dilaksanakan dalam rangka mendukung peningkatan kualitas akademik, riset, publikasi, dan jejaring internasional UI.',
                'Peserta atau mitra yang terlibat harus memenuhi persyaratan sesuai dengan jenis kegiatan dan ketentuan program yang berlaku.',
                'Kegiatan harus memiliki tujuan, luaran, dan manfaat yang jelas bagi pengembangan akademik dan/atau riset.',
                'Pelaksanaan kegiatan dilakukan melalui mekanisme seleksi, penetapan, serta pemantauan dan evaluasi sesuai ketentuan yang berlaku.',
                'Setiap peserta atau penerima program wajib melaksanakan kegiatan sesuai dengan rencana yang telah disetujui dan menyampaikan laporan sesuai dengan ketentuan yang ditetapkan.'
              ];
              if (settings.global_talent_aturan_json) {
                try {
                  aturanList = JSON.parse(settings.global_talent_aturan_json);
                } catch(e) {}
              }

              const getIcon = (idx) => {
                switch(idx % 5) {
                  case 0: return <BookOpen size={24} />;
                  case 1: return <Shield size={24} />;
                  case 2: return <Target size={24} />;
                  case 3: return <Settings size={24} />;
                  default: return <CheckSquare size={24} />;
                }
              };

              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', justifyContent: 'center' }}>
                  {aturanList.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1.5rem', background: '#ffffff', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '50px', backgroundColor: '#F8FAFC', color: '#0A1E38', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', marginBottom: '1.25rem', border: '1px solid #E2E8F0' }}>
                        {getIcon(idx)}
                      </div>
                      <p style={{ fontSize: '0.88rem', lineHeight: '1.6', color: '#576574', margin: 0 }}>
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </section>

        {/* Section 3: Alur Pelaksanaan Secara Umum */}
        <section style={{ padding: '4rem 0', backgroundColor: '#FFFFFF' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '1.8rem', color: '#0A1E38', fontWeight: '800', marginBottom: '0.5rem' }}>Alur Pelaksanaan Secara Umum</h2>
              <div style={{ width: '50px', height: '3px', backgroundColor: '#F2C94C', margin: '0.75rem auto 0 auto', borderRadius: '2px' }} />
            </div>

            {/* Vertical Timeline */}
            <div style={{ position: 'relative', maxWidth: '850px', margin: '0 auto', padding: '1rem 0' }}>
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '2px', backgroundColor: '#E2E8F0', transform: 'translateX(-50%)' }} />

              {(() => {
                let alurList = [
                  { title: "1. Sosialisasi Program", desc: "Informasi mengenai program, jenis kegiatan, persyaratan, dan mekanisme pelaksanaan disampaikan kepada calon peserta atau pihak yang berkepentingan." },
                  { title: "2. Pengajuan atau Identifikasi", desc: "Calon peserta, dosen, peneliti, atau unit pengusul mengajukan kegiatan atau mengidentifikasi calon mitra sesuai dengan skema program yang tersedia." },
                  { title: "3. Verifikasi dan Seleksi", desc: "Pengajuan dan calon peserta diverifikasi berdasarkan persyaratan, relevansi kegiatan, kompetensi, serta kesesuaian dengan tujuan program." },
                  { title: "4. Penetapan", desc: "Peserta, penerima program, atau mitra yang memenuhi persyaratan dan lolos seleksi ditetapkan sesuai dengan ketentuan yang berlaku." },
                  { title: "5. Pelaksanaan Kegiatan", desc: "Kegiatan dilaksanakan sesuai dengan rencana, durasi, peran, dan tanggung jawab yang telah ditetapkan." },
                  { title: "6. Monitoring dan Evaluasi", desc: "Pelaksanaan kegiatan dipantau dan dievaluasi untuk memastikan kesesuaian kegiatan dengan tujuan dan target yang telah ditetapkan." },
                  { title: "7. Pelaporan", desc: "Peserta atau pelaksana menyampaikan laporan pelaksanaan dan luaran kegiatan sesuai dengan ketentuan yang berlaku." }
                ];

                if (settings.global_talent_alur_json) {
                  try {
                    const parsed = JSON.parse(settings.global_talent_alur_json);
                    alurList = parsed.map((item, idx) => {
                      const stepNum = idx + 1;
                      const defaultTitles = [
                        "Sosialisasi Program",
                        "Pengajuan atau Identifikasi",
                        "Verifikasi dan Seleksi",
                        "Penetapan",
                        "Pelaksanaan Kegiatan",
                        "Monitoring dan Evaluasi",
                        "Pelaporan"
                      ];
                      const titleText = defaultTitles[idx] || `Langkah ${stepNum}`;
                      return {
                        title: `${stepNum}. ${titleText}`,
                        desc: item
                      };
                    });
                  } catch(e) {}
                }

                return alurList.map((step, idx) => {
                  const isEven = idx % 2 === 1;
                  return (
                    <div 
                      key={idx} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        width: '100%', 
                        marginBottom: '2.5rem',
                        flexDirection: isEven ? 'row-reverse' : 'row'
                      }}
                    >
                      <div style={{ width: '45%', padding: '1.5rem', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid #F2C94C' }}>
                        <h3 style={{ fontSize: '1.05rem', color: '#0A1E38', fontWeight: '700', marginBottom: '0.5rem' }}>{step.title}</h3>
                        <p style={{ fontSize: '0.85rem', color: '#576574', lineHeight: '1.6', margin: 0 }}>
                          {step.desc}
                        </p>
                      </div>
                      <div style={{ zIndex: 10, width: '32px', height: '32px', borderRadius: '50px', backgroundColor: '#0A1E38', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>
                        {idx + 1}
                      </div>
                      <div style={{ width: '45%' }} />
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </section>

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

