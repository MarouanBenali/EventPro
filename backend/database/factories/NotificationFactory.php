<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

class NotificationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first()->id ?? 1,
            'message' => $this->faker->sentence(),
            'type' => $this->faker->word(),
            'isVu' => $this->faker->boolean(30), // 30% comme lu
        ];
    }
}
