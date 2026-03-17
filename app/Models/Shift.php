<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shift extends Model
{
    protected $fillable = [
        'name',
        'jam_masuk',
        'jam_pulang',
    ];

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }
}
