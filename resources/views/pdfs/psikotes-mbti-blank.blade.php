<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Form Tes MBTI - Blank</title>
    <style>
        body { font-family: sans-serif; font-size: 9pt; line-height: 1.3; color: #333; margin: 0; padding: 20px; }
        .header { text-align: center; margin-bottom: 15px; border-bottom: 2px solid #333; padding-bottom: 8px; }
        .title { font-size: 14pt; font-weight: bold; text-transform: uppercase; }
        .candidate-info { margin-bottom: 15px; width: 100%; border-collapse: collapse; }
        .candidate-info td { padding: 3px; border-bottom: 1px dotted #ccc; }
        .instructions { background: #f4f4f4; padding: 8px; border: 1px solid #ddd; margin-bottom: 15px; font-size: 8pt; }
        .question-row { margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        .question-text { font-weight: bold; margin-bottom: 3px; }
        .option { margin-left: 20px; }
        .checkbox { display: inline-block; width: 12px; height: 12px; border: 1px solid #000; margin-right: 5px; vertical-align: middle; }
        .columns { column-count: 2; column-gap: 30px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">Kuesioner Tes Kepribadian (MBTI)</div>
        <div style="font-size: 8pt; margin-top: 3px;">Myers-Briggs Type Indicator - Versi Bahasa Indonesia</div>
    </div>

    <table class="candidate-info">
        <tr>
            <td style="width: 80px;">Nama</td><td>: ___________________________________</td>
            <td style="width: 50px;">Tanggal</td><td>: ______________</td>
        </tr>
    </table>

    <div class="instructions">
        <strong>INSTRUKSI:</strong> Berikan tanda silang (X) atau centang (V) pada kotak di depan pilihan (A atau B) yang paling menggambarkan diri Anda dalam setiap situasi. Tidak ada jawaban benar atau salah.
    </div>

    <div class="columns">
        @foreach($questions as $id => $q)
        <div class="question-row">
            <div class="question-text">{{ $id }}. {{ $q['text'] }}</div>
            <div class="option">
                <span class="checkbox"></span> A. {{ $q['options']['A']['text'] }}
            </div>
            <div class="option">
                <span class="checkbox"></span> B. {{ $q['options']['B']['text'] }}
            </div>
        </div>
        @if($id % 35 == 0)
            <!-- Potential Column break helper -->
        @endif
        @endforeach
    </div>

    <div style="margin-top: 20px; font-size: 7pt; color: #777; text-align: center; font-style: italic;">
        *Silakan isi semua nomor untuk mendapatkan hasil yang akurat.
    </div>
</body>
</html>
