import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  PageBreak,
  ImageRun,
  AlignmentType,
  WidthType,
} from 'docx';

// 1. Masukkan string Base64 logo Kementan di sini 
// (Ganti bagian data:image/png;base64,... dengan string base64 logo Anda yang sebenarnya)
const kementanLogoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

// Fungsi untuk mengubah Base64 menjadi Uint8Array agar bisa dibaca oleh docx
function base64ToUint8Array(base64: string): Uint8Array {
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function generateWordReport(data: any): Promise<Blob> {
  // Mengonversi logo base64 ke format buffer yang aman
  const logoBuffer = base64ToUint8Array(kementanLogoBase64);

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Paragraf Judul Laporan
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "TRIWULAN III TAHUN 2026",
                bold: true,
                size: 28,
              }),
            ],
          }),

          new Paragraph({ text: "" }), // Spasi kosong

          // Penyisipan Logo Kementan secara aman menggunakan ImageRun dari buffer
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new ImageRun({
                data: logoBuffer,
                transformation: {
                  width: 100, // Sesuaikan ukuran lebar logo (dalam pixel)
                  height: 100, // Sesuaikan ukuran tinggi logo (dalam pixel)
                },
              }),
            ],
          }),

          new Paragraph({ text: "" }), // Spasi kosong

          // Paragraf berikutnya
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "Disusun oleh: [Nama Anda/Instansi]",
                size: 24,
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
