<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Form Lembur - {{ $overtime->id }}</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 11px;
            color: #333;
            line-height: 1.4;
        }
        .header-table {
            width: 100%;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .header-table h1 {
            margin: 0;
            font-size: 20px;
            text-transform: uppercase;
        }
        .header-table h2 {
            margin: 5px 0 0 0;
            font-size: 14px;
            font-weight: normal;
            color: #666;
        }
        .company-info {
            font-size: 10px;
            text-align: right;
        }
        
        .section {
            margin-bottom: 20px;
        }
        .section-title {
            font-size: 12px;
            font-weight: bold;
            background-color: #f0f0f0;
            padding: 6px 10px;
            border-left: 4px solid #333;
            margin-bottom: 10px;
            text-transform: uppercase;
        }
        
        .info-table {
            width: 100%;
            border-collapse: collapse;
        }
        .info-table td {
            padding: 5px 0;
            vertical-align: top;
        }
        .info-label {
            width: 140px;
            font-weight: bold;
        }
        
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 5px;
        }
        .data-table th, .data-table td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
        }
        .data-table th {
            background-color: #f9f9f9;
            font-weight: bold;
        }
        
        .footer {
            margin-top: 40px;
            width: 100%;
        }
        .signature-row {
            width: 100%;
        }
        .signature-box {
            width: 30%;
            float: left;
            text-align: center;
        }
        .signature-box-right {
            width: 30%;
            float: right;
            text-align: center;
        }
        .signature-line {
            margin-top: 60px;
            border-top: 1px solid #333;
            padding-top: 5px;
            font-weight: bold;
        }
        .signature-date {
            font-size: 9px;
            color: #888;
        }
        .clear {
            clear: both;
        }
    </style>
</head>
<body>

    <table class="header-table">
        <tr>
            <td style="width: 20%; vertical-align: middle;">
                @if($workLocation && $workLocation->logo && file_exists(storage_path('app/public/' . $workLocation->logo)))
                    @php
                        $logoPath = storage_path('app/public/' . $workLocation->logo);
                        $logoData = base64_encode(file_get_contents($logoPath));
                        $logoSrc = 'data:image/' . pathinfo($logoPath, PATHINFO_EXTENSION) . ';base64,' . $logoData;
                    @endphp
                    <img src="{{ $logoSrc }}" alt="Logo" style="max-height: 50px;">
                @endif
            </td>
            <td style="width: 50%; text-align: center; vertical-align: middle;">
                <h1>FORM LEMBUR</h1>
                <h2>Nomor: #{{ str_pad($overtime->id, 5, '0', STR_PAD_LEFT) }}</h2>
            </td>
            <td style="width: 30%; vertical-align: middle;">
                <div class="company-info">
                    <strong>{{ $workLocation->name ?? 'Perusahaan' }}</strong><br>
                    {{ $workLocation->address ?? '' }}
                </div>
            </td>
        </tr>
    </table>

    <div class="section">
        <div class="section-title">Informasi Pengajuan</div>
        <table class="info-table">
            <tr>
                <td class="info-label">Diajukan Oleh</td>
                <td>: {{ $overtime->creator->nama }} ({{ $overtime->creator->nik }})</td>
            </tr>
            <tr>
                <td class="info-label">Tanggal Pelaksanaan</td>
                <td>: {{ $overtime->tanggal->translatedFormat('d F Y') }}</td>
            </tr>
            <tr>
                <td class="info-label">Waktu Pelaksanaan</td>
                <td>: {{ substr($overtime->jam_mulai, 0, 5) }} - {{ substr($overtime->jam_berakhir, 0, 5) }}</td>
            </tr>
            <tr>
                <td class="info-label">Total Durasi</td>
                <td>: {{ $overtime->durasi }} Jam</td>
            </tr>
            <tr>
                <td class="info-label">Lokasi Kerja</td>
                <td>: {{ $overtime->workingLocation->name ?? $overtime->lokasi_kerja }}</td>
            </tr>
            <tr>
                <td class="info-label">Keperluan / Alasan</td>
                <td>: {{ $overtime->keperluan }}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Karyawan yang Melaksanakan Lembur</div>
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 5%">No</th>
                    <th style="width: 25%">NIK</th>
                    <th style="width: 40%">Nama Karyawan</th>
                    <th style="width: 30%">Departemen</th>
                </tr>
            </thead>
            <tbody>
                @foreach($overtime->employees as $index => $emp)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $emp->nik }}</td>
                    <td>{{ $emp->nama }}</td>
                    <td>{{ $emp->department->name ?? '-' }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="footer">
        <div class="signature-row">
            <!-- Submitter -->
            <div class="signature-box">
                Diajukan Oleh,<br>
                <div style="margin-bottom: 5px;">&nbsp;</div>
                <div class="signature-line">{{ $overtime->creator->nama }}</div>
                <div class="signature-date">{{ $overtime->created_at->format('d/m/Y H:i') }}</div>
            </div>

            <!-- First Approval -->
            <div class="signature-box" style="margin-left: 5%;">
                Disetujui Oleh (Atasan),<br>
                <div style="margin-bottom: 5px;">&nbsp;</div>
                @if($overtime->supervisor_status === 'approved')
                    <div class="signature-line">{{ $overtime->approvedBySupervisor->nama ?? 'Sistem' }}</div>
                    <div class="signature-date">{{ $overtime->supervisor_approved_at->format('d/m/Y H:i') }}</div>
                @else
                    <div class="signature-line" style="color: #ccc;">( Nama Terang )</div>
                    <div class="signature-date">Belum Disetujui</div>
                @endif
            </div>

            <!-- Second Approval -->
            <div class="signature-box-right">
                Diketahui Oleh (Management),<br>
                <div style="margin-bottom: 5px;">&nbsp;</div>
                @if($overtime->manager_status === 'approved')
                    <div class="signature-line">{{ $overtime->approvedByManager->nama ?? 'Sistem' }}</div>
                    <div class="signature-date">{{ $overtime->manager_approved_at->format('d/m/Y H:i') }}</div>
                @else
                    <div class="signature-line" style="color: #ccc;">( Nama Terang )</div>
                    <div class="signature-date">Belum Disetujui</div>
                @endif
            </div>
        </div>
        <div class="clear"></div>
    </div>

    <div style="margin-top: 50px; font-size: 8px; color: #999; border-top: 1px dotted #ccc; padding-top: 5px;">
        Dokumen ini dihasilkan secara otomatis oleh Sistem HRIS pada {{ now()->translatedFormat('d F Y H:i:s') }}.
    </div>

</body>
</html>
