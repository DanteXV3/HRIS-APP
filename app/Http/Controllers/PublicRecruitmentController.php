<?php

namespace App\Http\Controllers;

use App\Models\JobOpening;
use App\Models\JobApplication;
use App\Models\PersonalityTest;
use App\Constants\PsychologyQuestions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PublicRecruitmentController extends Controller
{
    // ── Public Application Form ──────────────────────────────
    public function apply(string $uuid)
    {
        $opening = JobOpening::where('uuid', $uuid)->where('status', 'open')->firstOrFail();

        return Inertia::render('Public/JobApply', [
            'opening' => $opening->only('id', 'uuid', 'company', 'position', 'working_location', 'contract_duration', 'requirements'),
        ]);
    }

    public function submitApplication(Request $request, string $uuid)
    {
        $opening = JobOpening::where('uuid', $uuid)->where('status', 'open')->firstOrFail();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'required|string|max:30',
            'address' => 'nullable|string|max:1000',
            'requirement_checklist' => 'nullable|array',
            'cv_files' => 'nullable|array|max:5',
            'cv_files.*' => 'file|mimes:pdf,doc,docx,jpg,jpeg,png|max:5120',
        ]);

        $uploadedFiles = [];
        if ($request->hasFile('cv_files')) {
            foreach ($request->file('cv_files') as $file) {
                $path = $file->store('cv-uploads/' . $opening->id, 'public');
                $uploadedFiles[] = [
                    'path' => $path,
                    'name' => $file->getClientOriginalName(),
                    'size' => $file->getSize(),
                ];
            }
        }

        JobApplication::create([
            'job_opening_id' => $opening->id,
            'name' => $validated['name'],
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'],
            'address' => $validated['address'] ?? null,
            'requirement_checklist' => $validated['requirement_checklist'] ?? [],
            'cv_files' => $uploadedFiles,
            'status' => 'pending',
        ]);

        return Inertia::render('Public/ThankYou', [
            'type' => 'application',
            'message' => 'Lamaran Anda telah berhasil dikirim. Tim HR kami akan menghubungi Anda untuk proses selanjutnya.',
        ]);
    }

    // ── Recruitment Bio Form ─────────────────────────────────
    public function recruitmentForm(string $uuid)
    {
        $application = JobApplication::where('uuid', $uuid)
            ->whereIn('status', ['interview', 'form_filling'])
            ->with('jobOpening:id,company,position')
            ->firstOrFail();

        if ($application->status === 'interview') {
            $application->update(['status' => 'form_filling']);
        }

        return Inertia::render('Public/RecruitmentForm', [
            'application' => $application->only('id', 'uuid', 'name'),
            'opening' => $application->jobOpening->only('company', 'position'),
        ]);
    }

    public function submitRecruitmentForm(Request $request, string $uuid)
    {
        $application = JobApplication::where('uuid', $uuid)
            ->whereIn('status', ['interview', 'form_filling'])
            ->firstOrFail();

        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'sex' => 'required|in:Laki-laki,Perempuan',
            'current_address' => 'required|string|max:1000',
            'citizenship' => 'required|string|max:100',
            'marital_status' => 'required|string|max:50',
            'religion' => 'required|string|max:50',
            'weight' => 'nullable|string|max:10',
            'height' => 'nullable|string|max:10',
            'hobby' => 'nullable|string|max:500',
            'education' => 'nullable|array',
            'training' => 'nullable|array',
            'organization' => 'nullable|array',
            'skills' => 'nullable|string|max:1000',
            'work_experience' => 'nullable|array',
            'why_interested' => 'nullable|string|max:2000',
            'salary_expectation' => 'nullable|string|max:100',
            'has_relative' => 'nullable|boolean',
            'relative_name' => 'nullable|string|max:255',
            'references' => 'nullable|array',
            'has_serious_illness' => 'nullable|boolean',
            'illness_detail' => 'nullable|string|max:500',
            'certify_true' => 'required|accepted',
        ]);

        $application->update([
            'recruitment_form' => $validated,
            'recruitment_form_submitted_at' => now(),
            'status' => 'testing',
        ]);

        // Redirect to DISC test
        return redirect("/career/disc/{$application->uuid}");
    }

    // ── DISC Test (Public) ───────────────────────────────────
    public function discTest(string $uuid)
    {
        $application = JobApplication::where('uuid', $uuid)
            ->whereIn('status', ['testing'])
            ->whereNull('personality_test_id')
            ->with('jobOpening:id,company,position')
            ->firstOrFail();

        return Inertia::render('Public/DiscTest', [
            'application' => $application->only('id', 'uuid', 'name'),
            'opening' => $application->jobOpening->only('company', 'position'),
            'questions' => PsychologyQuestions::getDiscQuestions(),
        ]);
    }

    public function submitDiscTest(Request $request, string $uuid)
    {
        $application = JobApplication::where('uuid', $uuid)
            ->where('status', 'testing')
            ->whereNull('personality_test_id')
            ->firstOrFail();

        $validated = $request->validate([
            'answers' => 'required|array|size:24',
        ]);

        $results = $this->calculateDiscResults($validated['answers']);

        $test = PersonalityTest::create([
            'candidate_name' => $application->name,
            'candidate_info' => $application->jobOpening?->position ?? 'Recruitment',
            'test_type' => 'disc',
            'answers' => $validated['answers'],
            'results' => $results,
            'tester_id' => null,
        ]);

        $application->update(['personality_test_id' => $test->id]);

        // Redirect to MBTI test
        return redirect("/career/mbti/{$application->uuid}");
    }

    // ── MBTI Test (Public) ───────────────────────────────────
    public function mbtiTest(string $uuid)
    {
        $application = JobApplication::where('uuid', $uuid)
            ->where('status', 'testing')
            ->whereNotNull('personality_test_id')
            ->whereNull('mbti_test_id')
            ->with('jobOpening:id,company,position')
            ->firstOrFail();

        return Inertia::render('Public/MbtiTest', [
            'application' => $application->only('id', 'uuid', 'name'),
            'opening' => $application->jobOpening->only('company', 'position'),
            'questions' => PsychologyQuestions::getMbtiQuestions(),
        ]);
    }

    public function submitMbtiTest(Request $request, string $uuid)
    {
        $application = JobApplication::where('uuid', $uuid)
            ->where('status', 'testing')
            ->whereNull('mbti_test_id')
            ->firstOrFail();

        $validated = $request->validate([
            'answers' => 'required|array|size:35',
        ]);

        $results = $this->calculateMbtiResults($validated['answers']);

        $test = PersonalityTest::create([
            'candidate_name' => $application->name,
            'candidate_info' => $application->jobOpening?->position ?? 'Recruitment',
            'test_type' => 'mbti',
            'answers' => $validated['answers'],
            'results' => $results,
            'tester_id' => null,
        ]);

        $application->update([
            'mbti_test_id' => $test->id,
            'status' => 'completed',
        ]);

        return Inertia::render('Public/ThankYou', [
            'type' => 'complete',
            'message' => 'Selamat! Anda telah menyelesaikan seluruh proses pengisian formulir dan tes kepribadian. Tim HR kami akan segera menghubungi Anda untuk tahap selanjutnya.',
        ]);
    }

    // ── Score Calculators (reused from PersonalityTestController) ──
    private function calculateDiscResults($answers)
    {
        $scores = ['D' => 0, 'I' => 0, 'S' => 0, 'C' => 0];
        foreach ($answers as $ans) {
            if (isset($ans['most']) && isset($scores[$ans['most']])) $scores[$ans['most']]++;
            if (isset($ans['least']) && isset($scores[$ans['least']])) $scores[$ans['least']]--;
        }
        $traitMap = ['D' => 'Dominance', 'I' => 'Influence', 'S' => 'Steadiness', 'C' => 'Conscientiousness'];
        $dominant = collect($scores)->sortDesc()->keys()->first();
        return ['scores' => $scores, 'dominant_trait' => $dominant, 'trait_name' => $traitMap[$dominant] ?? 'Unknown'];
    }

    private function calculateMbtiResults($answers)
    {
        $counts = ['E' => 0, 'I' => 0, 'S' => 0, 'N' => 0, 'T' => 0, 'F' => 0, 'J' => 0, 'P' => 0];
        foreach ($answers as $code) {
            if (isset($counts[$code])) $counts[$code]++;
        }
        $type = '';
        $type .= $counts['E'] >= $counts['I'] ? 'E' : 'I';
        $type .= $counts['S'] >= $counts['N'] ? 'S' : 'N';
        $type .= $counts['T'] >= $counts['F'] ? 'T' : 'F';
        $type .= $counts['J'] >= $counts['P'] ? 'J' : 'P';
        return ['counts' => $counts, 'type' => $type];
    }
}
