<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Course::all());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
            'level' => 'nullable|string',
            'duration_hours' => 'nullable|integer',
            'max_students' => 'nullable|integer',
            'status' => 'boolean',
        ]);

        return response()->json(Course::create($validated), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $course = Course::with('schedules')->findOrFail($id);
        return response()->json($course);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Course $course)
    {

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);

        $validated = $request->validate([
            'title'         => 'required|string|max:255',
            'description'   => 'nullable|string',
            'category'      => 'nullable|string',
            'level'         => 'nullable|string',
            'duration_hours'=> 'nullable|integer',
            'max_students'  => 'nullable|integer',
            'status'        => 'boolean',
        ]);

        $course->update($validated);

        return response()->json([
            'message' => 'Course updated successfully.',
            'course'  => $course
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course)
    {
        $course->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
