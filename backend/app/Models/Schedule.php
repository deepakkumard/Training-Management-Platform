<?php

namespace App\Models;
use App\Models\Course;
use App\Models\Instructor;
use App\Models\Enrollment;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    protected $fillable = [
        'course_id',
        'instructor_id',
        'title',
        'start_time',
        'end_time',
        'location',
        'mode',
        'is_recurring',
        'max_enrollments',
        'status'
    ];

    public function course() {
        return $this->belongsTo(Course::class);
    }

    public function instructor() {
        return $this->belongsTo(Instructor::class);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'training_schedule_id');
    }

}
