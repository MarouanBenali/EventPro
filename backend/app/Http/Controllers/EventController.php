<?php
namespace App\Http\Controllers;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EventController extends Controller{
    // Get all events
    public function index(){
        $events = Event::with('organizer')->orderBy('date', 'asc')->get();
        
        // Transform data to match frontend format
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

    // Get event by ID
    public function show($id){
        $event = Event::with('organizer')->findOrFail($id);
        
        $transformedEvent = [
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
        
        return response()->json($transformedEvent);
    }

    // Create new event
    public function store(Request $request){
        $request->validate([
            'title' => 'required|string|max:200',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'time' => 'required',
            'location' => 'required|string|max:255',
            'image' => 'nullable|string',
            'category' => 'required|string',
            'organizer' => 'required|string',
            'organizerId' => 'required|exists:users,id',
            'maxParticipants' => 'nullable|integer|min:1',
            'price' => 'nullable|numeric|min:0',
            'tags' => 'nullable|array'
        ]);

        $event = Event::create([
            'title' => $request->title,
            'description' => $request->description,
            'date' => $request->date,
            'time' => $request->time,
            'location' => $request->location,
            'image' => $request->image,
            'category' => $request->category,
            'organizer' => $request->organizer,
            'organizer_id' => $request->organizerId,
            'max_participants' => $request->maxParticipants ?? 100,
            'current_participants' => 0,
            'status' => 'upcoming',
            'price' => $request->price ?? 0,
            'tags' => $request->tags ?? []
        ]);
        
        return response()->json(['message' => 'Event created successfully', 'event' => $event], 201);
    }

    // Update existing event
    public function update(Request $request, $id){
        $request->validate([
            'title' => 'required|string|max:200',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'time' => 'required',
            'location' => 'required|string|max:255',
            'image' => 'nullable|string',
            'category' => 'required|string',
            'organizer' => 'required|string',
            'organizerId' => 'required|exists:users,id',
            'maxParticipants' => 'nullable|integer|min:1',
            'price' => 'nullable|numeric|min:0',
            'tags' => 'nullable|array'
        ]);

        $event = Event::findOrFail($id);
        
        $event->update([
            'title' => $request->title,
            'description' => $request->description,
            'date' => $request->date,
            'time' => $request->time,
            'location' => $request->location,
            'image' => $request->image,
            'category' => $request->category,
            'organizer' => $request->organizer,
            'organizer_id' => $request->organizerId,
            'max_participants' => $request->maxParticipants ?? $event->max_participants,
            'price' => $request->price ?? $event->price,
            'tags' => $request->tags ?? $event->tags
        ]);
        
        return response()->json(['message' => 'Event updated successfully', 'event' => $event]);
    }

    // Delete event
    public function destroy($id){
        $event = Event::findOrFail($id);
        $event->delete();
        
        return response()->json(['message' => 'Event deleted successfully']);
    }
}
