<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Summary THP - {{ \Carbon\Carbon::parse($payroll->periode . '-01')->translatedFormat('F Y') }}</title>
    <style>
        @page { margin: 1cm 1.5cm; }
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 9px; color: #333; }
        h1 { text-align: center; font-size: 18px; margin-bottom: 5px; text-transform: uppercase; }
        h2 { text-align: center; font-size: 14px; margin-top: 0; font-weight: normal; margin-bottom: 20px;}
        
        .page-break { page-break-after: always; }
        .company-header { 
            background-color: #1e3a8a; color: white; padding: 6px 10px; 
            font-size: 12px; font-weight: bold; margin-bottom: 10px; border-radius: 4px;
        }

        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ccc; padding: 5px 6px; text-align: right; }
        th { background-color: #f4f4f5; text-align: center; font-weight: bold; font-size: 9px; }
        td.text-left { text-align: left; }
        td.text-center { text-align: center; }
        
        .total-row { font-weight: bold; background-color: #e2e8f0; }
        .grand-total-row th { background-color: #1e3a8a; color: white; text-align: right; padding: 8px;}
        .grand-total-row td { background-color: #1e3a8a; color: white; font-weight: bold; font-size: 12px;}
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
            $gt = ['gp' => 0, 'tj' => 0, 'um' => 0, 'ul' => 0, 'tp' => 0, 'tb' => 0, 'pot' => 0, 'thp' => 0];
        @endphp
        <div class="{{ !$loop->last ? 'page-break' : '' }}">
            <h1>Summary Take Home Pay (THP)</h1>
            <h2>Periode: {{ \Carbon\Carbon::parse($payroll->periode . '-01')->translatedFormat('F Y') }}</h2>
            
            <div class="company-header">PERUSAHAAN: {{ $companyName }}</div>
            
            @foreach($locations as $locationName => $items)
                <div style="font-weight: bold; margin-bottom: 5px; font-size: 10px; color: #1e3a8a;">LOKASI: {{ $locationName }} ({{ count($items) }} Karyawan)</div>
                <table>
                    <thead>
                        <tr>
                            <th style="width: 3%;">No</th>
                            <th style="width: 17%;">Nama Karyawan</th>
                            <th style="width: 10%;">Gaji Pokok</th>
                            <th style="width: 10%;">Tunjangan</th>
                            <th style="width: 10%;">Uang Makan</th>
                            <th style="width: 10%;">Lembur</th>
                            <th style="width: 10%;">Pajak (DTP)</th>
                            <th style="width: 10%;">Total Bruto</th>
                            <th style="width: 10%;">Total Potongan</th>
                            <th style="width: 10%;">Netto (THP)</th>
                        </tr>
                    </thead>
                    <tbody>
                        @php
                            $cols = ['gp' => 0, 'tj' => 0, 'um' => 0, 'ul' => 0, 'tp' => 0, 'tb' => 0, 'pot' => 0, 'thp' => 0];
                        @endphp
                        @foreach($items as $index => $item)
                            @php
                                $tj = $item->tunjangan_jabatan + $item->tunjangan_kehadiran + $item->tunjangan_transportasi + $item->thr;
                                $tb = $item->total_pendapatan;
                                $thp = $item->gaji_bersih;
                                
                                $cols['gp'] += $item->gaji_pokok; $gt['gp'] += $item->gaji_pokok;
                                $cols['tj'] += $tj;               $gt['tj'] += $tj;
                                $cols['um'] += $item->uang_makan;  $gt['um'] += $item->uang_makan;
                                $cols['ul'] += $item->uang_lembur; $gt['ul'] += $item->uang_lembur;
                                $cols['tp'] += $item->tunjangan_pajak; $gt['tp'] += $item->tunjangan_pajak;
                                $cols['tb'] += $tb;               $gt['tb'] += $tb;
                                $cols['pot'] += $item->total_potongan; $gt['pot'] += $item->total_potongan;
                                $cols['thp'] += $thp;              $gt['thp'] += $thp;
                            @endphp
                            <tr>
                                <td class="text-center">{{ $index + 1 }}</td>
                                <td class="text-left">{{ $item->employee_name ?? $item->employee->nama }}</td>
                                <td>{{ format_rupiah($item->gaji_pokok) }}</td>
                                <td>{{ format_rupiah($tj) }}</td>
                                <td>{{ format_rupiah($item->uang_makan) }}</td>
                                <td>{{ format_rupiah($item->uang_lembur) }}</td>
                                <td>{{ format_rupiah($item->tunjangan_pajak) }}</td>
                                <td style="font-weight: bold;">{{ format_rupiah($tb) }}</td>
                                <td style="color: #b91c1c;">{{ format_rupiah($item->total_potongan) }}</td>
                                <td style="font-weight: bold; background-color: #eff6ff; color: #1d4ed8;">{{ format_rupiah($thp) }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                    <tfoot>
                        <tr class="total-row">
                            <td colspan="2" style="text-align: right;">TOTAL LOKASI:</td>
                            <td>{{ format_rupiah($cols['gp']) }}</td>
                            <td>{{ format_rupiah($cols['tj']) }}</td>
                            <td>{{ format_rupiah($cols['um']) }}</td>
                            <td>{{ format_rupiah($cols['ul']) }}</td>
                            <td>{{ format_rupiah($cols['tp']) }}</td>
                            <td>{{ format_rupiah($cols['tb']) }}</td>
                            <td>{{ format_rupiah($cols['pot']) }}</td>
                            <td style="background-color: #bfdbfe; color: #1e40af;">{{ format_rupiah($cols['thp']) }}</td>
                        </tr>
                    </tfoot>
                </table>
            @endforeach

            <div style="margin-top: 20px; border: 2px solid #1e3a8a; border-radius: 4px; overflow: hidden;">
                <div style="background-color: #1e3a8a; color: white; padding: 5px 10px; font-weight: bold; font-size: 11px;">GRAND TOTAL {{ $companyName }}</div>
                <table style="margin-bottom: 0;">
                    <tr class="grand-total-row">
                        <th style="width: 20%; text-align: left; background-color: #f1f5f9; color: #333;">ELEMEN</th>
                        <th style="width: 10%;">GAJI POKOK</th>
                        <th style="width: 10%;">TUNJANGAN</th>
                        <th style="width: 10%;">U. MAKAN</th>
                        <th style="width: 10%;">LEMBUR</th>
                        <th style="width: 10%;">PAJAK (DTP)</th>
                        <th style="width: 10%;">BRUTO</th>
                        <th style="width: 10%;">POTONGAN</th>
                        <th style="width: 10%;">NETTO (THP)</th>
                    </tr>
                    <tr>
                        <td style="text-align: left; font-weight: bold; background-color: #f1f5f9;">TOTAL KESELURUHAN</td>
                        <td style="text-align: right; font-weight: bold;">{{ format_rupiah($gt['gp']) }}</td>
                        <td style="text-align: right; font-weight: bold;">{{ format_rupiah($gt['tj']) }}</td>
                        <td style="text-align: right; font-weight: bold;">{{ format_rupiah($gt['um']) }}</td>
                        <td style="text-align: right; font-weight: bold;">{{ format_rupiah($gt['ul']) }}</td>
                        <td style="text-align: right; font-weight: bold;">{{ format_rupiah($gt['tp']) }}</td>
                        <td style="text-align: right; font-weight: bold;">{{ format_rupiah($gt['tb']) }}</td>
                        <td style="text-align: right; font-weight: bold; color: #b91c1c;">{{ format_rupiah($gt['pot']) }}</td>
                        <td style="text-align: right; font-weight: bold; background-color: #bfdbfe; color: #1e40af;">{{ format_rupiah($gt['thp']) }}</td>
                    </tr>
                </table>
            </div>
        </div>
    @endforeach

</body>
</html>
