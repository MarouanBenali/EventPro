<?php

namespace App\Http\Controllers;

use App\Models\DemandeOrganisateur;
use Illuminate\Http\Request;
use Carbon\Carbon;

class OrganizerController extends Controller
{
    // Affiche toutes les demandes d'organisateur avec les informations utilisateur
    public function index()
    {
        $requests = DemandeOrganisateur::with('user')->get();
        return response()->json($requests);
    }

    // Approuve une demande d'organisateur
    public function approve($id)
    {
        $request = DemandeOrganisateur::findOrFail($id);
        $request->statut = 'approuve';
        $request->save();

        $user = $request->user;
        if ($user) {
            $user->role = 'organizer'; // Assurez-vous que ce rôle existe dans votre logique
            $user->save();
        }

        return response()->json(['message' => 'Demande approuvée avec succès.']);
    }

    // Rejette une demande d'organisateur
    public function reject($id)
    {
        $request = DemandeOrganisateur::findOrFail($id);
        $request->statut = 'rejete';
        $request->save();

        return response()->json(['message' => 'Demande rejetée avec succès.']);
    }

    // Soumet une nouvelle demande pour devenir organisateur
    public function request(Request $request)
    {
        $user = $request->user();

        // Vérifie si l'utilisateur est déjà organisateur
        if ($user->role === 'organizer') {
            return response()->json(['message' => 'Vous êtes déjà un organisateur.'], 400);
        }

        // Récupère la dernière demande existante
        $lastRequest = DemandeOrganisateur::where('user_id', $user->id)
            ->latest('updated_at')
            ->first();

        if ($lastRequest) {
            if ($lastRequest->statut === 'pending') {
                return response()->json(['message' => 'Vous avez déjà soumis une demande en attente.'], 400);
            }

            if ($lastRequest->statut === 'rejete') {
                $nextAllowedDate = $lastRequest->updated_at->addDays(30);
                if (Carbon::now()->lt($nextAllowedDate)) {
                    $daysLeft = $nextAllowedDate->diffInDays(Carbon::now());
                    return response()->json([
                        'message' => "Votre dernière demande a été rejetée. Vous devez attendre encore $daysLeft jours avant de pouvoir soumettre une nouvelle demande."
                    ], 400);
                }
            }
        }

        // Crée une nouvelle demande avec statut "pending"
        $demande = new DemandeOrganisateur();
        $demande->user_id = $user->id;
        $demande->statut = 'pending';
        $demande->save();

        return response()->json(['message' => 'Demande envoyée avec succès.']);
    }
}


