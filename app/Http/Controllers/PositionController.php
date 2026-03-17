<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Position;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PositionController extends Controller
{
    public function index(Request $request)
    {
        $positions = Position::with('department')
            ->withCount('employees')
            ->when($request->search, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%");
            })
            ->when($request->department_id, function ($q, $deptId) {
                $q->where('department_id', $deptId);
            })
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('positions/index', [
            'positions' => $positions,
            'departments' => Department::orderBy('name')->get(['id', 'name']),
            'filters' => $request->only('search', 'department_id'),
        ]);
    }

    public function create()
    {
        return Inertia::render('positions/form', [
            'departments' => Department::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'department_id' => 'required|exists:departments,id',
            'grade' => 'required|in:staff,supervisor,manager',
        ]);

        Position::create($validated);

        return redirect()->route('positions.index')
            ->with('success', 'Jabatan berhasil ditambahkan.');
    }

    public function edit(Position $position)
    {
        return Inertia::render('positions/form', [
            'position' => $position,
            'departments' => Department::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Position $position)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'department_id' => 'required|exists:departments,id',
            'grade' => 'required|in:staff,supervisor,manager',
        ]);

        $position->update($validated);

        return redirect()->route('positions.index')
            ->with('success', 'Jabatan berhasil diperbarui.');
    }

    public function destroy(Position $position)
    {
        if ($position->employees()->exists()) {
            return back()->with('error', 'Jabatan tidak bisa dihapus karena masih memiliki karyawan.');
        }

        $position->delete();

        return redirect()->route('positions.index')
            ->with('success', 'Jabatan berhasil dihapus.');
    }
}
