<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Absensi - {{ \Carbon\Carbon::parse($payroll->periode . '-01')->translatedFormat('F Y') }}</title>
    <style>
        @page { margin: 1cm 1.5cm; }
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

    @foreach($groupedItems as $companyName => $locations)
        @php
            $gt = ['hadir' => 0, 'sakit' => 0, 'izin' => 0, 'cuti' => 0, 'alpha' => 0, 'late' => 0, 'lembur_min' => 0, 'libur' => 0];
        @endphp
        <div class="{{ !$loop->last ? 'page-break' : '' }}">
            <h1>LAPORAN REKAPITULASI ABSENSI</h1>
            <h2>Periode: {{ \Carbon\Carbon::parse($payroll->periode . '-01')->translatedFormat('F Y') }}</h2>
            
            <div class="company-header">PERUSAHAAN: {{ $companyName }}</div>
            
            @foreach($locations as $locationName => $items)
                <div style="font-weight: bold; margin-bottom: 5px; font-size: 10px; color: #1e3a8a;">LOKASI: {{ $locationName }} ({{ count($items) }} Karyawan)</div>
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
                                $summary = $item->attendance_summary ?? [
                                    'hadir' => $item->uang_makan_count, 
                                    'sakit' => 0, 'izin' => 0, 'cuti' => 0, 'alpha' => 0, 'late' => 0, 'libur' => 0
                                ];
                                
                                $gt['hadir'] += $summary['hadir'];
                                $gt['sakit'] += $summary['sakit'];
                                $gt['izin'] += $summary['izin'];
                                $gt['cuti'] += $summary['cuti'];
                                $gt['alpha'] += $summary['alpha'];
                                $gt['late'] += $summary['late'];
                                $gt['lembur_min'] += $item->lembur_minutes;
                                $gt['libur'] += $summary['libur'];
                            @endphp
                            <tr>
                                <td class="text-center">{{ $index + 1 }}</td>
                                <td class="text-left">{{ $item->employee_name ?? $item->employee->nama }}</td>
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
            @endforeach

            <div style="margin-top: 20px; border: 2px solid #1e3a8a; border-radius: 4px; overflow: hidden;">
                <div style="background-color: #1e3a8a; color: white; padding: 5px 10px; font-weight: bold; font-size: 11px;">GRAND TOTAL {{ $companyName }}</div>
                <table style="margin-bottom: 0;">
                    <tr>
                        <th style="width: 25%; text-align: left; background-color: #f1f5f9;">DESKRIPSI</th>
                        <th>HADIR</th>
                        <th>S/I/C</th>
                        <th>ALPA</th>
                        <th>LATE</th>
                        <th>LEMBUR (JAM)</th>
                        <th>LIBUR</th>
                    </tr>
                    <tr>
                        <td style="text-align: left; font-weight: bold; background-color: #f1f5f9;">TOTAL KESELURUHAN</td>
                        <td class="text-center" style="font-weight: bold;">{{ $gt['hadir'] }}</td>
                        <td class="text-center" style="font-weight: bold;">{{ $gt['sakit'] + $gt['izin'] + $gt['cuti'] }}</td>
                        <td class="text-center" style="font-weight: bold; color: #dc2626;">{{ $gt['alpha'] }}</td>
                        <td class="text-center" style="font-weight: bold;">{{ $gt['late'] }}</td>
                        <td class="text-center" style="font-weight: bold; background-color: #eff6ff; color: #1e40af;">{{ number_format($gt['lembur_min'] / 60, 1) }}</td>
                        <td class="text-center" style="font-weight: bold;">{{ $gt['libur'] }}</td>
                    </tr>
                </table>
            </div>
            
            <div style="font-size: 8px; color: #666; margin-top: 5px; margin-bottom: 20px;">
                * Data absensi berdasarkan periode cutoff masing-masing lokasi kerja.
            </div>
        </div>
    @endforeach

</body>
</html>
