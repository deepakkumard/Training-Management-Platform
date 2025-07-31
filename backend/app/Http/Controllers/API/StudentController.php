<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse {
        return response()->json(Student::all());
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
            'user_id' => 'required|exists:users,id',
            'student_code' => 'required|unique:students',
            'phone' => 'nullable|string',
            'status' => 'boolean',
        ]);

        return response()->json(Student::create($validated), 201);
    }


    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $student = Student::with('user', 'enrollments.trainingSchedule.course')->findOrFail($id);
        return response()->json($student);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Student $student)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $student = Student::with('user')->findOrFail($id);

        // Validate input
        $validated = $request->validate([
            'name'     => 'sometimes|required|string',
            'email'    => 'sometimes|required|email|unique:users,email,' . $student->user_id,
            'phone'    => 'sometimes|nullable|string',
            'status'   => 'boolean',
            'student_code' => 'sometimes|string',
        ]);

        // Update user data
        $student->user->update([
            'name'   => $validated['name'] ?? $student->user->name,
            'email'  => $validated['email'] ?? $student->user->email,
            'phone'  => $validated['phone'] ?? $student->user->phone,
            'status' => $validated['status'] ?? $student->user->status,
        ]);

        // Update student profile data
        $student->update([
            'student_code' => $validated['student_code'] ?? $student->student_code,
            'phone'        => $validated['phone'] ?? $student->phone,
            'status'       => $validated['status'] ?? $student->status,
        ]);

        return response()->json([
            'message' => 'Student updated successfully.',
            'student' => $student->load('user')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $student): JsonResponse
    {
        $student->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
