import React, { useState } from 'react';
import { X, Save, FileText, CheckCircle2 } from 'lucide-react';

export interface EditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  periodLabelNormal: string;
  year: number;
}

export const EditReportModal: React.FC<EditReportModalProps> = ({
  isOpen,
  onClose,
  periodLabelNormal,
  year,
}) => {
  // State untuk menyimpan teks narasi laporan yang sedang diedit
  const [latarBelakang, setLatarBelakang] = useState(
    "Dalam rangka mendukung kelancaran pelaksanaan tugas dan fungsi organisasi, diperlukan dukungan sumber daya manusia yang mampu melaksanakan kegiatan operasional dan pelayanan perkantoran secara efektif, tertib, dan berkesinambungan."
  );
  const [tujuan, setTujuan] = useState(
    "Tujuan penyusunan laporan pelaksanaan tugas dan fungsi jabatan Operator Layanan Operasional, adalah sebagai bentuk pertanggungjawaban kinerja pegawai di lingkungan Pusat Pelindungan Varietas Tanaman dan Perizinan Pertanian."
  );
  const [kesimpulan, setKesimpulan] = useState(
    "Secara umum kegiatan pada periode ini terlaksana secara tertib, efektif, dan sesuai dengan tugas serta mendukung pencapaian tujuan organisasi."
  );

  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    // Simpan perubahan (bisa dihubungkan ke state utama App jika diperlukan)
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] text-slate-800">
        
        {/* Header Modal */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Editor Laporan Lengkap</h2>
              <p className="text-xs text-slate-400">
                Periode: {periodLabelNormal} {year}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveAll} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center space-x-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Perubahan teks narasi laporan berhasil disimpan!</span>
            </div>
          )}

          {/* Bagian Latar Belakang */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">
              1. Edit Narasi Latar Belakang (Bab I)
            </label>
            <textarea
              rows={3}
              value={latarBelakang}
              onChange={(e) => setLatarBelakang(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-700 leading-relaxed"
            />
          </div>

          {/* Bagian Tujuan */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">
              2. Edit Narasi Tujuan (Bab I)
            </label>
            <textarea
              rows={2}
              value={tujuan}
              onChange={(e) => setTujuan(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-700 leading-relaxed"
            />
          </div>

          {/* Bagian Kesimpulan / Penutup */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">
              3. Edit Narasi Kesimpulan / Penutup (Bab III)
            </label>
            <textarea
              rows={3}
              value={kesimpulan}
              onChange={(e) => setKesimpulan(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-700 leading-relaxed"
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-amber-900 space-y-1">
            <p className="font-bold">ℹ️ Catatan Pengelolaan Tabel & Foto:</p>
            <p className="text-[11px] leading-normal text-amber-800">
              Untuk mengedit rincian tabel kegiatan dan menambah/mengubah foto dokumentasi, Anda dapat menggunakan tombol cepat <strong>"Kustom Tabel 1"</strong> dan <strong>"Tambah Foto"</strong> yang tersedia berdampingan di menu atas aplikasi.
            </p>
          </div>

          {/* Footer Tombol Aksi */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
