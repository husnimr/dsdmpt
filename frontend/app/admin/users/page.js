"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, UserPlus, CheckCircle, AlertCircle, Shield, Key } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

const BACKEND_URL = 'http://localhost:8081';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [currentAdmin, setCurrentAdmin] = useState(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create' or 'edit'
  const [selectedUser, setSelectedUser] = useState(null);

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
    const adminData = localStorage.getItem('admin_user');
    if (adminData) {
      try {
        setCurrentAdmin(JSON.parse(adminData));
      } catch (err) {}
    }
    fetchUsers();
  }, []);

  const getToken = () => localStorage.getItem('admin_token');

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) throw new Error('Gagal mengambil data user');

      const data = await res.json();
      setUsers(data || []);
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
    setSelectedUser(null);
    setUsername('');
    setPassword('');
    setName('');
    setEmail('');
    setRole('admin');
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setModalType('edit');
    setSelectedUser(user);
    setUsername(user.username);
    setPassword(''); // Biarkan kosong jika tidak ingin ganti password
    setName(user.name);
    setEmail(user.email);
    setRole(user.role || 'admin');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let url = `${BACKEND_URL}/api/admin/users`;
      let method = 'POST';
      let body = { username, password, name, email, role };

      if (modalType === 'edit' && selectedUser) {
        url = `${BACKEND_URL}/api/admin/users/${selectedUser.id}`;
        method = 'PUT';
        // Password opsional untuk edit
        if (!password) {
          delete body.password;
        }
      }

      const res = await fetch(url, {
        method: method,
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
        throw new Error(errMsg || 'Gagal menyimpan user');
      }

      showToast('success', modalType === 'create' ? 'User berhasil ditambahkan!' : 'User berhasil diperbarui!');
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (id === 1) {
      showToast('error', 'Superadmin utama tidak dapat dihapus');
      return;
    }

    if (currentAdmin && currentAdmin.id === id) {
      showToast('error', 'Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif');
      return;
    }

    if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/users/${id}`, {
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
        throw new Error(errMsg || 'Gagal menghapus user');
      }

      showToast('success', 'User berhasil dihapus!');
      fetchUsers();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar Component */}
      <AdminSidebar activePage="users" />

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
            <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1>Kelola Users</h1>
                <p>Tambah, edit, atau hapus admin yang mengelola DSDMPT</p>
              </div>
              <button className="admin-add-btn" onClick={openCreateModal}>
                <Plus size={18} />
                <span>Tambah User</span>
              </button>
            </div>

            <div className="admin-card">
              <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Shield size={20} />
                  <h2>Daftar Administrator</h2>
                </div>
                <span className="user-count-badge">{users.length} Users</span>
              </div>

              {loading ? (
                <div className="table-loading">
                  <div className="admin-spinner" style={{ borderColor: 'rgba(10,30,56,0.2)', borderTopColor: '#0A1E38' }} />
                  <p>Memuat data user...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="table-empty">
                  <UserPlus size={40} />
                  <p>Belum ada user terdaftar selain superadmin</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Nama Lengkap</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Dibuat Pada</th>
                        <th style={{ textAlign: 'right' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className={u.id === 1 ? 'superadmin-row' : ''}>
                          <td>
                            <div className="user-table-name">
                              <span className="name-text">{u.name}</span>
                              {u.id === 1 && <span className="superadmin-badge">System Root</span>}
                            </div>
                          </td>
                          <td><strong>{u.username}</strong></td>
                          <td>{u.email}</td>
                          <td>
                            <span className={`role-badge ${u.role}`}>
                              {u.role || 'admin'}
                            </span>
                          </td>
                          <td>{new Date(u.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="table-actions">
                              <button 
                                className="action-btn edit" 
                                title="Edit User"
                                onClick={() => openEditModal(u)}
                              >
                                <Edit2 size={15} />
                              </button>
                              {u.id !== 1 && (
                                <button 
                                  className="action-btn delete" 
                                  title="Hapus User"
                                  onClick={() => handleDelete(u.id)}
                                >
                                  <Trash2 size={15} />
                                </button>
                              )}
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

      {/* Modal CRUD User */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-card-header">
              <h3>{modalType === 'create' ? 'Tambah Administrator Baru' : 'Edit Administrator'}</h3>
              <p>Pastikan email dan username bersifat unik</p>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="name">Nama Lengkap</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Husni Mubarok"
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Contoh: admin@ui.ac.id"
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="username">Username</label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Contoh: admin_dsd"
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="role">Role / Peran</label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="admin">Administrator</option>
                    <option value="superadmin">Super Administrator</option>
                  </select>
                </div>

                <div className="form-field full-width">
                  <label htmlFor="password">
                    {modalType === 'create' ? 'Password' : 'Password Baru (Opsional)'}
                    <span className="field-hint">
                      {modalType === 'edit' && 'Kosongkan jika tidak ingin mengubah password lama'}
                    </span>
                  </label>
                  <div className="input-with-icon">
                    <Key size={16} className="input-icon" />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi baru"
                      required={modalType === 'create'}
                    />
                  </div>
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
                  {submitting ? 'Menyimpan...' : 'Simpan User'}
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
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
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

        /* Main */
        .admin-main {
          padding: 3rem 0 4rem;
        }
        .admin-container {
          max-width: 960px;
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

        .admin-add-btn {
          background: #2563EB;
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
          background: #1D4ED8;
          transform: translateY(-1px);
        }

        /* Cards */
        .admin-card {
          background: #fff;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .admin-card-header {
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
        .user-count-badge {
          background: #F1F5F9;
          color: #475569;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
        }

        /* Spinner & Loading */
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
          border: 3px solid rgba(37,99,235,0.1);
          border-top-color: #2563EB;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
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
          color: #334155;
          vertical-align: middle;
        }
        .admin-table tr:hover {
          background: #F8FAFC;
        }
        
        .superadmin-row {
          background: rgba(37, 99, 235, 0.01);
        }
        .user-table-name {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .name-text {
          font-weight: 600;
          color: #0F172A;
        }
        .superadmin-badge {
          background: #DBEAFE;
          color: #1E40AF;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
        }

        .role-badge {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
          text-transform: uppercase;
        }
        .role-badge.superadmin {
          background: #E0F2FE;
          color: #0369A1;
        }
        .role-badge.admin {
          background: #F0FDF4;
          color: #16A34A;
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
          z-index: 500;
          padding: 1rem;
        }
        .modal-card {
          background: #fff;
          width: 100%;
          max-width: 560px;
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
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        .form-field {
          display: flex;
          flex-direction: column;
        }
        .form-field.full-width {
          grid-column: span 2;
        }
        .form-field label {
          font-size: 0.82rem;
          font-weight: 600;
          color: #475569;
          margin-bottom: 0.4rem;
        }
        .form-field input, .form-field select {
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
        .form-field input:focus, .form-field select:focus {
          border-color: #2563EB;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        
        .input-with-icon {
          position: relative;
        }
        .input-with-icon .input-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94A3B8;
        }
        .input-with-icon input {
          padding-left: 2.25rem;
        }

        .field-hint {
          display: inline;
          font-weight: 400;
          font-size: 0.75rem;
          color: #94A3B8;
          margin-left: 0.25rem;
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
          background: #2563EB;
          color: #fff;
        }
        .modal-btn.submit:hover {
          background: #1D4ED8;
        }
        .modal-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @keyframes toastIn {
          from { opacity: 0; transform: translateY(-10px) translateX(10px); }
          to { opacity: 1; transform: translateY(0) translateX(0); }
        }

        @media (max-width: 768px) {
          .admin-layout { flex-direction: column; }
          .admin-sidebar { width: 100%; height: auto; position: static; }
          .admin-container { padding: 0 1rem; }
          .form-grid { grid-template-columns: 1fr; }
          .form-field.full-width { grid-column: span 1; }
        }
      `}</style>
    </div>
  );
}
