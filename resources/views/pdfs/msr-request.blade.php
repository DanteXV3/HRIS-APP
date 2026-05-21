<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>MSR - {{ $msr->msr_number }}</title>
    <style>
        @page { margin: 0; size: A4 landscape; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Helvetica Neue', 'Helvetica', Arial, sans-serif; 
            font-size: 9px; 
            color: #1a1a1a; 
            line-height: 1.2; 
            padding: 1cm 1cm;
        }

        .letterhead { 
            text-align: center; 
            margin-bottom: 8px; 
            border-bottom: 2px solid #1e3a5f; 
            padding-bottom: 6px; 
        }
        .letterhead img {
            max-width: 100%;
            max-height: 55px;
            object-fit: contain;
        }
        .letterhead .doc-title {
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #1e3a5f;
            margin-top: 4px;
        }

        .msr-row {
            width: 100%;
            margin-bottom: 6px;
        }
        .msr-row td {
            padding: 2px 0;
            font-size: 9px;
        }
        .msr-no {
            font-weight: bold;
            font-size: 10px;
            color: #1e3a5f;
        }
        .msr-date {
            text-align: right;
            color: #555;
        }

        .info-grid { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 8px; 
            border: 1px solid #d1d5db;
        }
        .info-grid td { 
            padding: 3px 6px; 
            border: 1px solid #d1d5db; 
            font-size: 8px;
        }
        .info-label { 
            width: 120px; 
            font-weight: bold; 
            background: #f3f4f6; 
            color: #374151; 
            text-transform: uppercase;
            font-size: 7px;
            letter-spacing: 0.5px;
        }

        .items-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 8px; 
        }
        .items-table th { 
            background: #1e3a5f; 
            color: white; 
            padding: 4px 6px; 
            font-size: 7px; 
            text-transform: uppercase; 
            border: 1px solid #1e3a5f;
            font-weight: bold;
        }
        .items-table td { 
            padding: 3px 6px; 
            border: 1px solid #d1d5db; 
            font-size: 8px; 
        }
        .items-table tr:nth-child(even) { background: #f9fafb; }
        .total-row { 
            background: #eef2ff !important; 
            font-weight: bold; 
        }
        .total-row td { 
            border-top: 2px solid #1e3a5f; 
            padding: 5px 6px;
            font-size: 9px;
        }

        .sig-section { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 10px;
        }
        .sig-box { 
            border: 1px solid #9ca3af; 
            width: 20%; 
            height: 85px; 
            text-align: center; 
            vertical-align: bottom; 
            padding: 2px; 
        }
        .sig-title { 
            font-size: 7px; 
            font-weight: bold;
            text-transform: uppercase;
            color: #374151;
            background: #f3f4f6;
            padding: 2px 0;
            border-bottom: 1px solid #d1d5db;
            display: block;
            margin-bottom: 4px;
        }
        .sig-img { 
            max-height: 35px; 
            max-width: 60px; 
            display: block; 
            margin: 0 auto 2px; 
            mix-blend-multiply;
        }
        .sig-name { 
            font-size: 7px; 
            font-weight: bold; 
            line-height: 1;
        }
        .sig-date { 
            font-size: 6px; 
            color: #6b7280;
        }

        .footer-note { 
            font-size: 6px; 
            color: #9ca3af; 
            margin-top: 6px; 
            text-align: center;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="letterhead">
        @if($msr->company->header_image)
            <img src="{{ public_path('storage/' . $msr->company->header_image) }}">
        @elseif($msr->company->logo)
            <img src="{{ public_path('storage/' . $msr->company->logo) }}">
        @else
            <div style="font-size: 14px; font-weight: bold; text-transform: uppercase; color: #1e3a5f;">{{ $msr->company->name }}</div>
        @endif
        <div class="doc-title">Material & Service Request (MSR)</div>
    </div>

    <table class="msr-row">
        <tr>
            <td class="msr-no">No: {{ $msr->msr_number }}</td>
            <td class="msr-date">Tanggal: {{ \Carbon\Carbon::parse($msr->date)->format('d F Y') }}</td>
        </tr>
    </table>

    <table class="info-grid">
        <tr>
            <td class="info-label">Department</td>
            <td style="width: 30%">{{ $msr->department->name }}</td>
            <td class="info-label">Penempatan</td>
            <td style="width: 30%">{{ $msr->workLocation->name }}</td>
        </tr>
        <tr>
            <td class="info-label">Subject / Route</td>
            <td>{{ $msr->subject }}</td>
            <td class="info-label">Total Estimasi</td>
            <td style="font-weight: bold; color: #1e3a5f;">Rp {{ number_format($msr->total_amount, 0, ',', '.') }}</td>
        </tr>
        <tr>
            <td class="info-label">Description</td>
            <td colspan="3">{{ $msr->description }}</td>
        </tr>
        @if($msr->notes)
        <tr>
            <td class="info-label">Additional Notes</td>
            <td colspan="3" style="font-style: italic; color: #6b7280;">{{ $msr->notes }}</td>
        </tr>
        @endif
    </table>

    <table class="items-table">
        <thead>
            <tr>
                <th style="width: 3%;">#</th>
                <th style="width: 8%;">Cat.</th>
                <th style="width: 30%; text-align: left;">Item Name / Description</th>
                <th style="width: 15%; text-align: left;">Material / Grade</th>
                <th style="width: 10%;">Size</th>
                <th style="width: 5%;">Unit</th>
                <th style="width: 7%; text-align: right;">Qty</th>
                <th style="width: 10%; text-align: right;">Price (IDR)</th>
                <th style="width: 12%; text-align: right;">Total (IDR)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($msr->items as $idx => $item)
            <tr>
                <td style="text-align: center;">{{ $idx + 1 }}</td>
                <td style="text-align: center; font-weight: bold; color: #1e3a5f; font-size: 7px;">{{ strtoupper($item->category) }}</td>
                <td>
                    <div style="font-weight: bold;">{{ $item->item_name }}</div>
                    @if($item->keterangan) <div style="font-size: 7px; color: #6b7280;">{{ $item->keterangan }}</div> @endif
                </td>
                <td>{{ $item->material }}</td>
                <td style="text-align: center;">{{ $item->size }}</td>
                <td style="text-align: center;">{{ $item->unit }}</td>
                <td style="text-align: right;">{{ number_format($item->qty, 2, ',', '.') }}</td>
                <td style="text-align: right;">{{ number_format($item->price, 0, ',', '.') }}</td>
                <td style="text-align: right; font-weight: bold;">{{ number_format($item->total_price, 0, ',', '.') }}</td>
            </tr>
            @endforeach
            <tr class="total-row">
                <td colspan="8" style="text-align: right; color: #1e3a5f;">GRAND TOTAL ESTIMASI</td>
                <td style="text-align: right; color: #1e3a5f;">Rp {{ number_format($msr->total_amount, 0, ',', '.') }}</td>
            </tr>
        </tbody>
    </table>

    <table class="sig-section">
        <tr>
            <td class="sig-box">
                <span class="sig-title">Requested By</span>
                @if($msr->requester_signature_snapshot)
                    <img src="{{ public_path('storage/' . $msr->requester_signature_snapshot) }}" class="sig-img">
                @endif
                <div class="sig-name">{{ $msr->requestedBy->nama }}</div>
                <div class="sig-date">{{ \Carbon\Carbon::parse($msr->requested_at)->format('d/m/y H:i') }}</div>
            </td>

            <td class="sig-box">
                <span class="sig-title">Supervisor / Site Mgr</span>
                @if($msr->supervisor_status === 'approved' && $msr->supervisor_signature_snapshot)
                    <img src="{{ public_path('storage/' . $msr->supervisor_signature_snapshot) }}" class="sig-img">
                    <div class="sig-name">{{ $msr->supervisorApprover->nama }}</div>
                    <div class="sig-date">{{ \Carbon\Carbon::parse($msr->supervisor_approved_at)->format('d/m/y H:i') }}</div>
                @elseif($msr->supervisor_status === 'rejected')
                    <div style="padding-bottom: 20px; color: #ef4444; font-weight: bold;">REJECTED</div>
                @endif
            </td>

            <td class="sig-box">
                <span class="sig-title">General Manager</span>
                @if($msr->manager_status === 'approved' && $msr->manager_signature_snapshot)
                    <img src="{{ public_path('storage/' . $msr->manager_signature_snapshot) }}" class="sig-img">
                    <div class="sig-name">{{ $msr->managerApprover->nama }}</div>
                    <div class="sig-date">{{ \Carbon\Carbon::parse($msr->manager_approved_at)->format('d/m/y H:i') }}</div>
                @elseif($msr->manager_status === 'rejected')
                    <div style="padding-bottom: 20px; color: #ef4444; font-weight: bold;">REJECTED</div>
                @endif
            </td>

            <td class="sig-box">
                <span class="sig-title">PR Maker (Dept)</span>
                @if($msr->pr_maker_status === 'approved' && $msr->pr_maker_signature_snapshot)
                    <img src="{{ public_path('storage/' . $msr->pr_maker_signature_snapshot) }}" class="sig-img">
                    <div class="sig-name">{{ $msr->prMakerApprover->nama }}</div>
                    <div class="sig-date">{{ \Carbon\Carbon::parse($msr->pr_maker_approved_at)->format('d/m/y H:i') }}</div>
                @elseif($msr->pr_maker_status === 'rejected')
                    <div style="padding-bottom: 20px; color: #ef4444; font-weight: bold;">REJECTED</div>
                @endif
            </td>

            <td class="sig-box">
                <span class="sig-title">Finance</span>
                @if($msr->finance_status === 'approved' && $msr->finance_signature_snapshot)
                    <img src="{{ public_path('storage/' . $msr->finance_signature_snapshot) }}" class="sig-img">
                    <div class="sig-name">{{ $msr->financeApprover->nama }}</div>
                    <div class="sig-date">{{ \Carbon\Carbon::parse($msr->finance_approved_at)->format('d/m/y H:i') }}</div>
                @elseif($msr->finance_status === 'rejected')
                    <div style="padding-bottom: 20px; color: #ef4444; font-weight: bold;">REJECTED</div>
                @endif
            </td>
        </tr>
    </table>

    <div class="footer-note">
        This document is electronically generated and signed &bull; {{ config('app.name') }} &bull; {{ now()->format('d/m/Y H:i') }}
    </div>
</body>
</html>
