import { DailyLogbookEntry, PeriodActivityRow, PeriodType } from '../types';
import { MONTH_NAMES, QUARTER_INFO } from '../data/defaultData';

/**
 * Format YYYY-MM-DD into Indonesian date string, e.g. "14 September 2026"
 */
export function formatIndonesianDate(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[2], 10);
      const monthIdx = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[0], 10);
      const monthName = MONTH_NAMES[monthIdx] || parts[1];
      return `${day} ${monthName} ${year}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

/**
 * Automatically compiles and synthesizes DailyLogbookEntry records
 * into the structured PeriodActivityRow format for Table 1 of the A4 report.
 */
export function compileLogbookToTable1(
  entries: DailyLogbookEntry[],
  periodType: PeriodType,
  selectedMonth: number,
  selectedQuarter: number,
  selectedYear: number
): PeriodActivityRow[] {
  if (periodType === 'bulanan') {
    // Filter entries for this month & year
    const monthlyEntries = entries.filter((e) => {
      const parts = e.tanggal.split('-');
      if (parts.length < 2) return false;
      const yr = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      return yr === selectedYear && m === selectedMonth;
    });

    if (monthlyEntries.length === 0) {
      const monthName = MONTH_NAMES[selectedMonth - 1] || 'Bulan';
      return [
        {
          id: `empty-${selectedMonth}`,
          periodLabel: `1 ${monthName} ${selectedYear}`,
          items: [
            {
              category: 'Operasional Kebun',
              details: `Belum ada entri logbook pada bulan ${monthName} ${selectedYear}. Silakan tambahkan pada menu 'Isi Logbook Harian'.`,
            },
          ],
          keterangan: '-',
        },
      ];
    }

    // Group entries by date
    const dateMap = new Map<string, DailyLogbookEntry[]>();
    for (const entry of monthlyEntries) {
      const list = dateMap.get(entry.tanggal) || [];
      list.push(entry);
      dateMap.set(entry.tanggal, list);
    }

    // Sort dates ascending
    const sortedDates = Array.from(dateMap.keys()).sort();

    return sortedDates.map((dateStr, idx) => {
      const dayEntries = dateMap.get(dateStr) || [];
      const items = dayEntries.map((entry) => {
        let details = entry.uraianPekerjaan;
        if (entry.lokasiBlok && !details.includes(entry.lokasiBlok) && entry.kehadiran === 'WFO') {
          details = `${details} (${entry.lokasiBlok})`;
        }
        if (entry.kehadiran === 'Sakit' && entry.fotoSuratSakitUrl) {
          details = `${details} (Surat Sakit Terlampir)`;
        }
        const itemCategory =
          entry.kehadiran === 'Sakit'
            ? 'Sakit'
            : entry.kehadiran === 'Cuti'
            ? 'Cuti'
            : entry.kategori || 'Tugas Operasional';
        return {
          category: itemCategory,
          details,
        };
      });

      // Combine luas or keterangan
      const isOnlySakit = dayEntries.every((e) => e.kehadiran === 'Sakit');
      const hasSuratSakit = dayEntries.some((e) => e.kehadiran === 'Sakit' && Boolean(e.fotoSuratSakitUrl));
      const luasParts = dayEntries
        .map((e) => e.luasLokasi)
        .filter((l) => l && l !== '-');
      let ketString = luasParts.length > 0 ? `Luas: ${luasParts.join(', ')}` : '-';
      if (isOnlySakit) {
        ketString = hasSuratSakit ? 'Surat Sakit Terlampir' : 'Izin Sakit';
      }

      return {
        id: `date-row-${idx}-${dateStr}`,
        periodLabel: formatIndonesianDate(dateStr),
        items,
        keterangan: ketString,
      };
    });
  }

  if (periodType === 'triwulan') {
    // Quarters have 3 months
    const qInfo = QUARTER_INFO.find((q) => q.id === selectedQuarter) || QUARTER_INFO[2];
    const targetMonths = qInfo.months; // e.g. [7, 8, 9] for Q3

    return targetMonths.map((mNum) => {
      const monthName = MONTH_NAMES[mNum - 1];
      const monthEntries = entries.filter((e) => {
        const parts = e.tanggal.split('-');
        if (parts.length < 2) return false;
        const yr = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        return yr === selectedYear && m === mNum;
      });

      if (monthEntries.length === 0) {
        return {
          id: `quarter-month-${mNum}`,
          periodLabel: monthName,
          items: [
            {
              category: 'Operasional Rutin',
              details: `Pemeliharaan rutin kebun, monitoring tanaman, dan administrasi operasional kantor ${monthName}.`,
            },
          ],
          keterangan: 'Terlaksana',
        };
      }

      // Group entries by category / kehadiran within this month
      const catMap = new Map<string, string[]>();
      for (const entry of monthEntries) {
        const catKey =
          entry.kehadiran === 'Sakit'
            ? 'Sakit'
            : entry.kehadiran === 'Cuti'
            ? 'Cuti'
            : entry.kategori || 'Tugas Operasional';
        const list = catMap.get(catKey) || [];
        let desc = entry.uraianPekerjaan;
        if (entry.lokasiBlok && !desc.includes(entry.lokasiBlok) && entry.kehadiran === 'WFO') {
          desc = `${desc} (${entry.lokasiBlok})`;
        }
        list.push(desc);
        catMap.set(catKey, list);
      }

      const items = Array.from(catMap.entries()).map(([cat, descList]) => ({
        category: cat,
        details: descList.join('; '),
      }));

      return {
        id: `quarter-month-${mNum}`,
        periodLabel: monthName,
        items,
        keterangan: 'Terlaksana',
      };
    });
  }

  // Tahunan: Group by all 4 Triwulan
  return QUARTER_INFO.map((q) => {
    const qMonths = q.months;
    const qEntries = entries.filter((e) => {
      const parts = e.tanggal.split('-');
      if (parts.length < 2) return false;
      const yr = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      return yr === selectedYear && qMonths.includes(m);
    });

    if (qEntries.length === 0) {
      return {
        id: `year-quarter-${q.id}`,
        periodLabel: `${q.name} (${q.range})`,
        items: [
          {
            category: 'Operasional Umum',
            details: `Pelaksanaan tugas operasional dan pemeliharaan kebun pada periode ${q.name} (${q.range} ${selectedYear}).`,
          },
        ],
        keterangan: '100%',
      };
    }

    // Group by category / kehadiran
    const catMap = new Map<string, string[]>();
    for (const entry of qEntries) {
      const catKey =
        entry.kehadiran === 'Sakit'
          ? 'Sakit'
          : entry.kehadiran === 'Cuti'
          ? 'Cuti'
          : entry.kategori || 'Tugas Operasional';
      const list = catMap.get(catKey) || [];
      list.push(entry.uraianPekerjaan);
      catMap.set(catKey, list);
    }

    const items = Array.from(catMap.entries()).map(([cat, list]) => ({
      category: cat,
      details: list.join('; '),
    }));

    return {
      id: `year-quarter-${q.id}`,
      periodLabel: `${q.name} (${q.range})`,
      items,
      keterangan: '100%',
    };
  });
}
