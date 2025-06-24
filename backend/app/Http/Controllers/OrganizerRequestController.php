<?php

namespace App\Http\Controllers;

use App\Models\DemandeOrganisateur;
use Illuminate\Http\Request;

class OrganizerRequestController extends Controller
{
    public function index()
    {
        $requests = DemandeOrganisateur::with('user')->get();
        return response()->json($requests);
    }

    public function approve($id)
    {
        $request = DemandeOrganisateur::findOrFail($id);
        $request->statut = 'approuve';
        $request->save();

        $user = $request->user;
        if ($user) {
            $user->role = 'organizer';
            $user->save();
        }

        return response()->json(['message' => 'Request approved successfully.']);
    }

    public function reject($id)
    {
        $request = DemandeOrganisateur::findOrFail($id);
        $request->statut = 'rejete';
        $request->save();

        return response()->json(['message' => 'Request rejected successfully.']);
    }

    public function request(Request $request)
    {
        $user = $request->user(); 

        if (DemandeOrganisateur::where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'You have already requested to become an organizer.'], 400);
        }

        $demande = new DemandeOrganisateur();
        $demande->user_id = $user->id;
        $demande->statut = 'en attente';
        $demande->save();

        return response()->json(['message' => 'Request submitted successfully.']);
    }
}
