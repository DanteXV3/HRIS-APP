<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Form Lamaran - {{ $application->name }}</title>
    <style>
        body { font-family: sans-serif; font-size: 11px; color: #333; line-height: 1.4; }
        h1 { text-align: center; font-size: 16px; margin-bottom: 5px; text-transform: uppercase; }
        h2 { text-align: center; font-size: 12px; margin-top: 0; color: #666; font-weight: normal; margin-bottom: 20px; }
        .section-title { font-weight: bold; background: #f0f0f0; padding: 4px; border: 1px solid #ccc; margin-top: 15px; margin-bottom: 5px; font-size: 11px; text-transform: uppercase; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        th, td { padding: 4px; border: 1px solid #ccc; vertical-align: top; }
        th { font-weight: bold; background: #f9f9f9; text-align: left; width: 30%; }
        .data-table th { background: #f0f0f0; width: auto; }
        .footer { text-align: right; margin-top: 30px; font-size: 10px; color: #777; }
        .text-center { text-align: center; }
        .page-break { page-break-after: always; }
    </style>
</head>
<body>

    <h1>FORMULIR DATA DIRI CALON KARYAWAN</h1>
    <h2>Posisi: {{ $opening->position }} &nbsp;|&nbsp; Perusahaan: {{ $opening->company }}</h2>

    @if(!$form)
        <p style="text-align: center; color: red; margin-top: 50px;">Calon karyawan ini belum mengisi formulir data diri (biodata lengkap).</p>
    @else
        <div class="section-title">1. Data Pribadi</div>
        <table>
            <tr><th>Nama Lengkap</th><td>{{ $form['full_name'] ?? '-' }}</td></tr>
            <tr><th>Jenis Kelamin</th><td>{{ $form['sex'] ?? '-' }}</td></tr>
            <tr><th>Kewarganegaraan</th><td>{{ $form['citizenship'] ?? '-' }}</td></tr>
            <tr><th>Status Pernikahan</th><td>{{ $form['marital_status'] ?? '-' }}</td></tr>
            <tr><th>Agama</th><td>{{ $form['religion'] ?? '-' }}</td></tr>
            <tr><th>Berat Badan / Tinggi</th><td>{{ $form['weight'] ?? '-' }} kg / {{ $form['height'] ?? '-' }} cm</td></tr>
            <tr><th>Alamat Saat Ini</th><td>{{ $form['current_address'] ?? '-' }}</td></tr>
            <tr><th>No. HP / WhatsApp</th><td>{{ $application->phone }}</td></tr>
            <tr><th>Email</th><td>{{ $application->email ?? '-' }}</td></tr>
            <tr><th>Hobi</th><td>{{ $form['hobby'] ?? '-' }}</td></tr>
        </table>

        <div class="section-title">2. Pendidikan Formal</div>
        @if(!empty($form['education']))
            <table class="data-table">
                <tr><th>Jenjang</th><th>Nama Sekolah</th><th>Jurusan</th><th>Tahun Lulus</th><th>IPK/Nilai</th></tr>
                @foreach($form['education'] as $edu)
                    <tr>
                        <td>{{ $edu['level'] ?? '-' }}</td>
                        <td>{{ $edu['school'] ?? '-' }}</td>
                        <td>{{ $edu['major'] ?? '-' }}</td>
                        <td>{{ $edu['year'] ?? '-' }}</td>
                        <td>{{ $edu['gpa'] ?? '-' }}</td>
                    </tr>
                @endforeach
            </table>
        @else
            <p>Tidak ada data pendidikan.</p>
        @endif

        <div class="section-title">3. Pelatihan / Kursus</div>
        @if(!empty($form['training']))
            <table class="data-table">
                <tr><th>Nama Pelatihan</th><th>Penyelenggara</th><th>Tahun</th><th>Durasi</th></tr>
                @foreach($form['training'] as $tr)
                    <tr>
                        <td>{{ $tr['name'] ?? '-' }}</td>
                        <td>{{ $tr['organizer'] ?? '-' }}</td>
                        <td>{{ $tr['year'] ?? '-' }}</td>
                        <td>{{ $tr['duration'] ?? '-' }}</td>
                    </tr>
                @endforeach
            </table>
        @else
            <p>Tidak ada data pelatihan.</p>
        @endif

        <div class="section-title">4. Pengalaman Organisasi</div>
        @if(!empty($form['organization']))
            <table class="data-table">
                <tr><th>Nama Organisasi</th><th>Jabatan</th><th>Tahun</th></tr>
                @foreach($form['organization'] as $org)
                    <tr>
                        <td>{{ $org['name'] ?? '-' }}</td>
                        <td>{{ $org['position'] ?? '-' }}</td>
                        <td>{{ $org['year'] ?? '-' }}</td>
                    </tr>
                @endforeach
            </table>
        @else
            <p>Tidak ada data pengalaman organisasi.</p>
        @endif

        <div class="section-title">5. Keahlian & Keterampilan Tambahan</div>
        <div style="border: 1px solid #ccc; padding: 5px; min-height: 30px;">
            {!! nl2br(e($form['skills'] ?? '-')) !!}
        </div>

        <div class="section-title">6. Pengalaman Kerja</div>
        @if(!empty($form['work_experience']))
            <table class="data-table">
                <tr><th>Perusahaan</th><th>Dari</th><th>Sampai</th><th>Gaji Terakhir</th><th>Alasan Keluar</th></tr>
                @foreach($form['work_experience'] as $work)
                    <tr>
                        <td>{{ $work['company'] ?? '-' }}</td>
                        <td>{{ $work['from'] ?? '-' }}</td>
                        <td>{{ $work['to'] ?? '-' }}</td>
                        <td>{{ $work['last_salary'] ?? '-' }}</td>
                        <td>{{ $work['reason_quit'] ?? '-' }}</td>
                    </tr>
                @endforeach
            </table>
        @else
            <p>Tidak ada data pengalaman kerja.</p>
        @endif

        <div class="section-title">7. Referensi</div>
        @if(!empty($form['references']))
            <table class="data-table">
                <tr><th>Nama</th><th>Hubungan</th><th>No. HP</th><th>Alamat</th></tr>
                @foreach($form['references'] as $ref)
                    <tr>
                        <td>{{ $ref['name'] ?? '-' }}</td>
                        <td>{{ $ref['relation'] ?? '-' }}</td>
                        <td>{{ $ref['phone'] ?? '-' }}</td>
                        <td>{{ $ref['address'] ?? '-' }}</td>
                    </tr>
                @endforeach
            </table>
        @else
            <p>Tidak ada referensi yang diberikan.</p>
        @endif

        <div class="section-title">8. Motivasi & Harapan</div>
        <table>
            <tr><th>Alasan Tertarik Bekerja</th><td>{!! nl2br(e($form['why_interested'] ?? '-')) !!}</td></tr>
            <tr><th>Gaji yang Diharapkan</th><td>{{ $form['salary_expectation'] ?? '-' }}</td></tr>
        </table>

        <div class="section-title">9. Riwayat Kesehatan & Informasi Lainnya</div>
        <table>
            <tr><th>Ada Kerabat di Perusahaan?</th><td>{{ ($form['has_relative'] ?? false) ? 'Ya (' . ($form['relative_name'] ?? '') . ')' : 'Tidak' }}</td></tr>
            <tr><th>Riwayat Penyakit Serius?</th><td>{{ ($form['has_serious_illness'] ?? false) ? 'Ya (' . ($form['illness_detail'] ?? '') . ')' : 'Tidak' }}</td></tr>
        </table>

        <div style="margin-top: 30px; padding: 10px; border: 1px solid #ccc; background: #f9f9f9;">
            <strong>Pernyataan:</strong><br>
            Saya menyatakan bahwa semua informasi yang saya berikan adalah benar dan lengkap. Saya bersedia menerima konsekuensi apabila informasi tersebut tidak sesuai dengan kenyataan.
            <div style="margin-top: 40px; text-align: right; padding-right: 20px;">
                Tanda Tangan,<br><br><br>
                ( {{ $form['full_name'] ?? $application->name }} )
            </div>
        </div>

    @endif

    <div class="footer">
        Dicetak pada: {{ date('d/m/Y H:i') }} | HRIS
    </div>

</body>
</html>
