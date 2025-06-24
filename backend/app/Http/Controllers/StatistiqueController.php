<?php

namespace App\Http\Controllers;

use App\Models\Statistique;
use App\Models\Evenement;
use Illuminate\Http\Request;

class StatistiqueController extends Controller{
    // Afficher les statistiques d'un événement spécifique
    public function show($eventId){
        // Vérifier si l'événement existe
        $evenement = Evenement::findOrFail($eventId);

        // Récupérer les statistiques associées à cet événement
        $statistiques = Statistique::where('id_evenement', $eventId)->first();

        if (!$statistiques) {
            return response()->json(['message' => 'Aucune statistique trouvée pour cet événement.'], 404);
        }

        return response()->json($statistiques, 200);
    }

    // Mettre à jour les statistiques pour un événement spécifique
    public function update(Request $request, $eventId){
        // Vérifier si l'événement existe
        $evenement = Evenement::findOrFail($eventId);

        // Valider les données de la requête
        $request->validate([
            'nombre_participants' => 'required|integer|min:0',
            'taux_participation' => 'required|numeric|min:0|max:100',
        ]);

        // Vérifier si les statistiques existent pour cet événement
        $statistiques = Statistique::where('id_evenement', $eventId)->first();

        if ($statistiques) {
            // Si elles existent, les mettre à jour
            $statistiques->nombre_participants = $request->nombre_participants;
            $statistiques->taux_participation = $request->taux_participation;
            $statistiques->save();
        } else {
            // Sinon, créer de nouvelles statistiques
            $statistiques = new Statistique();
            $statistiques->id_evenement = $eventId;
            $statistiques->nombre_participants = $request->nombre_participants;
            $statistiques->taux_participation = $request->taux_participation;
            $statistiques->save();
        }

        return response()->json(['message' => 'Statistiques mises à jour avec succès.'], 200);
    }

    // Afficher tous les événements avec leurs statistiques
    public function index(){
        // Récupérer tous les événements avec leurs statistiques associées
        $evenements = Evenement::with('statistiques')->get();

        return response()->json($evenements, 200);
    }
}
