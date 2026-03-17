<?php

namespace App\Exports;

use App\Models\Payroll;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PayrollCompanySheet implements FromView, WithTitle, ShouldAutoSize, WithStyles
{
    protected $payroll;
    protected $companyName;
    protected $items;

    public function __construct(Payroll $payroll, string $companyName, Collection $items)
    {
        $this->payroll = $payroll;
        $this->companyName = $companyName;
        $this->items = $items;
    }

    public function view(): View
    {
        return view('exports.payroll_company', [
            'payroll' => $this->payroll,
            'companyName' => $this->companyName,
            'items' => $this->items
        ]);
    }

    public function title(): string
    {
        // Excel worksheet titles max 31 characters
        return substr($this->companyName, 0, 31);
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true, 'size' => 14]], // Main title
            4 => ['font' => ['bold' => true]],               // Table headers
        ];
    }
}
