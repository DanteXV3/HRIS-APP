<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Hasil Tes Psikologi - {{ $test->candidate_name }}</title>
    <style>
        body { font-family: sans-serif; font-size: 10pt; line-height: 1.5; color: #333; }
        .header { border-bottom: 2px solid #4f46e5; padding-bottom: 15px; margin-bottom: 30px; }
        .title { font-size: 18pt; font-weight: bold; color: #4f46e5; text-transform: uppercase; }
        .candidate-info { margin-bottom: 30px; background: #f9fafb; padding: 15px; border-radius: 8px; }
        .candidate-info table { width: 100%; border-collapse: collapse; }
        .candidate-info td { padding: 4px 0; }
        .label { font-weight: bold; color: #6b7280; width: 120px; }
        
        .result-box { background: #4f46e5; color: white; padding: 25px; border-radius: 12px; margin-bottom: 30px; }
        .result-type { font-size: 32pt; font-weight: 900; margin-bottom: 5px; line-height: 1; }
        .result-name { font-size: 14pt; font-weight: bold; opacity: 0.9; }
        
        .section-title { font-size: 12pt; font-weight: bold; color: #111827; border-left: 4px solid #4f46e5; padding-left: 10px; margin-bottom: 15px; margin-top: 30px; }
        .description { font-style: italic; color: #374151; background: #f3f4f6; padding: 15px; border-radius: 8px; }
        
        .score-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .score-table th, .score-table td { border: 1px solid #e5e7eb; padding: 8px; text-align: center; }
        .score-table th { background: #f9fafb; color: #374151; }
        
        .footer { margin-top: 50px; font-size: 8pt; color: #9ca3af; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 15px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">Laporan Hasil Tes Kepribadian</div>
        <div style="font-size: 9pt; color: #6b7280;">Sistem Manajemen SDM - Bangun People</div>
    </div>

    <div class="candidate-box">
        <table>
            <tr>
                <td class="label">Nama Kandidat</td>
                <td style="font-weight: bold;">: {{ $test->candidate_name }}</td>
            </tr>
            <tr>
                <td class="label">Jenis Tes</td>
                <td>: {{ strtoupper($test->test_type) }} Assessment</td>
            </tr>
            <tr>
                <td class="label">Informasi</td>
                <td>: {{ $test->candidate_info ?? '-' }}</td>
            </tr>
            <tr>
                <td class="label">Tanggal Tes</td>
                <td>: {{ $test->created_at->format('d F Y, H:i') }}</td>
            </tr>
        </table>
    </div>

    <div class="result-box">
        <div class="result-type">
            {{ $test->test_type === 'disc' ? $test->results['dominant_trait'] : $test->results['type'] }}
        </div>
        <div class="result-name">
            {{ $test->test_type === 'disc' ? $test->results['trait_name'] : 'MBTI Personality Type' }}
        </div>
    </div>

    <div class="section-title">Interpretasi Profil</div>
    <div class="description">
        @if($test->test_type === 'disc')
            @php
                $trait = $test->results['dominant_trait'];
                $descs = [
                    'D' => 'Dominance: Menekankan pada pencapaian hasil, gambaran besar, dan kepercayaan diri. Seseorang dengan tipe D biasanya sangat asertif, berorientasi pada tujuan, dan menyukai tantangan.',
                    'I' => 'Influence: Menekankan pada memengaruhi atau membujuk orang lain, keterbukaan, dan hubungan. Seseorang dengan tipe I biasanya sangat antusias, optimis, hangat, dan suka bersosialisasi.',
                    'S' => 'Steadiness: Menekankan pada kerja sama, ketulusan, dan ketergantungan. Seseorang dengan tipe S biasanya memiliki pembawaan yang tenang, sabar, loyal, dan menyukai lingkungan yang harmonis.',
                    'C' => 'Conscientiousness: Menekankan pada kualitas dan akurasi, keahlian, dan kompetensi. Seseorang dengan tipe C biasanya sangat teliti, analitis, logis, dan menjunjung tinggi standar kualitas.'
                ];
                echo $descs[$trait] ?? 'Profil kepribadian yang unik.';
            @endphp
        @else
            @php
                $type = $test->results['type'];
                $descs = [
                    'INTJ' => 'Arsitek: Pemikir strategis yang sangat analitis dan logis.',
                    'INTP' => 'Logikawan: Penemu inovatif dengan haus akan pengetahuan.',
                    'ENTJ' => 'Komandan: Pemimpin yang berani dan berkemauan keras.',
                    'ENTP' => 'Debat: Pemikir cerdas yang suka tantangan intelektual.',
                    'INFJ' => 'Advokat: Idealis yang pendiam namun sangat inspiratif.',
                    'INFP' => 'Mediator: Orang yang puitis dan altruistik.',
                    'ENFJ' => 'Protagonis: Pemimpin karismatik yang mampu memukau pendengar.',
                    'ENFP' => 'Juru Kampanye: Semangat yang antusias dan kreatif.',
                    'ISTJ' => 'Logistikus: Individu praktis yang sangat bisa diandalkan.',
                    'ISFJ' => 'Pembela: Pelindung yang berdedikasi dan hangat.',
                    'ESTJ' => 'Eksekutif: Administrator luar biasa dalam mengelola sesuatu.',
                    'ESFJ' => 'Konsul: Orang yang sangat peduli dan populer.',
                    'ISTP' => 'Virtuoso: Pengrajin berani yang ahli dengan alat.',
                    'ISFP' => 'Petualang: Seniman fleksibel yang selalu siap menjelajah.',
                    'ESTP' => 'Pengusaha: Orang cerdas dan energik yang suka tantangan.',
                    'ESFP' => 'Penghibur: Orang spontan dan energik yang antusias.'
                ];
                echo $descs[$type] ?? 'Tipe kepribadian yang kompleks.';
            @endphp
        @endif
    </div>

    <div class="section-title">Detail Skor</div>
    <table class="score-table">
        <thead>
            <tr>
                @if($test->test_type === 'disc')
                    <th>D (Dominance)</th>
                    <th>I (Influence)</th>
                    <th>S (Steadiness)</th>
                    <th>C (Conscientiousness)</th>
                @else
                    <th>E vs I</th>
                    <th>S vs N</th>
                    <th>T vs F</th>
                    <th>J vs P</th>
                @endif
            </tr>
        </thead>
        <tbody>
            <tr>
                @if($test->test_type === 'disc')
                    <td>{{ $test->results['scores']['D'] }}</td>
                    <td>{{ $test->results['scores']['I'] }}</td>
                    <td>{{ $test->results['scores']['S'] }}</td>
                    <td>{{ $test->results['scores']['C'] }}</td>
                @else
                    <td>{{ $test->results['counts']['E'] }} - {{ $test->results['counts']['I'] }}</td>
                    <td>{{ $test->results['counts']['S'] }} - {{ $test->results['counts']['N'] }}</td>
                    <td>{{ $test->results['counts']['T'] }} - {{ $test->results['counts']['F'] }}</td>
                    <td>{{ $test->results['counts']['J'] }} - {{ $test->results['counts']['P'] }}</td>
                @endif
            </tr>
        </tbody>
    </table>

    <div class="footer">
        Dicetak secara otomatis oleh Bangun People HRIS pada {{ now()->format('d/m/Y H:i') }}.<br>
        Laporan ini bersifat rahasia dan hanya untuk kepentingan internal perusahaan.
    </div>
</body>
</html>
