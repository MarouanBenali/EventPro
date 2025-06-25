<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrganisateurSeeder extends Seeder
{
    public function run(): void{
        for ($i = 25; $i <= 29; $i++) {
            DB::table('demandes_organisateur')->insert([
                'user_id' => $i, 
                'statut' => 'pending', 
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
