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
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            className="mobile-menu-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

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
