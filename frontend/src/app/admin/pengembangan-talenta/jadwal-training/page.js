"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Upload,
  CheckCircle, 
  AlertCircle
} from 'lucide-react';
import AdminSidebar from '../../../components/AdminSidebar';

const BACKEND_URL = 'http://localhost:8081';

const DEFAULT_INTRO_DESCRIPTION = `Pada Direktorat Sumber Daya Manusia dan Pengembangan Talenta Universitas Indonesia (DSDMPT UI), pengembangan talenta mencakup pelatihan berkala dan terstruktur untuk membangun kapasitas, kompetensi, serta komitmen para dosen dan tenaga kependidikan (tendik).

Melalui berbagai program pelatihan ini, DSDMPT UI menerapkan merit system dalam manajemen talenta—memastikan seluruh sivitas akademika memiliki jalur pengembangan karir yang jelas, adaptif terhadap perkembangan zaman, serta siap mendukung UI sebagai perguruan tinggi berkelas dunia.

Secara keseluruhan, program pelatihan di DSDMPT UI bukan sekadar kegiatan rutin, melainkan investasi berkelanjutan untuk menerapkan merit system—di mana setiap SDM diberikan kesempatan tumbuh sesuai potensi terbaiknya demi mendukung reputasi Universitas Indonesia sebagai perguruan tinggi berkelas dunia.`;

