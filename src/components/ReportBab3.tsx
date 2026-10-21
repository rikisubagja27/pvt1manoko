import React from 'react';
import { UserProfile } from '../types';
import { A4Page } from './A4Page';
import { SignatureGraphic } from './SignatureGraphic';

interface ReportBab3Props {
  periodLabelNormal: string;
  profile: UserProfile;
  endDateStr: string;
  pageNumber: number;
}

export const ReportBab3: React.FC<ReportBab3Props> = ({
  periodLabelNormal,
  profile,
  endDateStr,
  pageNumber,
}) => {
  const displayDate = profile.tanggalTtd || endDateStr;

  return (
    <A4Page
      pageNumber={pageNumber}
      paddingClassName="pt-[30mm] pb-[25mm] px-[28mm]"
    >
      <div className="text-slate-900 select-text leading-relaxed flex flex-col justify-between h-full">
        <div>
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-[16px] font-bold tracking-wide uppercase">BAB III</h2>
            <h3 className="text-[16px] font-bold tracking-wide uppercase">PENUTUP</h3>
          </div>

          {/* Text Content */}
          <div className="space-y-6 text-[13.5px] text-justify leading-[1.8] indent-8">
            <p>
              Pada <span className="font-semibold text-slate-900">{periodLabelNormal}</span>, pelaksanaan
              tugas {profile.statusPegawai} jabatan {profile.jabatan} telah mendukung
              kelancaran operasional KPS PVT I Manoko. Kegiatan utama meliputi pengolahan lahan,
              pemeliharaan, penyiraman, penyiangan dan pengendalian gulma, panen dan penanganan
              hasil panen, serta pelaksanaan uji BUSS, pembersihan area kerja, pemeliharaan sarana
              pendukung, dan dukungan kegiatan lainnya yang berhubungan dengan kegiatan operasional
              kebun. Secara umum kegiatan terlaksana secara tertib, efektif, dan sesuai dengan tugas
              serta mendukung pencapaian tujuan dan kelancaran tugas organisasi.
            </p>

            <p>
              Demikian laporan ini disampaikan. Atas perhatian dan kerjasamanya, diucapkan terima
              kasih.
            </p>
          </div>
        </div>

        {/* Signature Section right-aligned */}
        <div className="flex justify-end pt-12 pr-4 pb-8">
          <div className="w-64 text-left">
            <p className="text-[14px] text-slate-800">
              {profile.lokasiTtd}, {displayDate}
            </p>
            <p className="text-[14px] font-normal text-slate-800 mb-2">
              {profile.jabatan}
            </p>

            {/* Signature Area */}
            <div className="h-24 flex items-center justify-start my-1 -ml-3">
              {profile.useDigitalSignature ? (
                <SignatureGraphic customSignatureUrl={profile.signatureImage} width={175} height={75} />
              ) : (
                <div className="h-20" />
              )}
            </div>

            {/* Name & NIP */}
            <div className="mt-2">
              <p className="text-[14.5px] font-bold text-slate-900">
                {profile.nama}
              </p>
              <p className="text-[13.5px] font-semibold text-slate-800">
                {profile.nip}
              </p>
            </div>
          </div>
        </div>
      </div>
    </A4Page>
  );
};
