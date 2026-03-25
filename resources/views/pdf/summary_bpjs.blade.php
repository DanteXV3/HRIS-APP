<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Summary BPJS - {{ \Carbon\Carbon::parse($payroll->periode . '-01')->translatedFormat('F Y') }}</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 8px; color: #333; }
        h1 { text-align: center; font-size: 16px; margin-bottom: 5px; text-transform: uppercase; }
        h2 { text-align: center; font-size: 12px; margin-top: 0; font-weight: normal; margin-bottom: 20px;}
        
        .page-break { page-break-after: always; }
        .company-header { 
            background-color: #1e3a8a; color: white; padding: 6px 10px; 
            font-size: 10px; font-weight: bold; margin-bottom: 10px; border-radius: 4px;
        }

        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ccc; padding: 4px 4px; text-align: right; }
        th { background-color: #f4f4f5; text-align: center; font-weight: bold; }
        td.text-left { text-align: left; }
        td.text-center { text-align: center; }
        
        .section-header { background-color: #f8fafc; font-weight: bold; text-align: center; }
        .total-row { font-weight: bold; background-color: #f1f5f9; }
    </style>
</head>
<body>

    @php
        function format_rupiah($angka) {
            return number_format($angka, 0, ',', '.');
        }
    @endphp

    @foreach($groupedItems as $companyName => $items)
        <div class="{{ !$loop->last ? 'page-break' : '' }}">
            <h1>SUMMARY BPJS KESEHATAN & KETENAGAKERJAAN</h1>
            <h2>Periode: {{ \Carbon\Carbon::parse($payroll->periode . '-01')->translatedFormat('F Y') }}</h2>
            
            <div class="company-header">{{ $companyName }}</div>
            
            <table>
                <thead>
                    <tr>
                        <th rowspan="2" style="width: 3%;">No</th>
                        <th rowspan="2" style="width: 15%;">Nama Karyawan</th>
                        <th rowspan="2" style="width: 8%;">Gaji Dasar BPJS</th>
                        <th colspan="2">BPJS Kesehatan (5%)</th>
                        <th colspan="2">JHT (5.7%)</th>
                        <th colspan="2">JP (3%)</th>
                        <th rowspan="2">JKK (0.24%)</th>
                        <th rowspan="2">JKM (0.3%)</th>
                        <th rowspan="2">Total Perusahaan</th>
                        <th rowspan="2">Total Karyawan</th>
                    </tr>
                    <tr>
                        <th style="width: 7%;">Pers (4%)</th>
                        <th style="width: 7%;">Kar (1%)</th>
                        <th style="width: 7%;">Pers (3.7%)</th>
                        <th style="width: 7%;">Kar (2%)</th>
                        <th style="width: 7%;">Pers (2%)</th>
                        <th style="width: 7%;">Kar (1%)</th>
                    </tr>
                </thead>
                <tbody>
                    @php
                        $t = [
                            'base' => 0, 'jkn_p' => 0, 'jkn_k' => 0, 'jht_p' => 0, 'jht_k' => 0,
                            'jp_p' => 0, 'jp_k' => 0, 'jkk' => 0, 'jkm' => 0, 'tot_p' => 0, 'tot_k' => 0
                        ];
                    @endphp
                    @foreach($items as $index => $item)
                        @php
                            $baseTk = (float)$item->bpjs_tk_base;
                            $baseJkn = (float)$item->bpjs_jkn_base;
                            
                            $jkn_p = round($baseJkn * 0.04);
                            $jkn_k = round($baseJkn * 0.01);
                            $jht_p = round($baseTk * 0.037);
                            $jht_k = round($baseTk * 0.02);
                            $jp_p = round($baseTk * 0.02);
                            $jp_k = round($baseTk * 0.01);
                            $jkk = round($baseTk * 0.0024);
                            $jkm = round($baseTk * 0.003);
                            
                            $tot_p = $jkn_p + $jht_p + $jp_p + $jkk + $jkm;
                            $tot_k = $jkn_k + $jht_k + $jp_k;
                            
                            foreach($t as $key => $val) { if(isset($$key)) $t[$key] += $$key; }
                            $t['base'] += $baseTk; // Simplified for total row
                        @endphp
                        <tr>
                            <td class="text-center">{{ $index + 1 }}</td>
                            <td class="text-left">{{ $item->employee->nama }}</td>
                            <td>{{ format_rupiah($baseTk) }}</td>
                            <td>{{ format_rupiah($jkn_p) }}</td>
                            <td>{{ format_rupiah($jkn_k) }}</td>
                            <td>{{ format_rupiah($jht_p) }}</td>
                            <td>{{ format_rupiah($jht_k) }}</td>
                            <td>{{ format_rupiah($jp_p) }}</td>
                            <td>{{ format_rupiah($jp_k) }}</td>
                            <td>{{ format_rupiah($jkk) }}</td>
                            <td>{{ format_rupiah($jkm) }}</td>
                            <td style="font-weight: bold;">{{ format_rupiah($tot_p) }}</td>
                            <td style="font-weight: bold; background-color: #fee2e2;">{{ format_rupiah($tot_k) }}</td>
                        </tr>
                    @endforeach
                </tbody>
                <tfoot>
                    <tr class="total-row">
                        <td colspan="2" style="text-align: right;">TOTAL:</td>
                        <td>{{ format_rupiah($t['base']) }}</td>
                        <td>{{ format_rupiah($t['jkn_p']) }}</td>
                        <td>{{ format_rupiah($t['jkn_k']) }}</td>
                        <td>{{ format_rupiah($t['jht_p']) }}</td>
                        <td>{{ format_rupiah($t['jht_k']) }}</td>
                        <td>{{ format_rupiah($t['jp_p']) }}</td>
                        <td>{{ format_rupiah($t['jp_k']) }}</td>
                        <td>{{ format_rupiah($t['jkk']) }}</td>
                        <td>{{ format_rupiah($t['jkm']) }}</td>
                        <td>{{ format_rupiah($t['tot_p']) }}</td>
                        <td style="background-color: #fecaca;">{{ format_rupiah($t['tot_k']) }}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    @endforeach

</body>
</html>
