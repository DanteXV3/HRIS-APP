<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Rekap Absensi Harian</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 9px; color: #333; margin: 15px 20px; }

        .company-header { text-align: center; margin-bottom: 12px; border-bottom: 2px solid #1e3a8a; padding-bottom: 8px; }
        .company-header h1 { font-size: 16px; margin-bottom: 2px; text-transform: uppercase; color: #1e3a8a; letter-spacing: 1px; }
        .company-header h2 { font-size: 12px; margin: 0; font-weight: bold; color: #334155; }
        .company-header h3 { font-size: 10px; margin: 2px 0 0 0; font-weight: normal; color: #64748b; }

        .summary { margin-bottom: 14px; }
        .summary table { width: 100%; border-collapse: collapse; }
        .summary td { padding: 7px 10px; text-align: center; border: 1px solid #e2e8f0; }
        .summary .label { font-size: 7px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
        .summary .value { font-size: 15px; font-weight: bold; color: #1e293b; margin-top: 2px; }
        .summary .value-green { color: #059669; }
        .summary .value-red { color: #dc2626; }
        .summary .value-blue { color: #2563eb; }
        .summary .value-orange { color: #d97706; }
        .summary .value-purple { color: #7c3aed; }

        table.recap { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
        table.recap th, table.recap td { border: 1px solid #cbd5e1; padding: 4px 6px; text-align: center; }
        table.recap th {
            background-color: #1e3a8a;
            color: white;
            font-weight: bold;
            font-size: 8px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        table.recap td { font-size: 9px; }
        table.recap tr:nth-child(even) { background-color: #f8fafc; }
        table.recap td.text-left { text-align: left; }
        table.recap td.name-cell { text-align: left; max-width: 130px; overflow: hidden; }

        .status-hadir { color: #059669; font-weight: bold; }
        .status-sakit { color: #d97706; font-weight: bold; }
        .status-izin { color: #2563eb; font-weight: bold; }
        .status-cuti { color: #7c3aed; font-weight: bold; }
        .status-alpha { color: #dc2626; font-weight: bold; }
        .status-libur { color: #6366f1; font-weight: bold; }
        .status-off { color: #64748b; font-style: italic; }

        .val-zero { color: #cbd5e1; }
        .val-bad { color: #dc2626; font-weight: bold; }
        .val-good { color: #059669; font-weight: bold; }

        .footer { font-size: 7px; color: #94a3b8; margin-top: 8px; text-align: right; }
        .footer-left { float: left; }

        .page-break { page-break-after: always; }
    </style>
</head>
<body>

    @foreach($dailyByLocation as $locationName => $records)
        @if(!$loop->first)
            <div class="page-break"></div>
        @endif

        @php $locSummary = $locationSummaries[$locationName] ?? []; @endphp

        {{-- Company Header --}}
        <div class="company-header">
            <h1>Rekap Kehadiran Harian</h1>
            <h2>{{ $locationName }}</h2>
            <h3>Periode: {{ \Carbon\Carbon::parse($tanggalStart)->translatedFormat('d M Y') }} — {{ \Carbon\Carbon::parse($tanggalEnd)->translatedFormat('d M Y') }} · {{ $locSummary['total_employees'] ?? 0 }} karyawan</h3>
        </div>

        {{-- Per-Company Summary --}}
        <div class="summary">
            <table>
                <tr>
                    <td>
                        <div class="label">Karyawan</div>
                        <div class="value">{{ $locSummary['total_employees'] ?? 0 }}</div>
                    </td>
                    <td>
                        <div class="label">Total Hari</div>
                        <div class="value">{{ $locSummary['total_days'] ?? 0 }}</div>
                    </td>
                    <td>
                        <div class="label">Hadir</div>
                        <div class="value value-green">{{ $locSummary['hadir'] ?? 0 }}</div>
                    </td>
                    <td>
                        <div class="label">Sakit</div>
                        <div class="value value-orange">{{ $locSummary['sakit'] ?? 0 }}</div>
                    </td>
                    <td>
                        <div class="label">Izin</div>
                        <div class="value value-blue">{{ $locSummary['izin'] ?? 0 }}</div>
                    </td>
                    <td>
                        <div class="label">Cuti</div>
                        <div class="value value-purple">{{ $locSummary['cuti'] ?? 0 }}</div>
                    </td>
                    <td>
                        <div class="label">Alpha</div>
                        <div class="value value-red">{{ $locSummary['alpha'] ?? 0 }}</div>
                    </td>
                    <td>
                        <div class="label">Terlambat</div>
                        <div class="value value-red">{{ $locSummary['late'] ?? 0 }}</div>
                    </td>
                    <td>
                        <div class="label">Lembur</div>
                        <div class="value">{{ number_format(($locSummary['overtime_mins'] ?? 0) / 60, 1) }} jam</div>
                    </td>
                </tr>
            </table>
        </div>

        {{-- Daily Attendance Table --}}
        <table class="recap">
            <thead>
                <tr>
                    <th style="width: 25px;">No</th>
                    <th style="width: 75px;">Tanggal</th>
                    <th style="width: 90px;">NIK</th>
                    <th style="width: 130px;">Nama</th>
                    <th style="width: 70px;">Departemen</th>
                    <th style="width: 50px;">Clock In</th>
                    <th style="width: 50px;">Clock Out</th>
                    <th style="width: 60px;">Status</th>
                    <th style="width: 55px;">Late</th>
                    <th style="width: 55px;">Lembur (V)</th>
                </tr>
            </thead>
            <tbody>
                @foreach($records as $i => $record)
                    @php
                        $att = $record['attendance'];
                        $emp = $record['employee'];
                        $dateStr = $att->tanggal instanceof \Carbon\Carbon ? $att->tanggal->format('Y-m-d') : $att->tanggal;
                    @endphp
                    <tr>
                        <td>{{ $i + 1 }}</td>
                        <td>{{ \Carbon\Carbon::parse($dateStr)->format('d/m/Y') }}</td>
                        <td style="font-size: 8px;">{{ $emp->nik }}</td>
                        <td class="name-cell">{{ $emp->nama }}</td>
                        <td style="font-size: 8px;">{{ $emp->department->name ?? '-' }}</td>
                        <td>{{ $att->clock_in ? \Carbon\Carbon::parse($att->clock_in)->format('H:i') : '-' }}</td>
                        <td>{{ $att->clock_out ? \Carbon\Carbon::parse($att->clock_out)->format('H:i') : '-' }}</td>
                        <td class="status-{{ $att->status }}">{{ strtoupper($att->status ?? 'ALPHA') }}</td>
                        <td class="{{ ($att->late_in_minutes ?? 0) > 0 ? 'val-bad' : 'val-zero' }}">
                            @if(($att->late_in_minutes ?? 0) > 0)
                                {{ floor($att->late_in_minutes / 60) }}h {{ $att->late_in_minutes % 60 }}m
                            @else
                                -
                            @endif
                        </td>
                        <td class="{{ ($att->verified_lembur_minutes ?? 0) > 0 ? 'val-good' : 'val-zero' }}">
                            @if(($att->verified_lembur_minutes ?? 0) > 0)
                                {{ number_format($att->verified_lembur_minutes / 60, 1) }}h
                            @else
                                -
                            @endif
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <div class="footer">
            <span class="footer-left">{{ $locationName }} · {{ $locSummary['total_employees'] ?? 0 }} karyawan</span>
            Dicetak pada {{ date('d/m/Y H:i') }}
        </div>
    @endforeach

</body>
</html>
