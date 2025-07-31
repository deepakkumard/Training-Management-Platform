<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Attendance;
use App\Models\Schedule;

class AttendanceController extends Controller
{
    /**
     * Display attendance records for a specific schedule.
     */
    public function index($id)
    {
        $schedule = Schedule::with('enrollments.student.user')->findOrFail($id);

        $attendanceRecords = Attendance::where('schedule_id', $id)
            ->with('student.user')
            ->get();

        return response()->json([
            'schedule' => $schedule,
            'attendance' => $attendanceRecords,
        ]);
    }

    /**
     * Store bulk attendance records for a schedule.
     */
    public function store(Request $request, $id)
    {
        $request->validate([
            'attendance' => 'required|array',
            'attendance.*.student_id' => 'required|exists:students,id',
            'attendance.*.status' => 'required|in:present,absent',
            'attendance.*.notes' => 'nullable|string',
        ]);

        $results = [];

        foreach ($request->attendance as $entry) {
            $record = Attendance::updateOrCreate(
                [
                    'student_id' => $entry['student_id'],
                    'schedule_id' => $id
                ],
                [
                    'student_id' => $entry['student_id'],
                    'schedule_id' => $id,
                    'status' => $entry['status'],
                    'notes' => $entry['notes'] ?? null,
                    'date' => now()->toDateString(),
                ]
            );

            $results[] = $record;
        }

        return response()->json([
            'message' => 'Attendance saved successfully.',
            'records' => $results
        ]);
    }

    /**
     * Update a single attendance record.
     */
    public function update(Request $request, $id)
    {
        $attendance = Attendance::findOrFail($id);

        $request->validate([
            'status' => 'required|in:present,absent',
            'notes' => 'nullable|string',
        ]);

        $attendance->update([
            'status' => $request->status,
            'notes' => $request->notes,
        ]);

        return response()->json([
            'message' => 'Attendance record updated.',
            'record' => $attendance
        ]);
    }
}
