<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SubjectsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $subjects = [
            // Pre Nursery to Kindergarten
            'Alphabet',
            'Numbers',
            'Colors',
            'Shapes',
            'Basic Math',
            'Rhymes',
            'Storytelling',
            'Art & Craft',
            'English',
            'Hindi',
            'Mathematics',
            'Science',
            'Social Studies',
            'General Knowledge',
            'Computer Science',
            'Art',
            'Music',
            'Moral Science',
            'Environmental Studies',
            'Physical Education',
            'Second Language',
            'Geography',
            'History',
            'Civics',
        ];

        foreach ($subjects as $subject) {
            DB::table('subjects')->insert([
                'name' => $subject
            ]);
        }
    }
}
