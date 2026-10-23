import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  googleSignIn,
  logout,
} from '../services/firebaseAuth';
import {
  uploadFileToDrive,
  listAppFiles,
  downloadFileContent,
  deleteFileFromDrive,
  DriveFileItem,
} from '../services/googleDriveService';
import { DailyLogbookEntry, PeriodActivityRow, PeriodType, UserProfile } from '../types';
import { exportReportToWord } from '../utils/wordExport';
import { exportReportToPdf } from '../utils/pdfExport';
import {
  Cloud,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  FileText,
  FileDown,
  RotateCcw,
  Trash2,
  ExternalLink,
  LogOut,
  RefreshCw,
  FolderOpen,
  X,
  ShieldCheck,
} from 'lucide-react';

export interface GoogleDriveSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onAuthChange: (user: User | null) => void;
  logbookEntries: DailyLogbookEntry[];
  profile: UserProfile;
  activePeriodType: PeriodType;
  periodTitleCaps: string;
  periodLabelNormal: string;
  selectedYear: number;
  activities: PeriodActivityRow[];
  defaultEndDate: string;
  onRestoreEntries: (entries: DailyLogbookEntry[]) => void;
}

export const GoogleDriveSyncModal: React.FC<GoogleDriveSyncModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthChange,
  logbookEntries,
  profile,
  activePeriodType,
  periodTitleCaps,
  periodLabelNormal,
  selectedYear,
  activities,
  defaultEndDate,
  onRestoreEntries,
}) => {
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  // Confirmation dialog states for destructive actions
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText: string;
    onConfirm: () => Promise<void>;
  } | null>(null);

  useEffect(() => {
    if (isOpen && currentUser) {
      loadDriveFiles();
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const loadDriveFiles = async () => {
    try {
      setIsLoadingFiles(true);
      const files = await listAppFiles();
      setDriveFiles(files);
    } catch (err: any) {
      console.error('Error loading files:', err);
      setSyncStatusMsg({
        type: 'error',
        text: `Gagal memuat berkas: ${err.message || 'Periksa koneksi Google Drive'}`,
      });
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setIsSyncing(true);
      setSyncStatusMsg(null);
      const res = await googleSignIn();
      if (res?.user) {
        onAuthChange(res.user);
        setSyncStatusMsg({
          type: 'success',
          text: `Berhasil terhubung ke akun Gmail (${res.user.email})!`,
        });
        await loadDriveFiles();
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      setSyncStatusMsg({
        type: 'error',
        text: `Gagal login Google: ${err.message || 'Izin Google Drive diperlukan'}`,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      onAuthChange(null);
      setDriveFiles([]);
      setSyncStatusMsg({
        type: 'info',
        text: 'Anda telah keluar dari akun Google.',
      });
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  // 1. Backup all logbook data as JSON to Google Drive
  const handleBackupData = async () => {
    try {
      setIsSyncing(true);
      setSyncStatusMsg(null);
      const nowStr = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `Logbook_Backup_${nowStr}.json`;

      const backupPayload = {
        app: 'Logbook Kinerja PVT I Manoko',
        version: '1.0',
        exportedAt: new Date().toISOString(),
        profile,
        logbookEntries,
      };

      await uploadFileToDrive({
        fileName,
        mimeType: 'application/json',
        content: JSON.stringify(backupPayload, null, 2),
        description: `Cadangan data logbook ${logbookEntries.length} entri tanggal ${new Date().toLocaleDateString('id-ID')}`,
      });

      setSyncStatusMsg({
        type: 'success',
        text: `Cadangan data (${logbookEntries.length} entri) berhasil disimpan ke Google Drive!`,
      });
      await loadDriveFiles();
    } catch (err: any) {
      console.error('Backup error:', err);
      setSyncStatusMsg({
        type: 'error',
        text: `Gagal mencadangkan data: ${err.message}`,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // 2. Export Word .docx directly to Google Drive
  const handleUploadWordToDrive = async () => {
    try {
      setIsSyncing(true);
      setSyncStatusMsg(null);
      
      const fileName = `Laporan_Kinerja_${periodLabelNormal.replace(/\s+/g, '_')}_${profile.nama.replace(/\s+/g, '_')}.docx`;
      
      const wordBuffer = await exportReportToWord({
        periodType: activePeriodType,
        periodTitleCaps,
        periodLabelNormal,
        year: selectedYear,
        profile,
        activities,
        photos: [], // Anda bisa mengirim activePhotos ke sini jika diperlukan dari App.tsx
        endDateStr: defaultEndDate,
        returnBuffer: true // Menandakan bahwa kita butuh Blob/Buffer, bukan download otomatis
      });

      await uploadFileToDrive({
        fileName,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        content: wordBuffer as Blob,
        description: `Dokumen Word Laporan Kinerja ${periodLabelNormal} ${selectedYear}`,
      });

      setSyncStatusMsg({
        type: 'success',
        text: `Dokumen Word (${fileName}) berhasil disimpan langsung ke Google Drive!`,
      });
      await loadDriveFiles();
    } catch (err: any) {
      console.error('Upload Word error:', err);
      setSyncStatusMsg({
        type: 'error',
        text: `Gagal mengupload Word ke Google Drive: ${err.message}`,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // 3. Export PDF directly to Google Drive
  const handleUploadPdfToDrive = async () => {
    try {
      setIsSyncing(true);
      setSyncStatusMsg(null);

      const fileName = `Laporan_Kinerja_${periodLabelNormal.replace(/\s+/g, '_')}_${profile.nama.replace(/\s+/g, '_')}.pdf`;

      const pdfBlob = await exportReportToPdf({
        fileName: fileName,
        elementId: 'report-print-container',
        returnBlob: true // Menandakan bahwa kita butuh Blob, bukan download otomatis
      });

      await uploadFileToDrive({
        fileName,
        mimeType: 'application/pdf',
        content: pdfBlob as Blob,
        description: `Dokumen PDF Laporan Kinerja ${periodLabelNormal} ${selectedYear}`,
      });

      setSyncStatusMsg({
        type: 'success',
        text: `Dokumen PDF (${fileName}) berhasil disimpan langsung ke Google Drive!`,
      });
      await loadDriveFiles();
    } catch (err: any) {
      console.error('Upload PDF error:', err);
      setSyncStatusMsg({
        type: 'error',
        text: `Gagal mengupload PDF ke Google Drive: ${err.message}`,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // 4. Restore backup file (with explicit confirmation prompt as required by Skill)
  const triggerRestorePrompt = (file: DriveFileItem) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Pulihkan Data Logbook dari Google Drive?',
      description: `Apakah Anda yakin ingin memulihkan entri logbook dari berkas "${file.name}"? Data logbook saat ini akan diperbarui dengan data dari cadangan Google Drive ini.`,
      confirmText: 'Ya, Pulihkan Data',
      onConfirm: async () => {
        try {
          setIsSyncing(true);
          const rawText = await downloadFileContent(file.id);
          const parsed = JSON.parse(rawText);
          if (parsed && Array.isArray(parsed.logbookEntries)) {
            onRestoreEntries(parsed.logbookEntries);
            setSyncStatusMsg({
              type: 'success',
              text: `Data logbook berhasil dipulihkan (${parsed.logbookEntries.length} entri) dari Google Drive!`,
            });
          } else {
            throw new Error('Format berkas cadangan tidak sesuai.');
          }
        } catch (err: any) {
          setSyncStatusMsg({
            type: 'error',
            text: `Gagal memulihkan data: ${err.message}`,
          });
        } finally {
          setIsSyncing(false);
          setConfirmDialog(null);
        }
      },
    });
  };

  // 5. Delete file prompt (with explicit confirmation prompt as required by Skill)
  const triggerDeletePrompt = (file: DriveFileItem) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Hapus Berkas dari Google Drive?',
      description: `Apakah Anda yakin ingin menghapus berkas "${file.name}" dari Google Drive Anda? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: 'Hapus Berkas',
      onConfirm: async () => {
        try {
          setIsSyncing(true);
          await deleteFileFromDrive(file.id);
          setSyncStatusMsg({
            type: 'success',
            text: `Berkas "${file.name}" berhasil dihapus dari Google Drive.`,
          });
          await loadDriveFiles();
        } catch (err: any) {
          setSyncStatusMsg({
            type: 'error',
            text: `Gagal menghapus berkas: ${err.message}`,
          });
        } finally {
          setIsSyncing(false);
          setConfirmDialog(null);
        }
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold">Sinkronisasi Google Drive</h2>
                <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  Workspace
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Hubungkan akun Gmail untuk menyimpan cadangan dan berkas laporan langsung di Drive Anda
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Status Alert Notification */}
          {syncStatusMsg && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-start space-x-2.5 ${
                syncStatusMsg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : syncStatusMsg.type === 'error'
                  ? 'bg-red-50 border-red-200 text-red-900'
                  : 'bg-blue-50 border-blue-200 text-blue-900'
              }`}
            >
              {syncStatusMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 font-medium">{syncStatusMsg.text}</div>
            </div>
          )}

          {/* User Auth Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            {currentUser ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'User'}
                      className="w-12 h-12 rounded-full border-2 border-emerald-500 shrink-0 shadow-xs"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold text-lg flex items-center justify-center shrink-0">
                      {currentUser.displayName ? currentUser.displayName[0] : 'G'}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-bold text-slate-900">
                        {currentUser.displayName || 'Pengguna Google'}
                      </p>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Tersinkronisasi</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{currentUser.email}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Folder Drive: <strong>Logbook Kinerja PVT Manoko</strong>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-slate-200/70 rounded-lg transition-colors flex items-center space-x-1 self-start sm:self-auto cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-4 px-2">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 mx-auto flex items-center justify-center mb-3">
                  <Cloud className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Masuk dengan Akun Gmail Anda
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                  Dengan menghubungkan Google Drive, seluruh data logbook harian, berkas Word, dan berkas PDF tersimpan aman di penyimpanan cloud Google pribadi Anda.
                </p>

                {/* Official Material Google Sign In Button */}
                <button
                  type="button"
                  onClick={handleSignIn}
                  disabled={isSyncing}
                  className="inline-flex items-center space-x-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold px-5 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  <span className="text-xs font-bold">
                    {isSyncing ? 'Menghubungkan...' : 'Masuk dengan Akun Gmail / Google'}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Sync Actions (Only if authenticated) */}
          {currentUser && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Tindakan Sinkronisasi Google Drive
                </h3>
                <span className="text-[11px] text-slate-500">
                  {logbookEntries.length} entri aktif
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Backup JSON */}
                <button
                  type="button"
                  onClick={handleBackupData}
                  disabled={isSyncing}
                  className="flex flex-col items-start p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-50 text-emerald-950 transition-all text-left cursor-pointer hover:shadow-xs disabled:opacity-50"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center mb-2 shadow-xs">
                    <UploadCloud className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold">Cadangkan Data</p>
                  <p className="text-[11px] text-emerald-800/80 mt-0.5">
                    Simpan semua entri logbook ke Google Drive (JSON)
                  </p>
                </button>

                {/* 2. Upload Word */}
                <button
                  type="button"
                  onClick={handleUploadWordToDrive}
                  disabled={isSyncing}
                  className="flex flex-col items-start p-3.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-50 text-blue-950 transition-all text-left cursor-pointer hover:shadow-xs disabled:opacity-50"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center mb-2 shadow-xs">
                    <FileDown className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold">Upload Dokumen Word</p>
                  <p className="text-[11px] text-blue-800/80 mt-0.5">
                    Kirim laporan lengkap (.docx) ke Google Drive
                  </p>
                </button>

                {/* 3. Upload PDF */}
                <button
                  type="button"
                  onClick={handleUploadPdfToDrive}
                  disabled={isSyncing}
                  className="flex flex-col items-start p-3.5 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-50 text-rose-950 transition-all text-left cursor-pointer hover:shadow-xs disabled:opacity-50"
                >
                  <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center mb-2 shadow-xs">
                    <FileText className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold">Upload Dokumen PDF</p>
                  <p className="text-[11px] text-rose-800/80 mt-0.5">
                    Kirim dokumen cetak (.pdf) ke Google Drive
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Files List in Drive */}
          {currentUser && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FolderOpen className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Berkas di Folder Google Drive Anda
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={loadDriveFiles}
                  disabled={isLoadingFiles}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1 cursor-pointer"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${isLoadingFiles ? 'animate-spin' : ''}`}
                  />
                  <span>Segarkan</span>
                </button>
              </div>

              {isLoadingFiles ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto text-blue-500 mb-2" />
                  <span>Memeriksa berkas di Google Drive...</span>
                </div>
              ) : driveFiles.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl text-slate-500 text-xs">
                  Belum ada berkas yang disinkronkan. Klik salah satu tombol cadangan di atas untuk menyimpan ke Google Drive.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-56 overflow-y-auto">
                  {driveFiles.map((file) => {
                    const isJsonBackup =
                      file.name.endsWith('.json') || file.mimeType.includes('json');
                    const isDocx = file.name.endsWith('.docx');
                    const isPdf = file.name.endsWith('.pdf');

                    return (
                      <div
                        key={file.id}
                        className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              isJsonBackup
                                ? 'bg-emerald-100 text-emerald-700'
                                : isDocx
                                ? 'bg-blue-100 text-blue-700'
                                : isPdf
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {isJsonBackup ? (
                              <UploadCloud className="w-4 h-4" />
                            ) : isDocx ? (
                              <FileDown className="w-4 h-4" />
                            ) : (
                              <FileText className="w-4 h-4" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {new Date(file.createdTime).toLocaleString('id-ID')}
                            </p>
                          </div>
                        </div>

                        {/* File Action Buttons */}
                        <div className="flex items-center space-x-1 shrink-0">
                          {isJsonBackup && (
                            <button
                              type="button"
                              onClick={() => triggerRestorePrompt(file)}
                              disabled={isSyncing}
                              className="px-2 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors flex items-center space-x-1 cursor-pointer"
                              title="Pulihkan data logbook dari cadangan ini"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span className="hidden sm:inline">Pulihkan</span>
                            </button>
                          )}

                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                              title="Buka di Google Drive"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => triggerDeletePrompt(file)}
                            disabled={isSyncing}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                            title="Hapus berkas dari Google Drive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Izin Google Drive aktif untuk akun Anda</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>

      {/* Confirmation Dialog for Destructive Actions (Skill Requirement) */}
      {confirmDialog && confirmDialog.isOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{confirmDialog.title}</h4>
                <p className="text-xs text-slate-600 mt-1">{confirmDialog.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDialog.onConfirm}
                className="px-4 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs cursor-pointer"
              >
                {confirmDialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
