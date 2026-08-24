"use client";

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { Menu, User as UserIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const userData = localStorage.getItem('admin_user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {}
    }
  }, []);

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
