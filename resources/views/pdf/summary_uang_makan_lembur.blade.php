<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Summary Uang Makan & Lembur - {{ \Carbon\Carbon::parse($payroll->periode . '-01')->translatedFormat('F Y') }}</title>
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
        
        .total-row { font-weight: bold; background-color: #f8fafc; }
    </style>
</head>
<body>

    @php
        function format_rupiah($angka) {
            return 'Rp ' . number_format($angka, 0, ',', '.');
        }
    @endphp

    @foreach($groupedItems as $companyName => $locations)
        @php
            $gtMakan = 0; $gtLembur = 0; $gtAll = 0;
        @endphp
        <div class="{{ !$loop->last ? 'page-break' : '' }}">
            <h1>SUMMARY UANG MAKAN & LEMBUR</h1>
            <h2>Periode: {{ \Carbon\Carbon::parse($payroll->periode . '-01')->translatedFormat('F Y') }}</h2>
            
            <div class="company-header">PERUSAHAAN: {{ $companyName }}</div>
            
            @foreach($locations as $locationName => $items)
                <div style="font-weight: bold; margin-bottom: 5px; font-size: 10px; color: #1e3a8a;">LOKASI: {{ $locationName }} ({{ count($items) }} Karyawan)</div>
                <table>
                    <thead>
                        <tr>
                            <th style="width: 5%;">No</th>
                            <th style="width: 25%;">Nama Karyawan</th>
                            <th style="width: 15%;">Valid Attendance (Hari)</th>
                            <th style="width: 15%;">Uang Makan</th>
                            <th style="width: 15%;">Valid Lembur (Jam)</th>
                            <th style="width: 15%;">Uang Lembur</th>
                            <th style="width: 10%;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        @php
                            $totalMakan = 0;
                            $totalLembur = 0;
                            $totalAll = 0;
                        @endphp
                        @foreach($items as $index => $item)
                            @php
                                $totalRow = $item->uang_makan + $item->uang_lembur;
                                $totalMakan += $item->uang_makan;     $gtMakan += $item->uang_makan;
                                $totalLembur += $item->uang_lembur;    $gtLembur += $item->uang_lembur;
                                $totalAll += $totalRow;                $gtAll += $totalRow;
                            @endphp
                            <tr>
                                <td class="text-center">{{ $index + 1 }}</td>
                                <td class="text-left">{{ $item->employee_name ?? $item->employee->nama }}</td>
                                <td class="text-center">{{ $item->uang_makan_count }}</td>
                                <td>{{ format_rupiah($item->uang_makan) }}</td>
                                <td class="text-center">{{ number_format($item->lembur_minutes / 60, 1) }}</td>
                                <td>{{ format_rupiah($item->uang_lembur) }}</td>
                                <td style="font-weight: bold;">{{ format_rupiah($totalRow) }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                    <tfoot>
                        <tr class="total-row">
                            <td colspan="3" style="text-align: right;">TOTAL LOKASI:</td>
                            <td>{{ format_rupiah($totalMakan) }}</td>
                            <td></td>
                            <td>{{ format_rupiah($totalLembur) }}</td>
                            <td>{{ format_rupiah($totalAll) }}</td>
                        </tr>
                    </tfoot>
                </table>
            @endforeach

            <div style="margin-top: 20px; border: 2px solid #1e3a8a; border-radius: 4px; overflow: hidden;">
                <div style="background-color: #1e3a8a; color: white; padding: 5px 10px; font-weight: bold; font-size: 11px;">GRAND TOTAL {{ $companyName }}</div>
                <table style="margin-bottom: 0;">
                    <tr>
                        <th style="width: 40%; text-align: left; background-color: #f1f5f9;">DESKRIPSI</th>
                        <th style="width: 20%;">TOTAL UANG MAKAN</th>
                        <th style="width: 20%;">TOTAL UANG LEMBUR</th>
                        <th style="width: 20%;">TOTAL KESELURUHAN</th>
                    </tr>
                    <tr>
                        <td style="text-align: left; font-weight: bold; background-color: #f1f5f9;">TOTAL KESELURUHAN</td>
                        <td style="text-align: right; font-weight: bold;">{{ format_rupiah($gtMakan) }}</td>
                        <td style="text-align: right; font-weight: bold;">{{ format_rupiah($gtLembur) }}</td>
                        <td style="text-align: right; font-weight: bold; background-color: #eff6ff; color: #1e40af;">{{ format_rupiah($gtAll) }}</td>
                    </tr>
                </table>
            </div>
        </div>
    @endforeach

</body>
</html>
