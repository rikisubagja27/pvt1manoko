import { DocumentationPhoto, PeriodActivityRow, UserProfile } from '../types';

export const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export const QUARTER_INFO = [
  { id: 1, name: 'Triwulan I', roman: 'I', months: [1, 2, 3], range: 'Januari - Maret' },
  { id: 2, name: 'Triwulan II', roman: 'II', months: [4, 5, 6], range: 'April - Juni' },
  { id: 3, name: 'Triwulan III', roman: 'III', months: [7, 8, 9], range: 'Juli - September' },
  { id: 4, name: 'Triwulan IV', roman: 'IV', months: [10, 11, 12], range: 'Oktober - Desember' },
];

export const DEFAULT_USER_PROFILE: UserProfile = {
  nama: 'RIKI SUBAGJA',
  nip: '199808272025211042',
  jabatan: 'Operator Layanan Operasional',
  statusPegawai: 'PPPK Paruh Waktu',
  satuanKerja: 'Kebun Pemeriksaan Substantif PVT I Manoko',
  lokasiSpesifik: 'Kebun Pemeriksaan Substantif PVT I Manoko pada satuan Kerja Kantor Pusat Pusat Pelindungan Varietas Tanaman dan Perizinan Pertanian (PVTPP)',
  instansi: 'PUSAT PELINDUNGAN VARIETAS TANAMAN DAN PERIZINAN PERTANIAN',
  lokasiTtd: 'Bandung Barat',
  tanggalTtd: '30 September 2026',
  useDigitalSignature: true,
};

