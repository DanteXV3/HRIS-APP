<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Budget Summary Report - {{ $workingLocation->name }}</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 10px; color: #333; margin: 0; padding: 0; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #4f46e5; padding-bottom: 10px; }
        .header h1 { color: #4f46e5; margin: 0; font-size: 20px; text-transform: uppercase; }
        .header p { margin: 5px 0 0; color: #666; font-size: 12px; }
        
        .info-section { margin-bottom: 20px; width: 100%; }
        .info-table { width: 100%; border-collapse: collapse; }
        .info-table td { padding: 4px 0; vertical-align: top; }
        .label { font-weight: bold; width: 120px; color: #4f46e5; }
        
        .summary-stats { margin-bottom: 20px; width: 100%; border-collapse: collapse; }
        .summary-stats td { padding: 10px; border: 1px solid #e5e7eb; background: #f9fafb; text-align: center; }
        .stat-label { font-size: 8px; color: #6b7280; text-transform: uppercase; margin-bottom: 4px; font-weight: bold; }
        .stat-value { font-size: 14px; font-weight: bold; color: #111827; }

        table.main-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        table.main-table th { background-color: #4f46e5; color: white; padding: 8px 4px; text-align: left; font-size: 9px; text-transform: uppercase; }
        table.main-table td { border-bottom: 1px solid #e5e7eb; padding: 8px 4px; vertical-align: top; }
        
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }
        
        .over-budget { color: #dc2626; font-weight: bold; }
        .warning { color: #d97706; }
        
        .footer { position: fixed; bottom: 20px; width: 100%; text-align: right; font-size: 8px; color: #9ca3af; }
        .page-number:after { content: counter(page); }

        .item-row:nth-child(even) { background-color: #fcfcfc; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Budget Summary Report</h1>
        <p>Project: <strong>{{ $workingLocation->name }}</strong></p>
    </div>

    <table class="info-table">
        <tr>
            <td class="label">Generated Date:</td>
            <td>{{ $generatedAt }}</td>
            <td class="label" style="text-align: right;">Currency:</td>
            <td style="text-align: right;">IDR</td>
        </tr>
    </table>

    <table class="summary-stats">
        <tr>
            <td>
                <div class="stat-label">Total Material Budget</div>
                <div class="stat-value">{{ number_format($summary->sum('nilai_budget_material'), 0, ',', '.') }}</div>
            </td>
            <td>
                <div class="stat-label">Total Material Used</div>
                <div class="stat-value" style="color: #4f46e5;">{{ number_format($summary->sum('nilai_msr_material'), 0, ',', '.') }}</div>
            </td>
            <td>
                <div class="stat-label">Total Service Budget</div>
                <div class="stat-value">{{ number_format($summary->sum('nilai_budget_jasa'), 0, ',', '.') }}</div>
            </td>
            <td>
                <div class="stat-label">Total Service Used</div>
                <div class="stat-value" style="color: #4f46e5;">{{ number_format($summary->sum('nilai_msr_jasa'), 0, ',', '.') }}</div>
            </td>
            <td>
                <div class="stat-label">Total Savings/Overrun</div>
                @php
                    $totalBudget = $summary->sum('nilai_budget_material') + $summary->sum('nilai_budget_jasa');
                    $totalUsed = $summary->sum('nilai_msr_material') + $summary->sum('nilai_msr_jasa');
                    $diff = $totalBudget - $totalUsed;
                @endphp
                <div class="stat-value" style="color: {{ $diff >= 0 ? '#059669' : '#dc2626' }};">
                    {{ number_format($diff, 0, ',', '.') }}
                </div>
            </td>
        </tr>
    </table>

    <table class="main-table">
        <thead>
            <tr>
                <th>Item Code</th>
                <th>Item Name</th>
                <th class="text-right">Unit</th>
                <th class="text-right">B. Qty</th>
                <th class="text-right">U. Qty</th>
                <th class="text-right">S. Qty</th>
                <th class="text-right">B. Mat</th>
                <th class="text-right">U. Mat</th>
                <th class="text-right">B. Jasa</th>
                <th class="text-right">U. Jasa</th>
                <th class="text-center">Usage %</th>
            </tr>
        </thead>
        <tbody>
            @foreach($summary as $item)
            @php
                $totalB = (float)$item->nilai_budget_material + (float)$item->nilai_budget_jasa;
                $totalU = (float)$item->nilai_msr_material + (float)$item->nilai_msr_jasa;
                $usageP = $totalB > 0 ? ($totalU / $totalB) * 100 : 0;
                $qtyUsageP = (float)$item->qty_budget > 0 ? ((float)$item->qty_material_terpakai / (float)$item->qty_budget) * 100 : 0;
                $maxUsage = max($usageP, $qtyUsageP);
                
                $statusColor = '#333';
                if ($maxUsage >= 100) $statusColor = '#dc2626';
                elseif ($maxUsage >= 80) $statusColor = '#d97706';
                elseif ($maxUsage >= 50) $statusColor = '#ca8a04';
            @endphp
            <tr class="item-row">
                <td class="font-bold">{{ $item->item_code }}</td>
                <td>{{ $item->nama_budget }}</td>
                <td class="text-right">{{ $item->budget_unit }}</td>
                <td class="text-right">{{ number_format($item->qty_budget, 0, ',', '.') }}</td>
                <td class="text-right">{{ number_format($item->qty_material_terpakai, 0, ',', '.') }}</td>
                <td class="text-right {{ $item->sisa_qty_budget < 0 ? 'over-budget' : '' }}">
                    {{ number_format($item->sisa_qty_budget, 0, ',', '.') }}
                </td>
                <td class="text-right">{{ number_format($item->nilai_budget_material, 0, ',', '.') }}</td>
                <td class="text-right">{{ number_format($item->nilai_msr_material, 0, ',', '.') }}</td>
                <td class="text-right">{{ number_format($item->nilai_budget_jasa, 0, ',', '.') }}</td>
                <td class="text-right">{{ number_format($item->nilai_msr_jasa, 0, ',', '.') }}</td>
                <td class="text-center font-bold" style="color: {{ $statusColor }};">
                    {{ number_format($maxUsage, 1) }}%
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Generated by Antigravity HRIS System | Page <span class="page-number"></span>
    </div>
</body>
</html>
