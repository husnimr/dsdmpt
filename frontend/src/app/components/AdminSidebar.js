"use client";

import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  Info,
  BarChart2, 
  Star, 
  Globe, 
  Users, 
  Lock, 
  LogOut,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const BACKEND_URL = 'http://localhost:8081';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('/uploads')) return `${BACKEND_URL}${path}`;
  return path;
};

export default function AdminSidebar({ activePage, collapsed }) {
  const [user, setUser] = useState(null);
  const [talentOpen, setTalentOpen] = useState(
    activePage === 'pengembangan-talenta' || activePage === 'jadwal-training'
  );

  useEffect(() => {
    const userData = localStorage.getItem('admin_user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {}
    }
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Apakah Anda yakin ingin keluar dari halaman admin?");
    if (confirmLogout) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/admin/login';
    }
  };

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard size={18} />, href: '/admin/dashboard' },
    { id: 'profil', name: 'Profil', icon: <User size={18} />, href: '/admin/profil' },
    { id: 'berita', name: 'Berita', icon: <FileText size={18} />, href: '/admin/berita' },
    { id: 'informasi', name: 'Informasi', icon: <Info size={18} />, href: '/admin/informasi' },
    { id: 'statistik', name: 'Statistik', icon: <BarChart2 size={18} />, href: '/admin/statistik' },
    { id: 'pengembangan-talenta', name: 'Pengembangan Talenta', icon: <Star size={18} />, hasSubmenu: true },
    { id: 'global-talent', name: 'Global Talent', icon: <Globe size={18} />, href: '/admin/global-talent' },
    { id: 'rekrutmen', name: 'Rekrutmen', icon: <Users size={18} />, href: '/admin/rekrutmen' },
    { id: 'akses-pegawai', name: 'Akses Pegawai', icon: <Lock size={18} />, href: '/admin/akses-pegawai' },
  ];

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand">
        <a href="/" className="brand-logo-link">
          <img 
            src={getImageUrl(collapsed ? '/uploads/footer_logo.png' : '/uploads/logo.png')} 
            alt="DSDMPTUI Logo" 
            className="brand-logo-img"
          />
        </a>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          if (item.hasSubmenu) {
            const isSubmenuActive = activePage === 'pengembangan-talenta' || activePage === 'jadwal-training';
            return (
              <div key={item.id} className="submenu-group">
                <div
                  onClick={() => {
                    if (collapsed) {
                      window.location.href = '/admin/pengembangan-talenta';
                    } else {
                      setTalentOpen(!talentOpen);
                    }
                  }}
                  className={`nav-item ${isSubmenuActive ? 'active' : ''}`}
                  style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  title={collapsed ? item.name : ''}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="nav-item-icon">{item.icon}</span>
                    {!collapsed && <span className="nav-item-text">{item.name}</span>}
                  </div>
                  {!collapsed && (
                    <span style={{ color: 'inherit', display: 'flex', alignItems: 'center' }}>
                      {talentOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </span>
                  )}
                </div>
                
                {talentOpen && !collapsed && (
                  <div className="submenu-container">
                    <a 
                      href="/admin/pengembangan-talenta" 
                      className={`submenu-item ${activePage === 'pengembangan-talenta' ? 'active' : ''}`}
                    >
                      Program Talenta
                    </a>
                    <a 
                      href="/admin/pengembangan-talenta/jadwal-training" 
                      className={`submenu-item ${activePage === 'jadwal-training' ? 'active' : ''}`}
                    >
                      Jadwal Training
                    </a>
                  </div>
                )}
              </div>
            );
          }

          return (
            <a 
              key={item.id}
              href={item.href} 
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              title={collapsed ? item.name : ''}
            >
              <span className="nav-item-icon">{item.icon}</span>
              {!collapsed && <span className="nav-item-text">{item.name}</span>}
            </a>
          );
        })}
      </nav>

      {/* Bottom left logout button */}
      <div className="sidebar-footer">
        <button 
          type="button" 
          className="logout-btn" 
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      <style>{`
        .admin-sidebar {
          width: 250px;
          background: #FFFFFF;
          color: #475569;
          display: flex;
          flex-direction: column;
          border-right: 1px solid #E2E8F0;
          height: 100vh;
          position: sticky;
          top: 0;
          flex-shrink: 0;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .admin-sidebar.collapsed {
          width: 0;
          overflow: hidden;
          border-right: none;
        }

        .sidebar-brand {
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid #F1F5F9;
          height: 70px;
          box-sizing: border-box;
        }

        .brand-logo-img {
          height: 38px;
          width: auto;
          object-fit: contain;
        }

        .sidebar-nav {
          padding: 1.5rem 0.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          overflow-y: auto;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: 6px;
          color: #475569;
          font-size: 0.88rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
          justify-content: flex-start;
        }

        .admin-sidebar.collapsed .nav-item {
          justify-content: center;
          padding: 0.75rem 0;
        }

        .nav-item:hover {
          color: #0F172A;
          background: #F8FAFC;
        }

        .nav-item.active {
          background: #0B2F61;
          color: #FFFFFF;
          font-weight: 600;
        }

        .nav-item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: inherit;
          min-width: 24px;
        }

        .nav-item-text {
          line-height: 1;
          white-space: nowrap;
          opacity: 1;
          transition: opacity 0.2s;
        }

        .sidebar-footer {
          padding: 1rem 0.75rem;
          border-top: 1px solid #F1F5F9;
          background: #FFFFFF;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          background: none;
          border: none;
          color: #EF4444;
          padding: 0.75rem;
          border-radius: 6px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          justify-content: flex-start;
        }

        .logout-btn:hover {
          background: #FEF2F2;
        }

        .admin-sidebar.collapsed .logout-btn {
          justify-content: center;
          padding: 0.75rem 0;
        }

        /* Dropdown Submenu Styles */
        .submenu-group {
          display: flex;
          flex-direction: column;
        }
        .submenu-container {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          padding-left: 2rem;
          margin-top: 0.25rem;
          margin-bottom: 0.25rem;
        }
        .submenu-item {
          display: flex;
          align-items: center;
          padding: 0.55rem 0.75rem;
          border-radius: 6px;
          color: #64748B;
          font-size: 0.8rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .submenu-item:hover {
          color: #0F172A;
          background: #F8FAFC;
        }
        .submenu-item.active {
          background: #F1F5F9;
          color: #0B2F61;
          font-weight: 700;
        }
      `}</style>
    </aside>
  );
}
