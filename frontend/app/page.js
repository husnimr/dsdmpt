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
  ChevronLeft,
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

const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
};

const slugify = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const STATIC_FALLBACK_NEWS = [
  {
    id: 'f1',
    title: 'UI Memperkuat Ekosistem Inovasi untuk Indonesia Berkelanjutan',
    summary: 'Universitas Indonesia terus berkomitmen meningkatkan hilirisasi hasil riset guna memberikan dampak nyata bagi masyarakat dan industri.',
    image_url: '/uploads/riset_inovasi.jpg',
    published_at: '2026-08-12',
    slug: 'ui-memperkuat-ekosistem-inovasi-untuk-indonesia-berkelanjutan'
  }
];

const STATIC_FALLBACK_INFO = [
  {
    id: 'i1',
    title: 'Pendaftaran Program Talenta Kepemimpinan Dosen & Tendik',
    content: 'Direktorat SDM dan Pengembangan Talenta UI kembali membuka pendaftaran program pelatihan kepemimpinan untuk meningkatkan kompetensi manajerial.',
    image_url: '/uploads/training_announcement.jpg'
  }
];

const STACKED_VALUES_DATA = [
  {
    index: "01",
    title: "Kejujuran, Keadilan & Keterbukaan",
    description: "Landasan dasar integritas sivitas akademika Universitas Indonesia dalam bersikap, bertindak, dan membagikan informasi secara adil dan transparan.",
    image: "/uploads/nilaidasar.jpg",
    pills: [
      { name: "Kejujuran", index: 1 },
      { name: "Keadilan", index: 2 },
      { name: "Keterbukaan", index: 3 }
    ]
  },
  {
    index: "02",
    title: "Keberadaban, Kepedulian & Keterpercayaan",
    description: "Menjunjung tinggi kesantunan etika sosial, kepekaan terhadap kebutuhan sesama, serta memelihara amanah dengan penuh komitmen.",
    image: "/uploads/nilaidasar.jpg",
    pills: [
      { name: "Keberadaban", index: 4 },
      { name: "Kepedulian", index: 5 },
      { name: "Keterpercayaan", index: 6 }
    ]
  },
  {
    index: "03",
    title: "Tanggung Jawab, Sinergi & Kebersamaan",
    description: "Kesiapan menanggung dampak tindakan, berkolaborasi secara aktif, dan mengutamakan semangat gotong royong untuk visi bersama.",
    image: "/uploads/nilaidasar.jpg",
    pills: [
      { name: "Tanggung Jawab", index: 7 },
      { name: "Sinergi", index: 8 },
      { name: "Kebersamaan", index: 9 }
    ]
  }
];

