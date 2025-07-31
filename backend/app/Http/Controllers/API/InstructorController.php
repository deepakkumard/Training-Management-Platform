<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Instructor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class InstructorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse {
        return response()->json(Instructor::all());
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
            'designation' => 'required|string',
            'bio' => 'nullable|string',
            'expertise' => 'nullable|array',
            'status' => 'boolean',
        ]);

        $validated['expertise'] = json_encode($validated['expertise']);
        return response()->json(Instructor::create($validated), 201);
    }


    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $instructor = Instructor::with('user', 'schedules.course')->findOrFail($id);
        return response()->json($instructor);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Instructor $instructor)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $instructor = Instructor::with('user')->findOrFail($id);

        $validated = $request->validate([
            'name'        => 'sometimes|required|string',
            'email'       => 'sometimes|required|email|unique:users,email,' . $instructor->user_id,
            'phone'       => 'sometimes|nullable|string',
            'status'      => 'boolean',
            'designation' => 'sometimes|string',
            'bio'         => 'sometimes|string',
            'expertise'   => 'sometimes|array',
        ]);

        $instructor->user->update([
            'name'   => $validated['name'] ?? $instructor->user->name,
            'email'  => $validated['email'] ?? $instructor->user->email,
            'phone'  => $validated['phone'] ?? $instructor->user->phone,
            'status' => $validated['status'] ?? $instructor->user->status,
        ]);

        $instructor->update([
            'designation' => $validated['designation'] ?? $instructor->designation,
            'bio'         => $validated['bio'] ?? $instructor->bio,
            'expertise'   => $validated['expertise'] ?? $instructor->expertise,
            'status'      => $validated['status'] ?? $instructor->status,
        ]);

        return response()->json([
            'message'    => 'Instructor updated successfully.',
            'instructor' => $instructor->load('user')
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Instructor $instructor): JsonResponse {
        $instructor->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
