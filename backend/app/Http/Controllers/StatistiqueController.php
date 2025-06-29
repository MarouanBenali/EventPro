<?php

namespace App\Http\Controllers;

use App\Models\Statistique;
use App\Models\Event;
use Illuminate\Http\Request;

class StatistiqueController extends Controller
{
    // Afficher les statistiques d'un événement spécifique
    public function show($eventId)
    {
        // Vérifier si l'événement existe
        $Event = Event::findOrFail($eventId);

        // Récupérer les statistiques associées à cet événement
        $statistiques = Statistique::where('event_id', $eventId)->first();

        if (!$statistiques) {
            return response()->json(['message' => 'Aucune statistique trouvée pour cet événement.'], 404);
        }

        return response()->json($statistiques, 200);
    }

    // Mettre à jour les statistiques pour un événement spécifique
    public function update(Request $request, $eventId)
    {
        // Vérifier si l'événement existe
        $Event = Event::findOrFail($eventId);

        // Valider les données de la requête
        $request->validate([
            'nombre_participants' => 'required|integer|min:0',
            'taux_participation' => 'required|numeric|min:0|max:100',
        ]);

        // Vérifier si les statistiques existent pour cet événement
        $statistiques = Statistique::where('event_id', $eventId)->first();

        if ($statistiques) {
            // Si elles existent, les mettre à jour
            $statistiques->nombre_participants = $request->nombre_participants;
            $statistiques->taux_participation = $request->taux_participation;
            $statistiques->save();
        } else {
            // Sinon, créer de nouvelles statistiques
            $statistiques = new Statistique();
            $statistiques->event_id = $eventId;
            $statistiques->nombre_participants = $request->nombre_participants;
            $statistiques->taux_participation = $request->taux_participation;
            $statistiques->save();
        }

        return response()->json(['message' => 'Statistiques mises à jour avec succès.'], 200);
    }

    // Afficher tous les Event avec leurs statistiques
    public function index()
    {
        // Récupérer tous les Event avec leurs statistiques associées
        $Events = Event::with('statistiques')->get();

        return response()->json($Events, 200);
    }
}
