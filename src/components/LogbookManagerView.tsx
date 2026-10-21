import React, { useState, useMemo, useRef } from 'react';
import { AttendanceStatus, DailyLogbookEntry, PeriodType } from '../types';
import { ATTENDANCE_OPTIONS } from '../data/defaultLogbookEntries';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Trash2,
  Edit3,
  Camera,
  Search,
  Filter,
  CheckCircle2,
  FileText,
  Upload,
  ArrowRight,
  Check,
  X,
  UserCheck,
  HeartPulse,
  Palmtree,
  Building,
  Eye,
} from 'lucide-react';

interface LogbookManagerViewProps {
  entries: DailyLogbookEntry[];
  onAddEntry: (entry: DailyLogbookEntry) => void;
  onUpdateEntry: (entry: DailyLogbookEntry) => void;
  onDeleteEntry: (id: string) => void;
  onNavigateToReport: () => void;
  selectedMonth: number;
  selectedQuarter: number;
  selectedYear: number;
}

export const LogbookManagerView: React.FC<LogbookManagerViewProps> = ({
  entries,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  onNavigateToReport,
  selectedMonth,
  selectedQuarter,
  selectedYear,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states - Kehadiran (WFO, Sakit, Cuti) placed at the very top
  const [kehadiran, setKehadiran] = useState<AttendanceStatus>('WFO');
  const [tanggal, setTanggal] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [jamMulai, setJamMulai] = useState('07:30');
  const [jamSelesai, setJamSelesai] = useState('11:30');
  const [lokasiBlok, setLokasiBlok] = useState('Blok C7 Manoko');
  const [uraianPekerjaan, setUraianPekerjaan] = useState('');
  const [luasLokasi, setLuasLokasi] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [fotoSebelumUrl, setFotoSebelumUrl] = useState('');
  const [fotoSesudahUrl, setFotoSesudahUrl] = useState('');
  const [fotoSuratSakitUrl, setFotoSuratSakitUrl] = useState('');
  const [fotoTitle, setFotoTitle] = useState('');
  const [showInReport, setShowInReport] = useState(true);

  // Lightbox preview modal
  const [previewModalImg, setPreviewModalImg] = useState<{ url: string; title: string } | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKehadiranFilter, setSelectedKehadiranFilter] = useState<string>('ALL');
  const [periodFilter, setPeriodFilter] = useState<'ALL' | 'CURRENT_MONTH' | 'CURRENT_QUARTER'>('ALL');

  const fileInputSebelumRef = useRef<HTMLInputElement>(null);
  const fileInputSesudahRef = useRef<HTMLInputElement>(null);
  const fileInputSuratSakitRef = useRef<HTMLInputElement>(null);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return entries.filter((item) => {
      // Kehadiran filter
      if (selectedKehadiranFilter !== 'ALL' && item.kehadiran !== selectedKehadiranFilter) {
        return false;
      }

      // Period filter
      if (periodFilter === 'CURRENT_MONTH') {
        const itemDate = new Date(item.tanggal);
        if (itemDate.getMonth() + 1 !== selectedMonth || itemDate.getFullYear() !== selectedYear) {
          return false;
        }
      } else if (periodFilter === 'CURRENT_QUARTER') {
        const itemDate = new Date(item.tanggal);
        const itemQuarter = Math.floor(itemDate.getMonth() / 3) + 1;
        if (itemQuarter !== selectedQuarter || itemDate.getFullYear() !== selectedYear) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchUraian = item.uraianPekerjaan.toLowerCase().includes(q);
        const matchKehadiran = item.kehadiran.toLowerCase().includes(q);
        const matchLokasi = (item.lokasiBlok || '').toLowerCase().includes(q);
        const matchLuas = (item.luasLokasi || '').toLowerCase().includes(q);
        return matchUraian || matchKehadiran || matchLokasi || matchLuas;
      }

      return true;
    });
  }, [entries, selectedKehadiranFilter, periodFilter, searchQuery, selectedMonth, selectedQuarter, selectedYear]);

  // Sort by date descending
  const sortedEntries = useMemo(() => {
    return [...filteredEntries].sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  }, [filteredEntries]);

  // Handle Photo File Uploads
  const handleUploadSebelum = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoSebelumUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSesudah = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoSesudahUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSuratSakit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoSuratSakitUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = (entry: DailyLogbookEntry) => {
    setEditingId(entry.id);
    setKehadiran(entry.kehadiran || 'WFO');
    setTanggal(entry.tanggal);
    setJamMulai(entry.jamMulai || '07:30');
    setJamSelesai(entry.jamSelesai || '11:30');
    setLokasiBlok(entry.lokasiBlok || '');
    setUraianPekerjaan(entry.uraianPekerjaan);
    setLuasLokasi(entry.luasLokasi || '');
    setKeterangan(entry.keterangan || '');
    setFotoSebelumUrl(entry.fotoSebelumUrl || '');
    setFotoSesudahUrl(entry.fotoSesudahUrl || entry.fotoUrl || '');
    setFotoSuratSakitUrl(entry.fotoSuratSakitUrl || '');
    setFotoTitle(entry.fotoTitle || '');
    setShowInReport(entry.showInReport ?? true);
    setShowAddForm(true);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setKehadiran('WFO');
    setTanggal(new Date().toISOString().split('T')[0]);
    setJamMulai('07:30');
    setJamSelesai('11:30');
    setLokasiBlok('Blok C7 Manoko');
    setUraianPekerjaan('');
    setLuasLokasi('');
    setKeterangan('');
    setFotoSebelumUrl('');
    setFotoSesudahUrl('');
    setFotoSuratSakitUrl('');
    setFotoTitle('');
    setShowInReport(true);
    setShowAddForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uraianPekerjaan.trim()) return;

    const primaryPhoto =
      kehadiran === 'Sakit'
        ? fotoSuratSakitUrl.trim() || undefined
        : fotoSesudahUrl.trim() || fotoSebelumUrl.trim() || undefined;

    if (editingId) {
      const updated: DailyLogbookEntry = {
        id: editingId,
        kehadiran,
        tanggal,
        jamMulai: kehadiran === 'WFO' ? jamMulai : undefined,
        jamSelesai: kehadiran === 'WFO' ? jamSelesai : undefined,
        lokasiBlok: kehadiran === 'WFO' ? lokasiBlok : '-',
        uraianPekerjaan: uraianPekerjaan.trim(),
        luasLokasi: kehadiran === 'WFO' ? luasLokasi.trim() : '-',
        keterangan: keterangan.trim(),
        fotoUrl: primaryPhoto,
        fotoSebelumUrl: kehadiran === 'WFO' ? (fotoSebelumUrl.trim() || undefined) : undefined,
        fotoSesudahUrl: kehadiran === 'WFO' ? (fotoSesudahUrl.trim() || undefined) : undefined,
        fotoSuratSakitUrl: kehadiran === 'Sakit' ? (fotoSuratSakitUrl.trim() || undefined) : undefined,
        fotoTitle: fotoTitle.trim() || undefined,
        showInReport,
      };
      onUpdateEntry(updated);
    } else {
      const newEntry: DailyLogbookEntry = {
        id: `entry-${Date.now()}`,
        kehadiran,
        tanggal,
        jamMulai: kehadiran === 'WFO' ? jamMulai : undefined,
        jamSelesai: kehadiran === 'WFO' ? jamSelesai : undefined,
        lokasiBlok: kehadiran === 'WFO' ? lokasiBlok : '-',
        uraianPekerjaan: uraianPekerjaan.trim(),
        luasLokasi: kehadiran === 'WFO' ? luasLokasi.trim() : '-',
        keterangan: keterangan.trim(),
        fotoUrl: primaryPhoto,
        fotoSebelumUrl: kehadiran === 'WFO' ? (fotoSebelumUrl.trim() || undefined) : undefined,
        fotoSesudahUrl: kehadiran === 'WFO' ? (fotoSesudahUrl.trim() || undefined) : undefined,
        fotoSuratSakitUrl: kehadiran === 'Sakit' ? (fotoSuratSakitUrl.trim() || undefined) : undefined,
        fotoTitle: fotoTitle.trim() || undefined,
        showInReport,
      };
      onAddEntry(newEntry);
    }

    resetForm();
  };

  const formatDisplayDate = (dStr: string) => {
    try {
      const parts = dStr.split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return d.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      }
      return dStr;
    } catch {
      return dStr;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner & Quick Metrics */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-400/30">
            <Calendar className="w-3.5 h-3.5" />
            <span>Sistem Pencatatan Logbook Kinerja</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Input & Catatan Logbook Harian
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl leading-relaxed">
            Catat kehadiran (WFO, Sakit, Cuti) dan pelaksanaan tugas harian di Kebun PVT I Manoko.
            Seluruh data akan <strong>otomatis terangkum ke dalam Laporan Kinerja A4</strong> (Bulanan, Triwulan, Tahunan).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              if (showAddForm && !editingId) {
                setShowAddForm(false);
              } else {
                resetForm();
                setShowAddForm(true);
              }
            }}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2 active:scale-98 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Tutup Form' : 'Isi Logbook Baru'}</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToReport}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs sm:text-sm border border-white/20 transition-all flex items-center space-x-2 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-emerald-300" />
            <span>Buka Laporan A4 Terkompilasi</span>
            <ArrowRight className="w-4 h-4 text-emerald-300" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-medium text-slate-500">Total Logbook Tercatat</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{entries.length}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Catatan harian</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-medium text-slate-500">Hadir Kerja (WFO)</p>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">
            {entries.filter((e) => (e.kehadiran || 'WFO') === 'WFO').length}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">Hari efektif di kebun</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-medium text-slate-500">Sakit & Cuti</p>
          <p className="text-2xl font-extrabold text-amber-700 mt-1">
            {entries.filter((e) => e.kehadiran === 'Sakit' || e.kehadiran === 'Cuti').length}
          </p>
          <span className="text-[11px] text-amber-600 font-medium">Hari izin/istirahat</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-medium text-slate-500">Foto Sebelum & Sesudah</p>
          <p className="text-2xl font-extrabold text-teal-700 mt-1">
            {entries.filter((e) => Boolean(e.fotoSebelumUrl && e.fotoSesudahUrl)).length}
          </p>
          <span className="text-[11px] text-teal-600 font-medium">Dokumentasi komparasi</span>
        </div>
      </div>

      {/* Expandable Input Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl border-2 border-emerald-500/80 shadow-xl overflow-hidden animate-in fade-in duration-200">
          <div className="bg-emerald-50/80 px-6 py-4 border-b border-emerald-200/80 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-emerald-600 text-white rounded-lg shadow-xs">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingId ? 'Edit Catatan Logbook' : 'Form Input Logbook Kinerja Harian'}
                </h3>
                <p className="text-xs text-slate-600">
                  Pilih kehadiran (WFO, Sakit, Cuti), tanggal kegiatan, dan rincian pekerjaan
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* ================= Paling Atas: KEHADIRAN (WFO, Sakit, Cuti) ================= */}
            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-2">
              <label className="block font-bold text-slate-800 text-xs">
                Kehadiran <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* WFO */}
                <button
                  type="button"
                  onClick={() => {
                    setKehadiran('WFO');
                    if (uraianPekerjaan.includes('Sakit') || uraianPekerjaan.includes('Cuti')) {
                      setUraianPekerjaan('');
                    }
                  }}
                  className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                    kehadiran === 'WFO'
                      ? 'bg-emerald-600 border-emerald-700 text-white shadow-sm ring-2 ring-emerald-300'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>WFO (Hadir di Kantor / Kebun)</span>
                </button>

                {/* Sakit */}
                <button
                  type="button"
                  onClick={() => {
                    setKehadiran('Sakit');
                    if (!uraianPekerjaan) setUraianPekerjaan('Sakit (Istirahat dokter)');
                  }}
                  className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                    kehadiran === 'Sakit'
                      ? 'bg-amber-600 border-amber-700 text-white shadow-sm ring-2 ring-amber-300'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <HeartPulse className="w-4 h-4" />
                  <span>Sakit</span>
                </button>

                {/* Cuti */}
                <button
                  type="button"
                  onClick={() => {
                    setKehadiran('Cuti');
                    if (!uraianPekerjaan) setUraianPekerjaan('Cuti Tahunan / Alasan Penting');
                  }}
                  className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                    kehadiran === 'Cuti'
                      ? 'bg-blue-600 border-blue-700 text-white shadow-sm ring-2 ring-blue-300'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Palmtree className="w-4 h-4" />
                  <span>Cuti</span>
                </button>
              </div>
            </div>

            {/* Tanggal Kegiatan & Waktu (Tepat di bawah Kehadiran) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tanggal Kegiatan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-emerald-600 font-medium bg-white"
                  required
                />
              </div>

              {kehadiran === 'WFO' ? (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Jam Mulai
                    </label>
                    <input
                      type="time"
                      value={jamMulai}
                      onChange={(e) => setJamMulai(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-emerald-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Jam Selesai
                    </label>
                    <input
                      type="time"
                      value={jamSelesai}
                      onChange={(e) => setJamSelesai(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-emerald-600 bg-white"
                    />
                  </div>
                </>
              ) : (
                <div className="col-span-2 flex items-center bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs italic">
                  Status {kehadiran}: Jam operasional lapangan tidak berlaku.
                </div>
              )}
            </div>

            {/* Lokasi Blok Kebun (Hanya WFO) */}
            {kehadiran === 'WFO' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Lokasi / Blok Kebun
                </label>
                <input
                  type="text"
                  placeholder="Misal: Blok C7 (sekitar screen house), Blok C4, Blok C1, Aula"
                  value={lokasiBlok}
                  onChange={(e) => setLokasiBlok(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-emerald-600 bg-white"
                />
              </div>
            )}

            {/* Uraian Pekerjaan / Keterangan Sakit / Cuti */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {kehadiran === 'WFO'
                  ? 'Rincian Uraian Pekerjaan'
                  : kehadiran === 'Sakit'
                  ? 'Keterangan Sakit'
                  : 'Keterangan Cuti'}{' '}
                <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder={
                  kehadiran === 'WFO'
                    ? 'Jelaskan secara detail pekerjaan operasional yang dilaksanakan...'
                    : kehadiran === 'Sakit'
                    ? 'Tuliskan keterangan sakit atau istirahat dokter (misal: Sakit flu dan demam, istirahat dokter 1 hari)...'
                    : 'Tuliskan jenis atau keperluan cuti (misal: Cuti tahunan, keperluan keluarga)...'
                }
                value={uraianPekerjaan}
                onChange={(e) => setUraianPekerjaan(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-emerald-600 text-xs leading-relaxed bg-white"
                required
              />
            </div>

            {/* Luas Lokasi (m²) & Catatan Kondisi (Hanya jika WFO) */}
            {kehadiran === 'WFO' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Luas Lokasi Pekerjaan (m²)
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: 500 m² atau kosongi / isi (-)"
                    value={luasLokasi}
                    onChange={(e) => setLuasLokasi(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-emerald-600 bg-white"
                  />
                  <p className="text-[10.5px] text-slate-500 mt-1">
                    Apabila lokasi tidak diketahui atau bukan pekerjaan lahan, kolom bisa dikosongkan atau diisi simbol (-).
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Keterangan Tambahan / Catatan Kondisi
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: Kondisi tanah gembur, cuaca cerah"
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-emerald-600 bg-white"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {kehadiran === 'Sakit' ? 'Catatan Tambahan Sakit (Opsional)' : 'Keterangan Izin Cuti (Opsional)'}
                </label>
                <input
                  type="text"
                  placeholder={
                    kehadiran === 'Sakit'
                      ? 'Misal: Istirahat dokter 1 hari, kontrol ke fasilitas kesehatan / klinik'
                      : 'Misal: Keperluan keluarga mendesak / cuti tahunan'
                  }
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-emerald-600 bg-white"
                />
              </div>
            )}

            {/* Bukti Foto Surat Keterangan Sakit (Hanya jika Sakit) */}
            {kehadiran === 'Sakit' && (
              <div className="p-4 bg-amber-50/80 rounded-xl border-2 border-amber-300 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 pb-2.5">
                  <span className="font-bold text-amber-950 flex items-center space-x-2 text-sm">
                    <HeartPulse className="w-4 h-4 text-amber-600" />
                    <span>Foto Surat Keterangan Sakit (Dokter / Klinik)</span>
                  </span>
                  <label className="flex items-center space-x-2 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={showInReport}
                      onChange={(e) => setShowInReport(e.target.checked)}
                      className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                    />
                    <span className="text-[11px] font-semibold text-amber-900">
                      Lampirkan ke Laporan Kinerja A4 (Tabel 2)
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  <div className="space-y-2.5">
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Lampirkan foto lembar surat dokter / surat keterangan medis sebagai bukti sah izin sakit.
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputSuratSakitRef.current?.click()}
                        className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold flex items-center space-x-1.5 cursor-pointer text-xs shadow-xs transition-all active:scale-98"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Foto Surat Sakit</span>
                      </button>
                      <input
                        ref={fileInputSuratSakitRef}
                        type="file"
                        accept="image/*"
                        onChange={handleUploadSuratSakit}
                        className="hidden"
                      />

                      {fotoSuratSakitUrl && (
                        <button
                          type="button"
                          onClick={() => setFotoSuratSakitUrl('')}
                          className="px-2.5 py-2 bg-white hover:bg-rose-50 text-rose-700 rounded-lg font-semibold border border-rose-300 text-xs cursor-pointer"
                        >
                          Hapus Foto
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-amber-900 mb-1">
                        Atau Masukkan Tautan / URL Foto Surat Sakit:
                      </label>
                      <input
                        type="url"
                        placeholder="https://... (tautan foto surat dokter)"
                        value={fotoSuratSakitUrl}
                        onChange={(e) => setFotoSuratSakitUrl(e.target.value)}
                        className="w-full border border-amber-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-amber-600 bg-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    {fotoSuratSakitUrl ? (
                      <div className="relative aspect-[4/3] max-h-44 rounded-xl overflow-hidden border-2 border-amber-400 shadow-sm bg-white group">
                        <img
                          src={fotoSuratSakitUrl}
                          alt="Foto Surat Keterangan Sakit"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 bg-amber-900/90 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wide">
                          Surat Sakit Terunggah
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewModalImg({
                              url: fotoSuratSakitUrl,
                              title: `Surat Keterangan Sakit (${formatDisplayDate(tanggal)})`,
                            })
                          }
                          className="absolute bottom-2 right-2 bg-black/70 hover:bg-black/90 text-white text-[10.5px] font-semibold px-2.5 py-1 rounded-md flex items-center space-x-1 cursor-pointer transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Perbesar</span>
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputSuratSakitRef.current?.click()}
                        className="border-2 border-dashed border-amber-300 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-amber-100/60 transition-colors h-36 bg-amber-50/40"
                      >
                        <Camera className="w-7 h-7 text-amber-600 mb-1.5" />
                        <span className="text-xs font-bold text-amber-900">
                          Klik untuk Upload Foto Surat Sakit
                        </span>
                        <span className="text-[10.5px] text-amber-700/80 mt-0.5">
                          Format JPG, PNG, atau foto langsung dari kamera
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Foto Sebelum & Sesudah Kegiatan (Hanya jika WFO) */}
            {kehadiran === 'WFO' && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-800 flex items-center space-x-2 text-sm">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span>Foto Sebelum dan Sesudah Kegiatan (0% & 100%)</span>
                  </span>
                  <label className="flex items-center space-x-2 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={showInReport}
                      onChange={(e) => setShowInReport(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span className="text-[11px] font-semibold text-emerald-900">
                      Otomatis Masuk ke Tabel 2 Laporan A4
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Foto Sebelum */}
                  <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900 text-xs flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span>Foto SEBELUM Kegiatan (0%)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => fileInputSebelumRef.current?.click()}
                        className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 rounded-md font-semibold border border-amber-300 flex items-center space-x-1 cursor-pointer text-[11px]"
                      >
                        <Upload className="w-3 h-3 text-amber-700" />
                        <span>Upload Sebelum</span>
                      </button>
                      <input
                        ref={fileInputSebelumRef}
                        type="file"
                        accept="image/*"
                        onChange={handleUploadSebelum}
                        className="hidden"
                      />
                    </div>

                    <input
                      type="url"
                      placeholder="Atau tempel URL foto sebelum kegiatan..."
                      value={fotoSebelumUrl}
                      onChange={(e) => setFotoSebelumUrl(e.target.value)}
                      className="w-full border border-amber-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-amber-600 bg-white text-xs"
                    />

                    {fotoSebelumUrl && (
                      <div className="relative aspect-[4/3] max-h-36 rounded-lg overflow-hidden border border-amber-300 shadow-2xs">
                        <img src={fotoSebelumUrl} alt="Sebelum" className="w-full h-full object-cover" />
                        <span className="absolute top-1 left-1 bg-amber-800 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xs">
                          SEBELUM (0%)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Foto Sesudah */}
                  <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-900 text-xs flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Foto SESUDAH Kegiatan (100%)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => fileInputSesudahRef.current?.click()}
                        className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-900 rounded-md font-semibold border border-emerald-300 flex items-center space-x-1 cursor-pointer text-[11px]"
                      >
                        <Upload className="w-3 h-3 text-emerald-700" />
                        <span>Upload Sesudah</span>
                      </button>
                      <input
                        ref={fileInputSesudahRef}
                        type="file"
                        accept="image/*"
                        onChange={handleUploadSesudah}
                        className="hidden"
                      />
                    </div>

                    <input
                      type="url"
                      placeholder="Atau tempel URL foto sesudah kegiatan..."
                      value={fotoSesudahUrl}
                      onChange={(e) => setFotoSesudahUrl(e.target.value)}
                      className="w-full border border-emerald-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-emerald-600 bg-white text-xs"
                    />

                    {fotoSesudahUrl && (
                      <div className="relative aspect-[4/3] max-h-36 rounded-lg overflow-hidden border border-emerald-300 shadow-2xs">
                        <img src={fotoSesudahUrl} alt="Sesudah" className="w-full h-full object-cover" />
                        <span className="absolute top-1 left-1 bg-emerald-800 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xs">
                          SESUDAH (100%)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-sm flex items-center space-x-1.5 transition-all active:scale-98 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{editingId ? 'Simpan Pembaruan' : 'Simpan ke Buku Logbook'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari rincian kegiatan, status kehadiran, atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-emerald-600 focus:bg-white bg-slate-50/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Kehadiran Filter */}
            <select
              value={selectedKehadiranFilter}
              onChange={(e) => setSelectedKehadiranFilter(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-800 font-medium"
            >
              <option value="ALL">Semua Kehadiran ({entries.length})</option>
              {ATTENDANCE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'WFO' ? '🏢 WFO (Hadir)' : opt === 'Sakit' ? '🏥 Sakit' : '🌴 Cuti'}
                </option>
              ))}
            </select>

            <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setPeriodFilter('ALL')}
                className={`px-2.5 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  periodFilter === 'ALL'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setPeriodFilter('CURRENT_MONTH')}
                className={`px-2.5 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  periodFilter === 'CURRENT_MONTH'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bulan Ini
              </button>
              <button
                type="button"
                onClick={() => setPeriodFilter('CURRENT_QUARTER')}
                className={`px-2.5 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  periodFilter === 'CURRENT_QUARTER'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Triwulan Ini
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Menampilkan <strong>{sortedEntries.length}</strong> dari {entries.length} catatan logbook
          </span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-emerald-700 hover:underline font-medium cursor-pointer"
            >
              Hapus Filter Pencarian
            </button>
          )}
        </div>
      </div>

      {/* Logbook Entries List with Kehadiran Badge & Before/After display */}
      <div className="space-y-3">
        {sortedEntries.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300 text-slate-500 space-y-3">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-semibold text-slate-700">Tidak ada catatan logbook ditemukan</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Cobalah ubah filter pencarian atau tambahkan catatan logbook harian baru melalui tombol di atas.
            </p>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowAddForm(true);
              }}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 cursor-pointer"
            >
              Tambah Catatan Pertama
            </button>
          </div>
        ) : (
          sortedEntries.map((entry) => {
            const hasBeforeAndAfter =
              Boolean(entry.fotoSebelumUrl) && Boolean(entry.fotoSesudahUrl);

            const isWFO = (entry.kehadiran || 'WFO') === 'WFO';
            const isSakit = entry.kehadiran === 'Sakit';
            const isCuti = entry.kehadiran === 'Cuti';

            return (
              <div
                key={entry.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-shadow space-y-3 group"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center space-x-1.5 font-bold text-slate-900 text-xs sm:text-sm">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{formatDisplayDate(entry.tanggal)}</span>
                    </span>

                    {/* Kehadiran Badge */}
                    {isWFO && (
                      <span className="inline-flex items-center space-x-1 text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 rounded-md">
                        <Building className="w-3 h-3 text-emerald-700" />
                        <span>WFO</span>
                      </span>
                    )}
                    {isSakit && (
                      <span className="inline-flex items-center space-x-1 text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-md">
                        <HeartPulse className="w-3 h-3 text-amber-700" />
                        <span>Sakit</span>
                      </span>
                    )}
                    {isCuti && (
                      <span className="inline-flex items-center space-x-1 text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-300 px-2.5 py-0.5 rounded-md">
                        <Palmtree className="w-3 h-3 text-blue-700" />
                        <span>Cuti</span>
                      </span>
                    )}

                    {isWFO && (entry.jamMulai || entry.jamSelesai) && (
                      <span className="inline-flex items-center space-x-1 text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>
                          {entry.jamMulai || '07:30'} - {entry.jamSelesai || '11:30'} WIB
                        </span>
                      </span>
                    )}

                    {isWFO && entry.lokasiBlok && (
                      <span className="inline-flex items-center space-x-1 text-[11px] text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <span>{entry.lokasiBlok}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => handleEditClick(entry)}
                      className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg text-xs flex items-center space-x-1 font-medium cursor-pointer"
                      title="Edit entri ini"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteEntry(entry.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs cursor-pointer"
                      title="Hapus entri"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content body */}
                <div className="flex flex-col md:flex-row gap-4 items-start justify-between">
                  <div className="flex-1 space-y-2 text-xs leading-relaxed">
                    <p className="text-slate-800 font-normal text-justify">
                      {entry.uraianPekerjaan}
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 pt-1">
                      {isWFO && (
                        <div className="flex items-center space-x-1">
                          <strong className="text-slate-700">Luas Lokasi:</strong>
                          <span className="text-emerald-800 font-medium bg-emerald-50/60 px-1.5 py-0.5 rounded">
                            {entry.luasLokasi && entry.luasLokasi.trim() !== '' ? entry.luasLokasi : '-'}
                          </span>
                        </div>
                      )}
                      {entry.keterangan && (
                        <div className="flex items-center space-x-1">
                          <strong className="text-slate-700">Keterangan:</strong>
                          <span>{entry.keterangan}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Photo Previews */}
                  {isWFO && hasBeforeAndAfter ? (
                    <div className="shrink-0 flex items-center gap-2">
                      <div
                        onClick={() =>
                          setPreviewModalImg({
                            url: entry.fotoSebelumUrl!,
                            title: `Foto Sebelum Kegiatan (${formatDisplayDate(entry.tanggal)})`,
                          })
                        }
                        className="w-24 aspect-[4/3] rounded-lg overflow-hidden border border-amber-300 relative shadow-2xs group/b cursor-pointer hover:ring-2 hover:ring-amber-400"
                        title="Klik untuk memperbesar"
                      >
                        <img
                          src={entry.fotoSebelumUrl}
                          alt="Sebelum"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-0.5 left-0.5 bg-amber-800 text-white text-[7.5px] font-bold px-1 rounded uppercase">
                          Sebelum
                        </span>
                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/b:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Eye className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div
                        onClick={() =>
                          setPreviewModalImg({
                            url: entry.fotoSesudahUrl!,
                            title: `Foto Sesudah Kegiatan (${formatDisplayDate(entry.tanggal)})`,
                          })
                        }
                        className="w-24 aspect-[4/3] rounded-lg overflow-hidden border border-emerald-400 relative shadow-2xs group/a cursor-pointer hover:ring-2 hover:ring-emerald-400"
                        title="Klik untuk memperbesar"
                      >
                        <img
                          src={entry.fotoSesudahUrl}
                          alt="Sesudah"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-0.5 left-0.5 bg-emerald-800 text-white text-[7.5px] font-bold px-1 rounded uppercase">
                          Sesudah
                        </span>
                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/a:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Eye className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  ) : isWFO && (entry.fotoUrl || entry.fotoSesudahUrl || entry.fotoSebelumUrl) ? (
                    <div
                      onClick={() =>
                        setPreviewModalImg({
                          url: (entry.fotoSesudahUrl || entry.fotoUrl || entry.fotoSebelumUrl)!,
                          title: `Foto Kegiatan (${formatDisplayDate(entry.tanggal)})`,
                        })
                      }
                      className="shrink-0 w-28 aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 relative group/thumb shadow-2xs cursor-pointer hover:ring-2 hover:ring-emerald-400"
                      title="Klik untuk memperbesar"
                    >
                      <img
                        src={entry.fotoSesudahUrl || entry.fotoUrl || entry.fotoSebelumUrl}
                        alt="Foto kegiatan"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-medium p-1 text-center">
                        <Eye className="w-4 h-4 mr-1" />
                        <span>Perbesar</span>
                      </div>
                    </div>
                  ) : isSakit && entry.fotoSuratSakitUrl ? (
                    /* Surat Sakit Photo Thumbnail */
                    <div className="shrink-0 flex flex-col items-center gap-1.5">
                      <div
                        onClick={() =>
                          setPreviewModalImg({
                            url: entry.fotoSuratSakitUrl!,
                            title: `Surat Keterangan Sakit (${formatDisplayDate(entry.tanggal)})`,
                          })
                        }
                        className="w-24 sm:w-28 aspect-[4/3] rounded-xl overflow-hidden border-2 border-amber-400 bg-amber-50 relative group/sakit shadow-sm cursor-pointer hover:ring-2 hover:ring-amber-500 transition-all"
                        title="Klik untuk memperbesar surat sakit"
                      >
                        <img
                          src={entry.fotoSuratSakitUrl}
                          alt="Surat Keterangan Sakit"
                          className="w-full h-full object-cover group-hover/sakit:scale-105 transition-transform duration-200"
                        />
                        <span className="absolute top-1 left-1 bg-amber-800 text-white text-[7.5px] font-bold px-1.5 py-0.5 rounded uppercase shadow-xs">
                          Surat Sakit
                        </span>
                        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/sakit:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Eye className="w-4 h-4 drop-shadow" />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewModalImg({
                            url: entry.fotoSuratSakitUrl!,
                            title: `Surat Keterangan Sakit (${formatDisplayDate(entry.tanggal)})`,
                          })
                        }
                        className="text-[10.5px] text-amber-800 hover:text-amber-950 font-bold hover:underline flex items-center space-x-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3 text-amber-600" />
                        <span>Lihat Surat Sakit</span>
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Lightbox Image Preview Modal */}
      {previewModalImg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-white">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
              <span className="font-semibold text-sm truncate pr-2">
                {previewModalImg.title}
              </span>
              <button
                type="button"
                onClick={() => setPreviewModalImg(null)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center bg-black/40 overflow-auto flex-1 max-h-[75vh]">
              <img
                src={previewModalImg.url}
                alt={previewModalImg.title}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
              />
            </div>
            <div className="px-5 py-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewModalImg(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
