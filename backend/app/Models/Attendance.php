<?php

namespace App\Models;

use App\Models\Student;
use App\Models\Schedule;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = ['student_id', 'training_schedule_id', 'is_present', 'notes'];

    public function student() {
        return $this->belongsTo(Student::class);
    }

    public function schedule() {
        return $this->belongsTo(Schedule::class, 'training_schedule_id');
    }
}
