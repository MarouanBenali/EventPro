<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class NotificationSeeder extends Seeder
{
    public function run()
    {
        $users = User::all();

        if ($users->isEmpty()) {
            $this->command->info('No users found to create notifications for.');
            return;
        }
        foreach ($users as $user) {
            DB::table('notifications')->insert([
                'user_id' => $user->id,
                'message' => 'Notification for user ID ' . $user->id,
                'type' => 'info',
                'isVu' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
