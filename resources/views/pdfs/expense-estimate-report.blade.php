<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Estimasi Pengeluaran {{ $estimate->company->code }} - {{ $estimate->month }}/{{ $estimate->year }}</title>
    <style>
        body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0; color: #000; font-size: 11px; }
        .page { page-break-after: always; padding: 20px 30px; }
        .page:last-child { page-break-after: auto; }
        .title { text-align: center; font-size: 14px; font-weight: bold; margin-bottom: 5px; }
        .subtitle { text-align: center; font-size: 12px; margin-bottom: 3px; }
        .location-title { font-size: 13px; font-weight: bold; margin-bottom: 10px; padding: 5px 8px; background: #f0f0f0; border-left: 4px solid #333; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        th, td { border: 1px solid #333; padding: 4px 6px; text-align: left; }
        th { background: #e8e8e8; font-weight: bold; font-size: 10px; text-align: center; }
        td { font-size: 10px; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }
        .total-row { background: #f5f5f5; font-weight: bold; }
        .status-paid { color: green; }
        .status-pending { color: #666; }
        .status-next { color: #b8860b; }
        .summary { margin-top: 15px; }
        .meta { margin-bottom: 15px; font-size: 11px; }
    </style>
</head>
<body>
@php
    $months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
    $monthName = $months[$estimate->month - 1] ?? '';
    $grandTotal = $estimate->items->sum('nominal');
    $grandPaid = $estimate->items->sum('nominal_dibayarkan');
@endphp

@foreach($grouped as $locationName => $items)
<div class="page">
    <div class="title">ESTIMASI PENGELUARAN</div>
    <div class="subtitle">{{ $estimate->company->name }} — {{ $monthName }} {{ $estimate->year }}</div>
    <div class="meta" style="text-align: center; margin-bottom: 15px; color: #666;">Dicetak: {{ now()->format('d/m/Y H:i') }}</div>

    <div class="location-title">📍 {{ $locationName }}</div>

    @php
        $phases = $items->groupBy('fase_pembayaran')->sortKeys();
        $locTotal = 0;
        $locPaid = 0;
    @endphp

    @foreach($phases as $phaseName => $phaseItems)
    <div style="font-weight: bold; margin: 10px 0 5px 0; font-size: 11px;">{{ $phaseName }}</div>
    <table>
        <thead>
            <tr>
                <th style="width: 25px;">No</th>
                <th>Uraian Penggunaan</th>
                <th style="width: 80px;">Jatuh Tempo</th>
                <th style="width: 100px;">Nominal</th>
                <th style="width: 80px;">Tgl Bayar</th>
                <th style="width: 100px;">Dibayarkan</th>
                <th style="width: 100px;">Sisa</th>
                <th style="width: 60px;">Status</th>
                <th>Keterangan</th>
            </tr>
        </thead>
        <tbody>
            @php $phaseTotal = 0; $phasePaid = 0; @endphp
            @foreach($phaseItems as $idx => $item)
            @php
                $sisa = $item->nominal - $item->nominal_dibayarkan;
                $phaseTotal += $item->nominal;
                $phasePaid += $item->nominal_dibayarkan;
                $locTotal += $item->nominal;
                $locPaid += $item->nominal_dibayarkan;
            @endphp
            <tr>
                <td class="text-center">{{ $idx + 1 }}</td>
                <td>{{ $item->uraian_penggunaan }}</td>
                <td class="text-center">{{ $item->tanggal_jatuh_tempo ? $item->tanggal_jatuh_tempo->format('d/m/Y') : '-' }}</td>
                <td class="text-right">{{ number_format($item->nominal, 0, ',', '.') }}</td>
                <td class="text-center">{{ $item->tanggal_bayar ? $item->tanggal_bayar->format('d/m/Y') : '-' }}</td>
                <td class="text-right">{{ number_format($item->nominal_dibayarkan, 0, ',', '.') }}</td>
                <td class="text-right">{{ number_format($sisa, 0, ',', '.') }}</td>
                <td class="text-center {{ $item->status === 'Paid' ? 'status-paid' : ($item->status === 'Next Phase' ? 'status-next' : 'status-pending') }}">{{ $item->status }}</td>
                <td>{{ $item->keterangan ?? '-' }}</td>
            </tr>
            @endforeach
            <tr class="total-row">
                <td colspan="3" class="text-right">TOTAL {{ $phaseName }}</td>
                <td class="text-right">{{ number_format($phaseTotal, 0, ',', '.') }}</td>
                <td></td>
                <td class="text-right">{{ number_format($phasePaid, 0, ',', '.') }}</td>
                <td class="text-right">{{ number_format($phaseTotal - $phasePaid, 0, ',', '.') }}</td>
                <td colspan="2"></td>
            </tr>
        </tbody>
    </table>
    @endforeach

    <div style="margin-top: 20px;">
        <table style="width: 50%; margin-left: auto;">
            <tr class="total-row">
                <td class="text-right">GRAND TOTAL {{ $locationName }}</td>
                <td class="text-right" style="width: 100px;">{{ number_format($locTotal, 0, ',', '.') }}</td>
            </tr>
            <tr class="total-row">
                <td class="text-right">TOTAL DIBAYARKAN</td>
                <td class="text-right text-green-600">{{ number_format($locPaid, 0, ',', '.') }}</td>
            </tr>
            <tr class="total-row">
                <td class="text-right">SISA PEMBAYARAN</td>
                <td class="text-right text-red-600">{{ number_format($locTotal - $locPaid, 0, ',', '.') }}</td>
            </tr>
        </table>
    </div>
</div>
@endforeach
</body>
</html>
