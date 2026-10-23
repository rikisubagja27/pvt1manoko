import React, { useState, useMemo, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  DEFAULT_DOCUMENTATION_PHOTOS,
  DEFAULT_MONTHLY_WEEKS,
  DEFAULT_TRIWULAN_ACTIVITIES,
  DEFAULT_USER_PROFILE,
  generateDefaultMonthWeeks,
  generateTahunanActivities,
} from './data/defaultData';
import { DEFAULT_LOGBOOK_ENTRIES } from './data/defaultLogbookEntries';
import {
  DailyLogbookEntry,
  DocumentationPhoto,
  PeriodActivityRow,
  PeriodType,
  UserProfile,
} from './types';
import {
  getDefaultEndDate,
  getPeriodBadgeDesc,
  getPeriodLabelNormal,
  getPeriodTitleCaps,
} from './utils/reportHelpers';
import { compileLogbookToTable1, formatIndonesianDate } from './utils/logbookAggregator';
import { PeriodSelector } from './components/PeriodSelector';
import { ReportCover } from './components/ReportCover';
import { ReportBab1 } from './components/ReportBab1';
import { ReportBab2Table1 } from './components/ReportBab2Table1';
import { ReportBab2Table2 } from './components/ReportBab2Table2';
import { ReportBab3 } from './components/ReportBab3';
import { LogbookManagerView } from './components/LogbookManagerView';
import { EditProfileModal } from './components/EditProfileModal';
import { EditActivityModal } from './components/EditActivityModal';
import { AddPhotoModal } from './components/AddPhotoModal';
import { SignatureModal } from './components/SignatureModal';
import { CustomLogoSelectorModal, PRESET_LOGOS } from './components/CustomLogoSelectorModal';
import { GoogleDriveSyncModal } from './components/GoogleDriveSyncModal';
import { exportReportToWord } from './utils/wordExport';
import { exportReportToPdf } from './utils/pdfExport';
import { auth, initAuth } from './services/firebaseAuth';
import {
  Printer,
  FileDown,
  UserCheck,
  ListPlus,
  Camera,
  PenTool,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileText,
  Sparkles,
  ClipboardList,
  Layers,
  ArrowRight,
  RefreshCw,
  Cloud,
  CheckCircle2,
  Image as ImageIcon,
  Download,
} from 'lucide-react';