// Activities dataset keyed by period
// Triwulan III activities exactly matches user's PDF sample!
export const DEFAULT_TRIWULAN_ACTIVITIES: Record<number, PeriodActivityRow[]> = {
  3: [
    {
      id: 'q3-jul',
      periodLabel: 'Juli',
      items: [
        {
          category: 'Pengolahan Lahan & Persiapan Tanam',
          details: 'pengolahan lahan Blok C7 (belakang/sekitar screen house), penggaritan dan pembuatan bedengan menggunakan cultivator, pengolahan Blok C8 serta persiapan Blok C4 dan C1 berupa pembongkaran mulsa, perataan tanah dan pembuatan lubang tanam.',
        },
        {
          category: 'Pemeliharaan & Sanitasi',
          details: 'pembersihan gulma di Blok B2 dan C6 serta penyiraman tanaman.',
        },
        {
          category: 'Penanaman & Persemaian',
          details: 'persiapan persemaian Uji BUSS bawang merah TSS, pembelian bibit selada, penanaman dan penyiraman selada.',
        },
        {
          category: 'Panen',
          details: 'panen koleksi pakcoy di Blok E4 Nahkoda.',
        },
        {
          category: 'Dukungan Operasional',
          details: 'pemasangan/perbaikan lampu, perbaikan kabel aula, pemasangan bingkai SOP laboratorium, pemasangan bendera, pembelian tong, kunjungan Sekjen dan praktik Biosaka.',
        },
      ],
      keterangan: '',
    },
    {
      id: 'q3-aug',
      periodLabel: 'Agustus',
      items: [
        {
          category: 'Persiapan Lahan',
          details: 'pemasangan mulsa, pembuatan lubang tanam, pengolahan lahan Blok C4 dan C7 serta pembongkaran mulsa.',
        },
        {
          category: 'Penanaman & Pemeliharaan',
          details: 'penanaman tomat monitoring di Blok C1, penanaman/penyulaman selada, penanaman brokoli, penyiraman tomat monev dan koleksi, serta penyiraman persemaian bawang merah dan selada keriting.',
        },
        {
          category: 'Uji BUSS',
          details: 'pembuatan lubang tanam, plang dan penanaman jagung Uji BUSS; pembuatan plang Uji BUSS bawang merah dan penanaman bawang merah.',
        },
        {
          category: 'Pemupukan & Saprodi',
          details: 'pengangkutan/penebaran pupuk kandang ayam, pembelanjaan sarana produksi, pembelian botol spray, pengecekan/pembelian sprinkler, dan pembuatan semat.',
        },
        {
          category: 'Panen',
          details: 'panen jagung dan panen koleksi selada keriting.',
        },
        {
          category: 'Sarana/Administrasi',
          details: 'perbaikan plafon, perbaikan cultivator dan motor dinas, pemasangan pipa embung, evaluasi e-Personal, serta rekap logbook.',
        },
      ],
      keterangan: '',
    },
    {
      id: 'q3-sep',
      periodLabel: 'September',
      items: [
        {
          category: 'Pengolahan Lahan',
          details: 'pengolahan Blok C4 dan C5, pemasangan mulsa, penggaritan bedengan, pengangkutan dan penebaran pupuk ayam, pembuatan lubang tanam, serta pengolahan lahan bekas tanaman jagung.',
        },
        {
          category: 'Pemeliharaan Tanaman',
          details: 'pemasangan/pengikatan turus tomat monev, penyetekan tomat ceri, pengikatan tomat ceri, penyiraman bawang merah, tomat monev, jagung Uji BUSS, selada dan brokoli, serta pembersihan gulma.',
        },
        {
          category: 'Sanitasi & Pengendalian Gulma',
          details: 'penyemprotan herbisida di Blok C4 dan area jalan, pembabadan/penyiangan gulma dan ranting sekitar pagar, serta Jum\'at Bersih.',
        },
        {
          category: 'Uji BUSS & Monitoring',
          details: 'koordinasi/kunjungan bawang merah Uji BUSS, penyortiran bawang merah, penanaman bawang merah di polibag, serta pemeliharaan jagung Uji BUSS dan tomat monev.',
        },
        {
          category: 'Panen',
          details: 'panen koleksi terong, selada dan sawi putih.',
        },
        {
          category: 'Dukungan Kedinasan',
          details: 'rapat kinerja 2026, rapat koordinasi PPPK Paruh Waktu, koordinasi/pemaparan kondisi lahan untuk Irjen, pembelian/pemasangan lampu gedung kantor, pembuangan pasir bekas pengamatan, dan pekerjaan pendukung lainnya.',
        },
      ],
      keterangan: '',
    },
  ],
  1: [
    {
      id: 'q1-jan',
      periodLabel: 'Januari',
      items: [
        {
          category: 'Persiapan Awal Musim & Lahan',
          details: 'Pembersihan sisa tanaman musim lalu pada Blok A dan Blok B, pembalikan tanah menggunakan traktor mini/cultivator, dan perbaikan saluran drainase keliling kebun.',
        },
        {
          category: 'Persemaian & Pembenihan',
          details: 'Penyemaian benih tanaman koleksi cabai dan tomat pada tray semai di screen house, sterilisasi media tanam campuran tanah, arang sekam, dan pupuk kompos.',
        },
        {
          category: 'Pemeliharaan Sarana',
          details: 'Pengecekan instalasi pompa air embung, pembersihan bak penampungan air nutrisi, dan perbaikan atap paranet screen house 2.',
        },
        {
          category: 'Dukungan Operasional',
          details: 'Penyusunan rencana kerja operasional bulanan, pencatatan inventaris alat mesin pertanian (alsintan), dan rapat koordinasi awal tahun.',
        },
      ],
      keterangan: '',
    },
    {
      id: 'q1-feb',
      periodLabel: 'Februari',
      items: [
        {
          category: 'Penanaman Koleksi & Uji',
          details: 'Pemindahan bibit cabai dan tomat ke bedengan terbuka Blok A2, pemasangan ajir bambu, serta penanaman varietas pembanding kedelai.',
        },
        {
          category: 'Pemupukan Dasar & Pengendalian Gulma',
          details: 'Aplikasi pupuk kandang matang dan dolomit, penyiangan rumput liar di sekitar pematang dan jalur akses traktor.',
        },
        {
          category: 'Dukungan Operasional',
          details: 'Perawatan rutin mesin pemotong rumput dan cultivator, pengadaan kantong polibag, serta pelayanan teknis kunjungan mahasiswa magang.',
        },
      ],
      keterangan: '',
    },
    {
      id: 'q1-mar',
      periodLabel: 'Maret',
      items: [
        {
          category: 'Pemeliharaan Rutin & Pengamatan',
          details: 'Penyiraman berkala pagi dan sore, pengikatan tunas batang utama tomat, monitoring intensitas hama thrips dan kutu kebul.',
        },
        {
          category: 'Sanitasi Kebun',
          details: 'Penyemprotan fungisida dan insektisida nabati secara selektif, pemangkasan daun tua/kuning (pruning) pada tanaman koleksi.',
        },
        {
          category: 'Dukungan Kedinasan',
          details: 'Fasilitasi rapat evaluasi triwulanan KPS PVT I Manoko, rekapitulasi buku logbook harian, serta kerja bakti kebersihan lingkungan kantor.',
        },
      ],
      keterangan: '',
    },
  ],
  2: [
    {
      id: 'q2-apr',
      periodLabel: 'April',
      items: [
        {
          category: 'Persiapan Lahan Blok Baru',
          details: 'Pengolahan tanah Blok C untuk penanaman komoditas hortikultura musim kemarau, perataan tanah dan pemasangan mulsa plastik hitam perak (MPHP).',
        },
        {
          category: 'Pelaksanaan Uji BUSS',
          details: 'Persiapan petak uji baru untuk varietas kentang dan wortel, pemasangan patok tanda batas perlakuan dan penomoran aksesi.',
        },
        {
          category: 'Pemeliharaan',
          details: 'Pembersihan saluran irigasi tetes (drip irrigation), penggantian emitter yang tersumbat kapur, dan pemupukan kocor NPK.',
        },
      ],
      keterangan: '',
    },
    {
      id: 'q2-may',
      periodLabel: 'Mei',
      items: [
        {
          category: 'Penanaman & Penyulaman',
          details: 'Penanaman benih jagung manis dan buncis tegak, penyulaman tanaman yang mati atau kerdil pada umur 7 HST.',
        },
        {
          category: 'Panen Perdana Koleksi',
          details: 'Pemanenan cabai rawit dan tomat sayur Blok A2, sortasi berdasarkan ukuran mutu, dan penimbangan hasil panen untuk data karakterisasi.',
        },
        {
          category: 'Dukungan Operasional',
          details: 'Pengecatan ulang tiang batas kebun, pembenahan gudang alsintan, dan penginputan data logbook kinerja mandiri.',
        },
      ],
      keterangan: '',
    },
    {
      id: 'q2-jun',
      periodLabel: 'Juni',
      items: [
        {
          category: 'Pengendalian Hama & Sanitasi',
          details: 'Pemberantasan ulat grayak pada jagung dengan insektisida terpadu, pemotongan semak belukar batas barat kebun Manoko.',
        },
        {
          category: 'Panen & Pasca Panen',
          details: 'Panen polong buncis dan panen jagung koleksi, pemisahan biji untuk penyimpanan benih arsip kebun.',
        },
        {
          category: 'Dukungan Kedinasan',
          details: 'Pendampingan tim penguji BUSS dari kantor pusat PVTPP, rekonsiliasi data inventaris kantor, serta pemeliharaan kendaraan operasional.',
        },
      ],
      keterangan: '',
    },
  ],
  4: [
    {
      id: 'q4-oct',
      periodLabel: 'Oktober',
      items: [
        {
          category: 'Persiapan Menghadapi Musim Hujan',
          details: 'Pembersihan total sedimen di selokan dan kolam retensi embung, pembuatan rorak dan guludan tinggi pada Blok C dan D.',
        },
        {
          category: 'Penanaman Sayuran Daun',
          details: 'Penanaman bibit kailan, caisim, dan kangkung darat, penaburan pupuk organik granula dan kapur pertanian.',
        },
        {
          category: 'Dukungan Operasional',
          details: 'Perbaikan instalasi talang air kantor dan screen house, pengadaan terpal penutup pupuk kompos.',
        },
      ],
      keterangan: '',
    },
    {
      id: 'q4-nov',
      periodLabel: 'November',
      items: [
        {
          category: 'Pemeliharaan Tanaman Musim Hujan',
          details: 'Penyemprotan fungisida preventif untuk mencegah busuk daun, perbaikan lanjaran/turus roboh akibat angin kencang.',
        },
        {
          category: 'Uji BUSS & Karakterisasi',
          details: 'Bantu pemeriksa PVT dalam pengukuran morfologi tinggi tanaman, lebar daun, dan waktu keluarnya malai/bunga.',
        },
        {
          category: 'Administrasi & Logbook',
          details: 'Perekapan absensi dan logbook bulanan, pendataan aset kantor akhir tahun anggaran.',
        },
      ],
      keterangan: '',
    },
    {
      id: 'q4-dec',
      periodLabel: 'Desember',
      items: [
        {
          category: 'Panen Akhir & Pembersihan Lahan',
          details: 'Panen sayuran penutup musim, pembongkaran bedengan bekas uji, pengumpulan sisa jerami dan mulsa rusak ke tempat pengolahan sampah.',
        },
        {
          category: 'Perawatan Alsintan & Fasilitas',
          details: 'Penggantian oli dan servis berkala mesin traktor, cultivator, dan genset darurat; pembersihan menyeluruh gudang saprodi.',
        },
        {
          category: 'Dukungan Kedinasan Akhir Tahun',
          details: 'Penyusunan laporan tahunan kinerja operasional kantor, rapat evaluasi capaian target tahunan KPS PVT I Manoko bersama pimpinan.',
        },
      ],
      keterangan: '',
    },
  ],
};

