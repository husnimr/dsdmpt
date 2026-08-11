"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  Menu,
  Search
} from 'lucide-react';

const BACKEND_URL = 'http://localhost:8081';
const LIMIT = 10;

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('/uploads')) return `${BACKEND_URL}${path}`;
  return path;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
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

export default function BeritaPage() {
  const [news, setNews] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [heroImage, setHeroImage] = useState('');
  const [selectedNews, setSelectedNews] = useState(null);
  const [activeTab, setActiveTab] = useState('berita');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch hero image from settings
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/settings`)
      .then(r => r.json())
      .then(d => setHeroImage(d.hero_image || ''))
      .catch(() => {});
  }, []);

  const fetchNews = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/news?page=${p}&limit=${LIMIT}`);
      if (!res.ok) throw new Error('Gagal memuat berita');
      const data = await res.json();
      setNews(data.data || []);
      setTotalPages(data.total_pages || 1);
      setTotal(data.total || 0);
      setPage(p);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNews(1); }, [fetchNews]);

  const featured = news[0] || null;
  const rest = news.slice(1);

  const filteredRest = searchQuery
    ? rest.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : rest;

  return (
    <div>
      <Navbar />

      {/* ── HERO BANNER ── */}
      <div className="subpage-hero-wrapper">
        <section
          className="subpage-hero"
          style={{ backgroundImage: `url(${getImageUrl(heroImage)})` }}
        >
          <div className="subpage-hero-overlay" />
          <div className="subpage-hero-content">
            <h1 className="subpage-hero-title">Berita</h1>
            <p className="subpage-hero-sub">
              Berita dan informasi seputar SDM dan pengembangan talenta Universitas Indonesia
            </p>
          </div>
        </section>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="berita-main">
        <div className="container">

          {/* Tabs */}
          <div className="berita-tabs">
            <button
              className={`berita-tab ${activeTab === 'berita' ? 'active' : ''}`}
              onClick={() => setActiveTab('berita')}
              id="tab-berita"
            >
              Berita
            </button>
            <a
               href="/informasi"
               className="berita-tab"
               id="tab-informasi"
               style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
             >
               Informasi
             </a>
          </div>

          {loading ? (
            <div className="berita-loading">
              <div className="spinner" />
              <p>Memuat berita...</p>
            </div>
          ) : (
            <>
              {/* ── FEATURED ARTICLE ── */}
              {featured && (
                <a href={`/berita/${slugify(featured.title, featured.id)}`} className="berita-featured" id="featured-article" style={{ display: 'grid', cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
                  <div className="berita-featured-img-wrap">
                    <img src={getImageUrl(featured.image_url)} alt={featured.title} className="berita-featured-img" />
                  </div>
                  <div className="berita-featured-body">
                    <h2 className="berita-featured-title">{featured.title}</h2>
                    <p className="berita-featured-excerpt">
                      {featured.content?.slice(0, 160)}{featured.content?.length > 160 ? '...' : ''}
                    </p>
                    <span className="berita-featured-date">
                      <Calendar size={13} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'middle' }} />
                      {formatDate(featured.published_at)}
                    </span>
                    <div style={{ marginTop: '1.25rem' }}>
                      <span className="btn-secondary">
                        Baca selengkapnya
                      </span>
                    </div>
                  </div>
                </a>
              )}

              {/* ── NEWS GRID ── */}
              {filteredRest.length > 0 && (
                <div className="berita-grid">
                  {filteredRest.map(item => (
                    <a
                      key={item.id}
                      href={`/berita/${slugify(item.title, item.id)}`}
                      className="berita-card"
                      id={`berita-card-${item.id}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <div className="berita-card-img-wrap">
                        <img src={getImageUrl(item.image_url)} alt={item.title} className="berita-card-img" />
                      </div>
                      <div className="berita-card-body">
                        <h3 className="berita-card-title">{item.title}</h3>
                        <p className="berita-card-excerpt">
                          {item.content?.slice(0, 100)}{item.content?.length > 100 ? '...' : ''}
                        </p>
                        <span className="berita-card-date">{formatDate(item.published_at)}</span>
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {/* ── PAGINATION ── */}
              {totalPages > 1 && (
                <div className="berita-pagination">
                  <button
                    className="page-btn page-arrow"
                    onClick={() => fetchNews(Math.max(1, page - 1))}
                    disabled={page === 1}
                    id="prev-page-btn"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      className={`page-btn ${p === page ? 'active' : ''}`}
                      onClick={() => fetchNews(p)}
                      id={`page-btn-${p}`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    className="page-btn page-arrow"
                    onClick={() => fetchNews(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    id="next-page-btn"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
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

      {/* ── NEWS DETAIL MODAL ── */}
      {selectedNews && (
        <div className="modal-overlay" onClick={() => setSelectedNews(null)} id="berita-detail-modal">
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedNews(null)}>
              <X size={18} />
            </button>
            <div className="modal-scrollable">
              <div className="modal-img-wrapper">
                <img src={getImageUrl(selectedNews.image_url)} alt={selectedNews.title} className="modal-img" />
              </div>
              <div className="modal-meta">
                <Calendar size={13} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'middle' }} />
                <span style={{ verticalAlign: 'middle' }}>{formatDate(selectedNews.published_at)}</span>
              </div>
              <h2 className="modal-title">{selectedNews.title}</h2>
              <div className="modal-body-text">{selectedNews.content}</div>
            </div>
          </div>
        </div>
      )}

      {/* Page-specific styles */}
      <style>{`
        /* HERO */
        .berita-hero {
          margin-top: 72px;
          height: 300px;
          position: relative;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .berita-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(10,30,56,0.82) 0%, rgba(10,30,56,0.6) 100%);
          z-index: 1;
        }
        .berita-hero-title {
          font-size: 2.25rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 0.4rem;
          text-align: center;
        }
        .berita-hero-sub {
          color: rgba(255,255,255,0.75);
          font-size: 0.9rem;
          text-align: center;
        }

        /* MAIN */
        .berita-main {
          padding: 3rem 0 4rem;
          min-height: 60vh;
        }

        /* TABS */
        .berita-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2.5rem;
          justify-content: center;
        }
        .berita-tab {
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
        .berita-tab.active {
          background: #E0ECFB;
          color: #0A1E38;
          border-color: #A0C3F7;
        }
        .berita-tab:hover:not(.active) {
          border-color: #0A1E38;
          color: #0A1E38;
        }

        /* LOADING */
        .berita-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 4rem 0;
        }
        .spinner {
          width: 44px; height: 44px;
          border: 4px solid #E2E8F0;
          border-top-color: #0A1E38;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* FEATURED */
        .berita-featured {
          display: grid;
          grid-template-columns: 1.3fr 1.7fr;
          height: 290px;
          gap: 2rem;
          background: #fff;
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          overflow: hidden;
          margin-bottom: 2.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          transition: box-shadow 0.2s;
        }
        .berita-featured:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.1); }
        .berita-featured-img-wrap {
          overflow: hidden;
          height: 100%;
        }
        .berita-featured-img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }
        .berita-featured:hover .berita-featured-img { transform: scale(1.03); }
        .berita-featured-body {
          padding: 1.25rem 2rem 1.25rem 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .berita-featured-body .news-tag {
          position: static;
          display: inline-block;
          width: fit-content;
          margin-bottom: 0.5rem;
        }
        .berita-featured-title {
          font-size: 1.35rem;
          font-weight: 800;
          line-height: 1.35;
          color: var(--primary-color);
          margin-bottom: 0.5rem;
        }
        .berita-featured-excerpt {
          font-size: 0.88rem;
          color: #576574;
          line-height: 1.65;
          margin-bottom: 0.5rem;
        }
        .berita-featured-date {
          font-size: 0.78rem;
          color: #8e9aad;
          font-weight: 500;
        }

        /* NEWS GRID */
        .berita-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }
        .berita-card {
          background: #fff;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .berita-card:hover { transform: translateY(-4px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
        .berita-card-img-wrap {
          position: relative;
          aspect-ratio: 16/10;
          overflow: hidden;
        }
        .berita-card-img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }
        .berita-card:hover .berita-card-img { transform: scale(1.04); }
        .berita-card-body { padding: 1rem 1.25rem 1.25rem; }
        .berita-card-title {
          font-size: 0.92rem;
          font-weight: 700;
          line-height: 1.4;
          color: var(--primary-color);
          margin-bottom: 0.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .berita-card-excerpt {
          font-size: 0.8rem;
          color: #576574;
          line-height: 1.5;
          margin-bottom: 0.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .berita-card-date {
          font-size: 0.74rem;
          color: #8e9aad;
          font-weight: 500;
        }

        /* PAGINATION */
        .berita-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        .page-btn {
          min-width: 36px; height: 36px;
          border-radius: 8px;
          border: 1.5px solid #E2E8F0;
          background: #fff;
          color: #576574;
          font-family: var(--font-heading);
          font-size: 0.88rem;
          font-weight: 600;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          padding: 0 0.5rem;
        }
        .page-btn:hover:not(:disabled):not(.active) {
          border-color: var(--primary-color);
          color: var(--primary-color);
        }
        .page-btn.active {
          background: var(--primary-color);
          color: #fff;
          border-color: var(--primary-color);
        }
        .page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .page-arrow { padding: 0 0.6rem; }

        @media (max-width: 768px) {
          .berita-featured { grid-template-columns: 1fr; }
          .berita-featured-img-wrap { min-height: 180px; }
          .berita-grid { grid-template-columns: 1fr 1fr; }
          .berita-hero-title { font-size: 1.8rem; }
        }
        @media (max-width: 480px) {
          .berita-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

