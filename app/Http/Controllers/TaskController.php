<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Employee;
use App\Notifications\TaskAssignedNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $employee = Auth::user()->employee;
        if (!$employee) return abort(404);

        $tasks = Task::with(['creator', 'assignee'])
            ->where(function($q) use ($employee) {
                $q->where('assigned_to', $employee->id)
                  ->orWhere('assigned_from', $employee->id);
            })
            ->latest()
            ->get();

        return Inertia::render('tasks/index', [
            'tasks' => $tasks,
            'employees' => Employee::where('is_active', true)->orderBy('nama')->get(['id', 'nama', 'nik']),
        ]);
    }

    public function store(Request $request)
    {
        $employee = Auth::user()->employee;
        if (!$employee) return abort(404);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'assigned_to' => 'nullable|exists:employees,id',
            'category' => 'required|in:one-time,recurring',
            'frequency' => 'nullable|required_if:category,recurring|in:daily,weekly,monthly,yearly',
            'due_date' => 'nullable|date',
        ]);

        $task = Task::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'assigned_from' => $employee->id,
            'assigned_to' => $validated['assigned_to'] ?? $employee->id,
            'category' => $validated['category'],
            'frequency' => $validated['frequency'] ?? null,
            'due_date' => $validated['due_date'] ?? null,
            'is_completed' => false,
            'is_active' => true,
        ]);

        // Notify assignee if it's someone else
        if ($task->assigned_to && $task->assigned_to !== $employee->id) {
            $task->assignee->user?->notify(new TaskAssignedNotification($task));
        }

        return redirect()->back()->with('success', 'Tugas berhasil dibuat.');
    }

    public function complete(Request $request, Task $task)
    {
        $employee = Auth::user()->employee;
        if ($task->assigned_to !== $employee->id) return abort(403);

        $now = now();

        if ($task->category === 'one-time') {
            $task->update([
                'is_completed' => true,
                'last_completed_at' => $now,
            ]);
        } else {
            // For recurring, we just update the last_completed_at
            $task->update([
                'last_completed_at' => $now,
            ]);
        }

        return redirect()->back()->with('success', 'Tugas ditandai sebagai selesai.');
    }

    public function destroy(Task $task)
    {
        $employee = Auth::user()->employee;
        if ($task->assigned_from !== $employee->id && !Auth::user()->isAdmin()) {
            return abort(403);
        }

        $task->delete();
        return redirect()->back()->with('success', 'Tugas berhasil dihapus.');
    }

    /**
     * Generate WhatsApp deep link for the assigned employee.
     */
    public function whatsappUrl(Task $task)
    {
        $task->load(['assignee', 'creator']);
        $assignee = $task->assignee;
        $creator = $task->creator;

        if (!$assignee || !$assignee->no_telpon_1) {
            return redirect()->back()->with('error', 'Nomor WhatsApp penerima tidak ditemukan.');
        }

        // Format phone
        $phone = preg_replace('/[^0-9]/', '', $assignee->no_telpon_1);
        if (str_starts_with($phone, '0')) {
            $phone = '62' . substr($phone, 1);
        } elseif (!str_starts_with($phone, '62')) {
            $phone = '62' . $phone;
        }

        $dueDate = $task->due_date ? $task->due_date->format('d/m/Y') : '-';
        $typeLabel = $task->category === 'recurring' ? ucfirst($task->frequency) : 'Sekali Saja';

        $message = "Halo *{$assignee->nama}*,\n\n" .
                   "Anda telah diberikan tugas baru oleh *{$creator->nama}* :\n\n" .
                   "📌 *Tugas:* {$task->title}\n" .
                   "📝 *Deskripsi:* " . ($task->description ?: '-') . "\n" .
                   "📅 *Batas Waktu:* {$dueDate}\n" .
                   "🔄 *Jenis:* {$typeLabel}\n\n" .
                   "Silahkan cek dashboard HRIS Anda untuk melihat detail tugas dan menandai jika sudah selesai.\n\n" .
                   "Buka link dibawah ini :\n" .
                   "https://hris.bangunbejanabaja.com/dashboard";

        $url = 'https://wa.me/' . $phone . '?text=' . urlencode($message);

        return redirect()->away($url);
    }
}