// Monthly activities breakdown by weeks (for Bulanan mode)
export const DEFAULT_MONTHLY_WEEKS: Record<number, PeriodActivityRow[]> = {
  7: [ // Juli
    {
      id: 'jul-w1',
      periodLabel: 'Minggu I',
      subLabel: '1 - 7 Juli 2026',
      items: [
        {
          category: 'Pengolahan Lahan',
          details: 'Pengolahan lahan Blok C7 (belakang screen house), penggaritan dan pembuatan bedengan baru menggunakan cultivator.',
        },
        {
          category: 'Sarana & Prasarana',
          details: 'Pengecekan instalasi listrik aula kebun, perbaikan kabel dan fitting lampu penerangan jalan kantor.',
        },
      ],
    },
    {
      id: 'jul-w2',
      periodLabel: 'Minggu II',
      subLabel: '8 - 14 Juli 2026',
      items: [
        {
          category: 'Persiapan Tanam',
          details: 'Pengolahan Blok C8 serta persiapan Blok C4 dan C1 berupa pembongkaran mulsa lama, perataan tanah bedengan dan pembuatan lubang tanam.',
        },
        {
          category: 'Persemaian',
          details: 'Persiapan media semai dan penaburan benih Uji BUSS bawang merah TSS pada tray semai di screen house.',
        },
      ],
    },
    {
      id: 'jul-w3',
      periodLabel: 'Minggu III',
      subLabel: '15 - 21 Juli 2026',
      items: [
        {
          category: 'Penanaman & Pemeliharaan',
          details: 'Pembelian bibit selada, penanaman selada di bedengan Blok C1, serta penyiraman rutin pagi dan sore hari.',
        },
        {
          category: 'Sanitasi Gulma',
          details: 'Pembersihan rumput liar dan gulma di Blok B2 dan C6 serta pembersihan saluran air drainase.',
        },
      ],
    },
    {
      id: 'jul-w4',
      periodLabel: 'Minggu IV',
      subLabel: '22 - 31 Juli 2026',
      items: [
        {
          category: 'Panen & Pasca Panen',
          details: 'Panen koleksi tanaman pakcoy di Blok E4 Nahkoda, pencucian dan penimbangan hasil panen.',
        },
        {
          category: 'Dukungan Operasional Kedinasan',
          details: 'Pemasangan bingkai SOP laboratorium PVT, pemasangan tiang bendera, penerimaan kunjungan Sekjen dan praktik Biosaka bersama staf.',
        },
      ],
    },
  ],
  8: [ // Agustus
    {
      id: 'aug-w1',
      periodLabel: 'Minggu I',
      subLabel: '1 - 7 Agustus 2026',
      items: [
        {
          category: 'Persiapan Lahan',
          details: 'Pemasangan mulsa plastik hitam perak pada Blok C4 dan C7, penyiapan alat pelubang mulsa dan pembuatan lubang tanam sistem zig-zag.',
        },
        {
          category: 'Penanaman',
          details: 'Penanaman tomat monitoring di Blok C1 dan penyulaman bibit selada yang mati.',
        },
      ],
    },
    {
      id: 'aug-w2',
      periodLabel: 'Minggu II',
      subLabel: '8 - 14 Agustus 2026',
      items: [
        {
          category: 'Uji BUSS',
          details: 'Pembuatan lubang tanam, pembuatan plang informasi varietas dan penanaman jagung Uji BUSS.',
        },
        {
          category: 'Pemupukan & Saprodi',
          details: 'Pengangkutan dan penebaran pupuk kandang ayam matang, pembelanjaan obat pertanian, sprinkler dan pembuatan semat bambu.',
        },
      ],
    },
    {
      id: 'aug-w3',
      periodLabel: 'Minggu III',
      subLabel: '15 - 21 Agustus 2026',
      items: [
        {
          category: 'Penanaman Uji BUSS Bawang Merah',
          details: 'Pembuatan plang varietas Uji BUSS bawang merah dan penanaman umbi bawang merah pada bedengan yang telah dimulsa.',
        },
        {
          category: 'Penyiraman & Perawatan',
          details: 'Penyiraman tanaman tomat monev, tanaman koleksi, persemaian bawang merah TSS dan selada keriting.',
        },
      ],
    },
    {
      id: 'aug-w4',
      periodLabel: 'Minggu IV',
      subLabel: '22 - 31 Agustus 2026',
      items: [
        {
          category: 'Panen',
          details: 'Panen tongkol jagung koleksi dan pemanenan sayuran selada keriting Blok C1.',
        },
        {
          category: 'Sarana & Administrasi',
          details: 'Perbaikan plafon ruang kantor, servis motor dinas dan cultivator, pemasangan pipa embung, evaluasi e-Personal serta rekap logbook bulanan.',
        },
      ],
    },
  ],
  9: [ // September
    {
      id: 'sep-w1',
      periodLabel: 'Minggu I',
      subLabel: '1 - 7 September 2026',
      items: [
        {
          category: 'Pengolahan Lahan',
          details: 'Pengolahan tanah Blok C4 dan C5, pemasangan mulsa, penggaritan bedengan, penebaran pupuk ayam, dan pembersihan lahan bekas jagung.',
        },
        {
          category: 'Sanitasi Lahan',
          details: 'Penyemprotan herbisida secara terarah di batas Blok C4 dan pembersihan rumput area jalan kebun.',
        },
      ],
    },
    {
      id: 'sep-w2',
      periodLabel: 'Minggu II',
      subLabel: '8 - 14 September 2026',
      items: [
        {
          category: 'Pemeliharaan Tanaman',
          details: 'Pemasangan dan pengikatan turus bambu tanaman tomat monev, penyetekan dan pengikatan tanaman tomat ceri.',
        },
        {
          category: 'Uji BUSS',
          details: 'Penyortiran umbi bawang merah untuk pengamatan, penanaman bawang merah cadangan di polibag.',
        },
      ],
    },
    {
      id: 'sep-w3',
      periodLabel: 'Minggu III',
      subLabel: '15 - 21 September 2026',
      items: [
        {
          category: 'Penyiraman & Penyiangan',
          details: 'Penyiraman teratur tanaman bawang merah, tomat, jagung Uji BUSS, brokoli, serta kegiatan Jum\'at Bersih lingkungan kantor.',
        },
        {
          category: 'Panen Sayuran',
          details: 'Panen koleksi terong ungu, selada, dan sawi putih untuk kebutuhan evaluasi dan konsumsi internal.',
        },
      ],
    },
    {
      id: 'sep-w4',
      periodLabel: 'Minggu IV',
      subLabel: '22 - 30 September 2026',
      items: [
        {
          category: 'Dukungan Kedinasan & Evaluasi',
          details: 'Mengikuti rapat kinerja 2026, rapat koordinasi PPPK Paruh Waktu, koordinasi pemaparan kondisi lahan untuk kunjungan Irjen.',
        },
        {
          category: 'Pemeliharaan Sarana',
          details: 'Penggantian lampu penerangan gedung kantor, pembuangan pasir bekas media pengamatan uji BUSS, dan finalisasi rekap logbook triwulanan.',
        },
      ],
    },
  ],
};

