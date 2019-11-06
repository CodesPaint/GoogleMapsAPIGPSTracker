<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    protected $fillable = [
        'make',
        'model',
        'colour',
        'type',
        'registration',
        'owner',
        'lat',
        'lon',
        'speed',
        'stolen',
        'updated_at'
    ];

    protected $hidden = [
        'created_at'
    ];
}
