"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Star, 
  Upload,
  FileText,
  ArrowUp,
  ArrowDown,
  X,
  PlusCircle,
  Link,
  Phone,
  FileDown,
  Image as ImageIcon
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

const BACKEND_URL = 'http://localhost:8081';

export default function AdminPengembanganTalentaPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create' | 'edit'
  const [selectedProgram, setSelectedProgram] = useState(null);

  // Hero section states
  const [heroTitle, setHeroTitle] = useState('');
  const [heroDesc, setHeroDesc] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [uploadingHero, setUploadingHero] = useState(false);
  const [savingHero, setSavingHero] = useState(false);
  const heroFileRef = useRef(null);

  // Form states for CRUD
  const [title, setTitle] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('17:00');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');
  const [type, setType] = useState('public'); // 'public' | 'internal'
  const [description, setDescription] = useState('');
  const [syllabusUrl, setSyllabusUrl] = useState('');
  const [registrationLink, setRegistrationLink] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [agenda, setAgenda] = useState([]); // Array of {startTime: '', endTime: '', activity: ''}

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingSyllabus, setUploadingSyllabus] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const imageInputRef = useRef(null);
  const syllabusInputRef = useRef(null);

  // Search & Pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState('5'); // '5' | '10' | '20' | 'all'

  // Filter programs based on search query
  const filteredPrograms = programs.filter(item => {
    const q = searchQuery.toLowerCase();
    return (
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.organizer && item.organizer.toLowerCase().includes(q)) ||
      (item.location && item.location.toLowerCase().includes(q))
    );
  });

  // Reset page when searchQuery or itemsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, itemsPerPage]);

  // Paginated items
  const getPaginatedPrograms = () => {
    if (itemsPerPage === 'all') return filteredPrograms;
    const limit = parseInt(itemsPerPage, 10) || 5;
    const startIndex = (currentPage - 1) * limit;
    return filteredPrograms.slice(startIndex, startIndex + limit);
  };

  const totalPages = itemsPerPage === 'all' ? 1 : Math.ceil(filteredPrograms.length / (parseInt(itemsPerPage, 10) || 5));

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
    fetchPrograms();
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
    try {
      const res = await fetch(`${BACKEND_URL}/api/settings`);
      const data = await res.json();
      setHeroTitle(data.pengembangan_talenta_hero_title || 'Pengembangan Talenta');
      setHeroDesc(data.pengembangan_talenta_hero_desc || '');
      setHeroImage(data.pengembangan_talenta_hero_image || data.hero_image || '/uploads/ui_rectorate_hero.png');
    } catch (err) {
      showToast('error', 'Gagal memuat data settings');
    }
  };

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/pengembangan-talenta`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) throw new Error('Gagal mengambil data program');

      const data = await res.json();
      setPrograms(data || []);
    } catch (err) {
      showToast('error', err.message);
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
          pengembangan_talenta_hero_title: heroTitle,
          pengembangan_talenta_hero_desc: heroDesc,
          pengembangan_talenta_hero_image: heroImage,
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
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
      setImage(data.url);
      showToast('success', 'Gambar program berhasil diupload!');
    } catch (err) {
      showToast('error', err.message || 'Gagal mengupload gambar');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSyllabusUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingSyllabus(true);
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

      if (!res.ok) throw new Error('Gagal mengupload file silabus');
      const data = await res.json();
      setSyllabusUrl(data.url);
      showToast('success', 'File silabus berhasil diupload!');
    } catch (err) {
      showToast('error', err.message || 'Gagal mengupload silabus');
    } finally {
      setUploadingSyllabus(false);
    }
  };

  const handleUnauthorized = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/admin/login';
  };

  // Parses textual date formatted in Indonesian to an ISO date for the HTML picker
  const parseToISODate = (dateStr) => {
    if (!dateStr) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    const months = {
      'januari': '01', 'februari': '02', 'maret': '03', 'april': '04', 'mei': '05', 'juni': '06',
      'juli': '07', 'agustus': '08', 'september': '09', 'oktober': '10', 'november': '11', 'desember': '12'
    };
    const parts = dateStr.toLowerCase().split(' ');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = months[parts[1]] || '01';
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
    return '';
  };

  const openCreateModal = () => {
    setModalType('create');
    setSelectedProgram(null);
    setTitle('');
    setOrganizer('');
    setDate('');
    setStartTime('08:00');
    setEndTime('17:00');
    setLocation('');
    setImage('');
    setType('public');
    setDescription('');
    setSyllabusUrl('');
    setRegistrationLink('');
    setContactPhone('');
    setAgenda([]);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setModalType('edit');
    setSelectedProgram(item);
    setTitle(item.title || '');
    setOrganizer(item.organizer || '');
    setDate(parseToISODate(item.date));
    setLocation(item.location || '');
    setImage(item.image || '');
    setType(item.type || 'public');
    setDescription(item.description || '');
    setSyllabusUrl(item.syllabus_url || '');
    setRegistrationLink(item.registration_link || '');
    setContactPhone(item.contact_phone || '');

    // Parse time
    let start = '08:00';
    let end = '17:00';
    if (item.time) {
      const cleanTime = item.time.replace(' WIB', '');
      const parts = cleanTime.split(' - ');
      if (parts.length === 2) {
        start = parts[0].trim();
        end = parts[1].trim();
      }
    }
    setStartTime(start);
    setEndTime(end);
    
    // Parse agenda
    let parsedAgenda = [];
    if (item.agenda) {
      try {
        const raw = JSON.parse(item.agenda);
        parsedAgenda = raw.map(session => {
          let sStart = '08:00';
          let sEnd = '10:00';
          if (session.time) {
            const parts = session.time.split(' - ');
            if (parts.length === 2) {
              sStart = parts[0].trim();
              sEnd = parts[1].trim();
            } else {
              sStart = session.time;
            }
          }
          return {
            startTime: sStart,
            endTime: sEnd,
            activity: session.activity || ''
          };
        });
      } catch (e) {}
    }
    setAgenda(parsedAgenda);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formattedTime = `${startTime} - ${endTime} WIB`;
    const formattedAgenda = agenda.map(a => ({
      time: `${a.startTime} - ${a.endTime}`,
      activity: a.activity
    }));

    try {
      let url = `${BACKEND_URL}/api/admin/pengembangan-talenta`;
      let method = 'POST';
      let body = { 
        title, 
        organizer, 
        date, 
        time: formattedTime, 
        location, 
        image, 
        type, 
        description,
        syllabus_url: syllabusUrl,
        registration_link: registrationLink,
        contact_phone: contactPhone,
        agenda: JSON.stringify(formattedAgenda) 
      };

      if (modalType === 'edit' && selectedProgram) {
        url = `${BACKEND_URL}/api/admin/pengembangan-talenta/${selectedProgram.id}`;
        method = 'PUT';
        body.position = selectedProgram.position;
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(body),
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg || 'Gagal menyimpan data program');
      }

      showToast('success', modalType === 'create' ? 'Program berhasil ditambahkan!' : 'Program berhasil diperbarui!');
      setModalOpen(false);
      fetchPrograms();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus program ini?')) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/pengembangan-talenta/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg || 'Gagal menghapus program');
      }

      showToast('success', 'Program berhasil dihapus!');
      fetchPrograms();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  const handleMove = async (index, direction) => {
    const newPrograms = [...programs];
    const swapTargetIndex = direction === 'up' ? index - 1 : index + 1;

    if (swapTargetIndex < 0 || swapTargetIndex >= newPrograms.length) return;

    const temp = newPrograms[index];
    newPrograms[index] = newPrograms[swapTargetIndex];
    newPrograms[swapTargetIndex] = temp;

    setPrograms(newPrograms);

    try {
      const ids = newPrograms.map(p => p.id);
      const res = await fetch(`${BACKEND_URL}/api/admin/pengembangan-talenta/reorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ ids }),
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) throw new Error('Gagal memperbarui urutan posisi');
      showToast('success', 'Urutan program berhasil disimpan!');
    } catch (err) {
      showToast('error', err.message);
      fetchPrograms();
    }
  };

  // Agenda list operations
  const addAgendaRow = () => {
    setAgenda([...agenda, { startTime: '08:00', endTime: '10:00', activity: '' }]);
  };

  const removeAgendaRow = (idx) => {
    setAgenda(agenda.filter((_, i) => i !== idx));
  };

  const updateAgendaRow = (idx, field, val) => {
    const updated = [...agenda];
    updated[idx][field] = val;
    setAgenda(updated);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar Component */}
      <AdminSidebar activePage="pengembangan-talenta" />

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

            {/* PROGRAMS LIST CARD */}
            <div className="admin-card">
              <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h2>Daftar Program</h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  {/* Search Input in Head Table */}
                  <input 
                    type="text" 
                    placeholder="Cari program..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      padding: '0.45rem 0.75rem',
                      border: '1px solid #CBD5E1',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      width: '220px',
                      outline: 'none'
                    }}
                  />
                  <span className="user-count-badge">{filteredPrograms.length} / {programs.length} Program</span>
                  <button className="admin-add-btn" onClick={openCreateModal} style={{ margin: 0 }}>
                    <Plus size={16} />
                    <span>Tambah Program</span>
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="table-loading">
                  <div className="admin-spinner" />
                  <p>Memuat data program...</p>
                </div>
              ) : filteredPrograms.length === 0 ? (
                <div className="table-empty">
                  <Star size={40} />
                  <p>{searchQuery ? 'Program tidak ditemukan' : 'Belum ada data program pengembangan talenta'}</p>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th style={{ width: '80px', textAlign: 'center' }}>No.</th>
                          <th style={{ width: '100px' }}>Gambar</th>
                          <th>Judul Program</th>
                          <th>Penyelenggara</th>
                          <th>Jadwal & Tempat</th>
                          <th style={{ width: '100px' }}>Tipe</th>
                          <th style={{ textAlign: 'right', width: '120px' }}>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getPaginatedPrograms().map((item, idx) => (
                          <tr key={item.id}>
                            <td style={{ textAlign: 'center', fontWeight: '600', color: '#475569' }}>
                              {itemsPerPage === 'all' 
                                ? idx + 1 
                                : (currentPage - 1) * (parseInt(itemsPerPage, 10) || 5) + idx + 1
                              }
                            </td>
                            <td>
                              <img 
                                src={getImageUrl(item.image) || '/uploads/talent_1.jpg'} 
                                alt={item.title} 
                                style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                              />
                            </td>
                            <td>
                              <strong style={{ color: '#0F172A' }}>{item.title}</strong>
                            </td>
                            <td style={{ fontSize: '0.85rem' }}>{item.organizer}</td>
                            <td style={{ fontSize: '0.82rem', color: '#64748B' }}>
                              <div>{item.date}</div>
                              <div>{item.time}</div>
                              <div style={{ fontStyle: 'italic' }}>{item.location}</div>
                            </td>
                            <td>
                              <span style={{ 
                                padding: '0.2rem 0.5rem', 
                                borderRadius: '4px', 
                                fontSize: '0.72rem', 
                                fontWeight: '700', 
                                textTransform: 'uppercase',
                                background: item.type === 'internal' ? '#FEF3C7' : '#DBEAFE',
                                color: item.type === 'internal' ? '#D97706' : '#2563EB'
                              }}>
                                {item.type === 'public' ? 'Publik' : 'Internal'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div className="table-actions">
                                <button 
                                  className="action-btn edit" 
                                  title="Edit Program"
                                  onClick={() => openEditModal(item)}
                                >
                                  <Edit2 size={15} />
                                </button>
                                <button 
                                  className="action-btn delete" 
                                  title="Hapus Program"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination & Limit Selection Panel */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem 1.5rem',
                    background: '#F8FAFC',
                    borderTop: '1px solid #E2E8F0',
                    borderRadius: '0 0 10px 10px',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: '500' }}>Tampilkan:</span>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(e.target.value)}
                        style={{
                          padding: '0.35rem 0.5rem',
                          border: '1px solid #CBD5E1',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          background: '#FFFFFF',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="all">Semua</option>
                      </select>
                    </div>

                    {itemsPerPage !== 'all' && totalPages > 1 && (
                      <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          style={{
                            padding: '0.35rem 0.75rem',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            background: '#FFFFFF',
                            fontSize: '0.85rem',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            opacity: currentPage === 1 ? 0.5 : 1
                          }}
                        >
                          Sebelumnya
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            type="button"
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            style={{
                              padding: '0.35rem 0.65rem',
                              border: i + 1 === currentPage ? '1px solid #FFC72C' : '1px solid #CBD5E1',
                              borderRadius: '6px',
                              background: i + 1 === currentPage ? '#FFC72C' : '#FFFFFF',
                              color: i + 1 === currentPage ? '#001f3f' : '#334155',
                              fontWeight: i + 1 === currentPage ? '700' : '500',
                              fontSize: '0.85rem',
                              cursor: 'pointer'
                            }}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          style={{
                            padding: '0.35rem 0.75rem',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            background: '#FFFFFF',
                            fontSize: '0.85rem',
                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                            opacity: currentPage === totalPages ? 0.5 : 1
                          }}
                        >
                          Selanjutnya
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* CRUD MODAL */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '720px', width: '100%' }}>
            <div className="modal-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem' }}>
              <div>
                <h3>{modalType === 'create' ? 'Tambah Program Baru' : 'Edit Program'}</h3>
              </div>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form" style={{ padding: '1.5rem', maxHeight: '75vh', overflowY: 'auto' }}>
              <div className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* Judul & Tipe */}
                <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '1rem' }}>
                  <div className="admin-field">
                    <label>Judul Program</label>
                    <input 
                      type="text" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      required 
                      placeholder="Masukkan nama program..."
                    />
                  </div>
                  <div className="admin-field">
                    <label>Tipe Program</label>
                    <select 
                      value={type} 
                      onChange={(e) => setType(e.target.value)}
                      style={{ padding: '0.65rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.88rem', background: '#FFFFFF' }}
                    >
                      <option value="public">Publik</option>
                      <option value="internal">Internal</option>
                    </select>
                  </div>
                </div>

                {/* Deskripsi Program */}
                <div className="admin-field">
                  <label>Deskripsi Program</label>
                  <textarea 
                    rows={4} 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Deskripsi"
                  />
                </div>

                {/* Penyelenggara & Lokasi */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="admin-field">
                    <label>Penyelenggara</label>
                    <input 
                      type="text" 
                      value={organizer} 
                      onChange={(e) => setOrganizer(e.target.value)} 
                      required 
                      placeholder="Contoh: DSDMPT Universitas Indonesia"
                    />
                  </div>
                  <div className="admin-field">
                    <label>Tempat / Lokasi</label>
                    <input 
                      type="text" 
                      value={location} 
                      onChange={(e) => setLocation(e.target.value)} 
                      required 
                      placeholder="Contoh: Gedung Rektorat Lt. 5"
                    />
                  </div>
                </div>

                {/* Jadwal Detail (Tanggal & Jam Pelaksanaan) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '1rem', alignItems: 'end' }}>
                  <div className="admin-field">
                    <label>Tanggal Pelaksanaan</label>
                    <input 
                      type="date" 
                      value={date} 
                      onChange={(e) => setDate(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="admin-field">
                    <label>Jam Mulai</label>
                    <input 
                      type="time" 
                      value={startTime} 
                      onChange={(e) => setStartTime(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="admin-field">
                    <label>Jam Selesai</label>
                    <input 
                      type="time" 
                      value={endTime} 
                      onChange={(e) => setEndTime(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                {/* File Upload Silabus & Link Pendaftaran */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="admin-field">
                    <label>Silabus Program (Upload Dokumen)</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => syllabusInputRef.current?.click()}
                        disabled={uploadingSyllabus}
                        style={{
                          background: '#FFFFFF',
                          border: '1.5px solid #CBD5E1',
                          color: '#475569',
                          padding: '0.6rem 1.25rem',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          flexShrink: 0
                        }}
                      >
                        <Upload size={14} />
                        {uploadingSyllabus ? 'Mengupload...' : 'Pilih File'}
                      </button>
                      <input 
                        type="file" 
                        ref={syllabusInputRef} 
                        accept=".pdf,.doc,.docx,.xls,.xlsx" 
                        onChange={handleSyllabusUpload} 
                        style={{ display: 'none' }}
                      />
                      {syllabusUrl && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', minWidth: 0 }}>
                          <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            ✓ Terupload
                          </span>
                          <button 
                            type="button" 
                            onClick={() => setSyllabusUrl('')} 
                            style={{ border: 'none', background: 'none', color: '#EF4444', cursor: 'pointer', padding: 0 }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="admin-field">
                    <label>Link / No. Telepon Pendaftaran</label>
                    <input 
                      type="text" 
                      value={registrationLink} 
                      onChange={(e) => setRegistrationLink(e.target.value)} 
                      placeholder="URL / WA"
                    />
                  </div>
                </div>

                {/* Gambar */}
                <div className="admin-field">
                  <label>Gambar</label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '100px', height: '60px', borderRadius: '6px', overflow: 'hidden', border: '1px dashed #CBD5E1', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', flexShrink: 0 }}>
                      {image ? (
                        <img 
                          src={getImageUrl(image)} 
                          alt="Preview" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <ImageIcon size={18} />
                          <span style={{ fontSize: '0.55rem', fontWeight: '600', marginTop: '0.1rem' }}>Kosong</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        disabled={uploadingImage}
                        style={{
                          background: '#FFFFFF',
                          border: '1.5px solid #CBD5E1',
                          color: '#475569',
                          padding: '0.45rem 1rem',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <Upload size={14} />
                        {uploadingImage ? 'Mengupload...' : 'Upload Image'}
                      </button>
                      <input 
                        type="file" 
                        ref={imageInputRef} 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        style={{ display: 'none' }}
                      />
                      <span className="image-hint-text" style={{ display: 'block', marginTop: '0.4rem' }}>
                        600x400px. Maksimal 2MB
                      </span>
                    </div>
                  </div>
                </div>

                {/* AGENDA SECTION */}
                <div className="admin-field" style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: '700' }}>Agenda Acara (Sesi)</label>
                    <button
                      type="button"
                      onClick={addAgendaRow}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#2563EB',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <PlusCircle size={14} />
                      Tambah Sesi
                    </button>
                  </div>

                  {agenda.length === 0 ? (
                    <p style={{ fontSize: '0.8rem', color: '#94A3B8', fontStyle: 'italic', margin: '0.5rem 0' }}>Belum ada sesi agenda yang ditambahkan</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {agenda.map((item, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 3fr auto', gap: '0.5rem', alignItems: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>Mulai</span>
                            <input 
                              type="time" 
                              value={item.startTime} 
                              onChange={(e) => updateAgendaRow(idx, 'startTime', e.target.value)} 
                              required
                            />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>Selesai</span>
                            <input 
                              type="time" 
                              value={item.endTime} 
                              onChange={(e) => updateAgendaRow(idx, 'endTime', e.target.value)} 
                              required
                            />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>Aktivitas / Sesi</span>
                            <input 
                              type="text" 
                              value={item.activity} 
                              onChange={(e) => updateAgendaRow(idx, 'activity', e.target.value)} 
                              placeholder="cth: Sesi 1: Pembukaan"
                              required
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAgendaRow(idx)}
                            style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#EF4444', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer', marginTop: '1.1rem' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem' }}>
                <button
                  type="button"
                  className="modal-btn cancel"
                  onClick={() => setModalOpen(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="modal-btn submit"
                  disabled={submitting || uploadingImage || uploadingSyllabus}
                >
                  {submitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
          margin: 0;
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

        .admin-add-btn {
          background: #001f3f;
          color: #fff;
          border: none;
          padding: 0.5rem 1.1rem;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.82rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          transition: all 0.2s;
          font-family: inherit;
        }
        .admin-add-btn:hover {
          background: #001326;
          transform: translateY(-1px);
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
        .admin-field input[type="date"],
        .admin-field input[type="time"],
        .admin-field select,
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
        .admin-field input:focus,
        .admin-field select:focus,
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

        /* Table */
        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.88rem;
        }
        .admin-table th {
          background: #F8FAFC;
          color: #475569;
          font-weight: 700;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #E2E8F0;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.5px;
        }
        .admin-table td {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #F1F5F9;
          color: #475569;
          vertical-align: middle;
        }
        .admin-table tr:hover {
          background: #FAFAFA;
        }

        /* Move position buttons */
        .position-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
        }
        .arrow-btn {
          border: 1px solid #E2E8F0;
          background: #fff;
          color: #64748B;
          width: 24px;
          height: 24px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s;
        }
        .arrow-btn:hover:not(:disabled) {
          background: #F1F5F9;
          color: #0F172A;
        }
        .arrow-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          background: #F8FAFC;
        }
        .position-number {
          font-size: 0.88rem;
          font-weight: 700;
          color: #475569;
          min-width: 14px;
          text-align: center;
        }
        .user-count-badge {
          background: #F1F5F9;
          color: #475569;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
        }

        .table-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
        }
        .action-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 1px solid #E2E8F0;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .action-btn.edit {
          color: #0F172A;
        }
        .action-btn.edit:hover {
          background: #F1F5F9;
          border-color: #CBD5E1;
        }
        .action-btn.delete {
          color: #EF4444;
        }
        .action-btn.delete:hover {
          background: #FEF2F2;
          border-color: #FCA5A5;
        }

        /* Modal CRUD */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
          padding: 1rem;
        }
        .modal-card {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          animation: modalIn 0.25s ease;
          border: 1px solid #E2E8F0;
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .modal-card-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 800;
          color: #0F172A;
        }
        .modal-card-header p {
          margin: 0;
          font-size: 0.8rem;
          color: #64748B;
        }
        .modal-btn {
          padding: 0.6rem 1.25rem;
          border-radius: 6px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          border: none;
          transition: all 0.2s;
        }
        .modal-btn.cancel {
          background: #F1F5F9;
          color: #475569;
        }
        .modal-btn.cancel:hover {
          background: #E2E8F0;
        }
        .modal-btn.submit {
          background: #001f3f;
          color: #fff;
        }
        .modal-btn.submit:hover {
          background: #001326;
        }
        .modal-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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
        .table-empty {
          padding: 4rem 2rem;
          text-align: center;
          color: #94A3B8;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }
        .table-empty p {
          font-size: 0.9rem;
          font-weight: 500;
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
