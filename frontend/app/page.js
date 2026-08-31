"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SplashIntro from './components/SplashIntro';
import { 
  Users, 
  User, 
  Globe, 
  PhoneCall, 
  ArrowRight, 
  X, 
  Menu, 
  Award,
  ChevronRight,
  Calendar
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

// Animated counter helper component
const Counter = ({ target, duration = 1500, suffix = "", active = false }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);

  useEffect(() => {
    if (!active) {
      setCount(0);
      return;
    }
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth slowing down
      const easeOutQuad = progress * (2 - progress);
      const currentVal = Math.floor(easeOutQuad * target);
      
      setCount(currentVal);
      if (progress < 1) {
        countRef.current = window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };
    
    countRef.current = window.requestAnimationFrame(step);
    return () => {
      if (countRef.current) {
        window.cancelAnimationFrame(countRef.current);
      }
    };
  }, [target, duration, active]);

  // Format with thousand separator if needed (e.g. 18.400)
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return <span>{formatNumber(count)}{suffix}</span>;
};

// Interactive Rotating Circle Component
const InteractiveRotatingCircle = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const points = [
    {
      id: 0,
      number: "01",
      title: "DAMPAK GLOBAL",
      heading: "Dari Depok, melangkah ke dunia.",
      description: "UI menghubungkan gagasan Indonesia dengan jejaring pengetahuan global untuk menjawab tantangan lintas batas.",
      stats: [
        { label: "MITRA UNIVERSITAS DUNIA", value: "120+" },
        { label: "NEGARA TUJUAN MOBILITAS", value: "32" },
        { label: "UNIVERSITAS TERBAIK INDONESIA", value: "#1" }
      ],
      angle: 0
    },
    {
      id: 1,
      number: "02",
      title: "KEUNGGULAN AKADEMIK",
      heading: "Pendidikan kelas dunia untuk talenta masa depan.",
      description: "Menghasilkan lulusan yang kompetitif, berintegritas, dan siap memimpin transformasi di berbagai sektor industri.",
      stats: [
        { label: "PROGRAM STUDI S1-S3", value: "290+" },
        { label: "DOSEN & PENELITI TETAP", value: "1.900+" },
        { label: "AKREDITASI INTERNASIONAL", value: "85%" }
      ],
      angle: 45
    },
    {
      id: 2,
      number: "03",
      title: "SEJARAH & TRADISI",
      heading: "Warisan kecemerlangan sejak tahun 1954.",
      description: "Berdiri tegak sebagai pionir pendidikan tinggi nasional yang konsisten menjaga mutu akademik dan pengabdian masyarakat.",
      stats: [
        { label: "ALUMNI TERSEBAR", value: "340K+" },
        { label: "TAHUN DEDIKASI", value: "70+" },
        { label: "KLASTER PTN TERBAIK", value: "1" }
      ],
      angle: 90
    }
  ];

  const currentActiveAngle = points[activeIndex].angle;
  const rotationAngle = -currentActiveAngle;

  return (
    <section className="interactive-circle-section">
      <div className="container interactive-grid">
        
        {/* Left Side: Interactive Circle */}
        <div className="circle-visualization-container">
          <div className="circle-track-wrapper">
            {/* The actual rotating dark circle line */}
            <div 
              className="rotating-dark-ring" 
              style={{ 
                transform: `rotate(${rotationAngle}deg)`,
                transition: 'transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)' 
              }}
            >
              {/* Outer border glow line */}
              <div className="ring-line"></div>
              
              {/* The interactive points / buttons */}
              {points.map((pt, index) => {
                const isActive = activeIndex === index;
                const ptTransform = `rotate(${pt.angle}deg) translate(280px) rotate(${-pt.angle - rotationAngle}deg)`;
                
                return (
                  <button
                    key={pt.id}
                    className={`circle-dot-button ${isActive ? 'active' : ''}`}
                    style={{ 
                      transform: ptTransform,
                      transition: 'background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease, transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)'
                    }}
                    onClick={() => setActiveIndex(index)}
                  >
                    <span className="dot-number">{pt.number}</span>
                    <span className="dot-title">{pt.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Dynamic Content */}
        <div className="dynamic-info-container">
          <h2 className="main-heading">
            Kampus yang menggerakkan <br />
            <span className="text-highlight">kemajuan.</span>
          </h2>
          
          <div className="content-card-holder">
            {points.map((pt, index) => {
              const isActive = activeIndex === index;
              return (
                <div 
                  key={pt.id} 
                  className={`fade-content-block ${isActive ? 'active' : ''}`}
                >
                  <div className="section-badge">{pt.title}</div>
                  <h3 className="sub-heading">{pt.heading}</h3>
                  <p className="description-text">{pt.description}</p>
                  
                  <div className="horizontal-stats-grid">
                    {pt.stats.map((st, i) => (
                      <div key={i} className="mini-stat-item">
                        <div className="mini-stat-value">{st.value}</div>
                        <div className="mini-stat-label">{st.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

// UI 9 Core Values Data
const UI_NILAI_DASAR = [
  { no: 1, nama: "Kejujuran", deskripsi: "Kelurusan hati, ketulusan, kesetaraan antara kata dan tindakan, serta ketidakberpihakan pada kebohongan." },
  { no: 2, nama: "Keadilan", deskripsi: "Memberikan perlakuan yang setara, seimbang, dan proporsional bagi setiap individu berdasarkan hak dan kewajibannya." },
  { no: 3, nama: "Keterbukaan", deskripsi: "Ketersediaan untuk membagikan informasi yang relevan secara transparan, akuntabel, dan mudah diakses." },
  { no: 4, nama: "Keberadaban", deskripsi: "Menjunjung tinggi etika, kesantunan, penghormatan terhadap sesama, dan nilai-nilai kemanusiaan." },
  { no: 5, nama: "Kepedulian", deskripsi: "Kepekaan dan tindakan nyata dalam membantu, memperhatikan, serta menghargai kebutuhan orang lain dan lingkungan." },
  { no: 6, nama: "Keterpercayaan", deskripsi: "Sikap konsisten yang melahirkan keyakinan bahwa seseorang dapat diandalkan dan berintegritas tinggi." },
  { no: 7, nama: "Tanggung Jawab", deskripsi: "Kesadaran dan kesiapan untuk menanggung segala konsekuensi dari tindakan dan keputusan yang diambil." },
  { no: 8, nama: "Sinergi", deskripsi: "Kolaborasi aktif dan harmonis untuk menghasilkan kekuatan atau nilai tambah yang lebih besar." },
  { no: 9, nama: "Kebersamaan", deskripsi: "Semangat kekeluargaan, persatuan, dan gotong royong dalam mencapai visi dan misi bersama." }
];

export default function Home() {
  // ── Splash shows on every page load (no sessionStorage) ──
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashEnter = () => setSplashDone(true);

  // ── Hero reveal: gradient + stats animate in after 500ms ──
  const [heroRevealed, setHeroRevealed] = useState(false);
  useEffect(() => {
    if (!splashDone) return;
    const t = setTimeout(() => setHeroRevealed(true), 500);
    return () => clearTimeout(t);
  }, [splashDone]);


  const [news, setNews] = useState([]);
  const [subdirectorates, setSubdirectorates] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [selectedNews, setSelectedNews] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [showValuesModal, setShowValuesModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // About Section Interactive Tab State
  const [aboutTab, setAboutTab] = useState('profil');

  // Header scroll state
  const [scrolled, setScrolled] = useState(false);

  // Talent Programs State
  const [talentPrograms, setTalentPrograms] = useState([]);

  const getTalentDateDetails = (dateStr) => {
    if (!dateStr) return { day: '--', monthAbbrev: '---' };
    const monthsAbbrev = [
      'JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN',
      'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'
    ];
    const match = dateStr.match(/^(\d+)\s+([A-Za-z]+)\s+(\d+)$/);
    if (match) {
      const day = match[1];
      const monthName = match[2].toLowerCase();
      let monthAbbrev = '---';
      const indonesianMonths = [
        'januari', 'februari', 'maret', 'april', 'mei', 'juni',
        'juli', 'agustus', 'september', 'oktober', 'november', 'desember'
      ];
      const idx = indonesianMonths.indexOf(monthName);
      if (idx !== -1) {
        monthAbbrev = monthsAbbrev[idx];
      } else {
        monthAbbrev = monthName.substring(0, 3).toUpperCase();
      }
      return { day, monthAbbrev };
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      const parts = dateStr.split(' ');
      if (parts.length >= 2) {
        return { day: parts[0], monthAbbrev: parts[1].substring(0, 3).toUpperCase() };
      }
      return { day: '--', monthAbbrev: '---' };
    }
    return {
      day: String(d.getDate()),
      monthAbbrev: monthsAbbrev[d.getMonth()]
    };
  };



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

  // Scroll-reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('aos-visible');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    const targets = document.querySelectorAll('.aos-init');
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch Settings
        const settingsRes = await fetch(`${BACKEND_URL}/api/settings`);
        if (!settingsRes.ok) throw new Error('Gagal mengambil data settings.');
        const settingsData = await settingsRes.json();
        setSettings(settingsData);

        // Fetch Subdirectorates
        const subsRes = await fetch(`${BACKEND_URL}/api/subdirectorates`);
        if (!subsRes.ok) throw new Error('Gagal mengambil data subdirektorat.');
        const subsData = await subsRes.json();
        setSubdirectorates(subsData);

        // Fetch News (homepage: max 6)
        const newsRes = await fetch(`${BACKEND_URL}/api/news?limit=6&page=1`);
        if (!newsRes.ok) throw new Error('Gagal mengambil data berita.');
        const newsPayload = await newsRes.json();
        setNews(newsPayload.data || []);

        // Fetch Talent Programs
        const talentRes = await fetch(`${BACKEND_URL}/api/pengembangan-talenta`);
        if (talentRes.ok) {
          const talentData = await talentRes.json();
          if (Array.isArray(talentData)) {
            setTalentPrograms(talentData);
          }
        }

        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getSubIcon = (iconName) => {
    switch (iconName) {
      case 'people':
        return <Users size={28} />;
      case 'user':
        return <User size={28} />;
      case 'globe':
        return <Globe size={28} />;
      case 'phone':
        return <PhoneCall size={28} />;
      default:
        return <Users size={28} />;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' }}>
        <div style={{ width: '50px', height: '50px', border: '5px solid #E2E8F0', borderTop: '5px solid #0A1E38', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {!splashDone && (
        <SplashIntro onEnter={handleSplashEnter} />
      )}

      <Navbar />


      {/* Hero Section — image fills viewport, gradient + stats reveal after 1.5s */}
      <section
        className="hero"
        style={{ backgroundImage: `url(${getImageUrl('/uploads/opening_building.png')})` }}
        id="hero-section"
      >
        <div className={`hero-gradient-overlay${heroRevealed ? ' revealed' : ''}`} />
        <div className="hero-statistics-container">
          <div className="hero-statistics-grid">

            {[{t:1,l:'Klaster PTN Terbaik Indonesia',s:'QS ASIA UNIVERSITY RANKINGS',delay:'0.1s',rd:'0s'},
              {t:18400,suf:'+',l:'Mahasiswa Aktif Program S1-S3',s:'SELURUH FAKULTAS',delay:'0.2s',rd:'0.1s'},
              {t:2100,suf:'+',l:'Mahasiswa Internasional',s:'LEBIH DARI 60 NEGARA',delay:'0.3s',rd:'0.2s'},
              {t:1900,suf:'+',l:'Dosen & Peneliti Tetap',s:'14 FAKULTAS, 2 SEKOLAH',delay:'0.4s',rd:'0.3s'},
              {t:450,suf:'+',l:'Mitra Universitas Global',s:'KERJA SAMA INTERNASIONAL',delay:'0.5s',rd:'0.4s'},
              {t:1954,l:'Tahun Berdiri Sebagai PTN',s:'WARISAN AKADEMIK',delay:'0.6s',rd:'0.5s'},
            ].map((stat, i) => (
              <div
                key={i}
                className={`stat-card${heroRevealed ? ' revealed' : ''}`}
                style={{ '--delay': stat.delay, '--reveal-delay': stat.rd }}
              >
                <div className="stat-pin-wrapper">
                  <div className="stat-pin-glow" />
                  <div className="stat-pin-line" />
                </div>
                <div className="stat-value"><Counter target={stat.t} suffix={stat.suf || ''} active={heroRevealed} /></div>
                <div className="stat-label">{stat.l}</div>
                <div className="stat-sub">{stat.s}</div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* Interactive Rotating Circle Section */}
      <InteractiveRotatingCircle />

      {/* About Section (Premium Interactive Showcase) */}
      <section id="about" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <div className="about-grid">
            
            {/* Left Column: Interactive Image Showcase */}
            <div className="about-image-showcase aos-init aos-fade-right">
              {/* Glowing Background Blob */}
              <div className="about-glow-blob" />
              
              {/* Decorative Frame */}
              <div className="about-image-frame">
                <img 
                  src={getImageUrl(settings.profil_image || settings.about_image || '/uploads/profile_group.jpg')} 
                  alt="Direktorat SDM UI Staff" 
                  className="about-image-main"
                />
                
                {/* Decorative border layers */}
                <div className="frame-border-decor" />
              </div>
            </div>
            
            {/* Right Column: Interactive Content Tabs */}
            <div className="about-interactive-content aos-init aos-fade-left" style={{ transitionDelay: '0.15s' }}>
              <div className="section-overline">Tentang Direktorat</div>
              <h2>{settings.about_title || 'Tentang Direktorat SDM dan Pengembangan Talenta'}</h2>
              
              {/* Interactive Tabs */}
              <div className="about-tabs">
                <button 
                  className={`about-tab-btn ${aboutTab === 'profil' ? 'active' : ''}`}
                  onClick={() => setAboutTab('profil')}
                >
                  Profil
                </button>
                <button 
                  className={`about-tab-btn ${aboutTab === 'program-kerja' ? 'active' : ''}`}
                  onClick={() => setAboutTab('program-kerja')}
                >
                  Program Kerja
                </button>
              </div>

              {/* Tab Contents with smooth fade */}
              <div className="about-tab-body">
                {aboutTab === 'profil' && (
                  <div className="tab-pane fade-in">
                    <p>{settings.about_text || 'Direktorat SDM dan Pengembangan Talenta adalah salah satu Direktorat yang di bawah Wakil Rektor bidang Perencanaan, Keuangan, dan SDM. Menjadikan UI sebagai Pusat Talenta terbaik merupakan sasaran strategis yang diamanahkan kepada Direktorat SDM dan Pengembangan Talenta sebagaimana tertuang dalam Rencana Strategis (Renstra) Universitas Indonesia tahun 2024-2029.'}</p>
                  </div>
                )}
                {aboutTab === 'program-kerja' && (
                  <div className="tab-pane fade-in">
                    <div className="about-program-kerja-grid">
                      <div className="pk-mini-card">
                        <div className="feat-dot" />
                        <div className="pk-card-title">Pengembangan Kapasitas</div>
                      </div>
                      <div className="pk-mini-card">
                        <div className="feat-dot" />
                        <div className="pk-card-title">Akuisisi Talenta</div>
                      </div>
                      <div className="pk-mini-card">
                        <div className="feat-dot" />
                        <div className="pk-card-title">Merit System</div>
                      </div>
                      <div className="pk-mini-card">
                        <div className="feat-dot" />
                        <div className="pk-card-title">Optimasi Insentif</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <a href="/profil" className="btn-secondary" id="about-read-more-btn" style={{ marginTop: '2rem', alignSelf: 'flex-start' }}>
                Selengkapnya
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section id="core-values">
        <div className="container values-grid">
          <div className="values-content aos-init aos-fade-right">
            <h2>{settings.values_title || '9 Nilai Dasar Universitas Indonesia'}</h2>
            <p>{settings.values_text || 'Demi mewujudkan visi UI...'}</p>
            <a href="/informasi" className="btn-secondary" id="values-details-btn">
              Selengkapnya
            </a>
          </div>
          <div className="values-image-wrapper aos-init aos-fade-left" style={{ transitionDelay: '0.15s' }}>
            <img 
              src={getImageUrl('/uploads/nilaidasar.jpg')} 
              alt="9 Nilai Dasar UI" 
            />
          </div>
        </div>
      </section>

      {/* Pengembangan Talenta & Jadwal Training Section */}
      <section className="section-alt" id="home-talent-showcase" style={{ padding: '4.5rem 0', backgroundColor: '#F8FAFC' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0A1E38', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>
              Pengembangan Talenta
            </h2>
            <p style={{ color: '#576574', fontSize: '0.98rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
              Tingkatkan kompetensi melalui program pelatihan yang dirancang khusus maupun umum untuk sivitas akademika UI.
            </p>
          </div>

          <div className="home-talent-dashboard-grid">
            
            {/* Left Column: Jadwal Pelatihan Mendatang */}
            <div className="upcoming-training-panel">
              <div className="panel-header">
                <h3>Jadwal Pelatihan Mendatang</h3>
                <a href="/pengembangan-talenta/jadwal-training" className="see-all-link">
                  Lihat Semua &rarr;
                </a>
              </div>
              
              <div className="training-list">
                {talentPrograms.slice(0, 2).map((item) => {
                  const { day, monthAbbrev } = getTalentDateDetails(item.date);
                  return (
                    <div key={item.id} className="training-item-card">
                      <div className={`date-badge ${item.type}`}>
                        <span className="badge-day">{day}</span>
                        <span className="badge-month">{monthAbbrev}</span>
                      </div>
                      <div className="training-item-details">
                        <span className={`type-tag ${item.type}`}>
                          {item.type === 'internal' ? 'INTERNAL' : 'PUBLIK'}
                        </span>
                        <h4>{item.title}</h4>
                        <div className="training-item-meta">
                          <span className="meta-text" style={{ display: 'inline-flex', alignItems: 'center' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px' }}>
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            {item.time || '09:00 - 15:00'}
                          </span>
                          <span className="meta-text" style={{ display: 'inline-flex', alignItems: 'center' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px' }}>
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                              <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            {item.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {talentPrograms.length === 0 && (
                  <div style={{ padding: '2rem 1.5rem', textAlign: 'center', color: '#576574', background: '#ffffff', borderRadius: '12px' }}>
                    Belum ada jadwal pelatihan mendatang.
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Portal Cards & Stats */}
            <div className="talent-portal-sidebar">
              
              {/* Top Card: Dark Blue Portal Link */}
              <div className="talent-portal-cta-card">
                <div className="cta-icon-overlay" />
                <h3>Pengembangan Talenta</h3>
                <p>Akses modul pembelajaran dan sertifikasi untuk pengembangan karir Anda.</p>
                <a href="/pengembangan-talenta" className="cta-action-btn">
                  Lihat
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginLeft: '6px' }}>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              </div>
              
              {/* Bottom Row: Stats Cards */}
              <div className="talent-stats-row">
                <div className="stat-box-card">
                  <span className="stat-box-value">
                    {talentPrograms.filter(p => p.type === 'internal').length || 24}
                  </span>
                  <span className="stat-box-label">INTERNAL</span>
                </div>
                <div className="stat-box-card">
                  <span className="stat-box-value">
                    {talentPrograms.filter(p => p.type === 'public').length || 12}
                  </span>
                  <span className="stat-box-label">PUBLIK</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* News Section */}
      <section className="section-alt" id="news">
        <div className="container">
          <div className="section-header aos-init aos-fade-up">
            <h2>Berita</h2>
          </div>
          <div className="news-grid">
            {news.map((item, idx) => (
              <a href={`/berita/${item.slug || slugify(item.title)}`} key={item.id} className="news-card aos-init aos-fade-up" id={`news-card-${item.id}`} style={{ textDecoration: 'none', color: 'inherit', transitionDelay: `${idx * 0.08}s` }}>
                <div className="news-img-wrapper">
                  <img src={getImageUrl(item.image_url)} alt={item.title} className="news-img" />
                </div>
                <div className="news-body">
                  <span className="news-date">{formatDate(item.published_at)}</span>
                  <h3 className="news-title">{item.title}</h3>
                  <span className="btn-secondary" style={{ alignSelf: 'flex-start', fontSize: '0.8rem', padding: '0.45rem 1.25rem', marginTop: 'auto' }} id={`news-read-btn-${item.id}`}>
                    Selengkapnya
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* MODALS */}
      
      {/* 1. News Details Modal */}
      {selectedNews && (
        <div className="modal-overlay" onClick={() => setSelectedNews(null)} id="news-modal">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedNews(null)} id="close-news-modal">
              <X size={18} />
            </button>
            <div className="modal-scrollable">
              <div className="modal-img-wrapper">
                <img src={getImageUrl(selectedNews.image_url)} alt={selectedNews.title} className="modal-img" />
              </div>
              <div className="modal-meta">
                <Calendar size={14} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'middle' }} />
                <span style={{ verticalAlign: 'middle' }}>{formatDate(selectedNews.published_at)}</span>
              </div>
              <h2 className="modal-title">{selectedNews.title}</h2>
              <div className="modal-body-text">{selectedNews.content}</div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Subdirectorate Details Modal */}
      {selectedSub && (
        <div className="modal-overlay" onClick={() => setSelectedSub(null)} id="sub-modal">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedSub(null)} id="close-sub-modal">
              <X size={18} />
            </button>
            <div className="modal-scrollable">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50px', backgroundColor: '#F2C94C', color: '#0A1E38', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {getSubIcon(selectedSub.icon)}
                </div>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{selectedSub.name}</h2>
              </div>
              <p className="modal-body-text">{selectedSub.description}</p>
              <div style={{ marginTop: '2.5rem', padding: '1.5rem', backgroundColor: '#F8FAFC', borderRadius: '12px', borderLeft: '4px solid #0A1E38' }}>
                <h4 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={18} /> Layanan & Tanggung Jawab
                </h4>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.95rem', color: '#576574', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <li>Pelayanan operasional subdirektorat secara digital.</li>
                  <li>Implementasi kebijakan taktis direktorat SDM.</li>
                  <li>Kemitraan strategis dengan unit kerja di lingkungan Universitas Indonesia.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}



    </div>
  );
}
