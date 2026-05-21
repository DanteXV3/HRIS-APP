<?php

namespace App\Http\Controllers;

use App\Models\Holiday;
use Illuminate\Http\Request;

class HolidayController extends Controller
{
    private function checkPermission()
    {
        if (!auth()->user()->role === 'admin' && !auth()->user()->hasPermission('holiday.manage')) {
            abort(403);
        }
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->checkPermission();
        return \Inertia\Inertia::render('holidays/index', [
            'holidays' => Holiday::orderBy('date', 'desc')->get()
        ]);
    }

    public function create()
    {
        $this->checkPermission();
        return \Inertia\Inertia::render('holidays/form');
    }

    public function store(Request $request)
    {
        $this->checkPermission();
        $validated = $request->validate([
            'date' => 'required|date|unique:holidays,date',
            'name' => 'required|string|max:255',
        ]);

        Holiday::create($validated);
        return redirect()->route('holidays.index')->with('success', 'Hari libur berhasil ditambahkan.');
    }

    public function edit(Holiday $holiday)
    {
        $this->checkPermission();
        return \Inertia\Inertia::render('holidays/form', [
            'holiday' => $holiday
        ]);
    }

    public function update(Request $request, Holiday $holiday)
    {
        $this->checkPermission();
        $validated = $request->validate([
            'date' => 'required|date|unique:holidays,date,' . $holiday->id,
            'name' => 'required|string|max:255',
        ]);

        $holiday->update($validated);
        return redirect()->route('holidays.index')->with('success', 'Hari libur berhasil diperbarui.');
    }

    public function destroy(Holiday $holiday)
    {
        $this->checkPermission();
        $holiday->delete();
        return redirect()->route('holidays.index')->with('success', 'Hari libur berhasil dihapus.');
    }
}
