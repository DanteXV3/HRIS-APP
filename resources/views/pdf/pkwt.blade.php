<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>PKWT - {{ $contract->second_party_name }}</title>
    <style>
        @page {
            margin: 140px 60px 60px 60px;
        }
        header {
            position: fixed;
            top: -120px;
            left: 0;
            right: 0;
            height: 100px;
            text-align: center;
        }
        footer {
            position: fixed;
            bottom: -40px;
            left: 0;
            right: 0;
            height: 40px;
        }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 10.5pt;
            line-height: 1.35;
            color: #000;
        }
        .header-img {
            display: block;
            margin: 0 auto;
            max-width: 100%;
            max-height: 100px;
            object-fit: contain;
        }
        .title {
            text-align: center;
            margin-bottom: 25px;
            width: 100%;
        }
        .title h1 {
            font-size: 14pt;
            margin: 0;
            text-decoration: underline;
            text-transform: uppercase;
            display: block;
            width: 100%;
        }
        .title p {
            margin: 5px 0 0 0;
            font-weight: bold;
            display: block;
            width: 100%;
        }
        .section {
            margin-bottom: 15px;
        }
        .pasal-title {
            text-align: center;
            font-weight: bold;
            margin: 15px 0 10px 0;
        }
        .pasal-title span {
            display: block;
            text-decoration: underline;
        }
        table.full {
            width: 100%;
            border-collapse: collapse;
        }
        table.data td {
            padding: 2px 0;
            vertical-align: top;
        }
        .label {
            width: 150px;
        }
        .sep {
            width: 15px;
            text-align: center;
        }
        .content-list {
            padding-left: 0;
            margin: 0;
        }
        .content-list ul {
            padding-left: 0;
            margin: 0;
            list-style: none;
        }
        .content-list li {
            margin-bottom: 8px;
            position: relative;
            padding-left: 25px;
        }
        .content-list li .li-index {
            position: absolute;
            left: 0;
            font-weight: normal;
        }
        .sub-list {
            margin-top: 5px;
        }
        .sub-list-item {
            display: table;
            width: 100%;
            margin-bottom: 3px;
        }
        .sub-list-index {
            display: table-cell;
            width: 35px;
        }
        .sub-list-label {
            display: table-cell;
            width: 150px;
        }
        .sub-list-sep {
            display: table-cell;
            width: 15px;
        }
        .sub-list-value {
            display: table-cell;
        }
        .paraf-box {
            border: 1px solid #000;
            width: 250px;
            font-size: 8pt;
        }
        .paraf-box table {
            width: 100%;
            border-collapse: collapse;
        }
        .paraf-box th, .paraf-box td {
            border: 1px solid #000;
            text-align: center;
            padding: 2px;
        }
        .paraf-box .sig-area {
            height: 30px;
        }
        .page-break {
            page-break-after: always;
        }
        .signature-table {
            width: 100%;
            margin-top: 40px;
            border-collapse: collapse;
        }
        .signature-table td {
            width: 50%;
            text-align: center;
            vertical-align: top;
        }
        .sig-space {
            height: 80px;
        }
        .bold { font-weight: bold; }
        .underline { text-decoration: underline; }
    </style>
