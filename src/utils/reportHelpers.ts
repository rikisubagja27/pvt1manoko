import { MONTH_NAMES, QUARTER_INFO } from '../data/defaultData';
import { PeriodType } from '../types';

export function getPeriodTitleCaps(
  periodType: PeriodType,
  selectedMonth: number,
  selectedQuarter: number,
  selectedYear: number
): string {
  if (periodType === 'bulanan') {
    const monthName = MONTH_NAMES[selectedMonth - 1] || 'Juli';
    return `BULAN ${monthName.toUpperCase()} TAHUN ${selectedYear}`;
  }
  if (periodType === 'triwulan') {
    const q = QUARTER_INFO.find((item) => item.id === selectedQuarter) || QUARTER_INFO[2];
    return `${q.name.toUpperCase()} TAHUN ${selectedYear}`;
  }
  return `TAHUN ${selectedYear}`;
}

export function getPeriodLabelNormal(
  periodType: PeriodType,
  selectedMonth: number,
  selectedQuarter: number,
  selectedYear: number
): string {
  if (periodType === 'bulanan') {
    const monthName = MONTH_NAMES[selectedMonth - 1] || 'Juli';
    return `Bulan ${monthName} Tahun ${selectedYear}`;
  }
  if (periodType === 'triwulan') {
    const q = QUARTER_INFO.find((item) => item.id === selectedQuarter) || QUARTER_INFO[2];
    return `${q.name} Tahun ${selectedYear}`;
  }
  return `Tahun ${selectedYear}`;
}

export function getDefaultEndDate(
  periodType: PeriodType,
  selectedMonth: number,
  selectedQuarter: number,
  selectedYear: number
): string {
  if (periodType === 'bulanan') {
    // Days in month
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const monthName = MONTH_NAMES[selectedMonth - 1];
    return `${daysInMonth} ${monthName} ${selectedYear}`;
  }
  if (periodType === 'triwulan') {
    switch (selectedQuarter) {
      case 1:
        return `31 Maret ${selectedYear}`;
      case 2:
        return `30 Juni ${selectedYear}`;
      case 3:
        return `30 September ${selectedYear}`;
      case 4:
      default:
        return `31 Desember ${selectedYear}`;
    }
  }
  return `31 Desember ${selectedYear}`;
}

export function getPeriodBadgeDesc(
  periodType: PeriodType,
  selectedMonth: number,
  selectedQuarter: number,
  selectedYear: number
): { badge: string; sub: string } {
  if (periodType === 'bulanan') {
    const m = MONTH_NAMES[selectedMonth - 1];
    return {
      badge: `Bulanan: ${m} ${selectedYear}`,
      sub: `Laporan kegiatan operasional mingguan selama bulan ${m}`,
    };
  }
  if (periodType === 'triwulan') {
    const q = QUARTER_INFO.find((item) => item.id === selectedQuarter) || QUARTER_INFO[2];
    return {
      badge: `${q.name} ${selectedYear}`,
      sub: `Laporan kinerja triwulanan (${q.range} ${selectedYear})`,
    };
  }
  return {
    badge: `Tahunan ${selectedYear}`,
    sub: `Rekapitulasi capaian kinerja operasional sepanjang tahun ${selectedYear}`,
  };
}
