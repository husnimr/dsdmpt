"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  ChevronRight, 
  Link as LinkIcon
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

const BACKEND_URL = 'http://localhost:8081';

export default function AdminRekrutmenPage() {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Hero section states
  const [heroTitle, setHeroTitle] = useState('');
  const [heroDesc, setHeroDesc] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [uploadingHero, setUploadingHero] = useState(false);
  const [savingHero, setSavingHero] = useState(false);
  const heroFileRef = useRef(null);

  // Rekrutmen content states
  const [rekrutmenDesc, setRekrutmenDesc] = useState('');
  const [rekrutmenLink, setRekrutmenLink] = useState('');
  const [rekrutmenLinkTitle, setRekrutmenLinkTitle] = useState('');
  const [savingContent, setSavingContent] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
    loadSettings();
  }, []);

  const getToken = () => localStorage.getItem('admin_token');

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('/uploads')) return `${BACKEND_URL}${path}`;
    return path;
  };

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/settings`);
      const data = await res.json();
      
      // Hero settings
      setHeroTitle(data.rekrutmen_hero_title || 'Rekrutmen');
      setHeroDesc(data.rekrutmen_hero_desc || 'Membangun Masa Depan Melalui Talenta Unggul & Impactful');
      setHeroImage(data.rekrutmen_hero_image || data.hero_image || '/uploads/ui_rectorate_hero.png');
      
      // Content settings
      setRekrutmenDesc(data.rekrutmen_description || 'Direktorat Sumber Daya Manusia dan Pengembangan Talenta (DSDMPT) berkomitmen untuk merekrut individu yang berdedikasi tinggi demi memajukan visi pendidikan nasional. Kami mencari talenta yang siap berkontribusi pada ekosistem akademik yang prestisius, inovatif, dan berintegritas.');
      setRekrutmenLink(data.rekrutmen_link || '');
      setRekrutmenLinkTitle(data.rekrutmen_link_title || 'Portal Rekrutmen UI');
    } catch (err) {
      showToast('error', 'Gagal memuat data settings');
    } finally {
      setLoading(false);
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

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) throw new Error('Gagal mengupload gambar');
      const data = await res.json();
      setHeroImage(data.url);
      showToast('success', 'Gambar Hero berhasil diupload!');
    } catch (err) {
      showToast('error', err.message || 'Gagal mengupload gambar');
    } finally {
      setUploadingHero(false);
    }
  };

  const handleSaveHeroSettings = async () => {
    setSavingHero(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          rekrutmen_hero_title: heroTitle,
          rekrutmen_hero_desc: heroDesc,
          rekrutmen_hero_image: heroImage,
        }),
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) throw new Error('Gagal menyimpan settings');

      showToast('success', 'Hero Section berhasil disimpan!');
    } catch (err) {
      showToast('error', err.message || 'Gagal menyimpan perubahan');
    } finally {
      setSavingHero(false);
    }
  };

  const handleSaveContentSettings = async () => {
    setSavingContent(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          rekrutmen_description: rekrutmenDesc,
          rekrutmen_link: rekrutmenLink,
          rekrutmen_link_title: rekrutmenLinkTitle,
        }),
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) throw new Error('Gagal menyimpan settings');

      showToast('success', 'Konten Rekrutmen berhasil disimpan!');
    } catch (err) {
      showToast('error', err.message || 'Gagal menyimpan perubahan');
    } finally {
      setSavingContent(false);
    }
  };

  const handleUnauthorized = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/admin/login';
  };

  return (
    <div className="admin-layout">
      {/* Sidebar Component */}
      <AdminSidebar activePage="rekrutmen" />

      {/* Content Area */}
      <div className="admin-content-wrapper">
        {toast && (
          <div className={`admin-toast ${toast.type}`}>
            {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{toast.message}</span>
          </div>
        )}

        <main className="admin-main">
          <div className="admin-container">
            <div className="admin-page-header">
             
            </div>

            {loading ? (
              <div className="table-loading">
                <div className="admin-spinner" />
                <p>Memuat data rekrutmen...</p>
              </div>
            ) : (
              <>
                {/* HERO SECTION CARD */}
                <div className="admin-card" style={{ marginBottom: '2rem' }}>
                  <div className="admin-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h2>Hero Section</h2>
                    </div>
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
                      <div className="admin-field" style={{ marginTop: '1rem' }}>
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
                          type="button"
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

                  <div className="admin-card-footer" style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem 1.5rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
                    <button 
                      className="btn-save" 
                      onClick={handleSaveHeroSettings}
                      disabled={savingHero}
                    >
                      {savingHero ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                  </div>
                </div>

                {/* CONTENT SECTION CARD */}
                <div className="admin-card">
                  <div className="admin-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h2>Link Portal Rekrutmen</h2>
                    </div>
                  </div>
                  
                  <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="admin-field">
                      <label>Deskripsi Halaman Rekrutmen</label>
                      <textarea 
                        rows={5} 
                        value={rekrutmenDesc}
                        onChange={(e) => setRekrutmenDesc(e.target.value)}
                        placeholder="Tulis deskripsi rekrutmen..."
                      />
                    </div>
                    
                    <div className="admin-field">
                      <label>Teks Tombol Tautan</label>
                      <input 
                        type="text" 
                        value={rekrutmenLinkTitle}
                        onChange={(e) => setRekrutmenLinkTitle(e.target.value)}
                        placeholder="Contoh: Portal Rekrutmen UI"
                      />
                    </div>

                    <div className="admin-field">
                      <label>URL / Link Rekrutmen</label>
                      <input 
                        type="text" 
                        value={rekrutmenLink}
                        onChange={(e) => setRekrutmenLink(e.target.value)}
                        placeholder="https://rekrutmen.ui.ac.id"
                      />
                    </div>
                  </div>

                  <div className="admin-card-footer" style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem 1.5rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
                    <button 
                      className="btn-save" 
                      onClick={handleSaveContentSettings}
                      disabled={savingContent}
                    >
                      {savingContent ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
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
          padding: 0rem 0 4rem;
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
        .admin-page-header h1 {
          font-size: 1.6rem;
          font-weight: 700;
          color: #1E293B;
          margin: 0 0 0.25rem 0;
        }

        /* Buttons */
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

        .admin-card-body {
          padding: 1.5rem;
        }

        .flex-row-layout {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
        }
        .inputs-column {
          flex: 1.2;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
        }
        .image-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          width: 100%;
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
          width: 100%;
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
          width: 100%;
          box-sizing: border-box;
        }
        .admin-field input[type="text"]:focus,
        .admin-field textarea:focus {
          border-color: #0A1E38;
        }

        /* Image uploader */
        .image-uploader-wrapper {
          width: 100%;
          aspect-ratio: 21/9;
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
        .breadcrumb {
          display: flex;
          align-items: center;
          font-size: 0.78rem;
          color: #94A3B8;
        }
        .breadcrumb .separator {
          margin: 0 0.4rem;
          color: #CBD5E1;
        }
        .breadcrumb .active-breadcrumb {
          color: #475569;
          font-weight: 600;
        }
        .table-loading {
          padding: 4rem 2rem;
          text-align: center;
          color: #64748B;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        .admin-spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(0,31,63,0.1);
          border-top-color: #001f3f;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .admin-layout { flex-direction: column; }
          .admin-container { padding: 0 1rem; }
          .flex-row-layout { flex-direction: column; gap: 1.5rem; }
        }
      `}} />
    </div>
  );
}
