import React from 'react';
import { DocumentationPhoto } from '../types';
import { Trash2 } from 'lucide-react';

export interface ReportBab2Table2Props {
  photos: DocumentationPhoto[];
  startPageNumber: number;
  onDeletePhoto?: (id: string) => void; // Fungsi opsional untuk menghapus foto langsung
}

export const ReportBab2Table2: React.FC<ReportBab2Table2Props> = ({
  photos,
  startPageNumber,
  onDeletePhoto,
}) => {
  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-black p-[20mm] shadow-2xl flex flex-col justify-between font-['Arial'] text-[12pt] leading-relaxed relative box-border print:shadow-none print:w-full print:m-0 print:break-after-page">
      <div>
        {/* Header Bab / Tabel Dokumentasi */}
        <div className="mb-6">
          <p className="font-bold text-center text-[13pt] mb-1">
            Tabel 2. Dokumentasi Kegiatan
          </p>
          <p className="text-xs text-slate-500 text-center italic">
            (Foto kegiatan beserta keterangan waktu, koordinat, dan lokasi operasional)
          </p>
        </div>

        {/* Tabel Foto Dokumentasi */}
        <table className="w-full border-collapse border border-black text-[11pt]">
          <thead>
            <tr className="bg-slate-100 text-center font-bold">
              <th className="border border-black p-2.5 w-[50%]">Foto Dokumentasi</th>
              <th className="border border-black p-2.5 w-[50%]">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {photos && photos.length > 0 ? (
              photos.map((photo, idx) => (
                <tr key={photo.id || idx} className="align-top group">
                  {/* Kolom Gambar */}
                  <td className="border border-black p-3 text-center relative">
                    <div className="relative inline-block w-full">
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        className="max-h-[220px] w-auto mx-auto object-contain rounded border border-slate-300"
                      />
                      {/* Tombol Hapus Foto Langsung pada Tampilan */}
                      {onDeletePhoto && (
                        <button
                          type="button"
                          onClick={() => onDeletePhoto(photo.id)}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow-md opacity-80 hover:opacity-100 transition-opacity cursor-pointer print:hidden"
                          title="Hapus foto ini dari laporan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Kolom Keterangan */}
                  <td className="border border-black p-3 space-y-1.5 text-justify">
                    <p className="font-bold text-slate-900">{photo.title}</p>
                    {photo.dateStr && (
                      <p className="text-[10pt] text-slate-600">
                        📅 {photo.dateStr} {photo.timeStr ? `at ${photo.timeStr}` : ''}
                      </p>
                    )}
                    {photo.coordinates && (
                      <p className="text-[10pt] text-slate-600 font-mono">
                        📍 {photo.coordinates}
                      </p>
                    )}
                    {photo.locationName && (
                      <p className="text-[10pt] text-slate-700">
                        🏢 {photo.locationName}
                      </p>
                    )}
                    {photo.elevation && (
                      <p className="text-[10pt] text-slate-500">
                        ⛰️ Alt: {photo.elevation} | Spd: {photo.speed || '0.0km/h'}
                      </p>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="border border-black p-6 text-center text-slate-500 italic">
                  Belum ada foto dokumentasi yang ditambahkan. Gunakan tombol "Tambah Foto" di menu atas untuk memasukkan dokumentasi kegiatan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Nomor Halaman */}
      <div className="text-center pt-8 text-[11pt] text-slate-600 print:text-black">
        - {startPageNumber} -
      </div>
    </div>
  );
};
