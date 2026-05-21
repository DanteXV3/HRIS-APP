<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Employee;
use App\Models\WorkLocation;
use App\Services\ContractService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class ContractController extends Controller
{
    use AuthorizesRequests;

    protected $contractService;

    public function __construct(ContractService $contractService)
    {
        $this->contractService = $contractService;
    }

    /**
     * Display a listing of contracts for HR.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Contract::class);

        $contracts = Contract::with(['employee.department', 'employee.position', 'workLocation'])
            ->when($request->search, function ($query, $search) {
                $query->whereHas('employee', function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                      ->orWhere('nik', 'like', "%{$search}%");
                })->orWhere('contract_number', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('contracts/index', [
            'contracts' => $contracts,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new contract.
     */
    public function create(Request $request)
    {
        $this->authorize('create', Contract::class);

        $employees = Employee::with(['department', 'position', 'workLocation', 'workingLocation'])
            ->where('is_active', true)
            ->orderBy('nama')
            ->get();

        return Inertia::render('contracts/create', [
            'employees' => $employees,
            'workLocations' => WorkLocation::all(),
        ]);
    }

    /**
     * Store a newly created contract in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Contract::class);

        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'base_salary' => 'required|numeric|min:0',
            'position_allowance' => 'nullable|numeric|min:0',
            'attendance_allowance' => 'nullable|numeric|min:0',
            'transport_allowance' => 'nullable|numeric|min:0',
            'meal_allowance' => 'nullable|numeric|min:0',
            'uang_makan_site' => 'nullable|numeric|min:0',
            'overtime_allowance' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $contract = $this->contractService->createContract($validated, Auth::id());

        return redirect()->route('contracts.index')
            ->with('success', "Kontrak {$contract->contract_number} berhasil dibuat.");
    }

    /**
     * Display the specified contract.
     */
    public function show(Contract $contract)
    {
        $this->authorize('view', $contract);

        $contract->load(['employee.department', 'employee.position', 'workLocation', 'workingLocation', 'creator']);
        
        return Inertia::render('contracts/show', [
            'contract' => $contract,
        ]);
    }

    /**
     * Display the current user's contract.
     */
    public function myContract(Request $request)
    {
        $employee = Employee::where('user_id', $request->user()->id)->first();
        
        if (!$employee) {
            return Inertia::render('contracts/me', [
                'contract' => null,
                'error' => 'Data karyawan tidak ditemukan.'
            ]);
        }

        $contract = Contract::where('employee_id', $employee->id)
            ->where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->first();

        return Inertia::render('contracts/me', [
            'contract' => $contract ? $contract->load(['workLocation', 'workingLocation', 'position']) : null,
        ]);
    }

    /**
     * Generate and download the PDF.
     */
    public function downloadPdf(Contract $contract)
    {
        $this->authorize('view', $contract);
        
        $pdf = $this->contractService->generatePdf($contract);
        
        $filename = str_replace(['/', '\\'], '-', "PKWT_{$contract->second_party_name}_{$contract->contract_number}.pdf");
        return $pdf->download($filename);
    }

    /**
     * Upload signed contract file.
     */
    public function uploadSigned(Request $request, Contract $contract)
    {
        $this->authorize('update', $contract);

        $request->validate([
            'signed_file' => 'required|file|mimes:pdf|max:5120', // 5MB Limit
        ]);

        $this->contractService->uploadSigned($contract, $request->file('signed_file'));

        return back()->with('success', 'Kontrak bertanda tangan berhasil diunggah.');
    }

    /**
     * Remove the specified contract from storage.
     */
    public function destroy(Contract $contract)
    {
        $this->authorize('delete', $contract);

        if ($contract->signed_file) {
            Storage::disk('public')->delete($contract->signed_file);
        }

        $contract->delete();

        return redirect()->route('contracts.index')->with('success', 'Kontrak berhasil dihapus.');
    }
}
