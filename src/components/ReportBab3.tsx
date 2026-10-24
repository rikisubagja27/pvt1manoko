import React from 'react';
import { UserProfile } from '../types';

export interface ReportBab3Props {
  periodLabelNormal: string;
  profile: UserProfile;
  endDateStr?: string;
  pageNumber: number;
}

export const ReportBab3: React.FC<ReportBab3Props> = ({
  periodLabelNormal,
  profile,
  endDateStr,
  pageNumber,
}) => {
  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-black p-[20mm] shadow-2xl flex flex-col justify-between font-['Arial'] text-[12pt] leading-relaxed relative box-border print:shadow-none print:w-full print:m-0 print:break-after-page">
      <div className="space-y-6">
        {/* Header Bab III */}
        <div className="text-center mb-8">
          <p className="font-bold text-[14pt]">BAB III</p>
          <p className="font-bold text-[14pt]">PENUTUP</p>
        </div>

        {/* Paragraf Penutup (Bisa diketik langsung / Live Editing) */}
        <div
          contentEditable
          suppressContentEditableWarning
          className="outline-none focus:bg-amber-50/50 p-1 rounded transition-colors text-justify leading-relaxed"
          title="Klik untuk langsung mengedit teks kesimpulan penutup"
        >
          Pada {periodLabelNormal} Tahun 2026, pelaksanaan tugas PPPK Paruh Waktu jabatan Operator Layanan Operasional telah mendukung kelancaran operasional KPS PVT I Manoko. Kegiatan utama meliputi pengolahan lahan, pemeliharaan, penyiraman, penyiangan dan pengendalian gulma, panen dan penanganan hasil panen, serta pelaksanaan uji BUSS, pembersihan area kerja, pemeliharaan sarana pendukung, dan dukungan kegiatan lainnya yang berhubungan dengan kegiatan operasional kebun. Secara umum kegiatan terlaksana secara tertib, efektif, dan sesuai dengan tugas serta mendukung pencapaian tujuan dan kelancaran tugas organisasi.
        </div>

        <div
          contentEditable
          suppressContentEditableWarning
          className="outline-none focus:bg-amber-50/50 p-1 rounded transition-colors text-justify"
          title="Klik untuk langsung mengedit kalimat penutup"
        >
          Demikian laporan ini disampaikan. Atas perhatian dan kerjasamanya, diucapkan terima kasih.
        </div>
      </div>

      {/* Bagian Tanda Tangan */}
      <div className="mt-12 flex flex-col items-end">
        <div className="text-right space-y-1">
          <p>Bandung Barat, {endDateStr || '30 Juni 2026'}</p>
          <p>Operator Layanan Operasional</p>
          <div className="h-16"></div> {/* Ruang kosong tanda tangan */}
          <p className="font-bold underline">{profile?.nama || 'RIKI SUBAGJA'}</p>
          <p>NIP. {profile?.nip || '199808272025211042'}</p>
        </div>
      </div>

      {/* Nomor Halaman */}
      <div className="text-center pt-8 text-[11pt] text-slate-600 print:text-black">
        - {pageNumber} -
      </div>
    </div>
  );
};
