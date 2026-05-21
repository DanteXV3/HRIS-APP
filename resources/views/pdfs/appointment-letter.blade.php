<!DOCTYPE html><html><head><meta charset="utf-8"><title>Surat Pengangkatan {{ $letter->letter_number }}</title>
@include('pdfs.partials.hr-letter-header')
</head><body>
@php
    $company = $letter->company;
    $companyName = $company ? $company->name : 'Perusahaan';
    $maker = $letter->maker;
@endphp
<div class="content">
    <div class="title">SURAT PENGANGKATAN KARYAWAN</div>
    <div class="letter-no">No. {{ $letter->letter_number }}</div>

    <div class="text-body">Yang bertanda tangan di bawah ini, Pimpinan <strong>{{ $companyName }}</strong>, dengan ini menerangkan bahwa:</div>

    <table class="table-info">
        <tr><td class="col-label">Nama</td><td class="col-colon">:</td><td>{{ $letter->employee->nama }}</td></tr>
        <tr><td class="col-label">NIK</td><td class="col-colon">:</td><td>{{ $letter->employee->nik }}</td></tr>
        <tr><td class="col-label">Jabatan</td><td class="col-colon">:</td><td>{{ $letter->employee->position?->name ?? '-' }}</td></tr>
        <tr><td class="col-label">Status Sebelumnya</td><td class="col-colon">:</td><td>{{ $letter->previous_status }}</td></tr>
        <tr><td class="col-label">Status Baru</td><td class="col-colon">:</td><td><strong>{{ $letter->new_status }}</strong></td></tr>
        <tr><td class="col-label">Berlaku Mulai</td><td class="col-colon">:</td><td>{{ $letter->effective_date->translatedFormat('d F Y') }}</td></tr>
    </table>

    <div class="text-body">Dengan ini diangkat sebagai karyawan <strong>{{ $letter->new_status }}</strong> pada <strong>{{ $companyName }}</strong> terhitung mulai tanggal <strong>{{ $letter->effective_date->translatedFormat('d F Y') }}</strong>.</div>

    <div class="text-body">Demikian surat pengangkatan ini dibuat untuk dipergunakan sebagaimana mestinya.</div>

    @include('pdfs.partials.hr-letter-signature')
</div>
</body></html>
