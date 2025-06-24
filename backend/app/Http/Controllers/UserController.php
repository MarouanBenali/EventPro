<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Event;
use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function getUserEvents($id)
    {
        $user = User::findOrFail($id);
        $events = $user->events()->with('organizer')->get();
        
        $transformedEvents = $events->map(function($event) {
            return [
                'id' => $event->id,
                'title' => $event->title,
                'description' => $event->description,
                'date' => $event->date->format('Y-m-d'),
                'time' => $event->time->format('H:i'),
                'location' => $event->location,
                'category' => $event->category,
                'organizer' => $event->organizer,
                'organizerId' => $event->organizer_id,
                'maxParticipants' => $event->max_participants,
                'currentParticipants' => $event->current_participants,
                'image' => $event->image,
                'status' => $event->status,
                'price' => (float) $event->price,
                'tags' => $event->tags ?? []
            ];
        });
        
        return response()->json($transformedEvents);
    }

    public function getUserRegistrations($id)
    {
        $user = User::findOrFail($id);
        $registrations = $user->registrations()->with('event.organizer')->get();
        
        $transformedRegistrations = $registrations->map(function($registration) {
            $event = $registration->event;
            return [
                'id' => $event->id,
                'title' => $event->title,
                'description' => $event->description,
                'date' => $event->date->format('Y-m-d'),
                'time' => $event->time->format('H:i'),
                'location' => $event->location,
                'category' => $event->category,
                'organizer' => $event->organizer,
                'organizerId' => $event->organizer_id,
                'maxParticipants' => $event->max_participants,
                'currentParticipants' => $event->current_participants,
                'image' => $event->image,
                'status' => $event->status,
                'price' => (float) $event->price,
                'tags' => $event->tags ?? [],
                'registeredAt' => $registration->registered_at->format('Y-m-d')
            ];
        });
        
        return response()->json($transformedRegistrations);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
            'password' => 'sometimes|string|min:8',
            'role' => 'sometimes|in:admin,organizer,subscriber',
        ]);

        $data = $request->only(['name', 'email', 'role']);
        
        if ($request->has('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return response()->json([
            'message' => 'User updated successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ]
        ]);
    }

    public function getAllUsers()
    {
        $users = User::all();

        $transformedUsers = $users->map(function($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                // Add other fields if necessary, e.g., 'created_at', 'updated_at'
            ];
        });

        return response()->json($transformedUsers);
    }

    public function deleteUserByAdmin($id)
    {
        // Optional: Add authorization check to ensure only admins can perform this action
        // if (auth()->user()->role !== 'admin') {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }

        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully by admin']);
    }
}