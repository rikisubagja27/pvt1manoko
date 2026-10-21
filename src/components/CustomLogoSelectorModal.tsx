import React, { useState, useRef } from 'react';
import { Image, Upload, Check, RotateCcw, X, Sparkles, Building2, ShieldCheck } from 'lucide-react';

export interface CustomLogoSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLogoUrl: string;
  onSelectLogo: (logoUrl: string) => void;
}

// Default presets including Kementan, Typographic studio badge, and original
export const PRESET_LOGOS = [
  {
    id: 'studio-badge',
    title: 'Desain Studio Typographic (LogIn Modern)',
    description: 'Emblem hijau/putih stylish dengan tipografi presisi',
    // High-resolution SVG data URI with modern typographic styling
    url: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#059669" />
            <stop offset="100%" stop-color="#047857" />
          </linearGradient>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.3"/>
          </filter>
        </defs>
        <rect width="160" height="160" rx="36" fill="url(#bgGrad)"/>
        <rect x="12" y="12" width="136" height="136" rx="28" fill="none" stroke="#6ee7b7" stroke-width="3" stroke-dasharray="6,4" opacity="0.6"/>
        <circle cx="80" cy="80" r="50" fill="#ffffff" filter="url(#shadow)"/>
        <path d="M68 62 L94 80 L68 98 Z" fill="#047857"/>
        <rect x="58" y="60" width="6" height="40" rx="2" fill="#047857"/>
        <text x="80" y="145" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="13" letter-spacing="3" fill="#ecfdf5">LOGBOOK</text>
      </svg>
    `)}`,
  },
  {
    id: 'kementan-logo',
    title: 'Lambang Kementerian Pertanian RI',
    description: 'Logo resmi Kementerian Pertanian Republik Indonesia',
    url: '/logo_kementan.svg',
  },
  {
    id: 'monochrome-typographic',
    title: 'Monochrome Studio Typography',
    description: 'Desain tipografis hitam-putih minimalis elegan',
    url: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
        <rect width="160" height="160" rx="36" fill="#18181b"/>
        <circle cx="80" cy="80" r="54" fill="none" stroke="#f4f4f5" stroke-width="4"/>
        <text x="80" y="75" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="28" fill="#ffffff" letter-spacing="1">LOG</text>
        <text x="80" y="102" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="700" font-size="16" fill="#a1a1aa" letter-spacing="4">IN</text>
        <circle cx="80" cy="118" r="4" fill="#10b981"/>
      </svg>
    `)}`,
  },
  {
    id: 'default-icon',
    title: 'Icon Logbook Clipboard Hijau',
    description: 'Icon default aplikasi logbook kinerja',
    url: 'DEFAULT_ICON',
  },
];

export const CustomLogoSelectorModal: React.FC<CustomLogoSelectorModalProps> = ({
  isOpen,
  onClose,
  currentLogoUrl,
  onSelectLogo,
}) => {
  const [selectedUrl, setSelectedUrl] = useState<string>(currentLogoUrl);
  const [customUploadPreview, setCustomUploadPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Silakan pilih file gambar (PNG, JPG, JPEG, SVG, WebP).');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCustomUploadPreview(result);
        setSelectedUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApply = () => {
    onSelectLogo(selectedUrl);
    localStorage.setItem('app_header_logo', selectedUrl);
    onClose();
  };

  const handleResetToDefault = () => {
    setSelectedUrl('DEFAULT_ICON');
    setCustomUploadPreview(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Image className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">Pilih Gambar Logo Header</h2>
              <p className="text-xs text-slate-400">
                Ganti logo di pinggir tulisan "Logbook Kinerja" dengan gambar pilihan Anda
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Current Logo Preview */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                {selectedUrl === 'DEFAULT_ICON' ? (
                  <div className="w-full h-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xl">
                    📋
                  </div>
                ) : (
                  <img
                    src={selectedUrl}
                    alt="Logo Preview"
                    className="w-full h-full object-contain p-1"
                  />
                )}
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Pratinjau Logo Aktif
                </span>
                <p className="text-xs text-slate-600 mt-1">
                  Logo ini akan tampil di samping teks <strong>Logbook Kinerja PVT I Manoko</strong>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-xs font-semibold text-slate-500 hover:text-red-600 flex items-center space-x-1 p-2 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
              title="Reset ke icon default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Upload Custom Image */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. Upload Gambar / Logo dari Perangkat
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-emerald-400 bg-emerald-50/40 hover:bg-emerald-50 hover:border-emerald-500 rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-1.5"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-emerald-950">
                Klik untuk Memilih Gambar Logo Baru
              </p>
              <p className="text-[11px] text-slate-500">
                Mendukung PNG, JPG, SVG, WebP (termasuk logo studio / foto logo Anda)
              </p>
            </div>
          </div>

          {/* Preset Logos */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              2. Atau Pilih dari Desain Tersedia
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRESET_LOGOS.map((preset) => {
                const isSelected = selectedUrl === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedUrl(preset.url)}
                    className={`flex items-start space-x-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                      {preset.url === 'DEFAULT_ICON' ? (
                        <span className="text-xl">📋</span>
                      ) : (
                        <img
                          src={preset.url}
                          alt={preset.title}
                          className="w-full h-full object-contain p-1"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-900 truncate">{preset.title}</p>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                        {preset.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-200/70 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Terapkan Logo Ini</span>
          </button>
        </div>
      </div>
    </div>
  );
};
