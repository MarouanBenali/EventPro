<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DemandeOrganisateur extends Model
{
    use HasFactory;

    protected $table = 'demandes_organisateur';
    protected $fillable = [
        'id_utilisateur',
        'statut',
    ];

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'id_utilisateur');
    }
}