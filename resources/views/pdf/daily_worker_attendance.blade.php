<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Daily Worker Attendance Report</title>
    <style>
        @page { margin: 1cm; }
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 10px; color: #333; line-height: 1.4; }
        
        .header { text-align: center; margin-bottom: 25px; border-bottom: 2px solid #1e3a8a; padding-bottom: 10px; }
        .header h1 { font-size: 18px; margin: 0 0 5px 0; color: #1e3a8a; text-transform: uppercase; letter-spacing: 1px; }
        .header p { font-size: 11px; margin: 0; color: #64748b; font-weight: bold; }

        .report-info { margin-bottom: 20px; width: 100%; }
        .report-info table { width: 100%; }
        .report-info td { vertical-align: top; padding: 2px 0; }
        .label { font-weight: bold; width: 100px; color: #1e3a8a; }
        .value { color: #334155; }

        table.details { width: 100%; border-collapse: collapse; margin-top: 10px; table-layout: fixed; }
        table.details th, table.details td { border: 1px solid #cbd5e1; padding: 8px 6px; text-align: left; }
        table.details th { background-color: #f1f5f9; font-weight: bold; font-size: 9px; text-transform: uppercase; color: #475569; }
        table.details td { word-wrap: break-word; vertical-align: middle; }

        .text-center { text-align: center !important; }
        .text-right { text-align: right !important; }
        .font-bold { font-weight: bold; }

        .status-badge { font-weight: bold; font-size: 8px; text-transform: uppercase; }
        .status-hadir { color: #059669; }
        .status-alpha { color: #dc2626; }
        .status-izin { color: #2563eb; }
        .status-sakit { color: #d97706; }

        .footer { position: fixed; bottom: 0; width: 100%; text-align: right; font-size: 8px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 5px; }
    </style>
</head>
<body>

    <div class="header">
        <h1>LAPORAN KEHADIRAN PEKERJA HARIAN</h1>
        <p>DAILY WORKER ATTENDANCE REPORT</p>
    </div>

    <div class="report-info">
        <table>
            <tr>
                <td class="label">Lokasi Kerja</td>
                <td class="value">: {{ $locationName }}</td>
                <td class="label">Tanggal</td>
                <td class="value">: {{ \Carbon\Carbon::parse($date)->translatedFormat('d F Y') }}</td>
            </tr>
            <tr>
                <td class="label">Total Pekerja</td>
                <td class="value">: {{ count($attendances) }}</td>
                <td class="label">Dicetak Oleh</td>
                <td class="value">: {{ auth()->user()->name }}</td>
            </tr>
        </table>
    </div>

    <table class="details">
        <thead>
            <tr>
                <th style="width: 30px;" class="text-center">No</th>
                <th>Nama Pekerja (Worker Name)</th>
                <th style="width: 100px;">NIK</th>
                <th style="width: 60px;" class="text-center">Masuk</th>
                <th style="width: 60px;" class="text-center">Pulang</th>
                <th style="width: 80px;" class="text-center">Status</th>
                <th style="width: 80px;" class="text-right">Metrics</th>
            </tr>
        </thead>
        <tbody>
            @foreach($attendances as $index => $att)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td class="font-bold">{{ $att->dailyWorker->nama ?? 'Unknown' }}</td>
                    <td style="font-family: monospace;">{{ $att->dailyWorker->nik ?? '-' }}</td>
                    <td class="text-center">{{ $att->clock_in ? \Carbon\Carbon::parse($att->clock_in)->format('H:i') : '-' }}</td>
                    <td class="text-center">{{ $att->clock_out ? \Carbon\Carbon::parse($att->clock_out)->format('H:i') : '-' }}</td>
                    <td class="text-center">
                        <span class="status-badge status-{{ $att->status }}">
                            {{ strtoupper($att->status) }}
                        </span>
                    </td>
                    <td class="text-right" style="font-size: 8px;">
                        @if($att->clock_in && $att->clock_out)
                            @php
                                $diffMins = \Carbon\Carbon::parse($att->clock_in)->diffInMinutes(\Carbon\Carbon::parse($att->clock_out));
                                $duration = floor($diffMins / 60) . 'h ' . ($diffMins % 60) . 'm';
                            @endphp
                            <div style="color: #d97706; font-weight: bold;">{{ $duration }}</div>
                        @endif
                        @if($att->verified_lembur_minutes > 0)
                            <div style="color: #2563eb;">OT {{ round($att->verified_lembur_minutes/60, 1) }}h</div>
                        @endif
                    </td>
                </tr>
            @endforeach
            @if(count($attendances) === 0)
                <tr>
                    <td colspan="7" class="text-center" style="padding: 20px; color: #94a3b8; font-style: italic;">
                        Tidak ada data absensi untuk lokasi dan tanggal terpilih.
                    </td>
                </tr>
            @endif
        </tbody>
    </table>

    <div class="footer">
        Dicetak pada: {{ date('d/m/Y H:i') }} - BangunPeople HRIS
    </div>

</body>
</html>
