"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  GraduationCap,
  UserPlus,
  Award,
  Wallet,
  FlaskConical,
  TrendingUp,
  Star,
  X,
  BookOpen,
  Briefcase,
  Calendar,
  Compass,
  Cpu,
  Globe,
  Heart,
  Laptop,
  Shield,
  Activity,
  Book,
  Users,
  Target,
  Zap,
  Settings,
  Layers,
  MessageSquare,
  Search,
  Lock,
  FolderOpen,
  Users2,
  Network,
  Presentation,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

const BACKEND_URL = 'http://localhost:8081';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('/uploads')) return `${BACKEND_URL}${path}`;
  return path;
};

// Lucide Icon Map for Program Kerja
const IconComponents = {
  GraduationCap,
  UserPlus,
  Award,
  Wallet,
  FlaskConical,
  FileText,
  Star,
  TrendingUp,
  BookOpen,
  Briefcase,
  Calendar,
  Compass,
  Cpu,
  Globe,
  Heart,
  Laptop,
  Shield,
  Activity,
  Book,
  Users,
  Target,
  Zap,
  Settings,
  Layers,
  MessageSquare,
  Search,
  Lock,
  FolderOpen,
  Users2,
  Network,
  Presentation
};

const DEFAULT_PROGRAMS = [
  {
    title: "Pengembangan Kapasitas",
    description: "Melakukan pelatihan berkala untuk membangun kapasitas dan komitmen dosen",
    iconName: "GraduationCap"
  },
  {
    title: "Akuisisi Talenta",
    description: "Mengundang profesional dengan talenta terbaik dari berbagai bidang untuk",
    iconName: "UserPlus"
  },
  {
    title: "Merit System",
    description: "Mengupayakan penerapan sistem merit yang objektif dalam proses rekrutmen dan",
    iconName: "Award"
  },
  {
    title: "Optimasi Insentif",
    description: "Menyempurnakan kebijakan insentif untuk mendorong produktivitas dan",
    iconName: "Wallet"
  },
  {
    title: "Jabatan Peneliti",
    description: "Menciptakan dan mengelola jabatan fungsional peneliti guna memperkuat ekosistem",
    iconName: "FlaskConical"
  },
  {
    title: "Publikasi Bereputasi",
    description: "Meningkatkan kemampuan peneliti dalam menghasilkan publikasi berkualitas",
    iconName: "FileText"
  },
  {
    title: "Dosen Berkualitas",
    description: "Meningkatkan jumlah dosen dengan kualifikasi unggul melalui program",
    iconName: "Star"
  },
  {
    title: "Percepatan Karier",
    description: "Mendorong percepatan kenaikan jabatan fungsional akademik, mulai dari Lektor hingga",
    iconName: "TrendingUp"
  }
];

