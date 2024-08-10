<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Permission\Models\Permission;

class AddPermission extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'permissions:add';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add permissions to the permissions table';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
        $permissions = [
            'analytics',
            'teach_student',
            'create_student',
            'edit_student',
            'view_student',
            'delete_student',
            'create_staff',
            'edit_staff',
            'view_staff',
            'delete_staff'
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
            $this->info("Permission added: $permission");
        }

        $this->info('Permissions added successfully!');
    }
}
