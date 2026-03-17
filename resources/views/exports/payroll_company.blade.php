@php
    $sumTotals = [
        'gaji_pokok' => 0,
        'tunjangan_jabatan' => 0,
        'tunjangan_kehadiran' => 0,
        'uang_makan' => 0,
        'tunjangan_transportasi' => 0,
        'uang_lembur' => 0,
        'thr' => 0,
        'tunjangan_pajak' => 0,
        'total_pendapatan' => 0,

        'jht_kar' => 0,
        'jp_kar' => 0,
        'bpjs_kes_kar' => 0,
        'pph21' => 0,
        'potongan_lain' => 0,
        'total_potongan' => 0,

        'gaji_bersih' => 0,

        'jkk_pers' => 0,
        'jkm_pers' => 0,
        'jht_pers' => 0,
        'jp_pers' => 0,
        'bpjs_kes_pers' => 0,
    ];

    $rows = [];
    foreach($items as $item) {
        // Reverse calculate proportions
        // Employer: JHT 3.7%, JP 2%, JKK 0.24%, JKM 0.3% -> Total 6.24%
        $jkkPers = round($item->iuran_bpjs_tk_perusahaan * (0.24 / 6.24));
        $jkmPers = round($item->iuran_bpjs_tk_perusahaan * (0.30 / 6.24));
        $jhtPers = round($item->iuran_bpjs_tk_perusahaan * (3.70 / 6.24));
        $jpPers = $item->iuran_bpjs_tk_perusahaan - $jkkPers - $jkmPers - $jhtPers;

        // Employee: JHT 2%, JP 1% -> Total 3%
        $jhtKar = round($item->potongan_bpjs_tk * (2 / 3));
        $jpKar = $item->potongan_bpjs_tk - $jhtKar;

        $potLain = $item->pinjaman_koperasi + $item->potongan_lain_1 + $item->potongan_lain_2;

        $row = [
            'nik' => $item->employee->nik,
            'nama' => $item->employee->nama,
            'dept' => $item->employee->department?->name ?? '-',
            'pos' => $item->employee->position?->name ?? '-',
            'bank' => $item->employee->nama_bank ?? '-',
            'no_rek' => $item->employee->no_rekening ?? '-',
            'nama_rek' => $item->employee->nama_rekening ?? '-',
            'gaji_pokok' => $item->gaji_pokok,
            'tunjangan_jabatan' => $item->tunjangan_jabatan,
            'tunjangan_kehadiran' => $item->tunjangan_kehadiran,
            'uang_makan' => $item->uang_makan,
            'tunjangan_transportasi' => $item->tunjangan_transportasi,
            'uang_lembur' => $item->uang_lembur,
            'thr' => $item->thr,
            'tunjangan_pajak' => $item->tunjangan_pajak,
            'total_pendapatan' => $item->total_pendapatan,
            'jht_kar' => $jhtKar,
            'jp_kar' => $jpKar,
            'bpjs_kes_kar' => $item->potongan_bpjs_jkn,
            'pph21' => $item->potongan_pph21,
            'potongan_lain' => $potLain,
            'total_potongan' => $item->total_potongan,
            'gaji_bersih' => $item->gaji_bersih,
            'jkk_pers' => $jkkPers,
            'jkm_pers' => $jkmPers,
            'jht_pers' => $jhtPers,
            'jp_pers' => $jpPers,
            'bpjs_kes_pers' => $item->iuran_bpjs_jkn_perusahaan,
        ];

        // Add to sums
        $sumTotals['gaji_pokok'] += $row['gaji_pokok'];
        $sumTotals['tunjangan_jabatan'] += $row['tunjangan_jabatan'];
        $sumTotals['tunjangan_kehadiran'] += $row['tunjangan_kehadiran'];
        $sumTotals['uang_makan'] += $row['uang_makan'];
        $sumTotals['tunjangan_transportasi'] += $row['tunjangan_transportasi'];
        $sumTotals['uang_lembur'] += $row['uang_lembur'];
        $sumTotals['thr'] += $row['thr'];
        $sumTotals['tunjangan_pajak'] += $row['tunjangan_pajak'];
        $sumTotals['total_pendapatan'] += $row['total_pendapatan'];
        $sumTotals['jht_kar'] += $row['jht_kar'];
        $sumTotals['jp_kar'] += $row['jp_kar'];
        $sumTotals['bpjs_kes_kar'] += $row['bpjs_kes_kar'];
        $sumTotals['pph21'] += $row['pph21'];
        $sumTotals['potongan_lain'] += $row['potongan_lain'];
        $sumTotals['total_potongan'] += $row['total_potongan'];
        $sumTotals['gaji_bersih'] += $row['gaji_bersih'];
        $sumTotals['jkk_pers'] += $row['jkk_pers'];
        $sumTotals['jkm_pers'] += $row['jkm_pers'];
        $sumTotals['jht_pers'] += $row['jht_pers'];
        $sumTotals['jp_pers'] += $row['jp_pers'];
        $sumTotals['bpjs_kes_pers'] += $row['bpjs_kes_pers'];

        $rows[] = $row;
    }
