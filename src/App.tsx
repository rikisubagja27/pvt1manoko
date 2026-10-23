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
import { CustomLogoSelectorModal } from './components/CustomLogoSelectorModal';
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
  ArrowRight,
  Cloud,
  Download,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('logbook');

  const [periodType, setPeriodType] = useState<PeriodType>('triwulan');
  const [selectedMonth, setSelectedMonth] = useState<number>(7); 
  const [selectedQuarter, setSelectedQuarter] = useState<number>(3); 
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  const [logbookEntries, setLogbookEntries] = useState<DailyLogbookEntry[]>(DEFAULT_LOGBOOK_ENTRIES);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [activitiesOverride, setActivitiesOverride] = useState<Record<string, PeriodActivityRow[]>>({});
  const [extraPhotos, setExtraPhotos] = useState<DocumentationPhoto[]>([]);

  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

  // Default menggunakan logo LogIn dari public folder
  const [headerLogoUrl, setHeaderLogoUrl] = useState<string>(() => {
    return localStorage.getItem('app_header_logo') || '/logo-login.png';
  });
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [isGoogleDriveModalOpen, setIsGoogleDriveModalOpen] = useState(false);

  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingWord, setIsExportingWord] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => setCurrentUser(user),
      () => setCurrentUser(null)
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const activePeriodKey = useMemo(() => {
    if (periodType === 'bulanan') return `m-${selectedMonth}-${selectedYear}`;
    if (periodType === 'triwulan') return `q-${selectedQuarter}-${selectedYear}`;
    return `y-${selectedYear}`;
  }, [periodType, selectedMonth, selectedQuarter, selectedYear]);

  const activeActivities: PeriodActivityRow[] = useMemo(() => {
    if (activitiesOverride[activePeriodKey]) return activitiesOverride[activePeriodKey];
    const compiled = compileLogbookToTable1(logbookEntries, periodType, selectedMonth, selectedQuarter, selectedYear);
    if (compiled && compiled.length > 0) return compiled;

    if (periodType === 'triwulan') return DEFAULT_TRIWULAN_ACTIVITIES[selectedQuarter] || DEFAULT_TRIWULAN_ACTIVITIES[3];
    if (periodType === 'bulanan') {
      if (DEFAULT_MONTHLY_WEEKS[selectedMonth]) return DEFAULT_MONTHLY_WEEKS[selectedMonth];
      return generateDefaultMonthWeeks(selectedMonth, selectedYear);
    }
    return generateTahunanActivities(selectedYear);
  }, [activitiesOverride, activePeriodKey, logbookEntries, periodType, selectedMonth, selectedQuarter, selectedYear]);

  const activePhotos: DocumentationPhoto[] = useMemo(() => {
    const logbookPhotos: DocumentationPhoto[] = logbookEntries
      .filter((e) => (Boolean(e.fotoSebelumUrl) || Boolean(e.fotoSesudahUrl) || Boolean(e.fotoUrl) || Boolean(e.fotoSuratSakitUrl)) && e.showInReport !== false)
      .map((e) => {
        if (e.kehadiran === 'Sakit' && e.fotoSuratSakitUrl) {
          return {
            id: `doc-sakit-${e.id}`, title: `Surat Keterangan Sakit (${formatIndonesianDate(e.tanggal)}) - ${e.uraianPekerjaan}`, imageUrl: e.fotoSuratSakitUrl, dateStr: formatIndonesianDate(e.tanggal), locationName: 'Fasilitas Kesehatan / Klinik', showGpsBadge: false,
          };
        }
        const primary = e.fotoSesudahUrl || e.fotoUrl || e.fotoSebelumUrl || '';
        return {
          id: `doc-${e.id}`, title: e.fotoTitle || e.uraianPekerjaan.slice(0, 75), imageUrl: primary, fotoSebelumUrl: e.fotoSebelumUrl, fotoSesudahUrl: e.fotoSesudahUrl, dateStr: formatIndonesianDate(e.tanggal), timeStr: e.jamMulai ? `${e.jamMulai} WIB` : undefined, coordinates: 'S 6°48\'16.074", E 107°36\'50.629"', locationName: e.lokasiBlok || 'Kebun PVT I Manoko, Bandung Barat', elevation: '1290.0 m a.s.l.', speed: '0.0km/h', direction: '180° S', showGpsBadge: true,
        };
      });

    if (extraPhotos.length > 0) return [...extraPhotos, ...logbookPhotos];
    return logbookPhotos.length > 0 ? logbookPhotos : DEFAULT_DOCUMENTATION_PHOTOS;
  }, [logbookEntries, extraPhotos]);

  const periodTitleCaps = useMemo(() => getPeriodTitleCaps(periodType, selectedMonth, selectedQuarter, selectedYear), [periodType, selectedMonth, selectedQuarter, selectedYear]);
  const periodLabelNormal = useMemo(() => getPeriodLabelNormal(periodType, selectedMonth, selectedQuarter, selectedYear), [periodType, selectedMonth, selectedQuarter, selectedYear]);
  const defaultEndDate = useMemo(() => getDefaultEndDate(periodType, selectedMonth, selectedQuarter, selectedYear), [periodType, selectedMonth, selectedQuarter, selectedYear]);
  const activeSummary = useMemo(() => getPeriodBadgeDesc(periodType, selectedMonth, selectedQuarter, selectedYear), [periodType, selectedMonth, selectedQuarter, selectedYear]);

  const isTriwulanThreeRows = periodType === 'triwulan' && activeActivities.length === 3;
  const table1PageCount = isTriwulanThreeRows ? 2 : Math.max(1, Math.ceil(activeActivities.length / (periodType === 'bulanan' ? 3 : 2)));
  const table1StartPage = 4;
  const table2StartPage = table1StartPage + table1PageCount;
  const table2PageCount = activePhotos.length <= 3 ? 1 : activePhotos.length <= 7 ? 2 : Math.ceil((activePhotos.length - 7) / 4) + 2;
  const penutupPageNumber = table2StartPage + table2PageCount;
  const totalPages = penutupPageNumber;

  const handleAddLogbookEntry = (newEntry: DailyLogbookEntry) => setLogbookEntries((prev) => [newEntry, ...prev]);
  const handleUpdateLogbookEntry = (updated: DailyLogbookEntry) => setLogbookEntries((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  const handleDeleteLogbookEntry = (id: string) => setLogbookEntries((prev) => prev.filter((item) => item.id !== id));

  const handlePrint = () => window.print();

  const handleExportWord = async () => {
    try {
      setIsExportingWord(true);
      await exportReportToWord({ periodType, periodTitleCaps, periodLabelNormal, year: selectedYear, profile, activities: activeActivities, photos: activePhotos, endDateStr: defaultEndDate });
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
      await exportReportToPdf({ fileName: fileNameClean, elementId: 'report-print-container' });
    } catch (err) {
      console.error('Failed to export PDF:', err);
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleSaveActivities = (updated: PeriodActivityRow[]) => setActivitiesOverride((prev) => ({ ...prev, [activePeriodKey]: updated }));
  const handleResetActivities = () => setActivitiesOverride((prev) => { const copy = { ...prev }; delete copy[activePeriodKey]; return copy; });
  const handleAddPhoto = (newPhoto: DocumentationPhoto) => setExtraPhotos((prev) => [newPhoto, ...prev]);
  const handleSaveSignature = (sigUrl?: string) => setProfile((prev) => ({ ...prev, signatureImage: sigUrl, useDigitalSignature: true }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B4F47] to-[#0A192F] text-slate-200 flex flex-col font-sans select-text">
      {/* Top Application Header */}
      <header className="bg-slate-900/90 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md no-print">
        <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div
              onClick={() => setIsLogoModalOpen(true)}
              className="relative group w-12 h-12 rounded-lg bg-emerald-950 border border-slate-700 hover:border-emerald-500 flex items-center justify-center overflow-hidden shrink-0 cursor-pointer shadow-xs transition-all p-1"
              title="Klik untuk mengganti gambar logo"
            >
              <img src={headerLogoUrl} alt="Logo LogIn" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150?text=Logo'; }} />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[9px] font-bold text-white">Ganti</div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  <span>Sistem Logbook Kinerja</span>
                </h1>
                <span className="hidden md:inline-block text-[10px] uppercase font-bold tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.5 rounded">Kementan RI</span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-sm sm:max-w-md">Pusat Pelindungan Varietas Tanaman dan Perizinan Pertanian</p>
            </div>
          </div>

          {/* Primary View Switcher & Global Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            
            {/* BAGIAN PROFIL & CLOUD (Berada di atas pinggir) */}
            <div className="flex items-center gap-1.5 pr-2 sm:pr-3 border-r border-slate-700">
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-600 transition-colors cursor-pointer shadow-sm"
                title="Edit Profil & Pejabat"
              >
                {/* Tampilkan foto profil mini jika ada */}
                {profile.profileImageUrl ? (
                  <img src={profile.profileImageUrl} alt="Profil" className="w-4 h-4 rounded-full object-cover border border-emerald-500" />
                ) : (
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span className="hidden lg:inline text-xs font-semibold">Profil</span>
              </button>

              <button
                type="button"
                onClick={() => setIsGoogleDriveModalOpen(true)}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer shadow-sm ${
                  currentUser
                    ? 'bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-100 border-emerald-500/50'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-600'
                }`}
                title="Sinkronisasi Akun Cloud Drive"
              >
                {currentUser ? (
                  <>
                    <Cloud className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="hidden lg:inline text-xs font-semibold text-emerald-300">Drive Aktif</span>
                  </>
                ) : (
                  <>
                    <Cloud className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="hidden lg:inline text-xs font-semibold">Sync Cloud</span>
                  </>
                )}
              </button>
            </div>

            {/* Toggle Tab Isi Logbook / Laporan A4 */}
            <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 shadow-sm">
              <button
                type="button"
                onClick={() => setActiveTab('logbook')}
                className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'logbook' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Isi Logbook</span>
                <span className="bg-emerald-950/60 text-emerald-200 px-1.5 py-0.2 rounded-full text-[10px]">
                  {logbookEntries.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('report')}
                className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'report' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Laporan A4</span>
              </button>
            </div>
          </div>
        </div>

        {/* Period Selector Bar (Hanya tampil di halaman laporan) */}
        {activeTab === 'report' && (
          <PeriodSelector
            periodType={periodType} setPeriodType={setPeriodType} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} selectedQuarter={selectedQuarter} setSelectedQuarter={setSelectedQuarter} selectedYear={selectedYear} setSelectedYear={setSelectedYear} activeSummary={activeSummary}
          />
        )}

        {/* Secondary Toolbar: On Report View (Export & Editor) */}
        {activeTab === 'report' && (
          <div className="bg-slate-800/90 backdrop-blur-xs px-4 py-2 border-t border-slate-700/60 text-xs">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
              
              {/* BAGIAN EDITOR TABEL & FOTO */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsActivityModalOpen(true)}
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-700/80 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-600 transition-colors cursor-pointer"
                >
                  <ListPlus className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Kustom Tabel 1</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-700/80 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-600 transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Tambah Foto</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSignatureModalOpen(true)}
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-700/80 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-600 transition-colors cursor-pointer"
                >
                  <PenTool className="w-3.5 h-3.5 text-purple-400" />
                  <span className="hidden sm:inline">Tanda Tangan</span>
                </button>
              </div>

              {/* BAGIAN AKSI UNDUH & CETAK */}
              <div className="flex flex-wrap items-center gap-3 mt-1.5 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-700">
                <div className="flex items-center gap-1.5 pr-3 md:border-r border-slate-600">
                  <button type="button" onClick={handleExportWord} disabled={isExportingWord} className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50">
                    <FileDown className="w-4 h-4 text-blue-100" />
                    <span>Word</span>
                  </button>
                  <button type="button" onClick={handleExportPdf} disabled={isExportingPdf} className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50">
                    <Download className="w-4 h-4 text-rose-100" />
                    <span>PDF</span>
                  </button>
                  <button type="button" onClick={() => setTimeout(() => handlePrint(), 100)} className="flex items-center space-x-1.5 bg-slate-700 hover:bg-slate-600 text-slate-100 hover:text-white border border-slate-500 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer">
                    <Printer className="w-4 h-4" />
                    <span className="hidden sm:inline">Cetak</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2 text-slate-400">
                  <span className="hidden md:inline-flex items-center text-[11px] text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                    Total {totalPages} Hal
                  </span>
                  <div className="flex items-center space-x-1 bg-slate-900/60 p-0.5 rounded-lg border border-slate-700">
                    <button type="button" onClick={() => setZoomLevel((prev) => Math.max(50, prev - 10))} className="p-1 hover:text-white rounded hover:bg-slate-700 cursor-pointer" title="Perkecil"><ZoomOut className="w-3.5 h-3.5" /></button>
                    <span className="text-[11px] font-mono px-1.5 text-slate-200 min-w-10 text-center">{zoomLevel}%</span>
                    <button type="button" onClick={() => setZoomLevel((prev) => Math.min(150, prev + 10))} className="p-1 hover:text-white rounded hover:bg-slate-700 cursor-pointer" title="Perbesar"><ZoomIn className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => setZoomLevel(100)} className="p-1 hover:text-white rounded hover:bg-slate-700 cursor-pointer" title="Reset 100%"><Maximize2 className="w-3.5 h-3.5" /></button>
                  </div>
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
            entries={logbookEntries} onAddEntry={handleAddLogbookEntry} onUpdateEntry={handleUpdateLogbookEntry} onDeleteEntry={handleDeleteLogbookEntry} onNavigateToReport={() => setActiveTab('report')} selectedMonth={selectedMonth} selectedQuarter={selectedQuarter} selectedYear={selectedYear}
          />
        </main>
      ) : (
        <main className="flex-1 flex flex-col items-center">
          <div className="w-full bg-emerald-900/40 border-b border-emerald-700/50 py-1.5 px-4 text-center text-xs text-emerald-100 no-print flex items-center justify-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Format Dokumen Laporan Kinerja <strong>A4 Rapih</strong>. Judul kolom: <strong>{periodType === 'bulanan' ? 'Tanggal' : periodType === 'triwulan' ? 'Bulan' : 'Triwulan'}</strong>.</span>
            <button type="button" onClick={() => setActiveTab('logbook')} className="ml-2 font-bold text-emerald-300 underline hover:text-emerald-100 inline-flex items-center space-x-1 cursor-pointer">
              <span>Buka Logbook Harian</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="w-full py-8 px-2 sm:px-6 overflow-x-auto flex justify-center items-start print:p-0 print:m-0 print:overflow-visible">
            <div id="report-print-container" className="print-area flex flex-col gap-10 items-center transition-transform origin-top print:gap-0 print:block" style={{ transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined }}>
              <ReportCover periodTitleCaps={periodTitleCaps} year={selectedYear} profile={profile} />
              <ReportBab1 periodLabelNormal={periodLabelNormal} profile={profile} startPageNumber={2} />
              <ReportBab2Table1 periodType={periodType} periodLabelNormal={periodLabelNormal} profile={profile} activities={activeActivities} startPageNumber={table1StartPage} />
              <ReportBab2Table2 photos={activePhotos} startPageNumber={table2StartPage} />
              <ReportBab3 periodLabelNormal={periodLabelNormal} profile={profile} endDateStr={defaultEndDate} pageNumber={penutupPageNumber} />
            </div>
          </div>
        </main>
      )}

      {/* Modals */}
      <EditProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} profile={profile} onSave={(updated) => setProfile(updated)} />
      <EditActivityModal isOpen={isActivityModalOpen} onClose={() => setIsActivityModalOpen(false)} activities={activeActivities} onSave={handleSaveActivities} onReset={handleResetActivities} periodTitle={periodLabelNormal} />
      <AddPhotoModal isOpen={isPhotoModalOpen} onClose={() => setIsPhotoModalOpen(false)} onAddPhoto={handleAddPhoto} />
      <SignatureModal isOpen={isSignatureModalOpen} onClose={() => setIsSignatureModalOpen(false)} currentSignatureUrl={profile.signatureImage} onSaveSignature={handleSaveSignature} />
      <CustomLogoSelectorModal isOpen={isLogoModalOpen} onClose={() => setIsLogoModalOpen(false)} currentLogoUrl={headerLogoUrl} onSelectLogo={(logoUrl) => setHeaderLogoUrl(logoUrl)} />
      
      <GoogleDriveSyncModal
        isOpen={isGoogleDriveModalOpen} onClose={() => setIsGoogleDriveModalOpen(false)} currentUser={currentUser} onAuthChange={(user) => setCurrentUser(user)} logbookEntries={logbookEntries} profile={profile} activePeriodType={periodType} periodTitleCaps={periodTitleCaps} periodLabelNormal={periodLabelNormal} selectedYear={selectedYear} activities={activeActivities} defaultEndDate={defaultEndDate} onRestoreEntries={(restoredEntries) => setLogbookEntries(restoredEntries)}
      />
    </div>
  );
}
