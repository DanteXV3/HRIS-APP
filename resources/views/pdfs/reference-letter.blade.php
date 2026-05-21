<!DOCTYPE html><html><head><meta charset="utf-8"><title>Surat Referensi {{ $letter->letter_number }}</title>
@include('pdfs.partials.hr-letter-header')
</head><body>
@php
    $company = $letter->company;
    $companyName = $company ? $company->name : 'Perusahaan';
    $maker = $letter->maker;
@endphp
<div class="content">
    <div class="title">SURAT REFERENSI KERJA</div>
    <div class="letter-no">No. {{ $letter->letter_number }}</div>

    <div class="text-body">Yang bertanda tangan di bawah ini menerangkan bahwa:</div>

    <table class="table-info">
        <tr><td class="col-label">Nama</td><td class="col-colon">:</td><td>{{ $letter->employee->nama }}</td></tr>
        <tr><td class="col-label">NIK</td><td class="col-colon">:</td><td>{{ $letter->employee->nik }}</td></tr>
        <tr><td class="col-label">Jabatan</td><td class="col-colon">:</td><td>{{ $letter->employee->position?->name ?? '-' }}</td></tr>
        <tr><td class="col-label">Lokasi Kerja</td><td class="col-colon">:</td><td>{{ $letter->work_location_text ?? '-' }}</td></tr>
        <tr><td class="col-label">Masa Kerja</td><td class="col-colon">:</td><td>{{ $letter->from_date->translatedFormat('d F Y') }} s/d {{ $letter->to_date->translatedFormat('d F Y') }}</td></tr>
    </table>

    <div class="text-body">Adalah benar telah bekerja di <strong>{{ $companyName }}</strong> selama kurun waktu tersebut di atas.</div>

    @if($letter->qualities)
    <div class="text-body">{{ $letter->qualities }}</div>
    @endif

    @if($letter->recommendation_text)
    <div class="text-body">{{ $letter->recommendation_text }}</div>
    @else
    <div class="text-body">Selama bekerja di perusahaan kami, yang bersangkutan menunjukkan dedikasi, integritas, dan kemampuan kerja yang baik. Kami merekomendasikan yang bersangkutan untuk posisi yang sesuai dengan keahliannya.</div>
    @endif

    <div class="text-body">Demikian surat referensi ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.</div>

    @include('pdfs.partials.hr-letter-signature')
</div>
</body></html>