// Generates fallback weekly items for months not explicitly custom-mapped
export const generateDefaultMonthWeeks = (monthIndex: number, year: number): PeriodActivityRow[] => {
  const mName = MONTH_NAMES[monthIndex - 1];
  return [
    {
      id: `gen-${monthIndex}-w1`,
      periodLabel: 'Minggu I',
      subLabel: `1 - 7 ${mName} ${year}`,
      items: [
        {
          category: 'Pengolahan Lahan & Persiapan',
          details: `Pembersihan gulma pada petak tanam Blok C dan D, pembalikan tanah menggunakan cultivator, serta penataan bedengan ${mName}.`,
        },
        {
          category: 'Perawatan Sarana',
          details: 'Pemeriksaan rutin sistem pipa irigasi, pompa embung, dan kebersihan gudang penyimpanan saprodi.',
        },
      ],
    },
    {
      id: `gen-${monthIndex}-w2`,
      periodLabel: 'Minggu II',
      subLabel: `8 - 14 ${mName} ${year}`,
      items: [
        {
          category: 'Penanaman & Persemaian',
          details: 'Penanaman bibit tanaman koleksi kebun, penyemaian benih uji BUSS di screen house, dan pemasangan label penanda varietas.',
        },
        {
          category: 'Pemupukan Dasar',
          details: 'Aplikasi pupuk organik kandang dan pemberian nutrisi berimbang pada tanaman sayuran.',
        },
      ],
    },
    {
      id: `gen-${monthIndex}-w3`,
      periodLabel: 'Minggu III',
      subLabel: `15 - 21 ${mName} ${year}`,
      items: [
        {
          category: 'Pemeliharaan & Sanitasi',
          details: 'Penyiraman rutin pagi dan sore hari, penyiangan gulma di sela mulsa, pemasangan ajir dan pemangkasan tunas air.',
        },
        {
          category: 'Pengendalian Hama Penyakit',
          details: 'Monitoring dan pengendalian organisme pengganggu tanaman (OPT) secara ramah lingkungan dan sanitasi bedengan.',
        },
      ],
    },
    {
      id: `gen-${monthIndex}-w4`,
      periodLabel: 'Minggu IV',
      subLabel: `22 - akhir ${mName} ${year}`,
      items: [
        {
          category: 'Panen & Penanganan Hasil',
          details: 'Pemanenan tanaman hortikultura yang siap panen, sortasi kualitas, penimbangan hasil panen kebun.',
        },
        {
          category: 'Dukungan Administrasi & Kantor',
          details: `Penyusunan rekap logbook bulanan ${mName} ${year}, evaluasi presensi kerja, serta pemeliharaan kebersihan kantor dan aula.`,
        },
      ],
    },
  ];
};

