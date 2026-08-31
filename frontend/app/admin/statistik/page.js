"use client";

import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Database,
  Calendar
} from 'lucide-react';

const BACKEND_URL = 'http://localhost:8081';

export default function AdminStatistikPage() {
  const [data, setData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState('');
  const [activeTab, setActiveTab] = useState('dosen'); // 'dosen' | 'tendik'
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
    fetchStats();
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

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/statistik`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) throw new Error('Gagal mengambil data statistik');

      const body = await res.json();
      setData(body.data || []);
      setLastUpdated(body.last_updated || '');
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/statistik/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) throw new Error('Gagal melakukan sinkronisasi data');

      const body = await res.json();
      setData(body.data || []);
      setLastUpdated(body.last_updated || '');
      showToast('success', 'Data statistik berhasil disinkronkan dengan BKD!');
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setSyncing(false);
    }
  };

  // Filter lists based on tab
  const dosenList = data.filter(item => item.kategori === 'dosen');
  const tendikList = data.filter(item => item.kategori === 'tendik');

  // Sum calculations
  const dosenSum = dosenList.reduce(
    (acc, curr) => ({
      pns: acc.pns + curr.pns,
      tetapNonPns: acc.tetapNonPns + curr.tetap_non_pns,
      nidk: acc.nidk + curr.nidk,
      total: acc.total + curr.total,
    }),
    { pns: 0, tetapNonPns: 0, nidk: 0, total: 0 }
  );

  const tendikSum = tendikList.reduce(
    (acc, curr) => ({
      pns: acc.pns + curr.pns,
      nonPns: acc.nonPns + curr.tetap_non_pns, // tendik tetap_non_pns represents non_pns
      total: acc.total + curr.total,
    }),
    { pns: 0, nonPns: 0, total: 0 }
  );

  return (
    <div className="admin-stats-container">
      {/* Toast Alert */}
      {toast && (
        <div className={`toast-alert ${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="stats-header-card">
        <div className="header-card-content">
          <div className="header-title-section">
            <div className="header-icon-wrapper">
              <BarChart2 size={24} />
            </div>
            <div>
              <h2 className="header-main-title">Sinkronisasi Statistik Dosen & Tendik</h2>
              <p className="header-sub-title">Kelola data statistik dosen dan tenaga kependidikan dari database BKD.</p>
            </div>
          </div>

          <button 
            type="button" 
            className={`sync-btn ${syncing ? 'loading' : ''}`}
            onClick={handleSync}
            disabled={syncing}
          >
            <RefreshCw size={16} className={syncing ? 'spin-icon' : ''} />
            <span>{syncing ? 'Mensinkronkan...' : 'Load Sinkron Data'}</span>
          </button>
        </div>

        {/* Sync Info Badge */}
        {lastUpdated ? (
          <div className="sync-timestamp-badge">
            <Calendar size={14} />
            <span>Terakhir diperbarui per: <strong className="time-text">{lastUpdated}</strong></span>
          </div>
        ) : (
          <div className="sync-timestamp-badge warning">
            <AlertCircle size={14} />
            <span>Data belum pernah disinkronkan. Klik tombol di atas untuk sinkronisasi.</span>
          </div>
        )}
      </div>

      {/* Tabs Switcher */}
      <div className="tab-control-bar">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'dosen' ? 'active' : ''}`}
          onClick={() => setActiveTab('dosen')}
        >
          Dosen
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'tendik' ? 'active' : ''}`}
          onClick={() => setActiveTab('tendik')}
        >
          Tenaga Kependidikan
        </button>
      </div>

      {/* Data Table Card */}
      <div className="table-card">
        {loading ? (
          <div className="table-loading-state">
            <RefreshCw size={36} className="spin-icon text-muted" />
            <p>Memuat data statistik dari server...</p>
          </div>
        ) : activeTab === 'dosen' ? (
          <div className="table-wrapper">
            <table className="stats-admin-table">
              <thead>
                <tr>
                  <th style={{ width: '8%' }}>No</th>
                  <th>Fakultas / Sekolah / Program</th>
                  <th style={{ width: '15%' }} className="text-center">PNS</th>
                  <th style={{ width: '15%' }} className="text-center">Tetap Non PNS</th>
                  <th style={{ width: '15%' }} className="text-center">NIDK</th>
                  <th style={{ width: '15%' }} className="text-center font-bold">Total</th>
                </tr>
              </thead>
              <tbody>
                {dosenList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-muted">
                      Tidak ada data statistik dosen. Silakan lakukan sinkronisasi data.
                    </td>
                  </tr>
                ) : (
                  dosenList.map((item, idx) => (
                    <tr key={item.id}>
                      <td className="text-center text-muted">{idx + 1}</td>
                      <td className="font-semibold">{item.unit_name}</td>
                      <td className="text-center">{item.pns.toLocaleString('id-ID')}</td>
                      <td className="text-center">{item.tetap_non_pns.toLocaleString('id-ID')}</td>
                      <td className="text-center">{item.nidk.toLocaleString('id-ID')}</td>
                      <td className="text-center font-bold text-navy">{item.total.toLocaleString('id-ID')}</td>
                    </tr>
                  ))
                )}
                {dosenList.length > 0 && (
                  <tr className="grand-total-row">
                    <td colSpan="2" className="text-right font-bold">Jumlah Total:</td>
                    <td className="text-center font-bold">{dosenSum.pns.toLocaleString('id-ID')}</td>
                    <td className="text-center font-bold">{dosenSum.tetapNonPns.toLocaleString('id-ID')}</td>
                    <td className="text-center font-bold">{dosenSum.nidk.toLocaleString('id-ID')}</td>
                    <td className="text-center font-black text-navy text-lg">{dosenSum.total.toLocaleString('id-ID')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="stats-admin-table">
              <thead>
                <tr>
                  <th style={{ width: '8%' }}>No</th>
                  <th>Unit Kerja</th>
                  <th style={{ width: '20%' }} className="text-center">PNS</th>
                  <th style={{ width: '20%' }} className="text-center">Non PNS</th>
                  <th style={{ width: '20%' }} className="text-center font-bold">Total</th>
                </tr>
              </thead>
              <tbody>
                {tendikList.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-muted">
                      Tidak ada data statistik tenaga kependidikan. Silakan lakukan sinkronisasi data.
                    </td>
                  </tr>
                ) : (
                  tendikList.map((item, idx) => (
                    <tr key={item.id}>
                      <td className="text-center text-muted">{idx + 1}</td>
                      <td className="font-semibold">{item.unit_name}</td>
                      <td className="text-center">{item.pns.toLocaleString('id-ID')}</td>
                      <td className="text-center">{item.tetap_non_pns.toLocaleString('id-ID')}</td>
                      <td className="text-center font-bold text-navy">{item.total.toLocaleString('id-ID')}</td>
                    </tr>
                  ))
                )}
                {tendikList.length > 0 && (
                  <tr className="grand-total-row">
                    <td colSpan="2" className="text-right font-bold">Jumlah Total:</td>
                    <td className="text-center font-bold">{tendikSum.pns.toLocaleString('id-ID')}</td>
                    <td className="text-center font-bold">{tendikSum.nonPns.toLocaleString('id-ID')}</td>
                    <td className="text-center font-black text-navy text-lg">{tendikSum.total.toLocaleString('id-ID')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        .admin-stats-container {
          padding: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Toast Alert */
        .toast-alert {
          position: fixed;
          top: 1.5rem;
          right: 1.5rem;
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          border-radius: 8px;
          color: white;
          font-weight: 500;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          animation: slideIn 0.3s ease-out;
        }
        .toast-alert.success {
          background-color: #10B981;
        }
        .toast-alert.error {
          background-color: #EF4444;
        }

        /* Header Card */
        .stats-header-card {
          background: white;
          border-radius: 12px;
          padding: 1.75rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          margin-bottom: 1.5rem;
          border: 1px solid #E2E8F0;
        }
        .header-card-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .header-title-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .header-icon-wrapper {
          background: #EEF2F6;
          color: #0F172A;
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .header-main-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0F172A;
          margin: 0;
        }
        .header-sub-title {
          font-size: 0.875rem;
          color: #64748B;
          margin: 0.25rem 0 0 0;
        }

        /* Sync Button */
        .sync-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #1E3A8A; /* Navy Navy color */
          color: white;
          border: none;
          padding: 0.625rem 1.25rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .sync-btn:hover {
          background: #172554;
        }
        .sync-btn:disabled {
          background: #94A3B8;
          cursor: not-allowed;
        }

        /* Sync Info Badge */
        .sync-timestamp-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1.25rem;
          padding: 0.5rem 0.75rem;
          background: #F0FDF4;
          border: 1px solid #BBF7D0;
          color: #166534;
          border-radius: 6px;
          font-size: 0.825rem;
        }
        .sync-timestamp-badge.warning {
          background: #FFFBEB;
          border-color: #FEF3C7;
          color: #92400E;
        }
        .time-text {
          font-family: monospace;
          font-size: 0.9rem;
          background: rgba(0,0,0,0.05);
          padding: 0.1rem 0.3rem;
          border-radius: 4px;
        }

        /* Tab Controls */
        .tab-control-bar {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          background: #E2E8F0;
          padding: 0.25rem;
          border-radius: 8px;
          width: fit-content;
        }
        .tab-btn {
          border: none;
          background: transparent;
          padding: 0.5rem 1.25rem;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tab-btn.active {
          background: white;
          color: #0F172A;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }

        /* Table Design */
        .table-card {
          background: white;
          border-radius: 12px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          overflow: hidden;
        }
        .table-loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          gap: 1rem;
          color: #64748B;
        }
        .table-wrapper {
          overflow-x: auto;
        }
        .stats-admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.875rem;
        }
        .stats-admin-table th {
          background: #F8FAFC;
          color: #475569;
          font-weight: 700;
          padding: 0.875rem 1.25rem;
          border-bottom: 2px solid #E2E8F0;
        }
        .stats-admin-table td {
          padding: 0.875rem 1.25rem;
          border-bottom: 1px solid #EEF2F6;
          color: #334155;
        }
        .stats-admin-table tr:hover td {
          background: #F8FAFC;
        }
        
        /* Table Helpers */
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
        .font-black { font-weight: 900; }
        .text-navy { color: #1E3A8A; }
        .text-lg { font-size: 1.05rem; }
        .text-muted { color: #64748B; }
        .py-8 { padding-top: 2rem; padding-bottom: 2rem; }

        .grand-total-row {
          background: #F1F5F9;
        }
        .grand-total-row td {
          border-top: 2px solid #CBD5E1;
          border-bottom: 2px solid #CBD5E1;
          background: #F1F5F9 !important;
          color: #0F172A;
        }

        /* Animations */
        @keyframes slideIn {
          from {
            transform: translateY(-1rem);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .spin-icon {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
