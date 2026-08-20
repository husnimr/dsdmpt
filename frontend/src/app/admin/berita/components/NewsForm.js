"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  List,
  ListOrdered,
  Link,
  Image as ImageIcon,
  ChevronRight,
  Plus,
  Trash2,
  FileText,
  Eye,
  Table as TableIcon,
  Minus
} from 'lucide-react';
import dynamic from 'next/dynamic';
import AdminSidebar from '../../../components/AdminSidebar';

const CustomRichEditor = dynamic(
  () => import('./CustomRichEditor'),
  { ssr: false }
);

const BACKEND_URL = 'http://localhost:8081';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('/uploads')) return `${BACKEND_URL}${path}`;
  return path;
};

const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export default function NewsForm({ mode = 'create', newsId = null }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [thumbnailUrl, setThumbnailUrl] = useState(''); // Separate primary thumbnail
  const [status, setStatus] = useState('published');
  const [category, setCategory] = useState('Berita');
  
  const [publishedAt, setPublishedAt] = useState('');
  const [slug, setSlug] = useState('');

  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview'

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);

  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  const textareaRef = useRef(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
    if (mode === 'edit' && newsId) {
      fetchNewsDetail();
    } else {
      // Set default formatted date for publishedAt
      const now = new Date();
      const offset = now.getTimezoneOffset();
      const adjustedDate = new Date(now.getTime() - (offset * 60 * 1000));
      setPublishedAt(adjustedDate.toISOString().slice(0, 16));
    }
  }, [mode, newsId]);

  const getToken = () => localStorage.getItem('admin_token');

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingThumbnail(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${BACKEND_URL}/api/admin/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getToken()}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Gagal mengupload thumbnail');
      const data = await res.json();
      setThumbnailUrl(data.url);
      showToast('success', 'Gambar thumbnail utama berhasil diunggah');
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setUploadingThumbnail(false);
      if (thumbnailInputRef.current) {
        thumbnailInputRef.current.value = '';
      }
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchNewsDetail = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/news/${newsId}`);
      if (!res.ok) throw new Error('Gagal memuat detail berita');
      const data = await res.json();
      setTitle(data.title || '');
      setContent(data.content || '');
      
      let loadedImages = [];
      try {
        if (data.images) {
          loadedImages = JSON.parse(data.images);
        } else if (data.image_url) {
          loadedImages = [data.image_url];
        }
      } catch (e) {
        if (data.image_url) {
          loadedImages = [data.image_url];
        }
      }
      setImages(loadedImages);
      setThumbnailUrl(data.image_url || (loadedImages[data.thumbnail_idx] || ''));
      setStatus(data.status || 'published');
      
      if (data.published_at) {
        const publishDate = new Date(data.published_at);
        const offset = publishDate.getTimezoneOffset();
        const adjustedDate = new Date(publishDate.getTime() - (offset * 60 * 1000));
        setPublishedAt(adjustedDate.toISOString().slice(0, 16));
      }
      
      if (data.slug) {
        setSlug(data.slug);
      }
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    if (images.length >= 5) {
      showToast('error', 'Maksimal 5 gambar diperbolehkan');
      return;
    }
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
      
      const updatedImages = [...images, data.url];
      setImages(updatedImages);
      showToast('success', 'Gambar berhasil diunggah');
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteImage = (indexToDelete) => {
    const updatedImages = images.filter((_, idx) => idx !== indexToDelete);
    setImages(updatedImages);
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
      const finalSlug = slug.trim() || slugify(title);
      const finalPublishedAt = publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString();

      const body = {
        title,
        content,
        image_url: thumbnailUrl || '',
        published_at: finalPublishedAt,
        author: 'Administrator',
        slug: finalSlug,
        status: targetStatus,
        images: JSON.stringify(images),
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

  const getWordCount = () => {
    // strip HTML tags to count actual text words
    const textOnly = content ? content.replace(/<[^>]*>/g, ' ') : '';
    return textOnly.trim() ? textOnly.trim().split(/\s+/).length : 0;
  };

  const getCharCount = () => {
    const textOnly = content ? content.replace(/<[^>]*>/g, '') : '';
    return textOnly.length;
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
                <h1>{mode === 'edit' ? 'Edit Berita' : 'Buat Berita'}</h1>
                <div className="breadcrumb">
                  <a href="/admin/berita">Berita</a>
                  <ChevronRight size={12} className="separator" />
                  <span className="active-breadcrumb">{mode === 'edit' ? 'Edit Berita' : 'Buat Berita'}</span>
                </div>
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
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (mode === 'create' || !slug) {
                          setSlug(slugify(e.target.value));
                        }
                      }}
                    />
                  </div>

                  {/* Card 2: Thumbnail Utama (Separated) */}
                  <div className="editor-card image-card" style={{ width: '100%' }}>
                    <div className="image-card-header">
                      <h3>Thumbnail</h3>
                      {thumbnailUrl && (
                        <button 
                          type="button" 
                          className="btn-add-image"
                          style={{ background: '#EF4444' }}
                          onClick={() => setThumbnailUrl('')}
                        >
                          Hapus
                        </button>
                      )}
                    </div>

                    <div style={{ width: '100%' }}>
                      {!thumbnailUrl ? (
                        <div 
                          className="image-preview-placeholder"
                          onClick={() => thumbnailInputRef.current?.click()}
                          style={{ borderStyle: 'dashed', minHeight: '90px', padding: '1rem' }}
                        >
                          <div className="empty-preview" style={{ gap: '0.25rem' }}>
                            <ImageIcon size={24} />
                            <span style={{ fontSize: '0.78rem' }}>Klik untuk unggah thumbnail</span>
                          </div>
                        </div>
                      ) : (
                        <div className="single-thumbnail-preview" style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', aspectRatio: '16/10', border: '1px solid #E2E8F0' }}>
                          <img 
                            src={getImageUrl(thumbnailUrl)} 
                            alt="Thumbnail Utama" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                        </div>
                      )}
                    </div>
                    
                    <input 
                      type="file" 
                      ref={thumbnailInputRef} 
                      accept="image/*"
                      onChange={handleThumbnailUpload} 
                      style={{ display: 'none' }}
                    />
                    <span className="image-hint" style={{ fontWeight: '600', color: '#64748B', marginTop: '0.5rem', fontSize: '0.7rem' }}>
                      (Rasio 16:10)
                    </span>
                  </div>

                  {/* Dual Pane Editor Tabs */}
                  <div className="tabs-container">
                    <button 
                      type="button" 
                      className={`tab-button ${activeTab === 'write' ? 'active' : ''}`}
                      onClick={() => setActiveTab('write')}
                    >
                      <FileText size={16} />
                      <span>Tulis Konten</span>
                    </button>
                    <button 
                      type="button" 
                      className={`tab-button ${activeTab === 'preview' ? 'active' : ''}`}
                      onClick={() => setActiveTab('preview')}
                    >
                      <Eye size={16} />
                      <span>Pratinjau Halaman</span>
                    </button>
                  </div>

                  {/* Body Editor Textarea or Preview */}
                  <div className="editor-card body-editor-card">
                    {activeTab === 'write' ? (
                       <>
                         <CustomRichEditor 
                           value={content}
                           onChange={(data) => setContent(data)}
                         />
                         <div className="editor-footer" style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end', fontSize: '0.78rem', color: '#64748B' }}>
                           <span>{getWordCount()} Kata</span>
                           <span className="footer-dot" style={{ margin: '0 0.4rem' }}>•</span>
                           <span>{getCharCount()} Karakter</span>
                         </div>
                       </>
                     ) : (
                       <div 
                         className="markdown-preview-container"
                         dangerouslySetInnerHTML={{ __html: content }}
                       />
                     )}
                   </div>

                </div>

                 {/* Right Column: Cards */}
                 <div className="editor-right-column" style={{ position: 'sticky', top: '85px', height: 'fit-content' }}>
                   
                   {/* Sticky Action Card */}
                   <div className="editor-card action-card">
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                       <button 
                         type="button"
                         className="btn-publish" 
                         style={{ width: '100%', padding: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                         onClick={() => handleSave('published')}
                         disabled={saving}
                       >
                         {saving ? 'Menyimpan...' : (mode === 'edit' && status === 'published' ? 'Simpan Perubahan' : 'Publish Berita')}
                       </button>
                       <button 
                         type="button"
                         className="btn-draft" 
                         style={{ width: '100%', padding: '0.75rem', marginRight: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                         onClick={() => handleSave('draft')}
                         disabled={saving}
                       >
                         Simpan Draft
                       </button>
                     </div>
                   </div>
                  
                  <div className="editor-card config-card">
                    <h3>Detail Publish</h3>
                    
                    <div className="config-field">
                      <label>Tanggal Publikasi</label>
                      <input 
                        type="datetime-local" 
                        value={publishedAt} 
                        onChange={(e) => setPublishedAt(e.target.value)}
                        className="datetime-input"
                      />
                    </div>

                    <div className="config-field" style={{ marginTop: '0.75rem' }}>
                      <label>Link / Slug Berita</label>
                      <input 
                        type="text" 
                        value={slug} 
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="contoh-judul-berita"
                      />
                    </div>
                  </div>

                  {/* Card 3: Galeri Gambar */}
                  <div className="editor-card image-card">
                    <div className="image-card-header">
                      <h3>Galeri Gambar ({images.length}/5)</h3>
                      {images.length < 5 && (
                        <button 
                          type="button" 
                          className="btn-add-image"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                        >
                          {uploading ? 'Mengunggah...' : 'Unggah'}
                        </button>
                      )}
                    </div>

                    {images.length === 0 ? (
                      <div 
                        className="image-preview-placeholder"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="empty-preview">
                          <ImageIcon size={36} />
                          <span>Belum ada gambar. Klik untuk unggah.</span>
                        </div>
                      </div>
                    ) : (
                      <div className="images-list-grid">
                        {images.map((img, idx) => (
                          <div 
                            key={idx} 
                            className="image-list-item"
                            title="Gambar Galeri"
                            style={{ cursor: 'default' }}
                          >
                            <img src={getImageUrl(img)} alt={`Gambar ${idx + 1}`} />
                            <div className="image-item-meta" style={{ justifyContent: 'flex-end' }}>
                              <button 
                                type="button" 
                                className="btn-delete-item"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteImage(idx);
                                }}
                                title="Hapus Gambar"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      accept="image/*"
                      onChange={handleImageUpload} 
                      style={{ display: 'none' }}
                    />
                    <span className="image-hint">Unggah maksimal 5 gambar</span>
                  </div>

                </div>

              </div>
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
          overflow: visible !important;
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
        .breadcrumb a {
          color: #94A3B8;
          text-decoration: none;
          transition: color 0.2s;
        }
        .breadcrumb a:hover {
          color: #0A1E38;
          text-decoration: underline;
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
          align-items: flex-start;
        }
        .editor-left-column {
          flex: 2.3;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .editor-right-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          position: sticky;
          top: 85px;
          height: fit-content;
          z-index: 10;
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

        /* Tabs Container */
        .tabs-container {
          display: flex;
          border-bottom: 1px solid #E2E8F0;
          background: #FFFFFF;
          border-radius: 8px 8px 0 0;
          padding: 0.5rem 0.5rem 0;
          margin-bottom: -1.25rem;
          z-index: 10;
          border: 1px solid #E2E8F0;
          border-bottom: none;
        }
        .tab-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.25rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: #64748B;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tab-button:hover {
          color: #1E293B;
          background: #F8FAFC;
        }
        .tab-button.active {
          color: #001f3f;
          border-bottom-color: #FFC72C;
          background: #FFFFFF;
        }

        /* Textarea editor */
        .body-editor-card {
          padding: 0;
          overflow: hidden;
          border-radius: 0 0 10px 10px;
        }
        .editor-toolbar {
          background: #F8FAFC;
          border-bottom: 1px solid #E2E8F0;
          padding: 0.5rem 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.15rem;
          flex-wrap: wrap;
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
          margin: 0 0.35rem;
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
        .editor-footer {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding: 0.5rem 1rem;
          background: #F8FAFC;
          border-top: 1px solid #E2E8F0;
          font-size: 0.75rem;
          color: #64748B;
        }
        .footer-dot {
          margin: 0 0.5rem;
          color: #CBD5E1;
        }

        /* Preview Container */
        .markdown-preview-container {
          padding: 2rem;
          min-height: 480px;
          max-height: 600px;
          overflow-y: auto;
          background: #FFFFFF;
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
        .datetime-input {
          padding: 0.75rem 1rem;
          border: 1px solid #CBD5E1;
          border-radius: 6px;
          font-size: 0.9rem;
          color: #334155;
          outline: none;
          background: #F8FAFC;
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

        /* Image Card (Multi Image) */
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
        .btn-add-image {
          background: #3B82F6;
          border: none;
          color: #FFFFFF;
          padding: 0.35rem 0.75rem;
          font-size: 0.78rem;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-add-image:hover {
          background: #2563EB;
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
        .empty-preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: #94A3B8;
          font-size: 0.78rem;
          text-align: center;
        }
        
        /* Multi image list grid */
        .images-list-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }
        .image-list-item {
          position: relative;
          aspect-ratio: 1;
          background: #F1F5F9;
          border: 2px solid transparent;
          border-radius: 6px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s;
        }
        .image-list-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }
        .image-list-item.is-thumbnail {
          border-color: #FFC72C;
          box-shadow: 0 0 0 3px rgba(255, 199, 44, 0.2);
        }
        .image-list-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .image-item-meta {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.65);
          padding: 0.35rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .thumbnail-label {
          color: #FFC72C;
          font-size: 0.65rem;
          font-weight: 700;
        }
        .make-thumbnail-label {
          color: #FFFFFF;
          font-size: 0.65rem;
          font-weight: 500;
          opacity: 0.8;
          transition: opacity 0.2s;
        }
        .image-list-item:hover .make-thumbnail-label {
          opacity: 1;
        }
        .btn-delete-item {
          background: rgba(239, 68, 68, 0.9);
          border: none;
          color: #FFFFFF;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-delete-item:hover {
          background: #DC2626;
        }

        .image-hint {
          font-size: 0.72rem;
          color: #94A3B8;
          margin-top: 0.75rem;
          text-align: center;
          display: block;
          line-height: 1.4;
        }

        .loading-state-block {
          padding: 6rem 2rem;
          text-align: center;
          color: #64748B;
          background: #FFFFFF;
          border-radius: 12px;
          border: 1px solid #E2E8F0;
        }

        .show-animate {
          animation: slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 1024px) {
          .news-editor-grid {
            flex-direction: column;
          }
          .editor-left-column, .editor-right-column {
            flex: 1;
          }
        }
      `}} />
    </div>
  );
}

