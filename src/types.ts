export type PeriodType = 'bulanan' | 'triwulan' | 'tahunan';

export type MonthName =
  | 'Januari'
  | 'Februari'
  | 'Maret'
  | 'April'
  | 'Mei'
  | 'Juni'
  | 'Juli'
  | 'Agustus'
  | 'September'
  | 'Oktober'
  | 'November'
  | 'Desember';

export type QuarterName =
  | 'Triwulan I'
  | 'Triwulan II'
  | 'Triwulan III'
  | 'Triwulan IV';

export interface UserProfile {
  nama: string;
  nip: string;
  jabatan: string;
  statusPegawai: string;
  satuanKerja: string;
  lokasiSpesifik: string;
  instansi: string;
  lokasiTtd: string;
  tanggalTtd: string;
  signatureImage?: string;
  useDigitalSignature: boolean;
}

export interface ActivityCategoryItem {
  category: string;
  details: string;
}

export interface PeriodActivityRow {
  id: string;
  periodLabel: string; // e.g. "Juli" or "14 September 2026" or "Triwulan I"
  subLabel?: string;
  items: ActivityCategoryItem[];
  keterangan?: string;
}

export interface DocumentationPhoto {
  id: string;
  title: string;
  imageUrl: string;
  fotoSebelumUrl?: string; // Foto sebelum kegiatan (0%)
  fotoSesudahUrl?: string; // Foto sesudah kegiatan (100%)
  dateStr?: string;
  timeStr?: string;
  coordinates?: string;
  locationName?: string;
  elevation?: string;
  speed?: string;
  direction?: string;
  showGpsBadge?: boolean;
  periodKey?: string;
}

export type AttendanceStatus = 'WFO' | 'Sakit' | 'Cuti';

export interface DailyLogbookEntry {
  id: string;
  kehadiran: AttendanceStatus; // WFO, Sakit, Cuti
  tanggal: string; // YYYY-MM-DD
  jamMulai?: string; // e.g. "07:30"
  jamSelesai?: string; // e.g. "12:00"
  kategori?: string;
  lokasiBlok?: string;
  uraianPekerjaan: string;
  luasLokasi?: string; // Luas lokasi pekerjaan (m²), kosongi atau (-) jika tidak diketahui
  keterangan?: string;
  fotoUrl?: string; // single photo
  fotoTitle?: string;
  fotoSebelumUrl?: string; // Foto sebelum kegiatan
  fotoSesudahUrl?: string; // Foto sesudah kegiatan
  fotoSuratSakitUrl?: string; // Foto bukti surat keterangan dokter / surat sakit
  showInReport?: boolean;
}

export interface ReportConfig {
  periodType: PeriodType;
  selectedMonth: number; // 1 - 12
  selectedQuarter: number; // 1 - 4
  selectedYear: number;
  customReportTitle?: string;
  customDate?: string;
}
