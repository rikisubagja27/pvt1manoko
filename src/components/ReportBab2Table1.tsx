import React from 'react';
import { PeriodActivityRow, PeriodType, UserProfile } from '../types';
import { A4Page } from './A4Page';

interface ReportBab2Table1Props {
  periodType: PeriodType;
  periodLabelNormal: string;
  profile: UserProfile;
  activities: PeriodActivityRow[];
  startPageNumber: number;
}

export const ReportBab2Table1: React.FC<ReportBab2Table1Props> = ({
  periodType,
  periodLabelNormal,
  profile,
  activities,
  startPageNumber,
}) => {
  // Determine Column 2 Header Name according to user prompt:
  // "untuk laporan bulanan di sebelah nomor,judul tabel di isi dengan Tanggal untuk Triwulan di isi dengan bulan untuk laporan triwulan merangkum otomatis per satu bulan, untuk yang Tahunan merangkum otomatis dari semua Triwulan"
  const col2Header =
    periodType === 'bulanan' ? 'Tanggal' : periodType === 'triwulan' ? 'Bulan' : 'Triwulan';

  // If Triwulan has 3 month rows with many items (like Triwulan III Juli, Agustus, September):
  const isTriwulanThreeRows = periodType === 'triwulan' && activities.length === 3;

  if (isTriwulanThreeRows) {
    const rowJuli = activities[0];
    const rowAgustus = activities[1];
    const rowSeptember = activities[2];

    // Partition Agustus items like the PDF:
    // Page 4: items [0, 1, 2] of Agustus
    // Page 5: items [3, 4, 5] of Agustus + September
    const agustusPart1 = rowAgustus.items.slice(0, 3);
    const agustusPart2 = rowAgustus.items.slice(3);

    return (
      <>
        {/* Page 4 */}
        <A4Page
          pageNumber={startPageNumber}
          paddingClassName="pt-[28mm] pb-[25mm] px-[25mm]"
        >
          <div className="text-slate-900 select-text leading-normal">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-[16px] font-bold tracking-wide uppercase">BAB II</h2>
              <h3 className="text-[16px] font-bold tracking-wide uppercase">
                AKUNTABILITAS KINERJA
              </h3>
            </div>

            <div className="mb-4">
              <h4 className="text-[14px] font-bold uppercase tracking-wide">
                2.1 HASIL PELAKSANAAN
              </h4>
              <p className="text-[13.5px] mt-1 text-slate-800">
                Kegiatan {profile.jabatan}
              </p>
              <p className="text-[13.5px] mt-3 font-normal text-slate-800">
                Tabel 1. Rincian kegiatan operator layanan operasional {periodLabelNormal}
              </p>
            </div>

            {/* Table */}
            <table className="w-full border-collapse border border-black text-[12px] leading-tight">
              <thead>
                <tr className="bg-white">
                  <th className="border border-black px-2 py-2 w-12 text-center font-bold">
                    No.
                  </th>
                  <th className="border border-black px-3 py-2 w-28 text-center font-bold">
                    {col2Header}
                  </th>
                  <th className="border border-black px-3 py-2 text-center font-bold">
                    Rincian Pekerjaan
                  </th>
                  <th className="border border-black px-2 py-2 w-28 text-center font-bold">
                    Keterangan
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Month 1 */}
                <tr>
                  <td className="border border-black px-2 py-2 text-center align-top">
                    1
                  </td>
                  <td className="border border-black px-3 py-2 text-center align-top font-medium">
                    {rowJuli.periodLabel}
                  </td>
                  <td className="border border-black px-3 py-2 text-justify align-top">
                    <ul className="space-y-1.5 list-none pl-0">
                      {rowJuli.items.map((item, idx) => (
                        <li key={idx} className="flex items-start text-[11.5px] leading-snug">
                          <span className="mr-1.5 font-bold">•</span>
                          <span>
                            <strong className="font-semibold">{item.category}:</strong>{' '}
                            {item.details}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border border-black px-2 py-2 align-top text-center text-[11.5px]">
                    {rowJuli.keterangan || ''}
                  </td>
                </tr>

                {/* Month 2 Part 1 */}
                <tr>
                  <td className="border border-black px-2 py-2 text-center align-top">
                    2
                  </td>
                  <td className="border border-black px-3 py-2 text-center align-top font-medium">
                    {rowAgustus.periodLabel}
                  </td>
                  <td className="border border-black px-3 py-2 text-justify align-top">
                    <ul className="space-y-1.5 list-none pl-0">
                      {agustusPart1.map((item, idx) => (
                        <li key={idx} className="flex items-start text-[11.5px] leading-snug">
                          <span className="mr-1.5 font-bold">•</span>
                          <span>
                            <strong className="font-semibold">{item.category}:</strong>{' '}
                            {item.details}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border border-black px-2 py-2 align-top text-center text-[11.5px]">
                    {rowAgustus.keterangan || ''}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </A4Page>

        {/* Page 5 */}
        <A4Page
          pageNumber={startPageNumber + 1}
          paddingClassName="pt-[28mm] pb-[25mm] px-[25mm]"
        >
          <div className="text-slate-900 select-text leading-normal">
            <table className="w-full border-collapse border border-black text-[12px] leading-tight">
              <tbody>
                {/* Month 2 Part 2 */}
                <tr>
                  <td className="border border-black px-2 py-2 w-12 text-center align-top text-transparent select-none">
                    2
                  </td>
                  <td className="border border-black px-3 py-2 w-28 text-center align-top text-transparent select-none">
                    {rowAgustus.periodLabel}
                  </td>
                  <td className="border border-black px-3 py-2 text-justify align-top">
                    <ul className="space-y-1.5 list-none pl-0">
                      {agustusPart2.map((item, idx) => (
                        <li key={idx} className="flex items-start text-[11.5px] leading-snug">
                          <span className="mr-1.5 font-bold">•</span>
                          <span>
                            <strong className="font-semibold">{item.category}:</strong>{' '}
                            {item.details}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border border-black px-2 py-2 w-28 align-top text-center text-[11.5px]">
                    {rowAgustus.keterangan || ''}
                  </td>
                </tr>

                {/* Month 3 */}
                <tr>
                  <td className="border border-black px-2 py-2 text-center align-top">
                    3
                  </td>
                  <td className="border border-black px-3 py-2 text-center align-top font-medium">
                    {rowSeptember.periodLabel}
                  </td>
                  <td className="border border-black px-3 py-2 text-justify align-top">
                    <ul className="space-y-1.5 list-none pl-0">
                      {rowSeptember.items.map((item, idx) => (
                        <li key={idx} className="flex items-start text-[11.5px] leading-snug">
                          <span className="mr-1.5 font-bold">•</span>
                          <span>
                            <strong className="font-semibold">{item.category}:</strong>{' '}
                            {item.details}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border border-black px-2 py-2 align-top text-center text-[11.5px]">
                    {rowSeptember.keterangan || ''}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </A4Page>
      </>
    );
  }

  // Generic pagination for Bulanan (rows by Tanggal) and Tahunan (rows by Triwulan)
  // For Bulanan dates: 3-4 dates per page fit comfortably
  // For Tahunan quarters: 2 quarters per page
  const chunkSize = periodType === 'bulanan' ? 3 : 2;
  const pages: PeriodActivityRow[][] = [];
  for (let i = 0; i < activities.length; i += chunkSize) {
    pages.push(activities.slice(i, i + chunkSize));
  }

  return (
    <>
      {pages.map((rowChunk, pageIdx) => {
        const isFirst = pageIdx === 0;
        return (
          <A4Page
            key={pageIdx}
            pageNumber={startPageNumber + pageIdx}
            paddingClassName="pt-[28mm] pb-[25mm] px-[25mm]"
          >
            <div className="text-slate-900 select-text leading-normal">
              {isFirst && (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-[16px] font-bold tracking-wide uppercase">BAB II</h2>
                    <h3 className="text-[16px] font-bold tracking-wide uppercase">
                      AKUNTABILITAS KINERJA
                    </h3>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-[14px] font-bold uppercase tracking-wide">
                      2.1 HASIL PELAKSANAAN
                    </h4>
                    <p className="text-[13.5px] mt-1 text-slate-800">
                      Kegiatan {profile.jabatan}
                    </p>
                    <p className="text-[13.5px] mt-3 font-normal text-slate-800">
                      Tabel 1. Rincian kegiatan operator layanan operasional {periodLabelNormal}
                    </p>
                  </div>
                </>
              )}

              <table className="w-full border-collapse border border-black text-[12px] leading-tight">
                <thead>
                  <tr className="bg-white">
                    <th className="border border-black px-2 py-2 w-12 text-center font-bold">
                      No.
                    </th>
                    <th className="border border-black px-3 py-2 w-32 text-center font-bold">
                      {col2Header}
                    </th>
                    <th className="border border-black px-3 py-2 text-center font-bold">
                      Rincian Pekerjaan
                    </th>
                    <th className="border border-black px-2 py-2 w-28 text-center font-bold">
                      Keterangan
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rowChunk.map((row, idx) => {
                    const overallIndex = pageIdx * chunkSize + idx + 1;
                    return (
                      <tr key={row.id}>
                        <td className="border border-black px-2 py-2 text-center align-top">
                          {overallIndex}
                        </td>
                        <td className="border border-black px-3 py-2 text-center align-top font-medium">
                          <div>{row.periodLabel}</div>
                          {row.subLabel && (
                            <div className="text-[10.5px] text-gray-600 font-normal mt-0.5">
                              {row.subLabel}
                            </div>
                          )}
                        </td>
                        <td className="border border-black px-3 py-2 text-justify align-top">
                          <ul className="space-y-1.5 list-none pl-0">
                            {row.items.map((item, itemIdx) => (
                              <li
                                key={itemIdx}
                                className="flex items-start text-[11.5px] leading-snug"
                              >
                                <span className="mr-1.5 font-bold">•</span>
                                <span>
                                  <strong className="font-semibold">{item.category}:</strong>{' '}
                                  {item.details}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="border border-black px-2 py-2 align-top text-center text-[11.5px]">
                          {row.keterangan || ''}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </A4Page>
        );
      })}
    </>
  );
};
