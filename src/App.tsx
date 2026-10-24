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
import { EditReportModal } from './components/EditReportModal'; // <-- Import modal editor laporan baru
import { exportReportToPdf } from './utils/pdfExport';
import { auth, initAuth } from './services/firebaseAuth';
import {
  Edit3,
  FileDown,
  UserCheck,
  ListPlus,
  Camera,
  PenTool,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileText,
  ClipboardList,
  Cloud,
  Download,
  EyeOff,
  Eye,
} from 'lucide-react';

import { generateWordReport } from './utils/wordExport';

export default function App() {
  const [activeTab, setActiveTab] = useState('logbook');

  const [periodType, setPeriodType] = useState<PeriodType>('triwulan');
  const [selectedMonth, setSelectedMonth] = useState<number>(7); 
  const [selectedQuarter, setSelectedQuarter] = useState<number>(3); 
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  const [isPeriodHidden, setIsPeriodHidden] = useState<boolean>(false);

  const [logbookEntries, setLogbookEntries] = useState<DailyLogbookEntry[]>(() => {
  const saved = localStorage.getItem('pvt_logbook_entries');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Gagal memuat data tersimpan', e);
    }
  }
  return DEFAULT_LOGBOOK_ENTRIES;
});

  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [activitiesOverride, setActivitiesOverride] = useState<Record<string, PeriodActivityRow[]>>({});
  const [extraPhotos, setExtraPhotos] = useState<DocumentationPhoto[]>([]);

  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isEditReportModalOpen, setIsEditReportModalOpen] = useState(false); // <-- State untuk modal editor laporan

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

  const handleExportWord = async () => {
    try {
      setIsExportingWord(true);
      const wordBlob = await generateWordReport({ periodType, periodTitleCaps, periodLabelNormal, year: selectedYear, profile, activities: activeActivities, photos: activePhotos, endDateStr: defaultEndDate });
      
      const fileName = `Laporan_Kinerja_${periodLabelNormal.replace(/\s+/g, '_')}_${profile.nama.replace(/\s+/g, '_')}.docx`;
      const url = window.URL.createObjectURL(wordBlob);
      
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 500);

    } catch (err: any) {
      console.error('Failed to export Word document:', err);
      alert('Gagal mendownload file Word. Error: ' + err.message);
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
      <header className="bg-slate-900/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-30 shadow-sm no-print">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex flex-col gap-4">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                onClick={() => setIsLogoModalOpen(true)}
                className="relative group w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-800/80 border border-white/10 hover:border-emerald-500 flex items-center justify-center overflow-hidden shrink-0 cursor-pointer shadow-sm transition-all p-1"
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
                  <span className="hidden md:inline-block text-[10px] uppercase font-bold tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.5 rounded-md">Kementan RI</span>
                </div>
                <p className="text-[11px] text-slate-300 truncate max-w-[200px] sm:max-w-md font-medium">Pusat Pelindungan Varietas Tanaman dan Perizinan Pertanian</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setIsGoogleDriveModalOpen(true)}
                className={`p-2 rounded-full border transition-all cursor-pointer shadow-sm ${
                  currentUser
                    ? 'bg-emerald-500/20 border-emerald-400/30 hover:bg-emerald-500/30 text-emerald-300'
                    : 'bg-white/10 border-white/20 hover:bg-white/20 text-slate-200'
                }`}
                title={currentUser ? 'Drive Aktif' : 'Sync Cloud Drive'}
              >
                <Cloud className={`w-4 h-4 sm:w-5 sm:h-5 ${currentUser ? 'text-emerald-400' : 'text-slate-300'}`} />
              </button>

              <button
                type="button"
                onClick={() => setIsProfileModalOpen(true)}
                className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-white/20 hover:border-emerald-500 transition-colors shadow-sm cursor-pointer shrink-0"
                title="Buka Profil & Pejabat"
              >
                {profile.profileImageUrl ? (
                  <img src={profile.profileImageUrl} alt="Profil" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-slate-300" />
                  </div>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center bg-black/20 p-1 rounded-xl border border-white/10 w-fit">
              <button
                type="button"
                onClick={() => setActiveTab('logbook')}
                className={`flex items-center space-x-2 px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'logbook' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                <span>Isi Logbook</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === 'logbook' ? 'bg-emerald-800 text-emerald-100' : 'bg-white/10 text-slate-300'}`}>
                  {logbookEntries.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('report')}
                className={`flex items-center space-x-2 px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'report' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Laporan A4</span>
              </button>
            </div>

            {activeTab === 'report' && (
              <button
                type="button"
                onClick={() => setIsPeriodHidden(!isPeriodHidden)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-black/30 hover:bg-black/50 text-slate-200 border border-white/10 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm"
              >
                {isPeriodHidden ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-amber-400" />}
                <span>{isPeriodHidden ? 'Show Periode' : 'Hide'}</span>
              </button>
            )}
          </div>
        </div>

        {activeTab === 'report' && !isPeriodHidden && (
          <PeriodSelector
            periodType={periodType} setPeriodType={setPeriodType} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} selectedQuarter={selectedQuarter} setSelectedQuarter={setSelectedQuarter} selectedYear={selectedYear} setSelectedYear={setSelectedYear} activeSummary={activeSummary}
          />
        )}

        {activeTab === 'report' && (
          <div className="bg-black/20 px-4 py-2.5 border-t border-white/10 text-xs backdrop-blur-md">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 overflow-x-auto">
              
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <button type="button" onClick={() => setIsActivityModalOpen(true)} className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-lg border border-white/10 shadow-sm transition-colors cursor-pointer font-medium whitespace-nowrap">
                  <ListPlus className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Kustom Tabel 1</span>
                </button>
                <button type="button" onClick={() => setIsPhotoModalOpen(true)} className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-lg border border-white/10 shadow-sm transition-colors cursor-pointer font-medium whitespace-nowrap">
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tambah Foto</span>
                </button>
                <button type="button" onClick={() => setIsSignatureModalOpen(true)} className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-lg border border-white/10 shadow-sm transition-colors cursor-pointer font-medium whitespace-nowrap">
                  <PenTool className="w-3.5 h-3.5 text-purple-400" />
                  <span>Tanda Tangan</span>
                </button>

                <div className="w-px h-5 bg-white/10 mx-1 hidden sm:block"></div>

                <button type="button" onClick={handleExportWord} disabled={isExportingWord} className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer whitespace-nowrap">
                  <FileDown className="w-3.5 h-3.5 text-blue-100" />
                  <span>Word</span>
                </button>
                <button type="button" onClick={handleExportPdf} disabled={isExportingPdf} className="flex items-center space-x-1 bg-rose-600 hover:bg-rose-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer whitespace-nowrap">
                  <Download className="w-3.5 h-3.5 text-rose-100" />
                  <span>PDF</span>
                </button>
                
                {/* Tombol dengan ikon pensil sekarang membuka Modal Edit Laporan */}
                <button type="button" onClick={() => setIsEditReportModalOpen(true)} className="flex items-center space-x-1 bg-slate-700 hover:bg-slate-600 text-slate-100 border border-slate-500 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap" title="Edit Teks Laporan">
                  <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Edit Teks</span>
                </button>

                <div className="flex items-center space-x-1 bg-slate-900/60 p-1 rounded-lg border border-white/10 shadow-sm text-slate-200 ml-1">
                  <button type="button" onClick={() => setZoomLevel((prev) => Math.max(50, prev - 10))} className="p-1 hover:bg-slate-700 rounded cursor-pointer" title="Perkecil"><ZoomOut className="w-3.5 h-3.5" /></button>
                  <span className="text-[11px] font-bold px-1 min-w-8 text-center">{zoomLevel}%</span>
                  <button type="button" onClick={() => setZoomLevel((prev) => Math.min(150, prev + 10))} className="p-1 hover:bg-slate-700 rounded cursor-pointer" title="Perbesar"><ZoomIn className="w-3.5 h-3.5" /></button>
                  <button type="button" onClick={() => setZoomLevel(100)} className="p-1 hover:bg-slate-700 rounded cursor-pointer" title="Reset"><Maximize2 className="w-3.5 h-3.5" /></button>
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
      <EditReportModal isOpen={isEditReportModalOpen} onClose={() => setIsEditReportModalOpen(false)} periodLabelNormal={periodLabelNormal} year={selectedYear} />
      
      <GoogleDriveSyncModal
        isOpen={isGoogleDriveModalOpen} onClose={() => setIsGoogleDriveModalOpen(false)} currentUser={currentUser} onAuthChange={(user) => setCurrentUser(user)} logbookEntries={logbookEntries} profile={profile} activePeriodType={periodType} periodTitleCaps={periodTitleCaps} periodLabelNormal={periodLabelNormal} selectedYear={selectedYear} activities={activeActivities} defaultEndDate={defaultEndDate} onRestoreEntries={(restoredEntries) => setLogbookEntries(restoredEntries)}
      />
    </div>
  );
}
