<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse {
        return response()->json(Schedule::with(['course', 'instructor'])->get());
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
        $data = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'instructor_id' => 'required|exists:instructors,id',
            'title' => 'required|string|max:255',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'location' => 'nullable|string',
            'mode' => 'required|string|in:online,offline,hybrid',
            'is_recurring' => 'required|boolean',
            'max_enrollments' => 'nullable|integer',
            'status' => 'required|in:scheduled,completed,cancelled',
        ]);

        return response()->json(Schedule::create($data), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $schedule = Schedule::with('course', 'instructor', 'enrollments')->find($id);

        if (!$schedule) {
            return response()->json(['message' => 'Schedule not found'], 404);
        }
        return response()->json($schedule);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Schedule $schedule)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $schedule = Schedule::findOrFail($id);

        $data = $request->validate([
            'course_id' => 'sometimes|exists:courses,id',
            'instructor_id' => 'sometimes|exists:instructors,id',
            'title' => 'sometimes|string|max:255',
            'start_time' => 'sometimes|date',
            'end_time' => 'sometimes|date|after:start_time',
            'location' => 'nullable|string',
            'mode' => 'sometimes|string|in:online,offline,hybrid',
            'is_recurring' => 'sometimes|boolean',
            'max_enrollments' => 'nullable|integer',
            'status' => 'sometimes|in:scheduled,completed,cancelled',
        ]);

        $schedule->update($data);

        return response()->json($schedule);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Schedule $schedule): JsonResponse {
        $schedule->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
