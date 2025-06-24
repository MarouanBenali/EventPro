<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\SubscriptionController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Authentication routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Public routes
Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{id}', [EventController::class, 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    // Event management
    Route::post('/events', [EventController::class, 'store']);
    Route::put('/events/{id}', [EventController::class, 'update']);
    Route::delete('/events/{id}', [EventController::class, 'destroy']);
    
    // Event subscriptions
    Route::post('/events/{id}/subscribe', [SubscriptionController::class, 'subscribe']);
    Route::delete('/events/{id}/unsubscribe', [SubscriptionController::class, 'unsubscribe']);
    Route::get('/events/{id}/participants', [SubscriptionController::class, 'getParticipants']);
    
    // User management
    Route::get('/users/{id}/events', [UserController::class, 'getUserEvents']);
    Route::get('/users/{id}/registrations', [UserController::class, 'getUserRegistrations']);
    Route::put('/users/{id}', [UserController::class, 'update']);
});

