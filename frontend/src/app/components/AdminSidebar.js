"use client";

import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  BarChart2, 
  Star, 
  Globe, 
  Users, 
  Lock, 
  LogOut 
} from 'lucide-react';

const BACKEND_URL = 'http://localhost:8081';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('/uploads')) return `${BACKEND_URL}${path}`;
  return path;
};

export default function AdminSidebar({ activePage }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('admin_user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/admin/login';
  };

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard size={18} />, href: '/admin/dashboard' },
    { id: 'profil', name: 'Profil', icon: <User size={18} />, href: '/admin/profil' },
    { id: 'berita', name: 'Berita', icon: <FileText size={18} />, href: '/admin/berita' },
    { id: 'statistik', name: 'Statistik', icon: <BarChart2 size={18} />, href: '/admin/statistik' },
    { id: 'pengembangan-talenta', name: 'Pengembangan Talenta', icon: <Star size={18} />, href: '/admin/pengembangan-talenta' },
    { id: 'global-talent', name: 'Global Talent', icon: <Globe size={18} />, href: '/admin/global-talent' },
    { id: 'rekrutmen', name: 'Rekrutmen', icon: <Users size={18} />, href: '/admin/rekrutmen' },
    { id: 'akses-pegawai', name: 'Akses Pegawai', icon: <Lock size={18} />, href: '/admin/akses-pegawai' },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <a href="/" className="brand-logo-link">
          <img 
            src={getImageUrl('/uploads/logo.png')} 
            alt="DSDMPTUI Logo" 
            className="brand-logo-img"
          />
        </a>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <a 
            key={item.id}
            href={item.href} 
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
          >
            <span className="nav-item-icon">{item.icon}</span>
            <span className="nav-item-text">{item.name}</span>
          </a>
        ))}
      </nav>

      <div className="sidebar-user">
        <div className="user-avatar">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
        </div>
        <div className="user-info">
          <span className="user-name">{user?.name || 'Admin'}</span>
          <span className="user-role">{user?.role || 'Administrator'}</span>
        </div>
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
        }

        .sidebar-brand {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          border-bottom: 1px solid #F1F5F9;
        }

        .brand-logo-img {
          height: 48px;
          width: auto;
          object-fit: contain;
        }

        .sidebar-nav {
          padding: 1.5rem 0.75rem;
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
          padding: 0.75rem 1rem;
          border-radius: 6px;
          color: #475569;
          font-size: 0.88rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
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
        }

        .nav-item-text {
          line-height: 1;
        }

        .sidebar-user {
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-top: 1px solid #F1F5F9;
          background: #FFFFFF;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          background: #E0E7FF;
          color: #3730A3;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.95rem;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .user-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: #0F172A;
          line-height: 1.2;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .user-role {
          font-size: 0.75rem;
          color: #64748B;
          line-height: 1.2;
          font-weight: 400;
        }
      `}</style>
    </aside>
  );
}