// Tahunan Activities: summary of the 4 quarters or 12 months
export const generateTahunanActivities = (year: number): PeriodActivityRow[] => {
  return [
    {
      id: 'yr-q1',
      periodLabel: 'Triwulan I (Jan - Mar)',
      items: [
        {
          category: 'Pengolahan Lahan & Sanitasi',
          details: 'Pembersihan menyeluruh area kebun awal tahun, sterilisasi bedengan screen house, pengolahan tanah Blok A dan B.',
        },
        {
          category: 'Penanaman Koleksi Awal Musim',
          details: 'Penyemaian dan transplanting cabai, tomat, dan kedelai pembanding Uji BUSS.',
        },
        {
          category: 'Pemeliharaan Sarana',
          details: 'Servis alsintan traktor dan cultivator, perbaikan atap paranet dan instalasi pipa embung.',
        },
      ],
      keterangan: 'Terlaksana 100%',
    },
    {
      id: 'yr-q2',
      periodLabel: 'Triwulan II (Apr - Jun)',
      items: [
        {
          category: 'Persiapan Lahan Kering & Mulsa',
          details: 'Pengolahan tanah Blok C, pemasangan mulsa plastik hitam perak (MPHP), pembuatan lubang tanam sistem legowo.',
        },
        {
          category: 'Pelaksanaan Uji BUSS & Koleksi',
          details: 'Penanaman jagung manis, buncis, dan aksesi kentang, pemasangan label identitas aksesi serta pengukuran tinggi tanaman.',
        },
        {
          category: 'Panen & Karakterisasi',
          details: 'Panen perdana cabai rawit dan tomat koleksi, sortasi mutu, pencatatan berat basah.',
        },
      ],
      keterangan: 'Terlaksana 100%',
    },
    {
      id: 'yr-q3',
      periodLabel: 'Triwulan III (Jul - Sep)',
      items: [
        {
          category: 'Pengolahan Lahan Blok C & Penanaman Uji BUSS',
          details: 'Pengolahan Blok C4, C5, C7, C8; penanaman dan pemeliharaan jagung Uji BUSS, bawang merah TSS, tomat monev, selada, brokoli.',
        },
        {
          category: 'Pemupukan, Panen & Sanitasi',
          details: 'Penebaran pupuk kandang ayam, pemupukan susulan, panen pakcoy, jagung, terong, selada keriting, sawi putih, serta penyemprotan gulma.',
        },
        {
          category: 'Dukungan Operasional Kedinasan',
          details: 'Perbaikan sarana listrik dan plafon aula, pemasangan bingkai SOP lab, fasilitasi kunjungan Sekjen dan pemaparan lahan untuk Irjen.',
        },
      ],
      keterangan: 'Terlaksana 100%',
    },
    {
      id: 'yr-q4',
      periodLabel: 'Triwulan IV (Okt - Des)',
      items: [
        {
          category: 'Antisipasi Musim Hujan & Drainase',
          details: 'Normalisasi selokan, pembuatan rorak air embung, penanaman sayuran daun dataran tinggi.',
        },
        {
          category: 'Panen Akhir & Pembersihan Total Lahan',
          details: 'Pemanenan akhir tahun, pembongkaran mulsa usang, pengolahan sisa biomassa menjadi kompos.',
        },
        {
          category: 'Administrasi & Evaluasi Kinerja Tahunan',
          details: `Penyusunan laporan tahunan kinerja PPPK Paruh Waktu tahun ${year}, inventarisasi aset kebun PVT Manoko, dan perawatan akhir alsintan.`,
        },
      ],
      keterangan: 'Terlaksana 100%',
    },
  ];
};

