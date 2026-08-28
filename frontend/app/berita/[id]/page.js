"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
  Calendar,
  User,
  Eye,
  Share2,
  ChevronLeft,
  ChevronRight,
  X,
  Menu
} from 'lucide-react';

const BACKEND_URL = 'http://localhost:8081';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('/uploads')) return `${BACKEND_URL}${path}`;
  return path;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

const slugify = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export default function DetailBeritaPage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otherNews, setOtherNews] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Gallery popup states
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
    }
  }, []);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Parse gallery images dinamis dari DB
  let galleryImages = [];
  if (article && article.images) {
    try {
      galleryImages = JSON.parse(article.images);
    } catch(e) {}
  }
  if (!galleryImages.length && article) {
    galleryImages = [article.image_url];
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!id) return;
    
    // Fetch article detail
    setLoading(true);
    fetch(`${BACKEND_URL}/api/news/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Gagal mengambil detail berita');
        return res.json();
      })
      .then(data => {
        setArticle(data);
        setLoading(false);
        
        // Fetch other news for "Berita Lainnya"
        fetch(`${BACKEND_URL}/api/news?limit=6`)
          .then(res => res.json())
          .then(otherData => {
            // filter out current article
            const list = (otherData.data || []).filter(item => String(item.id) !== String(data.id)).slice(0, 5);
            setOtherNews(list);
          })
          .catch(err => console.error(err));
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  if (loading) {
    return (
      <div className="berita-loading" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="spinner" />
        <p style={{ marginTop: '1rem', color: '#576574' }}>Memuat artikel...</p>
        <style>{`
          .spinner {
            width: 44px; height: 44px;
            border: 4px solid #E2E8F0;
            border-top-color: #0A1E38;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ padding: '8rem 2rem', textAlign: 'center', minHeight: '60vh' }}>
        <h2>Artikel tidak ditemukan</h2>
        <a href="/berita" className="btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
          Kembali ke Berita
        </a>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      {/* ── BREADCRUMBS ── */}
      <div className="breadcrumbs-container">
        <div className="container">
          <div className="breadcrumbs">
            <a href="/">Beranda</a>
            <span className="separator">&gt;</span>
            <a href="/berita">Berita</a>
            <span className="separator">&gt;</span>
            <span className="current">{article.title}</span>
          </div>
        </div>
      </div>

      {/* ── MAIN DETAIL CONTENT ── */}
      <div className="detail-layout">
        <div className="container">
          
          <h1 className="detail-title">{article.title}</h1>

          {/* Metadata Row */}
          <div className="detail-meta">
            <span className="meta-item"><Calendar size={14} /> {formatDate(article.published_at)}</span>
            <span className="meta-item"><User size={14} /> {article.author}</span>
          </div>

          {/* Large Hero Image */}
          <div className="detail-hero-image-wrapper">
            <img src={getImageUrl(article.image_url)} alt={article.title} className="detail-hero-image" />
          </div>

          {/* Content Split Area */}
          <div className="detail-split-grid" style={galleryImages.length <= 1 ? { gridTemplateColumns: '1fr' } : {}}>
            
            {/* Left Side: Clickable Image Gallery */}
            {galleryImages.length > 1 && (
              <div className="detail-gallery-sidebar">
                {galleryImages.slice(0, 3).map((imgSrc, idx) => {
                  const isLast = idx === 2;
                  const hasMore = galleryImages.length > 3;
                  const extraCount = galleryImages.length - 3;
                  
                  return (
                    <div 
                      key={idx} 
                      className={`gallery-thumbnail-card card-slot-${idx}`} 
                      onClick={() => openLightbox(idx)}
                    >
                      <img src={getImageUrl(imgSrc)} alt={`Gallery item ${idx + 1}`} className="gallery-thumb" />
                      
                      {isLast && hasMore ? (
                        <div className="gallery-thumb-overlay-always">
                          <span className="extra-count-text">+{extraCount}</span>
                        </div>
                      ) : (
                        <div className="gallery-thumb-overlay">
                          <span className="zoom-text">Lihat Gambar</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Right Side: Rich Text Content */}
            <div className="detail-rich-text">
              <div 
                style={{ fontSize: '1rem', lineHeight: '1.8', color: '#2C3A47', whiteSpace: 'pre-wrap' }}
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>

          </div>

          {/* Share Section */}
          <div className="detail-share-section">
            <span className="share-label">Bagikan:</span>
            
            {/* WhatsApp */}
            <a 
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + ' - ' + shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="share-circle-btn share-wa"
              title="Bagikan ke WhatsApp"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>

            {/* Facebook */}
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="share-circle-btn share-fb"
              title="Bagikan ke Facebook"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
              </svg>
            </a>

            {/* X / Twitter */}
            <a 
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="share-circle-btn share-x"
              title="Bagikan ke X"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            {/* LinkedIn */}
            <a 
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="share-circle-btn share-in"
              title="Bagikan ke LinkedIn"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>

            {/* Copy Link */}
            <button 
              className="share-circle-btn share-copy" 
              onClick={handleCopyLink}
              title="Salin Tautan"
            >
              <Share2 size={16} />
              {copied && <span className="share-tooltip">Tersalin!</span>}
            </button>
          </div>

          <hr className="divider" />

          {/* ── RELATED NEWS / BERITA LAINNYA ── */}
          <div className="related-section">
            <h2 className="related-heading">Berita Lainnya</h2>
            <div className="related-grid">
              {otherNews.map((item) => (
                <a key={item.id} href={`/berita/${item.slug || slugify(item.title)}`} className="related-card">
                  <div className="related-card-img-wrap">
                    <img src={getImageUrl(item.image_url)} alt={item.title} />
                  </div>
                  <div className="related-card-body">
                    <h4 className="related-card-title">{item.title}</h4>
                    <span className="related-card-date">{formatDate(item.published_at)}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── LIGHTBOX/POPUP IMAGE GALLERY ── */}
      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={() => setLightboxOpen(false)}>
          <button className="lightbox-close" onClick={() => setLightboxOpen(false)}>
            <X size={24} />
          </button>
          
          <button className="lightbox-nav prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
            <ChevronLeft size={28} />
          </button>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={getImageUrl(galleryImages[currentImageIndex])} alt="Lightbox View" className="lightbox-img" />
            <div className="lightbox-indicator">
              {currentImageIndex + 1} / {galleryImages.length}
            </div>
          </div>

          <button className="lightbox-nav next" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
            <ChevronRight size={28} />
          </button>
        </div>
      )}

      <Footer />

      {/* Page specific detail styles */}
      <style>{`
        /* BREADCRUMBS */
        .breadcrumbs-container {
          margin-top: 72px;
          background-color: #F8FAFC;
          padding: 0.8rem 0;
          border-bottom: 1px solid #E2E8F0;
        }
        .breadcrumbs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: #64748B;
        }
        .breadcrumbs a {
          color: #64748B;
        }
        .breadcrumbs a:hover {
          color: #0A1E38;
        }
        .breadcrumbs .separator {
          color: #CBD5E1;
        }
        .breadcrumbs .current {
          color: #0A1E38;
          font-weight: 600;
        }

        /* DETAIL LAYOUT */
        .detail-layout {
          padding: 2.5rem 0 5rem;
          background-color: #FFFFFF;
        }
        .detail-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #0A1E38;
          line-height: 1.25;
          margin-bottom: 1rem;
        }
        .detail-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          font-size: 0.82rem;
          color: #64748B;
          margin-bottom: 2rem;
          border-bottom: 1px solid #F1F5F9;
          padding-bottom: 1rem;
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        /* HERO IMAGE */
        .detail-hero-image-wrapper {
          width: 100%;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          margin-bottom: 2.5rem;
          aspect-ratio: 21/9;
        }
        .detail-hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* SPLIT GRID */
        .detail-split-grid {
          display: grid;
          grid-template-columns: 1fr 3fr;
          gap: 3rem;
          align-items: start;
        }

        /* GALLERY SIDEBAR */
        .detail-gallery-sidebar {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .gallery-thumbnail-card {
          position: relative;
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          border: 1px solid #E2E8F0;
        }
        .card-slot-0, .card-slot-1 {
          aspect-ratio: 4/5;
        }
        .card-slot-2 {
          grid-column: span 2;
          aspect-ratio: 16/10;
        }
        .gallery-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .gallery-thumbnail-card:hover .gallery-thumb {
          transform: scale(1.05);
        }
        .gallery-thumb-overlay {
          position: absolute;
          inset: 0;
          background-color: rgba(10, 30, 56, 0.4);
          opacity: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.25s ease;
        }
        .gallery-thumbnail-card:hover .gallery-thumb-overlay {
          opacity: 1;
        }
        .gallery-thumb-overlay-always {
          position: absolute;
          inset: 0;
          background-color: rgba(6, 19, 36, 0.65);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }
        .extra-count-text {
          color: #FFFFFF;
          font-size: 1.8rem;
          font-weight: 700;
        }
        .zoom-text {
          color: #FFFFFF;
          font-size: 0.78rem;
          font-weight: 600;
          background: rgba(10, 30, 56, 0.8);
          padding: 0.3rem 0.7rem;
          border-radius: 20px;
        }

        /* RICH TEXT */
        .detail-rich-text {
          font-size: 1rem;
          line-height: 1.8;
          color: #334155;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .detail-quote {
          border-left: 4px solid #F2C94C;
          padding-left: 1.5rem;
          margin: 1rem 0;
          font-style: italic;
          font-weight: 500;
          color: #0A1E38;
          line-height: 1.7;
        }

        /* SHARE SECTION */
        .detail-share-section {
          margin-top: 3rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .share-label {
          font-weight: 600;
          font-size: 0.9rem;
          color: #0A1E38;
          margin-right: 0.5rem;
        }
        .share-circle-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #F1F5F9;
          color: #475569;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          border: none;
          cursor: pointer;
        }
        .share-circle-btn:hover {
          transform: translateY(-2px);
          color: #FFFFFF;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .share-wa:hover {
          background: #25D366;
        }
        .share-fb:hover {
          background: #1877F2;
        }
        .share-x:hover {
          background: #000000;
        }
        .share-in:hover {
          background: #0077B5;
        }
        .share-copy {
          position: relative;
        }
        .share-copy:hover {
          background: #0A1E38;
        }
        .share-tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(-8px);
          background: #334155;
          color: #fff;
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          white-space: nowrap;
          pointer-events: none;
          animation: fadeIn 0.15s ease-out;
        }
        .share-tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-width: 4px;
          border-style: solid;
          border-color: #334155 transparent transparent transparent;
        }

        .divider {
          border: 0;
          border-top: 1px solid #E2E8F0;
          margin: 3rem 0;
        }

        /* RELATED SECTION */
        .related-heading {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0A1E38;
          margin-bottom: 2rem;
        }
        .related-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .related-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 1rem;
          transition: all 0.2s;
        }
        .related-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          border-color: #CBD5E1;
        }
        .related-card-img-wrap {
          width: 80px;
          height: 60px;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .related-card-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .related-card-body {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .related-card-title {
          font-size: 0.85rem;
          font-weight: 700;
          line-height: 1.35;
          color: #0A1E38;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .related-card-date {
          font-size: 0.72rem;
          color: #64748B;
        }

        /* LIGHTBOX POPUP */
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(6, 19, 36, 0.95);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.2s ease-out;
        }
        .lightbox-close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          color: #FFFFFF;
          cursor: pointer;
        }
        .lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .lightbox-nav:hover {
          background: rgba(255, 255, 255, 0.25);
        }
        .lightbox-nav.prev { left: 2rem; }
        .lightbox-nav.next { right: 2rem; }
        .lightbox-content {
          max-width: 80%;
          max-height: 80vh;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .lightbox-img {
          max-width: 100%;
          max-height: 75vh;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .lightbox-indicator {
          color: #94A3B8;
          font-size: 0.9rem;
          margin-top: 1rem;
        }

        @media (max-width: 1024px) {
          .related-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .detail-split-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .detail-gallery-sidebar {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 0.5rem;
          }
          .gallery-thumbnail-card {
            width: 120px;
            flex-shrink: 0;
          }
          .related-grid {
            grid-template-columns: 1fr;
          }
          .detail-hero-image-wrapper {
            aspect-ratio: 16/9;
          }
          .lightbox-nav.prev { left: 0.5rem; }
          .lightbox-nav.next { right: 0.5rem; }
        }
      `}</style>
    </div>
  );
}
