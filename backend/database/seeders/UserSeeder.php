<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@eventpro.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin'
        ]);

        User::create([
            'name' => 'Event Organizer',
            'email' => 'organizer@eventpro.com',
            'password' => Hash::make('organizer123'),
            'role' => 'organizer'
        ]);

        User::create([
            'name' => 'Regular User',
            'email' => 'user@eventpro.com',
            'password' => Hash::make('user123'),
            'role' => 'subscriber'
        ]);
    }
}

