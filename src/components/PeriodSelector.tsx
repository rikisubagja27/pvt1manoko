import React from 'react';
import { MONTH_NAMES, QUARTER_INFO } from '../data/defaultData';
import { PeriodType } from '../types';
import { Calendar, Layers, Clock, CheckCircle2 } from 'lucide-react';

interface PeriodSelectorProps {
  periodType: PeriodType;
  setPeriodType: (type: PeriodType) => void;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  selectedQuarter: number;
  setSelectedQuarter: (quarter: number) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  activeSummary: { badge: string; sub: string };
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  periodType,
  setPeriodType,
  selectedMonth,
  setSelectedMonth,
  selectedQuarter,
  setSelectedQuarter,
  selectedYear,
  setSelectedYear,
  activeSummary,
}) => {
  const years = [2025, 2026, 2027];

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-3 sm:px-6 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Period Type Segmented Controls */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl self-start lg:self-auto border border-slate-200/80">
          <button
            type="button"
            onClick={() => setPeriodType('bulanan')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              periodType === 'bulanan'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Bulanan</span>
          </button>

          <button
            type="button"
            onClick={() => setPeriodType('triwulan')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              periodType === 'triwulan'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Triwulan</span>
          </button>

          <button
            type="button"
            onClick={() => setPeriodType('tahunan')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              periodType === 'tahunan'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Tahunan</span>
          </button>
        </div>

        {/* Dynamic Period Dropdowns / Sub-selector */}
        <div className="flex flex-wrap items-center gap-2.5">
          {periodType === 'bulanan' && (
            <div className="flex items-center space-x-2">
              <label className="text-xs font-medium text-slate-500">Pilih Bulan:</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-emerald-600 focus:bg-white"
              >
                {MONTH_NAMES.map((name, idx) => (
                  <option key={name} value={idx + 1}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {periodType === 'triwulan' && (
            <div className="flex items-center space-x-2">
              <label className="text-xs font-medium text-slate-500">Pilih Triwulan:</label>
              <div className="flex items-center space-x-1">
                {QUARTER_INFO.map((q) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setSelectedQuarter(q.id)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                      selectedQuarter === q.id
                        ? 'bg-emerald-100 border-emerald-600 text-emerald-900 font-semibold shadow-2xs'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {q.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Year Selector */}
          <div className="flex items-center space-x-1.5 pl-1">
            <label className="text-xs font-medium text-slate-500">Tahun:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-emerald-600 focus:bg-white"
            >
              {years.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Current Period Indicator */}
          <div className="hidden sm:flex items-center space-x-1.5 pl-3 border-l border-slate-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {activeSummary.badge}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
