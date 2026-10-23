import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  PageBreak,
  ImageRun,
  convertInchesToTwip,
  convertMillimetersToTwip,
} from 'docx';
import { DocumentationPhoto, PeriodActivityRow, PeriodType, UserProfile } from '../types';

export interface ExportWordParams {
  periodType: PeriodType;
  periodTitleCaps: string;
  periodLabelNormal: string;
  year: number;
  profile: UserProfile;
  activities: PeriodActivityRow[];
  photos: DocumentationPhoto[];
  endDateStr: string;
}

async function fetchImageAsUint8Array(url: string): Promise<Uint8Array | null> {
  try {
    if (url.startsWith('data:image')) {
      const base64Data = url.split(',')[1];
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    }
    const response = await fetch(url);
    if (!response.ok) return null;
    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (err) {
    return null;
  }
}

export async function buildReportDocument({
  periodType,
  periodTitleCaps,
  periodLabelNormal,
  year,
  profile,
  activities,
  photos,
  endDateStr,
}: ExportWordParams): Promise<Document> {
  const col2Header =
    periodType === 'bulanan' ? 'Tanggal' : periodType === 'triwulan' ? 'Bulan' : 'Triwulan';

  const thinBorder = { style: BorderStyle.SINGLE, size: 4, color: '000000' };
  const cellBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };

  const logoBuffer = await fetchImageAsUint8Array('/logo-login.png');
  const summarizedPhotos = photos.slice(0, 10);

  const table1HeaderRow = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({ width: { size: 8, type: WidthType.PERCENTAGE }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'No.', bold: true, font: 'Arial', size: 22 })] })] }),
      new TableCell({ width: { size: 22, type: WidthType.PERCENTAGE }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: col2Header, bold: true, font: 'Arial', size: 22 })] })] }),
      new TableCell({ width: { size: 52, type: WidthType.PERCENTAGE }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Rincian Pekerjaan', bold: true, font: 'Arial', size: 22 })] })] }),
      new TableCell({ width: { size: 18, type: WidthType.PERCENTAGE }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Keterangan', bold: true, font: 'Arial', size: 22 })] })] }),
    ],
  });

  const table1DataRows = activities.map((row, idx) => {
    const itemParagraphs = row.items.map((item) => {
      return new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 100, line: 276 },
        children: [
          new TextRun({ text: '• ', bold: true, font: 'Arial', size: 21 }),
          new TextRun({ text: `${item.category}: `, bold: true, font: 'Arial', size: 21 }),
          new TextRun({ text: item.details, font: 'Arial', size: 21 }),
        ],
      });
    });

    return new TableRow({
      children: [
        new TableCell({ width: { size: 8, type: WidthType.PERCENTAGE }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(idx + 1), font: 'Arial', size: 21 })] })] }),
        new TableCell({ width: { size: 22, type: WidthType.PERCENTAGE }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: row.periodLabel, bold: true, font: 'Arial', size: 21 })] })] }),
        new TableCell({ width: { size: 52, type: WidthType.PERCENTAGE }, borders: cellBorders, children: itemParagraphs }),
        new TableCell({ width: { size: 18, type: WidthType.PERCENTAGE }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: row.keterangan || '-', font: 'Arial', size: 21 })] })] }),
      ],
    });
  });

  const table1 = new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [table1HeaderRow, ...table1DataRows] });

  const table2HeaderRow = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Foto', bold: true, font: 'Arial', size: 22 })] })] }),
      new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Keterangan', bold: true, font: 'Arial', size: 22 })] })] }),
    ],
  });

  const table2DataRows = await Promise.all(
    summarizedPhotos.map(async (p) => {
      const targetPhotoUrl = p.fotoSebelumUrl || p.imageUrl;
      const imgBuf = targetPhotoUrl ? await fetchImageAsUint8Array(targetPhotoUrl) : null;
      const photoCellChildren: Paragraph[] = [];

      if (imgBuf) {
        photoCellChildren.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 100 },
            children: [new ImageRun({ data: imgBuf, transformation: { width: 180, height: 135 } })],
          })
        );
      } else {
        photoCellChildren.push(
          new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '[ Foto Dokumentasi ]', italics: true, font: 'Arial', size: 20 })] })
        );
      }

      return new TableRow({
        children: [
          new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, borders: cellBorders, children: photoCellChildren }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: cellBorders,
            children: [
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                spacing: { line: 276 },
                children: [
                  new TextRun({ text: '• ', bold: true, font: 'Arial', size: 21 }),
                  new TextRun({ text: p.title, font: 'Arial', size: 21 }),
                ],
              }),
            ],
          }),
        ],
      });
    })
  );

  const table2 = new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [table2HeaderRow, ...table2DataRows] });

  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertMillimetersToTwip(25),
              bottom: convertMillimetersToTwip(25),
              left: convertMillimetersToTwip(30),
              right: convertMillimetersToTwip(25),
            },
          },
        },
        children: [
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 400, after: 100 }, children: [new TextRun({ text: 'LAPORAN KINERJA', bold: true, font: 'Arial', size: 32 })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'PELAKSANAAN TUGAS OPERASIONAL KANTOR', bold: true, font: 'Arial', size: 28 })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 }, children: [new TextRun({ text: periodTitleCaps, bold: true, font: 'Arial', size: 28 })] }),

          ...(logoBuffer
            ? [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 400 }, children: [new ImageRun({ data: logoBuffer, transformation: { width: 120, height: 120 } })] })]
            : []),

          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 400, after: 120 }, children: [new TextRun({ text: 'Disusun oleh :', font: 'Arial', size: 24 })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: profile.nama.toUpperCase(), bold: true, font: 'Arial', size: 26 })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: profile.nip, bold: true, font: 'Arial', size: 24 })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 }, children: [new TextRun({ text: profile.jabatan, font: 'Arial', size: 24 })] }),

          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 400, after: 60 }, children: [new TextRun({ text: profile.instansi.toUpperCase(), bold: true, font: 'Arial', size: 24 })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(year), bold: true, font: 'Arial', size: 26 })] }),
          new Paragraph({ children: [new PageBreak()] }),

          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 300, after: 60 }, children: [new TextRun({ text: 'BAB I', bold: true, font: 'Arial', size: 26 })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [new TextRun({ text: 'PENDAHULUAN', bold: true, font: 'Arial', size: 26 })] }),

          new Paragraph({ spacing: { before: 200, after: 120 }, children: [new TextRun({ text: '1.1  LATAR BELAKANG', bold: true, font: 'Arial', size: 24 })] }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: 360, after: 200 },
            indent: { firstLine: convertInchesToTwip(0.5) },
            children: [new TextRun({ text: `Dalam rangka mendukung kelancaran pelaksanaan tugas dan fungsi organisasi, diperlukan dukungan sumber daya manusia yang mampu melaksanakan kegiatan operasional dan pelayanan perkantoran secara efektif, tertib, dan berkesinambungan. Salah satu bentuk dukungan tersebut dilaksanakan melalui penempatan ${profile.statusPegawai} pada jabatan ${profile.jabatan}.`, font: 'Arial', size: 23 })],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: 360, after: 400 },
            indent: { firstLine: convertInchesToTwip(0.5) },
            children: [new TextRun({ text: `${profile.statusPegawai} pada jabatan tersebut memiliki peran dalam membantu pelaksanaan kegiatan administrasi, layanan internal, pengelolaan kebutuhan umum, penataan dokumen, pengelolaan sarana dan prasarana, serta dukungan terhadap berbagai kegiatan kedinasan. Pelaksanaan tugas tersebut diperlukan untuk memastikan kegiatan operasional kantor dapat berjalan dengan baik dan memberikan pelayanan yang optimal kepada pegawai maupun unit kerja. Sejalan dengan kebutuhan organisasi, pelaksanaan tugas ${profile.statusPegawai} perlu diarahkan secara jelas berdasarkan peran, tanggung jawab, dan hasil yang diharapkan. Oleh karena itu, diperlukan uraian mengenai ruang lingkup pekerjaan dan hasil pelaksanaan sebagai dasar dalam pengelolaan, pemantauan, dan evaluasi kinerja ${profile.statusPegawai}.`, font: 'Arial', size: 23 })],
          }),

          new Paragraph({ spacing: { before: 200, after: 120 }, children: [new TextRun({ text: '1.2  TUJUAN', bold: true, font: 'Arial', size: 24 })] }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: 360, after: 300 },
            indent: { firstLine: convertInchesToTwip(0.5) },
            children: [new TextRun({ text: `Tujuan penyusunan laporan pelaksanaan tugas dan fungsi jabatan ${profile.jabatan}, adalah sebagai bentuk pertanggungjawaban kinerja pegawai di lingkungan ${profile.instansi}, sesuai dengan uraian tugas yang tercantum dalam Matriks Peran Hasil (MPH) yang ditetapkan.`, font: 'Arial', size: 23 })],
          }),

          new Paragraph({ spacing: { before: 200, after: 120 }, children: [new TextRun({ text: '1.3  WAKTU PELAKSANAAN', bold: true, font: 'Arial', size: 24 })] }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: 360, after: 400 },
            indent: { firstLine: convertInchesToTwip(0.5) },
            children: [new TextRun({ text: `Kegiatan ${profile.jabatan} dilaksanakan di ${profile.lokasiSpesifik} pada periode ${periodLabelNormal}.`, font: 'Arial', size: 23 })],
          }),
          new Paragraph({ children: [new PageBreak()] }),

          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 300, after: 60 }, children: [new TextRun({ text: 'BAB II', bold: true, font: 'Arial', size: 26 })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [new TextRun({ text: 'AKUNTABILITAS KINERJA', bold: true, font: 'Arial', size: 26 })] }),

          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: '2.1  HASIL PELAKSANAAN', bold: true, font: 'Arial', size: 24 })] }),
          new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: `Kegiatan ${profile.jabatan}`, font: 'Arial', size: 23 })] }),
          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: `Tabel 1. Rincian kegiatan operator layanan operasional ${periodLabelNormal}.`, font: 'Arial', size: 23 })] }),

          table1,

          new Paragraph({ spacing: { before: 500, after: 200 }, children: [new TextRun({ text: 'Tabel 2. Dokumentasi Kegiatan', font: 'Arial', size: 23 })] }),

          table2,
          new Paragraph({ children: [new PageBreak()] }),

          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 300, after: 60 }, children: [new TextRun({ text: 'BAB III', bold: true, font: 'Arial', size: 26 })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [new TextRun({ text: 'PENUTUP', bold: true, font: 'Arial', size: 26 })] }),

          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: 360, after: 240 },
            indent: { firstLine: convertInchesToTwip(0.5) },
            children: [new TextRun({ text: `Pada ${periodLabelNormal}, pelaksanaan tugas ${profile.statusPegawai} jabatan ${profile.jabatan} telah mendukung kelancaran operasional KPS PVT I Manoko. Kegiatan utama meliputi pengolahan lahan, pemeliharaan, penyiraman, penyiangan dan pengendalian gulma, panen dan penanganan hasil panen, serta pelaksanaan uji BUSS, pembersihan area kerja, pemeliharaan sarana pendukung, dan dukungan kegiatan lainnya yang berhubungan dengan kegiatan operasional kebun. Secara umum kegiatan terlaksana secara tertib, efektif, dan sesuai dengan tugas serta mendukung pencapaian tujuan dan kelancaran tugas organisasi.`, font: 'Arial', size: 23 })],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: 360, after: 800 },
            indent: { firstLine: convertInchesToTwip(0.5) },
            children: [new TextRun({ text: 'Demikian laporan ini disampaikan. Atas perhatian dan kerjasamanya, diucapkan terima kasih.', font: 'Arial', size: 23 })],
          }),

          new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 60 }, children: [new TextRun({ text: `${profile.lokasiTtd}, ${profile.tanggalTtd || endDateStr}`, font: 'Arial', size: 23 })] }),
          new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 1200 }, children: [new TextRun({ text: profile.jabatan, font: 'Arial', size: 23 })] }),
          new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 40 }, children: [new TextRun({ text: profile.nama, bold: true, font: 'Arial', size: 24 })] }),
          new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: profile.nip, bold: true, font: 'Arial', size: 23 })] }),
        ],
      },
    ],
  });
}

export async function exportReportToWord(params: ExportWordParams): Promise<void> {
  const doc = await buildReportDocument(params);
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Laporan_Kinerja_${params.periodLabelNormal.replace(/\s+/g, '_')}_${params.profile.nama.replace(/\s+/g, '_')}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function generateWordBlob(params: ExportWordParams): Promise<Blob> {
  const doc = await buildReportDocument(params);
  return await Packer.toBlob(doc);
}
