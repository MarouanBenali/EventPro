<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'date',
        'time',
        'location',
        'category',
        'organizer',
        'organizer_id',
        'max_participants',
        'current_participants',
        'image',
        'status',
        'price',
        'tags'
    ];

    protected $casts = [
        'tags' => 'array',
        'date' => 'date',
        'time' => 'datetime:H:i',
        'price' => 'decimal:2'
    ];

    public function organizer()
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    public function registrations()
    {
        return $this->hasMany(Registration::class);
    }

    public function participants()
    {
        return $this->belongsToMany(User::class, 'registrations', 'event_id', 'user_id')
                    ->withTimestamps()
                    ->withPivot('registered_at');
    }
}

