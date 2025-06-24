<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DemandeOrganisateurSeeder extends Seeder
{
    public function run(): void{
        for ($i = 1; $i <= 10; $i++) {
            DB::table('demandes_organisateur')->insert([
                'user_id' => $i, 
                'statut' => 'en_attente', 
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
