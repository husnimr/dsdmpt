"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { 
  Menu, 
  X, 
  FileText,
  Download,
  Eye,
  FileSpreadsheet,
  Link as LinkIcon
} from 'lucide-react';

const BACKEND_URL = 'http://localhost:8081';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('/uploads')) {
    return `${BACKEND_URL}${path}`;
  }
  return path;
};

export default function Informasi() {
  const [settings, setSettings] = useState({});
  const [scrolled, setScrolled] = useState(false);
  
  const [cards, setCards] = useState([]);
  const [docs, setDocs] = useState([]);
  const [activePdfUrl, setActivePdfUrl] = useState(null);

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

    fetch(`${BACKEND_URL}/api/informasi`)
      .then(res => res.json())
      .then(data => setCards(data))
      .catch(err => console.error(err));

    fetch(`${BACKEND_URL}/api/dokumen-terkini`)
      .then(res => res.json())
      .then(data => setDocs(data))
      .catch(err => console.error(err));
  }, []);

  const getDocIconAndColor = (doc) => {
    if (doc.link) {
      return <LinkIcon size={20} style={{ color: '#2563EB', flexShrink: 0 }} />;
    }
    const url = doc.file_url || '';
    const ext = url.split('.').pop().toLowerCase();
    if (ext === 'pdf') {
      return <FileText size={20} style={{ color: '#EF4444', flexShrink: 0 }} />;
    } else if (ext === 'doc' || ext === 'docx') {
      return <FileText size={20} style={{ color: '#2563EB', flexShrink: 0 }} />;
    } else if (ext === 'xls' || ext === 'xlsx') {
      return <FileSpreadsheet size={20} style={{ color: '#16A34A', flexShrink: 0 }} />;
    }
    return <FileText size={20} style={{ color: '#64748B', flexShrink: 0 }} />;
  };

  const handleDownload = async (e, url, title) => {
    e.preventDefault();
    if (!url) return;
    
    const ext = url.split('.').pop().toLowerCase() || 'pdf';
    const filename = `${title}.${ext}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      window.open(url, '_blank');
    }
  };

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: 'var(--text-main)', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      
      <Navbar />

      {/* ── HERO BANNER ── */}
      <div className="subpage-hero-wrapper">
        <section
          className="subpage-hero"
          style={{ backgroundImage: `url(${getImageUrl(settings.informasi_hero_image || settings.hero_image || '/uploads/ui_rectorate_hero.png')})` }}
        >
          <div className="subpage-hero-overlay" />
          <div className="subpage-hero-content">
            <h1 className="subpage-hero-title">{settings.informasi_hero_title || 'Informasi'}</h1>
            {settings.informasi_hero_desc && (
              <p className="subpage-hero-sub" style={{ color: 'rgba(255,255,255,0.9)', marginTop: '0.5rem', fontSize: '1.1rem' }}>
                {settings.informasi_hero_desc}
              </p>
            )}
          </div>
        </section>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main style={{ padding: '3rem 0' }}>
        <div className="container">
          {/* Tabs */}
          <div className="informasi-tabs">
            <a
              href="/berita"
              className="informasi-tab"
              id="tab-berita"
            >
              Berita
            </a>
            <button
              className="informasi-tab active"
              id="tab-informasi"
            >
              Informasi
            </button>
          </div>
        </div>

        <div className="container detail-container-grid">
          
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {cards.map((card) => (
              <div 
                key={card.id} 
                style={{ 
                  backgroundColor: '#ffffff', 
                  borderRadius: '16px', 
                  border: '1px solid #E2E8F0', 
                  padding: '2rem', 
                  boxShadow: 'var(--shadow-sm)' 
                }}
              >
                <h2 style={{ 
                  fontSize: '1.4rem', 
                  color: '#0A1E38', 
                  borderBottom: '3px solid #F2C94C', 
                  paddingBottom: '0.5rem', 
                  marginBottom: '1.5rem', 
                  display: 'inline-block' 
                }}>
                  {card.title}
                </h2>

                {card.description && (
                  <p style={{ 
                    color: '#576574', 
                    fontSize: '0.95rem', 
                    lineHeight: '1.7', 
                    marginBottom: '1.5rem',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {card.description}
                  </p>
                )}

                {/* If the card has both description and file, but NO image, we render a PDF cover style block */}
                {!card.image_url && card.file_url ? (
                  <div style={{ 
                    display: 'flex', 
                    gap: '2rem', 
                    alignItems: 'center', 
                    backgroundColor: '#F8FAFC', 
                    borderRadius: '12px', 
                    padding: '1.5rem', 
                    border: '1px solid #E2E8F0' 
                  }}>
                    <div style={{ 
                      width: '100px', 
                      height: '130px', 
                      borderRadius: '8px', 
                      backgroundColor: '#FEF2F2', 
                      border: '1px solid #FCA5A5',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <FileText size={48} style={{ color: '#EF4444' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.1rem', color: '#0A1E38', fontWeight: '700' }}>Dokumen PDF</h3>
                      <p style={{ fontSize: '0.85rem', color: '#576574', margin: 0 }}>Unduh atau baca langsung lampiran dokumen.</p>
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <button 
                          onClick={() => setActivePdfUrl(activePdfUrl === card.file_url ? null : card.file_url)} 
                          className="btn-primary" 
                          style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', gap: '0.5rem', borderRadius: '8px' }}
                        >
                          <Eye size={16} /> {activePdfUrl === card.file_url ? 'Tutup' : 'Baca'}
                        </button>
                        <a 
                          href={getImageUrl(card.file_url)} 
                          download
                          className="btn-secondary" 
                          style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', gap: '0.5rem', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#ffffff' }}
                        >
                          <Download size={16} /> Unduh
                        </a>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* If the card has an image_url, render the image */}
                {card.image_url && (
                  <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)' }}>
                    <img 
                      src={getImageUrl(card.image_url)} 
                      alt={card.title} 
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  </div>
                )}

                {/* If card has image AND file_url, provide a download action button under the image */}
                {card.image_url && card.file_url && (
                  <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                    <button 
                      onClick={() => setActivePdfUrl(activePdfUrl === card.file_url ? null : card.file_url)}
                      className="btn-primary"
                      style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', gap: '0.5rem', borderRadius: '8px' }}
                    >
                      <Eye size={16} /> {activePdfUrl === card.file_url ? 'Tutup Preview' : 'Baca Lampiran'}
                    </button>
                    <a 
                      href={getImageUrl(card.file_url)} 
                      download
                      className="btn-secondary"
                      style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', gap: '0.5rem', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#ffffff' }}
                    >
                      <Download size={16} /> Unduh Lampiran
                    </a>
                  </div>
                )}

                {/* Embedded PDF Reader for this card if active */}
                {activePdfUrl === card.file_url && (
                  <div style={{ marginTop: '2rem', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
                    <div style={{ backgroundColor: '#0A1E38', padding: '0.75rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ffffff' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>PDF Preview: {card.title}</span>
                      <button 
                        onClick={() => setActivePdfUrl(null)} 
                        style={{ color: '#ffffff', opacity: '0.8', background: 'transparent', cursor: 'pointer', border: 'none' }}
                      >
                        <X size={18} />
                      </button>
                    </div>
                    <iframe 
                      src={getImageUrl(card.file_url)} 
                      width="100%" 
                      height="580px" 
                      style={{ border: 'none', display: 'block' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Column: Dokumen Terkini */}
          <div>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '2rem', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: '96px' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#0A1E38', borderBottom: '3px solid #F2C94C', paddingBottom: '0.5rem', marginBottom: '1.5rem', display: 'inline-block' }}>
                Dokumen Terkini
              </h2>
              
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', padding: 0, margin: 0 }}>
                {docs.map((doc) => {
                  const targetUrl = doc.link || getImageUrl(doc.file_url);
                  const isFile = !doc.link;
                  return (
                    <li key={doc.id}>
                      <a 
                        href={targetUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        onClick={(e) => {
                          if (isFile) {
                            handleDownload(e, targetUrl, doc.title);
                          }
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', textDecoration: 'none' }}
                      >
                        {getDocIconAndColor(doc)}
                        <span style={{ fontSize: '0.88rem', fontWeight: '600', color: '#0A1E38', lineHeight: '1.3' }}>
                          {doc.title}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

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
        .informasi-tabs {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
          justify-content: center;
        }
        .informasi-tab {
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
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .informasi-tab.active {
          background: #E0ECFB;
          color: #0A1E38;
          border-color: #A0C3F7;
        }
        .informasi-tab:hover:not(.active) {
          border-color: #0A1E38;
          color: #0A1E38;
        }
        .detail-container-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2.5rem;
        }
        @media (max-width: 991px) {
          .detail-container-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
