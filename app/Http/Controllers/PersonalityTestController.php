<?php

namespace App\Http\Controllers;

use App\Models\PersonalityTest;
use App\Constants\PsychologyQuestions;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;

class PersonalityTestController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $canViewAll = $user->hasPermission('view-recruitment');
        $canCreate = $user->hasPermission('create-recruitment');

        // Must have at least one recruitment permission to access
        abort_unless($canViewAll || $canCreate, 403);

        $query = PersonalityTest::with('tester');

        // If user doesn't have 'view-recruitment', only show their own tests
        if (!$canViewAll) {
            $query->where('tester_id', $user->employee?->id);
        }

        if ($request->search) {
            $query->where('candidate_name', 'like', "%{$request->search}%");
        }

        return Inertia::render('Recruitment/Index', [
            'tests' => $query->orderBy('created_at', 'desc')->paginate(15),
            'filters' => $request->only('search')
        ]);
    }

    public function createDisc(Request $request)
    {
        abort_unless($request->user()->hasPermission('create-recruitment'), 403);

        return Inertia::render('Recruitment/DiscForm', [
            'questions' => $this->getDiscQuestions()
        ]);
    }

    public function storeDisc(Request $request)
    {
        abort_unless($request->user()->hasPermission('create-recruitment'), 403);

        $validated = $request->validate([
            'candidate_name' => 'required|string|max:255',
            'candidate_info' => 'nullable|string|max:255',
            'answers' => 'required|array|size:24', // 24 groups
        ]);

        $results = $this->calculateDiscResults($validated['answers']);

        $test = PersonalityTest::create([
            'candidate_name' => $validated['candidate_name'],
            'candidate_info' => $validated['candidate_info'],
            'test_type' => 'disc',
            'answers' => $validated['answers'],
            'results' => $results,
            'tester_id' => auth()->user()->employee?->id,
        ]);

        return redirect()->route('recruitment.show', $test->id);
    }

    public function createMbti(Request $request)
    {
        abort_unless($request->user()->hasPermission('create-recruitment'), 403);

        return Inertia::render('Recruitment/MbtiForm', [
            'questions' => $this->getMbtiQuestions()
        ]);
    }

    public function storeMbti(Request $request)
    {
        abort_unless($request->user()->hasPermission('create-recruitment'), 403);

        $validated = $request->validate([
            'candidate_name' => 'required|string|max:255',
            'candidate_info' => 'nullable|string|max:255',
            'answers' => 'required|array|size:35', // Match expanded questions
        ]);

        $results = $this->calculateMbtiResults($validated['answers']);

        $test = PersonalityTest::create([
            'candidate_name' => $validated['candidate_name'],
            'candidate_info' => $validated['candidate_info'],
            'test_type' => 'mbti',
            'answers' => $validated['answers'],
            'results' => $results,
            'tester_id' => auth()->user()->employee?->id,
        ]);

        return redirect()->route('recruitment.show', $test->id);
    }

    public function show(Request $request, PersonalityTest $test)
    {
        $user = $request->user();
        $canViewAll = $user->hasPermission('view-recruitment');
        $isOwner = $test->tester_id === $user->employee?->id;

        abort_unless($canViewAll || $isOwner, 403);

        $test->load('tester');
        return Inertia::render('Recruitment/Show', [
            'test' => $test
        ]);
    }

    public function update(Request $request, PersonalityTest $test)
    {
        abort_unless($request->user()->hasPermission('edit-recruitment'), 403);

        $validated = $request->validate([
            'candidate_name' => 'required|string|max:255',
            'candidate_info' => 'nullable|string',
        ]);

        $test->update($validated);

        return redirect()->back()->with('success', 'Candidate updated successfully');
    }

    public function destroy(Request $request, PersonalityTest $test)
    {
        abort_unless($request->user()->hasPermission('delete-recruitment'), 403);

        $test->delete();

        return redirect()->route('recruitment.index')->with('success', 'Test deleted successfully');
    }

    public function downloadPdf(Request $request, PersonalityTest $test)
    {
        $user = $request->user();
        $canViewAll = $user->hasPermission('view-recruitment');
        $isOwner = $test->tester_id === $user->employee?->id;
        abort_unless($canViewAll || $isOwner, 403);

        $test->load('tester');
        $pdf = Pdf::loadView('pdfs.psikotes-report', ['test' => $test]);
        return $pdf->download("Hasil-Tes-{$test->candidate_name}.pdf");
    }

    public function downloadBlankDisc(Request $request)
    {
        abort_unless($request->user()->hasPermission('view-recruitment') || $request->user()->hasPermission('create-recruitment'), 403);

        $questions = $this->getDiscQuestions();
        $pdf = Pdf::loadView('pdfs.psikotes-disc-blank', ['questions' => $questions]);
        return $pdf->download('Form-Kosong-Tes-DISC.pdf');
    }

    public function downloadBlankMbti(Request $request)
    {
        abort_unless($request->user()->hasPermission('view-recruitment') || $request->user()->hasPermission('create-recruitment'), 403);

        $questions = $this->getMbtiQuestions();
        $pdf = Pdf::loadView('pdfs.psikotes-mbti-blank', ['questions' => $questions]);
        return $pdf->download('Form-Kosong-Tes-MBTI.pdf');
    }

    private function getDiscQuestions()
    {
        return PsychologyQuestions::getDiscQuestions();
    }

    private function calculateDiscResults($answers)
    {
        // answers: [ group_id => [ 'most' => code, 'least' => code ] ]
        $scores = ['D' => 0, 'I' => 0, 'S' => 0, 'C' => 0];
        
        foreach ($answers as $group_id => $ans) {
            if (isset($ans['most']) && isset($scores[$ans['most']])) {
                $scores[$ans['most']]++;
            }
            if (isset($ans['least']) && isset($scores[$ans['least']])) {
                $scores[$ans['least']]--;
            }
        }

        // Standardize: ensure no negative scores if preferred, or just return raw
        $traitMap = [
            'D' => 'Dominance',
            'I' => 'Influence',
            'S' => 'Steadiness',
            'C' => 'Conscientiousness'
        ];

        $dominant = collect($scores)->sortDesc()->keys()->first();

        return [
            'scores' => $scores,
            'dominant_trait' => $dominant,
            'trait_name' => $traitMap[$dominant] ?? 'Unknown'
        ];
    }

    private function getMbtiQuestions()
    {
        return PsychologyQuestions::getMbtiQuestions();
    }

    private function calculateMbtiResults($answers)
    {
        // $answers is [ question_id => code ]
        $counts = ['E' => 0, 'I' => 0, 'S' => 0, 'N' => 0, 'T' => 0, 'F' => 0, 'J' => 0, 'P' => 0];
        
        foreach ($answers as $q_id => $code) {
            if (isset($counts[$code])) $counts[$code]++;
        }

        $type = '';
        $type .= $counts['E'] >= $counts['I'] ? 'E' : 'I';
        $type .= $counts['S'] >= $counts['N'] ? 'S' : 'N';
        $type .= $counts['T'] >= $counts['F'] ? 'T' : 'F';
        $type .= $counts['J'] >= $counts['P'] ? 'J' : 'P';

        return [
            'counts' => $counts,
            'type' => $type
        ];
    }
}
