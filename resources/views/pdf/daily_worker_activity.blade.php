<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Daily Worker Activity Report - {{ $report->workingLocation->name }}</title>
    <style>
        @page { size: landscape; margin: 1cm; }
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 10px; color: #333; line-height: 1.4; }
        
        /* Letterhead Style */
        .header { text-align: center; margin-bottom: 25px; border-bottom: 2px solid #1e3a8a; padding-bottom: 10px; }
        .header h1 { font-size: 18px; margin: 0 0 5px 0; color: #1e3a8a; text-transform: uppercase; letter-spacing: 1px; }
        .header p { font-size: 11px; margin: 0; color: #64748b; font-weight: bold; }

        /* Report Info */
        .report-info { margin-bottom: 20px; width: 100%; }
        .report-info table { width: 100%; }
        .report-info td { vertical-align: top; padding: 2px 0; }
        .label { font-weight: bold; width: 100px; color: #1e3a8a; }
        .value { color: #334155; }

        /* Table Style */
        table.details { width: 100%; border-collapse: collapse; margin-top: 10px; table-layout: fixed; }
        table.details th, table.details td { border: 1px solid #cbd5e1; padding: 4px 3px; text-align: left; }
        table.details th { background-color: #f1f5f9; font-weight: bold; font-size: 8px; text-transform: uppercase; color: #475569; }
        table.details td { word-wrap: break-word; vertical-align: top; }

        .text-center { text-align: center !important; }
        .font-bold { font-weight: bold; }
        .italic { font-style: italic; }

        /* Status Colors */
        .status-badge { padding: 1px 3px; border-radius: 2px; font-weight: bold; font-size: 7px; text-transform: uppercase; }
        .status-hadir { color: #059669; }
        .status-alpha { color: #dc2626; }
        .status-izin { color: #2563eb; }
        .status-sakit { color: #d97706; }

        .activity-status { font-size: 7px; color: #64748b; font-weight: bold; margin-top: 2px; display: block; }

        .footer { position: fixed; bottom: 0; width: 100%; text-align: right; font-size: 8px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 5px; }
    </style>
</head>
<body>

    <div class="header">
        <h1>LAPORAN AKTIFITAS HARIAN PEKERJA</h1>
        <p>DAILY WORKER ACTIVITY REPORT</p>
    </div>

    <div class="report-info">
        <table>
            <tr>
                <td class="label">Lokasi Kerja</td>
                <td class="value">: {{ $report->workingLocation->name }}</td>
                <td class="label">Tanggal</td>
                <td class="value">: {{ \Carbon\Carbon::parse($report->tanggal)->translatedFormat('d F Y') }}</td>
            </tr>
            <tr>
                <td class="label">Status Report</td>
                <td class="value">: {{ $report->is_finalized ? 'FINALIZED' : 'DRAFT' }}</td>
                <td class="label">Dicetak Oleh</td>
                <td class="value">: {{ auth()->user()->name }}</td>
            </tr>
        </table>
    </div>

    <table class="details">
        <thead>
            <tr>
                <th style="width: 4%;" class="text-center">No</th>
                <th style="width: 18%;">Pekerja (Worker)</th>
                <th style="width: 10%;">Cost Code</th>
                <th style="width: 56%;">Aktifitas (Activity Detail)</th>
                <th style="width: 12%;">Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($report->items as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>
                        <div class="font-bold">{{ $item->dailyWorker->nama ?? 'Unknown' }}</div>
                        <div class="italic" style="font-size: 8px; color: #64748b;">{{ $item->dailyWorker->nik ?? '-' }}</div>
                    </td>
                    <td class="text-center">
                        <span class="font-bold">{{ $item->budgetItem->item_code ?? '-' }}</span>
                        @if($item->budgetItem)
                            <div style="font-size: 7px; color: #64748b;">{{ $item->budgetItem->nama_budget }}</div>
                        @endif
                    </td>
                    <td>
                        {{ $item->aktifitas ?: '-' }}
                    </td>
                    <td>
                        <span class="status-badge status-{{ $item->attendance_status ?: 'waiting' }}">
                            {{ strtoupper($item->attendance_status ?: 'Waiting') }}
                        </span>
                        @if($item->jam_masuk)
                            <div style="font-size: 7px; color: #64748b; margin-top: 2px;">
                                Clock: {{ $item->jam_masuk }} - {{ $item->jam_pulang ?: '--:--' }}
                            </div>
                        @endif
                        <div class="activity-status">
                            Prog: {{ strtoupper($item->status_aktifitas) }}
                        </div>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Dicetak pada: {{ date('d/m/Y H:i') }} - BangunPeople HRIS
    </div>

</body>
</html>
