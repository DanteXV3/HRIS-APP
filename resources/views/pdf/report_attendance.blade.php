<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Absensi - {{ \Carbon\Carbon::parse($payroll->periode . '-01')->translatedFormat('F Y') }}</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 10px; color: #333; }
        h1 { text-align: center; font-size: 18px; margin-bottom: 5px; text-transform: uppercase; }
        h2 { text-align: center; font-size: 14px; margin-top: 0; font-weight: normal; margin-bottom: 20px;}
        
        .page-break { page-break-after: always; }
        .company-header { 
            background-color: #1e3a8a; color: white; padding: 6px 10px; 
            font-size: 12px; font-weight: bold; margin-bottom: 10px; border-radius: 4px;
        }

        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: right; }
        th { background-color: #f4f4f5; text-align: center; font-weight: bold; font-size: 9px; }
        td { font-size: 9px; }
        td.text-left { text-align: left; }
        td.text-center { text-align: center; }
        
        .status-hadir { color: #059669; }
        .status-absent { color: #dc2626; }
        .total-row { font-weight: bold; background-color: #f8fafc; }
    </style>
</head>
<body>

    @foreach($groupedItems as $companyName => $items)
        <div class="{{ !$loop->last ? 'page-break' : '' }}">
            <h1>LAPORAN REKAPITULASI ABSENSI</h1>
            <h2>Periode: {{ \Carbon\Carbon::parse($payroll->periode . '-01')->translatedFormat('F Y') }}</h2>
            
            <div class="company-header">{{ $companyName }}</div>
            
            <table>
                <thead>
                    <tr>
                        <th style="width: 5%;">No</th>
                        <th style="width: 20%;">Nama Karyawan</th>
                        <th style="width: 10%;">Hadir</th>
                        <th style="width: 8%;">Sakit</th>
                        <th style="width: 8%;">Izin</th>
                        <th style="width: 8%;">Cuti</th>
                        <th style="width: 8%;">Alpa</th>
                        <th style="width: 10%;">Terlambat</th>
                        <th style="width: 15%;">Lembur (Jam)</th>
                        <th style="width: 8%;">Libur</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($items as $index => $item)
                        @php
                            // These summaries should be calculated in the controller and passed here
                            // or fetched directly if the relation is loaded. 
                            // For simplicity in the first version, we use the stored counts if available.
                            $summary = $item->attendance_summary ?? [
                                'hadir' => $item->uang_makan_count, // Approximation if not fully calculated
                                'sakit' => 0, 'izin' => 0, 'cuti' => 0, 'alpha' => 0, 'late' => 0, 'libur' => 0
                            ];
                        @endphp
                        <tr>
                            <td class="text-center">{{ $index + 1 }}</td>
                            <td class="text-left">{{ $item->employee->nama }}</td>
                            <td class="text-center status-hadir">{{ $summary['hadir'] }}</td>
                            <td class="text-center">{{ $summary['sakit'] }}</td>
                            <td class="text-center">{{ $summary['izin'] }}</td>
                            <td class="text-center">{{ $summary['cuti'] }}</td>
                            <td class="text-center status-absent">{{ $summary['alpha'] }}</td>
                            <td class="text-center">{{ $summary['late'] }}</td>
                            <td class="text-center">{{ number_format($item->lembur_minutes / 60, 1) }}</td>
                            <td class="text-center">{{ $summary['libur'] }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
            
            <div style="font-size: 8px; color: #666; margin-top: -10px; margin-bottom: 20px;">
                * Data absensi berdasarkan periode cutoff masing-masing lokasi kerja.
            </div>
        </div>
    @endforeach

</body>
</html>
