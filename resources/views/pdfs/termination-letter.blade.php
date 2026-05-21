<!DOCTYPE html><html><head><meta charset="utf-8"><title>Surat PHK {{ $letter->letter_number }}</title>
@include('pdfs.partials.hr-letter-header')
</head><body>
@php
    $company = $letter->company;
    $companyName = $company ? $company->name : 'Perusahaan';
    $maker = $letter->maker;
@endphp
<div class="content">
    <div class="title">SURAT PEMUTUSAN HUBUNGAN KERJA</div>
    <div class="letter-no">No. {{ $letter->letter_number }}</div>

    <div class="text-body">Yang bertanda tangan di bawah ini, Pimpinan <strong>{{ $companyName }}</strong>, dengan ini menyampaikan bahwa:</div>

    <table class="table-info">
        <tr><td class="col-label">Nama</td><td class="col-colon">:</td><td>{{ $letter->employee->nama }}</td></tr>
        <tr><td class="col-label">NIK</td><td class="col-colon">:</td><td>{{ $letter->employee->nik }}</td></tr>
        <tr><td class="col-label">Jabatan</td><td class="col-colon">:</td><td>{{ $letter->employee->position?->name ?? '-' }}</td></tr>
        <tr><td class="col-label">Tanggal Efektif PHK</td><td class="col-colon">:</td><td><strong>{{ $letter->termination_date->translatedFormat('d F Y') }}</strong></td></tr>
        <tr><td class="col-label">Alasan</td><td class="col-colon">:</td><td>{{ $letter->reason }}</td></tr>
    </table>

    <div class="text-body">Berdasarkan pertimbangan yang telah dilakukan, dengan ini dinyatakan bahwa hubungan kerja antara yang bersangkutan dengan <strong>{{ $companyName }}</strong> berakhir terhitung mulai tanggal <strong>{{ $letter->termination_date->translatedFormat('d F Y') }}</strong>.</div>

    @if($letter->notes)
    <div class="text-body">{{ $letter->notes }}</div>
    @endif

    <div class="text-body">Demikian surat ini dibuat untuk dipergunakan sebagaimana mestinya.</div>

    @include('pdfs.partials.hr-letter-signature')
</div>
</body></html>
