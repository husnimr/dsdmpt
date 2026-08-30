"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const BACKEND_URL = 'http://localhost:8081';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('/uploads')) return `${BACKEND_URL}${path}`;
  return path;
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ news: [], talenta: [], informasi: [] });
  const [isSearching, setIsSearching] = useState(false);
  const pathname = usePathname();

  const slugify = (text) => {
    if (!text) return '';
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Debounced search logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ news: [], talenta: [], informasi: [] });
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const delayDebounceFn = setTimeout(() => {
      fetch(`${BACKEND_URL}/api/search?q=${encodeURIComponent(searchQuery)}`)
        .then((res) => res.json())
        .then((data) => {
          setSearchResults({
            news: data.news || [],
            talenta: data.talenta || [],
            informasi: data.informasi || []
          });
          setIsSearching(false);
        })
        .catch((err) => {
          console.error("Gagal melakukan pencarian:", err);
          setIsSearching(false);
        });
    }, 400); // 400ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const menuItems = [
    { name: 'Profil', href: '/profil' },
    { name: 'Berita', href: '/berita' },
    { name: 'Statistik', href: '/statistik' },
    { 
      name: 'Pengembangan Talenta', 
      href: '/pengembangan-talenta',
      dropdown: [
        { name: 'Program Talenta', href: '/pengembangan-talenta' },
        { name: 'Jadwal Training', href: '/pengembangan-talenta/jadwal-training' }
      ]
    },
    { name: 'Global Talent', href: '/global-talent' },
    { name: 'Rekrutmen', href: '/rekrutmen' },
    { name: 'Akses Pegawai', href: '/akses-pegawai' }
  ];

  const isLinkActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-container">
          <a href="/" className="logo-container" id="nav-logo">
            <img 
              src={getImageUrl('/uploads/logo.png')} 
              alt="DSDMPTUI Logo" 
              style={{ height: '50px', width: 'auto', objectFit: 'contain' }}
            />
          </a>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ul className="nav-menu">
              {menuItems.map((item) => {
                if (item.dropdown) {
                  return (
                    <li key={item.href} className="nav-dropdown-wrapper">
                      <a 
                        href={item.href} 
                        className="nav-link"
                        style={isLinkActive(item.href) ? { color: '#0A1E38', fontWeight: 700 } : {}}
                      >
                        {item.name}
                      </a>
                      <ul className="nav-dropdown-menu">
                        {item.dropdown.map((sub) => (
                          <li key={sub.href}>
                            <a href={sub.href}>{sub.name}</a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                }
                return (
                  <li key={item.href}>
                    <a 
                      href={item.href} 
                      className="nav-link"
                      style={isLinkActive(item.href) ? { color: '#0A1E38', fontWeight: 700 } : {}}
                    >
                      {item.name}
                    </a>
                  </li>
                );
              })}
            </ul>

            <button 
              className="navbar-search-btn"
              onClick={() => setIsSearchOpen(true)}
              title="Cari Informasi..."
              style={{
                color: '#0A1E38',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                borderRadius: '50%',
                backgroundColor: 'rgba(10, 30, 56, 0.04)',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(242, 201, 76, 0.15)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(10, 30, 56, 0.04)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>

          <button 
            className="mobile-menu-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Professional Full-screen Search Overlay */}
      {isSearchOpen && (
        <div 
          className="global-search-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(10, 30, 56, 0.98)',
            backdropFilter: 'blur(20px)',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '2.5rem 2rem',
            animation: 'fadeIn 0.3s ease-out',
            boxSizing: 'border-box',
            overflowY: 'auto'
          }}
        >
          {/* Close button */}
          <button 
            onClick={() => {
              setIsSearchOpen(false);
              setSearchQuery('');
              setSearchResults({ news: [], talenta: [], informasi: [] });
            }}
            style={{
              position: 'absolute',
              top: '2rem',
              right: '2rem',
              color: '#ffffff',
              cursor: 'pointer',
              opacity: 0.8,
              transition: 'opacity 0.2s',
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: '50%',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
          >
            <X size={24} />
          </button>

          {/* Search Content container */}
          <div style={{ width: '100%', maxWidth: '900px', marginTop: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ color: '#F2C94C', fontFamily: 'var(--font-heading)', fontSize: '2.2rem', marginBottom: '1.5rem', fontWeight: '800', textAlign: 'center', letterSpacing: '-0.5px' }}>
              Telusuri Portal DSDMPT
            </h2>
            
            {/* Search Input field */}
            <div style={{ position: 'relative', width: '100%', marginBottom: '2.5rem' }}>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Masukkan kata kunci pencarian..."
                autoFocus
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '2px solid rgba(242, 201, 76, 0.3)',
                  borderRadius: '16px',
                  padding: '1.25rem 3.5rem 1.25rem 2rem',
                  fontSize: '1.3rem',
                  color: '#ffffff',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                }}
                onFocus={(e) => e.target.style.borderColor = '#F2C94C'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(242, 201, 76, 0.3)'}
              />
              <div style={{ position: 'absolute', right: '1.75rem', top: '50%', transform: 'translateY(-50%)', color: '#F2C94C', opacity: 0.9 }}>
                {isSearching ? (
                  <div className="search-spinner" style={{ width: '24px', height: '24px', border: '3px solid rgba(242,201,76,0.3)', borderTopColor: '#F2C94C', borderRadius: '50%', animation: 'searchSpin 0.6s linear infinite' }} />
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                )}
              </div>
            </div>

            {/* CSS Animation helper */}
            <style>{`
              @keyframes searchSpin { to { transform: rotate(360deg); } }
              .search-result-category {
                width: 100%;
                margin-bottom: 2.5rem;
                background-color: rgba(255, 255, 255, 0.03);
                border-radius: 14px;
                padding: 1.5rem;
                border: 1px solid rgba(255, 255, 255, 0.06);
                box-sizing: border-box;
              }
              .search-result-title {
                color: #ffffff;
                font-size: 1.15rem;
                font-weight: 700;
                margin-bottom: 0.5rem;
                transition: color 0.2s;
              }
              .search-result-item:hover .search-result-title {
                color: #F2C94C;
              }
            `}</style>

            {/* Results output */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {searchQuery && !isSearching && searchResults.news.length === 0 && searchResults.talenta.length === 0 && searchResults.informasi.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(255,255,255,0.6)' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.5, marginBottom: '1rem' }}>
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>Tidak ada hasil yang ditemukan untuk "{searchQuery}"</p>
                  <p style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.25rem' }}>Silakan periksa kembali ejaan kata kunci Anda.</p>
                </div>
              )}

              {/* 1. News Category Results */}
              {searchResults.news.length > 0 && (
                <div className="search-result-category">
                  <h3 style={{ color: '#F2C94C', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem', marginTop: 0 }}>
                    Berita Portal ({searchResults.news.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {searchResults.news.map((item) => (
                      <a 
                        key={item.id} 
                        href={`/berita/${item.slug || slugify(item.title)}`}
                        className="search-result-item"
                        style={{ display: 'block', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '1rem' }}
                      >
                        <h4 className="search-result-title">{item.title}</h4>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', margin: '0.25rem 0 0 0', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {item.content ? item.content.replace(/<[^>]*>?/gm, '') : ''}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Talenta Category Results */}
              {searchResults.talenta.length > 0 && (
                <div className="search-result-category">
                  <h3 style={{ color: '#F2C94C', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem', marginTop: 0 }}>
                    Pengembangan Talenta ({searchResults.talenta.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {searchResults.talenta.map((item) => (
                      <a 
                        key={item.id} 
                        href={`/pengembangan-talenta/${item.id}`}
                        className="search-result-item"
                        style={{ display: 'block', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '1rem' }}
                      >
                        <h4 className="search-result-title">{item.title}</h4>
                        <div style={{ display: 'flex', gap: '1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', margin: '0.25rem 0' }}>
                          <span>Penyelenggara: {item.organizer}</span>
                          <span>Tanggal: {item.date}</span>
                        </div>
                        {item.description && (
                          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', margin: '0.25rem 0 0 0', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {item.description}
                          </p>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Informasi Category Results */}
              {searchResults.informasi.length > 0 && (
                <div className="search-result-category">
                  <h3 style={{ color: '#F2C94C', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem', marginTop: 0 }}>
                    Layanan & Dokumen Informasi ({searchResults.informasi.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {searchResults.informasi.map((item) => (
                      <a 
                        key={item.id} 
                        href="/informasi"
                        className="search-result-item"
                        style={{ display: 'block', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '1rem' }}
                      >
                        <h4 className="search-result-title">{item.title}</h4>
                        {item.description && (
                          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', margin: '0.25rem 0 0 0', lineHeight: '1.5' }}>
                            {item.description}
                          </p>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {mobileMenuOpen && (
        <div style={{ position: 'fixed', top: '72px', left: 0, width: '100%', backgroundColor: '#FFFFFF', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', zIndex: 999, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {menuItems.map((item) => {
            if (item.dropdown) {
              return (
                <React.Fragment key={item.href}>
                  {item.dropdown.map((sub) => (
                    <a 
                      key={sub.href}
                      href={sub.href} 
                      className="nav-link" 
                      onClick={() => setMobileMenuOpen(false)}
                      style={pathname === sub.href ? { color: '#0A1E38', fontWeight: 700 } : {}}
                    >
                      {sub.name}
                    </a>
                  ))}
                </React.Fragment>
              );
            }
            return (
              <a 
                key={item.href}
                href={item.href} 
                className="nav-link" 
                onClick={() => setMobileMenuOpen(false)}
                style={isLinkActive(item.href) ? { color: '#0A1E38', fontWeight: 700 } : {}}
              >
                {item.name}
              </a>
            );
          })}
        </div>
      )}
    </>
  );
}
