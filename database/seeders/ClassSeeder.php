<?php

namespace Database\Seeders;

use App\Models\ClassCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClassSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Fetch class category IDs
        $categories = ClassCategory::pluck('id', 'name');

        $classes = [
            ['name' => 'Pre Nursery', 'class_category_id' => $categories['Kindergarten']],
            ['name' => 'Nursery', 'class_category_id' => $categories['Kindergarten']],
            ['name' => 'LKG', 'class_category_id' => $categories['Kindergarten']],
            ['name' => 'UKG', 'class_category_id' => $categories['Kindergarten']],
            ['name' => 'Class 1', 'class_category_id' => $categories['Junior']],
            ['name' => 'Class 2', 'class_category_id' => $categories['Junior']],
            ['name' => 'Class 3', 'class_category_id' => $categories['Junior']],
            ['name' => 'Class 4', 'class_category_id' => $categories['Junior']],
            ['name' => 'Class 5', 'class_category_id' => $categories['Junior']],
            ['name' => 'Class 6', 'class_category_id' => $categories['Primary']],
            ['name' => 'Class 7', 'class_category_id' => $categories['Primary']],
            ['name' => 'Class 8', 'class_category_id' => $categories['Primary']],
            ['name' => 'Class 9', 'class_category_id' => $categories['Secondary']],
            ['name' => 'Class 10', 'class_category_id' => $categories['Secondary']],
            ['name' => 'Class 11 Science', 'class_category_id' => $categories['Senior Secondary']],
            ['name' => 'Class 11 Arts', 'class_category_id' => $categories['Senior Secondary']],
            ['name' => 'Class 11 Commerce', 'class_category_id' => $categories['Senior Secondary']],
            ['name' => 'Class 12 Science', 'class_category_id' => $categories['Senior Secondary']],
            ['name' => 'Class 12 Arts', 'class_category_id' => $categories['Senior Secondary']],
            ['name' => 'Class 12 Commerce', 'class_category_id' => $categories['Senior Secondary']],
        ];

        DB::table('classes')->insert($classes);
    }
}
