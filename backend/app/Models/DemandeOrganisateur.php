<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DemandeOrganisateur extends Model{
    use HasFactory;

    protected $table = 'demandes_organisateur';
    protected $fillable = [
        'user_id',
        'statut',
    ];

    public function user(){
        return $this->belongsTo(User::class, 'user_id');
    }
}