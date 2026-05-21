<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Task;
use App\Notifications\TaskAssignedNotification;
use Illuminate\Http\Request;

class TaskApiController extends Controller
{
    /**
     * List tasks assigned to/from the current user.
     * GET /api/tasks
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)->first();

        if (!$employee) {
            return response()->json(['message' => 'Akun tidak terhubung dengan data karyawan.'], 404);
        }

        $tasks = Task::with(['creator', 'assignee'])
            ->where(function ($q) use ($employee) {
                $q->where('assigned_to', $employee->id)
                  ->orWhere('assigned_from', $employee->id);
            })
            ->latest()
            ->get()
            ->map(fn($task) => [
                'id' => $task->id,
                'title' => $task->title,
                'description' => $task->description,
                'creator_name' => $task->creator?->nama,
                'assignee_name' => $task->assignee?->nama,
                'assigned_from' => $task->assigned_from,
                'assigned_to' => $task->assigned_to,
                'category' => $task->category,
                'frequency' => $task->frequency,
                'due_date' => $task->due_date?->format('Y-m-d'),
                'is_completed' => $task->is_completed,
                'is_active' => $task->is_active,
                'last_completed_at' => $task->last_completed_at?->toIso8601String(),
                'created_at' => $task->created_at?->toIso8601String(),
            ]);

        return response()->json(['tasks' => $tasks]);
    }

    /**
     * Create a new task.
     * POST /api/tasks
     */
    public function store(Request $request)
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)->first();

        if (!$employee) {
            return response()->json(['message' => 'Akun tidak terhubung dengan data karyawan.'], 404);
        }

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
            'description' => $validated['description'] ?? null,
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

        return response()->json([
            'message' => 'Tugas berhasil dibuat.',
            'task' => $task->load(['creator', 'assignee']),
        ], 201);
    }

    /**
     * Mark a task as complete.
     * POST /api/tasks/{task}/complete
     */
    public function complete(Request $request, Task $task)
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)->first();

        if (!$employee || $task->assigned_to !== $employee->id) {
            return response()->json(['message' => 'Anda tidak memiliki izin untuk menyelesaikan tugas ini.'], 403);
        }

        $now = now();

        if ($task->category === 'one-time') {
            $task->update([
                'is_completed' => true,
                'last_completed_at' => $now,
            ]);
        } else {
            // For recurring, just update the last_completed_at
            $task->update([
                'last_completed_at' => $now,
            ]);
        }

        return response()->json([
            'message' => 'Tugas ditandai sebagai selesai.',
            'task' => $task->fresh()->load(['creator', 'assignee']),
        ]);
    }

    /**
     * Delete a task (creator only).
     * DELETE /api/tasks/{task}
     */
    public function destroy(Request $request, Task $task)
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)->first();

        if (!$employee || ($task->assigned_from !== $employee->id && !$user->isAdmin())) {
            return response()->json(['message' => 'Anda tidak memiliki izin untuk menghapus tugas ini.'], 403);
        }

        $task->delete();

        return response()->json(['message' => 'Tugas berhasil dihapus.']);
    }

    /**
     * Get active employees list (for assign dropdown).
     * GET /api/tasks/employees
     */
    public function employees()
    {
        $employees = Employee::where('is_active', true)
            ->orderBy('nama')
            ->get(['id', 'nama', 'nik']);

        return response()->json(['employees' => $employees]);
    }
}
