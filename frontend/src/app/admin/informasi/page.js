"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Link as LinkIcon, 
  Upload, 
  Eye, 
  ArrowUp, 
  ArrowDown,
  Info
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

const BACKEND_URL = 'http://localhost:8081';

export default function AdminInformasiPage() {
  const [cards, setCards] = useState([]);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Card Modal States
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [cardModalType, setCardModalType] = useState('create'); // 'create' | 'edit'
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardTitle, setCardTitle] = useState('');
  const [cardDesc, setCardDesc] = useState('');
  const [cardImage, setCardImage] = useState('');
  const [cardFile, setCardFile] = useState('');
  const [uploadingCardImg, setUploadingCardImg] = useState(false);
  const [uploadingCardFile, setUploadingCardFile] = useState(false);
  const [cardSubmitting, setCardSubmitting] = useState(false);

  // Doc Modal States
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [docModalType, setDocModalType] = useState('create'); // 'create' | 'edit'
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docTitle, setDocTitle] = useState('');
  const [docFile, setDocFile] = useState('');
  const [docLink, setDocLink] = useState('');
  const [uploadingDocFile, setUploadingDocFile] = useState(false);
  const [docSubmitting, setDocSubmitting] = useState(false);

  // Global settings for Hero section
  const [heroTitle, setHeroTitle] = useState('Informasi');
  const [heroDesc, setHeroDesc] = useState('');
  const [heroImage, setHeroImage] = useState('/uploads/ui_rectorate_hero.png');
  const [savingHero, setSavingHero] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const heroFileRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
    fetchData();
    loadSettings();
  }, []);

  const getToken = () => localStorage.getItem('admin_token');

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleUnauthorized = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/admin/login';
  };

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('/uploads')) return `${BACKEND_URL}${path}`;
    return path;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Informasi Cards
      const resCards = await fetch(`${BACKEND_URL}/api/admin/informasi`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      if (resCards.status === 401) { return handleUnauthorized(); }
      const dataCards = await resCards.json();
      setCards(dataCards || []);

      // Fetch Dokumen Terkini
      const resDocs = await fetch(`${BACKEND_URL}/api/admin/dokumen-terkini`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      if (resDocs.status === 401) { return handleUnauthorized(); }
      const dataDocs = await resDocs.json();
      setDocs(dataDocs || []);

    } catch (err) {
      showToast('error', 'Gagal memuat data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/settings`);
      const data = await res.json();
      setHeroTitle(data.informasi_hero_title || 'Informasi');
      setHeroDesc(data.informasi_hero_desc || '');
      setHeroImage(data.informasi_hero_image || data.hero_image || '/uploads/ui_rectorate_hero.png');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async () => {
    setSavingHero(true);
    try {
      const payload = {
        informasi_hero_title: heroTitle,
        informasi_hero_desc: heroDesc,
        informasi_hero_image: heroImage,
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
      showToast('success', 'Perubahan Hero Section berhasil disimpan!');
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setSavingHero(false);
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

  // Upload Generic Handler
  const handleFileUpload = async (file, typeSetter, progressSetter) => {
    if (!file) return;
    progressSetter(true);
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
      if (!res.ok) throw new Error('Gagal mengunggah berkas');
      const data = await res.json();
      typeSetter(data.url);
      showToast('success', 'Berkas berhasil diunggah!');
    } catch (err) {
      showToast('error', err.message);
    } finally {
      progressSetter(false);
    }
  };

  // Reorder Cards
  const handleReorderCards = async (index, direction) => {
    const newCards = [...cards];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newCards.length) return;

    // Swap
    const temp = newCards[index];
    newCards[index] = newCards[targetIndex];
    newCards[targetIndex] = temp;

    setCards(newCards);

    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/informasi/reorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ ids: newCards.map(c => c.id) }),
      });
      if (res.status === 401) return handleUnauthorized();
      if (!res.ok) throw new Error('Gagal mengatur posisi');
      showToast('success', 'Urutan berhasil disimpan!');
    } catch (err) {
      showToast('error', err.message);
      fetchData(); // rollback
    }
  };

  // Reorder Docs
  const handleReorderDocs = async (index, direction) => {
    const newDocs = [...docs];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newDocs.length) return;

    // Swap
    const temp = newDocs[index];
    newDocs[index] = newDocs[targetIndex];
    newDocs[targetIndex] = temp;

    setDocs(newDocs);

    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/dokumen-terkini/reorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ ids: newDocs.map(d => d.id) }),
      });
      if (res.status === 401) return handleUnauthorized();
      if (!res.ok) throw new Error('Gagal mengatur posisi');
      showToast('success', 'Urutan dokumen berhasil disimpan!');
    } catch (err) {
      showToast('error', err.message);
      fetchData(); // rollback
    }
  };

  // Create or Update Card
  const handleCardSubmit = async (e) => {
    e.preventDefault();
    if (!cardTitle.trim()) {
      showToast('error', 'Judul informasi wajib diisi!');
      return;
    }
    setCardSubmitting(true);
    try {
      const payload = {
        title: cardTitle,
        description: cardDesc,
        image_url: cardImage,
        file_url: cardFile,
        position: selectedCard ? selectedCard.position : 1,
      };

      const url = cardModalType === 'create' 
        ? `${BACKEND_URL}/api/admin/informasi`
        : `${BACKEND_URL}/api/admin/informasi/${selectedCard.id}`;
      const method = cardModalType === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) return handleUnauthorized();
      if (!res.ok) throw new Error('Gagal menyimpan informasi');

      showToast('success', cardModalType === 'create' ? 'informasi berhasil dibuat!' : 'informasi berhasil diperbarui!');
      setCardModalOpen(false);
      fetchData();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setCardSubmitting(false);
    }
  };

  // Delete Card
  const handleDeleteCard = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus informasi ini?')) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/informasi/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      if (res.status === 401) return handleUnauthorized();
      if (!res.ok) throw new Error('Gagal menghapus');
      showToast('success', 'informasi berhasil dihapus!');
      fetchData();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  // Open Card Modal
  const openCardModal = (type, card = null) => {
    setCardModalType(type);
    setSelectedCard(card);
    if (type === 'edit' && card) {
      setCardTitle(card.title);
      setCardDesc(card.description);
      setCardImage(card.image_url);
      setCardFile(card.file_url);
    } else {
      setCardTitle('');
      setCardDesc('');
      setCardImage('');
      setCardFile('');
    }
    setCardModalOpen(true);
  };

  // Create or Update Doc
  const handleDocSubmit = async (e) => {
    e.preventDefault();
    if (!docTitle.trim()) {
      showToast('error', 'Judul dokumen wajib diisi!');
      return;
    }
    if (!docFile && !docLink) {
      showToast('error', 'Silakan unggah dokumen atau masukkan tautan external!');
      return;
    }
    setDocSubmitting(true);
    try {
      const payload = {
        title: docTitle,
        file_url: docFile,
        link: docLink,
        position: selectedDoc ? selectedDoc.position : 1,
      };

      const url = docModalType === 'create' 
        ? `${BACKEND_URL}/api/admin/dokumen-terkini`
        : `${BACKEND_URL}/api/admin/dokumen-terkini/${selectedDoc.id}`;
      const method = docModalType === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) return handleUnauthorized();
      if (!res.ok) throw new Error('Gagal menyimpan dokumen');

      showToast('success', docModalType === 'create' ? 'Dokumen berhasil ditambahkan!' : 'Dokumen berhasil diperbarui!');
      setDocModalOpen(false);
      fetchData();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setDocSubmitting(false);
    }
  };

  // Delete Doc
  const handleDeleteDoc = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus dokumen terkini ini?')) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/dokumen-terkini/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      if (res.status === 401) return handleUnauthorized();
      if (!res.ok) throw new Error('Gagal menghapus');
      showToast('success', 'Dokumen berhasil dihapus!');
      fetchData();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  // Open Doc Modal
  const openDocModal = (type, doc = null) => {
    setDocModalType(type);
    setSelectedDoc(doc);
    if (type === 'edit' && doc) {
      setDocTitle(doc.title);
      setDocFile(doc.file_url);
      setDocLink(doc.link);
    } else {
      setDocTitle('');
      setDocFile('');
      setDocLink('');
    }
    setDocModalOpen(true);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar activePage="informasi" />

      <main className="admin-content-wrapper">
        <div className="admin-container">
        

          {toast && (
            <div className={`admin-toast ${toast.type}`}>
              {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span>{toast.message}</span>
            </div>
          )}

          {/* HERO SECTION CARD */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2>Hero Section</h2>
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
                  <label>Deskripsi Judul (Opsional)</label>
                  <textarea 
                    rows={3} 
                    value={heroDesc}
                    onChange={(e) => setHeroDesc(e.target.value)}
                    placeholder="Masukkan deskripsi banner hero..."
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
                type="button"
                className="btn-save" 
                onClick={handleSaveSettings}
                disabled={savingHero}
              >
                {savingHero ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="admin-loading-spinner-container">
              <div className="admin-spinner" />
              <p>Memuat data Informasi...</p>
            </div>
          ) : (
            <div className="admin-grid-columns">
              
              {/* Left Column: Informasi */}
              <div className="admin-panel-card">
                <div className="panel-header">
                  <div className="panel-title-area">
                    <div>
                      <h3>Informasi</h3>
                      <p>Informasi dengan deskripsi, gambar, dan/atau lampiran PDF</p>
                    </div>
                  </div>
                  <button onClick={() => openCardModal('create')} className="btn-add-item">
                    <Plus size={16} /> Tambah Informasi
                  </button>
                </div>

                <div className="items-list">
                  {cards.length === 0 ? (
                    <div className="empty-state">Belum ada informasi.</div>
                  ) : (
                    cards.map((card, index) => (
                      <div key={card.id} className="item-row">
                        <div className="item-info">
                          <h4 className="item-row-title">{card.title}</h4>
                          <p className="item-row-desc">
                            {card.description ? (card.description.length > 90 ? `${card.description.slice(0, 90)}...` : card.description) : 'Tanpa deskripsi'}
                          </p>
                          <div className="item-tags">
                            {card.image_url && <span className="tag image-tag">Gambar</span>}
                            {card.file_url && <span className="tag file-tag">PDF</span>}
                          </div>
                        </div>

                        <div className="item-actions">
                          <div className="reorder-btns">
                            <button 
                              onClick={() => handleReorderCards(index, 'up')}
                              disabled={index === 0}
                              className="btn-action-small"
                              title="Pindahkan Ke Atas"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button 
                              onClick={() => handleReorderCards(index, 'down')}
                              disabled={index === cards.length - 1}
                              className="btn-action-small"
                              title="Pindahkan Ke Bawah"
                            >
                              <ArrowDown size={14} />
                            </button>
                          </div>

                          <button 
                            onClick={() => openCardModal('edit', card)}
                            className="btn-action-edit"
                            title="Edit"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button 
                            onClick={() => handleDeleteCard(card.id)}
                            className="btn-action-delete"
                            title="Hapus"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Column: Dokumen Terkini */}
              <div className="admin-panel-card">
                <div className="panel-header">
                  <div className="panel-title-area">
                    <div>
                      <h3>Dokumen Terkini</h3>
                      <p>Tautan unduh dokumen kepegawaian internal</p>
                    </div>
                  </div>
                  <button onClick={() => openDocModal('create')} className="btn-add-item">
                    <Plus size={16} /> Tambah Dokumen
                  </button>
                </div>

                <div className="items-list">
                  {docs.length === 0 ? (
                    <div className="empty-state">Belum ada dokumen terkini.</div>
                  ) : (
                    docs.map((doc, index) => (
                      <div key={doc.id} className="item-row">
                        <div className="item-info">
                          <h4 className="item-row-title">{doc.title}</h4>
                          <p className="item-row-desc">
                            {doc.link ? (
                              <span className="link-text"><LinkIcon size={12} /> {doc.link}</span>
                            ) : (
                              <span className="link-text"><FileText size={12} /> {doc.file_url}</span>
                            )}
                          </p>
                        </div>

                        <div className="item-actions">
                          <div className="reorder-btns">
                            <button 
                              onClick={() => handleReorderDocs(index, 'up')}
                              disabled={index === 0}
                              className="btn-action-small"
                              title="Pindahkan Ke Atas"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button 
                              onClick={() => handleReorderDocs(index, 'down')}
                              disabled={index === docs.length - 1}
                              className="btn-action-small"
                              title="Pindahkan Ke Bawah"
                            >
                              <ArrowDown size={14} />
                            </button>
                          </div>

                          <button 
                            onClick={() => openDocModal('edit', doc)}
                            className="btn-action-edit"
                            title="Edit"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button 
                            onClick={() => handleDeleteDoc(doc.id)}
                            className="btn-action-delete"
                            title="Hapus"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* ── CARD FORM MODAL ── */}
      {cardModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box">
            <div className="modal-header">
              <h3>{cardModalType === 'create' ? 'Tambah Informasi Baru' : 'Edit Informasi'}</h3>
              <button onClick={() => setCardModalOpen(false)} className="btn-close-modal">&times;</button>
            </div>
            <form onSubmit={handleCardSubmit} className="modal-form">
              <div className="form-group">
                <label>Judul Informasi <span className="required">*</span></label>
                <input 
                  type="text" 
                  value={cardTitle} 
                  onChange={(e) => setCardTitle(e.target.value)} 
                  placeholder="Judul"
                  required
                />
              </div>

              <div className="form-group">
                <label>Deskripsi (Opsional)</label>
                <textarea 
                  value={cardDesc} 
                  onChange={(e) => setCardDesc(e.target.value)} 
                  placeholder="Deskripsi"
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>Gambar (Opsional)</label>
                <div className="upload-input-group">
                  <label className="btn-upload-file" style={{ width: '100%', justifyContent: 'center' }}>
                    {uploadingCardImg ? 'Mengunggah...' : <><Upload size={14} /> Pilih Gambar</>}
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={(e) => handleFileUpload(e.target.files[0], setCardImage, setUploadingCardImg)}
                      disabled={uploadingCardImg}
                    />
                  </label>
                </div>
                {cardImage && (
                  <div className="upload-preview-box">
                    <img src={getImageUrl(cardImage)} alt="Preview" />
                    <button type="button" onClick={() => setCardImage('')} className="btn-remove-uploaded">Hapus Gambar</button>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Lampiran Berkas PDF (Opsional)</label>
                <div className="upload-input-group">
                  <label className="btn-upload-file" style={{ width: '100%', justifyContent: 'center' }}>
                    {uploadingCardFile ? 'Mengunggah...' : <><Upload size={14} /> Pilih PDF</>}
                    <input 
                      type="file" 
                      accept="application/pdf" 
                      style={{ display: 'none' }} 
                      onChange={(e) => handleFileUpload(e.target.files[0], setCardFile, setUploadingCardFile)}
                      disabled={uploadingCardFile}
                    />
                  </label>
                </div>
                {cardFile && (
                  <div className="pdf-preview-info">
                    <FileText size={16} /> <span>{cardFile}</span>
                    <button type="button" onClick={() => setCardFile('')} className="btn-remove-uploaded-link">Hapus</button>
                  </div>
                )}
              </div>

              <div className="modal-actions-footer">
                <button type="button" onClick={() => setCardModalOpen(false)} className="btn-cancel">Batal</button>
                <button type="submit" disabled={cardSubmitting} className="btn-submit">
                  {cardSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DOC FORM MODAL ── */}
      {docModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box">
            <div className="modal-header">
              <h3>{docModalType === 'create' ? 'Tambah Dokumen Terkini Baru' : 'Edit Dokumen Terkini'}</h3>
              <button onClick={() => setDocModalOpen(false)} className="btn-close-modal">&times;</button>
            </div>
            <form onSubmit={handleDocSubmit} className="modal-form">
              <div className="form-group">
                <label>Judul Dokumen <span className="required">*</span></label>
                <input 
                  type="text" 
                  value={docTitle} 
                  onChange={(e) => setDocTitle(e.target.value)} 
                  placeholder="Judul"
                  required
                />
              </div>

              <div className="form-group">
                <label>Opsi 1: Dokumen (PDF, Docx, xlsx, dll)</label>
                <div className="upload-input-group">
                  <label className="btn-upload-file" style={{ width: '100%', justifyContent: 'center' }}>
                    {uploadingDocFile ? 'Mengunggah...' : <><Upload size={14} /> Unggah File</>}
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx,.xls,.xlsx" 
                      style={{ display: 'none' }} 
                      onChange={(e) => {
                        handleFileUpload(e.target.files[0], setDocFile, setUploadingDocFile);
                        setDocLink(''); // mutually exclusive
                      }}
                      disabled={uploadingDocFile}
                    />
                  </label>
                </div>
                {docFile && (
                  <div className="pdf-preview-info" style={{ marginTop: '0.5rem' }}>
                    <FileText size={16} /> <span>{docFile}</span>
                    <button type="button" onClick={() => setDocFile('')} className="btn-remove-uploaded-link">Hapus</button>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Opsi 2: Tautan (Link URL)</label>
                <input 
                  type="text" 
                  value={docLink} 
                  onChange={(e) => {
                    setDocLink(e.target.value);
                    if (e.target.value) setDocFile(''); // mutually exclusive
                  }}
                  placeholder="URL" 
                />
              </div>

              <div className="modal-actions-footer">
                <button type="button" onClick={() => setDocModalOpen(false)} className="btn-cancel">Batal</button>
                <button type="submit" disabled={docSubmitting} className="btn-submit">
                  {docSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
        }
        .admin-content-wrapper {
          flex: 1;
          padding: 2.5rem;
          background: #F8FAFC;
        }
        .admin-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2.5rem;
        }

        /* Hero Section Card and components */
        .admin-card {
          background: #FFFFFF;
          border-radius: 16px;
          border: 1px solid #E2E8F0;
          margin-bottom: 2rem;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.02);
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
          width: 100%;
          padding: 0.65rem 0.75rem;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          font-size: 0.88rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .admin-field input[type="text"]:focus,
        .admin-field textarea:focus {
          border-color: #0B2F61;
        }
        .image-uploader-wrapper {
          position: relative;
          width: 100%;
          height: 180px;
          border-radius: 8px;
          overflow: hidden;
          background: #F1F5F9;
          border: 1px dashed #CBD5E1;
        }
        .image-uploader-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .upload-overlay-btn {
          position: absolute;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          color: #FFFFFF;
          border: none;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .image-uploader-wrapper:hover .upload-overlay-btn {
          opacity: 1;
        }
        .image-hint-text {
          font-size: 0.75rem;
          color: #64748B;
          margin-top: 0.5rem;
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
        .btn-save:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .admin-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .admin-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 0.25rem 0;
        }
        .admin-subtitle {
          font-size: 0.9rem;
          color: #64748B;
          margin: 0;
        }
        .btn-view-live {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #FFFFFF;
          color: #0F172A;
          border: 1px solid #E2E8F0;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .btn-view-live:hover {
          background-color: #F8FAFC;
          border-color: #CBD5E1;
        }
        .admin-loading-spinner-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 6rem 0;
          color: #64748B;
        }
        .admin-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #E2E8F0;
          border-top-color: #0F172A;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 1rem;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .admin-grid-columns {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 2rem;
        }
        .admin-panel-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.02);
        }
        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid #F1F5F9;
          padding-bottom: 1.25rem;
          margin-bottom: 1.5rem;
        }
        .panel-title-area {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }
        .panel-icon {
          color: #0B2F61;
        }
        .panel-title-area h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: #0F172A;
          margin: 0;
        }
        .panel-title-area p {
          font-size: 0.75rem;
          color: #64748B;
          margin: 2px 0 0 0;
        }
        .btn-add-item {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #0B2F61;
          color: #FFFFFF;
          border: none;
          padding: 0.5rem 0.9rem;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-add-item:hover {
          background: #061B3A;
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .empty-state {
          text-align: center;
          padding: 3rem 0;
          color: #94A3B8;
          font-size: 0.88rem;
        }
        .item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.25rem;
          transition: border-color 0.2s;
        }
        .item-row:hover {
          border-color: #CBD5E1;
        }
        .item-info {
          flex: 1;
          margin-right: 1.5rem;
        }
        .item-row-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #0F172A;
          margin: 0 0 0.25rem 0;
        }
        .item-row-desc {
          font-size: 0.8rem;
          color: #64748B;
          margin: 0 0 0.5rem 0;
          line-height: 1.4;
        }
        .item-tags {
          display: flex;
          gap: 0.5rem;
        }
        .tag {
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }
        .image-tag {
          background: #FEF3C7;
          color: #D97706;
        }
        .file-tag {
          background: #DBEAFE;
          color: #2563EB;
        }
        .link-text {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          color: #2563EB;
          word-break: break-all;
        }

        .item-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .reorder-btns {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .btn-action-small {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          color: #64748B;
          border-radius: 4px;
          padding: 0.2rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-action-small:hover:not(:disabled) {
          background: #F1F5F9;
          color: #0F172A;
        }
        .btn-action-small:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .btn-action-edit {
          background: #FEF3C7;
          border: none;
          color: #D97706;
          border-radius: 6px;
          padding: 0.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .btn-action-edit:hover {
          background: #FDE68A;
        }
        .btn-action-delete {
          background: #FEE2E2;
          border: none;
          color: #DC2626;
          border-radius: 6px;
          padding: 0.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .btn-action-delete:hover {
          background: #FCA5A5;
        }

        /* TOAST */
        .admin-toast {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          font-weight: 600;
          font-size: 0.88rem;
          animation: slideIn 0.3s ease-out;
        }
        .admin-toast.success {
          background: #ECFDF5;
          color: #059669;
          border: 1px solid #A7F3D0;
        }
        .admin-toast.error {
          background: #FEF2F2;
          color: #DC2626;
          border: 1px solid #FCA5A5;
        }
        @keyframes slideIn {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* MODAL */
        .admin-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease-out;
        }
        .admin-modal-box {
          background: #FFFFFF;
          border-radius: 16px;
          width: 100%;
          max-width: 550px;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
          overflow: hidden;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #E2E8F0;
        }
        .modal-header h3 {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
        }
        .btn-close-modal {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #94A3B8;
          cursor: pointer;
        }
        .modal-form {
          padding: 1.5rem;
        }
        .form-group {
          margin-bottom: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .form-group label {
          font-size: 0.82rem;
          font-weight: 700;
          color: #475569;
        }
        .form-group input[type="text"],
        .form-group textarea {
          width: 100%;
          padding: 0.65rem 0.75rem;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          font-size: 0.88rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-group input[type="text"]:focus,
        .form-group textarea:focus {
          border-color: #0B2F61;
        }
        .required {
          color: #EF4444;
        }

        .upload-input-group {
          display: flex;
          gap: 0.5rem;
        }
        .btn-upload-file {
          background: #F1F5F9;
          border: 1px solid #CBD5E1;
          color: #475569;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.65rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          white-space: nowrap;
          transition: background 0.2s;
        }
        .btn-upload-file:hover {
          background: #E2E8F0;
        }
        .upload-preview-box {
          margin-top: 0.75rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          padding: 0.75rem;
          border-radius: 8px;
        }
        .upload-preview-box img {
          max-height: 70px;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .btn-remove-uploaded {
          background: #FEE2E2;
          color: #DC2626;
          border: none;
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-remove-uploaded:hover {
          background: #FCA5A5;
        }
        .pdf-preview-info {
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #F0FDF4;
          border: 1px solid #BBF7D0;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          font-size: 0.78rem;
          color: #166534;
        }
        .btn-remove-uploaded-link {
          background: none;
          border: none;
          color: #DC2626;
          font-weight: 600;
          cursor: pointer;
          margin-left: auto;
        }

        .modal-actions-footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          border-top: 1px solid #E2E8F0;
          padding-top: 1.25rem;
          margin-top: 1.5rem;
        }
        .btn-cancel {
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          color: #475569;
          font-size: 0.88rem;
          font-weight: 600;
          padding: 0.55rem 1.25rem;
          border-radius: 8px;
          cursor: pointer;
        }
        .btn-cancel:hover {
          background: #F8FAFC;
        }
        .btn-submit {
          background: #0B2F61;
          border: none;
          color: #FFFFFF;
          font-size: 0.88rem;
          font-weight: 600;
          padding: 0.55rem 1.25rem;
          border-radius: 8px;
          cursor: pointer;
        }
        .btn-submit:hover {
          background: #061B3A;
        }
        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 991px) {
          .admin-grid-columns {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
