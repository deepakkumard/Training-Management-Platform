<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EnrollmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(
            Enrollment::with(['student.user', 'trainingSchedule.course', 'trainingSchedule.instructor.user'])->get()
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'training_schedule_id' => 'required|exists:schedules,id',
            'status' => 'required|string|in:enrolled,completed,cancelled',
            'enrolled_at' => 'required|date',
            'completed_at' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        return response()->json(Enrollment::create($validated), 201);
    }


    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $enrollment = Enrollment::with('student.user', 'trainingSchedule.course', 'trainingSchedule.instructor.user')->findOrFail($id);
        return response()->json($enrollment);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Enrollment $enrollment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $enrollment = Enrollment::findOrFail($id);

        $validated = $request->validate([
            'student_id'            => 'exists:students,id',
            'training_schedule_id'  => 'exists:schedules,id',
            'status'                => 'in:enrolled,completed,cancelled',
            'enrolled_at'           => 'nullable|date',
            'completed_at'          => 'nullable|date|after_or_equal:enrolled_at',
            'notes'                 => 'nullable|string',
        ]);

        $enrollment->update($validated);

        return response()->json([
            'message'     => 'Enrollment updated successfully.',
            'enrollment'  => $enrollment
        ]);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Enrollment $enrollment): JsonResponse {
        $enrollment->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
