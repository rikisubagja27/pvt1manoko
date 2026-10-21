import React from 'react';
import { UserProfile } from '../types';
import { A4Page } from './A4Page';

interface ReportBab1Props {
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
    <>
      {/* Page 2: BAB I PENDAHULUAN - 1.1 LATAR BELAKANG */}
      <A4Page
        pageNumber={startPageNumber}
        paddingClassName="pt-[30mm] pb-[25mm] px-[28mm]"
      >
        <div className="text-slate-900 select-text leading-relaxed">
          {/* Section Header */}
          <div className="text-center mb-10">
            <h2 className="text-[16px] font-bold tracking-wide uppercase">BAB I</h2>
            <h3 className="text-[16px] font-bold tracking-wide uppercase">PENDAHULUAN</h3>
          </div>

          {/* 1.1 LATAR BELAKANG */}
          <div className="space-y-4">
            <h4 className="text-[14px] font-bold uppercase tracking-wide">
              1.1 LATAR BELAKANG
            </h4>

            <div className="space-y-5 text-[13.5px] text-justify leading-[1.8] text-slate-900 indent-8">
              <p>
                Dalam rangka mendukung kelancaran pelaksanaan tugas dan fungsi organisasi,
                diperlukan dukungan sumber daya manusia yang mampu melaksanakan kegiatan
                operasional dan pelayanan perkantoran secara efektif, tertib, dan
                berkesinambungan. Salah satu bentuk dukungan tersebut dilaksanakan melalui
                penempatan {profile.statusPegawai} pada jabatan {profile.jabatan}.
              </p>

              <p>
                {profile.statusPegawai} pada jabatan tersebut memiliki peran dalam membantu
                pelaksanaan kegiatan administrasi, layanan internal, pengelolaan kebutuhan
                umum, penataan dokumen, pengelolaan sarana dan prasarana, serta dukungan
                terhadap berbagai kegiatan kedinasan. Pelaksanaan tugas tersebut diperlukan
                untuk memastikan kegiatan operasional kantor dapat berjalan dengan baik dan
                memberikan pelayanan yang optimal kepada pegawai maupun unit kerja.
              </p>

              <p>
                Sejalan dengan kebutuhan organisasi, pelaksanaan tugas {profile.statusPegawai} perlu
                diarahkan secara jelas berdasarkan peran, tanggung jawab, dan hasil yang
                diharapkan. Oleh karena itu, diperlukan uraian mengenai ruang lingkup pekerjaan
                dan hasil pelaksanaan sebagai dasar dalam pengelolaan, pemantauan, dan evaluasi
                kinerja {profile.statusPegawai}.
              </p>
            </div>
          </div>
        </div>
      </A4Page>

      {/* Page 3: 1.2 TUJUAN & 1.3 WAKTU PELAKSANAAN */}
      <A4Page
        pageNumber={startPageNumber + 1}
        paddingClassName="pt-[30mm] pb-[25mm] px-[28mm]"
      >
        <div className="text-slate-900 select-text leading-relaxed space-y-10">
          {/* 1.2 TUJUAN */}
          <div className="space-y-4">
            <h4 className="text-[14px] font-bold uppercase tracking-wide">
              1.2 TUJUAN
            </h4>
            <p className="text-[13.5px] text-justify leading-[1.8] text-slate-900 indent-8">
              Tujuan penyusunan laporan pelaksanaan tugas dan fungsi jabatan {profile.jabatan},
              adalah sebagai bentuk pertanggungjawaban kinerja pegawai di lingkungan {profile.instansi},
              sesuai dengan uraian tugas yang tercantum dalam Matriks Peran Hasil (MPH) yang ditetapkan.
            </p>
          </div>

          {/* 1.3 WAKTU PELAKSANAAN */}
          <div className="space-y-4">
            <h4 className="text-[14px] font-bold uppercase tracking-wide">
              1.3 WAKTU PELAKSANAAN
            </h4>
            <p className="text-[13.5px] text-justify leading-[1.8] text-slate-900 indent-8">
              Kegiatan {profile.jabatan} dilaksanakan di {profile.lokasiSpesifik} pada periode{' '}
              <span className="font-semibold text-slate-900">{periodLabelNormal}</span>.
            </p>
          </div>
        </div>
      </A4Page>
    </>
  );
};
