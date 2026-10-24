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
  VerticalAlign,
  ImageRun,
} from 'docx';

// Fungsi bantuan untuk mengambil gambar dari URL menjadi Buffer agar bisa masuk ke Word
async function fetchImageBuffer(url: string): Promise<ArrayBuffer | null> {
  try {
    if (!url) return null;
    if (url.startsWith('data:')) {
      const base64Data = url.split(',')[1];
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    }
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.arrayBuffer();
  } catch (e) {
    console.warn("Gagal memuat gambar untuk Word:", url, e);
    return null;
  }
}

export async function generateWordReport(data: any): Promise<Blob> {
  const { periodTitleCaps, periodLabelNormal, year, profile, activities, photos, endDateStr } = data;

  // 1. Proses Data Foto Secara Asinkron Sebelum Membuat Dokumen
  const photoRows = [];
  if (photos && photos.length > 0) {
    for (const photo of photos) {
      const imgBuffer = await fetchImageBuffer(photo.imageUrl);
      
      let photoCellContent;
      if (imgBuffer) {
        photoCellContent = new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new ImageRun({
              data: imgBuffer,
              transformation: { width: 250, height: 250 }, // Ukuran foto di Word
            }),
          ],
        });
      } else {
        photoCellContent = new Paragraph({
          text: "[Gambar tidak dapat dimuat / Tempel Gambar Di Sini]",
          alignment: AlignmentType.CENTER,
        });
      }

      photoRows.push(
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              verticalAlign: VerticalAlign.CENTER,
              children: [photoCellContent],
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              verticalAlign: VerticalAlign.CENTER,
              children: [
                new Paragraph({ text: photo.title || "-", spacing: { after: 100 } }),
                new Paragraph({ text: photo.dateStr || "", spacing: { after: 100 } }),
                new Paragraph({ text: photo.locationName || "" }),
              ],
            }),
          ],
        })
      );
    }
  } else {
    photoRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("-")] }),
          new TableCell({ children: [new Paragraph("Belum ada dokumentasi")] }),
        ],
      })
    );
  }

  // 2. Pembuatan Dokumen Word
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // ==========================================
          // HALAMAN SAMPUL (COVER)
          // ==========================================
          new Paragraph({ text: "", spacing: { before: 2000 } }), 

          // (TEMPAT LOGO) 
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "[ TEMPEL LOGO KEMENTAN DI SINI ]", 
                bold: true,
                color: "888888",
              }),
            ],
            spacing: { after: 1000 },
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "LAPORAN KINERJA", bold: true, size: 32 }), // 16pt
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "PELAKSANAAN TUGAS OPERASIONAL KANTOR", bold: true, size: 28 }), // 14pt
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: `${periodTitleCaps} TAHUN ${year}`, bold: true, size: 28 }),
            ],
          }),

          new Paragraph({ text: "", spacing: { before: 3000, after: 2000 } }), // Spasi Kosong

          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "Disusun oleh :", size: 24 })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: profile?.nama || "[Nama Anda]", bold: true, size: 24 })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: profile?.nip || "-", size: 24 })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "Operator Layanan Operasional", size: 24 })],
          }),

          new Paragraph({ text: "", spacing: { before: 2000 } }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "PUSAT PELINDUNGAN VARIETAS TANAMAN", bold: true, size: 24 }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "DAN PERIZINAN PERTANIAN", bold: true, size: 24 }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: `${year}`, bold: true, size: 24 }),
            ],
            pageBreakBefore: false,
          }),

          // ==========================================
          // BAB I : PENDAHULUAN
          // ==========================================
          new Paragraph({
            pageBreakBefore: true,
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "BAB I", bold: true, size: 28 })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "PENDAHULUAN", bold: true, size: 28 })],
            spacing: { after: 400 },
          }),

          new Paragraph({ children: [new TextRun({ text: "1.1 LATAR BELAKANG", bold: true, size: 24 })], spacing: { after: 100 } }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED, // Rata Kiri Kanan
            children: [
              new TextRun({ text: "Dalam rangka mendukung kelancaran pelaksanaan tugas dan fungsi organisasi, diperlukan dukungan sumber daya manusia yang mampu melaksanakan kegiatan operasional dan pelayanan perkantoran secara efektif, tertib, dan berkesinambungan. Salah satu bentuk dukungan tersebut dilaksanakan melalui penempatan PPPK Paruh Waktu pada jabatan Operator Layanan Operasional.", size: 24 }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({ text: "PPPK Paruh Waktu pada jabatan tersebut memiliki peran dalam membantu pelaksanaan kegiatan administrasi, layanan internal, pengelolaan kebutuhan umum, penataan dokumen, pengelolaan sarana dan prasarana, serta dukungan terhadap berbagai kegiatan kedinasan. Pelaksanaan tugas tersebut diperlukan untuk memastikan kegiatan operasional kantor dapat berjalan dengan baik dan memberikan pelayanan yang optimal kepada pegawai maupun unit kerja. Sejalan dengan kebutuhan organisasi, pelaksanaan tugas PPPK Paruh Waktu perlu diarahkan secara jelas berdasarkan peran, tanggung jawab, dan hasil yang diharapkan. Oleh karena itu, diperlukan uraian mengenai ruang lingkup pekerjaan dan hasil pelaksanaan sebagai dasar dalam pengelolaan, pemantauan, dan evaluasi kinerja PPPK Paruh Waktu.", size: 24 }),
            ],
            spacing: { after: 400 },
          }),

          new Paragraph({ children: [new TextRun({ text: "1.2 TUJUAN", bold: true, size: 24 })], spacing: { after: 100 } }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({ text: "Tujuan penyusunan laporan pelaksanaan tugas dan fungsi jabatan Operator Layanan Operasional, adalah sebagai bentuk pertanggungjawaban kinerja pegawai di lingkungan Pusat Pelindungan Varietas Tanaman dan Perizinan Pertanian, sesuai dengan uraian tugas yang tercantum dalam Matriks Peran Hasil (MPH) yang ditetapkan.", size: 24 }),
            ],
            spacing: { after: 400 },
          }),

          new Paragraph({ children: [new TextRun({ text: "1.3 WAKTU PELAKSANAAN", bold: true, size: 24 })], spacing: { after: 100 } }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({ text: `Kegiatan Operator Layanan Operasional dilaksanakan di Kebun Pemeriksaan Substantif PVT I Manoko pada satuan Kerja Kantor Pusat Pusat Pelindungan Varietas Tanaman dan Perizinan Pertanian (PVTPP) pada periode ${periodLabelNormal} Tahun ${year}.`, size: 24 }),
            ],
            spacing: { after: 400 },
          }),

          // ==========================================
          // BAB II : AKUNTABILITAS KINERJA (TABEL DINAMIS)
          // ==========================================
          new Paragraph({
            pageBreakBefore: true,
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "BAB II", bold: true, size: 28 })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "AKUNTABILITAS KINERJA", bold: true, size: 28 })],
            spacing: { after: 400 },
          }),

          new Paragraph({ children: [new TextRun({ text: "2.1 HASIL PELAKSANAAN", bold: true, size: 24 })], spacing: { after: 100 } }),
          new Paragraph({ children: [new TextRun({ text: "Kegiatan Operator Layanan Operasional", size: 24 })], spacing: { after: 200 } }),
          
          new Paragraph({
            children: [new TextRun({ text: `Tabel 1. Rincian kegiatan operator layanan operasional ${periodLabelNormal} Tahun ${year}`, size: 24 })],
            spacing: { after: 100 },
          }),

          // TABEL 1 : RINCIAN KEGIATAN LOGBOOK
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
              // Header Tabel 1
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: "No.", alignment: AlignmentType.CENTER, style: "Strong" })] }),
                  new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: "Waktu/Tanggal", alignment: AlignmentType.CENTER, style: "Strong" })] }),
                  new TableCell({ width: { size: 45, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: "Rincian Pekerjaan", alignment: AlignmentType.CENTER, style: "Strong" })] }),
                  new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: "Keterangan", alignment: AlignmentType.CENTER, style: "Strong" })] }),
                ],
              }),
              
              // Looping Data Logbook
              ...(activities && activities.length > 0 ? activities.map((act: any, index: number) => {
                const tanggalText = act.tanggalStr || act.waktu || act.tanggal || "-";
                const uraianText = act.uraianPekerjaan || act.kegiatan || act.uraian || "-";
                const ketText = act.keterangan || act.lokasiBlok || "-";

                return new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: (index + 1).toString(), alignment: AlignmentType.CENTER })] }),
                    new TableCell({ children: [new Paragraph({ text: tanggalText })] }),
                    new TableCell({ children: [new Paragraph({ text: uraianText, alignment: AlignmentType.JUSTIFIED })] }), // Rata kiri kanan di uraian
                    new TableCell({ children: [new Paragraph({ text: ketText })] }),
                  ],
                });
              }) : [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph("-")] }),
                    new TableCell({ children: [new Paragraph("-")] }),
                    new TableCell({ children: [new Paragraph("Belum ada data kegiatan logbook")] }),
                    new TableCell({ children: [new Paragraph("-")] }),
                  ]
                })
              ]),
            ],
          }),

          new Paragraph({ text: "", spacing: { before: 400, after: 200 } }),

          // TABEL 2 : DOKUMENTASI FOTO
          new Paragraph({
            children: [new TextRun({ text: "Tabel 2. Dokumentasi Kegiatan", size: 24 })],
            spacing: { after: 100 },
          }),
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
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Foto", alignment: AlignmentType.CENTER, style: "Strong" })] }),
                  new TableCell({ children: [new Paragraph({ text: "Keterangan", alignment: AlignmentType.CENTER, style: "Strong" })] }),
                ],
              }),
              ...photoRows, // Memasukkan baris foto yang sudah diproses di atas
            ],
          }),

          // ==========================================
          // BAB III : PENUTUP
          // ==========================================
          new Paragraph({
            pageBreakBefore: true,
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "BAB III", bold: true, size: 28 })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "PENUTUP", bold: true, size: 28 })],
            spacing: { after: 400 },
          }),

          new Paragraph({
            alignment: AlignmentType.JUSTIFIED, // Rata Kiri Kanan
            children: [
              new TextRun({ text: `Pada ${periodLabelNormal} Tahun ${year}, pelaksanaan tugas PPPK Paruh Waktu jabatan Operator Layanan Operasional telah mendukung kelancaran operasional KPS PVT I Manoko. Kegiatan utama meliputi pengolahan lahan, pemeliharaan, penyiraman, penyiangan dan pengendalian gulma, panen dan penanganan hasil panen, serta pelaksanaan uji BUSS, pembersihan area kerja, pemeliharaan sarana pendukung, dan dukungan kegiatan lainnya yang berhubungan dengan kegiatan operasional kebun. Secara umum kegiatan terlaksana secara tertib, efektif, dan sesuai dengan tugas serta mendukung pencapaian tujuan dan kelancaran tugas organisasi.`, size: 24 }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({ text: "Demikian laporan ini disampaikan. Atas perhatian dan kerjasamanya, diucapkan terima kasih.", size: 24 }),
            ],
            spacing: { after: 800 }, // Jarak untuk tanda tangan
          }),

          // TANDA TANGAN (Rata Kanan)
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: `Bandung Barat, ${endDateStr || '30 Juni 2026'}`, size: 24 })],
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: "Operator Layanan Operasional", size: 24 })],
            spacing: { after: 1200 }, // Ruang kosong untuk tanda tangan pena
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: profile?.nama || "[Nama Anda]", bold: true, size: 24 })],
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: profile?.nip || "-", size: 24 })],
          }),

        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}
