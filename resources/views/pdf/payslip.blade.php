<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Slip Gaji - {{ $item->employee_name ?? $item->employee->nama }}</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 10px;
            color: #333;
            line-height: 1.3;
        }
        .header-table {
            width: 100%;
            border-bottom: 2px solid #333;
            padding-bottom: 5px;
            margin-bottom: 15px;
        }
        .header-table h1 {
            margin: 0;
            font-size: 18px;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        .header-table h2 {
            margin: 3px 0 0 0;
            font-size: 13px;
            font-weight: normal;
        }
        .company-info {
            margin-top: 3px;
            font-size: 10px;
            color: #666;
        }
        
        .row {
            width: 100%;
            margin-bottom: 10px;
        }
        .col-half {
            width: 48%;
            display: inline-block;
            vertical-align: top;
        }
        
        .info-table {
            width: 100%;
            border-collapse: collapse;
        }
        .info-table td {
            padding: 3px 0;
        }
        .info-label {
            width: 100px;
            font-weight: bold;
        }
        
        .section-title {
            font-size: 12px;
            font-weight: bold;
            background-color: #f4f4f4;
            padding: 5px 10px;
            border: 1px solid #ddd;
            margin-bottom: 5px;
            text-transform: uppercase;
        }
        
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        .data-table th, .data-table td {
            padding: 5px;
            border-bottom: 1px solid #eee;
        }
        .data-table th {
            text-align: left;
            border-bottom: 1px solid #ccc;
        }
        .text-right {
            text-align: right;
        }
        .text-green {
            color: #166534;
        }
        .text-red {
            color: #991b1b;
        }
        
        .total-row {
            font-weight: bold;
            border-top: 1px solid #333 !important;
            border-bottom: 2px double #333 !important;
        }
        
        .thp-box {
            border: 2px solid #1e3a8a;
            background-color: #eff6ff;
            padding: 10px;
            text-align: center;
            margin-top: 10px;
            page-break-inside: avoid;
        }
        .thp-label {
            font-size: 14px;
            font-weight: bold;
            color: #1e3a8a;
            margin-bottom: 5px;
            text-transform: uppercase;
        }
        .thp-amount {
            font-size: 24px;
            font-weight: bold;
            color: #1d4ed8;
        }
        
        .footer {
            margin-top: 20px;
            width: 100%;
            page-break-inside: avoid;
        }
        .signature-box {
            width: 30%;
            float: right;
            text-align: center;
        }
        .signature-line {
            margin-top: 40px;
            border-top: 1px solid #333;
            padding-top: 5px;
        }
    </style>
</head>
<body>

    @php
        function format_rupiah($angka) {
            return 'Rp ' . number_format($angka, 0, ',', '.');
        }
        
        $monthName = \Carbon\Carbon::parse($payroll->periode . '-01')->translatedFormat('F Y');
        $processDate = \Carbon\Carbon::parse($payroll->tanggal_proses)->translatedFormat('d F Y');
    @endphp

    <table class="header-table">
        <tr>
            <td style="width: 25%; vertical-align: middle; text-align: left;">
                @if($item->employee->workLocation && $item->employee->workLocation->logo && file_exists(storage_path('app/public/' . $item->employee->workLocation->logo)))
                    @php
                        $logoPath = storage_path('app/public/' . $item->employee->workLocation->logo);
                        $logoData = base64_encode(file_get_contents($logoPath));
                        $logoSrc = 'data:image/' . pathinfo($logoPath, PATHINFO_EXTENSION) . ';base64,' . $logoData;
                    @endphp
                    <img src="{{ $logoSrc }}" alt="Logo" style="max-height: 40px; max-width: 150px;">
                @endif
            </td>
            <td style="width: 50%; text-align: center; vertical-align: middle;">
                <h1>SLIP GAJI KARYAWAN</h1>
                <h2>Periode: {{ $monthName }}</h2>
            </td>
            <td style="width: 25%; text-align: right; vertical-align: middle;">
                <div class="company-info">
                    <strong>{{ $item->work_location_name ?? ($item->employee->workLocation?->name ?? 'Perusahaan') }}</strong><br>
                    {{ $item->employee->workLocation?->address }}
                </div>
            </td>
        </tr>
    </table>

    <div class="row">
        <div class="col-half">
            <table class="info-table">
                <tr>
                    <td class="info-label">Nama</td>
                    <td>: {{ $item->employee_name ?? $item->employee->nama }}</td>
                </tr>
                <tr>
                    <td class="info-label">NIK</td>
                    <td>: {{ $item->employee_nik ?? $item->employee->nik }}</td>
                </tr>
                <tr>
                    <td class="info-label">Jabatan</td>
                    <td>: {{ $item->position_name ?? ($item->employee->position?->name ?? '-') }}</td>
                </tr>
            </table>
        </div>
        <div class="col-half">
            <table class="info-table">
                <tr>
                    <td class="info-label">Departemen</td>
                    <td>: {{ $item->department_name ?? ($item->employee->department?->name ?? '-') }}</td>
                </tr>
                <tr>
                    <td class="info-label">Status Pajak</td>
                    <td>: {{ $item->employee->status_pernikahan ?? 'TK/0' }}</td>
                </tr>
                <tr>
                    <td class="info-label">Tanggal Cetak</td>
                    <td>: {{ $processDate }}</td>
                </tr>
            </table>
        </div>
    </div>

    <div class="row">
        <div class="col-half" style="padding-right: 2%">
            <div class="section-title">PENERIMAAN</div>
            <table class="data-table">
                <tr>
                    <td>Gaji Pokok</td>
                    <td class="text-right">{{ format_rupiah($item->gaji_pokok) }}</td>
                </tr>
                
                @if($item->tunjangan_jabatan > 0)
                <tr>
                    <td>Tunjangan Jabatan</td>
                    <td class="text-right">{{ format_rupiah($item->tunjangan_jabatan) }}</td>
                </tr>
                @endif
                
                @if($item->tunjangan_kehadiran > 0)
                <tr>
                    <td>Tunjangan Kehadiran</td>
                    <td class="text-right">{{ format_rupiah($item->tunjangan_kehadiran) }}</td>
                </tr>
                @endif
                
                @if($item->tunjangan_transportasi > 0)
                <tr>
                    <td>Tunjangan Transportasi</td>
                    <td class="text-right">{{ format_rupiah($item->tunjangan_transportasi) }}</td>
                </tr>
                @endif
                
                @if($item->uang_makan > 0)
                <tr>
                    <td>Uang Makan</td>
                    <td class="text-right">{{ format_rupiah($item->uang_makan) }}</td>
                </tr>
                @endif
                
                @if($item->uang_lembur > 0)
                <tr>
                    <td>Uang Lembur</td>
                    <td class="text-right">{{ format_rupiah($item->uang_lembur) }}</td>
                </tr>
                @endif
                
                @if($item->thr > 0)
                <tr>
                    <td>Tunjangan Hari Raya (THR)</td>
                    <td class="text-right">{{ format_rupiah($item->thr) }}</td>
                </tr>
                @endif
                
                @if($item->tunjangan_pajak > 0)
                <tr>
                    <td>Tunjangan Pajak (Gross Up)</td>
                    <td class="text-right text-green">{{ format_rupiah($item->tunjangan_pajak) }}</td>
                </tr>
                @endif
                
                <tr>
                    <td class="total-row">Total Penerimaan</td>
                    <td class="text-right total-row">{{ format_rupiah($item->total_pendapatan) }}</td>
                </tr>
            </table>
        </div>
        
        <div class="col-half" style="padding-left: 2%">
            <div class="section-title">POTONGAN</div>
            <table class="data-table">
                <tr>
                    <td>BPJS Kesehatan (1%)</td>
                    <td class="text-right text-red">-{{ format_rupiah($item->potongan_bpjs_jkn) }}</td>
                </tr>
                <tr>
                    <td>BPJS Ketenagakerjaan (3%)</td>
                    <td class="text-right text-red">-{{ format_rupiah($item->potongan_bpjs_tk) }}</td>
                </tr>
                <tr>
                    <td>PPh21 (Pajak)</td>
                    <td class="text-right text-red">-{{ format_rupiah($item->potongan_pph21) }}</td>
                </tr>
                
                @if($item->pinjaman_koperasi > 0)
                <tr>
                    <td>Pinjaman Koperasi</td>
                    <td class="text-right text-red">-{{ format_rupiah($item->pinjaman_koperasi) }}</td>
                </tr>
                @endif
                
                @if($item->potongan_lain_1 > 0)
                <tr>
                    <td>Potongan Lainnya 1</td>
                    <td class="text-right text-red">-{{ format_rupiah($item->potongan_lain_1) }}</td>
                </tr>
                @endif
                
                @if($item->potongan_lain_2 > 0)
                <tr>
                    <td>Potongan Lainnya 2</td>
                    <td class="text-right text-red">-{{ format_rupiah($item->potongan_lain_2) }}</td>
                </tr>
                @endif
                
                <tr>
                    <td class="total-row">Total Potongan</td>
                    <td class="text-right total-row text-red">-{{ format_rupiah($item->total_potongan) }}</td>
                </tr>
            </table>
        </div>
    </div>


    <div class="thp-box">
        <div class="thp-label">Take Home Pay (THP)</div>
        <div class="thp-amount">{{ format_rupiah($item->gaji_bersih) }}</div>
        <div style="font-size: 10px; margin-top: 5px;">
            Haraf simpan slip gaji ini sebagai dokumen rahasia.
        </div>
    </div>

    <div class="footer">
        <div class="signature-box">
            Diterima Oleh,<br>
            Karyawan
            <div class="signature-line">
                {{ $item->employee_name ?? $item->employee->nama }}
            </div>
        </div>
        <div class="signature-box" style="float: left;">
            Dibuat Oleh,<br>
            HR / Finance
            <div class="signature-line">
                ( {{ $payroll->processedBy?->name ?? 'Administrator' }} )
            </div>
        </div>
        <div style="clear: both;"></div>
    </div>

</body>
</html>
