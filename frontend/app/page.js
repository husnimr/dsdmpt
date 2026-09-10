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
  const [sectionRevealed, setSectionRevealed] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionRevealed(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const points = [
    {
      id: 0,
      number: "01",
      title: "GLOBAL TALENT",
      heading: "Pengembangan SDM Berkelanjutan & Berdaya Saing Global",
      description: "Mewujudkan Universitas Indonesia sebagai Pusat Talenta unggul melalui tata kelola SDM yang profesional, adaptif, serta berintegritas tinggi. Kami berkomitmen mendukung mobilitas akademik, pengembangan kapasitas berkelanjutan, dan penguatan merit sistem demi mendorong kemajuan pendidikan serta riset berkelas dunia.",
      link: "/profil"
    },
    {
      id: 1,
      number: "02",
      title: "LAYANAN SDM",
      heading: "Layanan Kepegawaian Digital, Efisien & Transparan",
      description: "Memberikan kemudahan serta kenyamanan akses bagi seluruh dosen dan tenaga kependidikan dalam mengurus administrasi kepegawaian. Melalui integrasi portal digital DSDMPT, proses mutasi, layanan BKD, kenaikan pangkat, hingga sertifikasi dapat dilakukan secara efisien, akuntabel, dan tepat waktu.",
      link: "/subdirektorat"
    },
    {
      id: 2,
      number: "03",
      title: "PENGEMBANGAN",
      heading: "Pelatihan & Peningkatan Kompetensi SDM UI",
      description: "Menyediakan beragam program pengembangan kapasitas, workshop kepemimpinan, pelatihan teknologi, hingga program sertifikasi profesi. Kami terus memfasilitasi upskilling dan reskilling dosen serta tendik agar senantiasa siap menghadapi tantangan era transformasi digital.",
      link: "/pengembangan-talenta"
    },
    {
      id: 3,
      number: "04",
      title: "BERITA",
      heading: "Informasi & Berita Terkini Seputar SDM UI",
      description: "Sajikan publikasi berita resmi, liputan kegiatan strategis, serta pengumuman penting Direktorat SDM dan Pengembangan Talenta. Dapatkan pembaruan tepercaya mengenai kebijakan terbaru, penghargaan pegawai, dan agenda kegiatan di lingkungan Universitas Indonesia.",
      link: "/berita"
    },
    {
      id: 4,
      number: "05",
      title: "INFORMASI",
      heading: "Portal Dokumen & Layanan Informasi Pegawai",
      description: "Pusat akses dokumen resmi, panduan teknis BKD, modul pelatihan, surat edaran, serta pemahaman 9 Nilai Dasar Universitas Indonesia. Seluruh informasi disajikan secara transparan dan mudah diunduh untuk mendukung kelancaran tugas harian civitas akademika UI.",
      link: "/informasi"
    }
  ];

  const [nodeAngles, setNodeAngles] = useState([0, 35, 70, 290, 325]);

  const getRelIndex = (index, currentActive) => {
    let rel = (index - currentActive + 5) % 5;
    if (rel > 2) rel -= 5;
    return rel;
  };

  const handlePointClick = (clickedIndex) => {
    setActiveIndex(clickedIndex);
    const baseMap = { 0: 0, 1: 35, 2: 70, '-2': 290, '-1': 325 };

    setNodeAngles((prevAngles) => {
      return prevAngles.map((prevAngle, i) => {
        const rel = getRelIndex(i, clickedIndex);
        let base = baseMap[rel];
        let diff = (base - prevAngle) % 360;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        return prevAngle + diff;
      });
    });
  };

  return (
    <section ref={sectionRef} className={`interactive-circle-section ${sectionRevealed ? 'revealed' : ''}`}>
      {/* Mobile Top Heading */}
      <h2 className="main-heading mobile-top-heading">
        Kampus yang menggerakkan <span className="text-highlight">kemajuan.</span>
      </h2>

      <div className="interactive-full-wrapper">
      
        {/* Left Side: Wheel flush to left edge of screen */}
        <div className="circle-visualization-container">
          <div className="circle-track-wrapper">
            <div className="rotating-dark-ring">
              {/* Outer golden yellow ring line */}
              <div className="ring-line"></div>
              <div className="ring-dashed-orbit"></div>
              
              {/* The 5 interactive points on continuous wheel */}
              {points.map((pt, index) => {
                const isActive = activeIndex === index;
                const rel = getRelIndex(index, activeIndex);
                const nodeAngle = (nodeAngles && nodeAngles[index] !== undefined) ? nodeAngles[index] : (index * 35);

                let distClass = 'dist-0';
                if (rel === 0) {
                  distClass = 'dist-0';
                } else if (Math.abs(rel) === 1) {
                  distClass = 'dist-1';
                } else {
                  distClass = 'dist-2';
                }

                const ptTransform = `rotate(${nodeAngle}deg) translate(var(--orbit-radius, 259px)) rotate(${-nodeAngle}deg)`;
                
                return (
                  <button
                    key={pt.id}
                    className={`circle-dot-button ${isActive ? 'active' : ''} ${distClass}`}
                    style={{ 
                      transform: ptTransform,
                      transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease, width 0.4s ease, height 0.4s ease'
                    }}
                    onClick={() => handlePointClick(index)}
                  >
                    <span className="dot-number">{pt.number}</span>
                    <span className="dot-title">{pt.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Dynamic Content in White Floating Card */}
        <div className="dynamic-info-container">
          <div className="interactive-feature-card">

            <h2 className="main-heading desktop-heading" style={{ fontSize: '2.3rem', lineHeight: 1.25, marginBottom: '1.5rem', fontWeight: 800, textAlign: 'center' }}>
              Kampus yang menggerakkan <span className="text-highlight">kemajuan.</span>
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
                  <p className="description-text" title={pt.description}>{pt.description}</p>

                  <div className="circle-action-wrapper">
                    <a href={pt.link} className="btn-secondary circle-action-btn">
                      Selengkapnya
                    </a>
                  </div>
                </div>
              );
            })}
            </div>
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

  // About Section Interactive Tab & Mouse Parallax State
  const [aboutTab, setAboutTab] = useState('profil');
  const [aboutMouse, setAboutMouse] = useState({ x: 0, y: 0 });

  const handleAboutMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 30;
    const y = (e.clientY - rect.top - rect.height / 2) / 30;
    setAboutMouse({ x, y });
  };

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


      {/* Hero Section — background video or image fallback with smooth overlay */}
      <section
        className="hero"
        id="hero-section"
      >
        {/* Background Media (Video or Fallback Image) */}
        {settings?.hero_video_url ? (
          <video
            ref={(el) => { if (el) el.playbackRate = 0.75; }}
            autoPlay
            loop
            muted
            playsInline
            className="hero-bg-video"
            poster={getImageUrl(settings?.hero_image_url || '/uploads/opening_building.png')}
          >
            <source src={getImageUrl(settings.hero_video_url)} type="video/mp4" />
          </video>
        ) : (
          <video
            ref={(el) => { if (el) el.playbackRate = 0.75; }}
            autoPlay
            loop
            muted
            playsInline
            className="hero-bg-video"
            poster={getImageUrl('/uploads/opening_building.png')}
          >
            <source src={getImageUrl('/uploads/opening_building.mp4')} type="video/mp4" />
            <source src={getImageUrl('/uploads/opening_building.webm')} type="video/webm" />
            <img
              src={getImageUrl('/uploads/opening_building.png')}
              alt="Building Hero Background"
              className="hero-bg-fallback-img"
            />
          </video>
        )}

        <div className={`hero-gradient-overlay${heroRevealed ? ' revealed' : ''}`} />

        {/* Top Sky Header: DSDMPT (left) & Unggul Impactful (right) */}
        <div className={`hero-sky-overlay${heroRevealed ? ' revealed' : ''}`}>
          <div className="hero-sky-container">
            <div className="sky-brand-block sky-brand-left">
              <div className="sky-title-wrapper">
                <span className="sky-brand-title shimmer-text">DSDMPT</span>
                <span className="sparkle-star s1">✦</span>
                <span className="sparkle-star s2">✨</span>
              </div>
              <span className="sky-brand-sub">Direktorat Sumber Daya Manusia &amp; Pengembangan Talenta</span>
            </div>

            <div className="sky-brand-block sky-brand-right">
              <div className="sky-title-wrapper">
                <span className="sky-brand-title shimmer-text">Unggul Impactful</span>
                <span className="sparkle-star s3">✦</span>
                <span className="sparkle-star s4">✨</span>
              </div>
              <span className="sky-brand-sub">Universitas Indonesia</span>
            </div>
          </div>
        </div>

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

      {/* About Section: 3-Part Elegant Showcase Card Grid */}
      <section 
        id="about" 
        onMouseMove={handleAboutMouseMove}
        style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#FAFBFD', padding: '1rem 0 8rem 0' }}
      >
        {/* Interactive Abstract Background System */}
        <div className="about-abstract-container">
          {/* Glowing Blurring Orbs with Parallax */}
          <div 
            className="about-orb about-orb-1" 
            style={{ transform: `translate(${aboutMouse.x * -1.2}px, ${aboutMouse.y * -1.2}px)` }} 
          />
          <div 
            className="about-orb about-orb-2" 
            style={{ transform: `translate(${aboutMouse.x * 1.5}px, ${aboutMouse.y * 1.5}px)` }} 
          />
          <div 
            className="about-orb about-orb-3" 
            style={{ transform: `translate(${aboutMouse.x * -0.8}px, ${aboutMouse.y * 0.8}px)` }} 
          />

          {/* Rotating Geometric SVG Wireframes with Parallax */}
          <svg 
            className="about-ring-1" 
            viewBox="0 0 400 400" 
            fill="none" 
            style={{ transform: `translate(${aboutMouse.x * -0.5}px, ${aboutMouse.y * -0.5}px)` }}
          >
            <circle cx="200" cy="200" r="195" stroke="rgba(14,30,56,0.08)" strokeWidth="1.2" strokeDasharray="8 8" />
            <circle cx="200" cy="200" r="150" stroke="rgba(216,178,55,0.18)" strokeWidth="1" strokeDasharray="15 6" />
            <circle cx="200" cy="200" r="105" stroke="rgba(14,30,56,0.05)" strokeWidth="1" />
            <circle cx="200" cy="5" r="4" fill="#D8B237" />
            <circle cx="395" cy="200" r="4" fill="#0E1E38" opacity="0.3" />
          </svg>

          <svg 
            className="about-ring-2" 
            viewBox="0 0 400 400" 
            fill="none" 
            style={{ transform: `translate(${aboutMouse.x * 0.7}px, ${aboutMouse.y * 0.7}px)` }}
          >
            <circle cx="200" cy="200" r="180" stroke="rgba(216,178,55,0.15)" strokeWidth="1.5" strokeDasharray="12 12" />
            <circle cx="200" cy="200" r="120" stroke="rgba(14,30,56,0.08)" strokeWidth="1" strokeDasharray="4 8" />
            <circle cx="200" cy="20" r="5" fill="#F2C94C" />
          </svg>

          {/* Floating Abstract Motif Items */}
          <div className="about-float-item about-float-1" style={{ transform: `translate(${aboutMouse.x * -1}px, ${aboutMouse.y * -1}px)` }}>
            ✦
          </div>
          <div className="about-float-item about-float-2" style={{ transform: `translate(${aboutMouse.x * 1.3}px, ${aboutMouse.y * 1.3}px)` }}>
            <div className="about-dots-matrix" />
          </div>
          <div className="about-float-item about-float-3" style={{ transform: `translate(${aboutMouse.x * -0.6}px, ${aboutMouse.y * 0.9}px)` }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="4" y="4" width="24" height="24" rx="4" transform="rotate(45 16 16)" />
            </svg>
          </div>
        </div>

        <div className="container">
          
          {/* Section Header */}
          <div className="aos-init aos-perspective-up" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="section-overline" style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '2px', color: '#cda232', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Tentang Direktorat
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: '800', color: '#0E1E38', margin: '0' }}>
              SDM dan Pengembangan Talenta
            </h2>
          </div>

          {/* 3-Part Showcase Grid */}
          <div className="about-showcase-grid">

            {/* Card 1: Profil (Paling Besar + Foto) */}
            <a href="/profil" className="showcase-card showcase-card-main aos-init aos-perspective-up" style={{ transitionDelay: '0.1s' }}>
              <div className="showcase-img-container">
                <img 
                  src={getImageUrl(settings.profil_image || settings.about_image || '/uploads/profile_group.jpg')} 
                  alt="Profil Direktorat SDM UI" 
                  className="showcase-img"
                />
                <div className="showcase-img-overlay" />
              </div>
              <div className="showcase-card-content">
                <div className="showcase-badge">PROFIL DIREKTORAT</div>
                <h3 className="showcase-title">Profil DSDMPT Universitas Indonesia</h3>
                <p className="showcase-desc">
                  {settings.about_text ? (settings.about_text.substring(0, 140) + '...') : 'Menjadikan UI sebagai Pusat Talenta unggul melalui tata kelola SDM yang profesional, adaptif, serta berintegritas tinggi.'}
                </p>
                <div className="showcase-action">
                  BACA PROFIL <ArrowRight size={16} />
                </div>
              </div>
            </a>

            {/* Card 2: Struktur Organisasi (Navy Card, Agak Mengecil) */}
            <a href="/profil" className="showcase-card showcase-card-navy aos-init aos-perspective-up" style={{ transitionDelay: '0.25s' }}>
              <div className="showcase-card-inner">
                <div className="showcase-badge">STRUKTUR ORGANISASI</div>
                <h3 className="showcase-title">Bagan &amp; Struktur Organisasi</h3>
                <p className="showcase-desc">
                  Bagan tata kelola dan susunan subdirektorat DSDMPT Universitas Indonesia.
                </p>
              </div>
              <div className="showcase-action">
                LIHAT STRUKTUR <ArrowRight size={16} />
              </div>
            </a>

            {/* Card 3: Pimpinan Direktorat (Golden Card, Mengecil Lagi) */}
            <a href="/profil" className="showcase-card showcase-card-gold aos-init aos-perspective-up" style={{ transitionDelay: '0.4s' }}>
              <div className="showcase-card-inner">
                <div className="showcase-badge">PIMPINAN DIREKTORAT</div>
                <h3 className="showcase-title">Jajaran Pimpinan &amp; Manajemen</h3>
                <p className="showcase-desc">
                  Mengenal jajaran pimpinan dan tim manajemen DSDMPT Universitas Indonesia.
                </p>
              </div>
              <div className="showcase-action">
                LIHAT PIMPINAN <ArrowRight size={16} />
              </div>
            </a>

          </div>

        </div>

        {/* Wave Effect Bottom SVG transition to Core Values (#0A1E38) */}
        <div className="about-deco-wave">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%', height: 'auto' }}>
            <path d="M0,32L60,42.7C120,53,240,75,360,80C480,85,600,75,720,64C840,53,960,43,1080,48C1200,53,1320,75,1380,85.3L1440,96L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z" fill="#0A1E38"></path>
          </svg>
        </div>
      </section>

      {/* Core Values Section */}
      <section id="core-values" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#0A1E38', color: '#ffffff', padding: '6rem 0 11rem 0' }}>
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
          <div className="values-content aos-init aos-slide-rotate">
            <h2>{settings.values_title || '9 Nilai Dasar Universitas Indonesia'}</h2>
            <p>{settings.values_text || 'Sembilan Nilai Dasar Universitas Indonesia (UI) menjadi tuntunan moral, etika, dan perilaku utama bagi seluruh sivitas akademika dalam mewujudkan tri dharma perguruan tinggi.'}</p>
            <a href="/informasi" className="btn-secondary" id="values-details-btn">
              Selengkapnya
            </a>
          </div>
          <div className="values-image-wrapper aos-init aos-flip-3d" style={{ transitionDelay: '0.2s' }}>
            <img 
              src={getImageUrl('/uploads/nilaidasar.jpg')} 
              alt="9 Nilai Dasar UI" 
            />
          </div>
        </div>
        {/* Wave Effect Bottom SVG transition to Talent Development (#F8FAFC) */}
        <div className="values-deco-wave-bottom" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3, pointerEvents: 'none' }}>
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%', height: 'auto' }}>
            <path d="M0,32L60,42.7C120,53,240,75,360,80C480,85,600,75,720,64C840,53,960,43,1080,48C1200,53,1320,75,1380,85.3L1440,96L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z" fill="#F8FAFC"></path>
          </svg>
        </div>

        {/* Decorative Floating Sparkle Elements on Wave Boundary */}
        <div className="values-wave-float-item float-1">✦</div>
        <div className="values-wave-float-item float-2">✨</div>
        <div className="values-wave-float-item float-3">
          <svg width="45" height="45" viewBox="0 0 45 45" fill="none" stroke="rgba(242,201,76,0.35)" strokeWidth="1.2">
            <circle cx="22.5" cy="22.5" r="20" strokeDasharray="4 4" />
          </svg>
        </div>
      </section>

      {/* Pengembangan Talenta & Jadwal Training Section */}
      <section className="section-alt" id="home-talent-showcase" style={{ padding: '4.5rem 0 5.5rem 0', backgroundColor: '#F8FAFC' }}>
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
          
          <div className="aos-init aos-elastic-scale" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 className="section-title-center">
              Pengembangan Talenta
            </h2>
            <p style={{ color: '#576574', fontSize: '0.98rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
              Tingkatkan kompetensi melalui program pelatihan yang dirancang khusus maupun umum untuk sivitas akademika UI.
            </p>
          </div>

          <div className="home-talent-dashboard-grid">
            
            {/* Left Column: Jadwal Pelatihan Mendatang */}
            <div className="upcoming-training-panel aos-init aos-slide-rotate" style={{ transitionDelay: '0.15s' }}>
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
                              <polyline points="12 6 12 16 14"></polyline>
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
            <div className="talent-portal-sidebar aos-init aos-perspective-up" style={{ transitionDelay: '0.3s' }}>
              
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
            <div className="slider-image-panel aos-init aos-flip-3d">
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
            <div className="slider-content-panel aos-init aos-slide-rotate" style={{ transitionDelay: '0.2s' }}>
              
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
      
      {/* ── News Photo Strip Marquee Banner (between News & Footer) ── */}
      <div className="news-photo-strip-container">
        <div className="news-photo-strip-marquee">
          <div className="news-strip-track">
            {([...(news.length > 0 ? news : STATIC_FALLBACK_NEWS), ...(news.length > 0 ? news : STATIC_FALLBACK_NEWS), ...(news.length > 0 ? news : STATIC_FALLBACK_NEWS)]).map((item, idx) => (
              <a
                key={`${item.id || idx}-${idx}`}
                href={item.slug ? `/berita/${item.slug}` : `/berita`}
                className="news-strip-card"
                title={item.title}
              >
                <img 
                  src={getImageUrl(item.image_url || '/uploads/riset_inovasi.jpg')} 
                  alt={item.title} 
                  className="news-strip-img"
                  onError={(e) => { e.target.src = '/uploads/riset_inovasi.jpg'; }}
                />
              </a>
            ))}
          </div>
        </div>
      </div>

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
