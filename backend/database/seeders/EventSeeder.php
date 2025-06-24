<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Event;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        Event::create([
            'title' => 'Tech Conference 2024',
            'description' => 'Join us for the biggest tech conference of the year featuring industry leaders and cutting-edge innovations.',
            'date' => '2024-07-15',
            'time' => '09:00',
            'location' => 'San Francisco Convention Center',
            'category' => 'Technology',
            'organizer' => 'Event Organizer',
            'organizer_id' => 2,
            'max_participants' => 500,
            'current_participants' => 342,
            'image' => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
            'status' => 'upcoming',
            'price' => 299,
            'tags' => ['Technology', 'Innovation', 'Networking']
        ]);

        Event::create([
            'title' => 'Digital Marketing Workshop',
            'description' => 'Learn the latest digital marketing strategies and tools from industry experts.',
            'date' => '2024-06-20',
            'time' => '14:00',
            'location' => 'Online Event',
            'category' => 'Marketing',
            'organizer' => 'Event Organizer',
            'organizer_id' => 2,
            'max_participants' => 100,
            'current_participants' => 87,
            'image' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
            'status' => 'upcoming',
            'price' => 99,
            'tags' => ['Marketing', 'Digital', 'Workshop']
        ]);

        Event::create([
            'title' => 'Startup Pitch Competition',
            'description' => 'Watch innovative startups pitch their ideas to a panel of investors and industry experts.',
            'date' => '2024-06-25',
            'time' => '18:00',
            'location' => 'Innovation Hub, New York',
            'category' => 'Business',
            'organizer' => 'Event Organizer',
            'organizer_id' => 2,
            'max_participants' => 200,
            'current_participants' => 156,
            'image' => 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop',
            'status' => 'upcoming',
            'price' => 0,
            'tags' => ['Startup', 'Investment', 'Networking']
        ]);

        Event::create([
            'title' => 'AI & Machine Learning Summit',
            'description' => 'Explore the future of AI and machine learning with leading researchers and practitioners.',
            'date' => '2024-08-10',
            'time' => '10:00',
            'location' => 'MIT Campus, Boston',
            'category' => 'Technology',
            'organizer' => 'Event Organizer',
            'organizer_id' => 2,
            'max_participants' => 300,
            'current_participants' => 245,
            'image' => 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
            'status' => 'upcoming',
            'price' => 199,
            'tags' => ['AI', 'Machine Learning', 'Research']
        ]);

        Event::create([
            'title' => 'Web Development Bootcamp',
            'description' => 'Intensive 3-day bootcamp covering modern web development technologies and best practices.',
            'date' => '2024-05-15',
            'time' => '09:00',
            'location' => 'Code Academy, Seattle',
            'category' => 'Education',
            'organizer' => 'Event Organizer',
            'organizer_id' => 2,
            'max_participants' => 50,
            'current_participants' => 50,
            'image' => 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=400&fit=crop',
            'status' => 'past',
            'price' => 599,
            'tags' => ['Web Development', 'Bootcamp', 'Programming']
        ]);

        Event::create([
            'title' => 'Design Thinking Workshop',
            'description' => 'Learn design thinking methodologies to solve complex problems and drive innovation.',
            'date' => '2024-05-20',
            'time' => '13:00',
            'location' => 'Design Studio, Los Angeles',
            'category' => 'Design',
            'organizer' => 'Event Organizer',
            'organizer_id' => 2,
            'max_participants' => 30,
            'current_participants' => 28,
            'image' => 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=400&fit=crop',
            'status' => 'past',
            'price' => 149,
            'tags' => ['Design', 'Innovation', 'Workshop']
        ]);
    }
}

