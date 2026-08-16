"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Save, Upload, Image, FileText, CheckCircle, AlertCircle, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

const BACKEND_URL = 'http://localhost:8081';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('/uploads')) return `${BACKEND_URL}${path}`;
  return path;
};

export default function AdminGlobalTalentPage() {
  const [text1, setText1] = useState('');
  const [image, setImage] = useState('');
  
  // Aturan Umum & Alur list state (Dynamic Arrays)
  const [aturanList, setAturanList] = useState([]);
  const [alurList, setAlurList] = useState([]);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

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

  const loadSettings = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/settings`);
      const data = await res.json();
      setText1(data.global_talent_text_1 || '');
      setImage(data.global_talent_image || '');

      // Load Aturan list
      let parsedAturan = [];
      if (data.global_talent_aturan_json) {
        try {
          parsedAturan = JSON.parse(data.global_talent_aturan_json);
        } catch(e) {}
      }
      setAturanList(parsedAturan.length ? parsedAturan : [
        'Kegiatan dilaksanakan dalam rangka mendukung peningkatan kualitas akademik, riset, publikasi, dan jejaring internasional UI.',
        'Peserta atau mitra yang terlibat harus memenuhi persyaratan sesuai dengan jenis kegiatan dan ketentuan program yang berlaku.',
        'Kegiatan harus memiliki tujuan, luaran, dan manfaat yang jelas bagi pengembangan akademik dan/atau riset.'
      ]);

      // Load Alur list
      let parsedAlur = [];
      if (data.global_talent_alur_json) {
        try {
          parsedAlur = JSON.parse(data.global_talent_alur_json);
        } catch(e) {}
      }
      setAlurList(parsedAlur.length ? parsedAlur : [
        'Informasi mengenai program, jenis kegiatan, persyaratan, dan mekanisme pelaksanaan disampaikan kepada calon peserta atau pihak yang berkepentingan.',
        'Calon peserta, dosen, peneliti, atau unit pengusul mengajukan kegiatan atau mengidentifikasi calon mitra sesuai dengan skema program yang tersedia.'
      ]);

    } catch (err) {
      showToast('error', 'Gagal memuat data settings');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          global_talent_text_1: text1,
          global_talent_image: image,
          global_talent_aturan_json: JSON.stringify(aturanList.filter(item => item.trim() !== '')),
          global_talent_alur_json: JSON.stringify(alurList.filter(item => item.trim() !== '')),
        }),
      });

      if (res.status === 401) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/admin/login';
        return;
      }

      if (!res.ok) throw new Error('Gagal menyimpan');

      showToast('success', 'Perubahan berhasil disimpan!');
      loadSettings(); // Reload to get cleaned empty values
    } catch (err) {
      showToast('error', err.message || 'Gagal menyimpan perubahan');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${BACKEND_URL}/api/admin/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
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
      setImage(data.url);
      showToast('success', 'Gambar berhasil diupload!');
    } catch (err) {
      showToast('error', err.message || 'Gagal mengupload gambar');
    } finally {
      setUploading(false);
    }
  };

  // Helper arrays update
  const updateAturanItem = (idx, value) => {
    const updated = [...aturanList];
    updated[idx] = value;
    setAturanList(updated);
  };

  const addAturanItem = () => {
    setAturanList([...aturanList, '']);
  };

  const removeAturanItem = (idx) => {
    const updated = aturanList.filter((_, i) => i !== idx);
    setAturanList(updated);
  };

  const moveAturan = (idx, direction) => {
    const updated = [...aturanList];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setAturanList(updated);
  };

  const updateAlurItem = (idx, value) => {
    const updated = [...alurList];
    updated[idx] = value;
    setAlurList(updated);
  };

  const addAlurItem = () => {
    setAlurList([...alurList, '']);
  };

  const removeAlurItem = (idx) => {
    const updated = alurList.filter((_, i) => i !== idx);
    setAlurList(updated);
  };

  const moveAlur = (idx, direction) => {
    const updated = [...alurList];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setAlurList(updated);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar Component */}
      <AdminSidebar activePage="global-talent" />

      {/* Main Content Area */}
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
              <h1>Edit Global Talent</h1>
              <p>Kelola semua konten deskripsi, gambar, aturan umum, dan alur pelaksanaan program Global Talent</p>
            </div>

            {/* Intro Section */}
            <div className="admin-card">
              <div className="admin-card-header">
                <FileText size={20} />
                <h2>1. Deskripsi Intro Global Talent</h2>
              </div>
              <div className="admin-form">
                <div className="admin-field">
                  <label htmlFor="text_1">
                    Paragraf Intro (Mendukung tag HTML &lt;strong&gt;, &lt;br/&gt;)
                    <span className="admin-field-hint">Gabungan deskripsi utama program Global Talent</span>
                  </label>
                  <textarea
                    id="text_1"
                    value={text1}
                    onChange={(e) => setText1(e.target.value)}
                    rows={8}
                    placeholder="Masukkan konten paragraf..."
                  />
                </div>
              </div>
            </div>

            {/* Aturan Umum Section */}
            <div className="admin-card">
              <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={20} />
                  <h2>2. Aturan Umum (Bisa Tambah/Hapus)</h2>
                </div>
                <button type="button" className="list-add-btn" onClick={addAturanItem}>
                  <Plus size={16} /> Add Item
                </button>
              </div>
              <div className="admin-form">
                {aturanList.map((item, idx) => (
                  <div key={idx} className="list-item-field">
                    <div className="list-item-header">
                      <span className="list-item-index">Poin Aturan {idx + 1}</span>
                      <div className="list-item-actions">
                        <button type="button" disabled={idx === 0} onClick={() => moveAturan(idx, -1)} className="sort-btn"><ArrowUp size={14} /></button>
                        <button type="button" disabled={idx === aturanList.length - 1} onClick={() => moveAturan(idx, 1)} className="sort-btn"><ArrowDown size={14} /></button>
                        <button type="button" onClick={() => removeAturanItem(idx)} className="delete-item-btn"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <textarea 
                      rows={2} 
                      value={item} 
                      onChange={(e) => updateAturanItem(idx, e.target.value)} 
                      placeholder="Tulis aturan..."
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Alur Pelaksanaan Section */}
            <div className="admin-card">
              <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={20} />
                  <h2>3. Alur Pelaksanaan Secara Umum (Bisa Tambah/Hapus)</h2>
                </div>
                <button type="button" className="list-add-btn" onClick={addAlurItem}>
                  <Plus size={16} /> Add Langkah
                </button>
              </div>
              <div className="admin-form">
                {alurList.map((item, idx) => (
                  <div key={idx} className="list-item-field">
                    <div className="list-item-header">
                      <span className="list-item-index">Langkah {idx + 1}</span>
                      <div className="list-item-actions">
                        <button type="button" disabled={idx === 0} onClick={() => moveAlur(idx, -1)} className="sort-btn"><ArrowUp size={14} /></button>
                        <button type="button" disabled={idx === alurList.length - 1} onClick={() => moveAlur(idx, 1)} className="sort-btn"><ArrowDown size={14} /></button>
                        <button type="button" onClick={() => removeAlurItem(idx)} className="delete-item-btn"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <textarea 
                      rows={2} 
                      value={item} 
                      onChange={(e) => updateAlurItem(idx, e.target.value)} 
                      placeholder="Tulis alur pelaksanaan..."
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Gambar Section */}
            <div className="admin-card">
              <div className="admin-card-header">
                <Image size={20} />
                <h2>4. Gambar Global Talent</h2>
              </div>

              <div className="admin-form">
                <div className="admin-image-upload-area">
                  {image ? (
                    <div className="admin-image-preview">
                      <img src={getImageUrl(image)} alt="Global Talent preview" />
                      <div className="admin-image-overlay">
                        <button
                          className="admin-change-img-btn"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                        >
                          <Upload size={16} />
                          {uploading ? 'Mengupload...' : 'Ganti Gambar'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="admin-image-dropzone"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={32} />
                      <p>Klik untuk upload gambar</p>
                      <span>JPG, PNG, WebP (max 10MB)</span>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
            </div>

            {/* Save button */}
            <div className="admin-actions">
              <button
                className="admin-save-btn"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <span className="admin-spinner" />
                ) : (
                  <Save size={18} />
                )}
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #F8FAFC;
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        }

        .admin-content-wrapper {
          flex: 1;
          min-width: 0;
          overflow-y: auto;
        }

        .list-add-btn {
          background: #2563EB;
          color: #fff;
          border: none;
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          font-weight: 700;
          font-size: 0.78rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-family: inherit;
          transition: all 0.2s;
        }
        .list-add-btn:hover {
          background: #1D4ED8;
        }

        .list-item-field {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .list-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .list-item-index {
          font-size: 0.78rem;
          font-weight: 700;
          color: #0F172A;
          text-transform: uppercase;
        }
        .list-item-actions {
          display: flex;
          gap: 0.3rem;
        }
        .sort-btn {
          border: 1px solid #CBD5E1;
          background: #ffffff;
          padding: 0.25rem;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          color: #475569;
        }
        .sort-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .delete-item-btn {
          border: 1px solid #FCA5A5;
          background: #FEF2F2;
          color: #EF4444;
          padding: 0.25rem;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        .delete-item-btn:hover {
          background: #EF4444;
          color: #ffffff;
          border-color: #EF4444;
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
          z-index: 200;
          animation: toastIn 0.3s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .admin-toast.success {
          background: #F0FDF4;
          color: #16A34A;
          border: 1px solid #BBF7D0;
        }
        .admin-toast.error {
          background: #FEF2F2;
          color: #DC2626;
          border: 1px solid #FECACA;
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(-10px) translateX(10px); }
          to { opacity: 1; transform: translateY(0) translateX(0); }
        }

        /* Main */
        .admin-main {
          padding: 3rem 0 4rem;
        }
        .admin-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .admin-page-header {
          margin-bottom: 2.5rem;
        }
        .admin-page-header h1 {
          font-size: 1.8rem;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 0.35rem;
        }
        .admin-page-header p {
          font-size: 0.95rem;
          color: #64748B;
        }

        /* Cards */
        .admin-card {
          background: #fff;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 1.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .admin-card-header {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #F1F5F9;
          color: #0F172A;
        }
        .admin-card-header h2 {
          font-size: 0.98rem;
          font-weight: 700;
          color: #0F172A;
          margin: 0;
        }

        /* Form */
        .admin-form {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .admin-field label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: #475569;
          margin-bottom: 0.5rem;
        }
        .admin-field-hint {
          display: block;
          font-size: 0.75rem;
          font-weight: 400;
          color: #94A3B8;
          margin-top: 0.15rem;
        }
        .admin-field textarea, .list-item-field textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1.5px solid #E2E8F0;
          border-radius: 8px;
          font-size: 0.9rem;
          font-family: inherit;
          color: #1E293B;
          background: #FFFFFF;
          resize: vertical;
          line-height: 1.7;
          transition: all 0.2s;
          outline: none;
          box-sizing: border-box;
        }
        .admin-field textarea:focus, .list-item-field textarea:focus {
          border-color: #2563EB;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
        }

        /* Image upload */
        .admin-image-upload-area {
          width: 100%;
        }
        .admin-image-preview {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #E2E8F0;
        }
        .admin-image-preview img {
          width: 100%;
          height: 280px;
          object-fit: cover;
          display: block;
        }
        .admin-image-overlay {
          position: absolute;
          inset: 0;
          background: rgba(15,23,42,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.25s;
        }
        .admin-image-preview:hover .admin-image-overlay {
          opacity: 1;
        }
        .admin-change-img-btn {
          background: #fff;
          color: #0F172A;
          border: 1px solid #E2E8F0;
          padding: 0.6rem 1.25rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-family: inherit;
          transition: all 0.2s;
        }
        .admin-change-img-btn:hover {
          background: #F8FAFC;
        }
        .admin-change-img-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .admin-image-dropzone {
          border: 2px dashed #CBD5E1;
          border-radius: 8px;
          padding: 3rem 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          color: #94A3B8;
        }
        .admin-image-dropzone:hover {
          border-color: #2563EB;
          color: #2563EB;
          background: #F8FAFC;
        }
        .admin-image-dropzone p {
          font-size: 0.9rem;
          font-weight: 600;
          margin: 0.75rem 0 0.25rem;
          color: inherit;
        }
        .admin-image-dropzone span {
          font-size: 0.75rem;
        }

        /* Actions */
        .admin-actions {
          display: flex;
          justify-content: flex-end;
          padding-top: 0.5rem;
        }
        .admin-save-btn {
          background: #2563EB;
          color: #fff;
          border: none;
          padding: 0.7rem 1.75rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: inherit;
          transition: all 0.2s;
        }
        .admin-save-btn:hover:not(:disabled) {
          background: #1D4ED8;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37,99,235,0.2);
        }
        .admin-save-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .admin-spinner {
          width: 18px;
          height: 18px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .admin-layout { flex-direction: column; }
          .admin-sidebar { width: 100%; height: auto; position: static; }
          .admin-container { padding: 0 1rem; }
        }
      `}</style>
    </div>
  );
}