// Animated counter helper component
const Counter = ({ target, duration = 1500, suffix = "", active = false, delay = 0 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);

  useEffect(() => {
    if (!active) {
      setCount(0);
      return;
    }
    let startTime = null;
    let timerId = null;

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
    
    const startCount = () => {
      countRef.current = window.requestAnimationFrame(step);
    };

    if (delay > 0) {
      timerId = setTimeout(startCount, delay);
    } else {
      startCount();
    }

    return () => {
      if (timerId) clearTimeout(timerId);
      if (countRef.current) {
        window.cancelAnimationFrame(countRef.current);
      }
    };
  }, [target, duration, active, delay]);

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
      title: "STATISTIK PEGAWAI",
      heading: "Statistik Dosen & Tenaga Kependidikan UI",
      description: "Akses data statistik real-time mengenai profil dosen PNS, tetap non-PNS, NIDK, serta profil tenaga kependidikan di lingkungan Universitas Indonesia.",
      link: "/statistik",
      stats: [
        { label: "DOSEN & PENELITI", value: "1.900+" },
        { label: "TENAGA KEPENDIDIKAN", value: "2.000+" },
        { label: "FAKULTAS/SEKOLAH", value: "17+" }
      ],
      angle: 0
    },
    {
      id: 1,
      number: "02",
      title: "GLOBAL TALENT",
      heading: "Program Global Talent Universitas Indonesia",
      description: "Mengembangkan talenta berstandar internasional melalui program mobilitas, pertukaran keahlian, dan kemitraan akademik global.",
      link: "/global-talent",
      stats: [
        { label: "MITRA AKADEMIK GLOBAL", value: "450+" },
        { label: "MAHASISWA INTERNASIONAL", value: "2.100+" },
        { label: "PROGRAM STUDI S1-S3", value: "290+" }
      ],
      angle: 45
    },
    {
      id: 2,
      number: "03",
      title: "REKRUTMEN PEGAWAI",
      heading: "Bergabung bersama Universitas Indonesia",
      description: "Buka peluang karier akademis dan profesional terbaik Anda di kampus perjuangan. Temukan posisi rekrutmen dosen dan tendik terbaru.",
      link: "/rekrutmen",
      stats: [
        { label: "LOWONGAN DOSEN & TENDIK", value: "Tersedia" },
        { label: "KUALIFIKASI TALENTA", value: "Unggul" },
        { label: "PROSES SELEKSI", value: "Transparan" }
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
                  
                  <div style={{ marginTop: '2rem' }}>
                    <a href={pt.link} className="btn-secondary">
                      Selengkapnya
                    </a>
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
  // ── Splash Intro: hanya muncul pertama kali (disimpan di sessionStorage agar refresh tidak muncul lagi) ──
  const [splashDone, setSplashDone] = useState(true);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem('dsdmpt_splash_seen');
    if (!hasSeen) {
      setSplashDone(false);
      sessionStorage.setItem('dsdmpt_splash_seen', 'true');
    }
  }, []);

  const handleSplashEnter = () => {
    sessionStorage.setItem('dsdmpt_splash_seen', 'true');
    setSplashDone(true);
  };

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

  const [newsTab, setNewsTab] = useState('berita');
  const [slideIndex, setSlideIndex] = useState(0);
  const [informasi, setInformasi] = useState([]);

  // Scroll progress for Core Values section unstacking effect
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.getElementById('core-values');
      if (!el) return;
      
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Trigger unstacking from the moment section enters viewport until it scrolls past half of its height
      const startScroll = windowHeight; 
      const endScroll = -100;
      
      const total = startScroll - endScroll;
      const current = startScroll - rect.top;
      
      let progress = current / total;
      progress = Math.max(0, Math.min(1, progress));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger initial calculation
    setTimeout(handleScroll, 100);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeList = newsTab === 'berita' 
    ? (news.length > 0 ? news : STATIC_FALLBACK_NEWS) 
    : (informasi.length > 0 ? informasi : STATIC_FALLBACK_INFO);

  const currentSlide = activeList[slideIndex] || activeList[0] || {};

  const nextSlide = () => {
    setSlideIndex((prev) => (prev + 1) % activeList.length);
  };

  const prevSlide = () => {
    setSlideIndex((prev) => (prev - 1 + activeList.length) % activeList.length);
  };

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

        // Fetch Informasi
        const infoRes = await fetch(`${BACKEND_URL}/api/informasi`);
        if (infoRes.ok) {
          const infoData = await infoRes.json();
          if (Array.isArray(infoData)) {
            setInformasi(infoData);
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
                  <div className="stat-meteor" />
                  <div className="stat-pin-glow" />
                  <div className="stat-pin-line" />
                </div>
                <div className="stat-value">
                  <Counter 
                    target={stat.t} 
                    suffix={stat.suf || ''} 
                    active={heroRevealed} 
                    delay={parseFloat(stat.delay) * 1000 + 750} 
                  />
                </div>
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
      <section id="about" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#FAFBFD' }}>
        {/* Background Decorations */}
        <div className="about-deco-sphere-left">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            <circle cx="100" cy="100" r="99" stroke="rgba(10,30,56,0.18)" strokeWidth="0.8"/>
            <path d="M100 1L100 199" stroke="rgba(10,30,56,0.18)" strokeWidth="0.8"/>
            <path d="M1 100H199" stroke="rgba(10,30,56,0.18)" strokeWidth="0.8"/>
            <path d="M100 1C135.5 30 160 60 160 100C160 140 135.5 170 100 199C64.5 170 40 140 40 100C40 60 64.5 30 100 1" stroke="rgba(10,30,56,0.18)" strokeWidth="0.8"/>
            <path d="M100 1C150 40 180 70 180 100C180 130 150 160 100 199C50 160 20 130 20 100C20 70 50 40 100 1" stroke="rgba(10,30,56,0.12)" strokeWidth="0.6"/>
            <path d="M1 100C30 135.5 60 160 100 160C140 160 170 135.5 199 100C170 64.5 140 40 100 40C60 40 30 64.5 1 100Z" stroke="rgba(10,30,56,0.18)" strokeWidth="0.8"/>
            <path d="M1 100C40 150 70 180 100 180C130 180 160 150 199 100C160 50 130 20 100 20C70 20 40 50 1 100Z" stroke="rgba(10,30,56,0.12)" strokeWidth="0.6"/>
          </svg>
        </div>
        <div className="about-deco-sphere-right"></div>
        <div className="about-deco-wave">
          <svg viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
            <path d="M0,224L80,202.7C160,181,320,139,480,138.7C640,139,800,181,960,192C1120,203,1280,181,1360,170.7L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z" fill="url(#gradient-about-wave)" opacity="0.08"/>
            <defs>
              <linearGradient id="gradient-about-wave" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0A1E38"/>
                <stop offset="100%" stopColor="#FFC72C"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
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
      <section id="core-values" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#0A1E38', color: '#ffffff', padding: '6rem 0' }}>
        {/* Animated Background Elements */}
        <div className="values-deco-sphere-left">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            <circle cx="100" cy="100" r="99" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8"/>
            <path d="M100 1C135.5 30 160 60 160 100C160 140 135.5 170 100 199" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8"/>
            <path d="M1 100C30 135.5 60 160 100 160C140 160 170 135.5 199 100" stroke="rgba(255,255,255,0.05)" strokeWidth="0.6"/>
          </svg>
        </div>
        <div className="values-deco-glow-right"></div>
        <div className="values-deco-particles"></div>
        <div className="values-deco-grid-overlay"></div>
        
        {/* Floating Motif Elements */}
        <div className="values-deco-floating-item item-1">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5">
            <line x1="20" y1="0" x2="20" y2="40" />
            <line x1="0" y1="20" x2="40" y2="20" />
          </svg>
        </div>
        <div className="values-deco-floating-item item-2">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5">
            <circle cx="30" cy="30" r="28" strokeDasharray="5 5" />
          </svg>
        </div>
        <div className="values-deco-floating-item item-3">
          <svg width="46" height="46" viewBox="0 0 50 50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5">
            <rect x="5" y="5" width="40" height="40" transform="rotate(45 25 25)" />
          </svg>
        </div>
        <div className="values-deco-floating-item item-4">
          <svg width="70" height="70" viewBox="0 0 80 80" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5">
            <polygon points="40,10 70,65 10,65" />
          </svg>
        </div>
        <div className="values-deco-floating-item item-5">
          <div className="values-deco-dots-matrix" />
        </div>

        <div className="container values-grid" style={{ position: 'relative', zIndex: 2 }}>
          <div className="values-content aos-init aos-fade-right">
            <h2>{settings.values_title || '9 Nilai Dasar Universitas Indonesia'}</h2>
            <p>{settings.values_text || 'Sembilan Nilai Dasar Universitas Indonesia (UI) menjadi tuntunan moral, etika, dan perilaku utama bagi seluruh sivitas akademika dalam mewujudkan tri dharma perguruan tinggi.'}</p>
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
      <section className="section-alt aos-init aos-fade-up" id="home-talent-showcase" style={{ padding: '4.5rem 0 5.5rem 0', backgroundColor: '#F8FAFC' }}>
        {/* Background Hiasan Profesional */}
        <div className="talent-deco-sphere-left">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            <circle cx="100" cy="100" r="99" stroke="rgba(10,30,56,0.04)" strokeWidth="0.8"/>
            <path d="M100 1C135.5 30 160 60 160 100C160 140 135.5 170 100 199" stroke="rgba(10,30,56,0.04)" strokeWidth="0.8"/>
            <path d="M1 100C30 135.5 60 160 100 160C140 160 170 135.5 199 100" stroke="rgba(10,30,56,0.03)" strokeWidth="0.6"/>
          </svg>
        </div>
        <div className="talent-deco-grid-right"></div>
        <div className="talent-deco-wave-bottom">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
            <path d="M0,96L120,80C240,64,480,32,720,32C960,32,1200,64,1320,80L1440,96L1440,120L1320,120C1200,120,960,120,720,120C480,120,240,120,120,120L0,120Z" fill="rgba(10,30,56,0.02)"/>
          </svg>
        </div>
        <div className="talent-deco-grid-overlay"></div>

        {/* Floating Motif Elements */}
        <div className="talent-deco-floating-item t-item-1">
          <svg width="35" height="35" viewBox="0 0 40 40" fill="none" stroke="rgba(10,30,56,0.07)" strokeWidth="1.5">
            <line x1="20" y1="0" x2="20" y2="40" />
            <line x1="0" y1="20" x2="40" y2="20" />
          </svg>
        </div>
        <div className="talent-deco-floating-item t-item-2">
          <svg width="50" height="50" viewBox="0 0 60 60" fill="none" stroke="rgba(10,30,56,0.06)" strokeWidth="1.5">
            <circle cx="30" cy="30" r="28" strokeDasharray="4 4" />
          </svg>
        </div>
        <div className="talent-deco-floating-item t-item-3">
          <svg width="40" height="40" viewBox="0 0 50 50" fill="none" stroke="rgba(10,30,56,0.05)" strokeWidth="1.5">
            <rect x="5" y="5" width="40" height="40" transform="rotate(45 25 25)" />
          </svg>
        </div>
        <div className="talent-deco-floating-item t-item-4">
          <svg width="60" height="60" viewBox="0 0 80 80" fill="none" stroke="rgba(10,30,56,0.04)" strokeWidth="1.5">
            <polygon points="40,12 68,60 12,60" />
          </svg>
        </div>
        <div className="talent-deco-floating-item t-item-5">
          <div className="values-deco-dots-matrix" style={{ opacity: 0.08 }} />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          
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
            <div className="upcoming-training-panel aos-init aos-fade-right" style={{ transitionDelay: '0.15s' }}>
              <div className="panel-header">
                <h3>Jadwal Training</h3>
                <a href="/pengembangan-talenta/jadwal-training" className="see-all-link">
                  Lihat Semua
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
                    Belum ada jadwal training mendatang.
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Portal Cards & Stats */}
            <div className="talent-portal-sidebar aos-init aos-fade-left" style={{ transitionDelay: '0.3s' }}>
              
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

      {/* News & Information Slider Section */}
      <section className="section-alt" id="news" style={{ padding: '5.5rem 0 3.5rem 0', backgroundColor: '#0A1E38', color: '#ffffff', position: 'relative', overflow: 'hidden' }}>
        {/* Background Abstract Elements */}
        <div className="news-deco-sphere-left">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            <circle cx="100" cy="100" r="99" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8"/>
            <path d="M100 1C135.5 30 160 60 160 100C160 140 135.5 170 100 199" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8"/>
            <path d="M1 100C30 135.5 60 160 100 160C140 160 170 135.5 199 100" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6"/>
          </svg>
        </div>
        <div className="news-deco-glow-right"></div>
        <div className="news-deco-grid-center"></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          
          <div className="news-slider-grid">
            
            {/* Left Column: Big Feature Image */}
            <div className="slider-image-panel aos-init aos-fade-right">
              <div className="slider-image-wrapper">
                {activeList.map((item, idx) => (
                  <img 
                    key={item.id || idx}
                    src={getImageUrl(item.image_url || '/uploads/riset_inovasi.jpg')} 
                    alt={item.title || 'DSDMPT'} 
                    className={`slider-main-img ${slideIndex === idx ? 'active' : ''}`} 
                  />
                ))}
              </div>
            </div>

            {/* Right Column: Content & Controls */}
            <div className="slider-content-panel aos-init aos-fade-left">
              
              {/* Category Switch Buttons (Anchor Links) */}
              <div className="slider-tabs">
                <a href="/berita" className="slider-tab-btn">
                  Berita
                </a>
                <a href="/informasi" className="slider-tab-btn">
                  Informasi
                </a>
              </div>

              {/* Dynamic Slide Details */}
              <div className="slider-body">
                {activeList.map((item, idx) => (
                  <div 
                    key={item.id || idx} 
                    className={`slider-text-block ${slideIndex === idx ? 'active' : ''}`}
                  >
                    <h2 className="slider-title">
                      {item.title || 'Menggerakkan Kemajuan Bersama'}
                    </h2>
                    <p className="slider-excerpt">
                      {stripHtml(item.summary || item.content || 'Akses pembaruan dan pengumuman resmi dari Direktorat SDM dan Pengembangan Talenta UI.')}
                    </p>
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                      <a 
                        href={`/berita/${item.slug || slugify(item.title)}`} 
                        className="btn-secondary"
                        style={{ textDecoration: 'none' }}
                      >
                        Baca Selengkapnya
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Slider Bottom Panel: Arrow Next/Prev and Large Counter */}
              <div className="slider-controls-row">
                
                {/* Navigation Arrows */}
                <div className="slider-arrows">
                  <button onClick={prevSlide} className="arrow-btn" aria-label="Sebelumnya">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={nextSlide} className="arrow-btn" aria-label="Berikutnya">
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* Big Counter */}
                <div className="slider-counter">
                  <span className="counter-current">
                    {String(slideIndex + 1).padStart(2, '0')}
                  </span>
                  <span className="counter-total">
                    / {String(activeList.length).padStart(2, '0')}
                  </span>
                </div>

              </div>

            </div>

            {/* Far Right Accent decoration - Circular text with arrow linking to news collection */}
            <a href="/berita" className="circular-text-deco-wrapper" style={{ cursor: 'pointer', pointerEvents: 'auto', textDecoration: 'none' }}>
              <div className="circular-arrow-icon">&rarr;</div>
              <svg viewBox="0 0 100 100" className="circular-text-svg">
                <path d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" id="circlePath" fill="none" />
                <text fill="rgba(255,255,255,0.25)" fontSize="7" fontWeight="800" letterSpacing="2px">
                  <textPath href="#circlePath">
                    DSDMPT &bull; KUMPULAN BERITA &bull; DSDMPT &bull; BERITA &bull;
                  </textPath>
                </text>
              </svg>
            </a>

          </div>

        </div>
      </section>
      
      {/* White spacer block to isolate news section from footer */}
      <div style={{ height: '4rem', backgroundColor: '#ffffff' }} />

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
