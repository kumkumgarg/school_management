<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;

class PermissionsController extends Controller
{
    public function getPermissionList()
    {
        try{
            $permissions = Permission::orderBy('id', 'ASC')->pluck('name');

            $data = [];
            
            foreach ($permissions as $permission) {
                $data[$permission] = false;
            }
            return response($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
