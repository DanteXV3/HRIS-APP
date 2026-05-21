{{-- Shared signature block --}}
<div class="signature-container">
    <div class="signature-date">{{ $company->address ?? 'Jakarta' }}, {{ $letter->date->translatedFormat('d F Y') }}</div>
    <div class="signature-company">{{ $companyName }}</div>
    @if($maker && $maker->signature)
        <div><img src="{{ storage_path('app/public/' . $maker->signature) }}" class="signature-image" alt="TTD"></div>
    @else
        <div style="height: 100px;"></div>
    @endif
    <div class="signature-name">{{ $maker->nama ?? 'HR Department' }}</div>
</div>
