<?php

namespace App\Models;
use App\Models\Enrollment;
use App\Models\User;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'user_id',
        'student_code',
        'phone',
        'status',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function enrollments() {
        return $this->hasMany(Enrollment::class);
    }
}
