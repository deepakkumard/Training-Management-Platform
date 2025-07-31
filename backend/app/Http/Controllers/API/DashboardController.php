<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Instructor;
use App\Models\Student;
use App\Models\Schedule;
use App\Models\Enrollment;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'total_courses' => Course::count(),
            'total_students' => Student::count(),
            'total_instructors' => Instructor::count(),
            'total_trainings' => Schedule::count(),
            'upcoming_trainings' => Schedule::where('start_time', '>', now())->count(),
            'active_enrollments' => Enrollment::where('status', 'enrolled')->count(),
            'top_courses' => Course::latest()->take(3)->get(),
        ]);
    }

    public function activity(): JsonResponse
    {
        $activities = [
            [
                'message' => 'New student John Doe enrolled in React Development course',
                'time' => Carbon::now()->subHours(2)->diffForHumans(),
            ],
            [
                'message' => 'Training session "Advanced JavaScript" completed successfully',
                'time' => Carbon::now()->subHours(4)->diffForHumans(),
            ],
            [
                'message' => 'New course "Project Management" created by Sarah Wilson',
                'time' => Carbon::now()->subHours(6)->diffForHumans(),
            ],
            [
                'message' => 'Training schedule updated for "Web Development Bootcamp"',
                'time' => Carbon::now()->subHours(8)->diffForHumans(),
            ],
        ];

        return response()->json([
            'recent_activity' => $activities,
        ]);
    }

}
