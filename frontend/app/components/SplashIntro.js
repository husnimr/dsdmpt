"use client";

import React, { useState, useEffect, useRef } from 'react';

const BACKEND_URL = 'http://localhost:8081';

const AKSES_LINKS = [
  { label: 'Sistem SDM',   href: 'https://hris.ui.ac.id',                id: 'splash-link-sdm' },
  { label: 'HRIS UI',      href: 'https://hris.ui.ac.id',                id: 'splash-link-hris' },
  { label: 'SIPEG UI',     href: 'https://sipeg.ui.ac.id',               id: 'splash-link-sipeg' },
  { label: 'SISTER',       href: 'https://sister.kemdiktisaintek.go.id', id: 'splash-link-sister' },
  { label: 'STELLAR BKD',  href: 'https://stellar-dsdm.ui.ac.id',       id: 'splash-link-stellar' },
  { label: 'Rekrutmen UI', href: 'https://recruitment.ui.ac.id',        id: 'splash-link-rekrutmen' },
];

export default function SplashIntro({ onEnter }) {
  const [phase, setPhase]               = useState('idle');  // idle|init|morphing|fading|done
  const [hovered, setHovered]           = useState(false);
  const [portholeSize, setPortholeSize] = useState(320);
  const [portalRect, setPortalRect]     = useState(null);  // {left, top, width, height} viewport px

  const portholeRef = useRef(null);

  /* ── Measure porthole for bolt placement ── */
  useEffect(() => {
    const measure = () => {
      if (portholeRef.current) setPortholeSize(portholeRef.current.offsetWidth);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  /* ── Portal click ──
     Smooth morph: circle at porthole position → full-viewport rectangle
     border-radius 50% → 0% via CSS transition on left/top/width/height */
  const handlePortalClick = () => {
    if (phase !== 'idle') return;

    if (portholeRef.current) {
      const r = portholeRef.current.getBoundingClientRect();
      setPortalRect({ left: r.left, top: r.top, width: r.width, height: r.height });
    }

    setPhase('init');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase('morphing'));
    });

    // Fade surrounding content slightly later
    setTimeout(() => setPhase('fading'), 500);

    // Done — hand off to home
    setTimeout(() => { setPhase('done'); onEnter(); }, 1200);
  };

  /* ── Overlay style: the "iris morph" layer ── */
  const getOverlayStyle = () => {
    if (!portalRect) return { display: 'none' };
    const { left, top, width, height } = portalRect;

    const morphing = phase === 'morphing' || phase === 'fading' || phase === 'done';
    const fadingOut = phase === 'fading' || phase === 'done';

    if (morphing) {
      return {
        position: 'fixed',
        left:   0,
        top:    0,
        width:  '100vw',
        height: '100vh',
        borderRadius: 0,
        overflow: 'hidden',
        zIndex: 100001,
        pointerEvents: 'none',
        backgroundImage: `url(${BACKEND_URL}/uploads/opening_building.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: fadingOut ? 0 : 1,
        // Smooth morph: all geometry transitions together + opacity fade
        transition: 'left 0.85s cubic-bezier(0.4,0,0.2,1), top 0.85s cubic-bezier(0.4,0,0.2,1), width 0.85s cubic-bezier(0.4,0,0.2,1), height 0.85s cubic-bezier(0.4,0,0.2,1), border-radius 0.85s cubic-bezier(0.4,0,0.2,1), opacity 0.5s ease',
      };
    }

    // Phase init: circle at porthole position, no transition
    return {
      position: 'fixed',
      left:         `${left}px`,
      top:          `${top}px`,
      width:        `${width}px`,
      height:       `${height}px`,
      borderRadius: '50%',
      overflow: 'hidden',
      zIndex: 100001,
      pointerEvents: 'none',
      backgroundImage: `url(${BACKEND_URL}/uploads/opening_building.png)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: 1,
      transition: 'none',
    };
  };

  /* ── Building hover style ── */
  const getBuildingStyle = () => ({
    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
    transform: hovered && phase === 'idle' ? 'scale(1.05)' : 'scale(1)',
    filter:    hovered && phase === 'idle' ? 'brightness(1.1)' : 'brightness(1)',
    transition: 'transform 0.4s ease, filter 0.4s ease',
    userSelect: 'none',
    cursor: phase === 'idle' ? 'pointer' : 'default',
  });

  /* ── Surrounding splash fades while morph happens ── */
  const getSplashStyle = () => ({
    opacity:      phase === 'fading' || phase === 'done' ? 0 : 1,
    transition:   phase === 'fading' ? 'opacity 0.5s ease' : 'none',
    pointerEvents: phase !== 'idle' ? 'none' : 'auto',
  });

  const showOverlay = phase === 'init' || phase === 'morphing' || phase === 'fading' || phase === 'done';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Dancing+Script:wght@400;600&display=swap');

        /* ── ROOT ── */
        .splash-root {
          position: fixed; inset: 0; z-index: 99999;
          background-color: #e8ead8;
          display: flex; flex-direction: column;
          overflow: hidden;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        }

        /* ── TOP NAV ── */
        .splash-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.9rem 2.2rem;
          border-bottom: 1px solid rgba(0,0,0,0.08);
          flex-shrink: 0; z-index: 2;
        }
        .splash-nav-logo img { height: 44px; width: auto; object-fit: contain; }
        .splash-nav-links { display: flex; align-items: center; gap: 1.8rem; }
        .splash-nav-link {
          display: flex; align-items: center; gap: 0.4rem;
          font-size: 0.73rem; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: #2C3A47; text-decoration: none;
          transition: color 0.2s;
        }
        .splash-nav-link:hover { color: #0A1E38; }

        /* ── MAIN BODY ── */
        .splash-body {
          flex: 1; display: grid; grid-template-columns: 1fr auto 1fr;
          align-items: center; padding: 0 2.5rem; gap: 1.5rem; min-height: 0;
          position: relative;
        }

        /* "step through the portal" — floats above the porthole, separate from circle layout */
        .splash-portal-text-wrapper {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: calc(50% - 240px);   /* shifted slightly higher to sit perfectly at 100% zoom */
          z-index: 20;
          white-space: nowrap;
          pointer-events: none;
          user-select: none;
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .splash-portal-text-wrapper span {
          font-family: 'Dancing Script', cursive;
          font-size: clamp(1.3rem, 2.2vw, 1.65rem);
          color: #576574;
          display: inline-block;
        }
        .splash-portal-text-wrapper span:first-child { transform: rotate(-4deg); }
        .splash-portal-text-wrapper span:last-child  { transform: rotate(-2deg); color: #8a8a7a; }


        /* ── LEFT ── */
        .splash-left {
          display: flex; flex-direction: column; justify-content: center;
          gap: 0.6rem; padding-right: 0.5rem;
        }
        .splash-overline {
          font-size: 0.65rem; font-weight: 600; letter-spacing: 0.18em;
          text-transform: uppercase; color: #576574;
        }
        .splash-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(3rem, 5.5vw, 5.8rem);
          font-weight: 700; color: #0A1E38; line-height: 1;
          letter-spacing: -0.02em; margin: 0;
        }
        .splash-desc {
          font-size: 0.85rem; color: #576574; line-height: 1.6;
          max-width: 260px; margin-top: 0.2rem;
        }

        /* ── CENTER: PORTHOLE ── */
        .splash-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* Porthole outer circle */
        .splash-porthole-outer {
          width:  clamp(200px, 24vw, 320px);
          height: clamp(200px, 24vw, 320px);
          border-radius: 50%;
          position: relative;
          overflow: visible;
          flex-shrink: 0;
        }

        /* Thick gold ring */
        .splash-porthole-ring {
          position: absolute;
          inset: -30px;
          border-radius: 50%;
          background: conic-gradient(
            from 0deg,
            #c8971a 0deg,   #f7d96a 35deg,  #e8b830 75deg,
            #fff3b0 115deg, #c8971a 155deg, #f7d96a 195deg,
            #e0a820 235deg, #fff3b0 275deg, #c8971a 315deg,
            #f7d96a 360deg
          );
          box-shadow:
            0 0 0 3px #8a5e10,
            0 0 0 6px #f7d96a,
            0 0 0 9px rgba(184,134,11,0.3),
            inset 0 0 20px rgba(0,0,0,0.25),
            0 20px 60px rgba(0,0,0,0.38);
          z-index: 1;
        }

        /* Dark inner frame */
        .splash-porthole-inner-border {
          position: absolute; inset: -6px; border-radius: 50%;
          background: #1c1000; z-index: 2;
          box-shadow: inset 0 0 15px rgba(0,0,0,0.85);
        }

        /* Glass image circle */
        .splash-porthole-glass {
          position: relative; width: 100%; height: 100%;
          border-radius: 50%; overflow: hidden; z-index: 3;
          box-shadow: inset 0 0 30px rgba(0,0,0,0.45);
        }
        .splash-porthole-glass::after {
          content: ''; position: absolute; inset: 0; border-radius: 50%;
          background: radial-gradient(ellipse at 28% 18%, rgba(255,255,255,0.18) 0%, transparent 52%);
          pointer-events: none; z-index: 10;
        }

        /* Bolt */
        .splash-bolt {
          position: absolute;
          width: 16px; height: 16px; border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #fef3a0, #b87820 55%, #7a5010);
          box-shadow: 0 2px 5px rgba(0,0,0,0.55), inset 0 1px 2px rgba(255,255,255,0.45);
          z-index: 10;
        }

        /* Pulse rings */
        .splash-porthole-pulse {
          position: absolute; inset: -36px; border-radius: 50%;
          border: 2px solid rgba(200,150,30,0.32);
          animation: splashPulse 2.4s ease-in-out infinite;
          pointer-events: none; z-index: 0;
        }
        .splash-porthole-pulse:nth-child(2) {
          inset: -56px; animation-delay: 0.8s;
          border-color: rgba(200,150,30,0.14);
        }
        @keyframes splashPulse {
          0%   { transform: scale(1);    opacity: 0.7; }
          50%  { transform: scale(1.04); opacity: 0.2; }
          100% { transform: scale(1);    opacity: 0.7; }
        }

        /* ── RIGHT PANEL ── */
        .splash-right {
          display: flex; flex-direction: column; align-items: flex-end;
          gap: 0.45rem; padding-left: 0.5rem;
        }
        .splash-right-label {
          font-size: 0.62rem; font-weight: 700; letter-spacing: 0.2em;
          text-transform: uppercase; color: #576574;
          margin-bottom: 0.25rem; align-self: stretch; text-align: right;
        }
        .splash-access-btn {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; max-width: 220px;
          padding: 0.55rem 0.9rem;
          background: rgba(255,255,255,0.72);
          border: 1px solid rgba(0,0,0,0.1); border-radius: 5px;
          font-size: 0.7rem; font-weight: 600; letter-spacing: 0.07em;
          text-transform: uppercase; color: #2C3A47;
          text-decoration: none; cursor: pointer;
          transition: all 0.2s ease; backdrop-filter: blur(4px);
        }
        .splash-access-btn:hover {
          background: rgba(255,255,255,0.96); border-color: rgba(0,0,0,0.18);
          transform: translateX(-3px); box-shadow: 2px 2px 10px rgba(0,0,0,0.07);
        }
        .splash-access-btn .chevron { opacity: 0.45; font-size: 0.85rem; }
        .splash-sso-btn {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; max-width: 220px;
          padding: 0.6rem 0.9rem;
          background: #0A1E38; border-radius: 5px;
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: #fff;
          text-decoration: none; cursor: pointer;
          transition: all 0.2s ease; margin-top: 0.35rem;
        }
        .splash-sso-btn:hover {
          background: #162E4F; transform: translateX(-3px);
          box-shadow: 4px 4px 14px rgba(10,30,56,0.22);
        }
        .splash-sso-btn .arrow { font-size: 1rem; }

        /* ── FOOTER (navy blue) ── */
        .splash-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.75rem 2.2rem;
          background-color: #0A1E38;
          flex-shrink: 0; z-index: 2;
        }
        .splash-footer-brand { font-size: 0.8rem; font-weight: 700; letter-spacing: 0.08em; color: #ffffff; }
        .splash-footer-copy  { font-size: 0.72rem; color: rgba(255,255,255,0.5); }
        .splash-footer-live  {
          display: flex; align-items: center; gap: 0.38rem;
          font-size: 0.72rem; color: rgba(255,255,255,0.65); font-weight: 500;
        }
        .splash-live-dot {
          width: 7px; height: 7px; border-radius: 50%; background: #22c55e;
          animation: livePulse 1.5s ease-in-out infinite;
        }
        @keyframes livePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
          50%       { box-shadow: 0 0 0 5px rgba(34,197,94,0); }
        }

        /* ── MOBILE ── */
        @media (max-width: 860px) {
          .splash-body {
            grid-template-columns: 1fr; grid-template-rows: auto auto auto;
            padding: 1rem 1.2rem; gap: 1.2rem; justify-items: center; text-align: center;
          }
          .splash-left  { align-items: center; padding: 0; }
          .splash-right { align-items: center; padding: 0; }
          .splash-desc  { max-width: 90%; }
          .splash-porthole-outer { width: min(240px, 68vw); height: min(240px, 68vw); }
        }
      `}</style>

      {/* ── IRIS MORPH OVERLAY ──
          Starts as circle at porthole position, morphs smoothly to full viewport rectangle.
          Gives the "entering through the window frame" cinematic feel. */}
      {showOverlay && <div style={getOverlayStyle()} />}

      <div className="splash-root" style={getSplashStyle()}>

        {/* ── NAVBAR ── */}
        <nav className="splash-nav">
          <a href="/" className="splash-nav-logo">
            <img src={`${BACKEND_URL}/uploads/logo.png`} alt="DSDMPTUI Logo" />
          </a>
          <div className="splash-nav-links">
            <a href="https://www.linkedin.com/company/dsdmpt-ui" target="_blank" rel="noreferrer"
               className="splash-nav-link" id="splash-linkedin">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
              </svg>
              LinkedIn
            </a>
            <a href="https://www.instagram.com/dsdmpt.ui" target="_blank" rel="noreferrer"
               className="splash-nav-link" id="splash-instagram">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
              Instagram
            </a>
          </div>
        </nav>

        {/* ── MAIN BODY ── */}
        <div className="splash-body">

          {/* Absolute floated text "step through the portal" */}
          <div className="splash-portal-text-wrapper">
            <span>step through</span>
            <span>the portal</span>
          </div>

          {/* LEFT */}
          <div className="splash-left">
            <p className="splash-overline">Portal Gateway Information System</p>
            <h1 className="splash-title">DSDMPT</h1>
            <p className="splash-desc">
              Welcome to the central gateway. Access your employee portal and information systems through the cosmic viewport.
            </p>
          </div>

          {/* CENTER: Porthole */}
          <div className="splash-center">


            {/* Porthole wrapper with pulse rings */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="splash-porthole-pulse" />
              <div className="splash-porthole-pulse" />

              <div
                className="splash-porthole-outer"
                ref={portholeRef}
                onClick={handlePortalClick}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{ cursor: phase === 'idle' ? 'pointer' : 'default' }}
                id="splash-porthole"
                title="Klik untuk masuk ke portal"
              >
                {/* Thick gold ring */}
                <div className="splash-porthole-ring" />
                {/* Dark inner frame */}
                <div className="splash-porthole-inner-border" />

                {/* Bolts on ring */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                  const rad   = (angle * Math.PI) / 180;
                  const boltR = (portholeSize / 2) + 14;
                  const boltX = (portholeSize / 2) + boltR * Math.cos(rad - Math.PI / 2);
                  const boltY = (portholeSize / 2) + boltR * Math.sin(rad - Math.PI / 2);
                  return (
                    <div
                      key={i}
                      className="splash-bolt"
                      style={{ top: `${boltY - 8}px`, left: `${boltX - 8}px`, zIndex: 15 }}
                    />
                  );
                })}

                {/* Glass image */}
                <div className="splash-porthole-glass">
                  <img
                    src={`${BACKEND_URL}/uploads/opening_building.png`}
                    alt="Gedung Rektorat Universitas Indonesia"
                    style={getBuildingStyle()}
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="splash-right">
            <p className="splash-right-label">Akses Web Pegawai</p>
            {AKSES_LINKS.map((link) => (
              <a key={link.id} href={link.href} target="_blank" rel="noreferrer"
                 className="splash-access-btn" id={link.id}>
                {link.label}
                <span className="chevron">›</span>
              </a>
            ))}
            <a href="https://sso.ui.ac.id" target="_blank" rel="noreferrer"
               className="splash-sso-btn" id="splash-sso-login">
              SSO Login
              <span className="arrow">→</span>
            </a>
          </div>

        </div>

        {/* ── FOOTER — navy blue ── */}
        <footer className="splash-footer">
          <span className="splash-footer-brand">DSDMPT</span>
          <span className="splash-footer-copy">Copyright &nbsp;{new Date().getFullYear()}</span>
          <div className="splash-footer-live">
            <div className="splash-live-dot" />
            Live Summary
          </div>
        </footer>

      </div>
    </>
  );
}
