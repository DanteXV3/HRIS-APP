{{-- Shared HR Letter PDF Styles --}}
<style>
    body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0; color: #000; font-size: 14px; line-height: 1.5; }
    .header { width: 100%; margin-bottom: 20px; }
    .header-image { width: 100%; max-height: 150px; object-fit: contain; }
    .content { margin: 0 40px; padding: 20px 20px; }
    .title { text-align: center; font-size: 16px; font-weight: bold; text-decoration: underline; margin-bottom: 2px; }
    .subtitle { text-align: center; font-size: 14px; margin-bottom: 5px; }
    .letter-no { text-align: center; font-size: 14px; font-weight: bold; margin-bottom: 30px; }
    .text-body { margin-bottom: 15px; text-align: justify; }
    .table-info { width: 100%; margin-bottom: 20px; margin-left: 20px; border-collapse: collapse; }
    .table-info td { vertical-align: top; padding: 3px 0; }
    .col-label { width: 170px; font-weight: bold; }
    .col-colon { width: 15px; }
    .signature-container { margin-top: 40px; margin-left: 55%; }
    .signature-date { margin-bottom: 5px; }
    .signature-company { margin-bottom: 0; }
    .signature-image { width: 150px; height: 120px; object-fit: scale-down; border: none; margin: 5px 0; }
    .signature-name { margin-bottom: 2px; }
</style>

@php
    $company = $letter->company;
    $companyName = $company ? $company->name : 'Perusahaan';
    $maker = $letter->maker;
@endphp

@if($company && $company->header_image)
<div class="header">
    <img src="{{ storage_path('app/public/' . $company->header_image) }}" class="header-image" alt="Kop Surat">
</div>
@endif
