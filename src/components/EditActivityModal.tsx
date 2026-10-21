import React, { useState } from 'react';
import { PeriodActivityRow, ActivityCategoryItem } from '../types';
import { X, Plus, Trash2, RotateCcw, Check, ListChecks } from 'lucide-react';

interface EditActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: PeriodActivityRow[];
  onSave: (activities: PeriodActivityRow[]) => void;
  onReset: () => void;
  periodTitle: string;
}

export const EditActivityModal: React.FC<EditActivityModalProps> = ({
  isOpen,
  onClose,
  activities,
  onSave,
  onReset,
  periodTitle,
}) => {
  const [localRows, setLocalRows] = useState<PeriodActivityRow[]>(() =>
    JSON.parse(JSON.stringify(activities))
  );

  if (!isOpen) return null;

  const handleUpdateItem = (
    rowIndex: number,
    itemIndex: number,
    field: 'category' | 'details',
    val: string
  ) => {
    const updated = [...localRows];
    updated[rowIndex].items[itemIndex][field] = val;
    setLocalRows(updated);
  };

  const handleAddItem = (rowIndex: number) => {
    const updated = [...localRows];
    updated[rowIndex].items.push({
      category: 'Kegiatan Baru',
      details: 'Deskripsi rincian pekerjaan...',
    });
    setLocalRows(updated);
  };

  const handleDeleteItem = (rowIndex: number, itemIndex: number) => {
    const updated = [...localRows];
    updated[rowIndex].items.splice(itemIndex, 1);
    setLocalRows(updated);
  };

  const handleSave = () => {
    onSave(localRows);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <ListChecks className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Edit Rincian Kegiatan ({periodTitle})
              </h3>
              <p className="text-xs text-slate-500">
                Sesuaikan uraian pekerjaan pada Tabel 1 Laporan Kinerja
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

        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {localRows.map((row, rowIdx) => (
            <div
              key={row.id || rowIdx}
              className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-sm text-emerald-900">
                  {row.periodLabel} {row.subLabel && `(${row.subLabel})`}
                </span>
                <button
                  type="button"
                  onClick={() => handleAddItem(rowIdx)}
                  className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 rounded-md font-semibold flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Poin</span>
                </button>
              </div>

              <div className="space-y-3">
                {row.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="flex items-start gap-2 bg-white p-3 rounded-lg border border-slate-200"
                  >
                    <div className="w-1/3">
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Kategori / Bidang
                      </label>
                      <input
                        type="text"
                        value={item.category}
                        onChange={(e) =>
                          handleUpdateItem(rowIdx, itemIdx, 'category', e.target.value)
                        }
                        className="w-full border border-slate-300 rounded-md px-2 py-1 text-xs text-slate-900 focus:outline-emerald-600 font-medium"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Rincian Pekerjaan
                      </label>
                      <textarea
                        rows={2}
                        value={item.details}
                        onChange={(e) =>
                          handleUpdateItem(rowIdx, itemIdx, 'details', e.target.value)
                        }
                        className="w-full border border-slate-300 rounded-md px-2 py-1 text-xs text-slate-900 focus:outline-emerald-600"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(rowIdx, itemIdx)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-md mt-4"
                      title="Hapus poin"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={onReset}
            className="px-3.5 py-2 text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg text-xs font-semibold flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data Contoh Manoko</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-white text-xs font-medium"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 text-xs font-semibold flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
