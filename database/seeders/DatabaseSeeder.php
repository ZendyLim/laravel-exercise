<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        if (\App\Models\Admin::where('email', '=', 'test@example.com')->count() < 1) {
            \App\Models\Admin::factory()->create([
                'email' => 'test@example.com',
            ]);
        }

        \App\Models\Admin::factory(10)
            ->has(\App\Models\Client::factory(20))
            ->create();
    }
}
