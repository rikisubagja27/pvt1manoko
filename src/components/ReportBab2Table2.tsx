import React from 'react';
import { DocumentationPhoto } from '../types';
import { Trash2, Image as ImageIcon } from 'lucide-react';

export interface ReportBab2Table2Props {
  photos: DocumentationPhoto[];
  startPageNumber: number;
  onDeletePhoto?: (id: string) => void;
  onUpdatePhoto?: (id: string, newImageUrl: string) => void;
}

export const ReportBab2Table2: React.FC<ReportBab2Table2Props> = ({
  photos,
  startPageNumber,
  onDeletePhoto,
  onUpdatePhoto,
}) => {
  // Fungsi untuk mengganti foto secara lokal via upload file langsung di baris tabel
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, photoId: string) => {
    const file = e.target.files?.[0];
    if (file && onUpdatePhoto) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onUpdatePhoto(photoId, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

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
                  {/* Kolom Gambar dengan Tombol Aksi Langsung */}
                  <td className="border border-black p-3 text-center relative">
                    <div className="relative inline-block w-full">
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        className="max-h-[220px] w-auto mx-auto object-contain rounded border border-slate-300"
                      />
                      
                      {/* Tombol Kontrol (Ganti & Hapus Foto) - Hanya tampil di layar, tersembunyi saat cetak/PDF */}
                      <div className="absolute top-2 right-2 flex items-center space-x-1 print:hidden">
                        {/* Tombol Ganti Gambar */}
                        <label
                          className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full shadow-md opacity-85 hover:opacity-100 transition-opacity cursor-pointer"
                          title="Ganti foto ini"
                        >
                          <ImageIcon className="w-4 h-4" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, photo.id)}
                          />
                        </label>

                        {/* Tombol Hapus Foto */}
                        {onDeletePhoto && (
                          <button
                            type="button"
                            onClick={() => onDeletePhoto(photo.id)}
                            className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow-md opacity-85 hover:opacity-100 transition-opacity cursor-pointer"
                            title="Hapus foto ini"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Kolom Keterangan (Bisa diedit teks keterangannya jika diperlukan) */}
                  <td className="border border-black p-3 space-y-1.5 text-justify">
                    <p
                      contentEditable
                      suppressContentEditableWarning
                      className="font-bold text-slate-900 outline-none focus:bg-amber-50 rounded p-0.5"
                      title="Klik untuk mengedit judul foto"
                    >
                      {photo.title}
                    </p>
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
                  Belum ada foto dokumentasi.
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
