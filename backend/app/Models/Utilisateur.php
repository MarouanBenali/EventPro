<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Utilisateur extends Model
{
    use HasFactory;

    protected $table = 'utilisateurs';
    protected $fillable = [
        'nom',
        'email',
        'mot_de_passe',
        'photo_profil',
        'role',
    ];

    protected $hidden = [
        'mot_de_passe',
    ];

    public function evenementsOrganises()
    {
        return $this->hasMany(Evenement::class, 'id_organisateur');
    }

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class, 'id_utilisateur');
    }

    public function demandeOrganisateur()
    {
        return $this->hasOne(DemandeOrganisateur::class, 'id_utilisateur');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class, 'id_utilisateur');
    }
}