export default function App() {
  // Navigation active tab: 'logbook' (Halaman Isi Logbook) or 'report' (Halaman Laporan A4)
  const [activeTab, setActiveTab] = useState('logbook');

  // Period states: default to Triwulan III 2026 as in the user's document example
  const [periodType, setPeriodType] = useState<PeriodType>('triwulan');
  const [selectedMonth, setSelectedMonth] = useState<number>(7); // Juli
  const [selectedQuarter, setSelectedQuarter] = useState<number>(3); // Triwulan III
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // Daily logbook entries state (Halaman Isi Logbook)
  const [logbookEntries, setLogbookEntries] = useState<DailyLogbookEntry[]>(DEFAULT_LOGBOOK_ENTRIES);

  // User profile state
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);

  // Custom activities store for manual edits
  const [activitiesOverride, setActivitiesOverride] = useState<
    Record<string, PeriodActivityRow[]>
  >({});

  // Additional photos state for Tabel 2 Dokumentasi Kegiatan
  const [extraPhotos, setExtraPhotos] = useState<DocumentationPhoto[]>([]);

  // View UI states
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

  // Custom Logo state (beside 'Logbook Kinerja')
  const [headerLogoUrl, setHeaderLogoUrl] = useState<string>(() => {
    return localStorage.getItem('app_header_logo') || PRESET_LOGOS[0].url;
  });
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  // Google Drive & Gmail Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [isGoogleDriveModalOpen, setIsGoogleDriveModalOpen] = useState(false);

  // PDF Export state
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Initialize Firebase Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => setCurrentUser(user),
      () => setCurrentUser(null)
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Compute active period key
  const activePeriodKey = useMemo(() => {
    if (periodType === 'bulanan') return `m-${selectedMonth}-${selectedYear}`;
    if (periodType === 'triwulan') return `q-${selectedQuarter}-${selectedYear}`;
    return `y-${selectedYear}`;
  }, [periodType, selectedMonth, selectedQuarter, selectedYear]);

  // Derive dynamic activities for the active period in the report
  // Automatically compiles from logbook entries!
  const activeActivities: PeriodActivityRow[] = useMemo(() => {
    if (activitiesOverride[activePeriodKey]) {
      return activitiesOverride[activePeriodKey];
    }

    // Automatically aggregate from logbookEntries
    const compiled = compileLogbookToTable1(
      logbookEntries,
      periodType,
      selectedMonth,
      selectedQuarter,
      selectedYear
    );

    // Fallback if compiled has no content
    if (compiled && compiled.length > 0) {
      return compiled;
    }

    if (periodType === 'triwulan') {
      return (
        DEFAULT_TRIWULAN_ACTIVITIES[selectedQuarter] ||
        DEFAULT_TRIWULAN_ACTIVITIES[3]
      );
    }

    if (periodType === 'bulanan') {
      if (DEFAULT_MONTHLY_WEEKS[selectedMonth]) {
        return DEFAULT_MONTHLY_WEEKS[selectedMonth];
      }
      return generateDefaultMonthWeeks(selectedMonth, selectedYear);
    }

    // Tahunan
    return generateTahunanActivities(selectedYear);
  }, [activitiesOverride, activePeriodKey, logbookEntries, periodType, selectedMonth, selectedQuarter, selectedYear]);

  // Automatically synthesize documentation photos for Tabel 2
  // Includes Before & After photos from logbook entries
  const activePhotos: DocumentationPhoto[] = useMemo(() => {
    // 1. Photos from logbook entries marked showInReport
    const logbookPhotos: DocumentationPhoto[] = logbookEntries
      .filter(
        (e) =>
          (Boolean(e.fotoSebelumUrl) ||
            Boolean(e.fotoSesudahUrl) ||
            Boolean(e.fotoUrl) ||
            Boolean(e.fotoSuratSakitUrl)) &&
          e.showInReport !== false
      )
      .map((e) => {
        // Khusus entri Sakit dengan bukti surat sakit
        if (e.kehadiran === 'Sakit' && e.fotoSuratSakitUrl) {
          return {
            id: `doc-sakit-${e.id}`,
            title: `Surat Keterangan Sakit (${formatIndonesianDate(e.tanggal)}) - ${e.uraianPekerjaan}`,
            imageUrl: e.fotoSuratSakitUrl,
            dateStr: formatIndonesianDate(e.tanggal),
            locationName: 'Fasilitas Kesehatan / Klinik',
            showGpsBadge: false, // Surat dokter tidak memerlukan watermark GPS lapangan
          };
        }

        const primary = e.fotoSesudahUrl || e.fotoUrl || e.fotoSebelumUrl || '';
        return {
          id: `doc-${e.id}`,
          title: e.fotoTitle || e.uraianPekerjaan.slice(0, 75),
          imageUrl: primary,
          fotoSebelumUrl: e.fotoSebelumUrl,
          fotoSesudahUrl: e.fotoSesudahUrl,
          dateStr: formatIndonesianDate(e.tanggal),
          timeStr: e.jamMulai ? `${e.jamMulai} WIB` : undefined,
          coordinates: 'S 6°48\'16.074", E 107°36\'50.629"',
          locationName: e.lokasiBlok || 'Kebun PVT I Manoko, Bandung Barat',
          elevation: '1290.0 m a.s.l.',
          speed: '0.0km/h',
          direction: '180° S',
          showGpsBadge: true,
        };
      });

    // Combine with any extra manually uploaded photos
    if (extraPhotos.length > 0) {
      return [...extraPhotos, ...logbookPhotos];
    }

    return logbookPhotos.length > 0 ? logbookPhotos : DEFAULT_DOCUMENTATION_PHOTOS;
  }, [logbookEntries, extraPhotos]);

  // Derived strings
  const periodTitleCaps = useMemo(
    () => getPeriodTitleCaps(periodType, selectedMonth, selectedQuarter, selectedYear),
    [periodType, selectedMonth, selectedQuarter, selectedYear]
  );

  const periodLabelNormal = useMemo(
    () => getPeriodLabelNormal(periodType, selectedMonth, selectedQuarter, selectedYear),
    [periodType, selectedMonth, selectedQuarter, selectedYear]
  );

  const defaultEndDate = useMemo(
    () => getDefaultEndDate(periodType, selectedMonth, selectedQuarter, selectedYear),
    [periodType, selectedMonth, selectedQuarter, selectedYear]
  );

  const activeSummary = useMemo(
    () => getPeriodBadgeDesc(periodType, selectedMonth, selectedQuarter, selectedYear),
    [periodType, selectedMonth, selectedQuarter, selectedYear]
  );

  // Calculate dynamic page numbering
  const isTriwulanThreeRows = periodType === 'triwulan' && activeActivities.length === 3;
  const table1PageCount = isTriwulanThreeRows
    ? 2
    : Math.max(1, Math.ceil(activeActivities.length / (periodType === 'bulanan' ? 3 : 2)));

  const table1StartPage = 4;
  const table2StartPage = table1StartPage + table1PageCount;

  // Table 2 page count
  const table2PageCount =
    activePhotos.length <= 3
      ? 1
      : activePhotos.length <= 7
      ? 2
      : Math.ceil((activePhotos.length - 7) / 4) + 2;

  const penutupPageNumber = table2StartPage + table2PageCount;
  const totalPages = penutupPageNumber;

  // Handlers for Logbook
  const handleAddLogbookEntry = (newEntry: DailyLogbookEntry) => {
    setLogbookEntries((prev) => [newEntry, ...prev]);
  };

  const handleUpdateLogbookEntry = (updated: DailyLogbookEntry) => {
    setLogbookEntries((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  const handleDeleteLogbookEntry = (id: string) => {
    setLogbookEntries((prev) => prev.filter((item) => item.id !== id));
  };

  const [isExportingWord, setIsExportingWord] = useState(false);

  // Handlers for Report
  const handlePrint = () => {
    window.print();
  };

  const handleExportWord = async () => {
    try {
      setIsExportingWord(true);
      await exportReportToWord({
        periodType,
        periodTitleCaps,
        periodLabelNormal,
        year: selectedYear,
        profile,
        activities: activeActivities,
        photos: activePhotos,
        endDateStr: defaultEndDate,
      });
    } catch (err) {
      console.error('Failed to export Word document:', err);
    } finally {
      setIsExportingWord(false);
    }
  };

  const handleExportPdf = async () => {
    try {
      setIsExportingPdf(true);
      if (activeTab !== 'report') {
        setActiveTab('report');
        await new Promise((resolve) => setTimeout(resolve, 450));
      }
      const fileNameClean = `Laporan_Kinerja_${periodLabelNormal.replace(/\s+/g, '_')}_${profile.nama.replace(/\s+/g, '_')}.pdf`;
      await exportReportToPdf({
        fileName: fileNameClean,
        elementId: 'report-print-container',
      });
    } catch (err: any) {
      console.error('Failed to export PDF:', err);
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleSaveActivities = (updated: PeriodActivityRow[]) => {
    setActivitiesOverride((prev) => ({
      ...prev,
      [activePeriodKey]: updated,
    }));
  };

  const handleResetActivities = () => {
    setActivitiesOverride((prev) => {
      const copy = { ...prev };
      delete copy[activePeriodKey];
      return copy;
    });
  };

  const handleAddPhoto = (newPhoto: DocumentationPhoto) => {
    setExtraPhotos((prev) => [newPhoto, ...prev]);
  };

  const handleSaveSignature = (sigUrl?: string) => {
    setProfile((prev) => ({
      ...prev,
      signatureImage: sigUrl,
      useDigitalSignature: true,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B4F47] to-[#0A192F] text-slate-200 flex flex-col font-sans select-text">
      {/* Top Application Header */}
      <header className="bg-slate-900/90 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md no-print">
        <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div
              onClick={() => setIsLogoModalOpen(true)}
              className="relative group w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 hover:border-emerald-500 flex items-center justify-center overflow-hidden shrink-0 cursor-pointer shadow-xs transition-all"
              title="Klik untuk mengganti gambar logo"
            >
              {headerLogoUrl === 'DEFAULT_ICON' ? (
                <div className="w-full h-full bg-emerald-600 flex items-center justify-center font-bold text-white">
                  <ClipboardList className="w-5 h-5 text-white" />
                </div>
              ) : (
                <img
                  src={headerLogoUrl}
                  alt="Logo Logbook"
                  className="w-full h-full object-contain p-0.5"
                />
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[9px] font-bold text-white">
                Ganti
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  <span>Logbook Kinerja PVT I Manoko</span>
                  <button
                    type="button"
                    onClick={() => setIsLogoModalOpen(true)}
                    className="text-[10px] text-slate-400 hover:text-emerald-300 underline font-normal cursor-pointer ml-1 hidden sm:inline"
                    title="Ganti logo dengan gambar pilihan"
                  >
                    (Ganti Logo)
                  </button>
                </h1>
                <span className="hidden md:inline-block text-[10px] uppercase font-bold tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.5 rounded">
                  Kementan RI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-sm sm:max-w-md">
                Pusat Pelindungan Varietas Tanaman dan Perizinan Pertanian
              </p>
            </div>
          </div>

          {/* Primary View Switcher & Action Menu */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => setActiveTab('logbook')}
                className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'logbook'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>📝 Isi Logbook</span>
                <span className="bg-emerald-950/60 text-emerald-200 px-1.5 py-0.2 rounded-full text-[10px]">
                  {logbookEntries.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('report')}
                className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'report'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>📄 Laporan A4</span>
              </button>
            </div>

            {/* Export Word (.docx) */}
            <button
              type="button"
              onClick={handleExportWord}
              disabled={isExportingWord}
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer shrink-0 disabled:opacity-50"
              title="Unduh laporan lengkap dalam format Microsoft Word (.docx)"
            >
              <FileDown className="w-4 h-4 text-blue-100" />
              <span className="hidden sm:inline">
                {isExportingWord ? 'Menyiapkan...' : 'Unduh Word'}
              </span>
              <span className="sm:hidden">Word</span>
            </button>

            {/* Download PDF (.pdf) */}
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-500 text-white px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer shrink-0 disabled:opacity-50"
              title="Unduh dokumen langsung dalam format PDF (.pdf)"
            >
              <Download className="w-4 h-4 text-rose-100" />
              <span className="hidden sm:inline">
                {isExportingPdf ? 'Menyiapkan...' : 'Unduh PDF'}
              </span>
              <span className="sm:hidden">PDF</span>
            </button>

            {/* Print / Cetak PDF */}
            <button
              type="button"
              onClick={() => {
                if (activeTab !== 'report') setActiveTab('report');
                setTimeout(() => handlePrint(), 100);
              }}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
              title="Cetak langsung menggunakan dialog print browser"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Cetak</span>
            </button>

            {/* Google Drive & Gmail Login Menu */}
            <button
              type="button"
              onClick={() => setIsGoogleDriveModalOpen(true)}
              className={`flex items-center space-x-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer shrink-0 shadow-xs ${
                currentUser
                  ? 'bg-slate-800 hover:bg-slate-700/80 text-white border-emerald-500/50'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200 border-slate-600'
              }`}
              title="Masuk dengan akun Gmail & sinkronisasi Google Drive"
            >
              {currentUser ? (
                <>
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="User"
                      className="w-5 h-5 rounded-full border border-emerald-400 shrink-0"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {currentUser.displayName ? currentUser.displayName[0] : 'G'}
                    </div>
                  )}
                  <div className="flex flex-col text-left leading-tight hidden sm:flex">
                    <span className="text-[11px] font-bold truncate max-w-[90px]">
                      {currentUser.displayName?.split(' ')[0] || 'Gmail'}
                    </span>
                    <span className="text-[9px] text-emerald-400 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                      Drive Aktif
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <Cloud className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="text-xs font-bold">Gmail & Drive</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Period Selector Bar (Hanya tampil di halaman laporan) */}
        {activeTab === 'report' && (
          <PeriodSelector
            periodType={periodType}
            setPeriodType={setPeriodType}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedQuarter={selectedQuarter}
            setSelectedQuarter={setSelectedQuarter}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            activeSummary={activeSummary}
          />
        )}

        {/* Secondary Toolbar: On Report View */}
        {activeTab === 'report' && (
          <div className="bg-slate-800/90 backdrop-blur-xs px-4 py-2 border-t border-slate-700/60 text-xs">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(true)}
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-700/80 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-600 transition-colors cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Edit Profil & Pejabat</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsActivityModalOpen(true)}
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-700/80 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-600 transition-colors cursor-pointer"
                >
                  <ListPlus className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Kustom Tabel 1 ({activeActivities.length} Baris)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-700/80 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-600 transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tambah Foto Tabel 2 ({activePhotos.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSignatureModalOpen(true)}
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-700/80 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-600 transition-colors cursor-pointer"
                >
                  <PenTool className="w-3.5 h-3.5 text-purple-400" />
                  <span>Tanda Tangan Digital</span>
                </button>
              </div>

              {/* Document Info & Zoom Controls */}
              <div className="flex items-center space-x-3 text-slate-400">
                <span className="hidden sm:inline-flex items-center text-[11px] text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                  Total {totalPages} Halaman A4
                </span>

                <div className="flex items-center space-x-1 bg-slate-900/60 p-0.5 rounded-lg border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((prev) => Math.max(50, prev - 10))}
                    className="p-1 hover:text-white rounded hover:bg-slate-700 cursor-pointer"
                    title="Perkecil"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono px-1.5 text-slate-200 min-w-10 text-center">
                    {zoomLevel}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((prev) => Math.min(150, prev + 10))}
                    className="p-1 hover:text-white rounded hover:bg-slate-700 cursor-pointer"
                    title="Perbesar"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(100)}
                    className="p-1 hover:text-white rounded hover:bg-slate-700 cursor-pointer"
                    title="Reset 100%"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      {activeTab === 'logbook' ? (
        <main className="flex-1 pb-16">
          <LogbookManagerView
            entries={logbookEntries}
            onAddEntry={handleAddLogbookEntry}
            onUpdateEntry={handleUpdateLogbookEntry}
            onDeleteEntry={handleDeleteLogbookEntry}
            onNavigateToReport={() => setActiveTab('report')}
            selectedMonth={selectedMonth}
            selectedQuarter={selectedQuarter}
            selectedYear={selectedYear}
          />
        </main>
      ) : (
        <main className="flex-1 flex flex-col items-center">
          {/* Notice Banner */}
          <div className="w-full bg-emerald-900/40 border-b border-emerald-700/50 py-1.5 px-4 text-center text-xs text-emerald-100 no-print flex items-center justify-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              Format Dokumen Laporan Kinerja <strong>A4 Rapih</strong>. Judul kolom: <strong>{periodType === 'bulanan' ? 'Tanggal' : periodType === 'triwulan' ? 'Bulan' : 'Triwulan'}</strong>, dirangkum otomatis dari <strong>{logbookEntries.length} entri logbook</strong>.
            </span>
            <button
              type="button"
              onClick={() => setActiveTab('logbook')}
              className="ml-2 font-bold text-emerald-300 underline hover:text-emerald-100 inline-flex items-center space-x-1 cursor-pointer"
            >
              <span>Isi Buku Logbook Harian</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Main A4 Document Workspace */}
          <div className="w-full py-8 px-2 sm:px-6 overflow-x-auto flex justify-center items-start print:p-0 print:m-0 print:overflow-visible">
            <div
              id="report-print-container"
              className="print-area flex flex-col gap-10 items-center transition-transform origin-top print:gap-0 print:block"
              style={{
                transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined,
              }}
            >
              {/* Page 1: COVER with user's official Kementan logo */}
              <ReportCover
                periodTitleCaps={periodTitleCaps}
                year={selectedYear}
                profile={profile}
              />

              {/* Page 2 & 3: BAB I PENDAHULUAN */}
              <ReportBab1
                periodLabelNormal={periodLabelNormal}
                profile={profile}
                startPageNumber={2}
              />

              {/* Page 4 & 5 (or dynamic): BAB II TABEL 1 (Rincian Kegiatan) */}
              <ReportBab2Table1
                periodType={periodType}
                periodLabelNormal={periodLabelNormal}
                profile={profile}
                activities={activeActivities}
                startPageNumber={table1StartPage}
              />

              {/* Page 6, 7, 8: BAB II TABEL 2 (Dokumentasi Kegiatan Sebelum & Sesudah) */}
              <ReportBab2Table2
                photos={activePhotos}
                startPageNumber={table2StartPage}
              />

              {/* Page 9 (Last Page): BAB III PENUTUP & TANDA TANGAN */}
              <ReportBab3
                periodLabelNormal={periodLabelNormal}
                profile={profile}
                endDateStr={defaultEndDate}
                pageNumber={penutupPageNumber}
              />
            </div>
          </div>
        </main>
      )}

      {/* Modals */}
      <EditProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSave={(updated) => setProfile(updated)}
      />

      <EditActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        activities={activeActivities}
        onSave={handleSaveActivities}
        onReset={handleResetActivities}
        periodTitle={periodLabelNormal}
      />

      <AddPhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onAddPhoto={handleAddPhoto}
      />

      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        currentSignatureUrl={profile.signatureImage}
        onSaveSignature={handleSaveSignature}
      />

      {/* Custom Header Logo Selector Modal */}
      <CustomLogoSelectorModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        currentLogoUrl={headerLogoUrl}
        onSelectLogo={(logoUrl) => setHeaderLogoUrl(logoUrl)}
      />

      {/* Google Drive & Gmail Sync Modal */}
      <GoogleDriveSyncModal
        isOpen={isGoogleDriveModalOpen}
        onClose={() => setIsGoogleDriveModalOpen(false)}
        currentUser={currentUser}
        onAuthChange={(user) => setCurrentUser(user)}
        logbookEntries={logbookEntries}
        profile={profile}
        activePeriodType={periodType}
        periodTitleCaps={periodTitleCaps}
        periodLabelNormal={periodLabelNormal}
        selectedYear={selectedYear}
        activities={activeActivities}
        defaultEndDate={defaultEndDate}
        onRestoreEntries={(restoredEntries) => setLogbookEntries(restoredEntries)}
      />
    </div>
  );
}
