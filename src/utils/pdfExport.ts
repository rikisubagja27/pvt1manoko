// PDF Export utility using html2pdf.js
// @ts-ignore - html2pdf has no built-in types
import html2pdf from 'html2pdf.js';

export interface PdfExportOptions {
  fileName?: string;
  elementId?: string;
}

/**
 * Generates and downloads the PDF directly from the report element.
 */
export async function exportReportToPdf(options?: PdfExportOptions): Promise<void> {
  const elementId = options?.elementId || 'report-print-container';
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error('Elemen laporan tidak ditemukan.');
  }

  const fileName = options?.fileName || 'Laporan_Kinerja.pdf';

  const opt = {
    margin: 0,
    filename: fileName,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      scrollY: 0,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait' as const,
    },
    pagebreak: {
      mode: ['css', 'legacy'],
      after: '.a4-page-view',
    },
  };

  // Run html2pdf to download
  await html2pdf().set(opt).from(element).save();
}

/**
 * Generates the PDF as a Blob (useful for Google Drive upload).
 */
export async function generateReportPdfBlob(options?: {
  elementId?: string;
}): Promise<Blob> {
  const elementId = options?.elementId || 'report-print-container';
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error('Elemen laporan tidak ditemukan.');
  }

  const opt = {
    margin: 0,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      scrollY: 0,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait' as const,
    },
    pagebreak: {
      mode: ['css', 'legacy'],
      after: '.a4-page-view',
    },
  };

  const pdfWorker = html2pdf().set(opt).from(element);
  const pdfBlob = await pdfWorker.output('blob');
  return pdfBlob as Blob;
}
