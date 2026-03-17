<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    public function index(Request $request)
    {
        $departments = Department::withCount('employees', 'positions')
            ->when($request->search, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('departments/index', [
            'departments' => $departments,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('departments/form');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:departments,code',
        ]);

        Department::create($validated);

        return redirect()->route('departments.index')
            ->with('success', 'Departemen berhasil ditambahkan.');
    }

    public function edit(Department $department)
    {
        return Inertia::render('departments/form', [
            'department' => $department,
        ]);
    }

    public function update(Request $request, Department $department)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:departments,code,' . $department->id,
        ]);

        $department->update($validated);

        return redirect()->route('departments.index')
            ->with('success', 'Departemen berhasil diperbarui.');
    }

    public function destroy(Department $department)
    {
        if ($department->employees()->exists()) {
            return back()->with('error', 'Departemen tidak bisa dihapus karena masih memiliki karyawan.');
        }

        $department->delete();

        return redirect()->route('departments.index')
            ->with('success', 'Departemen berhasil dihapus.');
    }
}
