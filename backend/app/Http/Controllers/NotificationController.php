<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller{
    // Afficher les notifications d'un utilisateur spécifique
    public function index($userId){
        $notifications = Notification::where('id_utilisateur', $userId)
                                     ->orderBy('date_creation', 'desc')->get();
        return response()->json($notifications);
    }

    //ajouter une nouvelle notification
    public function store($userId, $message, $type){
        $notification = new Notification();
        $notification->id_utilisateur = $userId;
        $notification->message = $message;
        $notification->type = $type;
        $notification->save();
        return response()->json(['message' => 'Notification ajoutée avec succès']);
    }

    // Marquer une notification comme lue
    public function markAsRead($notificationId){
        $notification = Notification::find($notificationId);
        if (!$notification) {
            return response()->json(['error' => 'Notification non trouvée'], 404);
        }

        $notification->isVu = 1;
        $notification->save();
        return response()->json(['message' => 'Notification marquée comme lue']);
    }
}