export default function AdminJadwalTrainingPage() {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Settings states
  const [heroTitle, setHeroTitle] = useState('');
  const [heroDesc, setHeroDesc] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [description, setDescription] = useState('');
  const [introImage, setIntroImage] = useState('');

  const [savingHero, setSavingHero] = useState(false);
  const [savingIntro, setSavingIntro] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingIntro, setUploadingIntro] = useState(false);

  const heroFileRef = useRef(null);
  const introFileRef = useRef(null);

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
      setHeroTitle(data.jadwal_training_hero_title || 'Jadwal Training');
      setHeroDesc(data.jadwal_training_hero_desc || '');
      setHeroImage(data.jadwal_training_hero_image || data.hero_image || '/uploads/ui_rectorate_hero.png');
      
      // Load description with robust fallback
      let initialDesc = data.jadwal_training_description || '';
      if (!initialDesc) {
        if (data.jadwal_training_intro_p1 || data.jadwal_training_intro_p2 || data.jadwal_training_intro_p3) {
          const paragraphs = [
            data.jadwal_training_intro_p1,
            data.jadwal_training_intro_p2,
            data.jadwal_training_intro_p3
          ].filter(Boolean);
          initialDesc = paragraphs.join('\n\n');
        } else {
          initialDesc = DEFAULT_INTRO_DESCRIPTION;
        }
      }
      setDescription(initialDesc);
      setIntroImage(data.jadwal_training_intro_image || '/uploads/talent_1.jpg');
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
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/admin/login';
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

  const handleIntroImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingIntro(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${BACKEND_URL}/api/admin/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getToken()}` },
        body: formData,
      });

      if (res.status === 401) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/admin/login';
        return;
      }

      if (!res.ok) throw new Error('Gagal mengupload gambar');
      const data = await res.json();
      setIntroImage(data.url);
      showToast('success', 'Gambar berhasil diupload!');
    } catch (err) {
      showToast('error', err.message || 'Gagal mengupload gambar');
    } finally {
      setUploadingIntro(false);
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
          jadwal_training_hero_title: heroTitle,
          jadwal_training_hero_desc: heroDesc,
          jadwal_training_hero_image: heroImage,
        }),
      });

      if (res.status === 401) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/admin/login';
        return;
      }

      if (!res.ok) throw new Error('Gagal menyimpan settings hero');
      showToast('success', 'Hero Section berhasil disimpan!');
    } catch (err) {
      showToast('error', err.message || 'Gagal menyimpan perubahan');
    } finally {
      setSavingHero(false);
    }
  };

  const handleSaveIntroSettings = async () => {
    setSavingIntro(true);
    try {
      // Split description into paragraphs for backwards compatibility
      const paragraphs = description.split('\n\n').filter(Boolean);
      const p1 = paragraphs[0] || '';
      const p2 = paragraphs[1] || '';
      const p3 = paragraphs[2] || '';

      const res = await fetch(`${BACKEND_URL}/api/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          jadwal_training_description: description,
          jadwal_training_intro_p1: p1,
          jadwal_training_intro_p2: p2,
          jadwal_training_intro_p3: p3,
          jadwal_training_intro_image: introImage,
        }),
      });

      if (res.status === 401) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/admin/login';
        return;
      }

      if (!res.ok) throw new Error('Gagal menyimpan settings deskripsi');
      showToast('success', 'Deskripsi & Gambar!');
    } catch (err) {
      showToast('error', err.message || 'Gagal menyimpan perubahan');
    } finally {
      setSavingIntro(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar activePage="jadwal-training" />

      <div className="admin-content-wrapper" style={{ overflow: 'visible !important' }}>
        <main className="admin-main" style={{ padding: '0rem 0 4rem' }}>
          <div className="admin-container" style={{ padding: '2.5rem', maxWidth: '1360px', margin: '0 auto' }}>
            
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '1rem' }}>
                <div className="admin-spinner" />
                <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Memuat data settings...</p>
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
                        <label>Judul Halaman</label>
                        <input 
                          type="text" 
                          value={heroTitle}
                          onChange={(e) => setHeroTitle(e.target.value)}
                        />
                      </div>
                      <div className="admin-field" style={{ marginTop: '1rem' }}>
                        <label>Deskripsi Judul</label>
                        <textarea 
                          rows={3} 
                          value={heroDesc}
                          onChange={(e) => setHeroDesc(e.target.value)}
                          placeholder="Masukkan teks sub-hero jika ada..."
                        />
                      </div>
                    </div>

                    <div className="image-column">
                      <label>Background</label>
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
                      <span className="image-hint-text">Rekomendasi ukuran: 1920x600px. Maksimal 2MB.</span>
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

                {/* INTRO SECTION CARD */}
                <div className="admin-card" style={{ marginBottom: '2rem' }}>
                  <div className="admin-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h2>Deskripsi & Gambar</h2>
                    </div>
                  </div>
                  
                  <div className="admin-card-body flex-row-layout">
                    <div className="inputs-column">
                      <div className="admin-field">
                        <label>Deskripsi</label>
                        <textarea 
                          rows={10} 
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Masukkan deskripsi program jadwal training..."
                          style={{ minHeight: '240px' }}
                        />
                        <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>
                          * Gunakan tombol Enter (baris kosong baru) untuk memisahkan antar paragraf.
                        </span>
                      </div>
                    </div>

                    <div className="image-column">
                      <label>Gambar</label>
                      <div className="image-uploader-wrapper">
                        <img src={getImageUrl(introImage)} alt="Intro Group" />
                        <button 
                          type="button"
                          className="upload-overlay-btn"
                          onClick={() => introFileRef.current?.click()}
                          disabled={uploadingIntro}
                        >
                          <Upload size={16} />
                          {uploadingIntro ? 'Mengunggah...' : 'Upload Image'}
                        </button>
                        <input 
                          type="file" 
                          ref={introFileRef} 
                          accept="image/*"
                          onChange={handleIntroImageUpload} 
                          style={{ display: 'none' }}
                        />
                      </div>
                      <span className="image-hint-text">800x500px. Maksimal 2MB.</span>
                    </div>
                  </div>

                  <div className="admin-card-footer" style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem 1.5rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
                    <button 
                      className="btn-save" 
                      onClick={handleSaveIntroSettings}
                      disabled={savingIntro}
                    >
                      {savingIntro ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>
        </main>
      </div>

      {/* TOAST SYSTEM */}
      {toast && (
        <div className={`admin-toast ${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* REUSED CSS FROM OTHER ADMIN PAGES */}
      <style jsx global>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #F4F6F9;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .admin-content-wrapper {
          flex: 1;
          min-width: 0;
          overflow: visible !important;
        }

        /* Toast */
        .admin-toast {
          position: fixed;
          top: 1.5rem;
          right: 1.5rem;
          padding: 0.8rem 1.25rem;
          border-radius: 8px;
          color: white;
          display: flex;
          align-items: center;
          gap: 0.55rem;
          font-size: 0.88rem;
          font-weight: 600;
          z-index: 9999;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          animation: slideIn 0.25s ease-out;
        }
        .admin-toast.success {
          background-color: #10B981;
        }
        .admin-toast.error {
          background-color: #EF4444;
        }
        @keyframes slideIn {
          from { transform: translateY(-1rem); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* Cards styling */
        .admin-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          overflow: hidden;
        }
        .admin-card-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #E2E8F0;
        }
        .admin-card-header h2 {
          font-size: 1.05rem;
          font-weight: 700;
          color: #0F172A;
          margin: 0;
        }
        .admin-card-body {
          padding: 1.5rem;
        }

        /* Horizontal/split layout inside cards */
        .flex-row-layout {
          display: flex;
          gap: 2rem;
        }
        .flex-row-layout .inputs-column {
          flex: 2;
          display: flex;
          flex-direction: column;
        }
        .flex-row-layout .image-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        @media (max-width: 991px) {
          .flex-row-layout {
            flex-direction: column;
          }
        }

        /* Input fields and labels */
        .admin-field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          width: 100%;
        }
        .admin-field label, .image-column label {
          font-size: 0.8rem;
          font-weight: 700;
          color: #475569;
          letter-spacing: 0.5px;
        }
        .admin-field input, .admin-field textarea {
          padding: 0.65rem 0.85rem;
          border: 1px solid #CBD5E1;
          border-radius: 6px;
          font-size: 0.9rem;
          color: #0F172A;
          background-color: #FFFFFF;
          transition: border-color 0.2s;
          font-family: inherit;
        }
        .admin-field input:focus, .admin-field textarea:focus {
          outline: none;
          border-color: #0B2F61;
        }

        /* Image Uploader widget */
        .image-uploader-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16/10;
          border-radius: 8px;
          border: 1px solid #E2E8F0;
          overflow: hidden;
          background-color: #F8FAFC;
          margin-top: 0.4rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .image-uploader-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .upload-overlay-btn {
          position: absolute;
          background: rgba(15, 23, 42, 0.75);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          transition: background 0.2s;
        }
        .upload-overlay-btn:hover {
          background: rgba(15, 23, 42, 0.9);
        }
        .image-hint-text {
          font-size: 0.72rem;
          color: #64748B;
          margin-top: 0.5rem;
        }

        /* Buttons styling */
        .btn-save {
          background-color: #FFC72C;
          color: #001f3f;
          border: none;
          padding: 0.65rem 1.75rem;
          border-radius: 6px;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .btn-save:hover {
          background-color: #E0AE20;
        }
        .btn-save:disabled {
          background-color: #E2E8F0;
          color: #94A3B8;
          cursor: not-allowed;
        }

        /* Loading Spinner */
        .admin-spinner {
          width: 24px;
          height: 24px;
          border: 3px solid #E2E8F0;
          border-top: 3px solid #0b2f61;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
