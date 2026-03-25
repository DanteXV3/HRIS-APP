<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Payment Request - {{ $pr->pr_number }}</title>
    <style>
        @page { margin: 18mm 15mm 15mm 15mm; size: A4 landscape; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Helvetica Neue', 'Helvetica', Arial, sans-serif; 
            font-size: 10px; 
            color: #1a1a1a; 
            line-height: 1.3; 
        }

        /* === HEADER (Letterhead) === */
        .letterhead { 
            text-align: center; 
            margin-bottom: 10px; 
            border-bottom: 2px solid #333; 
            padding-bottom: 8px; 
        }
        .letterhead img {
            max-width: 100%;
            max-height: 65px;
            object-fit: contain;
        }
        .letterhead .doc-title {
            font-size: 13px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #1e3a5f;
            margin-top: 6px;
        }

        /* === PR NUMBER ROW === */
        .pr-row {
            width: 100%;
            margin-bottom: 8px;
        }
        .pr-row td {
            padding: 4px 0;
            font-size: 10px;
        }
        .pr-row .pr-no {
            font-weight: bold;
            font-size: 11px;
            color: #1e3a5f;
        }
        .pr-row .pr-date {
            text-align: right;
            color: #555;
        }

        /* === INFO GRID === */
        .info-grid { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 10px; 
            border: 1px solid #d1d5db;
        }
        .info-grid td { 
            padding: 4px 8px; 
            border: 1px solid #d1d5db; 
            font-size: 9px;
        }
        .info-grid .info-label { 
            width: 100px; 
            font-weight: bold; 
            background: #f3f4f6; 
            color: #374151; 
            text-transform: uppercase;
            font-size: 8px;
            letter-spacing: 0.5px;
        }

        /* === ITEMS TABLE === */
        .items-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 8px; 
        }
        .items-table th { 
            background: #1e3a5f; 
            color: white; 
            padding: 5px 8px; 
            font-size: 8px; 
            text-transform: uppercase; 
            letter-spacing: 0.5px;
            font-weight: 600;
            border: 1px solid #1e3a5f;
        }
        .items-table td { 
            padding: 4px 8px; 
            border: 1px solid #d1d5db; 
            font-size: 9px; 
        }
        .items-table tr:nth-child(even) { background: #f9fafb; }
        .items-table .total-row { 
            background: #eef2ff !important; 
            font-weight: bold; 
        }
        .items-table .total-row td { 
            border-top: 2px solid #1e3a5f; 
            padding: 6px 8px;
            font-size: 10px;
        }

        /* === SIGNATURE GRID === */
        .sig-section { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 15px;
        }
        .sig-box { 
            border: 1px solid #9ca3af; 
            width: 11.11%; 
            height: 95px; 
            text-align: center; 
            vertical-align: bottom; 
            padding: 3px; 
        }
        .sig-box .sig-title { 
            font-size: 7px; 
            font-weight: bold;
            text-transform: uppercase;
            color: #374151;
            background: #f3f4f6;
            padding: 3px 0;
            border-bottom: 1px solid #d1d5db;
            letter-spacing: 0.5px;
            display: block;
        }
        .sig-img { 
            max-height: 38px; 
            max-width: 65px; 
            display: block; 
            margin: 4px auto 2px; 
        }
        .sig-name { 
            font-size: 7px; 
            font-weight: bold; 
            line-height: 1.1;
        }
        .sig-date { 
            font-size: 6px; 
            color: #6b7280;
        }

        .footer-note { 
            font-size: 7px; 
            color: #9ca3af; 
            margin-top: 8px; 
            text-align: center;
            font-style: italic;
        }
    </style>
</head>
<body>
    {{-- ======== LETTERHEAD ======== --}}
    <div class="letterhead">
        @if($pr->company->header_image)
            <img src="{{ public_path('storage/' . $pr->company->header_image) }}">
        @elseif($pr->company->logo)
            <img src="{{ public_path('storage/' . $pr->company->logo) }}">
        @else
            <div style="font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #1e3a5f;">{{ $pr->company->name }}</div>
        @endif
        <div class="doc-title">Payment Request</div>
    </div>

    {{-- ======== PR NUMBER & DATE ======== --}}
    <table class="pr-row" cellpadding="0" cellspacing="0">
        <tr>
            <td class="pr-no">No: {{ $pr->pr_number }}</td>
            <td class="pr-date">Tanggal: {{ \Carbon\Carbon::parse($pr->date)->format('d F Y') }}</td>
        </tr>
    </table>

    {{-- ======== INFO GRID ======== --}}
    <table class="info-grid">
        <tr>
            <td class="info-label">Department</td>
            <td style="width: 30%">{{ $pr->department->name }}</td>
            <td class="info-label">Penempatan</td>
            <td style="width: 30%">{{ $pr->workLocation->name }}</td>
        </tr>
        <tr>
            <td class="info-label">Subject</td>
            <td>{{ $pr->subject }}</td>
            <td class="info-label">Paid To</td>
            <td>
                {{ $pr->paid_to }}
                @if($pr->bank_name)
                    <span style="color: #6b7280;">({{ $pr->bank_name }}{{ $pr->bank_account ? ' - '.$pr->bank_account : '' }})</span>
                @endif
            </td>
        </tr>
        @if($pr->description)
        <tr>
            <td class="info-label">Description</td>
            <td colspan="3">{{ $pr->description }}</td>
        </tr>
        @endif
        @if($pr->notes)
        <tr>
            <td class="info-label">Notes</td>
            <td colspan="3" style="font-style: italic; color: #6b7280;">{{ $pr->notes }}</td>
        </tr>
        @endif
    </table>

    {{-- ======== ITEMS TABLE ======== --}}
    <table class="items-table">
        <thead>
            <tr>
                <th style="width: 5%; text-align: center;">#</th>
                <th style="width: 40%; text-align: left;">Description</th>
                <th style="width: 10%; text-align: center;">Unit</th>
                <th style="width: 10%; text-align: right;">Qty</th>
                <th style="width: 15%; text-align: right;">Price (IDR)</th>
                <th style="width: 20%; text-align: right;">Total (IDR)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($pr->items as $idx => $item)
            <tr>
                <td style="text-align: center;">{{ $idx + 1 }}</td>
                <td>{{ $item->description }}</td>
                <td style="text-align: center;">{{ $item->unit ?? 'Pcs' }}</td>
                <td style="text-align: right;">{{ number_format($item->qty, 0, ',', '.') }}</td>
                <td style="text-align: right;">{{ number_format($item->price, 0, ',', '.') }}</td>
                <td style="text-align: right;">{{ number_format($item->amount, 0, ',', '.') }}</td>
            </tr>
            @endforeach
            <tr class="total-row">
                <td colspan="5" style="text-align: right; color: #1e3a5f;">TOTAL</td>
                <td style="text-align: right; color: #2563eb;">Rp {{ number_format($pr->amount, 0, ',', '.') }}</td>
            </tr>
        </tbody>
    </table>

    {{-- ======== SIGNATURE SECTION ======== --}}
    <table class="sig-section">
        <tr>
            <td class="sig-box">
                <span class="sig-title">Prepared By</span>
                @if($pr->requester_signature_snapshot)
                    <img src="{{ public_path('storage/' . $pr->requester_signature_snapshot) }}" class="sig-img">
                @else
                    <div style="height: 38px;"></div>
                @endif
                <div class="sig-name">{{ $pr->requestedBy->nama }}</div>
                <div class="sig-date">{{ \Carbon\Carbon::parse($pr->requested_at)->format('d/m/y H:i') }}</div>
            </td>

            @php
                $approvals = [
                    ['label' => 'Tax', 'status' => $pr->tax_status, 'approver' => $pr->taxApprover, 'date' => $pr->tax_approved_at, 'sig' => $pr->tax_signature_snapshot],
                    ['label' => 'Accounting', 'status' => $pr->accounting_status, 'approver' => $pr->accountingApprover, 'date' => $pr->accounting_approved_at, 'sig' => $pr->accounting_signature_snapshot],
                    ['label' => 'Cost Control', 'status' => $pr->cost_control_status, 'approver' => $pr->costControlApprover, 'date' => $pr->cost_control_approved_at, 'sig' => $pr->cost_control_signature_snapshot],
                    ['label' => 'Head Branch', 'status' => $pr->head_branch_status, 'approver' => $pr->headBranchApprover, 'date' => $pr->head_branch_approved_at, 'sig' => $pr->head_branch_signature_snapshot],
                    ['label' => 'Director', 'status' => $pr->director_status, 'approver' => $pr->directorApprover, 'date' => $pr->director_approved_at, 'sig' => $pr->director_signature_snapshot],
                    ['label' => 'Commissioner', 'status' => $pr->commissioner_status, 'approver' => $pr->commissionerApprover, 'date' => $pr->commissioner_approved_at, 'sig' => $pr->commissioner_signature_snapshot],
                    ['label' => 'Advisor', 'status' => $pr->advisor_status, 'approver' => $pr->advisorApprover, 'date' => $pr->advisor_approved_at, 'sig' => $pr->advisor_signature_snapshot],
                    ['label' => 'Finance', 'status' => $pr->finance_status, 'approver' => $pr->financeApprover, 'date' => $pr->finance_approved_at, 'sig' => $pr->finance_signature_snapshot],
                ];
            @endphp

            @foreach($approvals as $app)
                <td class="sig-box">
                    <span class="sig-title">{{ $app['label'] }}</span>
                    @if($app['status'] === 'approved' && $app['sig'])
                        <img src="{{ public_path('storage/' . $app['sig']) }}" class="sig-img">
                        <div class="sig-name">{{ $app['approver']->nama }}</div>
                        <div class="sig-date">{{ \Carbon\Carbon::parse($app['date'])->format('d/m/y H:i') }}</div>
                    @elseif($app['status'] === 'skipped')
                        <div style="height: 38px; padding-top: 12px; font-style: italic; color: #9ca3af; font-size: 7px;">SKIPPED</div>
                    @elseif($app['status'] === 'rejected')
                        <div style="height: 38px; padding-top: 12px; color: #ef4444; font-weight: bold; font-size: 8px;">REJECTED</div>
                    @else
                        <div style="height: 38px;"></div>
                    @endif
                </td>
            @endforeach
        </tr>
    </table>

    <div class="footer-note">
        This document is electronically generated and signed &bull; {{ config('app.name') }} &bull; {{ now()->format('d/m/Y H:i') }}
    </div>
</body>
</html>
