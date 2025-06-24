<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void{
        Schema::create('demandes_organisateur', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_utilisateur');
            $table->string('statut')->default('en_attente');
            $table->timestamps();
            $table->foreign('id_utilisateur')->references('id') ->on('utilisateurs') ->onDelete('cascade');
        });
    }

    public function down(): void{
        Schema::dropIfExists('demandes_organisateur');
    }
};
