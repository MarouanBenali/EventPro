<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrganisateurSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('demandes_organisateur')->insert([
            'user_id' => 7,
            'statut' => 'pending',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
