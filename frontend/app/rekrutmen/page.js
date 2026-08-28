"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Menu, 
  ArrowRight
} from 'lucide-react';

const BACKEND_URL = 'http://localhost:8081';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('/uploads')) {
    return `${BACKEND_URL}${path}`;
  }
  return path;
};

export default function Rekrutmen() {
  const [settings, setSettings] = useState({});
  const [recs, setRecs] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/settings`)
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: 'var(--text-main)', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      
      <Navbar />

      {/* ── HERO BANNER ── */}
      <div className="subpage-hero-wrapper">
        <section
          className="subpage-hero"
          style={{ backgroundImage: `url(${getImageUrl(settings.rekrutmen_hero_image || settings.hero_image || '/uploads/ui_rectorate_hero.png')})` }}
        >
          <div className="subpage-hero-overlay" />
          <div className="subpage-hero-content">
            <h1 className="subpage-hero-title">{settings.rekrutmen_hero_title || 'Rekrutmen'}</h1>
            <p className="subpage-hero-sub">{settings.rekrutmen_hero_desc || 'Membangun Masa Depan Melalui Talenta Unggul & Impactful'}</p>
          </div>
        </section>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main style={{ padding: '5rem 0', backgroundColor: '#FFFFFF', minHeight: 'calc(100vh - 430px)' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#475569', marginBottom: '3rem', textAlign: 'center' }}>
            {settings.rekrutmen_description || 'Direktorat Sumber Daya Manusia dan Pengembangan Talenta (DSDMPT) berkomitmen untuk merekrut individu yang berdedikasi tinggi demi memajukan visi pendidikan nasional. Kami mencari talenta yang siap berkontribusi pada ekosistem akademik yang prestisius, inovatif, dan berintegritas.'}
          </p>

          {settings.rekrutmen_link && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}>
              <a 
                href={settings.rekrutmen_link} 
                target="_blank" 
                rel="noreferrer"
                className="recruitment-link-btn" 
                style={{ 
                  fontSize: '1.05rem', 
                  padding: '1.2rem 2.5rem', 
                  borderRadius: '12px', 
                  fontWeight: '700', 
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  backgroundColor: '#001f3f',
                  color: '#FFFFFF',
                  border: 'none',
                  width: '100%',
                  maxWidth: '350px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                  textAlign: 'center'
                }}
              >
                <span>{settings.rekrutmen_link_title || 'Buka Portal Rekrutmen'}</span>
                <ArrowRight size={20} style={{ color: '#F2C94C' }} />
              </a>
            </div>
          )}
        </div>
      </main>

      <style>{`
        .recruitment-link-btn:hover {
          background-color: #001326 !important;
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.15) !important;
        }
      `}</style>


      <Footer />
    </div>
  );
}

