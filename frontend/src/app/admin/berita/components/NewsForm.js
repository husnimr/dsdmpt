"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Image as ImageIcon,
  ChevronRight
} from 'lucide-react';
import AdminSidebar from '../../../components/AdminSidebar';

const BACKEND_URL = 'http://localhost:8081';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('/uploads')) return `${BACKEND_URL}${path}`;
  return path;
};

export default function NewsForm({ mode = 'create', newsId = null }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('published');
  const [category, setCategory] = useState('Berita');
  
  // Toggle switches states
  const [autoPublish, setAutoPublish] = useState(true);
  const [autoLink, setAutoLink] = useState(true);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
    if (mode === 'edit' && newsId) {
      fetchNewsDetail();
    }
  }, [mode, newsId]);

  const getToken = () => localStorage.getItem('admin_token');

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchNewsDetail = async () => {
    setLoading(true);
    try {
      // Direct call to public or admin endpoint to fetch news detail
      const res = await fetch(`${BACKEND_URL}/api/news/${newsId}`);
      if (!res.ok) throw new Error('Gagal memuat detail berita');
      const data = await res.json();
      setTitle(data.title || '');
      setContent(data.content || '');
      setImageUrl(data.image_url || '');
      setStatus(data.status || 'published');
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setLoading(false);
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
        headers: { 'Authorization': `Bearer ${getToken()}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Gagal mengupload gambar');
      const data = await res.json();
      setImageUrl(data.url);
      showToast('success', 'Gambar berhasil diunggah');
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (targetStatus) => {
    if (!title.trim()) {
      showToast('error', 'Judul berita tidak boleh kosong');
      return;
    }
    if (!content.trim()) {
      showToast('error', 'Konten berita tidak boleh kosong');
      return;
    }

    setSaving(true);
    try {
      // Auto-generate slug
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      const body = {
        title,
        content,
        image_url: imageUrl,
        published_at: new Date().toISOString(),
        author: 'Administrator',
        slug: generatedSlug,
        status: targetStatus,
        images: JSON.stringify([imageUrl].filter(Boolean)),
        thumbnail_idx: 0
      };

      let url = `${BACKEND_URL}/api/admin/news`;
      let method = 'POST';

      if (mode === 'edit' && newsId) {
        url = `${BACKEND_URL}/api/admin/news/${newsId}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Gagal menyimpan berita');

      showToast('success', targetStatus === 'published' ? 'Berita berhasil diterbitkan!' : 'Berita disimpan sebagai draft!');
      setTimeout(() => {
        window.location.href = '/admin/berita';
      }, 1500);
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  // Helper function to insert markdown tags in textarea
  const insertText = (before, after = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = before + selected + after;

    setContent(text.substring(0, start) + replacement + text.substring(end));
    
    // Focus back and set selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 50);
  };

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
              <div className="header-text-block">
                <a href="/admin/berita" className="back-link">
                  <ArrowLeft size={16} />
                  <span>Kembali ke Berita</span>
                </a>
                <h1>{mode === 'edit' ? 'Edit Berita' : 'Buat Berita'}</h1>
                <div className="breadcrumb">
                  <span>Berita</span>
                  <ChevronRight size={12} className="separator" />
                  <span className="active-breadcrumb">{mode === 'edit' ? 'Edit Berita' : 'Buat Berita'}</span>
                </div>
              </div>
              
              <div className="header-actions">
                <button 
                  className="btn-draft" 
                  onClick={() => handleSave('draft')}
                  disabled={saving}
                >
                  Simpan Draft
                </button>
                <button 
                  className="btn-publish" 
                  onClick={() => handleSave('published')}
                  disabled={saving}
                >
                  {saving ? 'Menyimpan...' : 'Publish'}
                </button>
              </div>
            </div>

            {loading ? (
              <div className="loading-state-block">Memuat detail postingan...</div>
            ) : (
              <div className="news-editor-grid">
                
                {/* Left Column: Editor */}
                <div className="editor-left-column">
                  
                  {/* Judul Berita Input */}
                  <div className="editor-card font-card">
                    <label>Judul Berita</label>
                    <input 
                      type="text" 
                      placeholder="Masukkan judul berita di sini..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  {/* Body Editor Textarea */}
                  <div className="editor-card body-editor-card">
                    <div className="editor-toolbar">
                      <button type="button" onClick={() => insertText('**', '**')} title="Tebal"><Bold size={16} /></button>
                      <button type="button" onClick={() => insertText('*', '*')} title="Miring"><Italic size={16} /></button>
                      <button type="button" onClick={() => insertText('<u>', '</u>')} title="Garis Bawah"><Underline size={16} /></button>
                      <span className="toolbar-divider" />
                      <button type="button" onClick={() => insertText('- ')} title="Daftar Bulat"><List size={16} /></button>
                      <button type="button" onClick={() => insertText('1. ')} title="Daftar Angka"><ListOrdered size={16} /></button>
                      <span className="toolbar-divider" />
                      <button type="button" onClick={() => insertText('[', '](url)')} title="Sisipkan Link"><Link size={16} /></button>
                      <button type="button" onClick={() => insertText('![deskripsi](', ')') || fileInputRef.current?.click()} title="Unggah Gambar"><ImageIcon size={16} /></button>
                    </div>
                    <textarea 
                      ref={textareaRef}
                      placeholder="Tulis konten berita Anda di sini..."
                      rows={22}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>

                </div>

                {/* Right Column: Cards */}
                <div className="editor-right-column">
                  
                  {/* Card 1: Detail Publish */}
                  <div className="editor-card config-card">
                    <h3>Detail Publish</h3>
                    
                    <div className="config-field">
                      <label>Kategori</label>
                      <input 
                        type="text" 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)}
                      />
                    </div>

                    <div className="config-toggle-row">
                      <div className="toggle-info">
                        <span className="toggle-title">Tanggal Publikasi Otomatis</span>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={autoPublish} 
                          onChange={(e) => setAutoPublish(e.target.checked)} 
                        />
                        <span className="toggle-slider" />
                      </label>
                    </div>

                    <div className="config-toggle-row">
                      <div className="toggle-info">
                        <span className="toggle-title">Link Otomatis</span>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={autoLink} 
                          onChange={(e) => setAutoLink(e.target.checked)} 
                        />
                        <span className="toggle-slider" />
                      </label>
                    </div>
                  </div>

                  {/* Card 2: Gambar */}
                  <div className="editor-card image-card">
                    <div className="image-card-header">
                      <h3>Gambar</h3>
                      <button 
                        type="button" 
                        className="btn-change-image"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Ubah
                      </button>
                    </div>

                    <div 
                      className="image-preview-placeholder"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {imageUrl ? (
                        <img src={getImageUrl(imageUrl)} alt="Preview berita" />
                      ) : (
                        <div className="empty-preview">
                          <ImageIcon size={36} />
                          <span>Klik untuk unggah gambar</span>
                        </div>
                      )}
                    </div>
                    
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      accept="image/*"
                      onChange={handleImageUpload} 
                      style={{ display: 'none' }}
                    />
                    <span className="image-hint">Recommended size: 1200 × 630px</span>
                  </div>

                </div>

              </div>
            )}

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

        /* Header Area */
        .admin-page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2rem;
        }
        .header-text-block h1 {
          font-size: 1.6rem;
          font-weight: 700;
          color: #1E293B;
          margin: 0.4rem 0 0.5rem 0;
        }
        .back-link {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: #64748B;
          text-decoration: none;
          font-size: 0.8rem;
          font-weight: 600;
          transition: color 0.2s;
        }
        .back-link:hover {
          color: #0A1E38;
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

        /* Action Buttons */
        .btn-draft {
          background: #001f3f;
          color: #FFFFFF;
          border: none;
          padding: 0.6rem 1.5rem;
          border-radius: 6px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          margin-right: 0.75rem;
        }
        .btn-draft:hover {
          background: #001326;
        }
        .btn-publish {
          background: #FFC72C;
          color: #001f3f;
          border: none;
          padding: 0.6rem 1.5rem;
          border-radius: 6px;
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-publish:hover {
          background: #E0AE20;
        }

        /* Grid */
        .news-editor-grid {
          display: flex;
          gap: 1.5rem;
        }
        .editor-left-column {
          flex: 2.3;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .editor-right-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* Editor Cards */
        .editor-card {
          background: #FFFFFF;
          border-radius: 10px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
        }
        .editor-card label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #475569;
          margin-bottom: 0.5rem;
        }
        .editor-card input[type="text"] {
          padding: 0.75rem 1rem;
          border: 1px solid #CBD5E1;
          border-radius: 6px;
          font-size: 0.9rem;
          color: #334155;
          outline: none;
          background: #F8FAFC;
        }
        .editor-card input[type="text"]:focus {
          border-color: #0A1E38;
          background: #FFFFFF;
        }

        /* Textarea editor */
        .body-editor-card {
          padding: 0;
          overflow: hidden;
        }
        .editor-toolbar {
          background: #F8FAFC;
          border-bottom: 1px solid #E2E8F0;
          padding: 0.5rem 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .editor-toolbar button {
          background: none;
          border: none;
          color: #475569;
          width: 28px;
          height: 28px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .editor-toolbar button:hover {
          background: #E2E8F0;
          color: #0F172A;
        }
        .toolbar-divider {
          width: 1px;
          height: 18px;
          background: #E2E8F0;
          margin: 0 0.4rem;
        }
        .body-editor-card textarea {
          border: none;
          outline: none;
          padding: 1.5rem;
          font-size: 0.95rem;
          line-height: 1.6;
          color: #334155;
          resize: none;
          font-family: inherit;
        }

        /* Detail Config Card */
        .config-card h3 {
          font-size: 0.95rem;
          font-weight: 700;
          color: #1E293B;
          margin: 0 0 1.25rem 0;
          border-bottom: 1px solid #F1F5F9;
          padding-bottom: 0.75rem;
        }
        .config-field {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          margin-bottom: 1.25rem;
        }
        .config-field input {
          background: #F8FAFC !important;
          border: 1px solid #E2E8F0 !important;
          font-weight: 500;
        }

        .config-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-top: 1px solid #F1F5F9;
        }
        .toggle-title {
          font-size: 0.82rem;
          font-weight: 600;
          color: #475569;
        }

        /* Toggle Slider Switch */
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 42px;
          height: 22px;
        }
        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .toggle-slider {
          position: absolute;
          cursor: pointer;
          inset: 0;
          background-color: #CBD5E1;
          transition: .3s;
          border-radius: 34px;
        }
        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .3s;
          border-radius: 50%;
        }
        input:checked + .toggle-slider {
          background-color: #FFC72C;
        }
        input:checked + .toggle-slider:before {
          transform: translateX(20px);
        }

        /* Image Card */
        .image-card {
          padding: 1.25rem 1.5rem;
        }
        .image-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .image-card-header h3 {
          font-size: 0.95rem;
          font-weight: 700;
          color: #1E293B;
          margin: 0;
        }
        .btn-change-image {
          background: none;
          border: none;
          color: #3B82F6;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-change-image:hover {
          text-decoration: underline;
        }
        .image-preview-placeholder {
          width: 100%;
          aspect-ratio: 16/10;
          background: #F8FAFC;
          border: 1px dashed #CBD5E1;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.2s;
        }
        .image-preview-placeholder:hover {
          border-color: #3B82F6;
        }
        .image-preview-placeholder img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .empty-preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: #94A3B8;
          font-size: 0.78rem;
        }
        .image-hint {
          font-size: 0.72rem;
          color: #94A3B8;
          margin-top: 0.5rem;
          text-align: center;
        }

        .loading-state-block {
          padding: 6rem 2rem;
          text-align: center;
          color: #64748B;
          background: #FFFFFF;
          border-radius: 12px;
          border: 1px solid #E2E8F0;
        }

        @media (max-width: 1024px) {
          .news-editor-grid {
            flex-direction: column;
          }
          .editor-left-column, .editor-right-column {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
}
