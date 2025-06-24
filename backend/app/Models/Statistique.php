<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Statistique extends Model
{
    use HasFactory;

    protected $table = 'statistiques';
    protected $fillable = [
        'event_id',
        'nombre_participants',
        'taux_participation',
    ];

    public function evenement()
    {
        return $this->belongsTo(Event::class, 'event_id');
    }
}