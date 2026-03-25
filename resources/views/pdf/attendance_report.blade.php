<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Absensi Karyawan</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 10px; color: #333; }
        .page-header { text-align: center; margin-bottom: 20px; }
        h1 { font-size: 18px; margin-bottom: 5px; text-transform: uppercase; }
        h2 { font-size: 14px; margin-top: 0; font-weight: normal; }
        
        .page-break { page-break-after: always; }
        
        .employee-info { margin-bottom: 20px; background-color: #f8fafc; padding: 10px; border-radius: 4px; border: 1px solid #e2e8f0; }
        .employee-info table { width: 100%; border: none; }
        .employee-info td { border: none; padding: 2px 0; text-align: left; }
        .label { font-weight: bold; width: 100px; }

        .summary-grid { display: table; width: 100%; margin-bottom: 20px; }
        .summary-item { display: table-cell; border: 1px solid #ccc; padding: 8px; text-align: center; width: 12.5%; }
        .summary-label { font-size: 8px; color: #666; text-transform: uppercase; margin-bottom: 3px; }
        .summary-value { font-size: 14px; font-weight: bold; color: #1e3a8a; }

        table.details { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        table.details th, table.details td { border: 1px solid #ccc; padding: 6px 8px; text-align: center; }
        table.details th { background-color: #f4f4f5; font-weight: bold; font-size: 9px; }
        table.details td { font-size: 9px; }
        table.details td.text-left { text-align: left; }
        
        .status-hadir { color: #059669; font-weight: bold; }
        .status-absent { color: #dc2626; font-weight: bold; }
        .is-late { color: #b91c1c; }
    </style>
</head>
<body>

    @foreach($data as $index => $row)
        <div class="{{ !$loop->last ? 'page-break' : '' }}">
            <div class="page-header">
                <h1>LAPORAN KEHADIRAN KARYAWAN</h1>
                <h2>Periode: {{ $tanggalStart ? \Carbon\Carbon::parse($tanggalStart)->translatedFormat('d M Y') : 'Awal' }} - {{ $tanggalEnd ? \Carbon\Carbon::parse($tanggalEnd)->translatedFormat('d M Y') : 'Sekarang' }}</h2>
            </div>

            <div class="employee-info">
                <table>
                    <tr>
                        <td class="label">Nama</td>
                        <td>: {{ $row['employee']->nama }}</td>
                        <td class="label">Departemen</td>
                        <td>: {{ $row['employee']->department->name ?? '-' }}</td>
                    </tr>
                    <tr>
                        <td class="label">NIK</td>
                        <td>: {{ $row['employee']->nik }}</td>
                        <td class="label">Jabatan</td>
                        <td>: {{ $row['employee']->position->name ?? '-' }}</td>
                    </tr>
                </table>
            </div>

            <div class="summary-grid">
                <div class="summary-item">
                    <div class="summary-label">Total Hari</div>
                    <div class="summary-value">{{ $row['summary']['total_days'] }}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Hadir</div>
                    <div class="summary-value">{{ $row['summary']['hadir'] }}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Sakit/Izin</div>
                    <div class="summary-value">{{ $row['summary']['sakit'] + $row['summary']['izin'] }}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Cuti</div>
                    <div class="summary-value">{{ $row['summary']['cuti'] }}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Alpa</div>
                    <div class="summary-value" style="color: #dc2626;">{{ $row['summary']['alpha'] }}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Libur</div>
                    <div class="summary-value">{{ $row['summary']['libur'] }}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Terlambat</div>
                    <div class="summary-value" style="color: #b91c1c;">{{ $row['summary']['late'] }}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Lembur (Jam)</div>
                    <div class="summary-value">{{ number_format($row['summary']['overtime_mins'] / 60, 1) }}</div>
                </div>
            </div>

            <table class="details">
                <thead>
                    <tr>
                        <th style="width: 15%;">Tanggal</th>
                        <th style="width: 15%;">Shift</th>
                        <th style="width: 10%;">In</th>
                        <th style="width: 10%;">Out</th>
                        <th style="width: 10%;">Late</th>
                        <th style="width: 10%;">Early</th>
                        <th style="width: 15%;">Status</th>
                        <th style="width: 15%;">Lembur (V)</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($row['attendances'] as $att)
                        <tr>
                            <td>{{ \Carbon\Carbon::parse($att->tanggal)->translatedFormat('d/m/Y') }}</td>
                            <td>{{ $att->employee->shift->name ?? '-' }}</td>
                            <td>{{ $att->clock_in ? \Carbon\Carbon::parse($att->clock_in)->format('H:i') : '-' }}</td>
                            <td>{{ $att->clock_out ? \Carbon\Carbon::parse($att->clock_out)->format('H:i') : '-' }}</td>
                            <td class="{{ $att->late_in_minutes > 0 ? 'is-late' : '' }}">
                                {{ $att->late_in_minutes > 0 ? floor($att->late_in_minutes / 60) . 'h ' . ($att->late_in_minutes % 60) . 'm' : '-' }}
                            </td>
                            <td>
                                {{ $att->early_out_minutes > 0 ? floor($att->early_out_minutes / 60) . 'h ' . ($att->early_out_minutes % 60) . 'm' : '-' }}
                            </td>
                            <td class="{{ $att->status === 'hadir' ? 'status-hadir' : ($att->status === 'alpha' ? 'status-absent' : '') }}">
                                {{ strtoupper($att->status) }}
                            </td>
                            <td style="font-weight: bold;">
                                {{ $att->verified_lembur_minutes > 0 ? number_format($att->verified_lembur_minutes / 60, 1) . ' h' : '-' }}
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>

            <div style="font-size: 8px; color: #999; margin-top: 10px; text-align: right;">
                Halaman {{ $index + 1 }} dari {{ count($data) }} - Dicetak pada {{ date('d/m/Y H:i') }}
            </div>
        </div>
    @endforeach

</body>
</html>
