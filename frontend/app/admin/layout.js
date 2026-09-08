"use client";

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { Menu, ShieldAlert, Loader2 } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [hasAccess, setHasAccess] = useState(null); // null = checking, true = allowed, false = 403
  const pathname = usePathname();

  useEffect(() => {
    // 1. Cek token dari query parameter (?token=xxx) jika diarahkan dari portal
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');

    // 2. Cek token dari Cookie browser ('token')
    const getCookie = (name) => {
      if (typeof document === 'undefined') return null;
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? decodeURIComponent(match[2]) : null;
    };
    const tokenFromCookie = getCookie('token');

    const activeToken = tokenFromUrl || tokenFromCookie || localStorage.getItem('admin_token');

    if (activeToken) {
      try {
        const parts = activeToken.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
          const userObj = {
            id: payload.user_id || 1,
            name: payload.full_name || payload.username || 'Admin',
            username: payload.username,
            email: payload.email,
            role: payload.dsdmpt_role || payload.role || 'user',
            modules: payload.modules || [],
          };

          localStorage.setItem('admin_token', activeToken);
          localStorage.setItem('admin_user', JSON.stringify(userObj));
          setUser(userObj);

          // Cek apakah user berhak mengakses DSDMPT
          const isSuperadmin = payload.role === 'superadmin';
          const isDsdmptAdmin = payload.dsdmpt_role === 'admin' || (payload.modules && payload.modules.includes('dsdmpt'));

          if (isSuperadmin || isDsdmptAdmin) {
            setHasAccess(true);
          } else {
            setHasAccess(false);
          }

          // Bersihkan parameter token di URL agar rapi
          if (tokenFromUrl) {
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
          }
          return;
        }
      } catch (err) {
        console.error('Error decoding SSO token:', err);
      }
    }

    // Jika tidak ada token sama sekali dan bukan di /admin/login, redirect ke SSO Portal
    if (!activeToken && pathname !== '/admin/login' && pathname !== '/admin/login/') {
      const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL || 'http://localhost:3000';
      window.location.href = `${portalUrl}/login?callback=${encodeURIComponent(window.location.href)}`;
    }
  }, [pathname]);

  const getPageTitle = () => {
    if (pathname.includes('/admin/dashboard')) return 'Dashboard';
    if (pathname.includes('/admin/profil')) return 'Profil';
    if (pathname.includes('/admin/berita')) return 'Berita';
    if (pathname.includes('/admin/informasi')) return 'Informasi';
    if (pathname.includes('/admin/statistik')) return 'Statistik';
    if (pathname.includes('/admin/pengembangan-talenta/jadwal-training')) return 'Jadwal Training';
    if (pathname.includes('/admin/pengembangan-talenta')) return 'Pengembangan Talenta';
    if (pathname.includes('/admin/global-talent')) return 'Global Talent';
    if (pathname.includes('/admin/rekrutmen')) return 'Rekrutmen';
    if (pathname.includes('/admin/akses-pegawai')) return 'Akses Pegawai';
    return 'Admin Panel';
  };

  const activePageId = () => {
    if (pathname.includes('/admin/dashboard')) return 'dashboard';
    if (pathname.includes('/admin/profil')) return 'profil';
    if (pathname.includes('/admin/berita')) return 'berita';
    if (pathname.includes('/admin/informasi')) return 'informasi';
    if (pathname.includes('/admin/statistik')) return 'statistik';
    if (pathname.includes('/admin/pengembangan-talenta/jadwal-training')) return 'jadwal-training';
    if (pathname.includes('/admin/pengembangan-talenta')) return 'pengembangan-talenta';
    if (pathname.includes('/admin/global-talent')) return 'global-talent';
    if (pathname.includes('/admin/rekrutmen')) return 'rekrutmen';
    if (pathname.includes('/admin/akses-pegawai')) return 'akses-pegawai';
    return '';
  };

  // Do not render dashboard/sidebar wrapper inside login page
  if (pathname === '/admin/login' || pathname === '/admin/login/') {
    return <>{children}</>;
  }

  // Tampilan jika sedang memvalidasi token
  if (hasAccess === null) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <Loader2 size={32} className="animate-spin text-slate-700" style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Memverifikasi hak akses...</span>
        </div>
      </div>
    );
  }

  // Tampilan jika AKSES DITOLAK (403 Forbidden)
  if (hasAccess === false) {
    const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL || 'http://localhost:3000';
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 10% 20%, rgba(241, 245, 249, 0.9) 0%, rgba(226, 232, 240, 0.9) 100%)',
        padding: '1.5rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          maxWidth: '480px',
          width: '100%',
          background: '#ffffff',
          borderRadius: '24px',
          padding: '2.5rem',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.12)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: '#FEE2E2',
            color: '#DC2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldAlert size={36} />
          </div>

          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
              Akses Ditolak (403)
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6 }}>
              Halo <strong>{user?.name || user?.username}</strong>, akun Anda ({user?.email}) terdaftar sebagai <strong>{user?.role || 'User Biasa'}</strong> dan tidak memiliki hak akses Administrator untuk modul <strong>DSDMPT</strong>.
            </p>
          </div>

          <div style={{
            width: '100%',
            padding: '1rem',
            background: '#F8FAFC',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            fontSize: '0.8rem',
            color: '#475569',
            lineHeight: 1.5,
            textAlign: 'left'
          }}>
            <strong style={{ color: '#0F172A', display: 'block', marginBottom: '0.25rem' }}>💡 Perlu Hak Akses?</strong>
            Silakan hubungi Superadmin Portal SDM untuk mengaktifkan modul DSDMPT pada akun Anda.
          </div>

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            <a
              href={portalUrl}
              style={{
                display: 'block',
                width: '100%',
                padding: '0.85rem',
                background: '#0F172A',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.9rem',
                borderRadius: '12px',
                textDecoration: 'none',
                boxSizing: 'border-box'
              }}
            >
              Kembali ke Portal SDM UI
            </a>

            <button
              onClick={() => {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
                if (typeof document !== 'undefined') {
                  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                }
                const redirectAfterLogout = `${portalUrl}/login`;
                const ssoLogoutUrl = `https://login.ui.ac.id/realms/main/protocol/openid-connect/logout?post_logout_redirect_uri=${encodeURIComponent(redirectAfterLogout)}&client_id=stellardsdm`;
                window.location.href = ssoLogoutUrl;
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#F1F5F9',
                color: '#475569',
                fontWeight: 700,
                fontSize: '0.85rem',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Ganti Akun / Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`admin-layout-wrapper ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <AdminSidebar activePage={activePageId()} collapsed={collapsed} />

      <div className="admin-body-wrapper">
        <header className="admin-topbar">
          <div className="topbar-left">
            <button 
              type="button" 
              className="toggle-sidebar-btn" 
              onClick={() => setCollapsed(!collapsed)}
              title="Perlebar Konten / Perkecil Sidebar"
            >
              <Menu size={20} />
            </button>
            <h1 className="topbar-page-title">{getPageTitle()}</h1>
          </div>

          <div className="topbar-right">
            <div className="topbar-profile">
              <div className="topbar-profile-info">
                <span className="profile-name">{user?.name || 'Admin'}</span>
                <span className="profile-role">{user?.role || 'Administrator'}</span>
              </div>
              <div className="profile-avatar">
                {user?.name ? user.name.slice(0,2).toUpperCase() : 'AD'}
              </div>
            </div>
          </div>
        </header>

        <div className="admin-page-content-area">
          {children}
        </div>
      </div>

      <style jsx global>{`
        .admin-layout-wrapper {
          display: flex;
          min-height: 100vh;
          background: #F8FAFC;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .admin-body-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .admin-topbar {
          height: 70px;
          background: #FFFFFF;
          border-bottom: 1px solid #E2E8F0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 2rem;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .toggle-sidebar-btn {
          background: none;
          border: none;
          color: #64748B;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          border-radius: 6px;
          transition: background 0.2s, color 0.2s;
        }

        .toggle-sidebar-btn:hover {
          background: #F1F5F9;
          color: #0F172A;
        }

        .topbar-page-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #0F172A;
          margin: 0;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .topbar-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .topbar-profile-info {
          display: flex;
          flex-direction: column;
          text-align: right;
        }

        .profile-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: #0F172A;
          line-height: 1.2;
        }

        .profile-role {
          font-size: 0.75rem;
          color: #64748B;
          line-height: 1.2;
        }

        .profile-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #FFC72C;
          color: #001f3f;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.88rem;
          border: 2px solid rgba(255, 199, 44, 0.2);
        }

        .admin-page-content-area {
          flex: 1;
          background: #F8FAFC;
          overflow-y: auto;
          height: calc(100vh - 70px);
        }

        /* Clean up secondary/duplicate elements from child page implementations */
        .admin-page-content-area .admin-layout {
          background: transparent !important;
          min-height: auto !important;
        }
        .admin-page-content-area .admin-sidebar {
          display: none !important;
        }
        .admin-page-content-area .admin-content-wrapper {
          padding: 0 !important;
        }
        /* Hide duplicated profile widgets inside child pages if any */
        .admin-page-content-area .sidebar-user {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
