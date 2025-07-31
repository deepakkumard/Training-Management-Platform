<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\{AuthController, CourseController, StudentController, InstructorController, ScheduleController, EnrollmentController, DashboardController};
use App\Http\Controllers\API\AttendanceController;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;

RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)->by(optional($request->user())->id ?: $request->ip());
});


Route::middleware(['api'])->prefix('v1')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login'])->name('login');

    Route::middleware('auth.api:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('profile', [AuthController::class, 'profile']);
        Route::get('dashboard/stats', [DashboardController::class, 'index']);
        Route::get('dashboard/activity', [DashboardController::class, 'activity']);

        Route::apiResource('courses', CourseController::class);
        Route::apiResource('students', StudentController::class);
        Route::apiResource('instructors', InstructorController::class);
        Route::apiResource('schedules', ScheduleController::class);
        Route::apiResource('enrollments', EnrollmentController::class);

        Route::get('dashboard/stats', [DashboardController::class, 'index']);
        Route::post('training/{id}/optin', [EnrollmentController::class, 'optIn']);
        Route::delete('training/{id}/optout', [EnrollmentController::class, 'optOut']);
        Route::get('training/{id}/attendance/pdf', [ScheduleController::class, 'exportAttendance']);

        Route::get('/training/{id}/attendance', [AttendanceController::class, 'index']);
        Route::post('/training/{id}/attendance', [AttendanceController::class, 'store']);
        Route::put('/attendance/{id}', [AttendanceController::class, 'update']);
    });
});
