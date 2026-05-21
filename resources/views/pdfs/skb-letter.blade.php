<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Surat Keterangan Bekerja {{ $skb->letter_number }}</title>
    <style>
        body {
            font-family: "Times New Roman", Times, serif;
            margin: 0;
            padding: 0;
            color: #000;
            font-size: 16px;
            line-height: 1.5;
        }

        .header {
            width: 100%;
            margin-bottom: 20px;
        }

        .header-image {
            width: 100%;
            max-height: 150px;
             /* Ensure no resize ratio distortion */
            object-fit: contain;
        }

        .content {
            margin: 0 40px;
            padding: 20px 30px;
        }

        .title {
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            text-decoration: underline;
            margin-bottom: 2px;
        }

        .subtitle {
            text-align: center;
            font-size: 14px;
            margin-bottom: 40px;
        }

        .salutation {
            margin-bottom: 20px;
        }

        .text-body {
            margin-bottom: 20px;
            text-align: justify;
        }

        .table-info {
            width: 100%;
            margin-bottom: 30px;
            margin-left: 20px; /* Indent the info table */
        }

        .table-info td {
            vertical-align: top;
            padding: 4px 0;
        }

        .col-label {
            width: 150px;
            font-weight: normal;
        }

        .col-colon {
            width: 15px;
            text-align: center;
        }

        .signature-container {
            margin-top: 50px;
        }

        .signature-date {
            margin-bottom: 5px;
        }

        .signature-company {
            font-weight: bold;
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
            font-weight: bold;
            text-decoration: underline;
            margin-bottom: 2px;
        }

        .signature-title {
            font-style: normal;
        }
    </style>
</head>
<body>

    @php
        $company = $skb->employee->workLocation;
        $companyName = $company ? $company->name : 'Perusahaan';
        $maker = $skb->maker;
    @endphp

    @if($company && $company->header_image)
    <div class="header">
        <img src="{{ storage_path('app/public/' . $company->header_image) }}" class="header-image" alt="Header Kop Surat">
    </div>
    @endif

    <div class="content">
        <div class="title">SURAT KETERANGAN AKTIF KERJA</div>
        <div class="subtitle">Nomor : {{ $skb->letter_number }}</div>

        <div class="salutation">
            Dengan hormat,
        </div>

        <div class="text-body">
            Melalui surat ini, kami atas nama <strong>{{ $companyName }}</strong>, ingin memberitahukan bahwa :
        </div>

        <table class="table-info">
            <tr>
                <td class="col-label">Nama</td>
                <td class="col-colon">:</td>
                <td>{{ $skb->employee->nama }}</td>
            </tr>
            <tr>
                <td class="col-label">NIK</td>
                <td class="col-colon">:</td>
                <td>{{ $skb->employee->no_ktp }}</td>
            </tr>
            <tr>
                <td class="col-label">Alamat</td>
                <td class="col-colon">:</td>
                <td>{{ $skb->employee->alamat_sekarang ?? $skb->employee->alamat_tetap }}</td>
            </tr>
            <tr>
                <td class="col-label">No ID Karyawan</td>
                <td class="col-colon">:</td>
                <td>{{ $skb->employee->nik }}</td>
            </tr>
            <tr>
                <td class="col-label">Posisi</td>
                <td class="col-colon">:</td>
                <td>{{ $skb->employee->position?->name ?? 'Karyawan' }}</td>
            </tr>
        </table>

        <div class="text-body">
            Adalah benar karyawan diatas bekerja di <strong>{{ $companyName }}</strong>. Surat keterangan ini dibuat untuk {{ $skb->purpose }}.
        </div>

        <div class="text-body">
            Demikian surat keterangan ini kami sampaikan, atas perhatian serta kerjasamanya kami ucapkan terimakasih.
        </div>

        <div class="signature-container">
            <div class="signature-date">
                {{ $company->address ?? 'Jakarta' }}, {{ $skb->date->translatedFormat('d F Y') }}
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
            <div class="signature-title">
                {{ $maker->position?->name ?? 'HR Office' }}
            </div>
        </div>
    </div>

</body>
</html>
