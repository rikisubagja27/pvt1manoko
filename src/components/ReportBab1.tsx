import React from 'react';
import { UserProfile } from '../types';

export interface ReportBab1Props {
  periodLabelNormal: string;
  profile: UserProfile;
  startPageNumber: number;
}

export const ReportBab1: React.FC<ReportBab1Props> = ({
  periodLabelNormal,
  profile,
  startPageNumber,
}) => {
  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-black p-[20mm] shadow-2xl flex flex-col justify-between font-['Arial'] text-[12pt] leading-relaxed relative box-border print:shadow-none print:w-full print:m-0 print:break-after-page">
      <div className="space-y-6">
        {/* Header Bab I */}
        <div className="text-center mb-8">
          <p className="font-bold text-[14pt]">BAB I</p>
          <p className="font-bold text-[14pt]">PENDAHULUAN</p>
        </div>

        {/* 1.1 Latar Belakang (Bisa diketik langsung / Live Editing) */}
        <div>
          <p className="font-bold mb-2">1.1 LATAR BELAKANG</p>
          <div
            contentEditable
            suppressContentEditableWarning
            className="outline-none focus:bg-amber-50/50 p-1 rounded transition-colors text-justify"
            title="Klik untuk langsung mengedit teks latar belakang"
          >
            Dalam rangka mendukung kelancaran pelaksanaan tugas dan fungsi organisasi, diperlukan dukungan sumber daya manusia yang mampu melaksanakan kegiatan operasional dan pelayanan perkantoran secara efektif, tertib, dan berkesinambungan. Salah satu bentuk dukungan tersebut dilaksanakan melalui penempatan PPPK Paruh Waktu pada jabatan Operator Layanan Operasional.
          </div>
          <div
            contentEditable
            suppressContentEditableWarning
            className="outline-none focus:bg-amber-50/50 p-1 rounded transition-colors text-justify mt-3"
            title="Klik untuk langsung mengedit teks lanjutan"
          >
            PPPK Paruh Waktu pada jabatan tersebut memiliki peran dalam membantu pelaksanaan kegiatan administrasi, layanan internal, pengelolaan kebutuhan umum, penataan dokumen, pengelolaan sarana dan prasarana, serta dukungan terhadap berbagai kegiatan kedinasan. Pelaksanaan tugas tersebut diperlukan untuk memastikan kegiatan operasional kantor dapat berjalan dengan baik dan memberikan pelayanan yang optimal kepada pegawai maupun unit kerja.
          </div>
        </div>

        {/* 1.2 Tujuan (Bisa diketik langsung) */}
        <div className="pt-2">
          <p className="font-bold mb-2">1.2 TUJUAN</p>
          <div
            contentEditable
            suppressContentEditableWarning
            className="outline-none focus:bg-amber-50/50 p-1 rounded transition-colors text-justify"
            title="Klik untuk langsung mengedit teks tujuan"
          >
            Tujuan penyusunan laporan pelaksanaan tugas dan fungsi jabatan Operator Layanan Operasional, adalah sebagai bentuk pertanggungjawaban kinerja pegawai di lingkungan Pusat Pelindungan Varietas Tanaman dan Perizinan Pertanian, sesuai dengan uraian tugas yang tercantum dalam Matriks Peran Hasil (MPH) yang ditetapkan.
          </div>
        </div>

        {/* 1.3 Waktu Pelaksanaan */}
        <div className="pt-2">
          <p className="font-bold mb-2">1.3 WAKTU PELAKSANAAN</p>
          <p className="text-justify">
            Kegiatan Operator Layanan Operasional dilaksanakan di Kebun Pemeriksaan Substantif PVT I Manoko pada satuan Kerja Kantor Pusat Pusat Pelindungan Varietas Tanaman dan Perizinan Pertanian (PVTPP) pada periode {periodLabelNormal} Tahun 2026.
          </p>
        </div>
      </div>

      {/* Nomor Halaman */}
      <div className="text-center pt-8 text-[11pt] text-slate-600 print:text-black">
        - {startPageNumber} -
      </div>
    </div>
  );
};
