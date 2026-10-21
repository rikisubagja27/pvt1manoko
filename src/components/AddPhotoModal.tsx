import React, { useState, useRef } from 'react';
import { DocumentationPhoto } from '../types';
import { X, Upload, Camera, Image as ImageIcon, Check } from 'lucide-react';

interface AddPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPhoto: (photo: DocumentationPhoto) => void;
}

export const AddPhotoModal: React.FC<AddPhotoModalProps> = ({
  isOpen,
  onClose,
  onAddPhoto,
}) => {
  const [title, setTitle] = useState('');
  const [fotoSebelumUrl, setFotoSebelumUrl] = useState('');
  const [fotoSesudahUrl, setFotoSesudahUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [dateStr, setDateStr] = useState('Sep 20, 2026');
  const [timeStr, setTimeStr] = useState('08:30:15');
  const [locationName, setLocationName] = useState('Kebun PVT I Manoko, Bandung Barat');
  const [coordinates, setCoordinates] = useState('S 6°48\'16.074", E 107°36\'50.629"');
  const [elevation, setElevation] = useState('1290.0 m a.s.l.');
  const [showGpsBadge, setShowGpsBadge] = useState(true);

  const fileInputSebelumRef = useRef<HTMLInputElement>(null);
  const fileInputSesudahRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleUploadSebelum = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoSebelumUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSesudah = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoSesudahUrl(reader.result as string);
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const primaryImg = fotoSesudahUrl.trim() || imageUrl.trim() || fotoSebelumUrl.trim();
    if (!title.trim() || !primaryImg) return;

    const newPhoto: DocumentationPhoto = {
      id: `photo-${Date.now()}`,
      title: title.trim(),
      imageUrl: primaryImg,
      fotoSebelumUrl: fotoSebelumUrl.trim() || undefined,
      fotoSesudahUrl: fotoSesudahUrl.trim() || undefined,
      dateStr,
      timeStr,
      coordinates,
      locationName,
      elevation,
      speed: '0.0km/h',
      direction: '180° S',
      showGpsBadge,
    };

    onAddPhoto(newPhoto);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Tambah Dokumentasi Kegiatan (Tabel 2)
              </h3>
              <p className="text-xs text-slate-500">
                Mendukung foto sebelum (0%) dan sesudah (100%) kegiatan
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Keterangan Pekerjaan / Uraian Foto <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Pengolahan lahan untuk persiapan penanaman..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-emerald-600"
              required
            />
          </div>

          {/* Foto Sebelum & Sesudah Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            {/* Foto Sebelum */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-900 text-[11px]">
                  Foto SEBELUM (0%)
                </span>
                <button
                  type="button"
                  onClick={() => fileInputSebelumRef.current?.click()}
                  className="px-2 py-0.5 bg-white border border-amber-300 text-amber-800 rounded text-[10px] font-medium hover:bg-amber-100 cursor-pointer"
                >
                  Upload
                </button>
                <input
                  ref={fileInputSebelumRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUploadSebelum}
                  className="hidden"
                />
              </div>
              <input
                type="url"
                placeholder="URL foto sebelum..."
                value={fotoSebelumUrl}
                onChange={(e) => setFotoSebelumUrl(e.target.value)}
                className="w-full border border-slate-300 rounded px-2 py-1 bg-white text-[11px]"
              />
              {fotoSebelumUrl && (
                <div className="aspect-[4/3] max-h-24 rounded overflow-hidden border border-amber-300">
                  <img src={fotoSebelumUrl} alt="Sebelum" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Foto Sesudah */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-emerald-900 text-[11px]">
                  Foto SESUDAH (100%)
                </span>
                <button
                  type="button"
                  onClick={() => fileInputSesudahRef.current?.click()}
                  className="px-2 py-0.5 bg-white border border-emerald-300 text-emerald-800 rounded text-[10px] font-medium hover:bg-emerald-100 cursor-pointer"
                >
                  Upload
                </button>
                <input
                  ref={fileInputSesudahRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUploadSesudah}
                  className="hidden"
                />
              </div>
              <input
                type="url"
                placeholder="URL foto sesudah..."
                value={fotoSesudahUrl}
                onChange={(e) => {
                  setFotoSesudahUrl(e.target.value);
                  setImageUrl(e.target.value);
                }}
                className="w-full border border-slate-300 rounded px-2 py-1 bg-white text-[11px]"
              />
              {fotoSesudahUrl && (
                <div className="aspect-[4/3] max-h-24 rounded overflow-hidden border border-emerald-300">
                  <img src={fotoSesudahUrl} alt="Sesudah" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* GPS Watermark Options */}
          <div className="pt-2 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">
                Watermark Timestamp Camera (GPS)
              </span>
              <input
                type="checkbox"
                checked={showGpsBadge}
                onChange={(e) => setShowGpsBadge(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
            </div>

            {showGpsBadge && (
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <label className="block text-[11px] text-slate-600 mb-0.5">Tanggal</label>
                  <input
                    type="text"
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2 py-1 bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-0.5">Waktu</label>
                  <input
                    type="text"
                    value={timeStr}
                    onChange={(e) => setTimeStr(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2 py-1 bg-white text-xs"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] text-slate-600 mb-0.5">Lokasi</label>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2 py-1 bg-white text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!title || (!fotoSesudahUrl && !fotoSebelumUrl && !imageUrl)}
              className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 disabled:opacity-50 font-semibold flex items-center space-x-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Tambahkan ke Tabel 2</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
