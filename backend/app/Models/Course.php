<?php

namespace App\Models;

use App\Models\Schedule;
use Illuminate\Database\Eloquent\Relations\HasMany;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = [
        'title',
        'description',
        'category',
        'level',
        'duration_hours',
        'max_students',
        'status'
    ];


    public function schedules(): HasMany { return $this->hasMany(Schedule::class); }
}
