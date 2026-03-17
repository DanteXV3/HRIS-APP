<?php

namespace App\Http\Controllers;

use App\Models\Shift;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShiftController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        
        $shifts = Shift::when($search, function ($query, $search) {
            $query->where('name', 'like', "%{$search}%");
        })
        ->orderBy('name')
        ->paginate(10)
        ->withQueryString();

        return Inertia::render('shifts/index', [
            'shifts' => $shifts,
            'filters' => $request->only('search'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'jam_masuk' => 'required|date_format:H:i',
            'jam_pulang' => 'required|date_format:H:i',
        ]);

        Shift::create($validated);

        return redirect()->back()->with('success', 'Shift berhasil ditambahkan.');
    }

    public function update(Request $request, Shift $shift)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'jam_masuk' => 'required|date_format:H:i',
            'jam_pulang' => 'required|date_format:H:i',
        ]);

        $shift->update($validated);

        return redirect()->back()->with('success', 'Shift berhasil diperbarui.');
    }

    public function destroy(Shift $shift)
    {
        if ($shift->employees()->exists()) {
            return redirect()->back()->with('error', 'Tidak dapat menghapus Shift karena masih digunakan oleh Karyawan.');
        }

        $shift->delete();

        return redirect()->back()->with('success', 'Shift berhasil dihapus.');
    }
}