@endphp
<table>
    <!-- Title Section -->
    <thead>
        <tr>
            <td colspan="28"><strong>Laporan Payroll - {{ $companyName }}</strong></td>
        </tr>
        <tr>
            <td colspan="28">Periode: {{ \Carbon\Carbon::parse($payroll->periode . '-01')->translatedFormat('F Y') }}</td>
        </tr>
        <tr></tr> <!-- Empty row for spacing -->

        <!-- Headers -->
        <tr>
            <!-- Identitas -->
            <th style="background-color: #cbd5e1; font-weight: bold;">NIK</th>
            <th style="background-color: #cbd5e1; font-weight: bold;">Nama Karyawan</th>
            <th style="background-color: #cbd5e1; font-weight: bold;">Departemen</th>
            <th style="background-color: #cbd5e1; font-weight: bold;">Jabatan</th>
            <th style="background-color: #cbd5e1; font-weight: bold;">Bank</th>
            <th style="background-color: #cbd5e1; font-weight: bold;">No Rekening</th>
            <th style="background-color: #cbd5e1; font-weight: bold;">Nama Rekening</th>
            
            <!-- Pendapatan -->
            <th style="background-color: #bbf7d0; font-weight: bold;">Gaji Pokok</th>
            <th style="background-color: #bbf7d0; font-weight: bold;">Tunj. Jabatan</th>
            <th style="background-color: #bbf7d0; font-weight: bold;">Tunj. Kehadiran</th>
            <th style="background-color: #bbf7d0; font-weight: bold;">Uang Makan</th>
            <th style="background-color: #bbf7d0; font-weight: bold;">Tunj. Transportasi</th>
            <th style="background-color: #bbf7d0; font-weight: bold;">Uang Lembur</th>
            <th style="background-color: #bbf7d0; font-weight: bold;">THR</th>
            <th style="background-color: #bbf7d0; font-weight: bold;">Tunj. Pajak (Gross Up)</th>
            <th style="background-color: #bbf7d0; font-weight: bold;">TOTAL PENDAPATAN</th>
            
            <!-- Potongan Karyawan -->
            <th style="background-color: #fca5a5; font-weight: bold;">JHT Karyawan (2%)</th>
            <th style="background-color: #fca5a5; font-weight: bold;">JP Karyawan (1%)</th>
            <th style="background-color: #fca5a5; font-weight: bold;">BPJS Kes Karyawan (1%)</th>
            <th style="background-color: #fca5a5; font-weight: bold;">PPh21</th>
            <th style="background-color: #fca5a5; font-weight: bold;">Potongan Lainnya</th>
            <th style="background-color: #fca5a5; font-weight: bold;">TOTAL POTONGAN</th>
            
            <!-- THP -->
            <th style="background-color: #93c5fd; font-weight: bold;">TAKE HOME PAY</th>

            <!-- Iuran Perusahaan (Hidden on regular Payslip) -->
            <th style="background-color: #fde047; font-weight: bold;">JKK Perusahaan (0.24%)</th>
            <th style="background-color: #fde047; font-weight: bold;">JKM Perusahaan (0.3%)</th>
            <th style="background-color: #fde047; font-weight: bold;">JHT Perusahaan (3.7%)</th>
            <th style="background-color: #fde047; font-weight: bold;">JP Perusahaan (2%)</th>
            <th style="background-color: #fde047; font-weight: bold;">BPJS Kes Perusahaan (4%)</th>
        </tr>
    </thead>
    
    <!-- Data Section -->
    <tbody>
        @foreach($rows as $row)
        <tr>
            <!-- Identitas -->
            <td>{{ $row['nik'] }}</td>
            <td>{{ $row['nama'] }}</td>
            <td>{{ $row['dept'] }}</td>
            <td>{{ $row['pos'] }}</td>
            <td>{{ $row['bank'] }}</td>
            <td>{{ $row['no_rek'] }}</td>
            <td>{{ $row['nama_rek'] }}</td>

            <!-- Pendapatan -->
            <td>{{ $row['gaji_pokok'] }}</td>
            <td>{{ $row['tunjangan_jabatan'] }}</td>
            <td>{{ $row['tunjangan_kehadiran'] }}</td>
            <td>{{ $row['uang_makan'] }}</td>
            <td>{{ $row['tunjangan_transportasi'] }}</td>
            <td>{{ $row['uang_lembur'] }}</td>
            <td>{{ $row['thr'] }}</td>
            <td>{{ $row['tunjangan_pajak'] }}</td>
            <td style="font-weight: bold;">{{ $row['total_pendapatan'] }}</td>

            <!-- Potongan Karyawan -->
            <td>{{ $row['jht_kar'] }}</td>
            <td>{{ $row['jp_kar'] }}</td>
            <td>{{ $row['bpjs_kes_kar'] }}</td>
            <td>{{ $row['pph21'] }}</td>
            <td>{{ $row['potongan_lain'] }}</td>
            <td style="font-weight: bold;">{{ $row['total_potongan'] }}</td>

            <!-- THP -->
            <td style="font-weight: bold; background-color: #eff6ff;">{{ $row['gaji_bersih'] }}</td>

            <!-- Iuran Perusahaan -->
            <td>{{ $row['jkk_pers'] }}</td>
            <td>{{ $row['jkm_pers'] }}</td>
            <td>{{ $row['jht_pers'] }}</td>
            <td>{{ $row['jp_pers'] }}</td>
            <td>{{ $row['bpjs_kes_pers'] }}</td>
        </tr>
        @endforeach
    </tbody>

    <!-- Totals Row -->
    <tfoot>
        <tr>
            <td colspan="7" style="text-align: right; font-weight: bold;">TOTAL KESELURUHAN:</td>
            <td style="font-weight: bold;">{{ $sumTotals['gaji_pokok'] }}</td>
            <td style="font-weight: bold;">{{ $sumTotals['tunjangan_jabatan'] }}</td>
            <td style="font-weight: bold;">{{ $sumTotals['tunjangan_kehadiran'] }}</td>
            <td style="font-weight: bold;">{{ $sumTotals['uang_makan'] }}</td>
            <td style="font-weight: bold;">{{ $sumTotals['tunjangan_transportasi'] }}</td>
            <td style="font-weight: bold;">{{ $sumTotals['uang_lembur'] }}</td>
            <td style="font-weight: bold;">{{ $sumTotals['thr'] }}</td>
            <td style="font-weight: bold;">{{ $sumTotals['tunjangan_pajak'] }}</td>
            <td style="font-weight: bold;">{{ $sumTotals['total_pendapatan'] }}</td>

            <td style="font-weight: bold;">{{ $sumTotals['jht_kar'] }}</td>
            <td style="font-weight: bold;">{{ $sumTotals['jp_kar'] }}</td>
            <td style="font-weight: bold;">{{ $sumTotals['bpjs_kes_kar'] }}</td>
            <td style="font-weight: bold;">{{ $sumTotals['pph21'] }}</td>
            <td style="font-weight: bold;">{{ $sumTotals['potongan_lain'] }}</td>
            <td style="font-weight: bold;">{{ $sumTotals['total_potongan'] }}</td>

            <td style="font-weight: bold; background-color: #bfdbfe;">{{ $sumTotals['gaji_bersih'] }}</td>

            <td style="font-weight: bold;">{{ $sumTotals['jkk_pers'] }}</td>
            <td style="font-weight: bold;">{{ $sumTotals['jkm_pers'] }}</td>
            <td style="font-weight: bold;">{{ $sumTotals['jht_pers'] }}</td>
            <td style="font-weight: bold;">{{ $sumTotals['jp_pers'] }}</td>
            <td style="font-weight: bold;">{{ $sumTotals['bpjs_kes_pers'] }}</td>
        </tr>
    </tfoot>
</table>
