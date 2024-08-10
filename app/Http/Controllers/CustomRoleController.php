<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Permission;

class CustomRoleController extends Controller
{
    public function index(Request $request, $id = null)
    {
        try {
            // Get all permissions list
            $permissionList = Permission::orderBy('id', 'ASC')->pluck('name');

            // If id is there then return particular role data else return role list
            if ($id !== null) {
                $role = Role::findOrFail($id);

                // Get all permissions related to role
                $permissions = $role->permissions()->pluck('name')->toArray();
                $permissionArray = [];

                // Set permission value to true and false on basis or permissions
                // assigned to particular role
                foreach ($permissionList as $permission) {
                    if(in_array($permission, $permissions)){
                        $permissionArray[$permission] = true;
                    } else {
                        $permissionArray[$permission] = false;
                    }
                }

                // return role name with permission array
                return [
                    'role' => $role->name,
                    'permissions' => $permissionArray,
                ];
            } else {
                $roles = Role::paginate(10, ['id', 'name']);

                // Modify role names to remove user_id part
                $modifiedRoles = $roles->map(function ($role) {
                    $role->name = preg_replace('/.*_/', '', $role->name);

                    return $role->only(['id', 'name']);
                });

                $roles->setCollection($modifiedRoles);

                return response()->json($roles);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function create(Request $request)
    {
        try {
            $name = $request->input('name');

            $role = Role::create(['name' => $name]);

            // Get or create permissions and assign them to the role
            foreach ($request->permissions as $permissionName => $permissionValue) {
                if ($permissionValue === true) {
                    $permission = Permission::where('name', $permissionName)->first();
                    if ($permission) {
                        $role->givePermissionTo($permission);
                    }
                }
            }
            return $role;
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $roleId)
    {
        try{
            $name = $request->input('name');

            $role = Role::findOrFail($roleId);

            // Update role name if provided in the request
            if ($request->has('name')) {
                $role->name = $name;
                $role->save();
            }

            if ($request->has('permissions')) {
                $permissions = $request->input('permissions');

                foreach ($permissions as $permissionName => $permissionValue) {
                    if ($permissionValue === true) {
                        $permission = Permission::where('name', $permissionName)->first();
                        if ($permission) {
                            $role->givePermissionTo($permission);
                        }
                    } else {
                        // If permission value is false, you might want to revoke the permission
                        $permission = Permission::where('name', $permissionName)->first();
                        if ($permission) {
                            $role->revokePermissionTo($permission);
                        }
                    }
                }
            }
            // Return the updated role
            return $role;
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function roleDelete(Request $request, $id)
    {
        $role = Role::where("id", $id)->first();


        $user = User::where("role", $role->name)->get();

        if($user->isEmpty()){
            $role->delete();
            return response()->json(['message'=>'Role Deleted Successfully'], 200);
        } else{
            return response()->json("Can't delete. Role is already assigned to staff!", 500);
        }
    }

    // this function is not working
    public function isPermissionAllowed(Request $request)
    {
        // Get Role name of current user
        $user = Auth::user();
        $role = $user->hasAnyRole(Role::all()) ?  strtolower($user->getRoleNames()[0]) : null;
        $is_permitted = \in_array($role, ["super_admin", "admin"])  ? true : $user->hasPermission($request->get('name'));
        return response()->json([
            "permission" => $is_permitted,
        ]);
    }
}
