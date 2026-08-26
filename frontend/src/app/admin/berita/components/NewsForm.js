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
  ChevronLeft,
  Plus,
  Trash2,
  FileText,
  Eye,
  Table as TableIcon,
  Minus,
  Calendar,
  User,
  X,
  Share2
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
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
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
      setPublishedAt(adjustedDate.toISOString().slice(0, 10));
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
        setPublishedAt(adjustedDate.toISOString().slice(0, 10));
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

      let currentAuthor = 'Administrator';
      try {
        const userDataStr = localStorage.getItem('admin_user');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          currentAuthor = userData.name || userData.username || 'Administrator';
        }
      } catch (err) {
        console.error('Error parsing admin_user', err);
      }

      const body = {
        title,
        content,
        image_url: thumbnailUrl || '',
        published_at: finalPublishedAt,
        author: currentAuthor,
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

  const previewGalleryImages = [...images];
  if (previewGalleryImages.length === 0 && thumbnailUrl) {
    previewGalleryImages.push(thumbnailUrl);
  }

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % previewGalleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + previewGalleryImages.length) % previewGalleryImages.length);
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
                          style={{ borderStyle: 'dashed', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', flexDirection: 'column', cursor: 'pointer' }}
                        >
                          <div className="empty-preview" style={{ gap: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                            <span style={{ fontSize: '0.78rem' }}>Klik untuk unggah thumbnail</span>
                          </div>
                        </div>
                      ) : (
                        <div className="single-thumbnail-preview" style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', height: '200px', border: '1px solid #E2E8F0' }}>
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

                  {/* Body Editor Textarea */}
                  <div className="editor-card body-editor-card">
                    <CustomRichEditor 
                      value={content}
                      onChange={(data) => setContent(data)}
                    />
                    <div className="editor-footer" style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end', fontSize: '0.78rem', color: '#64748B' }}>
                      <span>{getWordCount()} Kata</span>
                      <span className="footer-dot" style={{ margin: '0 0.4rem' }}>•</span>
                      <span>{getCharCount()} Karakter</span>
                    </div>
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
                       <button 
                          type="button"
                          style={{ 
                            width: '100%', 
                            padding: '0.75rem', 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            gap: '0.5rem', 
                            background: '#FFFFFF', 
                            border: '1.5px solid #0B2F61', 
                            color: '#0B2F61', 
                            borderRadius: '8px', 
                            fontWeight: '700', 
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onClick={() => setShowPreviewModal(true)}
                        >
                          {/* <Eye size={16} />  */}
                          Pratinjau
                        </button>
                     </div>
                   </div>
                  
                  <div className="editor-card config-card">
                    <h3>Detail</h3>
                    
                    <div className="config-field">
                      <label>Tanggal Publikasi</label>
                      <input 
                        type="date" 
                        value={publishedAt} 
                        onChange={(e) => setPublishedAt(e.target.value)}
                        className="datetime-input"
                      />
                    </div>

                    <div className="config-field" style={{ marginTop: '0.75rem' }}>
                      <label>URL/Link Berita</label>
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

        {showPreviewModal && (
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem 1rem'
            }}
            onClick={() => setShowPreviewModal(false)}
          >
            <div 
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '1000px',
                height: '90vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div 
                style={{
                  padding: '1rem 1.5rem',
                  borderBottom: '1px solid #E2E8F0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#0A1E38',
                  color: '#FFFFFF',
                  flexShrink: 0
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Eye size={18} />
                  <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>Pratinjau</span>
                </div>
                <button 
                  onClick={() => setShowPreviewModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    opacity: 0.8,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body: matches the frontend layout exactly */}
              <div style={{ flex: 1, overflowY: 'auto', padding: 0, backgroundColor: '#FFFFFF' }}>
                
                {/* ── BREADCRUMBS ── */}
                <div className="preview-breadcrumbs-container">
                  <div className="preview-container">
                    <div className="preview-breadcrumbs">
                      <a href="#" onClick={(e) => e.preventDefault()}>Beranda</a>
                      <span className="separator">&gt;</span>
                      <a href="#" onClick={(e) => e.preventDefault()}>Berita</a>
                      <span className="separator">&gt;</span>
                      <span className="current">{title || 'Judul Berita Baru'}</span>
                    </div>
                  </div>
                </div>

                {/* ── MAIN DETAIL CONTENT ── */}
                <div className="preview-detail-layout">
                  <div className="preview-container">
                    
                    <h1 className="preview-detail-title">{title || 'Judul Berita Baru'}</h1>

                    {/* Metadata Row */}
                    <div className="preview-detail-meta">
                      <span className="meta-item">
                        <Calendar size={14} /> {publishedAt ? new Date(publishedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </span>
                      <span className="meta-item">
                        <User size={14} /> Admin DSDMPT
                      </span>
                    </div>

                    {/* Large Hero Image */}
                    <div className="preview-detail-hero-image-wrapper">
                      {thumbnailUrl ? (
                        <img src={getImageUrl(thumbnailUrl)} alt={title} className="preview-detail-hero-image" />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F1F5F9', color: '#94A3B8' }}>
                          <ImageIcon size={48} />
                          <span style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Belum ada gambar thumbnail</span>
                        </div>
                      )}
                    </div>

                    {/* Content Split Area */}
                    <div className="preview-detail-split-grid" style={previewGalleryImages.length <= 1 ? { gridTemplateColumns: '1fr' } : {}}>
                      
                      {/* Left Side: Clickable Image Gallery */}
                      {previewGalleryImages.length > 1 && (
                        <div className="preview-detail-gallery-sidebar">
                          {previewGalleryImages.slice(0, 3).map((imgSrc, idx) => {
                            const isLast = idx === 2;
                            const hasMore = previewGalleryImages.length > 3;
                            const extraCount = previewGalleryImages.length - 3;
                            
                            return (
                              <div 
                                key={idx} 
                                className={`preview-gallery-thumbnail-card preview-card-slot-${idx}`} 
                                onClick={() => openLightbox(idx)}
                              >
                                <img src={getImageUrl(imgSrc)} alt={`Gallery item ${idx + 1}`} className="preview-gallery-thumb" />
                                
                                {isLast && hasMore ? (
                                  <div className="preview-gallery-thumb-overlay-always">
                                    <span className="preview-extra-count-text">+{extraCount}</span>
                                  </div>
                                ) : (
                                  <div className="preview-gallery-thumb-overlay">
                                    <span className="preview-zoom-text">Lihat Gambar</span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Right Side: Rich Text Content */}
                      <div className="preview-detail-rich-text">
                        <div 
                          style={{ fontSize: '1rem', lineHeight: '1.8', color: '#2C3A47', whiteSpace: 'pre-wrap' }}
                          dangerouslySetInnerHTML={{ __html: content || '<p style="color:#94A3B8; font-style:italic">Tulis konten berita Anda di editor...</p>' }}
                        />
                      </div>

                    </div>

                    {/* Share Section */}
                    <div className="preview-detail-share-section">
                      <span className="share-label">Bagikan:</span>
                      <button type="button" className="share-circle-btn share-wa" onClick={(e) => e.preventDefault()}><svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></button>
                      <button type="button" className="share-circle-btn share-fb" onClick={(e) => e.preventDefault()}><svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/></svg></button>
                      <button type="button" className="share-circle-btn share-x" onClick={(e) => e.preventDefault()}><svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></button>
                      <button type="button" className="share-circle-btn share-in" onClick={(e) => e.preventDefault()}><svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></button>
                      <button type="button" className="share-circle-btn share-copy" onClick={(e) => e.preventDefault()}><Share2 size={16} /></button>
                    </div>

                    <hr className="preview-divider" />

                    {/* ── RELATED NEWS / BERITA LAINNYA ── */}
                    <div className="preview-related-section">
                      <h2 className="preview-related-heading">Berita Lainnya</h2>
                      <div className="preview-related-grid">
                        <div className="preview-related-card">
                          <div className="preview-related-card-img-wrap">
                            <div style={{ width: '100%', height: '100%', backgroundColor: '#E2E8F0' }} />
                          </div>
                          <div className="preview-related-card-body">
                            <h4 className="preview-related-card-title">Membangun Budaya Kerja Berintegritas Tinggi</h4>
                            <span className="preview-related-card-date">24 Agustus 2026</span>
                          </div>
                        </div>
                        <div className="preview-related-card">
                          <div className="preview-related-card-img-wrap">
                            <div style={{ width: '100%', height: '100%', backgroundColor: '#E2E8F0' }} />
                          </div>
                          <div className="preview-related-card-body">
                            <h4 className="preview-related-card-title">Implementasi Merit System dalam Manajemen Organisasi</h4>
                            <span className="preview-related-card-date">18 Agustus 2026</span>
                          </div>
                        </div>
                        <div className="preview-related-card">
                          <div className="preview-related-card-img-wrap">
                            <div style={{ width: '100%', height: '100%', backgroundColor: '#E2E8F0' }} />
                          </div>
                          <div className="preview-related-card-body">
                            <h4 className="preview-related-card-title">Pelatihan Pemimpin Masa Depan di Lingkungan Universitas Indonesia</h4>
                            <span className="preview-related-card-date">05 Agustus 2026</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ── LIGHTBOX/POPUP IMAGE GALLERY FOR PREVIEW ── */}
        {lightboxOpen && (
          <div className="preview-lightbox-overlay" onClick={() => setLightboxOpen(false)}>
            <button type="button" className="preview-lightbox-close" onClick={() => setLightboxOpen(false)}>
              <X size={24} />
            </button>
            
            <button type="button" className="preview-lightbox-nav prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
              <ChevronLeft size={28} />
            </button>

            <div className="preview-lightbox-content" onClick={(e) => e.stopPropagation()}>
              <img src={getImageUrl(previewGalleryImages[currentImageIndex])} alt="Lightbox View" className="preview-lightbox-img" />
              <div className="preview-lightbox-indicator">
                {currentImageIndex + 1} / {previewGalleryImages.length}
              </div>
            </div>

            <button type="button" className="preview-lightbox-nav next" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
              <ChevronRight size={28} />
            </button>
          </div>
        )}
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

        /* NEWS PREVIEW MODAL SPECIFIC STYLES */
        .preview-container {
          width: 100%;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
          padding-left: 1.5rem;
          padding-right: 1.5rem;
          box-sizing: border-box;
        }

        .preview-breadcrumbs-container {
          margin-top: 0;
          background-color: #F8FAFC;
          padding: 0.8rem 0;
          border-bottom: 1px solid #E2E8F0;
        }
        .preview-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: #64748B;
        }
        .preview-breadcrumbs a {
          color: #64748B;
          text-decoration: none;
        }
        .preview-breadcrumbs .separator {
          color: #CBD5E1;
        }
        .preview-breadcrumbs .current {
          color: #0A1E38;
          font-weight: 600;
        }

        .preview-detail-layout {
          padding: 2.5rem 0 5rem;
          background-color: #FFFFFF;
        }
        .preview-detail-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #0A1E38;
          line-height: 1.25;
          margin-bottom: 1rem;
          font-family: inherit;
        }
        .preview-detail-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          font-size: 0.82rem;
          color: #64748B;
          margin-bottom: 2rem;
          border-bottom: 1px solid #F1F5F9;
          padding-bottom: 1rem;
          align-items: center;
        }
        .preview-detail-meta .meta-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .preview-detail-hero-image-wrapper {
          width: 100%;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          margin-bottom: 2.5rem;
          aspect-ratio: 21/9;
        }
        .preview-detail-hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .preview-detail-split-grid {
          display: grid;
          grid-template-columns: 1fr 3fr;
          gap: 3rem;
          align-items: start;
        }

        .preview-detail-gallery-sidebar {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .preview-gallery-thumbnail-card {
          position: relative;
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          border: 1px solid #E2E8F0;
        }
        .preview-card-slot-0, .preview-card-slot-1 {
          aspect-ratio: 4/5;
        }
        .preview-card-slot-2 {
          grid-column: span 2;
          aspect-ratio: 16/10;
        }
        .preview-gallery-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .preview-gallery-thumbnail-card:hover .preview-gallery-thumb {
          transform: scale(1.05);
        }
        .preview-gallery-thumb-overlay {
          position: absolute;
          inset: 0;
          background-color: rgba(10, 30, 56, 0.4);
          opacity: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.25s ease;
        }
        .preview-gallery-thumbnail-card:hover .preview-gallery-thumb-overlay {
          opacity: 1;
        }
        .preview-gallery-thumb-overlay-always {
          position: absolute;
          inset: 0;
          background-color: rgba(6, 19, 36, 0.65);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }
        .preview-extra-count-text {
          color: #FFFFFF;
          font-size: 1.8rem;
          font-weight: 700;
        }
        .preview-zoom-text {
          color: #FFFFFF;
          font-size: 0.78rem;
          font-weight: 600;
          background: rgba(10, 30, 56, 0.8);
          padding: 0.3rem 0.7rem;
          border-radius: 20px;
        }

        .preview-detail-rich-text {
          font-size: 1rem;
          line-height: 1.8;
          color: #334155;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .preview-detail-share-section {
          margin-top: 3rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .preview-detail-share-section .share-label {
          font-weight: 600;
          font-size: 0.9rem;
          color: #0A1E38;
          margin-right: 0.5rem;
        }
        .preview-detail-share-section .share-circle-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #F1F5F9;
          color: #475569;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          border: none;
          cursor: pointer;
        }
        .preview-detail-share-section .share-circle-btn:hover {
          transform: translateY(-2px);
          color: #FFFFFF;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .preview-detail-share-section .share-wa:hover { background: #25D366; }
        .preview-detail-share-section .share-fb:hover { background: #1877F2; }
        .preview-detail-share-section .share-x:hover { background: #000000; }
        .preview-detail-share-section .share-in:hover { background: #0077B5; }
        .preview-detail-share-section .share-copy:hover { background: #0A1E38; }

        .preview-divider {
          border: 0;
          border-top: 1px solid #E2E8F0;
          margin: 3rem 0;
        }

        .preview-related-section {
          margin-top: 0;
        }
        .preview-related-heading {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0A1E38;
          margin-bottom: 2rem;
        }
        .preview-related-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .preview-related-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 1rem;
          transition: all 0.2s;
        }
        .preview-related-card-img-wrap {
          width: 80px;
          height: 60px;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .preview-related-card-body {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .preview-related-card-title {
          font-size: 0.85rem;
          font-weight: 700;
          line-height: 1.35;
          color: #0A1E38;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .preview-related-card-date {
          font-size: 0.72rem;
          color: #64748B;
        }

        /* Lightbox for preview */
        .preview-lightbox-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(6, 19, 36, 0.95);
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.2s ease-out;
        }
        .preview-lightbox-close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          color: #FFFFFF;
          background: none;
          border: none;
          cursor: pointer;
        }
        .preview-lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .preview-lightbox-nav:hover {
          background: rgba(255, 255, 255, 0.25);
        }
        .preview-lightbox-nav.prev { left: 2rem; }
        .preview-lightbox-nav.next { right: 2rem; }
        .preview-lightbox-content {
          max-width: 80%;
          max-height: 80vh;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .preview-lightbox-img {
          max-width: 100%;
          max-height: 75vh;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .preview-lightbox-indicator {
          color: #94A3B8;
          font-size: 0.9rem;
          margin-top: 1rem;
        }
      `}} />
    </div>
  );
}

