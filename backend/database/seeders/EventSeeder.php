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
            'title' => 'Web Summit',
            'description' => 'The world\'s largest tech conference with 70,000+ attendees discussing the future of technology.',
            'date' => '2024-11-11',
            'time' => '08:30',
            'location' => 'Lisbon, Portugal',
            'category' => 'Technology',
            'organizer' => 'Web Summit',
            'organizer_id' => 2,
            'max_participants' => 70000,
            'current_participants' => 45000,
            'image' => 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
            'status' => 'upcoming',
            'price' => 1095,
            'tags' => ['Technology', 'Conference', 'Networking']
        ]);

        Event::create([
            'title' => 'CES 2025',
            'description' => 'The most influential tech event in the world - the proving ground for breakthrough technologies.',
            'date' => '2025-01-07',
            'time' => '09:00',
            'location' => 'Las Vegas, NV',
            'category' => 'Technology',
            'organizer' => 'Consumer Technology Association',
            'organizer_id' => 2,
            'max_participants' => 150000,
            'current_participants' => 120000,
            'image' => 'https://images.unsplash.com/photo-1518770660439-4636190af475',
            'status' => 'upcoming',
            'price' => 1499,
            'tags' => ['Consumer Electronics', 'Innovation', 'Expo']
        ]);

        Event::create([
            'title' => 'SXSW',
            'description' => 'Convergence of tech, film, music, education, and culture with 10 days of sessions, screenings, and showcases.',
            'date' => '2024-03-08',
            'time' => '10:00',
            'location' => 'Austin, TX',
            'category' => 'Technology',
            'organizer' => 'SXSW',
            'organizer_id' => 2,
            'max_participants' => 50000,
            'current_participants' => 38000,
            'image' => 'https://images.unsplash.com/photo-1511578314322-379afb476865',
            'status' => 'upcoming',
            'price' => 1295,
            'tags' => ['Tech', 'Film', 'Music']
        ]);

        Event::create([
            'title' => 'Google I/O',
            'description' => 'Google\'s annual developer conference featuring keynotes, technical sessions, and hands-on learning.',
            'date' => '2024-05-14',
            'time' => '10:00',
            'location' => 'Mountain View, CA',
            'category' => 'Technology',
            'organizer' => 'Google',
            'organizer_id' => 3,
            'max_participants' => 7000,
            'current_participants' => 7000,
            'image' => 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff',
            'status' => 'upcoming',
            'price' => 1150,
            'tags' => ['Google', 'Developers', 'Android']
        ]);

        Event::create([
            'title' => 'Apple WWDC',
            'description' => 'Apple\'s Worldwide Developers Conference with insights into iOS, macOS, watchOS, and tvOS.',
            'date' => '2025-07-10',
            'time' => '10:00',
            'location' => 'Cupertino, CA',
            'category' => 'Technology',
            'organizer' => 'Apple',
            'organizer_id' => 3,
            'max_participants' => 5000,
            'current_participants' => 5000,
            'image' => 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9',
            'status' => 'upcoming',
            'price' => 1599,
            'tags' => ['Apple', 'iOS', 'Developers']
        ]);

        Event::create([
            'title' => 'AWS re:Invent',
            'description' => 'Amazon Web Services\' annual cloud computing conference with training, certification, and new service announcements.',
            'date' => '2024-11-25',
            'time' => '08:00',
            'location' => 'Las Vegas, NV',
            'category' => 'Technology',
            'organizer' => 'Amazon Web Services',
            'organizer_id' => 3,
            'max_participants' => 60000,
            'current_participants' => 45000,
            'image' => 'https://images.unsplash.com/photo-1629752187687-3d3c7ea3a21b',
            'status' => 'upcoming',
            'price' => 1799,
            'tags' => ['Cloud', 'AWS', 'DevOps']
        ]);

        Event::create([
            'title' => 'Microsoft Build',
            'description' => 'Microsoft\'s annual conference for software engineers and web developers using Windows, Azure, and other Microsoft technologies.',
            'date' => '2024-05-21',
            'time' => '09:00',
            'location' => 'Seattle, WA',
            'category' => 'Technology',
            'organizer' => 'Microsoft',
            'organizer_id' => 3,
            'max_participants' => 5000,
            'current_participants' => 5000,
            'image' => 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
            'status' => 'upcoming',
            'price' => 2395,
            'tags' => ['Microsoft', 'Azure', 'Developers']
        ]);

        Event::create([
            'title' => 'TechCrunch Disrupt',
            'description' => 'Premier startup conference featuring the Startup Battlefield competition, expert speakers, and networking opportunities.',
            'date' => '2024-09-18',
            'time' => '08:30',
            'location' => 'San Francisco, CA',
            'category' => 'Startup',
            'organizer' => 'TechCrunch',
            'organizer_id' => 4,
            'max_participants' => 10000,
            'current_participants' => 7500,
            'image' => 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d',
            'status' => 'upcoming',
            'price' => 1495,
            'tags' => ['Startups', 'VC', 'Innovation']
        ]);

        Event::create([
            'title' => 'Slush',
            'description' => 'Europe\'s leading startup event bringing together founders, investors, and executives in Helsinki.',
            'date' => '2024-11-20',
            'time' => '09:00',
            'location' => 'Helsinki, Finland',
            'category' => 'Startup',
            'organizer' => 'Slush',
            'organizer_id' => 4,
            'max_participants' => 25000,
            'current_participants' => 18000,
            'image' => 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678',
            'status' => 'upcoming',
            'price' => 899,
            'tags' => ['Startups', 'Europe', 'Networking']
        ]);

        Event::create([
            'title' => 'DockerCon',
            'description' => 'The container technology conference for developers and operations teams building, sharing, and running applications.',
            'date' => '2025-07-12',
            'time' => '09:00',
            'location' => 'San Diego, CA',
            'category' => 'Technology',
            'organizer' => 'Docker',
            'organizer_id' => 5,
            'max_participants' => 3000,
            'current_participants' => 2500,
            'image' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
            'status' => 'upcoming',
            'price' => 999,
            'tags' => ['Docker', 'Containers', 'DevOps']
        ]);

        Event::create([
            'title' => 'React Summit',
            'description' => 'The biggest React conference worldwide with workshops, talks, and networking for frontend developers.',
            'date' => '2024-10-15',
            'time' => '09:00',
            'location' => 'Amsterdam, Netherlands',
            'category' => 'Technology',
            'organizer' => 'React Summit',
            'organizer_id' => 5,
            'max_participants' => 2000,
            'current_participants' => 1800,
            'image' => 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2',
            'status' => 'upcoming',
            'price' => 499,
            'tags' => ['React', 'JavaScript', 'Frontend']
        ]);

        Event::create([
            'title' => 'PyCon US',
            'description' => 'The largest annual gathering for the Python programming language community with tutorials, talks, and sprints.',
            'date' => '2024-05-15',
            'time' => '08:00',
            'location' => 'Pittsburgh, PA',
            'category' => 'Technology',
            'organizer' => 'Python Software Foundation',
            'organizer_id' => 5,
            'max_participants' => 3500,
            'current_participants' => 3200,
            'image' => 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d',
            'status' => 'upcoming',
            'price' => 850,
            'tags' => ['Python', 'Programming', 'Open Source']
        ]);

        Event::create([
            'title' => 'RSA Conference',
            'description' => 'Premier cybersecurity event featuring keynotes, technical sessions, and the latest security solutions.',
            'date' => '2024-05-06',
            'time' => '08:30',
            'location' => 'San Francisco, CA',
            'category' => 'Security',
            'organizer' => 'RSA Conference',
            'organizer_id' => 6,
            'max_participants' => 45000,
            'current_participants' => 40000,
            'image' => 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
            'status' => 'upcoming',
            'price' => 2695,
            'tags' => ['Cybersecurity', 'Infosec', 'Hacking']
        ]);

        Event::create([
            'title' => 'Shopify Unite',
            'description' => 'Annual conference for Shopify partners and developers to learn about platform updates and ecommerce trends.',
            'date' => '2025-07-18',
            'time' => '09:00',
            'location' => 'Toronto, Canada',
            'category' => 'Ecommerce',
            'organizer' => 'Shopify',
            'organizer_id' => 6,
            'max_participants' => 3000,
            'current_participants' => 2800,
            'image' => 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df',
            'status' => 'upcoming',
            'price' => 899,
            'tags' => ['Ecommerce', 'Shopify', 'Retail']
        ]);

        Event::create([
            'title' => 'Money20/20 USA',
            'description' => 'The world\'s largest fintech event covering payments, financial services, and banking innovation.',
            'date' => '2024-10-27',
            'time' => '08:00',
            'location' => 'Las Vegas, NV',
            'category' => 'Finance',
            'organizer' => 'Money20/20',
            'organizer_id' => 3,
            'max_participants' => 12000,
            'current_participants' => 9500,
            'image' => 'https://images.unsplash.com/photo-1554224155-6726b3ff858f',
            'status' => 'upcoming',
            'price' => 2995,
            'tags' => ['Fintech', 'Banking', 'Payments']
        ]);

        Event::create([
            'title' => 'Adobe Summit',
            'description' => 'Digital marketing conference featuring Adobe product announcements and digital experience strategies.',
            'date' => '2024-03-26',
            'time' => '08:30',
            'location' => 'Las Vegas, NV',
            'category' => 'Marketing',
            'organizer' => 'Adobe',
            'organizer_id' => 4,
            'max_participants' => 15000,
            'current_participants' => 12000,
            'image' => 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7',
            'status' => 'upcoming',
            'price' => 1995,
            'tags' => ['Adobe', 'Marketing', 'Digital Experience']
        ]);

        Event::create([
            'title' => 'IBM Think',
            'description' => 'IBM\'s flagship conference covering AI, cloud, security, and quantum computing innovations.',
            'date' => '2024-05-13',
            'time' => '09:00',
            'location' => 'Boston, MA',
            'category' => 'Technology',
            'organizer' => 'IBM',
            'organizer_id' => 4,
            'max_participants' => 20000,
            'current_participants' => 18000,
            'image' => 'https://images.unsplash.com/photo-1563986768609-322da13575f3',
            'status' => 'upcoming',
            'price' => 2195,
            'tags' => ['IBM', 'AI', 'Quantum']
        ]);

        Event::create([
            'title' => 'GitHub Universe',
            'description' => 'GitHub\'s annual developer conference featuring the latest in software development and collaboration tools.',
            'date' => '2024-11-13',
            'time' => '09:00',
            'location' => 'San Francisco, CA',
            'category' => 'Technology',
            'organizer' => 'GitHub',
            'organizer_id' => 2,
            'max_participants' => 5000,
            'current_participants' => 4500,
            'image' => 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
            'status' => 'upcoming',
            'price' => 999,
            'tags' => ['GitHub', 'Developers', 'Open Source']
        ]);

        Event::create([
            'title' => 'Dreamforce',
            'description' => 'Salesforce\'s massive annual conference with keynotes, training, and networking for CRM professionals.',
            'date' => '2024-09-17',
            'time' => '08:00',
            'location' => 'San Francisco, CA',
            'category' => 'Business',
            'organizer' => 'Salesforce',
            'organizer_id' => 6,
            'max_participants' => 170000,
            'current_participants' => 150000,
            'image' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
            'status' => 'upcoming',
            'price' => 1799,
            'tags' => ['Salesforce', 'CRM', 'Cloud']
        ]);

        Event::create([
            'title' => 'Mobile World Congress',
            'description' => 'The world\'s largest exhibition for the mobile industry featuring the latest devices and mobile technologies.',
            'date' => '2024-02-26',
            'time' => '09:00',
            'location' => 'Barcelona, Spain',
            'category' => 'Technology',
            'organizer' => 'GSMA',
            'organizer_id' => 4,
            'max_participants' => 100000,
            'current_participants' => 80000,
            'image' => 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c',
            'status' => 'upcoming',
            'price' => 899,
            'tags' => ['Mobile', '5G', 'Telecom']
        ]);

        Event::create([
            'title' => 'Collision Conference',
            'description' => 'North America\'s fastest-growing tech conference with startups, investors, and media from around the world.',
            'date' => '2025-07-17',
            'time' => '08:30',
            'location' => 'Toronto, Canada',
            'category' => 'Technology',
            'organizer' => 'Collision',
            'organizer_id' => 3,
            'max_participants' => 35000,
            'current_participants' => 28000,
            'image' => 'https://images.unsplash.com/photo-1497366811353-6870744d04b2',
            'status' => 'upcoming',
            'price' => 795,
            'tags' => ['Startups', 'Tech', 'Networking']
        ]);
    }
}