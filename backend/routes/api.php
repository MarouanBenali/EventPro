<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{ EventController, UserController, NotificationController, Auth\AuthController, SubscriptionController, OrganizerController};

//========================== Routes publiques ==========================
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/events', [EventController::class, 'index']); // Liste des événements
Route::get('/events/{id}', [EventController::class, 'show']); // Détails d’un événement

//========================== Routes protégées (auth:sanctum)==========================
Route::middleware('auth:sanctum')->group(function () {

    // Profil utilisateur connecté
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    // Gestion des événements
    Route::post('/events', [EventController::class, 'store']); // Créer un événement
    Route::put('/events/{id}', [EventController::class, 'update']); // Modifier un événement
    Route::delete('/events/{id}', [EventController::class, 'destroy']); // Supprimer un événement

    // Inscriptions aux événements
    Route::post('/events/{id}/subscribe', [SubscriptionController::class, 'subscribe']); // S’inscrire
    Route::delete('/events/{id}/unsubscribe', [SubscriptionController::class, 'unsubscribe']); // Se désinscrire
    Route::get('/events/{id}/participants', [SubscriptionController::class, 'getParticipants']); // Lister les participants

    // Gestion de l'utilisateur
    Route::get('/users/{id}/events', [UserController::class, 'getUserEvents']); // Événements créés par l’utilisateur
    Route::get('/users/{id}/registrations', [UserController::class, 'getUserRegistrations']); // Inscriptions de l’utilisateur
    Route::put('/users/{id}', [UserController::class, 'update']); // Modifier le profil utilisateur

    // Gestion des utilisateurs côté admin
    Route::prefix('admin')->group(function () {
        Route::get('/users', [UserController::class, 'getAllUsers']); // Lister tous les utilisateurs
        Route::delete('/users/{id}', [UserController::class, 'deleteUserByAdmin']); // Supprimer un utilisateur
    });

    // Gestion des demandes d’organisateur
    Route::get('/organizer-requests', [OrganizerController::class, 'index']); // Lister les demandes
    Route::post('/organizer-requests/{id}/approve', [OrganizerController::class, 'approve']); // Approuver
    Route::post('/organizer-requests/{id}/reject', [OrganizerController::class, 'reject']); // Rejeter
    Route::post('/request-organizer', [OrganizerController::class, 'request']); // Demande pour devenir organisateur

    // Notifications
    Route::get('/notifications/{userId}', [NotificationController::class, 'index']); // Lister les notifications d’un utilisateur
    Route::post('/notifications', [NotificationController::class, 'store']); // Ajouter une notification
    Route::put('/notifications/{notificationId}/read', [NotificationController::class, 'markAsRead']); // Marquer comme lue

});
