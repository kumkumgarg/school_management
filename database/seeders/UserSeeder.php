<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\StaffMeta;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Principal account add
        $principal = User::create([
            'uuid'       => random_strings("User", 22),
            'role'       => 'principal',
            'email'      => "param@jeet.com",
            'phone'      => "9900099000",
            'password'   => Hash::make("super_secret"),
        ]);

        if (!$principal->exists) {
            throw new Exception("Failed to create the principal user.");
        }

        StaffMeta::create([
            'user_id'    => $principal->id,
            'first_name' => "Paramjeet",
            'last_name'  => "Singh",
        ]);

        $principalRole = Role::where("name", "principal")->first();

        if (!$principalRole) {
            throw new Exception("Role 'principal' does not exist.");
        }

        $principal->roles()->detach();
        $principal->assignRole($principalRole);
    }

}
