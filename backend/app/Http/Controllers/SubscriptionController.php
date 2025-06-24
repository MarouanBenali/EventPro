<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Registration;
use App\Models\User;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function subscribe(Request $request, $eventId)
    {
        $user = $request->user();
        $event = Event::findOrFail($eventId);

        // Check if user is already registered
        $existingRegistration = Registration::where('user_id', $user->id)
                                          ->where('event_id', $eventId)
                                          ->first();

        if ($existingRegistration) {
            return response()->json(['message' => 'Already registered for this event'], 400);
        }

        // Check if event is full
        if ($event->current_participants >= $event->max_participants) {
            return response()->json(['message' => 'Event is full'], 400);
        }

        // Create registration
        Registration::create([
            'user_id' => $user->id,
            'event_id' => $eventId,
            'registered_at' => now()
        ]);

        // Update current participants count
        $event->increment('current_participants');

        return response()->json(['message' => 'Successfully registered for event']);
    }

    public function unsubscribe(Request $request, $eventId)
    {
        $user = $request->user();
        $event = Event::findOrFail($eventId);

        $registration = Registration::where('user_id', $user->id)
                                  ->where('event_id', $eventId)
                                  ->first();

        if (!$registration) {
            return response()->json(['message' => 'Not registered for this event'], 400);
        }

        $registration->delete();

        // Update current participants count
        $event->decrement('current_participants');

        return response()->json(['message' => 'Successfully unregistered from event']);
    }

    public function getParticipants($eventId)
    {
        $event = Event::findOrFail($eventId);
        $participants = $event->participants()->get();

        $transformedParticipants = $participants->map(function($participant) {
            return [
                'id' => $participant->id,
                'name' => $participant->name,
                'email' => $participant->email,
                'registeredAt' => $participant->pivot->registered_at
            ];
        });

        return response()->json($transformedParticipants);
    }
}

