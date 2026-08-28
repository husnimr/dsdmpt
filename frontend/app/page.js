"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
const Counter = ({ target, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);

  useEffect(() => {
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
  }, [target, duration]);

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
        { label: "KLASTER PTN TERBAIK", value: "4" }
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

  // Header scroll state
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
    <div>
      <Navbar />

      {/* Hero Section */}
      <section 
        className="hero" 
        style={{ backgroundImage: `url(${getImageUrl('/uploads/opening_building.png')})` }} 
        id="hero-section"
      >
        <div className="hero-gradient-overlay"></div>
        <div className="hero-statistics-container">
          <div className="hero-statistics-grid">
            
            {/* Stat 1 */}
            <div className="stat-card" style={{ '--delay': '0.1s' }}>
              <div className="stat-pin-wrapper">
                <div className="stat-pin-glow"></div>
                <div className="stat-pin-line"></div>
              </div>
              <div className="stat-value"><Counter target={4} /></div>
              <div className="stat-label">Klaster PTN Terbaik Indonesia</div>
              <div className="stat-sub">QS ASIA UNIVERSITY RANKINGS</div>
            </div>

            {/* Stat 2 */}
            <div className="stat-card" style={{ '--delay': '0.2s' }}>
              <div className="stat-pin-wrapper">
                <div className="stat-pin-glow"></div>
                <div className="stat-pin-line"></div>
              </div>
              <div className="stat-value"><Counter target={18400} suffix="+" /></div>
              <div className="stat-label">Mahasiswa Aktif Program S1-S3</div>
              <div className="stat-sub">SELURUH FAKULTAS</div>
            </div>

            {/* Stat 3 */}
            <div className="stat-card" style={{ '--delay': '0.3s' }}>
              <div className="stat-pin-wrapper">
                <div className="stat-pin-glow"></div>
                <div className="stat-pin-line"></div>
              </div>
              <div className="stat-value"><Counter target={2100} suffix="+" /></div>
              <div className="stat-label">Mahasiswa Internasional</div>
              <div className="stat-sub">LEBIH DARI 60 NEGARA</div>
            </div>

            {/* Stat 4 */}
            <div className="stat-card" style={{ '--delay': '0.4s' }}>
              <div className="stat-pin-wrapper">
                <div className="stat-pin-glow"></div>
                <div className="stat-pin-line"></div>
              </div>
              <div className="stat-value"><Counter target={1900} suffix="+" /></div>
              <div className="stat-label">Dosen & Peneliti Tetap</div>
              <div className="stat-sub">13 FAKULTAS, 2 SEKOLAH</div>
            </div>

            {/* Stat 5 */}
            <div className="stat-card" style={{ '--delay': '0.5s' }}>
              <div className="stat-pin-wrapper">
                <div className="stat-pin-glow"></div>
                <div className="stat-pin-line"></div>
              </div>
              <div className="stat-value"><Counter target={450} suffix="+" /></div>
              <div className="stat-label">Mitra Universitas Global</div>
              <div className="stat-sub">KERJA SAMA INTERNASIONAL</div>
            </div>

            {/* Stat 6 */}
            <div className="stat-card" style={{ '--delay': '0.6s' }}>
              <div className="stat-pin-wrapper">
                <div className="stat-pin-glow"></div>
                <div className="stat-pin-line"></div>
              </div>
              <div className="stat-value"><Counter target={1954} /></div>
              <div className="stat-label">Tahun Berdiri Sebagai PTN</div>
              <div className="stat-sub">WARISAN AKADEMIK</div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Rotating Circle Section */}
      <InteractiveRotatingCircle />

      {/* About Section */}
      <section id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-image-wrapper aos-init aos-fade-right">
              <img 
                src={getImageUrl(settings.about_image)} 
                alt="Direktorat SDM UI Staff" 
                className="about-image"
              />
            </div>
            <div className="about-content aos-init aos-fade-left" style={{ transitionDelay: '0.15s' }}>
              <h2>{settings.about_title || 'Tentang Direktorat SDM dan Pengembangan Talenta'}</h2>
              <p>{settings.about_text || 'Direktorat SDM dan Pengembangan Talenta...'}</p>
              <a href="/profil" className="btn-secondary" id="about-read-more-btn">
                Selengkapnya
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Subdirectorates Section */}
      <section className="section-alt" id="subdirectorate">
        <div className="container">
          <div className="section-header aos-init aos-fade-up">
            <h2>Subdirektorat</h2>
          </div>
          <div className="subs-grid">
            {subdirectorates.map((sub, idx) => (
              <div 
                key={sub.id} 
                className="sub-card aos-init aos-fade-up"
                onClick={() => setSelectedSub(sub)}
                style={{ cursor: 'pointer', transitionDelay: `${idx * 0.1}s` }}
                id={`sub-card-${sub.id}`}
              >
                <div className="sub-icon-wrapper">
                  {getSubIcon(sub.icon)}
                </div>
                <h3>{sub.name}</h3>
              </div>
            ))}
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
