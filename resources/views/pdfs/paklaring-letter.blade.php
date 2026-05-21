<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Surat Keterangan Kerja {{ $paklaring->letter_number }}</title>
    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            margin: 0;
            padding: 0;
            color: #000;
            font-size: 15px;
            line-height: 1.4;
        }

        .header {
            width: 100%;
            margin-bottom: 20px;
        }

        .header-image {
            width: 100%;
            max-height: 150px;
            object-fit: contain;
        }

        .content {
            margin: 0 40px;
            padding: 20px 20px;
        }

        .title {
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            text-decoration: underline;
            margin-bottom: 2px;
        }

        .subtitle {
            text-align: center;
            font-size: 15px;
            font-style: italic;
            margin-bottom: 2px;
        }
        
        .letter-no {
            text-align: center;
            font-size: 15px;
            font-weight: bold;
            margin-bottom: 30px;
        }

        .salutation {
            margin-bottom: 2px;
        }
        
        .salutation-en {
            margin-bottom: 25px;
            font-style: italic;
        }

        .text-body {
            margin-bottom: 5px;
            text-align: justify;
        }
        
        .text-body-en {
            margin-bottom: 20px;
            text-align: justify;
            font-style: italic;
        }

        .table-info {
            width: 100%;
            margin-bottom: 30px;
            margin-left: 20px;
            border-collapse: collapse;
        }

        .table-info td {
            vertical-align: top;
            padding: 3px 0;
        }

        .col-label {
            width: 180px;
        }

        .label-id {
            font-weight: bold;
            text-decoration: underline;
            display: block;
        }

        .label-en {
            font-style: italic;
            display: block;
        }

        .col-colon {
            width: 15px;
            font-weight: bold;
        }
        
        .col-value {
            font-weight: bold;
        }

        .signature-container {
            margin-top: 40px;
            margin-left: 60%;
        }

        .signature-date {
            margin-bottom: 5px;
        }

        .signature-company {
            margin-bottom: 0px;
        }

        .signature-image {
            width: 150px;
            height: 120px;
            object-fit: scale-down;
            border: none;
            margin-top: 5px;
            margin-bottom: 5px;
        }

        .signature-name {
            margin-bottom: 2px;
        }

    </style>
</head>
<body>

    @php
        $company = $paklaring->company;
        $companyName = $company ? $company->name : 'PT. Karya Prima Lestari Utama';
        $maker = $paklaring->maker;
        
        // Calculate Period of Service
        $from = \Carbon\Carbon::parse($paklaring->from_date);
        $to = \Carbon\Carbon::parse($paklaring->to_date);
        $diff = $from->diff($to);
        
        $masaKerjaId = '';
        if ($diff->y > 0) {
            $masaKerjaId .= $diff->y . ' Tahun ';
        }
        if ($diff->m > 0) {
            $masaKerjaId .= $diff->m . ' Bulan';
        }
        if ($diff->y == 0 && $diff->m == 0) {
            $masaKerjaId = $diff->d . ' Hari';
        }
        $masaKerjaId = trim($masaKerjaId);
    @endphp

    @if($company && $company->header_image)
    <div class="header">
        <img src="{{ storage_path('app/public/' . $company->header_image) }}" class="header-image" alt="Header Kop Surat">
    </div>
    @endif

    <div class="content">
        <div class="title">SURAT KETERANGAN KERJA</div>
        <div class="subtitle">CERTIFICATE OF EMPLOYMENT</div>
        <div class="letter-no">No. {{ $paklaring->letter_number }}</div>

        <div class="salutation">
            Dengan ini diterangkan bahwa
        </div>
        <div class="salutation-en">
            This is to certify that
        </div>

        <table class="table-info">
            <tr>
                <td class="col-label">
                    <span class="label-id">Nama</span>
                    <span class="label-en">Name</span>
                </td>
                <td class="col-colon">:</td>
                <td class="col-value">{{ $paklaring->employee->nama }}</td>
            </tr>
            <tr>
                <td class="col-label">
                    <span class="label-id">Alamat</span>
                    <span class="label-en">Address</span>
                </td>
                <td class="col-colon">:</td>
                <td class="col-value">{{ $paklaring->employee->alamat_sekarang ?? $paklaring->employee->alamat_tetap }}</td>
            </tr>
            <tr>
                <td class="col-label">
                    <span class="label-id">Lokasi Kerja</span>
                    <span class="label-en">Work Location</span>
                </td>
                <td class="col-colon">:</td>
                <td class="col-value">{{ $paklaring->work_location_text }}</td>
            </tr>
            <tr>
                <td class="col-label">
                    <span class="label-id">Jabatan</span>
                    <span class="label-en">Classification</span>
                </td>
                <td class="col-colon">:</td>
                <td class="col-value">{{ $paklaring->employee->position?->name ?? 'Karyawan' }}</td>
            </tr>
            <tr>
                <td class="col-label">
                    <span class="label-id">Alasan Berhenti</span>
                    <span class="label-en">Due Of Termination</span>
                </td>
                <td class="col-colon">:</td>
                <td class="col-value">{{ $paklaring->reason_for_leaving }}</td>
            </tr>
            <tr>
                <td class="col-label">
                    <span class="label-id">Masa Kerja</span>
                    <span class="label-en">Periode Of Service</span>
                </td>
                <td class="col-colon">:</td>
                <td class="col-value">{{ $masaKerjaId }}</td>
            </tr>
            <tr>
                <td class="col-label">
                    <span class="label-id">Keterangan</span>
                    <span class="label-en">Remark</span>
                </td>
                <td class="col-colon">:</td>
                <td class="col-value"></td>
            </tr>
        </table>

        <div class="text-body">
            Selama bekerja di perusahaan kami, yang bersangkutan telah menunjukan kemampuan kerja, bekerjasama dengan baik. Atas jasa-jasanya kami mengucapkan terima kasih.
        </div>
        
        <div class="text-body-en">
            During his service in our company the said personnel has proved himself that he is capable., cooperative, we would like to express our thanks for his service.
        </div>

        <div class="signature-container">
            <div class="signature-date">
                {{ $company->address ?? 'Jakarta' }}, {{ $paklaring->date->translatedFormat('d F Y') }}
            </div>
            <div class="signature-company">
                {{ $companyName }}
            </div>
            
            @if($maker && $maker->signature)
                <div>
                    <img src="{{ storage_path('app/public/' . $maker->signature) }}" class="signature-image" alt="Tanda Tangan">
                </div>
            @else
                <div style="height: 100px;"></div>
            @endif

            <div class="signature-name">
                {{ $maker->nama ?? 'HR Department' }}
            </div>
        </div>
    </div>

</body>
</html>
