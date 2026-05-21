<!DOCTYPE html><html><head><meta charset="utf-8"><title>Offering Letter {{ $letter->letter_number }}</title>
@include('pdfs.partials.hr-letter-header')
</head><body>
@php
    $company = $letter->company;
    $companyName = $company ? $company->name : 'Perusahaan';
    $maker = $letter->maker;
@endphp
<div class="content">
    <div class="title">OFFERING LETTER</div>
    <div class="letter-no">No. {{ $letter->letter_number }}</div>

    <div class="text-body">Kepada Yth,<br><strong>{{ $letter->candidate_name }}</strong><br>{{ $letter->candidate_address }}</div>

    <div class="text-body">Dengan hormat,<br>Berdasarkan hasil seleksi yang telah dilakukan, dengan ini kami menawarkan posisi di <strong>{{ $companyName }}</strong> dengan detail sebagai berikut:</div>

    <table class="table-info">
        <tr><td class="col-label">Posisi</td><td class="col-colon">:</td><td><strong>{{ $letter->position_offered }}</strong></td></tr>
        <tr><td class="col-label">Departemen</td><td class="col-colon">:</td><td>{{ $letter->department_text ?? '-' }}</td></tr>
        <tr><td class="col-label">Status Kepegawaian</td><td class="col-colon">:</td><td>{{ ucfirst($letter->employment_type) }}</td></tr>
        <tr><td class="col-label">Tanggal Mulai</td><td class="col-colon">:</td><td>{{ $letter->start_date->translatedFormat('d F Y') }}</td></tr>
    </table>

    @if($letter->notes)
    <div class="text-body">{{ $letter->notes }}</div>
    @endif

    <div class="text-body">Kami berharap Anda dapat bergabung dengan tim kami. Mohon konfirmasi kesediaan Anda selambat-lambatnya 7 (tujuh) hari setelah menerima surat ini.</div>

    @include('pdfs.partials.hr-letter-signature')
</div>
</body></html>
