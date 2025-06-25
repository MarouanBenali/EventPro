<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void{
        for ($i = 1; $i <= 10; $i++) {
            User::create([
                'name' => "Admin $i",
                'email' => "admin$i@eventpro.com",
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]);
        }

        for ($i = 1; $i <= 10; $i++) {
            User::create([
                'name' => "Organizer $i",
                'email' => "organizer$i@eventpro.com",
                'password' => Hash::make('organizer123'),
                'role' => 'organizer',
            ]);
        }

        for ($i = 1; $i <= 20; $i++) {
            User::create([
                'name' => "User $i",
                'email' => "user$i@eventpro.com",
                'password' => Hash::make('user123'),
                'role' => 'subscriber',
            ]);
        }
    }
}
