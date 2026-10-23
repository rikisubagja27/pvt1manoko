import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import { X, Save, Camera, Trash } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(profile);
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profileImageUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col text-slate-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Edit Profil & Pejabat</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Bagian Foto Profil */}
          <div className="flex flex-col items-center justify-center space-y-3 pb-6 border-b border-slate-200">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 bg-slate-50 flex items-center justify-center shadow-sm">
                {formData.profileImageUrl ? (
                  <img src={formData.profileImageUrl} alt="Profil" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-slate-300" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-md cursor-pointer transition-colors"
                title="Unggah Foto Profil"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleUploadFoto}
                className="hidden"
              />
            </div>
            {formData.profileImageUrl && (
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, profileImageUrl: undefined }))}
                className="text-xs text-rose-600 hover:text-rose-700 flex items-center space-x-1 cursor-pointer font-medium"
              >
                <Trash className="w-3.5 h-3.5" />
                <span>Hapus Foto</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="font-semibold text-emerald-800 border-b border-emerald-100 pb-2 text-sm uppercase tracking-wider">
                Data Diri Pembuat Laporan
              </h3>
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">NIP / NIK</label>
                <input
                  type="text"
                  name="nip"
                  value={formData.nip}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Jabatan / Peran</label>
                <input
                  type="text"
                  name="jabatan"
                  value={formData.jabatan}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-emerald-600"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-emerald-800 border-b border-emerald-100 pb-2 text-sm uppercase tracking-wider">
                Data Pejabat / Pimpinan
              </h3>
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Jabatan Pimpinan (Penandatangan)</label>
                <input
                  type="text"
                  name="jabatanPimpinan"
                  value={formData.jabatanPimpinan}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Pimpinan</label>
                <input
                  type="text"
                  name="namaPimpinan"
                  value={formData.namaPimpinan}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">NIP Pimpinan</label>
                <input
                  type="text"
                  name="nipPimpinan"
                  value={formData.nipPimpinan}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-emerald-600"
                  required
                />
              </div>
            </div>
          </div>
        </form>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold flex items-center space-x-2 cursor-pointer shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
