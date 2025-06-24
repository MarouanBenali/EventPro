<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use App\Models\DemandeOrganisateur;
use Illuminate\Http\Request;
use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Auth;

class OrganizerController extends Controller{
    // Faire une demande pour devenir organisateur
    public function requestOrganizer($userId){
        // Vérifier si l'utilisateur existe
        $user = Utilisateur::findOrFail($userId);

        // Vérifier si l'utilisateur a déjà une demande en attente ou approuvée
        $existingRequest = DemandeOrganisateur::where('id_utilisateur', $user->id)
            ->whereIn('statut', ['en_attente', 'approuve'])->exists();

        if ($existingRequest) {
            return response()->json(['message' => 'L\'utilisateur a déjà une demande en attente ou approuvée.'], 400);
        }

        // Créer une nouvelle demande
        DemandeOrganisateur::create([
            'id_utilisateur' => $user->id,
            'statut' => 'en_attente',
        ]);

        return response()->json(['message' => 'Demande envoyée avec succès.'], 200);
    }

    // Approuver la demande pour devenir organisateur
    public function approveRequest($userId){
        // Vérifier si la demande existe et est en attente
        $request = DemandeOrganisateur::where('id_utilisateur', $userId)
            ->where('statut', 'en_attente')->first();

        if (!$request) {
            return response()->json(['message' => 'Aucune demande en attente trouvée pour cet utilisateur.'], 400);
        }

        // Mettre à jour la demande pour l'approuver
        $request->statut = 'approuve';
        $request->save();

        // Mettre à jour le rôle de l'utilisateur pour être organisateur
        $user = Utilisateur::findOrFail($userId);
        $user->role = 'organisateur';
        $user->save();

        $notificationController = new NotificationController();
        $notificationController->store($userId, "Votre demande a été approuvée", "admin");


        return response()->json(['message' => 'Demande approuvée avec succès.'], 200);
    }

    // Refuser la demande pour devenir organisateur
    public function declineRequest($userId){
        // Vérifier si la demande existe et est en attente
        $request = DemandeOrganisateur::where('id_utilisateur', $userId)
            ->where('statut', 'en_attente')->first();

        if (!$request) {
            return response()->json(['message' => 'Aucune demande en attente trouvée pour cet utilisateur.'], 400);
        }

        // Mettre à jour la demande pour la refuser
        $request->statut = 'rejete';
        $request->save();

        return response()->json(['message' => 'Demande rejetée avec succès.'], 200);
    }
}
