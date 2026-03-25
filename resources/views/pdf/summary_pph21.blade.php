<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Summary PPh21 - {{ \Carbon\Carbon::parse($payroll->periode . '-01')->translatedFormat('F Y') }}</title>
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
        th { background-color: #f4f4f5; text-align: center; font-weight: bold; }
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
            <h1>PERHITUNGAN PPh21 KARYAWAN</h1>
            <h2>Periode: {{ \Carbon\Carbon::parse($payroll->periode . '-01')->translatedFormat('F Y') }}</h2>
            
            <div class="company-header">{{ $companyName }}</div>
            
            <table>
                <thead>
                    <tr>
                        <th style="width: 5%;">No</th>
                        <th style="width: 25%;">Nama Karyawan</th>
                        <th style="width: 15%;">NPWP</th>
                        <th style="width: 15%;">Bruto Pajak (DJP)</th>
                        <th style="width: 15%;">PPh21 (Potongan)</th>
                        <th style="width: 15%;">Tunjangan Pajak (Gross Up)</th>
                        <th style="width: 10%;">PPh21 Netto</th>
                    </tr>
                </thead>
                <tbody>
                    @php
                        $totalGross = 0;
                        $totalPph = 0;
                        $totalTunjangan = 0;
                    @endphp
                    @foreach($items as $index => $item)
                        @php
                            $totalGross += $item->taxable_gross;
                            $totalPph += $item->potongan_pph21;
                            $totalTunjangan += $item->tunjangan_pajak;
                            $pphNet = $item->potongan_pph21 - $item->tunjangan_pajak;
                        @endphp
                        <tr>
                            <td class="text-center">{{ $index + 1 }}</td>
                            <td class="text-left">{{ $item->employee->nama }}</td>
                            <td class="text-center">{{ $item->employee->npwp ?: '-' }}</td>
                            <td>{{ format_rupiah($item->taxable_gross) }}</td>
                            <td style="color: #b91c1c;">{{ format_rupiah($item->potongan_pph21) }}</td>
                            <td style="color: #047857;">{{ format_rupiah($item->tunjangan_pajak) }}</td>
                            <td style="font-weight: bold;">{{ format_rupiah($pphNet) }}</td>
                        </tr>
                    @endforeach
                </tbody>
                <tfoot>
                    <tr class="total-row">
                        <td colspan="3" style="text-align: right;">TOTAL:</td>
                        <td>{{ format_rupiah($totalGross) }}</td>
                        <td style="color: #b91c1c;">{{ format_rupiah($totalPph) }}</td>
                        <td style="color: #047857;">{{ format_rupiah($totalTunjangan) }}</td>
                        <td>{{ format_rupiah($totalPph - $totalTunjangan) }}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    @endforeach

</body>
</html>
