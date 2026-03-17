<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Ringkasan Payroll - {{ \Carbon\Carbon::parse($payroll->periode . '-01')->translatedFormat('F Y') }}</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 10px; color: #333; }
        h1 { text-align: center; font-size: 18px; margin-bottom: 5px; text-transform: uppercase; }
        h2 { text-align: center; font-size: 14px; margin-top: 0; font-weight: normal; margin-bottom: 20px;}
        
        .company-section { margin-bottom: 30px; page-break-inside: avoid; }
        .company-header { 
            background-color: #1e3a8a; color: white; padding: 6px 10px; 
            font-size: 12px; font-weight: bold; margin-bottom: 10px; border-radius: 4px;
        }

        table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        th, td { border: 1px solid #ccc; padding: 4px 6px; text-align: right; }
        th { background-color: #f4f4f5; text-align: center; font-weight: bold; font-size: 9px; }
        td { font-size: 9px; }
        td.text-left { text-align: left; }
        
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

    <h1>LAPORAN RINGKASAN PAYROLL</h1>
    <h2>Periode: {{ \Carbon\Carbon::parse($payroll->periode . '-01')->translatedFormat('F Y') }}</h2>

    @foreach($groupedItems as $companyName => $items)
        @php
            $companyTotalInc = 0;
            $companyMakan = $items->sum('uang_makan');
            $companyLembur = $items->sum('uang_lembur');
            $companyThr = $items->sum('thr');
            $companyBpjsTkPers = $items->sum('iuran_bpjs_tk_perusahaan');
            $companyBpjsKesPers = $items->sum('iuran_bpjs_jkn_perusahaan');
            $companyBpjsTkKar = $items->sum('potongan_bpjs_tk');
            $companyBpjsKesKar = $items->sum('potongan_bpjs_jkn');
            $companyPph = $items->sum('potongan_pph21');
            $companyPotLain = $items->sum('pinjaman_koperasi') + $items->sum('potongan_lain_1') + $items->sum('potongan_lain_2');
            $companyThp = $items->sum('gaji_bersih');
            
            foreach($items as $item) {
                // Pokok + Jabatan + Kehadiran + Transportasi
                $companyTotalInc += ($item->gaji_pokok + $item->tunjangan_jabatan + $item->tunjangan_kehadiran + $item->tunjangan_transportasi);
            }
        @endphp

        <div class="company-section">
            <div class="company-header">{{ $companyName }} ({{ count($items) }} Karyawan)</div>
            
            <table>
                <thead>
                    <tr>
                        <th style="width: 3%;">No</th>
                        <th style="width: 14%;">Nama Karyawan</th>
                        <th style="width: 9%;">Total Income</th>
                        <th style="width: 7%;">Uang Makan</th>
                        <th style="width: 7%;">Lembur</th>
                        <th style="width: 7%;">THR</th>
                        <th style="width: 7%; background-color: #fef08a;">BPJS TK Pers</th>
                        <th style="width: 7%; background-color: #fef08a;">BPJS Kes Pers</th>
                        <th style="width: 7%; background-color: #fecaca;">BPJS TK Kar</th>
                        <th style="width: 7%; background-color: #fecaca;">BPJS Kes Kar</th>
                        <th style="width: 7%; background-color: #fca5a5;">PPh21</th>
                        <th style="width: 8%; background-color: #fecaca;">Pot. Lainnya</th>
                        <th style="width: 10%; background-color: #bfdbfe;">Take Home Pay</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($items as $index => $item)
                        @php
                            $inc = $item->gaji_pokok + $item->tunjangan_jabatan + $item->tunjangan_kehadiran + $item->tunjangan_transportasi;
                        @endphp
                        <tr>
                            <td style="text-align: center;">{{ $index + 1 }}</td>
                            <td class="text-left">{{ $item->employee->nama }}</td>
                            <td>{{ format_rupiah($inc) }}</td>
                            <td>{{ format_rupiah($item->uang_makan) }}</td>
                            <td>{{ format_rupiah($item->uang_lembur) }}</td>
                            <td>{{ format_rupiah($item->thr) }}</td>
                            <td style="background-color: #fef9c3;">{{ format_rupiah($item->iuran_bpjs_tk_perusahaan) }}</td>
                            <td style="background-color: #fef9c3;">{{ format_rupiah($item->iuran_bpjs_jkn_perusahaan) }}</td>
                            <td style="background-color: #fee2e2;">{{ format_rupiah($item->potongan_bpjs_tk) }}</td>
                            <td style="background-color: #fee2e2;">{{ format_rupiah($item->potongan_bpjs_jkn) }}</td>
                            <td style="background-color: #fecaca;">{{ format_rupiah($item->potongan_pph21) }}</td>
                            <td style="background-color: #fee2e2; font-weight: bold;">{{ format_rupiah($item->pinjaman_koperasi + $item->potongan_lain_1 + $item->potongan_lain_2) }}</td>
                            <td style="color: #1d4ed8; font-weight: bold; background-color: #eff6ff;">{{ format_rupiah($item->gaji_bersih) }}</td>
                        </tr>
                    @endforeach
                </tbody>
                <tfoot>
                    <tr class="total-row">
                        <td colspan="2" style="text-align: right;">TOTAL:</td>
                        <td>{{ format_rupiah($companyTotalInc) }}</td>
                        <td>{{ format_rupiah($companyMakan) }}</td>
                        <td>{{ format_rupiah($companyLembur) }}</td>
                        <td>{{ format_rupiah($companyThr) }}</td>
                        <td style="background-color: #fde047;">{{ format_rupiah($companyBpjsTkPers) }}</td>
                        <td style="background-color: #fde047;">{{ format_rupiah($companyBpjsKesPers) }}</td>
                        <td style="background-color: #fca5a5;">{{ format_rupiah($companyBpjsTkKar) }}</td>
                        <td style="background-color: #fca5a5;">{{ format_rupiah($companyBpjsKesKar) }}</td>
                        <td style="background-color: #f87171;">{{ format_rupiah($companyPph) }}</td>
                        <td style="background-color: #fca5a5;">{{ format_rupiah($companyPotLain) }}</td>
                        <td style="color: #1d4ed8; background-color: #93c5fd;">{{ format_rupiah($companyThp) }}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    @endforeach



    <div style="font-size: 9px; margin-top: 20px; color: #666; text-align: center;">
        Dokumen ini dihasilkan oleh sistem secara otomatis pada {{ date('d F Y H:i:s') }}.
    </div>

</body>
</html>
