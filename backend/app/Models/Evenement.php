<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evenement extends Model
{
    use HasFactory;

    protected $table = 'evenements';
    protected $fillable = [
        'titre',
        'description',
        'date_evenement',
        'heure',
        'lieu',
        'img',
        'categorie',
        'id_organisateur',
    ];

    public function organisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'id_organisateur');
    }

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class, 'id_evenement');
    }

    public function statistique()
    {
        return $this->hasOne(Statistique::class, 'id_evenement');
    }
}