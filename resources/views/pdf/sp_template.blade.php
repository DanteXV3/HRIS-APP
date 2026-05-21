<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Surat Peringatan - {{ $sp->employee->nama }}</title>
    <style>
        body { font-family: sans-serif; font-size: 10pt; color: #333; line-height: 1.3; margin: 0; padding: 0; }
        .container { padding: 30px; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 5px; }
        .header h1 { margin: 0; font-size: 16pt; text-decoration: underline; }
        .header p { margin: 2px 0 0; font-size: 10pt; font-weight: bold; }
        
        .info { margin-bottom: 15px; }
        .info table { width: 100%; border-collapse: collapse; }
        .info td { padding: 2px 0; vertical-align: top; }
        .info td.label { width: 130px; }
        .info td.separator { width: 15px; text-align: center; }
        
        .content { text-align: justify; margin-bottom: 15px; font-size: 10pt; }
        .content p { margin: 8px 0; }
        
        .violation-list { padding-left: 15px; margin: 5px 0; list-style-type: disc; }
        .violation-list li { margin-bottom: 4px; font-weight: bold; }
        
        .points { margin: 10px 0; }
        .points ol { padding-left: 15px; }
        .points li { margin-bottom: 3px; }
        
        .signatures { margin-top: 40px; width: 100%; }
        .signatures td { width: 50%; text-align: center; font-size: 9pt; }
        .signature-space { height: 60px; }
        
        .footer { position: fixed; bottom: 20px; width: 100%; text-align: center; font-size: 7pt; color: #999; }
        
        .logo { max-width: 500px; margin-bottom: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div style="text-align: center; margin-bottom: 20px;">
             @if($sp->employee->workLocation && $sp->employee->workLocation->header_image && file_exists(storage_path('app/public/' . $sp->employee->workLocation->header_image)))
                @php
                    $headerPath = storage_path('app/public/' . $sp->employee->workLocation->header_image);
                    $headerData = base64_encode(file_get_contents($headerPath));
                    $headerSrc = 'data:image/' . pathinfo($headerPath, PATHINFO_EXTENSION) . ';base64,' . $headerData;
                @endphp
                <img src="{{ $headerSrc }}" alt="Header" style="width: 100%; max-height: 150px; object-fit: contain;">
             @else
                 <!-- Fallback Logo/Banner if no header_image -->
                 <div style="font-weight: bold; font-size: 24pt; color: #1e40af; display: inline-block;">
                    <span style="color: #ef4444;">CD</span><span style="color: #1e3a8a;">M</span> PT. CIPTA DAYA MALINDO
                 </div>
                 <div style="font-size: 8pt; color: #666; margin-top: -5px;">
                    RUKO INKOPAL BLOK G 56, JLN BOULEVARD BARAT, KELAPA GADING, JAKARTA UTARA
                 </div>
                 <div style="height: 3px; background: linear-gradient(to right, #ef4444 33%, #1e3a8a 33%); margin-top: 5px;"></div>
             @endif
        </div>

        <div class="header">
            <h1>SURAT PERINGATAN-{{ $sp->level_roman }}</h1>
            <p>No : {{ $sp->reference_number }}</p>
        </div>

        <div class="info">
            <table>
                <tr>
                    <td class="label">Kepada Saudara</td>
                    <td class="separator">:</td>
                    <td><strong>{{ $sp->employee->nama }}</strong></td>
                </tr>
                <tr>
                    <td class="label">Jabatan</td>
                    <td class="separator">:</td>
                    <td>{{ $sp->employee->position->name ?? '-' }}</td>
                </tr>
                <tr>
                    <td class="label">Divisi</td>
                    <td class="separator">:</td>
                    <td>{{ $sp->employee->department->name ?? '-' }}</td>
                </tr>
            </table>
        </div>

        <div class="content">
            <p>Sehubungan dengan pelanggaran yang saudara lakukan yang dinilai kurang baik maka dari itu telah di putuskan sebagai berikut :</p>
            
            <p>Berdasarkan Kinerja kerja saudara yang dianggap telah melakukan kesalahan, yakni :</p>
            
            <ul class="violation-list">
                @foreach(explode("\n", $sp->description) as $line)
                    @if(trim($line))
                        <li>{{ trim($line) }}</li>
                    @endif
                @endforeach
            </ul>

            <p>Bahwa atas pelanggaran yang Saudara lakukan tersebut di atas dengan pertimbangan yang matang, maka Saudara dijatuhi sanksi administratif berupa <strong>SURAT PERINGATAN - {{ $sp->level_roman }}</strong>. Surat Peringatan ini berlaku selama 3 (tiga) bulan terhitung sampai dengan periode {{ $sp->valid_until->translatedFormat('F Y') }}, dan kepada Saudara diminta memperhatikan hal-hal berikut ini :</p>
            
            <div class="points">
                <ol>
                    <li>Lebih disiplin lagi dalam mengatur waktu dan mengikuti prosedur kerja perusahaan.</li>
                    <li>Dalam masa berlakunya sanksi Saudara diminta agar lebih berhati-hati, pelanggaran dalam masa ini berakibat sanksi yang lebih berat / di bebas tugaskan.</li>
                </ol>
            </div>

            <p>Demikian surat peringatan ini kami sampaikan, agar menjadi perhatian dan perbaikan di masa mendatang.</p>
        </div>

        <div style="text-align: right; margin-top: 20px;">
            Jakarta, {{ $sp->issued_date->translatedFormat('d F Y') }}
        </div>

        <table class="signatures">
            <tr>
                <td>
                    Yang Menyerahkan<br>
                    @if($sp->issuer && $sp->issuer->position) ({{ $sp->issuer->position->name }}) @endif
                    <div class="signature-space"></div>
                    <strong>{{ $sp->issuer->nama ?? '_________________' }}</strong>
                </td>
                <td>
                    Yang Menerima<br>
                    (Karyawan)
                    <div class="signature-space"></div>
                    <strong>{{ $sp->employee->nama }}</strong>
                </td>
            </tr>
        </table>
    </div>

    <div class="footer">
        Dicetak otomatis melalui HRIS Portal pada {{ date('d/m/Y H:i') }}
    </div>
</body>
</html>
