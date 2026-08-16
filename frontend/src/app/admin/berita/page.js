"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Search,
  Calendar
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

const BACKEND_URL = 'http://localhost:8081';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('/uploads')) return `${BACKEND_URL}${path}`;
  return path;
};

export default function AdminBeritaPage() {
  const [news, setNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Hero settings states
  const [heroTitle, setHeroTitle] = useState('Berita');
  const [heroDesc, setHeroDesc] = useState('');
  const [heroImage, setHeroImage] = useState('/uploads/ui_rectorate_hero.png');
  
  const [saving, setSaving] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const heroFileRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
    loadSettings();
    fetchNews();
  }, []);

  const getToken = () => localStorage.getItem('admin_token');

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const loadSettings = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/settings`);
      const data = await res.json();
      setHeroTitle(data.berita_hero_title || 'Berita');
      setHeroDesc(data.berita_hero_desc || '');
      setHeroImage(data.berita_hero_image || data.hero_image || '/uploads/ui_rectorate_hero.png');
    } catch (err) {
      showToast('error', 'Gagal memuat settings');
    }
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/news`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      if (!res.ok) throw new Error('Gagal memuat berita');
      const data = await res.json();
      setNews(data || []);
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const payload = {
        berita_hero_title: heroTitle,
        berita_hero_desc: heroDesc,
        berita_hero_image: heroImage,
      };

      const res = await fetch(`${BACKEND_URL}/api/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Gagal menyimpan settings');
      showToast('success', 'Perubahan berhasil disimpan!');
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleHeroImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingHero(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${BACKEND_URL}/api/admin/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getToken()}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Gagal mengupload gambar');
      const data = await res.json();
      setHeroImage(data.url);
      showToast('success', 'Background Image berhasil diperbarui');
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setUploadingHero(false);
    }
  };

  const handleDeleteNews = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/news/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('Gagal menghapus berita');
      showToast('success', 'Berita berhasil dihapus');
      fetchNews();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  const handleCancel = () => {
    loadSettings();
    showToast('success', 'Data dikembalikan ke penyimpanan terakhir.');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Filter news list based on search query
  const filteredNews = news.filter(item => 
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-layout">
      <AdminSidebar activePage="berita" />

      <div className="admin-content-wrapper">
        {toast && (
          <div className={`admin-toast ${toast.type}`}>
            {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{toast.message}</span>
          </div>
        )}

        <main className="admin-main">
          <div className="admin-container">
            
            {/* Header Area */}
            <div className="admin-page-header">
              <div className="header-text">
                <h1>Berita</h1>
              </div>
              <div className="header-actions">
                <button 
                  className="btn-cancel" 
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Batal
                </button>
                <button 
                  className="btn-save" 
                  onClick={handleSaveSettings}
                  disabled={saving}
                >
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </div>

            {/* HERO SECTION CARD */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h2>Hero Section</h2>
              </div>
              
              <div className="admin-card-body flex-row-layout">
                <div className="inputs-column">
                  <div className="admin-field">
                    <label>Judul halaman</label>
                    <input 
                      type="text" 
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                    />
                  </div>
                  <div className="admin-field">
                    <label>Deskripsi judul</label>
                    <textarea 
                      rows={3} 
                      value={heroDesc}
                      onChange={(e) => setHeroDesc(e.target.value)}
                    />
                  </div>
                </div>

                <div className="image-column">
                  <label>Background Image</label>
                  <div className="image-uploader-wrapper">
                    <img src={getImageUrl(heroImage)} alt="Hero Background" />
                    <button 
                      className="upload-overlay-btn"
                      onClick={() => heroFileRef.current?.click()}
                      disabled={uploadingHero}
                    >
                      <Upload size={16} />
                      {uploadingHero ? 'Mengunggah...' : 'Upload Image'}
                    </button>
                    <input 
                      type="file" 
                      ref={heroFileRef} 
                      accept="image/*"
                      onChange={handleHeroImageUpload} 
                      style={{ display: 'none' }}
                    />
                  </div>
                  <span className="image-hint-text">Recommended size: 1920x600px. Max size: 2MB.</span>
                </div>
              </div>
            </div>

            {/* POSTINGAN CARD */}
            <div className="admin-card">
              <div className="admin-card-header flex-header-row">
                <h2>Postingan</h2>
                
                <div className="postingan-controls">
                  <div className="search-bar-wrapper">
                    <Search size={16} className="search-icon" />
                    <input 
                      type="text" 
                      placeholder="Cari berita" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <a href="/admin/berita/tambah" className="btn-add-post">
                    <Plus size={18} />
                  </a>
                </div>
              </div>

              <div className="admin-card-body no-padding">
                <div className="news-list-wrapper">
                  {loading ? (
                    <div className="loading-state">Memuat data berita...</div>
                  ) : filteredNews.length === 0 ? (
                    <div className="empty-state">Tidak ada postingan berita ditemukan</div>
                  ) : (
                    filteredNews.map((item) => (
                      <div key={item.id} className="news-row-item">
                        <div className="news-thumbnail">
                          <img 
                            src={getImageUrl(item.image_url || '/uploads/news_1.png')} 
                            alt={item.title} 
                          />
                        </div>
                        
                        <div className="news-info-block">
                          <h3>{item.title}</h3>
                          <div className="news-meta-row">
                            <span className={`status-badge ${item.status || 'published'}`}>
                              {item.status === 'draft' ? 'Draft' : 'Published'}
                            </span>
                            <span className="date-meta">
                              <Calendar size={13} style={{ marginRight: '4px' }} />
                              {formatDate(item.published_at)}
                            </span>
                          </div>
                        </div>

                        <div className="news-actions-block">
                          <a 
                            href={`/admin/berita/edit/${item.id}`} 
                            className="btn-action-edit"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </a>
                          <button 
                            className="btn-action-delete"
                            onClick={() => handleDeleteNews(item.id)}
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      <style>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #F4F6F9;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .admin-content-wrapper {
          flex: 1;
          min-width: 0;
          overflow-y: auto;
        }

        /* Toast */
        .admin-toast {
          position: fixed;
          top: 1.5rem;
          right: 1.5rem;
          padding: 0.8rem 1.25rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          z-index: 9999;
          animation: toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        }
        .admin-toast.success {
          background: #ECFDF5;
          color: #047857;
          border: 1px solid #A7F3D0;
        }
        .admin-toast.error {
          background: #FEF2F2;
          color: #B91C1C;
          border: 1px solid #FEE2E2;
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Layout */
        .admin-main {
          padding: 2rem 0 4rem;
        }
        .admin-container {
          max-width: 1360px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* Header */
        .admin-page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .header-text h1 {
          font-size: 1.6rem;
          font-weight: 700;
          color: #1E293B;
          margin: 0;
        }

        /* Buttons */
        .btn-cancel {
          background: #001f3f;
          color: #FFFFFF;
          border: none;
          padding: 0.6rem 1.5rem;
          border-radius: 6px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-right: 0.75rem;
        }
        .btn-cancel:hover {
          background: #001326;
        }
        .btn-save {
          background: #FFC72C;
          color: #001f3f;
          border: none;
          padding: 0.6rem 1.5rem;
          border-radius: 6px;
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-save:hover:not(:disabled) {
          background: #E0AE20;
        }

        /* Cards */
        .admin-card {
          background: #FFFFFF;
          border-radius: 12px;
          box-shadow: 0 1px 3px 0 rgba(0,0,0,0.05);
          margin-bottom: 1.5rem;
          overflow: hidden;
          border: 1px solid #E2E8F0;
        }
        .admin-card-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #F1F5F9;
        }
        .admin-card-header h2 {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1E293B;
          margin: 0;
        }
        .admin-card-header.flex-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
        }

        .admin-card-body {
          padding: 1.5rem;
        }
        .admin-card-body.no-padding {
          padding: 0;
        }

        .flex-row-layout {
          display: flex;
          gap: 2rem;
        }
        .inputs-column {
          flex: 1.2;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .image-column {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .image-column label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #475569;
          margin-bottom: 0.5rem;
        }

        /* Fields */
        .admin-field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .admin-field label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #475569;
        }
        .admin-field input[type="text"],
        .admin-field textarea {
          padding: 0.65rem 0.85rem;
          border: 1px solid #CBD5E1;
          border-radius: 6px;
          font-size: 0.88rem;
          color: #334155;
          outline: none;
          background: #FFFFFF;
          font-family: inherit;
        }
        .admin-field input[type="text"]:focus,
        .admin-field textarea:focus {
          border-color: #0A1E38;
        }

        /* Image uploader */
        .image-uploader-wrapper {
          width: 100%;
          aspect-ratio: 16/7;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          position: relative;
          overflow: hidden;
        }
        .image-uploader-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .upload-overlay-btn {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid #CBD5E1;
          color: #1E293B;
          padding: 0.4rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          cursor: pointer;
        }
        .image-hint-text {
          font-size: 0.72rem;
          color: #94A3B8;
          margin-top: 0.5rem;
        }

        /* Postingan controls */
        .postingan-controls {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .search-bar-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-icon {
          position: absolute;
          left: 0.75rem;
          color: #94A3B8;
        }
        .search-bar-wrapper input {
          width: 240px;
          padding: 0.5rem 0.75rem 0.5rem 2.25rem;
          border: 1px solid #CBD5E1;
          border-radius: 6px;
          font-size: 0.85rem;
          color: #334155;
          outline: none;
          transition: border-color 0.2s;
        }
        .search-bar-wrapper input:focus {
          border-color: #0A1E38;
        }
        .btn-add-post {
          background: #0F172A;
          color: #FFFFFF;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-add-post:hover {
          background: #1E293B;
        }

        /* News list */
        .news-list-wrapper {
          display: flex;
          flex-direction: column;
        }
        .news-row-item {
          display: flex;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #F1F5F9;
          transition: background 0.2s;
        }
        .news-row-item:last-child {
          border-bottom: none;
        }
        .news-row-item:hover {
          background: #F8FAFC;
        }
        .news-thumbnail {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          overflow: hidden;
          background: #F1F5F9;
          flex-shrink: 0;
          margin-right: 1.25rem;
          border: 1px solid #E2E8F0;
        }
        .news-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .news-info-block {
          flex: 1;
          min-width: 0;
          margin-right: 1.5rem;
        }
        .news-info-block h3 {
          font-size: 0.95rem;
          font-weight: 700;
          color: #1E293B;
          margin: 0 0 0.4rem 0;
          line-height: 1.4;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .news-meta-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .status-badge {
          padding: 0.2rem 0.6rem;
          border-radius: 50px;
          font-size: 0.72rem;
          font-weight: 700;
        }
        .status-badge.published {
          background: #FEF9E7;
          color: #D9A006;
          border: 1px solid #FDE047;
        }
        .status-badge.draft {
          background: #F1F5F9;
          color: #475569;
          border: 1px solid #E2E8F0;
        }
        .date-meta {
          font-size: 0.75rem;
          color: #94A3B8;
          display: flex;
          align-items: center;
        }
        .news-actions-block {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .btn-action-edit {
          color: #475569;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-action-edit:hover {
          color: #0F172A;
          background: #F1F5F9;
          border-color: #CBD5E1;
        }
        .btn-action-delete {
          color: #EF4444;
          border: 1px solid #FEE2E2;
          background: #FEF2F2;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-action-delete:hover {
          color: #FFFFFF;
          background: #EF4444;
          border-color: #EF4444;
        }
        .loading-state, .empty-state {
          padding: 3rem 1.5rem;
          text-align: center;
          font-size: 0.88rem;
          color: #64748B;
        }
      `}</style>
    </div>
  );
}
