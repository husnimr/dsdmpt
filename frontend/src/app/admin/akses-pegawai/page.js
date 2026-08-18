"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Lock, 
  ExternalLink,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

const BACKEND_URL = 'http://localhost:8081';

export default function AdminAksesPegawaiPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create' | 'edit'
  const [selectedLink, setSelectedLink] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
    fetchLinks();
  }, []);

  const getToken = () => localStorage.getItem('admin_token');

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/akses-pegawai`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) throw new Error('Gagal mengambil data akses pegawai');

      const data = await res.json();
      setLinks(data || []);
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnauthorized = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/admin/login';
  };

  const openCreateModal = () => {
    setModalType('create');
    setSelectedLink(null);
    setTitle('');
    setDescription('');
    setLink('');
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setModalType('edit');
    setSelectedLink(item);
    setTitle(item.title || '');
    setDescription(item.description || '');
    setLink(item.link || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let url = `${BACKEND_URL}/api/admin/akses-pegawai`;
      let method = 'POST';
      let body = { title, description, link };

      if (modalType === 'edit' && selectedLink) {
        url = `${BACKEND_URL}/api/admin/akses-pegawai/${selectedLink.id}`;
        method = 'PUT';
        body.position = selectedLink.position;
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
        throw new Error(errMsg || 'Gagal menyimpan akses pegawai');
      }

      showToast('success', modalType === 'create' ? 'Akses pegawai berhasil ditambahkan!' : 'Akses pegawai berhasil diperbarui!');
      setModalOpen(false);
      fetchLinks();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus akses pegawai ini?')) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/akses-pegawai/${id}`, {
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
        throw new Error(errMsg || 'Gagal menghapus akses pegawai');
      }

      showToast('success', 'Akses pegawai berhasil dihapus!');
      fetchLinks();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  const handleMove = async (index, direction) => {
    const newLinks = [...links];
    const swapTargetIndex = direction === 'up' ? index - 1 : index + 1;

    if (swapTargetIndex < 0 || swapTargetIndex >= newLinks.length) return;

    // Swap elements in frontend state array
    const temp = newLinks[index];
    newLinks[index] = newLinks[swapTargetIndex];
    newLinks[swapTargetIndex] = temp;

    // Set immediate state for responsiveness
    setLinks(newLinks);

    // Call API to save positions
    try {
      const ids = newLinks.map(link => link.id);
      const res = await fetch(`${BACKEND_URL}/api/admin/akses-pegawai/reorder`, {
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
      showToast('success', 'Urutan posisi berhasil disimpan!');
    } catch (err) {
      showToast('error', err.message);
      fetchLinks(); // revert on failure
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar Component */}
      <AdminSidebar activePage="akses-pegawai" />

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
              <div>
                <h1>Akses Pegawai</h1>
                <p>Kelola link jalan pintas, sistem internal, dan administrasi bagi pegawai</p>
              </div>
              <button className="admin-add-btn" onClick={openCreateModal}>
                <Plus size={18} />
                <span>Tambah Link</span>
              </button>
            </div>

            <div className="admin-card">
              <div className="admin-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Lock size={18} />
                  <h2>Daftar Akses Pegawai</h2>
                </div>
                <span className="user-count-badge">{links.length} Sistem</span>
              </div>

              {loading ? (
                <div className="table-loading">
                  <div className="admin-spinner" />
                  <p>Memuat data akses pegawai...</p>
                </div>
              ) : links.length === 0 ? (
                <div className="table-empty">
                  <Lock size={40} />
                  <p>Belum ada data akses pegawai terdaftar</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: '80px', textAlign: 'center' }}>Posisi</th>
                        <th style={{ width: '220px' }}>Judul Layanan</th>
                        <th>Deskripsi</th>
                        <th style={{ width: '250px' }}>URL / Tautan</th>
                        <th style={{ textAlign: 'right', width: '120px' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {links.map((item, idx) => (
                        <tr key={item.id}>
                          <td style={{ textAlign: 'center' }}>
                            <div className="position-actions">
                              <button 
                                className="arrow-btn" 
                                disabled={idx === 0} 
                                onClick={() => handleMove(idx, 'up')}
                                title="Naikkan Posisi"
                              >
                                <ArrowUp size={14} />
                              </button>
                              <span className="position-number">{idx + 1}</span>
                              <button 
                                className="arrow-btn" 
                                disabled={idx === links.length - 1} 
                                onClick={() => handleMove(idx, 'down')}
                                title="Turunkan Posisi"
                              >
                                <ArrowDown size={14} />
                              </button>
                            </div>
                          </td>
                          <td>
                            <strong style={{ color: '#0F172A' }}>{item.title}</strong>
                          </td>
                          <td className="desc-cell">{item.description}</td>
                          <td>
                            <a 
                              href={item.link} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="link-anchor"
                            >
                              <span>{item.link}</span>
                              <ExternalLink size={12} />
                            </a>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="table-actions">
                              <button 
                                className="action-btn edit" 
                                title="Edit Layanan"
                                onClick={() => openEditModal(item)}
                              >
                                <Edit2 size={15} />
                              </button>
                              <button 
                                className="action-btn delete" 
                                title="Hapus Layanan"
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
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal CRUD Link */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-card-header">
              <h3>{modalType === 'create' ? 'Tambah Akses Pegawai Baru' : 'Edit Akses Pegawai'}</h3>
              <p>Masukkan info sistem jalan pintas secara akurat</p>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-field full-width">
                  <label htmlFor="title">Judul Layanan / Sistem</label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: HRIS UI"
                    required
                  />
                </div>

                <div className="form-field full-width">
                  <label htmlFor="link">URL / Tautan Akses</label>
                  <input
                    id="link"
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="Contoh: https://hris.ui.ac.id"
                    required
                  />
                </div>

                <div className="form-field full-width">
                  <label htmlFor="description">Deskripsi Singkat</label>
                  <textarea
                    id="description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tulis penjelasan singkat kegunaan sistem ini bagi pegawai..."
                    required
                    style={{
                      padding: '0.65rem 0.8rem',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '6px',
                      fontSize: '0.88rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      resize: 'none',
                    }}
                  />
                </div>
              </div>

              <div className="modal-actions">
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
                  disabled={submitting}
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Akses'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #F8FAFC;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
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
          z-index: 999;
          animation: toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
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

        /* Main Layout */
        .admin-main {
          padding: 3rem 0 4rem;
        }
        .admin-container {
          max-width: 1080px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .admin-page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
        }
        .admin-page-header h1 {
          font-size: 1.8rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 0.35rem 0;
        }
        .admin-page-header p {
          font-size: 0.92rem;
          color: #64748B;
          margin: 0;
        }

        .admin-add-btn {
          background: #001f3f;
          color: #fff;
          border: none;
          padding: 0.65rem 1.25rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.88rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
          font-family: inherit;
        }
        .admin-add-btn:hover {
          background: #001326;
          transform: translateY(-1px);
        }

        /* Card container */
        .admin-card {
          background: #fff;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }
        .admin-card-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #F1F5F9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .admin-card-header h2 {
          font-size: 0.98rem;
          font-weight: 700;
          color: #0F172A;
          margin: 0;
        }
        .user-count-badge {
          background: #F1F5F9;
          color: #475569;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
        }

        /* Table Position Actions */
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
        
        .desc-cell {
          font-size: 0.82rem;
          line-height: 1.5;
          max-width: 320px;
          white-space: normal;
          word-break: break-word;
        }

        .link-anchor {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          color: #2563EB;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.82rem;
          word-break: break-all;
          max-width: 220px;
        }
        .link-anchor:hover {
          text-decoration: underline;
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
          width: 100%;
          max-width: 520px;
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

        .modal-card-header {
          padding: 1.5rem;
          background: #FFFFFF;
          color: #0F172A;
          border-bottom: 1px solid #E2E8F0;
        }
        .modal-card-header h3 {
          margin: 0 0 0.25rem;
          font-size: 1.25rem;
          font-weight: 800;
          color: #0F172A;
        }
        .modal-card-header p {
          margin: 0;
          font-size: 0.8rem;
          color: #64748B;
        }

        .modal-form {
          padding: 1.5rem;
        }
        .form-grid {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .form-field {
          display: flex;
          flex-direction: column;
        }
        .form-field label {
          font-size: 0.82rem;
          font-weight: 600;
          color: #475569;
          margin-bottom: 0.4rem;
        }
        .form-field input {
          padding: 0.65rem 0.8rem;
          border: 1.5px solid #E2E8F0;
          border-radius: 6px;
          font-size: 0.88rem;
          font-family: inherit;
          outline: none;
          background: #FFFFFF;
          box-sizing: border-box;
          width: 100%;
        }
        .form-field input:focus, .form-field textarea:focus {
          border-color: #2563EB;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .modal-actions {
          margin-top: 2rem;
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
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

        /* Spinner */
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

        @keyframes toastIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
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
