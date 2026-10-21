import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, User, Check, Building2, MapPin } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updated: UserProfile) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [formData, setFormData] = useState<UserProfile>({ ...profile });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Profil Pegawai & Satuan Kerja
              </h3>
              <p className="text-xs text-slate-500">
                Informasi penyusun laporan kinerja operasional
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nama Lengkap Penyusun
            </label>
            <input
              type="text"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-emerald-600"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              NIP / NIPPPK
            </label>
            <input
              type="text"
              value={formData.nip}
              onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-emerald-600"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jabatan
              </label>
              <input
                type="text"
                value={formData.jabatan}
                onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-emerald-600"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Status Kepegawaian
              </label>
              <input
                type="text"
                value={formData.statusPegawai}
                onChange={(e) => setFormData({ ...formData, statusPegawai: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-emerald-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Satuan Kerja / Kebun
            </label>
            <input
              type="text"
              value={formData.satuanKerja}
              onChange={(e) => setFormData({ ...formData, satuanKerja: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-emerald-600"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Lokasi Spesifik (Bab I 1.3)
            </label>
            <textarea
              rows={2}
              value={formData.lokasiSpesifik}
              onChange={(e) => setFormData({ ...formData, lokasiSpesifik: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-emerald-600"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Instansi Induk (Cover)
            </label>
            <input
              type="text"
              value={formData.instansi}
              onChange={(e) => setFormData({ ...formData, instansi: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-emerald-600"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kota / Lokasi TTD
              </label>
              <input
                type="text"
                value={formData.lokasiTtd}
                onChange={(e) => setFormData({ ...formData, lokasiTtd: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-emerald-600"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tanggal TTD Manual (Opsional)
              </label>
              <input
                type="text"
                placeholder="Kosongkan untuk otomatis"
                value={formData.tanggalTtd}
                onChange={(e) => setFormData({ ...formData, tanggalTtd: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-emerald-600"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-200">
            <span className="font-semibold text-slate-700">Tampilkan Tanda Tangan Digital</span>
            <input
              type="checkbox"
              checked={formData.useDigitalSignature}
              onChange={(e) => setFormData({ ...formData, useDigitalSignature: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 font-semibold flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Profil</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
