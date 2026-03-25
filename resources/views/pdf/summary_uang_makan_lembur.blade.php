<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Summary Uang Makan & Lembur - {{ \Carbon\Carbon::parse($payroll->periode . '-01')->translatedFormat('F Y') }}</title>
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
        
        .total-row { font-weight: bold; background-color: #f8fafc; }
    </style>
</head>
<body>

    @php
        function format_rupiah($angka) {
            return 'Rp ' . number_format($angka, 0, ',', '.');
        }
    @endphp

    @foreach($groupedItems as $companyName => $items)
        <div class="{{ !$loop->last ? 'page-break' : '' }}">
            <h1>SUMMARY UANG MAKAN & LEMBUR</h1>
            <h2>Periode: {{ \Carbon\Carbon::parse($payroll->periode . '-01')->translatedFormat('F Y') }}</h2>
            
            <div class="company-header">{{ $companyName }}</div>
            
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
                            $totalMakan += $item->uang_makan;
                            $totalLembur += $item->uang_lembur;
                            $totalAll += $totalRow;
                        @endphp
                        <tr>
                            <td class="text-center">{{ $index + 1 }}</td>
                            <td class="text-left">{{ $item->employee->nama }}</td>
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
                        <td colspan="3" style="text-align: right;">TOTAL:</td>
                        <td>{{ format_rupiah($totalMakan) }}</td>
                        <td></td>
                        <td>{{ format_rupiah($totalLembur) }}</td>
                        <td>{{ format_rupiah($totalAll) }}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    @endforeach

</body>
</html>
