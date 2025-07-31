<?php

namespace App\Models;
use App\Models\Student;
use App\Models\Schedule;

use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    protected $fillable = [
        'student_id',
        'training_schedule_id',
        'status',
        'enrolled_at',
        'completed_at',
        'notes'
    ];

    public function student() {
        return $this->belongsTo(Student::class);
    }

    public function trainingSchedule() {
        return $this->belongsTo(Schedule::class, 'training_schedule_id');
    }

}
