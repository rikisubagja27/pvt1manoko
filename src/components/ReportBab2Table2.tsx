import React from 'react';
import { DocumentationPhoto } from '../types';
import { A4Page } from './A4Page';

interface ReportBab2Table2Props {
  photos: DocumentationPhoto[];
  startPageNumber: number;
}

export const ReportBab2Table2: React.FC<ReportBab2Table2Props> = ({
  photos,
  startPageNumber,
}) => {
  const photoList = photos.length > 0 ? photos : [];

  // Group photos into pages:
  // First page can hold up to 3 photo rows (due to table header)
  // Subsequent pages can hold up to 3-4 photo rows
  const pages: DocumentationPhoto[][] = [];
  if (photoList.length <= 3) {
    pages.push(photoList);
  } else if (photoList.length <= 7) {
    pages.push(photoList.slice(0, 3));
    pages.push(photoList.slice(3, 7));
  } else {
    pages.push(photoList.slice(0, 3));
    pages.push(photoList.slice(3, 7));
    pages.push(photoList.slice(7));
  }

  return (
    <>
      {pages.map((chunk, pageIdx) => {
        const isFirst = pageIdx === 0;
        return (
          <A4Page
            key={pageIdx}
            pageNumber={startPageNumber + pageIdx}
            paddingClassName="pt-[25mm] pb-[25mm] px-[25mm]"
          >
            <div className="text-slate-900 select-text leading-normal">
              {isFirst && (
                <p className="text-[13.5px] font-normal mb-3 text-slate-900">
                  Tabel 2. Dokumentasi Kegiatan
                </p>
              )}

              <table className="w-full border-collapse border border-black text-[13px]">
                {isFirst && (
                  <thead>
                    <tr className="bg-white">
                      <th className="border border-black px-4 py-2 w-[54%] text-center font-bold">
                        Foto Kegiatan (Sebelum & Sesudah)
                      </th>
                      <th className="border border-black px-4 py-2 w-[46%] text-center font-bold">
                        Keterangan
                      </th>
                    </tr>
                  </thead>
                )}
                <tbody>
                  {chunk.map((photo) => {
                    const hasBeforeAndAfter =
                      Boolean(photo.fotoSebelumUrl) && Boolean(photo.fotoSesudahUrl);

                    return (
                      <tr key={photo.id}>
                        <td className="border border-black p-2 text-center align-middle bg-slate-50/50">
                          {hasBeforeAndAfter ? (
                            /* Before & After Paired Comparison */
                            <div className="flex items-center justify-center gap-2">
                              {/* Foto Sebelum */}
                              <div className="relative w-[132px] aspect-[4/3] rounded overflow-hidden shadow-2xs border border-amber-300 bg-amber-50">
                                <img
                                  src={photo.fotoSebelumUrl}
                                  alt="Sebelum kegiatan"
                                  className="w-full h-full object-cover"
                                  loading="eager"
                                />
                                <span className="absolute top-1 left-1 bg-amber-800 text-white text-[7.5px] font-bold px-1.5 py-0.5 rounded tracking-wider shadow-xs uppercase">
                                  Sebelum
                                </span>
                              </div>

                              {/* Foto Sesudah */}
                              <div className="relative w-[132px] aspect-[4/3] rounded overflow-hidden shadow-2xs border border-emerald-400 bg-emerald-50">
                                <img
                                  src={photo.fotoSesudahUrl}
                                  alt="Sesudah kegiatan"
                                  className="w-full h-full object-cover"
                                  loading="eager"
                                />
                                <span className="absolute top-1 left-1 bg-emerald-800 text-white text-[7.5px] font-bold px-1.5 py-0.5 rounded tracking-wider shadow-xs uppercase">
                                  Sesudah
                                </span>

                                {/* GPS Overlay on After photo */}
                                {photo.showGpsBadge !== false && (
                                  <div className="absolute inset-x-0 bottom-0 bg-black/65 text-white font-mono text-[7px] leading-tight px-1 py-0.5 text-right pointer-events-none">
                                    <span>{photo.dateStr || '2026'}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            /* Single Photo with GPS overlay */
                            <div className="relative inline-block w-full max-w-[260px] aspect-[4/3] rounded overflow-hidden shadow-xs border border-gray-300 bg-gray-100">
                              <img
                                src={photo.imageUrl || photo.fotoSesudahUrl || photo.fotoSebelumUrl}
                                alt={photo.title}
                                className="w-full h-full object-cover"
                                loading="eager"
                              />

                              {/* Authentic Timestamp Camera GPS Overlay Badge */}
                              {photo.showGpsBadge !== false && (
                                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-1.5 text-white font-mono text-[9px] leading-tight select-none">
                                  <div className="flex items-center space-x-1 opacity-90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                                    <svg
                                      className="w-3.5 h-3.5 text-cyan-300"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2.5"
                                    >
                                      <circle cx="12" cy="12" r="9" />
                                      <path d="M12 3v3m0 12v3M3 12h3m12 0h3" />
                                    </svg>
                                    <span className="text-[8px] font-sans text-cyan-200">GPS</span>
                                  </div>

                                  <div className="bg-black/55 backdrop-blur-[1px] p-1 rounded text-right space-y-0.5 shadow-sm">
                                    {photo.dateStr && (
                                      <div className="font-semibold text-white drop-shadow">
                                        {photo.dateStr} {photo.timeStr ? `at ${photo.timeStr}` : ''}
                                      </div>
                                    )}
                                    {photo.coordinates && (
                                      <div className="text-[8px] text-gray-200">
                                        {photo.coordinates}
                                      </div>
                                    )}
                                    {photo.locationName && (
                                      <div className="text-[8px] text-cyan-200 truncate max-w-[230px]">
                                        {photo.locationName}
                                      </div>
                                    )}
                                    <div className="text-[7.5px] text-gray-300 flex justify-end space-x-2">
                                      {photo.elevation && <span>{photo.elevation}</span>}
                                      {photo.speed && <span>Speed: {photo.speed}</span>}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="border border-black px-4 py-3 align-middle text-left text-slate-900 text-[13px] leading-relaxed">
                          <div className="flex items-start">
                            <span className="mr-2 font-bold">•</span>
                            <span className="font-normal">{photo.title}</span>
                          </div>
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
