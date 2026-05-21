<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Surat Permohonan Peminjaman Dana {{ $letter->letter_number }}</title>
    <style>
        body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0; color: #000; font-size: 14px; line-height: 1.6; }
        .header { width: 100%; margin-bottom: 20px; }
        .header-image { width: 100%; max-height: 150px; object-fit: contain; }
        .content { margin: 0 50px; padding: 10px 20px; }
        .date-line { text-align: right; margin-bottom: 25px; }
        .meta-table { margin-bottom: 25px; }
        .meta-table td { vertical-align: top; padding: 2px 0; }
        .meta-label { width: 90px; font-weight: bold; }
        .meta-colon { width: 15px; }
        .recipient { margin-bottom: 25px; }
        .salutation { margin-bottom: 20px; }
        .info-table { width: 100%; margin-bottom: 20px; margin-left: 20px; }
        .info-table td { vertical-align: top; padding: 2px 0; }
        .info-label { width: 170px; }
        .info-colon { width: 15px; }
        .body-text { margin-bottom: 15px; text-align: justify; }
        .signature-container { margin-top: 40px; }
        .signature-image { width: 150px; height: 120px; object-fit: scale-down; border: none; margin: 5px 0; }
    </style>
</head>
<body>
@php
    $company = $letter->estimate->company;
    $companyName = $company ? $company->name : 'Perusahaan';
    $maker = $letter->maker;
    $directorName = $company->director_name ?? 'Pak The Johnny';
    $directorAddress = $company->director_address ?? '';

    // Convert amount to words (Indonesian)
    function terbilang($angka) {
        $angka = abs($angka);
        $huruf = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
        $temp = '';
        if ($angka < 12) {
            $temp = ' ' . $huruf[$angka];
        } elseif ($angka < 20) {
            $temp = terbilang($angka - 10) . ' Belas';
        } elseif ($angka < 100) {
            $temp = terbilang(intval($angka / 10)) . ' Puluh' . terbilang($angka % 10);
        } elseif ($angka < 200) {
            $temp = ' Seratus' . terbilang($angka - 100);
        } elseif ($angka < 1000) {
            $temp = terbilang(intval($angka / 100)) . ' Ratus' . terbilang($angka % 100);
        } elseif ($angka < 2000) {
            $temp = ' Seribu' . terbilang($angka - 1000);
        } elseif ($angka < 1000000) {
            $temp = terbilang(intval($angka / 1000)) . ' Ribu' . terbilang($angka % 1000);
        } elseif ($angka < 1000000000) {
            $temp = terbilang(intval($angka / 1000000)) . ' Juta' . terbilang($angka % 1000000);
        } elseif ($angka < 1000000000000) {
            $temp = terbilang(intval($angka / 1000000000)) . ' Miliar' . terbilang($angka % 1000000000);
        } elseif ($angka < 1000000000000000) {
            $temp = terbilang(intval($angka / 1000000000000)) . ' Triliun' . terbilang($angka % 1000000000000);
        }
        return $temp;
    }

    $amountWords = trim(terbilang((int) $letter->total_amount)) . ' Rupiah';
@endphp

@if($company && $company->header_image)
<div class="header">
    <img src="{{ storage_path('app/public/' . $company->header_image) }}" class="header-image" alt="Kop Surat">
</div>
@endif

<div class="content">
    <div class="date-line">Jakarta, {{ $letter->date->translatedFormat('d F Y') }}</div>

    <table class="meta-table">
        <tr><td class="meta-label">Nomor</td><td class="meta-colon">:</td><td>{{ $letter->letter_number }}</td></tr>
        <tr><td class="meta-label">Perihal</td><td class="meta-colon">:</td><td>Permohonan Peminjaman Dana</td></tr>
        <tr><td class="meta-label">Lampiran</td><td class="meta-colon">:</td><td>-</td></tr>
    </table>

    <div class="recipient">
        Kepada Yth,<br>
        <strong>Pak The Johnny (Investor)</strong>
    </div>

    <div class="salutation">Dengan Hormat,</div>

    <div class="body-text">Dengan ini saya :</div>

    <table class="info-table">
        <tr><td class="info-label">Nama</td><td class="info-colon">:</td><td>{{ $maker->nama ?? 'HR Department' }}</td></tr>
        <tr><td class="info-label">Nama Perusahaan</td><td class="info-colon">:</td><td>{{ $companyName }}</td></tr>
        <tr><td class="info-label">Jabatan</td><td class="info-colon">:</td><td>{{ $maker->position->name ?? 'Staff' }}</td></tr>
    </table>

    <div class="body-text">
        Sehubungan dengan kebutuhan operasional {{ $companyName }}, maka kami mengajukan permohonan peminjaman dana sebesar <strong>Rp. {{ number_format($letter->total_amount, 0, ',', '.') }}</strong> ({{ $amountWords }}).
    </div>

    <div class="body-text">
        Demikian permohonan peminjaman dana ini kami ajukan dengan harapan disetujui oleh pimpinan perusahaan. Atas perhatian serta kebijakan Bapak, kami ucapkan terimakasih.
    </div>

    <div class="signature-container">
        <div>Hormat Saya</div>
        @if($maker && $maker->signature)
            <div><img src="{{ storage_path('app/public/' . $maker->signature) }}" class="signature-image" alt="TTD"></div>
        @else
            <div style="height: 100px;"></div>
        @endif
        <div><strong>{{ $maker->nama ?? 'HR Department' }}</strong></div>
    </div>
</div>
</body>
</html>
