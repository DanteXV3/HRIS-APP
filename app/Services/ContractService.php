<?php

namespace App\Services;

use App\Models\Contract;
use App\Models\Employee;
use App\Models\WorkLocation;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Exception;

class ContractService
{
    /**
     * Prepare data and create a new contract record.
     */
    public function createContract(array $data, int $creatorId): Contract
    {
        $employee = Employee::with(['workLocation', 'workingLocation', 'position'])->findOrFail($data['employee_id']);
        $workLocation = WorkLocation::findOrFail($employee->work_location_id);
        
        // Generate Contract Number if not provided
        $contractNumber = $data['contract_number'] ?? $this->generateContractNumber($employee);

        return Contract::create(array_merge($data, [
            'contract_number' => $contractNumber,
            'work_location_id' => $employee->work_location_id,
            'working_location_id' => $employee->working_location_id,
            'position_id' => $employee->position_id,
            
            // Pihak Pertama (Company/Director) Snapshots
            'first_party_name' => $workLocation->director_name ?? 'Direktur Utama',
            'first_party_position' => $workLocation->director_position ?? 'Direktur',
            'first_party_address' => $workLocation->director_address ?? $workLocation->address,
            
            // Pihak Kedua (Employee) Snapshots
            'second_party_name' => $employee->nama,
            'second_party_nik' => $employee->nik,
            'second_party_gender' => $employee->gender,
            'second_party_pob' => $employee->tempat_lahir,
            'second_party_dob' => $employee->tanggal_lahir,
            'second_party_address' => $employee->alamat_tetap,
            'second_party_position' => $employee->position?->name,
            
            'created_by' => $creatorId,
        ]));
    }

    /**
     * Generate PDF for a contract.
     */
    public function generatePdf(Contract $contract)
    {
        $contract->load(['employee', 'workLocation', 'workingLocation', 'position']);
        
        $pdf = Pdf::loadView('pdf.pkwt', [
            'contract' => $contract,
            'company' => $contract->workLocation,
        ]);

        return $pdf;
    }

    /**
     * Handle signed contract upload.
     */
    public function uploadSigned(Contract $contract, $file): string
    {
        if ($contract->signed_file) {
            Storage::disk('public')->delete($contract->signed_file);
        }

        $path = $file->store('contracts/signed', 'public');
        $contract->update(['signed_file' => $path]);

        return $path;
    }

    /**
     * Generate a unique contract number.
     * Format: CT-[COMP_CODE].HRD-[LOC_CODE]-[SEQ]-[MONTH]-[YEAR]
     */
    private function generateContractNumber(Employee $employee): string
    {
        $year = date('Y');
        $month = date('m');
        $workLocation = $employee->workLocation;
        $workingLocation = $employee->workingLocation;
        
        $compCode = $workLocation->code ?? 'BBB';
        $locationCode = $workingLocation ? strtoupper(substr(str_replace(' ', '', $workingLocation->name), 0, 3)) : 'HO';
        
        $lastContract = Contract::whereYear('created_at', $year)
            ->orderBy('id', 'desc')
            ->first();
            
        $nextId = $lastContract ? ($lastContract->id + 1) : 1;
        $sequence = str_pad($nextId, 3, '0', STR_PAD_LEFT);

        return "CT-{$compCode}.HRD-{$locationCode}-{$sequence}-{$this->getRomanMonth($month)}-{$year}";
    }

    private function getRomanMonth($month): string
    {
        $map = [
            '01' => 'I', '02' => 'II', '03' => 'III', '04' => 'IV', '05' => 'V', '06' => 'VI',
            '07' => 'VII', '08' => 'VIII', '09' => 'IX', '10' => 'X', '11' => 'XI', '12' => 'XII'
        ];
        return $map[$month] ?? $month;
    }
}