// Default documentation photos matching pages 6-8 of the PDF with realistic GPS timestamp camera overlays
export const DEFAULT_DOCUMENTATION_PHOTOS: DocumentationPhoto[] = [
  {
    id: 'photo-1',
    title: 'Pengolahan lahan untuk persiapan penanaman tanaman koleksi.',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=800&q=80',
    dateStr: 'Sep 14, 2026',
    timeStr: '07:45:17',
    coordinates: 'S 6°48\'16.074", E 107°36\'50.629"',
    locationName: 'Jalan Sukatani, Cikahuripan, Kabupaten Bandung Barat',
    elevation: '1289.6 m a.s.l.',
    speed: '0.0km/h',
    direction: '156° SE',
    showGpsBadge: true,
    periodKey: 'triwulan-3',
  },
  {
    id: 'photo-2',
    title: 'Pemasangan mulsa untuk persiapan tanam koleksi.',
    imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
    dateStr: 'Sep 2, 2026',
    timeStr: '07:40:37',
    coordinates: 'S 6°48\'15.936", E 107°36\'48.137"',
    locationName: 'Cikahuripan, Kabupaten Bandung Barat',
    elevation: '1290.1 m a.s.l.',
    speed: '0.8km/h',
    direction: '202° S',
    showGpsBadge: true,
    periodKey: 'triwulan-3',
  },
  {
    id: 'photo-3',
    title: 'Pemasangan dan pembuatan lubang tanam.',
    imageUrl: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=800&q=80',
    dateStr: 'Sep 9, 2026',
    timeStr: '14:05:10',
    coordinates: 'S 6°48\'16.002", E 107°36\'49.521"',
    locationName: 'Kebun PVT I Manoko, Bandung Barat',
    elevation: '1288.4 m a.s.l.',
    speed: '0.0km/h',
    direction: '110° E',
    showGpsBadge: true,
    periodKey: 'triwulan-3',
  },
  {
    id: 'photo-4',
    title: 'Penanaman bawang merah Uji BUSS.',
    imageUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80',
    dateStr: 'Aug 31, 2026',
    timeStr: '09:04:29',
    coordinates: 'S 6°48\'16.141", E 107°36\'49.294"',
    locationName: 'Jalan Cikarebi, Kebun Manoko, Bandung Barat',
    elevation: '1292.0 m a.s.l.',
    speed: '0.5km/h',
    direction: '240° W',
    showGpsBadge: true,
    periodKey: 'triwulan-3',
  },
  {
    id: 'photo-5',
    title: 'Penyiraman tanaman.',
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
    dateStr: 'Sep 25, 2026',
    timeStr: '13:05:48',
    coordinates: 'S 6°48\'15.882", E 107°36\'51.011"',
    locationName: 'Cikahuripan, Kabupaten Bandung Barat',
    elevation: '1289.0 m a.s.l.',
    speed: '0.0km/h',
    direction: '180° S',
    showGpsBadge: true,
    periodKey: 'triwulan-3',
  },
  {
    id: 'photo-6',
    title: 'Pemberian pupuk susulan.',
    imageUrl: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80',
    dateStr: 'Aug 12, 2026',
    timeStr: '09:15:33',
    coordinates: 'S 6°48\'16.320", E 107°36\'49.072"',
    locationName: 'Blok C Kebun Manoko, Bandung Barat',
    elevation: '1291.5 m a.s.l.',
    speed: '0.2km/h',
    direction: '85° E',
    showGpsBadge: true,
    periodKey: 'triwulan-3',
  },
  {
    id: 'photo-7',
    title: 'Panen Seladah keriting',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    dateStr: 'Sep 10, 2026',
    timeStr: '07:46:22',
    coordinates: 'S 6°48\'15.981", E 107°36\'50.404"',
    locationName: 'Blok C1 Manoko, Lembang, Bandung Barat',
    elevation: '1290.0 m a.s.l.',
    speed: '0.0km/h',
    direction: '320° NW',
    showGpsBadge: true,
    periodKey: 'triwulan-3',
  },
  {
    id: 'photo-8',
    title: 'Rapat sosialisasi SOP pengamanan, bahaya judol dan pinjol.',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    dateStr: 'Sep 15, 2026',
    timeStr: '14:12:37',
    coordinates: 'S 6°48\'15.650", E 107°36\'50.912"',
    locationName: 'Aula KPS PVT I Manoko, Bandung Barat',
    elevation: '1288.0 m a.s.l.',
    speed: '0.0km/h',
    direction: '0° N',
    showGpsBadge: true,
    periodKey: 'triwulan-3',
  },
];
