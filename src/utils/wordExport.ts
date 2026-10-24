import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  WidthType,
  BorderStyle,
} from 'docx';

export async function generateWordReport(data: any): Promise<Blob> {
  // Mengambil data dinamis yang dikirim dari App.tsx
  const { periodTitleCaps, year, profile, activities } = data;

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // 1. Judul Laporan Dinamis
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `LAPORAN KINERJA ${periodTitleCaps}`,
                bold: true,
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `TAHUN ${year}`,
                bold: true,
                size: 28,
              }),
            ],
          }),
          new Paragraph({ text: "" }), // Spasi

          // 2. Nama Penyusun Dinamis (Otomatis mengambil dari Profil)
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `Disusun oleh: ${profile?.nama || '[Nama Belum Diisi]'}`,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `NIP: ${profile?.nip || '-'}`,
                size: 24,
              }),
            ],
          }),
          new Paragraph({ text: "" }), // Spasi
          new Paragraph({ text: "" }), // Spasi

          // 3. Tabel Kegiatan Dasar
          new Paragraph({
            children: [
              new TextRun({
                text: "Rincian Kegiatan:",
                bold: true,
                size: 24,
              }),
            ],
          }),
          new Paragraph({ text: "" }), // Spasi

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
              insideVertical: { style: BorderStyle.SINGLE, size: 1 },
            },
            rows: [
              // Header Tabel
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Waktu", alignment: AlignmentType.CENTER })] }),
                  new TableCell({ children: [new Paragraph({ text: "Uraian Pekerjaan", alignment: AlignmentType.CENTER })] }),
                ],
              }),
              // Isi Tabel Dinamis dari Logbook Anda
              ...(activities || []).map((act: any) => {
                return new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph(act.tanggalStr || "-")] }),
                    new TableCell({ children: [new Paragraph(act.kegiatan || "-")] }),
                  ],
                });
              }),
            ],
          }),
        ],
      },
    ],
  });

  // Generate dokumen menjadi Blob agar bisa didownload
  const blob = await Packer.toBlob(doc);
  return blob;
}
