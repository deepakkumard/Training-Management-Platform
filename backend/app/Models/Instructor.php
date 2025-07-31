<?php

namespace App\Models;
use App\Models\User;
use App\Models\Schedule;

use Illuminate\Database\Eloquent\Model;

class Instructor extends Model
{
    protected $fillable = [
        'user_id',
        'designation',
        'bio',
        'expertise',
        'status'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function schedules() {
        return $this->hasMany(Schedule::class);
    }

}