</head>
<body>
    @php
        $headerImage = $contract->workLocation->header_image ?? null;
        $headerBase64 = null;
        if ($headerImage && Storage::disk('public')->exists($headerImage)) {
            $headerData = Storage::disk('public')->get($headerImage);
            $type = pathinfo(Storage::disk('public')->path($headerImage), PATHINFO_EXTENSION);
            $headerBase64 = 'data:image/' . $type . ';base64,' . base64_encode($headerData);
        }

        $isHO = str_contains(strtolower($contract->workingLocation->name ?? ''), 'ho') || str_contains(strtolower($contract->workingLocation->name ?? ''), 'head office');
        $mealSite = $contract->uang_makan_site ?? (!$isHO ? $contract->meal_allowance : 0);
        $mealHO = $isHO ? $contract->meal_allowance : 0;
    @endphp

    <header>
        @if($headerBase64)
            <img src="{{ $headerBase64 }}" class="header-img">
        @else
            <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px;">
                <h2 style="margin: 0;">{{ $contract->workLocation->name ?? 'PT. CIPTA DAYA MALINDO' }}</h2>
                <p style="margin: 5px 0 0 0; font-size: 9pt;">{{ $contract->workLocation->address }}</p>
            </div>
        @endif
    </header>

    <footer>
        <div class="paraf-box">
            <table>
                <tr>
                    <th colspan="2">PARAF</th>
                </tr>
                <tr>
                    <td style="width: 50%;">PIHAK PERTAMA</td>
                    <td style="width: 50%;">PIHAK KEDUA</td>
                </tr>
                <tr class="sig-area">
                    <td></td>
                    <td></td>
                </tr>
            </table>
        </div>
    </footer>

    <div class="title">
        <h1>PERJANJIAN KERJA</h1>
        <p>No. {{ $contract->contract_number }}</p>
    </div>

    <p>Yang bertanda tangan di bawah ini :</p>

    <table class="data full" style="margin-bottom: 15px;">
        <tr>
            <td style="width: 25px;">1.</td>
            <td class="label">Nama</td>
            <td class="sep">:</td>
            <td class="bold">{{ $contract->first_party_name }}</td>
        </tr>
        <tr>
            <td></td>
            <td class="label">Jabatan</td>
            <td class="sep">:</td>
            <td>{{ $contract->first_party_position }}</td>
        </tr>
        <tr>
            <td></td>
            <td class="label">Alamat</td>
            <td class="sep">:</td>
            <td>{{ $contract->first_party_address }}</td>
        </tr>
    </table>

    <table class="data full" style="margin-bottom: 15px;">
        <tr>
            <td style="width: 25px;">2.</td>
            <td class="label">Nama</td>
            <td class="sep">:</td>
            <td class="bold">{{ $contract->second_party_name }}</td>
        </tr>
        <tr>
            <td></td>
            <td class="label">Jenis Kelamin</td>
            <td class="sep">:</td>
            <td>{{ ucfirst($contract->second_party_gender) }}</td>
        </tr>
        <tr>
            <td></td>
            <td class="label">Tempat/Tgl. Lahir</td>
            <td class="sep">:</td>
            <td>{{ $contract->second_party_pob }}, {{ $contract->second_party_dob ? $contract->second_party_dob->translatedFormat('d F Y') : '-' }}</td>
        </tr>
        <tr>
            <td></td>
            <td class="label">Alamat</td>
            <td class="sep">:</td>
            <td>{{ $contract->second_party_address }}</td>
        </tr>
    </table>

    <p>Menerangkan, secara bersama-sama disebut Para Pihak, dan secara sendiri disebut Pihak. Para Pihak sepakat untuk mengadakan Perjanjian Kerja dengan ketentuan sebagai berikut :</p>

    <div class="pasal-title">
        Pasal 1<br>
        <span>Perjanjian Kerja</span>
    </div>

    <div class="content-list">
        <ul>
            <li><span class="li-index">1.</span>Pihak Pertama menerima Pihak Kedua sebagai <span class="bold">Karyawan Kontrak</span> dengan ketentuan Perjanjian Kerja dan alamat Kontrak Jakarta.</li>
            <li><span class="li-index">2.</span>Para Pihak sepakat dengan ketentuan sebagai berikut:
                <div class="sub-list">
                    <div class="sub-list-item">
                        <div class="sub-list-index">2.1</div>
                        <div class="sub-list-label">Jabatan</div>
                        <div class="sub-list-sep text-center">:</div>
                        <div class="sub-list-value">{{ $contract->second_party_position }}</div>
                    </div>
                    <div class="sub-list-item">
                        <div class="sub-list-index">2.2</div>
                        <div class="sub-list-label">Penempatan</div>
                        <div class="sub-list-sep text-center">:</div>
                        <div class="sub-list-value">{{ $contract->workingLocation->name ?? $contract->lokasi_kerja }}</div>
                    </div>
                    <div class="sub-list-item">
                        <div class="sub-list-index">2.3</div>
                        <div class="sub-list-label">Gaji Pokok</div>
                        <div class="sub-list-sep text-center">:</div>
                        <div class="sub-list-value">Rp. {{ number_format($contract->base_salary, 0, ',', '.') }}</div>
                    </div>
                    <div class="sub-list-item">
                        <div class="sub-list-index">2.4</div>
                        <div class="sub-list-label">Tunj. Tetap</div>
                        <div class="sub-list-sep text-center">:</div>
                        <div class="sub-list-value">Rp. {{ number_format($contract->position_allowance, 0, ',', '.') }}</div>
                    </div>
                    <div class="sub-list-item">
                        <div class="sub-list-index">2.5</div>
                        <div class="sub-list-label">Tunj. Kehadiran</div>
                        <div class="sub-list-sep text-center">:</div>
                        <div class="sub-list-value">Rp. {{ number_format($contract->attendance_allowance, 0, ',', '.') }}</div>
                    </div>
                    <div class="sub-list-item">
                        <div class="sub-list-index">2.6</div>
                        <div class="sub-list-label">Tunj. Transportasi</div>
                        <div class="sub-list-sep text-center">:</div>
                        <div class="sub-list-value">Rp. {{ number_format($contract->transport_allowance, 0, ',', '.') }}</div>
                    </div>
                    <div class="sub-list-item">
                        <div class="sub-list-index">2.7</div>
                        <div class="sub-list-label">Tunj. Makan Site</div>
                        <div class="sub-list-sep text-center">:</div>
                        <div class="sub-list-value">Rp. {{ number_format($mealSite, 0, ',', '.') }}</div>
                    </div>
                    <div class="sub-list-item">
                        <div class="sub-list-index">2.8</div>
                        <div class="sub-list-label">Tunj. Makan HO</div>
                        <div class="sub-list-sep text-center">:</div>
                        <div class="sub-list-value">Rp. {{ number_format($mealHO, 0, ',', '.') }}</div>
                    </div>
                    <div class="sub-list-item">
                        <div class="sub-list-index">2.9</div>
                        <div class="sub-list-label">Tunj. Lembur</div>
                        <div class="sub-list-sep text-center">:</div>
                        <div class="sub-list-value">Rp. {{ number_format($contract->overtime_allowance, 0, ',', '.') }}</div>
                    </div>
                    <div class="sub-list-item">
                        <div class="sub-list-index">2.10</div>
                        <div class="sub-list-label">Perjanjian Kerja dimulai</div>
                        <div class="sub-list-sep text-center">:</div>
                        <div class="sub-list-value">{{ $contract->start_date ? $contract->start_date->translatedFormat('d F Y') : '-' }}</div>
                    </div>
                    <div class="sub-list-item">
                        <div class="sub-list-index">2.11</div>
                        <div class="sub-list-label">Perjanjian Kerja berakhir</div>
                        <div class="sub-list-sep text-center">:</div>
                        <div class="sub-list-value">{{ $contract->end_date ? $contract->end_date->translatedFormat('d F Y') : '-' }}</div>
                    </div>
                </div>
            </li>
        </ul>
    </div>

    <div class="page-break"></div>

    <div class="content-list" style="margin-top: 10px;">
        <ul>
            <li><span class="li-index">3.</span>Para Pihak sepakat dengan adanya pemotongan gaji apabila:
                <div class="sub-list">
                    <div class="sub-list-item">
                        <div class="sub-list-index">3.1</div>
                        <div class="sub-list-value"><span class="bold">Tidak Hadir (Mangkir)</span> : Potongan Gaji Pokok, Tunj Tetap, Tunj Kehadiran, Tunj Transportasi, dan Tunj Makan</div>
                    </div>
                    <div class="sub-list-item">
                        <div class="sub-list-index">3.2</div>
                        <div class="sub-list-value"><span class="bold">Tidak Hadir (Izin Cuti)</span> : Potongan Tunjangan Makan</div>
                    </div>
                    <div class="sub-list-item">
                        <div class="sub-list-index">3.3</div>
                        <div class="sub-list-value"><span class="bold">Tidak Hadir (Izin Unpaid)</span> : Potongan Tunjangan Makan, Tunjangan Transportasi dan Tunjangan Kehadiran</div>
                    </div>
                    <div class="sub-list-item">
                        <div class="sub-list-index">3.4</div>
                        <div class="sub-list-value"><span class="bold">Terlambat</span> : Potongan Tunjangan Makan</div>
                    </div>
                </div>
            </li>
            <li><span class="li-index">4.</span>Potongan Gaji Pokok, Tunjangan Tetap, Tunjangan Kehadiran, Tunjangan Transportasi akan proporsional sesuai dengan hari kerja setiap bulan.</li>
            <li><span class="li-index">5.</span>Pihak Kedua menerima dan sanggup melaksanakan kewajiban-kewajiban dan tugas-tugas yang dibebankan kepadanya, sehubungan dengan jabatan yang disebut dalam Pasal 1 ayat 2.1.</li>
            <li><span class="li-index">6.</span>Ruang lingkup kerja Pihak Kedua sesuai dengan rincian tugas (job description) sehubungan dengan Pasal 1 ayat 2.1 yang disampaikan baik lisan maupun dengan tertulis oleh pimpinan/atasan sebagai bagian yang tidak terpisahkan dari Perjanjian ini.</li>
            <li><span class="li-index">7.</span>Jika Pihak Kedua memutuskan mengundurkan diri, harus memberitahukan 1 (satu) bulan ke HRD Pihak Pertama dan atau ke pimpinan/atasannya secara tertulis.</li>
            <li><span class="li-index">8.</span>Pihak Pertama berhak melakukan pemotongan gaji Pihak Kedua sesuai yang disebutkan dalam Pasal 1 ayat 3.</li>
        </ul>
    </div>

    <div class="pasal-title">
        Pasal 2<br>
        <span>Hak dan Kewajiban</span>
    </div>

    <div class="content-list">
        <ul>
            <li><span class="li-index">1.</span>Pihak Pertama/Perusahaan berkewajiban untuk :
                <div class="sub-list">
                    <div class="sub-list-item"><div class="sub-list-index">1.1</div><div class="sub-list-value">Memberikan tugas atau ruang lingkup kerja sesuai dengan jabatan kepada Pihak Kedua.</div></div>
                    <div class="sub-list-item"><div class="sub-list-index">1.2</div><div class="sub-list-value">Membayar gaji sesuai yang telah disepakati dalam Perjanjian Kerja kepada Pihak Kedua</div></div>
                    <div class="sub-list-item"><div class="sub-list-index">1.3</div><div class="sub-list-value">Membayar Tunjangan Hari Raya Keagamaan satu bulan gaji pokok bagi karyawan yang masa kerja sudah mencapai 12 bulan atau lebih, dan bagi karyawan yang masa kerja kurang dari 12 bulan dibayar dengan proporsional (masa kerja dibagi 12, dikali 1 bulan gaji) dengan minimum masa kerja 1 bulan dan dibayar selambat-lambatnya 7 (tujuh) hari sebelum hari “H”</div></div>
                    <div class="sub-list-item"><div class="sub-list-index">1.4</div><div class="sub-list-value">Melindungi Pihak Kedua selama bekerja dengan mengikut sertakan Program BPJS Ketenagakerjaan dan BPJS Kesehatan.</div></div>
                </div>
            </li>
            <li><span class="li-index">2.</span>Pihak Kedua/Karyawan berkewajiban untuk :
                <div class="sub-list">
                    <div class="sub-list-item"><div class="sub-list-index">2.1</div><div class="sub-list-value">Mematuhi dan atau menjalankan semua peraturan dan tata tertib yang ditetapkan oleh Pihak Pertama</div></div>
                    <div class="sub-list-item"><div class="sub-list-index">2.2</div><div class="sub-list-value">Melaksanakan semua Perintah kerja dan lingkup kerja (job description) dan petunjuk atau instruksi yang diberikan oleh atasannya, baik secara lisan maupun tertulis dalam hal urusan kedinasan dengan penuh tanggung jawab dengan sebaik-baiknya.</div></div>
                    <div class="sub-list-item"><div class="sub-list-index">2.3</div><div class="sub-list-value">Bersedia membayar luran BPJS Ketenagakerjaan dan BPJS Kesehatan dengan presentase yang sudah ditentukan oleh Pemerintah maupun undang-undang Ketenagakerjaan</div></div>
                    <div class="sub-list-item"><div class="sub-list-index">2.4</div><div class="sub-list-value">Bersedia membayar Pajak Penghasilan (PPh Pasal 21)</div></div>
                </div>
            </li>
        </ul>
    </div>

    <div class="page-break"></div>

    <div class="content-list" style="margin-top: 10px;">
        <ul>
            <li><span class="li-index">2.5</span>Menghormati dan mentaati Peraturan Perusahaan dan petunjuk-petunjuk dari pimpinan maupun atasan</li>
            <li><span class="li-index">2.6</span>Menyimpan dan menjaga kerahasian baik dokumen maupun informasi milik perusahaan / Pihak Pertama dan tidak dibenarkan memberikan dokumen dan atau informasi yang diketahui baik secara lisan maupun tertulis kepada pihak lain</li>
            <li><span class="li-index">2.7</span>Bertanggung jawab penuh terhadap peralatan kerja dan wajib menjaganya dengan sebaik-baiknya</li>
            <li><span class="li-index">2.8</span>Menjaga serta memelihara suasana yang harmonis dan sehat dalam hubungan kerja dengan pimpinan/atasan, teman sekerja maupun relasi perusahaan/Pihak Pertama</li>
            <li><span class="li-index">2.9</span>Memelihara dan menjaga nama baik dan kewibawaan Pihak Pertama/perusahaan</li>
            <li><span class="li-index">2.10</span>Mematuhi semua peraturan dan undang-undang yang berlaku di wilayah Republik Indonesia</li>
        </ul>
    </div>

    <div class="pasal-title">
        Pasal 3<br>
        <span>Waktu & Jam Kerja</span>
    </div>
    <div class="content-list">
        <ul>
            <li><span class="li-index">1.</span>Hari Kerja dalam 1 (satu) Minggu 5 (lima) hari, dari hari Senin sampai hari Jum’at</li>
            <li><span class="li-index">2.</span>Sehubungan dengan tugas dan tanggung jawab jabatan yang disebut pada Pasal 1 ayat 2.1 Pihak Kedua wajib melaksanakan tugas sampai selesai, sesuai dengan permintaan pimpinan/atasan jika sangat diperlukan baik hari biasa maupun hari Libur/Minggu</li>
        </ul>
    </div>

    <div class="pasal-title">
        Pasal 4<br>
        <span>Hak Cuti</span>
    </div>
    <div class="content-list">
        <ul>
            <li><span class="li-index">1.</span>Pihak Kedua berhak atas Cuti tahunan setelah 12 (dua belas) bulan bekerja dan dihitung mulai awal bekerja bersama Pihak Pertama, Pihak Kedua berhak atas cuti tahunan 12 (dua belas) hari kerja dengan mandapat upah penuh</li>
            <li><span class="li-index">2.</span>Cuti khusus lainnya sesuai dengan ketentuan peraturan perundang-undangan, peraturan Perusahaan.</li>
            <li><span class="li-index">3.</span>Dalam pelaksanaan proyek, Pihak Kedua berhak atas cuti 6 (enam) hari, terhitung 6 (enam) bulan secara berturut-turut dari awal bekerja, dan merupakan bagian yang terpisahkan dari hak cuti tahunan, dengan mendapat upah penuh</li>
        </ul>
    </div>

    <div class="pasal-title">
        Pasal 5<br>
        <span>Mutasi / Pemindahan</span>
    </div>
    <div class="content-list">
        <ul>
            <li><span class="li-index">1.</span>Pihak Pertama mempunyai wewenang sepenuhnya untuk mengadakan perubahan jabatan/posisi dalam organisasi sesuai dengan situasi, kondisi dan kebutuhan perusahaan</li>
            <li><span class="li-index">2.</span>Bila terjadi perubahan jabatan atau posisi yang diputuskan oleh Pihak Pertama selama dalam masa perjanjian kerja sebagaimana tersebut dalam Pasal 1 ayat 2.1 diatas, maka Pihak Kedua bersedia memenuhi dan mentaati keputusan perubahan jabatan/posisi tersebut dengan sepenuhnya.</li>
        </ul>
    </div>

    <div class="page-break"></div>

    <div class="pasal-title" style="margin-top: 10px;">
        Pasal 6<br>
        <span>Surat Peringatan</span>
    </div>
    <div class="content-list">
        <ul>
            <li><span class="li-index">1.</span>Surat Peringatan yang diberikan tidak selalu berurutan, tapi dapat dinilai dari besar kecilnya kesalahan yang dilaksanakan oleh Pihak Kedua</li>
            <li><span class="li-index">2.</span>Tidak hadir/absen 5 (lima) hari kerja berturut tanpa pemberitahuan yang sah kepada atasan atau pimpinan perusahaan dan atau tidak ada surat persetujuan dari atasan akan diberikan Surat Peringatan sesuai ketentuan peraturan perundang-undangan yang berlaku</li>
            <li><span class="li-index">3.</span>Pihak Kedua bersedia diputuskan hubungan kerja tanpa syarat apapun apabila ternyata telah melakukan tindakan-tindakan yang melanggar Peraturan Perusahaan maupun ketentuan peraturan perundang-undangan yang berlaku.</li>
        </ul>
    </div>

    <div class="pasal-title">
        Pasal 7<br>
        <span>Pemutusan Hubungan Kerja</span>
    </div>
    <p>Pihak Pertama dapat mengakhiri hubungan kerja (PHK) dan Pihak Pertama wajib memberikan uang pisah apabila Pihak Kedua melakukan pelanggaran-pelanggaran/kesalahan sebagai berikut:</p>
    <div class="content-list">
        <ul>
            <li><span class="li-index">1.</span>Penipuan, pencurian dan penggelapan barang/uang milik Perusahaan atau milik teman sekerja</li>
            <li><span class="li-index">2.</span>Melakukan pemalsuan atau memberikan keterangan palsu atau yang dipalsukan atau keterangan yang tidak benar terhadap segala hal yang menyangkut pribadi ataupun Perusahaan kepada Pimpinan Perusahaan atau Atasan Langsung</li>
            <li><span class="li-index">3.</span>Mabuk/minum minumam keras (beralkohol), madat, memakai obat bius, atau menyalahgunakan obat-obatan terlarang atau obat-obatan perangsang lainnya yang dilarang oleh peraturan perundang-undangan</li>
            <li><span class="li-index">4.</span>Melakukan perbuatan asusila di lingkungan kerja;</li>
            <li><span class="li-index">5.</span>Menganiaya, mengancam secara fisik atau mental, menghina secara kasar Pimpinan atau keluarga Pimpinan Perusahaan atau teman sekerja</li>
            <li><span class="li-index">6.</span>Membongkar atau membocorkan rahasia Perusahaan dan/atau membocorkan penawaran-penawaran harga proyek /nilai tender dan/atau memberikan informasi yang sifatnya rahasia dan/atau memberikan dokumen-dokumen rahasia kepada pihak lain, kecuali untuk kepentingan negara</li>
            <li><span class="li-index">7.</span>Perjudian dalam bentuk apapun yang dilakukan dalam lingkungan kerja</li>
            <li><span class="li-index">8.</span>Melakukan perbuatan pidana lainnya yang dapat diancam hukuman pidana penjara 5 (lima) tahun atau lebih; dan</li>
            <li><span class="li-index">9.</span>Pengulangan atas pelanggaran tingkat larangan yang dikenakan sanksi teguran lisan dan tertulis, Surat Peringatan I, Surat Peringatan II, dan Surat Peringatan III</li>
        </ul>
    </div>

    <div class="page-break"></div>

    <div class="pasal-title" style="margin-top: 10px;">
        Pasal 8<br>
        <span>Lain-Lain</span>
    </div>
    <div class="content-list">
        <ul>
            <li><span class="li-index">1.</span>Pihak Pertama tidak bertanggung jawab atas janji lisan atau tertulis yang telah diberikan oleh siapapun juga yang berlawanan dengan syarat-syarat yang tercantum dalam surat perjanjian kerja ini.</li>
            <li><span class="li-index">2.</span>Ketentuan-ketentuan yang tidak tertulis pada Perjanjian Kerja ini, akan mengacu pada Peraturan Perusahaan dan ketentuan Peraturan Perundang-undangan yang berlaku.</li>
            <li><span class="li-index">3.</span>Perjanjian Kerja ini dibuat dalam 2 (dua) rangkap, agar Para Pihak saling memiliki bukti kuat dalam Perjanjian Kerja ini.</li>
        </ul>
    </div>

    <div class="pasal-title">
        Pasal 9<br>
        <span>Penutup</span>
    </div>
    <p>Perjanjian ini dibuat oleh Para Pihak dan sama-sama tahu atas apa yang diperjanjikan, sadar, dan tanpa ada unsur paksaan dari pihak manapun</p>

    <div style="margin-top: 20px; text-align: right; margin-right: 20px;">
        Dibuat di : Jakarta<br>
        Tanggal : {{ \Carbon\Carbon::now()->translatedFormat('d F Y') }}
    </div>

    <table class="signature-table">
        <tr>
            <td>
                <p class="bold">Pihak Pertama</p>
                <div class="sig-space"></div>
                <p class="bold underline">{{ $contract->first_party_name }}</p>
                <p>{{ $contract->first_party_position }}</p>
            </td>
            <td>
                <p class="bold">Pihak Kedua</p>
                <div class="sig-space"></div>
                <p class="bold underline">{{ $contract->second_party_name }}</p>
                <p>Karyawan</p>
            </td>
        </tr>
    </table>

</body>
</html>
