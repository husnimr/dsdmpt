"use client";

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Info, 
  Download, 
  Briefcase, 
  Settings, 
  ArrowRight, 
  Plus, 
  User, 
  Layers,
  ChevronRight,
  TrendingUp,
  Activity,
  CheckCircle,
  Database
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

const BACKEND_URL = 'http://localhost:8081';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    newsCount: 0,
    infoCount: 0,
    docsCount: 0,
    talentaCount: 0
  });
  const [news, setNews] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [systemTime, setSystemTime] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }

    const userData = localStorage.getItem('admin_user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {}
    }

    fetchDashboardData(token);

    // Dynamic Clock
    const updateClock = () => {
      const now = new Date();
      setSystemTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const getToken = () => localStorage.getItem('admin_token');

  const fetchDashboardData = async (token) => {
    setLoading(true);
    try {
      // 1. Fetch News
      const resNews = await fetch(`${BACKEND_URL}/api/admin/news`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      let newsList = [];
      if (resNews.ok) {
        newsList = await resNews.json();
        setNews(newsList.slice(0, 5)); // show top 5
      }

      // 2. Fetch Informasi Cards
      const resInfo = await fetch(`${BACKEND_URL}/api/admin/informasi`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      let infoList = [];
      if (resInfo.ok) {
        infoList = await resInfo.json();
      }

      // 3. Fetch Dokumen Terkini
      const resDocs = await fetch(`${BACKEND_URL}/api/admin/dokumen-terkini`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      let docsList = [];
      if (resDocs.ok) {
        docsList = await resDocs.json();
      }

      // 4. Fetch Pengembangan Talenta
      const resTalenta = await fetch(`${BACKEND_URL}/api/pengembangan-talenta`);
      let talentaList = [];
      if (resTalenta.ok) {
        talentaList = await resTalenta.json();
      }

      setStats({
        newsCount: newsList.length,
        infoCount: infoList.length,
        docsCount: docsList.length,
        talentaCount: talentaList.length
      });

    } catch (err) {
      console.error('Failed to load dashboard statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Selamat Pagi';
    if (hrs < 17) return 'Selamat Siang';
    return 'Selamat Malam';
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('/uploads')) return `${BACKEND_URL}${path}`;
    return path;
  };

  return (
    <div className="dashboard-root">
      <div className="dashboard-container">
        
        {/* Welcome Banner */}
        {/* <div className="welcome-banner-card">
          <div className="welcome-content">
            <span className="welcome-tagline">Portal Administrasi DSDMPT UI</span>
            <h2>{getGreeting()}, {user?.name || 'Administrator'}!</h2>
            <p>Kelola konten informasi, jadwal training pegawai, publikasi berita, serta pengaturan situs dengan efisien dalam satu tempat terpusat.</p>
            <div className="welcome-meta-info">
              <span className="meta-badge">{getFormattedDate()}</span>
              <span className="meta-badge timer-badge">{systemTime} WIB</span>
            </div>
          </div>
          <div className="welcome-decoration">
            <div className="circle-decor-1"></div>
            <div className="circle-decor-2"></div>
          </div>
        </div> */}

        {/* Stats Grid */}
        <div className="stats-grid-row">
          <div className="stat-panel-card">
            <div className="stat-icon-wrapper news-color">
              <FileText size={24} />
            </div>
            <div className="stat-text-info">
              <span className="stat-label">Total Berita</span>
              <h3 className="stat-number">{stats.newsCount}</h3>
              <span className="stat-comparison">Diterbitkan publik</span>
            </div>
          </div>

          <div className="stat-panel-card">
            <div className="stat-icon-wrapper info-color">
              <Info size={24} />
            </div>
            <div className="stat-text-info">
              <span className="stat-label">Informasi</span>
              <h3 className="stat-number">{stats.infoCount}</h3>
              <span className="stat-comparison">Info & Pengumuman</span>
            </div>
          </div>

          <div className="stat-panel-card">
            <div className="stat-icon-wrapper docs-color">
              <Download size={24} />
            </div>
            <div className="stat-text-info">
              <span className="stat-label">Dokumen</span>
              <h3 className="stat-number">{stats.docsCount}</h3>
              <span className="stat-comparison">Dokumen Terkini</span>
            </div>
          </div>

          <div className="stat-panel-card">
            <div className="stat-icon-wrapper subs-color">
              <Layers size={24} />
            </div>
            <div className="stat-text-info">
              <span className="stat-label">Program Talenta</span>
              <h3 className="stat-number">{stats.talentaCount}</h3>
              <span className="stat-comparison">Pengembangan Talenta</span>
            </div>
          </div>
        </div>

        {/* Split Grid */}
        <div className="dashboard-split-grid">
          
          {/* Left Column: Recent News */}
          <div className="split-main-card">
            <div className="split-card-header">
              <div className="header-title-area">
                <Activity size={18} className="header-icon" />
                <h3>Postingan Berita Terakhir</h3>
              </div>
              <a href="/admin/berita" className="view-all-link">
                Semua Berita <ArrowRight size={14} />
              </a>
            </div>

            <div className="news-feed-list">
              {loading ? (
                <div className="feed-skeleton">Memuat data feed berita...</div>
              ) : news.length === 0 ? (
                <div className="feed-empty">Belum ada postingan berita yang diterbitkan.</div>
              ) : (
                news.map((item) => (
                  <div key={item.id} className="news-feed-row">
                    <div className="feed-thumb">
                      <img src={getImageUrl(item.image_url) || "/uploads/news_1.png"} alt={item.title} />
                    </div>
                    <div className="feed-details">
                      <h4>{item.title}</h4>
                      <div className="feed-meta">
                        <span className="feed-date">
                          {new Date(item.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className={`status-badge-inline ${item.status || 'published'}`}>
                          {item.status === 'draft' ? 'Draft' : 'Published'}
                        </span>
                      </div>
                    </div>
                    <a href={`/admin/berita/edit/${item.id}`} className="feed-action-btn" title="Edit Postingan">
                      <ChevronRight size={16} />
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Quick Actions & System Info */}
          <div className="split-side-layout">
            
            {/* Quick Actions */}
            <div className="split-main-card border-accent">
              <div className="split-card-header">
                <div className="header-title-area">
                  <TrendingUp size={18} className="header-icon-accent" />
                  <h3>Aksi Cepat</h3>
                </div>
              </div>
              <div className="quick-actions-list">
                <a href="/admin/berita/tambah" className="action-button-link">
                  <div className="action-icon yellow-bg"><Plus size={16} /></div>
                  <div className="action-label-wrap">
                    <span className="action-title">Tulis Berita Baru</span>
                    <span className="action-subtitle">Buat artikel berita publik</span>
                  </div>
                </a>

                <a href="/admin/informasi" className="action-button-link">
                  <div className="action-icon blue-bg"><Plus size={16} /></div>
                  <div className="action-label-wrap">
                    <span className="action-title">Tambah Info & File</span>
                    <span className="action-subtitle">Buat pengumuman atau upload PDF</span>
                  </div>
                </a>

                <a href="/admin/pengembangan-talenta" className="action-button-link">
                  <div className="action-icon dark-bg"><Plus size={16} /></div>
                  <div className="action-label-wrap">
                    <span className="action-title">Tambah Program Talenta</span>
                    <span className="action-subtitle">Buat program pelatihan baru</span>
                  </div>
                </a>
              </div>
            </div>

            {/* System Info */}
            <div className="split-main-card">
              <div className="split-card-header">
                <div className="header-title-area">
                  <Database size={18} className="header-icon" />
                  <h3>Status Sistem</h3>
                </div>
              </div>
              <div className="system-info-body">
                <div className="sys-row">
                  <span className="sys-label">API Server</span>
                  <span className="sys-val highlight-val">{BACKEND_URL}</span>
                </div>
                <div className="sys-row">
                  <span className="sys-label">Koneksi Database</span>
                  <span className="sys-val status-active">
                    <CheckCircle size={12} style={{ marginRight: '4px' }} /> Terhubung
                  </span>
                </div>
                <div className="sys-row">
                  <span className="sys-label">Versi Aplikasi</span>
                  <span className="sys-val">v1.2.0 (Next.js)</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      <style jsx global>{`
        .dashboard-root {
          padding: 1.5rem 0 3rem;
          background: #F8FAFC;
        }
        .dashboard-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        /* Welcome Banner Card */
        .welcome-banner-card {
          background: linear-gradient(135deg, #0A2540 0%, #001F3F 100%);
          border-radius: 20px;
          padding: 2.5rem;
          color: #FFFFFF;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(10, 37, 64, 0.1);
        }
        .welcome-content {
          max-width: 650px;
          position: relative;
          z-index: 2;
        }
        .welcome-tagline {
          text-transform: uppercase;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          color: #FFC72C;
          display: block;
          margin-bottom: 0.75rem;
        }
        .welcome-content h2 {
          font-size: 2rem;
          font-weight: 800;
          margin: 0 0 1rem 0;
          letter-spacing: -0.5px;
          color: #FFFFFF !important;
        }
        .welcome-content p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.95rem;
          line-height: 1.6;
          margin: 0 0 1.5rem 0;
        }
        .welcome-meta-info {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .meta-badge {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 0.4rem 0.9rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #FFFFFF;
        }
        .timer-badge {
          background: rgba(255, 199, 44, 0.15);
          border-color: rgba(255, 199, 44, 0.3);
          color: #FFC72C;
        }

        /* Decoration Circles */
        .welcome-decoration {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }
        .circle-decor-1 {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 199, 44, 0.12) 0%, transparent 70%);
          right: -50px;
          top: -100px;
        }
        .circle-decor-2 {
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(15, 118, 110, 0.15) 0%, transparent 75%);
          right: 100px;
          bottom: -200px;
        }

        /* Stats Grid Row */
        .stats-grid-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }
        .stat-panel-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .stat-panel-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
          border-color: #CBD5E1;
        }
        .stat-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .news-color { background: #EEF2FF; color: #4F46E5; }
        .info-color { background: #ECFDF5; color: #059669; }
        .docs-color { background: #FFF7ED; color: #EA580C; }
        .subs-color { background: #F5F3FF; color: #7C3AED; }

        .stat-text-info {
          display: flex;
          flex-direction: column;
        }
        .stat-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #64748B;
        }
        .stat-number {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0.15rem 0;
          line-height: 1;
        }
        .stat-comparison {
          font-size: 0.72rem;
          color: #94A3B8;
          font-weight: 500;
        }

        /* Split Grid Layout */
        .dashboard-split-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 1.5rem;
        }
        .split-main-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
          display: flex;
          flex-direction: column;
        }
        .border-accent {
          border-top: 4px solid #FFC72C;
        }
        .split-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #F1F5F9;
          padding-bottom: 1rem;
          margin-bottom: 1.25rem;
        }
        .header-title-area {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .header-title-area h3 {
          font-size: 1rem;
          font-weight: 700;
          color: #0F172A;
          margin: 0;
        }
        .header-icon {
          color: #0B2F61;
        }
        .header-icon-accent {
          color: #EA580C;
        }
        .view-all-link {
          font-size: 0.82rem;
          font-weight: 600;
          color: #001F3F;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          transition: transform 0.2s;
        }
        .view-all-link:hover {
          color: #FFC72C;
        }

        /* News Feed List */
        .news-feed-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .news-feed-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          border-radius: 10px;
          border: 1px solid transparent;
          transition: all 0.2s;
        }
        .news-feed-row:hover {
          background: #F8FAFC;
          border-color: #E2E8F0;
        }
        .feed-thumb {
          width: 56px;
          height: 56px;
          border-radius: 8px;
          overflow: hidden;
          background: #F1F5F9;
          flex-shrink: 0;
        }
        .feed-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .feed-details {
          flex: 1;
          min-width: 0;
        }
        .feed-details h4 {
          font-size: 0.88rem;
          font-weight: 700;
          color: #1E293B;
          margin: 0 0 0.25rem 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .feed-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .feed-date {
          font-size: 0.75rem;
          color: #64748B;
        }
        .status-badge-inline {
          font-size: 0.65rem;
          font-weight: 600;
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          text-transform: uppercase;
        }
        .status-badge-inline.published {
          background: #DCFCE7;
          color: #15803D;
        }
        .status-badge-inline.draft {
          background: #F1F5F9;
          color: #475569;
        }
        .feed-action-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94A3B8;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          transition: all 0.2s;
        }
        .news-feed-row:hover .feed-action-btn {
          color: #0F172A;
          background: #FFC72C;
          border-color: #FFC72C;
        }

        /* Split Side Layout */
        .split-side-layout {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* Quick Actions list */
        .quick-actions-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .action-button-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.85rem 1rem;
          border-radius: 12px;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          text-decoration: none;
          transition: all 0.2s;
        }
        .action-button-link:hover {
          transform: translateX(4px);
          border-color: #0B2F61;
          box-shadow: 0 4px 6px rgba(0,0,0,0.02);
        }
        .action-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .yellow-bg { background: #FEF3C7; color: #D97706; }
        .blue-bg { background: #DBEAFE; color: #2563EB; }
        .dark-bg { background: #F1F5F9; color: #334155; }

        .action-label-wrap {
          display: flex;
          flex-direction: column;
        }
        .action-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: #1E293B;
        }
        .action-subtitle {
          font-size: 0.72rem;
          color: #64748B;
        }

        /* System Info */
        .system-info-body {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .sys-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.82rem;
          padding: 0.4rem 0;
          border-bottom: 1px solid #F1F5F9;
        }
        .sys-row:last-child {
          border-bottom: none;
        }
        .sys-label {
          color: #64748B;
          font-weight: 500;
        }
        .sys-val {
          color: #1E293B;
          font-weight: 600;
        }
        .highlight-val {
          font-family: monospace;
          background: #F1F5F9;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          font-size: 0.78rem;
        }
        .status-active {
          color: #166534;
          display: inline-flex;
          align-items: center;
        }
        
        .feed-skeleton, .feed-empty {
          text-align: center;
          padding: 2.5rem 0;
          color: #94A3B8;
          font-size: 0.85rem;
        }

        @media (max-width: 991px) {
          .dashboard-split-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
