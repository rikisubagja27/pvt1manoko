import React, { useState, useMemo, useRef } from 'react';
import { AttendanceStatus, DailyLogbookEntry } from '../types';
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
  FileText,
  Upload,
  ArrowRight,
  Check,
  X,
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

  const [previewModalImg, setPreviewModalImg] = useState<{ url: string; title: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKehadiranFilter, setSelectedKehadiranFilter] = useState<string>('ALL');
  const [periodFilter, setPeriodFilter] = useState<'ALL' | 'CURRENT_MONTH' | 'CURRENT_QUARTER'>('ALL');

  const fileInputSebelumRef = useRef<HTMLInputElement>(null);
  const fileInputSesudahRef = useRef<HTMLInputElement>(null);
  const fileInputSuratSakitRef = useRef<HTMLInputElement>(null);

  const filteredEntries = useMemo(() => {
    return entries.filter((item) => {
      if (selectedKehadiranFilter !== 'ALL' && item.kehadiran !== selectedKehadiranFilter) {
        return false;
      }
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
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.uraianPekerjaan.toLowerCase().includes(q) ||
          item.kehadiran.toLowerCase().includes(q) ||
          (item.lokasiBlok || '').toLowerCase().includes(q) ||
          (item.luasLokasi || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [entries, selectedKehadiranFilter, periodFilter, searchQuery, selectedMonth, selectedQuarter, selectedYear]);

  const sortedEntries = useMemo(() => {
    return [...filteredEntries].sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  }, [filteredEntries]);

  const handleUploadSebelum = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFotoSebelumUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSesudah = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFotoSesudahUrl(reader.result as string);
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

    const entryData: DailyLogbookEntry = {
      id: editingId || `entry-${Date.now()}`,
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

    if (editingId) {
      onUpdateEntry(entryData);
    } else {
      onAddEntry(entryData);
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
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 px-3.5 py-1.5 rounded-full text-sm font-semibold border border-emerald-400/30">
            <Calendar className="w-4 h-4" />
            <span>Sistem Pencatatan Logbook Kinerja</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Input & Catatan Logbook Harian
          </h2>
          <p className="text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
            Catat kehadiran dan pelaksanaan tugas harian di Kebun PVT I Manoko.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
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
            className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm shadow-md transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>{showAddForm ? 'Tutup Form' : 'Isi Logbook Baru'}</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToReport}
            className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm border border-white/20 transition-all flex items-center space-x-2 cursor-pointer"
          >
            <FileText className="w-5 h-5 text-emerald-300" />
            <span>Buka Laporan A4</span>
            <ArrowRight className="w-4 h-4 text-emerald-300" />
          </button>
        </div>
      </div>

      {/* Expandable Input Form (Kotak Putih Diperbesar Memenuhi Layar) */}
      {showAddForm && (
        <div className="w-full bg-white rounded-2xl border-2 border-emerald-500/80 shadow-xl overflow-hidden">
          <div className="bg-emerald-50/80 px-6 py-4 border-b border-emerald-200/80 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingId ? 'Edit Catatan Logbook' : 'Form Input Logbook Kinerja Harian'}
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 text-sm">
            {/* Kehadiran */}
            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-2.5">
              <label className="block font-bold text-slate-900 text-sm">
                Kehadiran <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setKehadiran('WFO')}
                  className={`flex items-center justify-center space-x-2.5 py-3 px-4 rounded-xl border font-bold text-sm transition-all cursor-pointer ${
                    kehadiran === 'WFO'
                      ? 'bg-emerald-600 border-emerald-700 text-white shadow-sm ring-2 ring-emerald-300'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Building className="w-5 h-5" />
                  <span>WFO (Hadir di Kantor / Kebun)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setKehadiran('Sakit')}
                  className={`flex items-center justify-center space-x-2.5 py-3 px-4 rounded-xl border font-bold text-sm transition-all cursor-pointer ${
                    kehadiran === 'Sakit'
                      ? 'bg-amber-600 border-amber-700 text-white shadow-sm ring-2 ring-amber-300'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <HeartPulse className="w-5 h-5" />
                  <span>Sakit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setKehadiran('Cuti')}
                  className={`flex items-center justify-center space-x-2.5 py-3 px-4 rounded-xl border font-bold text-sm transition-all cursor-pointer ${
                    kehadiran === 'Cuti'
                      ? 'bg-blue-600 border-blue-700 text-white shadow-sm ring-2 ring-blue-300'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Palmtree className="w-5 h-5" />
                  <span>Cuti</span>
                </button>
              </div>
            </div>

            {/* Tanggal & Waktu (Jam Mulai dan Jam Selesai Disejajarkan ke Samping) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1.5 text-sm">
                  Tanggal Kegiatan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-emerald-600 font-medium bg-white text-sm"
                  required
                />
              </div>

              {kehadiran === 'WFO' ? (
                <>
                  <div className="col-span-2 grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1.5 text-sm">Jam Mulai</label>
                      <input
                        type="time"
                        value={jamMulai}
                        onChange={(e) => setJamMulai(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-emerald-600 bg-white text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 mb-1.5 text-sm">Jam Selesai</label>
                      <input
                        type="time"
                        value={jamSelesai}
                        onChange={(e) => setJamSelesai(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-emerald-600 bg-white text-sm font-medium"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="col-span-2 flex items-center bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm italic">
                  Status {kehadiran}: Jam operasional lapangan tidak berlaku.
                </div>
              )}
            </div>

            {kehadiran === 'WFO' && (
              <div>
                <label className="block font-bold text-slate-800 mb-1.5 text-sm">Lokasi / Blok Kebun</label>
                <input
                  type="text"
                  placeholder="Misal: Blok C7 Manoko, Blok C4"
                  value={lokasiBlok}
                  onChange={(e) => setLokasiBlok(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-emerald-600 bg-white text-sm font-medium"
                />
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-800 mb-1.5 text-sm">
                {kehadiran === 'WFO' ? 'Rincian Uraian Pekerjaan' : 'Keterangan'} <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Jelaskan secara detail pekerjaan operasional yang dilaksanakan..."
                value={uraianPekerjaan}
                onChange={(e) => setUraianPekerjaan(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-emerald-600 text-sm leading-relaxed bg-white font-medium"
                required
              />
            </div>

            {kehadiran === 'WFO' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5 text-sm">Luas Lokasi Pekerjaan (m²)</label>
                  <input
                    type="text"
                    placeholder="Misal: 500 m² atau kosongkan / isi (-)"
                    value={luasLokasi}
                    onChange={(e) => setLuasLokasi(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-emerald-600 bg-white text-sm font-medium"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Apabila lokasi tidak diketahui atau bukan pekerjaan lahan, kolom bisa dikosongkan atau diisi simbol (-).</p>
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5 text-sm">Keterangan Tambahan / Catatan Kondisi</label>
                  <input
                    type="text"
                    placeholder="Misal: Kondisi tanah gembur, cuaca cerah"
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-emerald-600 bg-white text-sm font-medium"
                  />
                </div>
              </div>
            )}

            {/* Foto Sebelum dan Sesudah Kegiatan (WFO) */}
            {kehadiran === 'WFO' && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-2.5 gap-2">
                  <span className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span>Foto Sebelum dan Sesudah Kegiatan (0% & 100%)</span>
                  </span>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showInReport}
                      onChange={(e) => setShowInReport(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span className="text-xs font-bold text-emerald-900">Otomatis Masuk ke Tabel 2 Laporan A4</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Foto SEBELUM */}
                  <div className="p-3.5 bg-white rounded-xl border border-amber-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">Foto SEBELUM Kegiatan (0%)</span>
                      <button
                        type="button"
                        onClick={() => fileInputSebelumRef.current?.click()}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs flex items-center space-x-1 cursor-pointer shadow-xs"
                      >
                        <Upload className="w-3 h-3" />
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
                      placeholder="Atau tempel URL foto sebelum..."
                      value={fotoSebelumUrl}
                      onChange={(e) => setFotoSebelumUrl(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 bg-white text-xs"
                    />
                    {fotoSebelumUrl && (
                      <div className="aspect-[4/3] max-h-28 rounded-lg overflow-hidden border border-amber-300">
                        <img src={fotoSebelumUrl} alt="Sebelum" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  {/* Foto SESUDAH */}
                  <div className="p-3.5 bg-white rounded-xl border border-emerald-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">Foto SESUDAH Kegiatan (100%)</span>
                      <button
                        type="button"
                        onClick={() => fileInputSesudahRef.current?.click()}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center space-x-1 cursor-pointer shadow-xs"
                      >
                        <Upload className="w-3 h-3" />
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
                      placeholder="Atau tempel URL foto sesudah..."
                      value={fotoSesudahUrl}
                      onChange={(e) => setFotoSesudahUrl(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 bg-white text-xs"
                    />
                    {fotoSesudahUrl && (
                      <div className="aspect-[4/3] max-h-28 rounded-lg overflow-hidden border border-emerald-300">
                        <img src={fotoSesudahUrl} alt="Sesudah" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-100 font-semibold text-sm cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md flex items-center space-x-2 text-sm cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{editingId ? 'Simpan Pembaruan' : 'Simpan ke Buku Logbook'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari rincian kegiatan, status kehadiran, atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-emerald-600 bg-slate-50/50 font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedKehadiranFilter}
              onChange={(e) => setSelectedKehadiranFilter(e.target.value)}
              className="text-sm border border-slate-300 rounded-xl px-3 py-2.5 bg-white text-slate-800 font-bold"
            >
              <option value="ALL">Semua Kehadiran ({entries.length})</option>
              {ATTENDANCE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'WFO' ? '🏢 WFO (Hadir)' : opt === 'Sakit' ? '🏥 Sakit' : '🌴 Cuti'}
                </option>
              ))}
            </select>

            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-sm font-medium">
              <button
                type="button"
                onClick={() => setPeriodFilter('ALL')}
                className={`px-3 py-2 rounded-lg transition-all cursor-pointer ${
                  periodFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setPeriodFilter('CURRENT_MONTH')}
                className={`px-3 py-2 rounded-lg transition-all cursor-pointer ${
                  periodFilter === 'CURRENT_MONTH' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bulan Ini
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Entries List */}
      <div className="space-y-3.5">
        {sortedEntries.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300 text-slate-500 space-y-3">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700 text-base">Tidak ada catatan logbook ditemukan</h4>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Cobalah ubah filter pencarian atau tambahkan catatan logbook harian baru.
            </p>
          </div>
        ) : (
          sortedEntries.map((entry) => {
            const isWFO = (entry.kehadiran || 'WFO') === 'WFO';
            const isSakit = entry.kehadiran === 'Sakit';
            const isCuti = entry.kehadiran === 'Cuti';

            return (
              <div
                key={entry.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all space-y-3.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center space-x-2 font-bold text-slate-900 text-sm sm:text-base">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span>{formatDisplayDate(entry.tanggal)}</span>
                    </span>

                    {isWFO && (
                      <span className="inline-flex items-center space-x-1 text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-lg">
                        <Building className="w-3.5 h-3.5 text-emerald-700" />
                        <span>WFO</span>
                      </span>
                    )}
                    {isSakit && (
                      <span className="inline-flex items-center space-x-1 text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-lg">
                        <HeartPulse className="w-3.5 h-3.5 text-amber-700" />
                        <span>Sakit</span>
                      </span>
                    )}
                    {isCuti && (
                      <span className="inline-flex items-center space-x-1 text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300 px-3 py-1 rounded-lg">
                        <Palmtree className="w-3.5 h-3.5 text-blue-700" />
                        <span>Cuti</span>
                      </span>
                    )}

                    {isWFO && (entry.jamMulai || entry.jamSelesai) && (
                      <span className="inline-flex items-center space-x-1 text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg font-mono font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{entry.jamMulai || '07:30'} - {entry.jamSelesai || '11:30'} WIB</span>
                      </span>
                    )}

                    {isWFO && entry.lokasiBlok && (
                      <span className="inline-flex items-center space-x-1 text-xs text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{entry.lokasiBlok}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleEditClick(entry)}
                      className="px-3 py-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer border border-slate-200"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteEntry(entry.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer border border-slate-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-start justify-between">
                  <div className="flex-1 space-y-2.5 text-sm leading-relaxed">
                    <p className="text-slate-900 font-normal text-justify">
                      {entry.uraianPekerjaan}
                    </p>
                    <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-slate-600 pt-1">
                      {isWFO && (
                        <div className="flex items-center space-x-1.5">
                          <strong className="text-slate-800">Luas Lokasi:</strong>
                          <span className="text-emerald-900 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                            {entry.luasLokasi || '-'}
                          </span>
                        </div>
                      )}
                      {entry.keterangan && (
                        <div className="flex items-center space-x-1.5">
                          <strong className="text-slate-800">Keterangan:</strong>
                          <span>{entry.keterangan}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail Foto */}
                  {(entry.fotoSebelumUrl || entry.fotoSesudahUrl || entry.fotoUrl || entry.fotoSuratSakitUrl) && (
                    <div
                      onClick={() =>
                        setPreviewModalImg({
                          url: (entry.fotoSebelumUrl || entry.fotoSesudahUrl || entry.fotoUrl || entry.fotoSuratSakitUrl)!,
                          title: `Foto Dokumentasi (${formatDisplayDate(entry.tanggal)})`,
                        })
                      }
                      className="shrink-0 w-32 aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 relative shadow-xs cursor-pointer hover:ring-2 hover:ring-emerald-500 transition-all group"
                    >
                      <img
                        src={entry.fotoSebelumUrl || entry.fotoSesudahUrl || entry.fotoUrl || entry.fotoSuratSakitUrl}
                        alt="Dokumentasi"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                        <Eye className="w-4 h-4 mr-1" />
                        <span>Perbesar</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Lightbox Modal */}
      {previewModalImg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-white">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <span className="font-bold text-sm truncate">{previewModalImg.title}</span>
              <button
                type="button"
                onClick={() => setPreviewModalImg(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center bg-black/40 overflow-auto flex-1 max-h-[75vh]">
              <img src={previewModalImg.url} alt="Pratinjau" className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-lg" />
            </div>
            <div className="px-5 py-4 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewModalImg(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold cursor-pointer"
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
