<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>SPPD {{ $sppd->letter_number }}</title>
    <style>
        body {
            font-family: "Times New Roman", Times, serif;
            margin: 0;
            padding: 0;
            color: #000;
            font-size: 11px;
            line-height: 1.3;
        }

        .header {
            width: 100%;
            margin-bottom: 15px;
        }

        .header-image {
            width: 100%;
            max-height: 100px;
            object-fit: contain;
        }

        .content {
            margin: 0 30px;
            padding: 5px 15px;
        }

        .title {
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            text-decoration: underline;
            margin-bottom: 2px;
            text-transform: uppercase;
        }

        .subtitle {
            text-align: center;
            font-size: 11px;
            margin-bottom: 20px;
        }

        .table-info {
            width: 100%;
            margin-bottom: 15px;
        }

        .table-info td {
            vertical-align: top;
            padding: 2px 0;
        }

        .col-label {
            width: 160px;
        }

        .col-colon {
            width: 10px;
            text-align: center;
        }

        .itinerary-title {
            font-weight: bold;
            margin-top: 15px;
            margin-bottom: 8px;
            text-decoration: underline;
        }

        table.itinerary {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }

        table.itinerary th, table.itinerary td {
            border: 1px solid #000;
            padding: 4px 6px;
            text-align: left;
        }

        table.itinerary th {
            background-color: #f2f2f2;
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .text-center {
            text-align: center;
        }

        .signature-grid {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            table-layout: fixed;
        }

        .signature-grid td {
            border: 1px solid #000;
            height: 55px;
            vertical-align: middle;
            text-align: center;
            padding: 0;
        }

        .signature-label {
            font-weight: bold;
            border-top: 1px solid #000;
            padding: 2px 0;
            background-color: #f9f9f9;
            font-size: 10px;
        }

        .signature-box-content {
            height: 40px;
        }
    </style>
</head>
<body>

    @php
        $company = $sppd->workLocation ?? $sppd->maker->workLocation;
        $companyName = $company ? $company->name : 'Perusahaan';
        
        $allEmployeeNames = $sppd->employees->pluck('nama')->toArray();
        if ($sppd->external_employees) {
            $allEmployeeNames = array_merge($allEmployeeNames, $sppd->external_employees);
        }

        $allEmployeePositions = $sppd->employees->map(fn($e) => $e->position?->name ?? '-')->toArray();
        if ($sppd->external_employees) {
            foreach($sppd->external_employees as $ext) {
                $allEmployeePositions[] = 'External';
            }
        }
    @endphp

    @if($company && $company->header_image)
    <div class="header">
        <img src="{{ storage_path('app/public/' . $company->header_image) }}" class="header-image" alt="Header Kop Surat">
    </div>
    @endif

    <div class="content">
        <div class="title">SURAT PERINTAH PERJALANAN DINAS (SPPD)</div>
        <div class="subtitle">Nomor : {{ $sppd->letter_number }}</div>

        <table class="table-info">
            <tr>
                <td class="col-label">Yang Ditugaskan</td>
                <td class="col-colon">:</td>
                <td style="font-weight: bold;">
                    {{ implode(', ', $allEmployeeNames) }}
                </td>
            </tr>
            <tr>
                <td class="col-label">Jabatan</td>
                <td class="col-colon">:</td>
                <td>
                    {{ implode(', ', $allEmployeePositions) }}
                </td>
            </tr>
            <tr>
                <td class="col-label">Tujuan Perjalanan</td>
                <td class="col-colon">:</td>
                <td>{{ $sppd->tujuan }}</td>
            </tr>
            <tr>
                <td class="col-label">Maksud Perjalanan Dinas</td>
                <td class="col-colon">:</td>
                <td>{{ $sppd->maksud_perjalanan_dinas }}</td>
            </tr>
            <tr>
                <td class="col-label">Tanggal Berangkat</td>
                <td class="col-colon">:</td>
                <td>{{ $sppd->tanggal_berangkat->translatedFormat('d F Y') }}</td>
            </tr>
            <tr>
                <td class="col-label">Tanggal Kembali</td>
                <td class="col-colon">:</td>
                <td>{{ $sppd->tanggal_kembali->translatedFormat('d F Y') }}</td>
            </tr>
            <tr>
                <td class="col-label">Atas Permintaan</td>
                <td class="col-colon">:</td>
                <td>{{ $sppd->requester->nama }} ({{ $sppd->requester->position?->name ?? '-' }})</td>
            </tr>
        </table>

        @if($sppd->items->count() > 0)
            <div class="itinerary-title">RINCIAN BIAYA (ITINERARY)</div>
            <table class="itinerary">
                <thead>
                    <tr>
                        <th style="width: 25%;">Hal</th>
                        <th>Deskripsi</th>
                        <th style="width: 10%;">Qty</th>
                        <th style="width: 15%;">Harga</th>
                        <th style="width: 20%;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($sppd->items as $item)
                        <tr>
                            <td>{{ $item->hal }}</td>
                            <td>{{ $item->description }}</td>
                            <td class="text-center">{{ $item->qty }}</td>
                            <td class="text-right">{{ number_format($item->price, 0, ',', '.') }}</td>
                            <td class="text-right">{{ number_format($item->total_price, 0, ',', '.') }}</td>
                        </tr>
                    @endforeach
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="4" class="text-right" style="font-weight: bold;">GRAND TOTAL</td>
                        <td class="text-right" style="font-weight: bold;">Rp {{ number_format($sppd->total_amount, 0, ',', '.') }}</td>
                    </tr>
                </tfoot>
            </table>
        @endif

        <div style="text-align: right; margin-top: 15px; margin-bottom: 5px;">
            {{ $company->address ?? 'Jakarta' }}, {{ now()->translatedFormat('d F Y') }}
        </div>

        <table class="signature-grid">
            <tr>
                <td>
                    <div class="signature-box-content"></div>
                    <div class="signature-label">Dibuat Oleh</div>
                </td>
                <td>
                    <div class="signature-box-content"></div>
                    <div class="signature-label">Penerima Tugas</div>
                </td>
                <td>
                    <div class="signature-box-content"></div>
                    <div class="signature-label">Mengetahui</div>
                </td>
            </tr>
        </table>

        <table class="signature-grid" style="margin-top: -1px;">
            <tr>
                <td>
                    <div class="signature-box-content"></div>
                    <div class="signature-label">HR Officer</div>
                </td>
                <td>
                    <div class="signature-box-content"></div>
                    <div class="signature-label">Finance Officer</div>
                </td>
                <td style="border: none;"></td>
            </tr>
        </table>

        <table class="signature-grid" style="margin-top: -1px;">
            <tr>
                <td>
                    <div class="signature-box-content"></div>
                    <div class="signature-label">Director</div>
                </td>
                <td>
                    <div class="signature-box-content"></div>
                    <div class="signature-label">Commissioner</div>
                </td>
                <td>
                    <div class="signature-box-content"></div>
                    <div class="signature-label">Advisor</div>
                </td>
            </tr>
        </table>
    </div>

</body>
</html>