export default function AdminProfilPage() {
  const [activeTab, setActiveTab] = useState('info');
  const [activeSubdirAccordion, setActiveSubdirAccordion] = useState(0);
  const [activeOrgAccordion, setActiveOrgAccordion] = useState(0);

  // Hero section states
  const [heroTitle, setHeroTitle] = useState('Profil');
  const [heroDesc, setHeroDesc] = useState('');
  const [heroImage, setHeroImage] = useState('/uploads/ui_rectorate_hero.png');

  // Content body states
  const [profilImage, setProfilImage] = useState('/uploads/profile_group.jpg');
  const [description, setDescription] = useState('');

  // Program Kerja states
  const [pkSubtitle, setPkSubtitle] = useState('Program kerja utama yang diamanatkan dalam rencana strategis universitas guna mendukung sasaran strategis pusat talenta terbaik adalah sebagai berikut');
  const [programs, setPrograms] = useState(DEFAULT_PROGRAMS);

  // Struktur Organisasi states
  const [directorTitle, setDirectorTitle] = useState('Direktur SDM dan Pengembangan Talenta');
  const [directorSubTitle, setDirectorSubTitle] = useState('');
  const [columns, setColumns] = useState([
    {
      name: "Layanan, Pembinaan, dan Karier SDM",
      color: "#0A1E38",
      sections: [
        "Seksi Karir Jabatan Fungsional Dosen",
        "Seksi Karir Tenaga Kependidikan",
        "Seksi Layanan dan Pembinaan SDM"
      ]
    },
    {
      name: "Pengembangan Organisasi Tata Laksana dan Sistem SDM",
      color: "#27AE60",
      sections: [
        "Seksi Organisasi dan Tata Laksana",
        "Seksi Pengembangan Sistem SDM",
        "Seksi Perencanaan dan Evaluasi Organisasi"
      ]
    },
    {
      name: "Perencanaan, Penempatan, Pengembangan SDM",
      color: "#C0392B",
      sections: [
        "Seksi Pengembangan Dosen",
        "Seksi Pengembangan Tenaga Kependidikan",
        "Seksi Perencanaan dan Penempatan SDM"
      ]
    },
    {
      name: "Remunerasi dan Kesejahteraan",
      color: "#F2C94C",
      sections: [
        "Seksi Remunerasi dan Kesejahteraan 3 (Payroll)",
        "Seksi Remunerasi dan Kesejahteraan 1 (Dana Dipa)",
        "Seksi Remunerasi dan Kesejahteraan 2 (Dana BPPTN dan Damas)"
      ]
    }
  ]);

  // Pimpinan Direktorat states
  const [directorName, setDirectorName] = useState('Dr.Eng.Ir. Muhammad Arif Budiyanto, S.T., M.T. IPM');
  const [directorRole, setDirectorRole] = useState('DIREKTUR SDM DAN PENGEMBANGAN TALENTA');
  const [directorImage, setDirectorImage] = useState('/uploads/pimpinan_0.png');
  const [pimpinanSubdirectorates, setPimpinanSubdirectorates] = useState([
    {
      id: 1,
      kasubdit: {
        name: "Agus Anang, S.Kom., M.T.I., CHRS.",
        role: "KASUBDIT LAYANAN, PEMBINAAN, DAN KARIER SDM",
        image: "/uploads/pimpinan_4.png"
      },
      kasie: [
        {
          name: "Faisal Ali Ramdhani, S.Kom., CPS.",
          role: "KASIE JABATAN FUNGSIONAL DOSEN",
          image: "/uploads/pimpinan_5.png"
        },
        {
          name: "Prilly Wiashari, S.H.",
          role: "KASIE KARIR TENAGA KEPENDIDIKAN",
          image: "/uploads/pimpinan_6.png"
        },
        {
          name: "Muhammad Wirawan Putra, S.E., M.Ak., CHRS",
          role: "KASIE LAYANAN DAN PEMBINAAN SDM",
          image: "/uploads/pimpinan_7.png"
        }
      ]
    },
    {
      id: 2,
      kasubdit: {
        name: "Yasinta Estherina Puspitasari, S.E.",
        role: "KASUBDIT PENGEMBANGAN ORGANISASI, TATA LAKSANA, DAN SISTEM SDM",
        image: "/uploads/pimpinan_1.png"
      },
      kasie: [
        {
          name: "Gita Maria, S.Sos.",
          role: "KASIE ORGANISASI DAN TATA LAKSANA",
          image: "/uploads/pimpinan_2.png"
        },
        {
          name: "Widianto Nugroho, S.Kom.",
          role: "KASIE PENGEMBANGAN SISTEM SDM",
          image: "/uploads/pimpinan_3.png"
        },
        {
          name: "Dwi Haryanti, S.E.",
          role: "KASIE PERENCANAAN DAN EVALUASI ORGANISASI",
          image: "/uploads/pimpinan_8.png"
        }
      ]
    },
    {
      id: 3,
      kasubdit: {
        name: "Ermina Condro Setyowati, S.IP.",
        role: "KASUBDIT PERENCANAAN, PENEMPATAN, PENGEMBANGAN SDM",
        image: "/uploads/pimpinan_9.png"
      },
      kasie: [
        {
          name: "Meldy Ferian, S.E.",
          role: "KASIE PENGEMBANGAN DOSEN",
          image: "/uploads/pimpinan_10.png"
        },
        {
          name: "Devina Amelia, S.E.",
          role: "KASIE PENGEMBANGAN TENAGA KEPENDIDIKAN",
          image: "/uploads/pimpinan_11.png"
        },
        {
          name: "Siska Indriyani, S.H.",
          role: "KASIE PERENCANAAN DAN PENEMPATAN SDM",
          image: "/uploads/pimpinan_12.png"
        }
      ]
    },
    {
      id: 4,
      kasubdit: {
        name: "Reni Kusuma Wardhani, S.E., M.Si.",
        role: "KASUBDIT REMUNERASI DAN KESEJAHTERAAN",
        image: "/uploads/pimpinan_13.png"
      },
      kasie: [
        {
          name: "Ahmad Zaki, S.E.",
          role: "KASIE REMUNERASI DAN KESEJAHTERAAN 3 (PAYROLL)",
          image: "/uploads/pimpinan_14.png"
        },
        {
          name: "Ria Sitorus, S.E.",
          role: "KASIE REMUNERASI DAN KESEJAHTERAAN 1 (DANA DIPA)",
          image: "/uploads/pimpinan_15.png"
        },
        {
          name: "Hani Fatimah, S.E.",
          role: "KASIE REMUNERASI DAN KESEJAHTERAAN 2 (DANA BPPTN)",
          image: "/uploads/pimpinan_16.png"
        }
      ]
    }
  ]);

  // Modal editing state for Program Kerja
  const [editingIndex, setEditingIndex] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editIcon, setEditIcon] = useState('GraduationCap');
  const [showModal, setShowModal] = useState(false);

  // Upload/Saving states
  const [saving, setSaving] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingContent, setUploadingContent] = useState(false);
  const [toast, setToast] = useState(null);

  const heroFileRef = useRef(null);
  const contentFileRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
    loadSettings();
    loadPrograms();
  }, []);

  const getToken = () => localStorage.getItem('admin_token');

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const loadPrograms = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/program-kerja`);
      if (res.ok) {
        const data = await res.json();
        const formatted = data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          iconName: item.icon_name
        }));
        setPrograms(formatted);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadSettings = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/settings`);
      const data = await res.json();
      
      // Load hero fields
      setHeroTitle(data.profil_hero_title || 'Profil');
      setHeroDesc(data.profil_hero_desc || '');
      setHeroImage(data.hero_image || '/uploads/ui_rectorate_hero.png');

      // Load content body
      setProfilImage(data.profil_image || '/uploads/profile_group.jpg');
      
      // Combine text 1 and text 2 for single textarea description
      const t1 = data.profil_text_1 || '';
      const t2 = data.profil_text_2 || '';
      const combined = [t1, t2].filter(Boolean).join('\n\n');
      setDescription(combined);

      // Load program kerja fields
      setPkSubtitle(data.profil_program_kerja_subtitle || 'Program kerja utama yang diamanatkan dalam rencana strategis universitas guna mendukung sasaran strategis pusat talenta terbaik adalah sebagai berikut');

      // Load organizational structure if saved
      if (data.profil_struktur_organisasi_json) {
        try {
          const parsed = JSON.parse(data.profil_struktur_organisasi_json);
          if (parsed.director) {
            // Support both old and unified structure
            if (parsed.director.title && parsed.director.subTitle) {
              setDirectorTitle(`${parsed.director.title} ${parsed.director.subTitle}`);
            } else {
              setDirectorTitle(parsed.director.title || 'Direktur SDM dan Pengembangan Talenta');
            }
            setDirectorSubTitle('');
          }
          if (parsed.columns && Array.isArray(parsed.columns)) {
            setColumns(parsed.columns);
          }
        } catch (e) {
          console.error("Gagal parse json struktur organisasi", e);
        }
      }

      if (data.profil_pimpinan_json) {
        try {
          const parsed = JSON.parse(data.profil_pimpinan_json);
          if (parsed.director) {
            setDirectorName(parsed.director.name || '');
            setDirectorRole(parsed.director.role || '');
            setDirectorImage(parsed.director.image || '');
          }
          if (parsed.subdirectorates && Array.isArray(parsed.subdirectorates)) {
            setPimpinanSubdirectorates(parsed.subdirectorates);
          }
        } catch (e) {
          console.error("Gagal parse json pimpinan", e);
        }
      }
    } catch (err) {
      showToast('error', 'Gagal memuat data settings');
    }
  };

  const handleUpdateColumnName = (colIdx, value) => {
    const updated = [...columns];
    updated[colIdx].name = value;
    setColumns(updated);
  };

  const handleUpdateColumnColor = (colIdx, value) => {
    const updated = [...columns];
    updated[colIdx].color = value;
    setColumns(updated);
  };

  const handleUpdateSeksi = (colIdx, seksiIdx, value) => {
    const updated = [...columns];
    updated[colIdx].sections[seksiIdx] = value;
    setColumns(updated);
  };

  const handleAddSeksi = (colIdx) => {
    const updated = [...columns];
    updated[colIdx].sections.push('');
    setColumns(updated);
  };

  const handleRemoveSeksi = (colIdx, seksiIdx) => {
    const updated = [...columns];
    updated[colIdx].sections.splice(seksiIdx, 1);
    setColumns(updated);
  };

  const handleAddNewColumn = () => {
    setColumns([...columns, {
      name: '',
      color: '#0A1E38',
      sections: ['']
    }]);
  };

  const handleRemoveColumn = (colIdx) => {
    if (confirm('Apakah Anda yakin ingin menghapus Sub Direktorat beserta seluruh seksinya?')) {
      const updated = [...columns];
      updated.splice(colIdx, 1);
      setColumns(updated);
    }
  };

  const handleSaveStruktur = async () => {
    setSaving(true);
    try {
      const payload = {
        profil_struktur_organisasi_json: JSON.stringify({
          director: {
            title: directorTitle,
            subTitle: directorSubTitle
          },
          columns: columns
        })
      };

      const res = await fetch(`${BACKEND_URL}/api/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/admin/login';
        return;
      }

      if (!res.ok) throw new Error('Gagal menyimpan struktur organisasi');

      showToast('success', 'Struktur Organisasi berhasil disimpan!');
    } catch (err) {
      showToast('error', err.message || 'Gagal menyimpan perubahan');
    } finally {
      setSaving(false);
    }
  };

  const handlePimpinanImageUpload = async (file, nodeType, colIdx = null, kasieIdx = null, staffIdx = null) => {
    if (!file) return;
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
      const imageUrl = data.url;

      if (nodeType === 'director') {
        setDirectorImage(imageUrl);
      } else if (nodeType === 'kasubdit') {
        const updated = [...pimpinanSubdirectorates];
        updated[colIdx].kasubdit.image = imageUrl;
        setPimpinanSubdirectorates(updated);
      } else if (nodeType === 'kasie') {
        const updated = [...pimpinanSubdirectorates];
        updated[colIdx].kasie[kasieIdx].image = imageUrl;
        setPimpinanSubdirectorates(updated);
      } else if (nodeType === 'staff') {
        const updated = [...pimpinanSubdirectorates];
        if (!updated[colIdx].kasie[kasieIdx].staff) {
          updated[colIdx].kasie[kasieIdx].staff = [];
        }
        updated[colIdx].kasie[kasieIdx].staff[staffIdx].image = imageUrl;
        setPimpinanSubdirectorates(updated);
      }
      showToast('success', 'Foto berhasil diupload!');
    } catch (err) {
      showToast('error', err.message || 'Gagal mengupload gambar');
    }
  };

  const handleSavePimpinan = async () => {
    setSaving(true);
    try {
      const payload = {
        profil_pimpinan_json: JSON.stringify({
          director: {
            name: directorName,
            role: directorRole,
            image: directorImage
          },
          subdirectorates: pimpinanSubdirectorates
        })
      };

      const res = await fetch(`${BACKEND_URL}/api/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/admin/login';
        return;
      }

      if (!res.ok) throw new Error('Gagal menyimpan pimpinan direktorat');

      showToast('success', 'Pimpinan Direktorat berhasil disimpan!');
    } catch (err) {
      showToast('error', err.message || 'Gagal menyimpan perubahan');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePimpinanName = (colIdx, value, kasieIdx = null) => {
    const updated = [...pimpinanSubdirectorates];
    if (kasieIdx === null) {
      updated[colIdx].kasubdit.name = value;
    } else {
      updated[colIdx].kasie[kasieIdx].name = value;
    }
    setPimpinanSubdirectorates(updated);
  };

  const handleUpdatePimpinanRole = (colIdx, value, kasieIdx = null) => {
    const updated = [...pimpinanSubdirectorates];
    if (kasieIdx === null) {
      updated[colIdx].kasubdit.role = value;
    } else {
      updated[colIdx].kasie[kasieIdx].role = value;
    }
    setPimpinanSubdirectorates(updated);
  };

  const handleAddKasie = (colIdx) => {
    const updated = [...pimpinanSubdirectorates];
    updated[colIdx].kasie.push({ name: '', role: '', image: '' });
    setPimpinanSubdirectorates(updated);
  };

  const handleRemoveKasie = (colIdx, kasieIdx) => {
    const updated = [...pimpinanSubdirectorates];
    updated[colIdx].kasie.splice(kasieIdx, 1);
    setPimpinanSubdirectorates(updated);
  };

  const handleAddStaff = (colIdx, kasieIdx) => {
    const updated = [...pimpinanSubdirectorates];
    if (!updated[colIdx].kasie[kasieIdx].staff) {
      updated[colIdx].kasie[kasieIdx].staff = [];
    }
    updated[colIdx].kasie[kasieIdx].staff.push({ name: '', role: '', image: '' });
    setPimpinanSubdirectorates(updated);
  };

  const handleRemoveStaff = (colIdx, kasieIdx, staffIdx) => {
    const updated = [...pimpinanSubdirectorates];
    updated[colIdx].kasie[kasieIdx].staff.splice(staffIdx, 1);
    setPimpinanSubdirectorates(updated);
  };

  const handleUpdateStaffName = (colIdx, kasieIdx, staffIdx, value) => {
    const updated = [...pimpinanSubdirectorates];
    updated[colIdx].kasie[kasieIdx].staff[staffIdx].name = value;
    setPimpinanSubdirectorates(updated);
  };

  const handleUpdateStaffRole = (colIdx, kasieIdx, staffIdx, value) => {
    const updated = [...pimpinanSubdirectorates];
    updated[colIdx].kasie[kasieIdx].staff[staffIdx].role = value;
    setPimpinanSubdirectorates(updated);
  };

  const handleAddNewPimpinanColumn = () => {
    setPimpinanSubdirectorates([...pimpinanSubdirectorates, {
      id: Date.now(),
      kasubdit: { name: '', role: '', image: '' },
      kasie: [{ name: '', role: '', image: '' }]
    }]);
  };

  const handleRemovePimpinanColumn = (colIdx) => {
    if (confirm('Apakah Anda yakin ingin menghapus Sub Direktorat ini beserta seluruh jajaran Kasienya?')) {
      const updated = [...pimpinanSubdirectorates];
      updated.splice(colIdx, 1);
      setPimpinanSubdirectorates(updated);
    }
  };

  const handleSaveHero = async () => {
    setSaving(true);
    try {
      const payload = {
        profil_hero_title: heroTitle,
        profil_hero_desc: heroDesc,
        hero_image: heroImage,
      };

      const res = await fetch(`${BACKEND_URL}/api/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/admin/login';
        return;
      }

      if (!res.ok) throw new Error('Gagal menyimpan');

      showToast('success', 'Hero Section berhasil disimpan!');
    } catch (err) {
      showToast('error', err.message || 'Gagal menyimpan perubahan');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveContent = async () => {
    setSaving(true);
    try {
      // Split description back into paragraph 1 and 2
      const paragraphs = description.split(/\n\s*\n/);
      const profil_text_1 = paragraphs[0] || '';
      const profil_text_2 = paragraphs.slice(1).join('\n\n') || '';

      const payload = {
        profil_image: profilImage,
        profil_text_1: profil_text_1,
        profil_text_2: profil_text_2,
        profil_program_kerja_subtitle: pkSubtitle,
      };

      const res = await fetch(`${BACKEND_URL}/api/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/admin/login';
        return;
      }

      if (!res.ok) throw new Error('Gagal menyimpan');

      showToast('success', 'Perubahan konten berhasil disimpan!');
    } catch (err) {
      showToast('error', err.message || 'Gagal menyimpan perubahan');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    loadSettings();
    loadPrograms();
    showToast('success', 'Data dikembalikan ke penyimpanan terakhir.');
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'hero') setUploadingHero(true);
    else setUploadingContent(true);

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
      if (type === 'hero') {
        setHeroImage(data.url);
      } else {
        setProfilImage(data.url);
      }
      showToast('success', 'Gambar berhasil diupload!');
    } catch (err) {
      showToast('error', err.message || 'Gagal mengupload gambar');
    } finally {
      if (type === 'hero') setUploadingHero(false);
      else setUploadingContent(false);
    }
  };

  // Program Kerja CRUD Functions
  const handleOpenEdit = (index) => {
    setEditingIndex(index);
    const item = programs[index];
    setEditTitle(item.title);
    setEditDesc(item.description);
    setEditIcon(item.iconName || 'GraduationCap');
    setShowModal(true);
  };

  const handleOpenAdd = () => {
    setEditingIndex(-1);
    setEditTitle('');
    setEditDesc('');
    setEditIcon('GraduationCap');
    setShowModal(true);
  };

  const handleSaveProgram = async () => {
    if (!editTitle.trim()) {
      alert('Judul program kerja tidak boleh kosong.');
      return;
    }
    
    const body = {
      title: editTitle,
      description: editDesc,
      icon_name: editIcon
    };

    try {
      let url = `${BACKEND_URL}/api/admin/program-kerja`;
      let method = 'POST';
      
      if (editingIndex >= 0) {
        const item = programs[editingIndex];
        url = `${BACKEND_URL}/api/admin/program-kerja/${item.id}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error('Gagal menyimpan program kerja');

      showToast('success', 'Program kerja berhasil disimpan!');
      loadPrograms();
      setShowModal(false);
    } catch (err) {
      showToast('error', err.message);
    }
  };

  const handleDeleteProgram = async (index, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const item = programs[index];
    if (!item.id) return;

    if (confirm('Apakah Anda yakin ingin menghapus program kerja ini?')) {
      try {
        const res = await fetch(`${BACKEND_URL}/api/admin/program-kerja/${item.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        });
        if (!res.ok) throw new Error('Gagal menghapus program kerja');
        showToast('success', 'Program kerja berhasil dihapus!');
        loadPrograms();
      } catch (err) {
        showToast('error', err.message);
      }
    }
  };

  const renderIcon = (iconName) => {
    const IconComp = IconComponents[iconName] || Award;
    return <IconComp size={20} />;
  };

  return (
    <div className="admin-layout">
      {/* Sidebar Component */}
      <AdminSidebar activePage="profil" />

      {/* Main Content Area */}
      <div className="admin-content-wrapper">
        {/* Toast notification */}
        {toast && (
          <div className={`admin-toast ${toast.type}`}>
            {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{toast.message}</span>
          </div>
        )}

        <main className="admin-main">
          <div className="admin-container">
            
            {/* Tab Navigation Header */}
            <div className="admin-tabs-nav" style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #E2E8F0', marginBottom: '2rem', paddingBottom: '0px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('info')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: activeTab === 'info' ? '#0B2F61' : '#64748B',
                  borderBottom: activeTab === 'info' ? '3px solid #FFC72C' : '3px solid transparent',
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  outline: 'none',
                  marginBottom: '-2px'
                }}
              >
                Informasi Profil & Program Kerja
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('struktur')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: activeTab === 'struktur' ? '#0B2F61' : '#64748B',
                  borderBottom: activeTab === 'struktur' ? '3px solid #FFC72C' : '3px solid transparent',
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  outline: 'none',
                  marginBottom: '-2px'
                }}
              >
                Struktur Organisasi
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('pimpinan')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: activeTab === 'pimpinan' ? '#0B2F61' : '#64748B',
                  borderBottom: activeTab === 'pimpinan' ? '3px solid #FFC72C' : '3px solid transparent',
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  outline: 'none',
                  marginBottom: '-2px'
                }}
              >
                Pimpinan Direktorat
              </button>
            </div>

            {activeTab === 'info' && (
              <>
                {/* CARD 1: Hero Section */}
                <div className="admin-card" style={{ marginBottom: '2rem' }}>
                  <div className="admin-card-header">
                    <h2>Hero Section</h2>
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
                          onChange={(e) => handleImageUpload(e, 'hero')} 
                          style={{ display: 'none' }}
                        />
                      </div>
                      <span className="image-hint-text">Recommended size: 1920x600px. Max size: 2MB.</span>
                    </div>
                  </div>

                  <div className="admin-card-footer" style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem 1.5rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
                    <button 
                      className="btn-save" 
                      onClick={handleSaveHero}
                      disabled={saving}
                    >
                      {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                  </div>
                </div>

                {/* CARD 2: Konten */}
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h2>Konten</h2>
                  </div>

                  <div className="admin-card-body flex-row-layout">
                    <div className="image-column">
                      <label>Gambar</label>
                      <div className="image-uploader-wrapper content-img-uploader">
                        <img src={getImageUrl(profilImage)} alt="Content Body" />
                        <button 
                          className="upload-overlay-btn"
                          onClick={() => contentFileRef.current?.click()}
                          disabled={uploadingContent}
                        >
                          <Upload size={16} />
                          {uploadingContent ? 'Mengunggah...' : 'Upload Image'}
                        </button>
                        <input 
                          type="file" 
                          ref={contentFileRef} 
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'content')} 
                          style={{ display: 'none' }}
                        />
                      </div>
                    </div>

                    <div className="inputs-column">
                      <div className="admin-field full-height">
                        <label>Deskripsi</label>
                        <textarea 
                          rows={12} 
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD 3: Program Kerja */}
                <div className="admin-card">
                  <div className="admin-card-header flex-header">
                    <h2>Program Kerja</h2>
                    <button className="btn-add-pk" onClick={handleOpenAdd}>
                      <Plus size={16} />
                      <span>Tambah</span>
                    </button>
                  </div>

                  <div className="admin-card-body">
                    <div className="admin-field">
                      <label>Section Subtitle</label>
                      <textarea 
                        rows={2} 
                        value={pkSubtitle}
                        onChange={(e) => setPkSubtitle(e.target.value)}
                        className="subtitle-textarea"
                      />
                    </div>

                    {/* Grid list of program kerja */}
                    <div className="programs-editor-grid">
                      {programs.map((pk, idx) => (
                        <div 
                          key={idx} 
                          className="program-editor-card"
                          onClick={() => handleOpenEdit(idx)}
                        >
                          <div className="card-actions-row">
                            <button 
                              className="delete-pk-btn" 
                              onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleDeleteProgram(idx, e); }}
                              title="Hapus"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="program-card-icon">
                            {renderIcon(pk.iconName)}
                          </div>
                          <div className="program-card-info">
                            <h3>{pk.title}</h3>
                            <p>{pk.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SAVE ACTIONS BAR */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                  <button 
                    type="button"
                    className="btn-cancel" 
                    onClick={handleCancel}
                    disabled={saving}
                    style={{ padding: '0.65rem 1.75rem', fontSize: '0.9rem', fontWeight: '700' }}
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleSaveContent}
                    className="btn-save"
                    disabled={saving}
                    style={{ padding: '0.65rem 1.75rem', fontSize: '0.9rem', fontWeight: '700' }}
                  >
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </>
            )}

            {activeTab === 'struktur' && (
              <div className="struktur-editor-container">
                
                {/* CARD: Direktur */}
                <div className="admin-card" style={{ marginBottom: '2rem' }}>
                  <div className="admin-card-header">
                    <h2>Pimpinan Utama (Direktur)</h2>
                  </div>
                  <div className="admin-card-body flex-row-layout">
                    <div className="inputs-column">
                      <div className="admin-field">
                        <label>Jabatan</label>
                        <input 
                          type="text" 
                          value={directorTitle}
                          onChange={(e) => setDirectorTitle(e.target.value)}
                          placeholder="Contoh: Direktur SDM dan Pengembangan Talenta"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD: Sub-Directorate Columns Editor */}
                <div className="admin-card" style={{ marginBottom: '2rem' }}>
                  <div className="admin-card-header">
                    <h2>Sub Direktorat & Seksi</h2>
                  </div>
                  <div className="admin-card-body">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {columns.map((col, colIdx) => {
                        const isOpen = activeOrgAccordion === colIdx;
                        const title = col.name || `Sub-Direktorat ${colIdx + 1}`;
                        
                        return (
                          <div 
                            key={colIdx} 
                            style={{ 
                              background: '#FFFFFF', 
                              border: '1px solid #E2E8F0', 
                              borderRadius: '12px',
                              overflow: 'hidden',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                            }}
                          >
                            {/* Accordion Header */}
                            <div 
                              onClick={() => setActiveOrgAccordion(isOpen ? null : colIdx)}
                              style={{ 
                                background: isOpen ? '#F1F5F9' : '#F8FAFC', 
                                padding: '1rem 1.25rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                                borderBottom: isOpen ? '1px solid #E2E8F0' : 'none'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                                {isOpen ? <ChevronUp size={18} style={{ color: '#0B2F61' }} /> : <ChevronDown size={18} style={{ color: '#0B2F61' }} />}
                                <span style={{ fontSize: '0.9rem', fontWeight: '800', color: col.color || '#0B2F61' }}>
                                  {title}
                                </span>
                              </div>
                              
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveColumn(colIdx);
                                }}
                                style={{ 
                                  background: 'none', 
                                  border: 'none', 
                                  color: '#EF4444', 
                                  cursor: 'pointer', 
                                  fontSize: '0.75rem', 
                                  fontWeight: '700', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '0.25rem',
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '6px',
                                  transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <Trash2 size={14} /> Hapus Sub-Direktorat
                              </button>
                            </div>

                            {/* Accordion Body */}
                            {isOpen && (
                              <div 
                                style={{ 
                                  padding: '1.25rem',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '1.25rem',
                                  background: '#FFFFFF'
                                }}
                              >
                                {/* Sub-Directorate Name & Color Select */}
                                <div className="admin-field">
                                  <label style={{ fontSize: '0.75rem', fontWeight: '800' }}>Nama Sub-Direktorat</label>
                                  <textarea
                                    rows={3}
                                    value={col.name}
                                    onChange={(e) => handleUpdateColumnName(colIdx, e.target.value)}
                                    style={{ padding: '0.5rem', fontSize: '0.85rem', fontWeight: '600' }}
                                  />
                                </div>

                                <div className="admin-field">
                                  <label style={{ fontSize: '0.75rem', fontWeight: '800' }}>Warna Tema Visual</label>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input
                                      type="color"
                                      value={col.color || '#0A1E38'}
                                      onChange={(e) => handleUpdateColumnColor(colIdx, e.target.value)}
                                      style={{ width: '40px', height: '36px', border: '1px solid #CBD5E1', borderRadius: '4px', padding: '0px', cursor: 'pointer' }}
                                    />
                                    <input
                                      type="text"
                                      value={col.color || '#0A1E38'}
                                      onChange={(e) => handleUpdateColumnColor(colIdx, e.target.value)}
                                      style={{ flex: 1, padding: '0.45rem', fontSize: '0.85rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontFamily: 'inherit' }}
                                    />
                                  </div>
                                </div>

                                {/* List of sections (Seksi) */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                  <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#475569' }}>Daftar Seksi</label>
                                  {col.sections.map((seksi, seksiIdx) => (
                                    <div key={seksiIdx} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                      <input
                                        type="text"
                                        value={seksi}
                                        onChange={(e) => handleUpdateSeksi(colIdx, seksiIdx, e.target.value)}
                                        style={{ flex: 1, padding: '0.45rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveSeksi(colIdx, seksiIdx)}
                                        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem' }}
                                        title="Hapus Seksi"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                  ))}

                                  <button
                                    type="button"
                                    onClick={() => handleAddSeksi(colIdx)}
                                    style={{ 
                                      marginTop: '0.5rem', 
                                      background: '#FFFFFF', 
                                      border: '1px dashed #CBD5E1', 
                                      padding: '0.5rem', 
                                      borderRadius: '6px', 
                                      cursor: 'pointer', 
                                      fontSize: '0.75rem', 
                                      fontWeight: '700', 
                                      color: '#0B2F61',
                                      transition: 'all 0.2s',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '0.25rem'
                                    }}
                                  >
                                    <Plus size={14} /> Tambah Seksi
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Button add new column */}
                      <button
                        type="button"
                        onClick={handleAddNewColumn}
                        style={{ 
                          border: '2px dashed #CBD5E1', 
                          borderRadius: '12px', 
                          padding: '1.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          background: '#FFFFFF',
                          cursor: 'pointer',
                          color: '#64748B',
                          fontWeight: '700',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0B2F61'; e.currentTarget.style.color = '#0B2F61'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.color = '#64748B'; }}
                      >
                        <Plus size={18} />
                        <span style={{ fontSize: '0.85rem' }}>Tambah Sub-Direktorat Baru</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* CARD: Live Preview (Pratinjau) */}
                <div className="admin-card" style={{ marginBottom: '2rem' }}>
                  <div className="admin-card-header">
                    <h2>Pratinjau</h2>
                  </div>
                  <div className="admin-card-body" style={{ background: '#F8FAFC', padding: '2rem 1rem', overflowX: 'auto' }}>
                    <div className="struktur-organisasi-container" style={{ minWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      
                      {/* Director Card */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                        <div style={{ 
                          backgroundColor: '#ffffff', 
                          borderRadius: '12px', 
                          border: '1px solid #E2E8F0', 
                          borderLeft: '5px solid #F2C94C', 
                          padding: '1.25rem 2rem', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '1rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                          maxWidth: '450px',
                          width: '100%',
                          zIndex: 2
                        }}>
                          <div style={{ width: '42px', height: '50px', borderRadius: '50%', backgroundColor: '#FEF9E7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F2C94C', flexShrink: 0 }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          </div>
                          <div>
                            <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#0A1E38', fontWeight: '800', lineHeight: '1.3', textAlign: 'center' }}>
                              {directorTitle || 'Direktur SDM dan Pengembangan Talenta'}
                            </h4>
                          </div>
                        </div>
                      </div>

                      {/* Vertical line directly between Direktur and Columns */}
                      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <div style={{ width: '2px', height: '40px', backgroundColor: '#CBD5E1', zIndex: 1 }} />
                      </div>

                      {/* Sub-Directorate Columns Connected by tree structure */}
                      {columns.length > 0 && (
                        <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          
                          {/* Horizontal line */}
                          {columns.length > 1 && (
                            <div style={{ 
                              position: 'absolute', 
                              top: 0, 
                              left: `${(0.5 / columns.length) * 100}%`, 
                              right: `${(0.5 / columns.length) * 100}%`, 
                              height: '2px', 
                              backgroundColor: '#CBD5E1',
                              zIndex: 1
                            }} />
                          )}

                          {/* Columns Container */}
                          <div style={{ display: 'flex', width: '100%', boxSizing: 'border-box' }}>
                            {columns.map((col, colIdx) => (
                              <div 
                                key={colIdx} 
                                style={{ 
                                  width: `${100 / columns.length}%`, 
                                  padding: '0 0.75rem', 
                                  boxSizing: 'border-box', 
                                  display: 'flex', 
                                  flexDirection: 'column', 
                                  alignItems: 'center', 
                                  position: 'relative' 
                                }}
                              >
                                {/* Vertical line to card */}
                                <div style={{ width: '2px', height: '20px', backgroundColor: '#CBD5E1', zIndex: 1 }} />
                                
                                <div style={{ 
                                  backgroundColor: '#ffffff', 
                                  borderRadius: '8px', 
                                  border: '1px solid #E2E8F0', 
                                  borderLeft: `4px solid ${col.color || '#0A1E38'}`, 
                                  padding: '1.25rem 1rem', 
                                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                                  width: '100%',
                                  minHeight: '85px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  zIndex: 2
                                }}>
                                  <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.8rem', color: '#576574', fontWeight: '800' }}>Sub Direktorat</h5>
                                  <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.4' }}>{col.name}</p>
                                </div>

                                {col.sections.map((seksi, seksiIdx) => (
                                  <React.Fragment key={seksiIdx}>
                                    <div style={{ width: '2px', height: '24px', backgroundColor: '#CBD5E1', zIndex: 1 }} />
                                    <div style={{ 
                                      backgroundColor: '#ffffff', 
                                      borderRadius: '6px', 
                                      border: '1px solid #E2E8F0', 
                                      borderLeft: `3px solid ${col.color || '#0A1E38'}`, 
                                      padding: '0.85rem 1rem', 
                                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                                      width: '100%',
                                      minHeight: '52px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      zIndex: 2
                                    }}>
                                      <p style={{ margin: 0, fontSize: '0.72rem', color: '#0A1E38', fontWeight: '700', lineHeight: '1.3' }}>{seksi}</p>
                                    </div>
                                  </React.Fragment>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* SAVE ACTIONS BAR STRUKTUR */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                  <button 
                    type="button"
                    className="btn-cancel" 
                    onClick={handleCancel}
                    disabled={saving}
                    style={{ padding: '0.65rem 1.75rem', fontSize: '0.9rem', fontWeight: '700' }}
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleSaveStruktur}
                    className="btn-save"
                    disabled={saving}
                    style={{ padding: '0.65rem 1.75rem', fontSize: '0.9rem', fontWeight: '700' }}
                  >
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>

              </div>
            )}

            {activeTab === 'pimpinan' && (
              <div style={{ animation: 'fadeIn 0.25s ease-out' }}>
                
                {/* CARD: Pimpinan Utama (Direktur) */}
                <div className="admin-card" style={{ marginBottom: '2rem' }}>
                  <div className="admin-card-header">
                    <h2>Pimpinan Utama (Direktur)</h2>
                  </div>
                  <div className="admin-card-body flex-row-layout">
                    
                    {/* Director Photo */}
                    <div className="image-column" style={{ maxWidth: '160px' }}>
                      <label>Foto</label>
                      <div className="image-uploader-wrapper" style={{ height: '180px', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                        <img 
                          src={getImageUrl(directorImage || '/uploads/pimpinan_0.png')} 
                          alt="Foto Direktur" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <button 
                          type="button"
                          className="upload-overlay-btn"
                          onClick={(e) => e.currentTarget.nextSibling.click()}
                          style={{ position: 'absolute', bottom: '8px', right: '8px', background: '#0B2F61', color: '#fff', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                          <Upload size={16} />
                        </button>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handlePimpinanImageUpload(e.target.files[0], 'director')} 
                          style={{ display: 'none' }}
                        />
                      </div>
                    </div>

                    <div className="inputs-column" style={{ flex: 1 }}>
                      <div className="admin-field">
                        <label>Nama</label>
                        <input 
                          type="text" 
                          value={directorName}
                          onChange={(e) => setDirectorName(e.target.value)}
                          placeholder="Nama lengkap beserta gelar..."
                        />
                      </div>
                      <div className="admin-field" style={{ marginTop: '1rem' }}>
                        <label>Jabatan</label>
                        <input 
                          type="text" 
                          value={directorRole}
                          onChange={(e) => setDirectorRole(e.target.value)}
                          placeholder="Contoh: DIREKTUR SDM DAN PENGEMBANGAN TALENTA"
                        />
                      </div>
                    </div>

                  </div>
                </div>

                {/* CARD: Jajaran Sub-Directorate Columns Editor */}
                <div className="admin-card" style={{ marginBottom: '2rem' }}>
                  <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Jajaran Kasubdit & Kasie</h2>
                    <button 
                      type="button"
                      className="btn-add-pk" 
                      onClick={handleAddNewPimpinanColumn}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <Plus size={16} /> Tambah Sub-Direktorat
                    </button>
                  </div>
                  <div className="admin-card-body">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {pimpinanSubdirectorates.map((sub, colIdx) => {
                        const isOpen = activeSubdirAccordion === colIdx;
                        const title = sub.kasubdit.role || `Sub-Direktorat ${colIdx + 1}`;
                        
                        return (
                          <div 
                            key={sub.id || colIdx} 
                            style={{ 
                              background: '#FFFFFF', 
                              border: '1px solid #E2E8F0', 
                              borderRadius: '12px',
                              overflow: 'hidden',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                            }}
                          >
                            {/* Accordion Header */}
                            <div 
                              onClick={() => setActiveSubdirAccordion(isOpen ? null : colIdx)}
                              style={{ 
                                background: isOpen ? '#F1F5F9' : '#F8FAFC', 
                                padding: '1rem 1.25rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                                borderBottom: isOpen ? '1px solid #E2E8F0' : 'none'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                                {isOpen ? <ChevronUp size={18} style={{ color: '#0B2F61' }} /> : <ChevronDown size={18} style={{ color: '#0B2F61' }} />}
                                <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0B2F61' }}>
                                  {title}
                                </span>
                              </div>
                              
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemovePimpinanColumn(colIdx);
                                }}
                                style={{ 
                                  background: 'none', 
                                  border: 'none', 
                                  color: '#EF4444', 
                                  cursor: 'pointer', 
                                  fontSize: '0.75rem', 
                                  fontWeight: '700', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '0.25rem',
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '6px',
                                  transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <Trash2 size={14} /> Hapus Kolom
                              </button>
                            </div>

                            {/* Accordion Body */}
                            {isOpen && (
                              <div 
                                style={{ 
                                  padding: '1.25rem',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '1.25rem',
                                  background: '#FFFFFF'
                                }}
                              >
                                {/* KASUBDIT CARD */}
                                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '1rem', position: 'relative' }}>
                                  <span style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '0.65rem', fontWeight: '800', background: '#E0ECFB', color: '#0B2F61', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>KASUBDIT</span>
                                  
                                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                    {/* Photo */}
                                    <div style={{ width: '70px', height: '85px', borderRadius: '6px', overflow: 'hidden', position: 'relative', background: '#FFFFFF', border: '1px dashed #CBD5E1', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                                      {sub.kasubdit.image ? (
                                        <img 
                                          src={getImageUrl(sub.kasubdit.image)} 
                                          alt="Foto Kasubdit" 
                                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                      ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                                          <ImageIcon size={20} />
                                          <span style={{ fontSize: '0.65rem', fontWeight: '600' }}>Foto</span>
                                        </div>
                                      )}
                                      <button 
                                        type="button"
                                        onClick={(e) => e.currentTarget.nextSibling.click()}
                                        style={{ position: 'absolute', bottom: '2px', right: '2px', background: 'rgba(15,23,42,0.85)', border: 'none', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                      >
                                        <Upload size={10} />
                                      </button>
                                      <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={(e) => handlePimpinanImageUpload(e.target.files[0], 'kasubdit', colIdx)} 
                                        style={{ display: 'none' }}
                                      />
                                    </div>

                                    {/* Details */}
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                      <div className="admin-field" style={{ margin: 0 }}>
                                        <label style={{ fontSize: '0.7rem', fontWeight: '800' }}>Nama Kasubdit</label>
                                        <input 
                                          type="text" 
                                          value={sub.kasubdit.name} 
                                          onChange={(e) => handleUpdatePimpinanName(colIdx, e.target.value)}
                                          style={{ padding: '0.35rem', fontSize: '0.8rem' }}
                                        />
                                      </div>
                                      <div className="admin-field" style={{ margin: 0 }}>
                                        <label style={{ fontSize: '0.7rem', fontWeight: '800' }}>Jabatan Kasubdit</label>
                                        <input 
                                          type="text" 
                                          value={sub.kasubdit.role} 
                                          onChange={(e) => handleUpdatePimpinanRole(colIdx, e.target.value)}
                                          style={{ padding: '0.35rem', fontSize: '0.8rem' }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* KASIE LIST */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                  <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#475569' }}>Daftar Kepala Seksi (Kasie)</label>
                                  
                                  {(sub.kasie || []).map((ks, kasieIdx) => (
                                    <div key={kasieIdx} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.75rem', position: 'relative' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                        <span style={{ fontSize: '0.65rem', fontWeight: '800', color: '#64748B' }}>KASIE {kasieIdx + 1}</span>
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveKasie(colIdx, kasieIdx)}
                                          style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                          title="Hapus Kasie"
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      </div>

                                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {/* Photo */}
                                        <div style={{ width: '55px', height: '65px', borderRadius: '4px', overflow: 'hidden', position: 'relative', background: '#FFFFFF', border: '1px dashed #CBD5E1', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                                          {ks.image ? (
                                            <img 
                                              src={getImageUrl(ks.image)} 
                                              alt="Foto Kasie" 
                                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                          ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                              <ImageIcon size={16} />
                                              <span style={{ fontSize: '0.55rem', fontWeight: '600' }}>Foto</span>
                                            </div>
                                          )}
                                          <button 
                                            type="button"
                                            onClick={(e) => e.currentTarget.nextSibling.click()}
                                            style={{ position: 'absolute', bottom: '2px', right: '2px', background: 'rgba(15,23,42,0.85)', border: 'none', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                          >
                                            <Upload size={8} />
                                          </button>
                                          <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={(e) => handlePimpinanImageUpload(e.target.files[0], 'kasie', colIdx, kasieIdx)} 
                                            style={{ display: 'none' }}
                                          />
                                        </div>

                                        {/* Details */}
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                          <input 
                                            type="text" 
                                            value={ks.name} 
                                            onChange={(e) => handleUpdatePimpinanName(colIdx, e.target.value, kasieIdx)}
                                            placeholder="Nama Kasie"
                                            style={{ padding: '0.25rem', fontSize: '0.75rem', height: '24px' }}
                                          />
                                          <input 
                                            type="text" 
                                            value={ks.role} 
                                            onChange={(e) => handleUpdatePimpinanRole(colIdx, e.target.value, kasieIdx)}
                                            placeholder="Jabatan Kasie"
                                            style={{ padding: '0.25rem', fontSize: '0.75rem', height: '24px' }}
                                          />
                                        </div>
                                      </div>

                                      {/* STAFF LIST FOR THIS KASIE */}
                                      <div style={{ marginTop: '0.75rem', borderTop: '1px solid #E2E8F0', paddingTop: '0.65rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                          <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#475569' }}>Daftar Staf ({ks.staff ? ks.staff.length : 0})</span>
                                          <button
                                            type="button"
                                            onClick={() => handleAddStaff(colIdx, kasieIdx)}
                                            style={{ background: '#E0ECFB', border: 'none', color: '#0B2F61', borderRadius: '4px', padding: '0.2rem 0.5rem', fontSize: '0.65rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.15rem' }}
                                          >
                                            <Plus size={10} /> Tambah Staf
                                          </button>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                          {(ks.staff || []).map((st, staffIdx) => (
                                            <div key={staffIdx} style={{ display: 'flex', gap: '0.4rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.4rem', position: 'relative' }}>
                                              {/* Staff Photo */}
                                              <div style={{ width: '45px', height: '55px', borderRadius: '4px', overflow: 'hidden', position: 'relative', background: '#FFFFFF', border: '1px dashed #CBD5E1', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                                                {st.image ? (
                                                  <img 
                                                    src={getImageUrl(st.image)} 
                                                    alt="Foto Staf" 
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                  />
                                                ) : (
                                                  <ImageIcon size={14} />
                                                )}
                                                <button 
                                                  type="button"
                                                  onClick={(e) => e.currentTarget.nextSibling.click()}
                                                  style={{ position: 'absolute', bottom: '1px', right: '1px', background: 'rgba(15,23,42,0.85)', border: 'none', color: '#fff', borderRadius: '50%', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                                >
                                                  <Upload size={6} />
                                                </button>
                                                <input 
                                                  type="file" 
                                                  accept="image/*"
                                                  onChange={(e) => handlePimpinanImageUpload(e.target.files[0], 'staff', colIdx, kasieIdx, staffIdx)} 
                                                  style={{ display: 'none' }}
                                                />
                                              </div>

                                              {/* Staff Info Inputs */}
                                              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                                <input 
                                                  type="text" 
                                                  value={st.name} 
                                                  onChange={(e) => handleUpdateStaffName(colIdx, kasieIdx, staffIdx, e.target.value)}
                                                  placeholder="Nama Staf"
                                                  style={{ padding: '0.15rem 0.25rem', fontSize: '0.7rem', height: '20px' }}
                                                />
                                                <input 
                                                  type="text" 
                                                  value={st.role} 
                                                  onChange={(e) => handleUpdateStaffRole(colIdx, kasieIdx, staffIdx, e.target.value)}
                                                  placeholder="Jabatan Staf"
                                                  style={{ padding: '0.15rem 0.25rem', fontSize: '0.7rem', height: '20px' }}
                                                />
                                              </div>

                                              {/* Remove Staff Button */}
                                              <button
                                                type="button"
                                                onClick={() => handleRemoveStaff(colIdx, kasieIdx, staffIdx)}
                                                onMouseEnter={(e) => {
                                                  e.currentTarget.style.backgroundColor = '#EF4444';
                                                  e.currentTarget.style.color = '#FFFFFF';
                                                }}
                                                onMouseLeave={(e) => {
                                                  e.currentTarget.style.backgroundColor = '#FEE2E2';
                                                  e.currentTarget.style.color = '#EF4444';
                                                }}
                                                style={{ 
                                                  position: 'absolute', 
                                                  top: '4px', 
                                                  right: '4px', 
                                                  width: '18px', 
                                                  height: '18px', 
                                                  borderRadius: '50%', 
                                                  backgroundColor: '#FEE2E2', 
                                                  color: '#EF4444', 
                                                  border: 'none', 
                                                  display: 'flex', 
                                                  alignItems: 'center', 
                                                  justifyContent: 'center', 
                                                  cursor: 'pointer', 
                                                  transition: 'all 0.15s ease',
                                                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                                }}
                                                title="Hapus Staf"
                                              >
                                                <X size={11} />
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  ))}

                                  <button
                                    type="button"
                                    onClick={() => handleAddKasie(colIdx)}
                                    style={{ 
                                      background: '#FFFFFF', 
                                      border: '1px dashed #CBD5E1', 
                                      padding: '0.5rem', 
                                      borderRadius: '8px', 
                                      cursor: 'pointer', 
                                      fontSize: '0.75rem', 
                                      fontWeight: '700', 
                                      color: '#0B2F61',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '0.25rem'
                                    }}
                                  >
                                    <Plus size={14} /> Tambah Jabatan Kasie
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* CARD: Realtime Preview */}
                <div className="admin-card" style={{ marginBottom: '2rem' }}>
                  <div className="admin-card-header">
                    <h2>Pratinjau</h2>
                  </div>
                  <div className="admin-card-body" style={{ background: '#F8FAFC', padding: '2rem 1rem', overflowX: 'auto' }}>
                    <div style={{ minWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      
                      {/* Top Level: Director */}
                      <div className="pimpinan-node-card director-card" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderLeft: '5px solid #FFC72C',
                        borderRadius: '12px',
                        padding: '1.25rem 2rem',
                        maxWidth: '450px',
                        width: '100%',
                        zIndex: 2,
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}>
                        <div style={{ width: '60px', height: '70px', borderRadius: '8px', overflow: 'hidden', background: '#F1F5F9', border: '1px solid #E2E8F0', flexShrink: 0 }}>
                          <img src={getImageUrl(directorImage || '')} alt="Director" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                          <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0A1E38', fontWeight: '800', lineHeight: '1.3' }}>{directorName || 'Nama Direktur'}</h4>
                          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{directorRole || 'DIREKTUR'}</p>
                        </div>
                      </div>

                      {/* Vertical line directly between Direktur and Columns */}
                      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <div style={{ width: '2px', height: '28px', backgroundColor: '#CBD5E1', zIndex: 1 }} />
                      </div>

                      {/* Sub-Directorate Columns Connected by tree structure */}
                      {pimpinanSubdirectorates.length > 0 && (
                        <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          
                          {/* Horizontal line */}
                          {pimpinanSubdirectorates.length > 1 && (
                            <div style={{ 
                              position: 'absolute', 
                              top: 0, 
                              left: `${(0.5 / pimpinanSubdirectorates.length) * 100}%`, 
                              right: `${(0.5 / pimpinanSubdirectorates.length) * 100}%`, 
                              height: '2px', 
                              backgroundColor: '#CBD5E1',
                              zIndex: 1
                            }} />
                          )}

                          {/* Columns Container */}
                          <div style={{ display: 'flex', width: '100%', boxSizing: 'border-box', alignItems: 'stretch' }}>
                            {pimpinanSubdirectorates.map((sub, colIdx) => (
                              <div 
                                key={sub.id || colIdx} 
                                style={{ 
                                  width: `${100 / pimpinanSubdirectorates.length}%`, 
                                  padding: '0 0.75rem', 
                                  boxSizing: 'border-box', 
                                  display: 'flex', 
                                  flexDirection: 'column', 
                                  alignItems: 'center', 
                                  position: 'relative' 
                                }}
                              >
                                {/* Vertical line to Kasubdit card */}
                                <div style={{ width: '2px', height: '14px', backgroundColor: '#CBD5E1', zIndex: 1, flexShrink: 0 }} />
                                
                                {/* Kasubdit Card */}
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.75rem',
                                  background: '#FFFFFF',
                                  border: '1px solid #E2E8F0',
                                  borderLeft: '4px solid #0B2F61',
                                  borderRadius: '8px',
                                  padding: '0.75rem 1rem',
                                  width: '100%',
                                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                }}>
                                  <div style={{ width: '45px', height: '55px', borderRadius: '4px', overflow: 'hidden', background: '#F1F5F9', border: '1px solid #E2E8F0', flexShrink: 0 }}>
                                    <img src={getImageUrl(sub.kasubdit.image || '')} alt="Kasubdit" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  </div>
                                  <div style={{ textAlign: 'left' }}>
                                    <h4 style={{ margin: 0, fontSize: '0.8rem', color: '#0A1E38', fontWeight: '800', lineHeight: '1.2' }}>{sub.kasubdit.name || 'Nama Kasubdit'}</h4>
                                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.65rem', color: '#64748B', fontWeight: '700', lineHeight: '1.2' }}>{sub.kasubdit.role || 'KASUBDIT'}</p>
                                  </div>
                                </div>

                                {/* Kasie list connected vertically under each Kasubdit */}
                                {(sub.kasie || []).map((ks, index) => (
                                  <React.Fragment key={index}>
                                    <div style={{ width: '2px', height: '16px', backgroundColor: '#CBD5E1', zIndex: 1, flexShrink: 0 }} />
                                    <div style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.75rem',
                                      background: '#FFFFFF',
                                      border: '1px solid #E2E8F0',
                                      borderLeft: '4px solid #64748B',
                                      borderRadius: '8px',
                                      padding: '0.75rem 1rem',
                                      width: '100%',
                                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                    }}>
                                      <div style={{ width: '45px', height: '55px', borderRadius: '4px', overflow: 'hidden', background: '#F1F5F9', border: '1px solid #E2E8F0', flexShrink: 0 }}>
                                        <img src={getImageUrl(ks.image || '')} alt="Kasie" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                      </div>
                                      <div style={{ textAlign: 'left' }}>
                                        <h4 style={{ margin: 0, fontSize: '0.8rem', color: '#0A1E38', fontWeight: '800', lineHeight: '1.2' }}>{ks.name || 'Nama Kasie'}</h4>
                                        <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.65rem', color: '#64748B', fontWeight: '700', lineHeight: '1.2' }}>{ks.role || 'KASIE'}</p>
                                      </div>
                                    </div>
                                  </React.Fragment>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* SAVE ACTIONS BAR PIMPINAN */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                  <button 
                    type="button"
                    className="btn-cancel" 
                    onClick={handleCancel}
                    disabled={saving}
                    style={{ padding: '0.65rem 1.75rem', fontSize: '0.9rem', fontWeight: '700' }}
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleSavePimpinan}
                    className="btn-save"
                    disabled={saving}
                    style={{ padding: '0.65rem 1.75rem', fontSize: '0.9rem', fontWeight: '700' }}
                  >
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>

              </div>
            )}

          </div>
        </main>
      </div>

      {/* Program Kerja Modal Dialog */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingIndex >= 0 ? 'Edit Program Kerja' : 'Tambah Program Kerja'}</h2>
              <button className="close-modal-btn" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="admin-field">
                <label>Judul Program</label>
                <input 
                  type="text" 
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Contoh: Pengembangan Kapasitas"
                />
              </div>

              <div className="admin-field">
                <label>Pilih Icon</label>
                <div className="icon-grid-picker">
                  {Object.keys(IconComponents).map((iconName) => {
                    const IconComp = IconComponents[iconName];
                    const isSelected = editIcon === iconName;
                    return (
                      <button
                        key={iconName}
                        type="button"
                        className={`icon-picker-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => setEditIcon(iconName)}
                        title={iconName}
                      >
                        <IconComp size={20} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="admin-field">
                <label>Deskripsi Singkat</label>
                <textarea 
                  rows={3} 
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Tulis penjelasan singkat program kerja..."
                />
              </div>
            </div>

            <div className="modal-footer">
              {editingIndex >= 0 && (
                <button 
                  className="btn-delete-modal"
                  onClick={async () => {
                    const item = programs[editingIndex];
                    if (!item.id) return;
                    if (confirm('Apakah Anda yakin ingin menghapus program kerja ini?')) {
                      try {
                        const res = await fetch(`${BACKEND_URL}/api/admin/program-kerja/${item.id}`, {
                          method: 'DELETE',
                          headers: {
                            'Authorization': `Bearer ${getToken()}`
                          }
                        });
                        if (!res.ok) throw new Error('Gagal menghapus program kerja');
                        showToast('success', 'Program kerja berhasil dihapus!');
                        loadPrograms();
                        setShowModal(false);
                      } catch (err) {
                        showToast('error', err.message);
                      }
                    }
                  }}
                >
                  Hapus Program
                </button>
              )}
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Batal</button>
              <button className="btn-save" onClick={handleSaveProgram}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* STYLING BLOCK */}
      <style dangerouslySetInnerHTML={{ __html: `
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #F4F6F9;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        .admin-content-wrapper {
          flex: 1;
          min-width: 0;
          overflow-y: auto;
          position: relative;
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
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
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

        /* Page Layout & Container */
        .admin-main {
          padding: 2rem 0 4rem;
        }
        .admin-container {
          max-width: 1360px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* Page Header */
        .admin-page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .header-text h1 {
          font-size: 1.6rem;
          font-weight: 700;
          color: #1E293B;
          margin: 0 0 0.25rem;
        }
        .header-text p {
          font-size: 0.88rem;
          color: #64748B;
          margin: 0;
        }

        /* Buttons */
        .header-actions {
          display: flex;
          gap: 0.75rem;
        }
        .btn-cancel {
          background: #001f3f;
          color: #FFFFFF;
          border: none;
          padding: 0.6rem 1.5rem;
          border-radius: 6px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-cancel:hover {
          background: #001326;
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
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Card styles */
        .admin-card {
          background: #FFFFFF;
          border-radius: 12px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03);
          margin-bottom: 1.5rem;
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
        .admin-card-header.flex-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .btn-add-pk {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: #E0ECFB;
          color: #0A1E38;
          border: none;
          padding: 0.4rem 0.85rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-add-pk:hover {
          background: #CBE0F9;
        }

        .admin-card-body {
          padding: 1.5rem;
        }

        /* Flex Layout Inside Cards */
        .flex-row-layout {
          display: flex;
          gap: 2rem;
        }
        .inputs-column {
          flex: 1.2;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
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

        /* Fields */
        .admin-field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .admin-field.full-height {
          height: 100%;
        }
        .admin-field label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #475569;
        }
        .admin-field input[type="text"],
        .admin-field textarea,
        .admin-field select {
          padding: 0.65rem 0.85rem;
          border: 1px solid #CBD5E1;
          border-radius: 6px;
          font-size: 0.88rem;
          color: #334155;
          outline: none;
          background: #FFFFFF;
          font-family: inherit;
          transition: border-color 0.2s;
        }
        .admin-field input[type="text"]:focus,
        .admin-field textarea:focus,
        .admin-field select:focus {
          border-color: #0A1E38;
        }
        .admin-field textarea {
          resize: vertical;
          line-height: 1.6;
        }
        .subtitle-textarea {
          background: #F8FAFC !important;
          border: 1px solid #E2E8F0 !important;
          font-weight: 400;
          color: #475569;
        }

        /* Image Uploader wrapper */
        .image-uploader-wrapper {
          width: 100%;
          aspect-ratio: 16/7;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          position: relative;
          overflow: hidden;
        }
        .content-img-uploader {
          aspect-ratio: 16/10;
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
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          transition: background 0.2s;
        }
        .upload-overlay-btn:hover {
          background: #FFFFFF;
        }
        .image-hint-text {
          font-size: 0.72rem;
          color: #94A3B8;
          margin-top: 0.5rem;
        }

        /* Program Kerja Cards Editor Grid */
        .programs-editor-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-top: 1.5rem;
        }
        .program-editor-card {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 1.25rem 1rem;
          display: flex;
          flex-direction: column;
          position: relative;
          cursor: pointer;
          transition: all 0.2s;
          box-sizing: border-box;
          min-height: 160px;
        }
        .program-editor-card:hover {
          border-color: #0A1E38;
          background: #FFFFFF;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
        }
        .card-actions-row {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          display: flex;
          z-index: 10;
        }
        .delete-pk-btn {
          background: #FEF2F2;
          color: #EF4444;
          border: 1px solid #FEE2E2;
          padding: 0.35rem;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .delete-pk-btn:hover {
          background: #EF4444;
          color: #FFFFFF;
          border-color: #EF4444;
        }
        .program-card-icon {
          width: 38px;
          height: 38px;
          background: #EBF3FC;
          color: #0A1E38;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.75rem;
          border: 1px solid #CBE0F9;
        }
        .program-card-info h3 {
          font-size: 0.85rem;
          font-weight: 700;
          color: #0A1E38;
          margin: 0 0 0.35rem;
          line-height: 1.3;
        }
        .program-card-info p {
          font-size: 0.75rem;
          color: #64748B;
          margin: 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Modal styling */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease-out;
        }
        .modal-content {
          background: #FFFFFF;
          border-radius: 12px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          animation: slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .modal-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #F1F5F9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-header h2 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1E293B;
          margin: 0;
        }
        .close-modal-btn {
          background: none;
          border: none;
          color: #64748B;
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        .close-modal-btn:hover {
          color: #1E293B;
        }
        .modal-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .icon-grid-picker {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 0.5rem;
          background: #F8FAFC;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          padding: 0.75rem;
          max-height: 160px;
          overflow-y: auto;
        }
        .icon-picker-btn {
          aspect-ratio: 1;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #475569;
          transition: all 0.15s;
          padding: 0.5rem;
        }
        .icon-picker-btn:hover {
          background: #F1F5F9;
          color: #0B2F61;
          border-color: #CBD5E1;
        }
        .icon-picker-btn.selected {
          background: #FFC72C;
          color: #001f3f;
          border-color: #FFC72C;
          box-shadow: 0 0 0 2px rgba(255, 199, 44, 0.2);
        }
        .modal-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid #F1F5F9;
          background: #F8FAFC;
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          align-items: center;
        }
        .btn-delete-modal {
          margin-right: auto;
          background: #FEF2F2;
          color: #EF4444;
          border: 1px solid #FEE2E2;
          padding: 0.6rem 1.25rem;
          border-radius: 6px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-delete-modal:hover {
          background: #EF4444;
          color: #FFFFFF;
          border-color: #EF4444;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @media (max-width: 1024px) {
          .programs-editor-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .admin-layout {
            flex-direction: column;
          }
          .admin-sidebar {
            width: 100%;
            height: auto;
            position: static;
          }
          .flex-row-layout {
            flex-direction: column;
          }
          .programs-editor-grid {
            grid-template-columns: 1fr;
          }
          .admin-container {
            padding: 0 1rem;
          }
        }
       `}} />
    </div>
  );
}
