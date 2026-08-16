"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
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

const slugify = (text, id) => {
  if (!text) return String(id);
  const clean = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  return `${clean}-${id}`;
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
        style={{ backgroundImage: `url(${getImageUrl('/uploads/herohome.png')})` }} 
        id="hero-section"
      >
      </section>

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
              <a href={`/berita/${slugify(item.title, item.id)}`} key={item.id} className="news-card aos-init aos-fade-up" id={`news-card-${item.id}`} style={{ textDecoration: 'none', color: 'inherit', transitionDelay: `${idx * 0.08}s` }}>
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

      {/* Footer */}
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
