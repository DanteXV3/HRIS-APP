<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Evaluasi KPI - {{ $evaluation->employee->nama }}</title>
    <style>
        body { font-family: sans-serif; font-size: 11pt; color: #333; line-height: 1.4; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #444; padding-bottom: 10px; }
        .header h1 { margin: 0; font-size: 18pt; text-transform: uppercase; }
        .header p { margin: 5px 0 0; font-size: 10pt; color: #666; }
        
        .info-table { width: 100%; margin-bottom: 20px; border-collapse: collapse; }
        .info-table td { padding: 4px 0; vertical-align: top; }
        .info-table td.label { width: 140px; font-weight: bold; }
        .info-table td.separator { width: 15px; }
        
        .section-title { background: #f0f0f0; padding: 5px 10px; font-weight: bold; border-left: 4px solid #333; margin: 20px 0 10px; text-transform: uppercase; font-size: 10pt; }
        
        .data-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        .data-table th, .data-table td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 9pt; }
        .data-table th { background: #f9f9f9; font-weight: bold; }
        .data-table td.center { text-align: center; }
        .data-table td.right { text-align: right; }
        
        .score-box { background: #eef6ff; border: 1px solid #b6d4fe; padding: 15px; border-radius: 5px; margin-top: 20px; }
        .score-box table { width: 100%; }
        .score-box .total-label { font-size: 14pt; font-weight: bold; color: #084298; }
        .score-box .total-value { font-size: 24pt; font-weight: bold; color: #084298; text-align: right; }
        
        .signatures { margin-top: 50px; width: 100%; }
        .signatures td { width: 33%; text-align: center; }
        .signature-space { height: 80px; }
        
        .page-break { page-break-after: always; }
        
        .footer { position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 8pt; color: #999; border-top: 1px solid #ddd; padding-top: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Formulir Evaluasi Kinerja (KPI)</h1>
        @if($evaluation->employee->workLocation)
            <p>{{ $evaluation->employee->workLocation->name }}</p>
        @endif
    </div>

    <table class="info-table">
        <tr>
            <td class="label">Nama Karyawan</td>
            <td class="separator">:</td>
            <td>{{ $evaluation->employee->nama }}</td>
            <td class="label">Departemen</td>
            <td class="separator">:</td>
            <td>{{ $evaluation->employee->department->name ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">NIK</td>
            <td class="separator">:</td>
            <td>{{ $evaluation->employee->nik }}</td>
            <td class="label">Jabatan</td>
            <td class="separator">:</td>
            <td>{{ $evaluation->employee->position->name ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Tanggal Bergabung</td>
            <td class="separator">:</td>
            <td>{{ $evaluation->employee->hire_date ? $evaluation->employee->hire_date->format('d F Y') : '-' }}</td>
            <td class="label">Tanggal Evaluasi</td>
            <td class="separator">:</td>
            <td>{{ $evaluation->evaluation_date->format('d F Y') }}</td>
        </tr>
        <tr>
            <td class="label">Periode Evaluasi</td>
            <td class="separator">:</td>
            <td>{{ str_replace('_', ' ', strtoupper($evaluation->period_type)) }} {{ $evaluation->period_detail ? '('.$evaluation->period_detail.')' : '' }}</td>
            <td class="label">Dievaluasi Oleh</td>
            <td class="separator">:</td>
            <td>{{ $evaluation->evaluator->nama ?? '-' }}</td>
        </tr>
    </table>

    <div class="section-title">Bagian B: Parameter Tugas Pokok Jabatan (KPI) - Bobot 60%</div>
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 40px;">No</th>
                <th>Indikator KPI / Parameter Kerja</th>
                <th style="width: 80px;" class="center">Skor (0-10)</th>
            </tr>
        </thead>
        <tbody>
            @for($i = 1; $i <= 5; $i++)
                @php $kpiText = $evaluation->employee->position->{"kpi_$i"}; @endphp
                @if($kpiText)
                <tr>
                    <td class="center">{{ $i }}</td>
                    <td>{{ $kpiText }}</td>
                    <td class="center">{{ $evaluation->{"score_kpi_$i"} }}</td>
                </tr>
                @endif
            @endfor
        </tbody>
    </table>

    <div class="section-title">Bagian C: Parameter Umum & Perilaku - Bobot 30%</div>
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 40px;">No</th>
                <th>Aspek Kerja</th>
                <th style="width: 150px;">Keterangan</th>
                <th style="width: 80px;" class="center">Skor (1-3)</th>
            </tr>
        </thead>
        <tbody>
            @php
                $aspeks = [
                    ['Planning', 'Perencanaan & Pengaturan Kerja', $evaluation->score_planning],
                    ['Analysis', 'Analisa & Pemecahan Masalah', $evaluation->score_analysis],
                    ['Independence', 'Kemandirian & Inisiatif', $evaluation->score_independence],
                    ['Attitude', 'Sikap Kerja & Tanggung Jawab', $evaluation->score_attitude],
                    ['Collab Sup', 'Kerjasama dengan Atasan', $evaluation->score_collab_sup],
                    ['Collab Peers', 'Kerjasama dengan Rekan Sejawat', $evaluation->score_collab_peers],
                    ['Collab Sub', 'Kerjasama dengan Bawahan', $evaluation->score_collab_sub],
                ];
            @endphp
            @foreach($aspeks as $index => $aspek)
            <tr>
                <td class="center">{{ $index + 1 }}</td>
                <td><strong>{{ $aspek[0] }}</strong></td>
                <td>{{ $aspek[1] }}</td>
                <td class="center">{{ $aspek[2] == 0 ? 'N/A' : $aspek[2] }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="section-title">Bagian D: Kedisiplinan & Kepatuhan (HRD) - Bobot 10%</div>
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 40px;">No</th>
                <th>Aspek Kedisiplinan</th>
                <th style="width: 80px;" class="center">Skor (1-3)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="center">1</td>
                <td>Kehadiran (Absensi)</td>
                <td class="center">{{ $evaluation->score_attendance }}</td>
            </tr>
            <tr>
                <td class="center">2</td>
                <td>Ketepatan Waktu (Punctuality)</td>
                <td class="center">{{ $evaluation->score_punctuality }}</td>
            </tr>
            <tr>
                <td class="center">3</td>
                <td>Kepatuhan Aturan & SOP (Obedience)</td>
                <td class="center">{{ $evaluation->score_obedience }}</td>
            </tr>
        </tbody>
    </table>

    <div class="section-title">Bagian E: Rekomendasi & Pengembangan</div>
    <table class="data-table">
        <tbody>
            <tr>
                <td>{{ $evaluation->rec_1 ?: '-' }}<br>{{ $evaluation->rec_2 ?: '' }}<br>{{ $evaluation->rec_3 ?: '' }}</td>
            </tr>
        </tbody>
    </table>

    <div class="section-title">Bagian F: Komentar Karyawan</div>
    <table class="data-table">
        <tbody>
            <tr>
                <td>{{ $evaluation->employee_comment ?: 'Tidak ada komentar.' }}</td>
            </tr>
        </tbody>
    </table>

    <div class="score-box">
        <table>
            <tr>
                <td class="total-label">TOTAL SKOR AKHIR (SKALA 10.0)</td>
                <td class="total-value">{{ number_format($evaluation->total_score / 10, 2) }} / 10.0</td>
            </tr>
        </table>
    </div>

    <table class="signatures">
        <tr>
            <td>
                Dibuat Oleh,<br>
                (HRD)<br>
                <div class="signature-space"></div>
                <strong>{{ $evaluation->hr->nama ?? '_________________' }}</strong>
            </td>
            <td>
                Disetujui Oleh,<br>
                (Atasan Langsung)<br>
                <div class="signature-space"></div>
                <strong>{{ $evaluation->evaluator->nama ?? '_________________' }}</strong>
            </td>
            <td>
                Diketahui Oleh,<br>
                (Karyawan)<br>
                <div class="signature-space"></div>
                <strong>{{ $evaluation->employee->nama }}</strong>
            </td>
        </tr>
    </table>

    <div class="footer">
        Dicetak otomatis melalui HRIS Portal pada {{ date('d/m/Y H:i') }}
    </div>
</body>
</html>
