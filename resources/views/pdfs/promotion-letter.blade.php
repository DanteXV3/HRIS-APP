<!DOCTYPE html><html><head><meta charset="utf-8"><title>Surat {{ ucfirst($letter->type) }} {{ $letter->letter_number }}</title>
@include('pdfs.partials.hr-letter-header')
</head><body>
@php
    $company = $letter->company;
    $companyName = $company ? $company->name : 'Perusahaan';
    $maker = $letter->maker;
@endphp
<div class="content">
    <div class="title">SURAT {{ strtoupper($letter->type) }} JABATAN</div>
    <div class="letter-no">No. {{ $letter->letter_number }}</div>

    <div class="text-body">Yang bertanda tangan di bawah ini, Pimpinan <strong>{{ $companyName }}</strong>, dengan ini memutuskan:</div>

    <table class="table-info">
        <tr><td class="col-label">Nama</td><td class="col-colon">:</td><td>{{ $letter->employee->nama }}</td></tr>
        <tr><td class="col-label">NIK</td><td class="col-colon">:</td><td>{{ $letter->employee->nik }}</td></tr>
        <tr><td class="col-label">Jabatan Lama</td><td class="col-colon">:</td><td>{{ $letter->from_position }}</td></tr>
        <tr><td class="col-label">Jabatan Baru</td><td class="col-colon">:</td><td><strong>{{ $letter->to_position }}</strong></td></tr>
        @if($letter->from_department)<tr><td class="col-label">Dept. Lama</td><td class="col-colon">:</td><td>{{ $letter->from_department }}</td></tr>@endif
        @if($letter->to_department)<tr><td class="col-label">Dept. Baru</td><td class="col-colon">:</td><td><strong>{{ $letter->to_department }}</strong></td></tr>@endif
        <tr><td class="col-label">Berlaku Mulai</td><td class="col-colon">:</td><td>{{ $letter->effective_date->translatedFormat('d F Y') }}</td></tr>
        @if($letter->reason)<tr><td class="col-label">Alasan</td><td class="col-colon">:</td><td>{{ $letter->reason }}</td></tr>@endif
    </table>

    <div class="text-body">Dengan ini ditetapkan {{ $letter->type }} jabatan yang bersangkutan dari <strong>{{ $letter->from_position }}</strong> menjadi <strong>{{ $letter->to_position }}</strong> terhitung mulai tanggal <strong>{{ $letter->effective_date->translatedFormat('d F Y') }}</strong>.</div>

    <div class="text-body">Demikian surat ini dibuat untuk dilaksanakan sebagaimana mestinya.</div>

    @include('pdfs.partials.hr-letter-signature')
</div>
</body></html>
