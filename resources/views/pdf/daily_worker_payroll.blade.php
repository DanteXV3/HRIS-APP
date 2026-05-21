<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Daily Worker Payroll - {{ $payroll->workingLocation->name ?? 'Unknown' }}</title>
    <style>
        body { font-family: sans-serif; font-size: 10px; margin: 0; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h2 { margin: 0; padding: 0; }
        .header p { margin: 5px 0; color: #555; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
        th { background-color: #f4f4f5; font-weight: bold; text-transform: uppercase; font-size: 9px; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .footer { margin-top: 30px; width: 100%; }
        .signature-box { float: right; width: 200px; text-align: center; }
        .signature-line { margin-top: 60px; border-top: 1px solid #000; padding-top: 5px; }
        .text-red { color: #dc2626; }
        .text-green { color: #16a34a; }
    </style>
</head>
<body>
    <div class="header">
        <h2>DAILY WORKER PAYROLL</h2>
        <p>Location: {{ $payroll->workingLocation->name ?? 'Unknown' }}</p>
        <p>Period: {{ $payroll->periode_start->format('d M Y') }} - {{ $payroll->periode_end->format('d M Y') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Name / NIK</th>
                <th>Type</th>
                <th>Days Att. / Per.</th>
                <th>OT (Hrs)</th>
                <th>Gaji Pokok Total</th>
                <th>Uang Makan Total</th>
                <th>Tunj. Pajak (Gross Up)</th>
                <th class="text-red">PPh21</th>
                <th class="text-red">BPJS TK</th>
                <th class="text-red">BPJS KS</th>
                <th class="text-red">Total Potongan</th>
                <th class="text-right">Gaji Bersih</th>
            </tr>
        </thead>
        <tbody>
            @php
                $sumGajiPokok = 0;
                $sumUangMakan = 0;
                $sumTunjPajak = 0;
                $sumPph21 = 0;
                $sumBpjsTk = 0;
                $sumBpjsKs = 0;
                $sumPotongan = 0;
                $sumBersih = 0;
            @endphp
            @foreach($payroll->items as $index => $item)
                @php
                    $sumGajiPokok += $item->gaji_pokok_total;
                    $sumUangMakan += $item->uang_makan_total;
                    $sumTunjPajak += $item->tunjangan_pajak;
                    $sumPph21 += $item->potongan_pph21;
                    $sumBpjsTk += $item->potongan_bpjs_tk;
                    $sumBpjsKs += $item->potongan_bpjs_ks;
                    $sumPotongan += $item->total_potongan;
                    $sumBersih += $item->gaji_bersih;
                @endphp
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>
                        <strong>{{ $item->worker_name }}</strong><br>
                        <span style="color:#777; font-size:8px;">{{ $item->worker_nik }}</span>
                    </td>
                    <td style="text-transform: capitalize;">{{ $item->tipe_dw }}</td>
                    <td class="text-center">{{ $item->days_attended }} / {{ $item->days_period }}</td>
                    <td class="text-center">{{ $item->lembur_hours }}</td>
                    <td class="text-right">{{ number_format($item->gaji_pokok_total, 0, ',', '.') }}</td>
                    <td class="text-right">{{ number_format($item->uang_makan_total, 0, ',', '.') }}</td>
                    <td class="text-right text-green">{{ number_format($item->tunjangan_pajak, 0, ',', '.') }}</td>
                    <td class="text-right text-red">{{ number_format($item->potongan_pph21, 0, ',', '.') }}</td>
                    <td class="text-right text-red">{{ number_format($item->potongan_bpjs_tk, 0, ',', '.') }}</td>
                    <td class="text-right text-red">{{ number_format($item->potongan_bpjs_ks, 0, ',', '.') }}</td>
                    <td class="text-right text-red">{{ number_format($item->total_potongan, 0, ',', '.') }}</td>
                    <td class="text-right" style="font-weight:bold;">{{ number_format($item->gaji_bersih, 0, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr style="font-weight: bold; background-color: #f4f4f5;">
                <td colspan="5" class="text-right">TOTAL</td>
                <td class="text-right">{{ number_format($sumGajiPokok, 0, ',', '.') }}</td>
                <td class="text-right">{{ number_format($sumUangMakan, 0, ',', '.') }}</td>
                <td class="text-right text-green">{{ number_format($sumTunjPajak, 0, ',', '.') }}</td>
                <td class="text-right text-red">{{ number_format($sumPph21, 0, ',', '.') }}</td>
                <td class="text-right text-red">{{ number_format($sumBpjsTk, 0, ',', '.') }}</td>
                <td class="text-right text-red">{{ number_format($sumBpjsKs, 0, ',', '.') }}</td>
                <td class="text-right text-red">{{ number_format($sumPotongan, 0, ',', '.') }}</td>
                <td class="text-right">{{ number_format($sumBersih, 0, ',', '.') }}</td>
            </tr>
        </tfoot>
    </table>

    <div class="footer">
        <div class="signature-box">
            <p>Processed By,</p>
            <div class="signature-line">
                {{ $payroll->processor->name ?? 'Admin' }}<br>
                {{ $payroll->tanggal_proses ? \Carbon\Carbon::parse($payroll->tanggal_proses)->format('d M Y') : now()->format('d M Y') }}
            </div>
        </div>
        <div style="clear: both;"></div>
    </div>
</body>
</html>
