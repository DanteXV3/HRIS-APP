<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Form Tes DISC - Blank</title>
    <style>
        body { font-family: sans-serif; font-size: 10pt; line-height: 1.4; color: #333; margin: 0; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .title { font-size: 16pt; font-weight: bold; text-transform: uppercase; }
        .candidate-box { margin-bottom: 20px; width: 100%; }
        .candidate-box td { padding: 5px; border-bottom: 1px dotted #ccc; }
        .instructions { background: #f9f9f9; padding: 10px; border: 1px solid #ddd; margin-bottom: 20px; font-size: 9pt; }

        table.test-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
        table.test-table th, table.test-table td { border: 1px solid #999; padding: 6px; }
        table.test-table th { background: #f2f2f2; font-weight: bold; }

        .no-col { width: 30px; text-align: center; font-weight: bold; background: #fafafa; }
        .text-col { width: auto; }
        .choice-col { width: 40px; text-align: center; font-weight: bold; }

        /* Each question group stays together on a page */
        .question-group { page-break-inside: avoid; }
        .group-separator td { border-bottom: 2px solid #666; }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">Kuesioner Tes Kepribadian (DISC)</div>
    </div>

    <table class="candidate-box">
        <tr>
            <td style="width: 80px;">Nama</td><td>: ___________________________________</td>
            <td style="width: 50px;">Tanggal</td><td>: ______________</td>
        </tr>
    </table>

    <div class="instructions">
        <strong>INSTRUKSI:</strong> Beri tanda (X) pada kolom <strong>M</strong> untuk pernyataan yang <strong>PALING</strong> menggambarkan diri Anda, dan pada kolom <strong>L</strong> untuk pernyataan yang <strong>PALING TIDAK</strong> menggambarkan diri Anda.
    </div>

    <table class="test-table">
        <thead>
            <tr>
                <th class="no-col">No</th>
                <th class="text-col">Pernyataan</th>
                <th class="choice-col">M</th>
                <th class="choice-col">L</th>
            </tr>
        </thead>
        <tbody>
            @foreach($questions as $id => $group)
            <tr class="question-group">
                <td class="no-col">{{ $id }}</td>
                <td>{{ $group['A']['text'] }}</td>
                <td class="choice-col"></td>
                <td class="choice-col"></td>
            </tr>
            <tr class="question-group">
                <td class="no-col"></td>
                <td>{{ $group['B']['text'] }}</td>
                <td class="choice-col"></td>
                <td class="choice-col"></td>
            </tr>
            <tr class="question-group">
                <td class="no-col"></td>
                <td>{{ $group['C']['text'] }}</td>
                <td class="choice-col"></td>
                <td class="choice-col"></td>
            </tr>
            <tr class="question-group group-separator">
                <td class="no-col"></td>
                <td>{{ $group['D']['text'] }}</td>
                <td class="choice-col"></td>
                <td class="choice-col"></td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div style="margin-top: 20px; text-align: center; font-size: 8pt; color: #666; font-style: italic;">
        *Pastikan setiap nomor memiliki satu tanda di kolom M dan satu tanda di kolom L.
    </div>
</body>
</html>
