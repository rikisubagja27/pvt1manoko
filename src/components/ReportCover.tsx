import React from 'react';
import { UserProfile } from '../types';
import { A4Page } from './A4Page';
import { KementanLogo } from './KementanLogo';

interface ReportCoverProps {
  periodTitleCaps: string;
  year: number;
  profile: UserProfile;
}

export const ReportCover: React.FC<ReportCoverProps> = ({
  periodTitleCaps,
  year,
  profile,
}) => {
  return (
    <A4Page
      pageNumber={1}
      showPageNumber={false}
      paddingClassName="pt-[35mm] pb-[35mm] px-[28mm]"
    >
      <div className="flex flex-col items-center justify-between h-full text-center text-slate-900 select-text">
        {/* Top Title Section */}
        <div className="space-y-2">
          <h1 className="text-[21px] font-bold tracking-wide uppercase leading-snug">
            LAPORAN KINERJA
          </h1>
          <h2 className="text-[19px] font-bold tracking-wide uppercase leading-snug">
            PELAKSANAAN TUGAS OPERASIONAL KANTOR
          </h2>
          <h3 className="text-[19px] font-bold tracking-wide uppercase leading-snug text-emerald-950 print:text-black">
            {periodTitleCaps}
          </h3>
        </div>

        {/* Central Logo */}
        <div className="my-10 flex items-center justify-center">
          <KementanLogo size={150} />
        </div>

        {/* Author & Unit Section */}
        <div className="w-full space-y-9">
          <div>
            <p className="text-[15px] font-medium text-slate-800 mb-4">Disusun oleh :</p>
            <p className="text-[17px] font-bold tracking-wide text-slate-900 uppercase">
              {profile.nama}
            </p>
            <p className="text-[15px] font-semibold text-slate-800 tracking-wider mt-1">
              {profile.nip}
            </p>
            <p className="text-[15px] font-normal text-slate-700 mt-5">
              {profile.jabatan}
            </p>
          </div>

          <div className="pt-8 space-y-1">
            <p className="text-[15px] font-bold uppercase tracking-wide leading-snug">
              {profile.instansi}
            </p>
            <p className="text-[16px] font-bold">{year}</p>
          </div>
        </div>
      </div>
    </A4Page>
  );
};
