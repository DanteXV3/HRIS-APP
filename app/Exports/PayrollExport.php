<?php

namespace App\Exports;

use App\Models\Payroll;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class PayrollExport implements WithMultipleSheets
{
    use Exportable;

    protected $payroll;

    public function __construct(Payroll $payroll)
    {
        $this->payroll = $payroll;
    }

    public function sheets(): array
    {
        $sheets = [];

        // Group items by Work Location (company)
        $groupedItems = $this->payroll->items->groupBy(function($item) {
            return $item->work_location_name ?? ($item->employee->workLocation ? $item->employee->workLocation->name : 'Tanpa Perusahaan');
        });

        foreach ($groupedItems as $companyName => $items) {
            $sheets[] = new PayrollCompanySheet($this->payroll, $companyName, $items);
        }

        return $sheets;
    }
}
