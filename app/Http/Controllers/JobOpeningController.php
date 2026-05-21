<?php

namespace App\Http\Controllers;

use App\Models\JobOpening;
use App\Models\JobApplication;
use App\Models\WorkLocation;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JobOpeningController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        abort_unless($user->hasPermission('view-job-opening') || $user->hasPermission('create-job-opening'), 403);

        $query = JobOpening::withCount('applications')
            ->orderBy('created_at', 'desc');

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('position', 'like', "%{$request->search}%")
                  ->orWhere('company', 'like', "%{$request->search}%");
            });
        }

        if ($request->status && in_array($request->status, ['open', 'closed'])) {
            $query->where('status', $request->status);
        }

        return Inertia::render('JobOpenings/Index', [
            'openings' => $query->paginate(15),
            'filters' => $request->only('search', 'status'),
        ]);
    }

    public function create(Request $request)
    {
        abort_unless($request->user()->hasPermission('create-job-opening'), 403);

        $companies = WorkLocation::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('JobOpenings/Create', [
            'companies' => $companies,
        ]);
    }

    public function store(Request $request)
    {
        abort_unless($request->user()->hasPermission('create-job-opening'), 403);

        $validated = $request->validate([
            'company' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'working_location' => 'required|string|max:255',
            'requested_by' => 'required|string|max:255',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|min:0',
            'contract_duration' => 'nullable|string|max:255',
            'requirements' => 'nullable|array',
            'requirements.*' => 'string|max:500',
        ]);

        $validated['created_by'] = auth()->id();

        $opening = JobOpening::create($validated);

        return redirect()->route('job-openings.show', $opening->id)
            ->with('success', 'Lowongan berhasil dibuat.');
    }

    public function show(Request $request, JobOpening $jobOpening)
    {
        $user = $request->user();
        abort_unless($user->hasPermission('view-job-opening') || $user->hasPermission('create-job-opening'), 403);

        $jobOpening->load(['applications' => function ($q) {
            $q->orderBy('created_at', 'desc');
        }, 'applications.discTest', 'applications.mbtiTest']);

        return Inertia::render('JobOpenings/Show', [
            'opening' => $jobOpening,
            'publicUrl' => $jobOpening->public_url,
        ]);
    }

    public function update(Request $request, JobOpening $jobOpening)
    {
        abort_unless($request->user()->hasPermission('create-job-opening'), 403);

        $validated = $request->validate([
            'status' => 'sometimes|in:open,closed',
            'company' => 'sometimes|string|max:255',
            'position' => 'sometimes|string|max:255',
            'working_location' => 'sometimes|string|max:255',
            'requested_by' => 'sometimes|string|max:255',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|min:0',
            'contract_duration' => 'nullable|string|max:255',
            'requirements' => 'nullable|array',
        ]);

        $jobOpening->update($validated);

        return redirect()->back()->with('success', 'Lowongan berhasil diperbarui.');
    }

    public function destroy(Request $request, JobOpening $jobOpening)
    {
        abort_unless($request->user()->hasPermission('delete-job-opening'), 403);

        $jobOpening->delete();

        return redirect()->route('job-openings.index')->with('success', 'Lowongan berhasil dihapus.');
    }

    public function updateApplicationStatus(Request $request, JobApplication $application)
    {
        abort_unless($request->user()->hasPermission('create-job-opening'), 403);

        $validated = $request->validate([
            'status' => 'required|in:pending,rejected,interview,accepted',
            'notes' => 'nullable|string|max:1000',
        ]);

        $application->update($validated);

        return redirect()->back()->with('success', 'Status lamaran berhasil diperbarui.');
    }

    public function showApplication(Request $request, JobApplication $application)
    {
        abort_unless($request->user()->hasPermission('view-job-opening') || $request->user()->hasPermission('create-job-opening'), 403);

        $application->load(['jobOpening', 'discTest', 'mbtiTest']);

        return Inertia::render('JobOpenings/ApplicationShow', [
            'application' => $application,
        ]);
    }

    public function printApplicationPdf(Request $request, JobApplication $application)
    {
        abort_unless($request->user()->hasPermission('view-job-opening') || $request->user()->hasPermission('create-job-opening'), 403);

        $application->load(['jobOpening']);

        $pdf = Pdf::loadView('pdfs.recruitment-form', [
            'application' => $application,
            'opening' => $application->jobOpening,
            'form' => is_string($application->recruitment_form) ? json_decode($application->recruitment_form, true) : $application->recruitment_form,
        ]);

        return $pdf->stream('form-lamaran-' . \Str::slug($application->name) . '.pdf');
    }
}
