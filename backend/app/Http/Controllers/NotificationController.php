<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    // Afficher les notifications d'un utilisateur spécifique
    public function index($userId)
    {
       $notifications = Notification::where('user_id', $userId)
    ->orderBy('created_at', 'desc')
    ->get();
        return response()->json($notifications);
    }

    //ajouter une nouvelle notification
    public function store(Request $request)
    {
        $notification = new Notification();
        $notification->user_id = $request->input('user_id');
        $notification->message = $request->input('message');
        $notification->type = $request->input('type');
        $notification->save();
        return response()->json(['message' => 'Notification ajoutée avec succès']);
    }


    // Marquer une notification comme lue
    public function markAsRead($notificationId)
    {
        $notification = Notification::find($notificationId);
        if (!$notification) {
            return response()->json(['error' => 'Notification non trouvée'], 404);
        }

        $notification->isVu = 1;
        $notification->save();
        return response()->json(['message' => 'Notification marquée comme lue']);
    }
}


